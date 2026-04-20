# Reporte De Inventario Judicial Y Factibilidad Comercial

## Sistema Operativo De Vigilancia Judicial

### 1. Objetivo Del Reporte

Este reporte busca usar informacion fidedigna del inventario judicial colombiano para dimensionar la oportunidad de construir un sistema operativo de vigilancia judicial.

El objetivo no es solamente saber cuantos procesos existen, sino responder preguntas de negocio:

- Cual es el universo judicial sobre el cual podria operar una plataforma de vigilancia.
- Que porcion de ese universo es comercialmente atractiva.
- Que volumen minimo debe capturar el producto para ser viable.
- Como proyectar ingresos segun procesos vigilados y cuentas activas.
- Que analiticas deberia construir el sistema para soportar decisiones comerciales.

### 2. Fuentes Fidedignas

Las fuentes base para el analisis son:

#### Rama Judicial / Consejo Superior De La Judicatura

Fuente: Movimiento de Procesos.

URL:

```text
https://www.ramajudicial.gov.co/web/estadisticas-judiciales/movimiento-de-procesos-historico
```

Esta fuente publica archivos por ano, jurisdiccion, especialidad, competencia y despacho. Permite analizar:

- Ingresos efectivos.
- Egresos efectivos.
- Inventario final.
- Jurisdiccion.
- Especialidad.
- Distrito.
- Despacho.
- Competencia.

#### Ministerio De Justicia

Fuente: Sistema de Estadistica en Justicia - Consejo Superior de la Judicatura.

URL:

```text
https://www.minjusticia.gov.co/transparencia/Paginas/SEJ-Rama-Judicial-Consejo-Superior-de-la-Judicatura.aspx
```

MinJusticia indica que esta informacion corresponde al movimiento de procesos judiciales reportado por la Rama Judicial, consolidado por despachos judiciales en Colombia.

Esta fuente es util para respaldar el uso del indicador de inventario de procesos judiciales.

### 3. Definicion De Inventario Judicial

Para este analisis, el inventario judicial se entiende como el volumen de procesos que permanecen en tramite o pendientes de decision al cierre del periodo reportado.

La metrica mas relevante para dimensionar el mercado no es solamente "ingresos de procesos", sino:

```text
Inventario final de procesos judiciales
```

Esta metrica permite aproximar el universo de procesos que requieren seguimiento, vigilancia, revision de actuaciones o control operativo.

### 4. Cifra Base Del Universo

Con base en fuentes oficiales, Colombia opera alrededor de:

```text
2,2 millones de procesos en inventario judicial
```

Referencia oficial 2023:

```text
Inventario final nacional 2023: 2.218.574 procesos
```

Estimacion calculada con archivos oficiales de Movimiento de Procesos 2025:

```text
Inventario final nacional 2025: 2.198.402 procesos
```

Lectura:

```text
El universo nacional se mantiene alrededor de 2,2 millones de procesos.
```

Esto confirma que la oportunidad no depende de crear demanda. La demanda operativa ya existe: millones de procesos requieren seguimiento judicial.

### 5. Distribucion Estimada Del Inventario 2025

La siguiente distribucion corresponde a una suma exploratoria de archivos oficiales publicados por Rama Judicial para enero-diciembre de 2025, usando la columna "TOTAL INVENTARIO FINAL".

| Segmento / especialidad | Inventario final estimado | Participacion aproximada |
| --- | ---: | ---: |
| Civil | 397.693 | 18,1% |
| EPMS | 332.648 | 15,1% |
| Penal | 295.785 | 13,5% |
| Pequenas causas | 277.601 | 12,6% |
| Promiscuos | 240.143 | 10,9% |
| Contencioso Administrativo | 222.481 | 10,1% |
| Laboral | 192.971 | 8,8% |
| Familia | 121.356 | 5,5% |
| Comisiones Seccionales de Disciplina | 41.648 | 1,9% |
| Consejo de Estado | 18.799 | 0,9% |
| Civil Tierras | 13.793 | 0,6% |
| Salas Mixtas | 13.524 | 0,6% |
| Corte Suprema | 12.349 | 0,6% |
| Penal Justicia y Paz | 8.919 | 0,4% |
| Adolescentes | 4.776 | 0,2% |
| CNDJ | 3.292 | 0,1% |
| Corte Constitucional | 624 | 0,0% |
| **Total estimado** | **2.198.402** | **100%** |

### 6. Lectura Comercial De La Distribucion

No todo el inventario judicial tiene el mismo valor comercial para una plataforma de vigilancia.

El producto debe priorizar segmentos donde exista:

- Alto volumen.
- Necesidad de seguimiento recurrente.
- Clientes con capacidad de pago.
- Riesgo economico por no detectar actuaciones.
- Operacion repetitiva susceptible de automatizacion.
- Abogados o firmas que ya pagan por revision manual.

