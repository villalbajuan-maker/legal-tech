# Propuesta De Desarrollo Y Colaboracion Operativa

## Sistema Operativo De Vigilancia Judicial Para Legal Search

### 1. Contexto

Legal Search ya tiene un servicio validado de vigilancia judicial. Cuenta con clientes, procesos activos, conocimiento operativo y una metodologia manual que actualmente funciona.

El reto no es demostrar si existe mercado. El mercado ya existe.

El reto es transformar una operacion manual, intensiva en tiempo y dependiente del operador en una infraestructura tecnologica capaz de:

- Vigilar mas procesos.
- Reducir riesgo operativo.
- Detectar novedades de forma mas rapida.
- Organizar actuaciones y alertas.
- Dejar trazabilidad de consultas.
- Escalar clientes sin multiplicar carga manual.

La oportunidad consiste en convertir Legal Search en el primer operador de un sistema operativo de vigilancia judicial.

### 2. Objetivo De La Propuesta

Esta propuesta plantea dos rutas posibles para avanzar:

```text
Ruta 1: Compra / desarrollo exclusivo del sistema para Legal Search.
Ruta 2: Colaboracion operativa sin sociedad.
```

La primera ruta permite que Legal Search adquiera el desarrollo y sea propietario del sistema.

La segunda ruta permite que Legal Search use la tecnologia como cliente fundador y operador aliado, sin tener que asumir la inversion completa inicial y sin necesidad de constituir una sociedad.

### 3. Vision Del Sistema

El objetivo no es construir solamente un scraper o una herramienta de consulta.

El objetivo es desarrollar un sistema operativo de vigilancia judicial:

```text
Procesos
↓
Fuentes judiciales
↓
Consultas
↓
Actuaciones
↓
Novedades
↓
Alertas
↓
Evidencia
↓
Cliente / abogado / operador
```

El sistema debe permitir que Legal Search pase de revisar manualmente proceso por proceso a operar con una bandeja centralizada de control.

### 4. Que Resolveria Para Legal Search

El sistema buscaria resolver los siguientes puntos:

- Consolidar procesos en una base central.
- Consultar automaticamente fuentes disponibles.
- Detectar ultima actuacion.
- Mostrar anotacion de la actuacion.
- Identificar procesos con novedades recientes.
- Marcar procesos no consultados o no encontrados.
- Registrar trazabilidad de cada consulta.
- Generar alertas basicas.
- Priorizar procesos criticos.
- Reducir dependencia de Excel y revision manual.

### 5. Ruta 1: Compra Y Desarrollo Exclusivo

Esta ruta aplica si Legal Search quiere contratar el desarrollo completo y quedar como propietario del sistema desarrollado para su operacion.

En esta opcion:

- Legal Search contrata el desarrollo.
- Legal Search realiza la inversion completa.
- Legal Search queda como propietario del codigo desarrollado dentro del alcance contratado.
- Se entrega repositorio, documentacion y configuracion base.
- La plataforma se construye prioritariamente para la operacion de Legal Search.

#### Opciones De Desarrollo

| Opcion | Alcance | Valor |
| --- | --- | ---: |
| A | MVP Tecnico Controlado | COP $28.000.000 |
| B | MVP Comercializable | COP $48.000.000 |
| C | MicroSaaS Beta Completa | COP $72.000.000 |

#### Opcion A: MVP Tecnico Controlado

Pensado para validar el nucleo tecnico.

Incluye:

- Arquitectura base.
- Registro de procesos.
- Carga de radicados.
- Conector inicial CPNU / Rama Judicial.
- Ultima actuacion.
- Anotacion de actuacion.
- Historial basico de consultas.
- Bandeja inicial de novedades.

#### Opcion B: MVP Comercializable

Pensado para operar una primera beta con usuarios o clientes reales.

Incluye lo anterior, mas:

- Usuarios y cuentas.
- Panel operativo.
- Gestion de errores de fuente.
- Alertas basicas.
- Mejoras de experiencia.
- Metricas iniciales.
- Documentacion funcional.

#### Opcion C: MicroSaaS Beta Completa

Pensado para operar los primeros clientes beta con mayor estabilidad.

Incluye lo anterior, mas:

