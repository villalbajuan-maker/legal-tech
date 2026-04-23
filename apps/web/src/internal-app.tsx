import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import type { Session } from "@supabase/supabase-js";
import { isLikelyRadicado, normalizeRadicado } from "../../../packages/core/src";
import logoUrl from "./assets/lexcontrol-logo.png";
import { isSupabaseConfigured, supabase } from "./supabase";

type OrganizationRecord = {
  id: string;
  name: string;
  account_status: "demo_active" | "demo_expired" | "suspended" | "converted" | "closed";
  trial_started_at: string | null;
  trial_ends_at: string | null;
  process_limit: number;
  member_limit: number;
};

type MembershipRecord = {
  id: string;
  organization_id: string;
  role: "platform_admin" | "account_admin" | "operator";
  status: "active" | "invited" | "disabled";
  organization: OrganizationRecord | null;
};

type TeamMemberRecord = {
  id: string;
  user_id: string;
  role: "platform_admin" | "account_admin" | "operator";
  status: "active" | "invited" | "disabled";
  created_at: string;
  email: string | null;
  full_name: string | null;
};

type AuthFormState = {
  email: string;
  password: string;
};

type InternalCaseRow = {
  id: string;
  radicado: string;
  normalized_radicado: string;
  internal_owner: string | null;
  priority: "low" | "normal" | "high" | "critical";
  status: "active" | "paused" | "closed";
  created_at: string;
};

type InternalCaseSourceRow = {
  id: string;
  case_id: string;
  status: "pending" | "active" | "paused" | "error" | "blocked" | "not_found";
  last_checked_at: string | null;
  last_success_at: string | null;
  last_error_at: string | null;
  metadata: Record<string, unknown> | null;
  source: Array<{
    id: string;
    name: string;
  }> | null;
};

type InternalLegalEventRow = {
  id: string;
  case_id: string;
  event_type: "audiencia" | "termino" | "vencimiento" | "actuacion" | "otro";
  event_date: string;
  title: string;
  description: string | null;
  change_status: "new" | "unchanged" | "changed" | "cancelled";
  status: "active" | "cancelled" | "completed" | "superseded";
};

type InternalSnapshotRow = {
  id: string;
  case_source_id: string;
  fetched_at: string;
  fetch_status: "success" | "error" | "blocked" | "not_found";
  error_message: string | null;
  duration_ms: number | null;
};

type InternalAlertRow = {
  id: string;
  case_id: string;
  alert_type: "new_event" | "event_changed" | "event_upcoming" | "source_error" | "manual_review";
  severity: "low" | "medium" | "high" | "critical";
  title: string;
  message: string;
  status: "pending" | "sent" | "acknowledged" | "dismissed" | "failed";
  due_at: string | null;
  created_at: string;
};

type OperationalCaseRow = {
  caseId: string;
  radicado: string;
  responsible: string | null;
  priority: InternalCaseRow["priority"];
  caseStatus: InternalCaseRow["status"];
  sourceStatus: InternalCaseSourceRow["status"] | "pending";
  sourceName: string;
  operationalStatus: string;
  latestActionTitle: string | null;
  latestActionDescription: string | null;
  latestActionDate: string | null;
  latestEventTitle: string | null;
  latestEventDate: string | null;
  latestEventType: InternalLegalEventRow["event_type"] | null;
  newMovementsCount: number;
  legalEventsCount: number;
  bootstrapMode: boolean;
  lastCheckedAt: string | null;
};

type CaseIntakeResponse = {
  inserted_count: number;
  duplicate_count: number;
  invalid_count: number;
  inserted_radicados: string[] | null;
  duplicate_radicados: string[] | null;
  invalid_radicados: string[] | null;
};

type TeamMembersResponse = {
  team: TeamMemberRecord[];
  activeCount: number;
  limit: number;
};

type AppView = "inicio" | "bandeja" | "procesos" | "equipo" | "consultas";

function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as { message?: unknown }).message === "string"
  ) {
    return (error as { message: string }).message;
  }

  return fallback;
}

async function fetchTeamMembers(accessToken: string) {
  const response = await fetch("/api/team-members", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const payload = (await response.json()) as TeamMembersResponse | { error?: string };

  if (!response.ok) {
    throw new Error(
      "error" in payload && typeof payload.error === "string"
        ? payload.error
        : "No fue posible cargar el equipo de la cuenta.",
    );
  }

  return payload as TeamMembersResponse;
}

async function createTeamMember(
  accessToken: string,
  input: { fullName: string; email: string; password: string },
) {
  const response = await fetch("/api/team-members", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(input),
  });

  const payload = (await response.json()) as
    | (TeamMembersResponse & { member?: TeamMemberRecord | null })
    | { error?: string };

  if (!response.ok) {
    throw new Error(
      "error" in payload && typeof payload.error === "string"
        ? payload.error
        : "No fue posible crear el responsable.",
    );
  }

  return payload as TeamMembersResponse & { member?: TeamMemberRecord | null };
}

const internalModules = [
  {
    name: "Procesos",
    status: "Activo",
    description: "Carga individual y masiva de radicados por cuenta.",
  },
  {
    name: "Bandeja",
    status: "Activo parcial",
    description: "Vista operativa autenticada sobre datos reales consultados.",
  },
  {
    name: "Consultas",
    status: "En construcción",
    description: "Ejecución manual y por lote con trazabilidad.",
  },
  {
    name: "Eventos",
    status: "Pendiente",
    description: "Novedades, cambios y revisión de actuaciones.",
  },
];

const internalNavItems: Array<{ view: AppView; label: string }> = [
  { view: "inicio", label: "Inicio" },
  { view: "bandeja", label: "Bandeja" },
  { view: "procesos", label: "Procesos" },
  { view: "equipo", label: "Equipo" },
  { view: "consultas", label: "Consultas" },
];

const internalViewMeta: Record<
  AppView,
  {
    eyebrow: string;
    title: string;
    description: string;
  }
> = {
  inicio: {
    eyebrow: "Vista general",
    title: "Inicio",
    description: "Estado de demo, capacidad disponible y salud operativa de la cuenta.",
  },
  bandeja: {
    eyebrow: "Operación diaria",
    title: "Bandeja",
    description: "Procesos consultados, errores visibles y decisiones pendientes.",
  },
  procesos: {
    eyebrow: "Inventario operativo",
    title: "Procesos",
    description: "Carga, administra y revisa el inventario vigilado por la cuenta.",
  },
  equipo: {
    eyebrow: "Equipo de trabajo",
    title: "Equipo",
    description: "Responsables reales de la cuenta y capacidad disponible para operar.",
  },
  consultas: {
    eyebrow: "Trazabilidad",
    title: "Consultas",
    description: "Estado de fuente, snapshots y alertas que sostienen la operación.",
  },
};

function getViewFromHash(hash: string): AppView {
  const cleaned = hash.replace(/^#\/?/, "").trim().toLowerCase();

  if (
    cleaned === "inicio" ||
    cleaned === "bandeja" ||
    cleaned === "procesos" ||
    cleaned === "equipo" ||
    cleaned === "consultas"
  ) {
    return cleaned;
  }

  return "inicio";
}

function buildViewHash(view: AppView) {
  return `#/${view}`;
}

async function loadPrimaryMembership(userId: string) {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("organization_memberships")
    .select(
      "id, organization_id, role, status, organization:organizations(id, name, account_status, trial_started_at, trial_ends_at, process_limit, member_limit)",
    )
    .eq("user_id", userId)
    .eq("status", "active")
    .limit(1)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return (data as MembershipRecord | null) ?? null;
}

async function loadOrganizationCases(organizationId: string) {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("cases")
    .select("id, radicado, normalized_radicado, internal_owner, priority, status, created_at")
    .eq("organization_id", organizationId)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    throw error;
  }

  return (data as InternalCaseRow[]) ?? [];
}

async function loadOrganizationCaseSources(caseIds: string[]) {
  if (!supabase || caseIds.length === 0) return [];

  const { data, error } = await supabase
    .from("case_sources")
    .select("id, case_id, status, last_checked_at, last_success_at, last_error_at, metadata, source:sources(id, name)")
    .in("case_id", caseIds);

  if (error) {
    throw error;
  }

  return (data as InternalCaseSourceRow[]) ?? [];
}

async function loadOrganizationLegalEvents(caseIds: string[]) {
  if (!supabase || caseIds.length === 0) return [];

  const { data, error } = await supabase
    .from("legal_events")
    .select("id, case_id, event_type, event_date, title, description, change_status, status")
    .in("case_id", caseIds)
    .eq("status", "active")
    .order("event_date", { ascending: true });

  if (error) {
    throw error;
  }

  return (data as InternalLegalEventRow[]) ?? [];
}

