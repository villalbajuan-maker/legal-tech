# Contrato De Reglas De Notificaciones

Producto: LexControl  
Superficie: `app.lexcontrol.co`  
Version: v1.0  
Estado: Congelado para implementacion

---

## 1. Decision Rectora

LexControl no debe notificar todo lo que ocurre.

Debe notificar solo lo que supera el umbral de interrupcion definido por la operacion.

Regla madre:

```text
notificacion no es actividad
notificacion es interrupcion con criterio
```

---

## 2. Proposito Del Contrato

Este documento define:

- cuando una senal solo se muestra en UI;
- cuando una senal entra a resumen;
- cuando una senal justifica notificacion;
- por que canal debe notificarse;
- como se evita fatiga de alertas;
- como se registra la entrega.

Busca evitar:

1. saturar al usuario con demasiadas alertas;
2. duplicar la bandeja en correo o WhatsApp;
3. notificar sin considerar prioridad ni atencion;
4. perder trazabilidad sobre lo enviado o fallido.

---

## 3. Principio Operativo

La informacion solo debe salir de la app cuando tiene sentido operativo hacerlo.

Eso implica:

- no toda novedad notifica;
- no toda falla interrumpe;
- no toda prioridad alta sale por canal externo;
- los canales se usan segun severidad, contexto y configuracion.

Principio:

```text
primero se muestra
luego se resume
y solo despues, si aplica, se interrumpe
```

---

## 4. Capas De Comunicacion

LexControl debe operar con tres capas:

### 4.1 Visibilidad En App

La senal existe y puede verse en:

- bandeja;
- monitoreo;
- detalle;
- Lex.

No implica notificacion externa.

### 4.2 Resumen

La senal entra en un agrupado operativo.

Ejemplos:

- resumen diario;
- resumen por responsable;
- resumen ejecutivo de cuenta.

Sirve para reducir ruido cuando hay varias senales de mediana relevancia.

### 4.3 Interrupcion

La senal amerita salida por canal.

Ejemplos:

- email;
- whatsapp;
- canal interno.

No toda senal debe llegar a esta capa.

---

## 5. Umbral De Notificacion

Una senal solo debe notificar cuando supera el umbral definido por:

- prioridad;
- nivel de atencion;
- tipo de evento;
- cercania temporal;
- persistencia del problema;
- destinatario correcto.

Regla:

```text
si una senal no cambia accion o criterio del responsable,
no debe interrumpir por canal
```

---

## 6. Que Puede Notificarse

Casos tipicos que si pueden justificar notificacion:

- audiencia proxima;
- vencimiento o termino cercano;
- medida cautelar;
- fallo o sentencia;
- proceso critico con nueva actuacion;
- error de fuente persistente en caso sensible;
- proceso sin responsable y con novedad importante.

Casos tipicos que no deberian notificar por defecto:

- proceso estable sin cambios;
- snapshot exitoso sin novedad;
- error de fuente aislado de baja prioridad;
- actividad historica sin consecuencia operativa.

---

## 7. Resumen Diario

El resumen diario es mecanismo central para evitar fatiga.

Debe agrupar:

- novedades relevantes;
- errores de fuente visibles;
- procesos que requieren revision;
- eventos proximos;
- distribucion por responsable cuando aplique.

No debe comportarse como log exhaustivo.

Debe responder:

```text
que merece mi lectura hoy
sin obligarme a revisar todo el ruido acumulado
```

---

## 8. Canales

Canales previstos:

- `internal`
- `email`
- `whatsapp`

### 8.1 Internal

Es el canal base.

Toda senal puede existir internamente sin salir por canal externo.

### 8.2 Email

Canal inicial recomendado para MVP.

Sirve para:

- resumen diario;
- eventos importantes;
- alertas operativas de severidad suficiente.

### 8.3 WhatsApp

Canal previsto como configurable o add-on.

No debe asumirse como dependencia base del MVP.

Debe reservarse para:

- alertas mas urgentes;
- responsables que lo tengan habilitado;
- cuentas que lo requieran por configuracion.

