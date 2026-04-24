import {
  buildLexDemoKnowledgeBase,
  buildLexSystemPrompt,
  createLexDemoRows,
} from "../packages/core/src/index.js";
import type { LexDemoProcessRow } from "../packages/core/src/index.js";

type LexChatBody = {
  question?: string;
  intent?: string | null;
  userName?: string | null;
  history?: Array<{ role: string; content: string }>;
  rows?: unknown;
  currentState?: unknown;
  demoSessionDate?: string;
};

type LexRowLike = {
  radicado?: string;
  status?: string;
  statusType?: string;
  action?: string;
  actionType?: string;
  owner?: string;
  priority?: string;
  eventKind?: string;
  eventDateLabel?: string;
  daysUntilEvent?: number;
  attentionLevel?: string;
  priorityReason?: string;
  attentionReason?: string;
  assignmentOrigin?: string;
  operationalStatus?: string;
  latestActionTitle?: string | null;
  latestActionDescription?: string | null;
  latestEventTitle?: string | null;
  latestEventDate?: string | null;
};

function isOperationalRow(row: LexRowLike) {
  return Boolean(
    row.attentionLevel ||
      row.priorityReason ||
      row.attentionReason ||
      row.assignmentOrigin ||
      row.operationalStatus,
  );
}

function buildOperationalKnowledgeBase(rows: LexRowLike[]) {
  const totals = rows.reduce(
    (acc, row) => {
      const priority = row.priority?.toLowerCase() || "normal";
      const attention = row.attentionLevel || "silencio_operativo";
      const operationalStatus = row.operationalStatus || "sin_dato";

      acc.byPriority[priority] = (acc.byPriority[priority] ?? 0) + 1;
      acc.byAttention[attention] = (acc.byAttention[attention] ?? 0) + 1;
      acc.byOperationalStatus[operationalStatus] = (acc.byOperationalStatus[operationalStatus] ?? 0) + 1;
      return acc;
    },
    {
      byPriority: {} as Record<string, number>,
      byAttention: {} as Record<string, number>,
      byOperationalStatus: {} as Record<string, number>,
    },
  );

  const highlighted = rows
    .filter((row) =>
      (row.attentionLevel && row.attentionLevel !== "silencio_operativo") ||
      (row.priority && ["Alta", "Crítica", "high", "critical"].includes(row.priority)),
    )
    .slice(0, 12)
    .map((row) => ({
      radicado: row.radicado,
      owner: row.owner,
      priority: row.priority,
      priorityReason: row.priorityReason,
      attentionLevel: row.attentionLevel,
      attentionReason: row.attentionReason,
      operationalStatus: row.operationalStatus,
      latestActionTitle: row.latestActionTitle || row.action,
      latestEventTitle: row.latestEventTitle || null,
      latestEventDate: row.latestEventDate || row.eventDateLabel || null,
      assignmentOrigin: row.assignmentOrigin,
    }));

  return {
    productName: "LexControl",
    entityName: "Lex",
    identity: "Lex es la voz del sistema.",
    productDefinition:
      "LexControl es un sistema operativo de vigilancia judicial orientado a administrar atención sobre una cartera de procesos.",
    lexPurpose:
      "Lex resume qué requiere atención, qué permanece estable y por qué un proceso subió de prioridad o de nivel de atención.",
    visiblePortfolioSummary: totals,
    highlightedProcesses: highlighted,
  };
}

function buildOperationalFallback(question: string, rows: unknown) {
  const value = question
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .trim();

  const typedRows = Array.isArray(rows) ? (rows as LexRowLike[]) : [];
  const operationalRows = typedRows.filter(isOperationalRow);
  const upcomingHearings = typedRows
    .filter((row) => row.eventKind === "audiencia" && typeof row.daysUntilEvent === "number")
    .sort((a, b) => (a.daysUntilEvent ?? 999) - (b.daysUntilEvent ?? 999));
  const upcomingTransfers = typedRows
    .filter((row) => row.eventKind === "traslado" && typeof row.daysUntilEvent === "number")
    .sort((a, b) => (a.daysUntilEvent ?? 999) - (b.daysUntilEvent ?? 999));

  if (value.includes("audiencia")) {
    if (!upcomingHearings.length) {
      return "No veo audiencias próximas estructuradas en esta demo. Sí puedo decirte qué actuaciones de audiencia existen en la muestra actual.";
    }

    return upcomingHearings
      .slice(0, 6)
      .map((row) => `${row.radicado}: ${row.action} · ${row.eventDateLabel} · ${row.owner}`)
      .join(". ");
  }

  if (value.includes("traslado")) {
    if (!upcomingTransfers.length) {
      return "No veo traslados próximos estructurados en esta demo. Sí puedo listar actuaciones de traslado visibles en la muestra actual.";
    }

    return upcomingTransfers
      .slice(0, 6)
      .map((row) => `${row.radicado}: ${row.action} · ${row.eventDateLabel} · ${row.owner}`)
      .join(". ");
  }

  if (value.includes("estabilidad") || value.includes("salud operativa") || value.includes("estado operativo")) {
    const counts = (operationalRows.length ? operationalRows : typedRows).reduce<Record<string, number>>((acc, row) => {
      const key = row.operationalStatus || row.statusType || "desconocido";
      acc[key] = (acc[key] ?? 0) + 1;
      return acc;
    }, {});

    return `La muestra se ve estable. ${counts["sin-cambios"] ?? 0} procesos están sin cambios, ${counts["novedad"] ?? 0} tienen novedad, ${counts["revision"] ?? 0} requieren revisión, ${counts["no-consultado"] ?? 0} no fueron consultados y ${counts["error-fuente"] ?? 0} tienen error de fuente.`;
  }

  if (
    operationalRows.length &&
    (value.includes("por que") ||
      value.includes("por qué") ||
      value.includes("prioridad") ||
      value.includes("atencion") ||
      value.includes("atención"))
  ) {
    const explained = operationalRows
      .filter((row) => row.priorityReason || row.attentionReason)
      .slice(0, 6)
      .map(
        (row) =>
          `${row.radicado}: prioridad ${row.priority || "sin dato"} por ${row.priorityReason || "sin razón visible"}; atención ${row.attentionLevel || "sin dato"} por ${row.attentionReason || "sin razón visible"}`,
      );

    if (explained.length) {
      return explained.join(". ");
    }
  }

  return "";
}

