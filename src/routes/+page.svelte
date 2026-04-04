<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import Footer from '$lib/components/Footer.svelte';
  import { Badge } from '$lib/components/ui/badge';
  import { t, toggleLocale, getLocale } from '$lib/i18n/index.svelte';
  import { trackEvent } from '$lib/utils/analytics';
  import { slide } from 'svelte/transition';
  import { env } from '$env/dynamic/public';
  import {
    Shield,
    Users,
    Bell,
    FileCheck,
    Clock,
    ArrowRight,
    Check,
    ChevronRight,
    Menu,
    X,
    Globe,
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
    BarChart3
  } from '@lucide/svelte';

  // ── Reactive state ──
  let scrolled = $state(false);
  let mobileOpen = $state(false);
  let showStickyCta = $state(false);

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

  // ── Smooth scroll helper ──
  function scrollTo(id: string) {
    mobileOpen = false;
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      trackEvent('scroll_to_section', { section: id });
    }
  }

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
  const y = window.scrollY;
  const s = y > 20;
  const c = y > 300;
  if (s !== scrolled) scrolled = s;
  if (c !== showStickyCta) showStickyCta = c;
}} />

<svelte:head>
  <title>Ethoz — {t('hero.title')}</title>
  <meta name="description" content="Plataforma de gestión y cumplimiento normativo para colegios en Chile. Control de acceso, protección de datos y seguridad escolar." />
  <meta property="og:url" content="https://ethoz.cl/" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="Ethoz — Gestión y cumplimiento para colegios" />
  <meta property="og:description" content="Plataforma de gestión y cumplimiento normativo para colegios en Chile. Control de acceso, protección de datos y seguridad escolar." />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Ethoz — Gestión y cumplimiento para colegios" />
  <meta name="twitter:description" content="Plataforma de gestión y cumplimiento normativo para colegios en Chile. Control de acceso, protección de datos y seguridad escolar." />
  <link rel="canonical" href="https://ethoz.cl/" />
</svelte:head>

