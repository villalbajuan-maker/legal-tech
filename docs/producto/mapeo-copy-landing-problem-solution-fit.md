# Mapeo De Copy Landing Desde Problem-Solution Fit

## Estado

Documento de trabajo para alinear la landing con la tesis refinada de negocio.

No reemplaza la landing actual.

Su funcion es:

- extraer la narrativa que hoy existe;
- compararla contra la tesis consolidada;
- definir que conservar, que corregir y como reescribir.

Documento fuente de negocio:

```text
docs/producto/problem-solution-fit-lexcontrol.md
```

Documento fuente de landing:

```text
apps/web/src/main.tsx
```

---

## 1. Sintesis De La Tesis Que Debe Gobernar La Landing

La sintesis rectora ya no debe ser simplemente:

```text
control operativo
```

Sino esta:

```text
LexControl no vende consultas judiciales.
Vende control operativo sobre una cartera de procesos.
```

Y tampoco debe quedarse solo ahi.

La capa mas madura de la tesis es esta:

```text
LexControl no hace que el abogado mire mas.
Hace que solo mire lo que merece su atencion.
```

Y la promesa concreta que debe sentirse en toda la landing es:

```text
saber que cambio, que no cambio, que fallo
y que realmente requiere atencion humana
```

La landing no debe vender automatizacion por si sola.

Debe vender:

```text
visibilidad confiable y administracion de atencion
sobre una operacion judicial que hoy se ejecuta con zonas ciegas
```

---

## 2. Lectura General Del Copy Actual

La landing actual ya tiene algo muy valioso:

- identifica bien la tension;
- evita tono generico SaaS;
- habla de trazabilidad;
- separa novedades, sin cambios y fallas;
- demuestra la bandeja;
- no se vende como marketing vacio.

Lo que hoy esta fuerte:

1. El problema no es revisar procesos.
2. La nocion de procesos no revisados.
3. La idea de visibilidad y trazabilidad.
4. La bandeja como centro de decision.
5. La demo como muestra real y no como formulario cosmético.

Lo que hoy todavia puede afinarse:

1. Todavia aparece muy centrada en la consulta como mecanismo visible.
2. No siempre formula con suficiente fuerza que el producto opera sobre una cartera viva.
3. A veces habla de la bandeja como vista del sistema, cuando podria hablar de la operacion del cliente.
4. El “como funciona” todavia puede conectarse mejor con la tesis:
   no solo consulta, clasifica y prioriza;
   tambien convierte una operacion fragmentada en una operacion legible y silenciosa por defecto.
5. La seccion de precios todavia comunica capacidad, pero puede anclarse mejor a “capacidad operativa vigilada”.
6. Aun puede reforzarse mejor que el sistema no agrega carga cognitiva; la reduce.

---

## 3. Hilo Narrativo Recomendado

La narrativa completa de landing deberia seguir esta secuencia:

```text
1. Tension operativa
2. Problema visible
3. Problema mas profundo
4. Mecanismo de control
5. Demostracion
6. Activacion
7. Resolucion de objeciones
8. Precio como continuidad del control
9. Cierre
```

Traducido a copy:

```text
No sabes si tu operacion realmente esta cubierta
↓
revisar no equivale a tener control
↓
el verdadero problema es no saber que no se reviso o que fallo
↓
LexControl convierte consultas en trazabilidad y administracion de atencion
↓
la bandeja demuestra ese control
↓
la demo lo lleva a una muestra real de tu operacion
↓
las FAQ resuelven objeciones
↓
el precio expresa capacidad operativa
↓
si no puedes ver la operacion, no puedes controlarla
```

---

## 4. Mapeo Seccion Por Seccion

## 4.1 Hero

### Copy Actual

```text
El problema no es revisar procesos.
Es no saber cuáles nunca fueron revisados.

La mayoría de los equipos jurídicos cree que está al día.
Pero no puede demostrar qué procesos fueron realmente consultados,
cuáles fallaron y cuáles nunca se revisaron.

LexControl convierte esa incertidumbre en control operativo.
```

