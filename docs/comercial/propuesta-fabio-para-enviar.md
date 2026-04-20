# Propuesta Para Legal Search

## Desarrollo Y Colaboracion Operativa Para Un Sistema Operativo De Vigilancia Judicial

Fabio,

Despues de revisar la operacion actual de Legal Search, considero que el mayor valor no esta simplemente en construir una herramienta de consulta, sino en transformar el proceso manual de vigilancia judicial en una infraestructura tecnologica que permita operar con mas control, trazabilidad y capacidad de crecimiento.

Legal Search ya tiene algo muy importante: un servicio validado, clientes activos, conocimiento operativo y una metodologia que funciona. El reto ahora es reducir la dependencia de la revision manual, disminuir el riesgo operativo y preparar la operacion para escalar.

La propuesta es avanzar hacia un sistema operativo de vigilancia judicial para Legal Search.

## 1. Objetivo

El objetivo es construir una plataforma que permita:

- Centralizar procesos judiciales.
- Consultar automaticamente fuentes disponibles, iniciando por Rama Judicial / Consulta Nacional Unificada.
- Identificar la ultima actuacion de cada proceso.
- Mostrar la anotacion o descripcion de la actuacion.
- Detectar procesos con novedades recientes.
- Marcar procesos no encontrados o no consultados.
- Registrar trazabilidad de cada consulta.
- Generar una bandeja operativa de control.
- Reducir la carga manual actual de Legal Search.

El sistema no se plantea como un simple scraper, sino como una infraestructura para operar vigilancia judicial con mayor confiabilidad.

## 2. Dos Formas De Avanzar

Existen dos rutas posibles.

### Ruta 1: Desarrollo Exclusivo Para Legal Search

Esta ruta aplica si Legal Search quiere contratar el desarrollo completo y quedar como propietario del sistema desarrollado.

En esta opcion, Legal Search asume la inversion completa del desarrollo y recibe el codigo, la documentacion, la arquitectura y la configuracion base del sistema dentro del alcance contratado.

Valores estimados:

| Opcion | Alcance | Valor |
| --- | --- | ---: |
| A | MVP Tecnico Controlado | COP $28.000.000 |
| B | MVP Comercializable | COP $48.000.000 |
| C | MicroSaaS Beta Completa | COP $72.000.000 |

La opcion A permite validar el nucleo tecnico.

La opcion B permite operar una primera version comercializable con usuarios o clientes reales.

La opcion C permite preparar una version mas completa para operar clientes beta con mayor estabilidad, reportes, alertas y soporte operativo.

Esta ruta es posible, pero entiendo que puede representar una inversion inicial alta para Legal Search en este momento.

### Ruta 2: Colaboracion Operativa Sin Sociedad

Por eso propongo una segunda ruta, que considero mas conveniente para iniciar.

La idea es no empezar con una sociedad ni con una compra total del software, sino con una colaboracion operativa durante 90 dias.

En esta ruta:

- Yo desarrollo y mantengo la tecnologia.
- Legal Search usa la plataforma como cliente fundador y operador aliado.
- Legal Search aporta procesos reales, conocimiento operativo y retroalimentacion.
- Legal Search conserva sus clientes y su relacion comercial.
- No se constituye sociedad.
- No se ceden participaciones.
- No se transfiere la propiedad del software.
- No se pacta exclusividad abierta.

Esto permite validar el producto con menor riesgo para ambas partes.

## 3. Piloto Operativo De 90 Dias

Propongo iniciar con un piloto operativo de 90 dias.

Objetivo del piloto:

- Probar la plataforma con procesos reales de Legal Search.
- Medir ahorro operativo.
- Identificar novedades y actuaciones recientes.
- Validar la calidad de la informacion obtenida.
- Entender que parte del proceso puede automatizarse y que parte requiere revision asistida.
- Definir el modelo comercial posterior con datos reales.

Alcance inicial del piloto:

- Carga inicial de procesos.
- Consulta automatica en Rama Judicial / CPNU.
- Visualizacion de ultima actuacion.
- Visualizacion de anotacion.
- Identificacion de procesos con novedad.
- Identificacion de procesos no encontrados o no consultados.
- Bandeja operativa inicial.
- Retroalimentacion semanal.

Valor del piloto:

```text
COP $800.000 / mes
Duracion: 90 dias
Hasta 500 procesos vigilados
```

Proceso adicional durante el piloto:

