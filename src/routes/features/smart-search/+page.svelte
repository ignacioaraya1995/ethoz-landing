<script lang="ts">
  import NavBar from '$lib/components/NavBar.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import { t } from '$lib/i18n/index.svelte';
  import { Button } from '$lib/components/ui/button';
  import {
    Search, ArrowRight, ArrowLeft, Zap, LayoutDashboard, Filter,
    AlertTriangle, BadgeCheck, Users, GraduationCap, Clock
  } from '@lucide/svelte';
  import { trackEvent } from '$lib/utils/analytics';

  $effect(() => { trackEvent('feature_page_viewed', { feature: 'smart-search' }); });

  // Simulated search states
  const searchExamples = [
    {
      query: 'maria jose',
      label: 'Búsqueda con nombre compuesto',
      note: 'Encuentra "María José Pérez Soto" aunque se escriba sin tilde',
      results: [
        { name: 'María José Pérez Soto', grade: '2° Medio A', teacher: 'Prof. Vargas', alert: null },
        { name: 'María José Contreras', grade: '5° Básico B', teacher: 'Prof. Fuentes', alert: '1 alerta' },
      ]
    },
    {
      query: 'gonzales',
      label: 'Tolerancia a errores ortográficos',
      note: '"gonzales" encuentra todos los "González" — sin distinción de tilde',
      results: [
        { name: 'Matías González Pérez', grade: '8° Básico A', teacher: 'Prof. Herrera', alert: '2 alertas' },
        { name: 'Fernanda González Rojas', grade: '1° Medio C', teacher: 'Prof. Díaz', alert: null },
        { name: 'Tomás González Vidal', grade: 'Pre-kinder', teacher: 'Tía Morales', alert: null },
      ]
    },
    {
      query: '7b',
      label: 'Búsqueda por curso',
      note: 'Filtra por sección directamente — "7b" muestra todos los alumnos de 7° Básico B',
      results: [
        { name: 'Valentina Rojas Sepúlveda', grade: '7° Básico B', teacher: 'Prof. González', alert: null },
        { name: 'Benjamín Torres Muñoz', grade: '7° Básico B', teacher: 'Prof. González', alert: null },
        { name: 'Isidora Castro Lagos', grade: '7° Básico B', teacher: 'Prof. González', alert: '1 alerta' },
      ]
    },
  ];

  let activeExample = $state(0);
  const current = $derived(searchExamples[activeExample]);
</script>

