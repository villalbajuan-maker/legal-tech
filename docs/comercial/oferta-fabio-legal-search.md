# Propuesta Comercial - Automatizacion Legal Search

## 1. Resumen Ejecutivo

Legal Search ya tiene un servicio validado: vigilancia judicial recurrente para procesos activos, clientes individuales, firmas y empresas. El problema principal no es comercial ni de conocimiento juridico. El problema es operativo: el servicio depende demasiado de revision manual, Excel y disciplina diaria del operador.

La propuesta consiste en construir un MVP de automatizacion enfocado en el punto de mayor riesgo y valor:

> Deteccion automatica de movimientos, terminos y audiencias a partir del numero de radicado.

El objetivo no es reemplazar toda la operacion desde el primer dia, sino crear un copiloto operativo que reduzca tiempo manual, disminuya riesgo de omisiones y permita escalar el numero de procesos vigilados.

## 2. Problema Actual

Legal Search gestiona actualmente mas de 200 procesos mediante un flujo manual:

- Excel como base principal.
- Consulta diaria de fuentes judiciales.
- Revision proceso por proceso.
- Notificaciones por WhatsApp, correo y reportes.
- Control operativo concentrado en Fabio.

Este modelo funciona, pero tiene un limite estructural:

- Si entran muchos procesos nuevos, el tiempo de revision crece linealmente.
- Una audiencia reprogramada o un termino no detectado puede convertirse en un error critico.
- La operacion consume tiempo nocturno y limita el crecimiento de otros negocios.

## 3. Oportunidad

Legal Search puede evolucionar de un servicio manual validado a una infraestructura automatizada de vigilancia judicial.

Esto permitiria:

- Aumentar capacidad operativa sin aumentar proporcionalmente horas de trabajo.
- Reducir riesgo de errores por omision.
- Mejorar oportunidad de notificacion a clientes.
- Crear servicios premium de alertas.
- Preparar una futura plataforma para clientes.

## 4. Solucion Propuesta

Construir un sistema MVP que:

1. Reciba una lista de radicados.
2. Consulte automaticamente fuentes judiciales priorizadas.
3. Detecte procesos encontrados.
4. Consulte detalle y actuaciones cuando la fuente lo permita.
5. Identifique fechas relevantes.
6. Muestre alertas operativas.
7. Genere una bandeja de revision para Fabio.

El primer MVP se enfoca en el flujo interno de Legal Search, no en un portal para clientes.

## 4.1. Que Recibe Legal Search

Al finalizar el MVP, Legal Search no recibe solamente una prueba tecnica. Recibe una primera version funcional de su propia infraestructura de vigilancia judicial.

Legal Search recibira:

- Un sistema propio para consultar procesos por radicado.
- Un dashboard interno para revisar resultados en una sola bandeja.
- Consulta automatica a CPNU / Rama Judicial.
- Registro de procesos encontrados, despacho, departamento, sujetos y ultima actuacion.
- Consulta de actuaciones del proceso cuando la fuente lo permita.
- Visualizacion de la actuacion textual y anotacion.
- Filtros operativos para priorizar revision.
- Base tecnica para detectar terminos, audiencias y movimientos relevantes.
- Documentacion tecnica y funcional del MVP.
- Codigo fuente del sistema desarrollado.
- Estructura inicial de base de datos.
- Repositorio del proyecto.
- Conocimiento tecnico transferible para seguir evolucionando la solucion.

En la practica, Fabio queda con una herramienta propia para empezar a convertir Legal Search de una operacion manual a una operacion asistida por automatizacion.

## 4.2. Como Queda Legal Search Despues del MVP

Despues del MVP, Legal Search queda con:

- Menos dependencia de revision manual proceso por proceso.
- Mayor visibilidad sobre procesos activos.
- Una bandeja unica para revisar novedades.
- Capacidad de validar automaticamente una muestra de procesos.
- Base para escalar a mas procesos sin duplicar esfuerzo operativo.
- Evidencia tecnica para decidir que fuentes automatizar despues.
- Base comercial para ofrecer alertas premium, reportes y vigilancia con mayor valor agregado.

El MVP no elimina la revision humana desde el primer dia. La mejora es que la revision deja de ser completamente manual y empieza a estar apoyada por una herramienta propia, medible y escalable.

## 4.3. Propiedad del Sistema

Legal Search sera propietario del desarrollo entregado en el marco del proyecto.

Esto incluye:

- Codigo fuente desarrollado para el MVP.
- Documentacion tecnica.
- Modelo inicial de base de datos.
- Conectores creados para fuentes publicas.
- Reglas iniciales de deteccion.
- Configuracion base del dashboard.
- Repositorio del proyecto.

