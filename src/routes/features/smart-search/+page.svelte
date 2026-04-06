<script lang="ts">
  import NavBar from '$lib/components/NavBar.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import { t } from '$lib/i18n/index.svelte';
  import { Button } from '$lib/components/ui/button';
  import { Search, ArrowRight, ArrowLeft, Zap, LayoutDashboard, Filter } from '@lucide/svelte';
  import { trackEvent } from '$lib/utils/analytics';

  $effect(() => { trackEvent('feature_page_viewed', { feature: 'smart-search' }); });
</script>

<svelte:head>
  <title>Ethoz — {t('features.search.title')}</title>
  <meta name="description" content="Cualquier alumno, en segundos, con tolerancia a errores tipográficos." />
  <meta property="og:url" content="https://ethoz.cl/features/smart-search" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="Ethoz — Búsqueda Instantánea y Dashboard Inteligente" />
  <meta property="og:description" content="Cualquier alumno, en segundos, con tolerancia a errores tipográficos." />
  <meta name="twitter:title" content="Ethoz — Búsqueda Instantánea y Dashboard Inteligente" />
  <meta name="twitter:description" content="Cualquier alumno, en segundos, con tolerancia a errores tipográficos." />
  <link rel="canonical" href="https://ethoz.cl/features/smart-search" />
  {@html `<script type="application/ld+json">${JSON.stringify({"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Inicio","item":"https://ethoz.cl/"},{"@type":"ListItem","position":2,"name":"Productos","item":"https://ethoz.cl/productos"},{"@type":"ListItem","position":3,"name":"Búsqueda Inteligente"}]})}</script>`}
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
          <div class="flex items-center gap-3">
            <Search class="size-6 shrink-0 text-primary" />
            <h1 class="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {t('features.search.title')}
            </h1>
          </div>
          <p class="mt-4 text-lg leading-relaxed text-muted-foreground">
            {t('features.search.desc')}
          </p>
        </div>
        <div class="w-full rounded-xl border border-border bg-card shadow-2xl">
          <div class="flex items-center gap-2 border-b border-border px-4 py-2.5">
            <div class="size-2.5 rounded-full bg-destructive/60"></div>
            <div class="size-2.5 rounded-full bg-warning/60"></div>
            <div class="size-2.5 rounded-full bg-success/60"></div>
            <span class="ml-2 text-[11px] font-medium text-muted-foreground">Ethoz — Búsqueda</span>
          </div>
          <div class="p-4 sm:p-5">
            <div class="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 mb-3">
              <span class="text-xs text-muted-foreground">🔍</span>
              <span class="text-xs text-foreground">val</span>
              <span class="animate-pulse text-xs text-primary">|</span>
            </div>
            <div class="space-y-1">
              <div class="flex items-center gap-2.5 rounded-lg px-2.5 py-2 bg-primary/5">
                <img src="/images/students/girl-12.webp" alt="Alumna encontrada en búsqueda" class="size-8 rounded-full object-cover" />
                <div class="flex-1 min-w-0">
                  <p class="text-[11px] font-medium text-foreground"><mark class="bg-primary/20 text-foreground font-semibold">Val</mark>entina Rojas</p>
                  <p class="text-[9px] text-muted-foreground">7° Básico B · Prof. jefe: C. González</p>
                </div>
                <span class="inline-flex items-center gap-1 rounded-full bg-success/10 px-1.5 py-0.5 text-[8px] font-medium text-success">Sin alertas</span>
              </div>
              <div class="flex items-center gap-2.5 rounded-lg px-2.5 py-2 hover:bg-muted/50">
                <img src="/images/students/kid-14.webp" alt="Alumno encontrado en búsqueda" class="size-8 rounded-full object-cover" />
                <div class="flex-1 min-w-0">
                  <p class="text-[11px] font-medium text-foreground"><mark class="bg-primary/20 text-foreground font-semibold">Val</mark>entín Araya</p>
                  <p class="text-[9px] text-muted-foreground">3° Medio A · Prof. jefe: M. López</p>
                </div>
                <span class="inline-flex items-center gap-1 rounded-full bg-warning/10 px-1.5 py-0.5 text-[8px] font-medium text-warning-foreground">1 alerta</span>
              </div>
              <div class="flex items-center gap-2.5 rounded-lg px-2.5 py-2 hover:bg-muted/50">
                <img src="/images/students/girl-15.webp" alt="Alumna encontrada en búsqueda" class="size-8 rounded-full object-cover" />
                <div class="flex-1 min-w-0">
                  <p class="text-[11px] font-medium text-foreground"><mark class="bg-primary/20 text-foreground font-semibold">Val</mark>eria Fuentes</p>
                  <p class="text-[9px] text-muted-foreground">1° Medio C · Prof. jefe: A. Díaz</p>
                </div>
                <span class="inline-flex items-center gap-1 rounded-full bg-success/10 px-1.5 py-0.5 text-[8px] font-medium text-success">Sin alertas</span>
              </div>
            </div>
            <p class="mt-2 text-center text-[9px] text-muted-foreground">3 resultados · 0.02s</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Detail cards -->
  <section class="py-16 sm:py-20">
    <div class="mx-auto max-w-4xl px-4 sm:px-6">
      <div class="grid gap-6 sm:grid-cols-1 lg:grid-cols-3">

        <div class="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div class="flex items-center gap-3">
            <div class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <Zap class="size-5 text-primary" />
            </div>
            <h2 class="text-base font-semibold text-foreground">Búsqueda tolerante a errores</h2>
          </div>
          <p class="mt-3 text-sm leading-relaxed text-muted-foreground">
            {t('features.search.bullet1')}
          </p>
        </div>

        <div class="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div class="flex items-center gap-3">
            <div class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <LayoutDashboard class="size-5 text-primary" />
            </div>
            <h2 class="text-base font-semibold text-foreground">Dashboard con badges de alerta</h2>
          </div>
          <p class="mt-3 text-sm leading-relaxed text-muted-foreground">
            {t('features.search.bullet2')}
          </p>
        </div>

        <div class="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div class="flex items-center gap-3">
            <div class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <Filter class="size-5 text-primary" />
            </div>
            <h2 class="text-base font-semibold text-foreground">Filtros precisos de navegación</h2>
          </div>
          <p class="mt-3 text-sm leading-relaxed text-muted-foreground">
            {t('features.search.bullet3')}
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
        Agenda una demo y ve cómo encontrar cualquier alumno en segundos desde el primer día.
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
