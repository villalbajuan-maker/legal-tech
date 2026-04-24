#!/usr/bin/env python3
"""CPNU discovery probe: Nombre o Razon Social.

Technical discovery only. This probe attempts a single public-name query,
captures network traffic, and reports whether the flow appears to use a stable
request contract. It is not intended for bulk extraction.
"""

from __future__ import annotations

import argparse
import asyncio
import json
import time

from cpnu_discovery_common import (
    activate_all_processes_filter,
    choose_person_type,
    click_consult,
    fill_name_query,
    mask_text,
    run_cpnu_discovery_probe,
    write_report,
)


async def run_probe(query: str, person_type: str, include_all_processes: bool, wait_ms: int) -> dict:
    async def interaction(page):
        notes = []
        await page.get_by_text("Nombre o Razón Social", exact=False).click()
        if include_all_processes:
            if not await activate_all_processes_filter(page):
                notes.append("all_processes_filter_not_found")
        if not await choose_person_type(page, person_type):
            notes.append("person_type_not_selected")
        if not await fill_name_query(page, query):
            notes.append("name_field_not_filled")
        if not await click_consult(page):
            notes.append("consult_button_not_clicked")
        return notes

    result = await run_cpnu_discovery_probe(
        probe_id="cpnu-discovery-name",
        query_descriptor={
            "query_masked": mask_text(query),
            "person_type": person_type,
            "all_processes": include_all_processes,
        },
        interaction=interaction,
        wait_ms=wait_ms,
    )
    return result


async def main_async() -> int:
    parser = argparse.ArgumentParser(description="Probe CPNU discovery by Nombre o Razon Social.")
    parser.add_argument("--query", required=True, help="Public test query for discovery.")
    parser.add_argument(
        "--person-type",
        default="Natural",
        choices=["Natural", "Jurídica", "Juridica"],
        help="Tipo Persona shown in CPNU UI.",
    )
    parser.add_argument("--all-processes", action="store_true", help="Use the Todos los Procesos filter.")
    parser.add_argument("--wait-ms", type=int, default=7000, help="Wait after clicking Consultar.")
    parser.add_argument("--write-report", action="store_true", help="Write JSON report under tmp/source-probes.")
    args = parser.parse_args()

    result = await run_probe(
        query=args.query,
        person_type="Jurídica" if args.person_type == "Juridica" else args.person_type,
        include_all_processes=args.all_processes,
        wait_ms=args.wait_ms,
    )
    print(json.dumps(result, indent=2, ensure_ascii=False))

    if args.write_report:
        report_path = write_report(result, "cpnu-discovery-name")
        print(f"\nReport written: {report_path}")

    return 0 if not result.get("error") else 1


def main() -> int:
    return asyncio.run(main_async())


if __name__ == "__main__":
    raise SystemExit(main())
