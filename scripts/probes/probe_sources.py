#!/usr/bin/env python3
"""Probe public legal information sources without submitting case searches.

This script performs lightweight discovery requests against configured sources:
status code, final URL, content type, page title, form/script counts and signs
of CAPTCHA or JavaScript-heavy applications.

It does not bypass CAPTCHA, authenticate, or submit judicial searches.
"""

from __future__ import annotations

import argparse
import json
import re
import ssl
import sys
import time
from dataclasses import dataclass
from html.parser import HTMLParser
from pathlib import Path
from typing import Any
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen


ROOT = Path(__file__).resolve().parents[2]
SOURCES_FILE = ROOT / "scripts" / "probes" / "sources.json"
REPORTS_DIR = ROOT / "tmp" / "source-probes"

USER_AGENT = (
    "LegalSearchMVPProbe/0.1 "
    "(contact: technical-discovery; purpose: public-source-compatibility)"
)

CAPTCHA_HINTS = (
    "captcha",
    "recaptcha",
    "hcaptcha",
    "cf-challenge",
    "cloudflare",
    "turnstile",
)

JS_APP_HINTS = (
    "__next_data__",
    "webpack",
    "vite",
    "angular",
    "react",
    "vue",
    "app-root",
    "ng-version",
)


class ProbeHTMLParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.in_title = False
        self.title_parts: list[str] = []
        self.forms = 0
        self.inputs: list[dict[str, str]] = []
        self.scripts: list[str] = []
        self.links: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        attributes = {key.lower(): value or "" for key, value in attrs}

        if tag.lower() == "title":
            self.in_title = True
        elif tag.lower() == "form":
            self.forms += 1
        elif tag.lower() == "input":
            self.inputs.append(
                {
                    "name": attributes.get("name", ""),
                    "id": attributes.get("id", ""),
                    "type": attributes.get("type", ""),
                    "placeholder": attributes.get("placeholder", ""),
                }
            )
        elif tag.lower() == "script" and attributes.get("src"):
            self.scripts.append(attributes["src"])
        elif tag.lower() == "a" and attributes.get("href"):
            self.links.append(attributes["href"])

    def handle_endtag(self, tag: str) -> None:
        if tag.lower() == "title":
            self.in_title = False

    def handle_data(self, data: str) -> None:
        if self.in_title:
            self.title_parts.append(data.strip())

    @property
    def title(self) -> str:
        return " ".join(part for part in self.title_parts if part).strip()


@dataclass
class ProbeResult:
    source_id: str
    name: str
    start_url: str
    ok: bool
    status: int | None
    final_url: str | None
    content_type: str | None
    elapsed_ms: int
    title: str | None
    forms: int
    inputs: list[dict[str, str]]
    scripts_count: int
    scripts_sample: list[str]
    links_sample: list[str]
    captcha_detected: bool
    js_app_detected: bool
    recommended_strategy: str
    error: str | None = None


def load_sources() -> list[dict[str, Any]]:
    with SOURCES_FILE.open("r", encoding="utf-8") as file:
        return json.load(file)


def fetch(url: str, timeout: int) -> tuple[int, str, str | None, bytes]:
    request = Request(
        url,
        headers={
            "User-Agent": USER_AGENT,
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        },
    )
    context = ssl.create_default_context()

    with urlopen(request, timeout=timeout, context=context) as response:
        status = response.getcode()
        final_url = response.geturl()
        content_type = response.headers.get("content-type")
        body = response.read(1_500_000)

    return status, final_url, content_type, body


def classify_strategy(
    *,
    status: int | None,
    content_type: str | None,
    forms: int,
    captcha_detected: bool,
    js_app_detected: bool,
    expected_strategy: str,
) -> str:
    if status is None:
        return "blocked_or_unreachable"
    if status in (401, 403):
        return "blocked_or_requires_auth"
    if captcha_detected:
        return "manual_or_provider_required"
    if js_app_detected and forms == 0:
        return "playwright_discovery"
    if content_type and "json" in content_type:
        return "http_api_candidate"
    if forms > 0:
        return "form_post_discovery"
    return expected_strategy


