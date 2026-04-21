import { StrictMode, useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { createRoot } from "react-dom/client";
import { lexDemoRows } from "../../../packages/core/src";
import type {
  LexDemoProcessRow as ProcessRow,
  LexDemoProcessState as ProcessState,
  LexDemoProcessStatus as ProcessStatus,
} from "../../../packages/core/src";
import lexSymbolUrl from "./assets/lex-control-logo-symbol.png";
import logoUrl from "./assets/lexcontrol-logo.png";
import "./styles.css";

type SpeechRecognitionAlternative = {
  transcript: string;
};

type SpeechRecognitionResult = {
  0: SpeechRecognitionAlternative;
  isFinal: boolean;
  length: number;
};

type SpeechRecognitionEvent = Event & {
  resultIndex: number;
  results: SpeechRecognitionResult[];
};

type SpeechRecognitionErrorEvent = Event & {
  error: string;
};

type SpeechRecognitionInstance = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

type SpeechRecognitionConstructor = new () => SpeechRecognitionInstance;

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

type OperationalFilter = "todos" | ProcessStatus;

type TimeFilter = "24h" | "7d" | "30d" | "todos";

type LexIntent =
  | "movimientos"
  | "movimientos-detalle"
  | "fallas"
  | "fallas-detalle"
  | "responsables"
  | "responsables-detalle"
  | "sin-cambios"
  | "prioridad"
  | "resumen";

type LexCourtesyIntent = "agradecimiento" | "saludo" | "afirmacion" | "despedida";

type LexMessage = {
  id: number;
  role: "user" | "lex";
  content: string;
};

type SocialIconName = "whatsapp" | "linkedin" | "instagram" | "facebook";

function SocialIcon({ name }: { name: SocialIconName }) {
  if (name === "whatsapp") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12.04 3.25a8.63 8.63 0 0 0-7.42 13.05l-1.02 3.72 3.82-1a8.61 8.61 0 0 0 4.62 1.33h.01a8.55 8.55 0 0 0 6.1-2.53 8.58 8.58 0 0 0 2.53-6.1 8.64 8.64 0 0 0-8.64-8.47Zm.01 15.62h-.01a7.15 7.15 0 0 1-3.65-1l-.26-.15-2.27.6.61-2.22-.17-.28a7.14 7.14 0 1 1 5.75 3.05Zm3.92-5.35c-.21-.11-1.27-.63-1.47-.7-.2-.08-.34-.11-.48.1-.14.22-.56.7-.69.84-.13.14-.25.16-.47.05-.22-.11-.92-.34-1.75-1.08a6.6 6.6 0 0 1-1.21-1.51c-.13-.22-.01-.34.1-.44.1-.1.22-.25.33-.38.11-.13.14-.22.22-.36.07-.15.03-.27-.02-.38-.05-.11-.48-1.17-.66-1.6-.17-.42-.35-.36-.48-.37h-.41c-.15 0-.38.05-.58.27-.2.22-.76.74-.76 1.8 0 1.05.78 2.08.89 2.22.11.14 1.53 2.33 3.7 3.27.52.22.92.35 1.24.45.52.16.99.14 1.36.08.41-.06 1.27-.52 1.45-1.02.18-.5.18-.93.13-1.02-.05-.09-.2-.14-.41-.25Z" />
      </svg>
    );
  }

  if (name === "linkedin") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6.7 19.25H3.75V9.1H6.7v10.15ZM5.23 7.74A1.73 1.73 0 1 1 5.24 4.3a1.73 1.73 0 0 1-.01 3.45Zm15.02 11.51h-2.94v-4.94c0-1.18-.02-2.69-1.64-2.69-1.64 0-1.89 1.28-1.89 2.6v5.03h-2.94V9.1h2.82v1.39h.04c.39-.74 1.35-1.53 2.78-1.53 2.98 0 3.52 1.96 3.52 4.5v5.79h.25Z" />
      </svg>
    );
  }

  if (name === "instagram") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 7.45a4.55 4.55 0 1 0 0 9.1 4.55 4.55 0 0 0 0-9.1Zm0 7.5a2.95 2.95 0 1 1 0-5.9 2.95 2.95 0 0 1 0 5.9Zm5.8-7.68a1.06 1.06 0 1 1-2.12 0 1.06 1.06 0 0 1 2.12 0Zm3.02 1.08c-.07-1.43-.39-2.7-1.44-3.74-1.04-1.05-2.31-1.37-3.74-1.44-1.48-.08-5.9-.08-7.38 0-1.42.07-2.69.39-3.74 1.43-1.05 1.05-1.37 2.32-1.44 3.75-.08 1.48-.08 5.9 0 7.38.07 1.43.39 2.7 1.44 3.74 1.05 1.05 2.32 1.37 3.74 1.44 1.48.08 5.9.08 7.38 0 1.43-.07 2.7-.39 3.74-1.44 1.05-1.04 1.37-2.31 1.44-3.74.08-1.48.08-5.9 0-7.38Zm-1.9 8.97a3 3 0 0 1-1.69 1.69c-1.17.46-3.95.35-5.23.35s-4.06.1-5.23-.35a3 3 0 0 1-1.69-1.69c-.46-1.17-.35-3.95-.35-5.23s-.1-4.06.35-5.23a3 3 0 0 1 1.69-1.69c1.17-.46 3.95-.35 5.23-.35s4.06-.1 5.23.35a3 3 0 0 1 1.69 1.69c.46 1.17.35 3.95.35 5.23s.11 4.06-.35 5.23Z" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M14.05 21v-8.2h2.75l.41-3.2h-3.16V7.56c0-.92.26-1.55 1.58-1.55h1.69V3.15A22.2 22.2 0 0 0 14.86 3c-2.44 0-4.11 1.49-4.11 4.22V9.6H8v3.2h2.75V21h3.3Z" />
    </svg>
  );
}

const demoFeatures = [
  "Carga inicial de hasta 100 procesos",
  "Hasta 4 responsables",
  "Bandeja operativa con estados",
  "Lex sobre datos de la demo",
  "Sesión inicial de activación",
  "Revisión de resultados",
];

const demoLimits = [
  "No incluye asesoría jurídica",
  "No reemplaza revisión profesional",
  "No garantiza disponibilidad permanente de fuentes externas",
  "La activación se coordina con el equipo de LexControl",
];

const launchPlans = [
  {
    name: "Starter",
    price: "$149.000 COP",
    scope: "Hasta 100 procesos",
    features: [
      "1 usuario",
      "Bandeja operativa",
      "Consulta CPNU / Rama Judicial",
      "Estados: novedad, sin cambios y fallas",
    ],
  },
  {
    name: "Profesional",
    price: "$299.000 COP",
    scope: "Hasta 250 procesos",
    featured: true,
    features: [
      "Hasta 2 usuarios",
      "Bandeja operativa",
      "Lex sobre la operación",
      "Resumen diario",
      "Prioridades",
    ],
  },
  {
    name: "Firma",
    price: "$599.000 COP",
    scope: "Hasta 500 procesos",
    features: [
      "Hasta 5 usuarios",
      "Alertas por responsable",
      "Mayor volumen de consulta",
      "Soporte de activación",
    ],
  },
];

