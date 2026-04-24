import { useEffect, useMemo, useRef, useState } from "react";
import type { FormEvent } from "react";
import type { Session } from "@supabase/supabase-js";
import { Activity, House, Inbox, LogOut, Settings2 } from "lucide-react";
import { isLikelyRadicado, normalizeRadicado } from "../../../packages/core/src";
import { AppSidebar } from "@/components/shell/app-sidebar";
import { PageHeader } from "@/components/shell/page-header";
import { DetailSection } from "@/components/domain/detail-section";
import { FilterBar } from "@/components/domain/filter-bar";
import { OperationalBadge } from "@/components/domain/operational-badge";
import { StateScreen } from "@/components/domain/state-screen";
import { StatCard } from "@/components/domain/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import lexSymbolUrl from "./assets/lex-control-logo-symbol.png";
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
  priority_manual: "low" | "normal" | "high" | "critical";
  priority_calculated: "low" | "normal" | "high" | "critical";
  priority_final: "low" | "normal" | "high" | "critical";
  attention_level: "silencio_operativo" | "atencion_visible" | "atencion_elevada" | "interrupcion";
  priority_reason: string | null;
  attention_reason: string | null;
  attention_updated_at: string | null;
  responsible_membership_id: string | null;
  assignment_origin: "manual" | "rule" | "default" | "unassigned";
  status: "active" | "paused" | "closed";
  created_at: string;
};

type OrganizationOperationalRulesRecord = {
  id: string;
  organization_id: string;
  consultation_rules: Record<string, unknown>;
  priority_rules: Record<string, unknown>;
  attention_rules: Record<string, unknown>;
  assignment_rules: Record<string, unknown>;
  notification_rules: Record<string, unknown>;
  escalation_rules: Record<string, unknown>;
  created_at: string;
  updated_at: string;
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
  priorityManual: InternalCaseRow["priority_manual"];
  priorityCalculated: InternalCaseRow["priority_calculated"];
  attentionLevel: InternalCaseRow["attention_level"];
  priorityReason: InternalCaseRow["priority_reason"];
  attentionReason: InternalCaseRow["attention_reason"];
  attentionUpdatedAt: InternalCaseRow["attention_updated_at"];
  assignmentOrigin: InternalCaseRow["assignment_origin"];
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

type OperationalRulesRecalculationResponse = {
  updated_count: number;
  default_assigned_count: number;
  elevated_attention_count: number;
};

type MonitoringSyncResponse = {
  phase: "idle" | "initiating" | "partial" | "complete";
  batchSize: number;
  before: {
    caseCount: number;
    sourceCount: number;
    pendingCount: number;
    activeCount: number;
    errorCount: number;
    blockedCount: number;
    notFoundCount: number;
    snapshotCount: number;
  };
  after: {
    caseCount: number;
    sourceCount: number;
    pendingCount: number;
    activeCount: number;
    errorCount: number;
    blockedCount: number;
    notFoundCount: number;
    snapshotCount: number;
  };
  batchResult: {
    status: "idle" | "ok";
    message?: string;
    processed: number;
    recalculations: Array<Record<string, unknown>>;
    results: Array<Record<string, unknown>>;
  };
};

type InternalLexMessage = {
  id: number;
  role: "user" | "lex";
  content: string;
};

type InternalLexIntent =
  | "attention"
  | "priority"
  | "coverage"
  | "errors"
  | "events"
  | "selected-case";

type InternalLexContext = {
  sourceView: ProcessManagerView;
  rows: OperationalCaseRow[];
  visibleRows: OperationalCaseRow[];
  statusFilter: string;
  ownerFilter: string;
  priorityFilter: string;
  selectedCase: OperationalCaseRow | null;
  summary: {
    total: number;
    conNovedad: number;
    requiereRevision: number;
    erroresFuente: number;
    eventosActivos: number;
  };
};

type AccountUsage = {
  processCount: number;
  memberCount: number;
};

type AppView = "inicio" | "bandeja" | "monitoreo" | "configuracion";
type ProcessManagerView = "inicio" | "bandeja" | "procesos" | "monitoreo";
type RuleFamilyKey =
  | "consulta"
  | "prioridad"
  | "atencion"
  | "asignacion"
  | "notificaciones"
  | "escalamiento";

type OperationalRulesDraft = {
  consultaCritica: string;
  consultaAlta: string;
  consultaPuntual: boolean;
  proteccionFuente: string;
  prioridadBase: string;
  prioridadEvento: string;
  prioridadSinResponsable: boolean;
  atencionSilencio: string;
  atencionBandeja: string;
  atencionEventos: string;
  asignacionDefault: string;
  asignacionSinResponsable: string;
  asignacionCobertura: boolean;
  notificacionCanal: string;
  notificacionResumen: string;
  notificacionUmbral: string;
  escalamientoPersistencia: string;
  escalamientoEventos: string;
  escalamientoSinCobertura: boolean;
};

const defaultOperationalRulesDraft: OperationalRulesDraft = {
  consultaCritica: "Cada hora",
  consultaAlta: "Cada 4 horas",
  consultaPuntual: true,
  proteccionFuente: "Equilibrada",
  prioridadBase: "La mayor entre manual y calculada",
  prioridadEvento: "Audiencia próxima o término cercano",
  prioridadSinResponsable: true,
  atencionSilencio: "Mantener en silencio los procesos estables",
  atencionBandeja: "Elevar errores de fuente y requiere revisión",
  atencionEventos: "Elevar eventos próximos a 3 días",
  asignacionDefault: "Administrador de cuenta",
  asignacionSinResponsable: "Mantener visible y elevar si hay novedad",
  asignacionCobertura: true,
  notificacionCanal: "Email",
  notificacionResumen: "Diario",
  notificacionUmbral: "Alta",
  escalamientoPersistencia: "Después de 2 corridas fallidas",
  escalamientoEventos: "A 48 horas del evento",
  escalamientoSinCobertura: true,
};

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

function getInternalLexPrompts(
  activeView: AppView,
  context: InternalLexContext | null,
): Array<{ label: string; value: string; intent: InternalLexIntent }> {
  const prompts: Array<{ label: string; value: string; intent: InternalLexIntent }> = [
    {
      label: "¿Qué requiere atención ahora?",
      value: "¿Qué requiere atención ahora?",
      intent: "attention",
    },
    {
      label: "¿Qué errores de fuente pesan más?",
      value: "¿Qué errores de fuente requieren revisión prioritaria?",
      intent: "errors",
    },
    {
      label: "¿Quién está sin cobertura?",
      value: "¿Qué procesos están sin responsable o con cobertura débil?",
      intent: "coverage",
    },
  ];

  if (activeView === "monitoreo") {
    prompts.splice(
      1,
      0,
      {
        label: "¿Cómo está la salud operativa?",
        value: "¿Cómo está la salud operativa de la cartera?",
        intent: "errors",
      },
      {
        label: "¿Qué eventos vienen encima?",
        value: "¿Qué eventos próximos merecen atención?",
        intent: "events",
      },
    );
  } else {
    prompts.splice(
      1,
      0,
      {
        label: "¿Por qué subieron de prioridad?",
        value: "¿Por qué estos procesos subieron de prioridad?",
        intent: "priority",
      },
      {
        label: "¿Qué eventos están cerca?",
        value: "¿Qué eventos próximos merecen atención?",
        intent: "events",
      },
    );
  }

  if (context?.selectedCase) {
    prompts.unshift({
      label: `¿Por qué ${context.selectedCase.radicado} requiere atención?`,
      value: `¿Por qué el proceso ${context.selectedCase.radicado} requiere atención?`,
      intent: "selected-case",
    });
  }

  return prompts.slice(0, 5);
}

function buildInternalLexRows(rows: OperationalCaseRow[]) {
  return rows.map((row) => ({
    radicado: row.radicado,
    owner: row.responsible,
    priority: row.priority,
    attentionLevel: row.attentionLevel,
    priorityReason: row.priorityReason,
    attentionReason: row.attentionReason,
    assignmentOrigin: row.assignmentOrigin,
    operationalStatus: row.operationalStatus,
    latestActionTitle: row.latestActionTitle,
    latestActionDescription: row.latestActionDescription,
    latestEventTitle: row.latestEventTitle,
    latestEventDate: row.latestEventDate,
    eventKind: row.latestEventType,
    statusType: row.operationalStatus,
    action: row.latestActionTitle || undefined,
    actionType: row.latestEventType || undefined,
    eventDateLabel: row.latestEventDate || undefined,
  }));
}

function buildInternalLexFallback(question: string, context: InternalLexContext | null) {
  if (!context) {
    return "Todavía estoy preparando el contexto operativo de la cuenta. En unos segundos ya podré resumirte atención, prioridad y cobertura.";
  }

  const value = question
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .trim();
  const focusRows = context.visibleRows.length ? context.visibleRows : context.rows;
  const urgentRows = focusRows.filter(
    (row) =>
      row.attentionLevel !== "silencio_operativo" ||
      row.operationalStatus === "error_fuente" ||
      row.operationalStatus === "requiere_revision",
  );
  const sourceErrors = focusRows.filter((row) => row.operationalStatus === "error_fuente");
  const uncovered = focusRows.filter(
    (row) => !row.responsible || row.assignmentOrigin === "unassigned",
  );
  const upcomingEvents = focusRows.filter((row) => Boolean(row.latestEventDate));

  if (value.includes("por que") || value.includes("por qué")) {
    const selectedCase = context.selectedCase;
    if (selectedCase) {
      return `${selectedCase.radicado} está en ${formatAttentionLevel(selectedCase.attentionLevel)} por ${formatDerivedReason(selectedCase.attentionReason)} y su prioridad quedó ${formatPriorityLabel(selectedCase.priority)} por ${formatDerivedReason(selectedCase.priorityReason)}.`;
    }
  }

  if (value.includes("cobertura") || value.includes("responsable")) {
    if (!uncovered.length) {
      return "No veo procesos sin cobertura crítica en la vista actual. La asignación visible está contenida.";
    }

    return uncovered
      .slice(0, 5)
      .map((row) => `${row.radicado}: ${row.operationalStatus.replaceAll("_", " ")} · ${row.attentionReason ? formatDerivedReason(row.attentionReason) : "sin razón visible"}`)
      .join(". ");
  }

  if (value.includes("error") || value.includes("fuente") || value.includes("salud")) {
    if (!sourceErrors.length) {
      return "No veo errores de fuente dominando esta vista. La salud operativa se sostiene sobre procesos estables y algunos puntos de revisión.";
    }

    return sourceErrors
      .slice(0, 5)
      .map((row) => `${row.radicado}: ${formatSourceStatus(row.sourceStatus)} · ${row.attentionReason ? formatDerivedReason(row.attentionReason) : "requiere revisión"}`)
      .join(". ");
  }

  if (value.includes("evento") || value.includes("audiencia") || value.includes("termino") || value.includes("término")) {
    if (!upcomingEvents.length) {
      return "No veo eventos próximos destacados en esta vista. La cartera se ve más estable que urgente.";
    }

    return upcomingEvents
      .slice(0, 5)
      .map((row) => `${row.radicado}: ${row.latestEventTitle || "evento activo"} · ${row.latestEventDate ? formatShortDate(row.latestEventDate) : "sin fecha visible"}`)
      .join(". ");
  }

  if (urgentRows.length === 0) {
    return `Ahora mismo la vista se ve más silenciosa que urgente. ${context.summary.total} procesos visibles, ${context.summary.eventosActivos} con evento activo y ${context.summary.erroresFuente} con error de fuente.`;
  }

  return urgentRows
    .slice(0, 4)
    .map(
      (row) =>
        `${row.radicado}: ${formatAttentionLevel(row.attentionLevel)} por ${formatDerivedReason(row.attentionReason)}.`,
    )
    .join(" ");
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

async function triggerMonitoringSync(accessToken: string, batchSize = 10) {
  const response = await fetch("/api/monitoring-sync", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ batchSize }),
  });

  const payload = (await response.json()) as MonitoringSyncResponse | { error?: string };

  if (!response.ok) {
    throw new Error(
      "error" in payload && typeof payload.error === "string"
        ? payload.error
        : "No fue posible iniciar la vigilancia.",
    );
  }

  return payload as MonitoringSyncResponse;
}

async function loadAccountUsage(organizationId: string, accessToken: string) {
  if (!supabase) {
    throw new Error("Supabase no está configurado.");
  }

  const [{ count: nextProcessCount, error: processError }, teamResponse] = await Promise.all([
    supabase
      .from("cases")
      .select("id", { count: "exact", head: true })
      .eq("organization_id", organizationId)
      .eq("status", "active"),
    fetchTeamMembers(accessToken),
  ]);

  if (processError) {
    throw processError;
  }

  return {
    processCount: nextProcessCount ?? 0,
    memberCount: teamResponse.activeCount,
  } satisfies AccountUsage;
}

const internalModules = [
  {
    name: "Inicio",
    status: "Operando",
    description: "Panorama ejecutivo de cuenta, capacidad disponible y salud operativa.",
  },
  {
    name: "Bandeja",
    status: "Operando",
    description: "Cola de atención con procesos priorizados, detalle y evidencia operativa.",
  },
  {
    name: "Monitoreo",
    status: "Operando",
    description: "Corridas, fuentes, snapshots y alertas que sostienen la cobertura.",
  },
  {
    name: "Configuración",
    status: "En expansión",
    description: "Firma, colaboradores, procesos y reglas operativas en una sola superficie.",
  },
];