### 7. Segmentos Comercialmente Atractivos

Los segmentos mas atractivos para iniciar son:

| Segmento | Inventario estimado | Motivo comercial |
| --- | ---: | --- |
| Civil | 397.693 | Alto volumen, litigios patrimoniales, ejecutivos, responsabilidad civil, cartera |
| Pequenas causas | 277.601 | Alto volumen, procesos repetitivos, cartera y reclamaciones |
| Promiscuos | 240.143 | Cobertura territorial amplia, procesos civiles/familia/laborales en municipios |
| Contencioso Administrativo | 222.481 | Clientes institucionales, Estado, contratacion, reparacion directa |
| Laboral | 192.971 | Alto interes para firmas, empresas y litigantes recurrentes |
| Familia | 121.356 | Seguimiento recurrente, aunque con ticket promedio menor |
| Civil Tierras / Salas Mixtas | 27.317 | Nichos especificos y territoriales |

Suma aproximada de segmentos prioritarios:

```text
1.479.562 procesos
```

Participacion sobre inventario total:

```text
67,3% del inventario judicial estimado 2025
```

Esto sugiere que el mercado comercialmente monitoreable podria ubicarse, de forma conservadora, entre:

```text
1,2M y 1,5M procesos
```

### 8. Segmentos De Menor Prioridad Inicial

Algunos segmentos pueden ser grandes, pero no necesariamente son los mejores para el primer enfoque comercial.

Ejemplo:

| Segmento | Inventario estimado | Lectura |
| --- | ---: | --- |
| EPMS | 332.648 | Muy alto volumen, pero dinamica especializada y menos clara para microSaaS comercial inicial |
| Penal | 295.785 | Alto volumen, pero requiere segmentacion por tipo de proceso y perfil de abogado |
| Altas Cortes | 31.772 aprox. | Menor volumen, mas especializado, posible ticket alto pero mercado mas pequeno |
| Disciplina judicial | 44.940 aprox. | Nicho especifico |

Estos segmentos no se descartan, pero no deberian ser el foco principal del MVP comercial.

### 9. Hipotesis De Mercado

Hipotesis central:

```text
La plataforma no necesita capturar una gran porcion del inventario nacional para ser viable.
```

Sobre un inventario comercialmente monitoreable de 1,2M a 1,5M procesos:

| Captura estimada | Procesos vigilados |
| ---: | ---: |
| 0,10% | 1.200 - 1.500 |
| 0,25% | 3.000 - 3.750 |
| 0,50% | 6.000 - 7.500 |
| 1,00% | 12.000 - 15.000 |

La meta inicial del producto:

```text
3.000 a 4.000 procesos vigilados
```

equivale aproximadamente a:

```text
0,25% del inventario comercialmente monitoreable
```

Lectura:

```text
La meta inicial es pequena frente al mercado disponible y, por tanto, razonable.
```

### 10. Escenarios De Monetizacion Por Procesos

Si el negocio se monetizara principalmente por proceso vigilado, los escenarios serian:

| Procesos vigilados | COP $1.200 / proceso | COP $1.800 / proceso | COP $2.500 / proceso |
| ---: | ---: | ---: | ---: |
| 1.000 | COP $1.200.000 | COP $1.800.000 | COP $2.500.000 |
| 2.500 | COP $3.000.000 | COP $4.500.000 | COP $6.250.000 |
| 4.000 | COP $4.800.000 | COP $7.200.000 | COP $10.000.000 |
| 7.500 | COP $9.000.000 | COP $13.500.000 | COP $18.750.000 |
| 15.000 | COP $18.000.000 | COP $27.000.000 | COP $37.500.000 |

Este modelo sirve como piso economico.

Sin embargo, no es el modelo mas atractivo, porque reduce el negocio a precio por radicado.

### 11. Escenario Recomendado Por Cuentas

La recomendacion es monetizar por planes mensuales que combinen:

```text
Cuenta
+
Procesos incluidos
+
Usuarios
+
Alertas
+
Trazabilidad
+
Soporte
```

Escenario objetivo:

```text
50 a 80 cuentas
3.000 a 4.000 procesos vigilados
```

Ejemplo para 75 cuentas:

| Tipo de cuenta | Cantidad | Precio mensual | MRR |
| --- | ---: | ---: | ---: |
| Starter | 20 | COP $149.000 | COP $2.980.000 |
| Profesional | 35 | COP $299.000 | COP $10.465.000 |
| Firma | 15 | COP $599.000 | COP $8.985.000 |
| Operativo | 5 | COP $1.100.000 | COP $5.500.000 |
| **Total** | **75** |  | **COP $27.930.000** |

