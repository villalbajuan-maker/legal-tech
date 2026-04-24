# Seed Positiva - Seleccion Curada de 25 Casos

Fecha de corte: 2026-04-24

## Objetivo

Congelar una seleccion curada de 25 radicados adicionales a partir de discovery guiado sobre `POSITIVA COMPAÑIA DE SEGUROS S.A.`, aprovechando que los despachos probados devolvieron lotes pequenos y directamente utiles para cerrar el dataset objetivo.

La seleccion busca:

- completar el objetivo de 84 radicados del seed;
- incorporar una cuarta familia de aseguradora;
- mantener expansion controlada;
- no dejar radicados utiles regados cuando el volumen ya es manejable.

## Fuente de expansion

Discovery guiado en CPNU por:

- razon social: `POSITIVA COMPAÑIA DE SEGUROS S.A.`
- tipo persona: `jur`
- `SoloActivos=false`
- despachos probados:
  - `110014003048` -> 3 registros
  - `110014003059` -> 11 registros
  - `110014003066` -> 4 registros
  - `110014003077` -> 6 registros
  - `110014189018` -> 1 registro

## Regla de seleccion

Se privilegian estos criterios:

- incluir lotes completos cuando el volumen ya es manejable;
- cubrir civil municipal y pequenas causas;
- mezclar Positiva / ARL Positiva / Compania de Seguros Positiva;
- cerrar el objetivo numerico del seed sin abrir otra familia adicional.

## Seleccion Curada

### Grupo A - Positiva en juzgado 048

1. `11001400304820110022200`
2. `11001400304820150098200`
3. `11001400304820230150200`

### Grupo B - Positiva en juzgado 059

4. `11001400305920090023000`
5. `11001400305920090155300`
6. `11001400305920100062000`
7. `11001400305920140026500`
8. `11001400305920160115600`
9. `11001400305920170064800`
10. `11001400305920180092000`
11. `11001400305920210088300`
12. `11001400305920210097500`
13. `11001400305920230013200`
14. `11001400305920240023100`

### Grupo C - Positiva en juzgado 066

15. `11001400306620150069800`
16. `11001400306620170091500`
17. `11001400306620170122600`
18. `11001400306620260033300`

### Grupo D - Positiva en juzgado 077

19. `11001400307720180000100`
20. `11001400307720190045000`
21. `11001400307720210118400`
22. `11001400307720220041800`
23. `11001400307720220062100`
24. `11001400307720230118700`

### Grupo E - Positiva en juzgado 018

25. `11001418901820230203700`

## Resultado esperado

Con esta seleccion:

- se suman 25 radicados nuevos;
- el seed alcanza el objetivo previsto de 84 radicados;
- el dataset queda distribuido en cuatro familias de aseguradora:
  - Liberty
  - Suramericana
  - Mapfre
  - Positiva

## Corte consolidado del seed

- base inicial: `14`
- Liberty curada: `15`
- Suramericana curada: `15`
- Mapfre curada: `15`
- Positiva curada: `25`

Total:

- **84 radicados**

## Siguiente paso sugerido

1. Consolidar los 84 en un artefacto unico de dataset.
2. Cargar el bufete demo con ese bloque.
3. Ejecutar QA funcional serio sobre la operacion completa.