- Priorizacion de procesos.
- Alertas configurables.
- Reportes iniciales.
- Mejoras de performance.
- Panel administrativo.
- Preparacion para planes comerciales.
- Acompanamiento de activacion beta.

### 6. Ruta 2: Colaboracion Operativa Sin Sociedad

Esta es la ruta recomendada para iniciar.

La compra del sistema completo es posible, pero puede no ser la opcion mas conveniente para Legal Search en este momento si implica una inversion inicial alta.

Por eso se propone una alternativa intermedia:

```text
Validar el producto como aliados operativos durante 90 dias,
sin sociedad,
sin cesion de propiedad,
sin exclusividad abierta
y sin exigir una inversion inicial alta.
```

En esta ruta:

- Juan Carlos desarrolla y conserva la propiedad tecnologica de la plataforma.
- Legal Search entra como cliente fundador y operador aliado.
- Legal Search aporta conocimiento operativo, procesos reales y feedback.
- Legal Search obtiene acceso preferencial a la plataforma.
- Legal Search conserva sus clientes y su relacion comercial.
- Los clientes nuevos que Legal Search ayude a traer pueden generar comision o revenue share.
- No se constituye sociedad.
- No se transfieren participaciones.

### 7. Piloto Operativo De 90 Dias

Se propone iniciar con un piloto operativo de 90 dias.

Objetivo:

```text
Validar la plataforma con procesos reales de Legal Search,
medir ahorro operativo,
identificar novedades,
probar trazabilidad
y definir el modelo comercial futuro con datos reales.
```

Alcance del piloto:

- Carga inicial de procesos.
- Consulta automatica en CPNU / Rama Judicial.
- Visualizacion de ultima actuacion.
- Visualizacion de anotacion.
- Clasificacion de procesos con novedad.
- Identificacion de procesos no encontrados o no consultados.
- Bandeja operativa inicial.
- Retroalimentacion semanal.

Valor sugerido del piloto:

```text
COP $800.000 / mes
Duracion: 90 dias
Hasta 500 procesos vigilados
```

Proceso adicional durante piloto:

```text
COP $800 / proceso / mes
```

Este valor es una tarifa preferencial de cliente fundador. No representa el valor comercial completo del desarrollo.

### 8. Modelo Posterior Al Piloto

Despues de los 90 dias, si el piloto demuestra valor, se propone pasar a un modelo operador Legal Search.

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

Este modelo permite que Legal Search escale su operacion sin comprar la plataforma completa.

### 9. Revenue Share Y Clientes Nuevos

Si Legal Search ayuda a traer clientes nuevos para la plataforma, se pueden manejar dos modelos:

#### Modelo A: Comision Por Referido

Aplica cuando Legal Search refiere un cliente, pero no opera el servicio.

```text
20% de comision recurrente durante 12 meses
sobre el valor mensual pagado por el cliente referido.
```

#### Modelo B: Operacion Compartida

Aplica cuando Legal Search presta el servicio operativo al cliente usando la plataforma.

```text
70% Legal Search
30% Plataforma
sobre ingresos netos generados por ese cliente.
```

Este modelo permite que Legal Search no quede por fuera del negocio, sin necesidad de convertirse en socio societario.

### 10. Propiedad Intelectual

Para evitar confusiones desde el inicio:

- La propiedad intelectual de la plataforma pertenece a Juan Carlos o a la entidad desarrolladora.
- El uso de la plataforma por parte de Legal Search no transfiere propiedad sobre el software.
- El feedback, conocimiento operativo y pruebas con procesos reales no generan participacion societaria automatica.
- Legal Search conserva la propiedad de su marca, clientes, informacion comercial y relaciones de negocio.
- La plataforma no podra contactar directamente clientes actuales de Legal Search sin autorizacion.

Si Legal Search decide mas adelante comprar el sistema o negociar exclusividad, eso debera pactarse en un acuerdo separado.

### 11. Exclusividad

No se recomienda pactar exclusividad abierta al inicio.

Si Legal Search requiere algun tipo de exclusividad, esta debe ser:

- Limitada por sector.
- Limitada por tiempo.
- Condicionada a metas comerciales.

Ejemplo:

```text
Exclusividad en sector asegurador durante 6 meses,
condicionada a generar minimo COP $5.000.000 mensuales
en ingresos recurrentes asociados a la plataforma.
```

