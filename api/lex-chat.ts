import { buildLexSystemPrompt, lexDemoKnowledgeBase, lexDemoRows } from "../packages/core/src";

type LexChatBody = {
  question?: string;
  intent?: string | null;
  userName?: string | null;
  history?: Array<{ role: string; content: string }>;
  rows?: unknown;
  currentState?: unknown;
};

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

function buildLexUserContext(body: LexChatBody, rows: unknown, retryMode = false) {
  return `
Nombre del usuario: ${body.userName || "No informado"}
Intencion detectada: ${body.intent || "sin intencion exacta"}

Historial reciente:
${Array.isArray(body.history) && body.history.length
  ? body.history
      .map((item) => `${item.role === "lex" ? "Lex" : body.userName || "Usuario"}: ${item.content}`)
      .join("\n")
  : "Sin historial previo"}

Estado actual de la demo:
${JSON.stringify(body.currentState, null, 2)}

Base de conocimiento de LexControl:
${JSON.stringify(lexDemoKnowledgeBase, null, 2)}

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

async function requestLexAnswer(apiKey: string, model: string, body: LexChatBody, rows: unknown, retryMode = false) {
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
    const rows = Array.isArray(body.rows) && body.rows.length ? body.rows : lexDemoRows;
    try {
      let answer = await requestLexAnswer(apiKey, model, body, rows);

      if (!answer) {
        answer = await requestLexAnswer(apiKey, model, body, rows, true);
      }

      return Response.json({
        answer:
          answer ||
          "No estoy seguro de haber entendido esa pregunta. ¿Podrías decirme si te refieres a movimientos, fallas, responsables o prioridad?",
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Lex request failed";
      return Response.json({ error: message }, { status: 500 });
    }
  },
};
