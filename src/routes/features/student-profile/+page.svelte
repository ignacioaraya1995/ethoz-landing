<script lang="ts">
  import NavBar from '$lib/components/NavBar.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import { t } from '$lib/i18n/index.svelte';
  import { Button } from '$lib/components/ui/button';
  import { ClipboardList, ArrowRight, ArrowLeft, History, Lock, BadgeCheck } from '@lucide/svelte';
  import { trackEvent } from '$lib/utils/analytics';

  $effect(() => { trackEvent('feature_page_viewed', { feature: 'student-profile' }); });
</script>

<svelte:head>
  <title>Ethoz — {t('features.record.title')}</title>
  <meta name="description" content="Un perfil longitudinal que sigue al alumno año a año, con acceso estrictamente controlado por rol." />
  <meta property="og:url" content="https://ethoz.cl/features/student-profile" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="Ethoz — Ficha Integral 360° del Alumno" />
  <meta property="og:description" content="Un perfil longitudinal que sigue al alumno año a año, con acceso estrictamente controlado por rol." />
  <link rel="canonical" href="https://ethoz.cl/features/student-profile" />
</svelte:head>

<main class="flex min-h-dvh flex-col pt-16">
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
          <div class="mb-5 flex size-14 items-center justify-center rounded-2xl bg-primary/10">
            <ClipboardList class="size-7 text-primary" />
          </div>
          <h1 class="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {t('features.record.title')}
          </h1>
          <p class="mt-4 text-lg leading-relaxed text-muted-foreground">
            {t('features.record.desc')}
          </p>
        </div>
        <div class="w-full rounded-xl border border-border bg-card shadow-2xl">
          <div class="flex items-center gap-2 border-b border-border px-4 py-2.5">
            <div class="size-2.5 rounded-full bg-destructive/60"></div>
            <div class="size-2.5 rounded-full bg-warning/60"></div>
            <div class="size-2.5 rounded-full bg-success/60"></div>
            <span class="ml-2 text-[11px] font-medium text-muted-foreground">Ethoz — Perfil del Alumno</span>
          </div>
          <div class="p-4 sm:p-5">
            <div class="flex gap-4">
              <!-- Student photo + basic info -->
              <div class="flex flex-col items-center gap-2">
                <img src="/images/students/girl-12.webp" alt="" class="size-14 rounded-full object-cover" />
                <span class="inline-flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-medium text-success">Sin alertas</span>
              </div>
              <!-- Details -->
              <div class="flex-1 min-w-0">
                <p class="text-sm font-semibold text-foreground">Valentina Rojas Sepúlveda</p>
                <p class="text-[11px] text-muted-foreground">7° Básico B · RUT 23.456.789-0</p>
                <div class="mt-2 grid grid-cols-2 gap-x-4 gap-y-1">
                  <p class="text-[10px] text-muted-foreground"><span class="font-medium text-foreground">Apoderado:</span> María Sepúlveda</p>
                  <p class="text-[10px] text-muted-foreground"><span class="font-medium text-foreground">Teléfono:</span> +56 9 8765 4321</p>
                  <p class="text-[10px] text-muted-foreground"><span class="font-medium text-foreground">Ingreso:</span> Marzo 2022</p>
                  <p class="text-[10px] text-muted-foreground"><span class="font-medium text-foreground">PIE:</span> No aplica</p>
                </div>
              </div>
            </div>
            <!-- Tabs -->
            <div class="mt-3 flex gap-1 border-b border-border">
              <span class="border-b-2 border-primary px-2.5 py-1.5 text-[10px] font-semibold text-primary">Historial</span>
              <span class="px-2.5 py-1.5 text-[10px] font-medium text-muted-foreground">Retiros</span>
              <span class="px-2.5 py-1.5 text-[10px] font-medium text-muted-foreground">Convivencia</span>
              <span class="px-2.5 py-1.5 text-[10px] font-medium text-muted-foreground">Médico</span>
            </div>
            <!-- Recent history -->
            <div class="mt-2.5 space-y-2">
              <div class="flex items-start gap-2">
                <div class="mt-0.5 size-4 shrink-0 rounded-full bg-primary/10 flex items-center justify-center">
                  <span class="text-[8px] text-primary">O</span>
                </div>
                <div>
                  <p class="text-[10px] font-medium text-foreground">Observación académica positiva</p>
                  <p class="text-[9px] text-muted-foreground">Prof. González · hace 2 días</p>
                </div>
              </div>
              <div class="flex items-start gap-2">
                <div class="mt-0.5 size-4 shrink-0 rounded-full bg-success/10 flex items-center justify-center">
                  <span class="text-[8px] text-success">R</span>
                </div>
                <div>
                  <p class="text-[10px] font-medium text-foreground">Retiro autorizado — María Sepúlveda (madre)</p>
                  <p class="text-[9px] text-muted-foreground">Portería Central · 15:30 ayer</p>
                </div>
              </div>
              <div class="flex items-start gap-2">
                <div class="mt-0.5 size-4 shrink-0 rounded-full bg-warning/10 flex items-center justify-center">
                  <span class="text-[8px] text-warning-foreground">A</span>
                </div>
                <div>
                  <p class="text-[10px] font-medium text-foreground">Atraso registrado (08:15)</p>
                  <p class="text-[9px] text-muted-foreground">Inspector Muñoz · hace 3 días</p>
                </div>
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
            <div class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <History class="size-5 text-primary" />
            </div>
            <h2 class="text-base font-semibold text-foreground">Historial longitudinal</h2>
          </div>
          <p class="mt-3 text-sm leading-relaxed text-muted-foreground">
            {t('features.record.bullet1')}
          </p>
        </div>

        <div class="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div class="flex items-center gap-3">
            <div class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <Lock class="size-5 text-primary" />
            </div>
            <h2 class="text-base font-semibold text-foreground">Niveles de confidencialidad</h2>
          </div>
          <p class="mt-3 text-sm leading-relaxed text-muted-foreground">
            {t('features.record.bullet2')}
          </p>
        </div>

        <div class="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div class="flex items-center gap-3">
            <div class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <BadgeCheck class="size-5 text-primary" />
            </div>
            <h2 class="text-base font-semibold text-foreground">Cumplimiento normativo</h2>
          </div>
          <p class="mt-3 text-sm leading-relaxed text-muted-foreground">
            {t('features.record.bullet3')}
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
        Agenda una demo y ve cómo la Ficha 360° funciona con los datos reales de tu colegio.
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
