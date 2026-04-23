import { cpnuSourceConnector, manualSourceConnector } from "@legal-search/connectors";
import type { CaseSourceInput, FetchStatus, SourceFetchResult } from "@legal-search/core";
import { createClient } from "@supabase/supabase-js";

type DatabaseCaseSourceRow = {
  id: string;
  case_id: string;
  source_id: string;
  external_reference: string | null;
  metadata: Record<string, unknown> | null;
  legal_case: {
    id: string;
    radicado: string;
    normalized_radicado: string;
  } | null;
  source: {
    id: string;
    name: string;
  } | null;
};

const connectors = [cpnuSourceConnector, manualSourceConnector];
const batchSize = Number(process.env.CRAWLER_BATCH_SIZE || "10");

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
    metadata: row.metadata || {},
  };
}

function nextCaseSourceStatus(status: FetchStatus) {
  if (status === "success") return "active";
  if (status === "not_found") return "not_found";
  if (status === "blocked") return "blocked";
  return "error";
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
        external_reference,
        metadata,
        legal_case:cases!inner(
          id,
          radicado,
          normalized_radicado
        ),
        source:sources!inner(
          id,
          name
        )
      `,
    )
    .in("status", ["pending", "active", "error"])
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
  const { data: snapshot, error: snapshotError } = await supabase
    .from("source_snapshots")
    .insert({
      case_source_id: input.caseSourceId,
      fetched_at: result.fetchedAt,
      fetch_status: result.status,
      raw_payload: result.rawPayload ?? null,
      error_message: result.errorMessage ?? null,
      duration_ms: result.durationMs ?? null,
    })
    .select("id")
    .single<{ id: string }>();

  if (snapshotError) {
    throw snapshotError;
  }

  const nextStatus = nextCaseSourceStatus(result.status);
  const updatePayload: Record<string, unknown> = {
    last_checked_at: result.fetchedAt,
    status: nextStatus,
    metadata: {
      ...(input.metadata || {}),
      latest_fetch: result.metadata || null,
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

  return snapshot.id as string;
}

async function processBatch() {
  const { supabase, rows } = await loadPendingCaseSources();

  if (rows.length === 0) {
    console.log(JSON.stringify({ status: "idle", message: "No pending case_sources found." }, null, 2));
    return;
  }

  const results: Array<Record<string, unknown>> = [];

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
    const snapshotId = await persistSnapshot(supabase, input, fetchResult);

    results.push({
      caseSourceId: row.id,
      radicado: input.normalizedRadicado,
      source: input.sourceName,
      fetchStatus: fetchResult.status,
      snapshotId,
      movements: fetchResult.movements?.length || 0,
      durationMs: fetchResult.durationMs || null,
    });
  }

  console.log(JSON.stringify({ status: "ok", processed: results.length, results }, null, 2));
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