```text
COP $800 / proceso / mes
```

Este valor corresponde a una condicion preferencial de cliente fundador. No representa el valor comercial completo del desarrollo ni de la plataforma.

## 4. Modelo Posterior Al Piloto

Si el piloto demuestra valor, se propone pasar a un modelo operador para Legal Search.

Plan sugerido:

```text
Plan Operador Legal Search
COP $1.500.000 / mes
Hasta 1.500 procesos vigilados
```

Procesos adicionales:

```text
COP $800 - $1.000 / proceso / mes
```

Este modelo permite que Legal Search escale su operacion sin tener que comprar inicialmente toda la plataforma.

## 5. Clientes Nuevos Y Participacion Comercial

Si Legal Search ayuda a traer clientes nuevos para la plataforma, podemos manejar un esquema comercial separado.

Dos opciones posibles:

### Comision Por Referido

Cuando Legal Search refiere un cliente, pero no opera el servicio:

```text
20% de comision recurrente durante 12 meses
sobre el valor mensual pagado por el cliente referido.
```

### Operacion Compartida

Cuando Legal Search presta el servicio operativo al cliente usando la plataforma:

```text
70% Legal Search
30% Plataforma
sobre ingresos netos generados por ese cliente.
```

Esto permite que Legal Search no quede por fuera del crecimiento del negocio, sin necesidad de constituir una sociedad desde el inicio.

## 6. Propiedad Intelectual Y Clientes

Para evitar confusiones, es importante dejar claro desde el inicio:

- La propiedad intelectual de la plataforma pertenece a Juan Carlos o a la entidad desarrolladora.
- El uso de la plataforma por parte de Legal Search no transfiere propiedad sobre el software.
- El conocimiento operativo, feedback y pruebas con procesos reales no generan participacion societaria automatica.
- Legal Search conserva la propiedad de su marca, clientes, informacion comercial y relaciones de negocio.
- La plataforma no contactara directamente clientes actuales de Legal Search sin autorizacion.

Si mas adelante Legal Search quiere comprar el sistema, negociar una licencia exclusiva o pactar una estructura mas profunda, eso se revisaria en un acuerdo separado y con datos reales del piloto.

## 7. Fuentes Judiciales Y Riesgo Operativo

Las fuentes judiciales publicas pueden cambiar, fallar, limitar consultas, incorporar CAPTCHA o modificar su estructura.

Por eso, la plataforma no debe prometer automatizacion absoluta sobre todas las fuentes.

Debe prometer control operativo:

```text
Cuando una fuente permite consulta automatica, el sistema consulta.
Cuando una fuente impone restricciones, el sistema registra el estado,
conserva la ultima consulta valida
y marca el proceso como pendiente de revision.
```

El valor no esta solamente en consultar, sino en saber:

- Que procesos fueron consultados.
- Que procesos tuvieron novedad.
- Que procesos no cambiaron.
- Que procesos no pudieron consultarse.
- Que fuente presento error.
- Que casos requieren revision.

## 8. Siguiente Paso Propuesto

Si estamos de acuerdo con avanzar por la ruta de colaboracion operativa, el siguiente paso seria:

```text
1. Firmar un acuerdo simple de piloto, confidencialidad y propiedad intelectual.
2. Entregar una muestra inicial de radicados reales.
3. Ejecutar una primera carga y consulta automatica.
4. Revisar resultados juntos.
5. Definir el inicio formal del piloto de 90 dias.
```

Primer hito:

```text
En menos de 7 dias, tener una primera vista operativa con procesos reales,
ultima actuacion, anotacion y estado de consulta.
```

## 9. Cierre

Mi recomendacion es no empezar con una sociedad ni con una compra total del sistema.

Comprar el sistema completo es una ruta posible, pero puede no ser la mas conveniente para Legal Search en este momento.

La ruta mas sana es validar primero una colaboracion operativa durante 90 dias: Legal Search prueba la tecnologia con casos reales, yo sigo desarrollando la plataforma, y juntos medimos si esto genera ahorro, control operativo y nuevos ingresos.

Si el modelo funciona, despues podemos hablar con informacion real sobre compra, licencia, exclusividad limitada o una estructura comercial mas profunda.

La idea es avanzar sin forzar una sociedad prematura y sin sacar a Legal Search del negocio.

```text
No necesitamos decidir hoy si somos socios.
Primero validemos si juntos podemos generar ingresos recurrentes.
```
