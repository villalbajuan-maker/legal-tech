# LexControl Design System

## Sistema Operativo De Vigilancia Judicial

LexControl is not a generic legal SaaS, CRM, or marketing dashboard. It is an operational control system for judicial monitoring.

The interface must help users understand:

- What changed.
- What did not change.
- What failed.
- What requires attention.

The product should feel closer to a control center than a dashboard.

> Note: the exact logo file is not currently available in this repository context. The system below uses a deep blue brand base designed to match the described logo direction. Once the logo asset is available, the primary blue should be sampled and calibrated if needed.

---

## 1. Design Principles

### 1.1 Control Over Decoration

Every visual decision must help the user make an operational decision.

Avoid:

- Decorative gradients.
- Large ornamental illustrations.
- Marketing-style hero patterns.
- Excessive rounded cards.
- Visual noise.

Prefer:

- Clear hierarchy.
- Structured density.
- State-driven color.
- Precise typography.
- Stable layouts.
- Calm contrast.

### 1.2 State Is The Interface

Colors are not decorative. They communicate system state.

Primary state meanings:

- Green: OK / no change / successful query.
- Yellow: attention / review needed / delayed.
- Red: error / not consulted / source failed.
- Blue: system / information / brand control layer.
- Gray: neutral / inactive / archived / pending context.

### 1.3 Operational Clarity

The user should be able to answer these questions in seconds:

- Which processes moved today?
- Which processes did not change?
- Which processes failed consultation?
- Which source is unstable?
- Which responsible user needs to act?

---

## 2. Design Tokens

### 2.1 CSS Variables

```css
:root {
  /* Brand */
  --color-brand: #0b2d5c;
  --color-brand-hover: #123b74;
  --color-brand-active: #082348;
  --color-brand-soft: #eaf1fb;
  --color-brand-border: #b8c9e3;

  /* Information */
  --color-info: #1f5fbf;
  --color-info-hover: #174f9f;
  --color-info-soft: #eaf2ff;
  --color-info-border: #b7d2ff;

  /* Success / OK */
  --color-success: #168a4a;
  --color-success-hover: #0f713b;
  --color-success-soft: #e8f7ef;
  --color-success-border: #a9dfbf;
  --color-success-text: #0f5f33;

  /* Warning / Attention */
  --color-warning: #b77900;
  --color-warning-hover: #965f00;
  --color-warning-soft: #fff5d6;
  --color-warning-border: #f2d27a;
  --color-warning-text: #7a4f00;

  /* Error / Failure */
  --color-error: #c43b3b;
  --color-error-hover: #a72f2f;
  --color-error-soft: #fdecec;
  --color-error-border: #f2b8b8;
  --color-error-text: #8f2424;

  /* Neutrals */
  --color-text: #1f2933;
  --color-text-muted: #5f6b7a;
  --color-text-subtle: #7b8794;
  --color-border: #d8dee8;
  --color-border-strong: #b7c1d1;
  --color-background: #f7f9fc;
  --color-surface: #ffffff;
  --color-surface-subtle: #f2f5f9;
  --color-surface-raised: #ffffff;
  --color-disabled: #e6ebf2;
  --color-disabled-text: #9aa6b2;

  /* Layout */
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 16px;

  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-6: 24px;
  --space-8: 32px;
  --space-12: 48px;
  --space-16: 64px;

  /* Shadows */
  --shadow-xs: 0 1px 2px rgb(15 23 42 / 0.06);
  --shadow-sm: 0 4px 12px rgb(15 23 42 / 0.08);
  --shadow-md: 0 12px 32px rgb(15 23 42 / 0.12);

  /* Typography */
  --font-sans: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  --font-data: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}
```

---

## 3. Color Palette

### 3.1 Brand

| Token | HEX | Use |
| --- | --- | --- |
| `--color-brand` | `#0B2D5C` | Primary actions, active navigation, brand areas |
| `--color-brand-hover` | `#123B74` | Primary hover |
| `--color-brand-active` | `#082348` | Primary active / pressed |
| `--color-brand-soft` | `#EAF1FB` | Subtle selected backgrounds |
| `--color-brand-border` | `#B8C9E3` | Brand-tinted borders |