const internalNavSections: Array<{
  label: string;
  items: Array<{ view: AppView; label: string }>;
}> = [
  {
    label: "Operación",
    items: [
      { view: "inicio", label: "Inicio" },
      { view: "bandeja", label: "Bandeja" },
      { view: "monitoreo", label: "Monitoreo" },
    ],
  },
  {
    label: "Cuenta",
    items: [
      { view: "configuracion", label: "Configuración" },
    ],
  },
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
  monitoreo: {
    eyebrow: "Supervisión",
    title: "Monitoreo",
    description: "Estado de fuente, snapshots y alertas que sostienen la operación.",
  },
  configuracion: {
    eyebrow: "Sistema operativo",
    title: "Configuración",
    description: "Firma, colaboradores, procesos y reglas operativas para este bufete.",
  },
};

function getViewFromHash(hash: string): AppView {
  const cleaned = hash.replace(/^#\/?/, "").trim().toLowerCase();

  if (cleaned === "inicio" || cleaned === "bandeja" || cleaned === "monitoreo" || cleaned === "configuracion") {
    return cleaned;
  }

  if (cleaned === "consultas") return "monitoreo";
  if (cleaned === "procesos" || cleaned === "equipo") return "configuracion";

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
    .select(
      "id, radicado, normalized_radicado, internal_owner, priority, priority_manual, priority_calculated, priority_final, attention_level, priority_reason, attention_reason, attention_updated_at, responsible_membership_id, assignment_origin, status, created_at",
    )
    .eq("organization_id", organizationId)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    throw error;
  }

  return (data as InternalCaseRow[]) ?? [];
}

