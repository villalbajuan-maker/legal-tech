import { StrictMode, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import logoUrl from "./assets/lexcontrol-logo.png";
import "./styles.css";

type DiagnosticOption = {
  label: string;
  score: number;
};

type DiagnosticQuestion = {
  question: string;
  options: DiagnosticOption[];
};

const diagnosticQuestions: DiagnosticQuestion[] = [
  {
    question: "¿Cuántos procesos vigilas actualmente?",
    options: [
      { label: "Menos de 25", score: 0 },
      { label: "25 - 100", score: 1 },
      { label: "101 - 300", score: 2 },
      { label: "Más de 300", score: 3 },
    ],
  },
  {
    question: "¿Cómo revisan hoy las novedades?",
    options: [
      { label: "Manual en Rama Judicial", score: 3 },
      { label: "Excel + revisión manual", score: 3 },
      { label: "Dependiente / asistente", score: 2 },
      { label: "Herramienta externa", score: 1 },
      { label: "No hay proceso claro", score: 4 },
    ],
  },
  {
    question: "¿Con qué frecuencia revisan los procesos?",
    options: [
      { label: "Diario", score: 1 },
      { label: "Varias veces por semana", score: 1 },
      { label: "Una vez por semana", score: 2 },
      { label: "Cuando el cliente pregunta", score: 4 },
      { label: "No hay frecuencia fija", score: 4 },
    ],
  },
  {
    question: "¿Pueden saber qué procesos no fueron consultados exitosamente hoy?",
    options: [
      { label: "Sí, con trazabilidad", score: 0 },
      { label: "Parcialmente", score: 2 },
      { label: "No", score: 4 },
      { label: "No estoy seguro", score: 3 },
    ],
  },
  {
    question: "¿Tienen una bandeja que separe novedades, sin cambios y fallas?",
    options: [
      { label: "Sí", score: 0 },
      { label: "No", score: 4 },
      { label: "Lo hacemos manualmente", score: 3 },
      { label: "Depende del responsable", score: 3 },
    ],
  },
  {
    question: "¿Quién recibe alertas cuando hay una actuación nueva?",
    options: [
      { label: "Responsable asignado", score: 0 },
      { label: "Todo el equipo", score: 2 },
      { label: "Una sola persona centraliza", score: 2 },
      { label: "Nadie automáticamente", score: 4 },
      { label: "Depende del caso", score: 3 },
    ],
  },
  {
    question: "¿Qué pasa si una fuente no se puede consultar?",
    options: [
      { label: "Queda registrado", score: 0 },
      { label: "Alguien lo revisa manualmente", score: 2 },
      { label: "No siempre se sabe", score: 4 },
      { label: "No tenemos control", score: 4 },
    ],
  },
  {
    question: "¿Cuál sería el impacto de no detectar una actuación a tiempo?",
    options: [
      { label: "Bajo", score: 0 },
      { label: "Medio", score: 1 },
      { label: "Alto", score: 3 },
      { label: "Crítico frente al cliente", score: 4 },
    ],
  },
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
    action: "Fijación en estado",
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
    status: "Requiere revisión",
    action: "Traslado pendiente",
    date: "Hace 2 días",
    owner: "Juan V.",
    state: "warning",
  },
];

const solutionBlocks = [
  {
    title: "Consulta",
    text: "Registra cada intento de consulta. Incluso cuando la fuente falla.",
  },
  {
    title: "Clasifica",
    text: "Separa automáticamente novedades, sin cambios y fallas.",
  },
  {
    title: "Prioriza",
    text: "Muestra qué requiere atención y quién es responsable.",
  },
];

function getRiskLabel(score: number) {
  if (score >= 24) return "crítico";
  if (score >= 17) return "alto";
  if (score >= 9) return "medio";
  return "bajo";
}

