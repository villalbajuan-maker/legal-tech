# Contrato De Estados Y Tipos De Actuacion MVP

Version: v1.0 MVP  
Producto: LexControl  
Estado: Congelado

## 1. Proposito

Este contrato define dos capas distintas del producto:

1. estados operativos de la bandeja;
2. tipos de actuacion detectada.

No deben mezclarse.

Los estados operativos existen para ayudar a decidir.
Los tipos de actuacion existen para explicar que clase de novedad se detecto.

## 2. Regla Rectora

Una actuacion no es un estado.

Ejemplos:

- `Auto` no es estado.
- `Traslado` no es estado.
- `Audiencia` no es estado.

Esos valores pertenecen a la taxonomia de actuaciones.

Los estados operativos son la capa visible principal de la bandeja.

## 3. Estados Operativos Congelados Para MVP

LexControl usara estos 5 estados operativos como base del producto:

1. `Con novedad`
2. `Sin cambios`
3. `No consultado`
4. `Error de fuente`
5. `Requiere revision`

## 4. Definicion De Cada Estado

### 4.1 Con novedad

Se usa cuando la consulta fue exitosa y se detecto un cambio relevante frente al ultimo estado conocido.

Valor:

- muestra que hubo movimiento;
- activa la revision del responsable;
- permite filtrar por cambios recientes.

### 4.2 Sin cambios

Se usa cuando la consulta fue exitosa y no se detectaron diferencias frente al ultimo snapshot confiable.

Valor:

- da trazabilidad;
- confirma que el proceso si fue consultado;
- evita interpretar silencio como omision.

### 4.3 No consultado

Se usa cuando el proceso no fue consultado todavia dentro de la ventana operativa esperada.

Valor:

- hace visible el punto ciego;
- muestra procesos que no han sido revisados;
- evita asumir cobertura inexistente.

### 4.4 Error de fuente

Se usa cuando si hubo intento de consulta, pero la fuente fallo, devolvio informacion incompleta o no entrego una respuesta confiable.

Valor:

- separa fallo tecnico de ausencia de novedad;
- protege contra falsas interpretaciones;
- permite reintentos y soporte.

### 4.5 Requiere revision

Se usa cuando el proceso necesita intervencion humana prioritaria, aunque la consulta haya sido exitosa.

Valor:

- conecta monitoreo con accion;
- evita que toda novedad pese igual;
- permite llevar la bandeja de visibilidad a decision.

## 5. Regla Importante Sobre Requiere Revision

`Requiere revision` es una conclusion operativa, no una actuacion.

No depende solo del nombre de la ultima actuacion.

Puede dispararse por reglas como:

- audiencia proxima;
- audiencia reprogramada;
- sentencia o fallo;
- medida cautelar;
- actuacion nueva sin clasificacion clara;
- error repetido de fuente;
- demasiados dias sin consulta exitosa;
- cualquier evento definido como prioridad alta o critica.

## 6. Taxonomia Congelada De Tipos De Actuacion

LexControl usara esta taxonomia inicial para clasificar actuaciones:

1. `Auto`
2. `Traslado`
3. `Audiencia`
4. `Sentencia / fallo`
5. `Medida cautelar`
6. `Terminacion / archivo`
7. `Impulso procesal`
8. `Actuacion administrativa`
9. `Documento / memorial`
10. `Sin clasificar`

## 7. Uso De La Taxonomia

La taxonomia de actuaciones debe servir para:

- describir la ultima actuacion;
- clasificar novedades;
- enriquecer filtros futuros;
- alimentar reglas de prioridad;
- responder mejor en Lex;
- construir reportes mas utiles para abogados.

## 8. Modelo Conceptual Minimo

Cada proceso debe poder almacenar, como minimo:

- estado operativo;
- tipo de actuacion;
- ultima actuacion textual;
- anotacion de la actuacion;
- fecha de la actuacion;
- fecha de ultima consulta exitosa;
- responsable;
- prioridad.

## 9. Jerarquia De Lectura En Producto

La lectura recomendada del producto es:

1. estado operativo;
2. prioridad;
3. tipo de actuacion;
4. texto y anotacion;
5. responsable.

La bandeja debe priorizar primero el estado operativo.

## 10. Regla De UX

En la interfaz:

- los estados deben ser visibles a primera vista;
- las actuaciones explican el contenido de la novedad;
- `Requiere revision` debe tener un tratamiento visual claro;
- `No consultado` y `Error de fuente` no deben mezclarse con `Sin cambios`.

## 11. Regla Para Lex

Lex debe poder responder sobre:

- cuantos procesos estan en cada estado;
- que procesos requieren revision;
- que tipo de actuaciones recientes existen;
- cuales son las ultimas actuaciones y anotaciones por proceso;
- que procesos no se consultaron;
- que procesos fallaron por fuente.

## 12. Decision Congelada

Queda congelado para MVP que:

- la bandeja opera con 5 estados;
- las actuaciones usan esta taxonomia inicial de 10 familias;
- `Requiere revision` es estado operativo;
- `Sin clasificar` existe como categoria valida;
- los estados no se reemplazan por nombres de actuaciones.
