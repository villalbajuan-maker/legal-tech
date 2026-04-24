# Contrato de Persistencia de Identidad de Proceso Fuente

## Objetivo

Definir qué identidad estructural de un proceso, entregada por una fuente pública como CPNU, debe persistirse en el modelo operativo de LexControl para que:

- no quede enterrada únicamente en `raw_payload`;
- pueda ser consultada por UI, Lex y reglas operativas;
- sirva para perfilar seeds y datasets de prueba;
- conserve una separación clara entre identidad estable y actividad histórica.

## Principio rector

La actividad del proceso vive en:

- `source_snapshots`
- `case_movements`
- `legal_events`

La identidad estructural observable del proceso vive en:

- `cases`
- `case_sources.metadata`

## Campos mínimos a persistir

### En `cases`

Estos campos representan la mejor identidad fuente conocida del proceso dentro de la cuenta:

- `external_process_id`
  - corresponde a `idProceso` de la fuente, cuando exista.
- `external_process_key`
  - corresponde a `llaveProceso`, cuando exista.
- `court`
  - nombre de despacho o equivalente visible.
- `department`
  - departamento reportado por la fuente.
- `process_type`
  - clase o tipo de proceso, priorizando `claseProceso`, luego `tipoProceso`.
- `parties`
  - versión estructurada de sujetos procesales cuando la fuente lo permita.
- `source_parties_summary`
  - resumen legible de sujetos procesales.
- `source_last_movement_at`
  - última fecha conocida de actuación reportada por la fuente.

### En `case_sources`

Estos campos representan identidad contextual frente a la fuente concreta:

- `external_reference`
  - referencia primaria de la fuente; preferir `idProceso`, luego `llaveProceso`.
- `metadata.source_identity`
  - snapshot resumido de la identidad fuente más reciente.

## Qué no debe hacerse

- no sobrescribir el historial de snapshots;
- no duplicar en `cases` toda la respuesta cruda de la fuente;
- no crear tablas nuevas de sujetos o detalle mientras el MVP no lo necesite;
- no inventar clase de proceso cuando la fuente no la entregue.

## Regla de prioridad de identidad

Cuando una consulta exitosa devuelve varios procesos asociados al mismo radicado:

1. se selecciona un proceso primario para persistencia operativa;
2. la selección debe ser estable y explicable;
3. el resto de procesos permanece en `raw_payload` y `metadata`.

Para MVP, la selección primaria puede basarse en:

- última actuación más reciente;
- luego fecha de proceso;
- luego el orden recibido de la fuente.

## Traducción inicial desde CPNU

### Búsqueda por radicado

Campos observados:

- `idProceso`
- `llaveProceso`
- `despacho`
- `departamento`
- `sujetosProcesales`
- `fechaProceso`
- `fechaUltimaActuacion`

### Detalle

Campos observados:

- `tipoProceso`
- `claseProceso`
- `subclaseProceso`
- `despacho`

### Sujetos

`sujetos[]` debe persistirse en `cases.parties` cuando esté disponible.

## Resultado esperado en producto

Después de una consulta exitosa, el sistema debe poder mostrar por proceso:

- despacho;
- sujetos procesales;
- clase/tipo de proceso;
- identificador externo de proceso;
- última actuación conocida de la fuente.

Eso debe estar disponible sin tener que abrir el `raw_payload`.
