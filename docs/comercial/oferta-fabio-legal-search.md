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

## 10. Inversion Sugerida

### Opcion A - MVP Tecnico Controlado

Alcance:

- CPNU completo.
- Dashboard interno minimo.
- Alertas basicas.
- Piloto con 20 a 50 procesos.

Duracion:

- 3 a 4 semanas.

Valor sugerido:

> COP $8.000.000 - $12.000.000

### Opcion B - MVP Operativo Completo

Alcance:

- Todo lo anterior.
- SAMAI como fuente secundaria de listado.
- Importador Excel mas robusto.
- Dashboard operativo mas completo.
- Reporte de piloto.
- Mejoras de reglas de terminos/audiencias.

Duracion:

- 4 a 6 semanas.

Valor sugerido:

> COP $14.000.000 - $20.000.000

### Opcion C - Automatizacion + Soporte Mensual

Despues del MVP, se recomienda una bolsa mensual para:

- Monitorear fuentes.
- Ajustar conectores.
- Corregir cambios de portales judiciales.
- Mejorar reglas.
- Agregar nuevas fuentes.

Valor sugerido:

> COP $2.000.000 - $4.000.000 mensuales

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

