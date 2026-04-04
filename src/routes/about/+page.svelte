<script lang="ts">
  import NavBar from '$lib/components/NavBar.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import { Button } from '$lib/components/ui/button';
  import { t } from '$lib/i18n/index.svelte';
  import { Shield, Users, Clock, ArrowRight, ChevronDown } from '@lucide/svelte';
  import { trackEvent } from '$lib/utils/analytics';

  const faqs = [
    { q: 'about.faq.q1' as const, a: 'about.faq.a1' as const },
    { q: 'about.faq.q2' as const, a: 'about.faq.a2' as const },
    { q: 'about.faq.q3' as const, a: 'about.faq.a3' as const },
    { q: 'about.faq.q4' as const, a: 'about.faq.a4' as const },
  ];

  let openFaq = $state<number | null>(null);

  function toggleFaq(i: number) {
    openFaq = openFaq === i ? null : i;
  }

  $effect(() => { trackEvent('about_page_viewed'); });
</script>

<svelte:head>
  <title>Ethoz — {t('about.title')}</title>
  <meta name="description" content="Ethoz: plataforma de seguimiento integral y seguridad escolar construida en Chile." />
  <meta property="og:url" content="https://ethoz.cl/about" />
  <meta property="og:type" content="website" />
  <link rel="canonical" href="https://ethoz.cl/about" />
</svelte:head>

