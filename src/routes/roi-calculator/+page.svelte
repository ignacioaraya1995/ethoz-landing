<script lang="ts">
  import NavBar from '$lib/components/NavBar.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import { Button } from '$lib/components/ui/button';
  import { trackEvent } from '$lib/utils/analytics';
  import {
    Calculator,
    ShieldAlert,
    Clock,
    Banknote,
    AlertTriangle,
    ArrowRight,
    Info,
  } from '@lucide/svelte';

  $effect(() => {
    trackEvent('page_viewed', { page: 'roi-calculator' });
  });

  // ── Inputs ──
  let students = $state(800);
  let sedes = $state(1);
  let dailyPickups = $state(40);
  let hasSensitiveData = $state(false);

  // ── Constants ──
  const UTM_CLP = 67000; // CLP per UTM (2025 reference)
  const MAX_UTM = 20000;
  const HOURLY_RATE_CLP = 15000;
  const WEEKS_PER_YEAR = 40;
  const MANUAL_MINUTES_PER_PICKUP = 2;

  // ── Derived outputs ──
  // Max fine exposure: base is up to 20,000 UTM, multiplied by sedes factor for multi-school operators
  let maxFineUTM = $derived(Math.min(MAX_UTM, 2000 + Math.floor(students / 50) * 200 + sedes * 500));
  let maxFineCLP = $derived(maxFineUTM * UTM_CLP);

  // Weekly hours on manual verification
  let weeklyHours = $derived(
    Math.round(((dailyPickups * MANUAL_MINUTES_PER_PICKUP * 5) / 60) * 10) / 10
  );

  // Annual operational cost (hours × rate × weeks)
  let annualOpCost = $derived(Math.round(weeklyHours * HOURLY_RATE_CLP * WEEKS_PER_YEAR));

  // Sensitive data multiplier: if they handle clinical/judicial data, exposure is higher
  let sensitiveMultiplier = $derived(hasSensitiveData ? 1.5 : 1.0);

  // Total value at risk: fine exposure (modeled fraction) + operational cost
  let valueAtRisk = $derived(
    Math.round((maxFineCLP * 0.15 * sensitiveMultiplier) + annualOpCost)
  );

  // Format helpers
  function formatCLP(value: number): string {
    if (value >= 1_000_000) {
      return `$${(value / 1_000_000).toFixed(1)}M CLP`;
    }
    return `$${value.toLocaleString('es-CL')} CLP`;
  }

  function formatUTM(value: number): string {
    return `${value.toLocaleString('es-CL')} UTM`;
  }

  // Demo URL with prefilled params
  let demoUrl = $derived(
    `/demo?students=${students}&sedes=${sedes}&pickups=${dailyPickups}&sensitive=${hasSensitiveData}`
  );
</script>

<svelte:head>
  <title>Calculadora de ROI — Ethoz | Calcula tu exposición al riesgo Ley 21.719</title>
  <meta name="description" content="Calcula en 30 segundos tu exposición real al riesgo de la Ley 21.719 y el costo operacional actual de verificación manual en tu colegio. Herramienta gratuita de Ethoz." />
  <meta property="og:url" content="https://ethoz.cl/roi-calculator" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="Calculadora de ROI — Ethoz" />
  <meta property="og:description" content="Calcula tu exposición al riesgo Ley 21.719 y costo operacional actual en tu colegio." />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Calculadora de ROI — Ethoz" />
  <meta name="twitter:description" content="Calcula en 30 segundos tu exposición al riesgo Ley 21.719." />
  <link rel="canonical" href="https://ethoz.cl/roi-calculator" />
  {@html `<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Inicio", "item": "https://ethoz.cl/" },
      { "@type": "ListItem", "position": 2, "name": "Calculadora de ROI" }
    ]
  })}</script>`}
</svelte:head>

