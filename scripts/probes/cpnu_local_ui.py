#!/usr/bin/env python3
"""Local CPNU query UI.

Runs a small local-only HTTP server with:
- GET /            Minimal browser UI.
- POST /api/cpnu   Batch query proxy to CPNU.

This is for technical discovery. It does not persist data.
"""

from __future__ import annotations

import json
import re
import ssl
import time
from datetime import datetime, timedelta, timezone
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlencode
from urllib.request import Request, urlopen


CPNU_BASE = "https://consultaprocesos.ramajudicial.gov.co:448/api/v2"
DEFAULT_PORT = 8765


HTML = """<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>CPNU Query Lab</title>
    <style>
      :root {
        color: #16211d;
        background: #f6f7f3;
        font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      }

      * {
        box-sizing: border-box;
      }

      body {
        margin: 0;
      }

      main {
        width: min(1180px, calc(100% - 32px));
        margin: 0 auto;
        padding: 34px 0;
      }

      h1 {
        max-width: 780px;
        margin: 0 0 8px;
        font-size: clamp(2rem, 5vw, 4.2rem);
        line-height: 1;
      }

      p {
        margin-top: 0;
        color: #56635e;
        line-height: 1.55;
      }

      textarea,
      button,
      select {
        font: inherit;
      }

      textarea {
        width: 100%;
        min-height: 190px;
        resize: vertical;
        border: 1px solid #cfd7d0;
        border-radius: 8px;
        padding: 14px;
        background: #ffffff;
        color: #16211d;
        line-height: 1.5;
      }

      button,
      select {
        font: inherit;
      }

      button,
      select {
        min-height: 42px;
      }

      button {
        border: 0;
        border-radius: 8px;
        padding: 0 18px;
        background: #175c4c;
        color: #ffffff;
        font-weight: 800;
        cursor: pointer;
      }

      button:disabled {
        opacity: 0.55;
        cursor: wait;
      }

      select {
        border: 1px solid #cfd7d0;
        border-radius: 8px;
        padding: 0 12px;
        background: #ffffff;
        color: #16211d;
      }

      .toolbar {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
        align-items: center;
        margin: 14px 0 22px;
      }

      .summary {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 12px;
        margin-bottom: 20px;
      }

      .metric,
      .panel {
        border: 1px solid #d9ded4;
        border-radius: 8px;
        background: #ffffff;
      }

      .metric {
        min-height: 96px;
        padding: 16px;
      }

      .metric strong {
        display: block;
        color: #a23d32;
        font-size: 2rem;
        line-height: 1;
      }

      .metric span {
        color: #5b6761;
      }

      .panel {
        overflow: hidden;
      }

      table {
        width: 100%;
        border-collapse: collapse;
      }

      th,
      td {
        padding: 12px;
        border-bottom: 1px solid #e4e9e3;
        text-align: left;
        vertical-align: top;
      }

      th {
        background: #eef3ed;
        font-size: 0.82rem;
        text-transform: uppercase;
      }

      td {
        overflow-wrap: anywhere;
      }

      .empty,
      .error {
        color: #8f2f28;
        font-weight: 800;
      }

      .ok {
        color: #175c4c;
        font-weight: 800;
      }

      .details {
        color: #56635e;
        font-size: 0.92rem;
      }

      @media (max-width: 820px) {
        .summary {
          grid-template-columns: 1fr 1fr;
        }

        table {
          display: block;
          overflow-x: auto;
        }
      }
    </style>
  </head>
  <body>
    <main>
      <h1>CPNU Query Lab</h1>
      <p>Consulta local de radicados contra la Consulta Nacional Unificada. Los datos se consultan en vivo y no se guardan.</p>

      <textarea id="radicados" spellcheck="false">11001400303520230010700
11001400306620230164700
11001400307720220072200
11001400305020230030000
11001418901820230049400
11001310300420140025800
11001400307720220073000
11001418901820240057700
11001333501120240010300
11001400300720220073100
25899310300220190018400
11001400304820240111000
11001418905220240042700
11001600000220240180100
11001400302520220039800
11001333603820250000100</textarea>

      <div class="toolbar">
        <button id="run">Consultar CPNU</button>
        <label>
          Filtro actuacion:
          <select id="actuationFilter">
            <option value="all">Todas</option>
            <option value="1">Ultimas 24 horas</option>
            <option value="7">Ultima semana</option>
            <option value="30">Ultimos 30 dias</option>
          </select>
        </label>
        <span id="status" class="details">Modo: Todos los procesos.</span>
      </div>

      <section class="summary" aria-label="Resumen">
        <article class="metric"><strong id="total">0</strong><span>Radicados</span></article>
        <article class="metric"><strong id="ok">0</strong><span>Consultas OK</span></article>
        <article class="metric"><strong id="withRecords">0</strong><span>Radicados visibles</span></article>
        <article class="metric"><strong id="processes">0</strong><span>Procesos visibles</span></article>
      </section>

      <section class="panel">
        <table>
          <thead>
            <tr>
              <th>Radicado</th>
              <th>Estado</th>
              <th>Registros</th>
              <th>Despacho</th>
              <th>Ultima actuacion</th>
              <th>Detalle</th>
            </tr>
          </thead>
          <tbody id="results">
            <tr><td colspan="6" class="details">Ejecuta una consulta para ver resultados.</td></tr>
          </tbody>
        </table>
      </section>
    </main>

    <script>
      const runButton = document.querySelector("#run");
      const actuationFilter = document.querySelector("#actuationFilter");
      const statusEl = document.querySelector("#status");
      const tbody = document.querySelector("#results");
      let latestData = null;

      const metrics = {
        total: document.querySelector("#total"),
        ok: document.querySelector("#ok"),
        withRecords: document.querySelector("#withRecords"),
        processes: document.querySelector("#processes"),
      };

      function getFilterLabel() {
        const labels = {
          all: "todas las actuaciones",
          1: "ultimas 24 horas",
          7: "ultima semana",
          30: "ultimos 30 dias",
        };
        return labels[actuationFilter.value] || "filtro seleccionado";
      }

      function escapeHtml(value) {
        return String(value ?? "").replace(/[&<>"']/g, (char) => ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#039;",
        })[char]);
      }

      function parseCpnuDate(value) {
        if (!value) {
          return null;
        }

        const parsed = new Date(value);
        return Number.isNaN(parsed.getTime()) ? null : parsed;
      }

      function passesActuationFilter(proceso) {
        const filterValue = actuationFilter.value;
        if (filterValue === "all") {
          return true;
        }
        if (!proceso) {
          return false;
        }

        const date = parseCpnuDate(proceso.fechaUltimaActuacion || proceso.fechaProceso);
        if (!date) {
          return false;
        }

        const days = Number(filterValue);
        const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
        return date >= cutoff;
      }

      function render(data) {
        latestData = data;

        metrics.total.textContent = data.total;
        metrics.ok.textContent = data.ok;

        const rows = [];
        let visibleResults = 0;
        let visibleProcesses = 0;
        let totalProcesses = 0;

        for (const result of data.results) {
          if (!result.ok) {
            rows.push(`
              <tr>
                <td>${escapeHtml(result.radicado_masked)}</td>
                <td class="error">Error</td>
                <td>0</td>
                <td colspan="3">${escapeHtml(result.error)}</td>
              </tr>
            `);
            continue;
          }

          const procesos = result.procesos.length ? result.procesos : [null];
          totalProcesses += result.procesos.length;
          const visibleProcesos = procesos.filter(passesActuationFilter);

          if (visibleProcesos.length > 0) {
            visibleResults += 1;
          }

          for (const proceso of visibleProcesos) {
            if (proceso) {
              visibleProcesses += 1;
            }
            rows.push(`
              <tr>
                <td>${escapeHtml(result.radicado_masked)}</td>
                <td class="${result.records > 0 ? "ok" : "empty"}">${result.records > 0 ? "Encontrado" : "Sin registros"}</td>
                <td>${escapeHtml(result.records)}</td>
                <td>${escapeHtml(proceso?.despacho || "-")}</td>
                <td>${escapeHtml(proceso?.fechaUltimaActuacion || "-")}</td>
                <td class="details">
                  ${proceso ? `
                    idProceso: ${escapeHtml(proceso.idProceso)}<br />
                    Departamento: ${escapeHtml(proceso.departamento)}<br />
                    Sujetos: ${escapeHtml(proceso.sujetosProcesales)}
                  ` : "-"}
                </td>
              </tr>
            `);
          }
        }

        metrics.withRecords.textContent = visibleResults;
        metrics.processes.textContent = visibleProcesses;

        tbody.innerHTML = rows.length ? rows.join("") : `
          <tr>
            <td colspan="6" class="details">
              No hay procesos con ultima actuacion en ${escapeHtml(getFilterLabel())}.
              La consulta trajo ${escapeHtml(totalProcesses)} proceso(s) en total. Cambia el filtro a "Todas" para verlos.
            </td>
          </tr>
        `;
      }

      actuationFilter.addEventListener("change", () => {
        if (latestData) {
          render(latestData);
          statusEl.textContent = `Filtro aplicado: ${getFilterLabel()}.`;
        }
      });

      runButton.addEventListener("click", async () => {
        const radicados = document.querySelector("#radicados").value
          .split(/\\s+/)
          .map((value) => value.trim())
          .filter(Boolean);

        runButton.disabled = true;
        statusEl.textContent = `Consultando ${radicados.length} radicados...`;
        tbody.innerHTML = `<tr><td colspan="6" class="details">Consultando CPNU...</td></tr>`;

        try {
          const response = await fetch("/api/cpnu", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
              radicados,
              mode: "all",
            }),
          });

          const data = await response.json();
          if (!response.ok) {
            throw new Error(data.error || "Error consultando CPNU");
          }

          render(data);
          statusEl.textContent = `Consulta terminada en ${data.elapsed_ms} ms.`;
        } catch (error) {
          statusEl.textContent = error.message;
          tbody.innerHTML = `<tr><td colspan="6" class="error">${escapeHtml(error.message)}</td></tr>`;
        } finally {
          runButton.disabled = false;
        }
      });
    </script>
  </body>
</html>
"""