async function loadOrganizationOperationalRules(organizationId: string) {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("organization_operational_rules")
    .select(
      "id, organization_id, consultation_rules, priority_rules, attention_rules, assignment_rules, notification_rules, escalation_rules, created_at, updated_at",
    )
    .eq("organization_id", organizationId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return (data as OrganizationOperationalRulesRecord | null) ?? null;
}

async function updateOrganizationOperationalRules(
  rulesId: string,
  payload: Pick<
    OrganizationOperationalRulesRecord,
    | "consultation_rules"
    | "priority_rules"
    | "attention_rules"
    | "assignment_rules"
    | "notification_rules"
    | "escalation_rules"
  >,
) {
  if (!supabase) {
    throw new Error("Supabase no está configurado.");
  }

  const { data, error } = await supabase
    .from("organization_operational_rules")
    .update(payload)
    .eq("id", rulesId)
    .select(
      "id, organization_id, consultation_rules, priority_rules, attention_rules, assignment_rules, notification_rules, escalation_rules, created_at, updated_at",
    )
    .single();

  if (error) {
    throw error;
  }

  return data as OrganizationOperationalRulesRecord;
}

async function recalculateOrganizationCaseDerivedFields(organizationId: string) {
  if (!supabase) {
    throw new Error("Supabase no está configurado.");
  }

  const { data, error } = await supabase
    .rpc("recalculate_organization_case_derived_fields", {
      target_organization_id: organizationId,
    })
    .single();

  if (error) {
    throw error;
  }

  return data as OperationalRulesRecalculationResponse;
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

function titleCaseFromEmail(value: string | null | undefined) {
  if (!value) return "Usuario";

  const localPart = value.split("@")[0] || value;

  return localPart
    .split(/[._-]+/)
    .filter(Boolean)
    .map((fragment) => fragment.charAt(0).toUpperCase() + fragment.slice(1))
    .join(" ");
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

function formatSourceStatus(value: OperationalCaseRow["sourceStatus"]) {
  switch (value) {
    case "active":
      return "Consulta activa";
    case "pending":
      return "Pendiente";
    case "paused":
      return "Pausada";
    case "error":
      return "Error de fuente";
    case "blocked":
      return "Fuente bloqueada";
    case "not_found":
      return "No encontrado";
    default:
      return value;
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

function formatSnapshotStatus(value: InternalSnapshotRow["fetch_status"]) {
  switch (value) {
    case "success":
      return "Consulta exitosa";
    case "error":
      return "Error";
    case "blocked":
      return "Bloqueada";
    case "not_found":
      return "No encontrado";
    default:
      return value;
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

function formatEventType(value: InternalLegalEventRow["event_type"]) {
  switch (value) {
    case "audiencia":
      return "Audiencia";
    case "termino":
      return "Término";
    case "vencimiento":
      return "Vencimiento";
    case "actuacion":
      return "Actuación";
    case "otro":
      return "Otro";
    default:
      return value;
  }
}

function formatChangeStatus(value: InternalLegalEventRow["change_status"]) {
  switch (value) {
    case "new":
      return "Nuevo";
    case "unchanged":
      return "Sin cambios";
    case "changed":
      return "Actualizado";
    case "cancelled":
      return "Cancelado";
    default:
      return value;
  }
}

function formatPriorityLabel(value: InternalCaseRow["priority"]) {
  switch (value) {
    case "critical":
      return "Crítica";
    case "high":
      return "Alta";
    case "normal":
      return "Normal";
    case "low":
      return "Baja";
    default:
      return value;
  }
}

function formatCaseRecordStatus(value: InternalCaseRow["status"]) {
  switch (value) {
    case "active":
      return "Activo";
    case "paused":
      return "Pausado";
    case "closed":
      return "Cerrado";
    default:
      return value;
  }
}

function getPriorityTone(value: InternalCaseRow["priority"]) {
  switch (value) {
    case "critical":
      return "error";
    case "high":
      return "warning";
    case "normal":
      return "info";
    case "low":
      return "neutral";
    default:
      return "neutral";
  }
}

function formatAttentionLevel(value: InternalCaseRow["attention_level"] | OperationalCaseRow["attentionLevel"]) {
  switch (value) {
    case "silencio_operativo":
      return "Silencio operativo";
    case "atencion_visible":
      return "Atención visible";
    case "atencion_elevada":
      return "Atención elevada";
    case "interrupcion":
      return "Interrupción";
    default:
      return "Atención";
  }
}

function getAttentionTone(value: InternalCaseRow["attention_level"] | OperationalCaseRow["attentionLevel"]) {
  switch (value) {
    case "silencio_operativo":
      return "ok";
    case "atencion_visible":
      return "info";
    case "atencion_elevada":
      return "review";
    case "interrupcion":
      return "error";
    default:
      return "neutral";
  }
}

function formatAssignmentOrigin(value: InternalCaseRow["assignment_origin"] | OperationalCaseRow["assignmentOrigin"]) {
  switch (value) {
    case "manual":
      return "Manual";
    case "rule":
      return "Por regla";
    case "default":
      return "Por default";
    case "unassigned":
      return "Sin asignación";
    default:
      return value;
  }
}

function formatDerivedReason(value: string | null) {
  switch (value) {
    case "evento_critico":
      return "Evento crítico";
    case "evento_proximo":
      return "Evento próximo";
    case "error_fuente":
      return "Error de fuente";
    case "requiere_revision":
      return "Requiere revisión";
    case "novedad_reciente":
      return "Novedad reciente";
    case "proceso_no_encontrado":
      return "Proceso no encontrado";
    case "sin_responsable_con_novedad":
      return "Sin responsable con novedad";
    case "estable":
      return "Estable";
    case "silencio_por_estabilidad":
      return "Silencio por estabilidad";
    case "visible_por_novedad":
      return "Visible por novedad";
    case "elevada_por_riesgo":
      return "Elevada por riesgo";
    case "interrupcion_por_criticidad":
      return "Interrupción por criticidad";
    default:
      return value ? value.replace(/_/g, " ") : "Sin razón visible";
  }
}

function getBadgeVariantFromTone(
  value: "info" | "warning" | "error" | "ok" | "review" | "neutral",
): "info" | "warning" | "error" | "success" | "neutral" {
  switch (value) {
    case "ok":
      return "success";
    case "review":
      return "warning";
    case "info":
    case "warning":
    case "error":
    case "neutral":
      return value;
    default:
      return "neutral";
  }
}

function buildOperationalRulesDraft(
  rules: OrganizationOperationalRulesRecord | null,
  teamMembers: TeamMemberRecord[],
): OperationalRulesDraft {
  if (!rules) {
    return defaultOperationalRulesDraft;
  }

  const consultationRules = rules.consultation_rules || {};
  const priorityRules = rules.priority_rules || {};
  const attentionRules = rules.attention_rules || {};
  const assignmentRules = rules.assignment_rules || {};
  const notificationRules = rules.notification_rules || {};
  const escalationRules = rules.escalation_rules || {};

  const defaultMembershipId =
    typeof assignmentRules.default_membership_id === "string" ? assignmentRules.default_membership_id : null;
  const defaultMember = defaultMembershipId
    ? teamMembers.find((member) => member.id === defaultMembershipId)
    : null;

  return {
    consultaCritica:
      consultationRules.critical_frequency === "hourly"
        ? "Cada hora"
        : consultationRules.critical_frequency === "every_2_hours"
          ? "Cada 2 horas"
          : consultationRules.critical_frequency === "every_4_hours"
            ? "Cada 4 horas"
            : defaultOperationalRulesDraft.consultaCritica,
    consultaAlta:
      consultationRules.high_frequency === "every_4_hours"
        ? "Cada 4 horas"
        : consultationRules.high_frequency === "every_8_hours"
          ? "Cada 8 horas"
          : consultationRules.high_frequency === "daily"
            ? "Diaria"
            : defaultOperationalRulesDraft.consultaAlta,
    consultaPuntual:
      typeof consultationRules.point_query_enabled === "boolean"
        ? consultationRules.point_query_enabled
        : defaultOperationalRulesDraft.consultaPuntual,
    proteccionFuente:
      consultationRules.source_protection_mode === "strict"
        ? "Estricta"
        : consultationRules.source_protection_mode === "intensive"
          ? "Intensiva"
          : "Equilibrada",
    prioridadBase:
      priorityRules.final_resolution === "manual_precedes"
        ? "Manual prevalece"
        : priorityRules.final_resolution === "calculated_precedes"
          ? "Calculada prevalece"
          : "La mayor entre manual y calculada",
    prioridadEvento:
      priorityRules.event_proximity_factor === "actuacion_relevante_reciente"
        ? "Actuación relevante reciente"
        : priorityRules.event_proximity_factor === "error_fuente_persistente"
          ? "Error de fuente persistente"
          : "Audiencia próxima o término cercano",
    prioridadSinResponsable:
      typeof priorityRules.raise_if_unassigned_with_change === "boolean"
        ? priorityRules.raise_if_unassigned_with_change
        : defaultOperationalRulesDraft.prioridadSinResponsable,
    atencionSilencio:
      attentionRules.stable_cases_mode === "show_in_summary"
        ? "Mostrar estables en resumen"
        : "Mantener en silencio los procesos estables",
    atencionBandeja:
      attentionRules.bandeja_elevation_mode === "only_relevant_change"
        ? "Elevar solo novedad relevante"
        : "Elevar errores de fuente y requiere revisión",
    atencionEventos:
      Number(attentionRules.upcoming_event_window_days || 3) === 5
        ? "Elevar eventos próximos a 5 días"
        : Number(attentionRules.upcoming_event_window_days || 3) === 1
          ? "Elevar solo en 24 horas"
          : "Elevar eventos próximos a 3 días",
    asignacionDefault: defaultMember ? getTeamMemberName(defaultMember) : "Administrador de cuenta",
    asignacionSinResponsable:
      assignmentRules.unassigned_behavior === "assign_default_immediately"
        ? "Asignar por default inmediatamente"
        : assignmentRules.unassigned_behavior === "send_to_manual_review"
          ? "Enviar a revisión manual"
          : "Mantener visible y elevar si hay novedad",
    asignacionCobertura:
      typeof assignmentRules.highlight_uncovered_cases === "boolean"
        ? assignmentRules.highlight_uncovered_cases
        : defaultOperationalRulesDraft.asignacionCobertura,
    notificacionCanal:
      notificationRules.base_channel === "internal"
        ? "Solo interno"
        : notificationRules.base_channel === "whatsapp"
          ? "WhatsApp"
          : "Email",
    notificacionResumen:
      notificationRules.summary_frequency === "twice_daily"
        ? "Dos veces al día"
        : notificationRules.summary_frequency === "weekly"
          ? "Semanal"
          : "Diario",
    notificacionUmbral:
      notificationRules.interrupt_threshold === "critical"
        ? "Crítica"
        : notificationRules.interrupt_threshold === "normal"
          ? "Normal"
          : "Alta",
    escalamientoPersistencia:
      Number(escalationRules.persistent_failure_threshold || 2) === 3
        ? "Después de 3 corridas fallidas"
        : Number(escalationRules.persistent_failure_threshold || 2) === 24
          ? "Después de 24 horas"
          : "Después de 2 corridas fallidas",
    escalamientoEventos:
      Number(escalationRules.upcoming_event_window_hours || 48) === 24
        ? "A 24 horas del evento"
        : Number(escalationRules.upcoming_event_window_hours || 48) === 72
          ? "A 72 horas del evento"
          : "A 48 horas del evento",
    escalamientoSinCobertura:
      typeof escalationRules.raise_if_critical_without_owner === "boolean"
        ? escalationRules.raise_if_critical_without_owner
        : defaultOperationalRulesDraft.escalamientoSinCobertura,
  };
}

function serializeOperationalRulesDraft(
  draft: OperationalRulesDraft,
  teamMembers: TeamMemberRecord[],
): Pick<
  OrganizationOperationalRulesRecord,
  | "consultation_rules"
  | "priority_rules"
  | "attention_rules"
  | "assignment_rules"
  | "notification_rules"
  | "escalation_rules"
> {
  const defaultMember = teamMembers.find((member) => getTeamMemberName(member) === draft.asignacionDefault) || null;

  return {
    consultation_rules: {
      critical_frequency:
        draft.consultaCritica === "Cada 2 horas"
          ? "every_2_hours"
          : draft.consultaCritica === "Cada 4 horas"
            ? "every_4_hours"
            : "hourly",
      high_frequency:
        draft.consultaAlta === "Cada 8 horas"
          ? "every_8_hours"
          : draft.consultaAlta === "Diaria"
            ? "daily"
            : "every_4_hours",
      point_query_enabled: draft.consultaPuntual,
      source_protection_mode:
        draft.proteccionFuente === "Estricta"
          ? "strict"
          : draft.proteccionFuente === "Intensiva"
            ? "intensive"
            : "balanced",
    },
    priority_rules: {
      final_resolution:
        draft.prioridadBase === "Manual prevalece"
          ? "manual_precedes"
          : draft.prioridadBase === "Calculada prevalece"
            ? "calculated_precedes"
            : "max_manual_and_calculated",
      event_proximity_factor:
        draft.prioridadEvento === "Actuación relevante reciente"
          ? "actuacion_relevante_reciente"
          : draft.prioridadEvento === "Error de fuente persistente"
            ? "error_fuente_persistente"
            : "audiencia_o_termino_cercano",
      raise_if_unassigned_with_change: draft.prioridadSinResponsable,
    },
    attention_rules: {
      stable_cases_mode: draft.atencionSilencio === "Mostrar estables en resumen" ? "show_in_summary" : "keep_silent",
      bandeja_elevation_mode:
        draft.atencionBandeja === "Elevar solo novedad relevante" ? "only_relevant_change" : "source_error_and_review",
      upcoming_event_window_days:
        draft.atencionEventos === "Elevar eventos próximos a 5 días"
          ? 5
          : draft.atencionEventos === "Elevar solo en 24 horas"
            ? 1
            : 3,
    },
    assignment_rules: {
      default_membership_id: defaultMember?.id ?? null,
      unassigned_behavior:
        draft.asignacionSinResponsable === "Asignar por default inmediatamente"
          ? "assign_default_immediately"
          : draft.asignacionSinResponsable === "Enviar a revisión manual"
            ? "send_to_manual_review"
            : "visible_and_raise_if_changed",
      highlight_uncovered_cases: draft.asignacionCobertura,
    },
    notification_rules: {
      base_channel:
        draft.notificacionCanal === "Solo interno"
          ? "internal"
          : draft.notificacionCanal === "WhatsApp"
            ? "whatsapp"
            : "email",
      summary_frequency:
        draft.notificacionResumen === "Dos veces al día"
          ? "twice_daily"
          : draft.notificacionResumen === "Semanal"
            ? "weekly"
            : "daily",
      interrupt_threshold:
        draft.notificacionUmbral === "Crítica"
          ? "critical"
          : draft.notificacionUmbral === "Normal"
            ? "normal"
            : "high",
    },
    escalation_rules: {
      persistent_failure_threshold:
        draft.escalamientoPersistencia === "Después de 3 corridas fallidas"
          ? 3
          : draft.escalamientoPersistencia === "Después de 24 horas"
            ? 24
            : 2,
      upcoming_event_window_hours:
        draft.escalamientoEventos === "A 24 horas del evento"
          ? 24
          : draft.escalamientoEventos === "A 72 horas del evento"
            ? 72
            : 48,
      raise_if_critical_without_owner: draft.escalamientoSinCobertura,
    },
  };
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
      priority: legalCase.priority_final || legalCase.priority,
      priorityManual: legalCase.priority_manual,
      priorityCalculated: legalCase.priority_calculated,
      attentionLevel: legalCase.attention_level,
      priorityReason: legalCase.priority_reason,
      attentionReason: legalCase.attention_reason,
      attentionUpdatedAt: legalCase.attention_updated_at,
      assignmentOrigin: legalCase.assignment_origin,
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

function formatMemberStatus(status: TeamMemberRecord["status"]) {
  switch (status) {
    case "active":
      return "Activo";
    case "invited":
      return "Invitado";
    case "disabled":
      return "Deshabilitado";
    default:
      return status;
  }
}

function getTeamMemberName(member: TeamMemberRecord) {
  return member.full_name || titleCaseFromEmail(member.email);
}

const operationalRulesHighlights = [
  "Consulta reforzada en casos críticos y con eventos próximos.",
  "La prioridad final combina criterio manual y señales del sistema.",
  "Los procesos sin responsable suben de visibilidad cuando pierden cobertura.",
  "Las alertas relevantes entran a resumen antes de interrumpir por canal.",
  "Los errores persistentes pueden escalar de nivel y destinatario.",
];

const operationalRuleFamilyMeta: Array<{
  key: RuleFamilyKey;
  title: string;
  effect: string;
  summary: string;
  advancedLabel: string;
}> = [
  {
    key: "consulta",
    title: "Consulta",
    effect: "Define cada cuánto vigila LexControl y cómo protege la fuente.",
    summary: "Hoy: la vigilancia sube frecuencia en casos críticos y permite consulta puntual.",
    advancedLabel: "Ver criterios de recencia y protección de fuente",
  },
  {
    key: "prioridad",
    title: "Prioridad",
    effect: "Define qué casos pesan más dentro de la cartera.",
    summary: "Hoy: la prioridad final combina criterio manual y señales del sistema.",
    advancedLabel: "Ver factores que elevan o reducen prioridad",
  },
  {
    key: "atencion",
    title: "Atención",
    effect: "Decide qué permanece en silencio y qué se eleva a Bandeja.",
    summary: "Hoy: lo estable queda cubierto y lo relevante entra a la cola de atención.",
    advancedLabel: "Ver umbrales de elevación y silencio operativo",
  },
  {
    key: "asignacion",
    title: "Asignación",
    effect: "Distribuye cobertura entre responsables reales del bufete.",
    summary: "Hoy: cada proceso puede tener un responsable principal y un default operativo.",
    advancedLabel: "Ver reglas de cobertura y procesos sin responsable",
  },
  {
    key: "notificaciones",
    title: "Notificaciones",
    effect: "Decide cuándo una señal se resume y cuándo interrumpe por canal.",
    summary: "Hoy: primero se ve en la app, luego entra a resumen y solo después interrumpe.",
    advancedLabel: "Ver severidad mínima, canal y resumen",
  },
  {
    key: "escalamiento",
    title: "Escalamiento",
    effect: "Cambia el nivel de respuesta cuando la situación ya no puede quedarse igual.",
    summary: "Hoy: la persistencia y la cercanía temporal pueden subir visibilidad, destinatario o canal.",
    advancedLabel: "Ver persistencia, cercanía y cambio de nivel",
  },
];

function TeamManager({
  accessToken,
  canManage,
  onDataChanged,
}: {
  accessToken: string;
  canManage: boolean;
  onDataChanged?: () => Promise<void> | void;
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
      await onDataChanged?.();
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
      await onDataChanged?.();
    } catch (submitError) {
      setError(getErrorMessage(submitError, "No fue posible crear el responsable."));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="rounded-[var(--ds-radius-lg)] border border-[var(--ds-color-border)] bg-white p-6 shadow-[var(--ds-shadow-xs)]" id="equipo">
      <div className="internalPanelHeader">
        <div>
          <strong>Responsables de la cuenta</strong>
          <span>Gestiona el equipo real que operará la demo.</span>
        </div>
        <Button variant="secondary" type="button" onClick={() => void refreshTeam()}>
          Recargar
        </Button>
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
        <div className="rounded-[var(--ds-radius-md)] border border-[var(--ds-color-border)] bg-[var(--ds-color-surface-subtle)] p-5">
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
                    <strong>{getTeamMemberName(member)}</strong>
                    <span>{member.email || "Sin correo"}</span>
                  </div>
                  <div className="internalTeamMeta">
                    <Badge variant={member.role === "operator" ? "info" : "warning"}>
                      {formatMemberRole(member.role)}
                    </Badge>
                    <Badge variant={member.status === "active" ? "success" : "neutral"}>
                      {formatMemberStatus(member.status)}
                    </Badge>
                  </div>
                </article>
              ))}
            </div>
          ) : null}
        </div>

        <form className="rounded-[var(--ds-radius-md)] border border-[var(--ds-color-border)] bg-[var(--ds-color-surface-subtle)] p-5" onSubmit={handleSubmit}>
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
                <Input
                  value={form.fullName}
                  onChange={(event) => setForm((current) => ({ ...current, fullName: event.target.value }))}
                  placeholder="Laura Pérez"
                  required
                />
              </label>

              <label>
                Correo
                <Input
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
                <Input
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

              <Button type="submit" disabled={isSubmitting || availableSlots === 0}>
                {isSubmitting
                  ? "Creando responsable..."
                  : availableSlots === 0
                    ? "Límite alcanzado"
                    : "Crear responsable"}
              </Button>
            </>
          ) : null}

          {error ? <p className="internalAuthError">{error}</p> : null}
        </form>
      </div>
    </section>
  );
}

function OperationalRulesPanel({
  organizationId,
  teamMembers,
  onRulesApplied,
}: {
  organizationId: string;
  teamMembers: TeamMemberRecord[];
  onRulesApplied?: () => Promise<void> | void;
}) {
  const [expandedFamilies, setExpandedFamilies] = useState<Record<RuleFamilyKey, boolean>>({
    consulta: true,
    prioridad: false,
    atencion: false,
    asignacion: false,
    notificaciones: false,
    escalamiento: false,
  });
  const [rulesRecord, setRulesRecord] = useState<OrganizationOperationalRulesRecord | null>(null);
  const [rulesDraft, setRulesDraft] = useState<OperationalRulesDraft>(defaultOperationalRulesDraft);
  const [isLoadingRules, setLoadingRules] = useState(true);
  const [isSavingRules, setSavingRules] = useState(false);
  const [rulesError, setRulesError] = useState<string | null>(null);
  const [saveFeedback, setSaveFeedback] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function refreshRules() {
      setLoadingRules(true);
      setRulesError(null);

      try {
        const nextRules = await loadOrganizationOperationalRules(organizationId);
        if (!active) return;
        setRulesRecord(nextRules);
        setRulesDraft(buildOperationalRulesDraft(nextRules, teamMembers));
      } catch (nextError) {
        if (!active) return;
        setRulesError(getErrorMessage(nextError, "No fue posible cargar las reglas operativas."));
      } finally {
        if (!active) return;
        setLoadingRules(false);
      }
    }

    void refreshRules();

    return () => {
      active = false;
    };
  }, [organizationId, teamMembers]);

  function toggleFamily(key: RuleFamilyKey) {
    setExpandedFamilies((current) => ({
      ...current,
      [key]: !current[key],
    }));
  }

  async function handleSaveRules() {
    if (!rulesRecord || isSavingRules) return;

    setSavingRules(true);
    setRulesError(null);
    setSaveFeedback(null);

    try {
      const payload = serializeOperationalRulesDraft(rulesDraft, teamMembers);
      const nextRules = await updateOrganizationOperationalRules(rulesRecord.id, payload);
      setRulesRecord(nextRules);
      setRulesDraft(buildOperationalRulesDraft(nextRules, teamMembers));
      const recalculation = await recalculateOrganizationCaseDerivedFields(organizationId);
      await onRulesApplied?.();
      setSaveFeedback(
        `Las reglas operativas quedaron guardadas. Recalculamos ${recalculation.updated_count} procesos y dejamos ${recalculation.elevated_attention_count} en atención elevada o interrupción.`,
      );
    } catch (nextError) {
      setRulesError(getErrorMessage(nextError, "No fue posible guardar las reglas operativas."));
    } finally {
      setSavingRules(false);
    }
  }

  return (
    <section className="rounded-[var(--ds-radius-lg)] border border-[var(--ds-color-border)] bg-white p-6 shadow-[var(--ds-shadow-xs)]">
      <div className="internalPanelHeader internalRulesHeader">
        <div>
          <span className="internalEyebrow">Configuración operativa</span>
          <strong>Reglas operativas</strong>
          <span>
            Ajusta cómo LexControl consulta, prioriza, asigna y eleva la operación del bufete sin volver esto un panel técnico.
          </span>
        </div>
        <div className="internalRulesHeaderActions">
          <Button
            variant="secondary"
            type="button"
            onClick={() => setRulesDraft(buildOperationalRulesDraft(rulesRecord, teamMembers))}
            disabled={isLoadingRules || isSavingRules}
          >
            Restablecer valores cargados
          </Button>
          <Button
            type="button"
            onClick={() => void handleSaveRules()}
            disabled={isLoadingRules || isSavingRules || !rulesRecord}
          >
            {isSavingRules ? "Guardando..." : "Guardar cambios"}
          </Button>
        </div>
      </div>

      <section className="internalRulesOverview">
        {operationalRulesHighlights.map((highlight) => (
          <article key={highlight}>
            <strong>{highlight}</strong>
          </article>
        ))}
      </section>

      {isLoadingRules ? <p className="internalPanelEmpty">Cargando reglas operativas de la cuenta...</p> : null}
      {rulesError ? <p className="internalAuthError">{rulesError}</p> : null}
      {saveFeedback ? <p className="internalRulesFeedback">{saveFeedback}</p> : null}

      <div className="internalRulesFamilies">
        {operationalRuleFamilyMeta.map((family) => {
          const isExpanded = expandedFamilies[family.key];

          return (
            <article key={family.key} className={`internalRuleCard ${isExpanded ? "is-expanded" : ""}`}>
              <button className="internalRuleCardHeader" type="button" onClick={() => toggleFamily(family.key)}>
                <div>
                  <strong>{family.title}</strong>
                  <p>{family.effect}</p>
                </div>
                <div className="internalRuleCardMeta">
                  <span>{family.summary}</span>
                  <span className="internalRuleCardToggle">{isExpanded ? "Ocultar" : "Expandir"}</span>
                </div>
              </button>

              {isExpanded ? (
                <div className="internalRuleCardBody">
                  {family.key === "consulta" ? (
                    <div className="internalRulesFormGrid">
                      <label>
                        Frecuencia en crítica
                        <Select
                          value={rulesDraft.consultaCritica}
                          onChange={(event) =>
                            setRulesDraft((current) => ({ ...current, consultaCritica: event.target.value }))
                          }
                        >
                          <option>Cada hora</option>
                          <option>Cada 2 horas</option>
                          <option>Cada 4 horas</option>
                        </Select>
                      </label>
                      <label>
                        Frecuencia en alta
                        <Select
                          value={rulesDraft.consultaAlta}
                          onChange={(event) =>
                            setRulesDraft((current) => ({ ...current, consultaAlta: event.target.value }))
                          }
                        >
                          <option>Cada 4 horas</option>
                          <option>Cada 8 horas</option>
                          <option>Diaria</option>
                        </Select>
                      </label>
                      <label className="internalRuleCheck">
                        <input
                          type="checkbox"
                          checked={rulesDraft.consultaPuntual}
                          onChange={(event) =>
                            setRulesDraft((current) => ({ ...current, consultaPuntual: event.target.checked }))
                          }
                        />
                        <span>Permitir consulta puntual por proceso</span>
                      </label>
                      <label>
                        Protección de fuente
                        <Select
                          value={rulesDraft.proteccionFuente}
                          onChange={(event) =>
                            setRulesDraft((current) => ({ ...current, proteccionFuente: event.target.value }))
                          }
                        >
                          <option>Estricta</option>
                          <option>Equilibrada</option>
                          <option>Intensiva</option>
                        </Select>
                      </label>
                    </div>
                  ) : null}

                  {family.key === "prioridad" ? (
                    <div className="internalRulesFormGrid">
                      <label>
                        Regla final
                        <Select
                          value={rulesDraft.prioridadBase}
                          onChange={(event) =>
                            setRulesDraft((current) => ({ ...current, prioridadBase: event.target.value }))
                          }
                        >
                          <option>La mayor entre manual y calculada</option>
                          <option>Manual prevalece</option>
                          <option>Calculada prevalece</option>
                        </Select>
                      </label>
                      <label>
                        Factor visible
                        <Select
                          value={rulesDraft.prioridadEvento}
                          onChange={(event) =>
                            setRulesDraft((current) => ({ ...current, prioridadEvento: event.target.value }))
                          }
                        >
                          <option>Audiencia próxima o término cercano</option>
                          <option>Actuación relevante reciente</option>
                          <option>Error de fuente persistente</option>
                        </Select>
                      </label>
                      <label className="internalRuleCheck">
                        <input
                          type="checkbox"
                          checked={rulesDraft.prioridadSinResponsable}
                          onChange={(event) =>
                            setRulesDraft((current) => ({
                              ...current,
                              prioridadSinResponsable: event.target.checked,
                            }))
                          }
                        />
                        <span>Elevar si el proceso cambia y no tiene responsable</span>
                      </label>
                    </div>
                  ) : null}

                  {family.key === "atencion" ? (
                    <div className="internalRulesFormGrid">
                      <label>
                        Silencio operativo
                        <Select
                          value={rulesDraft.atencionSilencio}
                          onChange={(event) =>
                            setRulesDraft((current) => ({ ...current, atencionSilencio: event.target.value }))
                          }
                        >
                          <option>Mantener en silencio los procesos estables</option>
                          <option>Mostrar estables en resumen</option>
                        </Select>
                      </label>
                      <label>
                        Elevación a Bandeja
                        <Select
                          value={rulesDraft.atencionBandeja}
                          onChange={(event) =>
                            setRulesDraft((current) => ({ ...current, atencionBandeja: event.target.value }))
                          }
                        >
                          <option>Elevar errores de fuente y requiere revisión</option>
                          <option>Elevar solo novedad relevante</option>
                        </Select>
                      </label>
                      <label>
                        Eventos próximos
                        <Select
                          value={rulesDraft.atencionEventos}
                          onChange={(event) =>
                            setRulesDraft((current) => ({ ...current, atencionEventos: event.target.value }))
                          }
                        >
                          <option>Elevar eventos próximos a 3 días</option>
                          <option>Elevar eventos próximos a 5 días</option>
                          <option>Elevar solo en 24 horas</option>
                        </Select>
                      </label>
                    </div>
                  ) : null}

                  {family.key === "asignacion" ? (
                    <div className="internalRulesFormGrid">
                      <label>
                        Responsable por default
                        <Select
                          value={rulesDraft.asignacionDefault}
                          onChange={(event) =>
                            setRulesDraft((current) => ({ ...current, asignacionDefault: event.target.value }))
                          }
                        >
                          <option>Administrador de cuenta</option>
                          <option>Primer responsable disponible</option>
                          <option>Sin asignación automática</option>
                        </Select>
                      </label>
                      <label>
                        Proceso sin responsable
                        <Select
                          value={rulesDraft.asignacionSinResponsable}
                          onChange={(event) =>
                            setRulesDraft((current) => ({ ...current, asignacionSinResponsable: event.target.value }))
                          }
                        >
                          <option>Mantener visible y elevar si hay novedad</option>
                          <option>Asignar por default inmediatamente</option>
                          <option>Enviar a revisión manual</option>
                        </Select>
                      </label>
                      <label className="internalRuleCheck">
                        <input
                          type="checkbox"
                          checked={rulesDraft.asignacionCobertura}
                          onChange={(event) =>
                            setRulesDraft((current) => ({ ...current, asignacionCobertura: event.target.checked }))
                          }
                        />
                        <span>Destacar procesos sin cobertura en Inicio y Bandeja</span>
                      </label>
                    </div>
                  ) : null}

                  {family.key === "notificaciones" ? (
                    <div className="internalRulesFormGrid">
                      <label>
                        Canal base
                        <Select
                          value={rulesDraft.notificacionCanal}
                          onChange={(event) =>
                            setRulesDraft((current) => ({ ...current, notificacionCanal: event.target.value }))
                          }
                        >
                          <option>Email</option>
                          <option>Solo interno</option>
                          <option>WhatsApp</option>
                        </Select>
                      </label>
                      <label>
                        Frecuencia de resumen
                        <Select
                          value={rulesDraft.notificacionResumen}
                          onChange={(event) =>
                            setRulesDraft((current) => ({ ...current, notificacionResumen: event.target.value }))
                          }
                        >
                          <option>Diario</option>
                          <option>Dos veces al día</option>
                          <option>Semanal</option>
                        </Select>
                      </label>
                      <label>
                        Umbral para interrumpir
                        <Select
                          value={rulesDraft.notificacionUmbral}
                          onChange={(event) =>
                            setRulesDraft((current) => ({ ...current, notificacionUmbral: event.target.value }))
                          }
                        >
                          <option>Alta</option>
                          <option>Crítica</option>
                          <option>Normal</option>
                        </Select>
                      </label>
                    </div>
                  ) : null}

                  {family.key === "escalamiento" ? (
                    <div className="internalRulesFormGrid">
                      <label>
                        Persistencia
                        <Select
                          value={rulesDraft.escalamientoPersistencia}
                          onChange={(event) =>
                            setRulesDraft((current) => ({
                              ...current,
                              escalamientoPersistencia: event.target.value,
                            }))
                          }
                        >
                          <option>Después de 2 corridas fallidas</option>
                          <option>Después de 3 corridas fallidas</option>
                          <option>Después de 24 horas</option>
                        </Select>
                      </label>
                      <label>
                        Eventos próximos
                        <Select
                          value={rulesDraft.escalamientoEventos}
                          onChange={(event) =>
                            setRulesDraft((current) => ({ ...current, escalamientoEventos: event.target.value }))
                          }
                        >
                          <option>A 48 horas del evento</option>
                          <option>A 24 horas del evento</option>
                          <option>A 72 horas del evento</option>
                        </Select>
                      </label>
                      <label className="internalRuleCheck">
                        <input
                          type="checkbox"
                          checked={rulesDraft.escalamientoSinCobertura}
                          onChange={(event) =>
                            setRulesDraft((current) => ({
                              ...current,
                              escalamientoSinCobertura: event.target.checked,
                            }))
                          }
                        />
                        <span>Escalar si un proceso crítico sigue sin responsable</span>
                      </label>
                    </div>
                  ) : null}

                  <div className="internalRuleCardAdvanced">
                    <span>{family.advancedLabel}</span>
                  </div>
                </div>
              ) : null}
            </article>
          );
        })}
      </div>
    </section>
  );
}