### Lectura

Muy bueno.

Ya toca un nervio real y no suena a marketing genérico.

### Lo Que Falta

Todavia no nombra del todo la unidad de valor:

```text
cartera de procesos
```

Ni deja claro que lo que se controla no es un caso aislado sino la operacion completa.

Tampoco deja explicito que el sistema no viene a pedir mas tiempo mental,
sino a liberar atencion para lo que de verdad importa.

### Ajuste Recomendado

Conservar la apertura.

Reforzar en la segunda o tercera linea que el producto controla una cartera operativa, no una consulta.

### Copy Recomendado

```text
El problema no es revisar procesos.
Es no saber cuáles no fueron revisados, cuáles fallaron y cuáles realmente requieren tu atención.

La mayoría de los equipos jurídicos cree que está al día.
Pero no puede demostrar qué pasó realmente en su cartera de procesos:
qué cambió, qué sigue igual y qué no se pudo consultar.

LexControl convierte esa incertidumbre en control operativo y atención bien administrada.
```

### Funcion Narrativa

Abrir la herida correcta:

```text
no falta trabajo
falta visibilidad confiable
y sobra carga cognitiva innecesaria
```

---

## 4.2 Microcopy Del Hero

### Copy Actual

```text
Demo controlada para abogados y firmas que manejan volumen real de procesos.
No necesitas datos sensibles para solicitar acceso.
```

### Lectura

Correcto, pero tactico.

### Ajuste Recomendado

Hacer que el microcopy no solo reduzca friccion sino que recuerde el tipo de valor.

### Copy Recomendado

```text
Demo controlada para equipos que necesitan control operativo sobre volumen real de procesos.
No necesitas datos sensibles para solicitar acceso.
```

Version aun mas afinada:

```text
Demo controlada para equipos que necesitan control operativo sin aumentar la carga de revision.
No necesitas datos sensibles para solicitar acceso.
```

---

## 4.3 Transicion

### Copy Actual

```text
Puedes revisar procesos todos los días.
Y aún así estar dejando casos sin revisar.
```

### Lectura

Muy buena.

### Ajuste Recomendado

Mantener casi intacta.

### Copy Recomendado

```text
Puedes revisar procesos todos los días.
Y aun así no saber qué parte de tu operación quedó sin cubrir.
```

### Funcion Narrativa

Mover al usuario de:

```text
actividad
```

hacia:

```text
cobertura operativa
y administracion de atencion
```

---

## 4.4 Seccion Problema

### Copy Actual

```text
El riesgo no está solo en que un proceso cambie.
Está en no saber si fue revisado.
```

y luego:

```text
Una actuación puede aparecer.
Una audiencia puede moverse.
Una fuente puede fallar.
Un proceso puede no consultarse.
Un responsable puede asumir que alguien más lo vio.
Y no hay una forma clara de saber cuándo pasó.
```

### Lectura

Muy alineado con la tesis.

### Lo Que Puede Mejorar

Todavia puede profundizar mejor la idea de operacion, no solo de proceso.
Y puede decir con mas fuerza que el costo no es solo la omision.
Tambien es el desgaste mental de perseguir actividad sin jerarquia.

### Copy Recomendado

```text
El riesgo no está solo en que un proceso cambie.
Está en no poder leer con claridad qué pasó en la operación.

Una actuación puede aparecer.
Una audiencia puede moverse.
Una fuente puede fallar.
Un proceso puede no consultarse.
Un responsable puede asumir que alguien más ya lo vio.

Y la operación sigue adelante sin una señal clara de lo que realmente ocurrió.
```

### Remate Recomendado

```text
No es un problema de disciplina.
Es un problema de trazabilidad operativa.

Si no puedes demostrar qué se consultó, qué falló y qué quedó pendiente,
no tienes control.
```

Version con la nueva tesis:

```text
Y si todo exige la misma atencion,
tampoco tienes control.
```

### Funcion Narrativa

Bajar del “evento aislado” al “sistema de trabajo”.

---

