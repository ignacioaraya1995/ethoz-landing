# Pipeline de Generacion de Contenido

Pipeline completo para generar, revisar, y publicar contenido en redes sociales. Va desde una idea hasta el post publicado en LinkedIn, Instagram, Facebook, o YouTube.

## Vision general del flujo

```
1. ESTRATEGIA     src/lib/content/strategy.ts
                  Define plataformas, audiencias, pilares, formatos

2. GENERACION     scripts/generate-content.mjs   (texto, via Kimi)
                  scripts/generate-images.mjs    (imagenes, via Gemini)
                  scripts/generate-covers.mjs    (portadas, via Playwright + Gemini)
                  scripts/generate-logos.mjs     (logos, via Gemini)

3. VIDEO          scripts/generate-narrated-video.mjs  (reel narrado)
                  scripts/generate-pitch-video.mjs     (video pitch con slides)

4. REVISION       /admin/content  (panel web)
                  Operador revisa, edita, y aprueba cada pieza

5. PUBLICACION    supabase/functions/social-publish/   (via Edge Function)
                  scripts/publish-reels-batch.mjs      (batch de reels)
                  scripts/publish-pitch-video.mjs      (video a YouTube/LinkedIn)
                  scripts/upload-pitch-youtube.mjs     (solo YouTube)
```

## Fuente de verdad de la estrategia

**Archivo**: `src/lib/content/strategy.ts` (173 lineas)

Es el archivo central que define toda la estrategia de contenido. Es TypeScript importado tanto por los scripts (en version inline) como por el panel de admin.

### Plataformas configuradas

| Plataforma | Audiencia | Frecuencia | Formatos |
|------------|-----------|-----------|----------|
| LinkedIn | Sostenedores, directores, coordinadores TI. Tomadores de decision. | 3x/semana (lun, mie, vie) | text-post, carousel, article |
| Facebook | Directores, apoderados informados, comunidad educativa | 2-3x/semana | text-image, video, link-share |
| Instagram | Profesores jovenes, coordinadores, apoderados tech-savvy | 4-5x/semana | carousel, reel, single-image, story |
| YouTube | Directores investigando soluciones, busqueda intencional | 1-2x/semana | explainer, demo, short, pitch-video |

### Pilares de contenido

| ID | Nombre | Descripcion |
|----|--------|-------------|
| `compliance` | Cumplimiento Ley 21.719 | Plazos, multas, requisitos. URGENCIA. |
| `school-safety` | Seguridad Escolar | Retiros seguros, control de acceso, registros digitales. |
| `convivencia` | Convivencia Escolar | Registro continuo, perfil integral, reinicio de marzo. |
| `digital-transformation` | Transformacion Digital | Excel vs plataforma, integracion, modernizacion. |
| `product` | Producto Ethoz | Demos, features, integraciones, casos de uso. |

### Funcion `buildKimiPrompt()`

Genera el prompt completo para Kimi dado plataforma + pilar + formato + tema. Incluye reglas de marca: no inventar datos, no emojis excesivos, multas hasta 20.000 UTM, Ethoz complementa (no reemplaza) sistemas existentes.

## Scripts de generacion

### `scripts/generate-content.mjs` (264 lineas)

Genera posts de texto para RRSS usando la API de Kimi.

```bash
# Ejemplos de uso
node scripts/generate-content.mjs --platform linkedin --pillar compliance --count 3
node scripts/generate-content.mjs --platform instagram --pillar school-safety --topic "retiros escolares" --count 5
node scripts/generate-content.mjs --platform youtube --pillar product --format short --count 2
node scripts/generate-content.mjs --list-pillars
node scripts/generate-content.mjs --list-platforms
```

**Que hace**:
1. Lee `.env.local` para obtener `KIMI_API_KEY`, `PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`.
2. Construye el prompt usando la configuracion de plataforma y pilar.
3. Llama a la API de Kimi (modelo de lenguaje) con el prompt.
4. Guarda cada post generado en Supabase tabla `content_posts` con `status: 'draft'`.
5. Los borradores quedan disponibles en `/admin/content` para revision.

