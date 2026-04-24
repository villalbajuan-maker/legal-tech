import { createHash } from "node:crypto";
import { cpnuSourceConnector, manualSourceConnector } from "@legal-search/connectors";
import type { CaseSourceInput, FetchStatus, SourceFetchResult } from "@legal-search/core";
import { createClient } from "@supabase/supabase-js";

type DatabaseCaseSourceRow = {
  id: string;
  case_id: string;
  source_id: string;
  status: string;
  external_reference: string | null;
  metadata: Record<string, unknown> | null;
  legal_case: {
    id: string;
    organization_id: string;
    radicado: string;
    normalized_radicado: string;
    internal_owner: string | null;
    priority: "low" | "normal" | "high" | "critical";
  } | null;
  source: {
    id: string;
    name: string;
  } | null;
};

const connectors = [cpnuSourceConnector, manualSourceConnector];
const batchSize = Number(process.env.CRAWLER_BATCH_SIZE || "10");

type PersistedMovementRow = {
  id: string;
  normalized_hash: string;
  title: string;
  description: string | null;
  movement_type: string | null;
  movement_date: string | null;
  metadata: Record<string, unknown> | null;
};

type PendingLegalEvent = {
  case_id: string;
  source_id: string;
  movement_id: string;
  event_type: "audiencia" | "termino" | "vencimiento" | "actuacion" | "otro";
  event_date: string;
  end_date: string | null;
  title: string;
  description: string | null;
  confidence: number;
  status: "active";
  change_status: "new" | "unchanged";
};

type MovementOutcome = {
  newMovementsCount: number;
  eventCount: number;
  bootstrapMode: boolean;
  operationalStatus: string;
  newEventIds: string[];
};

const EVENT_ELIGIBLE_MOVEMENT_TYPES = ["Audiencia", "Traslado", "Sentencia / fallo", "Medida cautelar"];

function getSupabaseEnv() {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    return null;
  }

  return { url, serviceRoleKey };
}

function mapToInput(row: DatabaseCaseSourceRow): CaseSourceInput | null {
  const legalCase = row.legal_case;
  const source = row.source;
  if (!legalCase || !source) return null;

  return {
    caseSourceId: row.id,
    caseId: row.case_id,
    sourceId: row.source_id,
    sourceName: source.name,
    radicado: legalCase.radicado,
    normalizedRadicado: legalCase.normalized_radicado,
    externalReference: row.external_reference,
    metadata: {
      ...(row.metadata || {}),
      organization_id: legalCase.organization_id,
      internal_owner: legalCase.internal_owner,
      case_priority: legalCase.priority,
      previous_case_source_status: row.status,
    },
  };
}

function nextCaseSourceStatus(status: FetchStatus) {
  if (status === "success") return "active";
  if (status === "not_found") return "not_found";
  if (status === "blocked") return "blocked";
  return "error";
}

function buildRawHash(rawPayload: unknown) {
  if (rawPayload === undefined) return null;
  return createHash("sha256").update(JSON.stringify(rawPayload)).digest("hex");
}

function normalizeText(value?: string | null) {
  return (value || "")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim();
}

function toEventTimestamp(value: string | null) {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (trimmed.includes("T")) return trimmed;
  return `${trimmed}T00:00:00.000Z`;
}

function getLatestMovementSummary(result: SourceFetchResult) {
  const movements = [...(result.movements || [])];
  if (movements.length === 0) return null;

  movements.sort((left, right) => {
    const leftDate = left.movementDate || "";
    const rightDate = right.movementDate || "";
    return rightDate.localeCompare(leftDate);
  });

  const latest = movements[0];
  return {
    movement_date: latest.movementDate || null,
    title: latest.title,
    description: latest.description || null,
    movement_type: latest.movementType || null,
  };
}

function shouldRequireReview(movement: PersistedMovementRow) {
  const combined = normalizeText(`${movement.title} ${movement.description || ""}`);
  const type = normalizeText(movement.movement_type);

  return (
    type === "audiencia" ||
    type === "sentencia / fallo" ||
    type === "medida cautelar" ||
    combined.includes("reprogram") ||
    combined.includes("fija fecha") ||
    combined.includes("medida cautelar")
  );
}

