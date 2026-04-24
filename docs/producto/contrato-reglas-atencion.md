# Contrato De Reglas De Atencion

Producto: LexControl  
Superficie: `app.lexcontrol.co`  
Version: v1.0  
Estado: Congelado para implementacion

---

## 1. Decision Rectora

LexControl no debe comportarse como un feed de actividad.

Debe comportarse como un sistema que administra atencion.

Eso significa:

- no todo lo que ocurre se eleva;
- no todo lo que se consulta aparece en bandeja;
- no toda novedad merece interrumpir al usuario;
- parte del valor esta en mantener cubierto lo estable sin volverlo ruido.

Regla madre:

```text
el sistema observa mucho
pero solo eleva poco
y eleva con criterio
```

---

## 2. Proposito Del Contrato

Este documento define:

- que entra a la bandeja principal;
- que queda en monitoreo;
- que puede permanecer en silencio;
- que genera alerta o notificacion;
- que debe resumir Lex;
- como se administra la carga cognitiva del usuario.

Busca evitar:

1. interfaces que muestran demasiada actividad;
2. bandejas que funcionan como timeline en vez de cola de atencion;
3. notificaciones excesivas;
4. un Lex que repita todo sin jerarquia.

---

## 3. Principio De Producto

La tesis operativa de LexControl es:

```text
el abogado no necesita mirar mas
necesita mirar mejor
```

Por eso la capa de atencion debe responder siempre esta pregunta:

```text
esto merece atencion humana ahora
o solo debe quedar trazado y cubierto?
```

---

## 4. Niveles De Atencion

La operacion debe clasificarse en cuatro niveles:

### 4.1 Silencio Operativo

Casos o senales que:

- estan cubiertos;
- no muestran cambio relevante;
- no tienen error de fuente;
- no tienen evento proximo;
- no requieren decision humana inmediata.

Estos elementos:

- no interrumpen;
- no dominan la bandeja;
- pueden quedar visibles solo en contexto o detalle.

### 4.2 Atencion Visible

Casos o senales que:

- requieren ser visibles en bandeja;
- merecen ser leidos por el responsable;
- no necesariamente requieren alerta externa.

Ejemplos:

- nueva actuacion relevante;
- proceso en `requiere_revision`;
- error de fuente aislado pero operativo;
- evento proximo dentro del umbral definido.

### 4.3 Atencion Elevada

Casos o senales que:

- deben destacarse por encima del resto;
- pueden cambiar prioridad o severidad;
- deben entrar a resumen ejecutivo o lectura de Lex.

Ejemplos:

- audiencia proxima;
- medida cautelar;
- fallo o sentencia;
- error de fuente repetido;
- proceso sin responsable con actuacion nueva.

### 4.4 Interrupcion

Casos o senales que justifican alerta o notificacion.

No toda atencion elevada debe interrumpir.

La interrupcion es la ultima capa, no la primera.

---

## 5. Que Entra A Bandeja

La bandeja principal debe ser una cola de atencion.

No una lista exhaustiva de actividad.

Debe priorizar:

- procesos con novedad relevante;
- procesos en `requiere_revision`;
- errores de fuente que afectan cobertura;
- eventos proximos;
- procesos de alta o critica prioridad que cambiaron;
- senales que demandan accion o lectura humana.

Puede incluir procesos estables, pero no deben dominar la lectura.

Regla:

```text
la bandeja muestra primero lo que exige criterio
no lo que solo existe en la historia operativa
```

---

## 6. Que Se Va A Monitoreo

`Monitoreo` recibe la capa de supervision operativa.

Debe concentrar:

- corridas recientes;
- estado por fuente;
- errores de consulta;
- no consultados;
- actividad de snapshots;
- trazabilidad de ejecucion.

Monitoreo no es la cola de decision diaria.

Es la capa donde se inspecciona:

- salud del sistema;
- cobertura de vigilancia;
- calidad de la ejecucion.

---

## 7. Que Puede Permanecer En Silencio

Pueden permanecer en silencio:

- procesos sin cambios sostenidos;
- snapshots exitosos sin novedad;
- eventos ya cubiertos y sin urgencia;
- actividad que no cambia prioridad ni decision;
- lecturas que solo confirman estabilidad.

Silencio no significa invisibilidad absoluta.

Significa:

- no interrumpir;
- no ocupar foco principal;
- seguir disponible en detalle, contexto o historial.

---

## 8. Reglas Para Elevar Atencion

La capa de atencion debe poder elevar un caso cuando ocurra al menos una de estas condiciones:

- nueva actuacion relevante;
- evento proximo dentro del umbral definido;
- error de fuente repetido;
- proceso sin responsable y con cambio;
- prioridad alta o critica con novedad;
- cambio que altera plan de accion del equipo.

La elevacion puede afectar:

- posicion en bandeja;
- severidad visual;
- inclusion en resumen;
- inclusion en notificacion;
- inclusion en respuesta de Lex.

---

## 9. Reglas Para Mantener En Silencio

La capa de atencion debe poder mantener un caso en silencio cuando:

- no hay novedad relevante;
- el caso permanece estable;
- la consulta fue exitosa y sin cambio;
- la prioridad es baja y no hay evento proximo;
- la fuente no fallo;
- no existe necesidad real de accion humana.

Principio:

```text
el sistema no gana valor por molestar
gana valor por filtrar
```

---

## 10. Relacion Con Notificaciones

Notificacion no es sinonimo de novedad.

Una notificacion solo debe existir cuando una senal supera el umbral de interrupcion definido.

Minimo conceptual:

- novedad relevante puede entrar a bandeja sin notificar;
- error de fuente puede entrar a monitoreo sin notificar;
- evento critico puede entrar a bandeja y notificar;
- severidad y canal deben depender de reglas de atencion + notificaciones.

---

## 11. Relacion Con Lex

Lex no debe leer toda la actividad como si todo mereciera el mismo peso.

Lex debe obedecer la capa de atencion.

Eso significa:

- en resumen corto, prioriza solo lo importante;
- menciona estabilidad solo cuando aporta contexto;
- no convierte el historial completo en respuesta por defecto;
- puede profundizar si el usuario lo pide.

Regla:

```text
Lex resume primero atencion requerida
y solo despues contexto o profundidad
```

Lex debe poder responder:

- que requiere atencion ahora;
- que puede esperar;
- que fallo;
- que responsable concentra carga;
- que eventos proximos importan.

Contrato relacionado:

```text
docs/producto/lex_voice_contract.md
```

---

## 12. Jerarquia De Superficies

La misma senal puede vivir en distintas superficies con distinto nivel de intensidad.

Ejemplo:

- en `Bandeja`: visible y priorizada;
- en `Monitoreo`: trazada con mas detalle tecnico;
- en `Notificaciones`: solo si supera umbral;
- en `Lex`: resumida segun relevancia;
- en historial: siempre disponible como evidencia.

Esto evita duplicacion inutil y tambien evita silencio ciego.

---

## 13. Parametrizacion Esperada

La subseccion `Configuracion > Reglas operativas > Atencion` debe prever, al menos en arquitectura:

- umbral de visibilidad en bandeja;
- umbral de interrupcion;
- criterios de silencio operativo;
- inclusion en resumen ejecutivo;
- inclusion en lectura de Lex;
- comportamiento por prioridad y por tipo de actuacion.

No es necesario abrir todos estos controles en dia uno.

Pero el sistema debe diseñarse como si existieran.

---

## 14. Estado Actual Del Sistema

Hoy LexControl ya tiene piezas que alimentan esta capa:

- estados operativos;
- prioridades;
- snapshots;
- movimientos;
- eventos juridicos;
- alerts;
- Lex como voz del sistema.

Lo que todavia no esta completamente cerrado es la politica exacta de:

- que se eleva;
- que se silencia;
- que interrumpe;
- que resumen recibe el usuario por defecto.

Este contrato fija esa direccion.

---

## 15. Criterio De Listo

La capa de atencion se considera bien encaminada cuando:

1. la bandeja funciona como cola de atencion y no como feed;
2. monitoreo absorbe la supervision tecnica;
3. existe silencio operativo intencional;
4. las notificaciones no duplican toda la actividad;
5. Lex resume primero lo relevante;
6. el usuario puede distinguir rapido que requiere accion y que no;
7. el sistema reduce carga cognitiva en vez de aumentarla.

---

## 16. Regla Final

```text
LexControl no debe hacer visible todo.
Debe hacer visible lo suficiente para que el abogado tome mejores decisiones
sin cargar con mas ruido del necesario.
```
