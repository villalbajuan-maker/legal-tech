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
  {
    radicado: "11001400305020230030000",
    status: "Nuevo movimiento",
    statusType: "novedad",
    action: "Auto ordena seguir adelante",
    annotation: "Se registra impulso procesal. Requiere confirmar si modifica término interno.",
    date: "Hoy, 10:18",
    minutesAgo: 42,
    owner: "Ana R.",
    priority: "Crítica",
    source: "CPNU",
    state: "info",
  },
  {
    radicado: "11001418905220240042700",
    status: "Sin cambios",
    statusType: "sin-cambios",
    action: "Auto inadmite demanda",
    annotation: "Sin variación frente a la última consulta exitosa registrada.",
    date: "Hace 3 días",
    minutesAgo: 4380,
    owner: "Mónica S.",
    priority: "Media",
    source: "CPNU",
    state: "success",
  },
  {
    radicado: "11001600000220240180100",
    status: "No consultado",
    statusType: "no-consultado",
    action: "Consulta diferida",
    annotation: "Proceso priorizado para reintento por acumulación de consultas en la fuente.",
    date: "Hoy, 06:12",
    minutesAgo: 246,
    owner: "Diego L.",
    priority: "Alta",
    source: "CPNU",
    state: "error",
  },
  {
    radicado: "11001400302520220039800",
    status: "Requiere revisión",
    statusType: "revision",
    action: "Traslado de excepciones",
    annotation: "Actuación con posible impacto operativo. Requiere lectura por responsable.",
    date: "Hace 6 días",
    minutesAgo: 8760,
    owner: "Mónica S.",
    priority: "Alta",
    source: "CPNU",
    state: "warning",
  },
  {
    radicado: "11001333501120240010300",
    status: "Error de fuente",
    statusType: "error-fuente",
    action: "Respuesta incompleta",
    annotation: "La fuente no devolvió detalle de actuaciones. Se conserva el último snapshot confiable.",
    date: "Hace 9 días",
    minutesAgo: 12960,
    owner: "Laura P.",
    priority: "Media",
    source: "CPNU",
    state: "error",
  },
  {
    radicado: "11001400304820240111000",
    status: "Sin cambios",
    statusType: "sin-cambios",
    action: "Fijación en lista",
    annotation: "No se detectaron diferencias entre la consulta actual y el snapshot anterior.",
    date: "Hace 24 días",
    minutesAgo: 34560,
    owner: "Diego L.",
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

function ActivationModal({
  onClose,
}: {
  onClose: () => void;
}) {
  const [step, setStep] = useState(0);
  const [isSubmitted, setSubmitted] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="modalLayer" role="dialog" aria-modal="true" aria-labelledby="activation-title">
      <div className="activationModal">
        <button className="modalClose" type="button" onClick={onClose} aria-label="Cerrar activación">
          Cerrar
        </button>

        {!isSubmitted ? (
          <>
            <p className="eyebrow">Demo gratuita controlada</p>
            <div className="progress">
              <span>{step + 1} de 3</span>
              <div>
                <i style={{ width: `${((step + 1) / 3) * 100}%` }} />
              </div>
            </div>

            {step === 0 ? (
              <section className="activationStep">
                <h2 id="activation-title">Activa una demo gratuita con procesos reales.</h2>
                <p>
                  Estamos activando un grupo reducido de abogados y firmas que operan
                  volumen real de procesos.
                </p>
                <p>
                  La demo permite ver cómo LexControl convierte una lista de radicados
                  en una bandeja operativa: novedades, sin cambios, errores de fuente,
                  responsables y prioridad.
                </p>
                <div className="demoTerms">
                  <div>
                    <h3>La demo incluye</h3>
                    {demoFeatures.map((item) => (
                      <span key={item}>{item}</span>
                    ))}
                  </div>
                  <div>
                    <h3>Condiciones</h3>
                    {demoLimits.map((item) => (
                      <span key={item}>{item}</span>
                    ))}
                  </div>
                </div>
                <button className="button primary" type="button" onClick={() => setStep(1)}>
                  Continuar
                </button>
              </section>
            ) : null}

            {step === 1 ? (
              <section className="activationStep">
                <h2>Cuéntanos cómo opera hoy tu vigilancia.</h2>
                <div className="activationQuestions">
                  <label>
                    ¿Cuántos procesos vigilas actualmente?
                    <select defaultValue="">
                      <option value="" disabled>Selecciona una opción</option>
                      <option>Menos de 50</option>
                      <option>50 a 100</option>
                      <option>101 a 300</option>
                      <option>Más de 300</option>
                    </select>
                  </label>
                  <label>
                    ¿Cómo los revisan hoy?
                    <select defaultValue="">
                      <option value="" disabled>Selecciona una opción</option>
                      <option>Manual en Rama Judicial</option>
                      <option>Excel + revisión manual</option>
                      <option>Dependiente / asistente</option>
                      <option>Herramienta externa</option>
                      <option>No hay proceso claro</option>
                    </select>
                  </label>
                  <label>
                    ¿Cuál es el principal riesgo hoy?
                    <select defaultValue="">
                      <option value="" disabled>Selecciona una opción</option>
                      <option>No detectar actuaciones</option>
                      <option>No saber qué no se consultó</option>
                      <option>Errores de fuente</option>
                      <option>Falta de trazabilidad</option>
                      <option>Demasiado tiempo operativo</option>
                    </select>
                  </label>
                  <label>
                    ¿Tienen responsables asignados por proceso?
                    <select defaultValue="">
                      <option value="" disabled>Selecciona una opción</option>
                      <option>Sí</option>
                      <option>Parcialmente</option>
                      <option>No</option>
                    </select>
                  </label>
                </div>
                <div className="modalActions">
                  <button className="button secondary" type="button" onClick={() => setStep(0)}>
                    Volver
                  </button>
                  <button className="button primary" type="button" onClick={() => setStep(2)}>
                    Continuar
                  </button>
                </div>
              </section>
            ) : null}

            {step === 2 ? (
              <form className="activationStep" onSubmit={submit}>
                <h2>Solicita la activación.</h2>
                <p>No necesitas enviar radicados ni datos sensibles en este formulario.</p>
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
                <div className="modalActions">
                  <button className="button secondary" type="button" onClick={() => setStep(1)}>
                    Volver
                  </button>
                  <button className="button primary" type="submit">
                    Solicitar activación
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
            <button className="button primary" type="button" onClick={onClose}>
              Cerrar
            </button>
          </section>
        )}
      </div>
    </div>
  );
}

function App() {
  const [isDiagnosticOpen, setDiagnosticOpen] = useState(false);
  const [isActivationOpen, setActivationOpen] = useState(false);
  const [operationalFilter, setOperationalFilter] = useState<OperationalFilter>("todos");
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("todos");
  const [ownerFilter, setOwnerFilter] = useState("todos");
  const [isLexOpen, setLexOpen] = useState(false);
  const [isLexTyping, setLexTyping] = useState(false);
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
  const lexTypingTimeoutRef = useRef<number | null>(null);
  const rowsByTime = getRowsByTime(processRows, timeFilter);
  const rowsByOperationalState = getRowsByOperationalState(rowsByTime, operationalFilter);
  const visibleRows = rowsByOperationalState.filter((row) => ownerFilter === "todos" || row.owner === ownerFilter);
  const ownerOptions = Array.from(new Set(processRows.map((row) => row.owner))).sort();
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
  }, [lexMessages, isLexOpen, isLexTyping]);

  useEffect(() => {
    return () => {
      if (lexTypingTimeoutRef.current) {
        window.clearTimeout(lexTypingTimeoutRef.current);
      }
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

    if (intent === "prioridad" || intent === "responsables" || intent === "resumen") {
      setOperationalFilter("todos");
      setTimeFilter("todos");
      setOwnerFilter("todos");
    }
  }

  function getRowsForLexIntent(intent: LexIntent) {
    if (intent === "movimientos") return getRowsByTime(processRows, "24h");
    return processRows;
  }

  function askLex(intent: LexIntent, question: string) {
    if (isLexTyping) return;
    setLexOpen(true);
    applyLexIntent(intent);
    const answer = getLexAnswer(intent, getRowsForLexIntent(intent));
    setLexMessages((current) => [...current, { id: current.length + 1, role: "user", content: question }]);
    setLexTyping(true);

    if (lexTypingTimeoutRef.current) {
      window.clearTimeout(lexTypingTimeoutRef.current);
    }

    lexTypingTimeoutRef.current = window.setTimeout(() => {
      setLexMessages((current) => [...current, { id: current.length + 1, role: "lex", content: answer }]);
      setLexTyping(false);
      lexTypingTimeoutRef.current = null;
    }, 720);
  }

  function submitLexQuestion(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isLexTyping) return;
    const question = lexInput.trim();
    if (!question) return;

    const intent = inferLexIntent(question);
    if (!intent) {
      setLexMessages((current) => [
        ...current,
        { id: current.length + 1, role: "user", content: question },
      ]);
      setLexTyping(true);
      lexTypingTimeoutRef.current = window.setTimeout(() => {
        setLexMessages((current) => [
          ...current,
          {
            id: current.length + 1,
            role: "lex",
            content:
              "Consulta no disponible en la demo. Consultas activas: movimientos, fallas, responsables, prioridad, procesos sin cambios y resumen operativo.",
          },
        ]);
        setLexTyping(false);
        lexTypingTimeoutRef.current = null;
      }, 720);
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
          <a href="#problema">Problema</a>
          <a href="#control">Cómo funciona</a>
          <a href="#preguntas">Preguntas</a>
          <a href="#precios">Precios</a>
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
            <button className="button secondary" type="button" onClick={() => setDiagnosticOpen(true)}>
              Hacer diagnóstico
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
          <p>Mide qué tan expuesta está tu operación a errores que no puedes detectar.</p>
        </div>
        <button className="button primary" type="button" onClick={() => setDiagnosticOpen(true)}>
          Iniciar diagnóstico
        </button>
      </section>

      <section className="solutionSection" data-reveal>
        <div>
          <p className="eyebrow">Solución</p>
          <h2>De revisión manual a control operativo.</h2>
        </div>
        <div className="solutionGrid">
          {solutionBlocks.map((item) => (
            <article className="solutionCard" key={item.title} data-reveal>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="modelShift" data-reveal>
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

      <section className="controlSurface" id="control" aria-label="Panel de control LexControl" data-reveal>
        <div className="controlHeader">
          <div>
            <p className="eyebrow">Panel</p>
            <h2>Una bandeja para decidir. No otra tabla para revisar.</h2>
            <p>Todo en un solo lugar. Con trazabilidad.</p>
          </div>
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

        <div className="workbench">
          <section className="tablePanel" aria-label="Procesos monitoreados">
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
            </div>
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
                    {message.role === "lex" ? (
                      <span className="lexSpeaker">
                        <img src={lexSymbolUrl} alt="" aria-hidden="true" />
                        Lex
                      </span>
                    ) : (
                      <span>Usuario</span>
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

              <div className="lexPromptRail" aria-label="Consultas sugeridas">
                {lexPrompts.map((prompt) => (
                  <button
                    type="button"
                    key={prompt.value}
                    onClick={() => askLex(prompt.value, prompt.label)}
                    disabled={isLexTyping}
                  >
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
                  disabled={isLexTyping}
                />
                <button type="submit" disabled={isLexTyping}>Enviar</button>
              </form>
            </section>
          ) : null}
        </div>
      </section>

      <section className="beta" id="demo" data-reveal>
        <div>
          <p className="eyebrow">Demo gratuita controlada</p>
          <h2>Activa LexControl con una muestra real de tu operación.</h2>
          <p>Estamos activando un grupo reducido de abogados y firmas que operan volumen real de procesos.</p>
          <p>Ideal para equipos que manejan 50 a 500 procesos activos.</p>
          <div className="demoList">
            <span>Hasta 100 procesos</span>
            <span>Hasta 4 responsables</span>
            <span>Bandeja operativa</span>
            <span>Lex sobre la demo</span>
          </div>
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

      {isDiagnosticOpen ? <DiagnosticModal onClose={() => setDiagnosticOpen(false)} /> : null}
      {isActivationOpen ? <ActivationModal onClose={() => setActivationOpen(false)} /> : null}
    </main>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
