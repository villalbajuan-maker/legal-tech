#!/usr/bin/env python3
"""Controlled CPNU search probe with one authorized radicado.

Requires Playwright. The report is written under tmp/ and masks the radicado.
Do not commit generated reports or screenshots.
"""

from __future__ import annotations

import argparse
import asyncio
import json
import re
import time
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[2]
REPORTS_DIR = ROOT / "tmp" / "source-probes"
CPNU_URL = "https://consultaprocesos.ramajudicial.gov.co/Procesos/NumeroRadicacion"


def normalize_radicado(value: str) -> str:
    return re.sub(r"\D+", "", value)


def mask_radicado(value: str) -> str:
    normalized = normalize_radicado(value)
    if len(normalized) <= 4:
        return "*" * len(normalized)
    return f"{'*' * (len(normalized) - 4)}{normalized[-4:]}"


async def run_probe(radicado: str, complete_search: bool, wait_ms: int) -> dict[str, Any]:
    from playwright.async_api import async_playwright

    normalized = normalize_radicado(radicado)
    REPORTS_DIR.mkdir(parents=True, exist_ok=True)
    timestamp = int(time.time())
    screenshot_path = REPORTS_DIR / f"cpnu-search-{timestamp}-{normalized[-4:]}.png"

    requests: list[dict[str, Any]] = []
    responses: list[dict[str, Any]] = []
    response_bodies: list[dict[str, Any]] = []

    async with async_playwright() as playwright:
        browser = await playwright.chromium.launch(headless=True)
        page = await browser.new_page(
            viewport={"width": 1440, "height": 1000},
            user_agent=(
                "LegalSearchMVPCPNUSearchProbe/0.1 "
                "(authorized-test; public-source-compatibility)"
            ),
        )

        page.on(
            "request",
            lambda request: requests.append(
                {
                    "method": request.method,
                    "url": request.url,
                    "resource_type": request.resource_type,
                }
            ),
        )
        async def capture_response(response: Any) -> None:
            content_type = response.headers.get("content-type")
            record = {
                "status": response.status,
                "url": response.url,
                "content_type": content_type,
            }
            responses.append(record)

            if not content_type or "google-analytics" in response.url:
                return
            if not any(kind in content_type for kind in ("json", "text/plain")):
                return

            try:
                body = await response.text()
            except Exception as exc:  # noqa: BLE001 - discovery should continue.
                response_bodies.append({**record, "body_error": str(exc)})
                return

            response_bodies.append({**record, "body_sample": body[:5000]})

        page.on("response", lambda response: asyncio.create_task(capture_response(response)))

        await page.goto(CPNU_URL, wait_until="domcontentloaded", timeout=45_000)

        if complete_search:
            await page.get_by_text("Todos los Procesos", exact=False).click()

        await page.get_by_placeholder("Ingrese los 23").fill(normalized)
        await page.get_by_role("button", name=re.compile("consultar", re.IGNORECASE)).click()
        await page.wait_for_timeout(wait_ms)
        await page.screenshot(path=screenshot_path, full_page=True)

        title = await page.title()
        final_url = page.url
        visible_text = await page.locator("body").inner_text(timeout=10_000)
        await browser.close()

    api_candidates = [
        response
        for response in responses
        if response.get("content_type")
        and any(kind in response["content_type"] for kind in ("json", "text/plain"))
        and "google-analytics" not in response["url"]
    ]

    return {
        "source_id": "rama_judicial_cpnu",
        "url": CPNU_URL,
        "radicado_masked": mask_radicado(normalized),
        "radicado_length": len(normalized),
        "complete_search": complete_search,
        "final_url": final_url,
        "title": title,
        "api_candidates": api_candidates[:50],
        "response_bodies": response_bodies[:20],
        "requests_sample": requests[:120],
        "responses_count": len(responses),
        "screenshot_path": str(screenshot_path),
        "visible_text_sample": visible_text[:1500],
    }


async def main_async() -> int:
    parser = argparse.ArgumentParser(description="Run a controlled CPNU search probe.")
    parser.add_argument("--radicado", required=True, help="Authorized test radicado.")
    parser.add_argument("--complete-search", action="store_true", help="Use complete search instead of last 30 days.")
    parser.add_argument("--wait-ms", type=int, default=7000, help="Wait after clicking search.")
    parser.add_argument("--write-report", action="store_true", help="Write JSON report under tmp/source-probes.")
    args = parser.parse_args()

    result = await run_probe(args.radicado, args.complete_search, args.wait_ms)
    print(json.dumps(result, indent=2, ensure_ascii=False))

    if args.write_report:
        report_path = REPORTS_DIR / f"cpnu-search-{int(time.time())}.json"
        report_path.write_text(json.dumps(result, indent=2, ensure_ascii=False), encoding="utf-8")
        print(f"\nReport written: {report_path}")

    return 0


def main() -> int:
    return asyncio.run(main_async())


if __name__ == "__main__":
    raise SystemExit(main())