const addOns = [
  {
    name: "WhatsApp operativo",
    description: "Alertas por responsable y cliente interno.",
  },
  {
    name: "Procesos adicionales",
    description: "Escala el volumen sin cambiar toda la operación.",
  },
  {
    name: "Reportes automáticos",
    description: "Resúmenes listos para clientes o equipos.",
  },
  {
    name: "Carga masiva asistida",
    description: "Activación acompañada para bases grandes.",
  },
  {
    name: "Revisión asistida",
    description: "Apoyo operativo para fuentes con error o casos que requieren validación.",
  },
  {
    name: "Portal cliente final",
    description: "Acceso controlado para clientes que necesitan seguimiento.",
  },
];

const faqs = [
  {
    question: "¿Esto reemplaza la revisión del abogado?",
    answer:
      "No. LexControl no reemplaza criterio jurídico. Hace visible qué cambió, qué no cambió y qué no se pudo consultar para que el responsable intervenga donde corresponde.",
  },
  {
    question: "¿Por qué no basta con revisar manualmente?",
    answer:
      "Porque la revisión manual puede funcionar, pero no siempre deja trazabilidad. El riesgo está en no saber qué procesos no fueron consultados o qué fuente falló.",
  },
  {
    question: "¿Para quién tiene sentido?",
    answer:
      "Para abogados, firmas y operadores que manejan volumen real de procesos. El punto de partida recomendado es una operación de 50 a 500 procesos activos.",
  },
  {
    question: "¿Qué fuentes consulta?",
    answer:
      "La demo se enfoca inicialmente en CPNU / Rama Judicial. Otras fuentes pueden evaluarse por fase, según disponibilidad técnica y restricciones de acceso.",
  },
  {
    question: "¿Qué pasa si una fuente falla?",
    answer:
      "La falla queda visible. LexControl no la oculta ni la interpreta como ausencia de novedad. El proceso pasa a estado no consultado o error de fuente.",
  },
  {
    question: "¿Puedo cargar mis procesos reales?",
    answer:
      "Sí, la demo controlada está pensada para operar con una muestra real. La activación se coordina antes de cargar radicados o información sensible.",
  },
  {
    question: "¿Qué recibo en la demo gratuita?",
    answer:
      "Una activación controlada con hasta 100 procesos, hasta 4 responsables, bandeja operativa, Lex sobre la demo y revisión de resultados.",
  },
  {
    question: "¿Cuánto dura la demo?",
    answer:
      "La duración recomendada es de 14 días. Es suficiente para observar consultas, fallas, novedades y comportamiento operativo real.",
  },
  {
    question: "¿Tengo que pagar antes de probar?",
    answer:
      "No. Puedes solicitar una demo gratuita antes de elegir plan. Los precios de lanzamiento están visibles para que conozcas el rango desde el inicio.",
  },
];

const processRows: ProcessRow[] = lexDemoRows;

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
  { label: "Responsables con sus procesos", value: "responsables-detalle" },
  { label: "¿Qué casos llevan más tiempo sin cambios?", value: "sin-cambios" },
  { label: "¿Qué requiere prioridad?", value: "prioridad" },
  { label: "Resumen operativo", value: "resumen" },
];

function extractLexUserName(input: string) {
  const value = input.trim();
  if (!value) return "Usuario";

  const cleaned = value
    .replace(/^(si|sí)\s+/i, "")
    .replace(/^(yo\s+)?soy\s+/i, "")
    .replace(/^(me\s+llamo)\s+/i, "")
    .replace(/^(mi\s+nombre\s+es)\s+/i, "")
    .replace(/^(el\s+gusto\s+es\s+)?/i, "")
    .trim();

  return cleaned || value;
}

function formatLexRecordingTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function wait(ms: number) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

