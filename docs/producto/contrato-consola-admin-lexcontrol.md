# Contrato De Consola Admin LexControl

Producto: LexControl  
Superficie: `admin.lexcontrol.co`  
Version: v1.0  
Estado: Congelado para implementacion

---

## 1. Decision Rectora

LexControl debe tener una consola administrativa interna separada de:

- `lexcontrol.co`
- `app.lexcontrol.co`

La consola interna vive en:

```text
admin.lexcontrol.co
```

Su proposito no es mostrar la operacion de un cliente.

Su proposito es permitir que LexControl opere el negocio, supervise cuentas y administre activaciones con control.

Regla:

```text
app.lexcontrol.co opera cuentas
admin.lexcontrol.co opera LexControl
```

---

## 2. Proposito Del Contrato

Este documento define:

- que puede ver un `platform_admin`
- que puede hacer
- que entidades administra
- que metricas minimas necesita
- que acciones criticas debe tener desde el dia uno

Busca evitar que la consola admin se convierta en:

- un espejo confuso de Supabase
- una UI generica sin criterio
- una pantalla llena de tecnicismos
- una acumulacion de modulos sin jerarquia

La consola admin debe ser una interfaz de control operativo del negocio.

---

## 3. Usuarios Permitidos

La consola admin no es multirol en su primera version.

Usuario inicial permitido:

```text
platform_admin
```

No debe estar abierta a:

- `account_admin`
- `operator`
- usuarios demo
- clientes

Fase posterior opcional:

- rol interno `ops_admin`
- rol interno `support`

Pero no entra en el dia uno.

---

## 4. Objetivo Del Dia Uno

El objetivo minimo de `admin.lexcontrol.co` es permitir que LexControl controle:

1. cuentas activadas
2. duracion de demo
3. capacidad usada
4. usuarios por cuenta
5. salud operativa de cada cuenta
6. conversion desde activacion hacia uso real

No se trata de construir un ERP.

Se trata de tener una consola con la que LexControl pueda operar sin depender de SQL manual para lo cotidiano.

---

## 5. Entidades Administradas

La consola admin debe administrar estas entidades:

### 5.1 Activation Requests

Solicitudes capturadas desde la landing.

Debe poder ver:

- nombre
- firma o empresa
- correo
- WhatsApp
- ciudad
- volumen
- urgencia
- estado de calificacion
- estado de agenda
- fecha de solicitud

Debe permitir:

- abrir detalle
- cambiar estado operativo interno si hace falta
- convertir solicitud en cuenta activa

---

### 5.2 Organizations

Representan cuentas reales dentro del sistema.

Debe poder ver:

- nombre de la cuenta
- estado de cuenta
- fecha de activacion
- fecha de vencimiento demo
- admin principal
- procesos activos usados
- responsables usados
- ultimo acceso o ultima actividad relevante

Debe permitir:

- activar cuenta
- suspender cuenta
- extender demo
- cerrar demo
- marcar cuenta como convertida

Estados sugeridos:

- `demo_active`
- `demo_expired`
- `suspended`
- `converted`
- `closed`

---

### 5.3 Team Members

Usuarios reales de cada cuenta.

Debe poder ver:

- nombre
- correo
- rol
- estado
- cuenta a la que pertenecen

Debe permitir:

- crear admin de cuenta
- crear responsables
- desactivar usuario
- reactivar usuario
- resetear credenciales o regenerar acceso en fase posterior

---

### 5.4 Cases

Inventario operativo por cuenta.

Debe poder ver:

- numero total de procesos
- procesos activos
- procesos pausados
- procesos cerrados
- distribucion por prioridad

No hace falta que admin pueda editar todos los campos del caso desde el dia uno.

Minimo:

- ver inventario
- ver capacidad usada
- abrir detalle resumido de cuenta

---

### 5.5 Operational Health

La consola debe poder observar salud operativa por cuenta.

Debe poder ver:

- procesos con novedad
- procesos con error de fuente
- procesos que requieren revision
- eventos activos
- alertas activas
- ultima corrida o ultima consulta exitosa

Esto no reemplaza la bandeja del cliente.

Esto da supervision interna a LexControl.

---

## 6. Lo Que El Platform Admin Puede Ver

## 6.1 Vista General

La pantalla principal debe responder rapido:

```text
Cuantas cuentas activas tenemos
cuantas demos siguen vivas
cuantas vencen pronto
cuantas estan usando bien el producto
cuantas tienen problemas operativos
```

Metricas minimas:

- cuentas demo activas
- cuentas convertidas
- solicitudes pendientes
- cuentas con error de fuente alto
- cuentas con poco uso o sin uso reciente
- procesos activos totales
- responsables activos totales

---

## 6.2 Vista De Cuentas

Listado de cuentas con:

- nombre
- estado
- dias restantes de demo
- procesos activos usados / limite
- responsables usados / limite
- admin principal
- ultima actividad

Debe permitir ordenar o filtrar por:

- estado
- dias restantes
- uso alto
- uso bajo
- problemas operativos

---

## 6.3 Vista De Activaciones

Listado de leads y activaciones con:

- nombre
- empresa
- volumen
- urgencia
- calificacion
- enviado a agenda
- convertido en cuenta o no

Esto conecta la captacion con la operacion real.

---

## 6.4 Vista De Cuenta

Cada cuenta debe tener una ficha interna con:

- datos generales
- admin principal
- responsables
- capacidad usada
- estado demo
- salud operativa
- procesos con novedad
- procesos con error
- alertas recientes

La vista de cuenta debe ayudar a responder:

```text
Esta cuenta esta usando el producto?
Esta cuenta esta en riesgo?
Esta cuenta esta lista para convertir?
```

---

## 7. Lo Que El Platform Admin Puede Hacer

## 7.1 Acciones Sobre Activaciones

- revisar solicitud
- marcar como calificada
- marcar como descartada
- convertir a cuenta
- abrir o registrar seguimiento

---

## 7.2 Acciones Sobre Cuentas

- crear cuenta
- activar demo
- extender demo
- suspender cuenta
- reactivar cuenta
- marcar como convertida
- cerrar cuenta

No se recomienda borrar cuentas desde UI en dia uno.

Accion correcta:

```text
desactivar o cerrar
```

No eliminar.

---

## 7.3 Acciones Sobre Equipo

- crear usuario admin
- crear responsable
- desactivar usuario
- reactivar usuario

Deseable inmediato:

- reasignar responsable principal

---

## 7.4 Acciones Sobre Limites

El admin debe poder ajustar:

- procesos activos maximos
- responsables maximos
- fecha fin demo

Esto es critico porque la promesa comercial puede necesitar ajustes controlados por cuenta.

---

## 7.5 Acciones Sobre Salud Operativa

Minimo:

- ver cuentas con errores de fuente
- ver cuentas con alertas activas
- ver procesos que requieren revision

Deseable cercano:

- disparar una corrida manual por cuenta
- reintentar consultas

---

## 8. Metricas Minimas Del Dia Uno

La consola admin debe mostrar al menos:

### Negocio

- total de solicitudes
- solicitudes calificadas
- solicitudes convertidas en cuenta
- cuentas demo activas
- cuentas convertidas

### Uso

- procesos activos totales
- responsables activos totales
- cuentas con actividad reciente
- cuentas sin actividad reciente

### Operacion

- cuentas con error de fuente
- alertas activas totales
- procesos con novedad
- procesos que requieren revision

### Capacidad

- promedio de uso de procesos por cuenta
- cuentas cerca del limite de 100 procesos
- cuentas cerca del limite de 4 responsables

---

## 9. Acciones Criticas Desde El Dia Uno

Estas son no negociables para el MVP de consola admin:

1. ver listado de cuentas
2. ver estado de cada cuenta
3. ver dias restantes de demo
4. ver procesos activos usados / limite
5. ver responsables usados / limite
6. abrir detalle de cuenta
7. crear o desactivar usuarios de cuenta
8. extender demo
9. suspender o reactivar cuenta
10. convertir cuenta a estado comercial siguiente

Si estas acciones no existen, la consola admin no esta lista.

---

## 10. UX Esperada

La consola admin no debe sentirse como una tabla tecnica sin jerarquia.

Debe transmitir:

- control
- claridad
- estado
- capacidad de decision

Debe parecer parte del mismo sistema que:

- landing
- app de clientes

Pero con personalidad propia de control interno.

Principios:

- resumen arriba
- listas con sentido operativo
- detalle lateral o ficha clara
- estados visibles
- poco ruido visual

No construirla como:

- CRM generico
- panel de base de datos
- pagina de configuracion oscura

---

## 11. Lo Que No Entra En Dia Uno

No entra todavia:

- facturacion
- pagos
- analitica financiera profunda
- automatizaciones comerciales complejas
- auditoria completa de acciones admin
- soporte interno multiagente
- permisos granulares por subrol

Todo eso puede venir despues.

---

## 12. Criterio De Listo

`admin.lexcontrol.co` se considera lista para primera operacion cuando un `platform_admin` puede:

1. entrar con login
2. ver solicitudes de activacion
3. ver cuentas activas
4. ver demo restante por cuenta
5. ver capacidad usada por cuenta
6. abrir ficha de cuenta
7. crear o desactivar usuarios de cuenta
8. extender demo
9. suspender o reactivar cuenta
10. identificar cuentas con riesgo operativo

Si esto ocurre, la consola admin ya genera valor real para LexControl.

---

## 13. Relacion Con Las Otras Superficies

### `lexcontrol.co`

Convierte y capta.

### `app.lexcontrol.co`

Opera la cuenta del cliente.

### `admin.lexcontrol.co`

Opera LexControl como negocio y como plataforma.

Regla final:

```text
La landing convence.
La app entrega.
La consola admin controla.
```

