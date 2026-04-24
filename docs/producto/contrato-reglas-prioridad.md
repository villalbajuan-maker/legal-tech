# Contrato De Reglas De Prioridad

Producto: LexControl  
Superficie: `app.lexcontrol.co`  
Version: v1.0  
Estado: Congelado para implementacion

---

## 1. Decision Rectora

La prioridad no es un adorno visual.

La prioridad es una regla operativa del sistema.

Debe influir en:

- orden de consulta;
- orden de lectura en bandeja;
- severidad de atencion;
- inclusion en resúmenes;
- comportamiento de Lex;
- comportamiento de notificaciones.

Regla madre:

```text
prioridad no es solo color
prioridad cambia comportamiento
```

---

## 2. Proposito Del Contrato

Este documento define:

- niveles de prioridad;
- diferencia entre prioridad manual y calculada;
- factores que elevan o reducen prioridad;
- como se resuelve la prioridad final;
- donde impacta esa prioridad en el sistema.

Busca evitar:

1. prioridades arbitrarias;
2. procesos marcados como importantes sin efecto real;
3. reglas distintas en consulta, bandeja y Lex;
4. cuentas que dependan del equipo interno para ajustar criterio de prioridad.

---

## 3. Principio Operativo

La prioridad existe para responder esta pregunta:

```text
si no puedo mirar toda la cartera al mismo tiempo,
que debe leerse, consultarse y atenderse primero?
```

La prioridad es una capa de enfoque.

No reemplaza el estado operativo.

Lo complementa.

Regla:

```text
estado dice que ocurre
prioridad dice cuanto pesa
```

---

## 4. Niveles De Prioridad

LexControl opera con cuatro niveles:

### 4.1 Baja

Procesos estables o de bajo peso operativo.

Señales tipicas:

- sin cambios sostenidos;
- sin evento proximo;
- baja sensibilidad del caso;
- sin error de fuente relevante.

### 4.2 Normal

Nivel base de la cartera activa.

Es la prioridad por defecto cuando no hay una señal que eleve o reduzca el caso.

### 4.3 Alta

Procesos que merecen seguimiento preferente.

Señales tipicas:

- nueva actuacion relevante;
- evento proximo;
- error de fuente operativo;
- proceso que requiere revision;
- caso sensible para la firma.

### 4.4 Critica

Procesos que exigen tratamiento preferente e inmediato.

Señales tipicas:

- audiencia inminente;
- medida cautelar;
- fallo o sentencia;
- error persistente sobre un caso altamente sensible;
- combinacion de novedad relevante + falta de responsable.

---

## 5. Fuentes De Prioridad

La prioridad puede venir de dos fuentes:

### 5.1 Prioridad Manual

Definida por el usuario o el bufete.

Sirve para incorporar contexto humano que el sistema no deduce por si solo.

Ejemplos:

- cliente sensible;
- caso estrategico;
- proceso con especial visibilidad interna;
- instruccion expresa del equipo.

### 5.2 Prioridad Calculada

Derivada por el sistema a partir de reglas operativas.

Ejemplos:

- actuacion reciente;
- evento proximo;
- error de fuente;
- requiere revision;
- combinaciones de riesgo.

---

## 6. Prioridad Final

La prioridad final visible del proceso debe resolverse por una regla clara.

Decision inicial congelada:

```text
la prioridad final es la mayor entre:
prioridad manual
prioridad calculada
```

Eso protege dos cosas:

- que el criterio humano no se pierda;
- que una señal operativa fuerte tampoco quede oculta por una prioridad manual baja.

La prioridad final debe ser:

- visible en UI;
- usable en filtros;
- usable en orden de consulta;
- usable por Lex.

---

## 7. Factores Que Elevan Prioridad

Un proceso puede elevar prioridad cuando ocurra una o mas de estas condiciones:

- audiencia proxima;
- vencimiento o termino cercano;
- medida cautelar;
- sentencia o fallo;
- actuacion clasificada como relevante;
- estado `requiere_revision`;
- error de fuente repetido;
- falta de responsable sobre un caso con novedad;
- instruccion manual del usuario.

La elevacion puede ser:

- temporal;
- sostenida;
- manual;
- automatica.

