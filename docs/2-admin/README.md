# Panel de Administracion

El panel de admin vive en `/admin` y sus subrutas. Esta completamente protegido por Supabase Auth. Solo los usuarios autenticados con email `idaraya@uc.cl` (u otros usuarios creados en Supabase Auth) pueden acceder.

El panel esta marcado con `<meta name="robots" content="noindex, nofollow">` para que no sea indexado por buscadores.

## Estructura de archivos

```
src/routes/admin/
├── +layout.svelte          — Layout compartido: navbar de admin, guard de autenticacion
├── +page.svelte            — Pantalla de login
├── content/
│   └── +page.svelte        — Gestor de contenido para RRSS
├── leads/
│   └── +page.svelte        — Vista de leads capturados
├── prospecting/
│   └── +page.svelte        — CRM de prospecting sobre datos Mineduc
└── settings/
    └── +page.svelte        — Configuracion de integraciones y tokens OAuth
```

## Autenticacion

### Flujo

1. El usuario accede a cualquier ruta bajo `/admin`.
2. `+layout.svelte` llama a `adminStore.init()` en `onMount`.
3. `adminStore.init()` verifica la sesion activa de Supabase Auth (`supabase.auth.getSession()`).
4. Si no hay sesion, el layout no renderiza la barra de navegacion de admin, y las paginas individuales redirigen a `/admin`.
5. En `/admin` (`+page.svelte`): formulario de email + password. Al autenticarse exitosamente, redirige a `/admin/prospecting`.

### Archivos clave

| Archivo | Lineas | Descripcion |
|---------|--------|-------------|
| `src/routes/admin/+layout.svelte` | 89 | Guard de auth + barra de navegacion de admin con links a Prospecting, Leads, Content, Settings. Boton de logout. |
| `src/routes/admin/+page.svelte` | 110 | Pantalla de login. Email pre-cargado con `idaraya@uc.cl`. Usa `adminStore.login()`. |
| `src/lib/stores/admin.svelte.ts` | 39 | Store Svelte 5 (runes). Wrappea `src/lib/supabase.ts`. Expone: `authenticated` (boolean), `user` (objeto Supabase User), `login(email, password)`, `logout()`, `init()`. |
| `src/lib/supabase.ts` | 117 | Cliente Supabase. Exporta `supabase` (cliente con anon key para el front) y helpers de consulta. Tambien inicializa `supabaseAdmin` con service role para operaciones administrativas. |

## Seccion: Prospecting (`/admin/prospecting`)

- **Archivo**: `src/routes/admin/prospecting/+page.svelte` (933 lineas)
- **Proposito**: CRM de prospectos construido sobre los datos del Directorio Oficial del Mineduc. Permite al equipo de ventas identificar, filtrar, y gestionar sostenedores objetivo.

### Funcionalidades

- Carga y procesa los datos de colegios desde Supabase o desde el JSON estatico.
- Filtra sostenedores por: region, tipo de dependencia (municipal, subvencionado, pagado), cantidad de colegios, matricula total.
- Aplica el algoritmo de scoring de `src/lib/utils/prospecting.ts` para clasificar sostenedores en Tier 1, 2 y 3.
- Muestra tabla de sostenedores con columnas: Tier, Score, Nombre, N° colegios, Matricula, Tipo, Regiones.
- Permite exportar la lista filtrada como CSV.
- Click en un sostenedor muestra sus colegios individuales con RBD, nombre, comuna, matricula.

### Logica de scoring

Ver `src/lib/utils/prospecting.ts` (215 lineas) para el detalle. En resumen:

| Criterio | Puntaje maximo |
|----------|---------------|
| Matricula total | 35 pts |
| Cantidad de colegios | 30 pts |
| Tipo de dependencia | 25 pts (pagado > subvencionado > municipal) |
| Region (RM primero) | 10 pts |

**Tiers**:
- Tier 1: score >= 60 (prioridad maxima, cerrar primero)
- Tier 2: score >= 35 (pipeline normal)
- Tier 3: score < 35 (largo plazo)

## Seccion: Leads (`/admin/leads`)

- **Archivo**: `src/routes/admin/leads/+page.svelte` (374 lineas)
- **Proposito**: Vista de todos los leads capturados desde los formularios del sitio (contacto, demo, schedule, sugerencias).

### Funcionalidades

- Lista paginada de leads ordenados por fecha de creacion (mas recientes primero).
- Columnas: nombre, email, colegio, mensaje, fuente (formulario de origen), fecha.
- Filtro por fuente y busqueda por texto.
- Click en lead abre detalle completo.
- Datos en Supabase tabla `leads`.

### Tabla Supabase: `leads`

```sql
id          uuid PRIMARY KEY
created_at  timestamptz
name        text
email       text
school      text
message     text
source      text  -- 'contact' | 'demo' | 'schedule' | 'suggestions'
metadata    jsonb -- datos adicionales segun fuente
```

La Edge Function `new-lead-notify` se activa en cada nuevo lead para enviar notificacion interna.

## Seccion: Content Manager (`/admin/content`)

