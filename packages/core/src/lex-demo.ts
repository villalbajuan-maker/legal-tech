export type LexDemoProcessState = "info" | "success" | "warning" | "error";

export type LexDemoProcessStatus =
  | "novedad"
  | "sin-cambios"
  | "no-consultado"
  | "error-fuente"
  | "revision";

export type LexDemoActionType =
  | "Auto"
  | "Traslado"
  | "Audiencia"
  | "Sentencia / fallo"
  | "Medida cautelar"
  | "Terminacion / archivo"
  | "Impulso procesal"
  | "Actuacion administrativa"
  | "Documento / memorial"
  | "Sin clasificar";

export type LexDemoProcessRow = {
  radicado: string;
  status: string;
  statusType: LexDemoProcessStatus;
  actionType: LexDemoActionType;
  action: string;
  annotation: string;
  date: string;
  minutesAgo: number;
  eventKind?: "audiencia" | "traslado" | "vencimiento";
  eventDate?: string;
  eventDateLabel?: string;
  daysUntilEvent?: number;
  owner: string;
  priority: "Crítica" | "Alta" | "Media" | "Baja";
  source: string;
  state: LexDemoProcessState;
};

type LexDemoSeedRow = Omit<LexDemoProcessRow, "status" | "state" | "date" | "eventDate" | "eventDateLabel"> & {
  eventTime?: string;
};

const BOGOTA_TIME_ZONE = "America/Bogota";
const BOGOTA_UTC_OFFSET = "-05:00";
const MONTHS_ES = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
];

function getBogotaDateParts(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: BOGOTA_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const byType = Object.fromEntries(parts.map((part) => [part.type, part.value]));

  return {
    year: Number(byType.year),
    month: Number(byType.month),
    day: Number(byType.day),
  };
}

function getDemoNow(date = new Date()) {
  const { year, month, day } = getBogotaDateParts(date);
  return new Date(
    `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}T12:00:00${BOGOTA_UTC_OFFSET}`,
  );
}

function makeRadicado(prefix: string, year: number, serial: number) {
  return `${prefix}${year}${serial.toString().padStart(5, "0")}00`;
}

