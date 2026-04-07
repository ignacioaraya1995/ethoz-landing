<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import Footer from '$lib/components/Footer.svelte';
  import NavBar from '$lib/components/NavBar.svelte';
  import { Badge } from '$lib/components/ui/badge';
  import { t, type TranslationKey } from '$lib/i18n/index.svelte';
  import { trackEvent } from '$lib/utils/analytics';
  import { CONTACT } from '$lib/config';
  import { slide } from 'svelte/transition';
  import { env } from '$env/dynamic/public';
  import PitchModal from '$lib/components/PitchModal.svelte';
  import {
    Shield,
    Users,
    Bell,
    FileCheck,
    Clock,
    ArrowRight,
    Check,
    ChevronRight,
    Lock,
    Zap,
    Building,
    UserCheck,
    ClipboardList,
    AlertTriangle,
    Eye,
    Search,
    Fingerprint,
    MessageSquare,
    ChevronDown,
    Plus,
    Minus,
    Play
  } from '@lucide/svelte';

  // ── Reactive state ──
  let showStickyCta = $state(false);
  let showPitch = $state(false);

  // ── FAQ accordion state ──
  let openFaq = $state<number | null>(null);
  function toggleFaq(index: number) {
    openFaq = openFaq === index ? null : index;
  }

  // ── Countdown state ──
  let countdownDays = $state(0);
  let countdownHours = $state(0);
  let countdownMinutes = $state(0);

  function updateCountdown() {
    const target = new Date('2026-12-01T00:00:00-03:00');
    const now = new Date();
    const diff = target.getTime() - now.getTime();
    if (diff <= 0) {
      countdownDays = 0;
      countdownHours = 0;
      countdownMinutes = 0;
      return;
    }
    countdownDays = Math.floor(diff / (1000 * 60 * 60 * 24));
    countdownHours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    countdownMinutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  }

  $effect(() => {
    updateCountdown();
    const interval = setInterval(updateCountdown, 60_000);
    return () => clearInterval(interval);
  });



  // ── Student carousel for hero mockup ──
  const heroStudents = [
    {
      photo: '/images/students/kid-14.webp',
      name: 'Diego Fernández',
      grade: '8° Básico A',
      hasAlert: true,
      alertText: 'Alerta Activa',
      timeline: [
        { type: 'alert' as const, text: 'Orden de alejamiento registrada', meta: 'Hace 2 horas — Orientadora M. López' },
        { type: 'pickup' as const, text: 'Retiro autorizado — Madre', meta: 'Ayer 15:30 — Portería Central' },
        { type: 'update' as const, text: 'Ficha actualizada — datos familiares', meta: '02 abr — Prof. jefe R. Soto' },
      ],
    },
    {
      photo: '/images/students/girl-12.webp',
      name: 'Isabella Rojas',
      grade: '6° Básico A',
      hasAlert: false,
      alertText: '',
      timeline: [
        { type: 'pickup' as const, text: 'Retiro autorizado — Padre', meta: 'Hoy 13:45 — Portería Sur' },
        { type: 'observation' as const, text: 'Observación conductual positiva', meta: 'Ayer — Prof. A. Martínez' },
        { type: 'update' as const, text: 'Contacto de emergencia actualizado', meta: '01 abr — Admin' },
      ],
    },
    {
      photo: '/images/students/girl-15.webp',
      name: 'Catalina Morales',
      grade: '1° Medio A',
      hasAlert: true,
      alertText: 'Retiro Restringido',
      timeline: [
        { type: 'alert' as const, text: 'Retiro no autorizado detectado', meta: 'Hace 1 hora — Portería Norte' },
        { type: 'observation' as const, text: 'Derivación a orientación', meta: 'Hoy 09:00 — Prof. C. Ruiz' },
        { type: 'pickup' as const, text: 'Retiro autorizado — Abuela', meta: 'Ayer 16:00 — Portería Central' },
      ],
    },
    {
      photo: '/images/students/kid-11.webp',
      name: 'Tomás Herrera',
      grade: '5° Básico B',
      hasAlert: false,
      alertText: '',
      timeline: [
        { type: 'pickup' as const, text: 'Retiro autorizado — Madre', meta: 'Hoy 13:00 — Portería Central' },
        { type: 'update' as const, text: 'Evaluación semestral registrada', meta: '31 mar — Prof. jefe L. Vera' },
        { type: 'observation' as const, text: 'Participación en acto cívico', meta: '28 mar — Inspector J. Muñoz' },
      ],
    },
  ];

  let currentStudent = $state(0);
  const activeStudent = $derived(heroStudents[currentStudent]);

  $effect(() => {
    const interval = setInterval(() => {
      currentStudent = (currentStudent + 1) % heroStudents.length;
    }, 5000);
    return () => clearInterval(interval);
  });
