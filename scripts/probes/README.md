# Source Probes

Laboratorio de pruebas para entender como se comportan las fuentes publicas antes de implementar conectores productivos.

## Objetivo

Clasificar cada fuente en una de estas estrategias:

- `http_api_candidate`: posible consulta por endpoint HTTP/API.
- `form_post_discovery`: formulario tradicional; requiere inspeccionar parametros.
- `playwright_discovery`: aplicacion JS; conviene usar navegador automatizado para descubrir red/API.
- `manual_or_provider_required`: CAPTCHA o bloqueo; no se debe intentar evadir.
- `blocked_or_requires_auth`: requiere autenticacion o bloquea la solicitud.
- `blocked_or_unreachable`: no responde desde el entorno actual.

## Uso

```bash
python3 scripts/probes/probe_sources.py --source all --write-report
```

Probar una sola fuente:

```bash
python3 scripts/probes/probe_sources.py --source rama_judicial_cpnu --write-report
```

Discovery con navegador:

```bash
python3 -m pip install playwright
python3 -m playwright install chromium
python3 scripts/probes/browser_probe.py --source rama_judicial_cpnu --write-report
```

Consulta controlada de CPNU con un radicado autorizado:

```bash
.venv/bin/python scripts/probes/cpnu_search_probe.py --radicado "11001310300120230004500" --write-report
```

## Reglas

- No hace bypass de CAPTCHA.
- No autentica usuarios.
- No consulta radicados reales todavia.
- No descarga documentos.
- Solo hace una solicitud inicial por fuente.

El siguiente paso, despues de clasificar una fuente, es crear un conector especifico con fixtures y pruebas reproducibles.
