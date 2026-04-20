# Product Requirements

## MVP SaaS - Sistema Operativo De Vigilancia Judicial

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

### 6. Alcance MVP

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

No incluye en MVP:

- Automatizacion completa de SAMAI.
- Bypass de CAPTCHA.
- Inteligencia artificial juridica.
- Prediccion avanzada de terminos.
- App movil nativa.
- Pasarela de pagos completa.
- Portal cliente final avanzado.
- Automatizacion completa de todas las fuentes.

### 7. Modulos MVP

#### 7.1 Autenticacion Y Cuentas

Objetivo:

Permitir que cada cliente tenga una cuenta separada.

Funcionalidades:

- Registro o creacion manual de cuenta.
- Login.
- Usuarios asociados a cuenta.
- Rol admin de cuenta.
- Rol usuario operativo.
- Separacion de datos por cuenta.

Requisito clave:

```text
Ninguna cuenta debe ver procesos, clientes, consultas o alertas de otra cuenta.
```

#### 7.2 Gestion De Procesos

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

#### 7.3 Conector CPNU / Rama Judicial

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

#### 7.4 Motor De Consultas

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

#### 7.5 Snapshots Y Eventos

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

#### 7.6 Bandeja Operativa

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

#### 7.7 Alertas Basicas

Objetivo:

Notificar novedades sin saturar al usuario.

Canal MVP:

- Correo electronico.

Tipos:

- Resumen diario.
- Nueva actuacion.
- Procesos no consultados.
- Error de fuente persistente.

No incluir inicialmente:

- WhatsApp automatico.
- SMS.
- Push mobile.

#### 7.8 Panel Administrativo

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

### 8. Entidades De Datos

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
- radicado.
- jurisdiction.
- specialty.
- court_name.
- source_primary.
- priority.
- watch_status.
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

### 9. Flujos Principales

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

### 10. Reglas De Negocio

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

### 11. Riesgos

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

### 12. Sprints Propuestos

#### Sprint 0: Preparacion

Objetivo:

Definir bases tecnicas y preparar repo para desarrollo SaaS.

Entregables:

- PRD aprobado.
- Modelo de datos inicial.
- Backlog MVP.
- Ambientes definidos.

#### Sprint 1: Auth, Cuentas Y Base De Datos

Entregables:

- Accounts.
- Users.
- Roles basicos.
- RLS / separacion por cuenta.
- Layout base SaaS.

#### Sprint 2: Procesos Y Carga Masiva

Entregables:

- CRUD de procesos.
- Clientes internos.
- Validacion de radicados.
- Carga masiva.
- Lista de procesos.

#### Sprint 3: Conector CPNU Productivo

Entregables:

- Modulo connector-cpnu.
- Consulta por radicado.
- Detalle.
- Actuaciones.
- Normalizacion de respuesta.
- Manejo de errores.

#### Sprint 4: Jobs, Snapshots Y Eventos

Entregables:

- query_jobs.
- case_snapshots.
- case_events.
- Comparacion de snapshots.
- Nueva actuacion.
- Estado de consulta.

#### Sprint 5: Bandeja Operativa

Entregables:

- Vista con novedades.
- Vista sin cambios.
- Vista no consultados.
- Filtros por tiempo.
- Detalle de proceso.

#### Sprint 6: Alertas Y Panel Admin

Entregables:

- Resumen diario por correo.
- Registro de notificaciones.
- Panel admin minimo.
- source_health.

#### Sprint 7: Beta Cerrada

Entregables:

- Onboarding asistido.
- 5 a 10 cuentas beta.
- 300 a 800 procesos reales.
- Monitoreo de errores.
- Ajustes de usabilidad.

### 13. Listo Para Beta

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

### 14. Metricas De Exito Beta

#### Producto

- 70% o mas de procesos consultados exitosamente en CPNU.
- 90% de radicados validos cargados correctamente.
- Menos de 5% de errores no clasificados.
- Tiempo hasta primer valor menor a 24 horas.

#### Negocio

- 5 a 10 cuentas beta.
- 300 a 800 procesos vigilados.
- Al menos 3 cuentas agregan nuevos procesos despues de la carga inicial.
- Al menos 3 cuentas aceptan pagar plan mensual posterior.

#### Operacion

- Errores de fuente visibles.
- Procesos no consultados visibles.
- Logs suficientes para soporte.
- Reintentos controlados.

### 15. Decisiones Congeladas Para MVP

- Fuente inicial: CPNU / Rama Judicial.
- Canal de alerta inicial: correo.
- Modelo inicial: SaaS multi-tenant.
- Beta inicial: asistida.
- Monetizacion: planes por cuenta y volumen de procesos.
- Posicionamiento: sistema operativo de vigilancia judicial.
- No se hara bypass de CAPTCHA.
- SAMAI y otras fuentes quedan para fases posteriores.

### 16. Preguntas Pendientes

- Nombre comercial definitivo.
- Stack final frontend: Vite o Next.js.
- Proveedor de correo transaccional.
- Modelo de pago en beta.
- Limites por plan en version publica.
- Criterios exactos de prioridad de consulta.
- Politica de retencion de snapshots.
- Nivel de detalle del panel admin inicial.

### 17. Proximo Paso

Convertir este PRD en backlog tecnico:

```text
1. Crear modelo de datos inicial.
2. Crear migraciones Supabase.
3. Definir estructura de apps/web para SaaS.
4. Convertir probe CPNU en conector productivo.
5. Implementar flujo de carga y primera consulta.
```
