<script lang="ts">
  import NavBar from '$lib/components/NavBar.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import { Button } from '$lib/components/ui/button';
  import { Badge } from '$lib/components/ui/badge';
  import { trackEvent } from '$lib/utils/analytics';
  import {
    ShieldCheck,
    CheckCircle,
    XCircle,
    ArrowRight,
    Lock,
    Database,
    FileText,
    Clock,
    AlertTriangle,
    Users,
    Eye,
  } from '@lucide/svelte';

  $effect(() => {
    trackEvent('seo_page_viewed', { slug: 'circular-30' });
  });

  const requirements = [
    { req: 'Audit log inmutable por registro', why: 'Trazabilidad exigida — quién modificó qué y cuándo', met: true },
    { req: 'Autenticación con Clave Única del Estado', why: 'Vincula cada acción al RUT del docente', met: true },
    { req: 'Control de acceso por rol', why: 'Docente ve su libro; inspector ve asistencia global', met: true },
    { req: 'Respaldo automático diario', why: 'Disponibilidad garantizada para fiscalización', met: true },
    { req: 'Inmutabilidad retroactiva', why: 'Registros no modificables sin traza visible', met: true },
    { req: 'Exportación para Superintendencia', why: 'Acceso on-demand para fiscalizadores', met: true },
  ];

  const nonCompliant = [
    { system: 'Google Sheets compartido', reason: 'Sin trazabilidad, cualquier editor puede modificar retroactivamente sin rastro' },
    { system: 'PDF firmado en servidor local', reason: 'Documento estático, no permite consulta dinámica ni audit log' },
    { system: 'ERP escolar sin módulo de trazabilidad', reason: 'Registra asistencia pero no el historial de modificaciones por entrada' },
    { system: 'Planilla Excel en red compartida', reason: 'Sin control de versiones, sin autenticación individual por registro' },
  ];

  const selfAssessment = [
    { question: '¿Puede saber quién modificó una nota específica y cuándo?', critical: true },
    { question: '¿Puede demostrar que un registro de asistencia no fue alterado retroactivamente?', critical: true },
    { question: '¿Está integrado con Clave Única u otro mecanismo de verificación de identidad?', critical: true },
    { question: '¿Puede exportar el libro de clases completo para la Superintendencia en menos de 24 horas?', critical: false },
    { question: '¿Tiene respaldos automáticos con recuperación point-in-time?', critical: false },
    { question: '¿Cada docente accede solo a su propio libro de clases, no al de colegas?', critical: true },
    { question: '¿Los apoderados pueden solicitar el historial de su hijo y recibirlo en 30 días hábiles?', critical: false },
  ];
</script>

<svelte:head>
  <title>Circular N°30: libro de clases digital obligatorio — guía completa | Ethoz</title>
  <meta name="description" content="Circular N°30 libro de clases digital: qué exige, qué sistemas cumplen, autodiagnóstico para colegios chilenos. Trazabilidad, Clave Única y Ley 21.719." />
  <meta property="og:title" content="Circular N°30: libro de clases digital — Ethoz" />
  <meta property="og:description" content="Circular N°30 libro de clases digital: qué exige, qué sistemas cumplen, autodiagnóstico para colegios chilenos." />
  <meta property="og:type" content="article" />
  <meta property="og:url" content="https://ethoz.cl/circular-30" />
  <meta name="twitter:card" content="summary_large_image" />
  <link rel="canonical" href="https://ethoz.cl/circular-30" />
  {@html `<script type="application/ld+json">${JSON.stringify([
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "Circular N°30: libro de clases digital obligatorio en Chile",
      "description": "Circular N°30 libro de clases digital: qué exige, qué sistemas cumplen, autodiagnóstico para colegios chilenos.",
      "datePublished": "2026-04-07",
      "dateModified": "2026-04-07",
      "author": { "@type": "Organization", "name": "Ethoz" },
      "publisher": { "@type": "Organization", "name": "Ethoz", "logo": { "@type": "ImageObject", "url": "https://ethoz.cl/favicon.svg" }},
      "url": "https://ethoz.cl/circular-30",
      "mainEntityOfPage": "https://ethoz.cl/circular-30",
      "keywords": "circular 30, libro de clases digital chile, libro digital colegio, superintendencia educacion"
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Inicio", "item": "https://ethoz.cl/" },
        { "@type": "ListItem", "position": 2, "name": "Circular N°30", "item": "https://ethoz.cl/circular-30" }
      ]
    }
  ])}</script>`}
