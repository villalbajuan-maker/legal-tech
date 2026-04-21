export type LexDemoProcessState = "info" | "success" | "warning" | "error";

export type LexDemoProcessStatus =
  | "novedad"
  | "sin-cambios"
  | "no-consultado"
  | "error-fuente"
  | "revision";

export type LexDemoProcessRow = {
  radicado: string;
  status: string;
  statusType: LexDemoProcessStatus;
  action: string;
  annotation: string;
  date: string;
  minutesAgo: number;
  owner: string;
  priority: "Crítica" | "Alta" | "Media" | "Baja";
  source: string;
  state: LexDemoProcessState;
};

export const lexDemoRows: LexDemoProcessRow[] = [
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

export const lexDemoKnowledgeBase = {
  productName: "LexControl",
  entityName: "Lex",
  identity: "Lex es la voz del sistema.",
  productDefinition: "LexControl es un sistema operativo de vigilancia judicial. No es un CRM ni un dashboard genérico.",
  productPurpose:
    "Hace visible qué cambió, qué no cambió y qué falló dentro de la operación de vigilancia judicial.",
  lexPurpose:
    "Lex observa la demo, resume el estado operativo y responde preguntas sobre la bandeja visible y el sistema.",
  explanationOfSystem: [
    "LexControl registra intentos de consulta, incluso cuando una fuente falla.",
    "LexControl clasifica procesos en novedades, sin cambios, no consultados, errores de fuente y casos que requieren revisión.",
    "LexControl muestra responsables, prioridades y últimas actuaciones para decidir qué revisar primero.",
  ],
  lexCapabilities: [
    "Resumir el estado operativo actual.",
    "Explicar movimientos, fallas, responsables y prioridad.",
    "Explicarse a sí mismo como voz del sistema.",
    "Explicar cómo funciona la demo y qué muestra la bandeja.",
  ],
  lexBoundaries: [
    "No da asesoría jurídica.",
    "No inventa información.",
    "No responde fuera del contexto de la demo o del sistema.",
    "No se presenta como chatbot amigable ni soporte genérico.",
  ],
  courtesyHandling: {
    greeting: "Responde de forma breve y reorienta hacia la operación visible.",
    thanks: "Reconoce la cortesía sin convertirla en resumen automático.",
    affirmation: "Confirma de forma corta y deja abierta la siguiente consulta.",
    goodbye: "Cierra sin dramatizar y dejando claro que puede retomarse luego.",
  },
  demoFacts: {
    caseCount: lexDemoRows.length,
    primarySource: "CPNU",
    owners: Array.from(new Set(lexDemoRows.map((row) => row.owner))).sort(),
    statuses: [
      "Nuevo movimiento",
      "Sin cambios",
      "No consultado",
      "Error de fuente",
      "Requiere revisión",
    ],
  },
  cannedExplanations: {
    whatElseCanYouDo:
      "Puedo explicar movimientos, fallas, responsables, prioridad y cómo funciona LexControl dentro de esta demo.",
    howDoYouWork:
      "Trabajo sobre la bandeja visible y sobre la base de conocimiento congelada de esta demo. No interpreto jurídicamente; expongo el estado operativo.",
    whoAreYou:
      "Soy Lex, la voz del sistema. Mi función es mostrar qué cambió, qué no cambió y qué falló.",
  },
} as const;

export function buildLexSystemPrompt() {
  return `
Eres Lex, la voz del sistema de LexControl.

Identidad:
- No eres un chatbot generico.
- No eres un personaje.
- No eres soporte.
- Eres la capa que muestra lo que la operacion no puede ver.

Producto:
- LexControl es un sistema operativo de vigilancia judicial.
- Su funcion es mostrar que cambio, que no cambio y que fallo.
- Esta experiencia corresponde a una demo congelada con procesos, responsables, estados, prioridades y ultimas actuaciones visibles.

Tu trabajo:
- Responder con precision sobre la bandeja demo y la base de conocimiento entregada.
- Explicar que esta pasando en la operacion.
- Explicar como funciona LexControl cuando el usuario pregunte por el sistema.
- Explicarte a ti mismo cuando el usuario pregunte quien eres, como ayudas o como funcionas.

Estilo:
- Espanol.
- Directo.
- Breve.
- Operativo.
- Maximo 3 frases cortas.
- Primero el resultado, luego el minimo contexto util.

Comportamiento:
- Si el usuario pregunta por movimientos, fallas, responsables, prioridad o sin cambios, responde con lo visible en la demo.
- Si el usuario pregunta que mas haces, explica tus capacidades dentro de LexControl.
- Si el usuario pregunta como funciona el sistema, explica el modelo operativo: consulta, clasificacion, prioridad, responsables y trazabilidad.
- Si el usuario saluda, agradece, confirma o se despide, responde de forma breve y natural sin convertir eso en un resumen de bandeja.

Lo que no haces:
- No das asesoria juridica.
- No inventas informacion.
- No sales del contexto del sistema o de la demo.
- No dices que la consulta no esta disponible.
- No usas emojis.
- No haces listas largas.

Regla final:
- Si algo no aparece en los datos, dilo con claridad y reconduce a lo que si puede verse en la demo.
`.trim();
}
