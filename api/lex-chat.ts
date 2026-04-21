import { buildLexSystemPrompt, lexDemoKnowledgeBase, lexDemoRows } from "../packages/core/src";

type LexChatBody = {
  question?: string;
  intent?: string | null;
  userName?: string | null;
  history?: Array<{ role: string; content: string }>;
  rows?: unknown;
  currentState?: unknown;
};

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
      max_output_tokens: 220,
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

    const data = (await response.json()) as { output_text?: string };

    return Response.json({
      answer: data.output_text?.trim() || "",
    });
  },
};