function inferEventPayload(input: CaseSourceInput, movement: PersistedMovementRow) {
  const type = normalizeText(movement.movement_type);
  const metadata = movement.metadata || {};
  const fechaInicial =
    typeof metadata.fechaInicial === "string" && metadata.fechaInicial.trim() ? metadata.fechaInicial.trim() : null;
  const fechaFinal =
    typeof metadata.fechaFinal === "string" && metadata.fechaFinal.trim() ? metadata.fechaFinal.trim() : null;

  let eventType: "audiencia" | "termino" | "vencimiento" | "actuacion" | "otro" = "actuacion";
  let eventDate = movement.movement_date;

  if (type === "audiencia") {
    eventType = "audiencia";
    eventDate = fechaInicial || movement.movement_date;
  } else if (type === "traslado") {
    eventType = fechaFinal ? "vencimiento" : "termino";
    eventDate = fechaFinal || movement.movement_date;
  } else if (type === "sentencia / fallo" || type === "medida cautelar") {
    eventType = "actuacion";
  }

  if (!eventDate) {
    return null;
  }

  const normalizedEventDate = toEventTimestamp(eventDate);
  if (!normalizedEventDate) {
    return null;
  }

  return {
    case_id: input.caseId,
    source_id: input.sourceId,
    movement_id: movement.id,
    event_type: eventType,
    event_date: normalizedEventDate,
    end_date: eventType === "audiencia" ? toEventTimestamp(fechaFinal) : null,
    title: movement.title,
    description: movement.description,
    confidence: eventType === "actuacion" ? 0.8 : 0.95,
    status: "active" as const,
    change_status: "new" as const,
  };
}

async function loadLatestSuccessfulSnapshot(
  supabase: ReturnType<typeof createClient<any>>,
  caseSourceId: string,
) {
  const { data, error } = await supabase
    .from("source_snapshots")
    .select("id, fetched_at")
    .eq("case_source_id", caseSourceId)
    .eq("fetch_status", "success")
    .order("fetched_at", { ascending: false })
    .limit(1)
    .maybeSingle<{ id: string; fetched_at: string }>();

  if (error) {
    throw error;
  }

  return data;
}

async function hasMovementHistory(
  supabase: ReturnType<typeof createClient<any>>,
  input: CaseSourceInput,
) {
  const { count, error } = await supabase
    .from("case_movements")
    .select("id", { count: "exact", head: true })
    .eq("case_id", input.caseId)
    .eq("source_id", input.sourceId);

  if (error) {
    throw error;
  }

  return (count || 0) > 0;
}