<main>
  <!-- ═══════════════════════════════════════════
       SECTION 1: NAVBAR
       ═══════════════════════════════════════════ -->
  <nav
    class="fixed top-0 right-0 left-0 z-50 transition-all duration-300 {scrolled
      ? 'bg-background/80 backdrop-blur-lg border-b border-border shadow-sm'
      : 'bg-transparent'}"
  >
    <div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
      <!-- Logo -->
      <a href="/" class="text-xl font-bold tracking-tight text-foreground">
        Ethoz
      </a>

      <!-- Desktop nav links -->
      <div class="hidden items-center gap-8 md:flex">
        <button onclick={() => scrollTo('features')} class="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
          {t('nav.features')}
        </button>
        <button onclick={() => scrollTo('compliance')} class="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
          {t('nav.compliance')}
        </button>
        <button onclick={() => scrollTo('faq')} class="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
          {t('nav.faq')}
        </button>
        <a href="/blog" class="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
          Blog
        </a>
      </div>

      <!-- Desktop right actions -->
      <div class="hidden items-center gap-3 md:flex">
        <a href={env.PUBLIC_APP_URL ?? 'http://localhost:5174/'} class="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
          {t('nav.login')}
        </a>
        <Button
          variant="ghost"
          size="sm"
          onclick={toggleLocale}
          class="gap-1.5 text-muted-foreground"
        >
          <Globe class="size-4" />
          {getLocale() === 'es' ? 'EN' : 'ES'}
        </Button>
        <Button size="sm" href="/demo">
          {t('nav.cta')}
        </Button>
      </div>

      <!-- Mobile hamburger -->
      <button
        class="flex items-center justify-center rounded-md p-2 text-foreground md:hidden"
        onclick={() => { mobileOpen = !mobileOpen; }}
        aria-label="Toggle menu"
      >
        {#if mobileOpen}
          <X class="size-5" />
        {:else}
          <Menu class="size-5" />
        {/if}
      </button>
    </div>

    <!-- Mobile menu panel -->
    {#if mobileOpen}
      <div class="border-b border-border bg-background/95 backdrop-blur-lg md:hidden">
        <div class="flex flex-col gap-1 px-4 pb-4 pt-2">
          <button
            onclick={() => scrollTo('features')}
            class="rounded-md px-3 py-2.5 text-left text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            {t('nav.features')}
          </button>
          <button
            onclick={() => scrollTo('compliance')}
            class="rounded-md px-3 py-2.5 text-left text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            {t('nav.compliance')}
          </button>
          <button
            onclick={() => scrollTo('faq')}
            class="rounded-md px-3 py-2.5 text-left text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            {t('nav.faq')}
          </button>
          <a
            href="/blog"
            class="rounded-md px-3 py-2.5 text-left text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            Blog
          </a>
          <div class="mt-2 flex items-center gap-3 border-t border-border pt-3">
            <a href={env.PUBLIC_APP_URL ?? 'http://localhost:5174/'} class="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              {t('nav.login')}
            </a>
            <Button
              variant="ghost"
              size="sm"
              onclick={toggleLocale}
              class="gap-1.5 text-muted-foreground"
            >
              <Globe class="size-4" />
              {getLocale() === 'es' ? 'EN' : 'ES'}
            </Button>
            <Button size="sm" href="/demo" class="flex-1">
              {t('nav.cta')}
            </Button>
          </div>
        </div>
      </div>
    {/if}
  </nav>

  <!-- ═══════════════════════════════════════════
       SECTION 2: HERO — split layout
       ═══════════════════════════════════════════ -->
  <section class="relative overflow-hidden pt-16">
    <!-- Background gradient -->
    <div class="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/[0.04] via-transparent to-transparent"></div>

    <div class="relative z-10 mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-28">

      <!-- Left column: headline + CTAs -->
      <div class="flex flex-col items-start">
        <!-- Badge -->
        <Badge variant="secondary" class="mb-6 gap-1.5 px-3 py-1 text-xs font-medium">
          <Shield class="size-3.5" />
          {t('hero.badge')}
        </Badge>

        <!-- Headline -->
        <h1 class="text-5xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
          {t('hero.title')}
        </h1>

        <!-- Subtitle -->
        <p class="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
          {t('hero.subtitle')}
        </p>

        <!-- CTAs -->
        <div class="mt-10 flex flex-wrap gap-4">
          <Button size="xl" href="/demo" class="shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30">
            {t('hero.cta.primary')}
            <ArrowRight class="size-4" />
          </Button>
          <Button variant="outline" size="xl" href="/pricing">
            {t('hero.cta.secondary')}
          </Button>
        </div>
      </div>

      <!-- Right column: dashboard mockup -->
      <div class="w-full">
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
                class="size-2 rounded-full transition-all {currentStudent === i ? 'w-6 bg-primary' : 'bg-border hover:bg-muted-foreground'}"
                aria-label="Student {i + 1}"
              ></button>
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
  <section class="bg-muted py-16 sm:py-20" id="problem">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <!-- Section header -->
      <div class="mx-auto max-w-2xl text-center">
        <p class="text-sm font-semibold uppercase tracking-widest text-primary">
          {t('problem.overline')}
        </p>
        <h2 class="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {t('problem.title')}
        </h2>
        <p class="mt-4 text-lg text-muted-foreground">
          {t('problem.subtitle')}
        </p>
      </div>

      <!-- Problem items — stacked narrative -->
      <div class="mx-auto mt-12 max-w-3xl space-y-6">
        <!-- Item 1: Scattered data -->
        <div class="flex items-start gap-4 rounded-xl border border-border bg-card p-6">
          <div class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-warning/15">
            <AlertTriangle class="size-5 text-warning-foreground" />
          </div>
          <div>
            <h3 class="text-base font-semibold text-foreground">{t('problem.card1.title')}</h3>
            <p class="mt-1 text-sm leading-relaxed text-muted-foreground">{t('problem.card1.desc')}</p>
          </div>
        </div>

        <!-- Item 2: Security risks -->
        <div class="flex items-start gap-4 rounded-xl border border-border bg-card p-6">
          <div class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-destructive/10">
            <Shield class="size-5 text-destructive" />
          </div>
          <div>
            <h3 class="text-base font-semibold text-foreground">{t('problem.card2.title')}</h3>
            <p class="mt-1 text-sm leading-relaxed text-muted-foreground">{t('problem.card2.desc')}</p>
          </div>
        </div>

        <!-- Item 3: No compliance -->
        <div class="flex items-start gap-4 rounded-xl border border-border bg-card p-6">
          <div class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <FileCheck class="size-5 text-primary" />
          </div>
          <div>
            <h3 class="text-base font-semibold text-foreground">{t('problem.card3.title')}</h3>
            <p class="mt-1 text-sm leading-relaxed text-muted-foreground">{t('problem.card3.desc')}</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- ═══════════════════════════════════════════
       SECTION 5: SOLUTION / FEATURES
       ═══════════════════════════════════════════ -->
  <section class="py-16 sm:py-20" id="features">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <!-- Section header -->
      <div class="mx-auto max-w-2xl text-center">
        <p class="text-sm font-semibold uppercase tracking-widest text-primary">
          {t('solution.overline')}
        </p>
        <h2 class="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {t('solution.title')}
        </h2>
        <p class="mt-4 text-lg text-muted-foreground">
          {t('solution.subtitle')}
        </p>
      </div>

      <!-- Feature cards — compact grid -->
      <div class="mx-auto mt-12 grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <!-- Feature 1: Ficha 360° -->
        <a href="/features/student-profile" class="group rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:border-l-2 hover:border-l-primary hover:shadow-md">
          <div class="flex items-center gap-3">
            <div class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <ClipboardList class="size-5 text-primary" />
            </div>
            <h3 class="text-base font-semibold text-foreground">{t('features.record.title')}</h3>
          </div>
          <p class="mt-3 text-sm leading-relaxed text-muted-foreground">{t('features.record.desc')}</p>
          <span class="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
            {t('features.learn_more')} <ChevronRight class="size-3.5" />
          </span>
        </a>

        <!-- Feature 2: Retiros Seguros -->
        <a href="/features/safe-pickups" class="group rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:border-l-2 hover:border-l-primary hover:shadow-md">
          <div class="flex items-center gap-3">
            <div class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-destructive/10">
              <Bell class="size-5 text-destructive" />
            </div>
            <h3 class="text-base font-semibold text-foreground">{t('features.pickup.title')}</h3>
          </div>
          <p class="mt-3 text-sm leading-relaxed text-muted-foreground">{t('features.pickup.desc')}</p>
          <span class="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
            {t('features.learn_more')} <ChevronRight class="size-3.5" />
          </span>
        </a>

        <!-- Feature 3: Privacidad y Cumplimiento -->
        <a href="/features/privacy-compliance" class="group rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:border-l-2 hover:border-l-primary hover:shadow-md">
          <div class="flex items-center gap-3">
            <div class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-success/10">
              <Shield class="size-5 text-success" />
            </div>
            <h3 class="text-base font-semibold text-foreground">{t('features.privacy.title')}</h3>
          </div>
          <p class="mt-3 text-sm leading-relaxed text-muted-foreground">{t('features.privacy.desc')}</p>
          <span class="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
            {t('features.learn_more')} <ChevronRight class="size-3.5" />
          </span>
        </a>

        <!-- Feature 4: RBAC -->
        <a href="/features/access-control" class="group rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:border-l-2 hover:border-l-primary hover:shadow-md">
          <div class="flex items-center gap-3">
            <div class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-warning/15">
              <Fingerprint class="size-5 text-warning-foreground" />
            </div>
            <h3 class="text-base font-semibold text-foreground">{t('features.rbac.title')}</h3>
          </div>
          <p class="mt-3 text-sm leading-relaxed text-muted-foreground">{t('features.rbac.desc')}</p>
          <span class="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
            {t('features.learn_more')} <ChevronRight class="size-3.5" />
          </span>
        </a>

        <!-- Feature 5: Búsqueda y Dashboard -->
        <a href="/features/smart-search" class="group rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:border-l-2 hover:border-l-primary hover:shadow-md">
          <div class="flex items-center gap-3">
            <div class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <Search class="size-5 text-primary" />
            </div>
            <h3 class="text-base font-semibold text-foreground">{t('features.search.title')}</h3>
          </div>
          <p class="mt-3 text-sm leading-relaxed text-muted-foreground">{t('features.search.desc')}</p>
          <span class="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
            {t('features.learn_more')} <ChevronRight class="size-3.5" />
          </span>
        </a>

        <!-- Feature 6: Dashboard de Cumplimiento -->
        <a href="/compliance" class="group rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:border-l-2 hover:border-l-primary hover:shadow-md">
          <div class="flex items-center gap-3">
            <div class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <BarChart3 class="size-5 text-primary" />
            </div>
            <h3 class="text-base font-semibold text-foreground">{t('features.dashboard.title')}</h3>
          </div>
          <p class="mt-3 text-sm leading-relaxed text-muted-foreground">{t('features.dashboard.desc')}</p>
          <span class="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
            {t('features.learn_more')} <ChevronRight class="size-3.5" />
          </span>
        </a>
      </div>
    </div>
  </section>

  <!-- ═══════════════════════════════════════════
       SECTION 6: COMPLIANCE + COUNTDOWN
       ═══════════════════════════════════════════ -->
  <section class="bg-secondary py-16 sm:py-20" id="compliance">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <!-- Section header -->
      <div class="mx-auto max-w-2xl text-center">
        <p class="text-sm font-semibold uppercase tracking-widest text-primary">
          {t('compliance.overline')}
        </p>
        <h2 class="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
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
        <div class="grid grid-cols-3 gap-4">
          <div class="rounded-xl border border-border bg-background p-6 text-center shadow-sm sm:p-8">
            <span class="block text-5xl font-bold tabular-nums tracking-tight text-primary sm:text-7xl">
              {countdownDays}
            </span>
            <span class="mt-1 block text-xs font-medium uppercase tracking-wider text-muted-foreground sm:text-sm">
              {t('compliance.countdown.days')}
            </span>
          </div>
          <div class="rounded-xl border border-border bg-background p-6 text-center shadow-sm sm:p-8">
            <span class="block text-5xl font-bold tabular-nums tracking-tight text-primary sm:text-7xl">
              {countdownHours}
            </span>
            <span class="mt-1 block text-xs font-medium uppercase tracking-wider text-muted-foreground sm:text-sm">
              {t('compliance.countdown.hours')}
            </span>
          </div>
          <div class="rounded-xl border border-border bg-background p-6 text-center shadow-sm sm:p-8">
            <span class="block text-5xl font-bold tabular-nums tracking-tight text-primary sm:text-7xl">
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
            <span class="text-sm leading-relaxed text-muted-foreground">{t(item)}</span>
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
       SECTION 8: HOW IT WORKS
       ═══════════════════════════════════════════ -->
  <section class="py-16 sm:py-20" id="how">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <!-- Section header -->
      <div class="mx-auto max-w-2xl text-center">
        <p class="text-sm font-semibold uppercase tracking-widest text-primary">
          {t('how.overline')}
        </p>
        <h2 class="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
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
        <p class="text-sm font-semibold uppercase tracking-widest text-primary">
          {t('faq.overline')}
        </p>
        <h2 class="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {t('faq.title')}
        </h2>
      </div>

      <div class="mt-12 flex flex-col divide-y divide-border">
        {#each [1, 2, 3, 4, 5] as n, i}
          <div class="py-6">
            <button
              onclick={() => toggleFaq(i)}
              class="flex w-full items-center justify-between text-left"
            >
              <span class="pr-8 text-base font-medium text-foreground">{t(`faq.q${n}`)}</span>
              <span class="shrink-0 rounded-full p-1 text-muted-foreground transition-colors hover:bg-muted">
                {#if openFaq === i}
                  <Minus class="size-5" />
                {:else}
                  <Plus class="size-5" />
                {/if}
              </span>
            </button>
            {#if openFaq === i}
              <p transition:slide={{ duration: 200 }} class="mt-4 pr-12 text-sm leading-relaxed text-muted-foreground">
                {t(`faq.a${n}`)}
              </p>
            {/if}
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- ═══════════════════════════════════════════
       SECTION 10: FINAL CTA
       ═══════════════════════════════════════════ -->
  <section class="relative overflow-hidden bg-primary py-16 sm:py-20" id="cta">
    <!-- Decorative gradient overlay -->
    <div class="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary/80"></div>

    <div class="relative z-10 mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
      <h2 class="text-4xl font-bold tracking-tight text-primary-foreground sm:text-5xl lg:text-6xl">
        {t('cta.title')}
      </h2>
      <p class="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-primary-foreground/80">
        {t('cta.subtitle')}
      </p>
      <div class="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
        <Button
          size="xl"
          href="/demo"
          class="bg-background text-foreground shadow-lg hover:bg-background/90"
        >
          {t('cta.primary')}
          <ArrowRight class="size-4" />
        </Button>
        <Button
          variant="outline"
          size="xl"
          href="https://wa.me/56912345678?text=Hola%2C%20me%20interesa%20saber%20m%C3%A1s%20sobre%20Ethoz"
          class="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
        >
          {t('cta.secondary')}
        </Button>
      </div>
    </div>
  </section>

  <Footer mode="landing" />

  <!-- Mobile sticky CTA -->
  {#if showStickyCta}
    <div class="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-background/95 px-4 py-3 backdrop-blur-lg md:hidden">
      <Button size="lg" href="/demo" class="w-full">
        {t('hero.cta.primary')}
        <ArrowRight class="size-4" />
      </Button>
    </div>
  {/if}
</main>

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