<main class="flex min-h-dvh flex-col bg-background">
  <NavBar />

  <!-- ══════════════════════════════════════
       HERO
       ══════════════════════════════════════ -->
  <section class="pt-28 pb-16 sm:pt-32 sm:pb-20 bg-secondary">
    <div class="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
      <div class="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary shadow-sm">
        <Calculator class="size-3.5" />
        Calculadora de exposición
      </div>
      <h1 class="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
        Calcula tu exposición al riesgo
      </h1>
      <p class="mt-3 text-lg font-semibold text-primary">En 30 segundos</p>
      <p class="mt-5 text-lg leading-relaxed text-muted-foreground sm:text-xl">
        Ingresa los datos de tu establecimiento y calcula tu exposición máxima ante la Ley 21.719, el costo operacional actual de verificación manual y el valor total en riesgo.
      </p>
    </div>
  </section>

  <!-- ══════════════════════════════════════
       CALCULATOR
       ══════════════════════════════════════ -->
  <section class="py-16 sm:py-20 bg-background">
    <div class="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
      <div class="grid gap-10 lg:grid-cols-2 lg:gap-16 items-start">

        <!-- LEFT: Inputs -->
        <div>
          <h2 class="text-xl font-bold text-foreground mb-6">Datos de tu establecimiento</h2>

          <!-- Número de alumnos -->
          <div class="mb-8">
            <div class="mb-2 flex items-center justify-between">
              <label for="students-slider" class="text-sm font-semibold text-foreground">
                Número de alumnos
              </label>
              <span class="text-sm font-bold text-primary">{students.toLocaleString('es-CL')}</span>
            </div>
            <input
              id="students-slider"
              type="range"
              min="100"
              max="5000"
              step="50"
              bind:value={students}
              class="w-full h-2 rounded-full bg-border appearance-none cursor-pointer accent-primary"
            />
            <div class="mt-1.5 flex justify-between text-xs text-muted-foreground">
              <span>100</span>
              <span>5.000</span>
            </div>
          </div>

          <!-- Número de sedes -->
          <div class="mb-8">
            <label for="sedes-input" class="mb-2 flex items-center justify-between">
              <span class="text-sm font-semibold text-foreground">Número de sedes</span>
              <span class="text-sm font-bold text-primary">{sedes}</span>
            </label>
            <input
              id="sedes-input"
              type="number"
              min="1"
              max="50"
              bind:value={sedes}
              class="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="Ej: 3"
            />
            <p class="mt-1 text-xs text-muted-foreground">Sostenedores multi-colegio tienen mayor exposición regulatoria.</p>
          </div>

          <!-- Retiros diarios -->
          <div class="mb-8">
            <div class="mb-2 flex items-center justify-between">
              <label for="pickups-slider" class="text-sm font-semibold text-foreground">
                Retiros diarios promedio
              </label>
              <span class="text-sm font-bold text-primary">{dailyPickups}</span>
            </div>
            <input
              id="pickups-slider"
              type="range"
              min="10"
              max="500"
              step="5"
              bind:value={dailyPickups}
              class="w-full h-2 rounded-full bg-border appearance-none cursor-pointer accent-primary"
            />
            <div class="mt-1.5 flex justify-between text-xs text-muted-foreground">
              <span>10</span>
              <span>500</span>
            </div>
          </div>

          <!-- Datos sensibles -->
          <div class="rounded-xl border border-border bg-card p-4">
            <label class="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                bind:checked={hasSensitiveData}
                class="mt-0.5 size-4 rounded border-border accent-primary cursor-pointer"
              />
              <div>
                <p class="text-sm font-semibold text-foreground">Procesamos datos sensibles</p>
                <p class="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                  Incluye datos médicos, diagnósticos psicológicos, informes clínicos, órdenes judiciales o registros PIE. Aumenta la exposición al riesgo bajo el Art. 16 bis de la Ley 21.719.
                </p>
              </div>
            </label>
          </div>
        </div>

        <!-- RIGHT: Results -->
        <div>
          <h2 class="text-xl font-bold text-foreground mb-6">Tu exposición estimada</h2>

          <!-- Fine exposure -->
          <div class="mb-4 rounded-xl border border-border bg-card p-5 shadow-sm">
            <div class="mb-2 flex items-center gap-2">
              <ShieldAlert class="size-5 shrink-0 text-destructive" />
              <p class="text-sm font-semibold text-foreground">Exposición máxima Ley 21.719</p>
            </div>
            <p class="text-3xl font-bold tracking-tight text-foreground">{formatUTM(maxFineUTM)}</p>
            <p class="mt-0.5 text-sm text-muted-foreground">≈ {formatCLP(maxFineCLP)}</p>
            <p class="mt-2 text-xs text-muted-foreground">
              Calculado sobre la estructura de multas de la Ley 21.719 (hasta 20.000 UTM o 4% facturación anual). Esta es la exposición máxima teórica — no la multa probable.
            </p>
            {#if hasSensitiveData}
              <p class="mt-2 text-xs font-semibold text-destructive">
                ↑ Multiplicador activo: datos sensibles (Art. 16 bis)
              </p>
            {/if}
          </div>

          <!-- Operational hours -->
          <div class="mb-4 rounded-xl border border-border bg-card p-5 shadow-sm">
            <div class="mb-2 flex items-center gap-2">
              <Clock class="size-5 shrink-0 text-primary" />
              <p class="text-sm font-semibold text-foreground">Horas/semana en verificación manual</p>
            </div>
            <p class="text-3xl font-bold tracking-tight text-foreground">{weeklyHours} h</p>
            <p class="mt-0.5 text-sm text-muted-foreground">
              {dailyPickups} retiros/día × 2 min × 5 días ÷ 60
            </p>
            <p class="mt-2 text-xs text-muted-foreground">
              Basado en tiempo estimado de verificación manual: buscar apoderado en listado, validar identidad, registrar en libro.
            </p>
          </div>

          <!-- Operational cost -->
          <div class="mb-4 rounded-xl border border-border bg-card p-5 shadow-sm">
            <div class="mb-2 flex items-center gap-2">
              <Banknote class="size-5 shrink-0 text-primary" />
              <p class="text-sm font-semibold text-foreground">Costo operacional anual estimado</p>
            </div>
            <p class="text-3xl font-bold tracking-tight text-foreground">{formatCLP(annualOpCost)}</p>
            <p class="mt-0.5 text-sm text-muted-foreground">
              {weeklyHours} h × $15.000/h × 40 semanas
            </p>
            <p class="mt-2 text-xs text-muted-foreground">
              Solo en verificación de retiros. No incluye documentación de incidencias ni búsqueda de autorizaciones.
            </p>
          </div>

          <!-- Total value at risk -->
          <div class="rounded-xl border border-primary/30 bg-primary/5 p-5 shadow-sm">
            <div class="mb-2 flex items-center gap-2">
              <AlertTriangle class="size-5 shrink-0 text-primary" />
              <p class="text-sm font-bold text-foreground">Valor en riesgo total (estimado)</p>
            </div>
            <p class="text-4xl font-bold tracking-tight text-primary">{formatCLP(valueAtRisk)}</p>
            <p class="mt-1 text-xs text-muted-foreground">
              Combinación ponderada: fracción de exposición regulatoria + costo operacional anual.
            </p>
          </div>
        </div>
      </div>

      <!-- Methodology note -->
      <div class="mt-10 flex items-start gap-3 rounded-xl border border-border bg-secondary p-5">
        <Info class="size-4 shrink-0 text-muted-foreground mt-0.5" />
        <p class="text-xs leading-relaxed text-muted-foreground">
          <strong class="text-foreground">Nota metodológica:</strong> Esta calculadora usa modelos simplificados para ilustrar la magnitud del riesgo. La exposición Ley 21.719 se escala según tamaño del establecimiento y número de sedes, con techo en 20.000 UTM. El costo operacional se basa en 2 minutos de verificación manual por retiro a $15.000 CLP/hora. El "valor en riesgo total" combina el 15% de la exposición máxima (fracción ponderada de probabilidad de multa) con el costo operacional anual. Los resultados son estimaciones referenciales y no constituyen asesoría legal ni financiera. Para un análisis personalizado, solicita una evaluación con nuestro equipo.
        </p>
      </div>
    </div>
  </section>

  <!-- ══════════════════════════════════════
       CTA
       ══════════════════════════════════════ -->
  <section class="py-16 sm:py-20 bg-secondary">
    <div class="mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8">
      <Calculator class="mx-auto size-10 text-primary mb-4" />
      <h2 class="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        ¿Quieres un análisis más preciso?
      </h2>
      <p class="mt-4 text-base text-muted-foreground">
        Esta calculadora usa supuestos generales. Nuestro equipo puede hacer una evaluación específica para tu establecimiento — sin costo ni compromiso.
      </p>
      <div class="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
        <Button size="xl" href={demoUrl} class="shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30">
          Solicita una evaluación personalizada
          <ArrowRight class="size-4" />
        </Button>
        <a
          href="/proyecciones"
          class="text-sm font-medium text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
        >
          Ver proyecciones de impacto
        </a>
      </div>
      <p class="mt-6 text-xs text-muted-foreground">
        Los resultados de esta calculadora se enviarán pre-completados en el formulario de demo para agilizar la conversación.
      </p>
    </div>
  </section>

  <Footer />
</main>
