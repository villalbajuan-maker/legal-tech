# Product Requirements

## MVP SaaS - Sistema Operativo De Vigilancia Judicial

Documento complementario obligatorio para narrativa de producto y direccion de negocio:

```text
docs/producto/problem-solution-fit-lexcontrol.md
```

### 1. Decision De Producto

Se decide construir una microSaaS de vigilancia judicial para abogados, firmas pequenas, operadores legales y equipos juridicos que necesitan monitorear procesos judiciales de forma recurrente.

El producto deja de ser una automatizacion puntual para Legal Search y pasa a ser una plataforma SaaS propia.

Tesis del producto:

```text
Sistema operativo de vigilancia judicial para saber que cambio,
que no cambio y que no se pudo consultar.
```

El producto no debe venderse como un scraper. Debe venderse como una herramienta de control operativo, trazabilidad y alertas sobre procesos judiciales.

### 2. Vision

Construir una plataforma que permita a abogados y firmas:

- Cargar sus procesos judiciales.
- Consultar fuentes judiciales disponibles.
- Detectar novedades y actuaciones recientes.
- Ver ultima actuacion y anotacion.
- Recibir alertas.
- Conocer que procesos no pudieron consultarse.
- Mantener trazabilidad de cada consulta.
- Reducir revision manual diaria.

La vision de largo plazo es crear una infraestructura de vigilancia judicial multifuente, escalable y monetizable por cuentas, procesos vigilados y servicios adicionales.

### 3. Usuario Objetivo

#### Usuario Primario

Abogado litigante o firma pequena que maneja volumen recurrente de procesos y actualmente revisa manualmente Rama Judicial, Excel o reportes de dependientes.

Perfil:

- 50 a 500 procesos judiciales.
- Revisa procesos semanal o diariamente.
- Usa Excel, WhatsApp o correo para seguimiento.
- Tiene riesgo de perder actuaciones.
- Puede pagar una suscripcion mensual.

#### Usuario Secundario

Operador de vigilancia judicial que presta servicios a terceros.

Perfil:

- Maneja procesos de varios clientes.
- Necesita bandeja operativa.
- Requiere trazabilidad y reportes.
- Puede revender o prestar vigilancia usando la plataforma.

#### Usuario Futuro

Equipo juridico corporativo o firma mediana.

Perfil:

- Requiere usuarios multiples.
- Necesita reportes, clientes internos, SLA y controles.
- Puede pagar planes superiores o enterprise.

### 4. Problema Principal

La vigilancia judicial manual tiene cuatro problemas:

- Consume tiempo operativo.
- Depende de disciplina humana.
- No deja trazabilidad suficiente.
- No escala bien cuando aumenta el numero de procesos.

El usuario necesita saber:

```text
Que procesos tuvieron novedad.
Que procesos siguen igual.
Que procesos no pudieron consultarse.
Que actuaciones recientes existen.
Que casos requieren revision humana.
```

### 5. Propuesta De Valor

La plataforma convierte una lista de radicados en una bandeja diaria de control judicial.

Valor principal:

- Ahorro de tiempo.
- Menos riesgo de omision.
- Mejor organizacion.
- Trazabilidad.
- Alertas.
- Capacidad de escalar procesos.

Mensaje de producto:

```text
Carga tus radicados, consulta automaticamente Rama Judicial,
detecta la ultima actuacion y recibe una bandeja de novedades.
```

### 6. Principios De Experiencia Y Diferenciacion

El producto no debe limitarse a una interfaz funcional de consultas, tablas y notificaciones. La experiencia debe ser parte central del diferencial competitivo.

Principio:

```text
La operacion tecnica debe sentirse como control, claridad y criterio.
No como una lista fria de radicados.
```

La UI/UX debe considerar desde el inicio:

- Diseno contemporaneo y sobrio.
- Arquitectura visual clara.
- Jerarquia de informacion por prioridad.
- Iconografia propia y consistente.
- Tipografia legible y profesional.
- Colores asociados a estado operativo, riesgo y confianza.
- Paneles que ayuden a decidir, no solo a mirar datos.
- Flujos simples para usuarios no tecnicos.
- Interacciones que reduzcan ansiedad operativa.
- Diferenciacion visual frente a competidores que se ven como listados o herramientas administrativas genericas.

El producto debe transmitir:

- Precision.
- Confianza.
- Control.
- Trazabilidad.
- Modernidad.
- Criterio juridico-operativo.