La solucion no se entrega como una licencia cerrada de un tercero. Se entrega como una base tecnologica propia de Legal Search, que podra mantener, ampliar, auditar o migrar en el futuro.

Los servicios, licencias, servidores, APIs, proveedores cloud o herramientas externas que se usen para operar el sistema dependeran de las condiciones de cada proveedor. Sin embargo, la arquitectura, el codigo desarrollado y la logica funcional del MVP quedaran bajo control de Legal Search.

## 5. Alcance del MVP

### Incluye

- Base de datos central de procesos.
- Carga inicial desde Excel.
- Normalizacion de radicados.
- Consulta automatica a CPNU / Rama Judicial.
- Consulta de detalle del proceso en CPNU.
- Consulta de actuaciones en CPNU.
- Registro historico de movimientos.
- Identificacion de ultima actuacion.
- Deteccion basica de posibles terminos y audiencias por reglas.
- Dashboard interno operativo.
- Filtros por ultima actuacion.
- Alertas internas iniciales.
- Reporte de procesos no encontrados o fuentes con error.

### Incluye parcialmente

- SAMAI como fuente de verificacion/listado.

Durante las pruebas tecnicas se confirmo que SAMAI permite consultar el listado publico por radicado, pero el detalle del proceso puede requerir validacion manual tipo "No soy un robot". Por eso SAMAI se propone inicialmente como fuente secundaria de confirmacion, no como fuente completa de actuaciones automatizadas.

### No incluye en el MVP

- Bypass de CAPTCHA o controles anti-bot.
- Portal self-service para clientes.
- App movil.
- Analisis juridico avanzado con IA.
- Descarga masiva de documentos.
- Integracion WhatsApp productiva.
- Automatizacion total de todas las jurisdicciones.
- Sustitucion completa de la revision humana desde el primer dia.

## 6. Fuentes Iniciales

### CPNU / Rama Judicial

Estado: automatizable.

Durante la prueba tecnica se confirmaron endpoints publicos para:

- Buscar por radicado.
- Consultar detalle del proceso.
- Consultar actuaciones.
- Consultar sujetos.

Esta sera la fuente principal del MVP.

### SAMAI

Estado: parcialmente automatizable.

Se confirmo busqueda/listado por radicado mediante endpoint JSON. Sin embargo, el detalle completo del proceso presenta una validacion manual.

Uso recomendado en MVP:

- Confirmar existencia del proceso.
- Extraer resumen basico cuando este disponible.
- Marcar procesos que requieren revision manual.

### SIC, SIPI y SuperSociedades

Estado: fase posterior.

Estas fuentes requieren discovery adicional, radicados/expedientes de prueba y validacion de restricciones tecnicas. No deben incluirse en el primer alcance cerrado del MVP, salvo como investigacion separada.

## 7. Entregables

### Entregable 1 - Base Operativa

- Estructura de base de datos.
- Importador inicial desde Excel.
- Modelo de procesos, clientes, fuentes, movimientos y alertas.
- Normalizador de radicados.

### Entregable 2 - Conector CPNU

- Consulta por radicado.
- Consulta de detalle.
- Consulta de actuaciones.
- Manejo de paginacion.
- Registro de snapshots.
- Registro de errores.

### Entregable 3 - Dashboard Interno

- Busqueda por radicados.
- Tabla de procesos encontrados.
- Ultima actuacion.
- Texto de actuacion.
- Anotacion.
- Despacho.
- Departamento.
- Sujetos procesales.
- Filtros por fecha de ultima actuacion.

### Entregable 4 - Motor de Alertas Basico

- Alertas por actuacion reciente.
- Alertas por palabras clave.
- Alertas por posibles terminos.
- Alertas por posibles audiencias.
- Alertas por fuente fallida o proceso no encontrado.

### Entregable 5 - Piloto Controlado

- Carga de 20 a 50 procesos.
- Comparacion contra revision manual de Fabio.
- Medicion de falsos positivos y falsos negativos.
- Ajustes de reglas.
- Informe de viabilidad para escalar.

## 8. Plan de Trabajo

### Fase 0 - Preparacion

Duracion estimada: 2 a 3 dias.

Actividades:

- Recibir Excel maestro.
- Recibir radicados de prueba.
- Validar campos actuales.
- Definir criterios de alerta.
- Priorizar procesos piloto.

Resultado:

- Backlog cerrado del MVP.
- Muestra piloto lista.

### Fase 1 - Conector CPNU y Base de Datos

Duracion estimada: 1 semana.

Actividades:

- Implementar conector CPNU.
- Guardar resultados en base de datos.
- Registrar detalle y actuaciones.
- Manejar errores y procesos no encontrados.

Resultado:

- Procesos consultados automaticamente desde CPNU.

### Fase 2 - Dashboard Operativo

Duracion estimada: 1 semana.

