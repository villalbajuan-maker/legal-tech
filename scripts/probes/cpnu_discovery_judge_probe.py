#!/usr/bin/env python3
"""CPNU discovery probe: Juez, Magistrado y Clase de Proceso.

Technical discovery only. This probe runs a single guided query and captures
the request contract behind the public UI if one is exposed.
"""

from __future__ import annotations

import argparse
import asyncio
import json

from cpnu_discovery_common import (
    activate_all_processes_filter,
    choose_office,
    choose_process_class,
    click_consult,
    fill_judge_query,
    mask_text,
    run_cpnu_discovery_probe,
    write_report,
)


async def run_probe(
    judge_query: str,
    process_class: str,
    office: str | None,
    include_all_processes: bool,
    wait_ms: int,
) -> dict:
    async def interaction(page):
        notes = []
        await page.get_by_text("Juez, Magistrado y Clase de Proceso", exact=False).click()
        if include_all_processes:
            if not await activate_all_processes_filter(page):
                notes.append("all_processes_filter_not_found")
        if not await fill_judge_query(page, judge_query):
            notes.append("judge_field_not_filled")
        if not await choose_process_class(page, process_class):
            notes.append("process_class_not_selected")
        if office:
            if not await choose_office(page, office):
                notes.append("office_not_selected")
        if not await click_consult(page):
            notes.append("consult_button_not_clicked")
        return notes

    result = await run_cpnu_discovery_probe(
        probe_id="cpnu-discovery-judge",
        query_descriptor={
            "judge_query_masked": mask_text(judge_query),
            "process_class": process_class,
            "office": office,
            "all_processes": include_all_processes,
        },
        interaction=interaction,
        wait_ms=wait_ms,
    )
    return result


async def main_async() -> int:
    parser = argparse.ArgumentParser(description="Probe CPNU discovery by juez/magistrado y clase de proceso.")
    parser.add_argument("--judge", required=True, help="Public test query for juez o magistrado.")
    parser.add_argument("--process-class", required=True, help="Visible class label from the UI.")
    parser.add_argument("--office", help="Optional visible Despacho label.")
    parser.add_argument("--all-processes", action="store_true", help="Use the Todos los Procesos filter.")
    parser.add_argument("--wait-ms", type=int, default=7000, help="Wait after clicking Consultar.")
    parser.add_argument("--write-report", action="store_true", help="Write JSON report under tmp/source-probes.")
    args = parser.parse_args()

    result = await run_probe(
        judge_query=args.judge,
        process_class=args.process_class,
        office=args.office,
        include_all_processes=args.all_processes,
        wait_ms=args.wait_ms,
    )
    print(json.dumps(result, indent=2, ensure_ascii=False))

    if args.write_report:
        report_path = write_report(result, "cpnu-discovery-judge")
        print(f"\nReport written: {report_path}")

    return 0 if not result.get("error") else 1


def main() -> int:
    return asyncio.run(main_async())


if __name__ == "__main__":
    raise SystemExit(main())
