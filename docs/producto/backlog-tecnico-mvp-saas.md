# Backlog Tecnico MVP SaaS

## LexControl - Sistema Operativo De Vigilancia Judicial

Este backlog convierte el PRD del MVP SaaS en un plan ejecutable por sprints.

Objetivo:

```text
Construir una beta cerrada capaz de cargar procesos reales,
consultar CPNU/Rama Judicial, registrar cada intento,
detectar novedades y mostrar una bandeja operativa con trazabilidad.
```

El backlog se organiza en dos lineas paralelas:

1. Producto tecnico SaaS.
2. Go-to-market, landing, diagnostico y activacion beta.

La prioridad tecnica es demostrar control operativo:

```text
Que cambio.
Que no cambio.
Que fallo.
Que no se pudo consultar.
```

---

## 1. Principios De Ejecucion

- Construir primero la operacion minima que genera valor.
- Registrar todo intento de consulta, incluso cuando falle.
- Separar claramente datos por cuenta desde el inicio.
- No depender de SAMAI ni de fuentes con CAPTCHA para la beta inicial.
- No prometer automatizacion absoluta.
- Hacer visible el error como parte del valor del producto.
- Mantener Lex limitado a datos estructurados durante MVP.
- Tratar Lex como voz del sistema, no como chatbot generico.
- Usar la landing como instrumento activo de validacion comercial.

---

## 2. Definicion De MVP Tecnico

El MVP queda cerrado cuando existe una beta asistida con:

- Cuentas y usuarios.
- Procesos cargados por radicado.
- Responsables y prioridad.
- Consulta CPNU/Rama Judicial.
- Historial de intentos.
- Snapshots.
- Eventos de novedad.
- Bandeja operativa.
- Estados de consulta.
- Alertas basicas por correo o resumen interno.
- Companion inicial con preguntas guiadas.
- Panel admin minimo.
- Landing con diagnostico y captura de interesados.

Fuera del MVP:

- Bypass de CAPTCHA.
- SAMAI productivo.
- WhatsApp productivo.
- Pasarela de pagos.
- Portal avanzado para cliente final.
- IA juridica sustantiva.

---

## 3. Backlog Por Epicas

### E1. Fundacion SaaS

Objetivo:

Crear la base multi-tenant sobre la cual se construye toda la operacion.

Historias:

- Como admin de plataforma, puedo crear una cuenta beta.
- Como usuario, puedo iniciar sesion y ver solo los datos de mi cuenta.
- Como admin de cuenta, puedo invitar o crear usuarios operativos.
- Como sistema, debo aplicar separacion de datos por cuenta.

Tareas tecnicas:

- Definir esquema inicial de base de datos.
- Crear tablas `accounts`, `users` o perfiles de usuario.
- Configurar autenticacion.
- Configurar roles basicos: platform_admin, account_admin, operator.
- Configurar RLS o capa equivalente de aislamiento.
- Crear layout base SaaS con sidebar, top bar y panel principal.
- Crear seed minimo para cuenta demo/beta.

Criterios de aceptacion:

- Una cuenta no puede ver procesos de otra cuenta.
- Un usuario pertenece a una sola cuenta en MVP.
- El sistema puede crear una cuenta beta manualmente.
- El layout base carga despues de autenticacion.

---

### E2. Gestion De Procesos

Objetivo:

Permitir cargar, administrar y preparar procesos para vigilancia.

Historias:

- Como usuario, puedo crear un proceso por radicado.
- Como usuario, puedo cargar varios radicados en lote.
- Como usuario, puedo asignar responsable, cliente interno y prioridad.
- Como usuario, puedo pausar o activar vigilancia de un proceso.

Tareas tecnicas:

- Crear tablas `clients`, `cases`, `case_sources`.
- Validar formato basico de radicado.
- Evitar duplicados activos por cuenta.
- Crear pantalla de carga individual.
- Crear carga masiva por texto/CSV simple.
- Crear listado inicial de procesos.
- Crear estados: active, paused, archived.
- Crear campos de prioridad: low, medium, high, critical.
- Crear asignacion de responsable.

Criterios de aceptacion:

- El usuario puede cargar al menos 50 radicados en lote.
- El sistema reporta radicados invalidos o duplicados.
- Todo proceso queda asociado a cuenta.
- Todo proceso activo queda listo para consulta.

---

### E3. Conector CPNU / Rama Judicial

Objetivo:

Convertir las pruebas de consulta en un conector productivo desacoplado.

Historias:

- Como sistema, puedo consultar CPNU por radicado.
- Como sistema, puedo extraer ultima actuacion y anotacion.
- Como sistema, puedo clasificar proceso encontrado, no encontrado o error de fuente.
- Como usuario, puedo ver que la consulta ocurrio aunque haya fallado.

