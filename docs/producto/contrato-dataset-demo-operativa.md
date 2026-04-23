# Contrato Del Dataset Demo Operativa

Producto: LexControl  
Instrumento: Bandeja demo + Lex  
Version: v1.0  
Estado: Congelado para implementacion

---

## 1. Proposito

El dataset de la demo no puede sentirse como una maqueta.

Debe sentirse como una muestra operativa real de vigilancia judicial:

- procesos variados;
- fuentes distintas;
- actuaciones juridicamente plausibles;
- estados operativos coherentes;
- responsables reales de una firma;
- prioridades razonables;
- fechas vivas;
- eventos proximos que no envejezcan.

El objetivo no es inventar una tabla bonita.

El objetivo es que un abogado mire la demo y piense:

```text
Esto se parece a mi operacion.
```

---

## 2. Principio De Realismo

La demo debe mostrar verosimilitud operativa, no fantasia.

Cada proceso debe parecer parte de una operacion judicial real, pero sin exponer informacion sensible ni representar como real un expediente especifico que no haya sido autorizado.

Regla:

```text
Sintetico, pero juridicamente plausible.
```

Permitido:

- Radicados con estructura colombiana plausible.
- Actuaciones frecuentes en procesos reales.
- Anotaciones redactadas con lenguaje judicial-operativo.
- Fuentes publicas o consultables como categorias de demostracion.
- Estados derivados de la vigilancia, no del fondo juridico.

No permitido:

- Nombres de partes reales.
- Pretender que el demo consulta en vivo si no lo esta haciendo.
- Actuaciones absurdas o genericas tipo "documento nuevo" sin contexto.
- Fechas absolutas que se vencen y vuelven vieja la demo.
- Distribuciones artificialmente perfectas.

---

## 3. Tamano Del Dataset

La muestra base debe conservar alrededor de:

```text
79 procesos
```

Razon:

- Es suficiente para mostrar volumen real.
- Permite filtros utiles.
- Permite que Lex responda preguntas analiticas.
- No sobrecarga la landing.

La demo no debe mostrar todos los procesos al mismo tiempo en mobile sin jerarquia.
Debe permitir navegar por estados, responsables y fechas.

---

## 4. Estados Operativos

Estados congelados:

- Con novedad.
- Sin cambios.
- No consultado.
- Error de fuente.
- Requiere revision.

Distribucion recomendada para demo de 79 procesos:

| Estado | Cantidad sugerida | Intencion |
| --- | ---: | --- |
| Sin cambios | 46 - 52 | Muestra estabilidad real. |
| Con novedad | 16 - 22 | Muestra senal suficiente para vender valor. |
| Requiere revision | 6 - 10 | Muestra priorizacion humana. |
| No consultado | 1 - 2 | Muestra trazabilidad de omisiones. |
| Error de fuente | 1 - 2 | Muestra realidad de fuentes externas. |

Regla:

```text
Los fallos deben existir, pero no dominar la demo.
```

Si aparecen demasiados errores o no consultados, la demo comunica fragilidad.
Si no aparece ninguno, la demo comunica fantasia.

---

## 5. Tipos De Actuacion

Taxonomia congelada:

- Auto.
- Traslado.
- Audiencia.
- Sentencia / fallo.
- Medida cautelar.
- Terminacion / archivo.
- Impulso procesal.
- Actuacion administrativa.
- Documento / memorial.
- Sin clasificar.

Distribucion sugerida:

| Tipo | Peso esperado |
| --- | ---: |
| Auto | Alto |
| Actuacion administrativa | Alto |
| Documento / memorial | Medio |
| Traslado | Medio |
| Audiencia | Medio |
| Sentencia / fallo | Bajo |
| Medida cautelar | Bajo |
| Terminacion / archivo | Bajo |
| Impulso procesal | Medio-bajo |
| Sin clasificar | Solo para errores o no consultados |

Regla:

```text
La demo debe parecer vigilancia judicial, no una lista de eventos comerciales.
```

---

## 6. Actuaciones Plausibles

Ejemplos permitidos:

- Auto fija fecha.
- Auto admite demanda.
- Auto inadmite demanda.
- Auto ordena seguir adelante.
- Auto corre traslado.
- Auto resuelve excepciones.
- Auto reconoce personeria.
- Fijacion en estado.
- Fijacion en lista.
- Ingreso al despacho.
- Constancia secretarial.
- Constancia de ejecutoria.
- Traslado de excepciones.
- Traslado de liquidacion del credito.
- Audiencia inicial.
- Audiencia de pruebas.
- Audiencia de conciliacion.
- Sentencia de primera instancia.
- Fallo de segunda instancia.
- Medida cautelar decretada.
- Levantamiento de medida cautelar.
- Memorial allegado.
- Contestacion de demanda.
- Recurso presentado.
- Solicitud de nulidad.
- Archivo definitivo.
- Terminacion por desistimiento.

No usar:

- "Evento nuevo".
- "Cambio detectado".
- "Proceso actualizado".
- "Documento recibido" sin mayor contexto.

---

## 7. Fuentes

La demo debe reflejar que la vigilancia judicial depende de fuentes externas.

Fuentes permitidas en demo:

- CPNU / Consulta Nacional Unificada.
- Rama Judicial.
- SAMAI.
- SIC.
- Superintendencia de Sociedades.
- SIPI.

Regla de comunicacion:

Si la fuente no esta integrada productivamente, debe presentarse como fuente demostrativa o fuente en evaluacion tecnica, no como consulta garantizada.

Distribucion recomendada:

| Fuente | Uso en demo |
| --- | --- |
| CPNU / Rama Judicial | Fuente principal. |
| SAMAI | Pocos casos; ideal para mostrar restriccion, captcha o validacion manual. |
| SIC | Casos puntuales administrativos o marcarios. |
| Superintendencia de Sociedades | Casos puntuales societarios/insolvencia. |
| SIPI | Casos puntuales de propiedad industrial. |

La fuente debe aparecer en cada proceso porque permite que Lex explique:

- que fuente fue consultada;
- que fuente fallo;
- que fuente requiere revision;
- que fuente no debe confundirse con ausencia de novedad.

---

## 8. Radicados

Los radicados deben ser plausibles y consistentes.

Reglas:

- Usar estructura compatible con radicados judiciales colombianos.
- Mantener longitud y patron realista.
- Variar anos.
- Variar despachos.
- Evitar secuencias demasiado perfectas.
- No usar radicados reales de clientes sin autorizacion.

Anos recomendados:

```text
2019 - ano actual
```

Los procesos antiguos deben tender a:

- sin cambios;
- archivo;
- terminacion;
- al despacho;
- sentencia previa.

Los procesos recientes deben tender a:

- admision;
- traslado;
- audiencia;
- medidas;
- memoriales;
- errores de consulta.

---

## 9. Responsables

La demo debe usar pocos responsables para que el filtro tenga sentido.

Cantidad recomendada:

```text
3 a 5 responsables
```

No usar demasiados nombres para 79 procesos.
Demasiados responsables hacen que la demo parezca generada.

Distribucion sugerida:

| Responsable | Peso |
| --- | ---: |
| Laura P. | Alto |
| Carlos M. | Alto |
| Ana R. | Medio |
| Daniela V. | Medio |
| Sergio T. | Bajo |

Cada responsable debe tener mezcla de:

- novedades;
- sin cambios;
- revision;
- prioridades.

---

## 10. Prioridades

Prioridades permitidas:

- Critica.
- Alta.
- Media.
- Baja.

Reglas:

- Critica no debe usarse demasiado.
- Alta debe aparecer en novedades, audiencias, traslados y errores.
- Media debe dominar casos sin cambios pero relevantes.
- Baja debe usarse para procesos estables, archivados o sin variacion reciente.

La prioridad no debe depender solo del estado.
Debe depender de:

- tipo de actuacion;
- cercania de evento;
- fuente fallida;
- responsable;
- antiguedad del ultimo cambio.

---

## 11. Fechas Vivas

Las fechas no deben estar congeladas.

Problema actual:

```text
Si una audiencia aparece como 24 de abril y la demo se ve en mayo,
la demo se siente vieja.
```

Decision:

El dataset debe usar fechas relativas a una fecha ancla dinamica.

### Fecha Ancla

La fecha ancla debe ser:

```text
now = fecha actual del navegador o servidor en America/Bogota
```

Para evitar que la demo cambie cada segundo, la ancla puede normalizarse por dia:

```text
demoToday = inicio del dia actual en America/Bogota
```

### Ultimas Actuaciones

Cada fila debe guardar offsets, no fechas absolutas:

```ts
minutesAgo: number
```

La UI debe derivar:

- Hace X min.
- Hoy, HH:mm.
- Ayer, HH:mm.
- Hace X dias.

### Eventos Futuros

Cada fila con audiencia, traslado o vencimiento debe guardar offsets:

```ts
daysUntilEvent: number
eventTime: "09:00"
eventKind: "audiencia" | "traslado" | "vencimiento"
```

La UI debe derivar:

- Manana, 08:30.
- En 3 dias, 17:00.
- 14 de mayo, 09:00.

No guardar:

```ts
eventDate: "2026-04-24T08:30:00-05:00"
eventDateLabel: "24 de abril, 08:30"
```

salvo que sea generado dinamicamente al renderizar.

---

## 12. Estabilidad De La Demo

La demo debe moverse en el tiempo, pero no debe sentirse aleatoria.

Regla:

```text
Misma fecha = misma demo.
Nueva fecha = demo desplazada temporalmente.
```

No cambiar aleatoriamente:

- estados;
- responsables;
- radicados;
- actuaciones;
- fuentes.

Solo deben moverse:

- labels de fecha;
- fechas de eventos;
- calculo de proximidad;
- filtros de 24 horas / semana / 30 dias si dependen del offset.

---

## 13. Lex Y Base De Conocimiento

Lex debe tener acceso completo al dataset normalizado.

Debe poder responder:

- Cuantos procesos hay.
- Cuantos tienen novedad.
- Cuantos no cambiaron.
- Cuantos fallaron.
- Cuales requieren revision.
- Cuales tienen audiencia proxima.
- Cuales tienen traslado.
- Que fuentes aparecen.
- Que fuente fallo.
- Que responsable tiene mas procesos.
- Que procesos tiene cada responsable.
- Que actuaciones pertenecen a cada familia.

Para eso, el dataset debe exponer:

- `rows`
- `summary`
- `owners`
- `sources`
- `actionTypes`
- `upcomingEvents`
- `statusDistribution`
- `sourceDistribution`
- `ownerDistribution`

---

## 14. Criterios De Aceptacion

El dataset esta bien implementado si:

- Tiene alrededor de 79 procesos.
- Se siente juridicamente plausible.
- No parece una demo de juguete.
- Usa fuentes diversas sin prometer integraciones inexistentes.
- Mantiene pocos errores y no consultados.
- Usa fechas relativas y eventos rodantes.
- La demo no envejece con el paso de las semanas.
- Lex puede responder preguntas sobre cualquier dimension del dataset.
- Mobile y desktop muestran la misma realidad operativa.
- Ningun proceso contiene datos sensibles reales no autorizados.

