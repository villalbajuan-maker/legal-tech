# Contrato De Reglas Operativas De Consulta

Producto: LexControl  
Superficie: `app.lexcontrol.co`  
Version: v1.0  
Estado: Congelado para implementacion

---

## 1. Decision Rectora

LexControl no debe consultar toda la cartera cada vez que un usuario abre la aplicacion.

La vigilancia debe operar en background con reglas de frecuencia y prioridad.

El usuario no entra a esperar que el sistema consulte.

El usuario entra a leer el ultimo estado operativo disponible y, si hace falta, a disparar una consulta puntual.

Regla madre:

```text
la bandeja lee estado persistido
la consulta corre por politica operativa
la consulta puntual existe como excepcion intencional
```

---

## 2. Proposito Del Contrato

Este documento congela:

- como se define la frecuencia de consulta
- como influye la prioridad del proceso
- que es consulta automatica
- que es consulta puntual
- cuando un usuario puede forzar una consulta
- como debe comportarse la UI al consultar un solo caso
- como se representa la fuente externa

Busca evitar cuatro errores:

1. consultar todo al entrar a la app;
2. tratar todos los casos con la misma frecuencia;
3. esconder cuando la informacion mostrada no esta recien consultada;
4. dejar la consulta puntual como comportamiento ambiguo o sin trazabilidad.

---

## 3. Principio Operativo

LexControl no vende inmediatez constante.

Vende control operativo con administracion de atencion.

Eso implica:

- la mayor parte de la vigilancia ocurre sin pedir accion del usuario;
- la bandeja muestra el ultimo estado confiable persistido;
- solo los casos que lo ameritan reciben mas frecuencia;
- el usuario puede consultar un caso puntual cuando necesita confirmacion inmediata.

Principio:

```text
no toda la cartera merece consulta inmediata
no toda la actividad merece la misma frecuencia
```

---

## 4. Modelo De Consulta

Existen dos modos de consulta:

### 4.1 Consulta Programada

Es la consulta que corre en background segun reglas operativas.

No depende de que el usuario este mirando la aplicacion.

Su funcion es mantener la cartera razonablemente actualizada.

### 4.2 Consulta Puntual

Es una consulta disparada por el usuario sobre un caso especifico.

Se usa cuando el usuario necesita traer una lectura fresca de ese proceso en ese momento.

No reemplaza la consulta programada.

No se debe usar como mecanismo principal de vigilancia.

---

## 5. Frecuencia De Consulta

La frecuencia no debe ser plana.

Debe depender de reglas operativas.

Minimo requerido para dia uno:

- prioridad del caso
- cercania de evento
- estado operativo reciente
- fallas de fuente

No se debe consultar:

```text
500 casos por abrir la app
```

Eso destruye:

- costo operativo
- estabilidad de la fuente
- latencia
- experiencia de usuario

---

## 6. Politica Base De Frecuencia

La politica inicial congelada debe funcionar asi:

### 6.1 Prioridad Critica

- mayor frecuencia disponible dentro del limite razonable de la fuente
- pensada para:
  - procesos criticos
  - procesos con evento cercano
  - procesos con revision urgente

### 6.2 Prioridad Alta

- frecuencia alta
- usada en procesos sensibles o con actividad reciente

### 6.3 Prioridad Normal

- frecuencia estandar
- es la base de la cartera viva

### 6.4 Prioridad Baja

- menor frecuencia
- apta para procesos estables o sin señales recientes

Regla:

```text
la prioridad modifica frecuencia
no solo color o visual
```

---

## 7. Factores Que Pueden Aumentar Frecuencia

Ademas de la prioridad manual, la plataforma puede elevar temporalmente la frecuencia cuando detecta:

- evento proximo;
- actuacion reciente;
- proceso en estado `requiere_revision`;
- error de fuente repetido;
- consulta puntual reciente que sugiera sensibilidad.

Esto permite que la frecuencia sea:

```text
estable por defecto
adaptativa cuando el caso lo necesita
```

---

## 8. Factores Que Pueden Disminuir Frecuencia

La plataforma puede bajar frecuencia cuando:

- el proceso lleva tiempo estable;
- no hay eventos proximos;
- la prioridad es baja;
- la fuente esta imponiendo restricciones y conviene proteger el volumen de consulta.

La disminucion de frecuencia no debe significar opacidad.

La UI siempre debe mostrar:

- ultima consulta realizada;
- estado operativo actual;
- si la lectura puede no ser inmediata.

---

## 9. Consulta Puntual Por Proceso

