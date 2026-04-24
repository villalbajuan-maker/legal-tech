# Seed Suramericana - Seleccion Curada de 15 Casos

Fecha de corte: 2026-04-24

## Objetivo

Congelar una primera seleccion curada de 15 radicados adicionales a partir de discovery guiado sobre `SEGUROS GENERALES SURAMERICANA S.A.`, usando despachos acotados que devolvieron lotes manejables.

La seleccion busca:

- ampliar volumen sin perder control;
- mantener variedad entre despachos;
- evitar duplicados frente a la semilla inicial;
- dejar reservas claras para una siguiente pasada.

## Fuente de expansion

Discovery guiado en CPNU por:

- razon social: `SEGUROS GENERALES SURAMERICANA S.A.`
- tipo persona: `jur`
- `SoloActivos=false`
- despachos probados:
  - `110014003048` -> 13 registros
  - `110014003059` -> 8 registros
  - `110014003066` -> 16 registros
  - `110014003077` -> 11 registros
  - `110014189018` -> 7 registros

## Regla de seleccion

Se privilegian estos criterios:

- lotes naturalmente acotados;
- mezcla de despachos;
- inclusion de pequenas causas y civil municipal;
- exclusion de radicados ya presentes en la semilla inicial;
- reservar `048` y `066` como siguiente bolsa de expansion, para no inflar el seed demasiado rapido.

## Seleccion Curada

### Grupo A - Suramericana en juzgado 059

1. `11001400305920140123100`
2. `11001400305920240060200`
3. `11001400305920240072600`
4. `11001400305920240138300`
5. `11001400305920250016000`
6. `11001400305920250057500`
7. `11001400305920250100300`
8. `11001400305920250128900`

### Grupo B - Suramericana en juzgado 018

9. `11001418901820220042600`
10. `11001418901820230101100`
11. `11001418901820240001000`
12. `11001418901820240153500`
13. `11001418901820260069000`
14. `11001418901820260072600`

Nota:

- `11001418901820240057700` no se incluye porque ya hace parte de la semilla inicial.

### Grupo C - Suramericana en juzgado 077

15. `11001400307720200039100`

## Resultado esperado

Con esta seleccion:

- se suman 15 radicados nuevos y deduplicados;
- el seed gana una segunda familia fuerte por razon social;
- se mantiene una expansion controlada;
- quedan `048` y `066` reservados como siguiente bolsa natural si queremos profundizar en Suramericana.

## Siguiente paso sugerido

1. Incorporar estos 15 al dataset de trabajo.
2. Actualizar el consolidado de semilla total.
3. Pasar a la siguiente razon social antes de seguir profundizando en Suramericana.