**API utilizada**: Kimi (Moonshot AI) — `KIMI_API_KEY` en `.env.local`.

### `scripts/generate-images.mjs` (277 lineas)

Genera imagenes para los posts usando la API de Gemini.

```bash
node scripts/generate-images.mjs --post-id [uuid] --style "profesional, educacion, Chile"
node scripts/generate-images.mjs --batch --platform instagram --count 5
```

**Que hace**:
1. Recibe el texto del post (desde Supabase o argumento).
2. Construye un prompt de imagen apropiado para la plataforma (dimensiones, estilo).
3. Llama a la API de Gemini para generar la imagen.
4. Guarda la imagen en `static/generated/` o la sube a Supabase Storage.
5. Actualiza el registro en `content_posts` con la URL de la imagen.

**API utilizada**: Google Gemini — `GEMINI_API_KEY` en `.env.local`.

### `scripts/generate-covers.mjs` (244 lineas)

Genera portadas visuales (thumbnails de blog, covers de carrusel) usando Playwright + Gemini.

```bash
node scripts/generate-covers.mjs --slug "ley-21719-que-deben-saber-los-colegios"
node scripts/generate-covers.mjs --all-posts
```

**Que hace**:
1. Lanza un browser headless con Playwright.
2. Genera un fondo con Gemini o usa una plantilla HTML.
3. Renderiza el titulo y subtitulo sobre el fondo con el brand de Ethoz.
4. Captura screenshot en la resolucion correcta (1200x630 para blog, 1080x1350 para IG).
5. Guarda en `static/covers/`.

**Dependencias**: Playwright instalado (`npx playwright install chromium`).

### `scripts/generate-logos.mjs` (108 lineas)

Genera variantes del logo de Ethoz en diferentes formatos y colores.

```bash
node scripts/generate-logos.mjs
```

**Que hace**: Usa Gemini para generar variantes del logo SVG y las guarda en `static/logos/`.

### `scripts/generate-quality-batch.mjs` (221 lineas)

Script de batch que corre el pipeline completo (texto + imagen) para un conjunto de posts de alta prioridad.

```bash
node scripts/generate-quality-batch.mjs --platform linkedin --count 10
```

## Scripts de video

### `scripts/generate-narrated-video.mjs` (266 lineas)

Genera un reel de video narrado con subtitulos. Pipeline 100% open source / gratuito.

```bash
node scripts/generate-narrated-video.mjs --script "scripts/input/guion-ley-21719.txt" --output "output/reel-ley-21719.mp4"
```

**Pipeline interno**:
1. Recibe un guion en texto plano (parrafos = secciones).
2. Edge TTS (`es-CL-LorenzoNeural`) genera el audio MP3 narrado.
3. Whisper.cpp genera subtitulos SRT con timing preciso.
4. Playwright renderiza slides HTML con el texto de cada seccion.
5. FFmpeg combina audio + slides + subtitulos en MP4 final.

**Dependencias externas requeridas**:
- `edge-tts` (pip install edge-tts)
- `whisper.cpp` compilado localmente
- `ffmpeg` en PATH
- Playwright (`npx playwright install chromium`)

### `scripts/generate-pitch-video.mjs` (307 lineas)

Genera el video del pitch (equivalente a la pagina `/pitch`) como archivo MP4 para distribuir en YouTube y LinkedIn.

```bash
node scripts/generate-pitch-video.mjs --output "output/ethoz-pitch-2026.mp4"
```

**Que hace**:
1. Carga los slides de `src/lib/data/pitch-slides.ts`.
2. Lanza Playwright y navega a `/pitch` en el servidor local.
3. Captura cada slide como screenshot.
4. Genera narración con Edge TTS para cada slide.
5. FFmpeg combina screenshots + audio en MP4.

## Scripts de publicacion

