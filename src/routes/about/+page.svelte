<script lang="ts">
  import NavBar from '$lib/components/NavBar.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import { t } from '$lib/i18n/index.svelte';
  import { Shield, Users, Clock } from '@lucide/svelte';
</script>

<svelte:head>
  <title>Ethoz — {t('about.title')}</title>
  <meta name="description" content="Ethoz: plataforma de seguimiento integral y seguridad escolar construida en Chile." />
  <meta property="og:url" content="https://ethoz.cl/about" />
  <meta property="og:type" content="website" />
  <link rel="canonical" href="https://ethoz.cl/about" />
</svelte:head>

<main class="min-h-dvh pt-16">
  <NavBar />

  <!-- Hero -->
  <section class="py-24 sm:py-32">
    <div class="mx-auto max-w-3xl px-4 text-center sm:px-6">
      <h1 class="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        {t('about.title')}
      </h1>
      <p class="mt-6 text-lg leading-relaxed text-muted-foreground">
        {t('about.intro')}
      </p>
    </div>
  </section>

  <!-- Mission -->
  <section class="bg-secondary py-24 sm:py-32">
    <div class="mx-auto max-w-3xl px-4 sm:px-6">
      <h2 class="text-2xl font-bold tracking-tight text-foreground">{t('about.mission_title')}</h2>
      <p class="mt-4 text-base leading-relaxed text-muted-foreground">{t('about.mission_desc')}</p>
    </div>
  </section>

  <!-- Values -->
  <section class="py-24 sm:py-32">
    <div class="mx-auto max-w-5xl px-4 sm:px-6">
      <h2 class="text-center text-2xl font-bold tracking-tight text-foreground">{t('about.values_title')}</h2>
      <div class="mt-12 grid gap-8 sm:grid-cols-3">
        <div>
          <div class="flex items-center gap-3">
            <div class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <Shield class="size-5 text-primary" />
            </div>
            <h3 class="text-base font-semibold text-foreground">{t('about.value1_title')}</h3>
          </div>
          <p class="mt-3 text-sm text-muted-foreground">{t('about.value1_desc')}</p>
        </div>
        <div>
          <div class="flex items-center gap-3">
            <div class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <Users class="size-5 text-primary" />
            </div>
            <h3 class="text-base font-semibold text-foreground">{t('about.value2_title')}</h3>
          </div>
          <p class="mt-3 text-sm text-muted-foreground">{t('about.value2_desc')}</p>
        </div>
        <div>
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

  <Footer />
</main>