Si la meta no se cumple, la exclusividad termina automaticamente.

### 12. Riesgo De Fuentes Externas

Las fuentes judiciales publicas pueden cambiar, fallar, limitar consultas, incorporar CAPTCHA o modificar su estructura.

Por eso, la plataforma no debe prometer automatizacion absoluta.

Debe prometer control operativo:

```text
Cuando una fuente permite consulta automatica, el sistema consulta.
Cuando una fuente impone restricciones, el sistema registra el estado,
conserva la ultima consulta valida
y marca el proceso como pendiente de revision.
```

Esto permite que Legal Search sepa:

- Que procesos fueron consultados.
- Que procesos tuvieron novedad.
- Que procesos no cambiaron.
- Que procesos no pudieron consultarse.
- Que fuente presento error.

### 13. Responsabilidades De Cada Parte

#### Juan Carlos / Plataforma

- Desarrollar la plataforma.
- Mantener la arquitectura tecnica.
- Implementar conectores acordados.
- Registrar logs de consulta.
- Mejorar el sistema con base en resultados del piloto.
- Dar soporte tecnico durante el piloto.

#### Legal Search

- Entregar radicados reales para pruebas.
- Documentar logica operativa actual.
- Validar resultados.
- Reportar errores o inconsistencias.
- Usar la plataforma durante el piloto.
- Aportar feedback operativo.
- Gestionar su relacion con sus clientes actuales.

### 14. Reglas Minimas Del Acuerdo

Antes de iniciar el piloto se recomienda firmar un acuerdo simple que incluya:

- Confidencialidad.
- Tratamiento de informacion.
- Propiedad intelectual.
- Duracion del piloto.
- Valor mensual del piloto.
- Alcance inicial.
- No contacto directo a clientes de Legal Search sin autorizacion.
- No exclusividad abierta.
- Condiciones para clientes nuevos referidos.
- Reglas para renegociacion posterior.

### 15. Recomendacion

La recomendacion es no iniciar con sociedad ni con compra completa del sistema.

La ruta mas sana es:

```text
1. Piloto operativo de 90 dias.
2. Validacion con procesos reales.
3. Medicion de ahorro operativo.
4. Identificacion de clientes potenciales.
5. Definicion de modelo posterior con datos reales.
```

Esto permite avanzar sin exigir una inversion inicial alta, sin sacar a Legal Search del negocio y sin forzar una sociedad prematura.

### 16. Frase De Conversacion

Una forma simple de explicarlo seria:

```text
Fabio, comprar el sistema completo es una ruta posible, pero no necesariamente la mas conveniente para Legal Search en este momento.

Mi recomendacion es que no empecemos como socios ni con una compra total del software. Probemos primero una colaboracion operativa durante 90 dias: yo desarrollo y mantengo la tecnologia, Legal Search la usa como cliente fundador y operador aliado, y validamos juntos si esto genera ahorro, control y nuevos ingresos.

Si el modelo funciona, despues podemos hablar con datos reales sobre compra, licencia, exclusividad limitada o una estructura comercial mas profunda.
```

### 17. Cierre

Esta propuesta busca crear un punto medio entre dos extremos:

- Comprar el sistema completo desde el inicio.
- Convertirse en socios sin conocerse lo suficiente.

La colaboracion operativa permite avanzar con menor riesgo para ambas partes.

Legal Search queda dentro del negocio, conserva su posicion comercial y accede a tecnologia preferencial.

Juan Carlos conserva la propiedad tecnologica y puede seguir desarrollando la plataforma como producto escalable.

La tesis es:

```text
No necesitamos decidir hoy si somos socios.
Primero validemos si juntos podemos generar ingresos recurrentes.
```

### 18. Siguiente Paso Propuesto

Si Legal Search esta de acuerdo con la ruta de colaboracion operativa, el siguiente paso seria:

```text
1. Firmar un acuerdo simple de piloto, confidencialidad y propiedad intelectual.
2. Entregar una muestra inicial de radicados reales.
3. Ejecutar una primera carga y consulta automatica.
4. Revisar resultados con Fabio.
5. Definir el inicio formal del piloto de 90 dias.
```

Primer hito:

```text
En menos de 7 dias, tener una primera vista operativa con procesos reales,
ultima actuacion, anotacion y estado de consulta.
```
