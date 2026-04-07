<script lang="ts">
  import NavBar from '$lib/components/NavBar.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import { t } from '$lib/i18n/index.svelte';
  import { Button } from '$lib/components/ui/button';
  import { Bell, ArrowRight, ArrowLeft, ShieldCheck, Ban, BellRing } from '@lucide/svelte';
  import { trackEvent } from '$lib/utils/analytics';

  $effect(() => { trackEvent('feature_page_viewed', { feature: 'safe-pickups' }); });
</script>

<svelte:head>
  <title>Ethoz — {t('features.pickup.title')}</title>
  <meta name="description" content="El portero sabe en segundos si puede entregar al alumno — sin llamadas, sin papel, sin margen de error." />
  <meta property="og:url" content="https://ethoz.cl/features/safe-pickups" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="Ethoz — Retiros Seguros y Alertas Críticas" />
  <meta property="og:description" content="El portero sabe en segundos si puede entregar al alumno — sin llamadas, sin papel, sin margen de error." />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Ethoz — Retiros Seguros y Alertas Críticas" />
  <meta name="twitter:description" content="El portero sabe en segundos si puede entregar al alumno — sin llamadas, sin papel, sin margen de error." />
  <link rel="canonical" href="https://ethoz.cl/features/safe-pickups" />
  {@html `<script type="application/ld+json">${JSON.stringify({"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Inicio","item":"https://ethoz.cl/"},{"@type":"ListItem","position":2,"name":"Productos","item":"https://ethoz.cl/productos"},{"@type":"ListItem","position":3,"name":"Retiros Escolares Seguros"}]})}</script>`}
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
            <Bell class="size-6 shrink-0 text-primary" />
            <h1 class="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {t('features.pickup.title')}
            </h1>
          </div>
          <p class="mt-4 text-lg leading-relaxed text-muted-foreground">
            {t('features.pickup.desc')}
          </p>
        </div>
        <div class="w-full rounded-xl border border-border bg-card shadow-2xl">
          <div class="flex items-center gap-2 border-b border-border px-4 py-2.5">
            <div class="size-2.5 rounded-full bg-destructive/60"></div>
            <div class="size-2.5 rounded-full bg-warning/60"></div>
            <div class="size-2.5 rounded-full bg-success/60"></div>
            <span class="ml-2 text-[11px] font-medium text-muted-foreground">Ethoz — Verificación de Retiro</span>
          </div>
          <div class="p-4 sm:p-5">
            <div class="flex items-center gap-3 rounded-lg bg-success/5 border border-success/20 px-3 py-2.5 mb-3">
              <div class="size-2 rounded-full bg-success animate-pulse"></div>
              <span class="text-xs font-semibold text-success">RETIRO AUTORIZADO</span>
            </div>
            <div class="flex gap-3">
              <img src="/images/people/apoderado-madre.webp" alt="Apoderada autorizada para retiro" class="size-12 rounded-full object-cover" />
              <div class="flex-1">
                <p class="text-sm font-semibold text-foreground">María Sepúlveda Contreras</p>
                <p class="text-[10px] text-muted-foreground">RUT 12.345.678-9 · Madre</p>
                <div class="mt-2 grid grid-cols-2 gap-x-3 gap-y-1">
                  <p class="text-[10px] text-muted-foreground"><span class="font-medium text-foreground">Alumna:</span> Valentina Rojas</p>
                  <p class="text-[10px] text-muted-foreground"><span class="font-medium text-foreground">Curso:</span> 7° Básico B</p>
                  <p class="text-[10px] text-muted-foreground"><span class="font-medium text-foreground">Retiros (6 meses):</span> 12</p>
                  <p class="text-[10px] text-muted-foreground"><span class="font-medium text-foreground">Último:</span> Ayer 15:30</p>
                </div>
              </div>
            </div>
            <div class="mt-3 border-t border-border pt-2.5 space-y-1.5">
              <p class="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">Historial de retiros recientes</p>
              <div class="flex items-center gap-2 text-[10px]">
                <span class="size-1.5 rounded-full bg-success"></span>
                <span class="text-muted-foreground">Hoy 14:32 — María Sepúlveda (madre)</span>
              </div>
              <div class="flex items-center gap-2 text-[10px]">
                <span class="size-1.5 rounded-full bg-success"></span>
                <span class="text-muted-foreground">Ayer 15:30 — María Sepúlveda (madre)</span>
              </div>
              <div class="flex items-center gap-2 text-[10px]">
                <span class="size-1.5 rounded-full bg-destructive"></span>
                <span class="text-muted-foreground">12 mar — Juan Rojas (padre) · BLOQUEADO</span>
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
            <ShieldCheck class="size-5 shrink-0 text-destructive" />
            <h2 class="text-base font-semibold text-foreground">Validación en tiempo real</h2>
          </div>
          <p class="mt-3 text-sm leading-relaxed text-muted-foreground">
            {t('features.pickup.bullet1')}
          </p>
        </div>

        <div class="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div class="flex items-center gap-2.5">
            <Ban class="size-5 shrink-0 text-destructive" />
            <h2 class="text-base font-semibold text-foreground">Bloqueo automático ante restricciones</h2>
          </div>
          <p class="mt-3 text-sm leading-relaxed text-muted-foreground">
            {t('features.pickup.bullet2')}
          </p>
        </div>

        <div class="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div class="flex items-center gap-2.5">
            <BellRing class="size-5 shrink-0 text-destructive" />
            <h2 class="text-base font-semibold text-foreground">Notificaciones seguras por rol</h2>
          </div>
          <p class="mt-3 text-sm leading-relaxed text-muted-foreground">
            {t('features.pickup.bullet3')}
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