async function loadOrganizationSnapshots(caseSourceIds: string[]) {
  if (!supabase || caseSourceIds.length === 0) return [];

  const { data, error } = await supabase
    .from("source_snapshots")
    .select("id, case_source_id, fetched_at, fetch_status, error_message, duration_ms")
    .in("case_source_id", caseSourceIds)
    .order("fetched_at", { ascending: false })
    .limit(200);

  if (error) {
    throw error;
  }

  return (data as InternalSnapshotRow[]) ?? [];
}

async function loadOrganizationAlerts(caseIds: string[]) {
  if (!supabase || caseIds.length === 0) return [];

  const { data, error } = await supabase
    .from("alerts")
    .select("id, case_id, alert_type, severity, title, message, status, due_at, created_at")
    .in("case_id", caseIds)
    .order("created_at", { ascending: false })
    .limit(200);

  if (error) {
    throw error;
  }

  return (data as InternalAlertRow[]) ?? [];
}

function formatCaseTimestamp(value: string) {
  return new Intl.DateTimeFormat("es-CO", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "America/Bogota",
  }).format(new Date(value));
}

function getDemoStatusLabel(value: OrganizationRecord["account_status"] | undefined) {
  switch (value) {
    case "demo_active":
      return "Demo activa";
    case "demo_expired":
      return "Demo vencida";
    case "suspended":
      return "Suspendida";
    case "converted":
      return "Convertida";
    case "closed":
      return "Cerrada";
    default:
      return value ?? "Sin estado";
  }
}

function getDemoStatusTone(value: OrganizationRecord["account_status"] | undefined) {
  switch (value) {
    case "demo_active":
      return "info";
    case "demo_expired":
      return "warning";
    case "suspended":
      return "error";
    case "converted":
      return "ok";
    case "closed":
      return "neutral";
    default:
      return "neutral";
  }
}

function getDaysRemaining(value: string | null) {
  if (!value) return null;
  const today = new Date();
  const end = new Date(value);
  const diffMs = end.getTime() - today.getTime();
  return Math.max(Math.ceil(diffMs / (1000 * 60 * 60 * 24)), 0);
}

function formatShortDate(value: string | null) {
  if (!value) return "Sin fecha";

  return new Intl.DateTimeFormat("es-CO", {
    dateStyle: "medium",
    timeZone: "America/Bogota",
  }).format(new Date(value));
}

function formatDateTimeLabel(value: string | null) {
  if (!value) return "Sin fecha";
  return new Intl.DateTimeFormat("es-CO", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "America/Bogota",
  }).format(new Date(value));
}

function formatOperationalStatus(value: string) {
  switch (value) {
    case "con_novedad":
      return "Con novedad";
    case "sin_cambios":
      return "Sin cambios";
    case "no_consultado":
      return "No consultado";
    case "error_fuente":
      return "Error de fuente";
    case "requiere_revision":
      return "Requiere revisión";
    default:
      return value.replace(/_/g, " ");
  }
}

function getSourceStatusTone(value: OperationalCaseRow["sourceStatus"]) {
  switch (value) {
    case "active":
      return "ok";
    case "blocked":
    case "error":
      return "error";
    case "not_found":
      return "warning";
    case "pending":
    case "paused":
      return "neutral";
    default:
      return "neutral";
  }
}

function getSnapshotStatusTone(value: InternalSnapshotRow["fetch_status"]) {
  switch (value) {
    case "success":
      return "ok";
    case "error":
      return "error";
    case "blocked":
      return "review";
    case "not_found":
      return "warning";
    default:
      return "neutral";
  }
}

function getOperationalTone(value: string) {
  switch (value) {
    case "con_novedad":
      return "info";
    case "sin_cambios":
      return "ok";
    case "no_consultado":
      return "warning";
    case "error_fuente":
      return "error";
    case "requiere_revision":
      return "review";
    default:
      return "neutral";
  }
}

function formatAlertType(value: InternalAlertRow["alert_type"]) {
  switch (value) {
    case "new_event":
      return "Nueva actuación";
    case "event_changed":
      return "Evento cambiado";
    case "event_upcoming":
      return "Evento próximo";
    case "source_error":
      return "Error de fuente";
    case "manual_review":
      return "Revisión manual";
    default:
      return value;
  }
}

function getAlertTone(value: InternalAlertRow["severity"]) {
  switch (value) {
    case "critical":
      return "error";
    case "high":
      return "review";
    case "medium":
      return "warning";
    case "low":
      return "ok";
    default:
      return "neutral";
  }
}

function buildOperationalRows(
  cases: InternalCaseRow[],
  caseSources: InternalCaseSourceRow[],
  legalEvents: InternalLegalEventRow[],
) {
  const sourceByCaseId = new Map<string, InternalCaseSourceRow[]>();
  const eventsByCaseId = new Map<string, InternalLegalEventRow[]>();

  caseSources.forEach((caseSource) => {
    const current = sourceByCaseId.get(caseSource.case_id) || [];
    current.push(caseSource);
    sourceByCaseId.set(caseSource.case_id, current);
  });

  legalEvents.forEach((event) => {
    const current = eventsByCaseId.get(event.case_id) || [];
    current.push(event);
    eventsByCaseId.set(event.case_id, current);
  });

  return cases.map<OperationalCaseRow>((legalCase) => {
    const caseSourcesForCase = (sourceByCaseId.get(legalCase.id) || []).slice();
    caseSourcesForCase.sort((left, right) => (right.last_checked_at || "").localeCompare(left.last_checked_at || ""));
    const primarySource = caseSourcesForCase[0] || null;
    const metadata = (primarySource?.metadata || {}) as Record<string, unknown>;
    const latestSummary =
      typeof metadata.latest_summary === "object" && metadata.latest_summary !== null
        ? (metadata.latest_summary as Record<string, unknown>)
        : null;
    const nextEvent = (eventsByCaseId.get(legalCase.id) || [])[0] || null;

    return {
      caseId: legalCase.id,
      radicado: legalCase.radicado,
      responsible: legalCase.internal_owner,
      priority: legalCase.priority,
      caseStatus: legalCase.status,
      sourceStatus: primarySource?.status || "pending",
      sourceName: primarySource?.source?.[0]?.name || "Sin fuente",
      operationalStatus:
        typeof metadata.operational_status === "string" ? metadata.operational_status : "no_consultado",
      latestActionTitle: latestSummary && typeof latestSummary.title === "string" ? latestSummary.title : null,
      latestActionDescription:
        latestSummary && typeof latestSummary.description === "string" ? latestSummary.description : null,
      latestActionDate:
        latestSummary && typeof latestSummary.movement_date === "string" ? latestSummary.movement_date : null,
      latestEventTitle: nextEvent?.title || null,
      latestEventDate: nextEvent?.event_date || null,
      latestEventType: nextEvent?.event_type || null,
      newMovementsCount:
        typeof metadata.new_movements_count === "number"
          ? metadata.new_movements_count
          : Number(metadata.new_movements_count || 0),
      legalEventsCount:
        typeof metadata.legal_events_count === "number"
          ? metadata.legal_events_count
          : Number(metadata.legal_events_count || 0),
      bootstrapMode: Boolean(metadata.bootstrap_mode),
      lastCheckedAt: primarySource?.last_checked_at || null,
    };
  });
}