function ConfigurationWorkspace({
  membership,
  usage,
  accessToken,
  canManageTeam,
  organizationId,
  onDataChanged,
}: {
  membership: MembershipRecord;
  usage: {
    processCount: number | null;
    memberCount: number | null;
    isLoading: boolean;
    error: string | null;
  };
  accessToken: string;
  canManageTeam: boolean;
  organizationId: string;
  onDataChanged?: () => Promise<void> | void;
}) {
  const [teamMembers, setTeamMembers] = useState<TeamMemberRecord[]>([]);
  const [configurationRefreshToken, setConfigurationRefreshToken] = useState(0);

  async function refreshTeamMembers() {
    try {
      const next = await fetchTeamMembers(accessToken);
      setTeamMembers(next.team);
    } catch {
      setTeamMembers([]);
    }
  }

  useEffect(() => {
    void refreshTeamMembers();
  }, [accessToken]);

  async function handleConfigurationDataChanged() {
    await refreshTeamMembers();
    await onDataChanged?.();
  }

  async function handleRulesApplied() {
    setConfigurationRefreshToken((current) => current + 1);
    await handleConfigurationDataChanged();
  }

  return (
    <section className="space-y-6 px-6 py-6 lg:px-8">
      <section className="rounded-[var(--ds-radius-lg)] border border-[var(--ds-color-border)] bg-white p-6 shadow-[var(--ds-shadow-xs)]">
        <div className="space-y-2">
          <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--ds-color-text-subtle)]">
            Configuración
          </span>
          <h2 className="text-xl font-semibold tracking-tight text-[var(--ds-color-text)]">
            Afina cómo opera tu bufete dentro del sistema.
          </h2>
          <p className="max-w-3xl text-sm leading-6 text-[var(--ds-color-text-muted)]">
            Aquí viven la capacidad de la cuenta, las reglas operativas, la cobertura del equipo y el inventario vigilado. La idea no es configurar software, sino ajustar cómo se observa y distribuye la operación.
          </p>
        </div>
      </section>
      <DemoStatusPanel membership={membership} usage={usage} />
      <OperationalRulesPanel
        organizationId={organizationId}
        teamMembers={teamMembers}
        onRulesApplied={handleRulesApplied}
      />
      <div className="space-y-6">
        <TeamManager
          accessToken={accessToken}
          canManage={canManageTeam}
          onDataChanged={handleConfigurationDataChanged}
        />
        <InternalProcessManager
          organizationId={organizationId}
          accessToken={accessToken}
          refreshToken={configurationRefreshToken}
          view="procesos"
          onDataChanged={handleConfigurationDataChanged}
        />
      </div>
    </section>
  );
}

function DemoStatusPanel({
  membership,
  usage,
}: {
  membership: MembershipRecord;
  usage: {
    processCount: number | null;
    memberCount: number | null;
    isLoading: boolean;
    error: string | null;
  };
}) {
  const processLimit = membership.organization?.process_limit ?? 100;
  const memberLimit = membership.organization?.member_limit ?? 4;
  const demoEndsAt = membership.organization?.trial_ends_at ?? null;
  const daysRemaining = getDaysRemaining(demoEndsAt);

  return (
    <section className="rounded-[var(--ds-radius-lg)] border border-[var(--ds-color-border)] bg-white p-6 shadow-[var(--ds-shadow-xs)]">
      <div className="internalPanelHeader">
        <div>
          <strong>Estado de la cuenta</strong>
          <span>Capacidad visible y tiempo restante de la demo.</span>
        </div>
        <Badge variant={getBadgeVariantFromTone(getDemoStatusTone(membership.organization?.account_status ?? "closed"))}>
          {getDemoStatusLabel(membership.organization?.account_status ?? "closed")}
        </Badge>
      </div>

      <section className="grid gap-3 md:grid-cols-3">
        <StatCard value={daysRemaining ?? "-"} label="Días restantes" className="bg-[var(--ds-color-surface-subtle)] shadow-none" />
        <StatCard
          value={usage.processCount ?? "-"}
          label={`${usage.processCount ?? "-"} / ${processLimit} procesos activos`}
          className="bg-[var(--ds-color-surface-subtle)] shadow-none"
        />
        <StatCard
          value={usage.memberCount ?? "-"}
          label={`${usage.memberCount ?? "-"} / ${memberLimit} responsables`}
          className="bg-[var(--ds-color-surface-subtle)] shadow-none"
        />
      </section>

      <div className="internalDemoStatusMeta">
        <span>
          Inicio: {membership.organization?.trial_started_at ? formatShortDate(membership.organization.trial_started_at) : "Sin fecha"}
        </span>
        <span>
          Fin: {membership.organization?.trial_ends_at ? formatShortDate(membership.organization.trial_ends_at) : "Sin fecha"}
        </span>
      </div>

      {usage.isLoading ? <p className="internalPanelEmpty">Actualizando capacidad de la cuenta...</p> : null}
      {usage.error ? <p className="internalAuthError">{usage.error}</p> : null}
    </section>
  );
}