#### Companion / Copilot Operativo

Se considera como diferencial de producto incorporar un companion o copiloto conversacional dentro del dashboard.

El companion recibe el nombre operativo de Lex.

Lex no debe ser un chat cosmetico, un asistente generico ni un personaje. Debe funcionar como la voz del sistema: una capa de observacion y comunicacion que expone con precision que ocurrio, que no ocurrio y que fallo en la operacion.

Contrato obligatorio:

```text
docs/producto/lex_voice_contract.md
```

Casos de uso esperados:

- Preguntar que procesos tuvieron movimiento hoy.
- Pedir resumen de novedades de la semana.
- Consultar que procesos llevan mas tiempo sin movimiento.
- Preguntar que procesos no pudieron consultarse.
- Identificar casos con mayor prioridad.
- Pedir explicacion de errores de fuente.
- Convertir preguntas en filtros sobre la bandeja.
- Generar resumen por responsable o cliente interno.

Ejemplos:

```text
Que procesos se movieron en las ultimas 24 horas?
Cuales casos llevan mas de 90 dias sin actuacion?
Que procesos de mi cliente X tuvieron novedad esta semana?
Que procesos no pudieron consultarse hoy?
Muestrame los casos de alta prioridad con error de fuente.
```

Vision:

```text
Lex es la capa que muestra lo que la operacion no puede ver.
```

Para MVP, el companion puede iniciar como una experiencia limitada:

- Sugerencias predefinidas.
- Consultas guiadas.
- Resumen de dashboard.
- Filtros generados desde preguntas.

La capa generativa avanzada puede quedar para fases posteriores, pero la arquitectura debe contemplarla desde el inicio.

#### Comunicaciones Multicanal

El correo es el canal inicial por simplicidad, pero en Colombia WhatsApp es un canal critico.

La arquitectura debe permitir que las alertas no dependan de un solo canal.

Canales previstos:

- Dashboard.
- Correo electronico.
- WhatsApp.
- Futuro: resumen descargable o reporte programado.

WhatsApp no entra como obligacion del MVP inicial, pero debe quedar previsto como add-on o plan superior.

#### Responsables Y Sillas

El modelo de usuarios no debe ser solo "personas que entran al sistema". Debe soportar operacion por responsables.

Cada proceso puede tener:

- Responsable principal.
- Usuarios observadores.
- Cliente interno.
- Prioridad.
- Preferencias de alerta.

Esto permite que cada abogado o dependiente reciba recordatorios y novedades de sus propios casos, sin saturar a toda la cuenta.

#### Consola Admin Interna

LexControl debe contar con una consola interna separada de la app del cliente.

Superficie congelada:

```text
admin.lexcontrol.co
```

Su funcion es permitir que el equipo de LexControl opere:

- activaciones
- cuentas
- limites
- responsables
- salud operativa de las cuentas

Contrato:

```text
docs/producto/contrato-consola-admin-lexcontrol.md
```

#### UI Operativa De La App

La app del cliente no debe construirse como una sola pagina de modulos apilados.

Debe responder a una arquitectura explicita de interfaz y navegacion.

Superficie:

```text
app.lexcontrol.co
```

Contrato:

```text
docs/producto/contrato-ui-app-operativa-lexcontrol.md
```

#### Priorizacion Operativa

La priorizacion es doble:

1. Valor para el usuario: saber que casos requieren mas atencion.
2. Valor tecnico: evitar consultar todo con la misma frecuencia y reducir riesgo de bloqueo por volumen.

La plataforma debe contemplar niveles de prioridad:

- Alta.
- Media.
- Baja.
- Critica.

Factores de prioridad:

- Ultima actuacion reciente.
- Proceso con audiencia o termino.
- Cliente premium.
- Proceso sin consulta exitosa reciente.
- Error de fuente.
- Movimiento frecuente.
- Marcacion manual por usuario.

La prioridad debe influir en:

- Frecuencia de consulta.
- Orden de bandeja.
- Alertas.
- Reportes.
- Visibilidad en el companion.

### 7. Principio De Comunicacion

Toda comunicacion de LexControl debe construirse desde la logica:

```text
Por que
↓
Como
↓
Que
```

Este principio no debe aparecer necesariamente como titulos literales. Debe operar como estructura interna de pensamiento para cualquier mensaje, flujo, subflujo, demo, landing, email, WhatsApp, pitch comercial, companion o onboarding.

Regla:

```text
Antes de explicar que hace LexControl,
debemos hacer visible por que importa.
```

Aplicacion a LexControl:

```text
Por que:
No puedes controlar lo que no puedes ver.

Como:
LexControl convierte consultas, fallas y novedades en una bandeja de control operativo.

Que:
Sistema operativo de vigilancia judicial con estados, trazabilidad, responsables, alertas y companion.
```

La comunicacion no debe partir de funcionalidades como:

```text
Automatizamos consultas judiciales.
```

Debe partir de la tension real:

```text
El problema no es revisar procesos.
Es no saber que no fue revisado.
```

Esto aplica tambien a la experiencia de producto:

- El diagnostico hace visible el riesgo.
- La bandeja demuestra el control.
- El companion traduce preguntas operativas en filtros, resumenes y acciones.
- Las alertas existen porque la informacion solo sirve si llega al responsable correcto.

### 8. Alcance MVP

El MVP debe permitir operar una beta cerrada con clientes reales.

Incluye:

- Multi-tenant basico.
- Cuentas y usuarios.
- Carga de procesos.
- Consulta CPNU / Rama Judicial.
- Ultima actuacion.
- Anotacion de actuacion.
- Historial de consultas.
- Snapshots.
- Eventos de novedad.
- Bandeja operativa.
- Estado de fuente.
- Procesos no consultados.
- Alertas basicas por correo.
- Panel admin minimo.
- Responsables por proceso.
- Prioridad de proceso.
- Arquitectura preparada para WhatsApp.
- Arquitectura preparada para companion / copilot.

No incluye en MVP:

- Automatizacion completa de SAMAI.
- Bypass de CAPTCHA.
- Inteligencia artificial juridica.
- Prediccion avanzada de terminos.
- App movil nativa.
- Pasarela de pagos completa.
- Portal cliente final avanzado.
- Automatizacion completa de todas las fuentes.
- Companion generativo avanzado.
- WhatsApp automatico productivo como canal base.

### 9. Modulos MVP

#### 9.1 Autenticacion Y Cuentas

Objetivo:

Permitir que cada cliente tenga una cuenta separada.

Funcionalidades:

- Registro o creacion manual de cuenta.
- Login.
- Usuarios asociados a cuenta.
- Rol admin de cuenta.
- Rol usuario operativo.
- Usuarios responsables de procesos.
- Separacion de datos por cuenta.

Requisito clave:

```text
Ninguna cuenta debe ver procesos, clientes, consultas o alertas de otra cuenta.
```

#### 9.2 Gestion De Procesos

Objetivo:

Permitir cargar y administrar procesos judiciales.

Funcionalidades:

- Crear proceso por radicado.
- Carga masiva de radicados.
- Validacion basica de longitud y formato.
- Asociar proceso a cliente interno.
- Asociar responsable.
- Definir prioridad.
- Activar o pausar vigilancia.
- Ver estado del proceso.

Campos minimos:

- Radicado.
- Cuenta.
- Cliente interno.
- Responsable.
- Prioridad.
- Estado de vigilancia.
- Fecha de creacion.
- Fecha de ultima consulta.

#### 9.3 Conector CPNU / Rama Judicial

Objetivo:

Consultar la Consulta Nacional Unificada por radicado.

Funcionalidades:

- Buscar proceso por numero de radicado.
- Consultar detalle cuando exista.
- Consultar actuaciones.
- Extraer ultima actuacion.
- Extraer anotacion.
- Extraer despacho.
- Extraer estado si esta disponible.
- Manejar proceso no encontrado.
- Manejar errores de fuente.

Fuente inicial:

```text
https://consultaprocesos.ramajudicial.gov.co/
```

Requisito:

```text
Toda consulta debe dejar registro aunque falle.
```

#### 9.4 Motor De Consultas

Objetivo:

Ejecutar consultas programadas o manuales sin depender de accion individual proceso por proceso.

Funcionalidades:

- Crear jobs de consulta.
- Ejecutar consultas por lote.
- Consultar proceso individual bajo demanda.
- Registrar resultado.
- Reintentar errores recuperables.
- Evitar duplicar consultas simultaneas al mismo proceso.
- Respetar limites razonables de frecuencia.

Prioridad inicial:

- Procesos activos.
- Procesos con ultima actuacion reciente.
- Procesos criticos.
- Procesos no consultados recientemente.

#### 9.5 Snapshots Y Eventos

Objetivo:

Guardar el estado observado en cada consulta y detectar cambios.

Snapshot:

Registro del estado de un proceso en un momento determinado.

Evento:

Cambio relevante detectado entre snapshot anterior y snapshot nuevo.

Eventos MVP:

- Nueva actuacion.
- Cambio en ultima actuacion.
- Cambio de despacho.
- Proceso no encontrado.
- Fuente no disponible.
- Consulta fallida.

#### 9.6 Bandeja Operativa

Objetivo:

Convertir consultas en accion.

Vistas:

- Todos los procesos.
- Con novedad.
- Sin cambios.
- No consultados.
- No encontrados.
- Error de fuente.
- Ultimas 24 horas.
- Ultima semana.
- Ultimos 30 dias.

Columnas minimas:

- Radicado.
- Cliente.
- Despacho.
- Ultima actuacion.
- Anotacion.
- Fecha ultima actuacion.
- Fecha ultima consulta.
- Estado de consulta.
- Prioridad.
- Responsable.

#### 9.7 Alertas Basicas

Objetivo:

Notificar novedades sin saturar al usuario.

Canal MVP:

- Correo electronico.
- Dashboard.

Tipos:

- Resumen diario.
- Nueva actuacion.
- Procesos no consultados.
- Error de fuente persistente.

No incluir inicialmente:

- WhatsApp automatico.
- SMS.
- Push mobile.

Consideracion:

```text
La arquitectura de alertas debe permitir agregar WhatsApp sin redisenar el sistema.
```

#### 9.8 Panel Administrativo

Objetivo:

Permitir control minimo del producto SaaS.

Metricas:

- Total cuentas.
- Total usuarios.
- Total procesos vigilados.
- Consultas exitosas.
- Consultas fallidas.
- Procesos con novedad.
- Estado de fuente CPNU.
- Uso por cuenta.

#### 9.9 Companion / Copilot Operativo

Objetivo:

Incorporar Lex como capa de observacion y comunicacion del sistema, conectada a los datos del dashboard.

Alcance MVP recomendado:

- Boton o panel lateral de Lex.
- Preguntas sugeridas.
- Resumen del dashboard.
- Atajos a filtros.
- Respuestas basadas en datos estructurados.
- Respuestas sujetas al contrato `docs/producto/lex_voice_contract.md`.

Preguntas iniciales:

- Procesos con novedad hoy.
- Procesos no consultados.
- Procesos con error de fuente.
- Procesos sin movimiento reciente.
- Procesos por responsable.
- Procesos de alta prioridad.

No incluir en MVP:

- Respuestas juridicas sustantivas.
- Consejos legales.
- Analisis generativo sin trazabilidad.

Regla:

```text
Lex no reemplaza el criterio del abogado.
Lex observa, resume y expone senales operativas.
Debe explicar de donde salen sus respuestas y enlazar a los datos.
```

#### 9.10 Comunicaciones Y Responsables

Objetivo:

Soportar comunicacion por usuario responsable, no solamente por cuenta.

Funcionalidades MVP:

- Asignar responsable a proceso.
- Enviar resumen al admin de cuenta.
- Preparar preferencias de notificacion por usuario.

Funcionalidades posteriores:

- WhatsApp por responsable.
- Alertas por cliente interno.
- Reglas por prioridad.
- Resumen semanal por abogado.

### 10. Entidades De Datos

#### accounts

Representa una organizacion, abogado independiente, firma u operador.

Campos:

- id.
- name.
- plan.
- status.
- created_at.
- trial_ends_at.

#### users

Usuarios autenticados.

Campos:

- id.
- account_id.
- email.
- full_name.
- role.
- notification_email.
- notification_phone.
- notification_preferences.
- status.
- created_at.

#### clients

Clientes internos de una cuenta.

Campos:

- id.
- account_id.
- name.
- type.
- status.
- created_at.

#### cases

Procesos vigilados.

Campos:

- id.
- account_id.
- client_id.
- assigned_user_id.
- radicado.
- jurisdiction.
- specialty.
- court_name.
- source_primary.
- priority.
- watch_status.
- monitoring_frequency.
- last_checked_at.
- last_successful_check_at.
- created_at.

#### case_sources

Relacion entre proceso y fuente consultable.

Campos:

- id.
- case_id.
- source.
- external_process_id.
- source_status.
- last_checked_at.
- last_error.

#### query_jobs

Intentos de consulta programados o manuales.

Campos:

- id.
- account_id.
- case_id.
- source.
- status.
- scheduled_at.
- started_at.
- finished_at.
- error_code.
- error_message.

#### case_snapshots

Estado observado de un proceso.

Campos:

- id.
- case_id.
- source.
- query_job_id.
- observed_at.
- court_name.
- process_status.
- last_action_date.
- last_action_name.
- last_action_annotation.
- raw_payload_ref.

#### case_events

Eventos derivados de cambios.

Campos:

- id.
- account_id.
- case_id.
- event_type.
- event_date.
- title.
- description.
- source.
- snapshot_id.
- acknowledged_at.

#### notifications

Alertas enviadas o pendientes.

Campos:

- id.
- account_id.
- user_id.
- case_id.
- event_id.
- channel.
- status.
- sent_at.
- error_message.

#### source_health

Estado operativo de cada fuente.

Campos:

- id.
- source.
- status.
- checked_at.
- latency_ms.
- error_rate.
- notes.

#### communication_channels

Canales disponibles para alertas.

Campos:

- id.
- account_id.
- channel.
- provider.
- status.
- configuration_ref.
- created_at.

#### companion_threads

Conversaciones del companion.

Campos:

- id.
- account_id.
- user_id.
- title.
- created_at.
- updated_at.

#### companion_messages

Mensajes y respuestas del companion.

Campos:

- id.
- thread_id.
- role.
- content.
- query_intent.
- referenced_entities.
- created_at.

#### priority_rules

Reglas configurables o internas de priorizacion.

Campos:

- id.
- account_id.
- name.
- condition_type.
- priority_result.
- is_active.
- created_at.

### 11. Flujos Principales

#### Flujo 1: Activacion De Cuenta

```text
Crear cuenta
↓
Crear usuario admin
↓
Entrar al dashboard
↓
Cargar primeros radicados
↓
Ejecutar primera consulta
↓
Mostrar bandeja inicial
```

Momento de valor:

```text
El usuario ve sus propios procesos consultados.
```

#### Flujo 2: Carga Masiva

```text
Usuario sube lista de radicados
↓
Sistema valida formato
↓
Sistema crea procesos
↓
Sistema agenda consultas iniciales
↓
Sistema muestra resultados por estado
```

Estados posibles:

- Valido.
- Duplicado.
- Formato invalido.
- Creado.
- En consulta.

#### Flujo 3: Consulta Programada

```text
Scheduler identifica procesos pendientes
↓
Crea query_jobs
↓
Worker ejecuta consulta CPNU
↓
Guarda snapshot
↓
Compara contra snapshot anterior
↓
Crea evento si hay novedad
↓
Actualiza bandeja
```

#### Flujo 4: Deteccion De Novedad

```text
Snapshot nuevo
↓
Comparar ultima actuacion con snapshot anterior
↓
Si cambia fecha, nombre o anotacion
↓
Crear evento de nueva actuacion
↓
Marcar proceso como con novedad
```

#### Flujo 5: Alerta Diaria

```text
Sistema agrupa eventos del dia
↓
Genera resumen por cuenta / usuario
↓
Envia correo
↓
Registra notificacion
```

#### Flujo 6: Fuente Con Error

```text
Consulta falla
↓
Registrar query_job fallido
↓
Actualizar source_health si aplica
↓
Marcar proceso como no consultado
↓
Mostrar en bandeja de errores
```

#### Flujo 7: Consulta Con Companion

```text
Usuario abre companion
↓
Selecciona pregunta sugerida o escribe pregunta
↓
Sistema identifica intencion
↓
Sistema consulta datos estructurados de su cuenta
↓
Sistema responde con resumen y enlaces a procesos
↓
Usuario puede abrir filtro o detalle
```

#### Flujo 8: Alerta Por Responsable

```text
Proceso tiene responsable asignado
↓
Se detecta evento relevante
↓
Sistema verifica preferencias del responsable
↓
Envia alerta por canal disponible
↓
Registra notificacion
```

#### Flujo 9: Priorizacion De Consulta

```text
Scheduler evalua procesos activos
↓
Calcula prioridad operativa
↓
Ordena lote de consultas
↓
Consulta primero procesos criticos y alta prioridad
↓
Difiere procesos de baja prioridad si hay limite tecnico
```

### 12. Reglas De Negocio

#### Reglas De Cuentas

