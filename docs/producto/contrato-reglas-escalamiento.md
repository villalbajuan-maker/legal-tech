# Contrato De Reglas De Escalamiento

Producto: LexControl  
Superficie: `app.lexcontrol.co`  
Version: v1.0  
Estado: Congelado para implementacion

---

## 1. Decision Rectora

LexControl no debe escalar por reflejo.

Debe escalar cuando una senal deja de ser solo visible y empieza a poner en riesgo la cobertura, la oportunidad o la capacidad de decision.

Regla madre:

```text
escalar no es repetir la alerta
es cambiar el nivel de respuesta que la operacion exige
```

---

## 2. Proposito Del Contrato

Este documento define:

- cuando una situacion sube de nivel;
- que tipos de escalamiento existen;
- que condiciones disparan escalamiento;
- a quien debe escalarse;
- como se evita escalar demasiado pronto o demasiado tarde;
- como se registra el cambio de nivel.

Busca evitar:

1. alertas que se repiten sin cambiar nada;
2. errores persistentes que nunca cambian de tratamiento;
3. situaciones relevantes que se quedan atrapadas en silencio operativo;
4. cuentas donde el criterio de escalamiento dependa solo de memoria humana.

---

## 3. Principio Operativo

El escalamiento existe para responder esta pregunta:

```text
esta situacion sigue en el nivel correcto
o ya necesita una respuesta mas visible, mas urgente o mas alta?
```

Escalar significa aumentar el nivel de respuesta.

Puede cambiar:

- visibilidad;
- prioridad;
- destinatario;
- canal;
- severidad;
- inclusion en resumen o interrupcion.

---

## 4. Tipos De Escalamiento

LexControl debe admitir, al menos en arquitectura, estos tipos:

### 4.1 Escalamiento De Atencion

La senal pasa de:

- silencio operativo
a
- atencion visible
o
- atencion elevada

Ejemplo:

- error de fuente aislado que empieza a repetirse.

### 4.2 Escalamiento De Prioridad

La senal o proceso sube de:

- baja
- normal
- alta
- critica

Ejemplo:

- audiencia cada vez mas cercana;
- novedad relevante sobre un caso sensible.

### 4.3 Escalamiento De Destinatario

La senal deja de quedarse solo en el responsable inicial y sube a:

- administrador de cuenta;
- lista operativa;
- responsable secundario;
- supervision interna del bufete.

Ejemplo:

- caso sin atencion confirmada dentro del umbral esperado.

### 4.4 Escalamiento De Canal

La senal pasa de:

- visible en app
a
- resumen
o
- email
o
- whatsapp

No debe cambiar de canal sin criterio suficiente.

---

## 5. Disparadores De Escalamiento

Una situacion puede escalar cuando ocurra al menos una de estas condiciones:

- error de fuente persistente;
- error de fuente en proceso de alta o critica prioridad;
- evento proximo que se acerca al umbral de riesgo;
- alerta no atendida dentro del tiempo definido;
- proceso con novedad relevante y sin responsable;
- requiere revision que permanece abierto;
- combinacion de senales que aumenta severidad.

Regla:

```text
el escalamiento debe nacer de persistencia, cercania o severidad
no de simple volumen de actividad
```

---

## 6. Escalamiento Por Persistencia

Persistencia significa que el problema no desaparece en una sola corrida.

Ejemplos:

- el error de fuente sigue apareciendo;
- la alerta sigue abierta;
- el proceso sigue sin responsable;
- la revision sigue pendiente.

La persistencia debe poder:

- elevar atencion;
- elevar prioridad;
- cambiar destinatario;
- habilitar notificacion.

Principio:

```text
lo que persiste merece un trato distinto a lo que aparece una sola vez
```

---

## 7. Escalamiento Por Cercania Temporal

La cercania de un evento puede justificar escalamiento aunque no exista fallo.

Ejemplos:

- audiencia proxima;
- vencimiento o termino cercano;
- actuacion que abre una ventana de respuesta corta.

La escalada temporal debe ser progresiva.

No todo evento futuro es urgente desde el primer momento.

---

## 8. Escalamiento Por Falta De Cobertura

Una situacion puede escalar cuando la operacion pierde cobertura real.

Ejemplos:

- proceso sin responsable;
- fuente sin consulta reciente cuando deberia haberse consultado;
- error de fuente en un caso sensible;
- novedad importante sin evidencia de lectura o atencion.

Esto importa especialmente porque LexControl promete cobertura silenciosa, no solo visibilidad.

Si la cobertura falla, la respuesta debe subir.

---

## 9. Relacion Con Atencion

El escalamiento modifica el nivel de atencion.

Puede mover una senal desde:

- silencio operativo
a
- bandeja
o desde bandeja
a
- atencion elevada
o
- interrupcion

Contrato relacionado:

```text
docs/producto/contrato-reglas-atencion.md
```

---

## 10. Relacion Con Prioridad

El escalamiento puede elevar prioridad cuando la situacion gana peso operativo.

No reemplaza la prioridad.

La modifica.

Contrato relacionado:

```text
docs/producto/contrato-reglas-prioridad.md
```

---

## 11. Relacion Con Notificaciones

No todo escalamiento debe notificar.

Pero el escalamiento puede cambiar si una senal:

- solo se ve;
- entra a resumen;
- interrumpe por canal.

Contrato relacionado:

```text
docs/producto/contrato-reglas-notificaciones.md
```

---

## 12. Destinatarios De Escalamiento

Escalar no siempre significa ir a mas personas.

Significa ir a la persona correcta en un nivel de respuesta mayor.

Posibles destinatarios:

- responsable del proceso;
- administrador de cuenta;
- equipo operativo del bufete;
- supervision interna.

Regla:

```text
si el escalamiento no cambia capacidad de respuesta,
no esta escalando de verdad
```

---

## 13. Registro Y Trazabilidad

Todo escalamiento debe dejar rastro.

La arquitectura debe poder registrar, como minimo:

- senal de origen;
- nivel anterior;
- nivel nuevo;
- motivo del escalamiento;
- fecha;
- destinatario o canal si aplica;
- estado posterior.

Esto puede apoyarse en:

- `alerts`
- `notification_deliveries`
- metadata de eventos o alertas

Regla:

```text
un escalamiento sin trazabilidad es solo una impresion del sistema
```

---

## 14. Parametrizacion Esperada

La subseccion `Configuracion > Reglas operativas > Escalamiento` debe prever:

- umbral de persistencia;
- umbral de cercania temporal;
- reglas por prioridad;
- reglas por tipo de evento;
- destinatarios por severidad;
- politicas para alertas no atendidas.

No hace falta exponer toda esa profundidad en dia uno.

Pero la arquitectura debe admitirla sin rehacer la logica base.

---

## 15. Estado Actual Del Sistema

Hoy LexControl ya tiene:

- `alerts`;
- estados operativos;
- prioridades;
- capa de atencion;
- canales previstos de notificacion.

Lo que falta cerrar a nivel de implementacion es:

- politica exacta de escalamiento por persistencia;
- escalamiento temporal por eventos proximos;
- cambio de destinatario o canal cuando una senal sigue abierta;
- UI para configurar estas reglas por cuenta.

Este contrato fija esa direccion.

---

## 16. Criterio De Listo

La capa de escalamiento se considera bien encaminada cuando:

1. una alerta puede subir de nivel por persistencia;
2. un evento puede subir de visibilidad por cercania;
3. un problema de cobertura puede cambiar de destinatario;
4. prioridad, atencion y notificacion responden al cambio;
5. todo cambio de nivel deja rastro.

---

## 17. Regla Final

```text
LexControl no debe solo detectar senales.
Debe saber cuando una senal ya no puede quedarse en el mismo nivel.
```
