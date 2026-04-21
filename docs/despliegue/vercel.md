# Despliegue en Vercel

LexControl usa un monorepo con la landing en `apps/web` y la API de Lex en `api/lex-chat.ts`.

## Configuración recomendada

Al importar el repositorio en Vercel, configurar el proyecto con:

```txt
Root Directory: ./
```

El archivo `vercel.json` en la raíz del repo define:

- Framework: Vite
- Install command: `npm install`
- Build command: `npm run build -w apps/web`
- Output directory: `apps/web/dist`

Esta configuración permite desplegar al mismo tiempo:

- el frontend de `apps/web`
- la función serverless en `/api/lex-chat`

No usar `Root Directory: apps/web` si se quiere que Lex converse con LLM desde Vercel, porque la carpeta `api/` vive en la raíz del repositorio.

## Variables de entorno

Para la landing actual no se requieren variables obligatorias.

Cuando se conecte Supabase desde el frontend, agregar en Vercel:

```bash
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

Para habilitar Lex con LLM en la demo, agregar también:

```bash
OPENAI_API_KEY=
OPENAI_MODEL=gpt-5
```

## Dominio

Dominio objetivo:

```txt
lexcontrol.co
```

Configurar el dominio desde Vercel cuando el primer deploy esté estable.

## Verificación local

Antes de desplegar:

```bash
npm run build -w apps/web
```

El build debe generar `apps/web/dist`.