### 3.2 Operational States

| State | Token | HEX | Meaning |
| --- | --- | --- | --- |
| Success | `--color-success` | `#168A4A` | Query OK, no change, stable |
| Warning | `--color-warning` | `#B77900` | Attention, delayed, review needed |
| Error | `--color-error` | `#C43B3B` | Failed, not consulted, source error |
| Info | `--color-info` | `#1F5FBF` | System information, neutral updates |
| Neutral | `--color-text-muted` | `#5F6B7A` | Archived, inactive, general state |

### 3.3 State Backgrounds

| State | Background | Border | Text |
| --- | --- | --- | --- |
| Success | `#E8F7EF` | `#A9DFBF` | `#0F5F33` |
| Warning | `#FFF5D6` | `#F2D27A` | `#7A4F00` |
| Error | `#FDECEC` | `#F2B8B8` | `#8F2424` |
| Info | `#EAF2FF` | `#B7D2FF` | `#174F9F` |
| Neutral | `#F2F5F9` | `#D8DEE8` | `#5F6B7A` |

### 3.4 Neutrals

| Token | HEX | Use |
| --- | --- | --- |
| `--color-text` | `#1F2933` | Primary text |
| `--color-text-muted` | `#5F6B7A` | Secondary text |
| `--color-text-subtle` | `#7B8794` | Metadata |
| `--color-border` | `#D8DEE8` | Standard border |
| `--color-border-strong` | `#B7C1D1` | Strong separators |
| `--color-background` | `#F7F9FC` | App background |
| `--color-surface` | `#FFFFFF` | Panels, cards, table surface |
| `--color-surface-subtle` | `#F2F5F9` | Secondary surfaces |

---

## 4. Typography

Font family:

```text
Inter, ui-sans-serif, system-ui
```

The typography must feel precise, readable, operational, and not editorial.

| Style | Size | Line Height | Weight | Use |
| --- | ---: | ---: | ---: | --- |
| H1 | 28px | 36px | 700 | Page title / operational area |
| H2 | 22px | 30px | 650 | Main section title |
| H3 | 18px | 26px | 650 | Panel title |
| Body | 14px | 22px | 400 | Standard UI text |
| Body strong | 14px | 22px | 600 | Important UI text |
| Small | 12px | 18px | 500 | Metadata, helper text |
| Data | 13px | 20px | 500 | Tables, case rows, compact data |
| Label | 12px | 16px | 650 | Form labels, badges, column labels |

Rules:

- Do not use decorative display fonts.
- Do not use negative letter spacing.
- Do not scale font size with viewport width.
- Keep table text compact but readable.
- Use weight for hierarchy before using color.

---

## 5. Spacing

Spacing scale:

| Token | Value | Use |
| --- | ---: | --- |
| `--space-1` | 4px | Micro gaps, icon/text spacing |
| `--space-2` | 8px | Compact gaps, badge padding |
| `--space-3` | 12px | Form field gaps, small panels |
| `--space-4` | 16px | Standard padding |
| `--space-6` | 24px | Panel padding, section gaps |
| `--space-8` | 32px | Major layout gap |
| `--space-12` | 48px | Page sections |
| `--space-16` | 64px | Large layout separation |

Usage:

- Table cell padding: `12px 16px`.
- Button padding: `8px 14px`.
- Panel padding: `16px` or `24px`.
- Main layout gutter: `24px`.
- Sidebar item gap: `8px`.

---

## 6. Radius

| Token | Value | Use |
| --- | ---: | --- |
| `--radius-sm` | 6px | Badges, inputs, small buttons |
| `--radius-md` | 10px | Buttons, filters, table wrappers |
| `--radius-lg` | 16px | Panels, companion drawer, modals |

Rules:

- Avoid pill-shaped UI except for compact status badges.
- Do not exceed 16px for app surfaces.
- Keep operational UI structured and controlled.

---

## 7. Shadows

Shadows must be minimal.

| Token | Value | Use |
| --- | --- | --- |
| `--shadow-xs` | `0 1px 2px rgb(15 23 42 / 0.06)` | Table header stickiness, tiny elevation |
| `--shadow-sm` | `0 4px 12px rgb(15 23 42 / 0.08)` | Floating panel |
| `--shadow-md` | `0 12px 32px rgb(15 23 42 / 0.12)` | Modal, companion overlay |

