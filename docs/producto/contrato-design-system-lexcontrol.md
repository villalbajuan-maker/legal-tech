# Contrato De Design System LexControl

Producto: LexControl  
Superficies: `lexcontrol.co`, `app.lexcontrol.co`, `admin.lexcontrol.co`  
Version: v1.0  
Estado: Congelado para implementacion

---

## 1. Decision Rectora

LexControl no debe escalar visualmente por acumulacion de vistas, cards y decisiones locales.

Debe escalar sobre un sistema.

Regla:

```text
No vamos a “poner componentes bonitos”.
Vamos a construir una interfaz operativa de alta confianza.
```

Este contrato formaliza la capa de design system necesaria para que el producto:

- se sienta actual
- se sienta serio
- se sienta silencioso
- se sienta consistente
- y pueda evolucionar sin rediseño caotico permanente

---

## 2. Proposito Del Contrato

Este documento define:

- principios de experiencia
- principios visuales
- sistema de tokens
- libreria base de componentes
- sistema de layout
- sistema de interaccion
- reglas de motion
- reglas de accesibilidad
- roadmap de migracion

Su objetivo es evitar:

1. rediseñar pantalla por pantalla sin lenguaje comun
2. depender de cards como unidad por defecto
3. mezclar marketing y operacion bajo la misma logica visual
4. instalar una libreria esperando que ella resuelva producto
5. generar una UI que luce “moderna” pero no mejora decision ni confianza

---

## 3. Principios Del Sistema

## 3.1 Administracion De Atencion

La interfaz no existe para mostrar mas cosas.

Existe para administrar mejor la atencion del usuario.

Principio:

```text
la interfaz observa mucho
y eleva poco
```

Implicaciones:

- lo estable no compite con lo urgente
- lo tecnico no invade la vista operativa principal
- la informacion secundaria aparece por profundidad, no por defecto

---

## 3.2 Claridad Jerarquica

Cada vista debe dejar claro:

- que estoy viendo
- que requiere atencion
- que puedo hacer ahora
- que puedo ignorar por el momento

No se debe depender de:

- decoracion
- colores sin jerarquia semantica
- cajas repetidas sin peso distinto

---

## 3.3 Densidad Profesional

La app debe sentirse profesional, no pesada.

Eso exige:

- informacion compacta pero legible
- aire suficiente entre grupos
- buen uso de alineacion
- tipografia estable
- controles sobrios

No se busca una UI juguetona ni espectacular.

Se busca una UI:

```text
precisa
serena
creible
```

---

## 3.4 Consistencia Multi-Superficie

Las tres superficies deben compartir ADN, no forma identica.

- `lexcontrol.co` convence
- `app.lexcontrol.co` opera
- `admin.lexcontrol.co` controla

Deben compartir:

- tokens
- lenguaje visual
- semantica de estados
- voz de producto

Pero no deben tener la misma densidad ni la misma estructura.

---

## 3.5 Branding Adaptable

Dentro de `app.lexcontrol.co`, el branding principal puede pertenecer al bufete o firma.

LexControl queda como:

```text
Powered by LexControl
```

En `lexcontrol.co` y `admin.lexcontrol.co`, LexControl conserva protagonismo de marca.

---

## 4. Nivel De Referencia

Cuando hablamos de un nivel “tipo Apple” o “de vanguardia”, no estamos diciendo:

- copiar Apple
- copiar Linear
- copiar un template SaaS

Estamos diciendo:

- jerarquia impecable
- control de complejidad
- motion sobrio
- accesibilidad seria
- estados confiables
- comportamiento consistente
- minima carga cognitiva

Referencias de criterio:

- Apple Human Interface Guidelines
- Apple Accessibility
- Apple Layout
- Material Design 3

Estas referencias se usan como criterio, no como copia literal.

---

## 5. Stack Recomendado

La capa tecnica objetivo del design system en LexControl sera:

- `Tailwind CSS`
- `shadcn/ui`
- `Radix Primitives` o `Base UI`
- `Motion` para transiciones seleccionadas
- libreria interna de componentes `ui/`

Decision congelada:

```text
shadcn/ui no se adopta como “kit de pantalla”.
Se adopta como base open-code para construir nuestro propio sistema.
```

No se permitira:

- importar componentes de muchos estilos distintos
- mezclar librerias inconexas
- dejar componentes sin wrapper de sistema

---

## 6. Sistema De Tokens

El design system de LexControl debe fundarse primero en tokens, no en pantallas.

## 6.1 Color

Familias necesarias:

- `brand`
- `surface`
- `text`
- `border`
- `info`
- `success`
- `warning`
- `error`
- `review`
- `focus`

Se deben separar claramente:

- colores de marca
- colores de estado
- colores de soporte

Regla:

```text
el color nunca debe ser la unica senal
```

---

## 6.2 Tipografia

Se define una escala estable:

- `display`
- `title`
- `section`
- `body`
- `small`
- `micro`

La tipografia debe comunicar:

- decision
- datos
- estado
- contexto

No se debe usar tipografia teatral ni ornamental.

---

## 6.3 Espaciado

Debe existir una escala fija y reusable para:

- paddings
- gaps
- bloques
- separaciones entre regiones

Regla:

```text
la respiracion visual debe venir del sistema
no del ajuste manual pantalla por pantalla
```

---

## 6.4 Radios, Sombras y Bordes

Decision inicial:

- radios discretos
- sombras bajas y funcionales
- bordes claros y sistematicos

No se busca una UI blanda ni inflada.

El borde y la elevacion deben ayudar a:

- agrupar
- separar
- jerarquizar

No a decorar.

---

## 7. Componentes Base

La primera biblioteca interna del sistema debe incluir:

- `Button`
- `IconButton`
- `Input`
- `Textarea`
- `Select`
- `Checkbox`
- `Switch`
- `Badge`
- `Tabs`
- `Dialog`
- `Sheet`
- `Popover`
- `Tooltip`
- `DropdownMenu`
- `Command`
- `Table`
- `DataList`
- `Sidebar`
- `PageHeader`
- `Toolbar`
- `FilterBar`
- `StatBlock`
- `EmptyState`
- `LoadingState`
- `ErrorState`
- `Toast`

Regla:

```text
un componente base no es un adorno.
es una decision repetible de producto.
```

---

## 8. Componentes De Dominio

Sobre la capa base, LexControl debe construir componentes propios de negocio:

- `OperationalStatusBadge`
- `PriorityBadge`
- `AttentionBadge`
- `SourceStatusBadge`
- `OperationalSummaryStrip`
- `ProcessRow`
- `ProcessDetailPanel`
- `EventTimeline`
- `AlertList`
- `SnapshotHistory`
- `RuleFamilyCard`
- `AccountCapacityBar`
- `CoverageIndicator`
- `FreshnessIndicator`
- `LexPanel`

Estos componentes no deben nacer como bloques sueltos por vista.

Deben ser parte del sistema.

---

## 9. Layout System

## 9.1 Shell

La app operativa debe usar un shell consistente:

- sidebar persistente
- header persistente
- main region
- paneles de detalle
- overlays

## 9.2 Regiones

El sistema de layout debe distinguir:

- `global shell`
- `page header`
- `toolbar`
- `content section`
- `inspector / detail panel`
- `overlay`

## 9.3 Reglas

- no usar cards como unidad universal
- no meter cards dentro de cards
- no convertir toda la pagina en una grilla de cajas
- usar full-width bands o regiones limpias cuando corresponda
- reservar contenedores fuertes para herramientas, detalle o inspeccion

---

## 10. Interaccion

La interaccion debe sentirse:

- directa
- ligera
- predecible

### Reglas:

- feedback inmediato en hover, focus y press
- estados de carga visibles pero sobrios
- mensajes de exito breves
- errores explicativos y no dramatizados
- acciones primarias claramente distinguibles
- acciones secundarias no deben competir visualmente

El sistema debe favorecer:

```text
menos friccion
menos ruido
menos sorpresa
```

---

## 11. Motion

Motion no se usa para lucir moderno.

Se usa para:

- orientar
- confirmar
- suavizar transiciones
- preservar continuidad espacial

### Reglas:

- transiciones cortas
- easing sobrio
- no animar todo
- overlays y paneles con entrada clara
- tablas y listas sin motion ruidoso

Motion permitido:

- drawer / sheet
- modal
- detail panel
- sidebar collapse
- toast
- micro-feedback de botones

Motion no permitido:

- decoracion gratuita
- parallax innecesario en producto
- bounce excesivo
- delays teatrales

---

## 12. Accesibilidad

La accesibilidad es parte del sistema, no QA tardio.

Minimos obligatorios:

- foco visible
- orden de tab correcto
- contraste suficiente
- labels reales
- roles y aria cuando aplique
- navegacion por teclado
- estados no dependientes solo de color
- targets comodos
- mensajes de error comprensibles

Principio:

```text
si una interfaz no es accesible,
no es profesional
```

---

## 13. Superficies

## 13.1 Landing

`lexcontrol.co` debe usar el sistema para:

- hero
- secciones
- pricing
- FAQ
- modal de activacion

Pero sin heredar densidad de consola.

## 13.2 App Operativa

`app.lexcontrol.co` es la superficie mas densa y mas importante del sistema.

Debe ser el primer objetivo de migracion.

## 13.3 Admin

`admin.lexcontrol.co` debe usar la misma base:

- shell
- tablas
- estados
- filtros
- inspeccion

Pero con otra jerarquia funcional.

---

## 14. Roadmap De Migracion

## Fase 1. Fundacion

- definir tokens
- montar Tailwind
- introducir base `shadcn/ui`
- definir estructura `components/ui`
- definir utilidades y convenciones

## Fase 2. Shell

- migrar sidebar
- migrar header
- migrar layout regions
- migrar toolbar y page header

## Fase 3. Base UI

- buttons
- inputs
- selects
- badges
- dialogs
- sheets
- tables
- tabs

## Fase 4. Dominio Operativo

- badges operativos
- summary strip
- process row
- process detail panel
- alert list
- snapshot history
- Lex panel

## Fase 5. Superficies

Orden recomendado:

1. `app.lexcontrol.co`
2. `admin.lexcontrol.co`
3. `lexcontrol.co`

## Fase 6. QA De Experiencia

- responsive
- keyboard
- accessibility
- loading states
- empty states
- visual consistency
- density audit

---

## 15. Criterio De Listo

El design system no se considera listo cuando:

- hay componentes nuevos
- hay un tema bonito
- hay una libreria instalada

Se considera listo cuando:

1. las superficies comparten lenguaje real
2. cada vista se siente parte del mismo producto
3. la operacion gana claridad y no complejidad
4. el sistema reduce decisiones visuales improvisadas
5. migrar una pantalla nueva deja de ser rediseñarla desde cero

---

## 16. Regla Final

```text
LexControl no debe parecer un software remendado.
Debe sentirse como un instrumento preciso, actual y confiable.
```

Ese es el objetivo del sistema.

