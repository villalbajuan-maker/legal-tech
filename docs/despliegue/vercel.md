# Despliegue en Vercel

LexControl usa un monorepo con la landing en `apps/web`.

## Configuración recomendada

Al importar el repositorio en Vercel, la raíz del proyecto puede quedar en la raíz del repo. El archivo `vercel.json` define:

- Framework: Vite
- Install command: `npm install`
- Build command: `npm run build -w apps/web`
- Output directory: `apps/web/dist`

## Si Vercel usa `apps/web` como Root Directory

También se incluye `apps/web/vercel.json` para el caso en que el proyecto de Vercel tenga configurado:

```txt
Root Directory: apps/web
```

En ese caso la configuración correcta es:

- Framework: Vite
- Install command: `npm install`
- Build command: `npm run build`
- Output directory: `dist`

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
