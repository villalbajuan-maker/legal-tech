# Propuesta Comercial

## Desarrollo de MicroSaaS de Vigilancia Judicial

### 1. Vision General

Esta propuesta tiene como objetivo desarrollar una plataforma SaaS de vigilancia judicial orientada a abogados, firmas juridicas y equipos legales que necesitan monitorear procesos judiciales de forma organizada, trazable y escalable.

La oportunidad no consiste solamente en construir un sistema que consulte radicados. El objetivo es desarrollar un sistema operativo de vigilancia judicial capaz de:

- Registrar procesos judiciales.
- Consultar fuentes publicas disponibles.
- Detectar novedades y actuaciones recientes.
- Organizar procesos por cliente, cuenta y prioridad.
- Alertar sobre cambios relevantes.
- Registrar evidencia de consulta.
- Controlar errores o restricciones de fuentes externas.
- Escalar hacia un modelo comercial microSaaS.

El producto busca transformar una labor manual, repetitiva y propensa a errores en una infraestructura digital que pueda ser vendida recurrentemente a abogados y firmas.

### 2. Problema Que Resuelve

Actualmente, muchos abogados y firmas vigilan procesos judiciales mediante:

- Consulta manual en Rama Judicial y otras fuentes.
- Hojas de Excel.
- Dependientes judiciales.
- Revisión diaria proceso por proceso.
- Alertas informales por WhatsApp o correo.
- Control operativo basado en memoria, rutina y disciplina personal.

Este modelo funciona en bajo volumen, pero se vuelve costoso, lento y riesgoso cuando el abogado o firma maneja decenas, cientos o miles de procesos.

Los principales dolores son:

- Perdida de tiempo en revision manual.
- Riesgo de no detectar actuaciones.
- Falta de trazabilidad sobre que se consulto y cuando.
- Ausencia de una bandeja central de novedades.
- Dificultad para escalar vigilancia judicial como servicio.
- Dependencia de fuentes publicas fragmentadas y cambiantes.

### 3. Oportunidad De Mercado

La vigilancia judicial tiene un mercado validado: abogados y firmas ya pagan por dependientes, servicios de vigilancia, herramientas de consulta y procesos manuales internos.

La oportunidad es construir una solucion SaaS que combine:

- Automatizacion de consultas.
- Organizacion operativa.
- Trazabilidad.
- Alertas.
- Escalabilidad comercial por cuenta y por proceso vigilado.

El horizonte inicial propuesto es:

```text
50 a 80 cuentas activas
3.000 a 4.000 procesos vigilados
Planes mensuales por volumen de procesos
MRR objetivo inicial: COP $20M - $30M
```

### 4. Producto A Desarrollar

El producto se plantea como una plataforma web multiusuario y multiempresa para vigilancia judicial.

Nombre funcional:

```text
Sistema Operativo de Vigilancia Judicial
```

La plataforma permitira que cada abogado, firma o equipo juridico tenga su propia cuenta, cargue procesos, consulte novedades y gestione alertas.

### 5. Que Recibe El Cliente

El cliente recibe el desarrollo de una plataforma propia, no solamente una consultoria o un prototipo desechable.

Entregables principales:

- Aplicacion web para gestion de procesos judiciales.
- Sistema de cuentas, usuarios y permisos.
- Base de datos estructurada.
- Modulo de carga de radicados.
- Conector inicial con Rama Judicial / CPNU.
- Registro de ultima actuacion.
- Anotacion de la ultima actuacion.
- Historial de consultas.
- Bandeja de novedades.
- Estado de consulta por proceso.
- Identificacion de procesos no encontrados o no consultados.
- Panel operativo.
- Arquitectura preparada para nuevos conectores.
- Documentacion tecnica y funcional.
- Repositorio de codigo.
- Acompanamiento de despliegue inicial.

### 6. Propiedad Del Sistema

El cliente queda como propietario del desarrollo entregado.

Esto incluye:

- Codigo fuente desarrollado.
- Modelo de datos.
- Documentacion funcional.
- Documentacion tecnica.
- Configuracion base del proyecto.
- Logica de negocio desarrollada.
- Conectores creados durante el alcance contratado.
- Estructura de despliegue.
- Activos propios generados para el producto.

Los servicios externos usados por la plataforma, como hosting, dominios, proveedores de correo, WhatsApp, Supabase, herramientas de monitoreo u otros servicios de terceros, se rigen por sus propios terminos, costos y licencias.