def probe_source(source: dict[str, Any], timeout: int) -> ProbeResult:
    started_at = time.perf_counter()
    parser = ProbeHTMLParser()

    try:
        status, final_url, content_type, body = fetch(source["url"], timeout)
        elapsed_ms = int((time.perf_counter() - started_at) * 1000)
        text = body.decode("utf-8", errors="ignore")
        parser.feed(text)

        lowered = text[:1_500_000].lower()
        captcha_detected = any(hint in lowered for hint in CAPTCHA_HINTS)
        js_app_detected = any(hint in lowered for hint in JS_APP_HINTS)
        strategy = classify_strategy(
            status=status,
            content_type=content_type,
            forms=parser.forms,
            captcha_detected=captcha_detected,
            js_app_detected=js_app_detected,
            expected_strategy=source.get("expected_strategy", "unknown"),
        )

        return ProbeResult(
            source_id=source["id"],
            name=source["name"],
            start_url=source["url"],
            ok=True,
            status=status,
            final_url=final_url,
            content_type=content_type,
            elapsed_ms=elapsed_ms,
            title=parser.title or None,
            forms=parser.forms,
            inputs=parser.inputs[:20],
            scripts_count=len(parser.scripts),
            scripts_sample=parser.scripts[:10],
            links_sample=parser.links[:15],
            captcha_detected=captcha_detected,
            js_app_detected=js_app_detected,
            recommended_strategy=strategy,
        )
    except HTTPError as error:
        elapsed_ms = int((time.perf_counter() - started_at) * 1000)
        return ProbeResult(
            source_id=source["id"],
            name=source["name"],
            start_url=source["url"],
            ok=False,
            status=error.code,
            final_url=source["url"],
            content_type=error.headers.get("content-type"),
            elapsed_ms=elapsed_ms,
            title=None,
            forms=0,
            inputs=[],
            scripts_count=0,
            scripts_sample=[],
            links_sample=[],
            captcha_detected=False,
            js_app_detected=False,
            recommended_strategy=classify_strategy(
                status=error.code,
                content_type=error.headers.get("content-type"),
                forms=0,
                captcha_detected=False,
                js_app_detected=False,
                expected_strategy=source.get("expected_strategy", "unknown"),
            ),
            error=str(error),
        )
    except (TimeoutError, URLError, OSError) as error:
        elapsed_ms = int((time.perf_counter() - started_at) * 1000)
        return ProbeResult(
            source_id=source["id"],
            name=source["name"],
            start_url=source["url"],
            ok=False,
            status=None,
            final_url=None,
            content_type=None,
            elapsed_ms=elapsed_ms,
            title=None,
            forms=0,
            inputs=[],
            scripts_count=0,
            scripts_sample=[],
            links_sample=[],
            captcha_detected=False,
            js_app_detected=False,
            recommended_strategy="blocked_or_unreachable",
            error=str(error),
        )


def print_result(result: ProbeResult) -> None:
    status = result.status if result.status is not None else "n/a"
    print(f"\n[{result.source_id}] {result.name}")
    print(f"  status: {status} ok={result.ok} elapsed={result.elapsed_ms}ms")
    print(f"  final_url: {result.final_url}")
    print(f"  title: {result.title}")
    print(f"  forms={result.forms} scripts={result.scripts_count}")
    print(f"  captcha={result.captcha_detected} js_app={result.js_app_detected}")
    print(f"  recommended_strategy: {result.recommended_strategy}")
    if result.error:
        print(f"  error: {result.error}")


def slug(value: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", value.lower()).strip("-")


def main() -> int:
    parser = argparse.ArgumentParser(description="Probe configured legal sources.")
    parser.add_argument("--source", default="all", help="Source id or 'all'.")
    parser.add_argument("--timeout", type=int, default=20, help="Request timeout in seconds.")
    parser.add_argument("--write-report", action="store_true", help="Write JSON report under tmp/source-probes.")
    args = parser.parse_args()

    sources = load_sources()
    selected_sources = sources if args.source == "all" else [source for source in sources if source["id"] == args.source]

    if not selected_sources:
        known = ", ".join(source["id"] for source in sources)
        print(f"Unknown source '{args.source}'. Known sources: {known}", file=sys.stderr)
        return 2

    results = [probe_source(source, args.timeout) for source in selected_sources]

    for result in results:
        print_result(result)

    if args.write_report:
        REPORTS_DIR.mkdir(parents=True, exist_ok=True)
        filename = f"probe-{int(time.time())}-{slug(args.source)}.json"
        report_path = REPORTS_DIR / filename
        report_path.write_text(
            json.dumps([result.__dict__ for result in results], indent=2, ensure_ascii=False),
            encoding="utf-8",
        )
        print(f"\nReport written: {report_path}")

    return 0 if all(result.ok for result in results) else 1


if __name__ == "__main__":
    raise SystemExit(main())