- Una cuenta solo puede ver sus datos.
- Todo proceso pertenece a una cuenta.
- Todo usuario pertenece a una cuenta.
- El plan define limites de procesos.

#### Reglas De Procesos

- El radicado es obligatorio.
- No debe haber duplicados activos del mismo radicado dentro de una cuenta.
- Un proceso puede estar activo, pausado o archivado.
- Solo procesos activos se consultan automaticamente.
- Un proceso puede tener un responsable principal.
- La prioridad puede ser manual o calculada.

#### Reglas De Consulta

- Toda consulta debe generar un query_job.
- Toda consulta exitosa debe generar snapshot.
- Una consulta fallida debe registrar error.
- La ausencia de novedades no debe interpretarse como error.
- Si la fuente no responde, el proceso queda como no consultado.

#### Reglas De Eventos

- Solo se crea evento si hay cambio relevante.
- El evento debe asociarse a un snapshot.
- El usuario puede marcar evento como revisado.
- Los eventos no deben duplicarse por consultas repetidas con el mismo resultado.

#### Reglas De Alertas

- Las alertas deben enviarse por cuenta.
- Un usuario solo recibe alertas de su cuenta.
- El resumen diario agrupa eventos para evitar saturacion.
- Los errores de fuente persistentes deben ser visibles.
- Las alertas deben poder dirigirse al responsable del proceso.
- WhatsApp debe tratarse como canal configurable, no como dependencia base.

#### Reglas Del Companion

- El companion solo puede consultar datos de la cuenta del usuario.
- El companion debe responder sobre datos existentes en el sistema.
- El companion no debe dar asesoria juridica sustantiva en MVP.
- Toda respuesta analitica debe poder enlazar a procesos, eventos o filtros.
- Las preguntas sugeridas deben priorizar acciones operativas.

#### Reglas De Priorizacion

- Los procesos criticos se consultan antes que los de baja prioridad.
- Procesos con error reciente pueden reintentarse con control.
- Procesos sin movimiento prolongado pueden consultarse con menor frecuencia.
- Procesos con actuacion reciente pueden consultarse con mayor frecuencia temporal.
- La prioridad debe ayudar a proteger la fuente contra consultas innecesarias.

### 13. Riesgos

#### Riesgo 1: Cambios En Fuentes Externas

Las fuentes publicas pueden cambiar estructura, limitar consultas o incorporar CAPTCHA.

Mitigacion:

- Conectores desacoplados.
- Logs de fuente.
- Estados de disponibilidad.
- Bandeja de no consultados.
- No prometer automatizacion absoluta.

#### Riesgo 2: Falsos Negativos

El sistema podria no detectar una actuacion por error de fuente o cambio de respuesta.

Mitigacion:

- Guardar snapshots.
- Mostrar ultima consulta exitosa.
- Alertar procesos no consultados.
- Permitir revision manual.

#### Riesgo 3: Sobrecarga De Fuente

Consultar demasiados procesos en poco tiempo puede generar bloqueos.

Mitigacion:

- Rate limits.
- Jobs escalonados.
- Priorizacion.
- Reintentos controlados.

#### Riesgo 4: Producto Percibido Como Scraper Barato

Si se comunica mal, compite por precio bajo.

Mitigacion:

- Vender control operativo.
- Incluir trazabilidad.
- Mostrar errores y fuente.
- Vender por cuenta y plan, no solo por radicado.

#### Riesgo 5: Baja Activacion

El usuario no ve valor si no carga procesos reales.

Mitigacion:

- Onboarding asistido en beta.
- Carga inicial guiada.
- Mostrar resultados en menos de 24 horas.

#### Riesgo 6: UI Percibida Como Herramienta Generica

Si la interfaz se limita a tablas y botones, el producto puede parecer un monitor mas.

Mitigacion:

- Diseñar una arquitectura visual propia.
- Incorporar companion como capa de decision.
- Usar estados, prioridad y resumen ejecutivo.
- Hacer que la bandeja responda preguntas operativas.

#### Riesgo 7: Companion Sin Valor Real

Un chat cosmetico puede distraer sin resolver problemas.

Mitigacion:

- Limitarlo inicialmente a datos estructurados.
- Usarlo como interfaz de filtros y resumen.
- Enlazar siempre a procesos y eventos.
- Evitar asesoria juridica en MVP.

#### Riesgo 8: Saturacion De Comunicaciones

Enviar demasiadas alertas puede generar fatiga.

Mitigacion:

- Resumen diario.
- Preferencias por responsable.
- Reglas por prioridad.
- Agrupacion de eventos.

### 14. Sprints Propuestos

Los sprints del producto deben avanzar en dos lineas paralelas:

```text
1. Build del producto SaaS.
2. Go-to-market, landing, narrativa comercial y activacion.
```

El landing page, el playbook de ventas y los perfiles comerciales no deben esperar a que el producto este completo. Deben construirse en paralelo para validar mensaje, captar interesados y preparar la beta.

#### Sprint 0: Preparacion

Objetivo:

Definir bases tecnicas y preparar repo para desarrollo SaaS.

Entregables:

- PRD aprobado.
- Modelo de datos inicial.
- Backlog MVP.
- Ambientes definidos.
- Mensaje comercial base.
- Estructura inicial del landing.
- Lista inicial de prospectos beta.

#### Sprint 1: Auth, Cuentas Y Base De Datos

Entregables:

- Accounts.
- Users.
- Roles basicos.
- RLS / separacion por cuenta.
- Responsables por proceso.
- Layout base SaaS.
- Wireframe del landing.
- Definicion de propuesta de valor publica.

#### Sprint 2: Procesos Y Carga Masiva

Entregables:

- CRUD de procesos.
- Clientes internos.
- Validacion de radicados.
- Carga masiva.
- Lista de procesos.
- Copy inicial del landing.
- Seccion de problema, solucion y beta fundadora.

#### Sprint 3: Conector CPNU Productivo

Entregables:

- Modulo connector-cpnu.
- Consulta por radicado.
- Detalle.
- Actuaciones.
- Normalizacion de respuesta.
- Manejo de errores.
- Landing page version 1.
- Formulario de interes o lista de espera.
- Mensaje para outreach por WhatsApp / LinkedIn.

#### Sprint 4: Jobs, Snapshots Y Eventos

Entregables:

- query_jobs.
- case_snapshots.
- case_events.
- Comparacion de snapshots.
- Nueva actuacion.
- Estado de consulta.
- Playbook de ventas beta.
- Guion de demo.
- Plantilla de diagnostico comercial.

#### Sprint 5: Bandeja Operativa

Entregables:

- Vista con novedades.
- Vista sin cambios.
- Vista no consultados.
- Filtros por tiempo.
- Detalle de proceso.
- Jerarquia visual por prioridad.
- Base visual del sistema operativo.
- Screenshots o mockups comerciales del producto.
- Contenido inicial para LinkedIn.
- Pagina de pricing preliminar o seccion de planes.

#### Sprint 6: Alertas Y Panel Admin

Entregables:

- Resumen diario por correo.
- Registro de notificaciones.
- Panel admin minimo.
- source_health.
- Preferencias de notificacion por usuario.
- Arquitectura preparada para WhatsApp.
- Perfiles sociales basicos.
- Secuencia de contacto para beta.
- Documento de objeciones y respuestas.

#### Sprint 7: Beta Cerrada

Entregables:

- Onboarding asistido.
- 5 a 10 cuentas beta.
- 300 a 800 procesos reales.
- Monitoreo de errores.
- Ajustes de usabilidad.
- Companion inicial con preguntas sugeridas.
- Landing conectado a beta/lista de espera.
- Primeras llamadas comerciales.
- Registro de conversiones y aprendizaje de ventas.

#### Sprint 8: Preparacion De Lanzamiento Publico

Entregables:

- Landing refinado con aprendizajes de beta.
- Casos de uso documentados.
- Testimonios o resultados anonimizados si aplica.
- Playbook comercial version 1.
- Kit comercial para demos.
- Perfiles sociales activos.
- Calendario de contenido inicial.
- Definicion de canales prioritarios: red directa, LinkedIn, WhatsApp, referidos y alianzas.

### 15. Listo Para Beta

El producto esta listo para beta cuando cumple:

- Se pueden crear cuentas y usuarios.
- Cada cuenta ve solo sus datos.
- Se pueden cargar radicados masivamente.
- El sistema consulta CPNU por radicado.
- El sistema muestra ultima actuacion y anotacion.
- El sistema registra historial de consultas.
- El sistema detecta cambios basicos.
- Existe bandeja de novedades.
- Existen estados de no consultado y error de fuente.
- Se puede enviar resumen diario por correo.
- Hay panel admin minimo.
- Hay logs suficientes para diagnosticar errores.
- Al menos 300 procesos reales pueden consultarse en beta controlada.
- Existe asignacion de responsable por proceso.
- Existe jerarquia visual de prioridad.
- Existe arquitectura de notificaciones extensible a WhatsApp.
- Existe companion inicial con preguntas sugeridas o resumen estructurado.
- Existe landing page basico para captar interesados.
- Existe mensaje comercial beta.
- Existe playbook minimo de ventas y diagnostico.
- Existe lista inicial de prospectos.