<svelte:head>
  <title>Ethoz — {t('features.search.title')}</title>
  <meta name="description" content="Cualquier alumno, en segundos, con tolerancia a errores tipográficos." />
  <meta property="og:url" content="https://ethoz.cl/features/smart-search" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="Ethoz — Búsqueda Instantánea y Dashboard Inteligente" />
  <meta property="og:description" content="Cualquier alumno, en segundos, con tolerancia a errores tipográficos." />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Ethoz — Búsqueda Instantánea y Dashboard Inteligente" />
  <meta name="twitter:description" content="Cualquier alumno, en segundos, con tolerancia a errores tipográficos." />
  <link rel="canonical" href="https://ethoz.cl/features/smart-search" />
  {@html `<script type="application/ld+json">${JSON.stringify({"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Inicio","item":"https://ethoz.cl/"},{"@type":"ListItem","position":2,"name":"Productos","item":"https://ethoz.cl/productos"},{"@type":"ListItem","position":3,"name":"Búsqueda Inteligente"}]})}</script>`}
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
      <div class="mt-6 grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
        <div class="lg:pt-4">
          <div class="flex items-center gap-3">
            <Search class="size-6 shrink-0 text-primary" />
            <h1 class="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {t('features.search.title')}
            </h1>
          </div>
          <p class="mt-4 text-lg leading-relaxed text-muted-foreground">
            {t('features.search.desc')}
          </p>
          <ul class="mt-6 space-y-3">
            <li class="flex items-start gap-2.5 text-sm text-muted-foreground">
              <BadgeCheck class="mt-0.5 size-4 shrink-0 text-primary" />
              Búsqueda fonética y tolerante a tildes — "gonzales" encuentra "González"
            </li>
            <li class="flex items-start gap-2.5 text-sm text-muted-foreground">
              <BadgeCheck class="mt-0.5 size-4 shrink-0 text-primary" />
              Resultados en menos de 50ms — sin esperar, sin recargar
            </li>
            <li class="flex items-start gap-2.5 text-sm text-muted-foreground">
              <BadgeCheck class="mt-0.5 size-4 shrink-0 text-primary" />
              Badges de alerta visibles en los resultados — el inspector sabe antes de abrir la ficha
            </li>
          </ul>

          <!-- Example selector -->
          <div class="mt-6 space-y-2">
            <p class="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Probar ejemplos:</p>
            <div class="flex flex-wrap gap-2">
              {#each searchExamples as ex, i}
                <button
                  onclick={() => activeExample = i}
                  class="text-xs font-medium px-3 py-1.5 rounded-full border transition-colors {activeExample === i ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:text-foreground'}"
                >
                  "{ex.query}"
                </button>
              {/each}
            </div>
          </div>
        </div>

        <!-- Search mockup -->
        <div class="w-full rounded-xl border border-border bg-card shadow-2xl">
          <div class="flex items-center gap-2 border-b border-border px-4 py-2.5">
            <div class="size-2.5 rounded-full bg-destructive/60"></div>
            <div class="size-2.5 rounded-full bg-warning/60"></div>
            <div class="size-2.5 rounded-full bg-success/60"></div>
            <span class="ml-2 text-[11px] font-medium text-muted-foreground">Ethoz — Búsqueda inteligente</span>
          </div>
          <div class="p-4 sm:p-5">
            <!-- Search bar -->
            <div class="flex items-center gap-2 rounded-lg border border-primary/40 bg-background px-3 py-2 mb-1 shadow-sm">
              <Search class="size-3.5 shrink-0 text-muted-foreground" />
              <span class="text-xs text-foreground font-medium">{current.query}</span>
              <span class="animate-pulse text-xs text-primary ml-0.5">|</span>
            </div>
            <p class="mb-3 text-[9px] text-muted-foreground pl-1">{current.note}</p>

            <!-- Results -->
            <div class="space-y-1">
              {#each current.results as result, i}
                <div class="flex items-center gap-2.5 rounded-lg px-2.5 py-2 {i === 0 ? 'bg-primary/5' : 'hover:bg-muted/40'} transition-colors">
                  <div class="size-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                    <GraduationCap class="size-4 text-muted-foreground" />
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-[11px] font-medium text-foreground">{result.name}</p>
                    <p class="text-[9px] text-muted-foreground">{result.grade} · {result.teacher}</p>
                  </div>
                  {#if result.alert}
                    <span class="shrink-0 inline-flex items-center gap-1 rounded-full bg-warning/10 px-1.5 py-0.5 text-[8px] font-semibold text-warning-foreground">
                      <AlertTriangle class="size-2.5" />
                      {result.alert}
                    </span>
                  {:else}
                    <span class="shrink-0 inline-flex items-center gap-1 rounded-full bg-success/10 px-1.5 py-0.5 text-[8px] font-medium text-success">
                      Sin alertas
                    </span>
                  {/if}
                </div>
              {/each}
            </div>
            <p class="mt-2.5 text-center text-[9px] text-muted-foreground">{current.results.length} resultado{current.results.length !== 1 ? 's' : ''} · 0.03s · Colegio Alemán de Concepción</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Dashboard mockup section -->
  <section class="py-16 sm:py-20">
    <div class="mx-auto max-w-4xl px-4 sm:px-6">
      <div class="grid gap-10 lg:grid-cols-2 items-start">
        <div>
          <h2 class="text-xl font-bold tracking-tight text-foreground sm:text-2xl">Dashboard con visión de curso completo</h2>
          <p class="mt-3 text-sm leading-relaxed text-muted-foreground">
            El Inspector de piso ve en una pantalla todos los alumnos con alertas activas, ordenados por urgencia. Sin necesidad de buscar uno a uno.
          </p>
          <p class="mt-3 text-sm leading-relaxed text-muted-foreground">
            Los badges cambian en tiempo real cuando un nuevo retiro se registra o una alerta se resuelve — cualquier cambio es inmediatamente visible.
          </p>
          <ul class="mt-5 space-y-2">
            {#each [
              'Filtrar por curso, ciclo o sección',
              'Ordenar por nombre, alertas o último evento',
              'Exportar lista con un clic (solo para roles autorizados)',
            ] as item}
              <li class="flex items-start gap-2 text-sm text-muted-foreground">
                <BadgeCheck class="mt-0.5 size-4 shrink-0 text-primary" />
                {item}
              </li>
            {/each}
          </ul>
        </div>

        <!-- Dashboard mockup -->
        <div class="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
          <div class="border-b border-border px-4 py-3 flex items-center justify-between gap-3">
            <div class="flex items-center gap-2">
              <LayoutDashboard class="size-4 text-primary" />
              <span class="text-sm font-semibold text-foreground">Alumnos con alertas activas</span>
            </div>
            <span class="inline-flex items-center gap-1 rounded-full bg-warning/10 px-2 py-0.5 text-[10px] font-semibold text-warning-foreground">
              <AlertTriangle class="size-3" /> 4 alertas
            </span>
          </div>
          <div class="divide-y divide-border">
            {#each [
              { name: 'Matías González Pérez', grade: '8° Básico A', alerts: ['Restricción retiro', 'Alerta médica'], urgent: true },
              { name: 'Isidora Castro Lagos', grade: '7° Básico B', alerts: ['3 atrasos este mes'], urgent: false },
              { name: 'Sebastián Muñoz Vera', grade: '1° Medio C', alerts: ['Convivencia pendiente'], urgent: false },
              { name: 'Valentín Araya Torres', grade: '3° Medio A', alerts: ['1 observación activa'], urgent: false },
            ] as row}
              <div class="flex items-center gap-3 px-4 py-2.5">
                <div class="size-7 rounded-full bg-muted flex items-center justify-center shrink-0">
                  <GraduationCap class="size-3.5 text-muted-foreground" />
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-xs font-medium text-foreground">{row.name}</p>
                  <p class="text-[10px] text-muted-foreground">{row.grade}</p>
                </div>
                <div class="flex flex-col items-end gap-1">
                  {#each row.alerts as alert}
                    <span class="inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[8px] font-medium {row.urgent ? 'bg-destructive/10 text-destructive' : 'bg-warning/10 text-warning-foreground'}">
                      {alert}
                    </span>
                  {/each}
                </div>
              </div>
            {/each}
          </div>
          <div class="px-4 py-2.5 border-t border-border bg-muted/20">
            <p class="text-[9px] text-muted-foreground">Colegio San Patricio · Ñuñoa · Actualizado hace 2 min</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Detail cards -->
  <section class="bg-secondary py-16 sm:py-20">
    <div class="mx-auto max-w-4xl px-4 sm:px-6">
      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

        <div class="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div class="flex items-center gap-2.5">
            <Zap class="size-5 shrink-0 text-primary" />
            <h2 class="text-base font-semibold text-foreground">Búsqueda tolerante a errores</h2>
          </div>
          <p class="mt-3 text-sm leading-relaxed text-muted-foreground">
            {t('features.search.bullet1')}
          </p>
        </div>

        <div class="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div class="flex items-center gap-2.5">
            <LayoutDashboard class="size-5 shrink-0 text-primary" />
            <h2 class="text-base font-semibold text-foreground">Dashboard con badges de alerta</h2>
          </div>
          <p class="mt-3 text-sm leading-relaxed text-muted-foreground">
            {t('features.search.bullet2')}
          </p>
        </div>

        <div class="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div class="flex items-center gap-2.5">
            <Filter class="size-5 shrink-0 text-primary" />
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
  <section class="py-16 sm:py-20">
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
