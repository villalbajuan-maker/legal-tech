import { createHash } from "node:crypto";
import type { CaseSourceInput, ParsedMovement, SourceFetchResult } from "@legal-search/core";
import type { SourceConnector } from "./source-connector";

const CPNU_API_ROOT = "https://consultaprocesos.ramajudicial.gov.co:448/api/v2";
const CPNU_SEARCH_ENDPOINT = `${CPNU_API_ROOT}/Procesos/Consulta/NumeroRadicacion`;
const CPNU_TIMEOUT_MS = 30_000;

type CPNUPagination = {
  cantidadRegistros?: number;
  registrosPagina?: number;
  cantidadPaginas?: number;
  pagina?: number;
};

type CPNUProcess = {
  idProceso: number;
  llaveProceso?: string;
  fechaProceso?: string;
  fechaUltimaActuacion?: string;
  despacho?: string;
  departamento?: string;
  sujetosProcesales?: string;
  esPrivado?: boolean;
  idConexion?: number;
  cantFilas?: number;
};

type CPNUSearchResponse = {
  tipoConsulta?: string;
  procesos?: CPNUProcess[];
  parametros?: Record<string, unknown>;
  paginacion?: CPNUPagination;
};

type CPNUDetailResponse = Record<string, unknown>;

type CPNUActuacion = {
  idRegActuacion?: number;
  llaveProceso?: string;
  consActuacion?: number;
  fechaActuacion?: string;
  actuacion?: string;
  anotacion?: string;
  fechaInicial?: string;
  fechaFinal?: string;
  fechaRegistro?: string;
  codRegla?: string;
  conDocumentos?: boolean;
  cant?: number;
};

type CPNUActuacionesResponse = {
  actuaciones?: CPNUActuacion[];
  paginacion?: CPNUPagination;
};

type CPNUSujetoResponse = {
  sujetos?: Record<string, unknown>[];
  paginacion?: CPNUPagination;
};

type CPNUProcessBundle = {
  process: CPNUProcess;
  detail: CPNUDetailResponse | null;
  actuaciones: CPNUActuacion[];
  actuacionesPagination: CPNUPagination[];
  sujetos: Record<string, unknown>[];
  sujetosPagination: CPNUPagination[];
};