## 4.5 Entrada A Diagnostico / Activacion

### Copy Actual

```text
Este diagnóstico no mide qué tan organizado estás.
Hace parte de la activación de demo y mide qué tan expuesta está tu operación a errores que no puedes detectar.
```

### Lectura

Está bien orientado, aunque mezcla un poco diagnostico y activacion.

### Ajuste Recomendado

Que se sienta menos como instrumento y mas como evidencia del problema.

### Copy Recomendado

```text
Esta activación no parte de una llamada comercial.
Parte de una pregunta simple:

qué tan visible es hoy tu operación cuando algo cambia, algo falla o algo queda sin consultar.
```

### Funcion Narrativa

Hacer que la activacion se perciba como:

```text
diagnostico de control
```

no como:

```text
lead form
```

---

## 4.6 Solucion / Como Funciona

### Copy Actual

```text
Consulta
Clasifica
Prioriza
```

### Lectura

Funciona, pero puede quedarse corto si el usuario lo interpreta como automatizacion lineal.

### Ajuste Recomendado

Seguir usando la estructura, pero cada paso debe anclarse al problema de control operativo.

### Copy Recomendado

```text
Consulta
Registra cada intento. Incluso cuando la fuente falla.

Clasifica
Convierte el resultado en estados operativos: novedad, estabilidad, falla o revisión.

Prioriza
Muestra qué proceso requiere atención, quién responde y qué parte de la operación sigue pendiente.
```

### Funcion Narrativa

Mover el “cómo” desde mecánica de producto hacia:

```text
mecanismo de generación de control
```

---

## 4.7 Cambio De Modelo

### Copy Actual

```text
Hoy operas así:
Revisión manual, Excel, mensajes y supuestos.

Con LexControl:
Una operación visible, trazable y priorizada.
```

### Lectura

Muy buena estructura.

### Ajuste Recomendado

El lado derecho puede hablar menos de elementos UI y más de capacidad operativa.

### Copy Recomendado

```text
Hoy operas así:
revisión manual
Excel
mensajes
suposiciones

Con LexControl:
una cartera visible
consultas trazables
fallas explícitas
prioridades claras
responsables visibles
```

### Funcion Narrativa

Hacer sentir:

```text
esto no es una herramienta nueva
es una forma distinta de operar
```

---

## 4.8 Seccion Bandeja / Demo

### Copy Actual

```text
Una bandeja para decidir.
No otra tabla para revisar.
```

### Lectura

Es de las mejores frases de toda la landing.

### Ajuste Recomendado

Mantenerla.

Solo reforzar debajo la idea de cartera operativa.

### Copy Recomendado

```text
Una bandeja para decidir.
No otra tabla para revisar.

La cartera deja de vivirse como una suma de consultas dispersas
y empieza a leerse como una operación visible.
```

### Funcion Narrativa

Este es el momento de demostracion central.

No necesita mucha mas explicacion.

Necesita claridad.

---

## 4.9 Seccion Demo Gratuita

### Copy Actual

```text
Activa LexControl con una muestra real de tu operación.
Estamos activando un grupo reducido de abogados y firmas que operan volumen real de procesos.
Ideal para equipos que manejan 50 a 500 procesos activos.
```

### Lectura

Correcto y bastante consistente.

### Ajuste Recomendado

Agregar una promesa mas exacta de resultado.

### Copy Recomendado

```text
Activa LexControl con una muestra real de tu operación.

Durante 14 días verás tu cartera convertida en una bandeja operativa:
qué cambió, qué no cambió, qué falló y qué requiere revisión.

Ideal para equipos que ya manejan volumen real de procesos.
```

### Funcion Narrativa

Unir:

```text
activacion
```

con:

```text
resultado visible
```

---

## 4.10 FAQ

### Copy Actual

La introducción dice:

```text
Estas respuestas explican por qué existe LexControl,
cómo opera la demo y qué recibe un equipo durante la activación controlada.
```

### Lectura

Correcta, aunque todavía muy explicativa.

### Ajuste Recomendado

