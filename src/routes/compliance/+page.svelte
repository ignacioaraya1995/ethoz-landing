<script lang="ts">
  import Footer from '$lib/components/Footer.svelte';
  import NavBar from '$lib/components/NavBar.svelte';
  import { t } from '$lib/i18n/index.svelte';
  import {
    ShieldCheck,
    Lock,
    FileText,
    Database,
    Users,
    MapPin,
    ArrowRight,
    CheckCircle,
    Clock,
  } from '@lucide/svelte';

  // ── Compliance pillars ──
  const pillars = [
    {
      icon: Users,
      titleKey: 'compliance_page.pillar1.title' as const,
      descKey: 'compliance_page.pillar1.desc' as const,
      articleKey: 'compliance_page.pillar1.article' as const,
    },
    {
      icon: FileText,
      titleKey: 'compliance_page.pillar2.title' as const,
      descKey: 'compliance_page.pillar2.desc' as const,
      articleKey: 'compliance_page.pillar2.article' as const,
    },
    {
      icon: Lock,
      titleKey: 'compliance_page.pillar3.title' as const,
      descKey: 'compliance_page.pillar3.desc' as const,
      articleKey: 'compliance_page.pillar3.article' as const,
    },
    {
      icon: ShieldCheck,
      titleKey: 'compliance_page.pillar4.title' as const,
      descKey: 'compliance_page.pillar4.desc' as const,
      articleKey: 'compliance_page.pillar4.article' as const,
    },
    {
      icon: Database,
      titleKey: 'compliance_page.pillar5.title' as const,
      descKey: 'compliance_page.pillar5.desc' as const,
      articleKey: 'compliance_page.pillar5.article' as const,
    },
    {
      icon: MapPin,
      titleKey: 'compliance_page.pillar6.title' as const,
      descKey: 'compliance_page.pillar6.desc' as const,
      articleKey: 'compliance_page.pillar6.article' as const,
    },
  ] as const;

  // ── Architecture stack items ──
  const stackItems = [
    { labelKey: 'compliance_page.arch.item1.label' as const, descKey: 'compliance_page.arch.item1.desc' as const },
    { labelKey: 'compliance_page.arch.item2.label' as const, descKey: 'compliance_page.arch.item2.desc' as const },
    { labelKey: 'compliance_page.arch.item3.label' as const, descKey: 'compliance_page.arch.item3.desc' as const },
    { labelKey: 'compliance_page.arch.item4.label' as const, descKey: 'compliance_page.arch.item4.desc' as const },
  ] as const;

  // ── Timeline events ──
  // Dec 2024 = published, Dec 2026 = enforcement
  // "Now" is April 2026 — between the two
  const now = new Date();
  const published = new Date('2024-12-01');
  const enforcement = new Date('2026-12-01');
  const totalMs = enforcement.getTime() - published.getTime();
  const elapsedMs = now.getTime() - published.getTime();
  const progressPct = Math.min(100, Math.max(0, Math.round((elapsedMs / totalMs) * 100)));
</script>

<svelte:head>
  <title>{t('compliance_page.meta.title')}</title>
  <meta name="description" content={t('compliance_page.meta.desc')} />
  <meta property="og:url" content="https://ethoz.cl/compliance" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content={t('compliance_page.meta.title')} />
  <meta property="og:description" content={t('compliance_page.meta.desc')} />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={t('compliance_page.meta.title')} />
  <meta name="twitter:description" content={t('compliance_page.meta.desc')} />
  <link rel="canonical" href="https://ethoz.cl/compliance" />
</svelte:head>