async function persistMovementsAndEvents(
  supabase: ReturnType<typeof createClient<any>>,
  input: CaseSourceInput,
  snapshotId: string,
  result: SourceFetchResult,
  hasPreviousSuccessfulSnapshot: boolean,
) : Promise<MovementOutcome> {
  const uniqueMovements = Object.values(
    Object.fromEntries((result.movements || []).map((movement) => [movement.normalizedHash, movement])),
  );

  if (uniqueMovements.length === 0) {
    return {
      newMovementsCount: 0,
      eventCount: 0,
      bootstrapMode: false,
      operationalStatus: hasPreviousSuccessfulSnapshot ? "sin_cambios" : "sin_cambios",
      newEventIds: [],
    };
  }

  const bootstrapMode = !(await hasMovementHistory(supabase, input));

  const { data: existingRows, error: existingError } = await supabase
    .from("case_movements")
    .select("normalized_hash")
    .eq("case_id", input.caseId)
    .eq("source_id", input.sourceId)
    .in(
      "normalized_hash",
      uniqueMovements.map((movement) => movement.normalizedHash),
    );

  if (existingError) {
    throw existingError;
  }

  const existingHashes = new Set(((existingRows as Array<{ normalized_hash: string }> | null) || []).map((row) => row.normalized_hash));
  const newMovements = uniqueMovements.filter((movement) => !existingHashes.has(movement.normalizedHash));

  let insertedMovements: PersistedMovementRow[] = [];

  if (newMovements.length > 0) {
    const { data, error } = await supabase
      .from("case_movements")
      .insert(
        newMovements.map((movement) => ({
          case_id: input.caseId,
          source_id: input.sourceId,
          snapshot_id: snapshotId,
          external_id: movement.externalId || null,
          movement_date: movement.movementDate || null,
          title: movement.title,
          description: movement.description || null,
          movement_type: movement.movementType || null,
          normalized_hash: movement.normalizedHash,
          metadata: movement.metadata || {},
        })),
      )
      .select("id, normalized_hash, title, description, movement_type, movement_date, metadata");

    if (error) {
      throw error;
    }

    insertedMovements = (data as PersistedMovementRow[] | null) || [];
  }

  let eventCount = 0;
  let newEventIds: string[] = [];

  if (insertedMovements.length > 0) {
    const eventRows: PendingLegalEvent[] = insertedMovements
      .map((movement): PendingLegalEvent | null => {
        const event = inferEventPayload(input, movement);
        if (!event) return null;

        return {
          ...event,
          change_status: bootstrapMode || !hasPreviousSuccessfulSnapshot ? "unchanged" : "new",
        };
      })
      .filter((event): event is PendingLegalEvent => Boolean(event));

    if (eventRows.length > 0) {
      const movementIds = eventRows.map((event) => event.movement_id);
      const eventTypes = [...new Set(eventRows.map((event) => event.event_type))];
      const { data: existingEvents, error: existingEventsError } = await supabase
        .from("legal_events")
        .select("movement_id, event_type")
        .in("movement_id", movementIds)
        .in("event_type", eventTypes);

      if (existingEventsError) {
        throw existingEventsError;
      }

      const existingKeys = new Set(
        ((existingEvents as Array<{ movement_id: string | null; event_type: string }> | null) || [])
          .filter((event) => event.movement_id)
          .map((event) => `${event.movement_id}:${event.event_type}`),
      );

      const newEventRows = eventRows.filter(
        (event) => !existingKeys.has(`${event.movement_id}:${event.event_type}`),
      );

      if (newEventRows.length > 0) {
        const { data, error } = await supabase
          .from("legal_events")
          .insert(newEventRows)
          .select("id");

        if (error) {
          throw error;
        }

        eventCount = data?.length || 0;
        newEventIds = data?.map((row) => row.id) || [];
      }
    }
  }

  const requiresReview = insertedMovements.some((movement) => shouldRequireReview(movement));
  const operationalStatus =
    newMovements.length === 0
      ? "sin_cambios"
      : bootstrapMode || !hasPreviousSuccessfulSnapshot
        ? "sin_cambios"
        : requiresReview
          ? "requiere_revision"
          : "con_novedad";

  return {
    newMovementsCount: newMovements.length,
    eventCount,
    bootstrapMode,
    operationalStatus,
    newEventIds,
  };
}

async function backfillBaselineEvents(
  supabase: ReturnType<typeof createClient<any>>,
  input: CaseSourceInput,
) {
  const { data: movements, error: movementsError } = await supabase
    .from("case_movements")
    .select("id, normalized_hash, title, description, movement_type, movement_date, metadata")
    .eq("case_id", input.caseId)
    .eq("source_id", input.sourceId)
    .in("movement_type", EVENT_ELIGIBLE_MOVEMENT_TYPES);

  if (movementsError) {
    throw movementsError;
  }

  const typedMovements = (movements as PersistedMovementRow[] | null) || [];

  if (typedMovements.length === 0) {
    return 0;
  }

  const movementIds = typedMovements.map((movement) => movement.id);
  const { data: existingEvents, error: existingEventsError } = await supabase
    .from("legal_events")
    .select("movement_id, event_type")
    .in("movement_id", movementIds);

  if (existingEventsError) {
    throw existingEventsError;
  }

  const existingKeys = new Set(
    ((existingEvents as Array<{ movement_id: string | null; event_type: string }> | null) || [])
      .filter((event) => event.movement_id)
      .map((event) => `${event.movement_id}:${event.event_type}`),
  );

  const backfillRows: PendingLegalEvent[] = typedMovements
    .map((movement): PendingLegalEvent | null => {
      const event = inferEventPayload(input, movement);
      if (!event) return null;
      if (existingKeys.has(`${movement.id}:${event.event_type}`)) return null;

      return {
        ...event,
        change_status: "unchanged" as const,
      };
    })
    .filter((event): event is PendingLegalEvent => Boolean(event));

  if (backfillRows.length === 0) {
    return 0;
  }

  const { data, error } = await supabase.from("legal_events").insert(backfillRows).select("id");

  if (error) {
    throw error;
  }

  return data?.length || 0;
}

