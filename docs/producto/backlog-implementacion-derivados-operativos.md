# Backlog De Implementacion De Derivados Operativos

Producto: LexControl  
Superficie: `app.lexcontrol.co` + worker + Supabase  
Version: v1.0  
Estado: Activo

Contrato rector:

`docs/producto/contrato-recalculo-derivados-operativos.md`

---

## 1. Objetivo

Traducir el contrato de recalculo de derivados operativos en una secuencia de implementación real, incremental y verificable.

Objetivo operativo:

```text
hacer que la cartera no solo se actualice
sino que interprete, priorice y eleve con criterio legible
```

---

## 2. Principios De Ejecucion

- Implementar primero derivados que cambian decision visible.
- Separar MVP esencial de enriquecimiento explicativo.
- Evitar motores opacos demasiado pronto.
- Dejar trazabilidad suficiente para explicar por qué un proceso quedó donde quedó.
- No agregar campos o reglas que la UI todavía no pueda usar.

---

## 3. Estado Actual

Ya implementado:

- `priority_calculated`
- `priority_final`
- `attention_level`
- `responsible_membership_id`
- `assignment_origin`
- recalculo al guardar reglas operativas
- recalculo después de carga de procesos
- recalculo después de corridas del worker

Pendiente:

- explicabilidad de los derivados
- frescura operativa visible
- cobertura más explícita
- candidatos de notificación y escalamiento mejor derivados

---

## 4. Orden De Implementacion

```text
Fase 1. Explicabilidad de prioridad y atencion
Fase 2. Cobertura y frescura operativa
Fase 3. Candidatos de notificacion y escalamiento
Fase 4. Recalculo mas fino por tipo de señal
```

---

## 5. Fase 1 - Explicabilidad De Prioridad Y Atencion

### Objetivo

Que el sistema no solo derive, sino que pueda explicar de forma legible por qué lo hizo.

### Campos A Implementar

- `priority_reason`
- `attention_reason`
- `attention_updated_at`

### Tareas Tecnicas

- agregar columnas nuevas en `public.cases`
- extender la RPC `recalculate_organization_case_derived_fields`
- persistir razón dominante de prioridad calculada
- persistir razón dominante de atención
- persistir timestamp del último recalculo de atención

### Reglas MVP

Razones mínimas sugeridas:

- prioridad:
  - `evento_critico`
  - `evento_proximo`
  - `error_fuente`
  - `requiere_revision`
  - `novedad_reciente`
  - `estable`
- atención:
  - `silencio_por_estabilidad`
  - `visible_por_novedad`
  - `elevada_por_riesgo`
  - `interrupcion_por_criticidad`

### UI Objetivo

- mostrar la razón en detalle de proceso
- permitir que Lex cite la razón
- usar la razón en tooltips o chips secundarios

### Criterios De Aceptacion

- todo proceso con prioridad calculada distinta de `normal` tiene razón explícita
- todo proceso con `attention_level` distinto de `silencio_operativo` tiene razón explícita
- la razón es legible por humano, no interna del motor

---

## 6. Fase 2 - Cobertura Y Frescura Operativa

### Objetivo

Que la cartera exprese mejor:

- qué tan cubierto está un proceso
- qué tan fresco es el dato que se está mostrando

### Campos A Implementar

- `coverage_status`
- `freshness_state`

### Valores MVP Sugeridos

#### `coverage_status`

- `covered_manual`
- `covered_default`
- `unassigned`
- `unassigned_with_attention`

#### `freshness_state`

- `fresh`
- `stale`
- `outdated`
- `never_checked`

### Tareas Tecnicas

- agregar columnas nuevas en `public.cases`
- derivar cobertura según responsable actual, default y nivel de atención
- derivar frescura según `last_checked_at` y reglas de consulta por prioridad
- exponer estos campos a la UI de Bandeja y Monitoreo

### UI Objetivo

- Bandeja: chip de cobertura solo cuando falta o está frágil
- Monitoreo: indicador más técnico de frescura
- Detalle: explicación de por qué el caso se considera fresco o no

### Criterios De Aceptacion

- un proceso nunca consultado aparece como `never_checked`
- un proceso sin responsable y con atención elevada aparece como cobertura expuesta
- la UI puede distinguir entre dato viejo y dato estable

---

## 7. Fase 3 - Candidatos De Notificacion Y Escalamiento

### Objetivo

Preparar la salida del sistema hacia canales e interrupciones sin volver a recalcular todo desde cero cada vez.

### Campos O Capa Derivada

No necesariamente columnas en `cases`. Puede empezar como vista materializada lógica o función derivada.

Derivados mínimos:

- `notification_candidate`
- `notification_channel_candidate`
- `escalation_candidate`
- `escalation_reason`

### Tareas Tecnicas

- definir función o capa de derivación sobre:
  - prioridad final
  - atención
  - persistencia de alertas
  - cercanía temporal
  - cobertura
- conectar esa derivación a `alerts`
- evitar duplicación de señales ya resueltas

### Criterios De Aceptacion

- el sistema puede distinguir entre “visible en app” y “debe interrumpir”
- el sistema puede distinguir entre “alerta existente” y “caso que debe escalar”
- notificación y escalamiento ya no dependen de lógica dispersa

---

## 8. Fase 4 - Recalculo Mas Fino Por Tipo De Señal

### Objetivo

Subir sofisticación sin perder legibilidad.

### Alcance

- ajustar prioridad por tipo de evento
- ajustar atención por combinación de señales
- modular cobertura por ausencia + severidad
- modular frescura por prioridad y política de consulta

### Tareas Tecnicas

- refinar la RPC de recalculo
- separar helpers por familia dentro del cálculo
- introducir tabla o capa de catálogos si la lógica ya no cabe bien en una sola función

### Criterios De Aceptacion

- la RPC sigue siendo explicable
- los cambios mejoran lectura operativa, no solo complejidad interna
- la UI puede aprovechar la nueva precisión

---

## 9. Dependencias Transversales

Estas fases dependen o impactan:

- `Configuracion > Reglas operativas`
- `Bandeja`
- `Monitoreo`
- `Lex`
- worker/crawler
- `alerts`
- futura capa de notificaciones

---

## 10. Orden Recomendado De Ejecucion Inmediata

### Sprint siguiente

1. Fase 1 completa
2. Primer tramo de Fase 2

### Sprint posterior

3. terminar Fase 2
4. arrancar Fase 3

### Sprint posterior

5. Fase 4 selectiva según lo que la operación real muestre

---

## 11. Criterio De Cierre Por Fase

Una fase no se considera cerrada solo por tener columnas o lógica.

Debe cumplir las tres capas:

1. persistencia correcta
2. uso visible en UI o Lex
3. validación real sobre cartera viva

Regla:

```text
si un derivado existe pero no cambia lectura, decision o accion,
todavia no genero valor real
```

---

## 12. Decision Congelada

El backlog de derivados operativos debe construirse como una escalera:

- primero campos que cambian decisión;
- luego campos que explican;
- luego campos que preparan interrupción;
- y solo después refinamiento más fino.

Eso protege al sistema de dos errores:

- quedarse corto y verse superficial
- sofisticarse demasiado pronto y volverse opaco