</script>

<!-- Scroll listener (guarded to avoid no-op reactivity writes) -->
<svelte:window onscroll={() => {
  const c = window.scrollY > 300;
  if (c !== showStickyCta) showStickyCta = c;
}} />

<svelte:head>
  <title>Ethoz — {t('hero.title')}</title>
  <meta name="description" content="Ethoz — Software de gestión y protección de datos escolares para colegios de Chile. Cumple con la Ley 21.719 antes del plazo de diciembre 2026." />
  <meta property="og:url" content="https://ethoz.cl/" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="Ethoz — Gestión y cumplimiento para colegios" />
  <meta property="og:description" content="Plataforma de gestión y cumplimiento normativo para colegios en Chile. Control de acceso, protección de datos y seguridad escolar." />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Ethoz — Gestión y cumplimiento para colegios" />
  <meta name="twitter:description" content="Plataforma de gestión y cumplimiento normativo para colegios en Chile. Control de acceso, protección de datos y seguridad escolar." />
  <link rel="canonical" href="https://ethoz.cl/" />
  <script type="application/ld+json">
  {JSON.stringify([
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Ethoz",
      "url": "https://ethoz.cl",
      "logo": "https://ethoz.cl/favicon.svg",
      "description": "Plataforma de gestión y protección de datos escolares para colegios de Chile",
      "areaServed": { "@type": "Country", "name": "Chile" },
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Santiago",
        "addressCountry": "CL"
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "email": "contacto@ethoz.cl",
        "contactType": "sales"
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Ethoz",
      "url": "https://ethoz.cl",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://ethoz.cl/demo?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "Ethoz",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "Web",
      "description": "Plataforma de gestión y protección de datos escolares para colegios de Chile. Cumplimiento Ley 21.719.",
      "offers": {
        "@type": "AggregateOffer",
        "priceCurrency": "CLP",
        "availability": "https://schema.org/OnlineOnly",
        "url": "https://ethoz.cl/get-started"
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [1,2,11,3,15,4,12].map(n => ({
        "@type": "Question",
        "name": t(`faq.q${n}` as TranslationKey),
        "acceptedAnswer": { "@type": "Answer", "text": t(`faq.a${n}` as TranslationKey) }
      }))
    }
  ])}
  </script>
</svelte:head>

