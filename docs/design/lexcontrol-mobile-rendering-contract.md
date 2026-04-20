# LexControl — Contrato de Renderización Mobile

Producto: LexControl  
Instrumento: Landing page de activación  
Versión: v1.0  
Estado: contrato de diseño previo a implementación

## 1. Principio Rector

La versión mobile no es la versión desktop comprimida.

En mobile, la landing debe comportarse como un flujo de decisión guiado:

1. Evidenciar el problema.
2. Mostrar la señal operativa.
3. Permitir experimentar Lex.
4. Llevar a activar la demo.

Cada bloque debe empujar el siguiente. Si una sección no ayuda a avanzar la decisión, debe reducirse, plegarse o desaparecer.

## 2. Objetivo De La Experiencia Mobile

El usuario debe entender en menos de 60 segundos:

- qué riesgo tiene su operación;
- qué ve LexControl que hoy no se ve;
- cómo se separan novedades, sin cambios y fallas;
- por qué debe activar una demo.

La experiencia mobile debe sentirse como una conversación operativa, no como una colección de tarjetas.

## 3. Regla De Densidad

En mobile se prohíbe acumular demasiados contenedores visuales consecutivos.

Máximo recomendado:

- 1 bloque fuerte por pantalla;
- 1 CTA principal visible por tramo;
- 3 señales operativas visibles antes de pedir interacción;
- textos de máximo 2 líneas cuando sean microcopy;
- tarjetas solo cuando representen decisiones o estados.

No usar tarjetas para todo.

## 4. Orden Mobile

El orden mobile debe ser:

1. Hero compacto.
2. Problema en formato narrativo.
3. Diagnóstico integrado a demo.
4. Bandeja operativa simplificada.
5. Lex companion como demostración.
6. Demo gratuita controlada.
7. Preguntas frecuentes.
8. Precios.
9. Cierre.
10. Footer.

## 5. Hero Mobile

Debe tener:

- logo visible;
- titular fuerte;
- explicación breve;
- CTA primario: `Activar demo gratis`;
- link secundario: `Ver cómo funciona`.

No debe tener:

- múltiples CTAs equivalentes;
- exceso de microcopy;
- hero demasiado alto;
- imagen de fondo que compita con el texto.

El símbolo puede permanecer como fondo, pero con menor opacidad visual y sin ocupar el centro de lectura.

## 6. Menú Mobile

El menú mobile debe ser un panel desplegable simple.

Debe incluir:

- Problema
- Cómo funciona
- Preguntas
- Precios
- Activar demo gratis

Reglas:

- el menú cerrado no debe ocupar espacio;
- al abrirse debe sentirse como una acción de navegación, no como un modal;
- el CTA debe cerrar el menú y abrir el flujo de activación;
- el usuario no debe perder el contexto de la página.

## 7. Problema Mobile

El bloque de problema debe leerse como una secuencia.

Formato recomendado:

```txt
El riesgo no está solo en que un proceso cambie.

Está en no saber si fue revisado.

Una actuación puede aparecer.
Una fuente puede fallar.
Un proceso puede no consultarse.

Sin trazabilidad, no tienes control.
```

No convertir cada frase en una tarjeta.

## 8. Diagnóstico Mobile

El diagnóstico no debe aparecer como CTA independiente.

Debe presentarse como parte de la activación:

```txt
La demo empieza con un diagnóstico operativo.
No mide qué tan organizado estás.
Mide qué tan visible es tu operación.
```

CTA:

```txt
Activar demo gratis
```

## 9. Bandeja Operativa Mobile

La bandeja actual no debe renderizarse como tabla ni como lista extensa de tarjetas.

En mobile debe ser una demo guiada por estados.

### 9.1 Vista Inicial

Debe mostrar un resumen compacto:

```txt
Bandeja operativa

12 procesos monitoreados
3 con novedad
2 no consultados
1 error de fuente
```

Luego mostrar tres tabs o filtros principales:

- Novedades
- Fallas
- Sin cambios

No mostrar todos los estados de una vez.

### 9.2 Casos Visibles

Mostrar máximo 3 procesos por estado.

