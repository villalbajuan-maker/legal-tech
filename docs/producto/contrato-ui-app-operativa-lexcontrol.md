# Contrato De UI App Operativa LexControl

Producto: LexControl  
Superficie: `app.lexcontrol.co`  
Version: v1.0  
Estado: Congelado para implementacion

---

## 1. Decision Rectora

La UI de `app.lexcontrol.co` no es un panel de pruebas, no es una suma de modulos y no es una pantalla larga con bloques apilados.

Es una aplicacion operativa.

Debe sentirse como:

```text
un sistema de control judicial en produccion
```

No como:

- una landing interna
- una consola tecnica
- una pagina de modulos
- una lista larga de tarjetas

Regla:

```text
Cada pantalla debe ayudar a decidir.
No solo a mirar informacion.
```

---

## 2. Proposito Del Contrato

Este documento define exactamente:

- como se estructura la UI
- que va en sidebar
- que va en header
- que modulos existen
- que ve primero el usuario
- como se navega
- como se comporta desktop y mobile
- como se preserva el look profesional prometido en la landing

Busca evitar:

1. seguir construyendo toda la app en una sola pagina
2. acumular secciones sin arquitectura
3. romper la coherencia entre marketing y producto
4. perder la sensacion de control operativo

---

## 3. Principio Visual

La app del cliente debe sentirse como una herramienta de trabajo de alto nivel, no como una demostracion disfrazada.

Debe conservar la inteligencia visual de LexControl, pero el protagonismo visible dentro de la cuenta puede pertenecer al bufete o firma que la opera.

Principio de branding:

- branding principal de la firma o bufete
- firma visual secundaria:
  - `Powered by LexControl`
- presencia de LexControl como sistema y companion, no como marca invasiva en cada esquina

La app debe heredar:

- la paleta operativa
- la jerarquia clara
- el lenguaje de estados
- el tono de control
- la presencia de Lex como voz del sistema

Pero no debe copiar la landing como si fuera una pieza de marketing incrustada.

La landing vende.
La app opera.

Principio:

```text
misma inteligencia de producto
misma inteligencia visual
branding adaptable al bufete
diferente profundidad funcional
```

---

## 4. Modelo De Navegacion

La app operativa debe pasar de una sola pagina a una arquitectura con navegacion persistente.

Estructura congelada:

```text
Sidebar estructural
+ Header superior
+ Main content por modulo
+ Lex como companion flotante o panel invocable
```

No se debe usar:

- una sola pagina con todo visible
- scroll infinito de modulos
- mezcla de resumen, carga, configuracion y bandeja en una sola vista sin separacion real

Regla de navegacion:

```text
la app debe separar
orientacion
operacion
monitoreo
configuracion
```

---

## 5. Layout Base

## 5.1 Desktop

Desktop usa:

- sidebar izquierdo sticky y colapsable
- header superior sticky
- area principal de contenido

Esquema:

```text
| Sidebar | Header + Main |
```

El sidebar no debe consumir viewport innecesariamente.

Debe poder vivir en dos estados:

- `compacto`
- `expandido`

Comportamiento esperado:

- por defecto puede vivir compacto
- al hover o al clic se expande
- debe existir una accion para fijarlo abierto si el usuario quiere dejarlo expandido

Objetivo:

```text
maximizar espacio util sin perder orientacion
```

---

## 5.2 Mobile

Mobile no replica desktop comprimido.

Debe usar:

- top bar
- menu desplegable o drawer
- contenido por vistas separadas
- Lex en modo full viewport cuando se abre

Regla:

```text
mobile no es desktop encogido
```

La bandeja y el detalle no deben competir al mismo tiempo por el mismo viewport si eso rompe legibilidad.

---

## 6. Sidebar

El sidebar es la columna vertebral de la app.

No es decorativo.

Debe contener:

### 6.1 Brand

- logo del bufete o firma
- nombre de la cuenta
- firma secundaria `Powered by LexControl`

Ejemplo:

```text
Villalba Legal
Powered by LexControl
```

### 6.2 Navegacion Principal

La navegacion no debe ser una lista plana sin criterio.

Debe organizarse en secciones visibles.

Estructura congelada:

#### Informacion

1. `Inicio`

#### Operacion

2. `Bandeja`
3. `Monitoreo`

#### Configuracion

4. `Configuracion`

Fase posterior:

5. `Facturacion`
6. `Seguridad`

No meter de entrada:

- FAQ
- ayudas
- textos largos
- bloques comerciales

### 6.3 Footer Del Sidebar

- cerrar sesion
- accion de fijar / soltar sidebar si aplica

No debe contener:

- contadores grandes
- modulo comercial
- demasiados textos de estado

