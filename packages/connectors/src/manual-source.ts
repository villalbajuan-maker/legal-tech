import type { SourceFetchResult } from "@legal-search/core";
import type { SourceConnector } from "./source-connector";

export const manualSourceConnector: SourceConnector = {
  sourceName: "Manual",
  canHandle(input) {
    return input.sourceName.toLowerCase() === "manual";
  },
  async fetchCase(): Promise<SourceFetchResult> {
    return {
      status: "success",
      rawPayload: { movements: [] },
      fetchedAt: new Date().toISOString(),
    };
  },
};