- **Archivo**: `src/routes/admin/content/+page.svelte` (1.096 lineas)
- **Proposito**: Interfaz para revisar, editar, aprobar, y publicar el contenido generado por el pipeline de scripts.

### Flujo del contenido

```
scripts/generate-content.mjs
    → guarda borradores en Supabase (tabla content_posts, estado: draft)
        → /admin/content muestra los borradores
            → operador revisa y aprueba
                → boton "Publicar" llama a la Edge Function social-publish
                    → post publicado en LinkedIn / Instagram / Facebook / YouTube
```

### Funcionalidades

- Lista de posts por plataforma y estado (`draft`, `approved`, `published`, `failed`).
- Editor inline para ajustar texto, hashtags, y metadata antes de publicar.
- Boton "Publicar ahora" → llama a `supabase.functions.invoke('social-publish', ...)`.
- Historial de publicaciones con timestamps y URLs de post publicado.
- Filtro por plataforma (LinkedIn, Instagram, Facebook, YouTube).

### Tabla Supabase: `content_posts`

```sql
id          uuid PRIMARY KEY
created_at  timestamptz
platform    text  -- 'linkedin' | 'instagram' | 'facebook' | 'youtube'
pillar      text  -- 'compliance' | 'school-safety' | 'convivencia' | ...
format      text  -- 'text-post' | 'carousel' | 'reel' | ...
body        text  -- cuerpo del post
hashtags    text  -- hashtags del post
status      text  -- 'draft' | 'approved' | 'published' | 'failed'
published_at timestamptz
post_url    text  -- URL del post publicado (cuando aplica)
error       text  -- mensaje de error si status = 'failed'
```

## Seccion: Settings (`/admin/settings`)

- **Archivo**: `src/routes/admin/settings/+page.svelte` (395 lineas)
- **Proposito**: Configuracion de las integraciones de RRSS. Permite conectar las cuentas de LinkedIn, Instagram/Facebook (Meta), y Google/YouTube via OAuth.

### Flujo OAuth

Cada plataforma tiene una Edge Function de auth:

| Plataforma | Edge Function | Archivo |
|------------|--------------|---------|
| Google / YouTube | `social-auth-google` | `supabase/functions/social-auth-google/index.ts` (73 lineas) |
| LinkedIn | `social-auth-linkedin` | `supabase/functions/social-auth-linkedin/index.ts` (85 lineas) |
| Meta (Instagram + Facebook) | `social-auth-meta` | `supabase/functions/social-auth-meta/index.ts` (93 lineas) |

Flujo:
1. Admin hace clic en "Conectar [plataforma]" en Settings.
2. El front invoca la Edge Function correspondiente con `action: 'get_auth_url'`.
3. La Edge Function devuelve la URL de OAuth del proveedor.
4. Se redirige al admin a esa URL.
5. Al volver, la Edge Function con `action: 'exchange_code'` intercambia el codigo por tokens.
6. Los tokens se guardan en Supabase tabla `social_tokens`.
7. `social-publish` lee estos tokens al publicar, y los refresca si estan vencidos.

### Tabla Supabase: `social_tokens`

```sql
id            uuid PRIMARY KEY
platform      text UNIQUE  -- 'google' | 'linkedin' | 'meta'
access_token  text
refresh_token text
token_expiry  timestamptz
org_id        text  -- LinkedIn org ID (para publicar como empresa)
page_id       text  -- Facebook/Instagram page ID
```

## Edge Functions de Supabase

Ubicacion: `supabase/functions/`

| Funcion | Lineas | Descripcion |
|---------|--------|-------------|
| `social-publish/index.ts` | 259 | Publica un post en la plataforma indicada. Lee tokens de `social_tokens`, los refresca si vencen. Soporta texto, imagen, y video. |
| `social-auth-google/index.ts` | 73 | OAuth con Google para YouTube. |
| `social-auth-linkedin/index.ts` | 85 | OAuth con LinkedIn. |
| `social-auth-meta/index.ts` | 93 | OAuth con Meta (Facebook + Instagram). |
| `cal-webhook/index.ts` | 185 | Recibe webhooks de Cal.com cuando alguien agenda una reunion. Guarda el evento en Supabase y puede enviar notificacion. |
| `new-lead-notify/index.ts` | 225 | Se activa por trigger de Supabase cuando se inserta un lead nuevo. Envia notificacion al equipo (email o Slack). |
| `_shared/cors.ts` | — | Headers CORS compartidos entre todas las Edge Functions. |

## Migraciones SQL

| Archivo | Lineas | Descripcion |
|---------|--------|-------------|
| `supabase/migrations/001_prospect_tables.sql` | 102 | Crea las tablas: `leads`, `content_posts`, `social_tokens`, `prospect_notes`. Incluye RLS policies para que solo service role pueda escribir en algunas tablas. |

## Comandos utiles

```bash
# Ver logs de Edge Functions en produccion
supabase functions logs social-publish --project-ref [ref]

# Desplegar una Edge Function
supabase functions deploy social-publish --project-ref [ref]

# Desplegar todas las Edge Functions
supabase functions deploy --project-ref [ref]

# Ejecutar migraciones
supabase db push --project-ref [ref]

# Abrir Supabase Studio local
supabase start
supabase studio
```
