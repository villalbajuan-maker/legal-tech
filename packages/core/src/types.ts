export type FetchStatus = "success" | "error" | "blocked" | "not_found";

export type CaseSourceInput = {
  caseSourceId: string;
  caseId: string;
  sourceId: string;
  sourceName: string;
  radicado: string;
  normalizedRadicado: string;
  externalReference?: string | null;
  metadata?: Record<string, unknown>;
};

export type SourceFetchResult = {
  status: FetchStatus;
  rawPayload?: unknown;
  rawHtml?: string;
  fetchedAt: string;
  errorMessage?: string;
  durationMs?: number;
};

export type ParsedMovement = {
  externalId?: string;
  movementDate?: string;
  title: string;
  description?: string;
  movementType?: string;
  normalizedHash: string;
  metadata?: Record<string, unknown>;
};
