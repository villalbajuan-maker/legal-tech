# Despliegue en Vercel

LexControl usa un monorepo con la landing en `apps/web`.

## Configuración recomendada

Al importar el repositorio en Vercel, configurar el proyecto con:

```txt
Root Directory: apps/web
```

El archivo `apps/web/vercel.json` define:

- Framework: Vite
- Install command: `npm install`
- Build command: `npm run build`
- Output directory: `dist`

No existe `vercel.json` en la raíz del repo para evitar que Vercel bloquee campos con configuración del monorepo.

No usar `npm run build -w apps/web` cuando el root ya es `apps/web`, porque Vercel intentará buscar un workspace dentro de `apps/web` y fallará con:

```txt
npm error No workspaces found: --workspace=apps/web
```

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
cd apps/web
npm run build
```

El build debe generar `apps/web/dist`.
