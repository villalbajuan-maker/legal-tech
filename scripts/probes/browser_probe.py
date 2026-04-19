#!/usr/bin/env python3
"""Browser-based discovery for public legal sources.

Requires:
  python3 -m pip install playwright
  python3 -m playwright install chromium

This script opens a source with Chromium, records network requests, and writes
a JSON report plus screenshot. It does not solve CAPTCHA or submit searches.
"""

from __future__ import annotations

import argparse
import asyncio
import json
import re
import sys
import time
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[2]
SOURCES_FILE = ROOT / "scripts" / "probes" / "sources.json"
REPORTS_DIR = ROOT / "tmp" / "source-probes"


def load_sources() -> list[dict[str, Any]]:
    with SOURCES_FILE.open("r", encoding="utf-8") as file:
        return json.load(file)


def slug(value: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", value.lower()).strip("-")


async def probe_source(source: dict[str, Any], wait_ms: int) -> dict[str, Any]:
    try:
        from playwright.async_api import async_playwright
    except ImportError:
        print(
            "Missing dependency: playwright. Install with "
            "`python3 -m pip install playwright && python3 -m playwright install chromium`.",
            file=sys.stderr,
        )
        raise

    REPORTS_DIR.mkdir(parents=True, exist_ok=True)
    timestamp = int(time.time())
    screenshot_path = REPORTS_DIR / f"browser-{timestamp}-{slug(source['id'])}.png"

    requests: list[dict[str, Any]] = []
    responses: list[dict[str, Any]] = []

    async with async_playwright() as playwright:
      browser = await playwright.chromium.launch(headless=True)
      page = await browser.new_page(
          viewport={"width": 1440, "height": 1000},
          user_agent=(
              "LegalSearchMVPBrowserProbe/0.1 "
              "(technical-discovery; public-source-compatibility)"
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
      page.on(
          "response",
          lambda response: responses.append(
              {
                  "status": response.status,
                  "url": response.url,
                  "content_type": response.headers.get("content-type"),
              }
          ),
      )

      error = None
      try:
          await page.goto(source["url"], wait_until="domcontentloaded", timeout=45_000)
          await page.wait_for_timeout(wait_ms)
      except Exception as exc:  # noqa: BLE001 - report discovery errors as data.
          error = str(exc)

      title = await page.title()
      url = page.url
      content = await page.content()
      await page.screenshot(path=screenshot_path, full_page=True)
      await browser.close()

    lowered = content.lower()
    api_candidates = [
        response
        for response in responses
        if response.get("content_type")
        and any(kind in response["content_type"] for kind in ("json", "text/plain"))
    ]

    return {
        "source_id": source["id"],
        "name": source["name"],
        "start_url": source["url"],
        "final_url": url,
        "title": title,
        "requests_count": len(requests),
        "responses_count": len(responses),
        "api_candidates": api_candidates[:50],
        "requests_sample": requests[:80],
        "captcha_detected": "captcha" in lowered or "recaptcha" in lowered,
        "screenshot_path": str(screenshot_path),
        "error": error,
    }


async def main_async() -> int:
    parser = argparse.ArgumentParser(description="Browser probe a configured legal source.")
    parser.add_argument("--source", required=True, help="Source id.")
    parser.add_argument("--wait-ms", type=int, default=5000, help="Extra wait after DOM load.")
    parser.add_argument("--write-report", action="store_true", help="Write JSON report under tmp/source-probes.")
    args = parser.parse_args()

    sources = load_sources()
    selected = next((source for source in sources if source["id"] == args.source), None)

    if not selected:
        known = ", ".join(source["id"] for source in sources)
        print(f"Unknown source '{args.source}'. Known sources: {known}", file=sys.stderr)
        return 2

    result = await probe_source(selected, args.wait_ms)
    print(json.dumps(result, indent=2, ensure_ascii=False))

    if args.write_report:
        REPORTS_DIR.mkdir(parents=True, exist_ok=True)
        report_path = REPORTS_DIR / f"browser-{int(time.time())}-{slug(args.source)}.json"
        report_path.write_text(json.dumps(result, indent=2, ensure_ascii=False), encoding="utf-8")
        print(f"\nReport written: {report_path}")

    return 0 if not result.get("error") else 1


def main() -> int:
    return asyncio.run(main_async())


if __name__ == "__main__":
    raise SystemExit(main())
