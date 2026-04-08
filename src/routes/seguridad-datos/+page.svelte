<script lang="ts">
  import NavBar from '$lib/components/NavBar.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import { Button } from '$lib/components/ui/button';
  import { Badge } from '$lib/components/ui/badge';
  import { trackEvent } from '$lib/utils/analytics';
  import {
    ShieldCheck,
    Lock,
    Database,
    ArrowRight,
    CheckCircle,
    Eye,
    Server,
    Clock,
    Key,
    FileText,
    AlertTriangle,
    RefreshCw,
    Globe,
  } from '@lucide/svelte';

  $effect(() => {
    trackEvent('seo_page_viewed', { slug: 'seguridad-datos' });
  });

  const infraItems = [
    { name: 'Supabase (Postgres)', location: 'AWS São Paulo (sa-east-1)', role: 'Base de datos principal, Auth, Row-Level Security, Storage' },
    { name: 'Firebase Hosting', location: 'CDN global (Google)', role: 'Hosting del frontend, distribución de assets estáticos' },
    { name: 'Cloudflare', location: 'Red global edge', role: 'DNS, DDoS protection, WAF, TLS termination' },
  ];

  const complianceItems = [
    { label: 'Ley 21.719 by design', desc: 'Privacidad incorporada desde el diseño. Control de acceso, audit log y minimización de datos son nativos, no añadidos.' },
    { label: 'GDPR-compatible', desc: 'Derechos de acceso, rectificación, supresión y portabilidad implementados. Consentimiento granular y trazable.' },
    { label: 'Circular N°30', desc: 'Trazabilidad e integridad del libro de clases digital cumplidas mediante audit log inmutable y autenticación robusta.' },
    { label: 'SOC 2 roadmap', desc: 'Proceso de certificación SOC 2 Type II en planificación para 2026. Controles técnicos ya implementados.' },
  ];
</script>

<svelte:head>
  <title>Seguridad de datos en Ethoz — por diseño, no por parche | Ethoz</title>
  <meta name="description" content="Cómo Ethoz protege los datos de su colegio: TLS 1.3, cifrado at-rest, Row-Level Security, audit log, backups diarios y cumplimiento Ley 21.719 por diseño." />
  <meta property="og:title" content="Seguridad de datos en Ethoz — por diseño, no por parche" />
  <meta property="og:description" content="Cómo Ethoz protege los datos de su colegio: TLS 1.3, cifrado at-rest, Row-Level Security, audit log, backups diarios y Ley 21.719." />
  <meta property="og:type" content="article" />
  <meta property="og:url" content="https://ethoz.cl/seguridad-datos" />
  <meta name="twitter:card" content="summary_large_image" />
  <link rel="canonical" href="https://ethoz.cl/seguridad-datos" />
  {@html `<script type="application/ld+json">${JSON.stringify([
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "Seguridad de datos en Ethoz — por diseño, no por parche",
      "description": "Cómo Ethoz protege los datos de su colegio: TLS 1.3, cifrado at-rest, Row-Level Security, audit log, backups diarios y Ley 21.719.",
      "datePublished": "2026-04-07",
      "dateModified": "2026-04-07",
      "author": { "@type": "Organization", "name": "Ethoz" },
      "publisher": { "@type": "Organization", "name": "Ethoz", "logo": { "@type": "ImageObject", "url": "https://ethoz.cl/favicon.svg" }},
      "url": "https://ethoz.cl/seguridad-datos",
      "mainEntityOfPage": "https://ethoz.cl/seguridad-datos",
      "keywords": "seguridad datos ethoz, como protege ethoz datos, cifrado datos colegio, row level security educacion"
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Inicio", "item": "https://ethoz.cl/" },
        { "@type": "ListItem", "position": 2, "name": "Seguridad de datos", "item": "https://ethoz.cl/seguridad-datos" }
      ]
    }
  ])}</script>`}
</svelte:head>