async function createAlertIfMissing(
  supabase: ReturnType<typeof createClient<any>>,
  payload: {
    organizationId: string;
    caseId: string;
    legalEventId?: string | null;
    alertType: "new_event" | "event_changed" | "event_upcoming" | "source_error" | "manual_review";
    severity: "low" | "medium" | "high" | "critical";
    title: string;
    message: string;
    dueAt?: string | null;
  },
) {
  const { data: existingAlert, error: existingError } = await supabase
    .from("alerts")
    .select("id")
    .eq("organization_id", payload.organizationId)
    .eq("case_id", payload.caseId)
    .eq("alert_type", payload.alertType)
    .eq("title", payload.title)
    .eq("message", payload.message)
    .in("status", ["pending", "sent"])
    .limit(1)
    .maybeSingle();

  if (existingError) {
    throw existingError;
  }

  if (existingAlert) {
    return false;
  }

  const { error } = await supabase.from("alerts").insert({
    organization_id: payload.organizationId,
    case_id: payload.caseId,
    legal_event_id: payload.legalEventId || null,
    alert_type: payload.alertType,
    severity: payload.severity,
    title: payload.title,
    message: payload.message,
    status: "pending",
    due_at: payload.dueAt || null,
  });

  if (error) {
    throw error;
  }

  return true;
}

async function createOperationalAlerts(
  supabase: ReturnType<typeof createClient<any>>,
  input: CaseSourceInput,
  result: SourceFetchResult,
  movementOutcome: MovementOutcome,
  latestSummary: ReturnType<typeof getLatestMovementSummary>,
  nextStatus: string,
) {
  const metadata = input.metadata || {};
  const organizationId =
    typeof metadata.organization_id === "string" && metadata.organization_id.trim()
      ? metadata.organization_id
      : null;

  if (!organizationId) {
    return;
  }

  const previousStatus =
    typeof metadata.previous_case_source_status === "string" ? metadata.previous_case_source_status : null;

  if (result.status !== "success") {
    if (previousStatus === nextStatus) {
      return;
    }

    const title =
      result.status === "blocked"
        ? "Fuente bloqueada durante la consulta"
        : result.status === "not_found"
          ? "Proceso no encontrado en la fuente"
          : "Error de fuente en la consulta";

    const severity =
      result.status === "blocked"
        ? "critical"
        : result.status === "error"
          ? "high"
          : "medium";

    const message =
      result.status === "blocked"
        ? `${input.radicado} no pudo consultarse en ${input.sourceName} porque la fuente respondió con bloqueo.`
        : result.status === "not_found"
          ? `${input.radicado} no arrojó resultados en ${input.sourceName}.`
          : `${input.radicado} presentó un error de fuente en ${input.sourceName}.`;

    await createAlertIfMissing(supabase, {
      organizationId,
      caseId: input.caseId,
      alertType: "source_error",
      severity,
      title,
      message,
    });
    return;
  }

  if (movementOutcome.bootstrapMode || movementOutcome.newMovementsCount === 0) {
    return;
  }

  const latestTitle = latestSummary?.title || "Nueva actuación detectada";
  const latestDate = latestSummary?.movement_date || result.fetchedAt;
  const firstNewEventId = movementOutcome.newEventIds[0] || null;

  if (movementOutcome.operationalStatus === "requiere_revision") {
    await createAlertIfMissing(supabase, {
      organizationId,
      caseId: input.caseId,
      legalEventId: firstNewEventId,
      alertType: "manual_review",
      severity: "high",
      title: "Proceso requiere revisión",
      message: `${input.radicado} requiere revisión por una actuación relevante: ${latestTitle}.`,
      dueAt: toEventTimestamp(latestDate),
    });
    return;
  }

  await createAlertIfMissing(supabase, {
    organizationId,
    caseId: input.caseId,
    legalEventId: firstNewEventId,
    alertType: "new_event",
    severity: "medium",
    title: "Nueva actuación detectada",
    message: `${input.radicado} registró una nueva actuación: ${latestTitle}.`,
    dueAt: toEventTimestamp(latestDate),
  });
}

