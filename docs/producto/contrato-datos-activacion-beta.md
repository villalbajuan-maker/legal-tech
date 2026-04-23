# Contrato De Datos - Activacion Beta

Producto: LexControl  
Instrumento: Activar demo gratis  
Version: v1.0  
Estado: Congelado para implementacion

---

## 1. Proposito

La activacion beta no es solo una conversion comercial.

Es la fuente primaria de captura de leads, contexto operativo y trazabilidad
de ingreso al producto.

Todo prospecto que pase por el modal de activacion debe quedar persistido.

El objetivo es que LexControl pueda responder:

```text
Quien pidio activacion.
Que problema dijo tener.
Que volumen maneja.
Si califico para agenda.
Si fue enviado a calendario o quedo en revision.
Si luego se convirtio en cuenta real.
```

---

## 2. Regla De Modelado

Un lead no es una cuenta activa.

Por eso la activacion beta no debe escribirse directamente en:

- `organizations`
- `clients`
- `cases`

Debe vivir en un subdominio previo de activacion comercial-operativa.

---

## 3. Entidades

## 3.1 `activation_requests`

Registro principal de una solicitud de demo.

Campos minimos:

- `id`
- `source`
- `request_status`
- `qualification_status`
- `profile_type`
- `case_band`
- `review_methods`
- `operational_risks`
- `has_assigned_owners`
- `urgency_level`
- `sample_readiness`
- `decision_window`
- `contact_name`
- `contact_email`
- `contact_phone`
- `company_name`
- `city`
- `calendar_url`
- `calendar_presented_at`
- `activated_organization_id`
- `created_at`
- `updated_at`

### Status sugeridos

`request_status`

- `new`
- `qualified`
- `sent_to_calendar`
- `deferred`
- `activated`
- `rejected`

`qualification_status`

- `qualified`
- `deferred`

---

## 3.2 `activation_request_answers`

Persistencia estructurada de respuestas del flujo.

Sirve para:

- trazabilidad de cada pantalla
- analitica futura
- reconstruir el contexto original del lead

Campos minimos:

- `id`
- `activation_request_id`
- `question_key`
- `question_label`
- `answer_value`
- `answer_values`
- `selection_mode`
- `step_index`
- `created_at`

### Regla

Cada paso del modal deja una respuesta.

Si es seleccion multiple:

- `answer_values` guarda arreglo JSON
- `answer_value` puede quedar nulo

Si es seleccion unica:

- `answer_value` guarda el valor
- `answer_values` puede quedar nulo

---

## 3.3 `activation_request_events`

Timeline interno del lead.

Campos minimos:

- `id`
- `activation_request_id`
- `event_type`
- `payload`
- `created_at`

### Eventos minimos

- `request_submitted`
- `qualified`
- `deferred`
- `calendar_presented`
- `activated`

---

## 4. Ingreso De Datos

El frontend no debe hacer inserts sueltos en varias tablas.

Debe existir un punto de entrada unico:

```text
public.submit_activation_request(payload jsonb)
```

Ese punto de entrada:

- valida payload minimo
- crea `activation_requests`
- crea `activation_request_answers`
- crea evento inicial
- crea evento de calificacion
- devuelve `request_id`, `qualification_status` y `request_status`

Esto evita:

- estados parciales
- respuestas sin request principal
- inconsistencias entre tablas

---

## 5. Paso A Calendario

Cuando la solicitud califica y se muestra el CTA de agenda, debe existir un
segundo punto de trazabilidad:

```text
public.mark_activation_request_calendar_presented(request_id, calendar_url)
```

Este paso no garantiza que la reserva en Google Calendar ya ocurriera.

Lo que garantiza es:

```text
LexControl ya envio este lead al paso de agenda.
```

Eso es suficiente para el MVP.

La confirmacion real de reserva puede resolverse despues con webhook o integracion
de calendar.

---

## 6. Seguridad

La landing publica necesita poder escribir solicitudes sin login.

Por eso:

- el frontend publico puede ejecutar el RPC de envio
- el frontend publico no puede leer leads
- lectura y administracion deben quedar restringidas a roles internos

Regla:

```text
Insert publico controlado.
Lectura privada.
Gestion interna.
```

---

## 7. Relacion Con El Producto

Una `activation_request` puede convertirse despues en:

```text
organization
```

Y desde ahi seguir a:

- usuarios
- procesos
- consultas
- bandeja real

La activacion beta es el origen de la cuenta.

No debe perderse esa relacion.

Por eso `activation_requests` debe contemplar:

- `activated_organization_id`
- y eventualmente `activated_at`

aunque la activacion operativa se complete despues.

---

## 8. Analitica Minima Esperada

Con este contrato, LexControl debe poder medir:

- cuantas solicitudes entran
- cuantas califican
- cuantas pasan a calendario
- cuantas se activan
- que perfil convierte mejor
- que riesgos se repiten mas
- que volumenes aparecen con mayor frecuencia

---

## 9. Definicion De Listo

Este contrato queda listo cuando:

- el modal persiste cada solicitud
- se guarda el contexto operativo completo
- se guarda la informacion de contacto
- se registra si califico o no
- se registra si fue enviado a calendario
- los datos quedan en Supabase
- la landing puede seguir funcionando si Supabase no esta configurado, pero
  mostrando error controlado de envio