def normalize_radicado(value: str) -> str:
    return re.sub(r"\D+", "", value)


def mask_radicado(value: str) -> str:
    normalized = normalize_radicado(value)
    if len(normalized) <= 4:
        return "*" * len(normalized)
    return f"{'*' * (len(normalized) - 4)}{normalized[-4:]}"


def fetch_json(path: str, params: dict[str, str | int | bool]) -> dict:
    query = urlencode(params)
    request = Request(
        f"{CPNU_BASE}{path}?{query}",
        headers={
            "accept": "application/json",
            "user-agent": "LegalSearchMVPLocalUI/0.1",
        },
    )

    with urlopen(request, timeout=30, context=ssl.create_default_context()) as response:
        return json.loads(response.read().decode("utf-8"))


def parse_cpnu_date(value: str | None) -> datetime | None:
    if not value:
        return None

    try:
        return datetime.fromisoformat(value.replace("Z", "+00:00"))
    except ValueError:
        return None


def filter_processes_by_days(procesos: list[dict], days: int) -> list[dict]:
    cutoff = datetime.now(timezone.utc) - timedelta(days=days)
    filtered = []

    for proceso in procesos:
        raw_date = proceso.get("fechaUltimaActuacion") or proceso.get("fechaProceso")
        process_date = parse_cpnu_date(raw_date)
        if process_date is None:
            continue
        if process_date.tzinfo is None:
            process_date = process_date.replace(tzinfo=timezone.utc)
        if process_date >= cutoff:
            filtered.append(proceso)

    return filtered


