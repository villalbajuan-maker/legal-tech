# Contrato De Modelo De Datos Minimo Para Reglas Operativas

Producto: LexControl  
Superficie: `app.lexcontrol.co`  
Version: v1.0  
Estado: Congelado para implementacion

---

## 1. Decision Rectora

El modelo de datos de reglas operativas no debe intentar capturar toda la complejidad futura desde dia uno.

Debe capturar lo minimo necesario para que:

- cada cuenta tenga una configuracion operativa propia;
- la UI de `Configuracion > Reglas operativas` pueda persistir;
- la cartera pueda reflejar prioridad, atencion y asignacion de forma coherente;
- el sistema pueda crecer sin rehacer el esquema.

Regla madre:

```text
modelo minimo no significa modelo pobre
significa base suficiente para operar y crecer con criterio
```

---

## 2. Proposito Del Contrato

Este documento define la estructura minima para persistir por cuenta:

- reglas de consulta;
- reglas de prioridad;
- reglas de atencion;
- defaults de asignacion;
- umbrales de notificacion;
- umbrales de escalamiento;
- y el estado operativo derivado que necesita cada proceso.

Busca evitar:

1. dejar las reglas solo en UI;
2. persistir todo en metadata difusa sin estructura;
3. mezclar configuracion de cuenta con estado derivado por proceso;
4. sobre-modelar demasiado pronto.

---

## 3. Principio De Modelado

El modelo se divide en dos capas:

### 3.1 Configuracion Por Cuenta

Lo que el bufete define como preferencia operativa.

Vive a nivel de organizacion.

### 3.2 Estado Derivado Por Proceso

Lo que el sistema calcula o aplica sobre cada caso.

Vive a nivel de proceso.

Regla:

```text
la cuenta define el criterio
el proceso refleja el resultado de aplicar ese criterio
```

---

## 4. Tabla Base Por Cuenta

La configuracion debe vivir en una tabla propia:

`public.organization_operational_rules`

Cada organizacion debe tener una sola fila vigente.

Campos minimos:

- `organization_id`
- `consultation_rules jsonb`
- `priority_rules jsonb`
- `attention_rules jsonb`
- `assignment_rules jsonb`
- `notification_rules jsonb`
- `escalation_rules jsonb`
- `created_at`
- `updated_at`

Decision:

```text
una fila por organizacion
seis familias en jsonb separados
```

Esto evita dos errores:

- columnas rigidas en exceso para reglas que todavia van a crecer;
- una sola bolsa de metadata sin separar familias.

---

## 5. Defaults Minimos Por Familia

### 5.1 Consultation Rules

Debe cubrir, como minimo:

- frecuencia por prioridad;
- consulta puntual habilitada;
- politica base de proteccion de fuente.

### 5.2 Priority Rules

Debe cubrir, como minimo:

- regla de resolucion final;
- factores que elevan prioridad;
- factores que reducen prioridad.

### 5.3 Attention Rules

Debe cubrir, como minimo:

- politica de silencio operativo;
- criterios de elevacion a bandeja;
- umbral de eventos proximos.

### 5.4 Assignment Rules

Debe cubrir, como minimo:

- responsable por default;
- politica para procesos sin responsable;
- regla base de cobertura visible.

### 5.5 Notification Rules

Debe cubrir, como minimo:

- canal base;
- frecuencia de resumen;
- severidad minima para interrumpir.

### 5.6 Escalation Rules

Debe cubrir, como minimo:

- umbral de persistencia;
- umbral temporal por evento;
- politica para falta de cobertura.

---

## 6. Estado Derivado En Cases

El proceso debe poder reflejar el resultado operativo actual de estas reglas.

Campos minimos a persistir en `public.cases`:

- `priority_manual`
- `priority_calculated`
- `priority_final`
- `attention_level`
- `responsible_membership_id`
- `assignment_origin`

Decision:

```text
la prioridad y la atencion derivadas no deben vivir solo en memoria o en UI
deben quedar visibles en el proceso
```

Esto permite que:

- Bandeja lea criterio ya persistido;
- Monitoreo compare cobertura real;
- Lex responda sobre prioridad y responsable;
- notificaciones y escalamiento no dependan de recalcular todo desde cero.

---

## 7. Valores Congelados Para El MVP

### 7.1 Priority Fields

Checks minimos:

- `priority_manual`: `low | normal | high | critical`
- `priority_calculated`: `low | normal | high | critical`
- `priority_final`: `low | normal | high | critical`

### 7.2 Attention Field

Check minimo:

- `attention_level`:
  - `silencio_operativo`
  - `atencion_visible`
  - `atencion_elevada`
  - `interrupcion`

### 7.3 Assignment Origin

Check minimo:

- `assignment_origin`:
  - `manual`
  - `rule`
  - `default`
  - `unassigned`

---

## 8. Relacion Con Organization Memberships

La asignacion real no debe quedarse en texto libre como unica fuente de verdad.

Por eso el caso debe poder apuntar a:

- `responsible_membership_id -> public.organization_memberships.id`

El campo textual `internal_owner` puede seguir existiendo por compatibilidad temporal y lectura rapida.

Pero la evolucion correcta es:

```text
responsable real = membership de la organizacion
```

---

## 9. RLS Y Control De Acceso

La tabla `organization_operational_rules` debe seguir la misma logica que `organizations`:

- miembros activos pueden leer;
- admins de la organizacion pueden modificar;
- platform admins pueden gestionar globalmente.

El proceso derivado en `cases` ya queda cubierto por las politicas existentes de acceso por organizacion.

---

## 10. Bootstrap Para Organizaciones Existentes

El modelo debe sembrar defaults automaticamente para:

- organizaciones existentes;
- organizaciones nuevas.

Eso implica:

1. backfill para filas ya creadas;
2. trigger o mecanismo de insercion automatica para organizaciones futuras.

Regla:

```text
ninguna cuenta debe quedar sin reglas operativas base
```

---

## 11. Lo Que No Se Modela Todavia

No hace falta abrir desde esta fase:

- versionado historico completo de reglas;
- auditoria detallada por cada cambio de setting;
- overrides por responsable;
- overrides por proceso individual;
- motor de reglas declarativas complejo.

Eso puede crecer despues.

El MVP necesita:

- una configuracion por cuenta;
- un estado derivado por proceso;
- defaults coherentes.

---

## 12. Traduccion A UI

La UI de `Configuracion > Reglas operativas` debe leer y escribir sobre:

- una sola entidad por cuenta;
- seis bloques de configuracion;
- y mostrar el resultado en procesos y bandeja a traves de los campos derivados.

Contrato relacionado:

`docs/producto/contrato-ui-reglas-operativas.md`

---

## 13. Criterio De Listo

La estructura minima se considera bien encaminada cuando:

1. cada organizacion tiene una fila de reglas operativas;
2. la UI puede persistir cambios por familia;
3. cada proceso puede mostrar prioridad manual, calculada y final;
4. cada proceso puede mostrar nivel de atencion;
5. cada proceso puede reflejar responsable real y origen de asignacion.

---

## 14. Regla Final

```text
Las reglas operativas deben poder persistirse por cuenta
y sus efectos deben poder leerse por proceso.
Si no, la configuracion es decorativa.
```
