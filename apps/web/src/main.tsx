import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const alerts = [
  {
    severity: "Critica",
    title: "Termino vence en 3 dias",
    case: "11001-31-03-001-2023-00045-00",
    due: "22 Abr 2026",
  },
  {
    severity: "Alta",
    title: "Audiencia reprogramada",
    case: "76001-33-33-002-2022-00110-00",
    due: "24 Abr 2026",
  },
  {
    severity: "Media",
    title: "Fuente sin revision exitosa",
    case: "05001-31-05-004-2021-00482-00",
    due: "Hoy",
  },
];

const events = [
  { date: "21 Abr", label: "Audiencia inicial", court: "Juzgado 1 Civil" },
  { date: "22 Abr", label: "Vencimiento traslado", court: "Tribunal Superior" },
  { date: "25 Abr", label: "Diligencia", court: "Juzgado Administrativo" },
];

function App() {
  return (
    <main className="shell">
      <section className="intro">
        <p className="eyebrow">Legal Search</p>
        <h1>Vigilancia operativa</h1>
        <p className="lead">
          Alertas, audiencias y terminos concentrados en una sola bandeja de trabajo.
        </p>
      </section>

      <section className="metrics" aria-label="Resumen operativo">
        <article>
          <strong>220</strong>
          <span>Procesos activos</span>
        </article>
        <article>
          <strong>18</strong>
          <span>Alertas pendientes</span>
        </article>
        <article>
          <strong>7</strong>
          <span>Eventos esta semana</span>
        </article>
        <article>
          <strong>92%</strong>
          <span>Consultas exitosas</span>
        </article>
      </section>

      <section className="workspace">
        <div className="panel">
          <div className="panelHeader">
            <h2>Alertas pendientes</h2>
            <button type="button">Nueva revision</button>
          </div>
          <div className="list">
            {alerts.map((alert) => (
              <article className="row" key={`${alert.title}-${alert.case}`}>
                <span className={`badge ${alert.severity.toLowerCase()}`}>{alert.severity}</span>
                <div>
                  <h3>{alert.title}</h3>
                  <p>{alert.case}</p>
                </div>
                <time>{alert.due}</time>
              </article>
            ))}
          </div>
        </div>

        <aside className="panel">
          <h2>Proximos eventos</h2>
          <div className="timeline">
            {events.map((event) => (
              <article className="event" key={`${event.date}-${event.label}`}>
                <time>{event.date}</time>
                <div>
                  <h3>{event.label}</h3>
                  <p>{event.court}</p>
                </div>
              </article>
            ))}
          </div>
        </aside>
      </section>
    </main>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
