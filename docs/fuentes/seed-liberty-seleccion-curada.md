# Seed Liberty - Seleccion Curada de 15 Casos

Fecha de corte: 2026-04-24

## Objetivo

Congelar una primera seleccion curada de 15 radicados adicionales a partir de discovery guiado sobre `LIBERTY SEGUROS SA`, usando despachos ya confirmados en la semilla inicial.

La seleccion busca:

- ampliar volumen sin perder control;
- introducir variedad temporal;
- introducir variedad de roles procesales;
- introducir variedad de contrapartes;
- mantener coherencia con el seed ya existente.

## Fuente de expansion

Discovery guiado en CPNU por:

- razon social: `LIBERTY SEGUROS SA`
- tipo persona: `jur`
- `SoloActivos=false`
- despachos probados:
  - `110014003066`
  - `110014003059`
  - `110014003048`

## Regla de seleccion

Se privilegian casos que aporten al menos una de estas diferencias:

- año distinto;
- Liberty como demandante;
- Liberty como demandada;
- variante de aseguradora (`Liberty Seguros`, `Liberty Seguros de Vida`, `ARL Liberty`);
- contraparte institucional, empresarial, bancaria, IPS o persona natural;
- recencia distinta de ultima actuacion.

## Seleccion Curada

### Grupo A - Liberty en juzgado 048

1. `11001400304820030200800`
   - Liberty como demandante.
   - Contrapartes empresariales y aseguradora.

2. `11001400304820050173800`
   - Persona natural vs Liberty.
   - Caso temprano para abrir serie historica.

3. `11001400304820130022100`
   - Variante nominal: `ASEGURADORA LIBERTY SEGUROS S.A.`

4. `11001400304820150062900`
   - Variante de producto: `LIBERTY SEGUROS DE VIDA S.A.`

5. `11001400304820160025000`
   - Incluye actor bancario adicional (`BANCO GNB SUDAMERIS`).

6. `11001400304820210098900`
   - Liberty como demandante.
   - Contraparte de servicios publicos (`AGUAS DEL MAGDALENA SA ESP`).

7. `11001400304820230016300`
   - Multiples demandantes.
   - Caso reciente.

8. `11001400304820240063700`
   - Alta densidad de sujetos demandantes.
   - Caso reciente y util para stress de parsing de sujetos.

### Grupo B - Liberty en juzgado 059

9. `11001400305920030175700`
   - Liberty como demandante.
   - Serie historica temprana.

10. `11001400305920050058200`
    - Demandante corporativo vs Liberty.

11. `11001400305920110026000`
    - Variante `LIBERTY SEGUROS DE VIDA SA`.
    - Multiples demandados.

12. `11001400305920150172900`
    - IPS / clinica como demandante.

13. `11001400305920160123300`
    - Liberty como demandante.
    - Contrapartes tecnicas/empresariales.

14. `11001400305920240107100`
    - Caso reciente.
    - Actor institucional de salud.

15. `11001400305020230000800`
    - Caso reciente.
    - Demandante corporativo (`TRILLADORA DE CAFE ALFA Y OMEGA SAS`).
    - Aporta un radicado diferente dentro del bloque asociado al despacho 059.

## Resultado esperado

Con esta seleccion:

- se suman 15 casos nuevos controlados;
- se amplian los 14 iniciales sin disparar demasiado volumen de golpe;
- se conserva un seed con variedad suficiente para seguir probando:
  - parsing de sujetos,
  - trazabilidad,
  - reglas de prioridad,
  - clasificacion de atencion,
  - lectura de bandeja.

## Siguiente paso sugerido

1. Cargar estos 15 radicados.
2. Ejecutar consulta enriquecida y persistencia completa.
3. Perfilar:
   - despacho,
   - tipo/clase de proceso,
   - rol de Liberty,
   - recencia de actuacion.
4. Luego pasar a otra razon social para no sesgar el seed.
