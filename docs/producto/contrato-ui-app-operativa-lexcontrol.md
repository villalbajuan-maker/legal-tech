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

La app del cliente debe ser recognoscible como el mismo producto que el usuario vio en la landing.

Debe heredar:

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
misma marca
misma inteligencia visual
diferente profundidad funcional
```

---

## 4. Modelo De Navegacion

La app operativa debe pasar de una sola pagina a una arquitectura con navegacion persistente.

Estructura congelada:

```text
Sidebar persistente
+ Header superior
+ Main content por modulo
+ Lex como companion flotante o panel invocable
```

No se debe usar:

- una sola pagina con todo visible
- scroll infinito de modulos
- mezcla de resumen, equipo, carga y bandeja en una sola vista sin separacion real

---

## 5. Layout Base

## 5.1 Desktop

Desktop usa:

- sidebar izquierdo fijo
- header superior
- area principal de contenido

Esquema:

```text
| Sidebar | Header + Main |
```

El sidebar debe ser estable y corto.

No debe crecer con ruido.

Debe contener navegacion estructural, no acciones secundarias.

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

- logo LexControl
- nombre de la cuenta
- estado de cuenta

Ejemplo:

```text
LexControl
Juanca Legal
Demo activa
```

### 6.2 Navegacion Principal

Items iniciales congelados:

1. `Inicio`
2. `Bandeja`
3. `Procesos`
4. `Equipo`
5. `Consultas`

Fase posterior:

6. `Configuracion`

No meter de entrada:

- FAQ
- ayudas
- textos largos
- bloques comerciales

### 6.3 Estado De Demo

Dentro del sidebar o inmediatamente debajo del brand debe aparecer un bloque compacto con:

- dias restantes
- procesos usados / limite
- responsables usados / limite

No como una card gigantesca.

Debe sentirse como informacion estructural del espacio de trabajo.

### 6.4 Accion Final

- cerrar sesion

Nada mas en dia uno.

---

## 7. Header

El header superior no debe repetir la informacion del sidebar.

Debe servir para:

- contexto de la vista actual
- acciones de la vista
- acceso a Lex

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

- accion primaria de la vista
- accion secundaria si aplica
- acceso a Lex

Ejemplos:

- en `Procesos`: `Cargar procesos`
- en `Equipo`: `Crear responsable`
- en `Consultas`: `Ejecutar lote`

No poner:

- mas de dos acciones primarias
- textos comerciales
- datos redundantes del usuario

---

## 8. Modulos De La App

Regla general:

Cada modulo debe tener:

- una funcion principal
- una lectura dominante
- una accion primaria clara
- limites visibles sobre lo que no pertenece a esa vista

La app no debe volver a mezclarse como una sola pantalla con bloques.

## 8.1 Inicio

Proposito:

Dar un resumen ejecutivo de la cuenta.

Debe mostrar:

- estado de demo
- procesos activos usados / limite
- responsables usados / limite
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
  - demo activa / estado de cuenta
  - dias restantes
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
  - cargar procesos
  - crear responsable
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

## 8.3 Procesos

Proposito:

Gestionar inventario y carga.

Debe contener:

- carga individual
- carga masiva
- listado de procesos
- capacidad usada
- asignacion de responsable
- prioridad

No debe intentar ser la bandeja.

La logica es:

```text
Procesos = administrar inventario
Bandeja = operar ese inventario
```

Funcion dominante:

```text
incorporar, ordenar y mantener la cartera activa
```

Contenido congelado:

- capacidad usada:
  - procesos activos / limite
- acciones de carga:
  - carga individual
  - carga masiva
- inventario maestro:
  - radicado
  - estado interno del proceso
  - responsable
  - prioridad
  - fuente principal
  - fecha de creacion
- acciones por proceso:
  - asignar responsable
  - cambiar prioridad
  - archivar o pausar

Accion primaria de la vista:

- cargar procesos

No debe mostrar:

- timeline de snapshots como protagonista
- alertas operativas completas
- resumen ejecutivo de cuenta
- panel de Lex como centro de la experiencia

Lectura visual esperada:

```text
que inventario tengo
-> cuanto cupo queda
-> que puedo cargar o ajustar
```

---

## 8.4 Equipo

Proposito:

Gestionar responsables reales de la cuenta.

Debe contener:

- responsables activos
- limite disponible
- crear responsable
- estado del usuario
- rol

Fase posterior:

- desactivar
- reasignar
- editar

No mezclar Equipo con Configuracion general.

Funcion dominante:

```text
administrar quienes operan la cuenta
```

Contenido congelado:

- contador de responsables activos / limite
- lista de responsables:
  - nombre
  - correo
  - rol
  - estado
  - fecha de creacion
- accion de crear responsable
- estado de ocupacion de capacidad

Accion primaria de la vista:

- crear responsable

No debe mostrar:

- procesos completos
- bandeja operativa
- estados de fuente por proceso
- configuraciones no relacionadas con usuarios

Lectura visual esperada:

```text
quien opera
-> cuantos cupos quedan
-> a quien puedo sumar o ajustar
```

---

## 8.5 Consultas

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

Decision de lenguaje:

Si el termino `Consultas` se percibe ambiguo frente al usuario final, puede reemplazarse por:

- `Actividad`
- `Monitoreo`

La decision final debe tomarse antes del refinamiento visual definitivo.

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
/procesos  -> Procesos
/equipo    -> Equipo
/consultas -> Consultas
```

Fase posterior:

```text
/configuracion
```

No hace falta crear todas las rutas hoy si no alcanza.

Pero la UI debe construirse ya con esa arquitectura mental.

No seguir apilando todo en una sola pantalla.

---

## 14. Criterio De Listo

La UI operativa de `app.lexcontrol.co` se considera bien encaminada cuando:

1. tiene sidebar persistente
2. tiene header por modulo
3. separa claramente Inicio, Bandeja, Procesos, Equipo y Consultas
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
4. mover carga a `Procesos`
5. mover responsables a `Equipo`
6. dejar `Consultas` como vista de soporte operativo
7. reintegrar Lex sobre la arquitectura final

Regla final:

```text
Primero arquitectura de la interfaz.
Luego refinamiento visual.
Luego profundidad funcional.
```