Los datos de capacidad no viven como bloque dominante del sidebar.
Viven en `Inicio` y donde tengan sentido contextual.

---

## 7. Header

El header superior no debe repetir la informacion del sidebar.

Debe servir para:

- contexto de la vista actual
- acciones de la vista
- acceso a Lex
- usuario activo
- acciones globales del espacio de trabajo

Contenido congelado:

### 7.1 Lado Izquierdo

- titulo del modulo actual
- subtitulo corto o contexto operativo

Ejemplo:

```text
Bandeja
Procesos consultados, errores visibles y decisiones pendientes
```

### 7.2 Lado Derecho

- acciones globales
- acceso a Lex
- usuario activo
- menu de cuenta

No es obligatorio que cada modulo tenga boton primario en el header.

Si una accion vive mejor dentro de la propia vista, se queda en la vista.

Ejemplos:

- en `Bandeja`: abrir Lex / refrescar
- en `Monitoreo`: ejecutar lote / refrescar
- en `Configuracion`: guardar cambios cuando aplique

No poner:

- mas de dos acciones primarias
- textos comerciales
- datos redundantes del usuario
- contadores de demo como protagonista

---

## 8. Modulos De La App

Regla general:

Cada modulo debe tener:

- una funcion principal
- una lectura dominante
- una accion primaria clara
- limites visibles sobre lo que no pertenece a esa vista

La app no debe volver a mezclarse como una sola pantalla con bloques.

Los modulos congelados para dia uno son:

1. `Inicio`
2. `Bandeja`
3. `Monitoreo`
4. `Configuracion`

## 8.1 Inicio

Proposito:

Dar un resumen ejecutivo de la cuenta.

Debe mostrar:

- estado de demo
- capacidad operativa usada
- resumen de estado operativo
- atajos a acciones clave
- salud de la operacion

No es la bandeja completa.

Es una vista de orientacion.

Funcion dominante:

```text
entender el estado general de la cuenta en menos de un minuto
```

Preguntas que debe responder:

- como esta mi cuenta hoy?
- cuanto espacio me queda?
- que requiere atencion?

Contenido congelado:

- franja superior de cuenta:
  - estado de cuenta
  - dias restantes de demo cuando aplique
  - procesos activos usados / limite
  - responsables usados / limite
- resumen operativo del dia:
  - con novedad
  - requieren revision
  - errores de fuente
  - no consultados
- proximos eventos
- alertas operativas recientes
- acciones rapidas:
  - ir a bandeja
  - abrir configuracion
  - cargar procesos
  - abrir Lex

No debe mostrar:

- la lista completa de procesos
- el detalle completo de un proceso
- formularios largos
- trazabilidad tecnica de snapshots

Lectura visual esperada:

```text
cuenta
-> salud operativa
-> lo urgente
-> siguiente accion
```

---

## 8.2 Bandeja

Proposito:

Ser el centro operativo diario.

Debe ser la vista mas fuerte del producto.

Debe mostrar:

- resumen superior
- filtros
- listado principal
- seleccion de proceso
- detalle del proceso
- alertas
- snapshots
- proximo evento
- ultima actuacion
- anotacion

La bandeja no debe compartir pantalla con modulos ajenos.

No mezclar en la misma vista:

- formularios de carga
- gestion de responsables
- resumen institucional

La bandeja merece una ruta propia.

Principio:

```text
La bandeja se abre para operar.
No para configurar.
```

Funcion dominante:

```text
leer la cartera y decidir donde intervenir
```

Contenido congelado:

- encabezado operativo:
  - total visible
  - con novedad
  - requieren revision
  - errores de fuente
  - eventos activos
- filtros:
  - estado operativo
  - responsable
  - prioridad
  - fuente
  - proximidad de evento
- lista o tabla principal:
  - radicado
  - estado operativo
  - ultima actuacion
  - proximo evento
  - responsable
  - prioridad
  - fuente
- panel de detalle por proceso:
  - resumen del proceso
  - ultima actuacion
  - anotacion de ultima actuacion
  - alertas
  - eventos juridicos
  - historial de snapshots
  - acceso a Lex contextual

Accion primaria de la vista:

- filtrar y priorizar

Acciones secundarias permitidas:

- refrescar vista
- abrir detalle
- abrir proceso en su modulo completo si aplica

No debe mostrar:

- modulo de equipo
- bloque de capacidad comercial
- formularios de carga masiva
- elementos de marketing
- explicaciones largas

Lectura visual esperada:

```text
que pasa
-> que requiere atencion
-> a quien le corresponde
-> que evidencia tengo
```

### Layout recomendado

Desktop:

- resumen arriba
- filtros debajo
- tabla/lista principal a la izquierda
- detalle del proceso a la derecha cuando se selecciona

Mobile:

- resumen compacto
- filtros
- lista principal
- detalle en panel independiente, drawer o vista secundaria

No dejar el detalle siempre abierto si rompe la lectura principal.

---

## 8.3 Monitoreo

Proposito:

Dar trazabilidad de ejecucion operativa.

Debe contener:

- ultima corrida
- consultas recientes
- estados de consulta
- errores de fuente
- reintentos futuros

Fase posterior:

- disparar lote manual
- ver historial de jobs

No debe ser el centro visual del producto.

Es un modulo de soporte operativo.

Funcion dominante:

```text
supervisar la salud de la vigilancia y de las fuentes
```

Contenido congelado:

- resumen de corridas recientes
- estado por fuente
- procesos no consultados
- errores de fuente
- reintentos o ultima ejecucion
- lista de snapshots recientes o actividad reciente

Accion primaria de la vista:

- ejecutar lote manual o refrescar corrida, cuando esa accion exista

No debe mostrar:

- la bandeja principal completa
- gestion de responsables
- carga masiva de procesos como accion dominante
- copy comercial

Lectura visual esperada:

```text
como esta corriendo la vigilancia
-> que fallo
-> que quedo pendiente
-> que debo reintentar o revisar
```

---

## 8.4 Configuracion

Proposito:

Parametrizar el espacio de trabajo del bufete.

Configuracion no es un cajon de sastre.

Debe concentrar todo lo que define:

- identidad de la cuenta
- usuarios y accesos
- inventario base
- reglas operativas
- notificaciones

Funcion dominante:

```text
ajustar como opera el sistema para este bufete
```

Subsecciones congeladas:

### 8.4.1 Firma O Bufete

- nombre del bufete o firma
- logo
- ciudad o datos generales
- branding visible en la app
- firma secundaria `Powered by LexControl`

### 8.4.2 Colaboradores

- responsables activos
- rol
- estado
- alta de responsable
- desactivacion posterior
- control de accesos

### 8.4.3 Procesos

- carga individual
- carga masiva
- inventario maestro
- estado interno del proceso
- responsable
- prioridad
- acciones de activar, pausar o archivar

La carga de procesos deja de ser modulo propio y pasa a ser parte de la parametrizacion operativa de la cuenta.

### 8.4.4 Notificaciones

- reglas de notificacion
- canales disponibles
- frecuencia o comportamiento

### 8.4.5 Reglas Operativas

La subseccion `Reglas operativas` no se limita a consulta.

Es la capa con la que el bufete adapta como se comporta LexControl sin convertir la cuenta en desarrollo a medida.

Debe dividirse explicitamente en:

#### a. Consulta

- frecuencia por prioridad
- reglas de recencia
- tratamiento de errores de fuente
- consulta puntual por proceso
- proteccion de la fuente ante volumen

#### b. Prioridad

- criterios que elevan prioridad
- criterios que reducen prioridad
- reglas por tipo de actuacion
- reglas por cercania de evento
- prioridad manual y prioridad calculada

Contrato rector:

```text
docs/producto/contrato-reglas-prioridad.md
```

#### c. Atencion

- que aparece en bandeja principal
- que queda visible solo en monitoreo
- que puede permanecer en silencio
- que entra a resumen ejecutivo o lectura de Lex

Contrato rector:

```text
docs/producto/contrato-reglas-atencion.md
```

#### d. Notificaciones

- canales
- frecuencia
- severidad minima para interrumpir
- comportamiento por responsable
- escalamiento de alertas

Contrato rector:

```text
docs/producto/contrato-reglas-notificaciones.md
```

#### e. Asignacion

- reglas para asignar responsables
- defaults por tipo de proceso o criterio operativo
- comportamiento cuando un caso entra sin responsable

Contrato rector:

```text
docs/producto/contrato-reglas-asignacion.md
```

#### f. Escalamiento

- cuando una falla pasa a revision
- cuando un evento sube de severidad
- cuando una alerta no atendida debe escalar
- cuando una situacion debe salir del silencio operativo

Contrato rector:

```text
docs/producto/contrato-reglas-escalamiento.md
```

Principio:

```text
reglas operativas = como este bufete quiere que el sistema interprete,
priorice, señale y distribuya la operacion
```

Contratos relacionados:

- `docs/producto/contrato-reglas-operativas-consulta.md`
- `docs/producto/contrato-reglas-prioridad.md`
- `docs/producto/contrato-reglas-atencion.md`
- `docs/producto/contrato-reglas-notificaciones.md`
- `docs/producto/contrato-reglas-escalamiento.md`

Contrato complementario futuro:

