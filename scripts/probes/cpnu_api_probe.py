#!/usr/bin/env python3
"""Direct API probe for CPNU by authorized radicado.

Default output is a masked summary. Use generated tmp/ reports for local
technical discovery only; do not commit reports containing raw process data.
"""

from __future__ import annotations

import argparse
import json
import re
import ssl
import time
from pathlib import Path
from urllib.parse import urlencode
from urllib.request import Request, urlopen


ROOT = Path(__file__).resolve().parents[2]
REPORTS_DIR = ROOT / "tmp" / "source-probes"
CPNU_ENDPOINT = "https://consultaprocesos.ramajudicial.gov.co:448/api/v2/Procesos/Consulta/NumeroRadicacion"


def normalize_radicado(value: str) -> str:
    return re.sub(r"\D+", "", value)


def mask_radicado(value: str) -> str:
    normalized = normalize_radicado(value)
    if len(normalized) <= 4:
        return "*" * len(normalized)
    return f"{'*' * (len(normalized) - 4)}{normalized[-4:]}"


def load_radicados(args: argparse.Namespace) -> list[str]:
    radicados: list[str] = []

    if args.file:
        radicados.extend(
            line.strip()
            for line in Path(args.file).read_text(encoding="utf-8").splitlines()
            if line.strip()
        )

    radicados.extend(args.radicado or [])

    unique: list[str] = []
    seen: set[str] = set()
    for radicado in radicados:
        normalized = normalize_radicado(radicado)
        if normalized and normalized not in seen:
            seen.add(normalized)
            unique.append(normalized)

    return unique


def fetch_cpnu(numero: str, solo_activos: bool, pagina: int) -> dict:
    query = urlencode(
        {
            "numero": numero,
            "SoloActivos": str(solo_activos).lower(),
            "pagina": str(pagina),
        }
    )
    request = Request(
        f"{CPNU_ENDPOINT}?{query}",
        headers={
            "accept": "application/json",
            "user-agent": "LegalSearchMVPApiProbe/0.1",
        },
    )

    with urlopen(request, timeout=30, context=ssl.create_default_context()) as response:
        return json.loads(response.read().decode("utf-8"))


def summarize_response(numero: str, body: dict, include_raw: bool) -> dict:
    paginacion = body.get("paginacion") or {}
    procesos = body.get("procesos") or []

    summary = {
        "radicado_masked": mask_radicado(numero),
        "radicado_length": len(normalize_radicado(numero)),
        "records": paginacion.get("cantidadRegistros"),
        "pages": paginacion.get("cantidadPaginas"),
        "procesos_len": len(procesos),
        "process_keys": sorted(procesos[0].keys()) if procesos else [],
    }

    if include_raw:
        summary["raw"] = body

    return summary


def main() -> int:
    parser = argparse.ArgumentParser(description="Probe the CPNU direct API.")
    parser.add_argument("--radicado", action="append", help="Authorized test radicado. Can be repeated.")
    parser.add_argument("--file", help="Text file with one authorized radicado per line.")
    parser.add_argument("--solo-activos", action="store_true", help="Query only active/recent cases.")
    parser.add_argument("--pagina", type=int, default=1, help="Page number.")
    parser.add_argument("--include-raw", action="store_true", help="Include raw API body in tmp report.")
    parser.add_argument("--write-report", action="store_true", help="Write JSON report under tmp/source-probes.")
    args = parser.parse_args()

    radicados = load_radicados(args)
    if not radicados:
        parser.error("Provide at least one --radicado or --file.")

    results = []
    for radicado in radicados:
        try:
            body = fetch_cpnu(radicado, args.solo_activos, args.pagina)
            result = summarize_response(radicado, body, args.include_raw)
            result["ok"] = True
        except Exception as exc:  # noqa: BLE001 - report per-radicado failure.
            result = {
                "ok": False,
                "radicado_masked": mask_radicado(radicado),
                "radicado_length": len(normalize_radicado(radicado)),
                "error": str(exc),
            }
        results.append(result)

    report = {
        "endpoint": CPNU_ENDPOINT,
        "solo_activos": args.solo_activos,
        "pagina": args.pagina,
        "total": len(results),
        "ok": sum(1 for result in results if result.get("ok")),
        "failed": sum(1 for result in results if not result.get("ok")),
        "with_records": sum(1 for result in results if (result.get("records") or 0) > 0),
        "results": results,
    }

    print(json.dumps(report, indent=2, ensure_ascii=False))

    if args.write_report:
        REPORTS_DIR.mkdir(parents=True, exist_ok=True)
        report_path = REPORTS_DIR / f"cpnu-api-{int(time.time())}.json"
        report_path.write_text(json.dumps(report, indent=2, ensure_ascii=False), encoding="utf-8")
        print(f"\nReport written: {report_path}")

    return 0 if report["failed"] == 0 else 1


if __name__ == "__main__":
    raise SystemExit(main())