async function loadPendingCaseSources() {
  const env = getSupabaseEnv();
  if (!env) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY for crawler.");
  }

  const supabase = createClient(env.url, env.serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  }) as ReturnType<typeof createClient<any>>;

  const { data, error } = await supabase
    .from("case_sources")
    .select(
      `
        id,
        case_id,
        source_id,
        status,
        external_reference,
        metadata,
        legal_case:cases!inner(
          id,
          organization_id,
          radicado,
          normalized_radicado,
          internal_owner,
          priority
        ),
        source:sources!inner(
          id,
          name
        )
      `,
    )
    .in("status", ["pending", "active", "error", "blocked", "not_found"])
    .order("last_checked_at", { ascending: true, nullsFirst: true })
    .limit(batchSize);

  if (error) {
    throw error;
  }

  return {
    supabase,
    rows: ((data as unknown) as DatabaseCaseSourceRow[]) ?? [],
  };
}

async function persistSnapshot(
  supabase: ReturnType<typeof createClient<any>>,
  input: CaseSourceInput,
  result: SourceFetchResult,
) {
  const previousSuccessfulSnapshot = await loadLatestSuccessfulSnapshot(supabase, input.caseSourceId);
  const { data: snapshot, error: snapshotError } = await supabase
    .from("source_snapshots")
    .insert({
      case_source_id: input.caseSourceId,
      fetched_at: result.fetchedAt,
      fetch_status: result.status,
      raw_hash: buildRawHash(result.rawPayload),
      raw_payload: result.rawPayload ?? null,
      error_message: result.errorMessage ?? null,
      duration_ms: result.durationMs ?? null,
    })
    .select("id")
    .single<{ id: string }>();

  if (snapshotError) {
    throw snapshotError;
  }

  let movementOutcome: MovementOutcome = {
    newMovementsCount: 0,
    eventCount: 0,
    bootstrapMode: false,
    operationalStatus:
      result.status === "success"
        ? "sin_cambios"
        : result.status === "not_found"
          ? "no_consultado"
          : "error_fuente",
    newEventIds: [],
  };

  if (result.status === "success") {
    movementOutcome = await persistMovementsAndEvents(
      supabase,
      input,
      snapshot.id,
      result,
      Boolean(previousSuccessfulSnapshot),
    );

    if (movementOutcome.eventCount === 0) {
      const backfilledCount = await backfillBaselineEvents(supabase, input);
      if (backfilledCount > 0) {
        movementOutcome = {
          ...movementOutcome,
          eventCount: backfilledCount,
        };
      }
    }
  }

  const nextStatus = nextCaseSourceStatus(result.status);
  const latestSummary = getLatestMovementSummary(result);
  const updatePayload: Record<string, unknown> = {
    last_checked_at: result.fetchedAt,
    status: nextStatus,
    metadata: {
      ...(input.metadata || {}),
      case_source_status: nextStatus,
      latest_fetch: result.metadata || null,
      latest_summary: latestSummary,
      operational_status: movementOutcome.operationalStatus,
      new_movements_count: movementOutcome.newMovementsCount,
      legal_events_count: movementOutcome.eventCount,
      bootstrap_mode: movementOutcome.bootstrapMode,
      latest_snapshot_id: snapshot.id,
    },
  };

  if (result.status === "success") {
    updatePayload.last_success_at = result.fetchedAt;
  } else {
    updatePayload.last_error_at = result.fetchedAt;
  }

  const { error: updateError } = await supabase
    .from("case_sources")
    .update(updatePayload as never)
    .eq("id", input.caseSourceId);

  if (updateError) {
    throw updateError;
  }

  await createOperationalAlerts(supabase, input, result, movementOutcome, latestSummary, nextStatus);

  return {
    snapshotId: snapshot.id as string,
    movementOutcome,
  };
}