function splitRadicadosFromTextarea(value: string) {
  return value
    .split(/\n|,|;|\t/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function IntakeStatus({
  title,
  items,
}: {
  title: string;
  items: string[] | null | undefined;
}) {
  if (!items || items.length === 0) return null;

  return (
    <div className="internalIntakeStatusBlock">
      <strong>{title}</strong>
      <p>{items.join(", ")}</p>
    </div>
  );
}

function formatMemberRole(role: TeamMemberRecord["role"]) {
  switch (role) {
    case "account_admin":
      return "Administrador";
    case "platform_admin":
      return "Platform admin";
    case "operator":
      return "Responsable";
    default:
      return role;
  }
}

function TeamManager({
  accessToken,
  canManage,
}: {
  accessToken: string;
  canManage: boolean;
}) {
  const [teamMembers, setTeamMembers] = useState<TeamMemberRecord[]>([]);
  const [activeCount, setActiveCount] = useState(0);
  const [limit, setLimit] = useState(4);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const availableSlots = Math.max(limit - activeCount, 0);

  async function refreshTeam() {
    setLoading(true);
    setError(null);

    try {
      const next = await fetchTeamMembers(accessToken);
      setTeamMembers(next.team);
      setActiveCount(next.activeCount);
      setLimit(next.limit);
    } catch (nextError) {
      setError(getErrorMessage(nextError, "No fue posible cargar los responsables."));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void refreshTeam();
  }, [accessToken]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting || !canManage) return;

    setSubmitting(true);
    setError(null);

    try {
      const next = await createTeamMember(accessToken, form);
      setTeamMembers(next.team);
      setActiveCount(next.activeCount);
      setLimit(next.limit);
      setForm({
        fullName: "",
        email: "",
        password: "",
      });
    } catch (submitError) {
      setError(getErrorMessage(submitError, "No fue posible crear el responsable."));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="internalPanel" id="equipo">
      <div className="internalPanelHeader">
        <div>
          <strong>Responsables de la cuenta</strong>
          <span>Gestiona el equipo real que operará la demo.</span>
        </div>
        <button className="internalGhostButton" type="button" onClick={() => void refreshTeam()}>
          Recargar
        </button>
      </div>

      <section className="internalIntakeResult internalTeamSummary">
        <article>
          <strong>{activeCount}</strong>
          <span>Responsables activos</span>
        </article>
        <article>
          <strong>{limit}</strong>
          <span>Límite de la demo</span>
        </article>
        <article>
          <strong>{availableSlots}</strong>
          <span>Cupos disponibles</span>
        </article>
      </section>

      <div className="internalTeamGrid">
        <div className="internalPanel">
          <div className="internalPanelHeader">
            <strong>Equipo actual</strong>
            <span>{teamMembers.length} registro{teamMembers.length === 1 ? "" : "s"}</span>
          </div>

          {isLoading ? <p className="internalPanelEmpty">Cargando responsables...</p> : null}
          {!isLoading && teamMembers.length === 0 ? (
            <p className="internalPanelEmpty">Aún no hay responsables creados en esta cuenta.</p>
          ) : null}

          {!isLoading && teamMembers.length > 0 ? (
            <div className="internalTeamList">
              {teamMembers.map((member) => (
                <article key={member.id}>
                  <div>
                    <strong>{member.full_name || "Sin nombre"}</strong>
                    <span>{member.email || "Sin correo"}</span>
                  </div>
                  <div className="internalTeamMeta">
                    <span className={`internalStatusBadge is-${member.role === "operator" ? "info" : "review"}`}>
                      {formatMemberRole(member.role)}
                    </span>
                    <span className={`internalStatusBadge is-${member.status === "active" ? "ok" : "neutral"}`}>
                      {member.status}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          ) : null}
        </div>

        <form className="internalPanel" onSubmit={handleSubmit}>
          <div className="internalPanelHeader">
            <strong>Crear responsable</strong>
            <span>Alta directa dentro de la cuenta</span>
          </div>

          {!canManage ? (
            <p className="internalPanelEmpty">
              Solo un administrador puede crear responsables en esta cuenta.
            </p>
          ) : null}

          {canManage ? (
            <>
              <label>
                Nombre completo
                <input
                  value={form.fullName}
                  onChange={(event) => setForm((current) => ({ ...current, fullName: event.target.value }))}
                  placeholder="Laura Pérez"
                  required
                />
              </label>

              <label>
                Correo
                <input
                  type="email"
                  autoComplete="off"
                  value={form.email}
                  onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                  placeholder="laura@firma.com"
                  required
                />
              </label>

              <label>
                Contraseña inicial
                <input
                  type="password"
                  autoComplete="new-password"
                  value={form.password}
                  onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
                  placeholder="Mínimo 8 caracteres"
                  required
                />
              </label>

              <div className="internalFormMeta">
                <span>Los responsables creados aquí entran como operadores activos.</span>
                <span>Esta cuenta puede operar con hasta {limit} responsables en total.</span>
              </div>

              <button
                className="internalPrimaryButton"
                type="submit"
                disabled={isSubmitting || availableSlots === 0}
              >
                {isSubmitting
                  ? "Creando responsable..."
                  : availableSlots === 0
                    ? "Límite alcanzado"
                    : "Crear responsable"}
              </button>
            </>
          ) : null}

          {error ? <p className="internalAuthError">{error}</p> : null}
        </form>
      </div>
    </section>
  );
}

function DemoStatusPanel({
  accessToken,
  membership,
}: {
  accessToken: string;
  membership: MembershipRecord;
}) {
  const [processCount, setProcessCount] = useState<number | null>(null);
  const [memberCount, setMemberCount] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setLoading] = useState(true);

  const processLimit = membership.organization?.process_limit ?? 100;
  const memberLimit = membership.organization?.member_limit ?? 4;
  const demoEndsAt = membership.organization?.trial_ends_at ?? null;
  const daysRemaining = getDaysRemaining(demoEndsAt);

  useEffect(() => {
    async function loadUsage() {
      if (!supabase) return;

      setLoading(true);
      setError(null);

      try {
        const [{ count: nextProcessCount, error: processError }, teamResponse] = await Promise.all([
          supabase
            .from("cases")
            .select("id", { count: "exact", head: true })
            .eq("organization_id", membership.organization_id)
            .eq("status", "active"),
          fetchTeamMembers(accessToken),
        ]);

        if (processError) {
          throw processError;
        }

        setProcessCount(nextProcessCount ?? 0);
        setMemberCount(teamResponse.activeCount);
      } catch (nextError) {
        setError(getErrorMessage(nextError, "No fue posible cargar el estado de demo."));
      } finally {
        setLoading(false);
      }
    }

    void loadUsage();
  }, [accessToken, membership.organization_id]);

  return (
    <section className="internalPanel internalDemoStatusPanel">
      <div className="internalPanelHeader">
        <div>
          <strong>Estado de la cuenta</strong>
          <span>Capacidad visible y tiempo restante de la demo.</span>
        </div>
        <span className={`internalStatusBadge is-${getDemoStatusTone(membership.organization?.account_status ?? "closed")}`}>
          {getDemoStatusLabel(membership.organization?.account_status ?? "closed")}
        </span>
      </div>

      <section className="internalIntakeResult internalDemoStatusSummary">
        <article>
          <strong>{daysRemaining ?? "-"}</strong>
          <span>Días restantes</span>
        </article>
        <article>
          <strong>{processCount ?? "-"}</strong>
          <span>{`${processCount ?? "-"} / ${processLimit} procesos activos`}</span>
        </article>
        <article>
          <strong>{memberCount ?? "-"}</strong>
          <span>{`${memberCount ?? "-"} / ${memberLimit} responsables`}</span>
        </article>
      </section>

      <div className="internalDemoStatusMeta">
        <span>
          Inicio: {membership.organization?.trial_started_at ? formatShortDate(membership.organization.trial_started_at) : "Sin fecha"}
        </span>
        <span>
          Fin: {membership.organization?.trial_ends_at ? formatShortDate(membership.organization.trial_ends_at) : "Sin fecha"}
        </span>
      </div>

      {isLoading ? <p className="internalPanelEmpty">Actualizando capacidad de la cuenta...</p> : null}
      {error ? <p className="internalAuthError">{error}</p> : null}
    </section>
  );
}

function InternalProcessManager({
  organizationId,
  view,
}: {
  organizationId: string;
  view: AppView;
}) {
  const [cases, setCases] = useState<InternalCaseRow[]>([]);
  const [operationalRows, setOperationalRows] = useState<OperationalCaseRow[]>([]);
  const [caseSources, setCaseSources] = useState<InternalCaseSourceRow[]>([]);
  const [legalEvents, setLegalEvents] = useState<InternalLegalEventRow[]>([]);
  const [snapshots, setSnapshots] = useState<InternalSnapshotRow[]>([]);
  const [alerts, setAlerts] = useState<InternalAlertRow[]>([]);
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("todos");
  const [ownerFilter, setOwnerFilter] = useState("todos");
  const [priorityFilter, setPriorityFilter] = useState("todos");
  const [isLoadingCases, setLoadingCases] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [singleRadicado, setSingleRadicado] = useState("");
  const [singleOwner, setSingleOwner] = useState("");
  const [singlePriority, setSinglePriority] = useState<"low" | "normal" | "high" | "critical">("normal");
  const [singleNotes, setSingleNotes] = useState("");
  const [bulkRadicados, setBulkRadicados] = useState("");
  const [bulkOwner, setBulkOwner] = useState("");
  const [bulkPriority, setBulkPriority] = useState<"low" | "normal" | "high" | "critical">("normal");
  const [bulkNotes, setBulkNotes] = useState("");
  const [isSubmittingSingle, setSubmittingSingle] = useState(false);
  const [isSubmittingBulk, setSubmittingBulk] = useState(false);
  const [intakeError, setIntakeError] = useState<string | null>(null);
  const [lastIntakeResult, setLastIntakeResult] = useState<CaseIntakeResponse | null>(null);

  async function refreshCases() {
    setLoadingCases(true);
    setLoadError(null);

    try {
      const nextCases = await loadOrganizationCases(organizationId);
      setCases(nextCases);
      const caseIds = nextCases.map((legalCase) => legalCase.id);
      const [nextCaseSources, nextLegalEvents] = await Promise.all([
        loadOrganizationCaseSources(caseIds),
        loadOrganizationLegalEvents(caseIds),
      ]);
      const caseSourceIds = nextCaseSources.map((caseSource) => caseSource.id);
      const [nextSnapshots, nextAlerts] = await Promise.all([
        loadOrganizationSnapshots(caseSourceIds),
        loadOrganizationAlerts(caseIds),
      ]);
      setCaseSources(nextCaseSources);
      setLegalEvents(nextLegalEvents);
      setSnapshots(nextSnapshots);
      setAlerts(nextAlerts);
      const nextOperationalRows = buildOperationalRows(nextCases, nextCaseSources, nextLegalEvents);
      setOperationalRows(nextOperationalRows);
      setSelectedCaseId((current) =>
        current && nextOperationalRows.some((row) => row.caseId === current) ? current : null,
      );
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : "No fue posible cargar los procesos.");
    } finally {
      setLoadingCases(false);
    }
  }

  useEffect(() => {
    void refreshCases();
  }, [organizationId]);

  async function submitEntries(entries: { radicado: string; owner?: string; priority?: string; notes?: string }[]) {
    if (!supabase) {
      throw new Error("Supabase no está configurado.");
    }

    const { data, error } = await supabase.rpc("submit_case_intake", {
      target_organization_id: organizationId,
      entries,
    }).single();

    if (error) {
      throw error;
    }

    return data as CaseIntakeResponse;
  }

  async function handleSingleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmittingSingle) return;

    setSubmittingSingle(true);
    setIntakeError(null);
    setLastIntakeResult(null);

    try {
      const result = await submitEntries([
        {
          radicado: singleRadicado,
          owner: singleOwner,
          priority: singlePriority,
          notes: singleNotes,
        },
      ]);

      setLastIntakeResult(result);
      setSingleRadicado("");
      setSingleOwner("");
      setSinglePriority("normal");
      setSingleNotes("");
      await refreshCases();
    } catch (error) {
      setIntakeError(getErrorMessage(error, "No fue posible registrar el proceso."));
    } finally {
      setSubmittingSingle(false);
    }
  }

  async function handleBulkSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmittingBulk) return;

    const radicados = splitRadicadosFromTextarea(bulkRadicados);
    if (radicados.length === 0) {
      setIntakeError("Pega al menos un radicado para la carga masiva.");
      return;
    }

    setSubmittingBulk(true);
    setIntakeError(null);
    setLastIntakeResult(null);

    try {
      const result = await submitEntries(
        radicados.map((radicado) => ({
          radicado,
          owner: bulkOwner,
          priority: bulkPriority,
          notes: bulkNotes,
        })),
      );

      setLastIntakeResult(result);
      setBulkRadicados("");
      setBulkOwner("");
      setBulkPriority("normal");
      setBulkNotes("");
      await refreshCases();
    } catch (error) {
      setIntakeError(getErrorMessage(error, "No fue posible completar la carga masiva."));
    } finally {
      setSubmittingBulk(false);
    }
  }

  const normalizedPreview = normalizeRadicado(singleRadicado);
  const bulkPreviewCount = splitRadicadosFromTextarea(bulkRadicados).length;
  const operationalSummary = {
    total: operationalRows.length,
    conNovedad: operationalRows.filter((row) => row.operationalStatus === "con_novedad").length,
    requiereRevision: operationalRows.filter((row) => row.operationalStatus === "requiere_revision").length,
    erroresFuente: operationalRows.filter((row) => row.operationalStatus === "error_fuente").length,
    eventosActivos: operationalRows.filter((row) => Boolean(row.latestEventDate)).length,
  };
  const availableOwners = Array.from(
    new Set(operationalRows.map((row) => row.responsible).filter((value): value is string => Boolean(value))),
  ).sort((left, right) => left.localeCompare(right, "es-CO"));
  const filteredOperationalRows = operationalRows.filter((row) => {
    if (statusFilter !== "todos" && row.operationalStatus !== statusFilter) return false;
    if (ownerFilter !== "todos" && (row.responsible || "Sin responsable") !== ownerFilter) return false;
    if (priorityFilter !== "todos" && row.priority !== priorityFilter) return false;
    return true;
  });
  const selectedCase = filteredOperationalRows.find((row) => row.caseId === selectedCaseId) || null;
  const selectedCaseSources = caseSources
    .filter((caseSource) => caseSource.case_id === selectedCase?.caseId)
    .sort((left, right) => (right.last_checked_at || "").localeCompare(left.last_checked_at || ""));
  const selectedSnapshots = snapshots.filter((snapshot) =>
    selectedCaseSources.some((caseSource) => caseSource.id === snapshot.case_source_id),
  );
  const selectedEvents = legalEvents.filter((event) => event.case_id === selectedCase?.caseId);
  const selectedAlerts = alerts.filter((alert) => alert.case_id === selectedCase?.caseId);
  const consultationSummary = {
    sourcesTracked: caseSources.length,
    fuentesActivas: caseSources.filter((caseSource) => caseSource.status === "active").length,
    erroresFuente: caseSources.filter((caseSource) => caseSource.status === "error").length,
    bloqueosFuente: caseSources.filter((caseSource) => caseSource.status === "blocked").length,
    noEncontrados: caseSources.filter((caseSource) => caseSource.status === "not_found").length,
    snapshots: snapshots.length,
    alertas: alerts.length,
  };

  if (view === "inicio") {
    return (
      <section className="internalProcessManager">
        <section className="internalSummaryGrid">
          <article>
            <strong>{operationalSummary.total}</strong>
            <p>Procesos visibles hoy en la cuenta.</p>
          </article>
          <article>
            <strong>{operationalSummary.conNovedad}</strong>
            <p>Procesos con novedad operativa visible.</p>
          </article>
          <article>
            <strong>{alerts.length}</strong>
            <p>Alertas activas registradas para esta cuenta.</p>
          </article>
        </section>

        <section className="internalModuleList">
          <header>
            <span className="internalEyebrow">Panorama</span>
            <h2>Lo que hoy merece atención.</h2>
          </header>

          <div className="internalModuleCards">
            <article>
              <div>
                <strong>Bandeja</strong>
                <span>{operationalSummary.requiereRevision} revisión</span>
              </div>
              <p>Los estados operativos ya distinguen novedad, error de fuente y revisión humana.</p>
            </article>
            <article>
              <div>
                <strong>Equipo</strong>
                <span>{availableOwners.length} responsables</span>
              </div>
              <p>La cuenta ya puede operar con responsables reales y asignación sobre procesos.</p>
            </article>
            <article>
              <div>
                <strong>Consultas</strong>
                <span>{consultationSummary.snapshots} snapshots</span>
              </div>
              <p>Cada corrida deja trazabilidad persistida para comparar cambios y eventos.</p>
            </article>
            <article>
              <div>
                <strong>Alertas</strong>
                <span>{consultationSummary.alertas} activas</span>
              </div>
              <p>La cuenta ya hace visible cuando una fuente falla o un proceso requiere intervención.</p>
            </article>
          </div>
        </section>
      </section>
    );
  }

  if (view === "bandeja") {
    return (
      <section className="internalProcessManager">
        <section className="internalPanel" id="bandeja">
          <div className="internalPanelHeader">
            <div>
              <strong>Bandeja operativa real</strong>
              <span>Procesos consultados, última actuación, eventos y señales de acción.</span>
            </div>
            <button className="internalGhostButton" type="button" onClick={() => void refreshCases()}>
              Recargar
            </button>
          </div>

          <div className="internalIntakeResult internalTraySummary">
            <article>
              <strong>{operationalSummary.total}</strong>
              <span>Procesos visibles</span>
            </article>
            <article>
              <strong>{operationalSummary.conNovedad}</strong>
              <span>Con novedad</span>
            </article>
            <article>
              <strong>{operationalSummary.requiereRevision}</strong>
              <span>Requieren revisión</span>
            </article>
            <article>
              <strong>{operationalSummary.erroresFuente}</strong>
              <span>Errores de fuente</span>
            </article>
            <article>
              <strong>{operationalSummary.eventosActivos}</strong>
              <span>Eventos activos</span>
            </article>
          </div>

          {isLoadingCases ? <p className="internalPanelEmpty">Cargando bandeja operativa...</p> : null}
          {loadError ? <p className="internalAuthError">{loadError}</p> : null}
          {!isLoadingCases && !loadError && operationalRows.length === 0 ? (
            <p className="internalPanelEmpty">
              Aún no hay datos suficientes para la bandeja. Carga procesos y ejecuta consultas para poblarla.
            </p>
          ) : null}

          {!isLoadingCases && !loadError && operationalRows.length > 0 ? (
            <>
              <div className="internalTrayFilters">
                <label>
                  Estado operativo
                  <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
                    <option value="todos">Todos</option>
                    <option value="con_novedad">Con novedad</option>
                    <option value="requiere_revision">Requiere revisión</option>
                    <option value="sin_cambios">Sin cambios</option>
                    <option value="no_consultado">No consultado</option>
                    <option value="error_fuente">Error de fuente</option>
                  </select>
                </label>
                <label>
                  Responsable
                  <select value={ownerFilter} onChange={(event) => setOwnerFilter(event.target.value)}>
                    <option value="todos">Todos</option>
                    <option value="Sin responsable">Sin responsable</option>
                    {availableOwners.map((owner) => (
                      <option key={owner} value={owner}>
                        {owner}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Prioridad
                  <select value={priorityFilter} onChange={(event) => setPriorityFilter(event.target.value)}>
                    <option value="todos">Todas</option>
                    <option value="critical">Crítica</option>
                    <option value="high">Alta</option>
                    <option value="normal">Normal</option>
                    <option value="low">Baja</option>
                  </select>
                </label>
              </div>

              <div className="internalTrayLayout">
                <div className="internalCasesTable internalTrayTable">
                  <div className="internalCasesTableHead internalTrayTableHead">
                    <span>Radicado</span>
                    <span>Estado operativo</span>
                    <span>Última actuación</span>
                    <span>Próximo evento</span>
                    <span>Responsable</span>
                    <span>Fuente</span>
                  </div>
                  {filteredOperationalRows.length === 0 ? (
                    <p className="internalPanelEmpty">
                      No hay procesos que coincidan con los filtros actuales.
                    </p>
                  ) : null}
                  {filteredOperationalRows.map((row) => (
                    <article
                      key={row.caseId}
                      className={`internalCasesRow internalTrayRow ${selectedCase?.caseId === row.caseId ? "is-selected" : ""}`}
                      onClick={() =>
                        setSelectedCaseId((current) => (current === row.caseId ? null : row.caseId))
                      }
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          setSelectedCaseId((current) => (current === row.caseId ? null : row.caseId));
                        }
                      }}
                      role="button"
                      tabIndex={0}
                    >
                      <div className="internalTrayPrimary">
                        <strong>{row.radicado}</strong>
                        <span>{row.lastCheckedAt ? `Última consulta: ${formatCaseTimestamp(row.lastCheckedAt)}` : "Sin consulta aún"}</span>
                      </div>
                      <div className="internalTrayStack">
                        <span className={`internalStatusBadge is-${getOperationalTone(row.operationalStatus)}`}>
                          {formatOperationalStatus(row.operationalStatus)}
                        </span>
                        <span className={`internalStatusBadge is-${getSourceStatusTone(row.sourceStatus)}`}>
                          Fuente {row.sourceStatus}
                        </span>
                      </div>
                      <div className="internalTrayStack">
                        <strong>{row.latestActionTitle || "Sin actuación resumida"}</strong>
                        <span>{row.latestActionDate ? formatShortDate(row.latestActionDate) : "Sin fecha"}</span>
                        {row.latestActionDescription ? <span>{row.latestActionDescription}</span> : null}
                      </div>
                      <div className="internalTrayStack">
                        <strong>{row.latestEventTitle || "Sin evento activo"}</strong>
                        <span>{row.latestEventDate ? formatShortDate(row.latestEventDate) : "Sin fecha"}</span>
                        {row.latestEventType ? <span>{row.latestEventType}</span> : null}
                      </div>
                      <div className="internalTrayStack">
                        <span>{row.responsible || "Sin responsable"}</span>
                        <span className={`internalPriorityBadge is-${row.priority}`}>{row.priority}</span>
                      </div>
                      <div className="internalTrayStack">
                        <span>{row.sourceName}</span>
                        <span>{row.legalEventsCount} evento{row.legalEventsCount === 1 ? "" : "s"}</span>
                      </div>
                    </article>
                  ))}
                </div>

                <aside className="internalPanel internalDetailPanel">
                  {selectedCase ? (
                    <>
                      <div className="internalPanelHeader">
                        <div>
                          <strong>Detalle del proceso</strong>
                          <span>{selectedCase.radicado}</span>
                        </div>
                        <button
                          className="internalGhostButton"
                          type="button"
                          onClick={() => setSelectedCaseId(null)}
                        >
                          Cerrar detalle
                        </button>
                      </div>

                      <div className="internalDetailSummary">
                        <div>
                          <span>Estado operativo</span>
                          <strong>{formatOperationalStatus(selectedCase.operationalStatus)}</strong>
                        </div>
                        <div>
                          <span>Responsable</span>
                          <strong>{selectedCase.responsible || "Sin responsable"}</strong>
                        </div>
                        <div>
                          <span>Prioridad</span>
                          <strong>{selectedCase.priority}</strong>
                        </div>
                        <div>
                          <span>Fuente</span>
                          <strong>{selectedCase.sourceName}</strong>
                        </div>
                      </div>

                      <div className="internalDetailSection">
                        <div className="internalPanelHeader">
                          <strong>Eventos jurídicos</strong>
                          <span>{selectedEvents.length} activo{selectedEvents.length === 1 ? "" : "s"}</span>
                        </div>
                        {selectedEvents.length > 0 ? (
                          <div className="internalDetailList">
                            {selectedEvents.map((event) => (
                              <article key={event.id}>
                                <strong>{event.title}</strong>
                                <span>{event.event_type} · {formatDateTimeLabel(event.event_date)}</span>
                                <span>Estado: {event.change_status}</span>
                              </article>
                            ))}
                          </div>
                        ) : (
                          <p className="internalPanelEmpty">No hay eventos activos para este proceso.</p>
                        )}
                      </div>

                      <div className="internalDetailSection">
                        <div className="internalPanelHeader">
                          <strong>Alertas</strong>
                          <span>{selectedAlerts.length} activa{selectedAlerts.length === 1 ? "" : "s"}</span>
                        </div>
                        {selectedAlerts.length > 0 ? (
                          <div className="internalDetailList">
                            {selectedAlerts.map((alert) => (
                              <article key={alert.id}>
                                <div className="internalDetailTitleLine">
                                  <strong>{alert.title}</strong>
                                  <span className={`internalStatusBadge is-${getAlertTone(alert.severity)}`}>
                                    {formatAlertType(alert.alert_type)}
                                  </span>
                                </div>
                                <span>{alert.message}</span>
                                <span>{formatDateTimeLabel(alert.created_at)}</span>
                              </article>
                            ))}
                          </div>
                        ) : (
                          <p className="internalPanelEmpty">No hay alertas activas para este proceso.</p>
                        )}
                      </div>

                      <div className="internalDetailSection">
                        <div className="internalPanelHeader">
                          <strong>Historial de snapshots</strong>
                          <span>{selectedSnapshots.length} registro{selectedSnapshots.length === 1 ? "" : "s"}</span>
                        </div>
                        {selectedSnapshots.length > 0 ? (
                          <div className="internalDetailList">
                            {selectedSnapshots.slice(0, 12).map((snapshot) => (
                              <article key={snapshot.id}>
                                <div className="internalDetailTitleLine">
                                  <strong>{formatDateTimeLabel(snapshot.fetched_at)}</strong>
                                  <span className={`internalStatusBadge is-${getSnapshotStatusTone(snapshot.fetch_status)}`}>
                                    {snapshot.fetch_status}
                                  </span>
                                </div>
                                <span>
                                  {snapshot.duration_ms ? `${snapshot.duration_ms} ms` : "Sin duración reportada"}
                                </span>
                                {snapshot.error_message ? <span>{snapshot.error_message}</span> : null}
                              </article>
                            ))}
                          </div>
                        ) : (
                          <p className="internalPanelEmpty">No hay snapshots para este proceso.</p>
                        )}
                      </div>
                    </>
                  ) : filteredOperationalRows.length === 0 ? (
                    <p className="internalPanelEmpty">
                      Ajusta o limpia los filtros para volver a ver el detalle de un proceso.
                    </p>
                  ) : (
                    <p className="internalPanelEmpty">
                      Selecciona un proceso para abrir su detalle operativo.
                    </p>
                  )}
                </aside>
              </div>
            </>
          ) : null}
        </section>
      </section>
    );
  }

  if (view === "consultas") {
    return (
      <section className="internalProcessManager">
        <section className="internalSummaryGrid">
          <article>
            <strong>{consultationSummary.sourcesTracked}</strong>
            <p>Fuentes rastreadas sobre procesos activos.</p>
          </article>
          <article>
            <strong>{consultationSummary.snapshots}</strong>
            <p>Snapshots disponibles para trazabilidad.</p>
          </article>
          <article>
            <strong>{consultationSummary.alertas}</strong>
            <p>Alertas registradas por novedades o fallas.</p>
          </article>
        </section>

        <section className="internalPanel">
          <div className="internalPanelHeader">
            <div>
              <strong>Estado de consultas y fuentes</strong>
              <span>Visibilidad operativa sobre salud de ejecución.</span>
            </div>
            <button className="internalGhostButton" type="button" onClick={() => void refreshCases()}>
              Recargar
            </button>
          </div>

          <section className="internalIntakeResult">
            <article>
              <strong>{consultationSummary.fuentesActivas}</strong>
              <span>Fuentes activas</span>
            </article>
            <article>
              <strong>{consultationSummary.erroresFuente}</strong>
              <span>Errores de fuente</span>
            </article>
            <article>
              <strong>{consultationSummary.bloqueosFuente}</strong>
              <span>Fuentes bloqueadas</span>
            </article>
          </section>

          <div className="internalDetailList">
            <article>
              <strong>Fuentes no encontradas</strong>
              <span>{consultationSummary.noEncontrados} procesos devolvieron `not_found` en la última lectura.</span>
            </article>
            <article>
              <strong>Alertas activas</strong>
              <span>{alerts.length} alertas visibles hoy en la cuenta.</span>
            </article>
            <article>
              <strong>Snapshots persistidos</strong>
              <span>{snapshots.length} registros disponibles para comparación e historial.</span>
            </article>
          </div>
        </section>
      </section>
    );
  }

  if (view !== "procesos") {
    return null;
  }

  return (
    <section className="internalProcessManager" id="procesos">
      <header>
        <span className="internalEyebrow">Bloque 2 · Gestión de procesos</span>
        <h2>Carga radicados reales y déjalos listos para consulta.</h2>
        <p>
          Cada proceso entra validado, asociado a tu organización y con `case_source`
          inicial para CPNU.
        </p>
      </header>

      <section className="internalPanel" id="bandeja">
        <div className="internalPanelHeader">
          <div>
            <strong>Bandeja operativa real</strong>
            <span>Procesos consultados, última actuación y eventos jurídicos activos.</span>
          </div>
          <button className="internalGhostButton" type="button" onClick={() => void refreshCases()}>
            Recargar
          </button>
        </div>

        <div className="internalIntakeResult internalTraySummary">
          <article>
            <strong>{operationalSummary.total}</strong>
            <span>Procesos visibles</span>
          </article>
          <article>
            <strong>{operationalSummary.conNovedad}</strong>
            <span>Con novedad</span>
          </article>
          <article>
            <strong>{operationalSummary.requiereRevision}</strong>
            <span>Requieren revisión</span>
          </article>
          <article>
            <strong>{operationalSummary.erroresFuente}</strong>
            <span>Errores de fuente</span>
          </article>
          <article>
            <strong>{operationalSummary.eventosActivos}</strong>
            <span>Eventos activos</span>
          </article>
        </div>

        {isLoadingCases ? <p className="internalPanelEmpty">Cargando bandeja operativa...</p> : null}
        {loadError ? <p className="internalAuthError">{loadError}</p> : null}
        {!isLoadingCases && !loadError && operationalRows.length === 0 ? (
          <p className="internalPanelEmpty">
            Aún no hay datos suficientes para la bandeja. Carga procesos y ejecuta consultas para poblarla.
          </p>
        ) : null}

        {!isLoadingCases && !loadError && operationalRows.length > 0 ? (
          <>
            <div className="internalTrayFilters">
              <label>
                Estado operativo
                <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
                  <option value="todos">Todos</option>
                  <option value="con_novedad">Con novedad</option>
                  <option value="requiere_revision">Requiere revisión</option>
                  <option value="sin_cambios">Sin cambios</option>
                  <option value="no_consultado">No consultado</option>
                  <option value="error_fuente">Error de fuente</option>
                </select>
              </label>
              <label>
                Responsable
                <select value={ownerFilter} onChange={(event) => setOwnerFilter(event.target.value)}>
                  <option value="todos">Todos</option>
                  <option value="Sin responsable">Sin responsable</option>
                  {availableOwners.map((owner) => (
                    <option key={owner} value={owner}>
                      {owner}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Prioridad
                <select value={priorityFilter} onChange={(event) => setPriorityFilter(event.target.value)}>
                  <option value="todos">Todas</option>
                  <option value="critical">Crítica</option>
                  <option value="high">Alta</option>
                  <option value="normal">Normal</option>
                  <option value="low">Baja</option>
                </select>
              </label>
            </div>

            <div className="internalTrayLayout">
              <div className="internalCasesTable internalTrayTable">
                <div className="internalCasesTableHead internalTrayTableHead">
                  <span>Radicado</span>
                  <span>Estado operativo</span>
                  <span>Última actuación</span>
                  <span>Próximo evento</span>
                  <span>Responsable</span>
                  <span>Fuente</span>
                </div>
                {filteredOperationalRows.length === 0 ? (
                  <p className="internalPanelEmpty">
                    No hay procesos que coincidan con los filtros actuales.
                  </p>
                ) : null}
                {filteredOperationalRows.map((row) => (
                  <article
                    key={row.caseId}
                    className={`internalCasesRow internalTrayRow ${selectedCase?.caseId === row.caseId ? "is-selected" : ""}`}
                    onClick={() =>
                      setSelectedCaseId((current) => (current === row.caseId ? null : row.caseId))
                    }
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        setSelectedCaseId((current) => (current === row.caseId ? null : row.caseId));
                      }
                    }}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="internalTrayPrimary">
                      <strong>{row.radicado}</strong>
                      <span>{row.lastCheckedAt ? `Última consulta: ${formatCaseTimestamp(row.lastCheckedAt)}` : "Sin consulta aún"}</span>
                    </div>
                    <div className="internalTrayStack">
                      <span className={`internalStatusBadge is-${getOperationalTone(row.operationalStatus)}`}>
                        {formatOperationalStatus(row.operationalStatus)}
                      </span>
                      <span className={`internalStatusBadge is-${getSourceStatusTone(row.sourceStatus)}`}>
                        Fuente {row.sourceStatus}
                      </span>
                    </div>
                    <div className="internalTrayStack">
                      <strong>{row.latestActionTitle || "Sin actuación resumida"}</strong>
                      <span>{row.latestActionDate ? formatShortDate(row.latestActionDate) : "Sin fecha"}</span>
                      {row.latestActionDescription ? <span>{row.latestActionDescription}</span> : null}
                    </div>
                    <div className="internalTrayStack">
                      <strong>{row.latestEventTitle || "Sin evento activo"}</strong>
                      <span>{row.latestEventDate ? formatShortDate(row.latestEventDate) : "Sin fecha"}</span>
                      {row.latestEventType ? <span>{row.latestEventType}</span> : null}
                    </div>
                    <div className="internalTrayStack">
                      <span>{row.responsible || "Sin responsable"}</span>
                      <span className={`internalPriorityBadge is-${row.priority}`}>{row.priority}</span>
                    </div>
                    <div className="internalTrayStack">
                      <span>{row.sourceName}</span>
                      <span>{row.legalEventsCount} evento{row.legalEventsCount === 1 ? "" : "s"}</span>
                    </div>
                  </article>
                ))}
              </div>

              <aside className="internalPanel internalDetailPanel">
                {selectedCase ? (
                  <>
                    <div className="internalPanelHeader">
                      <div>
                        <strong>Detalle del proceso</strong>
                        <span>{selectedCase.radicado}</span>
                      </div>
                      <button
                        className="internalGhostButton"
                        type="button"
                        onClick={() => setSelectedCaseId(null)}
                      >
                        Cerrar detalle
                      </button>
                    </div>

                    <div className="internalDetailSummary">
                      <div>
                        <span>Estado operativo</span>
                        <strong>{formatOperationalStatus(selectedCase.operationalStatus)}</strong>
                      </div>
                      <div>
                        <span>Responsable</span>
                        <strong>{selectedCase.responsible || "Sin responsable"}</strong>
                      </div>
                      <div>
                        <span>Prioridad</span>
                        <strong>{selectedCase.priority}</strong>
                      </div>
                      <div>
                        <span>Fuente</span>
                        <strong>{selectedCase.sourceName}</strong>
                      </div>
                    </div>

                    <div className="internalDetailSection">
                      <div className="internalPanelHeader">
                        <strong>Eventos jurídicos</strong>
                        <span>{selectedEvents.length} activo{selectedEvents.length === 1 ? "" : "s"}</span>
                      </div>
                      {selectedEvents.length > 0 ? (
                        <div className="internalDetailList">
                          {selectedEvents.map((event) => (
                            <article key={event.id}>
                              <strong>{event.title}</strong>
                              <span>{event.event_type} · {formatDateTimeLabel(event.event_date)}</span>
                              <span>Estado: {event.change_status}</span>
                            </article>
                          ))}
                        </div>
                      ) : (
                        <p className="internalPanelEmpty">No hay eventos activos para este proceso.</p>
                      )}
                    </div>

                    <div className="internalDetailSection">
                      <div className="internalPanelHeader">
                        <strong>Alertas</strong>
                        <span>{selectedAlerts.length} activa{selectedAlerts.length === 1 ? "" : "s"}</span>
                      </div>
                      {selectedAlerts.length > 0 ? (
                        <div className="internalDetailList">
                          {selectedAlerts.map((alert) => (
                            <article key={alert.id}>
                              <div className="internalDetailTitleLine">
                                <strong>{alert.title}</strong>
                                <span className={`internalStatusBadge is-${getAlertTone(alert.severity)}`}>
                                  {formatAlertType(alert.alert_type)}
                                </span>
                              </div>
                              <span>{alert.message}</span>
                              <span>{formatDateTimeLabel(alert.created_at)}</span>
                            </article>
                          ))}
                        </div>
                      ) : (
                        <p className="internalPanelEmpty">No hay alertas activas para este proceso.</p>
                      )}
                    </div>

                    <div className="internalDetailSection">
                      <div className="internalPanelHeader">
                        <strong>Historial de snapshots</strong>
                        <span>{selectedSnapshots.length} registro{selectedSnapshots.length === 1 ? "" : "s"}</span>
                      </div>
                      {selectedSnapshots.length > 0 ? (
                        <div className="internalDetailList">
                          {selectedSnapshots.slice(0, 12).map((snapshot) => (
                            <article key={snapshot.id}>
                              <div className="internalDetailTitleLine">
                                <strong>{formatDateTimeLabel(snapshot.fetched_at)}</strong>
                                <span className={`internalStatusBadge is-${getSnapshotStatusTone(snapshot.fetch_status)}`}>
                                  {snapshot.fetch_status}
                                </span>
                              </div>
                              <span>
                                {snapshot.duration_ms ? `${snapshot.duration_ms} ms` : "Sin duración reportada"}
                              </span>
                              {snapshot.error_message ? <span>{snapshot.error_message}</span> : null}
                            </article>
                          ))}
                        </div>
                      ) : (
                        <p className="internalPanelEmpty">No hay snapshots para este proceso.</p>
                      )}
                    </div>
                  </>
                ) : filteredOperationalRows.length === 0 ? (
                  <p className="internalPanelEmpty">
                    Ajusta o limpia los filtros para volver a ver el detalle de un proceso.
                  </p>
                ) : (
                  <p className="internalPanelEmpty">
                    Selecciona un proceso para abrir su detalle operativo.
                  </p>
                )}
              </aside>
            </div>
          </>
        ) : null}
      </section>

      <div className="internalProcessGrid">
        <form className="internalPanel" onSubmit={handleSingleSubmit}>
          <div className="internalPanelHeader">
            <strong>Carga individual</strong>
            <span>Un radicado a la vez</span>
          </div>

          <label>
            Radicado
            <input
              value={singleRadicado}
              onChange={(event) => setSingleRadicado(event.target.value)}
              placeholder="11001400303520230010700"
              required
            />
          </label>

          <div className="internalFormMeta">
            <span>{normalizedPreview ? `Normalizado: ${normalizedPreview}` : "El sistema limpiará guiones y espacios."}</span>
            <span>{singleRadicado ? (isLikelyRadicado(singleRadicado) ? "Formato probable válido" : "Revisa longitud del radicado") : "Longitud recomendada: 20 a 30 dígitos."}</span>
          </div>

          <label>
            Responsable
            <input
              value={singleOwner}
              onChange={(event) => setSingleOwner(event.target.value)}
              placeholder="Laura P."
            />
          </label>

          <label>
            Prioridad
            <select value={singlePriority} onChange={(event) => setSinglePriority(event.target.value as typeof singlePriority)}>
              <option value="low">Baja</option>
              <option value="normal">Normal</option>
              <option value="high">Alta</option>
              <option value="critical">Crítica</option>
            </select>
          </label>

          <label>
            Nota interna
            <textarea
              value={singleNotes}
              onChange={(event) => setSingleNotes(event.target.value)}
              placeholder="Cliente prioritario, caso sensible o cualquier contexto útil."
              rows={4}
            />
          </label>

          <button className="internalPrimaryButton" type="submit" disabled={isSubmittingSingle}>
            {isSubmittingSingle ? "Guardando..." : "Guardar proceso"}
          </button>
        </form>

        <form className="internalPanel" onSubmit={handleBulkSubmit}>
          <div className="internalPanelHeader">
            <strong>Carga masiva</strong>
            <span>Hasta donde quieras, separados por línea, coma o tab</span>
          </div>

          <label>
            Radicados
            <textarea
              value={bulkRadicados}
              onChange={(event) => setBulkRadicados(event.target.value)}
              placeholder={"11001400303520230010700\n11001400306620230164700\n11001400307720220072200"}
              rows={8}
              required
            />
          </label>

          <div className="internalFormMeta">
            <span>{bulkPreviewCount} radicado{bulkPreviewCount === 1 ? "" : "s"} detectado{bulkPreviewCount === 1 ? "" : "s"}.</span>
            <span>Duplicados e inválidos se reportan sin romper toda la carga.</span>
          </div>

          <label>
            Responsable por defecto
            <input
              value={bulkOwner}
              onChange={(event) => setBulkOwner(event.target.value)}
              placeholder="Carlos M."
            />
          </label>

          <label>
            Prioridad por defecto
            <select value={bulkPriority} onChange={(event) => setBulkPriority(event.target.value as typeof bulkPriority)}>
              <option value="low">Baja</option>
              <option value="normal">Normal</option>
              <option value="high">Alta</option>
              <option value="critical">Crítica</option>
            </select>
          </label>

          <label>
            Nota interna
            <textarea
              value={bulkNotes}
              onChange={(event) => setBulkNotes(event.target.value)}
              placeholder="Aplica la misma nota para toda la carga."
              rows={4}
            />
          </label>

          <button className="internalPrimaryButton" type="submit" disabled={isSubmittingBulk}>
            {isSubmittingBulk ? "Procesando..." : "Cargar lote"}
          </button>
        </form>
      </div>

      {intakeError ? <p className="internalAuthError">{intakeError}</p> : null}

      {lastIntakeResult ? (
        <section className="internalIntakeResult">
          <article>
            <strong>{lastIntakeResult.inserted_count}</strong>
            <span>Insertados</span>
          </article>
          <article>
            <strong>{lastIntakeResult.duplicate_count}</strong>
            <span>Duplicados</span>
          </article>
          <article>
            <strong>{lastIntakeResult.invalid_count}</strong>
            <span>Inválidos</span>
          </article>
        </section>
      ) : null}

      {lastIntakeResult ? (
        <div className="internalIntakeStatus">
          <IntakeStatus title="Radicados insertados" items={lastIntakeResult.inserted_radicados} />
          <IntakeStatus title="Radicados duplicados" items={lastIntakeResult.duplicate_radicados} />
          <IntakeStatus title="Radicados inválidos" items={lastIntakeResult.invalid_radicados} />
        </div>
      ) : null}

      <section className="internalPanel" id="bandeja">
        <div className="internalPanelHeader">
          <strong>Procesos cargados recientemente</strong>
          <button className="internalGhostButton" type="button" onClick={() => void refreshCases()}>
            Recargar
          </button>
        </div>

        {isLoadingCases ? <p className="internalPanelEmpty">Cargando procesos...</p> : null}
        {loadError ? <p className="internalAuthError">{loadError}</p> : null}
        {!isLoadingCases && !loadError && cases.length === 0 ? (
          <p className="internalPanelEmpty">
            Aún no hay procesos cargados. El siguiente paso es empezar por un lote pequeño y probar la ingestión.
          </p>
        ) : null}

        {!isLoadingCases && !loadError && cases.length > 0 ? (
          <div className="internalCasesTable">
            <div className="internalCasesTableHead">
              <span>Radicado</span>
              <span>Responsable</span>
              <span>Prioridad</span>
              <span>Estado</span>
              <span>Creado</span>
            </div>
            {cases.map((legalCase) => (
              <article key={legalCase.id} className="internalCasesRow">
                <strong>{legalCase.radicado}</strong>
                <span>{legalCase.internal_owner || "Sin responsable"}</span>
                <span className={`internalPriorityBadge is-${legalCase.priority}`}>{legalCase.priority}</span>
                <span>{legalCase.status}</span>
                <span>{formatCaseTimestamp(legalCase.created_at)}</span>
              </article>
            ))}
          </div>
        ) : null}
      </section>
    </section>
  );
}