### 16. Metricas De Exito Beta

#### Producto

- 70% o mas de procesos consultados exitosamente en CPNU.
- 90% de radicados validos cargados correctamente.
- Menos de 5% de errores no clasificados.
- Tiempo hasta primer valor menor a 24 horas.
- Al menos 50% de usuarios beta usan filtros o companion durante la primera semana.
- Al menos 30% de procesos tienen responsable asignado en cuentas con mas de un usuario.

#### Negocio

- 5 a 10 cuentas beta.
- 300 a 800 procesos vigilados.
- Al menos 3 cuentas agregan nuevos procesos despues de la carga inicial.
- Al menos 3 cuentas aceptan pagar plan mensual posterior.
- Landing publicado o listo para compartir.
- Al menos 30 prospectos identificados.
- Al menos 10 conversaciones comerciales iniciadas.
- Al menos 5 demos o pruebas con radicados reales.

#### Operacion

- Errores de fuente visibles.
- Procesos no consultados visibles.
- Logs suficientes para soporte.
- Reintentos controlados.

### 17. Decisiones Congeladas Para MVP

- Fuente inicial: CPNU / Rama Judicial.
- Canal de alerta inicial: correo.
- Modelo inicial: SaaS multi-tenant.
- Beta inicial: asistida.
- Monetizacion: planes por cuenta y volumen de procesos.
- Posicionamiento: sistema operativo de vigilancia judicial.
- No se hara bypass de CAPTCHA.
- SAMAI y otras fuentes quedan para fases posteriores.
- La experiencia visual es parte del diferencial, no una capa secundaria.
- El companion se considera componente core progresivo, no adorno.
- WhatsApp queda previsto como canal posterior/add-on desde la arquitectura.
- La priorizacion de procesos se usa tanto para experiencia como para proteccion tecnica de fuentes.
- El landing page y el playbook comercial hacen parte del proyecto MVP.
- Go-to-market corre en paralelo al build tecnico.
- Toda comunicacion debe estructurarse implicitamente desde por que, como y que.
- LexControl comunica primero la perdida de control, luego el mecanismo, y solo despues la funcionalidad.
- CTA principal de landing: activar demo gratis.
- El diagnostico queda como CTA secundario e instrumento de conciencia/calificacion.
- La activacion se rige por `docs/producto/demo_gratuita_controlada_contract.md`.
- La landing debe mostrar precios visibles bajo la etiqueta `Precios de lanzamiento`.
- Los estados operativos y la taxonomia de actuaciones del MVP se rigen por `docs/producto/contrato-estados-y-actuaciones-mvp.md`.
- El comportamiento de Lex sobre dataset, memoria de sesion y manejo de ambiguedad se rige por `docs/producto/companion-knowledge-contract.md`.

### 18. Preguntas Pendientes

- Nombre comercial definitivo.
- Stack final frontend: Vite o Next.js.
- Proveedor de correo transaccional.
- Proveedor futuro de WhatsApp.
- Modelo de pago en beta.
- Limites por plan en version publica.
- Criterios exactos de prioridad de consulta.
- Politica de retencion de snapshots.
- Nivel de detalle del panel admin inicial.
- Nivel inicial del companion: reglas, query builder o IA generativa limitada.
- Lineamientos visuales de marca, color, iconografia y tipografia.
- Dominio publico del producto.
- Herramienta para landing y formularios.
- Canales sociales prioritarios.
- Responsable de contenido y outreach.
- Oferta comercial posterior a demo gratuita controlada.

### 19. Proximo Paso

Este PRD ya fue convertido en backlog tecnico ejecutable:

```text
docs/producto/backlog-tecnico-mvp-saas.md
```

El siguiente paso de ejecucion es iniciar Sprint 1:

```text
1. Crear modelo de datos inicial.
2. Crear migraciones Supabase.
3. Configurar autenticacion y separacion por cuenta.
4. Crear layout SaaS autenticado.
5. Crear cuenta demo/beta.
6. Preparar ruta de carga de procesos.
```
