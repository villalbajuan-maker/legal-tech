#!/usr/bin/env python3
"""Batch runner for authorized CPNU radicado probes.

Reports and screenshots are written under tmp/ and must not be committed.
"""

from __future__ import annotations

import argparse
import asyncio
import json
import time
from pathlib import Path

from cpnu_search_probe import REPORTS_DIR, mask_radicado, normalize_radicado, run_probe


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


async def main_async() -> int:
    parser = argparse.ArgumentParser(description="Run authorized CPNU probes in batch.")
    parser.add_argument("--radicado", action="append", help="Authorized test radicado. Can be repeated.")
    parser.add_argument("--file", help="Text file with one authorized radicado per line.")
    parser.add_argument("--complete-search", action="store_true", help="Use complete search instead of last 30 days.")
    parser.add_argument("--wait-ms", type=int, default=7000, help="Wait after clicking search.")
    parser.add_argument("--delay-ms", type=int, default=1500, help="Delay between probes.")
    parser.add_argument("--write-report", action="store_true", help="Write aggregate JSON report under tmp/source-probes.")
    args = parser.parse_args()

    radicados = load_radicados(args)
    if not radicados:
        parser.error("Provide at least one --radicado or --file.")

    results = []
    for index, radicado in enumerate(radicados, start=1):
        print(f"[{index}/{len(radicados)}] probing {mask_radicado(radicado)}")
        try:
            result = await run_probe(radicado, args.complete_search, args.wait_ms)
            result["ok"] = True
        except Exception as exc:  # noqa: BLE001 - keep batch running.
            result = {
                "ok": False,
                "radicado_masked": mask_radicado(radicado),
                "radicado_length": len(normalize_radicado(radicado)),
                "error": str(exc),
            }

        results.append(result)

        if index < len(radicados):
            await asyncio.sleep(args.delay_ms / 1000)

    summary = {
        "total": len(results),
        "ok": sum(1 for result in results if result.get("ok")),
        "failed": sum(1 for result in results if not result.get("ok")),
        "results": results,
    }

    print(json.dumps(summary, indent=2, ensure_ascii=False))

    if args.write_report:
        REPORTS_DIR.mkdir(parents=True, exist_ok=True)
        report_path = REPORTS_DIR / f"cpnu-batch-{int(time.time())}.json"
        report_path.write_text(json.dumps(summary, indent=2, ensure_ascii=False), encoding="utf-8")
        print(f"\nReport written: {report_path}")

    return 0 if summary["failed"] == 0 else 1


def main() -> int:
    return asyncio.run(main_async())


if __name__ == "__main__":
    raise SystemExit(main())
