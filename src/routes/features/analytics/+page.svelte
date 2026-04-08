<script lang="ts">
  import NavBar from '$lib/components/NavBar.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import { Button } from '$lib/components/ui/button';
  import { Badge } from '$lib/components/ui/badge';
  import { t } from '$lib/i18n/index.svelte';
  import { trackEvent } from '$lib/utils/analytics';
  import { BarChart3, ArrowRight, ArrowLeft, TrendingUp, Users, ShieldAlert, ClipboardList, Filter } from '@lucide/svelte';

  $effect(() => { trackEvent('feature_page_viewed', { feature: 'analytics' }); });
</script>

<svelte:head>
  <title>Ethoz — Analytics y KPIs Escolares</title>
  <meta name="description" content="Dashboard de analytics para directivos: KPIs de convivencia, alertas activas, tendencias de asistencia y cumplimiento Ley 21.719 en tiempo real." />
  <meta property="og:url" content="https://ethoz.cl/features/analytics" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="Ethoz — Analytics y KPIs Escolares" />
  <meta property="og:description" content="Indicadores clave de convivencia, alertas y asistencia para directivos y sostenedores." />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Ethoz — Analytics y KPIs Escolares" />
  <meta name="twitter:description" content="Indicadores clave de convivencia, alertas y asistencia para directivos y sostenedores." />
  <link rel="canonical" href="https://ethoz.cl/features/analytics" />
  {@html `<script type="application/ld+json">${JSON.stringify({"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Inicio","item":"https://ethoz.cl/"},{"@type":"ListItem","position":2,"name":"Productos","item":"https://ethoz.cl/productos"},{"@type":"ListItem","position":3,"name":"Analytics y KPIs"}]})}</script>`}
</svelte:head>

