# Contrato Visual Y Funcional De UI Reglas Operativas

Producto: LexControl  
Superficie: `app.lexcontrol.co`  
Modulo: `Configuracion > Reglas operativas`  
Version: v1.0  
Estado: Congelado para implementacion

---

## 1. Decision Rectora

La UI de `Reglas operativas` no debe parecer un panel tecnico ni una pared de configuraciones.

Debe sentirse como el lugar donde el bufete define como quiere que LexControl observe, priorice y distribuya la operacion.

Regla madre:

```text
reglas operativas no es un laboratorio de settings
es el panel donde el bufete ajusta su sistema operativo
```

---

## 2. Proposito Del Contrato

Este documento define:

- como se ve `Configuracion > Reglas operativas`;
- como se organiza visualmente;
- que familias se muestran;
- que profundidad se abre en MVP;
- que elementos deben ser visibles, resumidos o avanzados;
- como se protege la UX contra carga cognitiva innecesaria.

Busca evitar:

1. una pantalla llena de toggles sin criterio;
2. settings atomizados imposibles de entender;
3. configuraciones avanzadas abiertas demasiado pronto;
4. una UI que contradiga la tesis de administracion de atencion.

---

## 3. Funcion De La Vista

La funcion dominante de esta vista es:

```text
permitir que el bufete ajuste como opera LexControl
sin convertir eso en una experiencia tecnica o intimidante
```

La vista no existe para mostrar toda la complejidad del motor.

Existe para permitir decisiones operativas comprensibles.

---

## 4. Principio UX

La interfaz debe seguir este principio:

```text
primero explicar el efecto
despues mostrar la regla
y solo al final abrir el detalle avanzado
```

El usuario no debe leer:

- cron;
- pipelines;
- jobs;
- metadatos internos;
- nombres tecnicos de tablas.

Debe leer:

- que se consulta mas seguido;
- que se considera prioritario;
- que se eleva;
- a quien se le asigna;
- cuando se notifica;
- cuando una situacion escala.

---

## 5. Estructura Visual

La vista debe usar una estructura de tres capas:

### 5.1 Header De La Vista

Debe contener:

- titulo: `Reglas operativas`
- subtitulo corto:
  - `Ajusta como LexControl consulta, prioriza, asigna y eleva la operacion de tu bufete.`
- accion primaria:
  - `Guardar cambios`
- accion secundaria:
  - `Restablecer valores recomendados` o equivalente

No debe contener:

- copy largo;
- explicaciones de producto estilo landing;
- bloques comerciales.

### 5.2 Resumen Superior

Antes de las familias, la vista debe mostrar una lectura resumida del comportamiento actual.

Debe verse como una fila o bloque de sintesis con 4 a 6 items.

Ejemplos:

- `Consulta reforzada en casos criticos`
- `Prioridad final combina criterio manual y calculado`
- `Procesos sin responsable se elevan`
- `Errores persistentes pueden escalar`
- `Las alertas altas entran a resumen diario`

Esto sirve para que el usuario entienda el sistema antes de editarlo.

### 5.3 Cuerpo Por Familias

Las familias deben presentarse como secciones o cards expansibles, no como una lista plana de campos.

Familias visibles:

1. `Consulta`
2. `Prioridad`
3. `Atencion`
4. `Asignacion`
5. `Notificaciones`
6. `Escalamiento`

Orden recomendado en UI:

```text
Consulta
Prioridad
Atencion
Asignacion
Notificaciones
Escalamiento
```

Ese orden debe seguir el orden operativo del sistema.

---

## 6. Comportamiento De Las Familias

Cada familia debe tener la misma estructura base:

### 6.1 Encabezado

- nombre de la familia
- frase de efecto en lenguaje humano
- estado resumido actual

Ejemplo:

```text
Prioridad
Define que casos pesan mas dentro de la cartera.
Hoy: la prioridad final combina criterio manual y reglas del sistema.
```

### 6.2 Contenido Visible En MVP

Solo 2 a 4 controles de alto impacto por familia.

Nada de abrir 12 controles por seccion desde dia uno.

### 6.3 Detalle Avanzado

Cada familia puede tener un link o disclosure tipo:

- `Ver detalle avanzado`
- `Mostrar criterios`

Esto debe abrir informacion secundaria, no dominar la vista por defecto.

---

## 7. Contenido Por Familia

### 7.1 Consulta

Debe mostrar, al menos:

- politica base por prioridad
- consulta puntual habilitada
- tratamiento simple de errores de fuente
- recencia visible en UI

Controles MVP esperados:

- selector simple de frecuencia por prioridad
- toggle o switch para `permitir consulta puntual`
- regla visible sobre `proteger la fuente`