function InternalProcessManager({
  organizationId,
  accessToken,
  refreshToken = 0,
  view,
  onDataChanged,
  onLexStateChange,
}: {
  organizationId: string;
  accessToken: string;
  refreshToken?: number;
  view: ProcessManagerView;
  onDataChanged?: () => Promise<void> | void;
  onLexStateChange?: (context: InternalLexContext) => void;
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
  const [syncState, setSyncState] = useState<{
    isRunning: boolean;
    phase: "idle" | "initiating" | "partial" | "complete" | "error";
    message: string | null;
    lastRunAt: string | null;
    pendingCount: number | null;
  }>({
    isRunning: false,
    phase: "idle",
    message: null,
    lastRunAt: null,
    pendingCount: null,
  });

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
      await onDataChanged?.();
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : "No fue posible cargar los procesos.");
    } finally {
      setLoadingCases(false);
    }
  }

  async function startMonitoring(batchSize = 10, mode: "auto" | "manual" = "manual") {
    setSyncState((current) => ({
      ...current,
      isRunning: true,
      phase: current.lastRunAt ? "partial" : "initiating",
      message:
        mode === "auto"
          ? "La vigilancia inicial ya está corriendo. Estamos poblando la bandeja."
          : "Estamos consultando la cartera para actualizar la bandeja.",
    }));

    try {
      const result = await triggerMonitoringSync(accessToken, batchSize);
      const nextMessage =
        result.phase === "complete"
          ? "La sincronización inicial quedó completa."
          : result.after.pendingCount > 0
            ? `La sincronización sigue en curso. Quedan ${result.after.pendingCount} procesos pendientes por primera consulta.`
            : "La vigilancia ya está corriendo sobre la cartera visible.";

      setSyncState({
        isRunning: false,
        phase: result.phase,
        message: nextMessage,
        lastRunAt: new Date().toISOString(),
        pendingCount: result.after.pendingCount,
      });

      await refreshCases();
    } catch (error) {
      setSyncState({
        isRunning: false,
        phase: "error",
        message: getErrorMessage(error, "No fue posible iniciar la vigilancia."),
        lastRunAt: new Date().toISOString(),
        pendingCount: null,
      });
    }
  }

  useEffect(() => {
    void refreshCases();
  }, [organizationId, refreshToken]);

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
      if (result.inserted_count > 0) {
        await startMonitoring(10, "auto");
      }
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
      if (result.inserted_count > 0) {
        await startMonitoring(10, "auto");
      }
    } catch (error) {
      setIntakeError(getErrorMessage(error, "No fue posible completar la carga masiva."));
    } finally {
      setSubmittingBulk(false);
    }
  }

  const normalizedPreview = normalizeRadicado(singleRadicado);
  const bulkPreviewCount = splitRadicadosFromTextarea(bulkRadicados).length;
  const operationalSummary = useMemo(
    () => ({
      total: operationalRows.length,
      conNovedad: operationalRows.filter((row) => row.operationalStatus === "con_novedad").length,
      requiereRevision: operationalRows.filter((row) => row.operationalStatus === "requiere_revision").length,
      erroresFuente: operationalRows.filter((row) => row.operationalStatus === "error_fuente").length,
      eventosActivos: operationalRows.filter((row) => Boolean(row.latestEventDate)).length,
    }),
    [operationalRows],
  );
  const availableOwners = useMemo(
    () =>
      Array.from(
        new Set(
          operationalRows.map((row) => row.responsible).filter((value): value is string => Boolean(value)),
        ),
      ).sort((left, right) => left.localeCompare(right, "es-CO")),
    [operationalRows],
  );
  const filteredOperationalRows = useMemo(
    () =>
      operationalRows.filter((row) => {
        if (statusFilter !== "todos" && row.operationalStatus !== statusFilter) return false;
        if (ownerFilter !== "todos" && (row.responsible || "Sin responsable") !== ownerFilter) return false;
        if (priorityFilter !== "todos" && row.priority !== priorityFilter) return false;
        return true;
      }),
    [operationalRows, ownerFilter, priorityFilter, statusFilter],
  );
  const selectedCase = useMemo(
    () => filteredOperationalRows.find((row) => row.caseId === selectedCaseId) || null,
    [filteredOperationalRows, selectedCaseId],
  );
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
  const processSummary = {
    total: cases.length,
    criticalPriority: cases.filter((legalCase) => legalCase.priority === "critical").length,
    withoutOwner: cases.filter((legalCase) => !legalCase.internal_owner).length,
    readyForConsultation: caseSources.filter((caseSource) => caseSource.status === "pending").length,
  };
  const postLoadStatus = useMemo(() => {
    if (syncState.phase === "error") {
      return {
        tone: "error" as const,
        title: "La vigilancia necesita reintento.",
        description: syncState.message || "No pudimos iniciar la primera revisión de la cartera.",
      };
    }

    if (syncState.isRunning || processSummary.readyForConsultation > 0) {
      return {
        tone: "info" as const,
        title: "La vigilancia inicial está corriendo.",
        description:
          syncState.message ||
          `Estamos consultando la cartera. Quedan ${processSummary.readyForConsultation} procesos pendientes por primera consulta.`,
      };
    }

    if (snapshots.length > 0 && processSummary.total > 0) {
      return {
        tone: "ok" as const,
        title: "La cartera ya está poblada.",
        description:
          syncState.message ||
          `La operación ya tiene ${snapshots.length} snapshots y la bandeja puede empezar a leerse con contexto real.`,
      };
    }

    return {
      tone: "neutral" as const,
      title: "La cuenta está lista para vigilar.",
      description: "Carga procesos para que la primera revisión arranque automáticamente.",
    };
  }, [processSummary.readyForConsultation, processSummary.total, snapshots.length, syncState]);
  const recentAlerts = [...alerts].slice(0, 8);
  const recentSnapshots = [...snapshots]
    .sort((left, right) => right.fetched_at.localeCompare(left.fetched_at))
    .slice(0, 8);
  const selectedCaseEventCount = selectedEvents.filter((event) => event.status === "active").length;
  const selectedCaseAlertCount = selectedAlerts.filter((alert) =>
    ["pending", "sent", "failed"].includes(alert.status),
  ).length;

  useEffect(() => {
    onLexStateChange?.({
      sourceView: view,
      rows: operationalRows,
      visibleRows: filteredOperationalRows,
      statusFilter,
      ownerFilter,
      priorityFilter,
      selectedCase,
      summary: operationalSummary,
    });
  }, [
    view,
    operationalRows,
    filteredOperationalRows,
    statusFilter,
    ownerFilter,
    priorityFilter,
    selectedCase,
    operationalSummary,
    onLexStateChange,
  ]);

  const syncPanel = (
    <section className="rounded-[var(--ds-radius-lg)] border border-[var(--ds-color-border)] bg-white p-6 shadow-[var(--ds-shadow-xs)]">
      <div className="internalPanelHeader">
        <div>
          <strong>{postLoadStatus.title}</strong>
          <span>{postLoadStatus.description}</span>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant={getBadgeVariantFromTone(postLoadStatus.tone)}>
            {syncState.phase === "complete"
              ? "Sincronización completa"
              : syncState.phase === "error"
                ? "Requiere reintento"
                : syncState.isRunning || processSummary.readyForConsultation > 0
                  ? "Consultando cartera"
                  : "Lista para iniciar"}
          </Badge>
          <Button
            variant="secondary"
            type="button"
            disabled={syncState.isRunning || processSummary.total === 0}
            onClick={() => void startMonitoring(10, "manual")}
          >
            {syncState.isRunning ? "Consultando..." : "Actualizar ahora"}
          </Button>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-4">
        <StatCard value={processSummary.total} label="Procesos cargados" className="bg-[var(--ds-color-surface-subtle)] shadow-none" />
        <StatCard value={processSummary.readyForConsultation} label="Pendientes de primera consulta" className="bg-[var(--ds-color-surface-subtle)] shadow-none" />
        <StatCard value={snapshots.length} label="Snapshots visibles" className="bg-[var(--ds-color-surface-subtle)] shadow-none" />
        <StatCard
          value={syncState.lastRunAt ? formatCaseTimestamp(syncState.lastRunAt) : "Sin corrida"}
          label="Última actualización"
          className="bg-[var(--ds-color-surface-subtle)] shadow-none"
        />
      </div>
    </section>
  );

  if (view === "inicio") {
    return (
      <section className="space-y-6 px-6 py-6 lg:px-8">
        {syncPanel}
        <section className="grid gap-4 md:grid-cols-3">
          <StatCard
            value={operationalSummary.total}
            label="Visibilidad"
            description="Procesos visibles hoy en la cuenta."
          />
          <StatCard
            value={operationalSummary.conNovedad}
            label="Atención"
            description="Procesos con novedad operativa visible."
          />
          <StatCard
            value={alerts.length}
            label="Señal"
            description="Alertas activas registradas para esta cuenta."
          />
        </section>

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1.3fr)_minmax(0,0.9fr)]">
          <section className="rounded-[var(--ds-radius-lg)] border border-[var(--ds-color-border)] bg-white p-6 shadow-[var(--ds-shadow-xs)]">
            <header className="mb-5 space-y-2">
              <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--ds-color-text-subtle)]">
                Panorama
              </span>
              <h2 className="text-xl font-semibold tracking-tight text-[var(--ds-color-text)]">
                Lo que hoy merece atención.
              </h2>
            </header>

            <div className="grid gap-4 md:grid-cols-2">
              <article className="rounded-[var(--ds-radius-md)] border border-[var(--ds-color-border)] bg-[var(--ds-color-surface-subtle)] p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <strong className="text-base text-[var(--ds-color-text)]">Bandeja</strong>
                  <Badge variant="warning">{operationalSummary.requiereRevision} revisión</Badge>
                </div>
                <p className="text-sm leading-6 text-[var(--ds-color-text-muted)]">
                  Los estados operativos ya distinguen novedad, error de fuente y revisión humana.
                </p>
              </article>
              <article className="rounded-[var(--ds-radius-md)] border border-[var(--ds-color-border)] bg-[var(--ds-color-surface-subtle)] p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <strong className="text-base text-[var(--ds-color-text)]">Cobertura</strong>
                  <Badge variant="info">{availableOwners.length} responsables</Badge>
                </div>
                <p className="text-sm leading-6 text-[var(--ds-color-text-muted)]">
                  La cuenta ya puede operar con responsables reales y asignación sobre procesos.
                </p>
              </article>
              <article className="rounded-[var(--ds-radius-md)] border border-[var(--ds-color-border)] bg-[var(--ds-color-surface-subtle)] p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <strong className="text-base text-[var(--ds-color-text)]">Monitoreo</strong>
                  <Badge variant="neutral">{consultationSummary.snapshots} snapshots</Badge>
                </div>
                <p className="text-sm leading-6 text-[var(--ds-color-text-muted)]">
                  Cada corrida deja trazabilidad persistida para comparar cambios y eventos.
                </p>
              </article>
              <article className="rounded-[var(--ds-radius-md)] border border-[var(--ds-color-border)] bg-[var(--ds-color-surface-subtle)] p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <strong className="text-base text-[var(--ds-color-text)]">Alertas</strong>
                  <Badge variant="error">{consultationSummary.alertas} activas</Badge>
                </div>
                <p className="text-sm leading-6 text-[var(--ds-color-text-muted)]">
                  La cuenta ya hace visible cuando una fuente falla o un proceso requiere intervención.
                </p>
              </article>
            </div>
          </section>

          <section className="rounded-[var(--ds-radius-lg)] border border-[var(--ds-color-border)] bg-white p-6 shadow-[var(--ds-shadow-xs)]">
            <header className="mb-5 space-y-2">
              <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--ds-color-text-subtle)]">
                Siguiente acción
              </span>
              <h2 className="text-xl font-semibold tracking-tight text-[var(--ds-color-text)]">
                Mantén la cuenta enfocada.
              </h2>
            </header>

            <div className="space-y-3">
              <button
                className="w-full rounded-[var(--ds-radius-md)] border border-[var(--ds-color-border)] bg-[var(--ds-color-surface-subtle)] p-4 text-left transition-colors hover:border-[var(--ds-color-brand-border)] hover:bg-[var(--ds-color-brand-soft)]"
                type="button"
                onClick={() => (window.location.hash = buildViewHash("bandeja"))}
              >
                <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--ds-color-text-subtle)]">
                  Prioridad inmediata
                </span>
                <strong className="block text-base text-[var(--ds-color-text)]">Abrir bandeja</strong>
                <p className="mt-2 text-sm leading-6 text-[var(--ds-color-text-muted)]">
                  Empieza por procesos con revisión, fallas de fuente o novedad visible.
                </p>
              </button>
              <button
                className="w-full rounded-[var(--ds-radius-md)] border border-[var(--ds-color-border)] bg-[var(--ds-color-surface-subtle)] p-4 text-left transition-colors hover:border-[var(--ds-color-brand-border)] hover:bg-[var(--ds-color-brand-soft)]"
                type="button"
                onClick={() => (window.location.hash = buildViewHash("configuracion"))}
              >
                <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--ds-color-text-subtle)]">
                  Capacidad
                </span>
                <strong className="block text-base text-[var(--ds-color-text)]">Ajustar configuración</strong>
                <p className="mt-2 text-sm leading-6 text-[var(--ds-color-text-muted)]">
                  Amplía el inventario vigilado y mantén la cobertura alineada al bufete.
                </p>
              </button>
              <button
                className="w-full rounded-[var(--ds-radius-md)] border border-[var(--ds-color-border)] bg-[var(--ds-color-surface-subtle)] p-4 text-left transition-colors hover:border-[var(--ds-color-brand-border)] hover:bg-[var(--ds-color-brand-soft)]"
                type="button"
                onClick={() => (window.location.hash = buildViewHash("monitoreo"))}
              >
                <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--ds-color-text-subtle)]">
                  Salud operativa
                </span>
                <strong className="block text-base text-[var(--ds-color-text)]">Abrir monitoreo</strong>
                <p className="mt-2 text-sm leading-6 text-[var(--ds-color-text-muted)]">
                  Revisa fuentes, snapshots y alertas que sostienen la vigilancia.
                </p>
              </button>
            </div>
          </section>
        </section>
      </section>
    );
  }

  if (view === "bandeja") {
    return (
      <section className="space-y-6 px-6 py-6 lg:px-8">
        {syncPanel}
        <section
          className="rounded-[var(--ds-radius-lg)] border border-[var(--ds-color-border)] bg-white p-6 shadow-[var(--ds-shadow-xs)]"
          id="bandeja"
        >
          <div className="mb-6 flex flex-col gap-4 border-b border-[var(--ds-color-border)] pb-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-2">
              <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--ds-color-text-subtle)]">
                Cola de atención
              </span>
              <div>
                <strong className="block text-2xl font-semibold tracking-tight text-[var(--ds-color-text)]">
                  Bandeja operativa real
                </strong>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--ds-color-text-muted)]">
                  Procesos consultados, última actuación, eventos y señales de acción.
                </p>
              </div>
            </div>
            <Button variant="secondary" type="button" onClick={() => void refreshCases()}>
              Recargar
            </Button>
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
            <StatCard value={operationalSummary.total} label="Procesos visibles" className="bg-[var(--ds-color-surface-subtle)] shadow-none" />
            <StatCard value={operationalSummary.conNovedad} label="Con novedad" className="bg-[var(--ds-color-surface-subtle)] shadow-none" />
            <StatCard value={operationalSummary.requiereRevision} label="Requieren revisión" className="bg-[var(--ds-color-surface-subtle)] shadow-none" />
            <StatCard value={operationalSummary.erroresFuente} label="Errores de fuente" className="bg-[var(--ds-color-surface-subtle)] shadow-none" />
            <StatCard value={operationalSummary.eventosActivos} label="Eventos activos" className="bg-[var(--ds-color-surface-subtle)] shadow-none" />
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
              <FilterBar>
                <label className="space-y-2 text-sm font-medium text-[var(--ds-color-text-muted)]">
                  Estado operativo
                  <Select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
                    <option value="todos">Todos</option>
                    <option value="con_novedad">Con novedad</option>
                    <option value="requiere_revision">Requiere revisión</option>
                    <option value="sin_cambios">Sin cambios</option>
                    <option value="no_consultado">No consultado</option>
                    <option value="error_fuente">Error de fuente</option>
                  </Select>
                </label>
                <label className="space-y-2 text-sm font-medium text-[var(--ds-color-text-muted)]">
                  Responsable
                  <Select value={ownerFilter} onChange={(event) => setOwnerFilter(event.target.value)}>
                    <option value="todos">Todos</option>
                    <option value="Sin responsable">Sin responsable</option>
                    {availableOwners.map((owner) => (
                      <option key={owner} value={owner}>
                        {owner}
                      </option>
                    ))}
                  </Select>
                </label>
                <label className="space-y-2 text-sm font-medium text-[var(--ds-color-text-muted)]">
                  Prioridad
                  <Select value={priorityFilter} onChange={(event) => setPriorityFilter(event.target.value)}>
                    <option value="todos">Todas</option>
                    <option value="critical">Crítica</option>
                    <option value="high">Alta</option>
                    <option value="normal">Normal</option>
                    <option value="low">Baja</option>
                  </Select>
                </label>
              </FilterBar>

              <div className={`internalTrayLayout mt-6 ${selectedCase ? "has-detail" : "is-idle"}`}>
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
                        <OperationalBadge
                          tone={getBadgeVariantFromTone(getOperationalTone(row.operationalStatus))}
                          label={formatOperationalStatus(row.operationalStatus)}
                        />
                        <OperationalBadge
                          tone={getBadgeVariantFromTone(getSourceStatusTone(row.sourceStatus))}
                          label={formatSourceStatus(row.sourceStatus)}
                        />
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
                        <OperationalBadge
                          tone={getBadgeVariantFromTone(getPriorityTone(row.priority))}
                          label={formatPriorityLabel(row.priority)}
                        />
                        <OperationalBadge
                          tone={getBadgeVariantFromTone(getAttentionTone(row.attentionLevel))}
                          label={formatAttentionLevel(row.attentionLevel)}
                        />
                        {row.attentionReason ? <span>{formatDerivedReason(row.attentionReason)}</span> : null}
                      </div>
                      <div className="internalTrayStack">
                        <span>{row.sourceName}</span>
                        <span>{row.legalEventsCount} evento{row.legalEventsCount === 1 ? "" : "s"}</span>
                        {row.priorityReason ? <span>{formatDerivedReason(row.priorityReason)}</span> : null}
                        <span>{formatAssignmentOrigin(row.assignmentOrigin)}</span>
                      </div>
                    </article>
                  ))}
                </div>

                {selectedCase ? (
                  <aside className="internalPanel internalDetailPanel">
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
                          <strong>
                            {formatPriorityLabel(selectedCase.priority)}
                          </strong>
                          <small>{formatDerivedReason(selectedCase.priorityReason)}</small>
                        </div>
                        <div>
                          <span>Atención</span>
                          <strong>{formatAttentionLevel(selectedCase.attentionLevel)}</strong>
                          <small>{formatDerivedReason(selectedCase.attentionReason)}</small>
                          <small>
                            {selectedCase.attentionUpdatedAt
                              ? `Actualizada ${formatCaseTimestamp(selectedCase.attentionUpdatedAt)}`
                              : "Sin marca de recalculo"}
                          </small>
                        </div>
                        <div>
                          <span>Fuente</span>
                          <strong>{selectedCase.sourceName}</strong>
                        </div>
                        <div>
                          <span>Eventos activos</span>
                          <strong>{selectedCaseEventCount}</strong>
                        </div>
                        <div>
                          <span>Alertas activas</span>
                          <strong>{selectedCaseAlertCount}</strong>
                        </div>
                        <div>
                          <span>Asignación</span>
                          <strong>{formatAssignmentOrigin(selectedCase.assignmentOrigin)}</strong>
                        </div>
                      </div>

                      <DetailSection
                        title="Eventos jurídicos"
                        meta={`${selectedEvents.length} activo${selectedEvents.length === 1 ? "" : "s"}`}
                      >
                        {selectedEvents.length > 0 ? (
                          <div className="internalDetailList">
                            {selectedEvents.map((event) => (
                              <article key={event.id}>
                                <strong>{event.title}</strong>
                                <span>{formatEventType(event.event_type)} · {formatDateTimeLabel(event.event_date)}</span>
                                <span>Estado: {formatChangeStatus(event.change_status)}</span>
                              </article>
                            ))}
                          </div>
                        ) : (
                          <p className="internalPanelEmpty">No hay eventos activos para este proceso.</p>
                        )}
                      </DetailSection>

                      <DetailSection
                        title="Alertas"
                        meta={`${selectedAlerts.length} activa${selectedAlerts.length === 1 ? "" : "s"}`}
                      >
                        {selectedAlerts.length > 0 ? (
                          <div className="internalDetailList">
                            {selectedAlerts.map((alert) => (
                              <article key={alert.id}>
                                <div className="internalDetailTitleLine">
                                  <strong>{alert.title}</strong>
                                  <OperationalBadge
                                    tone={getBadgeVariantFromTone(getAlertTone(alert.severity))}
                                    label={formatAlertType(alert.alert_type)}
                                  />
                                </div>
                                <span>{alert.message}</span>
                                <span>{formatDateTimeLabel(alert.created_at)}</span>
                              </article>
                            ))}
                          </div>
                        ) : (
                          <p className="internalPanelEmpty">No hay alertas activas para este proceso.</p>
                        )}
                      </DetailSection>

                      <DetailSection
                        title="Historial de snapshots"
                        meta={`${selectedSnapshots.length} registro${selectedSnapshots.length === 1 ? "" : "s"}`}
                      >
                        {selectedSnapshots.length > 0 ? (
                          <div className="internalDetailList">
                            {selectedSnapshots.slice(0, 12).map((snapshot) => (
                              <article key={snapshot.id}>
                                <div className="internalDetailTitleLine">
                                  <strong>{formatDateTimeLabel(snapshot.fetched_at)}</strong>
                                  <OperationalBadge
                                    tone={getBadgeVariantFromTone(getSnapshotStatusTone(snapshot.fetch_status))}
                                    label={formatSnapshotStatus(snapshot.fetch_status)}
                                  />
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
                      </DetailSection>
                    </>
                  </aside>
                ) : (
                  <section className="internalPanel internalDetailPrompt">
                    <div className="internalPanelHeader">
                      <div>
                        <strong>Detalle operativo</strong>
                        <span>
                          {filteredOperationalRows.length === 0
                            ? "Ajusta los filtros para recuperar visibilidad."
                            : "Selecciona un proceso para abrir eventos, alertas y snapshots."}
                        </span>
                      </div>
                    </div>
                    <div className="internalDetailPromptBody">
                      <p>
                        {filteredOperationalRows.length === 0
                          ? "No hay procesos visibles con la combinación actual. Limpia o cambia los filtros para volver a la lectura operativa."
                          : "La bandeja se mantiene limpia hasta que elijas un proceso. Cuando lo abras, aquí verás la historia técnica y jurídica que sostiene la decisión."}
                      </p>
                    </div>
                  </section>
                )}
              </div>
            </>
          ) : null}
        </section>
      </section>
    );
  }

  if (view === "monitoreo") {
    return (
      <section className="space-y-6 px-6 py-6 lg:px-8">
        {syncPanel}
        <section className="grid gap-4 md:grid-cols-3">
          <StatCard value={consultationSummary.sourcesTracked} label="Fuentes rastreadas" description="Fuentes rastreadas sobre procesos activos." />
          <StatCard value={consultationSummary.snapshots} label="Snapshots" description="Snapshots disponibles para trazabilidad." />
          <StatCard value={consultationSummary.alertas} label="Alertas" description="Alertas registradas por novedades o fallas." />
        </section>

        <section className="rounded-[var(--ds-radius-lg)] border border-[var(--ds-color-border)] bg-white p-6 shadow-[var(--ds-shadow-xs)]">
          <div className="internalPanelHeader">
            <div>
              <strong>Estado de consultas y fuentes</strong>
              <span>Visibilidad operativa sobre salud de ejecución.</span>
            </div>
            <Button variant="secondary" type="button" onClick={() => void refreshCases()}>
              Recargar
            </Button>
          </div>

          <section className="grid gap-3 md:grid-cols-3">
            <StatCard value={consultationSummary.fuentesActivas} label="Fuentes activas" className="bg-[var(--ds-color-surface-subtle)] shadow-none" />
            <StatCard value={consultationSummary.erroresFuente} label="Errores de fuente" className="bg-[var(--ds-color-surface-subtle)] shadow-none" />
            <StatCard value={consultationSummary.bloqueosFuente} label="Fuentes bloqueadas" className="bg-[var(--ds-color-surface-subtle)] shadow-none" />
          </section>

          <div className="internalDetailList">
            <article>
              <strong>Fuentes no encontradas</strong>
              <span>{consultationSummary.noEncontrados} procesos no fueron encontrados en la última lectura.</span>
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

        <div className="internalStackGrid">
          <section className="rounded-[var(--ds-radius-lg)] border border-[var(--ds-color-border)] bg-white p-6 shadow-[var(--ds-shadow-xs)]">
            <div className="internalPanelHeader">
              <strong>Snapshots recientes</strong>
              <span>{recentSnapshots.length} visibles</span>
            </div>
            {recentSnapshots.length > 0 ? (
              <div className="internalDetailList">
                {recentSnapshots.map((snapshot) => (
                  <article key={snapshot.id}>
                    <div className="internalDetailTitleLine">
                      <strong>{formatDateTimeLabel(snapshot.fetched_at)}</strong>
                      <Badge variant={getBadgeVariantFromTone(getSnapshotStatusTone(snapshot.fetch_status))}>
                        {formatSnapshotStatus(snapshot.fetch_status)}
                      </Badge>
                    </div>
                    <span>{snapshot.duration_ms ? `${snapshot.duration_ms} ms` : "Sin duración reportada"}</span>
                    {snapshot.error_message ? <span>{snapshot.error_message}</span> : null}
                  </article>
                ))}
              </div>
            ) : (
              <p className="internalPanelEmpty">Aún no hay snapshots recientes visibles en esta cuenta.</p>
            )}
          </section>

          <section className="rounded-[var(--ds-radius-lg)] border border-[var(--ds-color-border)] bg-white p-6 shadow-[var(--ds-shadow-xs)]">
            <div className="internalPanelHeader">
              <strong>Alertas recientes</strong>
              <span>{recentAlerts.length} visibles</span>
            </div>
            {recentAlerts.length > 0 ? (
              <div className="internalDetailList">
                {recentAlerts.map((alert) => (
                  <article key={alert.id}>
                    <div className="internalDetailTitleLine">
                      <strong>{alert.title}</strong>
                      <Badge variant={getBadgeVariantFromTone(getAlertTone(alert.severity))}>
                        {formatAlertType(alert.alert_type)}
                      </Badge>
                    </div>
                    <span>{alert.message}</span>
                    <span>{formatDateTimeLabel(alert.created_at)}</span>
                  </article>
                ))}
              </div>
            ) : (
              <p className="internalPanelEmpty">No hay alertas recientes para mostrar.</p>
            )}
          </section>
        </div>
      </section>
    );
  }

  if (view !== "procesos") {
    return null;
  }

  return (
    <section className="space-y-6" id="procesos">
      {syncPanel}
      <header className="space-y-2 rounded-[var(--ds-radius-lg)] border border-[var(--ds-color-border)] bg-white p-6 shadow-[var(--ds-shadow-xs)]">
        <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--ds-color-text-subtle)]">
          Inventario vigilado
        </span>
        <h2 className="text-xl font-semibold tracking-tight text-[var(--ds-color-text)]">Carga radicados reales y déjalos listos para consulta.</h2>
        <p className="max-w-3xl text-sm leading-6 text-[var(--ds-color-text-muted)]">
          Cada proceso entra validado, asociado a tu organización y con una fuente inicial
          lista para consulta.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-[var(--ds-radius-lg)] border border-[var(--ds-color-border)] bg-white p-5 shadow-[var(--ds-shadow-xs)]">
          <strong>{processSummary.total}</strong>
          <p>Procesos activos cargados en la cuenta.</p>
        </article>
        <article className="rounded-[var(--ds-radius-lg)] border border-[var(--ds-color-border)] bg-white p-5 shadow-[var(--ds-shadow-xs)]">
          <strong>{processSummary.criticalPriority}</strong>
          <p>Procesos marcados hoy con prioridad crítica.</p>
        </article>
        <article className="rounded-[var(--ds-radius-lg)] border border-[var(--ds-color-border)] bg-white p-5 shadow-[var(--ds-shadow-xs)]">
          <strong>{processSummary.withoutOwner}</strong>
          <p>Procesos sin responsable explícito.</p>
        </article>
        <article className="rounded-[var(--ds-radius-lg)] border border-[var(--ds-color-border)] bg-white p-5 shadow-[var(--ds-shadow-xs)]">
          <strong>{processSummary.readyForConsultation}</strong>
          <p>Procesos aún pendientes de su primera consulta visible.</p>
        </article>
      </section>

      <div className="internalProcessGrid">
        <form className="rounded-[var(--ds-radius-lg)] border border-[var(--ds-color-border)] bg-white p-6 shadow-[var(--ds-shadow-xs)]" onSubmit={handleSingleSubmit}>
          <div className="internalPanelHeader">
            <strong>Carga individual</strong>
            <span>Un radicado a la vez</span>
          </div>

          <label>
            Radicado
            <Input
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
            <Input
              value={singleOwner}
              onChange={(event) => setSingleOwner(event.target.value)}
              placeholder="Laura P."
            />
          </label>

          <label>
            Prioridad
            <Select value={singlePriority} onChange={(event) => setSinglePriority(event.target.value as typeof singlePriority)}>
              <option value="low">Baja</option>
              <option value="normal">Normal</option>
              <option value="high">Alta</option>
              <option value="critical">Crítica</option>
            </Select>
          </label>

          <label>
            Nota interna
            <textarea
              className="min-h-[120px] w-full rounded-[var(--ds-radius-sm)] border border-[var(--ds-color-border)] bg-white px-3 py-2.5 text-sm text-[var(--ds-color-text)] shadow-[var(--ds-shadow-xs)] outline-none transition-colors placeholder:text-[var(--ds-color-text-subtle)] focus-visible:ring-2 focus-visible:ring-[var(--ds-color-info)] focus-visible:ring-offset-2"
              value={singleNotes}
              onChange={(event) => setSingleNotes(event.target.value)}
              placeholder="Cliente prioritario, caso sensible o cualquier contexto útil."
              rows={4}
            />
          </label>

          <Button type="submit" disabled={isSubmittingSingle}>
            {isSubmittingSingle ? "Guardando..." : "Guardar proceso"}
          </Button>
        </form>

        <form className="rounded-[var(--ds-radius-lg)] border border-[var(--ds-color-border)] bg-white p-6 shadow-[var(--ds-shadow-xs)]" onSubmit={handleBulkSubmit}>
          <div className="internalPanelHeader">
            <strong>Carga masiva</strong>
            <span>Hasta donde quieras, separados por línea, coma o tab</span>
          </div>

          <label>
            Radicados
            <textarea
              className="min-h-[180px] w-full rounded-[var(--ds-radius-sm)] border border-[var(--ds-color-border)] bg-white px-3 py-2.5 text-sm text-[var(--ds-color-text)] shadow-[var(--ds-shadow-xs)] outline-none transition-colors placeholder:text-[var(--ds-color-text-subtle)] focus-visible:ring-2 focus-visible:ring-[var(--ds-color-info)] focus-visible:ring-offset-2"
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
            <Input
              value={bulkOwner}
              onChange={(event) => setBulkOwner(event.target.value)}
              placeholder="Carlos M."
            />
          </label>

          <label>
            Prioridad por defecto
            <Select value={bulkPriority} onChange={(event) => setBulkPriority(event.target.value as typeof bulkPriority)}>
              <option value="low">Baja</option>
              <option value="normal">Normal</option>
              <option value="high">Alta</option>
              <option value="critical">Crítica</option>
            </Select>
          </label>

          <label>
            Nota interna
            <textarea
              className="min-h-[120px] w-full rounded-[var(--ds-radius-sm)] border border-[var(--ds-color-border)] bg-white px-3 py-2.5 text-sm text-[var(--ds-color-text)] shadow-[var(--ds-shadow-xs)] outline-none transition-colors placeholder:text-[var(--ds-color-text-subtle)] focus-visible:ring-2 focus-visible:ring-[var(--ds-color-info)] focus-visible:ring-offset-2"
              value={bulkNotes}
              onChange={(event) => setBulkNotes(event.target.value)}
              placeholder="Aplica la misma nota para toda la carga."
              rows={4}
            />
          </label>

          <Button type="submit" disabled={isSubmittingBulk}>
            {isSubmittingBulk ? "Procesando..." : "Cargar lote"}
          </Button>
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

      <section className="rounded-[var(--ds-radius-lg)] border border-[var(--ds-color-border)] bg-white p-6 shadow-[var(--ds-shadow-xs)]" id="bandeja">
        <div className="internalPanelHeader">
          <div>
            <strong>Procesos cargados recientemente</strong>
            <span>{cases.length} visibles en este inventario</span>
          </div>
          <Button variant="secondary" type="button" onClick={() => void refreshCases()}>
            Recargar
          </Button>
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
              <span>Atención</span>
              <span>Estado</span>
              <span>Creado</span>
            </div>
            {cases.map((legalCase) => (
              <article key={legalCase.id} className="internalCasesRow">
                <strong>{legalCase.radicado}</strong>
                <span>{legalCase.internal_owner || "Sin responsable"}</span>
                <Badge variant={getBadgeVariantFromTone(getPriorityTone(legalCase.priority_final))}>{formatPriorityLabel(legalCase.priority_final)}</Badge>
                <Badge variant={getBadgeVariantFromTone(getAttentionTone(legalCase.attention_level))}>
                  {formatAttentionLevel(legalCase.attention_level)}
                </Badge>
                <span>{formatCaseRecordStatus(legalCase.status)}</span>
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
    <main className="flex min-h-screen items-center justify-center bg-[var(--ds-color-background)] px-6 py-10">
      <section className="w-full max-w-[560px] rounded-[var(--ds-radius-lg)] border border-[var(--ds-color-border)] bg-white p-8 shadow-[var(--ds-shadow-md)]">
        <img className="h-12 w-auto" src={logoUrl} alt="LexControl" />
        <span className="mt-6 block text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--ds-color-text-subtle)]">
          Acceso operativo
        </span>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--ds-color-text)]">
          Ingresa a tu cuenta de LexControl.
        </h1>
        <p className="mt-4 text-sm leading-6 text-[var(--ds-color-text-muted)]">
          Este acceso está reservado para cuentas activadas. Aquí operas procesos,
          responsables y trazabilidad real.
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <label className="block space-y-2 text-sm font-medium text-[var(--ds-color-text-muted)]">
            Correo
            <Input
              autoComplete="email"
              type="email"
              value={form.email}
              onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
              placeholder="tu@firma.com"
              required
            />
          </label>
          <label className="block space-y-2 text-sm font-medium text-[var(--ds-color-text-muted)]">
            Contraseña
            <Input
              autoComplete="current-password"
              type="password"
              value={form.password}
              onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
              placeholder="********"
              required
            />
          </label>

          {error ? <p className="internalAuthError">{error}</p> : null}

          <Button className="w-full" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Ingresando..." : "Entrar"}
          </Button>
        </form>

        <DetailSection title="Acceso seguro por cuenta">
          <p className="text-sm leading-6 text-[var(--ds-color-text-muted)]">
            Tu sesión queda aislada por organización y solo ve la operación de tu cuenta.
          </p>
        </DetailSection>
      </section>
    </main>
  );
}