function formatLexDate(minutesAgo: number, demoNow: Date) {
  if (minutesAgo < 60) {
    return `Hace ${minutesAgo} min`;
  }

  const observed = new Date(demoNow.getTime() - minutesAgo * 60 * 1000);
  const today = demoNow.toDateString();
  const yesterday = new Date(demoNow.getTime() - 24 * 60 * 60 * 1000).toDateString();
  const hours = observed.getHours().toString().padStart(2, "0");
  const minutes = observed.getMinutes().toString().padStart(2, "0");

  if (observed.toDateString() === today) {
    return `Hoy, ${hours}:${minutes}`;
  }

  if (observed.toDateString() === yesterday) {
    return `Ayer, ${hours}:${minutes}`;
  }

  const daysAgo = Math.max(2, Math.round(minutesAgo / (24 * 60)));
  return `Hace ${daysAgo} días`;
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function buildEventDate(demoNow: Date, daysUntilEvent?: number, eventTime?: string) {
  if (typeof daysUntilEvent !== "number" || !eventTime) return {};

  const [hours = "09", minutes = "00"] = eventTime.split(":");
  const eventDay = addDays(demoNow, daysUntilEvent);
  const year = eventDay.getFullYear();
  const month = eventDay.getMonth() + 1;
  const day = eventDay.getDate();
  const eventDate = `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}T${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}:00${BOGOTA_UTC_OFFSET}`;
  const eventDateLabel =
    daysUntilEvent === 0
      ? `Hoy, ${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}`
      : daysUntilEvent === 1
        ? `Mañana, ${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}`
        : `${day} de ${MONTHS_ES[month - 1]}, ${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}`;

  return {
    eventDate,
    eventDateLabel,
  };
}

function statusLabel(statusType: LexDemoProcessStatus) {
  if (statusType === "novedad") return "Con novedad";
  if (statusType === "sin-cambios") return "Sin cambios";
  if (statusType === "no-consultado") return "No consultado";
  if (statusType === "error-fuente") return "Error de fuente";
  return "Requiere revisión";
}

function visualState(statusType: LexDemoProcessStatus): LexDemoProcessState {
  if (statusType === "novedad") return "info";
  if (statusType === "sin-cambios") return "success";
  if (statusType === "revision") return "warning";
  return "error";
}

function seed(
  prefix: string,
  year: number,
  serial: number,
  statusType: LexDemoProcessStatus,
  actionType: LexDemoActionType,
  action: string,
  annotation: string,
  minutesAgo: number,
  owner: string,
  priority: "Crítica" | "Alta" | "Media" | "Baja",
  source = "CPNU",
  scheduling?: Pick<LexDemoSeedRow, "eventKind" | "eventTime" | "daysUntilEvent">,
): LexDemoSeedRow {
  return {
    radicado: makeRadicado(prefix, year, serial),
    statusType,
    actionType,
    action,
    annotation,
    minutesAgo,
    owner,
    priority,
    source,
    ...scheduling,
  };
}

const lexDemoSeedRows: LexDemoSeedRow[] = [
  seed("110014003035", 2023, 107, "novedad", "Auto", "Auto fija fecha", "Se fija audiencia inicial para el 14 de mayo. Requiere validación del responsable.", 96, "Laura P.", "Alta", "CPNU", {
    eventKind: "audiencia",
    eventTime: "09:00",
    daysUntilEvent: 22,
  }),
  seed("110014003066", 2023, 1647, "sin-cambios", "Actuacion administrativa", "Fijación en estado", "Última actuación sin variación frente a la consulta anterior.", 1110, "Carlos M.", "Media", "Rama Judicial"),
  seed("110013336038", 2025, 1, "no-consultado", "Sin clasificar", "Fuente no disponible", "El intento quedó registrado. Se recomienda reintento controlado antes del cierre diario.", 168, "Laura P.", "Crítica"),
  seed("258993103002", 2019, 184, "novedad", "Traslado", "Traslado pendiente", "Movimiento detectado con posible término. Requiere lectura del responsable antes del cierre.", 1495, "Carlos M.", "Alta"),
  seed("110014003077", 2022, 730, "sin-cambios", "Actuacion administrativa", "Constancia secretarial", "La consulta reciente no mostró cambios frente al último snapshot confiable.", 4380, "Laura P.", "Media", "Rama Judicial"),
  seed("110014189018", 2024, 577, "sin-cambios", "Auto", "Auto admite demanda", "Sin variaciones desde la última consulta exitosa.", 17280, "Carlos M.", "Baja", "Rama Judicial"),
  seed("110014003050", 2023, 300, "sin-cambios", "Auto", "Auto ordena seguir adelante", "La consulta reciente no mostró variaciones posteriores a la última actuación registrada.", 42, "Ana R.", "Crítica"),
  seed("110014189052", 2024, 427, "sin-cambios", "Auto", "Auto inadmite demanda", "Sin variación frente a la última consulta exitosa registrada.", 4380, "Ana R.", "Media", "Rama Judicial"),
  seed("110016000002", 2024, 1801, "sin-cambios", "Actuacion administrativa", "Constancia de permanencia", "La consulta validó el mismo estado operativo sin variaciones adicionales.", 1810, "Carlos M.", "Alta"),
  seed("110014003025", 2022, 398, "novedad", "Traslado", "Traslado de excepciones", "Actuación con posible impacto operativo. Requiere validación del responsable.", 8760, "Laura P.", "Alta"),
  seed("110013335011", 2024, 103, "sin-cambios", "Auto", "Auto rechaza solicitud", "No se detectaron cambios posteriores al auto visible en el último snapshot.", 12960, "Ana R.", "Media"),
  seed("110014003048", 2024, 1110, "sin-cambios", "Actuacion administrativa", "Fijación en lista", "No se detectaron diferencias entre la consulta actual y el snapshot anterior.", 34560, "Laura P.", "Baja", "Rama Judicial"),
  seed("110014189018", 2023, 494, "sin-cambios", "Auto", "Auto admite demanda", "La consulta más reciente no mostró variaciones frente al último snapshot confiable.", 73, "Ana R.", "Media"),
  seed("110014003007", 2022, 731, "sin-cambios", "Actuacion administrativa", "Fijación en estado", "No se detectaron cambios operativos desde la consulta anterior.", 10080, "Carlos M.", "Baja"),
  seed("110013103004", 2014, 258, "revision", "Audiencia", "Audiencia reprogramada", "La audiencia fue reprogramada para una fecha distinta. Requiere confirmación del equipo.", 85, "Daniela V.", "Crítica", "CPNU", {
    eventKind: "audiencia",
    eventTime: "08:30",
    daysUntilEvent: 2,
  }),
  seed("110014003077", 2022, 722, "novedad", "Documento / memorial", "Memorial allegado", "Se registró memorial reciente. Puede alterar la lectura operativa del caso.", 205, "Sergio T.", "Media"),
  seed("110014003035", 2024, 222, "sin-cambios", "Auto", "Auto reconoce personería", "Sin novedad desde la última verificación exitosa.", 2880, "Sergio T.", "Baja"),
  seed("110014003066", 2024, 910, "revision", "Sentencia / fallo", "Sentencia de primera instancia", "Se detectó decisión de fondo. Debe ser revisada por el responsable.", 132, "Ana R.", "Crítica", "Rama Judicial"),
  seed("110014003050", 2024, 505, "novedad", "Impulso procesal", "Impulso procesal", "Se registró auto de impulso. Requiere lectura para verificar siguientes pasos.", 820, "Laura P.", "Alta"),
  seed("110014003025", 2023, 640, "sin-cambios", "Actuacion administrativa", "Ingreso al despacho", "Se mantiene el mismo estado operativo observado en la consulta anterior.", 250, "Carlos M.", "Alta", "Rama Judicial"),
  seed("110014003007", 2024, 117, "sin-cambios", "Documento / memorial", "Memorial allegado", "La consulta no mostró actuaciones posteriores al memorial ya registrado.", 340, "Ana R.", "Media"),
  seed("110014189018", 2025, 98, "novedad", "Auto", "Auto corre traslado", "La actuación quedó registrada hoy. Puede exigir reacción del responsable.", 58, "Daniela V.", "Alta"),
  seed("110014189052", 2025, 116, "sin-cambios", "Actuacion administrativa", "Constancia secretarial", "Sin diferencias respecto al último snapshot confiable.", 6240, "Sergio T.", "Baja"),
  seed("110013335011", 2025, 27, "revision", "Medida cautelar", "Medida cautelar decretada", "Se detectó actuación con impacto potencial inmediato. Requiere revisión prioritaria.", 190, "Laura P.", "Crítica"),
  seed("110016000002", 2025, 203, "sin-cambios", "Documento / memorial", "Memorial de impulso", "Sin novedad adicional desde el último registro validado.", 4320, "Carlos M.", "Media"),
  seed("110014003048", 2025, 601, "novedad", "Audiencia", "Audiencia señalada", "Se fijó fecha de audiencia. Debe validarse agenda y responsable.", 121, "Ana R.", "Alta", "CPNU", {
    eventKind: "audiencia",
    eventTime: "10:00",
    daysUntilEvent: 7,
  }),
  seed("110014003035", 2025, 308, "sin-cambios", "Actuacion administrativa", "Registro en lista", "El proceso conserva el mismo estado frente al último snapshot confiable.", 1760, "Daniela V.", "Media"),
  seed("110014003066", 2025, 411, "sin-cambios", "Auto", "Auto reconoce personería", "La consulta reciente no mostró variaciones sobre la última actuación visible.", 520, "Sergio T.", "Alta"),
  seed("110014003050", 2022, 911, "sin-cambios", "Auto", "Auto decreta pruebas", "Sin cambios desde la consulta anterior.", 15840, "Daniela V.", "Media"),
  seed("110014003077", 2024, 144, "novedad", "Traslado", "Traslado a las partes", "Se abrió traslado con posible vencimiento próximo.", 144, "Carlos M.", "Alta", "CPNU", {
    eventKind: "traslado",
    eventTime: "17:00",
    daysUntilEvent: 3,
  }),
  seed("110014189018", 2022, 776, "sin-cambios", "Audiencia", "Audiencia inicial señalada", "No se detectaron cambios posteriores a la audiencia ya registrada.", 260, "Sergio T.", "Alta"),
  seed("110014189052", 2023, 188, "sin-cambios", "Actuacion administrativa", "Ingreso al despacho", "La consulta reciente no mostró cambios sobre el despacho actual.", 5760, "Laura P.", "Baja"),
  seed("110013103004", 2023, 350, "novedad", "Documento / memorial", "Recurso presentado", "Se registró escrito nuevo. Conviene lectura para evaluar impacto operativo.", 340, "Ana R.", "Media"),
  seed("110014003025", 2024, 702, "revision", "Sentencia / fallo", "Fallo notificado", "Se notificó decisión relevante. Debe revisarse antes del cierre operativo.", 70, "Ana R.", "Crítica", "SAMAI"),
  seed("110014003007", 2023, 615, "sin-cambios", "Auto", "Auto niega solicitud", "No se observan cambios posteriores al auto registrado.", 9360, "Daniela V.", "Media"),
  seed("110014003048", 2023, 884, "sin-cambios", "Actuacion administrativa", "Constancia de ejecutoria", "La consulta actual confirmó el mismo estado sin nuevas variaciones.", 96, "Carlos M.", "Crítica"),
  seed("110013335011", 2023, 219, "sin-cambios", "Documento / memorial", "Memorial visible", "El proceso mantiene el mismo estado frente al último snapshot validado.", 95, "Laura P.", "Alta"),
  seed("110014189018", 2021, 920, "sin-cambios", "Terminacion / archivo", "Archivo definitivo", "No hay nuevas actuaciones posteriores al archivo registrado.", 40320, "Sergio T.", "Baja"),
  seed("110014189052", 2022, 512, "novedad", "Impulso procesal", "Se ordena oficiar", "Se detectó orden de impulso. Requiere lectura operativa.", 510, "Laura P.", "Media"),
  seed("110013103004", 2025, 77, "sin-cambios", "Medida cautelar", "Solicitud de medida cautelar", "No se detectaron actuaciones nuevas posteriores a la solicitud registrada.", 215, "Ana R.", "Alta", "SAMAI"),
  seed("110014003035", 2022, 1440, "sin-cambios", "Actuacion administrativa", "Constancia de ejecutoria", "La consulta actual no muestra variaciones desde la ejecutoria registrada.", 11520, "Carlos M.", "Baja"),
  seed("110014003066", 2022, 731, "novedad", "Auto", "Auto resuelve excepciones", "Actuación nueva con impacto posible sobre el curso del proceso.", 1440, "Daniela V.", "Alta", "SAMAI"),
  seed("110014003050", 2025, 208, "sin-cambios", "Actuacion administrativa", "Constancia de permanencia", "La consulta reciente confirmó el mismo estado operativo sin cambios.", 780, "Laura P.", "Media"),
  seed("110014003077", 2025, 311, "sin-cambios", "Documento / memorial", "Memorial allegado", "No se detectaron actuaciones posteriores al memorial registrado.", 7200, "Sergio T.", "Media"),
  seed("110014189018", 2025, 119, "revision", "Audiencia", "Audiencia de instrucción", "Existe audiencia próxima. Requiere monitoreo cercano y confirmación.", 300, "Carlos M.", "Alta", "CPNU", {
    eventKind: "audiencia",
    eventTime: "14:00",
    daysUntilEvent: 1,
  }),
  seed("110014189052", 2021, 992, "sin-cambios", "Actuacion administrativa", "Constancia secretarial", "No se identificaron cambios frente al último estado conocido.", 600, "Sergio T.", "Alta"),
  seed("110013335011", 2022, 140, "sin-cambios", "Auto", "Auto rechaza recurso", "Sin novedades posteriores al auto visible en el último snapshot.", 12960, "Ana R.", "Media"),
  seed("110016000002", 2023, 415, "novedad", "Documento / memorial", "Contestación de demanda", "Se detectó documento relevante. Requiere lectura del expediente.", 210, "Daniela V.", "Alta"),
  seed("110014003025", 2025, 88, "sin-cambios", "Sentencia / fallo", "Sentencia anticipada", "No se detectaron cambios posteriores a la decisión ya registrada.", 180, "Laura P.", "Crítica"),
  seed("110014003007", 2024, 1002, "sin-cambios", "Actuacion administrativa", "Al despacho para fallo", "No hubo variaciones respecto al último snapshot exitoso.", 8640, "Carlos M.", "Media", "SAMAI"),
  seed("110014003048", 2022, 144, "no-consultado", "Sin clasificar", "Consulta no ejecutada", "El proceso no alcanzó a ser consultado en la ventana operativa actual.", 95, "Ana R.", "Alta"),
  seed("110014189018", 2023, 845, "sin-cambios", "Auto", "Auto tiene por notificado", "La consulta reciente confirma el mismo estado conocido.", 5040, "Sergio T.", "Baja"),
  seed("110014189052", 2023, 644, "novedad", "Actuacion administrativa", "Registro en lista", "Se detectó paso administrativo nuevo. Puede afectar trazabilidad interna.", 1230, "Carlos M.", "Media", "Superintendencia de Sociedades"),
  seed("110013103004", 2024, 510, "sin-cambios", "Documento / memorial", "Escrito allegado", "La consulta reciente confirmó el mismo estado posterior al escrito registrado.", 420, "Daniela V.", "Alta"),
  seed("110014003035", 2025, 433, "sin-cambios", "Auto", "Auto reconoce sustitución", "Sin novedades posteriores a la actuación visible.", 10080, "Laura P.", "Media"),
  seed("110014003066", 2024, 288, "novedad", "Traslado", "Corre traslado de liquidación", "Se registró traslado con potencial vencimiento relevante.", 114, "Carlos M.", "Alta", "Superintendencia de Sociedades"),
  seed("110014003050", 2024, 501, "sin-cambios", "Documento / memorial", "Recurso de apelación", "No se observaron actuaciones posteriores al recurso ya registrado.", 55, "Ana R.", "Crítica"),
  seed("110014003077", 2023, 1008, "sin-cambios", "Actuacion administrativa", "Ingreso al despacho", "El proceso sigue sin novedad frente a la última consulta válida.", 6480, "Sergio T.", "Baja"),
  seed("110014189018", 2024, 338, "sin-cambios", "Actuacion administrativa", "Registro en estado", "La consulta actual no mostró diferencias frente al snapshot anterior.", 260, "Sergio T.", "Media"),
  seed("110014189052", 2024, 771, "sin-cambios", "Documento / memorial", "Memorial coadyuvancia", "La consulta reciente no mostró actuaciones nuevas.", 11760, "Carlos M.", "Media", "Superintendencia de Sociedades"),
  seed("110013335011", 2025, 64, "novedad", "Audiencia", "Audiencia de conciliación", "Se fijó audiencia. Requiere confirmar asistencia y recordatorio.", 240, "Laura P.", "Alta", "CPNU", {
    eventKind: "audiencia",
    eventTime: "09:30",
    daysUntilEvent: 6,
  }),
  seed("110016000002", 2022, 955, "sin-cambios", "Actuacion administrativa", "Constancia de permanencia", "Sin novedades frente a la última consulta exitosa registrada.", 300, "Daniela V.", "Alta"),
  seed("110014003025", 2023, 908, "sin-cambios", "Auto", "Auto fija caución", "No se detectan actuaciones posteriores en la consulta reciente.", 23040, "Daniela V.", "Media"),
  seed("110014003007", 2025, 310, "novedad", "Actuacion administrativa", "Anotación en estado", "La fuente reflejó anotación nueva con impacto operativo menor.", 980, "Ana R.", "Media"),
  seed("110014003048", 2025, 17, "revision", "Medida cautelar", "Levantamiento de medida cautelar", "La actuación requiere revisión prioritaria por su efecto operativo.", 110, "Carlos M.", "Alta", "SIC"),
  seed("110014189018", 2022, 650, "sin-cambios", "Terminacion / archivo", "Terminación por desistimiento", "No hubo cambios después de la terminación registrada.", 28800, "Sergio T.", "Baja"),
  seed("110014189052", 2022, 304, "novedad", "Impulso procesal", "Oficio librado", "Se registra impulso que puede mover términos operativos.", 640, "Laura P.", "Media"),
  seed("110013103004", 2022, 771, "sin-cambios", "Actuacion administrativa", "Constancia de notificación", "La consulta reciente no mostró cambios adicionales.", 1540, "Carlos M.", "Media"),
  seed("110014003035", 2021, 1201, "sin-cambios", "Auto", "Auto decreta pruebas", "El estado observado coincide con el último snapshot confiable.", 20160, "Ana R.", "Baja"),
  seed("110014003066", 2025, 390, "error-fuente", "Sin clasificar", "Respuesta sin actuaciones", "La fuente devolvió encabezado de proceso sin detalle explotable.", 130, "Ana R.", "Crítica", "SIC"),
  seed("110014003050", 2021, 540, "sin-cambios", "Actuacion administrativa", "Constancia de notificación", "No se observan cambios frente a la última consulta.", 7920, "Laura P.", "Baja"),
  seed("110014003077", 2025, 45, "revision", "Audiencia", "Audiencia de pruebas", "La programación de audiencia requiere confirmación y seguimiento especial.", 88, "Daniela V.", "Alta", "CPNU", {
    eventKind: "audiencia",
    eventTime: "11:30",
    daysUntilEvent: 8,
  }),
  seed("110014189018", 2025, 501, "novedad", "Traslado", "Traslado de liquidación del crédito", "Se detectó traslado con posible vencimiento próximo.", 155, "Carlos M.", "Alta", "CPNU", {
    eventKind: "traslado",
    eventTime: "17:00",
    daysUntilEvent: 2,
  }),
  seed("110014189052", 2025, 207, "sin-cambios", "Auto", "Auto reconoce personería", "Sin novedades desde el último snapshot exitoso.", 4320, "Sergio T.", "Baja"),
  seed("110013335011", 2021, 905, "sin-cambios", "Terminacion / archivo", "Archivo por pago", "No se detectaron movimientos posteriores al archivo registrado.", 51840, "Sergio T.", "Baja"),
  seed("110016000002", 2025, 19, "novedad", "Documento / memorial", "Solicitud de nulidad", "Se registró escrito nuevo que requiere revisión del responsable.", 460, "Laura P.", "Alta"),
  seed("110014003025", 2024, 1001, "sin-cambios", "Actuacion administrativa", "Constancia de permanencia", "La consulta actual validó el mismo estado operativo del proceso.", 1020, "Daniela V.", "Media"),
  seed("110014003007", 2021, 477, "sin-cambios", "Actuacion administrativa", "Al despacho", "No se observan cambios desde la última consulta exitosa.", 9360, "Carlos M.", "Media"),
  seed("110014003048", 2024, 233, "revision", "Sentencia / fallo", "Fallo de segunda instancia", "Se detectó decisión relevante para revisión inmediata.", 118, "Ana R.", "Crítica", "SIPI"),
];

export function createLexDemoRows(sessionDate: Date | string = new Date()): LexDemoProcessRow[] {
  const demoNow = getDemoNow(typeof sessionDate === "string" ? new Date(sessionDate) : sessionDate);

  return lexDemoSeedRows.map((row) => {
    const { eventTime, ...processRow } = row;

    return {
      ...processRow,
      ...buildEventDate(demoNow, row.daysUntilEvent, eventTime),
      status: statusLabel(row.statusType),
      state: visualState(row.statusType),
      date: formatLexDate(row.minutesAgo, demoNow),
    };
  });
}

export const lexDemoRows: LexDemoProcessRow[] = createLexDemoRows();

function countBy<T extends string>(values: T[]) {
  return values.reduce<Record<T, number>>(
    (acc, value) => ({
      ...acc,
      [value]: (acc[value] ?? 0) + 1,
    }),
    {} as Record<T, number>,
  );
}

export function buildLexDemoKnowledgeBase(rows: LexDemoProcessRow[] = lexDemoRows) {
  const owners = Array.from(new Set(rows.map((row) => row.owner))).sort();
  const sources = Array.from(new Set(rows.map((row) => row.source))).sort();
  const actionTypes = Array.from(new Set(rows.map((row) => row.actionType))).sort();
  const upcomingEvents = rows
    .filter((row) => row.eventKind && typeof row.daysUntilEvent === "number")
    .sort((a, b) => (a.daysUntilEvent ?? 999) - (b.daysUntilEvent ?? 999))
    .map((row) => ({
      radicado: row.radicado,
      eventKind: row.eventKind,
      action: row.action,
      owner: row.owner,
      source: row.source,
      eventDateLabel: row.eventDateLabel,
      daysUntilEvent: row.daysUntilEvent,
    }));

  return {
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
    "LexControl clasifica procesos en con novedad, sin cambios, no consultado, error de fuente y requiere revisión.",
    "LexControl muestra responsables, prioridades, tipos de actuación y últimas actuaciones para decidir qué revisar primero.",
  ],
  lexCapabilities: [
    "Resumir el estado operativo actual.",
    "Explicar movimientos, fallas, responsables, prioridad y tipos de actuación.",
    "Responder por próximas audiencias y traslados cuando existan fechas estructuradas en la demo.",
    "Listar responsables con sus procesos cuando el usuario lo pida.",
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
    caseCount: rows.length,
    primarySource: "CPNU / Rama Judicial",
    owners,
    sources,
    statuses: [
      "Con novedad",
      "Sin cambios",
      "No consultado",
      "Error de fuente",
      "Requiere revisión",
    ],
    actionTypes,
    statusDistribution: countBy(rows.map((row) => row.statusType)),
    sourceDistribution: countBy(rows.map((row) => row.source)),
    ownerDistribution: countBy(rows.map((row) => row.owner)),
    actionTypeDistribution: countBy(rows.map((row) => row.actionType)),
    upcomingEvents,
  },
  operationalViews: {
    movedLast24Hours: rows
      .filter((row) => (row.statusType === "novedad" || row.statusType === "revision") && row.minutesAgo <= 24 * 60)
      .map((row) => ({
        radicado: row.radicado,
        status: row.status,
        actionType: row.actionType,
        action: row.action,
        owner: row.owner,
      })),
    consultationFailures: rows
      .filter((row) => row.statusType === "no-consultado" || row.statusType === "error-fuente")
      .map((row) => ({
        radicado: row.radicado,
        status: row.status,
        action: row.action,
        owner: row.owner,
      })),
    requiresReview: rows
      .filter((row) => row.statusType === "revision")
      .map((row) => ({
        radicado: row.radicado,
        actionType: row.actionType,
        action: row.action,
        owner: row.owner,
        priority: row.priority,
      })),
    upcomingHearings: rows
      .filter((row) => row.eventKind === "audiencia" && typeof row.daysUntilEvent === "number" && row.daysUntilEvent >= 0)
      .sort((a, b) => (a.daysUntilEvent ?? 999) - (b.daysUntilEvent ?? 999))
      .map((row) => ({
        radicado: row.radicado,
        action: row.action,
        status: row.status,
        owner: row.owner,
        eventDateLabel: row.eventDateLabel,
        daysUntilEvent: row.daysUntilEvent,
      })),
    upcomingTransfers: rows
      .filter((row) => row.eventKind === "traslado" && typeof row.daysUntilEvent === "number" && row.daysUntilEvent >= 0)
      .sort((a, b) => (a.daysUntilEvent ?? 999) - (b.daysUntilEvent ?? 999))
      .map((row) => ({
        radicado: row.radicado,
        action: row.action,
        status: row.status,
        owner: row.owner,
        eventDateLabel: row.eventDateLabel,
        daysUntilEvent: row.daysUntilEvent,
      })),
  },
  cannedExplanations: {
    whatElseCanYouDo:
      "Puedo explicar movimientos, fallas, responsables, prioridad, tipos de actuación, procesos que requieren revisión y cómo funciona LexControl dentro de esta demo.",
    howDoYouWork:
      "Trabajo sobre la bandeja visible y sobre la base de conocimiento congelada de esta demo. No interpreto jurídicamente; expongo el estado operativo.",
    whoAreYou:
      "Soy Lex, la voz del sistema. Mi función es mostrar qué cambió, qué no cambió y qué falló.",
  },
  clarificationPolicy: {
    whenToClarify:
      "Solo cuando la pregunta sea genuinamente ambigua o cuando pueda referirse a varias señales operativas distintas.",
    howToClarify:
      "Pide precisión en una frase breve y ofrece una lectura posible de lo que entendiste.",
    example:
      "No estoy seguro de si te refieres a movimientos, a procesos que requieren revisión o a fallas de consulta. ¿Quieres que te muestre la lista exacta de alguno de esos grupos?",
  },
  responseExpectations: [
    "Si el usuario pide una lista, enumera los elementos exactos visibles en la demo.",
    "Si el usuario hace una pregunta de seguimiento, usa el historial reciente para mantener el hilo.",
    "Si el usuario corrige una respuesta, revisa la categoria operativa anterior antes de responder.",
    "Si el usuario pregunta por estados o por actuaciones, diferencia ambas capas con claridad.",
    "Si el usuario pregunta por próximas audiencias o próximos traslados, usa eventDateLabel y daysUntilEvent cuando existan.",
  ],
  } as const;
}