function InternalAuthScreen() {
  const [form, setForm] = useState<AuthFormState>({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase || isSubmitting) return;

    setSubmitting(true);
    setError(null);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: form.email.trim(),
      password: form.password,
    });

    if (signInError) {
      setError(signInError.message);
    }

    setSubmitting(false);
  }

  return (
    <main className="internalAuthPage">
      <section className="internalAuthCard">
        <img className="internalAuthLogo" src={logoUrl} alt="LexControl" />
        <span className="internalEyebrow">Acceso beta asistida</span>
        <h1>Ingresa a la consola interna de LexControl.</h1>
        <p>
          Este acceso está reservado para cuentas activadas por el equipo. Aquí
          empezamos a convertir la demo en operación real.
        </p>

        <form className="internalAuthForm" onSubmit={handleSubmit}>
          <label>
            Correo
            <input
              autoComplete="email"
              type="email"
              value={form.email}
              onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
              placeholder="tu@firma.com"
              required
            />
          </label>
          <label>
            Contraseña
            <input
              autoComplete="current-password"
              type="password"
              value={form.password}
              onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
              placeholder="********"
              required
            />
          </label>

          {error ? <p className="internalAuthError">{error}</p> : null}

          <button className="internalPrimaryButton" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Ingresando..." : "Entrar"}
          </button>
        </form>

        <div className="internalAuthHint">
          <strong>Bloque 1 · Fundación operativa</strong>
          <span>
            Auth, membresías y aislamiento por organización ya viven aquí.
          </span>
        </div>
      </section>
    </main>
  );
}

