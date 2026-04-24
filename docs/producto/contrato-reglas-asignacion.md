# Contrato De Reglas De Asignacion

Producto: LexControl  
Superficie: `app.lexcontrol.co`  
Version: v1.0  
Estado: Congelado para implementacion

---

## 1. Decision Rectora

LexControl no debe limitarse a mostrar que algo requiere atencion.

Debe ayudar a dejar claro a quien le corresponde esa atencion.

Regla madre:

```text
sin asignacion no hay cobertura real
solo hay visibilidad sin responsable
```

---

## 2. Proposito Del Contrato

Este documento define:

- como se asignan procesos a responsables;
- que tipos de asignacion existen;
- que reglas puede configurar el bufete;
- que ocurre cuando un proceso entra sin responsable;
- como se reacciona cuando cambia la cobertura;
- como se registra la asignacion.

Busca evitar:

1. carteras visibles pero sin dueno operativo;
2. dependencia total de reasignacion manual caso por caso;
3. procesos que generan alertas sin destinatario util;
4. confundir administracion de usuarios con cobertura de procesos.

---

## 3. Principio Operativo

La asignacion existe para responder esta pregunta:

```text
si este proceso cambia,
quien debe leerlo, operarlo o responder primero?
```

Asignar no es solo llenar un campo.

Asignar significa:

- crear cobertura;
- distribuir carga;
- dar contexto a bandeja;
- habilitar notificaciones utiles;
- permitir escalamiento correcto.

---

## 4. Tipos De Asignacion

LexControl debe admitir, al menos en arquitectura, estos tipos:

### 4.1 Asignacion Manual

El usuario o administrador define explicitamente el responsable del proceso.

Debe ser el mecanismo mas claro y confiable de dia uno.

### 4.2 Asignacion Por Regla

El sistema asigna en funcion de reglas configurables del bufete.

Ejemplos:

- por tipo de proceso;
- por ciudad o despacho;
- por familia de actuacion;
- por cliente o grupo interno.

### 4.3 Asignacion Por Default

Cuando no hay una regla mas especifica, el sistema puede aplicar un responsable por defecto.

Esto evita que una parte de la cartera quede sin cobertura.

---

## 5. Unidad De Asignacion

La unidad base de asignacion en MVP es:

- un proceso
- un responsable principal

No se congela desde dia uno un modelo complejo de co-responsables o equipos por caso.

Eso puede crecer despues.

Regla:

```text
en MVP cada proceso debe poder tener
un responsable principal claro
```

---

## 6. Fuentes De Regla

Las reglas de asignacion pueden apoyarse, al menos en arquitectura, en:

- responsable manual elegido por usuario;
- prioridad del caso;
- tipo de actuacion;
- ciudad o despacho;
- categoria procesal;
- default de la cuenta.

No hace falta abrir todas estas combinaciones en UI desde el primer dia.

Pero la arquitectura debe admitirlas.

---

## 7. Cuando Un Proceso Entra Sin Responsable

Si un proceso nuevo entra sin responsable, el sistema no debe fingir que la cobertura esta completa.

Debe poder hacer una de estas cosas:

1. aplicar una regla automatica;
2. asignar responsable por default;
3. dejarlo visible como `sin responsable`;
4. elevarlo si aparece novedad importante sin cobertura.

Principio:

```text
sin responsable no significa invisible
significa cobertura incompleta
```

---

## 8. Asignacion Y Cobertura

La asignacion es una capa de cobertura operativa.

Un proceso bien asignado:

- aparece con contexto correcto en bandeja;
- puede entrar a resumen por responsable;
- puede notificar a quien corresponde;
- puede escalar a la persona correcta.

Un proceso sin responsable:

- reduce confiabilidad operativa;
- puede justificar elevacion de atencion;
- puede justificar escalamiento si permanece asi.

---

## 9. Relacion Con Atencion

La asignacion modifica la lectura de atencion.

Ejemplos:

- una novedad con responsable puede ir a bandeja de forma normal;
- una novedad sin responsable puede subir de severidad;
- un proceso estable sin responsable puede tolerarse mas que uno con novedad.

Contrato relacionado:

```text
docs/producto/contrato-reglas-atencion.md
```

---

## 10. Relacion Con Notificaciones

La notificacion solo sirve si llega a quien puede actuar.

Por eso la asignacion alimenta directamente:

- destinatario por proceso;
- resumen por responsable;
- alertas con dueno operativo.

Contrato relacionado:

```text
docs/producto/contrato-reglas-notificaciones.md
```

---

## 11. Relacion Con Escalamiento

La falta de asignacion puede ser motivo de escalamiento.

Ejemplos:

- proceso con novedad y sin responsable;
- alerta persistente sin dueno;
- proceso prioritario que sigue sin cobertura.

Contrato relacionado:

```text
docs/producto/contrato-reglas-escalamiento.md
```

---

## 12. Reasignacion

La reasignacion debe existir como capacidad normal del producto.

Debe contemplar, al menos:

- cambio manual de responsable;
- reasignacion por salida o desactivacion de un colaborador;
- reasignacion masiva futura;
- trazabilidad del cambio.

La reasignacion no debe romper historia.

Debe actualizar la cobertura actual sin borrar contexto previo.

---

## 13. Distribucion De Carga

La asignacion no solo responde propiedad individual.

Tambien sirve para distribuir operacion.

La configuracion debe poder mostrar, al menos en lectura:

- cuantos procesos tiene cada responsable;
- cuantos con novedad;
- cuantos requieren revision;
- cuantos sin cobertura.

Esto no implica automatizacion avanzada desde dia uno.

Pero si implica que la asignacion debe producir una cartera legible por responsable.

---

## 14. Parametrizacion Esperada

La subseccion `Configuracion > Reglas operativas > Asignacion` debe prever:

- responsable por default;
- reglas por criterio operativo;
- comportamiento para procesos sin responsable;
- politica de elevacion cuando falta cobertura;
- reglas futuras de redistribucion.

No hace falta abrir toda esa potencia en MVP.

Pero debe quedar prevista para crecer sin rearmar el modelo.

---

## 15. Registro Y Trazabilidad

La asignacion debe dejar rastro.

Minimo esperado:

- responsable actual;
- fecha de asignacion;
- origen de la asignacion:
  - manual
  - regla
  - default;
- fecha de reasignacion si aplica.

Regla:

```text
una cartera bien asignada debe poder explicarse
no solo verse
```

---

## 16. Estado Actual Del Sistema

Hoy LexControl ya tiene:

- responsables reales por cuenta;
- capacidad de crear operadores;
- campo de responsable en procesos;
- visibilidad de responsable en bandeja y dataset demo.

Lo que falta cerrar a nivel de implementacion es:

- reglas automatizadas de asignacion;
- manejo mas explicito de procesos sin responsable;
- reasignacion con trazabilidad;
- configuracion de defaults por cuenta.

Este contrato fija esa direccion.

---

## 17. Criterio De Listo

La capa de asignacion se considera bien encaminada cuando:

1. cada proceso puede tener un responsable principal;
2. la UI deja visible cuando falta cobertura;
3. existen defaults o reglas basicas para no depender de asignacion caso por caso;
4. las notificaciones y resúmenes pueden organizarse por responsable;
5. la falta de responsable puede elevar atencion o escalar.

---

## 18. Regla Final

```text
LexControl no solo debe decir que un proceso importa.
Debe ayudar a que alguien concreto se haga cargo.
```