Cada proceso debe poder tener una accion explicita de:

```text
Consultar ahora
```

o equivalente.

Esta accion vive en:

- detalle del proceso en Bandeja;
- detalle del proceso en Configuracion / Procesos, si aplica.

No debe vivir como accion dominante para toda la cartera.

### 9.1 Comportamiento Esperado

Cuando el usuario dispara consulta puntual:

1. el sistema registra que fue una consulta manual o on-demand;
2. se consulta solo ese caso;
3. se persiste nuevo snapshot;
4. se actualiza `case_sources`;
5. se insertan movimientos, eventos y alertas si aplican;
6. la UI muestra resultado fresco del caso.

### 9.2 Feedback De UI

La UI debe mostrar con claridad:

- que la consulta esta corriendo;
- si fue exitosa;
- si fallo;
- cuando fue la ultima consulta puntual;
- si el resultado proviene de una lectura reciente.

---

## 10. Trazabilidad De Consulta Puntual

La consulta puntual no debe ser invisible.

Debe dejar evidencia en la arquitectura ya existente:

- nuevo `source_snapshot`
- actualizacion de `case_sources.last_checked_at`
- actualizacion de estado operativo

Deseable inmediato:

- marcar en metadata que la corrida fue `manual` o `on_demand`

Esto permite distinguir:

- consulta por politica operativa
- consulta por accion directa del usuario

---

## 11. Fuente Externa

Cada proceso debe mostrar su fuente de origen.

Minimo requerido:

- nombre de la fuente
- ultima fecha de consulta
- estado de la fuente

Deseable inmediato:

- referencia externa visible

Regla de enlace:

```text
si la fuente permite deep link estable, se muestra enlace directo
si no lo permite, se muestra ruta o referencia de origen
```

No se debe prometer enlace directo si la fuente no ofrece URL confiable.

---

## 12. Lo Que La Bandeja Debe Mostrar Sobre Frescura

La bandeja no debe fingir tiempo real.

Debe mostrar:

- ultima consulta
- estado actual
- si el caso esta cubierto
- si el usuario puede consultar ahora

Eso protege la confianza del sistema.

Regla:

```text
mejor una lectura honesta con timestamp
que una falsa sensacion de tiempo real
```

---

## 13. Relacion Con La Carga Cognitiva

La frecuencia de consulta no debe traducirse en mas ruido para el usuario.

Aunque el sistema consulte mucho en background, la interfaz no debe actuar como feed de actividad.

La interfaz solo eleva:

- novedad relevante
- falla de fuente
- evento cercano
- revision requerida

Todo lo demas puede permanecer en silencio operativo.

---

## 14. Parametrizacion En Configuracion

La vista `Configuracion` debe prever una subseccion de:

```text
Reglas operativas
```

Esa subseccion debe gobernar, al menos en arquitectura, estas capacidades:

- frecuencia base por prioridad;
- criterios de prioridad;
- comportamiento de consulta;
- reglas de notificacion;
- tratamiento de errores de fuente.

No es necesario abrir toda la parametrizacion en dia uno.

Pero el contrato obliga a que la app se piense como:

```text
un sistema parametrizable
no como un producto que depende de ajustes manuales del equipo interno para cada cuenta
```

---

## 15. Estado Actual Del Sistema

Hoy el worker:

- procesa lotes;
- toma `case_sources`;
- consulta segun orden por `last_checked_at`;
- persiste snapshots;
- actualiza resumen operativo;
- crea movimientos, eventos y alertas.

Hoy todavia no existe:

- scheduler automatico plenamente configurado;
- politica final de frecuencia por prioridad en produccion;
- consulta puntual por proceso en UI.

Este contrato define precisamente lo que sigue.

---

## 16. Criterio De Listo

Esta capa se considera bien encaminada cuando:

1. la bandeja lee estado persistido y no dispara consulta total al abrir;
2. existe politica de frecuencia por prioridad;
3. existe consulta puntual por proceso;
4. la consulta puntual deja trazabilidad;
5. la UI muestra ultima consulta y frescura del dato;
6. la fuente externa se muestra con honestidad;
7. la frecuencia protege la fuente y reduce carga operativa;
8. el usuario no siente que deba perseguir el sistema para estar cubierto.

---

## 17. Regla Final

```text
LexControl consulta en segundo plano para que el abogado no tenga que hacerlo.
Y cuando el abogado necesita certeza sobre un caso puntual,
el sistema debe permitirsela sin convertir eso en la rutina principal.
```