function InternalConfigurationState() {
  return (
    <main className="internalStatePage">
      <section className="internalStateCard">
        <span className="internalEyebrow">Configuración pendiente</span>
        <h1>Faltan variables de Supabase en el frontend.</h1>
        <p>
          Para abrir la consola interna necesitamos `VITE_SUPABASE_URL` y
          `VITE_SUPABASE_ANON_KEY`. La landing puede vivir sin eso. La beta
          operativa no.
        </p>
      </section>
    </main>
  );
}

function InternalNoMembershipState({ email }: { email: string | undefined }) {
  return (
    <main className="internalStatePage">
      <section className="internalStateCard">
        <span className="internalEyebrow">Acceso en revisión</span>
        <h1>Tu usuario aún no tiene una organización activa.</h1>
        <p>
          El inicio de sesión ya funcionó para <strong>{email ?? "tu cuenta"}</strong>,
          pero todavía no existe una membresía activa en una cuenta beta.
        </p>
        <p>
          Esto es correcto en una beta asistida: el siguiente paso es asignar tu
          usuario a una organización y a un rol operativo.
        </p>
      </section>
    </main>
  );
}

function InternalShell({
  session,
  membership,
}: {
  session: Session;
  membership: MembershipRecord;
}) {
  const userName = useMemo(() => {
    return (
      session.user.user_metadata.full_name ||
      session.user.user_metadata.name ||
      session.user.email ||
      "Usuario beta"
    );
  }, [session.user.email, session.user.user_metadata.full_name, session.user.user_metadata.name]);
  const canManageTeam = membership.role === "account_admin" || membership.role === "platform_admin";
  const [activeView, setActiveView] = useState<AppView>(() => getViewFromHash(window.location.hash));
  const currentViewMeta = internalViewMeta[activeView];

  useEffect(() => {
    const syncView = () => setActiveView(getViewFromHash(window.location.hash));
    window.addEventListener("hashchange", syncView);
    syncView();
    return () => window.removeEventListener("hashchange", syncView);
  }, []);

  function navigateTo(view: AppView) {
    const nextHash = buildViewHash(view);
    if (window.location.hash !== nextHash) {
      window.location.hash = nextHash;
    } else {
      setActiveView(view);
    }
  }

  async function handleSignOut() {
    if (!supabase) return;
    await supabase.auth.signOut();
  }

  return (
    <main className="internalShell">
      <aside className="internalSidebar">
        <img className="internalSidebarLogo" src={logoUrl} alt="LexControl" />

        <div className="internalSidebarBlock">
          <span className="internalSidebarLabel">Cuenta</span>
          <strong>{membership.organization?.name ?? "Sin organización"}</strong>
          <span>{getDemoStatusLabel(membership.organization?.account_status)}</span>
        </div>

        <div className="internalSidebarBlock internalSidebarStatus">
          <span className="internalSidebarLabel">Demo</span>
          <strong>
            {getDaysRemaining(membership.organization?.trial_ends_at ?? null) ?? "-"} días
          </strong>
          <span>
            {membership.organization?.process_limit ?? 100} procesos · {membership.organization?.member_limit ?? 4} responsables
          </span>
        </div>

        <nav className="internalSidebarNav" aria-label="Módulos internos">
          {internalNavItems.map((item) => (
            <a
              key={item.view}
              href={buildViewHash(item.view)}
              className={activeView === item.view ? "is-active" : undefined}
              onClick={(event) => {
                event.preventDefault();
                navigateTo(item.view);
              }}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <button className="internalGhostButton" type="button" onClick={handleSignOut}>
          Cerrar sesión
        </button>
      </aside>

      <section className="internalContent">
        <header className="internalHeader">
          <div>
            <span className="internalEyebrow">{currentViewMeta.eyebrow}</span>
            <h1>{currentViewMeta.title}</h1>
            <p>{currentViewMeta.description}</p>
          </div>
          <div className="internalHeaderMeta">
            <span>{membership.organization?.name ?? "Sin organización"}</span>
            <span>Hola, {userName}</span>
            <span>Rol: {membership.role.replace("_", " ")}</span>
          </div>
        </header>

        {activeView === "inicio" ? (
          <>
            <DemoStatusPanel accessToken={session.access_token} membership={membership} />
            <section className="internalModuleList">
              <header>
                <span className="internalEyebrow">Ruta actual</span>
                <h2>La cuenta ya opera sobre una arquitectura clara.</h2>
              </header>

              <div className="internalModuleCards">
                {internalModules.map((module) => (
                  <article key={module.name}>
                    <div>
                      <strong>{module.name}</strong>
                      <span>{module.status}</span>
                    </div>
                    <p>{module.description}</p>
                  </article>
                ))}
              </div>
            </section>
            <InternalProcessManager organizationId={membership.organization_id} view="inicio" />
          </>
        ) : null}

        {activeView === "equipo" ? (
          <>
            <DemoStatusPanel accessToken={session.access_token} membership={membership} />
            <TeamManager accessToken={session.access_token} canManage={canManageTeam} />
          </>
        ) : null}

        {activeView === "bandeja" ? (
          <InternalProcessManager organizationId={membership.organization_id} view="bandeja" />
        ) : null}

        {activeView === "procesos" ? (
          <InternalProcessManager organizationId={membership.organization_id} view="procesos" />
        ) : null}

        {activeView === "consultas" ? (
          <InternalProcessManager organizationId={membership.organization_id} view="consultas" />
        ) : null}
      </section>
    </main>
  );
}

export function InternalApp() {
  const [session, setSession] = useState<Session | null>(null);
  const [membership, setMembership] = useState<MembershipRecord | null>(null);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    const client = supabase;
    let isMounted = true;

    async function bootstrap() {
      setLoading(true);
      setError(null);

      const {
        data: { session: currentSession },
      } = await client.auth.getSession();

      if (!isMounted) return;
      setSession(currentSession);

      if (!currentSession) {
        setMembership(null);
        setLoading(false);
        return;
      }

      try {
        const nextMembership = await loadPrimaryMembership(currentSession.user.id);
        if (!isMounted) return;
        setMembership(nextMembership);
      } catch (membershipError) {
        if (!isMounted) return;
        setError(
          membershipError instanceof Error
            ? membershipError.message
            : "No fue posible cargar la membresía activa.",
        );
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    void bootstrap();

    const { data: listener } = client.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);

      if (!nextSession) {
        setMembership(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      void loadPrimaryMembership(nextSession.user.id)
        .then((nextMembership) => {
          setMembership(nextMembership);
          setError(null);
        })
        .catch((membershipError) => {
          setError(
            membershipError instanceof Error
              ? membershipError.message
              : "No fue posible cargar la membresía activa.",
          );
        })
        .finally(() => {
          setLoading(false);
        });
    });

    return () => {
      isMounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  if (!isSupabaseConfigured) {
    return <InternalConfigurationState />;
  }

  if (isLoading) {
    return (
      <main className="internalStatePage">
        <section className="internalStateCard">
          <span className="internalEyebrow">Cargando</span>
          <h1>Preparando la consola interna.</h1>
          <p>Estamos levantando sesión, membresía y organización activa.</p>
        </section>
      </main>
    );
  }

  if (!session) {
    return <InternalAuthScreen />;
  }

  if (error) {
    return (
      <main className="internalStatePage">
        <section className="internalStateCard">
          <span className="internalEyebrow">Error de acceso</span>
          <h1>No pudimos resolver tu membresía.</h1>
          <p>{error}</p>
        </section>
      </main>
    );
  }

  if (!membership) {
    return <InternalNoMembershipState email={session.user.email} />;
  }

  if (!membership.organization_id) {
    return (
      <main className="internalStatePage">
        <section className="internalStateCard">
          <span className="internalEyebrow">Cuenta incompleta</span>
          <h1>Tu membresía no tiene organización asociada.</h1>
          <p>
            El usuario ya está autenticado, pero falta completar la asociación con
            una cuenta beta antes de cargar procesos.
          </p>
        </section>
      </main>
    );
  }

  return <InternalShell session={session} membership={membership} />;
}
