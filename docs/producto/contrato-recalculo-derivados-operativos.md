# Contrato De Recalculo De Derivados Operativos

Producto: LexControl  
Superficie: `app.lexcontrol.co` + worker + capa de reglas operativas  
Version: v1.0  
Estado: Congelado para implementacion incremental

---

## 1. Decision Rectora

Recalcular no es volver a mirar todo sin criterio.

Recalcular es traducir el estado observado de una cartera en:

- peso operativo;
- nivel de atencion;
- cobertura;
- y capacidad de decision.

Regla madre:

```text
no todo cambio merece el mismo recalculo
ni todo recalculo merece la misma sofisticacion
```

---

## 2. Proposito Del Contrato

Este documento define:

- que campos derivados debe recalcular LexControl;
- de que señales se alimenta cada derivado;
- que parte del recalculo pertenece al MVP;
- que parte debe quedar prevista para una segunda capa;
- y con que nivel de sofisticacion debe operar cada familia.

Busca evitar:

1. recalcular demasiadas cosas sin impacto real;
2. dejar derivados importantes como simple cosmética;
3. meter toda la inteligencia del sistema en una sola pasada opaca;
4. mezclar “cuando recalcular” con “que recalcular”.

---

## 3. Principio Operativo

La cartera no necesita una inteligencia infinita desde el día uno.

Necesita una inteligencia suficiente para:

- distinguir estabilidad de riesgo;
- elevar lo relevante;
- asignar cobertura visible;
- y sostener una bandeja de atención creíble.

Por eso el recalculo debe avanzar por capas:

### 3.1 Derivados Esenciales

Lo mínimo para que Bandeja, Configuración y Lex no mientan.

### 3.2 Derivados Enriquecidos

Lo que mejora lectura, contexto y criterio, pero no bloquea MVP.

### 3.3 Derivados De Interrupcion

Lo que activa notificación o escalamiento por persistencia, tiempo o severidad.

---

## 4. Campos Derivados Que Deben Existir

## 4.1 Derivados Esenciales Del MVP

Estos deben recalcularse hoy:

- `priority_calculated`
- `priority_final`
- `attention_level`
- `responsible_membership_id`
- `assignment_origin`

Razon:

son los campos que hacen visible la tesis de administracion de atencion dentro de la cartera.

## 4.2 Derivados Enriquecidos Previos A V2

Estos deben quedar previstos como siguiente capa:

- `attention_reason`
- `attention_updated_at`
- `priority_reason`
- `coverage_status`
- `freshness_state`

Razon:

permiten explicar mejor por qué un proceso quedó donde quedó, sin obligar al usuario a reconstruir la lógica.

## 4.3 Derivados De Interrupcion

Estos no tienen que vivir todos en `cases`, pero sí deben existir en la arquitectura:

- `notification_candidate`
- `notification_channel_candidate`
- `escalation_candidate`
- `escalation_reason`

Decision:

en MVP estos derivados pueden seguir resolviéndose entre `alerts`, reglas y worker; no es necesario persistirlos todavía como columnas propias en `cases`.

---

## 5. Señales Que Alimentan El Recalculo

Todo derivado debe salir de una combinación explícita de señales.

Familias mínimas de señal:

### 5.1 Señales De Fuente

- `case_sources.status`
- `case_sources.last_checked_at`
- `case_sources.last_success_at`
- `case_sources.last_error_at`
- `case_sources.metadata.operational_status`

### 5.2 Señales De Evento

- existencia de `legal_events` activos
- tipo de evento
- fecha próxima
- `change_status`

### 5.3 Señales De Alerta

- alertas `pending` o `sent`
- severidad
- tipo de alerta
- persistencia

### 5.4 Señales De Cobertura

- responsable actual
- default disponible
- ausencia de responsable con novedad

### 5.5 Señales De Criterio Manual

- `priority_manual`
- reglas operativas de la organización
- posibles decisiones futuras del operador

---

## 6. Que Debe Recalcular Cada Derivado

### 6.1 `priority_calculated`

Debe responder:

```text
que peso operativo tiene este proceso segun lo que el sistema ve hoy?
```

Debe considerar en MVP:

- evento crítico o muy próximo;
- error de fuente;
- requiere revisión;
- alerta alta o crítica;
- novedad reciente;
- no encontrado;
- falta de responsable con novedad si la regla lo habilita.

Sofisticación MVP:

reglas discretas por umbral, no scoring continuo.

### 6.2 `priority_final`

Debe responder:

```text
con que prioridad debe leerse y tratarse finalmente este proceso?
```

Debe resolver:

- prioridad manual;
- prioridad calculada;
- regla de resolución final de la cuenta.

