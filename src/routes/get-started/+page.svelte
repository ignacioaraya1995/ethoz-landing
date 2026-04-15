<script lang="ts">
  import Footer from '$lib/components/Footer.svelte';
  import NavBar from '$lib/components/NavBar.svelte';
  import { Button } from '$lib/components/ui/button';
  import { t, type TranslationKey } from '$lib/i18n/index.svelte';
  import { slide } from 'svelte/transition';
  import { trackEvent } from '$lib/utils/analytics';
  import {
    Check, Plus, Minus, ArrowRight,
    Users, Shield, Eye, Search, ClipboardList, BarChart3,
    Lock, FileText, MapPin, Bell
  } from '@lucide/svelte';

  let openFaq = $state<number | null>(null);
  function toggleFaq(i: number) { openFaq = openFaq === i ? null : i; }

  $effect(() => { trackEvent('pricing_page_viewed'); });

  const modules = [
    { icon: Users, nameKey: 'getstarted.module.student_profile' as const },
    { icon: Shield, nameKey: 'getstarted.module.access_control' as const },
    { icon: MapPin, nameKey: 'getstarted.module.safe_pickups' as const },
    { icon: Search, nameKey: 'getstarted.module.smart_search' as const },
    { icon: Bell, nameKey: 'getstarted.module.alerts' as const },
    { icon: ClipboardList, nameKey: 'getstarted.module.convivencia' as const },
    { icon: BarChart3, nameKey: 'getstarted.module.dashboard' as const },
    { icon: FileText, nameKey: 'getstarted.module.audit' as const },
    { icon: Lock, nameKey: 'getstarted.module.compliance' as const },
    { icon: Eye, nameKey: 'getstarted.module.digital_book' as const },
  ];

  const faqItems = [
    { qKey: 'pricing.faq.q1' as const, aKey: 'pricing.faq.a1' as const },
    { qKey: 'pricing.faq.q2' as const, aKey: 'pricing.faq.a2' as const },
    { qKey: 'pricing.faq.q3' as const, aKey: 'pricing.faq.a3' as const },
    { qKey: 'pricing.faq.q4' as const, aKey: 'pricing.faq.a4' as const },
    { qKey: 'pricing.faq.q5' as const, aKey: 'pricing.faq.a5' as const },
    { qKey: 'pricing.faq.q6' as const, aKey: 'pricing.faq.a6' as const },
    { qKey: 'pricing.faq.q7' as const, aKey: 'pricing.faq.a7' as const },
    { qKey: 'pricing.faq.q8' as const, aKey: 'pricing.faq.a8' as const },
  ] as const;
</script>

<svelte:head>
  <title>¿Cómo contratar? — Ethoz</title>
  <meta name="description" content="Contrata Ethoz en 4 pasos: agenda una demo, elige tus módulos, migramos tus datos y tu colegio queda protegido." />
  <link rel="canonical" href="https://ethoz.cl/get-started" />
  <meta property="og:url" content="https://ethoz.cl/get-started" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="¿Cómo contratar? — Ethoz" />
  <meta property="og:description" content="Conoce cómo implementar Ethoz en tu colegio. Proceso consultivo paso a paso." />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="¿Cómo contratar? — Ethoz" />
  <meta name="twitter:description" content="Contrata Ethoz en 4 pasos: agenda una demo, elige tus módulos, migramos tus datos y tu colegio queda protegido." />
  {@html `<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqItems.map(item => ({
      "@type": "Question",
      "name": t(item.qKey),
      "acceptedAnswer": { "@type": "Answer", "text": t(item.aKey) }
    }))
  })}</script>`}
  {@html `<script type="application/ld+json">${JSON.stringify({"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Inicio","item":"https://ethoz.cl/"},{"@type":"ListItem","position":2,"name":"Cómo contratar"}]})}</script>`}
</svelte:head>

