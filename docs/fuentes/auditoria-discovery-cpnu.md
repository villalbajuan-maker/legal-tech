# Auditoria Tecnica - Discovery En CPNU

Fecha: 2026-04-24  
Estado: Auditoria de factibilidad  
Objetivo: determinar si CPNU permite discovery publico de radicados de forma estable, guiada y etica.

Documentos relacionados:

```text
docs/fuentes/auditoria-bloque3-cpnu.md
docs/fuentes/investigacion-descubrimiento-radicados-publicos.md
docs/fuentes/cpnu-api-contract.md
```

---

## 1. Decision Ejecutiva

La auditoria permite afirmar esto:

```text
CPNU si expone discovery publico guiado a nivel de producto,
pero no esta demostrado aun en el proyecto
que ese discovery tenga un contrato tecnico estable por HTTP directo.
```

Conclusion operativa:

- **si** vale la pena seguir la linea de discovery en CPNU
- **no** vale la pena asumir todavia que ya tenemos una ruta automatizable masiva
- el siguiente paso correcto es un probe tecnico especifico para discovery por:
  - nombre o razon social
  - juez / magistrado y clase de proceso

---

## 2. Evidencia Primaria Revisada

### 2.1 Manual oficial de usuario CPNU

Fuente:

- [Manual CPNU](https://consultaprocesos.ramajudicial.gov.co/manual/)

Hallazgo:

El manual lista cinco tipos de consulta en pantalla inicial:

- por numero de radicacion
- por nombre o razon social
- construir numero
- por juez, magistrado y clase de proceso
- juzgados de ejecucion de penas y medidas de seguridad

Tambien documenta:

- el filtro de "Todos los Procesos" frente a "ultimos 30 dias"
- el uso de formularios con listas desplegables
- la posibilidad de descargar resultados en `CSV` o `DOC`
- el escenario de "demasiados resultados", que obliga a agregar filtros y menciona especificamente el filtro `Despacho`

Lectura:

```text
CPNU no es solo una consulta por radicado conocido.
Su producto publico ya contempla discovery guiado.
```

### 2.2 Pregunta oficial CPNU

Fuente:

- [pregunta cpnu](https://www.ramajudicial.gov.co/pregunta-cpnu)

Hallazgo:

La propia Rama Judicial afirma que la CPNU permite:

- búsqueda por número de radicado
- nombre o razón social
- últimas actuaciones por nombre o razón social
- construir número
- consulta por juez, magistrado y clase de proceso

Lectura:

```text
la existencia del discovery publico no es inferencia;
esta declarada oficialmente por la fuente
```

### 2.3 Preguntas frecuentes de ventanilla

Fuente:

- [¿Cómo puedo consultar un proceso judicial...?](https://www.ramajudicial.gov.co/web/ventanilla/preguntas-frecuentes/-/asset_publisher/MoImMTqZYAMb/content/%25C2%25BFc%25C3%25B3mo-puedo-consultar-un-proceso-judicial-en-el-portal-web-de-la-rama-judicial-)

Hallazgo:

Reitera los mismos criterios de consulta y el link directo a:

- [CPNU / Procesos / Index](https://consultaprocesos.ramajudicial.gov.co/Procesos/Index)
- [Consulta por numero de radicacion](https://consultaprocesos.ramajudicial.gov.co/Procesos/NumeroRadicacion)

Lectura:

```text
hay coherencia institucional en que estos modos de consulta
estan abiertos a la ciudadania general
```

---

## 3. Lo Que Ya Tenemos En El Proyecto

Hoy nuestros probes cubren bien la consulta por radicado:

- [cpnu_api_probe.py](/Users/juanvillalba/Documents/legal-tech/scripts/probes/cpnu_api_probe.py)
- [cpnu_search_probe.py](/Users/juanvillalba/Documents/legal-tech/scripts/probes/cpnu_search_probe.py)
- [cpnu_batch_probe.py](/Users/juanvillalba/Documents/legal-tech/scripts/probes/cpnu_batch_probe.py)

Pero todos comparten una limitacion:

```text
estan pensados para partir de un radicado conocido
```

Lo que no tenemos todavia:

- probe de discovery por nombre o razon social
- probe de discovery por juez / magistrado / clase
- auditoria de red que confirme si esas consultas llaman endpoints JSON publicos equivalentes al de radicado
- manejo tecnico del escenario "demasiados resultados"
- estrategia de filtros minimos eticos para no producir barridos indiscriminados

Conclusion:

```text
la capacidad productiva de consulta por radicado esta resuelta;
la capacidad tecnica de discovery publico aun no.
```

---

## 4. Hipotesis Tecnica

La hipotesis mas razonable hoy es esta:

```text
los modos de discovery de CPNU probablemente existen
como formularios front-end respaldados por consultas HTTP o XHR,
pero todavia no sabemos si:

1. usan endpoints JSON directos y estables
2. requieren tokens o payloads opacos
3. imponen limites que vuelvan inviable la automatizacion
```

Esto es importante porque hay tres escenarios posibles:

### Escenario A

Discovery usa endpoints JSON claros, paginables y estables.

Valor:

- alto
- permite construir un dataset curado de 100+ casos con una estrategia controlada

### Escenario B

Discovery existe, pero con una capa web compleja o poco estable.

Valor:

- medio
- serviria solo para discovery semiasistido

### Escenario C

Discovery existe en UI, pero sin un contrato tecnico reutilizable o con controles que lo vuelven frágil.

Valor:

- bajo para automatizacion
- util solo para curacion manual

---

## 5. Riesgos Detectados

## 5.1 Riesgo de demasiados resultados

El manual oficial ya advierte que:

- algunas consultas pueden arrojar demasiados resultados
- en esos casos se deben usar filtros adicionales
- el filtro `Despacho` es clave cuando hay mas de mil resultados

Implicacion:

```text
no debemos plantear un discovery abierto por nombres comunes
sin filtro adicional
```

## 5.2 Riesgo etico

Aunque la fuente sea publica, discovery por:

- personas naturales
- razones sociales
- despachos

puede volverse invasivo si se trata como barrido masivo de exploracion.

Implicacion:

```text
el uso correcto es construir una muestra SIT acotada,
no montar una captura indiscriminada de datos personales
```

## 5.3 Riesgo tecnico

La ruta `/Procesos/NumeroRadicacion` devuelve "no funciona sin JavaScript" en HTML inicial.

Eso no rompe la busqueda por API ya auditada, pero sugiere que:

- la capa de UI puede depender de JS para orquestar consultas
- y discovery probablemente requerira inspeccion de requests reales

---

## 6. Conclusion Por Tipo De Discovery

## 6.1 Discovery por Nombre o Razon Social

### Estado

Confirmado a nivel de producto.

### No confirmado

Contrato tecnico directo.

### Juicio

```text
prometedor pero no auditado tecnicamente
```

### Prioridad

Alta.

Es la via mas obvia para construir dataset SIT si soporta filtros razonables.

## 6.2 Discovery por Juez / Magistrado y Clase de Proceso

### Estado

Confirmado a nivel de producto.

### No confirmado

Endpoint o patron de request.

### Juicio

```text
quizas la via mas etica y operativamente controlable
```

Razon:

Permite discovery por:

- actor institucional
- tipo de proceso
- posible reduccion de volumen

sin depender de nombres de personas.

## 6.3 Construir Numero

### Estado

Confirmado a nivel de producto.

### Juicio

No es discovery real.

Sirve para:

- ayudar a formular radicados plausibles
- explorar variantes conocidas

No sirve como fuente primaria para generar un dataset amplio desde cero.

---

## 7. Decision Tecnica Recomendada

El siguiente experimento correcto no es seguir con `cpnu_api_probe.py`.

Ese ya cumplio su trabajo para radicado conocido.

El siguiente experimento correcto es crear dos probes nuevos:

### Probe 1

`cpnu_discovery_name_probe.py`

Objetivo:

- abrir el modo de consulta por nombre o razon social
- capturar requests y responses
- identificar endpoint, parametros, paginacion y limites

### Probe 2

`cpnu_discovery_judge_probe.py`

Objetivo:

- abrir el modo de consulta por juez / magistrado y clase de proceso
- capturar requests y responses
- identificar endpoint, parametros, paginacion y limites

Ambos deben:

- correr con Playwright solo para discovery
- no descargar mas resultados de los necesarios
- documentar:
  - endpoint
  - metodo
  - query/body
  - paginacion
  - filtros obligatorios
  - limites de resultado
  - si existe descarga CSV

---

## 8. Veredicto Final

```text
si vale la pena auditar discovery en CPNU.
```

Pero el veredicto hoy no es:

```text
CPNU ya esta aprobado como fuente automatizable de discovery masivo
```

El veredicto real es:

```text
CPNU ya esta aprobado como fuente publica de discovery guiado a nivel de producto,
y tiene suficiente evidencia oficial para justificar una auditoria tecnica especifica.
```

Eso es bastante bueno, porque reduce el riesgo de estar persiguiendo una ruta inventada.

La ruta existe.

Lo que falta es probar:

```text
si esa ruta tiene contrato tecnico reutilizable
y si puede usarse de forma controlada para construir un dataset SIT publico.
```
