#!/usr/bin/env python3
"""Shared helpers for CPNU discovery probes.

These probes are for technical discovery only. They do not solve CAPTCHA,
download documents, or attempt bulk extraction. Their only job is to reveal
whether the public discovery flows are backed by stable network contracts.
"""

from __future__ import annotations

import asyncio
import json
import re
import sys
import time
from pathlib import Path
from typing import Any, Callable


ROOT = Path(__file__).resolve().parents[2]
REPORTS_DIR = ROOT / "tmp" / "source-probes"
CPNU_INDEX_URL = "https://consultaprocesos.ramajudicial.gov.co/Procesos/Index"


def slug(value: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", value.lower()).strip("-")


def mask_text(value: str) -> str:
    cleaned = " ".join(value.split())
    if not cleaned:
        return ""
    parts = []
    for token in cleaned.split(" "):
        if len(token) <= 2:
            parts.append("*" * len(token))
        else:
            parts.append(token[0] + ("*" * (len(token) - 2)) + token[-1])
    return " ".join(parts)


async def _click_first(page: Any, selectors: list[str]) -> bool:
    for selector in selectors:
        locator = page.locator(selector)
        if await locator.count():
            try:
                await locator.first.click()
                return True
            except Exception:
                continue
    return False


async def _fill_first(page: Any, selectors: list[str], value: str) -> bool:
    for selector in selectors:
        locator = page.locator(selector)
        if await locator.count():
            try:
                await locator.first.fill(value)
                return True
            except Exception:
                continue
    return False


async def _select_option_first(page: Any, selectors: list[str], label: str) -> bool:
    for selector in selectors:
        locator = page.locator(selector)
        if await locator.count():
            try:
                await locator.first.select_option(label=label)
                return True
            except Exception:
                try:
                    await locator.first.select_option(value=label)
                    return True
                except Exception:
                    continue
    return False


async def _capture_response_body(response: Any, response_bodies: list[dict[str, Any]]) -> None:
    content_type = response.headers.get("content-type")
    record = {
        "status": response.status,
        "url": response.url,
        "content_type": content_type,
    }

    if not content_type or "google-analytics" in response.url:
        return
    if not any(kind in content_type for kind in ("json", "text/plain")):
        return

    try:
        body = await response.text()
    except Exception as exc:  # noqa: BLE001
        response_bodies.append({**record, "body_error": str(exc)})
        return

    response_bodies.append({**record, "body_sample": body[:5000]})


async def run_cpnu_discovery_probe(
    *,
    probe_id: str,
    query_descriptor: dict[str, Any],
    interaction: Callable[[Any], "asyncio.Future[Any]"],
    wait_ms: int,
) -> dict[str, Any]:
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
    screenshot_path = REPORTS_DIR / f"{probe_id}-{timestamp}.png"

    requests: list[dict[str, Any]] = []
    responses: list[dict[str, Any]] = []
    response_bodies: list[dict[str, Any]] = []
    notes: list[str] = []

    async with async_playwright() as playwright:
        browser = await playwright.chromium.launch(headless=True)
        page = await browser.new_page(
            viewport={"width": 1440, "height": 1000},
            user_agent=(
                "LegalSearchMVPDiscoveryProbe/0.1 "
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
            lambda response: (
                responses.append(
                    {
                        "status": response.status,
                        "url": response.url,
                        "content_type": response.headers.get("content-type"),
                    }
                ),
                asyncio.create_task(_capture_response_body(response, response_bodies)),
            ),
        )

        error = None
        try:
            await page.goto(CPNU_INDEX_URL, wait_until="domcontentloaded", timeout=45_000)
            interaction_notes = await interaction(page)
            if interaction_notes:
                notes.extend(str(note) for note in interaction_notes)
            await page.wait_for_timeout(wait_ms)
        except Exception as exc:  # noqa: BLE001
            error = str(exc)
            notes.append("interaction_failed")

        title = await page.title()
        final_url = page.url
        visible_text = await page.locator("body").inner_text(timeout=10_000)
        csv_visible = "Descargar CSV" in visible_text
        doc_visible = "Descargar DOC" in visible_text
        too_many_results = "demasiados resultados" in visible_text.lower()
        await page.screenshot(path=screenshot_path, full_page=True)
        await browser.close()

    api_candidates = [
        response
        for response in responses
        if response.get("content_type")
        and any(kind in response["content_type"] for kind in ("json", "text/plain"))
        and "google-analytics" not in response["url"]
    ]

    return {
        "probe_id": probe_id,
        "source_id": "rama_judicial_cpnu",
        "start_url": CPNU_INDEX_URL,
        "final_url": final_url,
        "title": title,
        "query_descriptor": query_descriptor,
        "requests_count": len(requests),
        "responses_count": len(responses),
        "api_candidates": api_candidates[:80],
        "response_bodies": response_bodies[:30],
        "requests_sample": requests[:150],
        "csv_visible": csv_visible,
        "doc_visible": doc_visible,
        "too_many_results_visible": too_many_results,
        "visible_text_sample": visible_text[:2500],
        "notes": notes,
        "screenshot_path": str(screenshot_path),
        "error": error,
    }


async def activate_all_processes_filter(page: Any) -> bool:
    return await _click_first(
        page,
        [
            "text=Todos los Procesos",
            "label:has-text('Todos los Procesos')",
        ],
    )


async def choose_person_type(page: Any, person_type_label: str) -> bool:
    trigger_selectors = [
        "label:has-text('Tipo de Persona')",
        "label:has-text('Tipo Persona')",
        "#input-117",
        "input[readonly][id^='input-']",
    ]

    if not await _click_first(page, trigger_selectors):
        return False

    option_selectors = [
        f"div[role='option']:has-text('{person_type_label}')",
        f".v-list-item:has-text('{person_type_label}')",
        f"text={person_type_label}",
    ]

    return await _click_first(page, option_selectors)


async def fill_name_query(page: Any, query: str) -> bool:
    return await _fill_first(
        page,
        [
            "#input-123",
            "label:has-text('Nombre o Razón Social') input",
            "label:has-text('Nombre o Razon Social') input",
            "input[placeholder*='Nombre']",
            "input[type='text']",
        ],
        query,
    )


async def fill_judge_query(page: Any, judge: str) -> bool:
    return await _fill_first(
        page,
        [
            "label:has-text('Juez') input",
            "label:has-text('Magistrado') input",
            "input[placeholder*='Juez']",
            "input[placeholder*='Magistrado']",
            "input[type='text']",
        ],
        judge,
    )


async def choose_process_class(page: Any, process_class: str) -> bool:
    return await _select_option_first(
        page,
        [
            "label:has-text('Clase de Proceso') select",
            "select:near(:text('Clase de Proceso'))",
            "select",
        ],
        process_class,
    )


async def choose_office(page: Any, office: str) -> bool:
    return await _select_option_first(
        page,
        [
            "label:has-text('Despacho') select",
            "select:near(:text('Despacho'))",
            "select",
        ],
        office,
    )


async def click_consult(page: Any) -> bool:
    return await _click_first(
        page,
        [
            "button:has-text('Consultar')",
            "input[type='submit'][value='Consultar']",
            "text=Consultar",
        ],
    )


def write_report(result: dict[str, Any], report_prefix: str) -> Path:
    REPORTS_DIR.mkdir(parents=True, exist_ok=True)
    report_path = REPORTS_DIR / f"{report_prefix}-{int(time.time())}.json"
    report_path.write_text(json.dumps(result, indent=2, ensure_ascii=False), encoding="utf-8")
    return report_path