Tareas tecnicas:

- Crear modulo `connector-cpnu`.
- Definir contrato normalizado de respuesta.
- Extraer despacho, estado disponible, ultima actuacion, fecha y anotacion.
- Manejar proceso sin registros.
- Manejar errores HTTP, timeout, parsing y fuente no disponible.
- Guardar payload crudo o referencia para auditoria tecnica.
- Agregar pruebas con radicados conocidos.
- Documentar limites y supuestos del conector.

Criterios de aceptacion:

- El conector consulta un radicado valido y devuelve datos normalizados.
- El conector devuelve estado `not_found` cuando no hay registros.
- El conector devuelve estado `source_error` ante falla tecnica.
- El conector no mezcla logica de UI con logica de fuente.

---

### E4. Motor De Consultas

Objetivo:

Ejecutar consultas manuales y por lote con trazabilidad.

Historias:

- Como usuario, puedo consultar un proceso bajo demanda.
- Como sistema, puedo crear trabajos de consulta por lote.
- Como sistema, puedo registrar cada intento.
- Como sistema, puedo priorizar procesos criticos.

Tareas tecnicas:

- Crear tabla `query_jobs`.
- Crear servicio para generar jobs.
- Crear worker o edge function de ejecucion.
- Crear estados: pending, running, success, failed, skipped.
- Bloquear consultas simultaneas del mismo proceso.
- Implementar reintentos controlados.
- Agregar limites de frecuencia basicos.
- Agregar orden por prioridad.

Criterios de aceptacion:

- Toda consulta crea un `query_job`.
- Una consulta fallida queda registrada con codigo y mensaje.
- Una consulta exitosa queda asociada a snapshot.
- El sistema puede ejecutar un lote inicial de procesos activos.

---

### E5. Snapshots Y Eventos

Objetivo:

Guardar el estado observado y detectar cambios relevantes.

Historias:

- Como sistema, guardo un snapshot por consulta exitosa.
- Como sistema, comparo snapshot nuevo contra el anterior.
- Como usuario, veo si hubo nueva actuacion.
- Como usuario, puedo marcar una novedad como revisada.

Tareas tecnicas:

- Crear tabla `case_snapshots`.
- Crear tabla `case_events`.
- Crear comparador de snapshots.
- Detectar cambio en fecha, nombre o anotacion de ultima actuacion.
- Crear evento `new_action` o `last_action_changed`.
- Crear evento `source_error` cuando aplique.
- Evitar eventos duplicados por el mismo resultado.
- Agregar accion de reconocer/revisar evento.

Criterios de aceptacion:

- La primera consulta crea snapshot sin duplicar eventos falsos.
- Una nueva actuacion genera evento visible.
- Consultas repetidas con mismo resultado no generan eventos duplicados.
- El evento conserva referencia al snapshot que lo origino.

---

### E6. Bandeja Operativa

Objetivo:

Convertir datos de consulta en una pantalla de decision.

Historias:

- Como usuario, puedo ver procesos con novedad.
- Como usuario, puedo ver procesos sin cambios.
- Como usuario, puedo ver procesos no consultados.
- Como usuario, puedo filtrar por fecha, responsable, prioridad y estado.
- Como usuario, puedo abrir el detalle de un proceso.

Tareas tecnicas:

- Crear vista principal de bandeja.
- Crear tabs o filtros: novedades, sin cambios, no consultados, error de fuente.
- Crear filtros temporales: 24 horas, 7 dias, 30 dias, todos.
- Mostrar columnas minimas: radicado, estado, ultima actuacion, anotacion, fecha, responsable.
- Crear detalle de proceso con historial.
- Usar estados visuales del design system.
- Mostrar fecha de ultima consulta exitosa.
- Mostrar fecha de ultimo intento.

Criterios de aceptacion:

- El usuario entiende en menos de 30 segundos que requiere atencion.
- Los estados operativos son visibles sin abrir cada proceso.
- Los errores de fuente no se ocultan.
- La bandeja funciona con al menos 300 procesos en beta controlada.

---

### E7. Alertas Y Comunicaciones

Objetivo:

Notificar novedades sin saturar al usuario.

Historias:

- Como usuario responsable, quiero recibir alertas de mis casos.
- Como admin, quiero recibir resumen diario de la cuenta.
- Como sistema, quiero registrar si una notificacion se envio o fallo.

Tareas tecnicas:

- Crear tabla `notifications`.
- Definir preferencias basicas por usuario.
- Crear resumen diario por cuenta.
- Crear resumen por responsable.
- Elegir proveedor de correo transaccional.
- Enviar correo de prueba.
- Registrar estado de envio.
- Dejar abstraccion de canal para futuro WhatsApp.

Criterios de aceptacion:

- El sistema genera resumen diario con novedades y fallas.
- La notificacion queda registrada aunque falle.
- Las alertas se agrupan para evitar saturacion.
- La arquitectura permite agregar WhatsApp como canal sin rehacer eventos.

---

### E8. Lex Operativo MVP

Objetivo:

Dar una capa de observacion y comunicacion limitada sobre datos estructurados.

Historias:

- Como usuario, puedo abrir un panel de Lex.
- Como usuario, puedo elegir preguntas sugeridas.
- Como usuario, recibo respuestas basadas en mis procesos.
- Como usuario, puedo convertir una respuesta en filtro de bandeja.

Preguntas MVP:

- Que procesos se movieron hoy?
- Cuales no se pudieron consultar?
- Cuales tienen error de fuente?
- Cuales son de alta prioridad?
- Que responsable tiene mas pendientes?
- Que procesos llevan mas tiempo sin cambios?

Tareas tecnicas:

- Crear panel lateral de Lex.
- Crear catalogo de intents permitidos.
- Crear servicio de consulta estructurada.
- Crear respuestas con enlaces a filtros/procesos.
- Guardar threads y mensajes si aplica.
- Evitar respuestas juridicas sustantivas.
- Agregar textos de limitacion operativa.
- Aplicar contrato `docs/producto/lex_voice_contract.md`.

Criterios de aceptacion:

- Lex responde solo con datos de la cuenta activa.
- Toda respuesta puede explicar de donde sale.
- Lex no inventa informacion.
- Lex no usa tono de chatbot, soporte o asistente generico.
- Cada respuesta importante tiene accion: abrir filtro, abrir proceso o ver detalle.

---

### E9. Panel Admin Y Operacion Interna

Objetivo:

Controlar la beta, diagnosticar errores y medir uso.

Historias:

- Como admin de plataforma, puedo ver cuentas beta.
- Como admin, puedo ver volumen de procesos.
- Como admin, puedo ver salud de fuente CPNU.
- Como admin, puedo diagnosticar fallas recurrentes.

Tareas tecnicas:

- Crear tabla `source_health`.
- Crear vista admin minima.
- Mostrar total cuentas, usuarios y procesos.
- Mostrar consultas exitosas/fallidas.
- Mostrar errores por fuente.
- Mostrar cuentas con mayor volumen.
- Agregar logs consultables para soporte.

Criterios de aceptacion:

- El equipo puede saber si CPNU esta fallando.
- El equipo puede identificar cuentas afectadas.
- El equipo puede revisar ultimos errores sin entrar a base de datos manualmente.

---

### E10. Landing, Diagnostico Y Activacion Beta

Objetivo:

Tener un instrumento comercial publicado mientras se construye el MVP.

Historias:

- Como prospecto, entiendo el problema en menos de 10 segundos.
- Como prospecto, puedo hacer diagnostico de riesgo operativo.
- Como prospecto, puedo interactuar con una bandeja demo.
- Como prospecto, puedo probar el companion demo.
- Como equipo comercial, puedo capturar leads beta.

Tareas tecnicas/comerciales:

- Refinar landing con principio Por que -> Como -> Que.
- Mantener diagnostico como CTA principal.
- Crear bandeja demo interactiva dentro del flujo.
- Crear companion demo con preguntas guiadas y datos simulados.
- Aplicar contrato de demo `docs/producto/lex_landing_demo_contract.md`.
- Aplicar contrato de activacion `docs/producto/demo_gratuita_controlada_contract.md`.
- Capturar datos de interesado.
- Definir destino de leads: Supabase, correo o CRM simple.
- Crear pagina o seccion de beta fundadora.
- Crear guion de seguimiento para leads.

Criterios de aceptacion:

- El usuario puede completar diagnostico en menos de 3 minutos.
- La landing demuestra el producto sin pedir datos sensibles.
- El companion demo refuerza la tesis de control operativo.
- Cada lead queda registrado para seguimiento.

---

## 4. Plan Por Sprints

### Sprint 0 - Cierre De Preparacion

Objetivo:

Dejar bases de ejecucion listas.

Entregables:

- PRD cerrado.
- Backlog tecnico aprobado.
- Stack definitivo validado.
- Modelo de datos inicial dibujado.
- Ambientes definidos.
- Landing actual revisada contra estrategia.

Checklist:

- [ ] Confirmar stack frontend/backend.
- [ ] Confirmar Supabase como base inicial.
- [ ] Confirmar proveedor de deploy.
- [ ] Confirmar dominio publico.
- [ ] Definir proveedor de correo.
- [ ] Crear tablero de tareas.
- [ ] Priorizar Sprint 1.

---

### Sprint 1 - Fundacion SaaS

Objetivo:

Crear cuentas, usuarios, roles y aislamiento de datos.

Backlog:

- [ ] Crear migraciones `accounts`.
- [ ] Crear perfiles de usuario.
- [ ] Configurar autenticacion.
- [ ] Configurar roles basicos.
- [ ] Aplicar RLS por `account_id`.
- [ ] Crear cuenta demo.
- [ ] Crear layout base SaaS.
- [ ] Crear pantalla inicial post-login.

Aceptacion:

- [ ] Usuario autenticado entra a su cuenta.
- [ ] Datos quedan aislados por cuenta.
- [ ] Hay base visual del producto autenticado.

---

### Sprint 2 - Procesos Y Carga

Objetivo:

Permitir cargar procesos reales.

Backlog:

- [ ] Crear tablas `clients`, `cases`, `case_sources`.
- [ ] Crear formulario de proceso individual.
- [ ] Crear carga masiva por texto/CSV simple.
- [ ] Validar radicado.
- [ ] Detectar duplicados.
- [ ] Asignar responsable.
- [ ] Asignar prioridad.
- [ ] Crear listado de procesos.

Aceptacion:

- [ ] Cuenta beta puede cargar 50+ procesos.
- [ ] El sistema muestra invalidos y duplicados.
- [ ] Procesos quedan listos para consulta.

---

### Sprint 3 - Conector CPNU

Objetivo:

Consultar Rama Judicial/CPNU de forma normalizada.

Backlog:

- [ ] Crear modulo `connector-cpnu`.
- [ ] Definir tipos de respuesta.
- [ ] Consultar por radicado.
- [ ] Extraer ultima actuacion textual.
- [ ] Extraer anotacion.
- [ ] Extraer despacho.
- [ ] Manejar no encontrado.
- [ ] Manejar error de fuente.
- [ ] Agregar radicados de prueba.

Aceptacion:

- [ ] Radicado encontrado devuelve snapshot normalizable.
- [ ] Radicado sin registros devuelve `not_found`.
- [ ] Error tecnico devuelve `source_error`.

---

### Sprint 4 - Jobs, Snapshots Y Eventos

Objetivo:

Crear trazabilidad y deteccion de cambios.

Backlog:

- [ ] Crear `query_jobs`.
- [ ] Crear ejecucion manual de consulta.
- [ ] Crear ejecucion por lote.
- [ ] Crear `case_snapshots`.
- [ ] Crear `case_events`.
- [ ] Comparar snapshots.
- [ ] Detectar nueva actuacion.
- [ ] Evitar eventos duplicados.

Aceptacion:

- [ ] Toda consulta deja job.
- [ ] Toda consulta exitosa deja snapshot.
- [ ] Todo cambio relevante deja evento.
- [ ] Fallas quedan visibles.

---

### Sprint 5 - Bandeja Operativa

Objetivo:

Crear la pantalla central del producto.

Backlog:

- [ ] Crear bandeja principal.
- [ ] Crear vistas por estado.
- [ ] Crear filtros de tiempo.
- [ ] Crear filtros por responsable y prioridad.
- [ ] Crear detalle de proceso.
- [ ] Mostrar ultima actuacion textual.
- [ ] Mostrar anotacion.
- [ ] Mostrar ultima consulta exitosa y ultimo intento.
- [ ] Aplicar design system LexControl.

Aceptacion:

- [ ] Usuario ve novedades, sin cambios y fallas.
- [ ] Usuario puede filtrar por ultimas 24h, semana, 30 dias y todos.
- [ ] Usuario puede abrir detalle de proceso.
- [ ] La bandeja se siente como control panel, no como CRM.

---

### Sprint 6 - Alertas, Admin Y Companion Inicial

Objetivo:

Completar circuito operativo beta.

Backlog:

- [ ] Crear `notifications`.
- [ ] Crear resumen diario por cuenta.
- [ ] Crear resumen por responsable.
- [ ] Enviar correo transaccional.
- [ ] Crear `source_health`.
- [ ] Crear panel admin minimo.
- [ ] Crear companion panel.
- [ ] Crear preguntas sugeridas.
- [ ] Crear respuestas por datos estructurados.

Aceptacion:

- [ ] Admin recibe resumen diario.
- [ ] Responsable puede recibir resumen propio.
- [ ] Admin interno puede ver salud de fuente.
- [ ] Companion responde preguntas operativas basicas.

