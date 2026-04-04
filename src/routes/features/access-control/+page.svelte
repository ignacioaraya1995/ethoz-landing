<script lang="ts">
  import NavBar from '$lib/components/NavBar.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import { t } from '$lib/i18n/index.svelte';
  import { Button } from '$lib/components/ui/button';
  import { Fingerprint, ArrowRight, ArrowLeft, UserCog, GanttChartSquare, EyeOff } from '@lucide/svelte';
  import { trackEvent } from '$lib/utils/analytics';

  $effect(() => { trackEvent('feature_page_viewed', { feature: 'access-control' }); });
</script>

<svelte:head>
  <title>Ethoz — {t('features.rbac.title')}</title>
  <meta name="description" content="Cada persona ve exactamente lo que necesita, ni más ni menos." />
  <meta property="og:url" content="https://ethoz.cl/features/access-control" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="Ethoz — Control de Acceso Granular por Roles" />
  <meta property="og:description" content="Cada persona ve exactamente lo que necesita, ni más ni menos." />
  <link rel="canonical" href="https://ethoz.cl/features/access-control" />
</svelte:head>

<main class="min-h-dvh pt-16">
  <NavBar />

  <!-- Hero -->
  <section class="bg-secondary py-16 sm:py-20">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <a href="/#features" class="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground">
        <ArrowLeft class="size-3.5" />
        Volver a características
      </a>
      <div class="mt-6 grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div>
          <div class="mb-5 flex size-14 items-center justify-center rounded-2xl bg-warning/15">
            <Fingerprint class="size-7 text-warning-foreground" />
          </div>
          <h1 class="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {t('features.rbac.title')}
          </h1>
          <p class="mt-4 text-lg leading-relaxed text-muted-foreground">
            {t('features.rbac.desc')}
          </p>
        </div>
        <div class="w-full rounded-xl border border-border bg-card shadow-2xl">
          <div class="flex items-center gap-2 border-b border-border px-4 py-2.5">
            <div class="size-2.5 rounded-full bg-destructive/60"></div>
            <div class="size-2.5 rounded-full bg-warning/60"></div>
            <div class="size-2.5 rounded-full bg-success/60"></div>
            <span class="ml-2 text-[11px] font-medium text-muted-foreground">Ethoz — Permisos por Cargo</span>
          </div>
          <div class="p-4 sm:p-5">
            <div class="space-y-2">
              <div class="grid grid-cols-[1fr_auto_auto_auto_auto] items-center gap-2 text-[9px] font-semibold uppercase tracking-wider text-muted-foreground pb-1 border-b border-border">
                <span>Cargo</span><span>Perfil</span><span>Retiros</span><span>Conviv.</span><span>Informes</span>
              </div>
              <div class="grid grid-cols-[1fr_auto_auto_auto_auto] items-center gap-2">
                <div class="flex items-center gap-2"><img src="/images/people/director-mujer.webp" alt="" class="size-6 rounded-full object-cover" /><span class="text-[11px] font-medium text-foreground">Directora</span></div>
                <span class="size-3 rounded-full bg-success mx-auto"></span><span class="size-3 rounded-full bg-success mx-auto"></span><span class="size-3 rounded-full bg-success mx-auto"></span><span class="size-3 rounded-full bg-success mx-auto"></span>
              </div>
              <div class="grid grid-cols-[1fr_auto_auto_auto_auto] items-center gap-2">
                <div class="flex items-center gap-2"><img src="/images/people/inspector-hombre.webp" alt="" class="size-6 rounded-full object-cover" /><span class="text-[11px] font-medium text-foreground">Inspector</span></div>
                <span class="size-3 rounded-full bg-success mx-auto"></span><span class="size-3 rounded-full bg-success mx-auto"></span><span class="size-3 rounded-full bg-success mx-auto"></span><span class="size-3 rounded-full bg-muted mx-auto"></span>
              </div>
              <div class="grid grid-cols-[1fr_auto_auto_auto_auto] items-center gap-2">
                <div class="flex items-center gap-2"><img src="/images/people/docente-mujer.webp" alt="" class="size-6 rounded-full object-cover" /><span class="text-[11px] font-medium text-foreground">Docente</span></div>
                <span class="size-3 rounded-full bg-success mx-auto"></span><span class="size-3 rounded-full bg-muted mx-auto"></span><span class="size-3 rounded-full bg-success mx-auto"></span><span class="size-3 rounded-full bg-muted mx-auto"></span>
              </div>
              <div class="grid grid-cols-[1fr_auto_auto_auto_auto] items-center gap-2">
                <div class="flex items-center gap-2"><img src="/images/people/orientadora-mujer.webp" alt="" class="size-6 rounded-full object-cover" /><span class="text-[11px] font-medium text-foreground">Orientadora</span></div>
                <span class="size-3 rounded-full bg-success mx-auto"></span><span class="size-3 rounded-full bg-muted mx-auto"></span><span class="size-3 rounded-full bg-success mx-auto"></span><span class="size-3 rounded-full bg-muted mx-auto"></span>
              </div>
              <div class="grid grid-cols-[1fr_auto_auto_auto_auto] items-center gap-2">
                <div class="flex items-center gap-2"><img src="/images/people/portero-hombre.webp" alt="" class="size-6 rounded-full object-cover" /><span class="text-[11px] font-medium text-foreground">Portero</span></div>
                <span class="size-3 rounded-full bg-muted mx-auto"></span><span class="size-3 rounded-full bg-success mx-auto"></span><span class="size-3 rounded-full bg-muted mx-auto"></span><span class="size-3 rounded-full bg-muted mx-auto"></span>
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
      <div class="grid gap-6 sm:grid-cols-1 lg:grid-cols-3">

        <div class="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div class="flex items-center gap-3">
            <div class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-warning/15">
              <UserCog class="size-5 text-warning-foreground" />
            </div>
            <h2 class="text-base font-semibold text-foreground">Vistas personalizadas por cargo</h2>
          </div>
          <p class="mt-3 text-sm leading-relaxed text-muted-foreground">
            {t('features.rbac.bullet1')}
          </p>
        </div>

        <div class="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div class="flex items-center gap-3">
            <div class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-warning/15">
              <GanttChartSquare class="size-5 text-warning-foreground" />
            </div>
            <h2 class="text-base font-semibold text-foreground">Interfaz de portería ultra-restringida</h2>
          </div>
          <p class="mt-3 text-sm leading-relaxed text-muted-foreground">
            {t('features.rbac.bullet2')}
          </p>
        </div>

        <div class="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div class="flex items-center gap-3">
            <div class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-warning/15">
              <EyeOff class="size-5 text-warning-foreground" />
            </div>
            <h2 class="text-base font-semibold text-foreground">Confidencialidad filtrada por rol</h2>
          </div>
          <p class="mt-3 text-sm leading-relaxed text-muted-foreground">
            {t('features.rbac.bullet3')}
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
        Agenda una demo y configura los roles de tu equipo en menos de 48 horas.
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