const LEX_TYPING_DELAY = 2100;
const LEX_TYPING_DELAY_FALLBACK = 1800;
const LEX_INTRO_DELAY = 1640;
const LEX_AFTER_NAME_DELAY = 1520;

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

  if (intent === "movimientos-detalle") {
    return movedToday.length
      ? movedToday.map((row) => `${row.radicado}: ${row.action}`).join(". ")
      : "No hay movimientos nuevos en las últimas 24 horas dentro de esta muestra.";
  }

  if (intent === "fallas") {
    return failed.length
      ? `${pluralize(failed.length, "proceso no pudo", "procesos no pudieron")} consultarse. No deben tratarse como casos sin novedad.`
      : "No hay procesos con falla de fuente en esta muestra.";
  }

  if (intent === "fallas-detalle") {
    return failed.length
      ? failed.map((row) => `${row.radicado}: ${row.action}`).join(". ")
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

  if (intent === "responsables-detalle") {
    const grouped = rows.reduce<Record<string, string[]>>((acc, row) => {
      if (!acc[row.owner]) acc[row.owner] = [];
      acc[row.owner].push(row.radicado);
      return acc;
    }, {});

    const owners = Object.entries(grouped).sort((a, b) => a[0].localeCompare(b[0], "es"));
    if (!owners.length) return "No hay responsables visibles con el filtro actual.";

    return owners
      .map(([owner, radicados]) => `${owner}: ${radicados.join(", ")}`)
      .join(". ");
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

function inferLexCourtesyIntent(text: string): LexCourtesyIntent | null {
  const value = text
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .trim();

  if (!value) return null;
  if (/^(gracias|muchas gracias|mil gracias|graciaas)$/.test(value)) return "agradecimiento";
  if (/^(hola|buenas|buen dia|buenas tardes|buenas noches|hey)$/.test(value)) return "saludo";
  if (/^(ok|okay|vale|listo|perfecto|entendido|dale|bien)$/.test(value)) return "afirmacion";
  if (/^(chao|adios|hasta luego|nos vemos)$/.test(value)) return "despedida";
  return null;
}

function getLexCourtesyAnswer(intent: LexCourtesyIntent) {
  if (intent === "agradecimiento") {
    return "Recibido. Si quieres, seguimos con movimientos, fallas o prioridad.";
  }

  if (intent === "saludo") {
    return "Estoy listo. Puedo mostrarte qué cambió, qué falló y qué requiere revisión en esta demo.";
  }

  if (intent === "afirmacion") {
    return "Entendido. Puedes seguir con otra consulta sobre la operación visible en la demo.";
  }

  return "Cierro aquí. Si vuelves, retomamos desde la operación visible en esta demo.";
}

function getLexFallbackAnswer(question: string, intent: LexIntent | null, rows: ProcessRow[], history: LexMessage[]) {
  if (intent) {
    return getLexAnswer(
      intent,
      intent === "movimientos" || intent === "movimientos-detalle" ? getRowsByTime(rows, "24h") : rows,
    );
  }

  const courtesyIntent = inferLexCourtesyIntent(question);
  if (courtesyIntent) {
    return getLexCourtesyAnswer(courtesyIntent);
  }

  const lastLexMessage = [...history].reverse().find((message) => message.role === "lex")?.content;
  if (lastLexMessage) {
    return `No pude cerrar bien esa respuesta en este intento. Si quieres, reformula la última pregunta o aclárame a cuál parte de lo anterior te refieres y continúo desde ahí.`;
  }

  return "No pude completar esa respuesta en este intento. Puedes reformular la pregunta o usar una de las consultas sugeridas mientras retomamos el contexto de la demo.";
}

function ActivationModal({
  onClose,
}: {
  onClose: () => void;
}) {
  const [step, setStep] = useState(0);
  const [isSubmitted, setSubmitted] = useState(false);
  const [profileType, setProfileType] = useState("");
  const [caseBand, setCaseBand] = useState("");
  const [reviewMethod, setReviewMethod] = useState("");
  const [primaryRisk, setPrimaryRisk] = useState("");
  const [hasAssignedOwners, setHasAssignedOwners] = useState("");
  const [urgencyLevel, setUrgencyLevel] = useState("");
  const [sampleReadiness, setSampleReadiness] = useState("");
  const [decisionWindow, setDecisionWindow] = useState("");
  const totalSteps = 8;

  const profileTypeOptions = [
    "Abogado independiente",
    "Firma pequeña",
    "Firma mediana o grande",
    "Aseguradora o sector seguros",
    "Área jurídica de empresa",
  ];
  const caseBandOptions = ["Menos de 50", "50 a 100", "101 a 300", "Más de 300"];
  const reviewMethodOptions = [
    "Manual en Rama Judicial",
    "Excel + revisión manual",
    "Dependiente / asistente",
    "Herramienta externa",
    "No hay proceso claro",
  ];
  const primaryRiskOptions = [
    "No detectar actuaciones",
    "No saber qué no se consultó",
    "Errores de fuente",
    "Falta de trazabilidad",
    "Demasiado tiempo operativo",
  ];
  const assignedOwnerOptions = ["Sí", "Parcialmente", "No"];
  const urgencyOptions = ["Baja", "Media", "Alta", "Crítica"];
  const sampleReadinessOptions = [
    "Ya tengo una muestra lista",
    "La puedo preparar esta semana",
    "Necesito ayuda para estructurarla",
  ];
  const decisionWindowOptions = ["Esta semana", "Este mes", "Exploratorio"];

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  function canProceed(currentStep: number) {
    if (currentStep === 0) return true;
    if (currentStep === 1) return Boolean(profileType);
    if (currentStep === 2) return Boolean(caseBand);
    if (currentStep === 3) return Boolean(reviewMethod);
    if (currentStep === 4) return Boolean(primaryRisk);
    if (currentStep === 5) return Boolean(hasAssignedOwners && urgencyLevel);
    if (currentStep === 6) return Boolean(sampleReadiness && decisionWindow);
    if (currentStep === 7) return true;
    return false;
  }

  function goNext() {
    if (!canProceed(step)) return;
    setStep((current) => Math.min(current + 1, totalSteps - 1));
  }

  function goBack() {
    setStep((current) => Math.max(current - 1, 0));
  }

  return (
    <div className="modalLayer" role="dialog" aria-modal="true" aria-labelledby="activation-title">
      <div className="activationModal">
        {!isSubmitted ? (
          <>
            <div className="activationTopbar">
              <div>
                <p className="eyebrow">Demo gratuita controlada</p>
                <div className="progress">
                  <span>{step + 1} de {totalSteps}</span>
                  <div>
                    <i style={{ width: `${((step + 1) / totalSteps) * 100}%` }} />
                  </div>
                </div>
              </div>
              <div className="activationChrome">
                <button
                  className="activationNavButton"
                  type="button"
                  onClick={goBack}
                  aria-label="Volver al paso anterior"
                  disabled={step === 0}
                >
                  ←
                </button>
                <button className="modalClose" type="button" onClick={onClose} aria-label="Cerrar activación">
                  ×
                </button>
              </div>
            </div>

            {step === 0 ? (
              <section className="activationStep">
                <h2 id="activation-title">Activa una demo gratuita con procesos reales.</h2>
                <p>
                  Estamos activando un grupo reducido de abogados y firmas con volumen real de procesos.
                </p>
                <div className="demoTerms">
                  <div>
                    <h3>Qué vas a probar</h3>
                    {demoFeatures.slice(0, 3).map((item) => (
                      <span key={item}>{item}</span>
                    ))}
                  </div>
                  <div>
                    <h3>Qué evaluamos</h3>
                    {[
                      "Tu volumen operativo actual",
                      "El nivel de riesgo que hoy no ves con claridad",
                      "Si vale la pena activar una muestra real contigo",
                    ].map((item) => (
                      <span key={item}>{item}</span>
                    ))}
                  </div>
                </div>
                <div className="activationFooter">
                  <p>
                    En menos de dos minutos validamos si la demo encaja con tu operación.
                  </p>
                  <button className="activationPrimaryNav" type="button" onClick={goNext} aria-label="Continuar">
                    →
                  </button>
                </div>
              </section>
            ) : null}

            {step === 1 ? (
              <section className="activationStep">
                <h2>¿Qué tipo de operación quieres activar?</h2>
                <p>
                  Esto nos ayuda a entender el contexto comercial y la relevancia estratégica de la activación.
                </p>
                <div className="activationChoiceGrid" aria-label="Tipo de operación">
                  {profileTypeOptions.map((option) => (
                    <button
                      key={option}
                      type="button"
                      className={`activationChoiceCard ${profileType === option ? "selected" : ""}`}
                      onClick={() => setProfileType(option)}
                    >
                      <strong>{option}</strong>
                      <span>Perfil operativo del equipo</span>
                    </button>
                  ))}
                </div>
                <div className="activationFooter">
                  <p>{profileType ? `Seleccionado: ${profileType}` : "Selecciona un perfil para continuar."}</p>
                  <button
                    className="activationPrimaryNav"
                    type="button"
                    onClick={goNext}
                    aria-label="Continuar"
                    disabled={!canProceed(step)}
                  >
                    →
                  </button>
                </div>
              </section>
            ) : null}

            {step === 2 ? (
              <section className="activationStep">
                <h2>¿Cuántos procesos vigilas hoy?</h2>
                <p>
                  Queremos entender si esta activación se ajusta al volumen real de tu operación.
                </p>
                <div className="activationChoiceGrid" aria-label="Volumen de procesos">
                  {caseBandOptions.map((option) => (
                    <button
                      key={option}
                      type="button"
                      className={`activationChoiceCard ${caseBand === option ? "selected" : ""}`}
                      onClick={() => setCaseBand(option)}
                    >
                      <strong>{option}</strong>
                      <span>Procesos activos bajo seguimiento</span>
                    </button>
                  ))}
                </div>
                <div className="activationFooter">
                  <p>{caseBand ? `Seleccionado: ${caseBand}` : "Selecciona un rango para continuar."}</p>
                  <button
                    className="activationPrimaryNav"
                    type="button"
                    onClick={goNext}
                    aria-label="Continuar"
                    disabled={!canProceed(step)}
                  >
                    →
                  </button>
                </div>
              </section>
            ) : null}

            {step === 3 ? (
              <section className="activationStep">
                <h2>¿Cómo revisan hoy las novedades?</h2>
                <p>
                  Aquí buscamos entender el punto de partida operativo de la vigilancia.
                </p>
                <div className="activationChoiceGrid compact" aria-label="Método actual de revisión">
                  {reviewMethodOptions.map((option) => (
                    <button
                      key={option}
                      type="button"
                      className={`activationChoiceChip ${reviewMethod === option ? "selected" : ""}`}
                      onClick={() => setReviewMethod(option)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
                <div className="activationFooter">
                  <p>{reviewMethod ? `Seleccionado: ${reviewMethod}` : "Selecciona el método actual para continuar."}</p>
                  <button
                    className="activationPrimaryNav"
                    type="button"
                    onClick={goNext}
                    aria-label="Continuar"
                    disabled={!canProceed(step)}
                  >
                    →
                  </button>
                </div>
              </section>
            ) : null}

            {step === 4 ? (
              <section className="activationStep">
                <h2>¿Dónde está hoy el mayor riesgo?</h2>
                <p>
                  Esto nos ayuda a entender qué problema debe demostrar la demo para que tenga sentido activarla.
                </p>

                <div className="activationQuestionBlock">
                  <span>Principal punto ciego</span>
                  <div className="activationChoiceGrid compact">
                    {primaryRiskOptions.map((option) => (
                      <button
                        key={option}
                        type="button"
                        className={`activationChoiceChip ${primaryRisk === option ? "selected" : ""}`}
                        onClick={() => setPrimaryRisk(option)}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="activationFooter">
                  <p>
                    {canProceed(step)
                      ? "Perfecto. Ya sabemos qué tendría que resolver la demo en tu caso."
                      : "Selecciona el principal riesgo para continuar."}
                  </p>
                  <button
                    className="activationPrimaryNav"
                    type="button"
                    onClick={goNext}
                    aria-label="Continuar"
                    disabled={!canProceed(step)}
                  >
                    →
                  </button>
                </div>
              </section>
            ) : null}

            {step === 5 ? (
              <section className="activationStep">
                <h2>¿Qué tan prioritaria es esta activación?</h2>
                <p>
                  Con esto medimos visibilidad interna, urgencia y qué tanto seguimiento necesitaría la cuenta.
                </p>

                <div className="activationMetaGrid">
                  <div className="activationQuestionBlock">
                    <span>Responsables asignados</span>
                    <div className="activationChoiceGrid compact compact-three">
                      {assignedOwnerOptions.map((option) => (
                        <button
                          key={option}
                          type="button"
                          className={`activationChoiceChip ${hasAssignedOwners === option ? "selected" : ""}`}
                          onClick={() => setHasAssignedOwners(option)}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="activationQuestionBlock">
                    <span>Urgencia para activar</span>
                    <div className="activationChoiceGrid compact compact-three">
                      {urgencyOptions.map((option) => (
                        <button
                          key={option}
                          type="button"
                          className={`activationChoiceChip ${urgencyLevel === option ? "selected" : ""}`}
                          onClick={() => setUrgencyLevel(option)}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="activationFooter">
                  <p>
                    {canProceed(step)
                      ? "Bien. Ya tenemos una señal clara de prioridad."
                      : "Completa responsables y urgencia para continuar."}
                  </p>
                  <button
                    className="activationPrimaryNav"
                    type="button"
                    onClick={goNext}
                    aria-label="Continuar"
                    disabled={!canProceed(step)}
                  >
                    →
                  </button>
                </div>
              </section>
            ) : null}

            {step === 6 ? (
              <section className="activationStep">
                <h2>¿Qué tan lista está esta activación?</h2>
                <p>
                  Esto nos permite saber si la cuenta puede avanzar rápido o si requiere una activación más asistida.
                </p>
                <div className="activationQuestionBlock">
                  <span>Disponibilidad para activar</span>
                  <div className="activationMetaGrid">
                    <div className="activationChoiceGrid compact compact-three">
                      {sampleReadinessOptions.map((option) => (
                        <button
                          key={option}
                          type="button"
                          className={`activationChoiceChip ${sampleReadiness === option ? "selected" : ""}`}
                          onClick={() => setSampleReadiness(option)}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                    <div className="activationChoiceGrid compact compact-three">
                      {decisionWindowOptions.map((option) => (
                        <button
                          key={option}
                          type="button"
                          className={`activationChoiceChip ${decisionWindow === option ? "selected" : ""}`}
                          onClick={() => setDecisionWindow(option)}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="activationFooter">
                  <p>
                    {canProceed(step)
                      ? "Perfecto. Ya sabemos qué tan rápido podría activarse esta cuenta."
                      : "Define disponibilidad y ventana de decisión para continuar."}
                  </p>
                  <button
                    className="activationPrimaryNav"
                    type="button"
                    onClick={goNext}
                    aria-label="Continuar"
                    disabled={!canProceed(step)}
                  >
                    →
                  </button>
                </div>
              </section>
            ) : null}

            {step === 7 ? (
              <form className="activationStep" onSubmit={submit}>
                <h2>Solicita la activación.</h2>
                <p>
                  No necesitas enviar radicados ni datos sensibles. Solo el contexto necesario para coordinar la demo.
                </p>
                <div className="activationSnapshot">
                  <span>{profileType}</span>
                  <span>{caseBand}</span>
                  <span>{reviewMethod}</span>
                  <span>{primaryRisk}</span>
                  <span>{hasAssignedOwners}</span>
                  <span>{urgencyLevel}</span>
                  <span>{sampleReadiness}</span>
                  <span>{decisionWindow}</span>
                </div>
                <div className="activationForm">
                  <label>
                    Nombre
                    <input required name="name" autoComplete="name" />
                  </label>
                  <label>
                    Correo
                    <input required type="email" name="email" autoComplete="email" />
                  </label>
                  <label>
                    WhatsApp
                    <input required name="phone" autoComplete="tel" />
                  </label>
                  <label>
                    Firma o empresa
                    <input name="company" autoComplete="organization" />
                  </label>
                  <label>
                    Ciudad
                    <input name="city" autoComplete="address-level2" />
                  </label>
                  <label>
                    Número aproximado de procesos
                    <input name="caseCount" inputMode="numeric" />
                  </label>
                  <label className="fullField">
                    Mensaje opcional
                    <textarea name="message" rows={3} />
                  </label>
                </div>
                <div className="activationFooter">
                  <p>
                    {canProceed(step)
                      ? "Coordinaremos una sesión para revisar alcance, carga inicial y decisión de activación."
                      : "Define disponibilidad y ventana de decisión para solicitar la activación."}
                  </p>
                  <button
                    className="activationSubmit"
                    type="submit"
                    aria-label="Solicitar activación"
                    disabled={!canProceed(step)}
                  >
                    →
                  </button>
                </div>
              </form>
            ) : null}
          </>
        ) : (
          <section className="activationStep">
            <p className="eyebrow">Solicitud recibida</p>
            <h2>Revisaremos si tu operación encaja con la demo controlada.</h2>
            <p>Coordinaremos una sesión de activación para revisar el alcance y preparar la carga inicial.</p>
            <button className="activationPrimaryNav" type="button" onClick={onClose} aria-label="Cerrar activación">
              →
            </button>
          </section>
        )}
      </div>
    </div>
  );
}

function App() {
  const [isActivationOpen, setActivationOpen] = useState(false);
  const [operationalFilter, setOperationalFilter] = useState<OperationalFilter>("todos");
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("todos");
  const [ownerFilter, setOwnerFilter] = useState("todos");
  const [isLexOpen, setLexOpen] = useState(false);
  const [isLexTyping, setLexTyping] = useState(false);
  const [isMobileNavOpen, setMobileNavOpen] = useState(false);
  const [lexInput, setLexInput] = useState("");
  const [isLexListening, setLexListening] = useState(false);
  const [lexSpeechTranscript, setLexSpeechTranscript] = useState("");
  const [lexListeningSeconds, setLexListeningSeconds] = useState(0);
  const [lexUserName, setLexUserName] = useState<string | null>(null);
  const [hasStartedLexIntro, setHasStartedLexIntro] = useState(false);
  const [isAwaitingLexName, setAwaitingLexName] = useState(false);
  const [isLexReady, setLexReady] = useState(false);
  const [usedLexPrompts, setUsedLexPrompts] = useState<LexIntent[]>([]);
  const [lexMessages, setLexMessages] = useState<LexMessage[]>([]);
  const lexMessagesRef = useRef<HTMLDivElement | null>(null);
  const lexTypingTimeoutRef = useRef<number | null>(null);
  const speechRecognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const lexListeningTimerRef = useRef<number | null>(null);
  const lexSpeechFinalRef = useRef("");
  const lexShouldResumeListeningRef = useRef(false);
  const rowsByTime = getRowsByTime(processRows, timeFilter);
  const rowsByOperationalState = getRowsByOperationalState(rowsByTime, operationalFilter);
  const visibleRows = rowsByOperationalState.filter((row) => ownerFilter === "todos" || row.owner === ownerFilter);
  const ownerOptions = Array.from(new Set(processRows.map((row) => row.owner))).sort();
  const canUseSpeechRecognition =
    typeof window !== "undefined" && Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);
  const summary = {
    novedades: rowsByTime.filter((row) => row.statusType === "novedad").length,
    sinCambios: rowsByTime.filter((row) => row.statusType === "sin-cambios").length,
    noConsultados: rowsByTime.filter((row) => row.statusType === "no-consultado").length,
    errores: rowsByTime.filter((row) => row.statusType === "error-fuente").length,
    responsables: new Set(rowsByTime.map((row) => row.owner)).size,
  };
  const mobileTrayFilter =
    operationalFilter === "sin-cambios" || operationalFilter === "error-fuente" || operationalFilter === "no-consultado"
      ? operationalFilter
      : operationalFilter === "todos"
        ? "novedad"
        : operationalFilter;
  const mobileTrayRows = rowsByTime
    .filter((row) => ownerFilter === "todos" || row.owner === ownerFilter)
    .filter((row) => {
      if (mobileTrayFilter === "sin-cambios") return row.statusType === "sin-cambios";
      if (mobileTrayFilter === "error-fuente" || mobileTrayFilter === "no-consultado") {
        return row.statusType === "error-fuente" || row.statusType === "no-consultado";
      }
      return row.statusType === "novedad";
    })
    .slice(0, 3);
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
  const visibleLexPrompts = isLexReady ? lexPrompts.filter((prompt) => !usedLexPrompts.includes(prompt.value)) : [];

  useEffect(() => {
    lexMessagesRef.current?.scrollTo({
      top: lexMessagesRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [lexMessages, isLexOpen, isLexTyping]);

  useEffect(() => {
    return () => {
      if (lexTypingTimeoutRef.current) {
        window.clearTimeout(lexTypingTimeoutRef.current);
      }
      if (lexListeningTimerRef.current) {
        window.clearInterval(lexListeningTimerRef.current);
      }
      speechRecognitionRef.current?.stop();
    };
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) return;

    let animationFrame = 0;

    function updateHeroParallax() {
      const offset = Math.min(window.scrollY * 0.08, 42);
      document.documentElement.style.setProperty("--hero-parallax", `${offset}px`);
      animationFrame = 0;
    }

    function handleScroll() {
      if (animationFrame) return;
      animationFrame = window.requestAnimationFrame(updateHeroParallax);
    }

    updateHeroParallax();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (animationFrame) {
        window.cancelAnimationFrame(animationFrame);
      }
      document.documentElement.style.removeProperty("--hero-parallax");
    };
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const revealElements = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));

    if (mediaQuery.matches || !("IntersectionObserver" in window)) {
      revealElements.forEach((element) => element.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.16 },
    );

    revealElements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  function applyLexIntent(intent: LexIntent) {
    if (intent === "movimientos") {
      setOperationalFilter("novedad");
      setTimeFilter("24h");
      setOwnerFilter("todos");
    }

    if (intent === "fallas") {
      setOperationalFilter("no-consultado");
      setTimeFilter("todos");
      setOwnerFilter("todos");
    }

    if (intent === "sin-cambios") {
      setOperationalFilter("sin-cambios");
      setTimeFilter("todos");
      setOwnerFilter("todos");
    }

    if (intent === "prioridad" || intent === "responsables" || intent === "responsables-detalle" || intent === "resumen") {
      setOperationalFilter("todos");
      setTimeFilter("todos");
      setOwnerFilter("todos");
    }
  }

  function consumeLexPrompt(intent: LexIntent) {
    setUsedLexPrompts((current) => (current.includes(intent) ? current : [...current, intent]));
  }

  function scheduleLexMessage(message: string, after: number, callback?: () => void) {
    if (lexTypingTimeoutRef.current) {
      window.clearTimeout(lexTypingTimeoutRef.current);
    }

    setLexTyping(true);
    lexTypingTimeoutRef.current = window.setTimeout(() => {
      setLexMessages((current) => [...current, { id: current.length + 1, role: "lex", content: message }]);
      setLexTyping(false);
      lexTypingTimeoutRef.current = null;
      callback?.();
    }, after);
  }

  function startLexIntro() {
    if (hasStartedLexIntro) return;
    setHasStartedLexIntro(true);
    scheduleLexMessage(
      "Soy Lex, la voz del sistema. Mi función es mostrar qué cambió, qué no cambió y qué falló dentro de esta demo operativa.",
      LEX_INTRO_DELAY,
      () => {
        scheduleLexMessage("¿Con quién tengo el gusto?", LEX_INTRO_DELAY, () => {
          setAwaitingLexName(true);
        });
      },
    );
  }

  async function askLex(intent: LexIntent | null, question: string) {
    if (isLexTyping) return;
    setLexOpen(true);

    if (intent) {
      consumeLexPrompt(intent);
      applyLexIntent(intent);
    }

    setLexMessages((current) => [...current, { id: current.length + 1, role: "user", content: question }]);
    setLexTyping(true);
    const recentHistory = [...lexMessages.slice(-8), { id: lexMessages.length + 1, role: "user", content: question } as LexMessage];

    if (lexTypingTimeoutRef.current) {
      window.clearTimeout(lexTypingTimeoutRef.current);
    }

    try {
      const [response] = await Promise.all([
        fetch("/api/lex-chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            question,
            intent,
            userName: lexUserName,
            history: lexMessages.slice(-8),
            rows: processRows,
            currentState: {
              operationalFilter,
              timeFilter,
              ownerFilter,
              visibleRows,
              summary,
            },
          }),
        }),
        wait(LEX_TYPING_DELAY),
      ]);

      const payload = (await response.json()) as { answer?: string };
      const answer = payload.answer?.trim() || getLexFallbackAnswer(question, intent, processRows, recentHistory);
      setLexMessages((current) => [...current, { id: current.length + 1, role: "lex", content: answer }]);
    } catch {
      await wait(LEX_TYPING_DELAY_FALLBACK);
      const fallback = getLexFallbackAnswer(question, intent, processRows, recentHistory);
      setLexMessages((current) => [...current, { id: current.length + 1, role: "lex", content: fallback }]);
    } finally {
      setLexTyping(false);
      lexTypingTimeoutRef.current = null;
    }
  }

  function stopLexListening(options?: { preserveTranscript?: boolean }) {
    lexShouldResumeListeningRef.current = false;
    speechRecognitionRef.current?.stop();
    speechRecognitionRef.current = null;
    if (lexListeningTimerRef.current) {
      window.clearInterval(lexListeningTimerRef.current);
      lexListeningTimerRef.current = null;
    }
    setLexListening(false);
    setLexListeningSeconds(0);

    if (!options?.preserveTranscript) {
      lexSpeechFinalRef.current = "";
      setLexSpeechTranscript("");
    }
  }

  async function submitLexContent(content: string) {
    const question = content.trim();
    if (!question || isLexTyping) return;

    if (isAwaitingLexName) {
      const userName = extractLexUserName(question);
      setLexUserName(userName);
      setAwaitingLexName(false);
      setLexMessages((current) => [...current, { id: current.length + 1, role: "user", content: question }]);
      scheduleLexMessage(
        `Mucho gusto, ${userName}. Aquí podrás ver lo que ocurre en el sistema. Puedes tocar cualquiera de estas sugerencias para explorar la demo o escribir o dictar tu propia pregunta.`,
        LEX_AFTER_NAME_DELAY,
        () => {
          setLexReady(true);
        },
      );
      return;
    }

    await askLex(null, question);
  }

  async function submitLexQuestion(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isLexTyping) return;
    const question = (isLexListening ? lexSpeechTranscript : lexInput).trim();
    if (!question) return;

    if (isLexListening) {
      stopLexListening();
    }

    await submitLexContent(question);
    setLexInput("");
    setLexSpeechTranscript("");
  }

  function toggleLex() {
    const next = !isLexOpen;
    setLexOpen(next);

    if (!next) {
      stopLexListening();
    }

    if (next && !hasStartedLexIntro) {
      startLexIntro();
    }
  }

  function closeLex() {
    stopLexListening();
    setLexOpen(false);
  }

  function startLexListeningSession() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "es-CO";
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      let finalTranscript = lexSpeechFinalRef.current;
      let interimTranscript = "";

      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        const piece = event.results[index][0]?.transcript ?? "";

        if (event.results[index].isFinal) {
          finalTranscript = `${finalTranscript} ${piece}`.trim();
        } else {
          interimTranscript += piece;
        }
      }

      lexSpeechFinalRef.current = finalTranscript;
      setLexSpeechTranscript(`${finalTranscript} ${interimTranscript}`.trim());
    };

    recognition.onerror = () => {
      stopLexListening({ preserveTranscript: true });
    };

    recognition.onend = () => {
      speechRecognitionRef.current = null;

      if (lexShouldResumeListeningRef.current) {
        window.setTimeout(() => {
          if (!lexShouldResumeListeningRef.current) return;
          startLexListeningSession();
        }, 180);
        return;
      }

      stopLexListening({ preserveTranscript: true });
    };

    speechRecognitionRef.current = recognition;
    recognition.start();
  }

  function toggleLexListening() {
    if (isLexTyping) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      return;
    }

    if (isLexListening) {
      stopLexListening({ preserveTranscript: true });
      setLexInput(lexSpeechTranscript.trim());
      return;
    }

    lexShouldResumeListeningRef.current = true;
    setLexListening(true);
    setLexInput("");
    lexSpeechFinalRef.current = "";
    setLexSpeechTranscript("");
    setLexListeningSeconds(0);
    if (lexListeningTimerRef.current) {
      window.clearInterval(lexListeningTimerRef.current);
    }
    lexListeningTimerRef.current = window.setInterval(() => {
      setLexListeningSeconds((current) => current + 1);
    }, 1000);
    startLexListeningSession();
  }

  return (
    <main className="app">
      <header className="topbar">
        <a className="brand" href="#inicio" aria-label="LexControl inicio">
          <img src={logoUrl} alt="LexControl" />
        </a>
        <button
          className="menuToggle"
          type="button"
          onClick={() => setMobileNavOpen((current) => !current)}
          aria-expanded={isMobileNavOpen}
          aria-controls="primary-navigation"
        >
          <span>Menú</span>
          <i aria-hidden="true" />
        </button>
        <nav className={`nav ${isMobileNavOpen ? "is-open" : ""}`} id="primary-navigation" aria-label="Principal">
          <a href="#problema" onClick={() => setMobileNavOpen(false)}>Problema</a>
          <a href="#control" onClick={() => setMobileNavOpen(false)}>Cómo funciona</a>
          <a href="#preguntas" onClick={() => setMobileNavOpen(false)}>Preguntas</a>
          <a href="#precios" onClick={() => setMobileNavOpen(false)}>Precios</a>
          <button
            className="mobileNavCta"
            type="button"
            onClick={() => {
              setMobileNavOpen(false);
              setActivationOpen(true);
            }}
          >
            Activar demo gratis
          </button>
        </nav>
        <button className="navCta" type="button" onClick={() => setActivationOpen(true)}>
          Activar demo gratis
        </button>
      </header>

      <section className="hero" id="inicio">
        <div className="heroContent" data-reveal>
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
            <button className="button primary" type="button" onClick={() => setActivationOpen(true)}>
              Activar demo gratis
            </button>
            <a className="button ghostLink" href="#control">
              Ver cómo funciona
            </a>
          </div>
          <p className="microcopy">
            Demo controlada para abogados y firmas que manejan volumen real de procesos.
            No necesitas datos sensibles para solicitar acceso.
          </p>
        </div>
      </section>

      <section className="transitionSection" data-reveal>
        <p>Puedes revisar procesos todos los días.</p>
        <strong>Y aún así estar dejando casos sin revisar.</strong>
      </section>

      <section className="problemSection" id="problema" data-reveal>
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

      <section className="diagnosticEntry" id="diagnostico" data-reveal>
        <div>
          <p className="eyebrow">Diagnóstico de Riesgo Operativo Judicial</p>
          <h2>Este diagnóstico no mide qué tan organizado estás.</h2>
          <p>Hace parte de la activación de demo y mide qué tan expuesta está tu operación a errores que no puedes detectar.</p>
        </div>
        <button className="button primary" type="button" onClick={() => setActivationOpen(true)}>
          Activar demo gratis
        </button>
      </section>

      <section className="solutionSection" data-reveal>
        <div>
          <p className="eyebrow">Solución</p>
          <h2>De revisión manual a control operativo.</h2>
        </div>
        <div className="solutionFlow" aria-label="Flujo operativo de LexControl">
          {solutionBlocks.map((item, index) => (
            <article className="solutionStep" key={item.title} data-reveal>
              <span>{index + 1}</span>
              <div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="modelShift" data-reveal>
        <div className="shiftColumn">
          <span>Hoy operas así</span>
          <strong>Revisión manual, Excel, mensajes y supuestos.</strong>
          <ul>
            <li>Revisión manual</li>
            <li>Excel</li>
            <li>Mensajes</li>
            <li>Suposiciones</li>
          </ul>
        </div>
        <div className="shiftDivider" aria-hidden="true">
          <i />
        </div>
        <div className="shiftColumn">
          <span>Con LexControl</span>
          <strong>Una operación visible, trazable y priorizada.</strong>
          <ul>
            <li>Una bandeja clara</li>
            <li>Estados visibles</li>
            <li>Errores identificados</li>
            <li>Responsables asignados</li>
          </ul>
        </div>
      </section>

      <section className="controlSurface" id="control" aria-label="Panel de control LexControl" data-reveal>
        <div className="controlHeader">
          <div>
            <p className="eyebrow">Panel</p>
            <h2>Una bandeja para decidir. No otra tabla para revisar.</h2>
            <p>Todo en un solo lugar. Con trazabilidad.</p>
          </div>
        </div>

        <div className="controlWorkbenchFrame">
          <div className="controlWorkbenchBar" aria-hidden="true">
            <div className="controlWorkbenchDots">
              <i />
              <i />
              <i />
            </div>
            <span>Vista demo operativa</span>
            <small>LexControl / muestra congelada</small>
          </div>

          <div className="stateGrid">
            <button type="button" onClick={() => { setOperationalFilter("novedad"); setOwnerFilter("todos"); }}>
              <strong>{summary.novedades}</strong>
              <span>Procesos con novedad</span>
            </button>
            <button type="button" onClick={() => { setOperationalFilter("sin-cambios"); setOwnerFilter("todos"); }}>
              <strong>{summary.sinCambios}</strong>
              <span>Procesos sin cambios</span>
            </button>
            <button type="button" onClick={() => { setOperationalFilter("no-consultado"); setOwnerFilter("todos"); }}>
              <strong>{summary.noConsultados}</strong>
              <span>Procesos no consultados</span>
            </button>
            <button type="button" onClick={() => { setOperationalFilter("error-fuente"); setOwnerFilter("todos"); }}>
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

          <section className="mobileTrayIntro" aria-label="Resumen mobile de la bandeja">
            <div className="mobileSignalStrip">
              <article>
                <strong>{rowsByTime.length}</strong>
                <span>procesos</span>
              </article>
              <article>
                <strong>{summary.novedades}</strong>
                <span>novedad</span>
              </article>
              <article>
                <strong>{summary.noConsultados + summary.errores}</strong>
                <span>fallas</span>
              </article>
              <article>
                <strong>{summary.sinCambios}</strong>
                <span>sin cambios</span>
              </article>
            </div>

            <div className="mobileTrayTabs" role="tablist" aria-label="Estados principales de la bandeja">
              <button
                type="button"
                role="tab"
                aria-selected={mobileTrayFilter === "novedad"}
                className={mobileTrayFilter === "novedad" ? "active" : ""}
                onClick={() => setOperationalFilter("novedad")}
              >
                Novedades
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={mobileTrayFilter === "error-fuente" || mobileTrayFilter === "no-consultado"}
                className={mobileTrayFilter === "error-fuente" || mobileTrayFilter === "no-consultado" ? "active" : ""}
                onClick={() => setOperationalFilter("error-fuente")}
              >
                Fallas
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={mobileTrayFilter === "sin-cambios"}
                className={mobileTrayFilter === "sin-cambios" ? "active" : ""}
                onClick={() => setOperationalFilter("sin-cambios")}
              >
                Sin cambios
              </button>
            </div>

            <div className="mobileFilterBar" aria-label="Filtros mobile">
              <label>
                Fecha
                <select
                  value={timeFilter}
                  onChange={(event) => setTimeFilter(event.target.value as TimeFilter)}
                  aria-label="Filtrar por fecha en mobile"
                >
                  {timeFilters.map((item) => (
                    <option value={item.value} key={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Responsable
                <select
                  value={ownerFilter}
                  onChange={(event) => setOwnerFilter(event.target.value)}
                  aria-label="Filtrar por responsable en mobile"
                >
                  <option value="todos">Todos</option>
                  {ownerOptions.map((owner) => (
                    <option value={owner} key={owner}>
                      {owner}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </section>

          <div className="workbench">
            <section className="tablePanel desktopTrayPanel" aria-label="Procesos monitoreados">
            <div className="tableHeader">
              <span>Radicado</span>
              <label>
                Estado
                <select
                  value={operationalFilter}
                  onChange={(event) => setOperationalFilter(event.target.value as OperationalFilter)}
                  aria-label="Filtrar por estado"
                >
                  {operationalFilters.map((item) => (
                    <option value={item.value} key={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </label>
              <span>Última actuación</span>
              <label>
                Fecha
                <select
                  value={timeFilter}
                  onChange={(event) => setTimeFilter(event.target.value as TimeFilter)}
                  aria-label="Filtrar por fecha"
                >
                  {timeFilters.map((item) => (
                    <option value={item.value} key={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Responsable
                <select
                  value={ownerFilter}
                  onChange={(event) => setOwnerFilter(event.target.value)}
                  aria-label="Filtrar por responsable"
                >
                  <option value="todos">Todos</option>
                  {ownerOptions.map((owner) => (
                    <option value={owner} key={owner}>
                      {owner}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="tableBody">
              {visibleRows.map((row) => (
                <article className={`processRow ${row.state}`} key={row.radicado}>
                  <span className="radicado" data-label="Radicado">{row.radicado}</span>
                  <span className={`badge ${row.state}`} data-label="Estado">{row.status}</span>
                  <span data-label="Última actuación">
                    <strong>{row.action}</strong>
                    <small>{row.annotation}</small>
                  </span>
                  <time data-label="Fecha">{row.date}</time>
                  <span data-label="Responsable">
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
            </div>
            </section>

            <section className="mobileTrayPanel" aria-label="Procesos monitoreados en mobile">
              <div className="mobileTrayHeader">
                <strong>
                  {mobileTrayFilter === "sin-cambios"
                    ? "Procesos sin cambios"
                    : mobileTrayFilter === "error-fuente" || mobileTrayFilter === "no-consultado"
                      ? "Procesos con fallas"
                      : "Procesos con novedad"}
                </strong>
                <span>Mostrando hasta 3 casos de la muestra.</span>
              </div>
              <div className="mobileProcessList">
                {mobileTrayRows.map((row) => (
                  <details className={`mobileProcessCard ${row.state}`} key={row.radicado}>
                    <summary>
                      <span className={`badge ${row.state}`}>{row.status}</span>
                      <strong>{row.radicado}</strong>
                      <p>{row.action}</p>
                      <small>{row.owner} · {row.date}</small>
                    </summary>
                    <div className="mobileProcessMeta">
                      <div>
                        <span>Anotación</span>
                        <p>{row.annotation}</p>
                      </div>
                      <div>
                        <span>Fuente</span>
                        <p>{row.source}</p>
                      </div>
                      <div>
                        <span>Prioridad</span>
                        <p>{row.priority}</p>
                      </div>
                    </div>
                  </details>
                ))}
                {mobileTrayRows.length === 0 ? (
                  <div className="emptyState">
                    No hay procesos en esta vista. Cambia el filtro para ver otra señal operativa.
                  </div>
                ) : null}
              </div>
            </section>
          </div>
        </div>

        <div className="lexFloatingLayer" aria-live="polite">
          {isLexOpen ? <button className="lexBackdrop" type="button" aria-label="Cerrar Lex" onClick={closeLex} /> : null}
          <button
            className="lexOrb"
            type="button"
            onClick={toggleLex}
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
                <button type="button" onClick={closeLex} aria-label="Cerrar Lex">
                  ×
                </button>
              </header>

              <div className="lexMessages" ref={lexMessagesRef}>
                {lexMessages.map((message) => (
                  <article className={`lexMessage ${message.role}`} key={message.id}>
                    {message.role === "lex" ? (
                      <span className="lexSpeaker">
                        <img src={lexSymbolUrl} alt="" aria-hidden="true" />
                        Lex
                      </span>
                    ) : (
                      <span>{lexUserName ?? "Usuario"}</span>
                    )}
                    <p>{message.content}</p>
                  </article>
                ))}
                {isLexTyping ? (
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

              {visibleLexPrompts.length ? (
                <div className="lexPromptRail" aria-label="Consultas sugeridas">
                  {visibleLexPrompts.map((prompt) => (
                    <button
                      type="button"
                      key={prompt.value}
                      onClick={() => {
                        void askLex(prompt.value, prompt.label);
                      }}
                      disabled={isLexTyping}
                    >
                      {prompt.label}
                    </button>
                  ))}
                </div>
              ) : null}

              <form className="lexInputBar" onSubmit={submitLexQuestion}>
                {isLexListening ? (
                  <div className="lexListeningField" aria-live="polite" aria-label="Grabación en curso">
                    <div className="lexListeningMeta">
                      <span>Escuchando</span>
                      <strong>{formatLexRecordingTime(lexListeningSeconds)}</strong>
                    </div>
                    <div className="lexListeningWave" aria-hidden="true">
                      <div className="lexListeningWaveTrack">
                        <i />
                        <i />
                        <i />
                        <i />
                        <i />
                        <i />
                        <i />
                        <i />
                        <i />
                        <i />
                        <i />
                        <i />
                      </div>
                    </div>
                  </div>
                ) : (
                  <input
                    value={lexInput}
                    onChange={(event) => setLexInput(event.target.value)}
                    placeholder={isAwaitingLexName ? "Escribe tu nombre" : "Pregunta por movimientos, fallas o responsables"}
                    aria-label="Pregunta para Lex"
                    disabled={isLexTyping}
                  />
                )}
                <div className="lexInputActions">
                  <button
                    className={`lexMicButton ${isLexListening ? "is-listening" : ""}`}
                    type="button"
                    onClick={toggleLexListening}
                    aria-label={isLexListening ? "Detener dictado" : "Iniciar dictado"}
                    aria-pressed={isLexListening}
                    disabled={isLexTyping || !canUseSpeechRecognition}
                  >
                    {isLexListening ? (
                      <span className="lexStopIcon" aria-hidden="true" />
                    ) : (
                      <svg className="lexMicSvg" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M12 15.25A3.25 3.25 0 0 0 15.25 12V7a3.25 3.25 0 1 0-6.5 0v5A3.25 3.25 0 0 0 12 15.25Zm5.25-3.5a.75.75 0 0 0-1.5 0 3.75 3.75 0 0 1-7.5 0 .75.75 0 0 0-1.5 0 5.26 5.26 0 0 0 4.5 5.19V19H9.5a.75.75 0 0 0 0 1.5h5a.75.75 0 0 0 0-1.5h-1.75v-2.06a5.26 5.26 0 0 0 4.5-5.19Z" />
                      </svg>
                    )}
                  </button>
                  <button className="lexSendButton" type="submit" aria-label="Enviar mensaje" disabled={isLexTyping}>
                    ↑
                  </button>
                </div>
              </form>
            </section>
          ) : null}
        </div>
      </section>

      <section className="beta" id="demo" data-reveal>
        <div className="betaContent">
          <p className="eyebrow">Demo gratuita controlada</p>
          <h2>Activa LexControl con una muestra real de tu operación.</h2>
          <p>Estamos activando un grupo reducido de abogados y firmas que operan volumen real de procesos.</p>
          <p>Ideal para equipos que manejan 50 a 500 procesos activos.</p>
          <ul className="demoChecklist">
            <li>Hasta 100 procesos</li>
            <li>Hasta 4 responsables</li>
            <li>Bandeja operativa</li>
            <li>Lex sobre la demo</li>
          </ul>
          <small>La activación se coordina con una muestra real y sin pedir datos sensibles en el primer paso.</small>
        </div>
        <button className="button primary" type="button" onClick={() => setActivationOpen(true)}>
          Activar demo gratis
        </button>
      </section>

      <section className="faqSection" id="preguntas" data-reveal>
        <div className="sectionIntro">
          <p className="eyebrow">Preguntas frecuentes</p>
          <h2>Antes de hablar de precio, aclaremos la operación.</h2>
          <p>
            Estas respuestas explican por qué existe LexControl, cómo opera la demo y qué recibe un equipo durante la activación controlada.
          </p>
        </div>
        <div className="faqGrid">
          {faqs.map((item) => (
            <details className="faqItem" key={item.question}>
              <summary>{item.question}</summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="pricingSection" id="precios" data-reveal>
        <div className="sectionIntro">
          <p className="eyebrow">Precios de lanzamiento</p>
          <h2>Precios claros antes de activar la demo.</h2>
          <p>
            Puedes activar una demo gratuita antes de elegir plan. Estos precios aplican
            para los primeros equipos que validen LexControl con procesos reales.
          </p>
        </div>
        <div className="pricingGrid">
          {launchPlans.map((plan) => (
            <article className={`pricingCard ${plan.featured ? "featured" : ""}`} key={plan.name} data-reveal>
              {plan.featured ? <span className="planTag">Más útil para operar</span> : null}
              <h3>{plan.name}</h3>
              <strong>{plan.price}</strong>
              <small>/ mes</small>
              <p>{plan.scope}</p>
              <div>
                {plan.features.map((feature) => (
                  <span key={feature}>{feature}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
        <div className="pricingNote">
          <span>Más de 500 procesos</span>
          <p>Planes Operativo y Enterprise según volumen.</p>
          <button className="button primary" type="button" onClick={() => setActivationOpen(true)}>
            Activar demo gratis
          </button>
        </div>
        <div className="addOnsPanel" data-reveal>
          <div>
            <p className="eyebrow">Complementos disponibles</p>
            <h3>Activa más capacidad según plan y volumen.</h3>
          </div>
          <div className="addOnsGrid">
            {addOns.map((addOn) => (
              <article key={addOn.name}>
                <strong>{addOn.name}</strong>
                <p>{addOn.description}</p>
              </article>
            ))}
          </div>
          <p className="addOnsNote">Disponibles según plan, volumen y canal de comunicación.</p>
        </div>
      </section>

      <section className="closingSection" data-reveal>
        <h2>No puedes controlar lo que no puedes ver.</h2>
        <p>Activa una demo gratuita y revisa cómo se ve tu operación cuando cada consulta deja trazabilidad.</p>
        <strong>LexControl convierte esa incertidumbre en sistema.</strong>
        <button className="button primary" type="button" onClick={() => setActivationOpen(true)}>
          Activar demo gratis
        </button>
      </section>

      <footer className="siteFooter" data-reveal>
        <div className="footerBrand">
          <img src={logoUrl} alt="LexControl" />
        </div>
        <div className="footerBlock">
          <span>Contacto</span>
          <a href="https://lexcontrol.co">lexcontrol.co</a>
          <a href="mailto:lex@lexcontrol.co">lex@lexcontrol.co</a>
          <a className="footerIconLink" href="https://wa.me/573192509637" aria-label="Abrir WhatsApp de LexControl">
            <SocialIcon name="whatsapp" />
            WhatsApp
          </a>
          <a href="tel:+573192509637">+57 319 250-9637</a>
          <p>Calle 63 # 1-59, apartamento 3102. Bogotá, Colombia.</p>
        </div>
        <div className="footerBlock">
          <span>Producto</span>
          <a href="#control">Bandeja operativa</a>
          <a href="#demo">Demo gratuita</a>
          <a href="#precios">Precios</a>
          <a href="#preguntas">Preguntas frecuentes</a>
        </div>
        <div className="footerBlock">
          <span>Social</span>
          <div className="socialLinks" aria-label="Redes sociales">
            <a href="https://www.linkedin.com/" aria-label="LinkedIn">
              <SocialIcon name="linkedin" />
            </a>
            <a href="https://www.instagram.com/" aria-label="Instagram">
              <SocialIcon name="instagram" />
            </a>
            <a href="https://www.facebook.com/" aria-label="Facebook">
              <SocialIcon name="facebook" />
            </a>
          </div>
        </div>
      </footer>

      {isActivationOpen ? <ActivationModal onClose={() => setActivationOpen(false)} /> : null}
    </main>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
