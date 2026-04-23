# Auditoria Bloque 3 - CPNU

Fecha: 2026-04-23

## Decision

El conector productivo de CPNU debe construirse sobre HTTP directo a la API v2.

No debe construirse sobre Playwright como estrategia principal del MVP.

---

## Scripts auditados

### `scripts/probes/cpnu_api_probe.py`

Estado:

- Reutilizable como descubrimiento tecnico.
- Confirmo el endpoint correcto de busqueda por radicado.
- Confirmo que `SoloActivos=false` devuelve resultados utiles para el MVP.

Valor para producto:

- Muy alto.
- Fue la base real del conector productivo.

### `scripts/probes/cpnu_search_probe.py`

Estado:

- Util para discovery de navegador.
- No es la base correcta del conector MVP.

Razon:

- Introduce complejidad innecesaria.
- La fuente ya expone endpoints JSON directos para el flujo principal.

Valor para producto:

- Medio.
- Se conserva como herramienta de debugging o contingencia.

### `scripts/probes/cpnu_batch_probe.py`

Estado:

- Util para pruebas controladas por lote.
- No debe convertirse tal cual en worker productivo.

Razon:

- Es un runner de discovery, no un pipeline de persistencia.

Valor para producto:

- Medio.
- Sirve como referencia de ritmo y batch controlado.

### `scripts/probes/probe_sources.py`

Estado:

- Util solo como discovery general de fuentes.

Valor para producto:

- Bajo para CPNU operativo.
- Alto para planeacion multifuente.

---

## Contrato Tecnico Confirmado

Fuente:

```text
https://consultaprocesos.ramajudicial.gov.co:448/api/v2
```

Endpoints confirmados para el MVP:

- `GET /Procesos/Consulta/NumeroRadicacion`
- `GET /Proceso/Detalle/{idProceso}`
- `GET /Proceso/Actuaciones/{idProceso}?pagina={pagina}`
- `GET /Proceso/Sujetos/{idProceso}?pagina={pagina}`

---

## Ruta Productiva Decidida

### El conector debe hacer

1. Consultar por radicado en `NumeroRadicacion`.
2. Clasificar:
   - `success`
   - `not_found`
   - `error`
   - `blocked`
3. Si encuentra procesos:
   - consultar detalle
   - consultar actuaciones paginadas
   - consultar sujetos paginados
4. Devolver payload crudo + metadata + movimientos normalizados.

### El worker debe hacer

1. Leer `case_sources` pendientes o activos.
2. Resolver el conector correcto.
3. Guardar `source_snapshots`.
4. Actualizar `case_sources.last_checked_at`, `last_success_at`, `last_error_at` y `status`.

---

## Lo que queda fuera de esta decision

- deteccion de cambios finos
- generacion de `case_movements` persistidos
- extraccion de `legal_events`
- scheduling recurrente sofisticado

Eso pertenece a los bloques siguientes.

---

## Resultado

La auditoria confirma que CPNU ya no esta en fase de exploracion.

Queda aprobado como:

```text
primer conector productivo del MVP
```