<main class="min-h-dvh bg-background">
  <NavBar />

  <!-- Hero — split layout (Contrast Effect: problem vs. solution) -->
  <section class="pt-28 pb-12 sm:pt-32 sm:pb-16">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
        <div>
          <p class="text-sm font-bold uppercase tracking-widest text-primary">¿Qué es Ethoz?</p>
          <h1 class="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            {t('about.title')}
          </h1>
          <p class="mt-6 text-lg leading-relaxed text-muted-foreground">
            {t('about.intro')}
          </p>
          <div class="mt-8 flex flex-wrap gap-3">
            <Button size="lg" href="/demo">
              {t('nav.cta')}
              <ArrowRight class="size-4" />
            </Button>
            <Button variant="outline" size="lg" href="/compliance">
              Ver funcionalidades
            </Button>
          </div>
        </div>
        <div class="flex justify-center">
          <img
            src="/images/pages/about-unified-platform.webp"
            alt="Plataforma unificada de gestión escolar"
            class="w-full max-w-sm rounded-2xl mix-blend-multiply"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  </section>

  <!-- Problem — Loss Aversion: show what you LOSE with fragmented data -->
  <section class="bg-secondary py-16 sm:py-20">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
        <div class="order-2 flex justify-center lg:order-1">
          <img
            src="/images/pages/about-fragmented-data.webp"
            alt="Datos escolares fragmentados en múltiples sistemas"
            class="w-full max-w-sm rounded-2xl mix-blend-multiply"
            loading="lazy"
          />
        </div>
        <div class="order-1 lg:order-2">
          <h2 class="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {t('about.mission_title')}
          </h2>
          <p class="mt-4 text-base leading-relaxed text-muted-foreground">
            {t('about.mission_desc')}
          </p>
        </div>
      </div>
    </div>
  </section>

  <!-- Compliance shield — Authority Bias -->
  <section class="py-16 sm:py-20">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
        <div>
          <p class="text-sm font-bold uppercase tracking-widest text-primary">Cumplimiento normativo</p>
          <h2 class="mt-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Preparado para la Ley 21.719
          </h2>
          <p class="mt-4 text-base leading-relaxed text-muted-foreground">
            Ethoz fue diseñado desde cero para cumplir con los principios de privacidad por diseño, minimización de datos y control de acceso que exige la nueva legislación. No es un parche sobre un sistema existente — es la arquitectura correcta desde el primer día.
          </p>
          <ul class="mt-6 space-y-3">
            <li class="flex items-start gap-2.5">
              <Shield class="mt-0.5 size-4 shrink-0 text-primary" />
              <span class="text-sm text-muted-foreground">Cifrado en tránsito y en reposo</span>
            </li>
            <li class="flex items-start gap-2.5">
              <Shield class="mt-0.5 size-4 shrink-0 text-primary" />
              <span class="text-sm text-muted-foreground">Control de acceso basado en roles (RBAC)</span>
            </li>
            <li class="flex items-start gap-2.5">
              <Shield class="mt-0.5 size-4 shrink-0 text-primary" />
              <span class="text-sm text-muted-foreground">Registro de auditoría completo y trazable</span>
            </li>
          </ul>
        </div>
        <div class="flex justify-center">
          <img
            src="/images/pages/about-compliance-shield.webp"
            alt="Escudo de cumplimiento normativo protegiendo datos escolares"
            class="w-full max-w-sm rounded-2xl mix-blend-multiply"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  </section>

  <!-- Values -->
  <section class="bg-secondary py-16 sm:py-20">
    <div class="mx-auto max-w-5xl px-4 sm:px-6">
      <h2 class="text-center text-2xl font-bold tracking-tight text-foreground">{t('about.values_title')}</h2>
      <div class="mt-10 grid gap-6 sm:grid-cols-3">
        <div class="rounded-xl border border-border bg-card p-6">
          <div class="flex items-center gap-3">
            <div class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <Shield class="size-5 text-primary" />
            </div>
            <h3 class="text-base font-semibold text-foreground">{t('about.value1_title')}</h3>
          </div>
          <p class="mt-3 text-sm text-muted-foreground">{t('about.value1_desc')}</p>
        </div>
        <div class="rounded-xl border border-border bg-card p-6">
          <div class="flex items-center gap-3">
            <div class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <Users class="size-5 text-primary" />
            </div>
            <h3 class="text-base font-semibold text-foreground">{t('about.value2_title')}</h3>
          </div>
          <p class="mt-3 text-sm text-muted-foreground">{t('about.value2_desc')}</p>
        </div>
        <div class="rounded-xl border border-border bg-card p-6">
          <div class="flex items-center gap-3">
            <div class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <Clock class="size-5 text-primary" />
            </div>
            <h3 class="text-base font-semibold text-foreground">{t('about.value3_title')}</h3>
          </div>
          <p class="mt-3 text-sm text-muted-foreground">{t('about.value3_desc')}</p>
        </div>
      </div>
    </div>
  </section>

  <!-- FAQ — subtle, not prominent -->
  <section class="py-16 sm:py-20">
    <div class="mx-auto max-w-2xl px-4 sm:px-6">
      <h2 class="text-center text-xl font-bold tracking-tight text-foreground sm:text-2xl">
        {t('about.faq.title')}
      </h2>
      <div class="mt-8 divide-y divide-border rounded-xl border border-border bg-card">
        {#each faqs as faq, i}
          <div>
            <button
              type="button"
              class="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-medium text-foreground transition-colors hover:bg-muted/50"
              onclick={() => toggleFaq(i)}
              aria-expanded={openFaq === i}
            >
              {t(faq.q)}
              <ChevronDown class="size-4 shrink-0 text-muted-foreground transition-transform {openFaq === i ? 'rotate-180' : ''}" />
            </button>
            {#if openFaq === i}
              <div class="px-5 pb-4 text-sm leading-relaxed text-muted-foreground">
                {t(faq.a)}
              </div>
            {/if}
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- CTA — Present Bias: act now -->
  <section class="py-16 sm:py-20">
    <div class="mx-auto max-w-2xl px-4 text-center sm:px-6">
      <h2 class="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
        {t('pricing.cta.title')}
      </h2>
      <p class="mt-4 text-base text-muted-foreground">
        {t('pricing.cta.subtitle')}
      </p>
      <div class="mt-8">
        <Button size="lg" href="/demo" class="shadow-lg shadow-primary/30">
          {t('pricing.cta.primary')}
          <ArrowRight class="size-4" />
        </Button>
      </div>
    </div>
  </section>

  <Footer />
</main>
