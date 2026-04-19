import { manualSourceConnector } from "@legal-search/connectors";
import type { CaseSourceInput } from "@legal-search/core";

const connectors = [manualSourceConnector];

async function runOnce() {
  const sampleInput: CaseSourceInput = {
    caseSourceId: "local-sample",
    caseId: "local-case",
    sourceId: "manual-source",
    sourceName: "Manual",
    radicado: "11001-31-03-001-2023-00045-00",
    normalizedRadicado: "11001310300120230004500",
  };

  const connector = connectors.find((candidate) => candidate.canHandle(sampleInput));

  if (!connector) {
    throw new Error(`No connector found for source ${sampleInput.sourceName}`);
  }

  const result = await connector.fetchCase(sampleInput);

  console.log(JSON.stringify({ connector: connector.sourceName, result }, null, 2));
}

runOnce().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
