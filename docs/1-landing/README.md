# Landing — Paginas Publicas

Todas las paginas publicas del sitio ethoz.cl. Implementadas en SvelteKit 5 con Svelte runes. La ruta raiz es `src/routes/`.

## Layout global

| Archivo | Lineas | Descripcion |
|---------|--------|-------------|
| `src/routes/+layout.svelte` | 78 | Layout raiz. Incluye NavBar, Footer, FeedbackOverlay, y el modal de pitch. Inicializa Sentry y Clarity. Aplica clase `dark` segun preferencia del sistema. |
| `src/routes/+layout.ts` | — | Configuracion de layout: `prerender = true` por defecto, `ssr = false` para paginas con datos dinamicos. |
| `src/routes/+error.svelte` | — | Pagina de error generica. Muestra codigo de estado y mensaje. |

## Paginas principales

### Inicio — `/`
- **Archivo**: `src/routes/+page.svelte` (780 lineas)
- **Proposito**: Pagina principal de conversion. Contiene hero con busqueda de colegio por nombre/RBD, propuesta de valor, features destacadas, testimonios, y CTA a demo.
- **Componentes clave**: Busqueda de colegios en tiempo real usando `schools.svelte.ts` store. Integra el componente de busqueda directo sin redirect hasta que el usuario selecciona.
- **Conecta con**: `/demo/[rbd]` al seleccionar un colegio, `/schedule` para agendar, `/pitch` para ver el video pitch.

### Acerca de — `/about`
- **Archivo**: `src/routes/about/+page.svelte` (222 lineas)
- **Proposito**: Historia de la empresa, equipo fundador, mision y valores. Presenta a ETHOZ SpA como empresa fundada en 2026.

### Blog — `/blog`
- **Archivo**: `src/routes/blog/+page.svelte` (86 lineas)
- **Proposito**: Listado de articulos del blog. Lee los posts desde `src/lib/data/posts/index.ts`.
- **Archivo individual**: `src/routes/blog/[slug]/+page.svelte` (250 lineas) — renderiza el articulo segun slug. El loader `[slug]/+page.ts` busca el post en el array exportado por `posts/index.ts`.

### Compliance — `/compliance`
- **Archivo**: `src/routes/compliance/+page.svelte` (443 lineas)
- **Proposito**: Pagina de cumplimiento normativo. Detalla como Ethoz ayuda a cumplir la Ley 21.719 de Proteccion de Datos Personales. Es una pagina de conversion orientada a sostenedores preocupados por multas (hasta 20.000 UTM).

### Contacto — `/contact`
- **Archivo**: `src/routes/contact/+page.svelte` (224 lineas)
- **Proposito**: Formulario de contacto con validacion y reCAPTCHA. Guarda el lead en Supabase tabla `leads`. Activa la Edge Function `new-lead-notify`.

### Demo — `/demo` y `/demo/[rbd]`
- **Archivo base**: `src/routes/demo/+page.svelte` (251 lineas) — Formulario de busqueda de colegio para acceder al demo personalizado.
- **Archivo dinamico**: `src/routes/demo/[rbd]/+page.svelte` (476 lineas) — Demo interactivo personalizado por RBD (codigo del establecimiento). Carga datos del colegio desde `static/data/schools.json` usando el store `schools.svelte.ts`. Muestra mockup de la plataforma con datos reales del colegio.
- **Loader**: `src/routes/demo/[rbd]/+page.ts` — Busca el colegio por RBD y hace `prerender = false` para SSR dinamico.

### Features — `/features/*`
Cinco subpaginas de funcionalidades, cada una autocontenida:

| Ruta | Archivo | Lineas | Tema |
|------|---------|--------|------|
| `/features/access-control` | `features/access-control/+page.svelte` | 150 | Control de acceso por roles (portera, docente, directivo) |
| `/features/safe-pickups` | `features/safe-pickups/+page.svelte` | 157 | Retiros escolares seguros con QR y verificacion de identidad |
| `/features/smart-search` | `features/smart-search/+page.svelte` | 157 | Busqueda inteligente de alumnos, apoderados, autorizados |
| `/features/student-profile` | `features/student-profile/+page.svelte` | 180 | Perfil integral del alumno: historial, convivencia, autorizados |
| `/features/privacy-compliance` | `features/privacy-compliance/+page.svelte` | 157 | Cumplimiento Ley 21.719, privacidad por diseno, Art. 16 bis |

### Get Started — `/get-started`
- **Archivo**: `src/routes/get-started/+page.svelte` (252 lineas)
- **Proposito**: Pagina de onboarding inicial. Explica los primeros pasos para implementar Ethoz. CTA hacia `/schedule`.

### Integraciones — `/integrations`
- **Archivo**: `src/routes/integrations/+page.svelte` (222 lineas)
- **Proposito**: Muestra las integraciones disponibles (Napsis, Syscol, otros SGE) y como Ethoz complementa sistemas existentes sin reemplazarlos.

### Pitch — `/pitch`
- **Archivo**: `src/routes/pitch/+page.svelte` (1.418 lineas)
- **Proposito**: Presentacion tipo pitch con slides sincronizadas con audio. Es lo que en el proyecto se llama "video" — no es un elemento `<video>` sino slides navegables con narración. Usa los datos de `src/lib/data/pitch-slides.ts`.
- **Nota importante**: Cuando el equipo dice "el video", se refiere a esta pagina.

### Productos — `/productos`
- **Archivo**: `src/routes/productos/+page.svelte` (275 lineas)
- **Proposito**: Catalogo de productos y planes de Ethoz. Pricing y modulos disponibles.

### Agendar — `/schedule`
- **Archivo**: `src/routes/schedule/+page.svelte` (210 lineas)
- **Proposito**: Formulario de agendamiento integrado con Cal.com. Captura nombre, email, colegio, y redirige al calendario de Cal.com del usuario configurado en `PUBLIC_CAL_USERNAME`.

### Privacidad y Terminos — `/privacy`, `/terms`
- `src/routes/privacy/+page.svelte` (120 lineas) — Politica de privacidad de ETHOZ SpA.
- `src/routes/terms/+page.svelte` (109 lineas) — Terminos y condiciones.

### Sugerencias — `/suggestions`
- **Archivo**: `src/routes/suggestions/+page.svelte` (313 lineas)
- **Loader**: `src/routes/suggestions/+page.ts`
- **Proposito**: Formulario de sugerencias y feedback de usuarios del demo. Guarda en Supabase.

## Componentes compartidos

Ubicacion: `src/lib/components/`

| Componente | Lineas | Descripcion |
|-----------|--------|-------------|
| `NavBar.svelte` | 279 | Barra de navegacion principal. Links a todas las secciones publicas, boton de demo, tema claro/oscuro. Responsive con menu hamburguesa en movil. |
| `Footer.svelte` | 119 | Pie de pagina con links legales, RRSS (LinkedIn, Facebook, Instagram, YouTube, Google Business), datos de empresa (ETHOZ SpA, RUT 78.394.522-3). |
| `PitchModal.svelte` | 773 | Modal del pitch interactivo. Se abre desde varias paginas al hacer clic en "Ver presentacion". Contiene toda la logica de navegacion de slides y reproduccion de audio. |
| `FeedbackModal.svelte` | 93 | Modal para capturar feedback rapido. Usa el store `feedback.svelte.ts`. |
| `FeedbackOverlay.svelte` | — | Overlay persistente que muestra el FeedbackModal cuando el store lo activa. |
| `ui/button/` | — | Componente Button reutilizable con variantes (primary, secondary, ghost, destructive). |
| `ui/badge/` | — | Componente Badge para etiquetas de estado. |