<main class="flex min-h-dvh flex-col bg-background">
  <NavBar />

  <!-- Hero -->
  <section class="bg-secondary pt-28 pb-16 sm:pt-32 sm:pb-20">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <a href="/productos" class="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground">
        <ArrowLeft class="size-3.5" />
        Volver a productos
      </a>
      <div class="mt-6 grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div>
          <div class="flex items-center gap-3">
            <BarChart3 class="size-6 shrink-0 text-primary" />
            <h1 class="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Dashboard de Analytics Escolar
            </h1>
          </div>
          <p class="mt-4 text-lg leading-relaxed text-muted-foreground">
            Indicadores operacionales en tiempo real para directivos y sostenedores: convivencia, alertas críticas, tendencias de asistencia y estado de cumplimiento normativo — sin reportes manuales.
          </p>
          <div class="mt-6 flex flex-wrap gap-2">
            <span class="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">Cumplimiento Ley 21.719</span>
            <span class="inline-flex items-center gap-1.5 rounded-full bg-success/10 px-3 py-1 text-xs font-medium text-success">Tiempo real</span>
            <span class="inline-flex items-center gap-1.5 rounded-full bg-warning/15 px-3 py-1 text-xs font-medium text-warning-foreground">Multi-sede</span>
          </div>
          <div class="mt-8 flex flex-wrap gap-3">
            <Button size="lg" href="/demo">
              Agendar Demo <ArrowRight class="size-4" />
            </Button>
            <Button size="lg" variant="outline" href="/productos">
              Ver todos los módulos
            </Button>
          </div>
        </div>

        <!-- KPI Cards mockup -->
        <div class="w-full rounded-xl border border-border bg-card shadow-2xl">
          <div class="flex items-center gap-2 border-b border-border px-4 py-2.5">
            <div class="size-2.5 rounded-full bg-destructive/60"></div>
            <div class="size-2.5 rounded-full bg-warning/60"></div>
            <div class="size-2.5 rounded-full bg-success/60"></div>
            <span class="ml-2 text-[11px] font-medium text-muted-foreground">Ethoz — Dashboard · Colegio San Patricio</span>
          </div>
          <!-- Filter bar mockup -->
          <div class="flex items-center gap-2 border-b border-border px-4 py-2 bg-muted/20">
            <Filter class="size-3 text-muted-foreground" />
            <span class="text-[10px] text-muted-foreground">2026 · Todos los cursos · Todos los géneros</span>
            <span class="ml-auto rounded bg-primary/10 px-2 py-0.5 text-[9px] font-medium text-primary">Aplicar</span>
          </div>
          <div class="p-4 sm:p-5">
            <!-- KPI row -->
            <div class="grid grid-cols-2 gap-2 sm:grid-cols-4">
              <div class="rounded-lg bg-muted/30 p-2.5 text-center">
                <p class="text-lg font-bold text-foreground">487</p>
                <p class="text-[9px] text-muted-foreground">Alumnos</p>
              </div>
              <div class="rounded-lg bg-destructive/5 p-2.5 text-center">
                <p class="text-lg font-bold text-destructive">7</p>
                <p class="text-[9px] text-muted-foreground">Alertas activas</p>
              </div>
              <div class="rounded-lg bg-warning/5 p-2.5 text-center">
                <p class="text-lg font-bold text-warning-foreground">12</p>
                <p class="text-[9px] text-muted-foreground">Retiros hoy</p>
              </div>
              <div class="rounded-lg bg-success/5 p-2.5 text-center">
                <p class="text-lg font-bold text-success">98%</p>
                <p class="text-[9px] text-muted-foreground">Cumplimiento</p>
              </div>
            </div>
            <!-- Bar chart mockup -->
            <div class="mt-3">
              <p class="mb-2 text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">Observaciones por mes (2026)</p>
              <div class="flex items-end gap-1 h-16">
                {#each [
                  { label: 'Mar', h: 35, color: 'bg-primary/40' },
                  { label: 'Abr', h: 52, color: 'bg-primary/60' },
                  { label: 'May', h: 41, color: 'bg-primary/40' },
                  { label: 'Jun', h: 68, color: 'bg-primary/80' },
                  { label: 'Jul', h: 29, color: 'bg-primary/30' },
                  { label: 'Ago', h: 55, color: 'bg-primary/60' },
                  { label: 'Sep', h: 72, color: 'bg-primary' },
                  { label: 'Oct', h: 63, color: 'bg-primary/70' },
                ] as bar}
                  <div class="flex flex-1 flex-col items-center gap-0.5">
                    <div class="w-full rounded-t {bar.color}" style="height: {bar.h}%"></div>
                    <span class="text-[8px] text-muted-foreground">{bar.label}</span>
                  </div>
                {/each}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Charts section -->
  <section class="py-16 sm:py-20">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-2xl text-center">
        <h2 class="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Visualizaciones diseñadas para tomar decisiones</h2>
        <p class="mt-3 text-base text-muted-foreground">No son reportes para cumplir: son herramientas para actuar.</p>
      </div>

      <div class="mt-12 grid gap-8 lg:grid-cols-2">

        <!-- Donut chart mockup -->
        <div class="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div class="flex items-center gap-2.5 mb-5">
            <ClipboardList class="size-5 shrink-0 text-primary" />
            <h3 class="text-base font-semibold text-foreground">Observaciones por categoría</h3>
          </div>
          <div class="flex items-center gap-6">
            <!-- Donut -->
            <div class="relative shrink-0 size-28">
              <svg viewBox="0 0 36 36" class="size-28 -rotate-90">
                <circle cx="18" cy="18" r="14" fill="none" stroke="hsl(var(--muted))" stroke-width="4" />
                <!-- Académico 32% -->
                <circle cx="18" cy="18" r="14" fill="none" stroke="hsl(var(--primary))" stroke-width="4"
                  stroke-dasharray="28 88" stroke-dashoffset="0" />
                <!-- Conductual 24% -->
                <circle cx="18" cy="18" r="14" fill="none" stroke="hsl(var(--destructive))" stroke-width="4"
                  stroke-dasharray="21 95" stroke-dashoffset="-28" />
                <!-- Emocional 20% -->
                <circle cx="18" cy="18" r="14" fill="none" stroke="hsl(var(--warning))" stroke-width="4"
                  stroke-dasharray="18 98" stroke-dashoffset="-49" />
                <!-- Familiar 14% -->
                <circle cx="18" cy="18" r="14" fill="none" stroke="hsl(var(--success))" stroke-width="4"
                  stroke-dasharray="12 104" stroke-dashoffset="-67" />
                <!-- Asistencia 10% -->
                <circle cx="18" cy="18" r="14" fill="none" stroke="hsl(var(--muted-foreground))" stroke-width="4"
                  stroke-dasharray="9 107" stroke-dashoffset="-79" />
              </svg>
              <span class="absolute inset-0 flex flex-col items-center justify-center">
                <span class="text-lg font-bold text-foreground">234</span>
                <span class="text-[9px] text-muted-foreground">total</span>
              </span>
            </div>
            <!-- Legend -->
            <div class="flex-1 space-y-2">
              {#each [
                { label: 'Académico', pct: '32%', color: 'bg-primary' },
                { label: 'Conductual', pct: '24%', color: 'bg-destructive' },
                { label: 'Emocional', pct: '20%', color: 'bg-warning' },
                { label: 'Familiar', pct: '14%', color: 'bg-success' },
                { label: 'Asistencia', pct: '10%', color: 'bg-muted-foreground' },
              ] as item}
                <div class="flex items-center justify-between gap-2">
                  <div class="flex items-center gap-1.5">
                    <span class="size-2 rounded-full shrink-0 {item.color}"></span>
                    <span class="text-xs text-muted-foreground">{item.label}</span>
                  </div>
                  <span class="text-xs font-semibold text-foreground">{item.pct}</span>
                </div>
              {/each}
            </div>
          </div>
        </div>

        <!-- Risk table mockup -->
        <div class="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div class="flex items-center gap-2.5 mb-5">
            <ShieldAlert class="size-5 shrink-0 text-destructive" />
            <h3 class="text-base font-semibold text-foreground">Top 5 alumnos con más observaciones</h3>
          </div>
          <div class="space-y-2">
            <div class="grid grid-cols-[1fr_auto_auto] gap-2 text-[9px] font-semibold uppercase tracking-wider text-muted-foreground px-1 pb-1 border-b border-border">
              <span>Alumno</span>
              <span class="text-center">Obs.</span>
              <span class="text-center">Riesgo</span>
            </div>
            {#each [
              { name: 'Matías González H.', curso: '8°A', obs: 14, risk: 'Alto', riskColor: 'bg-destructive/10 text-destructive' },
              { name: 'Sofía Carrasco M.', curso: '7°B', obs: 11, risk: 'Alto', riskColor: 'bg-destructive/10 text-destructive' },
              { name: 'Diego Fuentes P.', curso: '6°A', obs: 8, risk: 'Medio', riskColor: 'bg-warning/10 text-warning-foreground' },
              { name: 'Catalina Vega R.', curso: '5°B', obs: 6, risk: 'Medio', riskColor: 'bg-warning/10 text-warning-foreground' },
              { name: 'Joaquín Soto N.', curso: '8°B', obs: 4, risk: 'Bajo', riskColor: 'bg-success/10 text-success' },
            ] as row}
              <div class="grid grid-cols-[1fr_auto_auto] gap-2 items-center rounded-lg px-1 py-1.5 hover:bg-muted/30 transition-colors">
                <div>
                  <p class="text-xs font-medium text-foreground">{row.name}</p>
                  <p class="text-[9px] text-muted-foreground">{row.curso}</p>
                </div>
                <span class="text-center text-sm font-bold text-foreground">{row.obs}</span>
                <span class="rounded-full px-2 py-0.5 text-[9px] font-semibold {row.riskColor}">{row.risk}</span>
              </div>
            {/each}
          </div>
        </div>

      </div>
    </div>
  </section>

  <!-- Features grid -->
  <section class="bg-secondary py-16 sm:py-20">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-2xl text-center">
        <h2 class="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Para directivos, sostenedores y equipos PIE</h2>
        <p class="mt-3 text-base text-muted-foreground">Cada perfil ve los indicadores relevantes para su función.</p>
      </div>
      <div class="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div class="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div class="flex items-center gap-2.5">
            <TrendingUp class="size-5 shrink-0 text-primary" />
            <h3 class="text-base font-semibold text-foreground">Tendencias de convivencia</h3>
          </div>
          <p class="mt-3 text-sm leading-relaxed text-muted-foreground">Detecta semanas de alta conflictividad antes de que escalen. Compara períodos y cursos con un clic.</p>
        </div>
        <div class="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div class="flex items-center gap-2.5">
            <Users class="size-5 shrink-0 text-primary" />
            <h3 class="text-base font-semibold text-foreground">Segmentación por curso y género</h3>
          </div>
          <p class="mt-3 text-sm leading-relaxed text-muted-foreground">Filtra indicadores por nivel, curso, sección y género. Identifica brechas y patrones que los reportes manuales no revelan.</p>
        </div>
        <div class="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div class="flex items-center gap-2.5">
            <BarChart3 class="size-5 shrink-0 text-primary" />
            <h3 class="text-base font-semibold text-foreground">Dashboard multi-sede</h3>
          </div>
          <p class="mt-3 text-sm leading-relaxed text-muted-foreground">Sostenedores con múltiples establecimientos ven todos sus indicadores consolidados. Compara sedes con métricas homologadas.</p>
        </div>
        <div class="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div class="flex items-center gap-2.5">
            <ShieldAlert class="size-5 shrink-0 text-destructive" />
            <h3 class="text-base font-semibold text-foreground">KPI de cumplimiento normativo</h3>
          </div>
          <p class="mt-3 text-sm leading-relaxed text-muted-foreground">Porcentaje de consentimientos firmados (Ley 21.719), alertas gestionadas a tiempo y protocolos completados.</p>
        </div>
        <div class="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div class="flex items-center gap-2.5">
            <ClipboardList class="size-5 shrink-0 text-primary" />
            <h3 class="text-base font-semibold text-foreground">Exportación para SEREMIs</h3>
          </div>
          <p class="mt-3 text-sm leading-relaxed text-muted-foreground">Genera informes estadísticos en el formato que exige la SEREMI de Educación o la Superintendencia de Educación.</p>
        </div>
        <div class="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div class="flex items-center gap-2.5">
            <Filter class="size-5 shrink-0 text-primary" />
            <h3 class="text-base font-semibold text-foreground">Alertas de umbral automáticas</h3>
          </div>
          <p class="mt-3 text-sm leading-relaxed text-muted-foreground">Configura umbrales: si un alumno supera X observaciones en Y días, el sistema notifica automáticamente a Orientación.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- Por qué importa -->
  <section class="py-16 sm:py-20">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="grid gap-8 sm:grid-cols-3">
        <div class="rounded-xl border border-border bg-card p-6 text-center shadow-sm">
          <p class="text-3xl font-bold text-primary">5.777</p>
          <p class="mt-1 text-sm font-semibold text-foreground">sostenedores en Chile</p>
          <p class="mt-2 text-xs text-muted-foreground">Solo los 402 operadores multi-sede tienen acceso a datos consolidados hoy — con Ethoz, cualquier colegio los tiene</p>
        </div>
        <div class="rounded-xl border border-border bg-card p-6 text-center shadow-sm">
          <p class="text-3xl font-bold text-destructive">4%</p>
          <p class="mt-1 text-sm font-semibold text-foreground">de ingresos anuales</p>
          <p class="mt-2 text-xs text-muted-foreground">Multa máxima alternativa bajo Ley 21.719 para sostenedores con ingresos superiores a 50.000 UF anuales</p>
        </div>
        <div class="rounded-xl border border-border bg-card p-6 text-center shadow-sm">
          <p class="text-3xl font-bold text-success">100%</p>
          <p class="mt-1 text-sm font-semibold text-foreground">datos propios del colegio</p>
          <p class="mt-2 text-xs text-muted-foreground">Ethoz no vende ni comparte estadísticas de tu establecimiento. Los datos son tuyos, siempre exportables.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- CTA -->
  <section class="bg-secondary py-16 sm:py-20">
    <div class="mx-auto max-w-2xl px-4 text-center sm:px-6">
      <h2 class="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Deja de gestionar con hojas de cálculo</h2>
      <p class="mt-4 text-base leading-relaxed text-muted-foreground">
        Agenda una demo y te mostramos el dashboard con datos reales de un colegio similar al tuyo.
      </p>
      <div class="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Button size="lg" href="/demo">
          Agendar Demo <ArrowRight class="size-4" />
        </Button>
        <Button size="lg" variant="outline" href="/productos">
          Ver todos los módulos
        </Button>
      </div>
    </div>
  </section>

  <Footer />
</main>