### 7. Alcance Funcional MVP

El MVP debe enfocarse en demostrar valor operativo real sin intentar resolver todas las fuentes judiciales desde el primer dia.

Alcance recomendado:

#### Modulo 1: Cuentas Y Usuarios

- Creacion de organizaciones o cuentas.
- Usuarios por cuenta.
- Roles basicos.
- Separacion de informacion por cliente.
- Base preparada para modelo SaaS.

#### Modulo 2: Procesos Judiciales

- Registro manual de procesos.
- Carga masiva de radicados.
- Validacion basica de formato.
- Asociacion de procesos a cliente o responsable.
- Estado del proceso dentro de la plataforma.

#### Modulo 3: Conector Rama Judicial / CPNU

- Consulta automatica por numero de radicado.
- Consulta de detalle del proceso cuando este disponible.
- Consulta de actuaciones.
- Captura de ultima actuacion.
- Captura de anotacion de actuacion.
- Identificacion de despacho y datos principales.

#### Modulo 4: Historial Y Trazabilidad

- Registro de cada intento de consulta.
- Fecha y hora de consulta.
- Fuente consultada.
- Resultado obtenido.
- Errores de fuente.
- Ultima consulta exitosa.
- Estado de disponibilidad.

#### Modulo 5: Bandeja Operativa

- Procesos con novedad.
- Procesos sin cambios.
- Procesos no consultados.
- Procesos no encontrados.
- Filtros por ultimas 24 horas, ultima semana y ultimos 30 dias.
- Vista por cliente, cuenta o responsable.

#### Modulo 6: Alertas Basicas

- Alertas por correo.
- Resumen diario o periodico.
- Notificacion de novedades relevantes.
- Registro de alertas emitidas.

#### Modulo 7: Panel Administrativo

- Total de cuentas.
- Total de procesos vigilados.
- Procesos consultados.
- Errores de fuente.
- Estado de conectores.
- Uso basico por cuenta.

### 8. Alcance No Incluido En MVP

Para proteger tiempos, costos y foco, el MVP no debe incluir inicialmente:

- Automatizacion completa de todas las fuentes judiciales.
- Bypass de CAPTCHA.
- Analisis juridico avanzado.
- Prediccion automatica de terminos.
- Inteligencia artificial juridica generativa.
- App movil nativa.
- Integraciones contables.
- Pasarela de pago completa si no es indispensable en primera etapa.
- Portal avanzado para cliente final.

Estos componentes pueden incorporarse en fases posteriores.

### 9. Arquitectura Tecnica Recomendada

Stack recomendado:

- Frontend web: React / Vite o Next.js.
- Backend y base de datos: Supabase.
- Autenticacion: Supabase Auth.
- Base de datos: PostgreSQL.
- Workers de consulta: Python o Node.js.
- Edge Functions: funciones livianas para endpoints y automatizaciones.
- Storage: Supabase Storage para evidencias o snapshots si aplica.
- Jobs programados: cron jobs o workers externos.
- Monitoreo: logs de consultas y estado de fuentes.

Arquitectura conceptual:

```text
Frontend SaaS
↓
Supabase Auth + PostgreSQL
↓
Motor de procesos
↓
Cola de consultas
↓
Conectores de fuentes judiciales
↓
Snapshots / actuaciones / eventos
↓
Bandeja operativa + alertas
```

### 10. Riesgo De Fuentes Externas

El sistema depende de fuentes publicas que pueden cambiar, limitar consultas, incorporar CAPTCHA, modificar su estructura o presentar indisponibilidad.

Por eso, la plataforma no debe prometer automatizacion absoluta sobre fuentes externas. Debe prometer control operativo y trazabilidad.

Principio de diseno:

```text
Cuando una fuente permite consulta automatica, el sistema consulta.
Cuando una fuente impone restricciones tecnicas, el sistema registra el bloqueo, conserva la ultima consulta valida y marca el proceso como pendiente de revision.
```

Estados sugeridos de fuente:

- Disponible.
- Disponible con latencia.
- Intermitente.
- Requiere validacion manual.
- Bloqueada temporalmente.
- No automatizable.

Esto permite que la plataforma siga operando incluso cuando una fuente externa falle.

### 11. Roadmap De Desarrollo

#### Fase 1: MVP Operativo

Duracion estimada:

```text
8 a 10 semanas
```

Objetivo:

```text
Construir la primera version funcional para cargar procesos, consultar CPNU, detectar ultima actuacion y mostrar novedades en una bandeja operativa.
```

