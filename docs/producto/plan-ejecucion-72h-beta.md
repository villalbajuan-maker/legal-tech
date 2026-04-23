# Plan De Ejecucion 72h - Beta Activable

## LexControl

Este documento aterriza el estado real del proyecto y lo convierte en un plan de ejecucion de 72 horas.

No busca repetir el PRD ni el backlog completo.

Busca responder una sola pregunta:

```text
Que debemos terminar exactamente para que LexControl
pueda activarse con abogados reales en una beta asistida?
```

---

## 1. Regla De Realidad

Hoy LexControl ya tiene:

- Landing publicada.
- Instrumento de activacion beta.
- Demo operativa de bandeja.
- Companion Lex de demostracion.
- Design system base.
- Arquitectura y documentacion de producto.
- Esquema inicial de base de datos.

Hoy LexControl todavia no tiene:

- Aplicacion SaaS productiva para usuarios autenticados.
- Carga real de procesos para una cuenta.
- Conector CPNU productivo integrado al backend.
- Persistencia real de consultas y snapshots desde worker.
- Deteccion real de novedades en base de datos.
- Bandeja operativa real sobre datos persistidos.
- Scheduler de consultas.
- Flujo de activacion de cuentas beta.
- Alertas operativas reales.

Conclusion:

```text
No estamos en fase de idea.
Tampoco estamos listos para abrir autoservicio.

Si estamos en posicion de cerrar una beta asistida real
si ejecutamos sin dispersion durante las proximas 72 horas.
```

---

## 2. Definicion Exacta De "Listo Para Activar"

Durante estas 72 horas no vamos a construir todo el SaaS.

Vamos a construir una beta asistida con estas capacidades minimas:

Nota de producto:

```text
La palabra beta describe la fase interna de validacion.
No describe la percepcion que debe tener el usuario activado.
```

Hacia afuera, toda cuenta activada debe sentirse como producto real.

El contrato exacto de esa experiencia queda definido en:

`docs/producto/contrato-demo-operativa-produccion.md`

### Beta asistida significa

- El equipo de LexControl crea o activa la cuenta.
- El abogado entra con login.
- Carga sus procesos por radicado de forma individual o por lote.
- El sistema consulta CPNU / Rama Judicial.
- Cada intento queda registrado.
- El sistema clasifica:
  - con novedad
  - sin cambios
  - no consultado
  - error de fuente
  - requiere revision
- El usuario puede ver una bandeja real y el detalle por proceso.
- El operador puede volver a correr consultas.
- El sistema puede ejecutar un lote inicial y dejar trazabilidad.

### No significa aun

- Onboarding 100 por ciento self-service.
- SAMAI productivo.
- WhatsApp productivo.
- Pagos.
- Portal cliente final.
- Automatizacion multifuente completa.
- IA juridica avanzada.

---

## 3. Estado Real Contra El MVP

## 3.1 Lo que ya esta fuerte

### Comercial y validacion

- Landing fuerte y publicada.
- Copy, demo, pricing y activacion beta ya operativos.
- Companion demo coherente con el posicionamiento.

### Producto conceptual

- PRD definido.
- Backlog tecnico definido.
- Contratos de UX, Lex, dataset, estados y activacion ya congelados.

### Base tecnica

- Monorepo con `apps`, `packages`, `workers`, `supabase`.
- Migracion inicial con tablas core:
  - `organizations`
  - `clients`
  - `cases`
  - `sources`
  - `case_sources`
  - `source_snapshots`
  - `case_movements`
  - `legal_events`
  - `alerts`
  - `notification_deliveries`
- Worker separado creado.
- Function `check-case` creada como punto inicial.

## 3.2 Lo que esta incompleto o inconsistente

### Multi-tenant real

- No existe todavia flujo real de auth + perfiles + roles.
- El RLS actual permite lectura autenticada general y no aislamiento real por cuenta.
- No existe relacion robusta entre usuario autenticado y organizacion operativa.

### Motor de consultas

- No existe `query_jobs`.
- No existe cola real de ejecucion.
- No existe scheduler.
- No existe bloqueo de concurrencia por proceso.

### Conectores

- El worker solo tiene `manualSourceConnector`.
- No existe `connector-cpnu` productivo desacoplado.
- No existe persistencia de payloads reales desde consultas CPNU hacia Supabase.

