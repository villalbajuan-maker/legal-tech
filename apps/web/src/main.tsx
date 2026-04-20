import { StrictMode, useEffect, useMemo, useRef, useState } from "react";
import type { FormEvent } from "react";
import { createRoot } from "react-dom/client";
import lexSymbolUrl from "./assets/lex-control-logo-symbol.png";
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

type ProcessState = "info" | "success" | "warning" | "error";

type ProcessStatus = "novedad" | "sin-cambios" | "no-consultado" | "error-fuente" | "revision";

type ProcessRow = {
  radicado: string;
  status: string;
  statusType: ProcessStatus;
  action: string;
  annotation: string;
  date: string;
  minutesAgo: number;
  owner: string;
  priority: "Crítica" | "Alta" | "Media" | "Baja";
  source: string;
  state: ProcessState;
};

type OperationalFilter = "todos" | ProcessStatus;

type TimeFilter = "24h" | "7d" | "30d" | "todos";

type LexIntent = "movimientos" | "fallas" | "responsables" | "sin-cambios" | "prioridad" | "resumen";

type LexMessage = {
  id: number;
  role: "user" | "lex";
  content: string;
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

const processRows: ProcessRow[] = [
  {
    radicado: "11001400303520230010700",
    status: "Nuevo movimiento",
    statusType: "novedad",
    action: "Auto fija fecha",
    annotation: "Se fija audiencia inicial para el 14 de mayo. Requiere validación del responsable.",
    date: "Hoy, 08:42",
    minutesAgo: 96,
    owner: "Laura P.",
    priority: "Alta",
    source: "CPNU",
    state: "info",
  },
  {
    radicado: "11001400306620230164700",
    status: "Sin cambios",
    statusType: "sin-cambios",
    action: "Fijación en estado",
    annotation: "Última actuación sin variación frente a la consulta anterior.",
    date: "Ayer, 17:10",
    minutesAgo: 1110,
    owner: "Carlos M.",
    priority: "Media",
    source: "CPNU",
    state: "success",
  },
  {
    radicado: "11001333603820250000100",
    status: "No consultado",
    statusType: "no-consultado",
    action: "Fuente no disponible",
    annotation: "El intento quedó registrado. Se recomienda reintento controlado antes del cierre diario.",
    date: "Hoy, 07:30",
    minutesAgo: 168,
    owner: "Ana R.",
    priority: "Crítica",
    source: "CPNU",
    state: "error",
  },
  {
    radicado: "25899310300220190018400",
    status: "Requiere revisión",
    statusType: "revision",
    action: "Traslado pendiente",
    annotation: "Movimiento detectado con posible término. Requiere lectura manual.",
    date: "Hace 2 días",
    minutesAgo: 3240,
    owner: "Juan V.",
    priority: "Alta",
    source: "CPNU",
    state: "warning",
  },
  {
    radicado: "11001400307720220073000",
    status: "Error de fuente",
    statusType: "error-fuente",
    action: "Timeout en consulta",
    annotation: "La fuente respondió fuera del tiempo esperado. No se asume ausencia de novedad.",
    date: "Hace 5 días",
    minutesAgo: 7600,
    owner: "Laura P.",
    priority: "Media",
    source: "CPNU",
    state: "error",
  },
  {
    radicado: "11001418901820240057700",
    status: "Sin cambios",
    statusType: "sin-cambios",
    action: "Auto admite demanda",
    annotation: "Sin variaciones desde la última consulta exitosa.",
    date: "Hace 12 días",
    minutesAgo: 17280,
    owner: "Carlos M.",
    priority: "Baja",
    source: "CPNU",
    state: "success",
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

function getRowsByTime(rows: ProcessRow[], filter: TimeFilter) {
  const limits: Record<TimeFilter, number> = {
    "24h": 24 * 60,
    "7d": 7 * 24 * 60,
    "30d": 30 * 24 * 60,
    todos: Number.POSITIVE_INFINITY,
  };

  return rows.filter((row) => row.minutesAgo <= limits[filter]);
}

function getRowsByOperationalState(rows: ProcessRow[], filter: OperationalFilter) {
  if (filter === "todos") return rows;
  return rows.filter((row) => row.statusType === filter);
}

function pluralize(count: number, singular: string, plural: string) {
  return count === 1 ? `${count} ${singular}` : `${count} ${plural}`;
}

const lexPrompts: { label: string; value: LexIntent }[] = [
  { label: "¿Qué procesos se movieron hoy?", value: "movimientos" },
  { label: "¿Cuáles no se pudieron consultar?", value: "fallas" },
  { label: "¿Quién concentra más pendientes?", value: "responsables" },
  { label: "¿Qué casos llevan más tiempo sin cambios?", value: "sin-cambios" },
  { label: "¿Qué requiere prioridad?", value: "prioridad" },
  { label: "Resumen operativo", value: "resumen" },
];

function getLexAnswer(intent: LexIntent, rows: ProcessRow[]) {
  const movedToday = rows.filter((row) => row.statusType === "novedad" && row.minutesAgo <= 24 * 60);
  const failed = rows.filter((row) => row.statusType === "no-consultado" || row.statusType === "error-fuente");
  const stale = rows.filter((row) => row.statusType === "sin-cambios").sort((a, b) => b.minutesAgo - a.minutesAgo);
  const critical = rows.filter((row) => row.priority === "Crítica" || row.priority === "Alta");

  if (intent === "resumen") {
    const unchanged = rows.filter((row) => row.statusType === "sin-cambios");
    return `${pluralize(rows.length, "proceso fue", "procesos fueron")} leídos en la bandeja demo. ${pluralize(movedToday.length, "proceso tuvo", "procesos tuvieron")} cambios en las últimas 24 horas. ${pluralize(failed.length, "proceso no pudo", "procesos no pudieron")} consultarse. ${pluralize(unchanged.length, "proceso permanece", "procesos permanecen")} sin cambios.`;
  }

  if (intent === "movimientos") {
    return movedToday.length
      ? `${pluralize(movedToday.length, "proceso tuvo", "procesos tuvieron")} cambios en las últimas 24 horas. Proceso más reciente: ${movedToday[0].radicado}. Actuación: ${movedToday[0].action}.`
      : "No hay movimientos nuevos en las últimas 24 horas dentro de esta muestra.";
  }

  if (intent === "fallas") {
    return failed.length
      ? `${pluralize(failed.length, "proceso no pudo", "procesos no pudieron")} consultarse. No deben tratarse como casos sin novedad.`
      : "No hay procesos con falla de fuente en esta muestra.";
  }

  if (intent === "responsables") {
    const counts = rows.reduce<Record<string, number>>((acc, row) => {
      acc[row.owner] = (acc[row.owner] ?? 0) + 1;
      return acc;
    }, {});
    const topOwner = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
    if (!topOwner) return "No hay responsables visibles con el filtro actual.";
    const [owner, count] = topOwner;
    return `${owner} concentra ${pluralize(count, "proceso", "procesos")} en esta bandeja. Priorizar casos con error o prioridad alta.`;
  }

  if (intent === "sin-cambios") {
    return stale.length
      ? `El caso con más tiempo sin cambios es ${stale[0].radicado}, con última referencia registrada ${stale[0].date.toLowerCase()}.`
      : "No hay procesos clasificados como sin cambios en esta vista.";
  }

  if (intent === "prioridad") {
    return critical.length
      ? `${pluralize(critical.length, "proceso está", "procesos están")} en prioridad alta o crítica. Requieren revisión antes de los casos de baja prioridad.`
      : "No hay procesos de alta prioridad en esta muestra.";
  }

  return "Selecciona una consulta operativa.";
}

function inferLexIntent(text: string): LexIntent | null {
  const value = text.toLowerCase();
  if (value.includes("resumen") || value.includes("estado") || value.includes("operativo")) return "resumen";
  if (value.includes("mov") || value.includes("cambio") || value.includes("novedad") || value.includes("actuacion")) return "movimientos";
  if (value.includes("fall") || value.includes("error") || value.includes("fuente") || value.includes("consultar")) return "fallas";
  if (value.includes("responsable") || value.includes("pendiente")) return "responsables";
  if (value.includes("sin cambio") || value.includes("tiempo") || value.includes("quieto")) return "sin-cambios";
  if (value.includes("prioridad") || value.includes("critico") || value.includes("alta")) return "prioridad";
  return null;
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
  const [operationalFilter, setOperationalFilter] = useState<OperationalFilter>("todos");
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("todos");
  const [isLexOpen, setLexOpen] = useState(false);
  const [lexInput, setLexInput] = useState("");
  const [lexMessages, setLexMessages] = useState<LexMessage[]>([
    {
      id: 1,
      role: "lex",
      content:
        "Bandeja demo activa. Se puede consultar movimientos, fallas, responsables, prioridad y procesos sin cambios.",
    },
  ]);
  const lexMessagesRef = useRef<HTMLDivElement | null>(null);
  const rowsByTime = getRowsByTime(processRows, timeFilter);
  const visibleRows = getRowsByOperationalState(rowsByTime, operationalFilter);
  const summary = {
    novedades: rowsByTime.filter((row) => row.statusType === "novedad").length,
    sinCambios: rowsByTime.filter((row) => row.statusType === "sin-cambios").length,
    noConsultados: rowsByTime.filter((row) => row.statusType === "no-consultado").length,
    errores: rowsByTime.filter((row) => row.statusType === "error-fuente").length,
    responsables: new Set(rowsByTime.map((row) => row.owner)).size,
  };
  const operationalFilters: { label: string; value: OperationalFilter }[] = [
    { label: "Todos", value: "todos" },
    { label: "Con novedad", value: "novedad" },
    { label: "Sin cambios", value: "sin-cambios" },
    { label: "No consultados", value: "no-consultado" },
    { label: "Errores de fuente", value: "error-fuente" },
  ];
  const timeFilters: { label: string; value: TimeFilter }[] = [
    { label: "24 horas", value: "24h" },
    { label: "Semana", value: "7d" },
    { label: "30 días", value: "30d" },
    { label: "Todos", value: "todos" },
  ];

  useEffect(() => {
    lexMessagesRef.current?.scrollTo({
      top: lexMessagesRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [lexMessages, isLexOpen]);

  function applyLexIntent(intent: LexIntent) {
    if (intent === "movimientos") {
      setOperationalFilter("novedad");
      setTimeFilter("24h");
    }

    if (intent === "fallas") {
      setOperationalFilter("no-consultado");
      setTimeFilter("todos");
    }

    if (intent === "sin-cambios") {
      setOperationalFilter("sin-cambios");
      setTimeFilter("todos");
    }

    if (intent === "prioridad" || intent === "responsables" || intent === "resumen") {
      setOperationalFilter("todos");
      setTimeFilter("todos");
    }
  }

  function getRowsForLexIntent(intent: LexIntent) {
    if (intent === "movimientos") return getRowsByTime(processRows, "24h");
    return processRows;
  }

  function askLex(intent: LexIntent, question: string) {
    setLexOpen(true);
    applyLexIntent(intent);
    const answer = getLexAnswer(intent, getRowsForLexIntent(intent));
    setLexMessages((current) => [
      ...current,
      { id: current.length + 1, role: "user", content: question },
      { id: current.length + 2, role: "lex", content: answer },
    ]);
  }

  function submitLexQuestion(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const question = lexInput.trim();
    if (!question) return;

    const intent = inferLexIntent(question);
    if (!intent) {
      setLexMessages((current) => [
        ...current,
        { id: current.length + 1, role: "user", content: question },
        {
          id: current.length + 2,
          role: "lex",
          content:
            "Consulta no disponible en la demo. Consultas activas: movimientos, fallas, responsables, prioridad, procesos sin cambios y resumen operativo.",
        },
      ]);
      setLexInput("");
      return;
    }

    askLex(intent, question);
    setLexInput("");
  }

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
          <div className="controlTools">
            <div className="filterGroup" aria-label="Filtros rápidos">
              {operationalFilters.map((item) => (
                <button
                  type="button"
                  className={`filter ${operationalFilter === item.value ? "active" : ""}`}
                  key={item.value}
                  onClick={() => setOperationalFilter(item.value)}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <div className="filterGroup timeFilters" aria-label="Filtros de tiempo">
              {timeFilters.map((item) => (
                <button
                  type="button"
                  className={`filter compact ${timeFilter === item.value ? "active" : ""}`}
                  key={item.value}
                  onClick={() => setTimeFilter(item.value)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="stateGrid">
          <button type="button" onClick={() => setOperationalFilter("novedad")}>
            <strong>{summary.novedades}</strong>
            <span>Procesos con novedad</span>
          </button>
          <button type="button" onClick={() => setOperationalFilter("sin-cambios")}>
            <strong>{summary.sinCambios}</strong>
            <span>Procesos sin cambios</span>
          </button>
          <button type="button" onClick={() => setOperationalFilter("no-consultado")}>
            <strong>{summary.noConsultados}</strong>
            <span>Procesos no consultados</span>
          </button>
          <button type="button" onClick={() => setOperationalFilter("error-fuente")}>
            <strong>{summary.errores}</strong>
            <span>Errores de fuente</span>
          </button>
          <button type="button" onClick={() => askLex("responsables", "¿Quién concentra más pendientes?")}>
            <strong>{summary.responsables}</strong>
            <span>Responsables activos</span>
          </button>
          <button type="button" onClick={() => askLex("prioridad", "¿Qué requiere prioridad?")}>
            <strong>{rowsByTime.filter((row) => row.priority === "Alta" || row.priority === "Crítica").length}</strong>
            <span>Prioridades altas</span>
          </button>
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
            {visibleRows.map((row) => (
              <article className={`processRow ${row.state}`} key={row.radicado}>
                <span className="radicado">{row.radicado}</span>
                <span className={`badge ${row.state}`}>{row.status}</span>
                <span>
                  <strong>{row.action}</strong>
                  <small>{row.annotation}</small>
                </span>
                <time>{row.date}</time>
                <span>
                  {row.owner}
                  <small>{row.priority}</small>
                </span>
              </article>
            ))}
            {visibleRows.length === 0 ? (
              <div className="emptyState">
                No hay procesos en esta vista. Cambia el filtro para ver otra señal operativa.
              </div>
            ) : null}
          </section>
        </div>

        <div className="lexFloatingLayer" aria-live="polite">
          <button
            className="lexOrb"
            type="button"
            onClick={() => setLexOpen((current) => !current)}
            aria-expanded={isLexOpen}
            aria-controls="lex-demo-panel"
          >
            <img src={lexSymbolUrl} alt="" aria-hidden="true" />
            <span>Lex</span>
            <i />
          </button>

          {isLexOpen ? (
            <section className="lexMiniModal" id="lex-demo-panel" aria-label="Lex demo conversacional">
              <header className="lexModalHeader">
                <div>
                  <span className="lexModalBrand">
                    <img src={lexSymbolUrl} alt="" aria-hidden="true" />
                    Lex · voz del sistema
                  </span>
                  <strong>Consulta esta bandeja demo.</strong>
                </div>
                <button type="button" onClick={() => setLexOpen(false)} aria-label="Cerrar Lex">
                  Cerrar
                </button>
              </header>

              <div className="lexMessages" ref={lexMessagesRef}>
                {lexMessages.map((message) => (
                  <article className={`lexMessage ${message.role}`} key={message.id}>
                    <span>{message.role === "lex" ? "Lex" : "Usuario"}</span>
                    <p>{message.content}</p>
                  </article>
                ))}
              </div>

              <div className="lexPromptRail" aria-label="Consultas sugeridas">
                {lexPrompts.map((prompt) => (
                  <button type="button" key={prompt.value} onClick={() => askLex(prompt.value, prompt.label)}>
                    {prompt.label}
                  </button>
                ))}
              </div>

              <form className="lexInputBar" onSubmit={submitLexQuestion}>
                <input
                  value={lexInput}
                  onChange={(event) => setLexInput(event.target.value)}
                  placeholder="Pregunta por movimientos, fallas o responsables"
                  aria-label="Pregunta para Lex"
                />
                <button type="submit">Enviar</button>
              </form>
            </section>
          ) : null}
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