### `scripts/publish-reels-batch.mjs` (194 lineas)

Publica un batch de reels en Instagram, Facebook, y LinkedIn simultaneamente.

```bash
node scripts/publish-reels-batch.mjs --dir "output/reels" --platforms instagram,facebook,linkedin
```

**Que hace**:
1. Lee tokens de OAuth desde Supabase tabla `social_tokens`.
2. Para cada archivo de video en el directorio:
   - Sube el video a Instagram como Reel.
   - Publica en Facebook como video.
   - Publica en LinkedIn como video post.
3. Registra resultado (URL del post o error) en Supabase.

### `scripts/publish-pitch-video.mjs` (324 lineas)

Publica el video del pitch en YouTube y LinkedIn.

```bash
node scripts/publish-pitch-video.mjs --video "output/ethoz-pitch-2026.mp4" --title "Ethoz — Proteccion Escolar Inteligente" --description "..."
```

### `scripts/upload-pitch-youtube.mjs` (160 lineas)

Sube el video del pitch exclusivamente a YouTube, con titulo, descripcion, tags, y thumbnail.

```bash
node scripts/upload-pitch-youtube.mjs --video "output/pitch.mp4"
```

### `scripts/audit-content.py` (98 lineas)

Script Python para auditar el contenido existente. Analiza los posts publicados y genera un reporte de coherencia con la estrategia de contenido.

```bash
python3 scripts/audit-content.py
```

El reporte generado se guarda en `docs/content-audit-report.md`.

## Edge Function: `social-publish`

**Archivo**: `supabase/functions/social-publish/index.ts` (259 lineas)

La Edge Function de publicacion es invocada desde el panel `/admin/content` cuando el operador hace clic en "Publicar". Tambien puede ser invocada directamente.

### Invocacion desde el front

```typescript
const { data, error } = await supabase.functions.invoke('social-publish', {
  body: {
    postId: 'uuid-del-post',
    platform: 'linkedin' // | 'instagram' | 'facebook' | 'youtube'
  }
});
```

### Que hace internamente

1. Lee el post de `content_posts` por ID.
2. Lee el token OAuth de `social_tokens` para la plataforma.
3. Si el token esta vencido, lo refresca usando el refresh_token.
4. Publica en la API de la plataforma correspondiente.
5. Actualiza `content_posts` con `status: 'published'`, `published_at`, y `post_url`.
6. Si falla, guarda el error y actualiza `status: 'failed'`.

### Plataformas soportadas

| Plataforma | API usada | Nota |
|------------|-----------|------|
| LinkedIn | LinkedIn UGC Posts API | Publica como organizacion (`urn:li:organization:`) si hay `org_id` |
| Instagram | Meta Graph API | Requiere container + publish en dos pasos |
| Facebook | Meta Graph API | Publica en page feed |
| YouTube | YouTube Data API v3 | Solo para videos, no texto |

## Datos de slides del pitch

**Archivo**: `src/lib/data/pitch-slides.ts` (29 lineas)

Array de slides con titulo, subtitulo, y notas del presentador. Usado por:
- `src/routes/pitch/+page.svelte` — presentacion web interactiva
- `src/lib/components/PitchModal.svelte` — modal del pitch
- `scripts/generate-pitch-video.mjs` — generacion del video

## Variables de entorno necesarias para el pipeline

```bash
# En .env.local
KIMI_API_KEY=           # Texto con Kimi (Moonshot AI)
GEMINI_API_KEY=         # Imagenes y texto alternativo con Gemini
PUBLIC_SUPABASE_URL=    # Para guardar borradores y leer tokens
SUPABASE_SERVICE_ROLE_KEY= # Para escritura admin en Supabase

# En Supabase Edge Functions (configurar via supabase secrets set)
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
GOOGLE_CLIENT_ID=       # OAuth YouTube
GOOGLE_CLIENT_SECRET=
LINKEDIN_CLIENT_ID=     # OAuth LinkedIn
LINKEDIN_CLIENT_SECRET=
META_APP_ID=            # OAuth Instagram + Facebook
META_APP_SECRET=
```