Cada proceso debe verse así:

```txt
Novedad
11001400303520230010700
Auto ordena seguir adelante la ejecución
Responsable: Ana María
Hoy
```

No mostrar todas las columnas simultáneamente.

### 9.3 Expansión

Cada proceso puede expandirse para ver:

- fuente;
- anotación;
- prioridad;
- fecha exacta.

La información secundaria debe estar oculta hasta que el usuario la pida.

### 9.4 Estado Vacío

Si un filtro no tiene procesos:

```txt
No hay procesos en esta vista.
```

No usar mensajes largos.

## 10. Lex En Mobile

Lex debe ser el elemento que hace comprensible la bandeja.

En mobile, Lex no debe competir con la tabla. Debe guiarla.

Comportamiento:

- botón flotante visible;
- al abrir, panel inferior tipo sheet;
- altura máxima: 75% del viewport;
- sugerencias visibles;
- input visible;
- scroll interno claro;
- respuestas cortas.

Preguntas sugeridas iniciales:

- ¿Qué cambió hoy?
- ¿Qué falló?
- ¿Qué requiere revisión?
- Dame un resumen

Lex debe responder sobre la bandeja visible y activar el filtro relacionado.

## 11. Demo Gratuita Mobile

Debe vender activación, no explicar demasiado.

Estructura:

```txt
Demo gratuita controlada

Activa LexControl con una muestra real de tu operación.

Incluye:
- hasta 100 procesos;
- hasta 4 responsables;
- bandeja operativa;
- Lex sobre la demo.

[Activar demo gratis]
```

Condiciones secundarias pueden ir plegadas en un acordeón.

## 12. FAQ Mobile

FAQ debe ser acordeón.

Reglas:

- una pregunta abierta a la vez, si se implementa estado controlado;
- respuestas cortas;
- no más de 6 preguntas visibles inicialmente;
- opción `Ver más preguntas` si se requiere.

## 13. Precios Mobile

Los precios deben mostrarse como plan cards, pero con menos ruido.

Orden:

1. Profesional
2. Starter
3. Firma

Razón:

El plan Profesional es el más útil para operar y debe verse primero en mobile.

Cada plan debe mostrar:

- nombre;
- precio;
- volumen;
- 3 beneficios máximo;
- CTA `Activar demo gratis`.

Los add-ons deben ir plegados o en lista simple, no en grid de tarjetas.

## 14. Footer Mobile

Debe ser simple:

- logo;
- contacto;
- WhatsApp;
- redes;

No repetir copy de producto.

## 15. Reglas De Interacción

Todas las interacciones mobile deben cumplir:

- botones de mínimo 40px de alto;
- separación clara entre elementos tocables;
- scroll vertical natural;
- evitar scroll horizontal;
- evitar modales que ocupen toda la experiencia salvo activación;
- Lex debe poder cerrarse fácilmente.

## 16. Regla De Conversión

En mobile solo existen dos acciones comerciales:

1. `Activar demo gratis`
2. `Ver cómo funciona`

Todo lo demás debe soportar esas dos acciones.

No debe existir `Hacer diagnóstico` como CTA independiente.

## 17. Definición De Listo

La versión mobile estará lista cuando:

- se pueda recorrer la landing sin sentir acumulación de tarjetas;
- la bandeja se entienda sin explicar verbalmente;
- Lex ayude a interpretar la bandeja;
- el CTA principal aparezca de forma coherente;
- no exista scroll horizontal;
- iPhone y iPad portrait tengan layouts específicos;
- el flujo de activación sea el único camino comercial principal.

## 18. Implementación Sugerida

Fase 1:

- simplificar hero mobile;
- convertir problema en narrativa;
- rediseñar bandeja mobile por estados;
- convertir Lex mobile en bottom sheet.

Fase 2:

- optimizar demo, FAQ y precios;
- reducir tarjetas repetitivas;
- ordenar precios mobile con Profesional primero;
- plegar add-ons.

Fase 3:

- prueba visual en iPhone;
- prueba visual en iPad portrait;
- ajuste de copy y ritmo.
