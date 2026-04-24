# Contrato De Postcarga E Inicio De Vigilancia

Producto: LexControl  
Superficie: `app.lexcontrol.co`  
Version: v1.0  
Estado: Congelado para implementacion

Contratos complementarios obligatorios:

```text
docs/producto/contrato-ui-app-operativa-lexcontrol.md
docs/producto/contrato-demo-operativa-produccion.md
docs/producto/contrato-reglas-operativas-consulta.md
```

---

## 1. Decision Rectora

Despues de cargar procesos, el usuario no debe correr terminal, workers ni comandos.

La vigilancia debe arrancar desde el producto.

Regla:

```text
la infraestructura es nuestra
la continuidad operativa debe sentirse automatica para el usuario
```

---

## 2. Proposito Del Contrato

Este documento congela:

- que ocurre inmediatamente despues de la carga de procesos;
- que ve el usuario;
- que hace el sistema por detras;
- que acciones manuales si existen en UI;
- que no se le puede pedir al abogado.

Busca evitar:

1. que el sistema dependa de terminal para operar;
2. que la carga termine en un limbo sin feedback;
3. que el usuario no sepa si la vigilancia ya arranco;
4. que marketing prometa automatizacion y producto entregue espera muda.

---

## 3. Momento De Activacion

El contrato aplica cuando un usuario:

- carga procesos individualmente; o
- carga procesos masivamente.

Se considera que la carga fue exitosa cuando:

- los radicados quedaron creados en `cases`;
- sus fuentes iniciales quedaron preparadas en `case_sources`.

Desde ese momento, comienza la fase de postcarga.

---

## 4. Principio De Experiencia

La carga no es el final del flujo.

La carga es el inicio de la vigilancia.

Regla:

```text
si el usuario ya cargo procesos
el sistema debe empezar a convertirlos en operacion visible
```

Eso significa:

- no dejar al usuario con una lista muda;
- no obligarlo a refrescar sin contexto;
- no trasladarle una tarea tecnica interna.

---

## 5. Flujo Esperado

Secuencia congelada:

1. el usuario carga procesos;
2. el sistema confirma cuantos fueron aceptados;
3. el sistema crea o completa `case_sources`;
4. el sistema dispara el inicio de vigilancia;
5. la UI muestra estado de sincronizacion;
6. la bandeja empieza a poblarse progresivamente;
7. la UI muestra la ultima actualizacion y el estado general del lote.

---

## 6. Que Debe Hacer El Sistema

Minimo obligatorio despues de la carga:

- iniciar la primera pasada de vigilancia sin requerir terminal;
- priorizar procesos recien cargados dentro de la primera cola;
- dejar trazabilidad del estado de la corrida;
- actualizar la UI con progreso y resultado.

El mecanismo interno puede ser:

- disparo automatico del worker;
- job en cola;
- orquestacion por backend;
- scheduler acelerado para procesos recien cargados.

Decision de contrato:

```text
el mecanismo tecnico es interno
la experiencia visible es automatica
```

---

## 7. Que Debe Ver El Usuario

Despues de la carga, la UI debe mostrar una capa clara de estado.

Estados minimos:

- `procesos cargados`
- `vigilancia iniciando`
- `consultando cartera`
- `sincronizacion parcial`
- `sincronizacion completa`
- `requiere revision`

Textos esperados, o equivalentes:

- `84 procesos cargados`
- `La vigilancia inicial ya esta corriendo`
- `Estamos consultando la cartera para poblar la bandeja`
- `Ultima actualizacion hace X minutos`

La UI debe evitar:

- silencio total;
- spinner sin significado;
- tecnicismos tipo `worker`, `batch`, `job`, `queue`.

---

## 8. Acciones Manuales Permitidas En UI

Aunque la primera vigilancia debe arrancar sola, la UI puede ofrecer acciones explicitas.

Acciones permitidas:

- `Actualizar ahora`
- `Reintentar sincronizacion`
- `Consultar ahora` por proceso

Acciones no permitidas como requisito de uso:

- abrir terminal;
- correr `npm`;
- configurar variables;
- ejecutar workers manualmente.

Regla:

```text
la accion manual en UI es una opcion
no una condicion para que el producto funcione
```

---

## 9. Inicio Automatico Obligatorio

La primera pasada de vigilancia debe dispararse automaticamente despues de una carga exitosa.

Esto aplica especialmente a:

- cuentas nuevas;
- cargas grandes iniciales;
- primer poblamiento de bandeja.

No es aceptable en v1 que el usuario:

- cargue 84 procesos;
- vea la cuenta vacia;
- y dependa del equipo interno para que el sistema empiece.

---

## 10. Tratamiento De Cargas Grandes

Cuando la carga inicial sea grande, por ejemplo:

- 20
- 50
- 84
- 100 procesos

la UI no debe fingir completitud inmediata.

Debe mostrar:

- que la sincronizacion ocurre por etapas;
- que la bandeja se ira poblando;
- que la consulta puede tardar algunos minutos;
- que el sistema sigue operando en background.

Principio:

```text
honestidad de progreso
sin trasladar carga cognitiva tecnica
```

---

## 11. Superficies Donde Debe Reflejarse

### 11.1 Inicio

Debe mostrar:

- procesos cargados recientemente;
- estado de sincronizacion inicial;
- ultima actualizacion;
- CTA a `Bandeja`.

### 11.2 Bandeja

Debe empezar a poblar:

- estados operativos;
- ultima actuacion;
- prioridad;
- atencion;
- alertas.

### 11.3 Monitoreo

Debe reflejar:

- corridas realizadas;
- errores de fuente;
- casos aun no consultados;
- salud general de la primera pasada.

### 11.4 Configuracion

No debe ser el lugar donde se arranca la vigilancia.

Configuracion parametriza.
Operacion vigila.

---

## 12. Contrato De Promesa Comercial

La promesa comercial es:

```text
cargo mi cartera y LexControl empieza a observar por mi
```

Por lo tanto, el producto debe cumplir:

- el sistema arranca;
- la bandeja se llena;
- la vigilancia empieza;
- el usuario entiende que esta ocurriendo.

No se cumple la promesa si:

- la carga termina sin actividad visible;
- la primera revision depende del equipo tecnico;
- el usuario no sabe si el sistema ya comenzo.

---

## 13. Criterio De Listo

Esta capa se considera lista cuando:

1. una carga exitosa dispara vigilancia inicial automaticamente;
2. la UI muestra estado de postcarga comprensible;
3. la bandeja empieza a poblarse sin intervencion tecnica del usuario;
4. existe al menos una accion manual en UI para refrescar o reintentar;
5. ningun abogado necesita terminal para poner a trabajar su cuenta.

---

## 14. Implementacion Minima Recomendada

Orden recomendado:

1. al finalizar carga, crear marca de `sync_pending`;
2. disparar job de primera corrida;
3. mostrar `vigilancia iniciando` en UI;
4. exponer progreso simple por cuenta;
5. habilitar boton `Actualizar ahora`;
6. habilitar `Consultar ahora` por proceso.

---

## 15. Regla Final

```text
despues de cargar procesos
el abogado no debe preguntarse que sigue
el sistema debe mostrarselo y empezar a trabajar
```
