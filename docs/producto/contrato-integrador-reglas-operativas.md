# Contrato Integrador De Reglas Operativas

Producto: LexControl  
Superficie: `app.lexcontrol.co`  
Version: v1.0  
Estado: Congelado para implementacion

---

## 1. Decision Rectora

Las reglas operativas de LexControl no son ajustes aislados.

Son el sistema que define como la plataforma:

- consulta;
- interpreta;
- prioriza;
- asigna;
- eleva;
- notifica;
- y mantiene en silencio lo que no debe ocupar atencion.

Regla madre:

```text
las reglas operativas no son una suma de settings
son el comportamiento vivo del sistema operativo
```

---

## 2. Proposito Del Contrato

Este documento integra en una sola lectura:

- consulta;
- prioridad;
- atencion;
- notificaciones;
- escalamiento;
- asignacion.

Busca responder:

1. como conviven estas reglas en una sola superficie;
2. en que orden actuan;
3. que ve el usuario en la UI;
4. que necesita el modelo de datos;
5. que se puede implementar primero sin perder coherencia.

Busca evitar:

1. contratos correctos pero desconectados entre si;
2. UI que expone reglas sin mostrar su relacion;
3. implementacion por parches;
4. perder la tesis de administracion de atencion.

---

## 3. Tesis Operativa Integrada

La tesis completa del producto, llevada a reglas operativas, es esta:

```text
LexControl observa la cartera en background,
prioriza lo que pesa mas,
mantiene en silencio lo estable,
asigna cobertura donde corresponde,
y solo eleva o interrumpe cuando el caso lo amerita.
```

Eso significa que el sistema no debe funcionar como:

- un feed;
- una lista de consultas;
- una lluvia de alertas;
- una consola tecnica;
- un flujo donde todo se decide manualmente.

Debe funcionar como:

```text
una capa de cobertura, criterio y atencion administrada
```

---

## 4. Las Seis Familias

### 4.1 Consulta

Gobierna:

- cada cuanto se consulta;
- cuando se protege la fuente;
- cuando se consulta solo un caso;
- como se representa frescura y recencia.

Contrato rector:

`docs/producto/contrato-reglas-operativas-consulta.md`

### 4.2 Prioridad

Gobierna:

- que pesa mas;
- que debe consultarse antes;
- que debe verse antes;
- que procesos merecen una lectura preferente.

Contrato rector:

`docs/producto/contrato-reglas-prioridad.md`

### 4.3 Atencion

Gobierna:

- que queda en silencio;
- que entra a bandeja;
- que pasa a monitoreo;
- que se eleva;
- que debe resumir Lex.

Contrato rector:

`docs/producto/contrato-reglas-atencion.md`

### 4.4 Notificaciones

Gobierna:

- cuando una senal solo se ve;
- cuando entra a resumen;
- cuando interrumpe por canal;
- como se evita fatiga.

Contrato rector:

`docs/producto/contrato-reglas-notificaciones.md`

### 4.5 Escalamiento

Gobierna:

- cuando una situacion cambia de nivel;
- cuando sube de visibilidad;
- cuando cambia destinatario;
- cuando cambia canal;
- cuando la operacion deja de poder tratarla como ruido tolerable.

Contrato rector:

`docs/producto/contrato-reglas-escalamiento.md`

### 4.6 Asignacion

Gobierna:

- a quien le corresponde un proceso;
- como se cubre un proceso sin responsable;
- como se distribuye la carga;
- como se apoya notificacion y escalamiento sobre responsables reales.

Contrato rector:

`docs/producto/contrato-reglas-asignacion.md`

---

## 5. Orden De Funcionamiento

Estas familias no actuan en paralelo sin relacion.

Tienen un orden logico de operacion:

```text
1. Consulta
2. Prioridad
3. Atencion
4. Asignacion
5. Notificaciones
6. Escalamiento
```

Lectura del orden:

### 5.1 Consulta

Trae o actualiza el estado del caso.

### 5.2 Prioridad

Decide cuanto pesa ese caso dentro de la cartera.

### 5.3 Atencion

Decide si ese caso queda en silencio, entra a bandeja o sube.

### 5.4 Asignacion

Decide a quien le corresponde la cobertura o la respuesta.

### 5.5 Notificaciones

Decide si la senal sale de la app y por que canal.

### 5.6 Escalamiento

Decide si la situacion ya no puede quedarse en el mismo nivel.

Regla:

```text
no se notifica bien si no hubo atencion bien resuelta
no se escala bien si no hubo prioridad y cobertura claras
```

---

## 6. Como Conviven En Una Misma Senal

Ejemplo de una sola situacion:

```text
Proceso con audiencia proxima, alta sensibilidad, sin responsable.
```

La lectura integrada seria:

- **Consulta**:
  - puede subir frecuencia
- **Prioridad**:
  - probablemente `alta` o `critica`
- **Atencion**:
  - no puede quedar en silencio
  - debe entrar a bandeja o atencion elevada
- **Asignacion**:
  - al no tener responsable, la cobertura esta incompleta
- **Notificaciones**:
  - puede ameritar resumen o interrupcion