Rules:

- Do not use heavy shadows.
- Prefer borders over elevation.
- Use shadow only when an element floats above the layout.

---

## 8. Components

### 8.1 Button

Base:

- Height: 36px.
- Padding: `8px 14px`.
- Radius: `10px`.
- Font: 14px / 600.
- Icon gap: 8px.

#### Primary Button

Use for main actions:

- Run query.
- Upload radicados.
- Save configuration.

States:

| State | Background | Text | Border |
| --- | --- | --- | --- |
| Default | `--color-brand` | `#FFFFFF` | `--color-brand` |
| Hover | `--color-brand-hover` | `#FFFFFF` | `--color-brand-hover` |
| Active | `--color-brand-active` | `#FFFFFF` | `--color-brand-active` |
| Disabled | `--color-disabled` | `--color-disabled-text` | `--color-disabled` |

#### Secondary Button

Use for alternative actions:

- Export.
- View details.
- Configure filters.

States:

| State | Background | Text | Border |
| --- | --- | --- | --- |
| Default | `#FFFFFF` | `--color-text` | `--color-border` |
| Hover | `--color-surface-subtle` | `--color-text` | `--color-border-strong` |
| Active | `#E9EEF6` | `--color-text` | `--color-border-strong` |
| Disabled | `#FFFFFF` | `--color-disabled-text` | `--color-border` |

#### Ghost Button

Use for low-emphasis actions:

- Open companion.
- Clear filters.
- Collapse panel.

States:

| State | Background | Text |
| --- | --- | --- |
| Default | `transparent` | `--color-text-muted` |
| Hover | `--color-surface-subtle` | `--color-text` |
| Active | `#E9EEF6` | `--color-text` |
| Disabled | `transparent` | `--color-disabled-text` |

---

### 8.2 Status Badge

Badges are critical. They represent operational state.

Base:

- Height: 24px.
- Radius: 999px allowed only for badges.
- Padding: `3px 8px`.
- Font: 12px / 650.
- Icon: optional, 12px.

| Variant | Label Example | Background | Text | Border |
| --- | --- | --- | --- | --- |
| Success | `Sin cambios` | `--color-success-soft` | `--color-success-text` | `--color-success-border` |
| Warning | `Requiere revisión` | `--color-warning-soft` | `--color-warning-text` | `--color-warning-border` |
| Error | `No consultado` | `--color-error-soft` | `--color-error-text` | `--color-error-border` |
| Info | `Nuevo movimiento` | `--color-info-soft` | `--color-info` | `--color-info-border` |
| Neutral | `Archivado` | `--color-surface-subtle` | `--color-text-muted` | `--color-border` |

Rules:

- Never use badge color for decoration.
- Every badge must map to a state or event.
- Badge copy must be short.

---

### 8.3 Operational Table

The table is the core control surface.

Purpose:

Monitor processes and surface decisions.

Required columns:

- Radicado.
- Estado.
- Ultima actuacion.
- Fecha.
- Responsable.

Recommended columns:

- Cliente.
- Despacho.
- Prioridad.
- Ultima consulta.

Table anatomy:

- Sticky header.
- Compact rows.
- Clear row hover.
- State badges in first visual scan area.
- Right panel opens on row click.

Dimensions:

- Header height: 40px.
- Row height: 52px minimum.
- Cell padding: `12px 16px`.
- Data font: 13px / 500.

Row states:

| State | Left Accent | Background | Meaning |
| --- | --- | --- | --- |
| Success | `--color-success` | `#FFFFFF` | Consulted, no change |
| Info | `--color-info` | `#FFFFFF` | New movement |
| Warning | `--color-warning` | `#FFFCF0` | Requires review |
| Error | `--color-error` | `#FFF7F7` | Failed / not consulted |
| Neutral | `--color-border-strong` | `#FFFFFF` | Inactive / archived |

Rules:

- Use a subtle 3px left border for row state.
- Do not tint entire rows heavily.
- Keep row actions hidden until hover or detail view.
- Prioritize status, date, and responsible user.