async function recalculateOrganizationsTouched(
  supabase: ReturnType<typeof createClient<any>>,
  organizationIds: string[],
) {
  const uniqueOrganizationIds = [...new Set(organizationIds.filter(Boolean))];

  if (uniqueOrganizationIds.length === 0) {
    return [];
  }

  const summaries: Array<Record<string, unknown>> = [];

  for (const organizationId of uniqueOrganizationIds) {
    const { data, error } = await supabase
      .rpc("recalculate_organization_case_derived_fields", {
        target_organization_id: organizationId,
      })
      .single<{
        updated_count: number;
        default_assigned_count: number;
        elevated_attention_count: number;
      }>();

    if (error) {
      throw error;
    }

    summaries.push({
      organizationId,
      updatedCount: data.updated_count,
      defaultAssignedCount: data.default_assigned_count,
      elevatedAttentionCount: data.elevated_attention_count,
    });
  }

  return summaries;
}

async function processBatch() {
  const { supabase, rows } = await loadPendingCaseSources();

  if (rows.length === 0) {
    console.log(JSON.stringify({ status: "idle", message: "No pending case_sources found." }, null, 2));
    return;
  }

  const results: Array<Record<string, unknown>> = [];
  const touchedOrganizationIds: string[] = [];

  for (const row of rows) {
    const input = mapToInput(row);

    if (!input) {
      results.push({
        caseSourceId: row.id,
        status: "skipped",
        reason: "Missing case or source relation",
      });
      continue;
    }

    const connector = connectors.find((candidate) => candidate.canHandle(input));

    if (!connector) {
      results.push({
        caseSourceId: row.id,
        status: "skipped",
        reason: `No connector for source ${input.sourceName}`,
      });
      continue;
    }

    const fetchResult = await connector.fetchCase(input);
    const persistResult = await persistSnapshot(supabase, input, fetchResult);
    const organizationId =
      typeof input.metadata?.organization_id === "string" ? input.metadata.organization_id : null;

    if (organizationId) {
      touchedOrganizationIds.push(organizationId);
    }

    results.push({
      caseSourceId: row.id,
      radicado: input.normalizedRadicado,
      source: input.sourceName,
      fetchStatus: fetchResult.status,
      snapshotId: persistResult.snapshotId,
      movements: fetchResult.movements?.length || 0,
      newMovements: persistResult.movementOutcome.newMovementsCount,
      legalEvents: persistResult.movementOutcome.eventCount,
      operationalStatus: persistResult.movementOutcome.operationalStatus,
      bootstrapMode: persistResult.movementOutcome.bootstrapMode,
      durationMs: fetchResult.durationMs || null,
    });
  }

  const recalculationSummaries = await recalculateOrganizationsTouched(supabase, touchedOrganizationIds);

  console.log(
    JSON.stringify(
      { status: "ok", processed: results.length, recalculations: recalculationSummaries, results },
      null,
      2,
    ),
  );
}

async function runSample() {
  const sampleInput: CaseSourceInput = {
    caseSourceId: "local-sample",
    caseId: "local-case",
    sourceId: "cpnu-source",
    sourceName: "CPNU",
    radicado: process.env.CRAWLER_SAMPLE_RADICADO || "11001400303520230010700",
    normalizedRadicado: process.env.CRAWLER_SAMPLE_RADICADO || "11001400303520230010700",
  };

  const connector = connectors.find((candidate) => candidate.canHandle(sampleInput));

  if (!connector) {
    throw new Error(`No connector found for source ${sampleInput.sourceName}`);
  }

  const result = await connector.fetchCase(sampleInput);
  console.log(JSON.stringify({ connector: connector.sourceName, result }, null, 2));
}

async function main() {
  const env = getSupabaseEnv();

  if (!env) {
    await runSample();
    return;
  }

  await processBatch();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
