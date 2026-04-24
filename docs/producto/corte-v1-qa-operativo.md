# Corte V1 Y QA Operativo

Producto: LexControl  
Superficies evaluadas: `lexcontrol.co`, `app.lexcontrol.co`  
Version: v1.0-prelaunch  
Estado: Rector para consolidacion

Documentos complementarios obligatorios:

```text
docs/producto/product-requirements-mvp-saas.md
docs/producto/problem-solution-fit-lexcontrol.md
docs/producto/contrato-demo-operativa-produccion.md
docs/producto/contrato-ui-app-operativa-lexcontrol.md
```

---

## 1. Proposito Del Documento

Este documento no define nuevas ideas de producto.

Define una pausa de consolidacion.

Su funcion es responder, con criterio operativo, estas preguntas:

```text
Que entra en la V1 onboardeable?
Que flujos deben pasar QA antes de abrir onboarding real?
Que ya aprendimos del desarrollo?
Que sigue desajustado?
Cual es el criterio de salida para decir "ya se puede activar cualquier abogado"?
```

Regla:

```text
La V1 no se declara por entusiasmo.
Se declara por alcance cerrado, flujos probados y promesa cumplible.
```

---

## 2. Tesis Rectora Que Debe Cumplir La V1

Tomando como fuente rectora `problem-solution-fit-lexcontrol.md`, la V1 no se evalua solo por features.

Se evalua por si ya cumple esta promesa:

```text
LexControl no hace que el abogado mire mas.
Hace que solo mire lo que importa.
```

Y, en formulacion operativa:

```text
LexControl convierte una cartera de procesos
en una operacion visible, trazable y silenciosa por defecto,
capaz de decir que cambio, que no cambio, que fallo
y que requiere atencion humana.
```

Todo lo que entre a V1 debe fortalecer al menos una de estas cuatro cosas:

- visibilidad
- trazabilidad
- administracion de atencion
- criterio de accion

Si algo no fortalece una de esas cuatro, no es esencial para V1.

---

## 3. Alcance Exacto De Onboarding Para V1

La V1 onboardeable no es autoservicio total.

Es una activacion suficientemente robusta para que cualquier abogado o firma que entre:

- entienda que recibio un producto real
- pueda operar sin acompanamiento constante
- vea valor real durante la demo

### 3.1 Incluido En V1

- landing coherente con la tesis actual
- activacion comercial desde la landing
- persistencia del lead de activacion
- creacion de cuenta
- login de administrador inicial
- gestion de responsables hasta el limite definido
- carga individual y masiva de procesos
- limites visibles de demo:
  - dias restantes
  - procesos activos
  - responsables activos
- consulta productiva sobre CPNU
- snapshots persistidos
- movimientos persistidos
- eventos legales persistidos
- alertas operativas visibles
- recalculo de derivados operativos
- bandeja como cola de atencion
- detalle por proceso
- monitoreo de fuente y salud operativa
- configuracion basica del sistema operativo
- Lex sobre operacion real

### 3.2 Explicitamente Fuera De V1

- billing y suscripciones productivas
- autoservicio de compra
- SAMAI productivo
- multifuente completo
- WhatsApp productivo
- notificaciones multicanal completas
- consola admin completa en `admin.lexcontrol.co`
- mobile refinado como experiencia final
- IA juridica avanzada
- configuracion avanzada por cliente interno o SLA

### 3.3 Promesa Exacta De La V1

La promesa que debe sostenerse, sin inflarse, es:

```text
Te activamos un espacio real de trabajo en LexControl
para cargar y vigilar hasta 100 procesos activos,
operar con hasta 4 responsables,
ver una bandeja de atencion real,
y usar Lex sobre la operacion de tu cuenta.
```

---

## 4. Lo Que Ya Tenemos Hoy

## 4.1 Capa comercial

- landing viva y reescrita sobre la tesis correcta
- copy ya mas alineado con control operativo y administracion de atencion
- activacion persistida
- agenda integrada

## 4.2 Capa de cuenta

- auth real con Supabase
- organizaciones
- memberships
- responsables reales
- limites de demo visibles

## 4.3 Capa de cartera

- carga individual y masiva
- deteccion de duplicados
- prioridad y responsable base
- inventario de procesos activo

## 4.4 Capa de vigilancia

- `case_sources`
- `source_snapshots`
- `case_movements`
- `legal_events`
- `alerts`
- worker con CPNU
- persistencia real de resultados

## 4.5 Capa operativa

- inicio
- bandeja
- monitoreo
- configuracion
- detalle por proceso
- reglas operativas MVP
- Lex sobre operacion real