<main class="min-h-screen bg-background">
  <NavBar />

  <!-- HERO -->
  <section class="pt-24 pb-16 sm:pt-32 sm:pb-20 bg-secondary">
    <div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
      <div class="flex items-center gap-2 mb-4">
        <Badge variant="secondary" class="text-xs font-semibold uppercase tracking-wide">Seguridad técnica</Badge>
        <Badge variant="outline" class="text-xs">Por diseño</Badge>
      </div>
      <div class="flex items-center gap-3 mb-4">
        <ShieldCheck class="size-8 shrink-0 text-primary" />
        <h1 class="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
          Seguridad de datos en Ethoz
        </h1>
      </div>
      <p class="text-xl text-muted-foreground leading-relaxed max-w-3xl">
        Por diseño, no por parche. La seguridad en Ethoz no es una capa añadida sobre el sistema: es la base sobre la que está construido. Desde el cifrado hasta el audit log, cada decisión de arquitectura tiene un fundamento en la protección de los datos de su colegio.
      </p>
      <div class="mt-8 flex flex-wrap gap-3">
        {#each ['TLS 1.3', 'Cifrado at-rest', 'Row-Level Security', 'Audit log inmutable', 'JWT + sesiones con expiración', 'Backups diarios'] as tag}
          <span class="rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">{tag}</span>
        {/each}
      </div>
    </div>
  </section>

  <!-- TOC -->
  <section class="py-10 border-b border-border bg-background">
    <div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
      <p class="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">Contenido</p>
      <nav class="grid gap-2 sm:grid-cols-2">
        {#each [
          ['#cifrado', '1. Cifrado en tránsito y at-rest'],
          ['#rls', '2. Row-Level Security (RLS)'],
          ['#autenticacion', '3. Autenticación y sesiones'],
          ['#audit-log', '4. Audit log'],
          ['#aislamiento', '5. Aislamiento por colegio'],
          ['#respaldo', '6. Respaldo y recuperación'],
          ['#infraestructura', '7. Infraestructura'],
          ['#cumplimiento', '8. Cumplimiento normativo'],
          ['#divulgacion', '9. Divulgación responsable'],
        ] as [href, label]}
          <a {href} class="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors">
            <ArrowRight class="size-3.5 shrink-0 text-primary" />
            {label}
          </a>
        {/each}
      </nav>
    </div>
  </section>

  <div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16 space-y-20">

    <!-- CIFRADO -->
    <section id="cifrado">
      <div class="flex items-center gap-3 mb-6">
        <Lock class="size-6 shrink-0 text-primary" />
        <h2 class="text-2xl font-bold text-foreground">Cifrado en tránsito y at-rest</h2>
      </div>
      <div class="grid gap-4 sm:grid-cols-2">
        <div class="rounded-xl border border-border bg-card p-5">
          <div class="flex items-center gap-2 mb-3">
            <Globe class="size-5 shrink-0 text-primary" />
            <h3 class="font-semibold text-foreground">En tránsito: TLS 1.3</h3>
          </div>
          <p class="text-sm text-muted-foreground leading-relaxed">
            Toda comunicación entre el navegador del usuario y los servidores de Ethoz utiliza <strong class="text-foreground">TLS 1.3</strong>, el protocolo de cifrado en tránsito más moderno disponible. TLS 1.3 elimina vulnerabilidades presentes en versiones anteriores y reduce la latencia de handshake.
          </p>
          <p class="mt-3 text-sm text-muted-foreground">
            Cloudflare actúa como capa de terminación TLS, con certificados gestionados automáticamente y renovación antes de vencimiento.
          </p>
        </div>
        <div class="rounded-xl border border-border bg-card p-5">
          <div class="flex items-center gap-2 mb-3">
            <Database class="size-5 shrink-0 text-primary" />
            <h3 class="font-semibold text-foreground">At-rest: AES-256</h3>
          </div>
          <p class="text-sm text-muted-foreground leading-relaxed">
            Los datos almacenados en la base de datos Postgres de Supabase están cifrados en reposo mediante <strong class="text-foreground">AES-256</strong>. Las claves de cifrado son gestionadas por AWS KMS (Key Management Service) en la región São Paulo.
          </p>
          <p class="mt-3 text-sm text-muted-foreground">
            Esto garantiza que un acceso físico no autorizado al hardware del servidor no permita leer los datos en texto plano.
          </p>
        </div>
      </div>
    </section>

    <!-- RLS -->
    <section id="rls">
      <div class="flex items-center gap-3 mb-6">
        <Key class="size-6 shrink-0 text-primary" />
        <h2 class="text-2xl font-bold text-foreground">Row-Level Security (RLS)</h2>
      </div>
      <p class="text-muted-foreground leading-relaxed mb-6">
        Row-Level Security es el mecanismo de control de acceso más granular disponible en bases de datos relacionales. En Ethoz, cada consulta a la base de datos es evaluada por una política RLS antes de retornar cualquier resultado.
      </p>
      <div class="rounded-xl border border-primary/20 bg-primary/5 p-5 mb-6">
        <p class="text-sm font-semibold text-foreground mb-3">¿Cómo funciona en la práctica?</p>
        <div class="space-y-2.5 text-sm text-muted-foreground">
          <div class="flex gap-2"><CheckCircle class="size-4 shrink-0 text-primary mt-0.5" /><span>Un docente ejecuta una consulta para ver asistencia — RLS retorna solo los registros de sus propios cursos.</span></div>
          <div class="flex gap-2"><CheckCircle class="size-4 shrink-0 text-primary mt-0.5" /><span>Un inspector consulta asistencia global — RLS retorna datos del establecimiento completo, sin informes psicológicos.</span></div>
          <div class="flex gap-2"><CheckCircle class="size-4 shrink-0 text-primary mt-0.5" /><span>Un sostenedor consulta métricas — RLS retorna datos agregados de todos sus colegios, sin datos individuales de estudiantes.</span></div>
          <div class="flex gap-2"><CheckCircle class="size-4 shrink-0 text-primary mt-0.5" /><span>Una solicitud sin autenticación válida — RLS retorna cero filas, independientemente de la tabla consultada.</span></div>
        </div>
      </div>
      <p class="text-muted-foreground leading-relaxed text-sm">
        Esta arquitectura garantiza el principio de <strong class="text-foreground">mínimo privilegio</strong> exigido implícitamente por la Ley 21.719 y explícitamente por las buenas prácticas de protección de datos.
      </p>
    </section>

    <!-- AUTENTICACIÓN -->
    <section id="autenticacion">
      <div class="flex items-center gap-3 mb-6">
        <Lock class="size-6 shrink-0 text-primary" />
        <h2 class="text-2xl font-bold text-foreground">Autenticación y sesiones</h2>
      </div>
      <div class="space-y-4">
        {#each [
          {
            title: 'Supabase Auth con JWT',
            body: 'La autenticación en Ethoz usa Supabase Auth, que emite JSON Web Tokens (JWT) firmados con claves RS256. Cada token contiene el identificador del usuario y su rol, y es verificado por RLS en cada consulta.',
            icon: Key,
          },
          {
            title: 'Sesiones con expiración automática',
            body: 'Los tokens de acceso tienen expiración corta (1 hora por defecto). Los refresh tokens permiten renovación silenciosa mientras la sesión está activa, pero se invalidan al cerrar sesión explícitamente o tras un período de inactividad.',
            icon: Clock,
          },
          {
            title: 'Rotación de tokens',
            body: 'Cada renovación de sesión genera un nuevo refresh token e invalida el anterior. Esto limita el impacto de un token comprometido: el atacante tiene una ventana de uso limitada.',
            icon: RefreshCw,
          },
          {
            title: 'Multi-factor authentication (roadmap)',
            body: 'MFA mediante TOTP (Google Authenticator, Authy) está en el roadmap para cuentas de directivos y sostenedores. Supabase Auth soporta MFA nativamente.',
            icon: ShieldCheck,
          },
        ] as item}
          <div class="rounded-xl border border-border bg-card p-5">
            <div class="flex items-center gap-2.5 mb-2">
              <svelte:component this={item.icon} class="size-5 shrink-0 text-primary" />
              <h3 class="font-semibold text-foreground">{item.title}</h3>
            </div>
            <p class="text-sm text-muted-foreground leading-relaxed">{item.body}</p>
          </div>
        {/each}
      </div>
    </section>

    <!-- AUDIT LOG -->
    <section id="audit-log">
      <div class="flex items-center gap-3 mb-6">
        <Eye class="size-6 shrink-0 text-primary" />
        <h2 class="text-2xl font-bold text-foreground">Audit log</h2>
      </div>
      <p class="text-muted-foreground leading-relaxed mb-6">
        Cada acción sensible en Ethoz queda registrada en un log de auditoría inmutable. No es posible eliminar entradas del audit log sin acceso directo a la base de datos con privilegios de administrador.
      </p>
      <div class="rounded-xl border border-border bg-card overflow-hidden mb-6">
        <div class="px-5 py-3 bg-secondary border-b border-border">
          <p class="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Estructura de una entrada del audit log</p>
        </div>
        <div class="p-5">
          <pre class="text-xs text-muted-foreground leading-relaxed overflow-x-auto"><code>{`{
  "id":         "uuid",
  "timestamp":  "2026-04-07T14:32:11.000Z",
  "user_id":    "uuid-del-usuario",
  "user_role":  "docente",
  "action":     "UPDATE",
  "resource":   "libro_clases.asistencia",
  "record_id":  "uuid-del-registro",
  "old_value":  { "presente": true },
  "new_value":  { "presente": false },
  "ip_address": "192.168.1.xxx",
  "user_agent": "Mozilla/5.0 ..."
}`}</code></pre>
        </div>
      </div>
      <div class="grid gap-3 sm:grid-cols-3">
        {#each [
          { label: 'Qué acciones se registran', items: ['Modificaciones al libro de clases', 'Retiros de estudiantes', 'Cambios de contraseña', 'Acceso a datos sensibles', 'Exportaciones de datos'] },
          { label: 'Quién puede consultar el log', items: ['Director del establecimiento', 'Sostenedor (vista agregada)', 'Autoridades de fiscalización', 'Ethoz (soporte técnico)'] },
          { label: 'Retención', items: ['Mínimo 5 años por defecto', 'Configurable por sostenedor', 'Cumple plazos Ley 21.719', 'Exportable en CSV/JSON'] },
        ] as auditItem}
          <div class="rounded-xl border border-border bg-card p-4">
            <p class="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">{auditItem.label}</p>
            <ul class="space-y-1.5">
              {#each auditItem.items as item}
                <li class="flex gap-2 text-sm text-muted-foreground">
                  <CheckCircle class="size-4 shrink-0 text-primary mt-0.5" />
                  {item}
                </li>
              {/each}
            </ul>
          </div>
        {/each}
      </div>
    </section>

    <!-- AISLAMIENTO -->
    <section id="aislamiento">
      <div class="flex items-center gap-3 mb-6">
        <Database class="size-6 shrink-0 text-primary" />
        <h2 class="text-2xl font-bold text-foreground">Aislamiento de datos por colegio</h2>
      </div>
      <p class="text-muted-foreground leading-relaxed mb-4">
        En Ethoz, cada colegio y cada sede tienen sus datos aislados mediante políticas RLS. No existe mecanismo por el cual un usuario de un colegio pueda acceder a datos de otro establecimiento, incluso si ambos pertenecen al mismo sostenedor.
      </p>
      <div class="rounded-xl border border-border bg-card p-5">
        <p class="text-sm font-semibold text-foreground mb-3">Jerarquía de aislamiento</p>
        <div class="space-y-2 text-sm text-muted-foreground">
          <div class="flex items-center gap-3">
            <span class="w-24 shrink-0 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Sostenedor</span>
            <div class="flex-1 h-px bg-border"></div>
            <span class="text-xs text-muted-foreground">ve métricas agregadas de todos sus colegios</span>
          </div>
          <div class="flex items-center gap-3 pl-4">
            <span class="w-24 shrink-0 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Colegio</span>
            <div class="flex-1 h-px bg-border"></div>
            <span class="text-xs text-muted-foreground">ve solo sus propios datos, sin cruce con otros</span>
          </div>
          <div class="flex items-center gap-3 pl-8">
            <span class="w-24 shrink-0 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Sede</span>
            <div class="flex-1 h-px bg-border"></div>
            <span class="text-xs text-muted-foreground">para sostenedores multi-sede, cada sede es un ámbito independiente</span>
          </div>
          <div class="flex items-center gap-3 pl-12">
            <span class="w-24 shrink-0 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Rol</span>
            <div class="flex-1 h-px bg-border"></div>
            <span class="text-xs text-muted-foreground">cada usuario accede solo a lo que su rol permite dentro de su colegio</span>
          </div>
        </div>
      </div>
    </section>

    <!-- RESPALDO -->
    <section id="respaldo">
      <div class="flex items-center gap-3 mb-6">
        <RefreshCw class="size-6 shrink-0 text-primary" />
        <h2 class="text-2xl font-bold text-foreground">Respaldo y recuperación</h2>
      </div>
      <div class="grid gap-4 sm:grid-cols-2">
        {#each [
          { title: 'Backups diarios automáticos', desc: 'Supabase realiza snapshots completos de la base de datos cada 24 horas. Los backups se almacenan en S3 con cifrado AES-256 y replicación en múltiples zonas de disponibilidad.' },
          { title: 'Point-in-time recovery', desc: 'Es posible restaurar la base de datos a cualquier punto en el tiempo dentro de la ventana de retención (hasta 30 días en el plan actual). Crítico para recuperación ante ransomware o eliminación accidental.' },
          { title: 'RTO y RPO', desc: 'Recovery Time Objective (RTO): menos de 4 horas para incidentes mayores. Recovery Point Objective (RPO): máximo 24 horas de pérdida de datos (un ciclo de backup).' },
          { title: 'Plan de continuidad', desc: 'Ethoz mantiene un plan de recuperación ante desastres documentado. Los colegios son notificados ante cualquier incidente que afecte la disponibilidad del servicio.' },
        ] as rtoItem}
          <div class="rounded-xl border border-border bg-card p-5">
            <div class="flex items-center gap-2 mb-2">
              <CheckCircle class="size-4 shrink-0 text-primary" />
              <h3 class="font-semibold text-foreground">{rtoItem.title}</h3>
            </div>
            <p class="text-sm text-muted-foreground leading-relaxed">{rtoItem.desc}</p>
          </div>
        {/each}
      </div>
    </section>

    <!-- INFRAESTRUCTURA -->
    <section id="infraestructura">
      <div class="flex items-center gap-3 mb-6">
        <Server class="size-6 shrink-0 text-primary" />
        <h2 class="text-2xl font-bold text-foreground">Infraestructura</h2>
      </div>
      <p class="text-muted-foreground leading-relaxed mb-6">
        Ethoz opera sobre infraestructura de clase empresarial, seleccionada por su madurez en seguridad, disponibilidad geográfica en la región y compliance con estándares internacionales.
      </p>
      <div class="rounded-xl border border-border bg-card overflow-hidden">
        <div class="px-5 py-3 bg-secondary border-b border-border grid grid-cols-3 gap-3">
          <p class="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Componente</p>
          <p class="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Ubicación</p>
          <p class="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Función</p>
        </div>
        {#each infraItems as item, i}
          <div class="px-5 py-4 grid grid-cols-3 gap-3 items-start {i !== infraItems.length - 1 ? 'border-b border-border' : ''}">
            <p class="text-sm font-semibold text-foreground">{item.name}</p>
            <p class="text-sm text-muted-foreground">{item.location}</p>
            <p class="text-sm text-muted-foreground">{item.role}</p>
          </div>
        {/each}
      </div>
      <p class="mt-4 text-sm text-muted-foreground">
        Los datos de los colegios chilenos se almacenan en la región <strong class="text-foreground">AWS São Paulo</strong>, la más cercana a Chile disponible en Supabase y con tiempos de latencia óptimos para usuarios en el país.
      </p>
    </section>

    <!-- CUMPLIMIENTO -->
    <section id="cumplimiento">
      <div class="flex items-center gap-3 mb-6">
        <FileText class="size-6 shrink-0 text-primary" />
        <h2 class="text-2xl font-bold text-foreground">Cumplimiento normativo</h2>
      </div>
      <div class="space-y-3">
        {#each complianceItems as item}
          <div class="rounded-xl border border-border bg-card p-5">
            <div class="flex gap-3">
              <CheckCircle class="size-5 shrink-0 text-primary mt-0.5" />
              <div>
                <p class="font-semibold text-foreground mb-1">{item.label}</p>
                <p class="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            </div>
          </div>
        {/each}
      </div>
    </section>

    <!-- DIVULGACIÓN RESPONSABLE -->
    <section id="divulgacion">
      <div class="flex items-center gap-3 mb-6">
        <AlertTriangle class="size-6 shrink-0 text-primary" />
        <h2 class="text-2xl font-bold text-foreground">Divulgación responsable</h2>
      </div>
      <p class="text-muted-foreground leading-relaxed mb-4">
        Si descubre una vulnerabilidad de seguridad en Ethoz, le pedimos que la reporte de forma responsable antes de divulgarla públicamente.
      </p>
      <div class="rounded-xl border border-border bg-card p-5">
        <div class="grid gap-4 sm:grid-cols-2">
          <div>
            <p class="text-sm font-semibold text-foreground mb-2">Cómo reportar</p>
            <p class="text-sm text-muted-foreground">Envíe un correo a <strong class="text-foreground">security@ethoz.cl</strong> con descripción del hallazgo, pasos para reproducirlo y el impacto estimado.</p>
          </div>
          <div>
            <p class="text-sm font-semibold text-foreground mb-2">Nuestro compromiso</p>
            <ul class="space-y-1.5 text-sm text-muted-foreground">
              <li class="flex gap-2"><CheckCircle class="size-4 shrink-0 text-primary mt-0.5" />Respuesta en máximo 48 horas</li>
              <li class="flex gap-2"><CheckCircle class="size-4 shrink-0 text-primary mt-0.5" />Comunicación del estado de la corrección</li>
              <li class="flex gap-2"><CheckCircle class="size-4 shrink-0 text-primary mt-0.5" />Reconocimiento público (si el investigador lo desea)</li>
              <li class="flex gap-2"><CheckCircle class="size-4 shrink-0 text-primary mt-0.5" />Bug bounty en evaluación para 2026</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

  </div>

  <!-- CTA -->
  <section class="py-16 sm:py-20 bg-secondary">
    <div class="mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8">
      <ShieldCheck class="mx-auto size-10 text-primary mb-4" />
      <h2 class="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        ¿Quiere revisar el modelo de seguridad en detalle?
      </h2>
      <p class="mt-4 text-base text-muted-foreground">
        Nuestro equipo puede presentarle la arquitectura de seguridad, responder preguntas técnicas y evaluar la compatibilidad con los requisitos específicos de su colegio.
      </p>
      <div class="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
        <Button size="xl" href="/demo" class="shadow-lg shadow-primary/25">
          Solicitar sesión técnica
          <ArrowRight class="size-4" />
        </Button>
        <a href="/ley-21719" class="text-sm font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline transition-colors">
          Ver guía Ley 21.719
        </a>
      </div>
    </div>
  </section>

  <section class="py-12 bg-background border-t border-border">
    <div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
      <p class="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-5">También puede interesarle</p>
      <div class="flex flex-wrap gap-3">
        {#each [
          { href: '/ley-21719', label: 'Ley 21.719 — guía completa' },
          { href: '/circular-30', label: 'Circular N°30 — libro de clases digital' },
          { href: '/glosario', label: 'Glosario normativo' },
          { href: '/comparativa', label: 'Comparativa de plataformas' },
        ] as item}
          <a href={item.href} class="rounded-full border border-border bg-card px-4 py-1.5 text-sm text-muted-foreground hover:border-primary/40 hover:text-foreground transition-colors">
            {item.label}
          </a>
        {/each}
      </div>
    </div>
  </section>

  <Footer />
</main>