function InternalConfigurationState() {
  return (
    <StateScreen
      eyebrow="Configuración pendiente"
      title="Faltan variables de Supabase en el frontend."
      description={
        <p>
          Para abrir la consola interna necesitamos `VITE_SUPABASE_URL` y
          `VITE_SUPABASE_ANON_KEY`. La landing puede vivir sin eso. La operación
          autenticada no.
        </p>
      }
    />
  );
}

function InternalNoMembershipState({ email }: { email: string | undefined }) {
  return (
    <StateScreen
      eyebrow="Acceso en revisión"
      title="Tu usuario aún no tiene una organización activa."
      description={
        <>
          <p>
            El inicio de sesión ya funcionó para <strong>{email ?? "tu cuenta"}</strong>,
            pero todavía no existe una membresía activa en una cuenta.
          </p>
          <p>
            El siguiente paso es asignar tu usuario a una organización y a un rol operativo.
          </p>
        </>
      }
    />
  );
}

function InternalLexLayer({
  userName,
  organizationName,
  activeView,
  context,
}: {
  userName: string;
  organizationName: string | undefined;
  activeView: AppView;
  context: InternalLexContext | null;
}) {
  const [isOpen, setOpen] = useState(false);
  const [isTyping, setTyping] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<InternalLexMessage[]>([
    {
      id: 1,
      role: "lex",
      content:
        "Soy Lex. Observo la cartera por ti y te ayudo a concentrarte solo en lo que merece atención.",
    },
    {
      id: 2,
      role: "lex",
      content:
        "Puedo resumir prioridades, explicar por qué un proceso subió y señalar errores de fuente o falta de cobertura en la vista actual.",
    },
  ]);
  const messagesRef = useRef<HTMLDivElement | null>(null);
  const promptOptions = useMemo(() => getInternalLexPrompts(activeView, context), [activeView, context]);

  useEffect(() => {
    const container = messagesRef.current;
    if (!container) return;
    container.scrollTop = container.scrollHeight;
  }, [messages, isTyping, isOpen]);

  async function askLex(intent: InternalLexIntent | null, question: string) {
    const trimmedQuestion = question.trim();
    if (!trimmedQuestion || isTyping) return;

    setOpen(true);
    const nextUserMessage: InternalLexMessage = {
      id: messages.length + 1,
      role: "user",
      content: trimmedQuestion,
    };
    const nextHistory = [...messages.slice(-8), nextUserMessage];
    setMessages((current) => [...current, nextUserMessage]);
    setTyping(true);

    try {
      const response = await fetch("/api/lex-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: trimmedQuestion,
          intent,
          userName,
          history: nextHistory.map((message) => ({
            role: message.role,
            content: message.content,
          })),
          rows: buildInternalLexRows(context?.visibleRows.length ? context.visibleRows : context?.rows ?? []),
          currentState: {
            activeView,
            organizationName,
            sourceView: context?.sourceView ?? null,
            statusFilter: context?.statusFilter ?? "todos",
            ownerFilter: context?.ownerFilter ?? "todos",
            priorityFilter: context?.priorityFilter ?? "todos",
            visibleRows: context?.visibleRows.length ?? 0,
            summary: context?.summary ?? null,
            selectedCase: context?.selectedCase
              ? {
                  radicado: context.selectedCase.radicado,
                  operationalStatus: context.selectedCase.operationalStatus,
                  priority: context.selectedCase.priority,
                  priorityReason: context.selectedCase.priorityReason,
                  attentionLevel: context.selectedCase.attentionLevel,
                  attentionReason: context.selectedCase.attentionReason,
                }
              : null,
          },
        }),
      });

      const payload = (await response.json()) as { answer?: string; error?: string };
      const answer =
        payload.answer?.trim() ||
        buildInternalLexFallback(trimmedQuestion, context) ||
        "Todavía no tengo suficiente contexto para responder eso con claridad.";
      setMessages((current) => [
        ...current,
        { id: current.length + 1, role: "lex", content: answer },
      ]);
    } catch {
      const fallback = buildInternalLexFallback(trimmedQuestion, context);
      setMessages((current) => [
        ...current,
        {
          id: current.length + 1,
          role: "lex",
          content:
            fallback ||
            "No pude consultar el modelo ahora mismo, pero sigo teniendo a mano la lectura operativa persistida de la cuenta.",
        },
      ]);
    } finally {
      setTyping(false);
      setInput("");
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!input.trim()) return;
    await askLex(null, input);
  }

  return (
    <div className={`lexFloatingLayer ${isOpen ? "is-open" : ""}`} aria-live="polite">
      {isOpen ? (
        <button className="lexBackdrop" type="button" aria-label="Cerrar Lex" onClick={() => setOpen(false)} />
      ) : null}
      <button
        className="lexOrb"
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={isOpen}
        aria-controls="lex-operational-panel"
      >
        <img src={lexSymbolUrl} alt="" aria-hidden="true" />
        <span>Lex</span>
        <i />
      </button>

      {isOpen ? (
        <section className="lexMiniModal" id="lex-operational-panel" aria-label="Lex sobre operación real">
          <header className="lexModalHeader border-b border-[var(--ds-color-border)] bg-[var(--ds-color-surface-subtle)]">
            <div>
              <span className="lexModalBrand text-[var(--ds-color-text-subtle)]">
                <img src={lexSymbolUrl} alt="" aria-hidden="true" />
                Lex · atención operativa
              </span>
              <strong className="text-[var(--ds-color-text)]">
                {organizationName ? `Lectura viva de ${organizationName}` : "Lectura viva de la cuenta"}
              </strong>
            </div>
            <Button variant="quiet" size="icon" type="button" onClick={() => setOpen(false)} aria-label="Cerrar Lex">
              ×
            </Button>
          </header>

          <div className="lexMessages" ref={messagesRef}>
            {messages.map((message) => (
              <article className={`lexMessage ${message.role}`} key={message.id}>
                {message.role === "lex" ? (
                  <span className="lexSpeaker">
                    <img src={lexSymbolUrl} alt="" aria-hidden="true" />
                    Lex
                  </span>
                ) : (
                  <span>{userName}</span>
                )}
                <p>{message.content}</p>
              </article>
            ))}
            {isTyping ? (
              <article className="lexMessage lex typing" aria-label="Lex está escribiendo">
                <span className="lexSpeaker">
                  <img src={lexSymbolUrl} alt="" aria-hidden="true" />
                  Lex
                </span>
                <p>
                  <i />
                  <i />
                  <i />
                </p>
              </article>
            ) : null}
          </div>

          {promptOptions.length ? (
            <div className="lexPromptRail" aria-label="Consultas sugeridas">
              {promptOptions.map((prompt) => (
                <Button
                  key={`${prompt.intent}-${prompt.label}`}
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => void askLex(prompt.intent, prompt.value)}
                  disabled={isTyping}
                >
                  {prompt.label}
                </Button>
              ))}
            </div>
          ) : null}

          <form className="lexInputBar" onSubmit={handleSubmit}>
            <Input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Pregunta por prioridad, atención, cobertura o errores de fuente"
              aria-label="Pregunta para Lex"
            />
            <Button type="submit" disabled={isTyping || !input.trim()}>
              Enviar
            </Button>
          </form>
        </section>
      ) : null}
    </div>
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
      titleCaseFromEmail(session.user.email) ||
      "Usuario"
    );
  }, [session.user.email, session.user.user_metadata.full_name, session.user.user_metadata.name]);
  const canManageTeam = membership.role === "account_admin" || membership.role === "platform_admin";
  const [activeView, setActiveView] = useState<AppView>(() => getViewFromHash(window.location.hash));
  const [usage, setUsage] = useState<{
    processCount: number | null;
    memberCount: number | null;
    isLoading: boolean;
    error: string | null;
  }>({
    processCount: null,
    memberCount: null,
    isLoading: true,
    error: null,
  });
  const [lexContext, setLexContext] = useState<InternalLexContext | null>(null);
  const [isSidebarPinned, setIsSidebarPinned] = useState(true);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const currentViewMeta = internalViewMeta[activeView];
  const primaryAction =
    activeView === "inicio"
      ? { label: "Abrir bandeja", target: "bandeja" as AppView }
      : activeView === "bandeja"
        ? { label: "Abrir configuración", target: "configuracion" as AppView }
        : activeView === "monitoreo"
          ? { label: "Abrir configuración", target: "configuracion" as AppView }
          : activeView === "configuracion"
            ? { label: "Volver a bandeja", target: "bandeja" as AppView }
            : { label: "Volver al inicio", target: "inicio" as AppView };

  useEffect(() => {
    const syncView = () => setActiveView(getViewFromHash(window.location.hash));
    window.addEventListener("hashchange", syncView);
    syncView();
    return () => window.removeEventListener("hashchange", syncView);
  }, []);

  useEffect(() => {
    let active = true;

    async function refreshUsage() {
      setUsage((current) => ({ ...current, isLoading: true, error: null }));

      try {
        const nextUsage = await loadAccountUsage(membership.organization_id, session.access_token);
        if (!active) return;
        setUsage({
          processCount: nextUsage.processCount,
          memberCount: nextUsage.memberCount,
          isLoading: false,
          error: null,
        });
      } catch (nextError) {
        if (!active) return;
        setUsage((current) => ({
          ...current,
          isLoading: false,
          error: getErrorMessage(nextError, "No fue posible cargar la capacidad de la cuenta."),
        }));
      }
    }

    void refreshUsage();

    return () => {
      active = false;
    };
  }, [membership.organization_id, session.access_token]);

  async function refreshUsage() {
    setUsage((current) => ({ ...current, isLoading: true, error: null }));

    try {
      const nextUsage = await loadAccountUsage(membership.organization_id, session.access_token);
      setUsage({
        processCount: nextUsage.processCount,
        memberCount: nextUsage.memberCount,
        isLoading: false,
        error: null,
      });
    } catch (nextError) {
      setUsage((current) => ({
        ...current,
        isLoading: false,
        error: getErrorMessage(nextError, "No fue posible cargar la capacidad de la cuenta."),
      }));
    }
  }

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

  function handleToggleSidebarPinned() {
    setIsSidebarPinned((current) => {
      const next = !current;
      setIsSidebarExpanded(next);
      return next;
    });
  }

  const sidebarCollapsed = !isSidebarExpanded;
  const sidebarSections = [
    {
      label: "Operación",
      items: [
        { key: "inicio", view: "inicio" as AppView, label: "Inicio", icon: <House className="h-4 w-4" /> },
        { key: "bandeja", view: "bandeja" as AppView, label: "Bandeja", icon: <Inbox className="h-4 w-4" /> },
        { key: "monitoreo", view: "monitoreo" as AppView, label: "Monitoreo", icon: <Activity className="h-4 w-4" /> },
      ],
    },
    {
      label: "Sistema",
      items: [
        { key: "configuracion", view: "configuracion" as AppView, label: "Configuración", icon: <Settings2 className="h-4 w-4" /> },
      ],
    },
  ].map((section) => ({
    label: section.label,
    items: section.items.map((item) => ({
      key: item.key,
      label: item.label,
      icon: item.icon,
      active: activeView === item.view,
      onSelect: () => navigateTo(item.view),
    })),
  }));

  return (
    <main className="flex min-h-screen bg-[var(--ds-color-background)]">
      <AppSidebar
        collapsed={sidebarCollapsed}
        pinned={isSidebarPinned}
        onTogglePinned={handleToggleSidebarPinned}
        onExpand={() => setIsSidebarExpanded(true)}
        onCollapse={() => setIsSidebarExpanded(false)}
        brand={
          <div className="flex min-w-0 items-center gap-3">
            <img className="h-10 w-10 shrink-0" src={logoUrl} alt="LexControl" />
            {!sidebarCollapsed ? (
              <div className="min-w-0">
                <strong className="block truncate text-sm font-semibold text-[var(--ds-color-text)]">LexControl</strong>
                <span className="block truncate text-xs text-[var(--ds-color-text-subtle)]">
                  Sistema operativo del bufete
                </span>
              </div>
            ) : null}
          </div>
        }
        account={
          <div className="rounded-[var(--ds-radius-md)] border border-[var(--ds-color-border)] bg-[var(--ds-color-surface-subtle)] p-4">
            <span className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--ds-color-text-subtle)]">
              Cuenta
            </span>
            <strong className="mt-2 block text-sm text-[var(--ds-color-text)]">
              {membership.organization?.name ?? "Sin organización"}
            </strong>
            <span className="mt-1 block text-sm text-[var(--ds-color-text-muted)]">
              {getDemoStatusLabel(membership.organization?.account_status)}
            </span>
          </div>
        }
        usage={
          <div className="rounded-[var(--ds-radius-md)] border border-[var(--ds-color-border)] bg-white p-4 shadow-[var(--ds-shadow-xs)]">
            <span className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--ds-color-text-subtle)]">
              Capacidad
            </span>
            <strong className="mt-2 block text-2xl font-semibold text-[var(--ds-color-text)]">
              {getDaysRemaining(membership.organization?.trial_ends_at ?? null) ?? "-"} días
            </strong>
            <span className="mt-2 block text-sm leading-6 text-[var(--ds-color-text-muted)]">
              {`${usage.processCount ?? "-"} / ${membership.organization?.process_limit ?? 100} procesos · ${usage.memberCount ?? "-"} / ${membership.organization?.member_limit ?? 4} responsables`}
            </span>
            {usage.error ? (
              <span className="mt-2 block text-sm text-[var(--ds-color-error)]">{usage.error}</span>
            ) : null}
          </div>
        }
        sections={sidebarSections}
        footerAction={
          <Button
            variant={sidebarCollapsed ? "quiet" : "secondary"}
            size={sidebarCollapsed ? "icon" : "md"}
            type="button"
            onClick={handleSignOut}
          >
            <LogOut className="h-4 w-4" />
            {!sidebarCollapsed ? <span className="ml-2">Cerrar sesión</span> : null}
          </Button>
        }
      />

      <section className="flex min-h-screen min-w-0 flex-1 flex-col">
        <PageHeader
          eyebrow={currentViewMeta.eyebrow}
          title={currentViewMeta.title}
          description={currentViewMeta.description}
          badge={
            <Badge variant={getBadgeVariantFromTone(getDemoStatusTone(membership.organization?.account_status))}>
              {getDemoStatusLabel(membership.organization?.account_status)}
            </Badge>
          }
          meta={
            <div className="rounded-[var(--ds-radius-md)] border border-[var(--ds-color-border)] bg-white px-4 py-3 text-right shadow-[var(--ds-shadow-xs)]">
              <strong className="block text-sm text-[var(--ds-color-text)]">
                {membership.organization?.name ?? "Sin organización"}
              </strong>
              <span className="block text-sm text-[var(--ds-color-text-muted)]">{userName}</span>
              <span className="block text-xs text-[var(--ds-color-text-subtle)]">
                Rol: {formatMemberRole(membership.role as TeamMemberRecord["role"])}
              </span>
            </div>
          }
          action={
            <Button variant="secondary" type="button" onClick={() => navigateTo(primaryAction.target)}>
              {primaryAction.label}
            </Button>
          }
        />

        {activeView === "inicio" ? (
          <>
            <DemoStatusPanel membership={membership} usage={usage} />
            <section className="px-6 pt-6 lg:px-8">
              <div className="rounded-[var(--ds-radius-lg)] border border-[var(--ds-color-border)] bg-white p-6 shadow-[var(--ds-shadow-xs)]">
                <header className="mb-5 space-y-2">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--ds-color-text-subtle)]">
                    Ruta actual
                  </span>
                  <h2 className="text-xl font-semibold tracking-tight text-[var(--ds-color-text)]">
                    La cuenta ya opera sobre una arquitectura clara.
                  </h2>
                </header>

                <div className="grid gap-4 lg:grid-cols-4">
                  {internalModules.map((module) => (
                    <article
                      key={module.name}
                      className="rounded-[var(--ds-radius-md)] border border-[var(--ds-color-border)] bg-[var(--ds-color-surface-subtle)] p-4"
                    >
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <strong className="text-base text-[var(--ds-color-text)]">{module.name}</strong>
                        <Badge variant={module.status === "Operando" ? "success" : "info"}>
                          {module.status}
                        </Badge>
                      </div>
                      <p className="text-sm leading-6 text-[var(--ds-color-text-muted)]">
                        {module.description}
                      </p>
                    </article>
                  ))}
                </div>
              </div>
            </section>
            <InternalProcessManager
              organizationId={membership.organization_id}
              accessToken={session.access_token}
              view="inicio"
              onDataChanged={refreshUsage}
              onLexStateChange={setLexContext}
            />
          </>
        ) : null}

        {activeView === "bandeja" ? (
          <InternalProcessManager
            organizationId={membership.organization_id}
            accessToken={session.access_token}
            view="bandeja"
            onDataChanged={refreshUsage}
            onLexStateChange={setLexContext}
          />
        ) : null}

        {activeView === "monitoreo" ? (
          <InternalProcessManager
            organizationId={membership.organization_id}
            accessToken={session.access_token}
            view="monitoreo"
            onDataChanged={refreshUsage}
            onLexStateChange={setLexContext}
          />
        ) : null}

        {activeView === "configuracion" ? (
          <ConfigurationWorkspace
            membership={membership}
            usage={usage}
            accessToken={session.access_token}
            canManageTeam={canManageTeam}
            organizationId={membership.organization_id}
            onDataChanged={refreshUsage}
          />
        ) : null}

        <InternalLexLayer
          userName={userName}
          organizationName={membership.organization?.name}
          activeView={activeView}
          context={lexContext}
        />
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
