# Plan de Pruebas - Consulta Automatica de Fuentes

## Fuentes iniciales

1. Rama Judicial - Consulta Nacional Unificada.
2. Rama Judicial - Portal institucional.
3. Superintendencia de Industria y Comercio - tramites.
4. Superintendencia de Sociedades - Baranda Virtual.
5. SAMAI.
6. SIPI.

## Objetivo tecnico

Antes de automatizar consultas con radicados reales, cada fuente debe pasar por una prueba de compatibilidad:

- URL oficial vigente.
- Tipo de aplicacion: HTML simple, formulario, SPA, ASP.NET, API.
- Presencia de CAPTCHA o controles anti-bot.
- Necesidad de sesion, cookies, tokens o viewstate.
- Posibilidad de consultar por HTTP directo.
- Necesidad de Playwright.
- Forma de persistir evidencia: payload JSON, HTML o screenshot.

## Estrategia por fases

### Fase 1 - Probe inicial

Ejecutar `scripts/probes/probe_sources.py` para obtener:

- status HTTP.
- URL final.
- titulo de pagina.
- formularios detectados.
- scripts detectados.
- senales de CAPTCHA.
- recomendacion de estrategia.

### Fase 2 - Discovery con navegador

Para fuentes marcadas como `playwright_discovery`, crear una prueba Playwright que:

- Abra la fuente.
- Capture requests de red.
- Identifique endpoints JSON.
- Tome screenshot de evidencia.
- No resuelva CAPTCHA ni envie consultas masivas.

### Fase 3 - Consulta controlada

Con 3-5 radicados de prueba autorizados por Fabio:

- Ejecutar una consulta por fuente.
- Guardar fixture HTML/JSON anonimizado.
- Documentar campos disponibles.
- Medir tiempo de respuesta.
- Registrar bloqueos.

### Fase 4 - Conector productivo

Solo despues de las fases anteriores:

- Implementar conector en `packages/connectors`.
- Agregar parser.
- Agregar fixtures.
- Agregar tests de regresion.

## Decision esperada por fuente

Cada fuente debe quedar en una de estas categorias:

- Automatizable por HTTP directo.
- Automatizable con Playwright.
- Parcialmente automatizable con intervencion humana.
- No automatizable sin convenio, API oficial o proveedor externo.

