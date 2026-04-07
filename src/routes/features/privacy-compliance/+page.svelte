<script lang="ts">
  import NavBar from '$lib/components/NavBar.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import { t } from '$lib/i18n/index.svelte';
  import { Button } from '$lib/components/ui/button';
  import { Shield, ArrowRight, ArrowLeft, Building2, KeyRound, Users } from '@lucide/svelte';
  import { trackEvent } from '$lib/utils/analytics';

  $effect(() => { trackEvent('feature_page_viewed', { feature: 'privacy-compliance' }); });
</script>

<svelte:head>
  <title>Ethoz — {t('features.privacy.title')}</title>
  <meta name="description" content="Construida para la Ley 21.719 desde el primer día — no como un parche posterior." />
  <meta property="og:url" content="https://ethoz.cl/features/privacy-compliance" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="Ethoz — Arquitectura de Privacidad y Cumplimiento" />
  <meta property="og:description" content="Construida para la Ley 21.719 desde el primer día — no como un parche posterior." />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Ethoz — Arquitectura de Privacidad y Cumplimiento" />
  <meta name="twitter:description" content="Construida para la Ley 21.719 desde el primer día — no como un parche posterior." />
  <link rel="canonical" href="https://ethoz.cl/features/privacy-compliance" />
  {@html `<script type="application/ld+json">${JSON.stringify({"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Inicio","item":"https://ethoz.cl/"},{"@type":"ListItem","position":2,"name":"Productos","item":"https://ethoz.cl/productos"},{"@type":"ListItem","position":3,"name":"Privacidad y Cumplimiento"}]})}</script>`}
</svelte:head>

<main class="flex min-h-dvh flex-col bg-background">
  <NavBar />

  <!-- Hero -->
  <section class="bg-secondary pt-28 pb-16 sm:pt-32 sm:pb-20">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <a href="/#features" class="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground">
        <ArrowLeft class="size-3.5" />
        Volver a características
      </a>
      <div class="mt-6 grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div>
          <div class="flex items-center gap-3">
            <Shield class="size-6 shrink-0 text-primary" />
            <h1 class="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {t('features.privacy.title')}
            </h1>
          </div>
          <p class="mt-4 text-lg leading-relaxed text-muted-foreground">
            {t('features.privacy.desc')}
          </p>
        </div>
        <div class="w-full rounded-xl border border-border bg-card shadow-2xl">
          <div class="flex items-center gap-2 border-b border-border px-4 py-2.5">
            <div class="size-2.5 rounded-full bg-destructive/60"></div>
            <div class="size-2.5 rounded-full bg-warning/60"></div>
            <div class="size-2.5 rounded-full bg-success/60"></div>
            <span class="ml-2 text-[11px] font-medium text-muted-foreground">Ethoz — Cumplimiento</span>
          </div>
          <div class="p-4 sm:p-5">
            <div class="grid grid-cols-3 gap-2 mb-3">
              <div class="rounded-lg bg-success/5 border border-success/20 px-2.5 py-2 text-center">
                <p class="text-lg font-bold text-success">98%</p>
                <p class="text-[9px] text-muted-foreground">Consentimientos</p>
              </div>
              <div class="rounded-lg bg-success/5 border border-success/20 px-2.5 py-2 text-center">
                <p class="text-lg font-bold text-success">0</p>
                <p class="text-[9px] text-muted-foreground">Accesos irregulares</p>
              </div>
              <div class="rounded-lg bg-warning/5 border border-warning/20 px-2.5 py-2 text-center">
                <p class="text-lg font-bold text-warning-foreground">1</p>
                <p class="text-[9px] text-muted-foreground">ARCO+P pendiente</p>
              </div>
            </div>
            <p class="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Registro de auditoría</p>
            <div class="space-y-1.5">
              <div class="flex items-center gap-2 text-[10px]">
                <img src="/images/people/docente-mujer.webp" alt="Docente" class="size-5 rounded-full object-cover" />
                <span class="flex-1 text-muted-foreground">Prof. González accedió a perfil de V. Rojas</span>
                <span class="text-[9px] text-muted-foreground">hace 12 min</span>
              </div>
              <div class="flex items-center gap-2 text-[10px]">
                <img src="/images/people/inspector-hombre.webp" alt="Inspector" class="size-5 rounded-full object-cover" />
                <span class="flex-1 text-muted-foreground">Inspector Muñoz registró retiro</span>
                <span class="text-[9px] text-muted-foreground">hace 1h</span>
              </div>
              <div class="flex items-center gap-2 text-[10px]">
                <img src="/images/people/orientadora-mujer.webp" alt="Orientadora" class="size-5 rounded-full object-cover" />
                <span class="flex-1 text-muted-foreground">Orientadora Lagos creó observación privada</span>
                <span class="text-[9px] text-muted-foreground">hace 3h</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Detail cards -->
  <section class="py-16 sm:py-20">
    <div class="mx-auto max-w-4xl px-4 sm:px-6">
      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

        <div class="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div class="flex items-center gap-2.5">
            <Building2 class="size-5 shrink-0 text-success" />
            <h2 class="text-base font-semibold text-foreground">Aislamiento total entre instituciones</h2>
          </div>
          <p class="mt-3 text-sm leading-relaxed text-muted-foreground">
            {t('features.privacy.bullet1')}
          </p>
        </div>

        <div class="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div class="flex items-center gap-2.5">
            <KeyRound class="size-5 shrink-0 text-success" />
            <h2 class="text-base font-semibold text-foreground">Cifrado y trazabilidad de accesos</h2>
          </div>
          <p class="mt-3 text-sm leading-relaxed text-muted-foreground">
            {t('features.privacy.bullet2')}
          </p>
        </div>

        <div class="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div class="flex items-center gap-2.5">
            <Users class="size-5 shrink-0 text-success" />
            <h2 class="text-base font-semibold text-foreground">Gestión de consentimientos parentales</h2>
          </div>
          <p class="mt-3 text-sm leading-relaxed text-muted-foreground">
            {t('features.privacy.bullet3')}
          </p>
        </div>

      </div>
    </div>
  </section>

  <!-- CTA -->
  <section class="bg-secondary py-16 sm:py-20">
    <div class="mx-auto max-w-2xl px-4 text-center sm:px-6">
      <h2 class="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">¿Listo para empezar?</h2>
      <p class="mt-4 text-base leading-relaxed text-muted-foreground">
        Agenda una demo y ve cómo Ethoz te pone en cumplimiento con la Ley 21.719 desde el día uno.
      </p>
      <div class="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Button size="lg" href="/demo">
          Agendar Demo <ArrowRight class="size-4" />
        </Button>
        <Button size="lg" variant="outline" href="/#features">
          Ver todas las funciones
        </Button>
      </div>
    </div>
  </section>

  <Footer />
</main>
