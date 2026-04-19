# Decision de Stack - Legal Search MVP

## Decision

El stack recomendado para el MVP es:

- Supabase Postgres para datos operativos, historial, auditoria y RLS.
- Supabase Auth para usuarios internos.
- Supabase Cron para programar revisiones o encolar trabajos.
- Supabase Edge Functions para endpoints ligeros, webhooks, alertas y orquestacion corta.
- Worker Node.js/TypeScript separado para scraping, Playwright y conectores pesados.
- Vite + React + TypeScript para el dashboard operativo interno.
- Playwright solo dentro del worker, no dentro de Edge Functions.

## Por que no todo en Edge Functions

Edge Functions sirven muy bien para funciones cortas y APIs HTTP. No son el lugar ideal para procesos largos, navegadores headless, scraping fragil o jobs que puedan tardar varios minutos.

Para este MVP, las Edge Functions deben:

- Recibir llamadas internas.
- Crear alertas.
- Ejecutar validaciones ligeras.
- Disparar o encolar revisiones.
- Exponer endpoints controlados al dashboard.

El worker debe:

- Consultar fuentes judiciales.
- Ejecutar Playwright cuando una fuente lo requiera.
- Parsear HTML o payloads complejos.
- Reintentar fuentes inestables.
- Guardar snapshots y movimientos.

## Correccion de nombre

El frontend propuesto es Vite.js, no Byte.js. Vite es suficiente para este MVP porque el dashboard es una aplicacion interna, no necesita renderizado server-side ni SEO.

## Regla Arquitectonica

Supabase guarda la verdad operacional.

El worker observa fuentes externas.

Edge Functions coordinan tareas cortas.

El dashboard permite operar y auditar.