## 4.6 Capa de sistema

- design system base
- shell nuevo
- componentes base
- primeros componentes de dominio
- separacion real de marketing y app en carga/bundle

---

## 5. Principales Aprendizajes Del Desarrollo

## 5.1 Aprendizaje De Producto

La formulacion mas fuerte del negocio no es "vigilancia automatizada".

Es:

```text
sistema operativo de vigilancia judicial
orientado a administracion de atencion
```

Eso ordena:

- landing
- bandeja
- Lex
- reglas operativas
- pricing futuro

## 5.2 Aprendizaje De UX

Mostrar todo degrada el valor.

La interfaz debe elevar:

- lo que requiere atencion
- lo que cambio
- lo que fallo
- lo que quedo sin cobertura

y debe dejar en silencio lo estable.

## 5.3 Aprendizaje De Arquitectura

La separacion entre:

- memoria historica
- estado operativo actual

fue una decision correcta.

Hoy la arquitectura ya permite:

- no pisar historia
- mostrar resumen
- abrir profundidad cuando se necesita

## 5.4 Aprendizaje Comercial

La demo no puede sentirse como beta.

El usuario activado no esta probando una idea.

Esta evaluando si se queda o no con el sistema.

## 5.5 Aprendizaje De Implementacion

No convenia seguir agregando features sobre una sola pantalla vieja.

El paso a:

- shell
- contratos
- reglas operativas
- design system

fue el movimiento correcto para que el producto no se deformara.

---

## 6. Desajustes Actuales

Esta seccion no describe fallas estructurales graves.

Describe lo que todavia evita decir "V1 lista".

## 6.1 Desajuste De Lenguaje Visual

La app mejoro mucho, pero todavia no transmite plenamente:

- software de vanguardia
- precision premium
- criterio juridico-operativo de alto nivel

Hoy ya se siente sistema.

Pero todavia no se siente tan refinado como la ambicion del producto.

## 6.2 Desajuste De Cierre Narrativo

Landing, app, onboarding, configuracion y Lex ya convergen bastante mas.

Pero todavia debemos verificar que todos respondan exactamente al mismo hilo:

```text
que cambio
que no cambio
que fallo
que requiere atencion
```

sin volver a meter ruido.

## 6.3 Desajuste De QA Integral

Los bloques se han probado mucho por piezas.

Todavia falta una pasada formal de QA por flujos completos:

- comercial
- cuenta
- cartera
- vigilancia
- operacion

## 6.4 Desajuste De Criterio De V1

Ya hay mucho producto construido.

Lo que falta ahora no es tanto construir mas como:

- decidir que entra
- decidir que no entra
- congelar una salida

## 6.5 Desajuste De Madurez Visual En Estados Auxiliares

Auth, estados vacios, errores, falta de membresia, ausencia de datos y algunas superficies secundarias todavia necesitan una pasada mas fina para que todo tenga la misma autoridad visual.

## 6.6 Desajuste De Responsive

No es el paso inmediato, pero si una deuda ya visible.

No debemos cerrar V1 sin por lo menos validar que:

- shell
- bandeja
- detalle
- configuracion
- Lex

se sostienen con dignidad en viewport estrecho.

## 6.7 Desajuste De Scheduler Y Cadencia Real

La arquitectura de consulta ya existe, pero la politica final de frecuencia y scheduler productivo aun no esta cerrada como experiencia operacional completa de V1.

---

## 7. Checklist De QA Por Flujo

## 7.1 Flujo Comercial

Objetivo: verificar que la promesa y la activacion no se rompen.

Checklist:

- hero y propuesta alineados con problem-solution fit
- CTA de activacion visibles y claros
- modal de activacion persistiendo datos
- calificacion de activacion funcionando
- paso a agenda funcionando
- mensajes consistentes con producto real

Resultado esperado:

```text
el usuario entiende que recibe control operativo real,
no un formulario o una demo ornamental
```

## 7.2 Flujo De Activacion De Cuenta

Objetivo: verificar que una cuenta real puede nacer y operar.

Checklist:

- usuario admin creado
- membership activa
- login funcionando
- organizacion correcta cargada
- limites visibles
- estado de cuenta visible

Resultado esperado:

```text
el abogado entra y percibe que ya tiene su espacio real de trabajo
```

## 7.3 Flujo De Equipo

Objetivo: verificar gestion operativa de responsables.

Checklist:

- crear responsable
- listar responsables
- limite de 4 aplicado
- roles legibles
- mensajes de error claros

Resultado esperado:

```text
la cuenta puede operar con cobertura real
sin depender del equipo interno de LexControl
```

