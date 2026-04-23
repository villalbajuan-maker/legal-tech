import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import type { Session } from "@supabase/supabase-js";
import logoUrl from "./assets/lexcontrol-logo.png";
import { isSupabaseConfigured, supabase } from "./supabase";

type MembershipRecord = {
  id: string;
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
    .select("id, role, status, organization:organizations(id, name)")
    .eq("user_id", userId)
    .eq("status", "active")
    .limit(1)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return (data as MembershipRecord | null) ?? null;
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

  return <InternalShell session={session} membership={membership} />;
}