---

### Sprint 7 - Beta Cerrada

Objetivo:

Operar con usuarios y procesos reales.

Backlog:

- [ ] Crear 5 a 10 cuentas beta.
- [ ] Cargar 300 a 800 procesos reales.
- [ ] Medir tasa de consulta exitosa.
- [ ] Registrar errores no clasificados.
- [ ] Ejecutar onboarding asistido.
- [ ] Recoger feedback de uso.
- [ ] Ajustar copy de landing con aprendizajes.
- [ ] Ejecutar primeras conversaciones comerciales.

Aceptacion:

- [ ] 70% o mas de procesos consultados exitosamente en CPNU.
- [ ] Menos de 5% de errores no clasificados.
- [ ] Usuarios entienden la bandeja sin explicacion larga.
- [ ] Al menos 3 cuentas aceptan pagar plan mensual posterior.

---

## 5. Orden Recomendado De Implementacion

La secuencia recomendada para construir sin desorden:

```text
1. Modelo de datos
2. Auth y cuentas
3. Carga de procesos
4. Conector CPNU
5. Jobs y snapshots
6. Eventos
7. Bandeja
8. Alertas
9. Companion inicial
10. Admin beta
11. Beta cerrada
```

El landing y la activacion corren en paralelo:

```text
Landing publicada
Diagnostico activo
Bandeja demo usable
Companion demo usable
Captura de leads
Guion de seguimiento
```

---

## 6. Dependencias Criticas

### Tecnicas

- Supabase configurado.
- Auth y RLS listos antes de cargar datos reales.
- Conector CPNU estable antes de prometer beta.
- Logs y snapshots antes de alertas.
- Eventos antes de companion operativo.

### Producto

- Design system aplicado a bandeja y landing.
- Principios de comunicacion aplicados a todo copy.
- Estados operativos visibles.
- Companion limitado a preguntas utiles.

### Comercial

- Landing compartible.
- Diagnostico funcional.
- Oferta beta fundadora definida.
- Lista de prospectos inicial.
- Guion de llamada listo.

---

## 7. Riesgos Del Backlog

### R1. Fuente CPNU Cambia O Falla

Impacto:

Alto.

Respuesta:

- Registrar error.
- Mostrar no consultados.
- No ocultar fallas.
- Mantener conector desacoplado.

### R2. MVP Se Vuelve Demasiado Grande

Impacto:

Alto.

Respuesta:

- Priorizar bandeja + CPNU + trazabilidad.
- Dejar WhatsApp, SAMAI, pagos e IA avanzada fuera del MVP.

### R3. Landing Se Convierte En Pagina Informativa

Impacto:

Medio.

Respuesta:

- Mantener diagnostico como instrumento principal.
- Hacer la bandeja demo interactiva.
- Usar companion demo como demostracion del valor.

### R4. Companion Se Vuelve Cosmetico

Impacto:

Medio.

Respuesta:

- Responder solo con datos estructurados.
- Enlazar siempre a filtros o procesos.
- Medir uso en beta.

---

## 8. Definition Of Done MVP

El MVP se considera listo para beta cuando:

- [ ] Existe autenticacion y separacion por cuenta.
- [ ] Una cuenta puede cargar procesos masivamente.
- [ ] El sistema consulta CPNU por radicado.
- [ ] Toda consulta genera job.
- [ ] Toda consulta exitosa genera snapshot.
- [ ] Los cambios generan eventos.
- [ ] La bandeja muestra novedades, sin cambios, no consultados y errores.
- [ ] Los filtros principales funcionan.
- [ ] Se muestra ultima actuacion textual y anotacion.
- [ ] Se registra ultima consulta exitosa y ultimo intento.
- [ ] Existen responsables por proceso.
- [ ] Existen prioridades.
- [ ] Hay resumen diario o alerta basica.
- [ ] Hay panel admin minimo.
- [ ] Hay companion inicial con preguntas guiadas.
- [ ] Landing y diagnostico capturan interesados.
- [ ] El sistema puede operar 300 procesos reales en beta controlada.

---

## 9. Proximo Paso De Ejecucion

El siguiente movimiento recomendado:

```text
Tomar Sprint 1 y convertirlo en migraciones Supabase,
estructura de frontend autenticado y primera cuenta demo.
```

Checklist inmediato:

- [ ] Definir modelo relacional v1.
- [ ] Crear migracion inicial.
- [ ] Crear politicas RLS.
- [ ] Crear seed de cuenta demo.
- [ ] Crear layout SaaS autenticado.
- [ ] Definir ruta de carga de procesos.
