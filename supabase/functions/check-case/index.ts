import { jsonResponse } from "../_shared/json.ts";

type CheckCaseRequest = {
  caseSourceId?: string;
  radicado?: string;
};

Deno.serve(async (request) => {
  if (request.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, { status: 405 });
  }

  const payload = (await request.json().catch(() => ({}))) as CheckCaseRequest;

  if (!payload.caseSourceId && !payload.radicado) {
    return jsonResponse(
      { error: "caseSourceId or radicado is required" },
      { status: 400 },
    );
  }

  return jsonResponse({
    status: "accepted",
    message: "Case check accepted. The crawler worker should process the source.",
    input: payload,
  });
});