---

### 8.4 Card / Panel

Use panels to group operational data, not to decorate.

Base:

- Background: `--color-surface`.
- Border: `1px solid --color-border`.
- Radius: `16px`.
- Padding: `16px` or `24px`.
- Shadow: none by default.

Panel types:

- Summary panel.
- Source health panel.
- Case detail panel.
- Companion panel.
- Alert panel.

Rules:

- Do not put cards inside cards.
- Prefer full-width sections with inner panels.
- Use panels for grouped decisions.

---

### 8.5 Alert / Notification

Alerts must communicate operational state.

Types:

- Inline alert.
- System alert.
- Source alert.
- Query alert.

Base:

- Radius: `10px`.
- Padding: `12px 16px`.
- Border: 1px solid state border.
- Icon: required for warning/error.

Examples:

| Variant | Copy |
| --- | --- |
| Success | `Consulta completada sin novedades` |
| Info | `Nuevo movimiento detectado` |
| Warning | `La fuente respondió con demora` |
| Error | `No se pudo consultar la fuente` |

Rules:

- Alerts must explain what happened.
- Error alerts should say what the system did next.
- Avoid long paragraphs.

---

### 8.6 Filters

Filters are operational controls.

Types:

- Dropdown filters.
- Quick filters.
- Date filters.
- Responsible filter.
- Priority filter.
- Source status filter.

Base:

- Height: 36px.
- Radius: `10px`.
- Border: `--color-border`.
- Background: `--color-surface`.
- Font: 14px / 500.

Quick filters:

- `Últimas 24 horas`.
- `Última semana`.
- `Últimos 30 días`.
- `Con novedad`.
- `No consultados`.
- `Alta prioridad`.

Rules:

- Quick filters should be visible above the operational table.
- Active filters use `--color-brand-soft` background and `--color-brand` text.
- Avoid hiding core operational filters inside menus.

---

### 8.7 Tabs

Tabs switch operational views.

Recommended tabs:

- `Todos`.
- `Con novedad`.
- `Sin cambios`.
- `No consultados`.
- `Requieren revisión`.

Base:

- Height: 40px.
- Active border: `2px solid --color-brand`.
- Active text: `--color-brand`.
- Inactive text: `--color-text-muted`.

Rules:

- Tabs should not be decorative.
- Tabs must represent operational slices.
- Keep labels short.

---

## 9. Layout Structure

Main app layout:

```text
Left Sidebar
↓
Top Bar
↓
Main Operational Panel
↓
Optional Right Panel
```

### 9.1 Left Sidebar

Purpose:

Primary navigation.

Width:

- Expanded: 248px.
- Collapsed: 72px.

Items:

- Control.
- Procesos.
- Novedades.
- Fuentes.
- Alertas.
- Clientes.
- Reportes.
- Configuracion.

Style:

- Background: `#FFFFFF`.
- Border-right: `1px solid --color-border`.
- Active item: brand soft background, brand text.

### 9.2 Top Bar

Purpose:

Global operational status.

Content:

- Page title.
- Source health indicator.
- Last sync time.
- Account selector.
- User menu.

Height:

- 64px.

### 9.3 Main Panel

Purpose:

Primary control surface.

Structure:

- Operational summary row.
- Quick filters.
- Table / operational list.
- Pagination or batch status.

### 9.4 Optional Right Panel

Purpose:

Detail or companion.

Modes:

- Case detail.
- Source detail.
- Companion.
- Alert detail.

Width:

- 360px to 420px.

Rules:

- Should not cover the main control table unless viewport is small.
- On mobile, it becomes a full-screen drawer.

---

## 10. State-Driven UI

Every core component must support:

- Success.
- Warning.
- Error.
- Info.
- Neutral.

State application:

| Component | Required States |
| --- | --- |
| Table rows | success, warning, error, info, neutral |
| Badges | success, warning, error, info, neutral |
| Alerts | success, warning, error, info |
| Filters | active, inactive, disabled |
| Buttons | default, hover, active, disabled |
| Panels | default, warning, error |

Rules:

- Never rely only on color. Use text and icon where state matters.
- Red is reserved for failure or not consulted.
- Yellow is reserved for attention, delay, or review.
- Green is reserved for successful operation or no change.

