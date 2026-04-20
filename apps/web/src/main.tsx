import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import logoUrl from "./assets/lexcontrol-logo.png";
import "./styles.css";

const stateSummary = [
  { label: "Con novedad", value: "18", state: "info" },
  { label: "Sin cambios", value: "186", state: "success" },
  { label: "No consultados", value: "11", state: "error" },
  { label: "Requieren revision", value: "5", state: "warning" },
];

const processRows = [
  {
    radicado: "11001400303520230010700",
    status: "Nuevo movimiento",
    action: "Auto fija fecha",
    date: "Hoy, 08:42",
    owner: "Laura P.",
    state: "info",
  },
  {
    radicado: "11001400306620230164700",
    status: "Sin cambios",
    action: "Fijacion en estado",
    date: "Ayer, 17:10",
    owner: "Carlos M.",
    state: "success",
  },
  {
    radicado: "11001333603820250000100",
    status: "No consultado",
    action: "Fuente no disponible",
    date: "Hoy, 07:30",
    owner: "Ana R.",
    state: "error",
  },
  {
    radicado: "25899310300220190018400",
    status: "Requiere revision",
    action: "Traslado pendiente",
    date: "Hace 2 dias",
    owner: "Juan V.",
    state: "warning",
  },
];

const signals = [
  "Ultima actuacion y anotacion",
  "Procesos no consultados",
  "Responsables por caso",
  "Prioridad operativa",
  "Resumen por correo",
  "Base preparada para WhatsApp",
];

const steps = [
  {
    eyebrow: "01",
    title: "Carga radicados",
    text: "Organiza procesos por cliente, responsable y prioridad.",
  },
  {
    eyebrow: "02",
    title: "Consulta fuentes",
    text: "CPNU se consulta por lotes, con trazabilidad y control de errores.",
  },
  {
    eyebrow: "03",
    title: "Decide que revisar",
    text: "La bandeja separa novedades, estabilidad y fallas de consulta.",
  },
];

function App() {
  return (
    <main className="app">
      <header className="topbar">
        <a className="brand" href="#inicio" aria-label="LexControl inicio">
          <img src={logoUrl} alt="LexControl" />
        </a>
        <nav className="nav" aria-label="Principal">
          <a href="#control">Control</a>
          <a href="#valor">Valor</a>
          <a href="#beta">Beta</a>
        </nav>
        <a className="navCta" href="mailto:contacto@lexcontrol.co?subject=Beta%20LexControl">
          Solicitar beta
        </a>
      </header>

      <section className="hero" id="inicio">
        <div className="heroContent">
          <p className="eyebrow">Sistema operativo de vigilancia judicial</p>
          <h1>Controla que cambio, que no cambio y que no se pudo consultar.</h1>
          <p className="lead">
            LexControl convierte listas de radicados en una bandeja operativa para
            abogados, firmas y operadores legales que necesitan monitorear procesos
            sin revisar manualmente cada fuente.
          </p>
          <div className="actions">
            <a className="button primary" href="mailto:contacto@lexcontrol.co?subject=Quiero%20entrar%20a%20la%20beta%20LexControl">
              Entrar a la beta
            </a>
            <a className="button secondary" href="#control">
              Ver panel de control
            </a>
          </div>
        </div>

        <div className="heroStatus" aria-label="Estado operativo">
          <span className="sourceDot" />
          CPNU operativo
          <span>Ultima sincronizacion: 08:42</span>
        </div>
      </section>

      <section className="controlSurface" id="control" aria-label="Panel de control LexControl">
        <div className="controlHeader">
          <div>
            <p className="eyebrow">Control panel</p>
            <h2>Bandeja diaria de vigilancia</h2>
          </div>
          <div className="filterGroup" aria-label="Filtros rapidos">
            <button type="button" className="filter active">Ultimas 24 horas</button>
            <button type="button" className="filter">No consultados</button>
            <button type="button" className="filter">Alta prioridad</button>
          </div>
        </div>

        <div className="summaryGrid">
          {stateSummary.map((item) => (
            <article className={`summary ${item.state}`} key={item.label}>
              <span>{item.label}</span>
              <strong>{item.value}</strong>
            </article>
          ))}
        </div>

        <div className="workbench">
          <section className="tablePanel" aria-label="Procesos monitoreados">
            <div className="tableHeader">
              <span>Radicado</span>
              <span>Estado</span>
              <span>Ultima actuacion</span>
              <span>Fecha</span>
              <span>Responsable</span>
            </div>
            {processRows.map((row) => (
              <article className={`processRow ${row.state}`} key={row.radicado}>
                <span className="radicado">{row.radicado}</span>
                <span className={`badge ${row.state}`}>{row.status}</span>
                <span>{row.action}</span>
                <time>{row.date}</time>
                <span>{row.owner}</span>
              </article>
            ))}
          </section>

          <aside className="companionPanel" aria-label="Companion operativo">
            <div className="companionHeader">
              <span>Companion</span>
              <strong>Consulta tu operacion</strong>
            </div>
            <p>
              Que procesos no pudieron consultarse hoy y cuales requieren revision?
            </p>
            <div className="answer">
              11 procesos quedaron pendientes por fuente no disponible. 5 tienen
              prioridad alta y responsable asignado.
            </div>
            <button type="button" className="button ghost">Abrir filtro sugerido</button>
          </aside>
        </div>
      </section>

      <section className="valueSection" id="valor">
        <div>
          <p className="eyebrow">Diferencial</p>
          <h2>No es un monitor de radicados. Es una consola de decision.</h2>
        </div>
        <div className="signalGrid">
          {signals.map((signal) => (
            <article className="signal" key={signal}>
              <span />
              {signal}
            </article>
          ))}
        </div>
      </section>

      <section className="steps">
        {steps.map((step) => (
          <article className="step" key={step.title}>
            <span>{step.eyebrow}</span>
            <h3>{step.title}</h3>
            <p>{step.text}</p>
          </article>
        ))}
      </section>

      <section className="beta" id="beta">
        <div>
          <p className="eyebrow">Beta fundadora</p>
          <h2>Estamos abriendo cupos para abogados y firmas con volumen real.</h2>
          <p>
            Buscamos equipos con 50 a 500 procesos que quieran validar vigilancia
            automatica, trazabilidad y priorizacion operativa con casos reales.
          </p>
        </div>
        <form className="signup" action="mailto:contacto@lexcontrol.co" method="post" encType="text/plain">
          <label>
            Nombre
            <input name="nombre" placeholder="Tu nombre" />
          </label>
          <label>
            Correo
            <input name="correo" type="email" placeholder="correo@firma.com" />
          </label>
          <label>
            Procesos aproximados
            <select name="procesos" defaultValue="">
              <option value="" disabled>Selecciona un rango</option>
              <option>50 - 100</option>
              <option>101 - 250</option>
              <option>251 - 500</option>
              <option>Mas de 500</option>
            </select>
          </label>
          <button className="button primary" type="submit">Solicitar acceso</button>
        </form>
      </section>
    </main>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