async function fetchCPNUJson<T>(path: string, params?: Record<string, string>) {
  const url = new URL(`${CPNU_API_ROOT}${path}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value));
  }

  const response = await fetch(url, {
    headers: {
      accept: "application/json",
      "user-agent": "LexControlCrawler/0.1 (bloque-3-cpnu)",
    },
    signal: AbortSignal.timeout(CPNU_TIMEOUT_MS),
  });

  if (!response.ok) {
    throw new Error(`CPNU request failed (${response.status}) for ${url.pathname}`);
  }

  return (await response.json()) as T;
}

function normalizeIsoDate(value?: string | null) {
  if (!value) return undefined;
  const trimmed = value.trim();
  return trimmed || undefined;
}

function normalizeText(value?: string | null) {
  return (value || "")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim();
}

function classifyMovementType(actuacion: CPNUActuacion) {
  const title = normalizeText(actuacion.actuacion);
  const description = normalizeText(actuacion.anotacion);
  const combined = `${title} ${description}`.trim();

  if (
    combined.includes("audiencia") ||
    combined.includes("reprogram") ||
    (combined.includes("fija fecha") && Boolean(actuacion.fechaInicial))
  ) {
    return "Audiencia";
  }

  if (combined.includes("traslado")) {
    return "Traslado";
  }

  if (combined.includes("sentencia") || combined.includes("fallo")) {
    return "Sentencia / fallo";
  }

  if (
    combined.includes("medida cautelar") ||
    combined.includes("embargo") ||
    combined.includes("secuestro") ||
    combined.includes("cautelar")
  ) {
    return "Medida cautelar";
  }

  if (
    combined.includes("terminacion") ||
    combined.includes("archivo") ||
    combined.includes("archiv") ||
    combined.includes("desist") ||
    combined.includes("liquidacion")
  ) {
    return "Terminacion / archivo";
  }

  if (
    combined.includes("memorial") ||
    combined.includes("allega") ||
    combined.includes("documento") ||
    combined.includes("recurso") ||
    combined.includes("demanda")
  ) {
    return "Documento / memorial";
  }

  if (
    combined.includes("secretaria") ||
    combined.includes("secretarial") ||
    combined.includes("constancia") ||
    combined.includes("oficio") ||
    combined.includes("registro")
  ) {
    return "Actuacion administrativa";
  }

  if (combined.includes("auto")) {
    return "Auto";
  }

  if (
    combined.includes("admite") ||
    combined.includes("inadmite") ||
    combined.includes("requiere") ||
    combined.includes("ordena") ||
    combined.includes("resuelve") ||
    combined.includes("avoca")
  ) {
    return "Impulso procesal";
  }

  return "Sin clasificar";
}

function buildMovementHash(processId: number, actuacion: CPNUActuacion) {
  const basis = JSON.stringify({
    processId,
    idRegActuacion: actuacion.idRegActuacion ?? null,
    consActuacion: actuacion.consActuacion ?? null,
    fechaActuacion: normalizeIsoDate(actuacion.fechaActuacion) ?? null,
    actuacion: actuacion.actuacion?.trim() ?? null,
    anotacion: actuacion.anotacion?.trim() ?? null,
    fechaInicial: normalizeIsoDate(actuacion.fechaInicial) ?? null,
    fechaFinal: normalizeIsoDate(actuacion.fechaFinal) ?? null,
  });

  return createHash("sha256").update(basis).digest("hex");
}

function parseMovements(bundle: CPNUProcessBundle): ParsedMovement[] {
  return bundle.actuaciones.map((actuacion) => ({
    externalId: actuacion.idRegActuacion ? String(actuacion.idRegActuacion) : undefined,
    movementDate: normalizeIsoDate(actuacion.fechaActuacion),
    title: actuacion.actuacion?.trim() || "Actuación sin título",
    description: actuacion.anotacion?.trim() || undefined,
    movementType: classifyMovementType(actuacion),
    normalizedHash: buildMovementHash(bundle.process.idProceso, actuacion),
    metadata: {
      processId: bundle.process.idProceso,
      llaveProceso: actuacion.llaveProceso || bundle.process.llaveProceso || null,
      consActuacion: actuacion.consActuacion ?? null,
      fechaInicial: normalizeIsoDate(actuacion.fechaInicial) ?? null,
      fechaFinal: normalizeIsoDate(actuacion.fechaFinal) ?? null,
      fechaRegistro: normalizeIsoDate(actuacion.fechaRegistro) ?? null,
      codRegla: actuacion.codRegla ?? null,
      conDocumentos: actuacion.conDocumentos ?? null,
    },
  }));
}

async function fetchPaginatedActuaciones(processId: number) {
  const actuaciones: CPNUActuacion[] = [];
  const pages: CPNUPagination[] = [];
  let currentPage = 1;
  let totalPages = 1;

  while (currentPage <= totalPages) {
    const response = await fetchCPNUJson<CPNUActuacionesResponse>(`/Proceso/Actuaciones/${processId}`, {
      pagina: String(currentPage),
    });

    pages.push(response.paginacion || {});
    actuaciones.push(...(response.actuaciones || []));
    totalPages = response.paginacion?.cantidadPaginas || 1;
    currentPage += 1;
  }

  return { actuaciones, pages };
}

async function fetchPaginatedSujetos(processId: number) {
  const sujetos: Record<string, unknown>[] = [];
  const pages: CPNUPagination[] = [];
  let currentPage = 1;
  let totalPages = 1;

  while (currentPage <= totalPages) {
    const response = await fetchCPNUJson<CPNUSujetoResponse>(`/Proceso/Sujetos/${processId}`, {
      pagina: String(currentPage),
    });

    pages.push(response.paginacion || {});
    sujetos.push(...(response.sujetos || []));
    totalPages = response.paginacion?.cantidadPaginas || 1;
    currentPage += 1;
  }

  return { sujetos, pages };
}

async function buildProcessBundle(process: CPNUProcess): Promise<CPNUProcessBundle> {
  const [detail, actuacionesResult, sujetosResult] = await Promise.all([
    fetchCPNUJson<CPNUDetailResponse>(`/Proceso/Detalle/${process.idProceso}`).catch(() => null),
    fetchPaginatedActuaciones(process.idProceso),
    fetchPaginatedSujetos(process.idProceso),
  ]);

  return {
    process,
    detail,
    actuaciones: actuacionesResult.actuaciones,
    actuacionesPagination: actuacionesResult.pages,
    sujetos: sujetosResult.sujetos,
    sujetosPagination: sujetosResult.pages,
  };
}

export const cpnuSourceConnector: SourceConnector = {
  sourceName: "CPNU",
  canHandle(input) {
    const normalized = input.sourceName.trim().toLowerCase();
    return normalized === "cpnu" || normalized === "rama judicial";
  },
  async fetchCase(input: CaseSourceInput): Promise<SourceFetchResult> {
    const startedAt = Date.now();

    try {
      const searchResponse = await fetchCPNUJson<CPNUSearchResponse>("/Procesos/Consulta/NumeroRadicacion", {
        numero: input.normalizedRadicado,
        SoloActivos: "false",
        pagina: "1",
      });

      const processes = searchResponse.procesos || [];
      const fetchedAt = new Date().toISOString();

      if (processes.length === 0) {
        return {
          status: "not_found",
          fetchedAt,
          durationMs: Date.now() - startedAt,
          rawPayload: {
            search: searchResponse,
          },
          metadata: {
            source: "CPNU",
            query: {
              numero: input.normalizedRadicado,
              soloActivos: false,
              pagina: 1,
            },
            records: searchResponse.paginacion?.cantidadRegistros || 0,
          },
        };
      }

      const bundles = await Promise.all(processes.map((process) => buildProcessBundle(process)));
      const movements = bundles.flatMap((bundle) => parseMovements(bundle));

      return {
        status: "success",
        fetchedAt,
        durationMs: Date.now() - startedAt,
        rawPayload: {
          search: searchResponse,
          bundles,
        },
        metadata: {
          source: "CPNU",
          query: {
            numero: input.normalizedRadicado,
            soloActivos: false,
            pagina: 1,
          },
          processCount: bundles.length,
          totalMovements: movements.length,
          latestActuacionDate:
            bundles
              .flatMap((bundle) => bundle.actuaciones.map((actuacion) => actuacion.fechaActuacion))
              .filter(Boolean)
              .sort()
              .at(-1) || null,
        },
        movements,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown CPNU connector error";
      const status =
        /403|401|429/i.test(message) ? "blocked" : /timeout/i.test(message) ? "blocked" : "error";

      return {
        status,
        fetchedAt: new Date().toISOString(),
        durationMs: Date.now() - startedAt,
        errorMessage: message,
        metadata: {
          source: "CPNU",
          endpoint: CPNU_SEARCH_ENDPOINT,
        },
      };
    }
  },
};