## Stores de estado global

Ubicacion: `src/lib/stores/`

| Store | Lineas | Descripcion |
|-------|--------|-------------|
| `schools.svelte.ts` | — | Carga `static/data/schools.json` (generado por `process-schools.mjs`). Provee busqueda por nombre y RBD para la busqueda de la homepage y el demo. |
| `admin.svelte.ts` | 39 | Estado de autenticacion del admin. Wrappea Supabase Auth. Expone `login()`, `logout()`, `init()`, `authenticated`, y `user`. |
| `feedback.svelte.ts` | — | Controla visibilidad del FeedbackModal. |

## Utilidades relevantes para la landing

| Archivo | Lineas | Descripcion |
|---------|--------|-------------|
| `src/lib/config.ts` | 22 | Constantes globales: nombre de la empresa, URLs de RRSS, email de contacto. |
| `src/lib/utils/analytics.ts` | 13 | Wrapper de eventos para Microsoft Clarity. |
| `src/lib/utils/visitor.ts` | 42 | Detecta si el visitante ya estuvo en el sitio (localStorage). Usado para personalizar CTAs. |
| `src/lib/utils/device.ts` | — | Detecta tipo de dispositivo (movil, tablet, desktop). |
| `src/lib/utils/recaptcha.ts` | — | Verifica tokens de reCAPTCHA v3 en formularios. |
| `src/lib/utils/text.ts` | — | Helpers de formato de texto (capitalizar, truncar, etc). |
| `src/lib/sentry.ts` | — | Inicializacion de Sentry para monitoreo de errores en produccion. |

## Datos de contenido del blog

Ubicacion: `src/lib/data/posts/`

Cada archivo es un post exportado como objeto TypeScript con campos `slug`, `title`, `date`, `excerpt`, `content`, `tags`.

| Archivo | Tema |
|---------|------|
| `circular-n30-libro-clases-digital.ts` | Circular N°30 y libro de clases digital |
| `control-acceso-roles-seguridad-escolar.ts` | Control de acceso por roles |
| `crisis-convivencia-escolar-2025.ts` | Crisis de convivencia escolar 2025 |
| `excel-no-cumple-normativa-datos.ts` | Por que Excel no cumple la normativa |
| `gestion-escolar-vs-proteccion-escolar.ts` | Gestion vs proteccion escolar |
| `inteligencia-artificial-desercion-escolar.ts` | IA y desercion escolar |
| `ley-21719-que-deben-saber-los-colegios.ts` | Ley 21.719 explicada para colegios |
| `multas-proteccion-datos-sostenedores.ts` | Multas a sostenedores por datos |
| `ninguna-plataforma-cumple-ley-21719.ts` | Ninguna plataforma cumple aun |
| `privacidad-por-diseno-art-16-bis.ts` | Privacidad por diseno y Art. 16 bis |
| `reinicio-de-marzo-seguridad-escolar.ts` | Reinicio de marzo y seguridad escolar |
| `retiros-escolares-seguros-tecnologia.ts` | Retiros escolares seguros |
| `roadmap-ethoz-2026.ts` | Roadmap publico de Ethoz 2026 |
| `index.ts` | Re-exporta todos los posts como array ordenado por fecha |
| `types.ts` | Tipos TypeScript: `Post`, `PostMeta` |

## Internacionalizacion

Ubicacion: `src/lib/i18n/`

El sitio tiene soporte basico de i18n aunque actualmente solo se usa espanol:
- `index.svelte.ts` — Store reactivo del idioma activo
- `translations/es.ts` — Strings en espanol
- `translations/en.ts` — Strings en ingles (parcial)

## Comandos de desarrollo

```bash
# Iniciar servidor en el puerto configurado del proyecto
npm run dev -- --port 5177

# Build y preview
npm run build
npm run preview

# Tests unitarios
npm run test

# Linter y formato
npm run lint
npm run format
```
