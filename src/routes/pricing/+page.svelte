<script lang="ts">
  import Footer from '$lib/components/Footer.svelte';
  import NavBar from '$lib/components/NavBar.svelte';
  import { t } from '$lib/i18n/index.svelte';
  import { slide } from 'svelte/transition';
  import { Check, ChevronDown, Plus, Minus, ArrowRight, Users, Package, Zap, Shield } from '@lucide/svelte';

  // ── FAQ accordion ──
  let openFaq = $state<number | null>(null);
  function toggleFaq(index: number) {
    openFaq = openFaq === index ? null : index;
  }

  // ── Pricing tiers ──
  const tiers = [
    {
      nameKey: 'pricing.tier.esencial.name' as const,
      forKey: 'pricing.tier.esencial.for' as const,
      descKey: 'pricing.tier.esencial.desc' as const,
      priceKey: 'pricing.tier.esencial.price' as const,
      ctaKey: 'pricing.tier.esencial.cta' as const,
      ctaHref: '/demo',
      recommended: false,
      featureKeys: [
        'pricing.tier.esencial.f1',
        'pricing.tier.esencial.f2',
        'pricing.tier.esencial.f3',
        'pricing.tier.esencial.f4',
      ] as const,
    },
    {
      nameKey: 'pricing.tier.profesional.name' as const,
      forKey: 'pricing.tier.profesional.for' as const,
      descKey: 'pricing.tier.profesional.desc' as const,
      priceKey: 'pricing.tier.profesional.price' as const,
      ctaKey: 'pricing.tier.profesional.cta' as const,
      badgeKey: 'pricing.tier.profesional.badge' as const,
      ctaHref: '/demo',
      recommended: true,
      featureKeys: [
        'pricing.tier.profesional.f1',
        'pricing.tier.profesional.f2',
        'pricing.tier.profesional.f3',
        'pricing.tier.profesional.f4',
      ] as const,
    },
    {
      nameKey: 'pricing.tier.institucional.name' as const,
      forKey: 'pricing.tier.institucional.for' as const,
      descKey: 'pricing.tier.institucional.desc' as const,
      priceKey: 'pricing.tier.institucional.price' as const,
      ctaKey: 'pricing.tier.institucional.cta' as const,
      ctaHref: '/demo',
      recommended: false,
      featureKeys: [
        'pricing.tier.institucional.f1',
        'pricing.tier.institucional.f2',
        'pricing.tier.institucional.f3',
        'pricing.tier.institucional.f4',
        'pricing.tier.institucional.f5',
      ] as const,
    },
  ] as const;

  // ── How-it-works items ──
  const howItems = [
    { icon: Users, titleKey: 'pricing.how.item1.title' as const, descKey: 'pricing.how.item1.desc' as const },
    { icon: Package, titleKey: 'pricing.how.item2.title' as const, descKey: 'pricing.how.item2.desc' as const },
    { icon: Shield, titleKey: 'pricing.how.item3.title' as const, descKey: 'pricing.how.item3.desc' as const },
    { icon: Zap, titleKey: 'pricing.how.item4.title' as const, descKey: 'pricing.how.item4.desc' as const },
  ] as const;

  // ── FAQ items ──
  const faqItems = [
    { qKey: 'pricing.faq.q1' as const, aKey: 'pricing.faq.a1' as const },
    { qKey: 'pricing.faq.q2' as const, aKey: 'pricing.faq.a2' as const },
    { qKey: 'pricing.faq.q3' as const, aKey: 'pricing.faq.a3' as const },
    { qKey: 'pricing.faq.q4' as const, aKey: 'pricing.faq.a4' as const },
  ] as const;
</script>

<svelte:head>
  <title>{t('pricing.meta.title')}</title>
</svelte:head>

