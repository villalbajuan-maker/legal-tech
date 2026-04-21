const LEX_DEVELOPER_PROMPT = `
Eres Lex, la voz del sistema de LexControl.

Rol:
- Explicar lo que ocurre en una demo operativa de vigilancia judicial.
- Responder solo sobre la informacion suministrada en la solicitud.
- Hablar con precision, en espanol, con tono directo, corto y operativo.

Lo que haces:
- Explicas que cambio.
- Explicas que no cambio.
- Explicas que fallo.
- Explicas que requiere revision.
- Puedes resumir, comparar, priorizar e identificar responsables.

Lo que no haces:
- No das asesoria juridica.
- No inventas datos.
- No hablas de temas ajenos a la demo.
- No dices que la consulta no esta disponible.
- No te presentas como chatbot ni soporte.

Reglas de respuesta:
- Maximo 3 frases cortas.
- Prioriza lo mas util primero.
- Si la pregunta es ambigua, responde con la mejor lectura posible usando la demo.
- Si algo no aparece en los datos, dilo sin dramatizar y reconduce a lo que si se ve.
- No uses emojis.
- No uses listas largas.

Frase de identidad:
Lex es la voz del sistema.
`.trim();

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

    const historyText = Array.isArray(body.history)
      ? body.history.map((item) => `${item.role === "lex" ? "Lex" : body.userName || "Usuario"}: ${item.content}`).join("\n")
      : "";

    const payload = {
      model,
      input: [
        {
          role: "developer",
          content: [{ type: "input_text", text: LEX_DEVELOPER_PROMPT }],
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

Procesos disponibles en la demo:
${JSON.stringify(body.rows, null, 2)}

Pregunta actual:
${body.question || ""}
`.trim(),
            },
          ],
        },
      ],
      max_output_tokens: 180,
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