Lectura:

```text
El negocio se vuelve mas atractivo cuando el valor se vende como control operativo por cuenta, no como radicado individual barato.
```

### 12. Proyeccion De Crecimiento

Una proyeccion razonable para etapa inicial podria ser:

| Etapa | Cuentas | Procesos vigilados | MRR estimado |
| --- | ---: | ---: | ---: |
| Beta inicial | 5 - 10 | 300 - 800 | COP $2M - $5M |
| Mes 3 | 10 - 15 | 800 - 1.500 | COP $4M - $8M |
| Mes 6 | 25 - 35 | 1.800 - 2.500 | COP $10M - $16M |
| Mes 12 | 50 - 80 | 3.000 - 4.000 | COP $20M - $30M |

La factibilidad depende menos del tamano del mercado y mas de:

- Confiabilidad de las consultas.
- Activacion comercial.
- Retencion de abogados.
- Claridad del valor operativo.
- Capacidad de manejar errores de fuente.

### 13. Analiticas Que Deberia Construir El Sistema

El sistema no deberia limitarse a consultar procesos. Debe crear inteligencia operativa.

Analiticas internas recomendadas:

- Total de procesos vigilados.
- Procesos activos por cuenta.
- Procesos consultados exitosamente.
- Procesos no consultados.
- Procesos no encontrados.
- Procesos con actuacion reciente.
- Procesos con movimiento en ultimas 24 horas.
- Procesos con movimiento en ultimos 7 dias.
- Procesos sin movimiento en 30, 90 o 180 dias.
- Distribucion por jurisdiccion.
- Distribucion por despacho.
- Distribucion por cliente.
- Fuentes con mayor error.
- Tiempo desde ultima consulta exitosa.

Analiticas de negocio:

- Procesos vigilados por plan.
- Ingreso promedio por cuenta.
- Ingreso promedio por proceso.
- Costo operativo por proceso.
- Margen por plan.
- Retencion por volumen de procesos.
- Activacion por carga inicial.
- Numero de procesos agregados despues del primer mes.

### 14. Reportes De Mercado Que Podemos Construir

Con las fuentes oficiales se pueden generar reportes periodicos como:

```text
Inventario judicial nacional por ano
Inventario por jurisdiccion
Inventario por especialidad
Inventario por distrito
Inventario por despacho
Ingresos vs egresos efectivos
Despachos con mayor carga
Especialidades con mayor inventario
Zonas con mayor potencial comercial
```

Estos reportes pueden servir para:

- Sustentar inversion.
- Priorizar nichos.
- Definir territorios de venta.
- Construir contenido comercial.
- Identificar sectores con alto dolor operativo.
- Fortalecer la narrativa de mercado.

### 15. Metodologia Recomendada

Para convertir este reporte en una fuente recurrente de decision, se recomienda:

```text
1. Descargar los archivos oficiales de Movimiento de Procesos por ano.
2. Extraer la columna TOTAL INVENTARIO FINAL.
3. Normalizar jurisdiccion, especialidad, distrito y despacho.
4. Consolidar una base historica.
5. Construir dashboards de inventario, ingresos y egresos.
6. Cruzar esa informacion con datos internos del producto.
```

Base interna sugerida:

```text
official_judicial_inventory
```

Campos sugeridos:

- year.
- period.
- jurisdiction.
- specialty.
- competence.
- district.
- office_name.
- inventory_final.
- effective_income.
- effective_outcome.
- source_url.
- source_file.
- extracted_at.

### 16. Conclusion

El inventario judicial colombiano confirma una oportunidad suficientemente grande para desarrollar un sistema operativo de vigilancia judicial.

La cifra relevante no es solamente que existan cerca de 2,2 millones de procesos en inventario. Lo importante es que una parte significativa de ese universo tiene dolor operativo real y puede requerir vigilancia recurrente.

El mercado inicial no necesita capturar una gran porcion del universo nacional:

```text
Capturar 0,25% del inventario comercialmente monitoreable
puede representar 3.000 a 4.000 procesos vigilados.
```

Con una estrategia por cuentas, ese volumen puede soportar un negocio inicial de:

```text
COP $20M - $30M de MRR
```

La factibilidad del producto es positiva si se cumplen tres condiciones:

- El sistema consulta de forma confiable las fuentes prioritarias.
- El producto se vende como control operativo, no como scraper barato.
- La activacion comercial se enfoca en abogados y firmas con volumen real.

### 17. Tesis Final

```text
El universo judicial colombiano es lo suficientemente grande.
El mercado inicial requerido es pequeno frente al universo total.
La oportunidad esta en capturar procesos con dolor operativo recurrente,
no en intentar cubrir toda la Rama Judicial desde el inicio.
```