function DiagnosticModal({
  onClose,
}: {
  onClose: () => void;
}) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const isComplete = answers.length === diagnosticQuestions.length;
  const score = useMemo(() => answers.reduce((total, item) => total + item, 0), [answers]);
  const risk = getRiskLabel(score);
  const current = diagnosticQuestions[step];

  function answer(option: DiagnosticOption) {
    const next = [...answers, option.score];
    setAnswers(next);
    if (next.length < diagnosticQuestions.length) {
      setStep(step + 1);
    }
  }

  function reset() {
    setStep(0);
    setAnswers([]);
  }

  return (
    <div className="modalLayer" role="dialog" aria-modal="true" aria-labelledby="diagnostic-title">
      <div className="diagnosticModal">
        <button className="modalClose" type="button" onClick={onClose} aria-label="Cerrar diagnóstico">
          Cerrar
        </button>

        {!isComplete ? (
          <>
            <p className="eyebrow">Diagnóstico de Riesgo Operativo Judicial</p>
            <div className="progress">
              <span>{step + 1} de {diagnosticQuestions.length}</span>
              <div>
                <i style={{ width: `${((step + 1) / diagnosticQuestions.length) * 100}%` }} />
              </div>
            </div>
            <h2 id="diagnostic-title">{current.question}</h2>
            <div className="questionOptions">
              {current.options.map((option) => (
                <button type="button" key={option.label} onClick={() => answer(option)}>
                  {option.label}
                </button>
              ))}
            </div>
          </>
        ) : (
          <section className="resultPanel">
            <p className="eyebrow">Resultado</p>
            <h2>Tu operación tiene riesgo operativo {risk}.</h2>
            <p>
              Esto no significa que no estés revisando procesos. Significa que no
              puedes demostrar con claridad qué fue revisado, qué falló y qué nunca
              se consultó.
            </p>
            <p>
              Ese tipo de falla no se detecta cuando ocurre. Se detecta cuando ya
              es tarde.
            </p>
            <div className="resultStatement">
              El problema no es que no revises. Es que no puedes ver lo que no se revisó.
            </div>
            <p>
              LexControl no automatiza la revisión. Te muestra lo que hoy no puedes ver.
            </p>
            <div className="resultActions">
              <a className="button primary" href="mailto:contacto@lexcontrol.co?subject=Quiero%20ver%20LexControl%20con%20mis%20procesos">
                Quiero ver LexControl con mis procesos
              </a>
              <a className="button secondary" href="mailto:contacto@lexcontrol.co?subject=Enviar%20diagnostico%20LexControl">
                Recibir diagnóstico por correo
              </a>
            </div>
            <button className="button ghost" type="button" onClick={reset}>
              Repetir diagnóstico
            </button>
          </section>
        )}
      </div>
    </div>
  );
}

