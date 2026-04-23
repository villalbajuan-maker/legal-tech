import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import type { Session } from "@supabase/supabase-js";
import { isLikelyRadicado, normalizeRadicado } from "../../../packages/core/src";
import logoUrl from "./assets/lexcontrol-logo.png";
import { isSupabaseConfigured, supabase } from "./supabase";

type MembershipRecord = {
  id: string;
  organization_id: string;
  role: "platform_admin" | "account_admin" | "operator";
  status: "active" | "invited" | "disabled";
  organization: {
    id: string;
    name: string;
  } | null;
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

type CaseIntakeResponse = {
  inserted_count: number;
  duplicate_count: number;
  invalid_count: number;
  inserted_radicados: string[] | null;
  duplicate_radicados: string[] | null;
  invalid_radicados: string[] | null;
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

const internalModules = [
  {
    name: "Procesos",
    status: "Siguiente",
    description: "Carga individual y masiva de radicados por cuenta.",
  },
  {
    name: "Bandeja",
    status: "En construcción",
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

async function loadPrimaryMembership(userId: string) {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("organization_memberships")
    .select("id, organization_id, role, status, organization:organizations(id, name)")
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

function formatCaseTimestamp(value: string) {
  return new Intl.DateTimeFormat("es-CO", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "America/Bogota",
  }).format(new Date(value));
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

function InternalProcessManager({
  organizationId,
}: {
  organizationId: string;
}) {
  const [cases, setCases] = useState<InternalCaseRow[]>([]);
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
          <span>{membership.role.replace("_", " ")}</span>
        </div>

        <nav className="internalSidebarNav" aria-label="Módulos internos">
          <a href="#resumen" className="is-active">
            Resumen
          </a>
          <a href="#procesos">Procesos</a>
          <a href="#bandeja">Bandeja</a>
          <a href="#consultas">Consultas</a>
        </nav>

        <button className="internalGhostButton" type="button" onClick={handleSignOut}>
          Cerrar sesión
        </button>
      </aside>

      <section className="internalContent">
        <header className="internalHeader" id="resumen">
          <div>
            <span className="internalEyebrow">Beta operativa interna</span>
            <h1>Hola, {userName}.</h1>
            <p>
              Ya tenemos autenticación, membresía y organización activa. El
              producto empieza aquí de verdad.
            </p>
          </div>
          <div className="internalHeaderMeta">
            <span>Rol: {membership.role.replace("_", " ")}</span>
            <span>Estado: {membership.status}</span>
          </div>
        </header>

        <section className="internalSummaryGrid">
          <article>
            <strong>Identidad</strong>
            <p>Sesión activa y usuario vinculado a Supabase Auth.</p>
          </article>
          <article>
            <strong>Aislamiento</strong>
            <p>Lectura y escritura sujetas a RLS por organización.</p>
          </article>
          <article>
            <strong>Base lista</strong>
            <p>Este shell ya permite montar carga de procesos y bandeja real.</p>
          </article>
        </section>

        <section className="internalModuleList" id="procesos">
          <header>
            <span className="internalEyebrow">Ruta inmediata</span>
            <h2>Los siguientes módulos se montan sobre esta base.</h2>
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

        <InternalProcessManager organizationId={membership.organization_id} />
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
