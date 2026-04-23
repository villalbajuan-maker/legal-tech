# Contrato Del Flujo De Activacion De Demo

Producto: LexControl  
Instrumento: Activar demo gratis  
Version: v1.0  
Estado: Congelado para implementacion

---

## 1. Proposito

El flujo de activacion no es un formulario de contacto.

Es un instrumento de conversion y calificacion.

Debe lograr tres cosas:

- Hacer visible el problema operativo sin convertirlo en un quiz largo.
- Capturar informacion suficiente para decidir si vale la pena activar una demo.
- Enviar a agendamiento solo a prospectos que califican para una activacion real.

---

## 2. Principio Rector

Una pantalla debe pedir una sola decision.

No combinar:

- Responsables + urgencia.
- Muestra lista + ventana de decision.
- Datos de contacto + datos operativos ya preguntados.

Cada paso debe tener:

- Una pregunta principal.
- Un motivo implicito de negocio.
- Una salida clara.

---

## 3. Lo Que Debemos Obtener

### Informacion operativa

- Tipo de operacion.
- Volumen aproximado de procesos.
- Forma actual de revision.
- Riesgo operativo principal.
- Existencia de responsables por proceso.
- Nivel de urgencia.
- Disponibilidad de muestra inicial.
- Ventana de activacion.

### Informacion comercial

- Nombre.
- Correo.
- WhatsApp.
- Firma o empresa.
- Ciudad.

No pedir de nuevo el numero aproximado de procesos en datos de contacto.
Ese dato ya pertenece a la calificacion operativa.

---

## 4. Flujo Propuesto

Total recomendado: 10 pasos breves.

### Paso 1: Contexto De La Demo

Pregunta: ninguna.

Objetivo:

Explicar que la demo es controlada, que no exige datos sensibles para solicitar acceso y que se revisa si la operacion encaja.

CTA:

```text
Continuar
```

### Paso 2: Tipo De Operacion

Pregunta:

```text
Que tipo de operacion quieres activar?
```

Opciones:

- Abogado independiente.
- Firma pequena.
- Firma mediana o grande.
- Aseguradora o sector seguros.
- Area juridica de empresa.

Valor:

Permite entender contexto comercial y complejidad de cuenta.

### Paso 3: Volumen De Procesos

Pregunta:

```text
Cuantos procesos vigilas hoy?
```

Opciones:

- Menos de 50.
- 50 a 100.
- 101 a 300.
- Mas de 300.

Valor:

Valida si existe volumen suficiente para que el dolor operativo sea real.

### Paso 4: Forma Actual De Revision

Pregunta:

```text
Como revisan hoy las novedades?
```

Opciones:

- Manual en Rama Judicial.
- Excel + revision manual.
- Dependiente / asistente.
- Herramienta externa.
- No hay proceso claro.

Valor:

Evidencia el punto de partida y refuerza el problema de trazabilidad.

### Paso 5: Riesgo Principal

Pregunta:

```text
Donde esta hoy el mayor riesgo?
```

Opciones:

- No detectar actuaciones.
- No saber que no se consulto.
- Errores de fuente.
- Falta de trazabilidad.
- Demasiado tiempo operativo.

Valor:

Define que debe demostrar la demo para ser convincente.

### Paso 6: Responsables Por Proceso

Pregunta:

```text
Tienen responsables asignados por proceso?
```

Opciones:

- Si.
- Parcialmente.
- No.

Valor:

Permite estimar complejidad de permisos, alertas y acompanamiento.

### Paso 7: Urgencia De Activacion

Pregunta:

```text
Que tan prioritaria es esta activacion?
```

Opciones:

- Baja.
- Media.
- Alta.
- Critica.

Valor:

Ayuda a diferenciar curiosidad de intencion operativa real.

### Paso 8: Muestra Inicial

Pregunta:

```text
Que tan lista esta la muestra inicial de procesos?
```

Opciones:

- Ya tengo una muestra lista.
- La puedo preparar esta semana.
- Necesito ayuda para estructurarla.

Valor:

Determina si la activacion puede ocurrir rapido o requiere asistencia previa.

### Paso 9: Ventana De Activacion

Pregunta:

```text
Cuando quisieras activar la demo?
```

Opciones:

- Esta semana.
- Este mes.
- Exploratorio.

Valor:

Permite ordenar prioridad comercial y agenda.

### Paso 10: Datos De Contacto

Campos:

- Nombre.
- Correo.
- WhatsApp.
- Firma o empresa.
- Ciudad.

No incluir:

- Numero aproximado de procesos.

CTA:

```text
Solicitar activacion
```

---

## 5. Regla De Calificacion

La demo no debe abrir agenda automaticamente a todos.

Debe existir una clasificacion interna:

### Califica Para Agendar

Cumple una o mas condiciones:

- Tiene 50 o mas procesos.
- Es firma, aseguradora, area juridica o equipo con volumen.
- Tiene urgencia alta o critica.
- Tiene muestra lista o puede prepararla esta semana.
- Declara riesgo de trazabilidad, actuaciones no detectadas o fuente no consultada.

Salida recomendada:

```text
Tu operacion encaja con la demo controlada.
Agenda una sesion de activacion para revisar alcance y preparar la carga inicial.
```

Accion:

Mostrar calendario de activaciones LexControl.

### Queda En Revision

Aplica cuando:

- Maneja menos de 50 procesos y urgencia baja.
- Es exploratorio.
- No tiene muestra clara.
- No hay dolor operativo evidente.

Salida recomendada:

```text
Solicitud recibida.
Revisaremos tu caso y te contactaremos si la demo controlada encaja con tu operacion.
```

Accion:

No mostrar calendario inmediato.

---

## 6. Agendamiento

El agendamiento debe ocurrir despues de la calificacion y los datos de contacto.

Destino recomendado:

```text
Calendario Google: LexControl Activaciones
```

Implementacion aceptada para MVP:

- Enlace a calendario externo.
- Calendly conectado al calendario de Google.
- Google Calendar appointment schedule.

Regla:

Solo mostrar el enlace de agenda cuando el prospecto califica.

---

## 7. Datos Para Enviar Al Equipo

Al enviar la solicitud, el sistema debe conservar este resumen:

- Tipo de operacion.
- Volumen de procesos.
- Metodo actual de revision.
- Riesgo principal.
- Responsables asignados.
- Urgencia.
- Estado de muestra inicial.
- Ventana de activacion.
- Nombre.
- Correo.
- WhatsApp.
- Firma o empresa.
- Ciudad.
- Resultado de calificacion: califica / revision.

---

## 8. Microcopy

### Si califica

```text
Tu operacion encaja con la demo controlada.
El siguiente paso es agendar una sesion de activacion.
```

### Si queda en revision

```text
Solicitud recibida.
Revisaremos si tu operacion encaja con la demo controlada y te contactaremos.
```

### Evitar

- Gracias por registrarte.
- Un asesor se comunicara contigo.
- Agenda una llamada de ventas.
- Demo disponible para todos.

---

## 9. Criterios De Aceptacion

El flujo esta bien implementado si:

- Cada pantalla pide una sola decision.
- No se repite el volumen de procesos en el formulario final.
- La calificacion ocurre antes de mostrar calendario.
- El usuario entiende que la demo es controlada.
- El flujo captura informacion util para priorizar prospectos.
- El problema operativo queda reforzado sin sonar a interrogatorio.
- El resultado tiene dos salidas: agendar o revision.