<main class="flex min-h-dvh flex-col bg-background">

  <NavBar />

  <!-- ══════════════════════════════════════
       HERO
       ══════════════════════════════════════ -->
  <section class="pt-32 pb-20 sm:pt-40 sm:pb-24 bg-secondary">
    <div class="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
      <div class="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary shadow-sm">
        <ShieldCheck class="size-3.5" />
        {t('compliance_page.hero.badge')}
      </div>
      <h1 class="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
        {t('compliance_page.hero.title')}
      </h1>
      <p class="mt-6 text-lg leading-relaxed text-muted-foreground sm:text-xl">
        {t('compliance_page.hero.subtitle')}
      </p>
      <p class="mt-4 text-base leading-relaxed text-muted-foreground">
        {t('compliance_page.hero.body')}
      </p>
    </div>
  </section>

  <!-- ══════════════════════════════════════
       COMPLIANCE TIMELINE
       ══════════════════════════════════════ -->
  <section class="py-16 sm:py-20 bg-background">
    <div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
      <div class="mb-12 text-center">
        <p class="text-sm font-semibold uppercase tracking-widest text-primary">
          {t('compliance_page.timeline.overline')}
        </p>
        <h2 class="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {t('compliance_page.timeline.title')}
        </h2>
        <p class="mt-4 text-base text-muted-foreground">
          {t('compliance_page.timeline.subtitle')}
        </p>
      </div>

      <!-- Timeline bar -->
      <div class="relative mx-auto max-w-2xl">
        <!-- Track -->
        <div class="relative h-2 rounded-full bg-border">
          <!-- Filled progress -->
          <div
            class="h-2 rounded-full bg-primary transition-all duration-700"
            style="width: {progressPct}%"
          ></div>
          <!-- "Now" marker -->
          <div
            class="absolute top-1/2 -translate-y-1/2 -translate-x-1/2"
            style="left: {progressPct}%"
          >
            <div class="relative flex flex-col items-center">
              <div class="size-4 rounded-full border-2 border-primary bg-background shadow-md ring-4 ring-primary/20"></div>
              <div class="mt-2 whitespace-nowrap rounded-full bg-primary px-3 py-0.5 text-xs font-semibold text-primary-foreground shadow">
                {t('compliance_page.timeline.now')}
              </div>
            </div>
          </div>
        </div>

        <!-- Endpoints -->
        <div class="mt-8 flex justify-between">
          <!-- Published -->
          <div class="flex flex-col items-start gap-1">
            <div class="flex items-center gap-1.5">
              <CheckCircle class="size-4 text-primary" />
              <span class="text-sm font-semibold text-foreground">{t('compliance_page.timeline.event1.date')}</span>
            </div>
            <p class="text-sm font-medium text-foreground">{t('compliance_page.timeline.event1.label')}</p>
            <p class="text-xs text-muted-foreground">{t('compliance_page.timeline.event1.desc')}</p>
          </div>
          <!-- Enforcement -->
          <div class="flex flex-col items-end gap-1">
            <div class="flex items-center gap-1.5">
              <Clock class="size-4 text-muted-foreground" />
              <span class="text-sm font-semibold text-foreground">{t('compliance_page.timeline.event2.date')}</span>
            </div>
            <p class="text-sm font-medium text-foreground">{t('compliance_page.timeline.event2.label')}</p>
            <p class="text-xs text-muted-foreground">{t('compliance_page.timeline.event2.desc')}</p>
          </div>
        </div>
      </div>

      <!-- Context note -->
      <div class="mt-10 rounded-xl border border-border bg-card p-5 text-center shadow-sm">
        <p class="text-sm leading-relaxed text-muted-foreground">
          {t('compliance_page.timeline.note')}
        </p>
      </div>
    </div>
  </section>

  <!-- ══════════════════════════════════════
       6 COMPLIANCE PILLARS
       ══════════════════════════════════════ -->
  <section class="py-16 sm:py-20 bg-secondary">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="mb-12 text-center">
        <p class="text-sm font-semibold uppercase tracking-widest text-primary">
          {t('compliance_page.pillars.overline')}
        </p>
        <h2 class="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {t('compliance_page.pillars.title')}
        </h2>
        <p class="mt-4 max-w-2xl mx-auto text-base text-muted-foreground">
          {t('compliance_page.pillars.subtitle')}
        </p>
      </div>

      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {#each pillars as pillar}
          {@const Icon = pillar.icon}
          <div class="flex flex-col rounded-2xl border border-border bg-card p-7 shadow-sm">
            <div class="mb-4 flex items-center gap-3">
              <div class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Icon class="size-5 text-primary" />
              </div>
              <div class="flex min-w-0 flex-1 items-center justify-between gap-3">
                <h3 class="text-base font-bold text-foreground leading-snug">{t(pillar.titleKey)}</h3>
                <span class="shrink-0 rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                  {t(pillar.articleKey)}
                </span>
              </div>
            </div>
            <p class="text-sm leading-relaxed text-muted-foreground">{t(pillar.descKey)}</p>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- ══════════════════════════════════════
       ARCHITECTURE OVERVIEW
       ══════════════════════════════════════ -->
  <section class="py-16 sm:py-20 bg-background">
    <div class="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
      <div class="mb-12 text-center">
        <p class="text-sm font-semibold uppercase tracking-widest text-primary">
          {t('compliance_page.arch.overline')}
        </p>
        <h2 class="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {t('compliance_page.arch.title')}
        </h2>
        <p class="mt-4 max-w-2xl mx-auto text-base text-muted-foreground">
          {t('compliance_page.arch.subtitle')}
        </p>
      </div>

      <div class="grid gap-5 sm:grid-cols-2">
        {#each stackItems as item}
          <div class="rounded-xl border border-border bg-card p-6 shadow-sm">
            <p class="text-sm font-bold text-foreground">{t(item.labelKey)}</p>
            <p class="mt-2 text-sm leading-relaxed text-muted-foreground">{t(item.descKey)}</p>
          </div>
        {/each}
      </div>

      <!-- Disclaimer note for legal audience -->
      <div class="mt-8 rounded-xl border border-border bg-secondary p-5">
        <p class="text-xs leading-relaxed text-muted-foreground">
          {t('compliance_page.arch.disclaimer')}
        </p>
      </div>
    </div>
  </section>

  <!-- ══════════════════════════════════════
       CERTIFICATIONS / STANDARDS
       ══════════════════════════════════════ -->
  <section class="py-16 sm:py-20 bg-secondary">
    <div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
      <div class="mb-10 text-center">
        <p class="text-sm font-semibold uppercase tracking-widest text-primary">
          {t('compliance_page.certs.overline')}
        </p>
        <h2 class="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {t('compliance_page.certs.title')}
        </h2>
        <p class="mt-4 text-base text-muted-foreground">
          {t('compliance_page.certs.subtitle')}
        </p>
      </div>

      <div class="grid gap-5 sm:grid-cols-3">
        <!-- Ley 21.719 -->
        <div class="flex flex-col items-center rounded-xl border border-border bg-card p-6 text-center shadow-sm">
          <div class="mb-3 flex size-10 items-center justify-center rounded-lg bg-primary/10">
            <ShieldCheck class="size-5 text-primary" />
          </div>
          <p class="text-sm font-bold text-foreground">{t('compliance_page.certs.cert1.name')}</p>
          <p class="mt-1 text-xs text-muted-foreground">{t('compliance_page.certs.cert1.status')}</p>
        </div>
        <!-- ISO 27001 placeholder -->
        <div class="flex flex-col items-center rounded-xl border border-dashed border-border bg-card p-6 text-center shadow-sm opacity-60">
          <div class="mb-3 flex size-10 items-center justify-center rounded-lg bg-muted">
            <Lock class="size-5 text-muted-foreground" />
          </div>
          <p class="text-sm font-bold text-foreground">{t('compliance_page.certs.cert2.name')}</p>
          <p class="mt-1 text-xs text-muted-foreground">{t('compliance_page.certs.cert2.status')}</p>
        </div>
        <!-- SOC 2 placeholder -->
        <div class="flex flex-col items-center rounded-xl border border-dashed border-border bg-card p-6 text-center shadow-sm opacity-60">
          <div class="mb-3 flex size-10 items-center justify-center rounded-lg bg-muted">
            <FileText class="size-5 text-muted-foreground" />
          </div>
          <p class="text-sm font-bold text-foreground">{t('compliance_page.certs.cert3.name')}</p>
          <p class="mt-1 text-xs text-muted-foreground">{t('compliance_page.certs.cert3.status')}</p>
        </div>
      </div>
    </div>
  </section>

  <!-- ══════════════════════════════════════
       CTA
       ══════════════════════════════════════ -->
  <section class="py-16 sm:py-20 bg-secondary">
    <div class="mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8">
      <h2 class="text-3xl font-bold tracking-tight sm:text-4xl text-foreground">
        {t('compliance_page.cta.title')}
      </h2>
      <p class="mt-4 text-base text-muted-foreground">
        {t('compliance_page.cta.subtitle')}
      </p>
      <div class="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
        <a
          href="/demo"
          class="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-4 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
        >
          {t('compliance_page.cta.primary')}
          <ArrowRight class="size-4" />
        </a>
        <a
          href="/"
          class="text-sm font-medium text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
        >
          {t('compliance_page.cta.secondary')}
        </a>
      </div>
    </div>
  </section>

  <Footer />
</main>
