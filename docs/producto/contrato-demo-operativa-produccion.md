# Contrato De Demo Operativa En Produccion

Producto: LexControl  
Modalidad comercial: Demo gratuita controlada  
Version: v1.0  
Estado: Congelado para implementacion

---

## 1. Decision Rectora

Para el usuario final, LexControl no se presenta como beta, prototipo ni prueba.

Internamente puede existir una fase de validacion.

Externamente, toda cuenta activada debe sentirse como:

```text
producto real en operacion
```

La experiencia no puede transmitir:

- interfaz provisional
- reglas ambiguas
- limites poco claros
- promesa comercial mas grande que la entrega real

Regla:

```text
Lo que LexControl promete en la activacion comercial
debe existir en el producto desde el primer dia.
```

---

## 2. Proposito Del Contrato

Este documento define exactamente que recibe una firma o abogado cuando activa la demo operativa de LexControl.

Su objetivo es evitar tres riesgos:

1. Construir por parches.
2. Prometer mas de lo que hoy entregamos.
3. Abrir cuentas reales sin una experiencia consistente.

Este contrato reemplaza cualquier interpretacion ambigua del tipo:

```text
despues lo arreglamos
```

Aqui se congela:

- alcance entregable
- limites de la demo
- experiencia minima esperada
- reglas operativas
- decisiones de producto que afectan pricing futuro

---

## 3. Oferta Congelada De La Demo

La demo operativa de LexControl incluye:

- 14 dias de uso
- hasta 100 procesos activos
- hasta 4 responsables
- bandeja operativa real
- Lex sobre la bandeja real
- carga individual y masiva de procesos
- detalle por proceso
- estados operativos y alertas visibles

Esta es la promesa actual.

No se debe ofrecer por ahora nada que se salga de este paquete como parte de la activacion estandar.

---

## 4. Lo Que El Usuario Debe Recibir

## 4.1 Cuenta

Cada cuenta activada debe tener:

- una organizacion propia
- un usuario administrador inicial
- capacidad de operar sin depender del equipo interno para el uso diario

La cuenta no debe sentirse como una demo compartida o una maqueta conectada a datos falsos.

Debe sentirse como:

```text
mi espacio real de trabajo en LexControl
```

---

## 4.2 Equipo

Cada cuenta puede operar con:

- 1 administrador principal
- hasta 3 responsables adicionales

Total:

```text
hasta 4 responsables
```

Estos responsables deben poder existir como usuarios reales del sistema.

No se debe resolver este punto con textos libres o campos simulados.

La promesa comercial implica gestion real de usuarios.

Minimo requerido:

- crear responsable
- listar responsables
- asignar responsable a procesos

Deseable inmediato:

- desactivar responsable
- reasignar procesos

---

## 4.3 Procesos

Cada cuenta activada puede tener:

```text
hasta 100 procesos activos
```

Decision congelada:

El limite aplica sobre procesos activos, no sobre procesos historicamente cargados.

Eso significa:

- si una cuenta tiene 100 procesos activos, no puede activar el numero 101
- si archiva, pausa o cierra uno, libera cupo operativo
- borrar o desactivar un proceso puede liberar capacidad segun el estado final definido

Este contrato no adopta la logica de:

```text
100 procesos cargados historicos de por vida
```

porque eso distorsiona el valor real del producto y genera friccion innecesaria.

Regla comercial y operativa:

```text
el limite se mide sobre el inventario vivo que la cuenta esta vigilando
```

Esto debe reflejarse en UI con un contador visible.

---

## 4.4 Bandeja Operativa

La bandeja operativa es el centro del producto.

Debe parecerse visual y funcionalmente a la promesa que ya mostramos en la landing.

No debe sentirse como una pantalla interna sin relacion con la narrativa comercial.

Minimo requerido:

- resumen superior de estado operativo
- tabla o lista principal de procesos
- filtros operativos
- detalle por proceso
- ultima actuacion textual
- anotacion de ultima actuacion
- proximo evento si existe
- fuente
- responsable
- prioridad
- alertas visibles
- historial de snapshots visibles

Principio rector:

```text
La bandeja no es otra tabla para revisar.
Es una interfaz para decidir.
```

Contrato obligatorio de arquitectura de interfaz:

```text
docs/producto/contrato-ui-app-operativa-lexcontrol.md
```

---

## 4.5 Lex

Lex debe existir dentro de la demo operativa real.

No como decoracion.

No como feature de marketing separado.

Debe operar sobre los procesos reales de la cuenta activada.

Capacidad minima esperada:

- responder sobre los procesos visibles
- responder sobre estados operativos
- responder sobre eventos
- responder sobre alertas
- responder sobre volumen de la cuenta
- responder sobre responsables

No se debe presentar un Lex demo conectado a datos sinteticos cuando el usuario ya esta dentro de su cuenta real.

Regla:

```text
si la cuenta ya esta activada, Lex debe hablar sobre esa operacion
```

---

## 4.6 Duracion Visible

La demo operativa dura:

```text
14 dias
```

Eso debe ser visible dentro del producto.

Minimo requerido:

- dias restantes
- fecha de inicio
- fecha de fin o equivalente

La cuenta no debe quedar en incertidumbre sobre cuanto tiempo le queda.

---

## 4.7 Capacidad Visible

La cuenta debe mostrar:

- procesos activos usados
- cupo disponible
- responsables usados
- cupo disponible

Ejemplos:

- `37 / 100 procesos activos`
- `2 / 4 responsables`

Esto no es cosmico ni comercial.

Es producto.

Ayuda a:

- orientar uso
- preparar conversion a plan pago
- evitar friccion cuando la cuenta se acerca al limite

---

## 5. Modulos Minimos De La Demo Operativa

La cuenta activada debe incluir estos modulos:

### 5.1 Acceso

- login
- organizacion propia
- sesion real

### 5.2 Responsables

- crear
- listar
- asignar a procesos

### 5.3 Procesos

- carga individual
- carga masiva
- responsable
- prioridad
- estado de carga

### 5.4 Bandeja

- resumen
- filtros
- detalle
- eventos
- alertas
- snapshots

### 5.5 Lex

- companion operativo sobre cuenta real

### 5.6 Estado De Demo

- dias restantes
- procesos activos usados
- responsables usados

---

## 6. Lo Que No Debe Estar En La Promesa De Esta Modalidad

No forma parte de esta entrega base:

- SAMAI productivo
- WhatsApp automatico productivo
- pagos
- facturacion
- portal cliente final
- autoservicio completo de suscripcion
- multifuente completa
- automatizacion juridica avanzada

Si alguno de estos elementos aparece despues, se comunica como fase siguiente o add-on.

No como parte del paquete actual.

---

## 7. Regla De Calidad De Experiencia

La demo operativa debe sentirse:

- estable
- clara
- actual
- profesional
- coherente con la landing

No debe sentirse:

- interna
- improvisada
- mas pobre que la promesa visual
- desalineada con el design system

Regla:

```text
La cuenta activada debe ser reconocible como el mismo producto
que se mostro en la landing.
```

---

## 8. Reglas Operativas Congeladas

### 8.1 Procesos activos

El limite de 100 aplica sobre procesos activos.

### 8.2 Responsables

El limite de 4 aplica sobre usuarios responsables reales.

### 8.3 Cuenta administradora

Cada cuenta tiene un administrador principal.

### 8.4 Creacion de responsables

La cuenta administradora debe poder crear los otros responsables sin depender del equipo de LexControl para el uso normal.

### 8.5 UX de bandeja

La bandeja debe seguir la logica demostrada en la landing:

- resumen arriba
- estados claros
- seleccion y detalle
- lenguaje operativo

### 8.6 Demo visible

La cuenta debe mostrar que esta en modalidad de demo activa, pero sin lenguaje de prototipo.

Copy recomendado:

```text
Demo activa
Te quedan 11 dias
37 / 100 procesos activos
2 / 4 responsables
```

No usar:

- beta
- prueba tecnica
- entorno piloto

---

## 9. Criterio De Listo Para Abrir Cuentas

Una cuenta se considera lista para activacion externa cuando cumple:

1. Un usuario administrador puede entrar.
2. Puede crear responsables.
3. Puede cargar procesos.
4. Puede ver la bandeja operativa real.
5. Puede abrir detalle por proceso.
6. Puede ver alertas y snapshots.
7. Puede usar Lex sobre la cuenta real.
8. Puede ver dias restantes y capacidad usada.

Si alguno de estos puntos no existe todavia, la modalidad comercial no debe prometerlo como experiencia estandar ya disponible.

---

## 10. Implicacion Para Desarrollo

El trabajo inmediato deja de ser:

```text
seguir parchando pantallas
```

Y pasa a ser:

```text
cerrar el instrumento de produccion exacto que se activa
cuando una firma entra a LexControl
```

Por tanto, el siguiente tramo de desarrollo debe priorizar:

1. gestion real de responsables
2. contador de procesos activos y dias restantes
3. bandeja real alineada a la promesa visual
4. Lex sobre cuenta real
5. responsive serio mobile y desktop