</svelte:head>

<main class="min-h-screen bg-background">
  <NavBar />

  <!-- ══════════════════════════════════════
       HERO
       ══════════════════════════════════════ -->
  <section class="pt-24 pb-16 sm:pt-32 sm:pb-20 bg-secondary">
    <div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
      <div class="flex items-center gap-2 mb-4">
        <Badge variant="secondary" class="text-xs font-semibold uppercase tracking-wide">Normativa escolar</Badge>
        <Badge variant="outline" class="text-xs">Superintendencia de Educación</Badge>
      </div>
      <h1 class="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
        Circular N°30: libro de clases digital obligatorio
      </h1>
      <p class="mt-6 text-xl text-muted-foreground leading-relaxed max-w-3xl">
        La Circular N°30 de la Superintendencia de Educación formaliza los requisitos que debe cumplir cualquier libro de clases digital en Chile. Trazabilidad, autenticación con Clave Única e integración con la Ley 21.719 son los ejes centrales.
      </p>
      <div class="mt-8 flex flex-wrap gap-6 text-sm">
        <div class="flex items-center gap-2 text-muted-foreground">
          <Clock class="size-4 shrink-0 text-primary" />
          <span>6 min de lectura</span>
        </div>
        <div class="flex items-center gap-2 text-muted-foreground">
          <FileText class="size-4 shrink-0 text-primary" />
          <span>Superintendencia de Educación</span>
        </div>
      </div>
    </div>
  </section>

  <div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16 space-y-20">

    <!-- ══════════════════════════════════════
         SECCIÓN 1: QUÉ EXIGE
         ══════════════════════════════════════ -->
    <section id="que-exige">
      <div class="flex items-center gap-3 mb-6">
        <FileText class="size-6 shrink-0 text-primary" />
        <h2 class="text-2xl font-bold text-foreground">¿Qué exige la Circular N°30?</h2>
      </div>
      <p class="text-muted-foreground leading-relaxed mb-6">
        La Circular N°30 de la Superintendencia de Educación no prescribe una plataforma específica, pero establece estándares técnicos precisos que cualquier sistema de libro de clases digital debe cumplir. Los cuatro pilares son:
      </p>
      <div class="grid gap-4 sm:grid-cols-2">
        {#each [
          {
            title: 'Integridad de datos',
            desc: 'El sistema debe garantizar que los registros no puedan modificarse retroactivamente sin dejar traza. Un registro de asistencia marcado el lunes no puede desaparecer el martes sin que esa eliminación quede documentada.',
            icon: Database,
          },
          {
            title: 'Trazabilidad completa',
            desc: 'Cada acción sobre el libro —creación, modificación, eliminación, consulta— debe quedar asociada a un usuario identificado, con marca de tiempo exacta. No basta saber que algo cambió: el sistema debe registrar quién, cuándo y desde qué dispositivo.',
            icon: Eye,
          },
          {
            title: 'Verificación de identidad',
            desc: 'La circular exige mecanismos robustos de autenticación. La integración con Clave Única del Estado es el estándar de referencia, porque vincula la acción al RUT del docente de forma auditable ante cualquier ente fiscalizador.',
            icon: Users,
          },
          {
            title: 'Disponibilidad y respaldo',
            desc: 'Los registros deben estar disponibles para consulta por la Superintendencia en el momento que se requiera, con respaldos que garanticen continuidad ante fallas técnicas.',
            icon: ShieldCheck,
          },
        ] as item}
          <div class="rounded-xl border border-border bg-card p-5">
            <div class="flex items-center gap-2.5 mb-3">
              <item.icon class="size-5 shrink-0 text-primary" />
              <h3 class="font-semibold text-foreground">{item.title}</h3>
            </div>
            <p class="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
          </div>
        {/each}
      </div>
      <div class="mt-6 rounded-xl border border-primary/20 bg-primary/5 p-5">
        <p class="text-sm font-semibold text-foreground mb-2">Por qué la trazabilidad importa en la práctica</p>
        <p class="text-sm text-muted-foreground leading-relaxed mb-3">
          La Superintendencia no solo verifica que los datos existan: verifica que sean confiables. Sin trazabilidad, un libro de clases no puede responder preguntas críticas:
        </p>
        <ul class="space-y-1.5 text-sm text-muted-foreground">
          <li class="flex gap-2"><ArrowRight class="size-4 shrink-0 text-primary mt-0.5" /><span>Accidente escolar: ¿estaba el alumno presente? ¿Se registró en tiempo real?</span></li>
          <li class="flex gap-2"><ArrowRight class="size-4 shrink-0 text-primary mt-0.5" /><span>Reclamo de apoderado: ¿cuándo se ingresó la nota? ¿Fue modificada y por quién?</span></li>
          <li class="flex gap-2"><ArrowRight class="size-4 shrink-0 text-primary mt-0.5" /><span>Denuncia por maltrato: ¿los registros de conducta son contemporáneos a los hechos?</span></li>
        </ul>
      </div>
    </section>

    <!-- ══════════════════════════════════════
         SECCIÓN 2: QUÉ SISTEMAS CUMPLEN
         ══════════════════════════════════════ -->
    <section id="que-sistemas-cumplen">
      <div class="flex items-center gap-3 mb-6">
        <CheckCircle class="size-6 shrink-0 text-primary" />
        <h2 class="text-2xl font-bold text-foreground">¿Qué sistemas cumplen los requisitos?</h2>
      </div>
      <p class="text-muted-foreground leading-relaxed mb-6">
        Lista de verificación técnica. Un sistema que no cumpla los primeros cuatro requisitos marcados como críticos no cumple la Circular N°30, independientemente de otras funcionalidades que ofrezca.
      </p>
      <div class="rounded-xl border border-border bg-card overflow-hidden">
        <div class="px-5 py-3 bg-secondary border-b border-border grid grid-cols-12 gap-3">
          <p class="col-span-5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Requisito</p>
          <p class="col-span-5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Por qué importa</p>
          <p class="col-span-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground text-center">Ethoz</p>
        </div>
        {#each requirements as r, i}
          <div class="px-5 py-3.5 grid grid-cols-12 gap-3 items-start {i !== requirements.length - 1 ? 'border-b border-border' : ''}">
            <p class="col-span-5 text-sm text-foreground">{r.req}</p>
            <p class="col-span-5 text-sm text-muted-foreground">{r.why}</p>
            <div class="col-span-2 flex justify-center">
              {#if r.met}
                <CheckCircle class="size-5 text-success" />
              {:else}
                <XCircle class="size-5 text-destructive" />
              {/if}
            </div>
          </div>
        {/each}
      </div>

      <div class="mt-8">
        <p class="font-semibold text-foreground mb-4">Sistemas que NO cumplen la Circular N°30</p>
        <div class="space-y-3">
          {#each nonCompliant as nc}
            <div class="flex gap-3 rounded-xl border border-border bg-card p-4">
              <XCircle class="size-5 shrink-0 text-destructive mt-0.5" />
              <div>
                <p class="text-sm font-semibold text-foreground">{nc.system}</p>
                <p class="text-sm text-muted-foreground mt-0.5">{nc.reason}</p>
              </div>
            </div>
          {/each}
        </div>
      </div>
    </section>

    <!-- ══════════════════════════════════════
         SECCIÓN 3: AUTODIAGNÓSTICO
         ══════════════════════════════════════ -->
    <section id="autodiagnostico">
      <div class="flex items-center gap-3 mb-6">
        <AlertTriangle class="size-6 shrink-0 text-primary" />
        <h2 class="text-2xl font-bold text-foreground">¿Cumple su libro de clases actual?</h2>
      </div>
      <p class="text-muted-foreground leading-relaxed mb-6">
        Responda estas preguntas sobre el sistema que usa hoy. Si no puede responder "sí" con certeza a las marcadas como críticas, su libro de clases no cumple la Circular N°30.
      </p>
      <div class="rounded-xl border border-border bg-card overflow-hidden">
        {#each selfAssessment as item, i}
          <div class="flex items-start gap-3 px-5 py-3.5 {i !== selfAssessment.length - 1 ? 'border-b border-border' : ''}">
            <div class="mt-0.5 size-5 shrink-0 rounded border-2 {item.critical ? 'border-destructive/20/60' : 'border-muted-foreground/30'}"></div>
            <div class="flex-1 flex items-start justify-between gap-3">
              <p class="text-sm text-foreground">{item.question}</p>
              {#if item.critical}
                <Badge variant="outline" class="shrink-0 text-xs border-destructive/20 text-destructive">Crítico</Badge>
              {/if}
            </div>
          </div>
        {/each}
      </div>
      <p class="mt-4 text-sm text-muted-foreground">
        Si respondió "no" o "no sé" a cualquier pregunta crítica, su establecimiento está expuesto ante una visita de la Superintendencia. <a href="/demo" class="text-primary underline-offset-2 hover:underline">Solicite una revisión gratuita con Ethoz</a>.
      </p>
    </section>

    <!-- ══════════════════════════════════════
         SECCIÓN 4: INTEGRACIÓN CON ETHOZ
         ══════════════════════════════════════ -->
    <section id="integracion-ethoz">
      <div class="flex items-center gap-3 mb-6">
        <ShieldCheck class="size-6 shrink-0 text-primary" />
        <h2 class="text-2xl font-bold text-foreground">Integración con Ethoz</h2>
      </div>
      <p class="text-muted-foreground leading-relaxed mb-6">
        Ethoz no reemplaza el sistema de gestión que usa su colegio hoy. Agrega la capa de trazabilidad, control de acceso y cumplimiento normativo que le falta al libro de clases existente.
      </p>
      <div class="grid gap-4 sm:grid-cols-2">
        {#each [
          { title: 'Audit log nativo', desc: 'Cada registro pedagógico queda inmutablemente documentado: quién lo creó, quién lo modificó y cuándo. Compatible con los requisitos de la Circular N°30.' },
          { title: 'Control de acceso granular', desc: 'Los docentes acceden solo a su propio libro de clases. Los inspectores y directivos ven solo lo que su rol permite. Sin excepciones.' },
          { title: 'Integración con sistemas actuales', desc: 'Ethoz se conecta con Napsis, Syscol y Lirmi mediante API. No migra datos — los complementa con la capa de seguridad que falta.' },
          { title: 'Cumplimiento cruzado Ley 21.719', desc: 'Cada dato del libro de clases es un dato personal protegido por la Ley 21.719. Ethoz garantiza que ambas normativas se cumplan simultáneamente.' },
        ] as item}
          <div class="rounded-xl border border-border bg-card p-5">
            <div class="flex items-center gap-2 mb-2">
              <CheckCircle class="size-4 shrink-0 text-primary" />
              <h3 class="font-semibold text-foreground">{item.title}</h3>
            </div>
            <p class="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
          </div>
        {/each}
      </div>
    </section>

  </div>

  <!-- CTA -->
  <section class="py-16 sm:py-20 bg-secondary">
    <div class="mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8">
      <Lock class="mx-auto size-10 text-primary mb-4" />
      <h2 class="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        ¿Cumple su libro de clases la Circular N°30?
      </h2>
      <p class="mt-4 text-base text-muted-foreground">
        Revisamos su sistema actual y le entregamos un informe de brechas sin costo. En 30 minutos sabe exactamente dónde está.
      </p>
      <div class="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
        <Button size="xl" href="/demo" class="shadow-lg shadow-primary/25">
          Solicitar revisión gratuita
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
          { href: '/seguridad-datos', label: 'Seguridad de datos en Ethoz' },
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