Entregables:

- SaaS multiusuario base.
- Registro de procesos.
- Carga masiva.
- Conector CPNU.
- Historial de consultas.
- Bandeja de novedades.
- Alertas basicas por correo.
- Panel administrativo.

#### Fase 2: Beta Comercial

Duracion estimada:

```text
4 a 6 semanas
```

Objetivo:

```text
Activar los primeros clientes beta pagos y validar uso real con 500 a 1.000 procesos.
```

Entregables:

- Ajustes de onboarding.
- Mejoras de experiencia.
- Reportes iniciales.
- Mediciones de uso.
- Correccion de errores.
- Preparacion de planes comerciales.

#### Fase 3: Escalamiento MicroSaaS

Duracion estimada:

```text
8 a 12 semanas adicionales
```

Objetivo:

```text
Preparar la plataforma para 50 a 80 cuentas y 3.000 a 4.000 procesos vigilados.
```

Entregables:

- Mejoras de performance.
- Priorizacion de consultas.
- Gestion avanzada de errores de fuente.
- Alertas configurables.
- Add-ons.
- Primeras integraciones adicionales.
- Documentacion para soporte y operacion.

### 12. Modelo Comercial Sugerido Para La SaaS

La plataforma puede monetizarse por planes mensuales asociados al numero de procesos vigilados.

Planes sugeridos:

| Plan | Precio sugerido | Procesos incluidos |
| --- | ---: | ---: |
| Starter | COP $149.000 / mes | Hasta 100 |
| Profesional | COP $299.000 / mes | Hasta 250 |
| Firma | COP $599.000 / mes | Hasta 500 |
| Operativo | COP $1.100.000 / mes | Hasta 1.000 |
| Enterprise | Desde COP $1.800.000 / mes | Personalizado |

Add-ons posibles:

- Procesos adicionales.
- Usuarios adicionales.
- WhatsApp premium.
- Reportes mensuales.
- Carga masiva asistida.
- Revision asistida.
- Portal para cliente final.
- Integraciones.

### 13. Estrategia De Activacion Recomendada

La recomendacion es iniciar con una beta paga y asistida.

No lanzar masivamente desde el primer dia.

Secuencia:

```text
1. Conseguir 5 a 10 clientes fundadores.
2. Solicitar radicados reales.
3. Cargar procesos asistidamente.
4. Mostrar resultados en menos de 24 horas.
5. Medir ahorro de tiempo y novedades detectadas.
6. Convertir beta en suscripcion mensual.
```

La activacion ocurre cuando el cliente ve sus propios procesos consultados, organizados y priorizados.

### 14. Inversion Estimada

Se propone una inversion por fases, separando desarrollo, direccion tecnica e ingresos a favor de terceros.

#### Opcion A: MVP Tecnico Controlado

Enfocada en construir el nucleo funcional para validar el producto con pocos clientes beta.

Valor estimado:

```text
COP $28.000.000
```

Incluye:

- Arquitectura base SaaS.
- Base de datos.
- Autenticacion.
- Registro de procesos.
- Carga masiva.
- Conector CPNU.
- Ultima actuacion y anotacion.
- Historial de consultas.
- Bandeja operativa.
- Alertas basicas.
- Documentacion.

#### Opcion B: MVP Comercializable

Enfocada en construir una version lista para beta paga con mejor experiencia, administracion y preparacion comercial.

Valor estimado:

```text
COP $42.000.000
```

Incluye todo lo anterior, mas:

- Panel administrativo.
- Gestion de cuentas.
- Mejoras de onboarding.
- Reportes iniciales.
- Metricas de uso.
- Estado de fuente.
- Preparacion para planes comerciales.
- Mayor acompanamiento de pruebas.

#### Opcion C: MicroSaaS Beta Completa

Enfocada en dejar la plataforma preparada para operar con los primeros 10 a 20 clientes beta pagos.

Valor estimado:

```text
COP $65.000.000
```

Incluye todo lo anterior, mas:

- Alertas configurables.
- Mejoras de performance.
- Gestion avanzada de errores.
- Priorizacion de consultas.
- Reportes mensuales.
- Soporte de activacion beta.
- Documentacion operativa.
- Acompanamiento durante lanzamiento inicial.

### 15. Distribucion Referencial De La Inversion

La inversion se distribuye entre desarrollo, investigacion tecnica, direccion y costos necesarios para operar el proyecto.