```text
las otras familias de reglas operativas deben documentarse
con el mismo nivel de precision que hoy tiene consulta
```

No es necesario abrir toda esta profundidad en dia uno, pero la arquitectura debe preverla desde ya.

Accion primaria de la vista:

- guardar configuracion o abrir modal de carga segun subseccion

No debe mostrar:

- bandeja operativa principal
- timeline juridico completo como protagonista
- bloques comerciales

Lectura visual esperada:

```text
como esta configurada la cuenta
-> quienes operan
-> que inventario vive ahi
-> que reglas gobiernan la operacion
```

---

## 9. Lex En La App Operativa

Lex no vive como modulo principal del sidebar.

Lex es companion de la operacion.

Debe invocarse desde:

- icono persistente flotante
- accion visible en header

No debe sentirse como chat de soporte.

Debe leer:

- cuenta activa
- bandeja activa
- procesos visibles
- alertas
- snapshots
- eventos
- responsables
- capacidad
- demo restante

Lex debe responder sobre la cuenta real.

No sobre dataset demo.

Contrato rector:

```text
docs/producto/lex_voice_contract.md
```

---

## 10. Jerarquia De Informacion

La UI debe leer asi:

1. estado de cuenta
2. salud operativa
3. prioridad
4. ultima actuacion
5. evento o alerta
6. responsable
7. evidencia tecnica solo cuando se necesita

No al reves.

Error comun a evitar:

```text
mostrar demasiados campos sin jerarquia
```

La app no debe parecer una exportacion de base de datos.

---

## 11. Look Profesional Esperado

La app debe producir esta sensacion:

```text
esto es serio
esto esta operando
esto esta diseñado
```

Eso implica:

- espaciado consistente
- tipografia con jerarquia fuerte
- estados visuales claros
- pocos elementos por pantalla
- modulos con aire
- contraste suficiente
- cero sensacion de prototipo

No debe haber:

- demasiadas tarjetas iguales
- secciones montadas una debajo de otra sin respiracion
- headers redundantes
- CTA de marketing dentro de la operacion
- lenguaje promocional dentro de la app

---

## 12. Reglas De Comportamiento UX

### 12.1 Una vista, un trabajo principal

Cada modulo debe tener un trabajo dominante.

### 12.2 El detalle se invoca

El detalle de proceso no debe vivir siempre abierto si interfiere con la lista.

Debe abrirse por seleccion y cerrarse con claridad.

### 12.3 Los filtros no deben romper contexto

Si filtras y el proceso seleccionado desaparece, la UI debe reaccionar de forma clara y limpia.

### 12.4 El resumen no compite con la operacion

Los totales y contadores orientan.

No deben comerse la pantalla.

### 12.5 El mobile es una experiencia propia

Las vistas criticas deben resolverse en mobile con criterio:

- lista
- detalle
- Lex
- filtros

No como version comprimida del desktop.

---

## 13. Arquitectura Inicial De Navegacion

Se congela esta navegacion inicial:

```text
/          -> Inicio
/bandeja   -> Bandeja
/monitoreo -> Monitoreo
/configuracion -> Configuracion
```

Fase posterior:

```text
/configuracion/firma
/configuracion/colaboradores
/configuracion/procesos
/configuracion/notificaciones
/configuracion/reglas
```

No hace falta crear todas las rutas hoy si no alcanza.

Pero la UI debe construirse ya con esa arquitectura mental.

No seguir apilando todo en una sola pantalla.

---

## 14. Criterio De Listo

La UI operativa de `app.lexcontrol.co` se considera bien encaminada cuando:

1. tiene sidebar persistente
2. tiene header por modulo
3. separa claramente Inicio, Bandeja, Monitoreo y Configuracion
4. cada modulo tiene una funcion dominante clara
5. la bandeja tiene ruta y comportamiento propios
6. la cuenta muestra estado demo y capacidad
7. Lex se integra como companion operativo
8. desktop y mobile se sienten intencionales
9. la experiencia se ve coherente con la promesa visual de la landing
10. la app ya no se percibe como prototipo, consola tecnica ni pagina larga de bloques

---

## 15. Orden Recomendado De Implementacion

1. scaffold de layout con sidebar + header + rutas
2. mover estado de demo a `Inicio`
3. separar `Bandeja` como vista propia
4. convertir `Consultas` en `Monitoreo`
5. concentrar firma, colaboradores, procesos y reglas dentro de `Configuracion`
6. reintegrar Lex sobre la arquitectura final
7. refinar branding del bufete + firma `Powered by LexControl`

Regla final:

```text
Primero arquitectura de la interfaz.
Luego refinamiento visual.
Luego profundidad funcional.
```