---

## 11. Voice And Microcopy

Tone:

- Direct.
- Operational.
- Short.
- Calm.

Good examples:

- `Nuevo movimiento detectado`
- `Sin cambios desde última consulta`
- `No se pudo consultar la fuente`
- `Consulta completada`
- `Requiere revisión`
- `Fuente intermitente`
- `Última consulta exitosa`

Avoid:

- Long explanations.
- Marketing tone.
- Conversational filler.
- Legal advice.
- Generic success messages like `Todo listo`.

Error copy pattern:

```text
What happened + current state
```

Examples:

- `No se pudo consultar la fuente. El proceso quedó pendiente de revisión.`
- `La consulta tardó más de lo esperado. Se intentará de nuevo.`

---

## 12. Implementation Guidelines

### 12.1 Tailwind Mapping

Recommended semantic mapping:

```js
colors: {
  brand: {
    DEFAULT: "#0B2D5C",
    hover: "#123B74",
    active: "#082348",
    soft: "#EAF1FB",
    border: "#B8C9E3"
  },
  success: {
    DEFAULT: "#168A4A",
    soft: "#E8F7EF",
    border: "#A9DFBF",
    text: "#0F5F33"
  },
  warning: {
    DEFAULT: "#B77900",
    soft: "#FFF5D6",
    border: "#F2D27A",
    text: "#7A4F00"
  },
  error: {
    DEFAULT: "#C43B3B",
    soft: "#FDECEC",
    border: "#F2B8B8",
    text: "#8F2424"
  },
  info: {
    DEFAULT: "#1F5FBF",
    soft: "#EAF2FF",
    border: "#B7D2FF"
  }
}
```

### 12.2 React Component Naming

Recommended component names:

- `Button`
- `StatusBadge`
- `OperationalTable`
- `Panel`
- `InlineAlert`
- `FilterBar`
- `QuickFilter`
- `OperationalTabs`
- `AppShell`
- `SidebarNav`
- `TopStatusBar`
- `RightInspectorPanel`
- `CompanionPanel`

### 12.3 Accessibility

Requirements:

- Minimum text contrast: WCAG AA.
- Focus states visible.
- State not communicated by color alone.
- Tables keyboard navigable.
- Buttons have accessible labels.
- Status badges include text.

Focus ring:

```css
outline: 2px solid #1f5fbf;
outline-offset: 2px;
```

---

## 13. Usage Guidelines

### Do

- Use state colors consistently.
- Keep operational tables dense but readable.
- Put priority and status early in the visual scan.
- Use panels to group decisions.
- Keep copy short.
- Show last successful query.
- Show failed source states clearly.

### Do Not

- Build a generic SaaS dashboard.
- Use color as decoration.
- Hide failures.
- Overuse cards.
- Use heavy shadows.
- Use playful illustration.
- Use legal symbolism as decoration.
- Make the UI feel like a CRM.

---

## 14. Product-Specific UI Patterns

### 14.1 Control Summary

Top of main panel should summarize:

- Procesos vigilados.
- Con novedad.
- Sin cambios.
- No consultados.
- Fuente con error.

### 14.2 Source Health Strip

Small status area showing:

- CPNU status.
- Last successful query.
- Error rate.
- Delayed jobs.

### 14.3 Companion Prompt Strip

Suggested prompts:

- `Qué cambió hoy?`
- `Qué no se pudo consultar?`
- `Qué casos requieren revisión?`
- `Qué procesos llevan más tiempo quietos?`

### 14.4 Case Detail Panel

Must show:

- Radicado.
- Current status.
- Last action.
- Annotation.
- Responsible.
- Query history.
- Events.
- Source status.

---

## 15. Design System Summary

LexControl must look and behave like an operational legal control center.

The visual system is built around:

- Deep blue brand control layer.
- State-driven green/yellow/red operational semantics.
- Neutral, precise interface surfaces.
- Compact, readable typography.
- Structured tables.
- Minimal shadows.
- Clear hierarchy.
- Short operational copy.

The UI should make users feel:

```text
I know what changed.
I know what did not change.
I know what failed.
I know what to review next.
```
