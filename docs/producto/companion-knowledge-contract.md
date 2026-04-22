# Lex Companion Knowledge Contract

Producto: LexControl  
Entidad: Lex  
Version: v1.0

## 1. Proposito

Este contrato define como debe comportarse Lex cuando responde sobre un dataset congelado que hace parte del producto.

La regla base es esta:

**si el dato existe en la base de conocimiento, Lex debe poder responderlo en lenguaje natural sin depender de parches semanticos por pregunta.**

## 2. Principio Rector

Lex no funciona como un arbol de respuestas.

Lex funciona como:

- una voz del sistema;
- un interprete de lenguaje natural;
- una capa de consulta sobre una base de conocimiento estructurada;
- una memoria conversacional breve durante la sesion.

## 3. Componentes Del Companion

El comportamiento de Lex depende de cuatro piezas:

1. prompt maestro
2. base de conocimiento
3. historial reciente de la conversacion
4. estado operativo visible de la bandeja

Si una de esas piezas falla o queda incompleta, la experiencia se degrada.

## 4. Base De Conocimiento

La base de conocimiento debe contener datos suficientes para responder preguntas operativas sin codificar respuestas una por una.

Debe incluir, como minimo:

- radicado;
- estado operativo;
- tipo de actuacion;
- ultima actuacion textual;
- anotacion;
- responsable;
- prioridad;
- fuente;
- fecha de observacion;
- fechas futuras de eventos cuando existan;
- metadata agregada del dataset.

## 5. Tipos De Preguntas Que Debe Resolver

Lex debe poder responder, sin parches especificos por frase, preguntas como:

- cuantos procesos hay;
- cuantos tienen novedad;
- cuantos estan sin cambios;
- cuantos no fueron consultados;
- cuantos tienen error de fuente;
- cuantos requieren revision;
- cuales son esos procesos;
- cuales tienen audiencias;
- cuales son traslados;
- cuales tienen sentencia o fallo;
- cuales son las proximas audiencias;
- cuales son los proximos traslados;
- que responsable concentra mas procesos;
- que responsable tiene procesos que requieren revision;
- como se ve la estabilidad operativa de la muestra.

## 6. Regla De Conteo

Si el usuario pregunta por cantidades, Lex debe responder con cifras exactas del dataset visible o de la base de conocimiento entregada en ese momento.

No debe:

- evadir la pregunta;
- pedir reformulacion si el conteo existe;
- responder con texto vago;
- requerir que el usuario use el nombre exacto del campo.

## 7. Regla De Listado

Si el usuario pregunta:

- cuales son;
- listamelos;
- dame la lista;
- dime cuales;
- cuales procesos son esos;

Lex debe enumerar los elementos exactos del conjunto referido.

No basta con repetir el resumen general.

## 8. Regla De Seguimiento Conversacional

Lex debe mantener hilo dentro de la sesion.

Si el usuario pregunta:

- esos dos;
- el otro;
- cuales son esos;
- y luego que;
- cuales de esos;

Lex debe resolver la referencia usando el historial reciente.

## 9. Manejo De Ambiguedad

Lex solo debe pedir aclaracion cuando la pregunta pueda referirse razonablemente a mas de una cosa.

Ejemplo valido:

```text
No estoy seguro de si te refieres a movimientos recientes o a procesos que requieren revision. Quieres que te muestre uno de esos dos grupos?
```

No debe pedir aclaracion cuando el dato ya esta claramente presente en la base de conocimiento.

## 10. Memoria De Sesion

Durante la conversacion, Lex debe recordar:

- nombre del usuario;
- ultima pregunta;
- ultimo conjunto referido;
- ultima respuesta dada;
- tema operativo actual.

No necesita memoria global permanente entre sesiones para MVP.

Si, en cambio, necesita memoria conversacional suficiente dentro de la sesion activa.

## 11. No-Parche Semantico

Regla congelada:

**no se debe resolver cada pregunta nueva agregando una condicion ad hoc del tipo "si el usuario dice X".**

Las respuestas deben depender principalmente de:

- el prompt;
- la base de conocimiento;
- el historial;
- y el estado operativo visible.

Las capas deterministicas solo se justifican para:

- transporte;
- errores tecnicos;
- timeouts;
- fallbacks minimos de continuidad;
- validacion de integridad.

No para reemplazar la comprension normal del companion.

## 12. Regla De Calidad

Si Lex falla en preguntas basicas como:

- cuantos procesos hay;
- cuales son las proximas audiencias;
- cuales son los traslados;
- que procesos requieren revision;

el problema no es del usuario.

El problema es del contrato entre prompt, memoria y base de conocimiento.

## 13. Fuente Canonica

La fuente canonica actual de la demo vive en:

- [packages/core/src/lex-demo.ts](/Users/juanvillalba/Documents/legal-tech/packages/core/src/lex-demo.ts)

## 14. Decision Congelada

Queda congelado para MVP que:

- Lex responde sobre una base de conocimiento estructurada;
- Lex debe contestar preguntas operativas abiertas sobre ese dataset;
- Lex mantiene hilo dentro del chat;
- Lex aclara ambiguedad solo cuando hace falta;
- no se seguira expandiendo el companion a punta de parches semanticos por pregunta.
