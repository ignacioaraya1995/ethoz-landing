# Ethoz — Indice de Documentacion

Este directorio centraliza la documentacion del proyecto Ethoz (ethoz.cl). Es un sitio SvelteKit que incluye landing publica, panel de administracion, pipeline de contenido para redes sociales, y herramientas de prospecting sobre datos oficiales del Mineduc.

## Estructura del repositorio

```
startUpColegio-landing/
├── src/
│   ├── routes/          — Paginas SvelteKit (landing + admin)
│   └── lib/             — Componentes, stores, utils, data
├── scripts/             — Pipeline de generacion y publicacion de contenido
├── supabase/            — Edge Functions y migraciones SQL
├── Directorio-Oficial-EE-2025/        — CSV oficial de establecimientos educacionales
├── Directorio-Oficial-Sostenedores-2025/ — CSV oficial de sostenedores
├── static/              — Assets estaticos (favicon, imagenes, JSON de colegios)
└── docs/                — Este directorio
```

## Secciones de documentacion

| Seccion | Descripcion |
|---------|-------------|
| [1-landing/README.md](1-landing/README.md) | Todas las paginas publicas: rutas, componentes, proposito |
| [2-admin/README.md](2-admin/README.md) | Panel de administracion: auth, leads, CRM, content manager, settings |
| [3-prospecting/README.md](3-prospecting/README.md) | Datos de colegios y sostenedores, scoring, outbound |
| [4-content-generation/README.md](4-content-generation/README.md) | Pipeline completo de contenido: scripts, Edge Functions, publicacion |
| [5-knowledge-base/README.md](5-knowledge-base/README.md) | Placeholder — base de conocimiento (pendiente) |
| [prd/](prd/) | Product Requirements Documents |
| [content-audit-report.md](content-audit-report.md) | Auditoria de contenido existente |
| [supabase-setup.sql](supabase-setup.sql) | SQL inicial de referencia para Supabase |

## Comandos rapidos

```bash
# Servidor de desarrollo
npm run dev -- --port 5177

# Build de produccion
npm run build

# Deploy a Firebase Hosting
npm run build && firebase deploy

# Procesar CSV de colegios → static/data/schools.json
node scripts/process-schools.mjs

# Generar contenido para RRSS
node scripts/generate-content.mjs --platform linkedin --pillar compliance --count 3

# Ejecutar tests
npm run test
```

## Tecnologias principales

- **Framework**: SvelteKit 2 con Svelte 5 (runes API)
- **Estilos**: Tailwind CSS v4
- **Base de datos**: Supabase (PostgreSQL + Auth + Edge Functions)
- **Deploy**: Firebase Hosting + Cloudflare DNS
- **Monitoreo**: Sentry (errores), Microsoft Clarity (comportamiento)
- **IA para contenido**: Kimi CLI (texto), Gemini (imagenes), Edge TTS (narración)
- **Empresa**: ETHOZ SpA, RUT 78.394.522-3

## Variables de entorno requeridas

Todas en `.env.local` (no versionado):

```
PUBLIC_SUPABASE_URL
PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
KIMI_API_KEY
GEMINI_API_KEY
PUBLIC_RECAPTCHA_SITE_KEY
RECAPTCHA_SECRET_KEY
PUBLIC_CAL_USERNAME
SENTRY_AUTH_TOKEN
PUBLIC_SENTRY_DSN
```