def query_radicado(radicado: str, mode: str) -> dict:
    normalized = normalize_radicado(radicado)
    result = {
        "ok": False,
        "radicado_masked": mask_radicado(normalized),
        "radicado_length": len(normalized),
        "records": 0,
        "pages": 0,
        "procesos": [],
    }

    if len(normalized) != 23:
        result["error"] = "El radicado debe tener 23 digitos."
        return result

    solo_activos = mode == "recent"

    try:
        body = fetch_json(
            "/Procesos/Consulta/NumeroRadicacion",
            {"numero": normalized, "SoloActivos": str(solo_activos).lower(), "pagina": 1},
        )
        pagination = body.get("paginacion") or {}
        procesos = body.get("procesos") or []
        raw_records = pagination.get("cantidadRegistros") or 0

        if mode == "last300":
            procesos = filter_processes_by_days(procesos, 300)

        result.update(
            {
                "ok": True,
                "records": len(procesos) if mode == "last300" else raw_records,
                "raw_records": raw_records,
                "pages": pagination.get("cantidadPaginas") or 0,
                "procesos": procesos,
            }
        )
    except Exception as exc:  # noqa: BLE001 - report per-radicado failure.
        result["error"] = str(exc)

    return result


class Handler(BaseHTTPRequestHandler):
    server_version = "LegalSearchCPNUUI/0.1"

    def do_GET(self) -> None:
        if self.path not in ("/", "/index.html"):
            self.send_json({"error": "Not found"}, status=404)
            return

        body = HTML.encode("utf-8")
        self.send_response(200)
        self.send_header("content-type", "text/html; charset=utf-8")
        self.send_header("content-length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_POST(self) -> None:
        if self.path != "/api/cpnu":
            self.send_json({"error": "Not found"}, status=404)
            return

        try:
            length = int(self.headers.get("content-length", "0"))
            payload = json.loads(self.rfile.read(length).decode("utf-8"))
            radicados = payload.get("radicados") or []
            mode = payload.get("mode") or ("recent" if payload.get("soloActivos") else "all")
        except Exception as exc:
            self.send_json({"error": f"Invalid JSON: {exc}"}, status=400)
            return

        if not isinstance(radicados, list):
            self.send_json({"error": "radicados must be a list"}, status=400)
            return
        if mode not in ("all", "recent", "last300"):
            self.send_json({"error": "mode must be all, recent or last300"}, status=400)
            return

        started_at = time.perf_counter()
        unique_radicados = []
        seen = set()
        for radicado in radicados:
            normalized = normalize_radicado(str(radicado))
            if normalized and normalized not in seen:
                unique_radicados.append(normalized)
                seen.add(normalized)

        results = [query_radicado(radicado, mode) for radicado in unique_radicados]
        report = {
            "total": len(results),
            "ok": sum(1 for result in results if result.get("ok")),
            "failed": sum(1 for result in results if not result.get("ok")),
            "with_records": sum(1 for result in results if (result.get("records") or 0) > 0),
            "processes_found": sum(len(result.get("procesos") or []) for result in results),
            "mode": mode,
            "solo_activos": mode == "recent",
            "local_filter_days": 300 if mode == "last300" else None,
            "elapsed_ms": int((time.perf_counter() - started_at) * 1000),
            "results": results,
        }
        self.send_json(report)

    def send_json(self, body: dict, status: int = 200) -> None:
        encoded = json.dumps(body, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("content-type", "application/json; charset=utf-8")
        self.send_header("content-length", str(len(encoded)))
        self.end_headers()
        self.wfile.write(encoded)

    def log_message(self, format: str, *args: object) -> None:
        print(f"{self.address_string()} - {format % args}")


def main() -> int:
    server = ThreadingHTTPServer(("127.0.0.1", DEFAULT_PORT), Handler)
    print(f"CPNU Query Lab running at http://127.0.0.1:{DEFAULT_PORT}/")
    print("Press Ctrl+C to stop.")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nStopping server.")
    finally:
        server.server_close()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
