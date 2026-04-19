# CPNU - Contrato API Inicial

Fuente: Rama Judicial - Consulta de Procesos Nacional Unificada.

## Estado

Automatizable por HTTP directo para:

- Busqueda por numero de radicado.
- Detalle del proceso.
- Actuaciones del proceso.
- Sujetos del proceso.

No se detecto CAPTCHA para estas consultas durante las pruebas iniciales.

## Base URL

```text
https://consultaprocesos.ramajudicial.gov.co:448/api/v2
```

## 1. Buscar por Radicado

```http
GET /Procesos/Consulta/NumeroRadicacion?numero={radicado}&SoloActivos={true|false}&pagina={pagina}
```

Parametros:

- `numero`: radicado de 23 digitos.
- `SoloActivos`: `true` para procesos con actuaciones recientes; `false` para consulta completa.
- `pagina`: pagina de resultados.

Respuesta observada:

```json
{
  "tipoConsulta": "NumeroRadicacion",
  "procesos": [],
  "parametros": {},
  "paginacion": {
    "cantidadRegistros": 0,
    "registrosPagina": 20,
    "cantidadPaginas": 0,
    "pagina": 1,
    "paginas": null
  }
}
```

Campos observados en `procesos[]`:

- `idProceso`
- `llaveProceso`
- `fechaProceso`
- `fechaUltimaActuacion`
- `despacho`
- `departamento`
- `sujetosProcesales`
- `esPrivado`
- `idConexion`
- `cantFilas`

## 2. Detalle del Proceso

```http
GET /Proceso/Detalle/{idProceso}
```

Campos observados:

- `idRegProceso`
- `llaveProceso`
- `idConexion`
- `esPrivado`
- `fechaProceso`
- `codDespachoCompleto`
- `despacho`
- `ponente`
- `tipoProceso`
- `claseProceso`
- `subclaseProceso`
- `recurso`
- `ubicacion`
- `contenidoRadicacion`
- `fechaConsulta`
- `ultimaActualizacion`

## 3. Actuaciones

```http
GET /Proceso/Actuaciones/{idProceso}?pagina={pagina}
```

Respuesta observada:

```json
{
  "actuaciones": [],
  "paginacion": {
    "cantidadRegistros": 61,
    "registrosPagina": 40,
    "cantidadPaginas": 2,
    "pagina": 1,
    "paginas": null
  }
}
```

Campos observados en `actuaciones[]`:

- `idRegActuacion`
- `llaveProceso`
- `consActuacion`
- `fechaActuacion`
- `actuacion`
- `anotacion`
- `fechaInicial`
- `fechaFinal`
- `fechaRegistro`
- `codRegla`
- `conDocumentos`
- `cant`

Notas:

- `fechaInicial` y `fechaFinal` son especialmente relevantes para terminos.
- `actuacion` y `anotacion` deben alimentar el extractor de eventos.
- Hay paginacion de 40 registros por pagina.

## 4. Sujetos

```http
GET /Proceso/Sujetos/{idProceso}?pagina={pagina}
```

Respuesta observada:

- `sujetos[]`
- `paginacion`

## Resultado de Prueba con Radicados Autorizados

Con 16 radicados de prueba:

- Consulta directa con `SoloActivos=false`: 16/16 respuestas HTTP exitosas.
- 14/16 radicados devolvieron registros.
- 2/16 no devolvieron registros en CPNU.
- Un radicado devolvio 2 procesos asociados.

Con `SoloActivos=true`:

- La prueba de navegador encontro 0 registros recientes para los casos consultados.
- El portal recomienda probar con `Todos los procesos`.

## Implicacion para el MVP

CPNU debe ser el primer conector productivo.

Flujo recomendado:

1. Normalizar radicado.
2. Consultar `NumeroRadicacion` con `SoloActivos=false`.
3. Guardar snapshot crudo.
4. Por cada proceso encontrado, guardar `idProceso`, despacho y metadata.
5. Consultar `Detalle`.
6. Consultar todas las paginas de `Actuaciones`.
7. Convertir actuaciones en movimientos normalizados.
8. Extraer fechas relevantes desde `fechaInicial`, `fechaFinal`, `fechaActuacion`, `actuacion` y `anotacion`.