function extractOpenAIText(data: unknown) {
  if (!data || typeof data !== "object") return "";

  const candidate = data as {
    output_text?: string;
    output?: Array<{
      content?: Array<{
        type?: string;
        text?: string;
      }>;
    }>;
  };

  if (typeof candidate.output_text === "string" && candidate.output_text.trim()) {
    return candidate.output_text.trim();
  }

  const fragments =
    candidate.output
      ?.flatMap((item) => item.content ?? [])
      .filter((item) => item.type === "output_text" || item.type === "text")
      .map((item) => item.text?.trim() ?? "")
      .filter(Boolean) ?? [];

  return fragments.join("\n").trim();
}

function buildLexUserContext(body: LexChatBody, rows: LexDemoProcessRow[], retryMode = false) {
  const typedRows = rows as unknown as LexRowLike[];
  const knowledgeBase = typedRows.some(isOperationalRow)
    ? buildOperationalKnowledgeBase(typedRows)
    : buildLexDemoKnowledgeBase(rows);

  return `
Nombre del usuario: ${body.userName || "No informado"}
Intencion detectada: ${body.intent || "sin intencion exacta"}
Fecha ancla de la demo: ${body.demoSessionDate || "Generada en servidor"}

Historial reciente:
${Array.isArray(body.history) && body.history.length
  ? body.history
      .map((item) => `${item.role === "lex" ? "Lex" : body.userName || "Usuario"}: ${item.content}`)
      .join("\n")
  : "Sin historial previo"}

Estado actual de la demo:
${JSON.stringify(body.currentState, null, 2)}

Base de conocimiento de LexControl:
${JSON.stringify(knowledgeBase, null, 2)}

Procesos visibles entregados por la UI:
${JSON.stringify(rows, null, 2)}

Pregunta actual:
${body.question || ""}

${retryMode
    ? `Instruccion adicional:
- Debes devolver obligatoriamente una respuesta no vacia.
- Si la pregunta tiene suficiente contexto en la demo o en el historial, respondela directamente.
- Si la pregunta es genuinamente ambigua, haz una sola pregunta breve de aclaracion.
- No repitas que no puedes responder ni devuelvas texto vacio.`
    : ""}
`.trim();
}

async function requestLexAnswer(apiKey: string, model: string, body: LexChatBody, rows: LexDemoProcessRow[], retryMode = false) {
  const payload = {
    model,
    input: [
      {
        role: "developer",
        content: [{ type: "input_text", text: buildLexSystemPrompt() }],
      },
      {
        role: "user",
        content: [
          {
            type: "input_text",
            text: buildLexUserContext(body, rows, retryMode),
          },
        ],
      },
    ],
    max_output_tokens: retryMode ? 220 : 320,
    text: {
      format: {
        type: "text",
      },
    },
  };

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "OpenAI request failed");
  }

  const data = (await response.json()) as unknown;
  return extractOpenAIText(data);
}

export default {
  async fetch(request: Request) {
    if (request.method !== "POST") {
      return Response.json({ error: "Method not allowed" }, { status: 405 });
    }

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return Response.json({ error: "Missing OPENAI_API_KEY" }, { status: 500 });
    }

    const body = (await request.json()) as LexChatBody;
    const model = process.env.OPENAI_MODEL || "gpt-5";
    const rows =
      Array.isArray(body.rows) && body.rows.length
        ? (body.rows as LexDemoProcessRow[])
        : createLexDemoRows(body.demoSessionDate || new Date());
    try {
      let answer = await requestLexAnswer(apiKey, model, body, rows);

      if (!answer) {
        answer = await requestLexAnswer(apiKey, model, body, rows, true);
      }

      return Response.json({
        answer:
          answer ||
          buildOperationalFallback(body.question || "", rows) ||
          "No estoy seguro de haber entendido esa pregunta. ¿Podrías decirme si te refieres a movimientos, fallas, responsables o prioridad?",
      });
    } catch (error) {
      const fallback = buildOperationalFallback(body.question || "", rows);
      if (fallback) {
        return Response.json({ answer: fallback });
      }

      const message = error instanceof Error ? error.message : "Lex request failed";
      return Response.json({ error: message }, { status: 500 });
    }
  },
};