- **Escalamiento**:
  - si sigue sin cobertura o el evento se acerca, sube de nivel

Eso muestra por que estas familias no pueden diseñarse por separado.

---

## 7. Traduccion A La UI

La superficie principal para estas reglas es:

- `Configuracion > Reglas operativas`

Pero sus efectos viven en toda la app:

### 7.1 Inicio

Debe mostrar resultado de las reglas, no su detalle tecnico.

Ejemplos:

- con novedad;
- requieren revision;
- errores de fuente;
- sin responsable;
- eventos proximos;
- alertas activas.

### 7.2 Bandeja

Debe mostrar la operacion ya interpretada por las reglas.

Ejemplos:

- orden segun prioridad;
- estados ya elevados por atencion;
- responsable visible;
- proximidad de evento;
- fuente y recencia;
- alertas o evidencia de escalamiento.

### 7.3 Monitoreo

Debe mostrar supervision de:

- consultas;
- errores;
- cobertura;
- corridas;
- snapshots;
- fallas persistentes.

### 7.4 Configuracion

Debe ser la capa donde el bufete entiende y ajusta el comportamiento del sistema, sin tener que reprogramarlo.

---

## 8. Traduccion A Modelo De Datos

Las reglas operativas no exigen que todo exista como una tabla nueva desde dia uno.

Pero si exigen que el modelo pueda sostener:

### 8.1 Consulta

- recencia;
- ultima corrida;
- tipo de corrida;
- estado por fuente.

### 8.2 Prioridad

- prioridad manual;
- prioridad calculada;
- prioridad final.

### 8.3 Atencion

- estado operativo;
- nivel de atencion;
- razon de elevacion o silencio.

### 8.4 Asignacion

- responsable principal;
- origen de asignacion;
- cobertura incompleta.

### 8.5 Notificaciones

- alertas;
- entregas;
- canal;
- destinatario;
- estado de envio.

### 8.6 Escalamiento

- nivel anterior;
- nivel nuevo;
- motivo;
- fecha;
- destinatario o canal si cambia.

---

## 9. Traduccion A UX

La UX debe hacer que estas reglas se sientan poderosas pero silenciosas.

No debe mostrar:

- un panel lleno de toggles sin contexto;
- settings atomizados e incomprensibles;
- tecnicismos de scheduler o pipelines.

Debe mostrar:

- impacto esperado;
- lenguaje operativo;
- criterio visible;
- pocos ajustes base con efecto real.

Principio:

```text
la configuracion no debe parecer un laboratorio
debe parecer una forma de ajustar como opera el bufete
```

---

## 10. Nivel De Apertura En MVP

No todas las familias deben abrirse con la misma profundidad desde dia uno.

Decision recomendada:

### Exponer en MVP

- consulta:
  - frecuencia base por prioridad
  - consulta puntual
- prioridad:
  - manual
  - criterios base visibles
- atencion:
  - umbrales simples
  - que aparece en bandeja
- asignacion:
  - responsable principal
  - default de cuenta

### Dejar previstos pero no totalmente expuestos

- notificaciones:
  - canales avanzados
  - reglas finas por severidad
- escalamiento:
  - politicas avanzadas por persistencia o canal

Esto protege simplicidad sin perder direccion.

---

## 11. Dependencias Entre Familias

Mapa simple:

```text
consulta alimenta prioridad
prioridad alimenta atencion
atencion y asignacion alimentan notificaciones
prioridad + atencion + asignacion alimentan escalamiento
escalamiento puede modificar atencion, destinatario y canal
```

Esto significa que una UI o implementacion correcta no debe modelarlas como compartimentos ciegos.

---

## 12. Surface Map

La convivencia de reglas en una sola superficie debe leerse asi:

### Capa visible para el usuario

- que veo primero
- por que lo veo
- a quien le corresponde
- si necesito actuar ahora
- si el sistema ya lo escalo o lo notifico

### Capa configurable por la cuenta

- con que frecuencia se consulta
- que pesa mas
- que no debe quedarse en silencio
- como se cubren procesos sin responsable
- cuando se notifica
- cuando se escala

### Capa silenciosa del sistema

- snapshots
- movimientos
- legal events
- reglas aplicadas
- historial de cambios

---

## 13. Riesgos Que Evita Este Documento

Este contrato integrador existe para evitar:

1. una UI donde cada familia se implemente en una pantalla distinta sin criterio comun;
2. reglas que se contradicen;
3. notificaciones sin responsable;
4. escalamiento sin prioridad;
5. bandeja sin diferencia entre silencio y elevacion;
6. configuracion que abre todo a la vez y se vuelve inmanejable.

---

## 14. Siguiente Traduccion

Con este contrato integrador ya se puede pasar a dos piezas de implementacion:

1. **UI de `Configuracion > Reglas operativas`**
2. **modelo de datos / metadata para soportar estas familias**

La recomendacion es traducir primero:

- estructura de UI
- luego modelo de datos minimo
- y solo despues automatizaciones mas profundas

---

## 15. Regla Final

```text
Las reglas operativas no son un modulo secundario.
Son la forma en que cada bufete convierte LexControl en su sistema operativo.
```
