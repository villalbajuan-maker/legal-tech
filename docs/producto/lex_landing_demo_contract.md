# Lex Landing Demo Contract

Producto: LexControl  
Superficie: Landing page / bandeja demo  
Entidad: Lex  
Version: v1.0 MVP

---

## 1. Objetivo

La demo de Lex en la landing existe para demostrar el valor central del producto antes de pedir acceso a beta:

```text
El usuario puede preguntar por su operacion judicial
y Lex convierte la bandeja en respuestas operativas.
```

Lex no debe competir con el diagnostico como CTA principal.

Lex debe reforzar la decision mostrando, dentro de la landing, como se sentiria operar LexControl con casos reales.

---

## 2. Relacion Con La Bandeja

Lex solo responde sobre los datos visibles o simulados de la bandeja demo.

Lex puede:

- Leer estados de la bandeja.
- Contar procesos por estado.
- Identificar procesos con novedad.
- Identificar procesos no consultados.
- Identificar errores de fuente.
- Identificar responsables.
- Identificar prioridad.
- Activar filtros de la bandeja.
- Resumir el estado operativo.

Lex no puede:

- Consultar fuentes reales desde la landing.
- Inventar procesos.
- Prometer resultados juridicos.
- Dar asesoria legal.
- Responder preguntas fuera del contexto operativo demo.

---

## 3. Preguntas Permitidas En Landing

La demo debe soportar estas familias de preguntas:

### 3.1 Movimientos

Ejemplos:

- Que procesos se movieron hoy?
- Que procesos tuvieron cambios?
- Que novedades hay?

Respuesta esperada:

```text
N procesos tuvieron cambios en las ultimas 24 horas.
Proceso mas reciente: [radicado].
Actuacion: [ultima actuacion].
```

Efecto en UI:

- Activar filtro `Con novedad`.
- Activar rango `24 horas`.

---

### 3.2 Fallas Y No Consultados

Ejemplos:

- Cuales no se pudieron consultar?
- Que fallas hay?
- Que procesos tienen error de fuente?

Respuesta esperada:

```text
N procesos no pudieron consultarse.
No deben tratarse como casos sin novedad.
```

Efecto en UI:

- Activar filtro `No consultados` o estado equivalente.
- Mantener rango `Todos`.

---

### 3.3 Responsables

Ejemplos:

- Quien concentra mas pendientes?
- Que responsable tiene mas casos?

Respuesta esperada:

```text
[Responsable] concentra N procesos en esta bandeja.
Priorizar casos con error o prioridad alta.
```

Efecto en UI:

- Mantener vista general.
- Mostrar respuesta en Lex.

---

### 3.4 Procesos Sin Cambios

Ejemplos:

- Que casos llevan mas tiempo sin cambios?
- Cuales estan quietos?

Respuesta esperada:

```text
El caso con mas tiempo sin cambios es [radicado].
Ultima referencia registrada: [fecha relativa].
```

Efecto en UI:

- Activar filtro `Sin cambios`.
- Mantener rango `Todos`.

---

### 3.5 Prioridad

Ejemplos:

- Que requiere prioridad?
- Que casos son criticos?
- Que debo revisar primero?

Respuesta esperada:

```text
N procesos estan en prioridad alta o critica.
Requieren revision antes de los casos de baja prioridad.
```

Efecto en UI:

- Mantener vista general.
- Mostrar senal de prioridad.

---

### 3.6 Resumen Operativo

Ejemplos:

- Resumen operativo.
- Como esta la operacion?
- Estado de la bandeja.

Respuesta esperada:

```text
N procesos fueron leidos en la bandeja demo.
N tuvieron cambios.
N no pudieron consultarse.
N permanecen sin cambios.
```

Efecto en UI:

- Mantener vista general.

---

## 4. Comportamiento Conversacional

Lex en landing debe:

- Abrirse desde un icono flotante.
- Usar el simbolo operativo de LexControl como representacion visual de Lex.
- Mostrar historial de preguntas y respuestas.
- Identificar respuestas de Lex con simbolo + nombre.
- Mantener al usuario identificado como Usuario.
- Mantener scroll interno.
- Desplazarse automaticamente al ultimo mensaje.
- Mostrar sugerencias tipo pill.
- Diferenciar visualmente las sugerencias de los mensajes conversacionales.
- Permitir entrada manual limitada.
- Mostrar un indicador simulado de escritura antes de entregar la respuesta.
- Responder con formato operativo.

Lex en landing no debe:

- Abrirse como panel fijo integrado en la bandeja.
- Tomar toda la pantalla en desktop.
- Usar tono de soporte.
- Saludar.
- Pedir datos sensibles.
- Decir que esta consultando fuentes reales.

---

## 5. Respuesta Fuera De Alcance

Si la pregunta no corresponde al contrato de demo:

```text
Consulta no disponible en la demo.
Consultas activas: movimientos, fallas, responsables, prioridad, procesos sin cambios y resumen operativo.
```

No usar:

```text
No entiendo.
Intenta de nuevo.
Puedo ayudarte con otra cosa.
```

---

## 6. Rol Comercial

Lex debe producir esta sensacion en el prospecto:

```text
Esto es lo que necesito ver todos los dias.
```

La demo no busca explicar tecnologia.

La demo busca evidenciar:

- Zonas ciegas.
- Fallas visibles.
- Responsables.
- Prioridad.
- Trazabilidad.
- Control.

---

## 7. Criterio De Aceptacion

La demo de Lex esta correcta si:

- El usuario entiende que Lex lee la bandeja.
- Las respuestas suenan como registro operativo.
- Las preguntas sugeridas guian el uso.
- El historial permite revisar lo preguntado.
- El modal flota sin romper la bandeja.
- Cada respuesta refuerza la tesis de LexControl.