No mostrar por defecto:

- batch size
- scheduler interno
- detalles tecnicos de jobs

### 7.2 Prioridad

Debe mostrar, al menos:

- prioridad manual + calculada
- factores que elevan
- factores que reducen
- efecto sobre bandeja y consulta

Controles MVP esperados:

- selector de regla final:
  - `la mayor entre manual y calculada`
- checklist resumido de factores principales
- explicacion visible de impacto

### 7.3 Atencion

Debe mostrar, al menos:

- que queda en silencio
- que entra a bandeja
- que se eleva
- que va a monitoreo

Controles MVP esperados:

- umbral simple de elevacion
- criterios visibles de `requiere atencion`
- comportamiento para procesos estables

### 7.4 Asignacion

Debe mostrar, al menos:

- responsable por default
- que pasa con procesos sin responsable
- reglas simples de cobertura

Controles MVP esperados:

- selector de responsable por default
- politica para `proceso sin responsable`
- visibilidad del impacto en cobertura

### 7.5 Notificaciones

Debe mostrar, al menos:

- canales activos
- resumen diario
- severidad minima para interrumpir

Controles MVP esperados:

- selector de canal base
- frecuencia de resumen
- umbral minimo por canal

### 7.6 Escalamiento

Debe mostrar, al menos:

- persistencia
- cercania temporal
- cambio de nivel

Controles MVP esperados:

- umbral simple de persistencia
- regla para eventos proximos
- comportamiento de alertas no atendidas

---

## 8. Jerarquia Visual

La vista debe dejar clara esta jerarquia:

```text
1. Que hace esta familia
2. Como esta configurada hoy
3. Que puedes cambiar
4. Que efecto tiene cambiarla
```

No debe invertir el orden.

Error a evitar:

```text
mostrar el control antes de explicar el criterio
```

---

## 9. Estilo De Componentes

La UI debe usar:

- cards o paneles sobrios
- resumen superior limpio
- labels cortos
- ayuda contextual breve
- badges o chips para estado actual

Debe evitar:

- tablas complejas dentro de configuracion
- accordions infinitos
- microcopy excesivo
- formularios largos en una sola columna sin agrupacion

---

## 10. Layout Recomendado

### 10.1 Desktop

Layout recomendado:

- header superior
- resumen general arriba
- lista de familias en cards apiladas
- cada card con:
  - resumen
  - controles base
  - detalle avanzado colapsable

No usar:

- doble columna densa con demasiados campos
- sidebar secundario para cada familia en MVP

### 10.2 Mobile

Mobile debe usar:

- resumen superior compacto
- familias en cards verticales
- detalle avanzado en drawer o expansion local

No debe obligar a scroll horizontal ni a leer configuraciones densas.

---

## 11. Relacion Con El Resto De La App

`Reglas operativas` no vive aislado.

Debe conectar mentalmente con:

- `Inicio`
  - muestra resultados de las reglas
- `Bandeja`
  - muestra la operacion ya interpretada
- `Monitoreo`
  - muestra salud y cobertura

La vista debe incluir micro-ayuda de efecto, por ejemplo:

- `Esto cambia que procesos se consultan antes.`
- `Esto cambia que casos aparecen primero en Bandeja.`
- `Esto cambia cuando una alerta sale por email.`

---

## 12. Lo Que No Debe Entrar

No deben entrar aqui como protagonistas:

- logs de sistema;
- snapshots;
- actividad historica;
- detalle completo de procesos;
- gestion de usuarios completa;
- copy comercial;
- configuraciones técnicas de infraestructura.

Esta vista es para comportamiento operativo, no para administracion total ni diagnostico tecnico.

---

## 13. Estado De Madurez Visible

La UI debe permitir una lectura tipo:

```text
Reglas recomendadas
Reglas ajustadas por el bufete
Reglas que requieren revision
```

Eso permite que el sistema se sienta vivo y configurable sin sonar frágil.

---

## 14. Criterio De Listo

La UI de `Reglas operativas` se considera bien encaminada cuando:

1. el usuario entiende cada familia sin leer documentacion externa;
2. las familias se ven conectadas entre si;
3. la vista no se siente tecnica ni intimidante;
4. los cambios visibles tienen efecto operativo claro;
5. la interfaz respeta la tesis de administracion de atencion.

---

## 15. Regla Final

```text
La UI de reglas operativas no debe hacer sentir al usuario
que esta configurando software.
Debe hacerle sentir que esta afinando como opera su bufete.
```

Contrato relacionado:

`docs/producto/contrato-modelo-datos-reglas-operativas.md`