## 7.4 Flujo De Carga De Procesos

Objetivo: verificar que el inventario vigilado se puede construir con confianza.

Checklist:

- carga individual
- carga masiva
- deteccion de duplicados
- manejo de invalidos
- persistencia correcta
- inventario visible despues de la carga

Resultado esperado:

```text
el usuario siente que puede empezar a poblar su cartera sin friccion
```

## 7.5 Flujo De Vigilancia

Objetivo: verificar que la consulta real deja trazabilidad y valor operativo.

Checklist:

- caso entra a `case_sources`
- worker consulta fuente
- se persisten snapshots
- se persisten movimientos
- se persisten eventos
- se persisten alertas
- se actualiza estado operativo

Resultado esperado:

```text
la operacion deja memoria y evidencia,
no solo un ultimo estado superficial
```

## 7.6 Flujo De Bandeja

Objetivo: verificar que la bandeja ya funciona como cola de atencion.

Checklist:

- resumen superior correcto
- filtros operativos funcionando
- filas coherentes
- prioridad visible
- atencion visible
- razones visibles
- detalle abre bien
- detalle cierra bien
- no hay ruido innecesario

Resultado esperado:

```text
la bandeja ayuda a decidir,
no solo a leer actividad
```

## 7.7 Flujo De Monitoreo

Objetivo: verificar que la salud operativa es visible sin contaminar la bandeja.

Checklist:

- fuentes activas
- errores de fuente
- bloqueos
- snapshots recientes
- alertas recientes
- separacion clara frente a bandeja

Resultado esperado:

```text
monitoreo sirve para supervisar el sistema,
no para reemplazar la cola de atencion
```

## 7.8 Flujo De Configuracion

Objetivo: verificar que configuracion ya se siente como parametrizacion del bufete.

Checklist:

- estado de cuenta
- reglas operativas cargan
- reglas operativas guardan
- equipo dentro de configuracion
- procesos dentro de configuracion
- lenguaje claro y no tecnico

Resultado esperado:

```text
el usuario siente que esta afinando como opera su bufete,
no llenando settings abstractos
```

## 7.9 Flujo De Lex

Objetivo: verificar que Lex ya agrega valor real.

Checklist:

- abre y cierra bien
- responde sobre cuenta real
- usa prioridad y atencion
- explica por que un proceso subio
- no narra ruido innecesario
- no responde como demo cuando ya esta en cuenta real

Resultado esperado:

```text
Lex actua como voz del sistema,
no como chatbot cosmetico
```

---

## 8. Hallazgos Que Debemos Buscar En QA

La pasada de QA no debe limitarse a "funciona o no funciona".

Debe capturar hallazgos como estos:

- ambiguedad de lenguaje
- decisiones poco claras
- saturacion visual
- puntos donde el usuario no sabe que hacer primero
- modulos que se pisan entre si
- informacion que deberia estar en silencio y no lo esta
- lugares donde el sistema se siente tecnico en vez de operativo
- promesas comerciales que no se sienten completas adentro

---

## 9. Criterio De Salida Para Declarar V1

La V1 se puede declarar lista para onboarding cuando se cumplan simultaneamente estas condiciones:

### 9.1 Criterio Funcional

Todos los flujos del punto 7 pasan sin bloqueos severos.

### 9.2 Criterio De Promesa

La promesa comercial definida en `contrato-demo-operativa-produccion.md` se cumple sin apoyarse en explicaciones externas o acompanamiento constante.

### 9.3 Criterio De UX

La app ya se siente:

- clara
- util
- silenciosa por defecto
- operativa
- confiable

y no como un panel en construccion.

### 9.4 Criterio De Consistencia

Landing, app, reglas operativas, bandeja y Lex responden al mismo hilo narrativo y funcional.

### 9.5 Criterio De Onboarding

Un abogado nuevo puede:

- entrar
- entender la cuenta
- cargar procesos
- ver valor
- identificar atencion

sin depender de guia continua.

---

## 10. Lo Que Falta Hacer Despues De Este Corte

Una vez terminado este corte, la secuencia correcta es:

1. ejecutar QA completo por flujos
2. documentar hallazgos reales
3. corregir desajustes V1
4. hacer pass visual fino
5. hacer pass responsive
6. congelar release candidate de onboarding

Regla:

```text
no seguir agregando alcance
sin antes cerrar el producto que ya prometimos
```

---

## 11. Decision Ejecutiva

LexControl ya no necesita una fase de "exploracion caotica".

Necesita una fase de:

```text
consolidacion
criterio de salida
QA real
cierre de V1
```

Ese es el trabajo correcto del siguiente tramo.
