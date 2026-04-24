# Investigacion Tecnica - Descubrimiento De Radicados Publicos

Fecha: 2026-04-24  
Estado: Exploracion documentada  
Objetivo: determinar si LexControl puede construir un dataset SIT de 100+ casos reales a partir de fuentes publicas, de forma estable y etica.

Documentos relacionados:

```text
docs/fuentes/auditoria-bloque3-cpnu.md
docs/fuentes/cpnu-api-contract.md
docs/producto/corte-v1-qa-operativo.md
```

---

## 1. Pregunta Recta

La pregunta no es si LexControl puede consultar procesos por radicado.

Eso ya esta resuelto.

La pregunta es esta:

```text
podemos descubrir radicados publicamente,
de forma estable y etica,
desde fuentes actuales o hermanas,
para construir un dataset SIT de 100+ casos reales?
```

La respuesta corta, hoy, es:

```text
si hay rutas publicas para discovery,
pero no todas sirven para poblamiento masivo estable
y ninguna debe tratarse como barra libre de scraping.
```

---

## 2. Hallazgo Principal

La fuente CPNU no esta limitada unicamente a busqueda por numero de radicado.

De acuerdo con fuentes oficiales de Rama Judicial:

- CPNU permite consulta por numero de radicado
- consulta por nombre o razon social
- ultimas actuaciones por nombre o razon social
- construir numero
- consulta por juez / magistrado y clase de proceso

Fuentes oficiales revisadas:

- [pregunta-cpnu](https://www.ramajudicial.gov.co/pregunta-cpnu)
- [preguntas frecuentes de ventanilla](https://www.ramajudicial.gov.co/web/ventanilla/preguntas-frecuentes/-/asset_publisher/MoImMTqZYAMb/content/%25C2%25BFc%25C3%25B3mo-puedo-consultar-un-proceso-judicial-en-el-portal-web-de-la-rama-judicial-)
- [servicio de consulta de procesos](https://www.ramajudicial.gov.co/web/consejo-superior-de-la-judicatura/ventanilla-de-servicios/-/asset_publisher/TIpGpe2ENeIh/content/consulta-de-proces-1)
- [manual de usuario CPNU](https://consultaprocesos.ramajudicial.gov.co/manual)

Esto significa que existe una base real para investigar discovery publico mas alla del radicado conocido.

---

## 3. Lo Que Si Existe

## 3.1 CPNU como fuente de discovery guiado

CPNU parece exponer, al menos a nivel de interfaz publica y documentacion oficial, modos de busqueda por:

- nombre o razon social
- juez o magistrado
- clase de proceso
- construir numero

Valor para dataset:

- alto para discovery curado
- medio para poblamiento por segmentos
- bajo para crawler masivo indiscriminado

Lectura:

```text
CPNU si puede servir para descubrir casos,
pero de forma guiada y controlada,
no como barrido infinito del universo judicial.
```

## 3.2 TYBA / Justicia XXI como fuente hermana

Tambien existe una consulta publica en:

- [Consulta de Procesos Judiciales - TYBA](https://procesojudicial.ramajudicial.gov.co/Justicia21/Administracion/Ciudadanos/frmConsulta.aspx)

La interfaz publica observada permite criterios como:

- proceso
- ciudadano
- predio
- corporacion
- especialidad
- despacho
- codigo de proceso
- identificacion
- nombre / apellidos
- razon social

Valor para dataset:

- alto como fuente hermana para discovery dirigido
- alto como validacion cruzada de hallazgos
- incierto como base automatizable estable sin discovery tecnico adicional

Lectura:

```text
TYBA puede ser una muy buena fuente hermana para discovery,
pero hoy no esta auditada a nivel de endpoint estable
como si lo esta CPNU para consulta por radicado.
```

## 3.3 Portales institucionales y novedades

Tambien existen superficies publicas como:

- [historico de novedades](https://portalhistorico.ramajudicial.gov.co/novedades)
- [inicio ciudadanos historico](https://portalhistorico.ramajudicial.gov.co/web/ciudadanos/inicio)

Estas superficies muestran piezas publicas con referencias de procesos, despachos y en algunos casos radicados visibles.

Valor para dataset:

- medio para curacion manual asistida
- bajo para automatizacion productiva

Lectura:

```text
sirven para descubrimiento humano y para pruebas puntuales,
pero no son una base limpia ni estable para poblamiento sistematico.
```

## 3.4 Estadisticas judiciales e inventario historico

Existen recursos oficiales como:

- [movimiento de procesos - Rama Judicial](https://www.ramajudicial.gov.co/web/estadisticas-judiciales/movimiento-de-procesos-historico)
- [pagina de MinJusticia sobre movimiento de procesos](https://www.minjusticia.gov.co/transparencia/Paginas/SEJ-Rama-Judicial-Consejo-Superior-de-la-Judicatura.aspx)

Valor para dataset:

- alto para sizing del mercado
- bajo para obtener radicados caso a caso

Lectura:

```text
sirven para entender volumen agregado,
no para poblar una cartera SIT por radicados individuales.
```

---

## 4. Lo Que No Esta Demostrado Todavia

Hoy no esta demostrado en el proyecto que exista:

- un endpoint oficial y estable de CPNU para buscar por nombre, juez o clase de proceso via HTTP directo
- una ruta automatizable y predecible en TYBA para discovery a escala
- una fuente publica estructurada que entregue listados de radicados abiertos listos para ingesta

En otras palabras:

```text
si sabemos que las modalidades publicas existen,
pero todavia no sabemos si las podemos automatizar
de forma robusta y responsable.
```

---

## 5. Lectura Etica

Este trabajo solo tiene sentido si se sostiene sobre una regla clara:

```text
no convertir discovery publico en scraping agresivo o invasivo
```

Principios minimos:

- usar solo criterios de consulta claramente ofrecidos a la ciudadania
- respetar el ritmo natural del servicio
- limitar concurrencia
- evitar barridos indiscriminados por nombres o datos personales a gran escala
- usar discovery para construir un dataset SIT acotado, no una base paralela de explotacion
- no recolectar mas informacion personal de la necesaria para identificar el proceso
- almacenar solo lo que sea util para la prueba operativa

Regla propuesta:

```text
el objetivo no es extraer el universo judicial;
es construir una muestra operativa, acotada y justificable.
```

---

## 6. Conclusiones Por Fuente

## 6.1 CPNU

### Conclusion

Viable como fuente principal de discovery guiado.

### Condicion

Solo si verificamos tecnicamente los modos de consulta distintos a numero de radicacion.

### Uso recomendado

- discovery por segmentos pequenos
- enriquecimiento posterior por radicado
- construccion de dataset SIT curado

## 6.2 TYBA / Justicia XXI

### Conclusion

Prometedora como fuente hermana.

### Condicion

Requiere discovery tecnico separado para saber si hay endpoints o patrones automatizables sin romper la estabilidad.

### Uso recomendado

- discovery complementario
- contraste de cobertura
- curacion semiasistida

## 6.3 Novedades / portales publicos

### Conclusion

Utiles solo como apoyo de curacion manual o semimanual.

### Uso recomendado

- obtener ejemplos
- validar despachos activos
- localizar algunas referencias publicas

## 6.4 Estadisticas agregadas

### Conclusion

No sirven para poblar radicados individuales.

### Uso recomendado

- sizing
- narrativa de mercado
- planeacion de volumen

---

## 7. Decision Tecnica Recomendada

No intentar de entrada un "scraper masivo de discovery".

La ruta recomendada es esta:

### Fase 1

Auditar tecnicamente discovery publico en CPNU para:

- nombre o razon social
- juez o magistrado
- clase de proceso

Objetivo:

```text
confirmar si existe endpoint o patron estable y paginable
```

### Fase 2

Auditar fuente hermana TYBA para saber:

- si hay endpoint
- si requiere navegador
- si soporta discovery acotado

### Fase 3

Definir una politica etica de adquisicion SIT:

- tamano objetivo
- fuentes permitidas
- criterios permitidos
- ritmo de consulta
- almacenamiento minimo

### Fase 4

Construir dataset curado:

- 100 a 150 casos reales
- mezcla de encontrados / no encontrados / con novedad / estables
- validacion posterior via conector CPNU productivo

---

## 8. Respuesta Ejecutiva

Si.

Es razonable pensar que LexControl puede construir un dataset SIT publico de 100+ casos reales.

Pero la ruta correcta no es:

```text
usar los probes actuales y salir a scrapear indiscriminadamente
```

La ruta correcta es:

```text
descubrir de forma guiada
validar estabilidad tecnica
limitar alcance
curar el dataset
enriquecer luego por radicado
```

Conclusion final:

```text
hoy esta demostrada la viabilidad de enriquecimiento por radicado;
esta abierta y es prometedora la viabilidad de discovery publico guiado;
no esta demostrada aun la viabilidad de discovery masivo automatizado y estable.
```

Ese es el siguiente tramo de investigacion tecnica si queremos construir el dataset SIT sin depender de un partner externo.
