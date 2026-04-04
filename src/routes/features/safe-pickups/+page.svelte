<script lang="ts">
  import NavBar from '$lib/components/NavBar.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import { t } from '$lib/i18n/index.svelte';
  import { Button } from '$lib/components/ui/button';
  import { Bell, ArrowRight, ArrowLeft, ShieldCheck, Ban, BellRing } from '@lucide/svelte';
</script>

<svelte:head>
  <title>Ethoz — {t('features.pickup.title')}</title>
  <meta name="description" content="El portero sabe en segundos si puede entregar al alumno — sin llamadas, sin papel, sin margen de error." />
  <meta property="og:url" content="https://ethoz.cl/features/safe-pickups" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="Ethoz — Retiros Seguros y Alertas Críticas" />
  <meta property="og:description" content="El portero sabe en segundos si puede entregar al alumno — sin llamadas, sin papel, sin margen de error." />
  <link rel="canonical" href="https://ethoz.cl/features/safe-pickups" />
</svelte:head>

<main class="min-h-dvh pt-16">
  <NavBar />

  <!-- Hero -->
  <section class="bg-secondary py-20 sm:py-28">
    <div class="mx-auto max-w-3xl px-4 text-center sm:px-6">
      <a href="/#features" class="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground">
        <ArrowLeft class="size-3.5" />
        Volver a características
      </a>
      <div class="mx-auto mb-6 flex size-16 items-center justify-center rounded-2xl bg-destructive/10">
        <Bell class="size-8 text-destructive" />
      </div>
      <h1 class="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
        {t('features.pickup.title')}
      </h1>
      <p class="mt-5 text-lg leading-relaxed text-muted-foreground">
        {t('features.pickup.desc')}
      </p>
    </div>
  </section>

  <!-- Detail cards -->
  <section class="py-20 sm:py-24">
    <div class="mx-auto max-w-4xl px-4 sm:px-6">
      <div class="grid gap-6 sm:grid-cols-1 lg:grid-cols-3">

        <div class="rounded-2xl border border-border bg-card p-8 shadow-sm">
          <div class="mb-4 flex size-11 items-center justify-center rounded-xl bg-destructive/10">
            <ShieldCheck class="size-5 text-destructive" />
          </div>
          <h2 class="text-lg font-semibold text-foreground">Validación en tiempo real</h2>
          <p class="mt-3 text-sm leading-relaxed text-muted-foreground">
            {t('features.pickup.bullet1')}
          </p>
        </div>

        <div class="rounded-2xl border border-border bg-card p-8 shadow-sm">
          <div class="mb-4 flex size-11 items-center justify-center rounded-xl bg-destructive/10">
            <Ban class="size-5 text-destructive" />
          </div>
          <h2 class="text-lg font-semibold text-foreground">Bloqueo automático ante restricciones</h2>
          <p class="mt-3 text-sm leading-relaxed text-muted-foreground">
            {t('features.pickup.bullet2')}
          </p>
        </div>

        <div class="rounded-2xl border border-border bg-card p-8 shadow-sm">
          <div class="mb-4 flex size-11 items-center justify-center rounded-xl bg-destructive/10">
            <BellRing class="size-5 text-destructive" />
          </div>
          <h2 class="text-lg font-semibold text-foreground">Notificaciones seguras por rol</h2>
          <p class="mt-3 text-sm leading-relaxed text-muted-foreground">
            {t('features.pickup.bullet3')}
          </p>
        </div>

      </div>
    </div>
  </section>

  <!-- CTA -->
  <section class="bg-secondary py-20 sm:py-24">
    <div class="mx-auto max-w-2xl px-4 text-center sm:px-6">
      <h2 class="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">¿Listo para empezar?</h2>
      <p class="mt-4 text-base leading-relaxed text-muted-foreground">
        Agenda una demo y ve cómo el módulo de retiros seguros protege a tu comunidad escolar.
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