| Concepto | Opcion A | Opcion B | Opcion C |
| --- | ---: | ---: | ---: |
| Investigacion tecnica y fuentes | COP $3.500.000 | COP $5.000.000 | COP $7.000.000 |
| Arquitectura y direccion tecnica | COP $5.000.000 | COP $7.500.000 | COP $10.000.000 |
| Desarrollo backend y base de datos | COP $7.000.000 | COP $10.000.000 | COP $15.000.000 |
| Desarrollo frontend SaaS | COP $5.500.000 | COP $8.000.000 | COP $11.000.000 |
| Workers, conectores y automatizacion | COP $4.000.000 | COP $6.000.000 | COP $9.000.000 |
| QA, pruebas y estabilizacion | COP $2.000.000 | COP $3.500.000 | COP $5.500.000 |
| Documentacion y transferencia | COP $1.000.000 | COP $2.000.000 | COP $3.000.000 |
| Ingresos a favor de terceros | Incluido bolsa base | Incluido bolsa base | Incluido bolsa base |
| Total | COP $28.000.000 | COP $42.000.000 | COP $65.000.000 |

### 16. Ingresos A Favor De Terceros

Durante el desarrollo y operacion inicial pueden requerirse costos externos asociados a:

- Hosting.
- Supabase.
- Dominios.
- Correo transaccional.
- Proveedores de WhatsApp.
- Herramientas de monitoreo.
- Servicios de almacenamiento.
- Licencias tecnicas.
- Ambientes de prueba.
- Costos de despliegue.

Estos rubros pueden manejarse como ingresos a favor de terceros o como bolsa operativa mensual, segun se acuerde con el cliente.

Bolsa sugerida:

```text
COP $800.000 - $1.500.000 / mes durante desarrollo y beta
```

Este valor no corresponde exclusivamente a honorarios de desarrollo, sino a costos asociados a infraestructura, herramientas, pruebas, soporte tecnico e investigacion operativa.

### 17. Soporte Y Evolucion

Despues del MVP se recomienda contratar una bolsa mensual de soporte y evolucion.

Opciones sugeridas:

| Plan de soporte | Valor mensual | Alcance |
| --- | ---: | --- |
| Soporte Base | COP $2.500.000 | Correcciones, monitoreo y soporte tecnico limitado |
| Soporte Operativo | COP $4.500.000 | Mejoras menores, soporte beta y ajustes de conectores |
| Evolucion Producto | COP $7.500.000 | Roadmap, nuevas funciones, optimizacion y soporte prioritario |

### 18. Forma De Pago Sugerida

Para desarrollo del MVP:

```text
40% al inicio
30% contra entrega de version funcional
30% contra entrega final y documentacion
```

Para fases posteriores:

```text
Pagos mensuales por sprint o bolsa de desarrollo.
```

### 19. Supuestos

La propuesta se basa en los siguientes supuestos:

- El primer conector automatizado sera CPNU / Rama Judicial.
- El cliente facilitara radicados reales para pruebas.
- Las fuentes externas pueden cambiar durante el desarrollo.
- La automatizacion se hara respetando restricciones tecnicas y legales de las fuentes.
- No se incluye bypass de CAPTCHA.
- El producto se desarrollara de forma incremental.
- La primera version prioriza vigilancia, trazabilidad y novedades.

### 20. Resultado Esperado

Al finalizar el MVP, el cliente tendra una plataforma propia capaz de:

- Crear cuentas y usuarios.
- Cargar procesos judiciales.
- Consultar automaticamente Rama Judicial / CPNU.
- Mostrar ultima actuacion y anotacion.
- Detectar novedades.
- Registrar historial de consultas.
- Alertar sobre cambios.
- Identificar errores o procesos no consultados.
- Operar una beta comercial con clientes reales.

El resultado no es solamente un software inicial. Es la base tecnica y comercial para construir una microSaaS de vigilancia judicial.

### 21. Cierre

La vigilancia judicial es un problema operativo recurrente, costoso y transversal para abogados y firmas.

El desarrollo propuesto busca convertir ese problema en una plataforma SaaS propia, escalable y monetizable.

La oportunidad esta en construir una infraestructura que permita a los abogados dejar de revisar manualmente procesos y empezar a operar con control, trazabilidad y alertas.

Frase de cierre:

```text
No se propone construir un scraper. Se propone construir el sistema operativo de vigilancia judicial sobre el cual puede operar una nueva linea de negocio SaaS.
```