### Snapshots y cambios

- Existe tabla `source_snapshots`, pero no la logica productiva.
- Existe tabla `case_movements`, pero no comparador real.
- No existe pipeline de:
  - consultar
  - guardar snapshot
  - comparar con snapshot anterior
  - generar eventos
  - actualizar estado operativo del proceso

### Aplicacion SaaS real

- El frontend actual es landing + demo.
- No existe app interna autenticada para:
  - listado real de procesos
  - carga por lote
  - bandeja real
  - detalle de proceso
  - vista de historial

### Alertas

- Existen tablas.
- No existe pipeline real de generacion y entrega.

---

## 4. Decision Ejecutiva Para 72 Horas

No intentar cerrar todo el backlog.

La beta activable en 72 horas se gana si cerramos solo estas 5 piezas:

1. Identidad y aislamiento de cuenta.
2. Carga real de procesos.
3. Conector CPNU operativo.
4. Persistencia + deteccion de cambios.
5. Bandeja real autenticada.

Todo lo demas se considera deseable, no bloqueante.

---

## 5. Alcance Congelado Para Las Proximas 72 Horas

## Incluido

- Login para beta asistida.
- Creacion manual de cuenta beta.
- Carga individual y masiva de radicados.
- Responsables y prioridad.
- Fuente inicial: CPNU / Rama Judicial.
- Consulta manual por proceso.
- Consulta por lote de procesos activos.
- Registro de intentos.
- Snapshots.
- Deteccion de cambios basicos.
- Clasificacion operativa de estado.
- Bandeja real.
- Detalle por proceso.
- Eventos visibles.
- Lex inicial sobre bandeja real o placeholder controlado si no alcanza.

## Excluido temporalmente

- SAMAI.
- WhatsApp.
- Correos complejos por responsable.
- Scheduler sofisticado.
- Reportes descargables.
- Cliente final portal.
- Facturacion.
- Sign-up libre.

---

## 6. Entregable Final De Esta Ventana

Al finalizar las 72 horas, un abogado beta debe poder:

1. Recibir acceso a su cuenta.
2. Entrar a LexControl.
3. Cargar sus radicados.
4. Ver el resultado de las consultas.
5. Entender que cambio, que no cambio y que fallo.
6. Revisar detalle de un proceso.
7. Repetir una consulta o solicitar corrida de lote.

Si eso ocurre, la beta esta activable.

---

## 7. Sprint De 72 Horas

## Bloque 1 - Fundacion Operativa

### Objetivo

Cerrar la brecha entre esquema inicial y SaaS real operable.

### Tareas

- Crear tabla de perfiles o membresias por usuario.
- Amarrar usuario autenticado a `organization_id`.
- Ajustar RLS para aislamiento real.
- Crear seed de cuenta beta.
- Crear cliente Supabase compartido en frontend.
- Crear shell interna autenticada separada de la landing.

### Resultado esperado

Un usuario autenticado solo ve los datos de su organizacion.

### Prioridad

Critica.

---

## Bloque 2 - Gestion Real De Procesos

### Objetivo

Permitir que la cuenta beta cargue procesos reales.

### Tareas

- Formulario de carga individual.
- Carga masiva por textarea o CSV simple.
- Normalizacion de radicado.
- Deteccion de duplicados por organizacion.
- Asignacion de responsable.
- Asignacion de prioridad.
- Estado `active` / `paused`.
- Creacion automatica de `case_sources` para CPNU.

### Resultado esperado

La cuenta beta deja procesos listos para consulta.

### Prioridad

Critica.

---

## Bloque 3 - Conector CPNU Productivo

### Objetivo

Convertir el experimento de fuentes en una pieza del producto.

### Tareas

- Crear `connector-cpnu`.
- Definir respuesta normalizada.
- Mapear:
  - proceso encontrado
  - sin registros
  - error tecnico
  - bloqueado o no disponible
- Guardar `raw_payload` y metadatos minimos.
- Integrar el worker con Supabase.
- Crear comando de corrida local para lote.

### Resultado esperado

Un proceso real puede ser consultado y persistido.

### Prioridad

Critica.

---

## Bloque 4 - Snapshots, Cambios Y Estado Operativo

### Objetivo

Traducir la consulta en valor visible.

### Tareas