## Cuentas de RRSS Configuradas

| Plataforma | ID | Estado | Enlace |
|------------|----|---------|---------| 
| Facebook | `1083964671464526` | Activa | [Página Ethoz](https://facebook.com/ethoz) |
| Instagram | `17841436264795872` | Activa | [Cuenta Ethoz](https://instagram.com/ethoz) |
| YouTube | `UCYeWEdqonYWKvja78_HM2TA` | Activa | [Canal Ethoz](https://youtube.com/@ethoz) |
| LinkedIn | Pendiente | En revisión | (Pendiente verificación) |

**Nota importante:** Los tokens OAuth se guardan en Supabase tabla `social_tokens`. Si un token expira, reconectar en `/admin/settings`.

## Content Bank v2

Las siguientes archivos contienen contenido generado más reciente:

| Archivo | Tipo | Contenido |
|---------|------|----------|
| `docs/content-bank/linkedin-posts-v2.md` | Posts | Posts v2 para LinkedIn |
| `docs/content-bank/instagram-posts-v2.md` | Posts | Posts v2 para Instagram |
| `docs/content-bank/facebook-posts-v2.md` | Posts | Posts v2 para Facebook |
| `docs/content-bank/reels-scripts-v2.md` | Scripts | Guiones para reels v2 |
| `docs/content-bank/whatsapp-broadcast-v2.md` | Broadcasts | Mensajes WhatsApp v2 |
| `docs/content-bank/content-calendar-v2.md` | Calendario | Calendario de publicaciones v2 |

**Primer post publicado:** 2026-04-08 a Facebook

## Flujo de trabajo completo — ejemplo paso a paso

```bash
# 1. Generar 3 posts de texto para LinkedIn sobre compliance
node scripts/generate-content.mjs --platform linkedin --pillar compliance --count 3

# 2. Revisar en el panel (abrir navegador)
# → http://localhost:5177/admin/content

# 3. En el panel: editar texto si es necesario, aprobar los que quedaron bien

# 4. Generar imagenes para los posts aprobados
node scripts/generate-images.mjs --batch --platform linkedin --status approved

# 5. Publicar desde el panel haciendo clic en "Publicar" en cada post
# → La Edge Function social-publish se encarga del resto
# → Post se publica en LinkedIn como org (usa org_id de social_tokens)

# --- Para reels ---

# 6. Escribir guion en texto plano
echo "La Ley 21.719 obliga a los colegios a proteger los datos de sus alumnos..." > /tmp/guion.txt

# 7. Generar reel narrado
node scripts/generate-narrated-video.mjs --script /tmp/guion.txt --output output/reel-compliance.mp4

# 8. Publicar el reel (simultaneamente Instagram, Facebook, LinkedIn)
node scripts/publish-reels-batch.mjs --dir output --platforms instagram,facebook,linkedin

# --- Verificar tokens activos ---

# 9. Si publica falla con "token expired", reconectar en admin
# https://ethoz.cl/admin/settings > Click "Conectar [plataforma]"
# → OAuth flow actualiza token en social_tokens table
```

## Troubleshooting

| Error | Causa | Solución |
|-------|-------|----------|
| "Invalid access token" | Token LinkedIn expirado | Reconectar en `/admin/settings` |
| "Page ID not found" | Facebook page_id incorrecto | Verificar en `social_tokens` table |
| "Instagram container error" | Meta requiere container + paso 2 | Esperar 24h después de crear container |
| "Rate limit exceeded" | API quota agotada | Esperar 1 hora, reintentar |
| "Webhook signature failed" | Cal.com secret incorrecto | Actualizar `CAL_WEBHOOK_SECRET` en Edge Function secrets |

Ver `docs/RUNBOOK.md` sección "How to Reconnect OAuth for Social Platforms" y "How to Debug a Failed Edge Function" para detalles.