function App() {
  const [isDiagnosticOpen, setDiagnosticOpen] = useState(false);

  return (
    <main className="app">
      <header className="topbar">
        <a className="brand" href="#inicio" aria-label="LexControl inicio">
          <img src={logoUrl} alt="LexControl" />
        </a>
        <nav className="nav" aria-label="Principal">
          <a href="#diagnostico">Diagnóstico</a>
          <a href="#control">Control</a>
          <a href="#beta">Beta</a>
        </nav>
        <button className="navCta" type="button" onClick={() => setDiagnosticOpen(true)}>
          Hacer diagnóstico
        </button>
      </header>

      <section className="hero" id="inicio">
        <div className="heroContent">
          <p className="eyebrow">LexControl — vigilancia judicial operativa</p>
          <h1>
            El problema no es revisar procesos. Es no saber cuáles nunca fueron revisados.
          </h1>
          <p className="lead">
            La mayoría de los equipos jurídicos cree que está al día. Pero no puede
            demostrar qué procesos fueron realmente consultados, cuáles fallaron y
            cuáles nunca se revisaron.
          </p>
          <p className="lead strongLead">
            LexControl convierte esa incertidumbre en control operativo.
          </p>
          <div className="actions">
            <button className="button primary" type="button" onClick={() => setDiagnosticOpen(true)}>
              Hacer diagnóstico
            </button>
            <a className="button secondary" href="#control">
              Ver cómo funciona
            </a>
          </div>
          <p className="microcopy">Toma menos de 3 minutos. No necesitas datos sensibles.</p>
        </div>
      </section>

      <section className="transitionSection">
        <p>Puedes revisar procesos todos los días.</p>
        <strong>Y aún así estar dejando casos sin revisar.</strong>
      </section>

      <section className="problemSection">
        <div>
          <p className="eyebrow">Problema</p>
          <h2>El riesgo no está solo en que un proceso cambie.</h2>
          <h3>Está en no saber si fue revisado.</h3>
        </div>
        <div className="problemList">
          <p>Una actuación puede aparecer.</p>
          <p>Una audiencia puede moverse.</p>
          <p>Una fuente puede fallar.</p>
          <p>Un proceso puede no consultarse.</p>
          <p>Un responsable puede asumir que alguien más lo vio.</p>
          <strong>Y no hay una forma clara de saber cuándo pasó.</strong>
        </div>
        <div className="problemTruth">
          <p>No es un problema de disciplina.</p>
          <h2>Es un problema de visibilidad.</h2>
          <p>Si no tienes trazabilidad, no tienes control. Solo tienes confianza en que alguien revisó.</p>
        </div>
      </section>

      <section className="diagnosticEntry" id="diagnostico">
        <div>
          <p className="eyebrow">Diagnóstico de Riesgo Operativo Judicial</p>
          <h2>Este diagnóstico no mide qué tan organizado estás.</h2>
          <p>Mide qué tan expuesta está tu operación a errores que no puedes detectar.</p>
        </div>
        <button className="button primary" type="button" onClick={() => setDiagnosticOpen(true)}>
          Iniciar diagnóstico
        </button>
      </section>

      <section className="solutionSection">
        <div>
          <p className="eyebrow">Solución</p>
          <h2>De revisión manual a control operativo.</h2>
        </div>
        <div className="solutionGrid">
          {solutionBlocks.map((item) => (
            <article className="solutionCard" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="modelShift">
        <article>
          <span>Hoy operas así</span>
          <p>Revisión manual</p>
          <p>Excel</p>
          <p>Mensajes</p>
          <p>Suposiciones</p>
        </article>
        <article>
          <span>Con LexControl</span>
          <p>Una bandeja clara</p>
          <p>Estados visibles</p>
          <p>Errores identificados</p>
          <p>Responsables asignados</p>
        </article>
      </section>

      <section className="controlSurface" id="control" aria-label="Panel de control LexControl">
        <div className="controlHeader">
          <div>
            <p className="eyebrow">Panel</p>
            <h2>Una bandeja para decidir. No otra tabla para revisar.</h2>
            <p>Todo en un solo lugar. Con trazabilidad.</p>
          </div>
          <div className="filterGroup" aria-label="Filtros rápidos">
            <button type="button" className="filter active">Con novedad</button>
            <button type="button" className="filter">No consultados</button>
            <button type="button" className="filter">Errores de fuente</button>
          </div>
        </div>

        <div className="stateGrid">
          <article><strong>Procesos con novedad</strong></article>
          <article><strong>Procesos sin cambios</strong></article>
          <article><strong>Procesos no consultados</strong></article>
          <article><strong>Errores de fuente</strong></article>
          <article><strong>Responsables</strong></article>
          <article><strong>Prioridades</strong></article>
        </div>

        <div className="workbench">
          <section className="tablePanel" aria-label="Procesos monitoreados">
            <div className="tableHeader">
              <span>Radicado</span>
              <span>Estado</span>
              <span>Última actuación</span>
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
              <strong>No buscas procesos. Preguntas por tu operación.</strong>
            </div>
            <p>¿Qué procesos se movieron hoy?</p>
            <p>¿Cuáles no se pudieron consultar?</p>
            <p>¿Qué casos llevan más tiempo sin cambios?</p>
            <div className="answer">
              LexControl responde sobre lo que está pasando. No sobre lo que crees que pasó.
            </div>
          </aside>
        </div>
      </section>

      <section className="beta" id="beta">
        <div>
          <p className="eyebrow">Beta fundadora — acceso limitado</p>
          <h2>Estamos trabajando con un grupo reducido de abogados y firmas que operan volumen real de procesos.</h2>
          <p>Ideal para equipos que manejan 50 a 500 procesos activos.</p>
          <p>Trabajamos con pocos equipos para validar la operación con casos reales.</p>
        </div>
        <a className="button primary" href="mailto:contacto@lexcontrol.co?subject=Solicitar%20acceso%20a%20beta%20LexControl">
          Solicitar acceso a beta
        </a>
      </section>

      <section className="closingSection">
        <h2>No puedes controlar lo que no puedes ver.</h2>
        <p>Y hoy, probablemente, hay procesos que no estás viendo.</p>
        <strong>LexControl convierte esa incertidumbre en sistema.</strong>
        <button className="button primary" type="button" onClick={() => setDiagnosticOpen(true)}>
          Hacer diagnóstico
        </button>
      </section>

      {isDiagnosticOpen ? <DiagnosticModal onClose={() => setDiagnosticOpen(false)} /> : null}
    </main>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