<main class="flex min-h-dvh flex-col bg-background">
  <NavBar />

  <!-- ═══════════════════════════════════════════
       SECTION 2: HERO — split layout
       ═══════════════════════════════════════════ -->
  <section class="relative overflow-hidden pt-28 sm:pt-32">
    <!-- Background gradient -->
    <div class="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/[0.04] via-transparent to-transparent"></div>

    <div class="relative z-10 mx-auto grid max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-2 lg:gap-14 lg:px-8">

      <!-- Left column: headline + CTAs -->
      <div class="flex flex-col items-center text-center sm:items-start sm:text-left">
        <!-- Badge -->
        <Badge variant="secondary" class="animate-fade-in-up mb-4 gap-1.5 px-3 py-1 text-xs font-medium">
          <Shield class="size-3.5" />
          {t('hero.badge')}
        </Badge>

        <!-- Headline -->
        <h1 class="animate-fade-in-up animate-delay-100 text-balance text-5xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
          {t('hero.title')}
        </h1>

        <!-- Subtitle -->
        <p class="animate-fade-in-up animate-delay-200 mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
          {t('hero.subtitle')}
        </p>

        <!-- CTAs -->
        <div class="animate-fade-in-up animate-delay-300 mt-8 flex items-center justify-center gap-3 sm:justify-start sm:gap-4">
          <Button size="lg" href="/demo" class="shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 sm:h-12 sm:px-8 sm:text-base">
            {t('hero.cta.primary')}
            <ArrowRight class="size-4" />
          </Button>
          <Button variant="outline" size="lg" onclick={() => showPitch = true} class="border-foreground/20 hover:border-foreground/40 hover:bg-muted sm:h-12 sm:px-8 sm:text-base">
            <Play class="size-4" />
            <span class="hidden sm:inline">Conoce Ethoz en 2 min</span>
            <span class="sm:hidden">Ver presentación</span>
          </Button>
        </div>
      </div>

      <!-- Right column: dashboard mockup -->
      <div class="animate-fade-in-up animate-delay-400 w-full">
        <div class="rounded-xl border border-border bg-card shadow-2xl">
          <!-- macOS-style title bar -->
          <div class="flex items-center gap-2 border-b border-border px-4 py-3">
            <div class="size-3 rounded-full bg-destructive/60"></div>
            <div class="size-3 rounded-full bg-warning/60"></div>
            <div class="size-3 rounded-full bg-success/60"></div>
            <span class="ml-3 text-xs font-medium text-muted-foreground">Ethoz — Panel de Seguimiento</span>
          </div>

          <!-- Dashboard content — carousel -->
          {#key currentStudent}
            <div class="carousel-fade p-4 sm:p-6">
              <div class="flex flex-col gap-4 sm:flex-row sm:gap-6">
                <!-- Student profile column -->
                <div class="flex flex-col items-center gap-3 sm:w-48 sm:shrink-0 sm:items-start">
                  <img
                    src={activeStudent.photo}
                    alt={activeStudent.name}
                    width="64"
                    height="64"
                    class="size-16 rounded-full object-cover ring-2 ring-border"
                    loading="eager"
                  />
                  <div class="text-center sm:text-left">
                    <p class="text-sm font-semibold text-foreground">{activeStudent.name}</p>
                    <p class="text-xs text-muted-foreground">{activeStudent.grade}</p>
                  </div>
                  {#if activeStudent.hasAlert}
                    <span class="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2.5 py-1 text-xs font-medium text-destructive">
                      <AlertTriangle class="size-3" />
                      {activeStudent.alertText}
                    </span>
                  {:else}
                    <span class="inline-flex items-center gap-1 rounded-full bg-success/10 px-2.5 py-1 text-xs font-medium text-success">
                      <Check class="size-3" />
                      Sin alertas
                    </span>
                  {/if}
                </div>

                <!-- Timeline column -->
                <div class="flex-1 border-t border-border pt-4 sm:border-t-0 sm:border-l sm:pt-0 sm:pl-6">
                  <p class="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Historial reciente
                  </p>
                  <div class="flex flex-col gap-3">
                    {#each activeStudent.timeline as entry}
                      <div class="flex items-start gap-3">
                        <div class="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full {entry.type === 'alert' ? 'bg-destructive/10' : 'bg-primary/10'}">
                          {#if entry.type === 'alert'}
                            <AlertTriangle class="size-3 text-destructive" />
                          {:else if entry.type === 'pickup'}
                            <UserCheck class="size-3 text-primary" />
                          {:else if entry.type === 'observation'}
                            <MessageSquare class="size-3 text-primary" />
                          {:else}
                            <Eye class="size-3 text-primary" />
                          {/if}
                        </div>
                        <div>
                          <p class="text-xs font-medium text-foreground">{entry.text}</p>
                          <p class="text-xs text-muted-foreground">{entry.meta}</p>
                        </div>
                      </div>
                    {/each}
                  </div>
                </div>
              </div>
            </div>
          {/key}

          <!-- Carousel dots -->
          <div class="flex items-center justify-center gap-2 border-t border-border px-4 py-3">
            {#each heroStudents as _, i}
              <button
                onclick={() => { currentStudent = i; }}
                class="flex items-center justify-center p-2"
                aria-label="Student {i + 1}"
              >
                <span class="block size-2 rounded-full transition-all {currentStudent === i ? 'w-6 bg-primary' : 'bg-border hover:bg-muted-foreground'}"></span>
              </button>
            {/each}
          </div>
        </div>
      </div>

    </div>
  </section>

  <!-- ═══════════════════════════════════════════
       SECTION 3: TRUST BAR
       ═══════════════════════════════════════════ -->
  <section class="border-y border-border bg-secondary py-8">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col items-center justify-center gap-6 sm:flex-row sm:gap-12">
        <div class="trust-item flex items-center gap-2.5">
          <Shield class="size-4 text-primary" />
          <p class="text-sm font-medium text-foreground">{t('trust.compliance')}</p>
        </div>
        <div class="hidden h-4 w-px bg-border sm:block"></div>
        <div class="trust-item flex items-center gap-2.5">
          <Lock class="size-4 text-primary" />
          <p class="text-sm font-medium text-foreground">{t('trust.encryption')}</p>
        </div>
        <div class="hidden h-4 w-px bg-border sm:block"></div>
        <div class="trust-item flex items-center gap-2.5">
          <Zap class="size-4 text-primary" />
          <p class="text-sm font-medium text-foreground">{t('trust.integration')}</p>
        </div>
        <div class="hidden h-4 w-px bg-border sm:block"></div>
        <div class="trust-item flex items-center gap-2.5">
          <Building class="size-4 text-primary" />
          <p class="text-sm font-medium text-foreground">{t('trust.directory')}</p>
        </div>
      </div>
    </div>
  </section>

  <!-- ═══════════════════════════════════════════
       SECTION 4: PROBLEM
       ═══════════════════════════════════════════ -->
  <section class="py-16 sm:py-20" id="problem">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <!-- Section header -->
      <div class="mx-auto max-w-2xl text-center">
        <p class="text-sm font-bold uppercase tracking-widest text-primary">
          {t('problem.overline')}
        </p>
        <h2 class="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {t('problem.title')}
        </h2>
        <p class="mt-4 text-lg text-muted-foreground">
          {t('problem.subtitle')}
        </p>
      </div>

      <!-- Problem items — 3 columns, icon + title always inline -->
      <div class="mx-auto mt-10 grid gap-6 sm:grid-cols-3">
        <div class="rounded-xl border border-border bg-card p-6">
          <div class="flex items-center gap-2.5">
            <AlertTriangle class="size-4.5 shrink-0 text-warning-foreground" />
            <h3 class="text-base font-semibold text-foreground">{t('problem.card1.title')}</h3>
          </div>
          <p class="mt-2 text-sm leading-relaxed text-muted-foreground">{t('problem.card1.desc')}</p>
        </div>

        <div class="rounded-xl border border-border bg-card p-6">
          <div class="flex items-center gap-2.5">
            <Shield class="size-4.5 shrink-0 text-destructive" />
            <h3 class="text-base font-semibold text-foreground">{t('problem.card2.title')}</h3>
          </div>
          <p class="mt-2 text-sm leading-relaxed text-muted-foreground">{t('problem.card2.desc')}</p>
        </div>

        <div class="rounded-xl border border-border bg-card p-6">
          <div class="flex items-center gap-2.5">
            <FileCheck class="size-4.5 shrink-0 text-primary" />
            <h3 class="text-base font-semibold text-foreground">{t('problem.card3.title')}</h3>
          </div>
          <p class="mt-2 text-sm leading-relaxed text-muted-foreground">{t('problem.card3.desc')}</p>
        </div>
      </div>
    </div>
  </section>

  <!-- ═══════════════════════════════════════════
       SECTION 5: SOLUTION / FEATURES
       ═══════════════════════════════════════════ -->
  <section class="bg-secondary py-16 sm:py-20" id="features">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <!-- Section header -->
      <div class="mx-auto max-w-2xl text-center">
        <p class="text-sm font-bold uppercase tracking-widest text-primary">
          {t('solution.overline')}
        </p>
        <h2 class="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {t('solution.title')}
        </h2>
        <p class="mt-4 text-lg text-muted-foreground">
          {t('solution.subtitle')}
        </p>
      </div>

      <!-- Feature cards — 2×2 grid, numbered headings (no icon boxes) -->
      <div class="mx-auto mt-10 grid max-w-4xl gap-6 sm:grid-cols-2">
        <!-- Feature 1: Ficha 360° -->
        <a href="/features/student-profile" class="group rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
          <span class="text-xs font-bold tabular-nums tracking-wider text-primary/40">01</span>
          <h3 class="mt-1.5 text-base font-semibold text-foreground">{t('features.record.title')}</h3>
          <p class="mt-2 text-sm leading-relaxed text-muted-foreground">{t('features.record.desc')}</p>
          <span class="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
            {t('features.learn_more')} <ChevronRight class="size-3.5" />
          </span>
        </a>

        <!-- Feature 2: Retiros Seguros -->
        <a href="/features/safe-pickups" class="group rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
          <span class="text-xs font-bold tabular-nums tracking-wider text-primary/40">02</span>
          <h3 class="mt-1.5 text-base font-semibold text-foreground">{t('features.pickup.title')}</h3>
          <p class="mt-2 text-sm leading-relaxed text-muted-foreground">{t('features.pickup.desc')}</p>
          <span class="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
            {t('features.learn_more')} <ChevronRight class="size-3.5" />
          </span>
        </a>

        <!-- Feature 3: Permisos por Cargo -->
        <a href="/features/access-control" class="group rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
          <span class="text-xs font-bold tabular-nums tracking-wider text-primary/40">03</span>
          <h3 class="mt-1.5 text-base font-semibold text-foreground">{t('features.rbac.title')}</h3>
          <p class="mt-2 text-sm leading-relaxed text-muted-foreground">{t('features.rbac.desc')}</p>
          <span class="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
            {t('features.learn_more')} <ChevronRight class="size-3.5" />
          </span>
        </a>

        <!-- Feature 4: Búsqueda Instantánea -->
        <a href="/features/smart-search" class="group rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
          <span class="text-xs font-bold tabular-nums tracking-wider text-primary/40">04</span>
          <h3 class="mt-1.5 text-base font-semibold text-foreground">{t('features.search.title')}</h3>
          <p class="mt-2 text-sm leading-relaxed text-muted-foreground">{t('features.search.desc')}</p>
          <span class="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
            {t('features.learn_more')} <ChevronRight class="size-3.5" />
          </span>
        </a>
      </div>

      <!-- Cross-cutting: privacy is not a product, it's how everything works -->
      <div class="mx-auto mt-8 max-w-4xl">
        <a href="/compliance" class="group flex items-center gap-4 rounded-xl border border-border px-6 py-4 transition-all hover:border-primary/20 hover:shadow-sm">
          <Shield class="size-5 shrink-0 text-primary" />
          <div class="flex-1">
            <p class="text-sm font-semibold text-foreground">Todo Ethoz cumple la Ley 21.719 por diseño</p>
            <p class="mt-0.5 text-xs text-muted-foreground">Cifrado, auditoría, consentimiento parental y aislamiento de datos — integrados en cada función.</p>
          </div>
          <ChevronRight class="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
        </a>
      </div>
    </div>
  </section>

  <!-- ═══════════════════════════════════════════
       SECTION 6: COMPLIANCE + COUNTDOWN
       ═══════════════════════════════════════════ -->
  <section class="py-16 sm:py-20" id="compliance">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <!-- Section header -->
      <div class="mx-auto max-w-2xl text-center">
        <p class="text-sm font-bold uppercase tracking-widest text-primary">
          {t('compliance.overline')}
        </p>
        <h2 class="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {t('compliance.title')}
        </h2>
        <p class="mt-4 text-lg text-muted-foreground">
          {t('compliance.subtitle')}
        </p>
      </div>

      <!-- Countdown -->
      <div class="mx-auto mt-14 max-w-xl">
        <p class="mb-6 text-center text-sm font-medium uppercase tracking-widest text-muted-foreground">
          <span class="mr-2 inline-block size-2 animate-pulse rounded-full bg-destructive"></span>
          {t('compliance.countdown.label')}
        </p>
        <div class="grid grid-cols-3 gap-4 overflow-hidden">
          <div class="overflow-hidden rounded-xl border border-border bg-background p-6 text-center shadow-sm sm:p-8">
            <span class="block text-4xl font-bold tabular-nums tracking-tighter text-primary sm:text-6xl">
              {countdownDays}
            </span>
            <span class="mt-1 block text-xs font-medium uppercase tracking-wider text-muted-foreground sm:text-sm">
              {t('compliance.countdown.days')}
            </span>
          </div>
          <div class="overflow-hidden rounded-xl border border-border bg-background p-6 text-center shadow-sm sm:p-8">
            <span class="block text-4xl font-bold tabular-nums tracking-tighter text-primary sm:text-6xl">
              {countdownHours}
            </span>
            <span class="mt-1 block text-xs font-medium uppercase tracking-wider text-muted-foreground sm:text-sm">
              {t('compliance.countdown.hours')}
            </span>
          </div>
          <div class="overflow-hidden rounded-xl border border-border bg-background p-6 text-center shadow-sm sm:p-8">
            <span class="block text-4xl font-bold tabular-nums tracking-tighter text-primary sm:text-6xl">
              {countdownMinutes}
            </span>
            <span class="mt-1 block text-xs font-medium uppercase tracking-wider text-muted-foreground sm:text-sm">
              {t('compliance.countdown.minutes')}
            </span>
          </div>
        </div>
      </div>

      <!-- Compliance items -->
      <div class="mx-auto mt-16 grid max-w-3xl gap-x-8 gap-y-4 sm:grid-cols-2">
        {#each ['compliance.item1', 'compliance.item2', 'compliance.item3', 'compliance.item4', 'compliance.item5', 'compliance.item6'] as item}
          <div class="flex items-start gap-3">
            <Check class="mt-0.5 size-5 shrink-0 text-primary" />
            <span class="text-sm leading-relaxed text-muted-foreground">{t(item as TranslationKey)}</span>
          </div>
        {/each}
      </div>

      <!-- CTA -->
      <div class="mt-14 text-center">
        <Button size="xl" href="/demo" class="shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30">
          {t('hero.cta.primary')}
          <ArrowRight class="size-4" />
        </Button>
      </div>
    </div>
  </section>

  <!-- ═══════════════════════════════════════════
       SECTION 7.5: ROLES — cada cargo ve lo que necesita
       ═══════════════════════════════════════════ -->
  <section class="bg-secondary py-16 sm:py-20">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-2xl text-center">
        <p class="text-sm font-bold uppercase tracking-widest text-primary">Para cada cargo</p>
        <h2 class="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Cada persona ve exactamente lo que necesita
        </h2>
      </div>

      <div class="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div class="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
          <img src="/images/people/director-mujer.webp" alt="Directora de colegio usando Ethoz" class="size-10 shrink-0 rounded-full object-cover" width="40" height="40" loading="lazy" />
          <div>
            <p class="text-sm font-semibold text-foreground">Directora</p>
            <p class="mt-0.5 text-xs text-muted-foreground">Indicadores, métricas, informes y exportación de datos.</p>
          </div>
        </div>
        <div class="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
          <img src="/images/people/inspector-hombre.webp" alt="Inspector escolar usando Ethoz" class="size-10 shrink-0 rounded-full object-cover" width="40" height="40" loading="lazy" />
          <div>
            <p class="text-sm font-semibold text-foreground">Inspector</p>
            <p class="mt-0.5 text-xs text-muted-foreground">Alertas activas, observaciones conductuales y retiros.</p>
          </div>
        </div>
        <div class="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
          <img src="/images/people/docente-mujer.webp" alt="Docente usando Ethoz para ver perfil de alumno" class="size-10 shrink-0 rounded-full object-cover" width="40" height="40" loading="lazy" />
          <div>
            <p class="text-sm font-semibold text-foreground">Docente</p>
            <p class="mt-0.5 text-xs text-muted-foreground">Perfil del alumno, observaciones académicas y alertas de su curso.</p>
          </div>
        </div>
        <div class="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
          <img src="/images/people/orientadora-mujer.webp" alt="Orientadora escolar con acceso al perfil completo" class="size-10 shrink-0 rounded-full object-cover" width="40" height="40" loading="lazy" />
          <div>
            <p class="text-sm font-semibold text-foreground">Orientadora</p>
            <p class="mt-0.5 text-xs text-muted-foreground">Perfil completo incluyendo observaciones emocionales y derivaciones.</p>
          </div>
        </div>
        <div class="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
          <img src="/images/people/portero-hombre.webp" alt="Portero verificando retiro escolar con Ethoz" class="size-10 shrink-0 rounded-full object-cover" width="40" height="40" loading="lazy" />
          <div>
            <p class="text-sm font-semibold text-foreground">Portero</p>
            <p class="mt-0.5 text-xs text-muted-foreground">Solo foto, nombre, alertas críticas y registro de retiros.</p>
          </div>
        </div>
        <div class="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
          <img src="/images/people/apoderado-madre.webp" alt="Apoderada consultando estado de su hijo en Ethoz" class="size-10 shrink-0 rounded-full object-cover" width="40" height="40" loading="lazy" />
          <div>
            <p class="text-sm font-semibold text-foreground">Apoderado</p>
            <p class="mt-0.5 text-xs text-muted-foreground">Estado de su hijo, retiros registrados y comunicaciones del colegio.</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- ═══════════════════════════════════════════
       SECTION 8: HOW IT WORKS
       ═══════════════════════════════════════════ -->
  <section class="py-16 sm:py-20" id="how">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <!-- Section header -->
      <div class="mx-auto max-w-2xl text-center">
        <p class="text-sm font-bold uppercase tracking-widest text-primary">
          {t('how.overline')}
        </p>
        <h2 class="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {t('how.title')}
        </h2>
      </div>

      <!-- Steps -->
      <div class="mx-auto mt-12 grid max-w-5xl gap-6 sm:grid-cols-3">
        <div class="text-center">
          <span class="text-2xl font-bold text-primary">48 horas</span>
          <p class="mt-1 text-sm font-medium text-foreground">{t('how.step1.title')}</p>
          <p class="mt-0.5 text-xs text-muted-foreground">{t('how.step1.desc')}</p>
        </div>
        <div class="text-center">
          <span class="text-2xl font-bold text-primary">2 semanas</span>
          <p class="mt-1 text-sm font-medium text-foreground">{t('how.step2.title')}</p>
          <p class="mt-0.5 text-xs text-muted-foreground">{t('how.step2.desc')}</p>
        </div>
        <div class="text-center">
          <span class="text-2xl font-bold text-primary">Día 1</span>
          <p class="mt-1 text-sm font-medium text-foreground">{t('how.step3.title')}</p>
          <p class="mt-0.5 text-xs text-muted-foreground">{t('how.step3.desc')}</p>
        </div>
      </div>
    </div>
  </section>

  <!-- ═══════════════════════════════════════════
       SECTION 9: FAQ
       ═══════════════════════════════════════════ -->
  <section class="bg-secondary py-16 sm:py-20" id="faq">
    <div class="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
      <div class="text-center">
        <p class="text-sm font-bold uppercase tracking-widest text-primary">
          {t('faq.overline')}
        </p>
        <h2 class="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {t('faq.title')}
        </h2>
      </div>

      <div class="mt-10 divide-y divide-border rounded-2xl border border-border bg-card shadow-sm">
        {#each [1, 2, 11, 3, 15, 4, 12] as n, i}
          <div>
            <button
              onclick={() => toggleFaq(i)}
              class="flex w-full items-center justify-between px-6 py-5 text-left transition-colors hover:bg-muted/50"
              aria-expanded={openFaq === i}
            >
              <span class="pr-8 text-sm font-semibold text-foreground">{t(`faq.q${n}` as TranslationKey)}</span>
              {#if openFaq === i}
                <Minus class="size-4 shrink-0 text-muted-foreground" />
              {:else}
                <Plus class="size-4 shrink-0 text-muted-foreground" />
              {/if}
            </button>
            {#if openFaq === i}
              <div transition:slide={{ duration: 200 }} class="px-6 pb-5">
                <p class="text-sm leading-relaxed text-muted-foreground">
                  {t(`faq.a${n}` as TranslationKey)}
                </p>
              </div>
            {/if}
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- ═══════════════════════════════════════════
       SECTION 10: FINAL CTA
       ═══════════════════════════════════════════ -->
  <section class="py-16 sm:py-20" id="cta">
    <div class="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
      <h2 class="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
        {t('cta.title')}
      </h2>
      <p class="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
        {t('cta.subtitle')}
      </p>
      <div class="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
        <Button
          size="xl"
          href="/demo"
          class="shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30"
        >
          {t('cta.primary')}
          <ArrowRight class="size-4" />
        </Button>
        <Button
          variant="outline"
          size="xl"
          onclick={() => showPitch = true}
        >
          <Play class="size-4" />
          Ver presentación
        </Button>
      </div>
    </div>
  </section>

  <Footer />

  <!-- Mobile sticky CTA -->
  {#if showStickyCta}
    <div class="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-background px-4 pb-[max(env(safe-area-inset-bottom,0px),1rem)] pt-3 md:hidden">
      <Button size="lg" href="/demo" class="w-full">
        {t('hero.cta.primary')}
        <ArrowRight class="size-4" />
      </Button>
    </div>
  {/if}
</main>

{#if showPitch}
  <PitchModal onclose={() => showPitch = false} />
{/if}

<style>
  .carousel-fade {
    animation: fadeIn 0.4s ease-in-out;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(4px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .trust-item {
    animation: fadeInUp 0.5s ease-out both;
  }

  .trust-item:nth-child(3) { animation-delay: 0.1s; }
  .trust-item:nth-child(5) { animation-delay: 0.2s; }
  .trust-item:nth-child(7) { animation-delay: 0.3s; }
</style>