Sofisticación MVP:

`max(manual, calculated)` o `manual_only`, según regla persistida.

### 6.3 `attention_level`

Debe responder:

```text
esto debe quedar en silencio, visible, elevado o interrumpir?
```

Debe considerar:

- prioridad final;
- evento próximo;
- error de fuente;
- revisión pendiente;
- novedad reciente;
- combinación de criticidad + cobertura.

Sofisticación MVP:

cuatro niveles discretos:

- `silencio_operativo`
- `atencion_visible`
- `atencion_elevada`
- `interrupcion`

### 6.4 `responsible_membership_id`

Debe responder:

```text
quien cubre este proceso hoy?
```

Debe considerar:

- responsable ya asignado;
- default configurado;
- futura regla por tipo/fuente si existe;
- si no hay cobertura, mantenerse nulo.

Sofisticación MVP:

- respetar el responsable existente;
- si no existe, usar default cuando esté configurado y válido;
- si no, dejar visible como sin cobertura.

### 6.5 `assignment_origin`

Debe responder:

```text
de donde sale la cobertura actual de este proceso?
```

Valores MVP:

- `manual`
- `rule`
- `default`
- `unassigned`

Sofisticación MVP:

no necesita motor complejo; basta con reflejar el origen real de la cobertura.

---

## 7. Niveles De Sofisticacion

## 7.1 Capa 1 - Suficiente Para Operar

Objetivo:

que la cartera refleje atención y cobertura con honestidad.

Incluye:

- umbrales discretos;
- factores binarios;
- resolución simple de prioridad;
- default de asignación;
- elevación por evento/error/revisión.

Esta capa ya debe sostener:

- Bandeja;
- Configuración;
- Lex;
- y lectura básica de riesgo.

## 7.2 Capa 2 - Explicabilidad Y Contexto

Objetivo:

que el sistema no solo decida, sino que explique por qué.

Incluye:

- razones persistidas;
- timestamps de recalculo;
- cobertura visible más fina;
- frescura del caso;
- mayor legibilidad para soporte, QA y Lex.

## 7.3 Capa 3 - Ajuste Fino Por Bufete

Objetivo:

que cada firma module el comportamiento sin volver el producto un desarrollo a medida.

Incluye:

- reglas más finas por tipo de evento;
- mayor influencia de fuente o jurisdicción;
- políticas de cobertura por segmento;
- excepciones por cliente o tipo de proceso.

Decision:

esta capa no pertenece al MVP operativo; debe llegar después de validar comportamiento y carga cognitiva.

---

## 8. Orden Del Recalculo

El orden recomendado de derivación es:

```text
1. leer señales de fuente, evento, alerta y cobertura
2. calcular priority_calculated
3. resolver priority_final
4. resolver attention_level
5. resolver responsible_membership_id
6. resolver assignment_origin
7. dejar listas las condiciones para notificación y escalamiento
```

Regla:

```text
no se calcula atencion antes de resolver prioridad
no se interpreta cobertura sin conocer el nivel de atencion
```

---

## 9. Disparadores Minimos Del Recalculo

Este contrato no gobierna el “cuando” en detalle, pero sí congela los disparadores mínimos que deben seguir existiendo:

- guardar reglas operativas;
- carga de procesos;
- corridas del worker;
- consulta puntual por proceso cuando exista;
- cambios manuales de responsable o prioridad manual.

---

## 10. Que No Debe Entrar Todavia

No debe entrar aún:

- scoring probabilístico;
- modelos predictivos;
- matrices demasiado finas por tipo de despacho;
- aprendizaje por cuenta;
- pesos configurables para todo.

Regla:

```text
primero criterio legible
despues sofisticacion estadistica
```

---

## 11. Traduccion A Producto

La UI debe poder decir, de forma creíble:

- por qué un caso está alto o crítico;
- por qué apareció en bandeja;
- por qué está silencioso;
- por qué quedó sin responsable o con default;
- por qué una señal no interrumpió todavía.

Lex también debe apoyarse en estos derivados para responder:

- qué requiere atención;
- qué está estable;
- qué procesos quedaron expuestos;
- qué cambió de prioridad y por qué.

---

## 12. Decision Congelada

LexControl no necesita un motor omnisciente desde día uno.

Necesita un motor que:

- recalcule lo esencial;
- lo haga con criterio legible;
- permita explicación;
- y pueda crecer por capas sin reescribir la base.

Regla final:

```text
sofisticacion no significa complejidad maxima
significa profundidad proporcional al valor que queremos crear
```

Backlog de implementación:

`docs/producto/backlog-implementacion-derivados-operativos.md`