<main class="flex min-h-dvh flex-col bg-background">
  <NavBar />

  <!-- ═══ HERO: Hook ═══ -->
  <section class="pt-28 pb-16 sm:pt-32 sm:pb-20 bg-secondary">
    <div class="mx-auto max-w-3xl px-4 text-center sm:px-6">
      <h1 class="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
        {t('getstarted.hero.title')}
      </h1>
      <p class="mt-5 text-lg leading-relaxed text-muted-foreground">
        {t('getstarted.hero.subtitle')}
      </p>
      <p class="mt-3 inline-flex items-center gap-2 rounded-full bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
        {t('getstarted.hero.badge')}
      </p>
      <div class="mt-8">
        <Button size="xl" href="/demo" class="shadow-lg shadow-primary/25">
          {t('getstarted.hero.cta')}
          <ArrowRight class="size-4" />
        </Button>
      </div>
    </div>
  </section>

  <!-- ═══ STEP 1: Conoce la plataforma ═══ -->
  <section class="py-16 sm:py-20">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div>
          <p class="text-sm font-bold uppercase tracking-widest text-primary">{t('getstarted.step1.overline')}</p>
          <h2 class="mt-2 text-balance text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {t('getstarted.step1.title')}
          </h2>
          <p class="mt-4 text-base leading-relaxed text-muted-foreground">
            {t('getstarted.step1.desc')}
          </p>
          <Button size="lg" href="/demo" class="mt-6">
            {t('getstarted.step1.cta')}
            <ArrowRight class="size-4" />
          </Button>
        </div>
        <div class="flex justify-center">
          <img src="/images/pages/step-1-demo.webp" alt={t('getstarted.step1.alt')} class="w-full max-w-sm rounded-2xl mix-blend-multiply" loading="lazy" />
        </div>
      </div>
    </div>
  </section>

  <!-- ═══ STEP 2: Elige tus módulos ═══ -->
  <section class="py-16 sm:py-20 bg-secondary">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div class="order-2 flex justify-center lg:order-1">
          <img src="/images/pages/step-2-configure.webp" alt={t('getstarted.step2.alt')} class="w-full max-w-sm rounded-2xl mix-blend-multiply" loading="lazy" />
        </div>
        <div class="order-1 lg:order-2">
          <p class="text-sm font-bold uppercase tracking-widest text-primary">{t('getstarted.step2.overline')}</p>
          <h2 class="mt-2 text-balance text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {t('getstarted.step2.title')}
          </h2>
          <p class="mt-4 text-base leading-relaxed text-muted-foreground">
            {t('getstarted.step2.desc')}
          </p>
          <div class="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {#each modules as mod}
              {@const Icon = mod.icon}
              <div class="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2">
                <Icon class="size-3.5 shrink-0 text-primary" />
                <span class="text-xs font-medium text-foreground">{t(mod.nameKey)}</span>
              </div>
            {/each}
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- ═══ STEP 3: Migración ═══ -->
  <section class="py-16 sm:py-20">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div>
          <p class="text-sm font-bold uppercase tracking-widest text-primary">{t('getstarted.step3.overline')}</p>
          <h2 class="mt-2 text-balance text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {t('getstarted.step3.title')}
          </h2>
          <p class="mt-4 text-base leading-relaxed text-muted-foreground">
            {t('getstarted.step3.desc')}
          </p>
          <ul class="mt-5 space-y-2">
            {#each ['getstarted.step3.item1', 'getstarted.step3.item2', 'getstarted.step3.item3', 'getstarted.step3.item4'] as itemKey}
              <li class="flex items-center gap-2.5">
                <Check class="size-4 shrink-0 text-primary" />
                <span class="text-sm text-muted-foreground">{t(itemKey as TranslationKey)}</span>
              </li>
            {/each}
          </ul>
        </div>
        <div class="flex justify-center">
          <img src="/images/pages/step-3-migrate.webp" alt={t('getstarted.step3.alt')} class="w-full max-w-sm rounded-2xl mix-blend-multiply" loading="lazy" />
        </div>
      </div>
    </div>
  </section>

  <!-- ═══ STEP 4: En vivo ═══ -->
  <section class="py-16 sm:py-20 bg-secondary">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div class="order-2 flex justify-center lg:order-1">
          <img src="/images/pages/step-4-live.webp" alt={t('getstarted.step4.alt')} class="w-full max-w-sm rounded-2xl mix-blend-multiply" loading="lazy" />
        </div>
        <div class="order-1 lg:order-2">
          <p class="text-sm font-bold uppercase tracking-widest text-primary">{t('getstarted.step4.overline')}</p>
          <h2 class="mt-2 text-balance text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {t('getstarted.step4.title')}
          </h2>
          <p class="mt-4 text-base leading-relaxed text-muted-foreground">
            {t('getstarted.step4.desc')}
          </p>
        </div>
      </div>
    </div>
  </section>

  <!-- ═══ FAQ ═══ -->
  <section class="py-16 sm:py-20">
    <div class="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
      <h2 class="text-balance text-center text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
        {t('pricing.faq.title')}
      </h2>

      <div class="mt-10 divide-y divide-border rounded-2xl border border-border bg-card shadow-sm">
        {#each faqItems as item, i}
          <div>
            <button
              type="button"
              onclick={() => toggleFaq(i)}
              class="flex w-full items-center justify-between px-6 py-5 text-left transition-colors hover:bg-muted/50"
              aria-expanded={openFaq === i}
            >
              <span class="text-sm font-semibold text-foreground">{t(item.qKey)}</span>
              {#if openFaq === i}
                <Minus class="size-4 shrink-0 text-muted-foreground" />
              {:else}
                <Plus class="size-4 shrink-0 text-muted-foreground" />
              {/if}
            </button>
            {#if openFaq === i}
              <div transition:slide={{ duration: 200 }} class="px-6 pb-5">
                <p class="text-sm leading-relaxed text-muted-foreground">{t(item.aKey)}</p>
              </div>
            {/if}
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- ═══ CTA FINAL ═══ -->
  <section class="py-16 sm:py-20 bg-secondary">
    <div class="mx-auto max-w-2xl px-4 text-center sm:px-6">
      <h2 class="text-balance text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
        {t('pricing.cta.title')}
      </h2>
      <p class="mt-4 text-base text-muted-foreground">
        {t('pricing.cta.subtitle')}
      </p>
      <div class="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
        <Button size="xl" href="/demo" class="shadow-lg shadow-primary/25">
          {t('pricing.cta.primary')}
          <ArrowRight class="size-4" />
        </Button>
      </div>
    </div>
  </section>

  <Footer />
</main>
