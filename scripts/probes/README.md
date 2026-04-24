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

Consulta controlada por lote:

```bash
.venv/bin/python scripts/probes/cpnu_batch_probe.py --file tmp/radicados-cpnu.txt --write-report
```

Consulta directa del API de CPNU:

```bash
python3 scripts/probes/cpnu_api_probe.py --file tmp/radicados-cpnu.txt --write-report
```

Por defecto consulta todos los procesos (`SoloActivos=false`). Para replicar la opcion de procesos activos/recientes:

```bash
python3 scripts/probes/cpnu_api_probe.py --file tmp/radicados-cpnu.txt --solo-activos --write-report
```

Discovery tecnico por nombre o razon social en CPNU:

```bash
python3 scripts/probes/cpnu_discovery_name_probe.py \
  --query "NOMBRE PUBLICO DE PRUEBA" \
  --person-type Natural \
  --all-processes \
  --write-report
```

Discovery tecnico por juez / magistrado y clase de proceso en CPNU:

```bash
python3 scripts/probes/cpnu_discovery_judge_probe.py \
  --judge "NOMBRE PUBLICO DE PRUEBA" \
  --process-class "CLASE DE PROCESO" \
  --all-processes \
  --write-report
```

UI local para consulta:

```bash
python3 scripts/probes/cpnu_local_ui.py
```

Luego abre:

```text
http://127.0.0.1:8765/
```

Consulta publica SAMAI por radicado:

```bash
python3 scripts/probes/samai_api_probe.py --radicado 11001333603820250000100
```

## Reglas

- No hace bypass de CAPTCHA.
- No autentica usuarios.
- No consulta radicados reales todavia.
- No descarga documentos.
- No se debe usar para barridos masivos de discovery.
- Solo hace discovery tecnico acotado.

El siguiente paso, despues de clasificar una fuente, es crear un conector especifico con fixtures y pruebas reproducibles.