<main class="flex min-h-dvh flex-col bg-background">

  <NavBar />

  <!-- ══════════════════════════════════════
       HERO
       ══════════════════════════════════════ -->
  <section class="pt-32 pb-16 sm:pt-40 sm:pb-20 bg-secondary">
    <div class="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
      <p class="text-sm font-semibold uppercase tracking-widest text-primary">
        {t('pricing.hero.overline')}
      </p>
      <h1 class="mt-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
        {t('pricing.hero.title')}
      </h1>
      <p class="mt-5 text-lg leading-relaxed text-muted-foreground">
        {t('pricing.hero.subtitle')}
      </p>
    </div>
  </section>

  <!-- ══════════════════════════════════════
       PRICING CARDS
       ══════════════════════════════════════ -->
  <section class="py-16 sm:py-20 bg-background">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="grid gap-8 lg:grid-cols-3 lg:items-start">
        {#each tiers as tier}
          <div
            class="relative flex flex-col rounded-2xl border bg-card p-8 shadow-sm transition-transform duration-200
              {tier.recommended
                ? 'border-primary shadow-lg lg:scale-105 lg:-translate-y-2'
                : 'border-border'}"
          >
            <!-- Recommended badge -->
            {#if tier.recommended}
              <div class="absolute -top-3.5 left-1/2 -translate-x-1/2">
                <span class="rounded-full bg-primary px-4 py-1 text-xs font-semibold text-primary-foreground shadow">
                  {t('pricing.tier.profesional.badge')}
                </span>
              </div>
            {/if}

            <!-- Tier header -->
            <div class="mb-6">
              <h2 class="text-xl font-bold text-foreground">{t(tier.nameKey)}</h2>
              <p class="mt-1 text-sm font-medium text-primary">{t(tier.forKey)}</p>
              <p class="mt-2 text-sm text-muted-foreground leading-snug">{t(tier.descKey)}</p>
            </div>

            <!-- Price -->
            <div class="mb-6 pb-6 border-b border-border">
              <p class="text-2xl font-bold text-foreground">{t(tier.priceKey)}</p>
            </div>

            <!-- Features -->
            <ul class="mb-8 flex-1 space-y-3">
              {#each tier.featureKeys as featureKey}
                <li class="flex items-start gap-2.5">
                  <Check class="mt-0.5 size-4 shrink-0 text-primary" />
                  <span class="text-sm text-foreground">{t(featureKey)}</span>
                </li>
              {/each}
            </ul>

            <!-- CTA -->
            <a
              href={tier.ctaHref}
              class="inline-flex w-full items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold transition-colors
                {tier.recommended
                  ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                  : 'border border-border bg-background text-foreground hover:bg-muted'}"
            >
              {t(tier.ctaKey)}
              <ArrowRight class="ml-2 size-4" />
            </a>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- ══════════════════════════════════════
       HOW PRICING WORKS
       ══════════════════════════════════════ -->
  <section class="py-16 sm:py-20 bg-secondary">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="mb-12 text-center">
        <p class="text-sm font-semibold uppercase tracking-widest text-primary">
          {t('pricing.how.overline')}
        </p>
        <h2 class="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {t('pricing.how.title')}
        </h2>
        <p class="mt-4 text-base text-muted-foreground">
          {t('pricing.how.subtitle')}
        </p>
      </div>

      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {#each howItems as item}
          {@const Icon = item.icon}
          <div class="rounded-xl border border-border bg-card p-6 shadow-sm">
            <div class="mb-3 flex items-center gap-3">
              <div class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Icon class="size-5 text-primary" />
              </div>
              <h3 class="text-base font-semibold text-foreground">{t(item.titleKey)}</h3>
            </div>
            <p class="text-sm leading-relaxed text-muted-foreground">{t(item.descKey)}</p>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- ══════════════════════════════════════
       FAQ
       ══════════════════════════════════════ -->
  <section class="py-16 sm:py-20 bg-background">
    <div class="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
      <div class="mb-10 text-center">
        <p class="text-sm font-semibold uppercase tracking-widest text-primary">
          {t('pricing.faq.overline')}
        </p>
        <h2 class="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {t('pricing.faq.title')}
        </h2>
      </div>

      <div class="divide-y divide-border rounded-2xl border border-border bg-card shadow-sm">
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

  <!-- ══════════════════════════════════════
       BOTTOM CTA
       ══════════════════════════════════════ -->
  <section class="py-16 sm:py-20 bg-secondary">
    <div class="mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8">
      <h2 class="text-3xl font-bold tracking-tight sm:text-4xl text-foreground">
        {t('pricing.cta.title')}
      </h2>
      <p class="mt-4 text-base text-muted-foreground">
        {t('pricing.cta.subtitle')}
      </p>
      <div class="mt-8">
        <a
          href="/demo"
          class="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-4 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
        >
          {t('pricing.cta.primary')}
          <ArrowRight class="size-4" />
        </a>
      </div>
    </div>
  </section>

  <Footer />
</main>
