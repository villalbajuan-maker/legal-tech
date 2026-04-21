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

    const historyText = Array.isArray(body.history)
      ? body.history
          .map((item) => `${item.role === "lex" ? "Lex" : body.userName || "Usuario"}: ${item.content}`)
          .join("\n")
      : "";

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
              text: `
Nombre del usuario: ${body.userName || "No informado"}
Intencion detectada: ${body.intent || "sin intencion exacta"}

Historial reciente:
${historyText || "Sin historial previo"}

Estado actual de la demo:
${JSON.stringify(body.currentState, null, 2)}

Base de conocimiento de LexControl:
${JSON.stringify(lexDemoKnowledgeBase, null, 2)}

Procesos canonicos de la demo:
${JSON.stringify(lexDemoRows, null, 2)}

Procesos visibles entregados por la UI:
${JSON.stringify(rows, null, 2)}

Pregunta actual:
${body.question || ""}
`.trim(),
            },
          ],
        },
      ],
      max_output_tokens: 320,
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
      return Response.json({ error: errorText }, { status: 500 });
    }

    const data = (await response.json()) as unknown;

    return Response.json({
      answer: extractOpenAIText(data),
    });
  },
};
