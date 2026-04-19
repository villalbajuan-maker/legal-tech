import type { CaseSourceInput, SourceFetchResult } from "@legal-search/core";

export type SourceConnector = {
  sourceName: string;
  canHandle(input: CaseSourceInput): boolean;
  fetchCase(input: CaseSourceInput): Promise<SourceFetchResult>;
};
