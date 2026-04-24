# Seed Mapfre - Seleccion Curada de 15 Casos

Fecha de corte: 2026-04-24

## Objetivo

Congelar una primera seleccion curada de 15 radicados adicionales a partir de discovery guiado sobre `MAPFRE SEGUROS GENERALES DE COLOMBIA S.A.`, usando despachos que devolvieron lotes pequenos y utiles para semilla.

La seleccion busca:

- ampliar volumen con una tercera familia de aseguradora;
- mantener variedad entre despachos;
- conservar una expansion controlada;
- dejar una pequena reserva para una pasada posterior si hace falta completar el dataset.

## Fuente de expansion

Discovery guiado en CPNU por:

- razon social: `MAPFRE SEGUROS GENERALES DE COLOMBIA S.A.`
- tipo persona: `jur`
- `SoloActivos=false`
- despachos probados:
  - `110014003048` -> 8 registros
  - `110014003059` -> 6 registros
  - `110014003066` -> 6 registros
  - `110014003077` -> 0 registros
  - `110014189018` -> 0 registros

## Regla de seleccion

Se privilegian estos criterios:

- incluir completos los lotes pequenos y manejables (`059` y `066`);
- tomar una muestra corta y diversa de `048`;
- cubrir anos tempranos, intermedios y recientes;
- mezclar Mapfre como demandante, demandada y llamada en garantia.

## Seleccion Curada

### Grupo A - Mapfre en juzgado 059

1. `11001400305020230029400`
2. `11001400305920020070100`
3. `11001400305920090027000`
4. `11001400305920090036400`
5. `11001400305920110086400`
6. `11001400305920230012200`

### Grupo B - Mapfre en juzgado 066

7. `11001400306620120031700`
8. `11001400306620170061500`
9. `11001400306620190058600`
10. `11001400306620210098200`
11. `11001400306620230141700`
12. `11001400306620240080800`

### Grupo C - Mapfre en juzgado 048

13. `11001400304820060093200`
14. `11001400304820210004400`
15. `11001400304820250038200`

## Reserva no incluida por ahora

Quedan reservados en `048` para una siguiente pasada si hicieran falta mas radicados:

- `11001400304820210000700`
- `11001400304820210091400`
- `11001400304820220036300`
- `11001400304820250080600`
- `11001400304820250118000`

## Resultado esperado

Con esta seleccion:

- se suman 15 radicados nuevos y controlados;
- el seed incorpora una tercera razon social fuerte;
- el dataset gana mezcla suficiente sin abrir demasiado un solo frente;
- queda una reserva inmediata si luego necesitamos completar volumen sin cambiar de metodo.

## Siguiente paso sugerido

1. Incorporar estos 15 al dataset de trabajo.
2. Actualizar el consolidado total del seed.
3. Evaluar si con `Positiva` cerramos el objetivo de 84, o si primero usamos la reserva de `048`.