- Persistir `source_snapshots`.
- Comparar contra ultimo snapshot exitoso.
- Extraer ultima actuacion y anotacion.
- Generar `case_movements` nuevos.
- Generar `legal_events` basicos cuando aplique.
- Calcular estado operativo por proceso:
  - con novedad
  - sin cambios
  - no consultado
  - error de fuente
  - requiere revision
- Guardar resumen operativo visible para UI.

### Resultado esperado

Cada consulta deja trazabilidad y un estado que el abogado puede leer.

### Prioridad

Critica.

---

## Bloque 5 - Bandeja SaaS Real

### Objetivo

Mostrar la operacion real, no la demo.

### Tareas

- Crear vista autenticada de bandeja.
- Listar procesos reales.
- Mostrar columnas:
  - radicado
  - estado operativo
  - ultima actuacion
  - anotacion
  - fecha
  - responsable
  - fuente
  - prioridad
- Filtros por:
  - estado
  - responsable
  - prioridad
  - tiempo
- Vista detalle por proceso:
  - historial de snapshots
  - movimientos detectados
  - ultimo error si existe

### Resultado esperado

La promesa central del producto ya ocurre con datos reales.

### Prioridad

Critica.

---

## 8. Si Sobra Tiempo

Solo despues de cerrar lo anterior:

- corrida programada cada ciertas horas
- resumen operativo por correo
- panel simple de administracion beta
- Lex sobre datos reales de bandeja

---

## 9. Orden Exacto De Ejecucion

```text
1. Multi-tenant real
2. Carga de procesos
3. Conector CPNU
4. Persistencia de snapshots
5. Deteccion de cambios
6. Bandeja real
7. Detalle de proceso
8. Corrida por lote
9. Alertas o Lex real si alcanza
```

Si el orden se rompe, el proyecto se dispersa.

---

## 10. Riesgos Reales

### Riesgo 1 - Querer cerrar demasiado

Si intentamos meter WhatsApp, SAMAI, portal cliente y automatizaciones complejas, no cerramos la beta.

### Riesgo 2 - Hacer UI sin backend real

Ya tenemos suficiente demo visual. Lo que falta ahora es verdad operacional.

### Riesgo 3 - Dejar el RLS abierto

Sin aislamiento por cuenta, no existe SaaS confiable.

### Riesgo 4 - Conector CPNU fragil

La beta depende de una sola fuente prioritaria. Esa fuente debe quedar robusta y observable.

### Riesgo 5 - No definir que es "suficiente"

La meta no es terminar el producto.
La meta es activar una beta real.

---

## 11. Definicion De Listo Para Beta

La beta queda lista cuando:

- existe login funcional
- existe cuenta beta funcional
- un usuario puede cargar procesos reales
- los procesos pueden consultarse en CPNU
- cada intento queda registrado
- el sistema clasifica el estado operativo
- la bandeja muestra datos reales
- el detalle de proceso muestra trazabilidad minima
- el operador puede correr nuevamente una consulta

Si uno de esos puntos falla, todavia no esta lista.

---

## 12. Checklist Maestro

## Infraestructura

- [ ] Perfiles o membresias por usuario
- [ ] RLS por organizacion
- [ ] Seed de cuenta beta
- [ ] Variables de entorno de Supabase configuradas

## Datos

- [ ] Tabla o mecanismo de estado operativo por proceso
- [ ] Flujo `cases -> case_sources -> source_snapshots -> case_movements -> legal_events`
- [ ] Estrategia minima para idempotencia

## Consultas

- [ ] `connector-cpnu` productivo
- [ ] Worker conectado a Supabase
- [ ] Consulta manual por proceso
- [ ] Consulta por lote

## Producto

- [ ] Login
- [ ] Layout interno
- [ ] Carga individual
- [ ] Carga masiva
- [ ] Bandeja real
- [ ] Detalle de proceso

## Operacion

- [ ] Seed de 1 cuenta beta real
- [ ] 10 a 20 radicados de prueba cargados
- [ ] Prueba de corrida completa
- [ ] Validacion manual de resultados

---

## 13. Decision Final

Durante las proximas 72 horas, LexControl no debe pensarse como:

- landing
- demo
- marketing
- vision

Debe pensarse como:

```text
una beta asistida real que toma radicados,
consulta una fuente real,
registra cada intento
y devuelve una bandeja operativa util.
```

Ese es el trabajo.