Actividades:

- Crear vista interna de procesos.
- Crear filtros.
- Mostrar actuaciones.
- Mostrar fuente y estado de consulta.
- Mostrar errores.

Resultado:

- Fabio puede revisar procesos desde una bandeja unica.

### Fase 3 - Alertas Basicas

Duracion estimada: 1 semana.

Actividades:

- Detectar actuaciones recientes.
- Detectar palabras clave.
- Detectar posibles terminos/audiencias.
- Crear bandeja de alertas.

Resultado:

- Sistema genera alertas operativas iniciales.

### Fase 4 - Piloto y Ajuste

Duracion estimada: 1 semana.

Actividades:

- Ejecutar piloto con 20 a 50 procesos.
- Comparar con revision manual.
- Ajustar reglas.
- Documentar precision.
- Definir siguiente fase.

Resultado:

- MVP validado o ajustado con datos reales.

## 9. Duracion Estimada

Duracion total MVP:

> 4 semanas

Puede reducirse si el alcance se limita exclusivamente a CPNU y dashboard minimo.

Puede ampliarse si se agregan fuentes adicionales, WhatsApp o automatizacion de documentos.

## 10. Inversion Estimada

La inversion se plantea como una estimacion por componentes, no como un valor rigido cerrado. El alcance puede ajustarse de acuerdo con el numero de procesos piloto, fuentes incluidas, nivel de automatizacion requerido y costos de terceros necesarios para operar la solucion.

### Opcion A - MVP Tecnico Controlado

Alcance:

- CPNU completo.
- Dashboard interno minimo.
- Alertas basicas.
- Piloto con 20 a 50 procesos.

Que obtiene Legal Search:

- Una primera version funcional del sistema.
- Consulta automatizada de procesos en CPNU.
- Dashboard interno para revisar resultados.
- Base de datos inicial de procesos y movimientos.
- Codigo fuente y repositorio del MVP.
- Documentacion para continuar el desarrollo.

Duracion estimada:

- 3 a 4 semanas.

Inversion estimada:

> COP $10.000.000

Distribucion de referencia:

| Concepto | Valor estimado |
| --- | ---: |
| Ingresos a favor de terceros: servidores, almacenamiento, dominios, herramientas tecnicas, licencias menores y servicios de prueba | COP $1.500.000 |
| Investigacion tecnica, validacion de fuentes y pruebas de consulta automatica | COP $1.500.000 |
| Desarrollo backend, conectores CPNU, normalizacion de radicados y manejo de errores | COP $2.500.000 |
| Desarrollo dashboard interno, filtros, tabla operativa y visualizacion de resultados | COP $1.800.000 |
| Soporte tecnico especializado, pruebas, ajustes y documentacion del piloto | COP $1.200.000 |
| Direccion tecnica, arquitectura, coordinacion y gestion del proyecto | COP $1.500.000 |
| **Total estimado** | **COP $10.000.000** |

### Opcion B - MVP Operativo Completo

Alcance:

- Todo lo anterior.
- SAMAI como fuente secundaria de listado.
- Importador Excel mas robusto.
- Dashboard operativo mas completo.
- Reporte de piloto.
- Mejoras de reglas de terminos/audiencias.
- Mayor acompanamiento durante validacion operativa.

Que obtiene Legal Search:

- Una version mas completa y operativa del sistema.
- CPNU como fuente principal automatizada.
- SAMAI como fuente secundaria de verificacion/listado.
- Importador desde Excel para facilitar la transicion desde la operacion actual.
- Dashboard mas cercano al uso diario real.
- Reglas iniciales para identificar movimientos, posibles terminos y posibles audiencias.
- Reporte de piloto y recomendaciones de escalamiento.
- Codigo fuente, repositorio, documentacion y estructura tecnica bajo control de Legal Search.

Duracion estimada:

- 4 a 6 semanas.

Inversion estimada:

> COP $17.000.000

Distribucion de referencia:

| Concepto | Valor estimado |
| --- | ---: |
| Ingresos a favor de terceros: servidores, almacenamiento, servicios cloud, herramientas de monitoreo, licencias, mensajeria de prueba y componentes tecnicos necesarios | COP $2.500.000 |
| Investigacion y desarrollo sobre fuentes judiciales, incluyendo CPNU, SAMAI y validaciones iniciales de fuentes adicionales | COP $2.500.000 |
| Desarrollo backend, conectores, procesamiento de actuaciones, snapshots y estructura de datos | COP $3.500.000 |
| Desarrollo dashboard operativo, filtros, bandeja de revision, estados de fuente y vistas de alertas | COP $2.800.000 |
| Soporte tecnico especializado, QA, pruebas con radicados reales, ajustes de reglas y estabilizacion | COP $2.200.000 |
| Direccion tecnica, arquitectura, coordinacion de equipo, gestion de alcance y acompanamiento funcional | COP $3.500.000 |
| **Total estimado** | **COP $17.000.000** |

