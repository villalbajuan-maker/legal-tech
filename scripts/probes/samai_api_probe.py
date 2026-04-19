#!/usr/bin/env python3
"""Direct SAMAI search probe by authorized radicado.

This probe only hits the public listing endpoint. It does not bypass the
"No soy un robot" challenge shown before opening process details.
"""

from __future__ import annotations

import argparse
import json
import re
import ssl
from html import unescape
from urllib.request import Request, urlopen


SAMAI_SEARCH_URL = "https://samai.consejodeestado.gov.co/Vistas/Casos/Jprocesos.ashx/listaprocesosdata"
DEFAULT_CORPORACION = "1100133"  # Juzgado Administrativo de Bogota


def normalize_radicado(value: str) -> str:
    return re.sub(r"\D+", "", value)


def mask_radicado(value: str) -> str:
    normalized = normalize_radicado(value)
    if len(normalized) <= 4:
        return "*" * len(normalized)
    return f"{'*' * (len(normalized) - 4)}{normalized[-4:]}"


def strip_html(value: str | None) -> str:
    if not value:
        return ""

    text = re.sub(r"<br\\s*/?>", "\n", value, flags=re.IGNORECASE)
    text = re.sub(r"<[^>]+>", "", text)
    return re.sub(r"\s+\n", "\n", unescape(text)).strip()


def query_samai(radicado: str, corporacion: str) -> dict:
    normalized = normalize_radicado(radicado)
    payload = {
        "FW_tipobusqueda": "FW_Rbtradicado",
        "FW_ppexacta": "",
        "FW_tipoarea": "FW_RbtCorporacion",
        "FW_Txtcriterios": normalized,
        "FW_LstCorporacion": corporacion,
        "FW_LstSeccion": "",
        "FW_LstPonente": "",
        "FW_FechaI": "",
        "FW_FechaF": "",
        "FW_LstcriterioV": "",
        "FW_LstcriterioP": "",
    }

    request = Request(
        SAMAI_SEARCH_URL,
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "accept": "application/json, text/javascript, */*; q=0.01",
            "content-type": "application/json; charset=utf-8",
            "origin": "https://samai.consejodeestado.gov.co",
            "referer": "https://samai.consejodeestado.gov.co/Vistas/Casos/procesos.aspx",
            "user-agent": (
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/145.0.0.0 Safari/537.36"
            ),
            "x-requested-with": "XMLHttpRequest",
        },
        method="POST",
    )

    with urlopen(request, timeout=30, context=ssl.create_default_context()) as response:
        rows = json.loads(response.read().decode("utf-8"))

    return {
        "radicado_masked": mask_radicado(normalized),
        "radicado_length": len(normalized),
        "corporacion": corporacion,
        "records": len(rows),
        "rows": [
            {
                "numeral": row.get("NUMERAL"),
                "radicado": str(row.get("RADICADO", "")).lstrip("'"),
                "detalles_text": strip_html(row.get("DETALLES")),
                "acciones_html_present": bool(row.get("ACCIONES")),
            }
            for row in rows
        ],
    }


def main() -> int:
    parser = argparse.ArgumentParser(description="Probe SAMAI public process search.")
    parser.add_argument("--radicado", required=True, help="Authorized test radicado.")
    parser.add_argument(
        "--corporacion",
        default=DEFAULT_CORPORACION,
        help="SAMAI corporation/judicial office key. Default: Juzgado Administrativo de Bogota.",
    )
    args = parser.parse_args()

    result = query_samai(args.radicado, args.corporacion)
    print(json.dumps(result, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