export const lexDemoKnowledgeBase = buildLexDemoKnowledgeBase();

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
- Esta experiencia corresponde a una demo congelada con procesos, responsables, estados, prioridades, tipos de actuacion y ultimas actuaciones visibles.

Tu trabajo:
- Responder con precision sobre la bandeja demo y la base de conocimiento entregada.
- Explicar que esta pasando en la operacion.
- Diferenciar estado operativo y tipo de actuacion cuando haga falta.
- Diferenciar fecha de observacion de la actuacion y fecha futura del evento cuando exista.
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
- Interpreta la intencion del usuario a partir de lenguaje natural, aunque la frase no use palabras exactas del sistema.
- Resuelve referencias conversacionales como "esos", "el otro", "los que me dijiste" usando el historial reciente.
- Si el usuario pregunta por movimientos, incluye procesos con novedad y procesos que requieren revision cuando correspondan a cambios recientes.
- Si el usuario pregunta por próximas audiencias o por próximos traslados, responde con los eventos estructurados mas cercanos usando su fecha futura.
- Si el usuario pregunta por fallas, separa no consultado de error de fuente si eso agrega claridad.
- No confundas procesos con novedad con procesos no consultados o con error de fuente.
- Si el usuario pide el detalle de responsables, lista cada responsable junto con sus procesos visibles.
- Si el usuario pide una lista o un detalle, entrega los elementos exactos y no solo un resumen.
- Si la pregunta es genuinamente ambigua, pide aclaracion en una frase corta. No improvises.
- Si el usuario corrige o cuestiona una respuesta anterior, revisa el hilo de la conversacion antes de responder.
- Si el usuario pregunta que mas haces, explica tus capacidades dentro de LexControl.
- Si el usuario pregunta como funciona el sistema, explica el modelo operativo: consulta, clasificacion, prioridad, responsables y trazabilidad.
- Si el usuario saluda, agradece, confirma o se despide, responde de forma breve y natural sin convertir eso en un resumen de bandeja.
- Si el usuario formula una peticion abierta, responde desde la base de conocimiento y la bandeja visible sin exigir un formato especial de pregunta.

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