### Opcion C - Soporte, Operacion y Mejora Continua

Despues del MVP, se recomienda una bolsa mensual para mantener la automatizacion operativa. Las fuentes judiciales pueden cambiar sin aviso, por lo que el sistema requiere monitoreo, ajustes y soporte tecnico recurrente.

Alcance mensual:

- Monitoreo de fuentes.
- Ajustes de conectores.
- Correccion de cambios en portales judiciales.
- Mejoras a reglas de terminos/audiencias.
- Soporte tecnico especializado.
- Pequenas mejoras evolutivas.
- Revision de errores y estabilidad.

Valor mensual estimado:

> COP $3.000.000 mensuales

Distribucion de referencia:

| Concepto | Valor mensual estimado |
| --- | ---: |
| Ingresos a favor de terceros: servidores, almacenamiento, herramientas, monitoreo, licencias y servicios de soporte operativo | COP $800.000 |
| Soporte tecnico especializado y correccion de incidencias | COP $900.000 |
| Investigacion, ajustes de fuentes y mejoras menores | COP $700.000 |
| Direccion tecnica, seguimiento y priorizacion mensual | COP $600.000 |
| **Total mensual estimado** | **COP $3.000.000** |

Nota: los valores anteriores corresponden a una estimacion inicial para dimensionar el proyecto. Los costos asociados a terceros pueden variar segun consumo, proveedor, cantidad de procesos, canales de notificacion, almacenamiento, licencias y servicios adicionales requeridos.

## 11. Modelo Comercial Futuro para Legal Search

Una vez validado el MVP, Legal Search podria monetizar:

- Alertas premium por WhatsApp.
- Reportes automatizados.
- Vigilancia con SLA.
- Paquetes por numero de procesos.
- Dashboard para firmas.
- Analitica historica de actuaciones.

Ejemplo de paquetes:

- Basico: vigilancia mensual por proceso.
- Premium: vigilancia + alertas criticas.
- Firma: tablero + multiples procesos + reportes.

## 12. Riesgos y Mitigaciones

### Cambios en fuentes publicas

Riesgo:

- Los portales judiciales pueden cambiar estructura, endpoints o restricciones.

Mitigacion:

- Monitoreo.
- Snapshots.
- Conectores separados por fuente.
- Soporte mensual.

### CAPTCHA o controles anti-bot

Riesgo:

- Algunas fuentes no permiten automatizacion completa.

Mitigacion:

- No hacer bypass.
- Usar flujo manual asistido.
- Priorizar fuentes automatizables.
- Buscar canales formales cuando sea necesario.

### Falsos positivos / falsos negativos

Riesgo:

- El sistema puede detectar eventos irrelevantes o no detectar todos los eventos criticos al inicio.

Mitigacion:

- Piloto controlado.
- Comparacion contra revision manual.
- Ajuste de reglas con Fabio.
- No vender como sustituto total desde el dia uno.

## 13. Responsabilidades del Cliente

Legal Search debe entregar:

- Excel maestro o plantilla.
- 20 a 50 radicados piloto.
- Lista de clientes/procesos prioritarios.
- Ejemplos de alertas actuales.
- Logica actual de terminos.
- Validacion semanal de resultados.

## 14. Responsabilidades del Equipo Tecnico

El equipo tecnico entrega:

- Arquitectura.
- Implementacion.
- Pruebas.
- Dashboard.
- Documentacion.
- Ajustes del piloto.
- Recomendaciones para escalar.

## 15. Propuesta de Mensaje Comercial para Fabio

Fabio, Legal Search ya tiene un servicio validado y clientes activos. El siguiente paso no es comprar un software generico, sino automatizar el flujo que ya funciona.

Proponemos construir un MVP de vigilancia judicial automatizada que consulte procesos por radicado, detecte actuaciones, identifique posibles terminos o audiencias y organice la informacion en una bandeja operativa.

La primera fase se concentrara en CPNU / Rama Judicial, que ya fue validada tecnicamente como fuente automatizable. SAMAI puede incorporarse como fuente secundaria de verificacion, con la salvedad de que su detalle completo puede requerir validacion manual.

El objetivo del MVP es reducir carga operativa, disminuir riesgo de omisiones y crear la base para escalar Legal Search sin depender completamente de revision manual diaria.

## 16. Proximos Pasos

1. Fabio envia Excel maestro.
2. Fabio define 20 a 50 procesos piloto.
3. Se aprueba alcance y modalidad.
4. Se inicia Fase 0.
5. Se entrega primer tablero operativo.
6. Se ejecuta piloto comparado contra revision manual.