---

## 8. Factores Que Reducen Prioridad

Un proceso puede reducir prioridad cuando:

- permanece estable por tiempo suficiente;
- no tiene eventos proximos;
- no tiene novedad reciente;
- no tiene error de fuente;
- el contexto manual ya no lo marca como sensible.

La reduccion de prioridad no debe borrar historia.

Solo debe cambiar el peso operativo actual.

---

## 9. Relacion Con El Estado Operativo

La prioridad no reemplaza los estados operativos.

Ejemplos correctos:

- `Sin cambios` + `baja`
- `Con novedad` + `alta`
- `Requiere revision` + `critica`
- `Error de fuente` + `alta`

Regla:

```text
estado y prioridad deben convivir
no fusionarse
```

---

## 10. Impacto En Consulta

La prioridad debe afectar consulta.

Minimo requerido:

- procesos criticos se consultan antes;
- procesos altos se consultan antes que los normales;
- procesos bajos pueden diferirse si la fuente exige moderacion;
- la prioridad protege la fuente contra volumen innecesario.

Contrato relacionado:

```text
docs/producto/contrato-reglas-operativas-consulta.md
```

---

## 11. Impacto En Bandeja

La prioridad debe afectar bandeja.

Minimo requerido:

- jerarquia visual clara;
- orden o agrupacion por prioridad cuando aplique;
- filtros por prioridad;
- combinacion de prioridad + estado para decidir foco.

La prioridad no debe dominar sola la vista.

Debe leerse junto con:

- estado operativo;
- ultima actuacion;
- responsable;
- evento proximo.

---

## 12. Impacto En Atencion

La prioridad alimenta la capa de atencion, pero no la reemplaza.

Ejemplos:

- un caso `alta` con nueva actuacion puede entrar a bandeja;
- un caso `baja` sin cambios puede permanecer en silencio;
- un caso `critica` puede justificar interrupcion;
- un caso `normal` con error aislado puede ser visible sin notificar.

Contrato relacionado:

```text
docs/producto/contrato-reglas-atencion.md
```

---

## 13. Impacto En Lex

Lex debe usar prioridad como criterio de lectura.

Eso significa:

- cuando resume, menciona primero alta y critica;
- cuando el usuario pregunta "que requiere atencion", la prioridad pesa;
- cuando el usuario pregunta por responsables, Lex puede cruzar responsable + prioridad;
- cuando el usuario pide sintesis, Lex no trata una baja igual que una critica.

Lex no debe inventar prioridad.

Debe leer la prioridad efectiva del sistema.

---

## 14. Parametrizacion Esperada

La subseccion `Configuracion > Reglas operativas > Prioridad` debe prever, al menos en arquitectura:

- criterios que elevan prioridad;
- criterios que reducen prioridad;
- reglas por tipo de actuacion;
- reglas por cercania de evento;
- combinacion de prioridad manual y calculada;
- jerarquia por cuenta o bufete.

No hace falta exponer toda esta parametrizacion en dia uno.

Pero el modelo debe pensarse como configurable.

---

## 15. Estado Actual Del Sistema

Hoy LexControl ya tiene:

- campo de prioridad en procesos;
- prioridad visible en bandeja y detalle;
- prioridad usada en discurso de producto;
- prioridad presente en contratos de UI, estados, consulta y Lex.

Lo que falta cerrar a nivel de implementacion es:

- politica exacta de prioridad calculada;
- resolucion completa entre prioridad manual y calculada;
- uso consistente de prioridad en scheduler, bandeja y Lex.

Este contrato fija esa direccion.

---

## 16. Criterio De Listo

La capa de prioridad se considera bien encaminada cuando:

1. existen niveles claros y consistentes;
2. la prioridad manual y la calculada pueden convivir;
3. la prioridad altera consulta, atencion y lectura;
4. la bandeja puede filtrar y ordenar por prioridad;
5. Lex responde usando prioridad real;
6. la prioridad deja de ser solo cosmetica.

---

## 17. Regla Final

```text
La prioridad existe para proteger la atencion del equipo.
Si no cambia que se consulta primero, que se ve primero y que se entiende primero,
no es prioridad real.
```
