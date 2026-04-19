# SAMAI - Discovery Inicial

Fuente: SAMAI - Consejo de Estado / Jurisdiccion Contencioso Administrativa.

## Estado

La busqueda publica por radicado es viable por endpoint JSON, pero el detalle del proceso muestra un control manual tipo "No soy un robot".

Esto separa SAMAI en dos niveles:

- Busqueda/listado: automatizable.
- Detalle completo del proceso: requiere validacion adicional por reto manual.

## Endpoint de Busqueda

```http
POST https://samai.consejodeestado.gov.co/Vistas/Casos/Jprocesos.ashx/listaprocesosdata
```

Headers relevantes:

```text
content-type: application/json; charset=utf-8
accept: application/json, text/javascript, */*; q=0.01
origin: https://samai.consejodeestado.gov.co
referer: https://samai.consejodeestado.gov.co/Vistas/Casos/procesos.aspx
x-requested-with: XMLHttpRequest
```

Payload observado:

```json
{
  "FW_tipobusqueda": "FW_Rbtradicado",
  "FW_ppexacta": "",
  "FW_tipoarea": "FW_RbtCorporacion",
  "FW_Txtcriterios": "11001333603820250000100",
  "FW_LstCorporacion": "1100133",
  "FW_LstSeccion": "",
  "FW_LstPonente": "",
  "FW_FechaI": "",
  "FW_FechaF": "",
  "FW_LstcriterioV": "",
  "FW_LstcriterioP": ""
}
```

`FW_LstCorporacion` es importante. Para el radicado probado, funciono:

```text
1100133 = Juzgado Administrativo de Bogota
```

Sin corporacion, la respuesta fue vacia.

## Resultado con Radicado de Prueba

Radicado probado:

```text
11001333603820250000100
```

Resultado:

- 1 registro encontrado.
- Corporacion: `1100133`.
- Tipo observado en detalles: accion de reparacion directa.
- Ponente/despacho observado: Juzgado 38 Administrativo Seccion Tercera Oral Bogota.

## Detalle del Proceso

La accion `Ver` construye una URL de detalle asi:

```text
https://samai.consejodeestado.gov.co/Vistas/Casos/list_procesos.aspx?guid={radicado}{corporacion}
```

Ejemplo:

```text
https://samai.consejodeestado.gov.co/Vistas/Casos/list_procesos.aspx?guid=110013336038202500001001100133
```

Al abrir esta URL, SAMAI muestra un control:

```text
No soy un robot - Ingrese sin espacios, este dato para ver el proceso: ...
```

Decision:

- No se debe intentar bypass.
- Para el MVP, SAMAI puede usarse inicialmente para confirmar existencia/listado por radicado.
- El detalle completo debe tratarse como flujo manual asistido o investigarse con aprobacion explicita si existe mecanismo permitido.

## Probe

```bash
python3 scripts/probes/samai_api_probe.py --radicado 11001333603820250000100
```