---

## 9. Destinatarios

La notificacion debe llegar a la persona correcta.

Posibles destinatarios:

- responsable del proceso;
- administrador de cuenta;
- lista operativa de la firma;
- canal interno del espacio de trabajo.

Regla:

```text
la severidad no basta
la notificacion solo sirve si llega a quien puede actuar
```

---

## 10. Agrupacion Y Fatiga

El sistema debe evitar alert fatigue.

Por eso debe poder:

- agrupar multiples senales en resumen;
- evitar duplicar la misma alerta;
- evitar enviar varias alertas por el mismo hecho;
- escalar solo cuando la situacion persiste o cambia de severidad.

Principio:

```text
mas notificaciones no significa mas control
puede significar menos atencion util
```

---

## 11. Relacion Con Atencion

Las notificaciones no se definen solas.

Dependen de la capa de atencion.

Una misma senal puede:

- quedar en silencio;
- ser visible en bandeja;
- entrar a resumen;
- notificar;

segun el nivel de atencion que se le asigne.

Contrato relacionado:

```text
docs/producto/contrato-reglas-atencion.md
```

---

## 12. Relacion Con Prioridad

La prioridad modifica el umbral de notificacion.

Ejemplos:

- una novedad `critica` puede interrumpir;
- una novedad `alta` puede entrar a resumen o notificar segun contexto;
- una novedad `normal` puede quedarse en bandeja;
- una `baja` rara vez debe salir por canal.

Contrato relacionado:

```text
docs/producto/contrato-reglas-prioridad.md
```

---

## 13. Relacion Con Lex

Lex no es un canal de notificacion.

Pero si debe reflejar la jerarquia de notificaciones.

Eso significa:

- cuando resume, debe distinguir lo que solo esta visible de lo que amerita interrupcion;
- puede explicar por que algo notifico o no notifico;
- no debe sonar como si toda novedad fuera urgente.

---

## 14. Relacion Con Escalamiento

La notificacion no es el unico resultado posible de una senal.

Una situacion puede:

- seguir visible sin salir por canal;
- entrar a resumen;
- notificar;
- o escalar a un nivel superior de respuesta.

Contrato relacionado:

```text
docs/producto/contrato-reglas-escalamiento.md
```

---

## 15. Registro Y Trazabilidad

Toda notificacion debe dejar registro.

La arquitectura actual ya preve:

- `alerts`
- `notification_deliveries`

Minimo requerido:

- canal;
- destinatario;
- estado;
- error si falla;
- fecha de envio;
- fecha de entrega si aplica.

Regla:

```text
una notificacion que no deja rastro no existe operativamente
```

---

## 16. Parametrizacion Esperada

La subseccion `Configuracion > Notificaciones` debe prever, al menos en arquitectura:

- canales habilitados;
- umbral minimo por canal;
- destinatarios por rol o responsable;
- frecuencia de resumen;
- comportamiento de escalamiento;
- politicas por severidad.

No hace falta abrir toda esta profundidad en dia uno.

Pero debe existir la estructura para crecer sin rehacer el sistema.

---

## 17. Estado Actual Del Sistema

Hoy LexControl ya tiene:

- tabla `alerts`;
- tabla `notification_deliveries`;
- arquitectura de canales prevista;
- contratos de atencion y prioridad que alimentan notificaciones.

Lo que falta cerrar a nivel de implementacion es:

- politica exacta de disparo por canal;
- resumen diario;
- preferencias por responsable o cuenta;
- envio real por canal productivo.

Este contrato fija esa direccion.

---

## 18. Criterio De Listo

La capa de notificaciones se considera bien encaminada cuando:

1. no toda senal genera canal externo;
2. existe resumen diario o equivalente;
3. las alertas se agrupan para evitar saturacion;
4. se registra toda entrega o fallo;
5. los canales se activan con criterio y no por reflejo;
6. prioridad y atencion afectan el comportamiento de salida.

---

## 19. Regla Final

```text
LexControl no debe notificar mas.
Debe notificar mejor.
```
