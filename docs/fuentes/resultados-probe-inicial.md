# Resultados Iniciales de Probes

Fecha de prueba: 2026-04-18

## Resumen

Se ejecuto `scripts/probes/probe_sources.py` contra las fuentes iniciales. La prueba solo hace discovery liviano: no consulta radicados reales, no autentica y no intenta resolver CAPTCHA.

## Resultado por Fuente

### Rama Judicial - Consulta Nacional Unificada

- URL: `https://consultaprocesos.ramajudicial.gov.co/Procesos/NumeroRadicacion`
- Estado: responde `200`.
- Hallazgo: entrega una aplicacion JavaScript con assets `chunk-vendors` y `app`.
- Formularios HTML: no detectados en el HTML inicial.
- CAPTCHA: no detectado en el HTML inicial.
- Estrategia recomendada: `browser_or_http_api`.
- Browser probe: carga correctamente la pantalla `Consulta de Procesos por Numero de Radicacion`.
- Estado con navegador: no aparece CAPTCHA antes de consultar.

Siguiente paso:

- Ejecutar `cpnu_search_probe.py` con radicados autorizados.
- Identificar si existe endpoint JSON consultable por radicado.

### SAMAI

- URL: `https://samai.consejodeestado.gov.co/Vistas/Casos/procesos.aspx`
- Estado: responde `200`.
- Titulo: `Mis Procesos`.
- Hallazgo: ASP.NET WebForms con `__VIEWSTATE`, `__EVENTVALIDATION` y formulario de busqueda.
- CAPTCHA: senales detectadas en el HTML.
- Estrategia recomendada: `manual_or_provider_required` hasta validar si la consulta publica exige CAPTCHA.

Siguiente paso:

- Ejecutar discovery con navegador.
- Confirmar si el CAPTCHA aparece antes o despues de hacer busqueda.
- Si el CAPTCHA es obligatorio, no construir bypass; evaluar consulta manual asistida o convenio/API.

### SIC - Consulta de Tramites

- URL inicial: `https://serviciospub.sic.gov.co/Sic2/Tramites/Radicacion/Radicacion/Consultas/ConsultaRadicacion.php`
- URL final: `https://consultatramites.sic.gov.co/consulta-externa`
- Estado: responde `200`.
- Titulo: `SIC | Superintendencia de Industria y Comercio`.
- Hallazgo: aplicacion JavaScript.
- CAPTCHA: no detectado en el HTML inicial.
- Estrategia recomendada: `playwright_discovery`.
- Browser probe: detecta endpoint JSON candidato `https://apiexternotramites.sic.gov.co/parametricas/v1/referencias/DOCUMENTO`.

Siguiente paso:

- Ejecutar una busqueda controlada con datos autorizados para capturar endpoint de consulta.
- Probar con radicado autorizado si la consulta requiere CAPTCHA o parametros adicionales.

### SIPI

- URL: `https://sipi.sic.gov.co/sipi/Extra/`
- Estado: respuesta `302` con redireccion circular desde cliente HTTP simple.
- Estrategia recomendada: navegador real.
- Browser probe: abre correctamente en `Default.aspx?sid=...`.
- Titulo: `SIPI-INICIO`.
- API candidata: no detectada en carga inicial.
- CAPTCHA: no detectado en carga inicial.

Siguiente paso:

- Crear probe interactivo para hacer clic en la opcion publica correspondiente.
- Identificar si las busquedas publicas se pueden hacer sin usuario.

### Superintendencia de Sociedades - Baranda Virtual

- URL: `https://servicios.supersociedades.gov.co/barandaVirtual/`
- Estado: responde `200`.
- Titulo: `Baranda Virtual`.
- Hallazgo: aplicacion JavaScript con script explicito de reCAPTCHA y `captcha.interceptor.js`.
- CAPTCHA: detectado.
- Estrategia recomendada: `manual_or_provider_required`.

Siguiente paso:

- Validar visualmente si el CAPTCHA aparece para toda consulta o solo para ciertas acciones.
- Si es obligatorio, no intentar bypass; proponer flujo manual asistido o canal formal.

### Rama Judicial - Portal Institucional

- URL: `https://www.ramajudicial.gov.co/`
- Estado: responde `200`.
- Titulo: `Rama Judicial de Colombia: Informacion y servicios para la justicia`.
- Uso recomendado: discovery de enlaces oficiales, no fuente principal de consulta automatica.

## Conclusion Tecnica

La primera fuente candidata para automatizacion real es Rama Judicial CPNU. SIC Tramites tambien parece viable, pero requiere discovery con navegador.

SAMAI y Baranda Virtual muestran senales de CAPTCHA o controles dinamicos, asi que no deben tratarse como scrapers simples.

SIPI requiere navegador real para resolver redirecciones y entender la estructura.

## Proximo Paso

Instalar Playwright para Python y ejecutar:

```bash
python3 -m pip install playwright
python3 -m playwright install chromium
python3 scripts/probes/browser_probe.py --source rama_judicial_cpnu --write-report
python3 scripts/probes/browser_probe.py --source sic_tramites --write-report
python3 scripts/probes/browser_probe.py --source sipi --write-report
```

Para CPNU, con un radicado autorizado:

```bash
.venv/bin/python scripts/probes/cpnu_search_probe.py --radicado "RADICADO_AUTORIZADO" --write-report
```