Reforzar que el bloque resuelve objeciones sobre control, no curiosidades de producto.

### Copy Recomendado

```text
Antes de hablar de precio, aclaremos algo más importante:
qué control ganas, cómo opera la activación y qué recibe realmente tu equipo.
```

### Funcion Narrativa

Que el usuario sienta:

```text
estoy resolviendo objeciones para decidir
```

no:

```text
estoy leyendo soporte
```

---

## 4.11 Precios

### Copy Actual

```text
Precios claros antes de activar la demo.
```

### Lectura

Buena dirección.

### Ajuste Recomendado

Anclar más claramente el precio a capacidad operativa vigilada.

### Copy Recomendado

```text
Precios claros para operar con capacidad real.
```

y como apoyo:

```text
Cada plan expresa capacidad operativa vigilada:
procesos activos, responsables y profundidad de operación.
```

### Funcion Narrativa

Que el precio no parezca arbitrario.

Debe sentirse como continuidad natural del valor.

---

## 4.12 Complementos

### Lectura

Hoy funcionan, pero todavia están algo descriptivos.

### Ajuste Recomendado

Organizarlos como ampliadores de operacion, no como extras sueltos.

### Encabezado Recomendado

```text
Extiende la operación según volumen, canal y nivel de servicio.
```

---

## 4.13 Cierre

### Copy Actual

```text
No puedes controlar lo que no puedes ver.
Activa una demo gratuita y revisa cómo se ve tu operación cuando cada consulta deja trazabilidad.
LexControl convierte esa incertidumbre en sistema.
```

### Lectura

Muy buen cierre.

### Ajuste Recomendado

Solo volverlo todavía más consistente con la cartera operativa.

### Copy Recomendado

```text
No puedes controlar lo que no puedes ver.

Activa una demo gratuita y mira tu cartera de procesos como debería verse:
con trazabilidad, fallas visibles y prioridad operativa.

LexControl convierte esa incertidumbre en control.
```

---

## 5. CTA Principal Y CTA Secundario

## Decision Recomendada

### CTA Principal

Mantener:

```text
Activar demo gratis
```

Porque ya no se trata de una llamada comercial sino de una entrada real al mecanismo de valor.

### CTA Secundario

Mantener:

```text
Ver cómo funciona
```

Pero entendiendo que no es una accion lateral.

Es una bajada a demostracion del control operativo.

No recomendar por ahora:

- Solicitar información
- Conocer más
- Hablar con ventas
- Ver plataforma

Porque debilitan la narrativa de tension -> demostracion -> activacion.

---

## 6. Narrativa Recomendada En Una Sola Pasada

Si se reescribiera toda la landing desde esta tesis, la secuencia base seria:

```text
1. El problema no es revisar procesos.
2. El problema es no saber que no se reviso, que fallo y que requiere atencion.
3. Eso no es un problema de disciplina sino de trazabilidad operativa.
4. LexControl convierte consultas en visibilidad operativa.
5. La bandeja demuestra ese control.
6. La demo lo lleva a una muestra real de la operacion.
7. El precio expresa capacidad operativa vigilada.
8. El cierre devuelve la idea central: no puedes controlar lo que no puedes ver.
```

---

## 7. Conclusiones

### Lo Que Debe Conservarse

- La apertura actual.
- El tono sobrio y tenso.
- La insistencia en trazabilidad.
- La bandeja como centro de demostracion.
- La demo gratuita controlada.
- El cierre con “No puedes controlar lo que no puedes ver”.

### Lo Que Debe Reescribirse

- Secciones donde la consulta aparece como valor por si sola.
- La explicacion de la solucion para que suene menos a funcionalidad y mas a mecanismo de control.
- La introduccion de precios para conectarla con capacidad operativa vigilada.
- Algunas transiciones para hablar mas de operacion y menos de vista o herramienta.

### Regla Final

La landing no debe vender:

```text
una herramienta para consultar procesos
```

La landing debe vender:

```text
una forma de recuperar control operativo sobre una cartera de procesos
```
