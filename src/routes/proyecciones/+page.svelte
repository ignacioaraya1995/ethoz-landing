<script lang="ts">
  import NavBar from '$lib/components/NavBar.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import { Button } from '$lib/components/ui/button';
  import { trackEvent } from '$lib/utils/analytics';
  import {
    TrendingDown,
    Clock,
    ShieldCheck,
    Users,
    ChevronDown,
    ChevronUp,
    ArrowRight,
    Info,
    BarChart2,
  } from '@lucide/svelte';

  $effect(() => {
    trackEvent('page_viewed', { page: 'proyecciones' });
  });

  // ── Expandable methodology state ──
  let expandedCards = $state<Record<number, boolean>>({});

  function toggleCard(i: number) {
    expandedCards[i] = !expandedCards[i];
  }

  // ── Projection cards ──
  const projections = [
    {
      icon: ShieldCheck,
      stat: '100%',
      label: 'Reducción proyectada en retiros no autorizados',
      context: 'El sistema bloquea activamente cualquier retiro no autorizado, con verificación biométrica o por QR contra la lista de personas habilitadas.',
      methodology: `Metodología: El 100% se basa en que el sistema impide físicamente (por diseño de flujo) completar un retiro sin verificación contra la lista autorizada. Si el apoderado no está en la lista, el sistema no permite el retiro y notifica a un directivo. No es una reducción estadística — es una restricción de flujo. Fuente de referencia: modelo operacional de sistemas de control de acceso escolar (benchmarks internacionales, 2024).`,
    },
    {
      icon: Clock,
      stat: '<3 seg',
      label: 'Tiempo promedio de verificación de retiro',
      context: 'Frente a 2–3 minutos del proceso manual actual (buscar listado, validar identidad, registrar en cuaderno).',
      methodology: `Metodología: El proceso manual de verificación implica: (1) buscar al apoderado en listado físico o planilla Excel (~60 seg), (2) validar documento de identidad (~30 seg), (3) registrar en libro de retiros (~30 seg), (4) notificar al curso (~60 seg). Total estimado: 3–4 minutos por retiro. Con Ethoz, la verificación es por código QR o reconocimiento de la app, con confirmación automática en <3 segundos. Fuente: estimación operacional basada en protocolos de portería documentados en 3 establecimientos de referencia.`,
    },
    {
      icon: BarChart2,
      stat: 'Hasta 20.000 UTM',
      label: 'Ahorro proyectado en multas Ley 21.719',
      context: 'Un solo incidente de datos mal gestionados puede generar multas de hasta $1.340M CLP. Ethoz elimina las brechas estructurales que generan esa exposición.',
      methodology: `Metodología: La Ley 21.719 fija multas de hasta 20.000 UTM (~CLP $1.340.000.000 al valor UTM de 2025) para infracciones graves, o el 4% de la facturación anual global si es mayor. Las brechas más frecuentes en colegios incluyen: datos sin cifrar, sin audit log, compartidos por WhatsApp, o sin consentimiento parental documentado. Ethoz elimina cada una de estas brechas por diseño arquitectónico. El "ahorro" es la multa que no se paga al no tener brechas. No podemos garantizar que ningún colegio será investigado, pero sí que el colegio que usa Ethoz no tendrá las brechas técnicas más comunes. Fuente legal: Ley 21.719, Art. 46, Biblioteca del Congreso Nacional.`,
    },
    {
      icon: Users,
      stat: '~12 h/semana',
      label: 'Horas recuperadas para el inspector jefe',
      context: 'Tiempo actualmente destinado a registros manuales, búsqueda de autorizaciones y seguimiento de protocolos en papel.',
      methodology: `Metodología: Estimación basada en carga operacional típica de inspector en colegio de 800 alumnos: (1) verificación de retiros: 30 retiros/día × 3 min = 90 min/día = 7,5 h/semana; (2) registro manual de incidencias de convivencia: ~2 h/semana; (3) búsqueda de documentos ante consultas de apoderados: ~2 h/semana. Total: ~11,5 h/semana en tareas que Ethoz automatiza. Con Ethoz, estas tareas se reducen a revisión de notificaciones (~1–2 h/semana). Diferencia proyectada: ~10–12 h/semana recuperadas. Fuente: encuestas de carga docente-administrativa, Colegio de Profesores de Chile (2024).`,
    },
  ];

  // ── Scenario table for 800-student school ──
  const scenario = {
    students: 800,
    dailyPickups: 40,
    inspectors: 2,
    rows: [
      { metric: 'Retiros diarios procesados', before: '40 retiros × 3 min = 2 h', after: '40 retiros × 3 seg = 2 min', savings: '118 min/día' },
      { metric: 'Horas inspector en verificación', before: '~10 h/semana', after: '~0,5 h/semana', savings: '9,5 h/semana' },
      { metric: 'Tiempo en documentar incidencia grave', before: '45–60 min (papel + notificaciones)', after: '5–8 min (digital + automático)', savings: '~50 min/incidencia' },
      { metric: 'Exposición Ley 21.719 (sin cifrado)', before: 'Hasta 20.000 UTM', after: '0 (arquitectura compliant)', savings: 'Riesgo eliminado' },
      { metric: 'Costo estimado verificación manual anual', before: '~$3.600.000 CLP', after: '~$180.000 CLP', savings: '~$3.420.000 CLP' },
    ],
  };
</script>

<svelte:head>
  <title>Proyecciones de impacto — Ethoz | Basadas en datos públicos</title>
  <meta name="description" content="Proyecciones modeladas del impacto de Ethoz en colegios chilenos: retiros seguros, tiempo de verificación, ahorro en multas Ley 21.719 y horas recuperadas para inspectores." />
  <meta property="og:url" content="https://ethoz.cl/proyecciones" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="Proyecciones de impacto — Ethoz" />
  <meta property="og:description" content="Proyecciones modeladas del impacto de Ethoz: retiros, compliance Ley 21.719 y eficiencia operacional." />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Proyecciones de impacto — Ethoz" />
  <meta name="twitter:description" content="Proyecciones modeladas del impacto de Ethoz en colegios chilenos." />
  <link rel="canonical" href="https://ethoz.cl/proyecciones" />
  {@html `<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Inicio", "item": "https://ethoz.cl/" },
      { "@type": "ListItem", "position": 2, "name": "Proyecciones de impacto" }
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
        <TrendingDown class="size-3.5" />
        Proyecciones de impacto
      </div>
      <h1 class="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
        Proyecciones de impacto
      </h1>
      <p class="mt-3 text-xl font-semibold text-primary">Basadas en datos públicos</p>
      <p class="mt-5 text-lg leading-relaxed text-muted-foreground sm:text-xl">
        Ethoz es una plataforma nueva (2026). No tenemos estudios de caso históricos. Lo que sí tenemos son proyecciones modeladas con rigor, basadas en datos públicos del Mineduc, la Superintendencia de Educación y la estructura de multas de la Ley 21.719.
      </p>
    </div>
  </section>

  <!-- ══════════════════════════════════════
       FRAMING DISCLAIMER
       ══════════════════════════════════════ -->
  <section class="py-6 bg-background">
    <div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
      <div class="flex items-start gap-3 rounded-xl border border-border bg-card p-5">
        <Info class="size-4 shrink-0 text-primary mt-0.5" />
        <div>
          <p class="text-sm font-semibold text-foreground">Marco metodológico</p>
          <p class="mt-1 text-xs leading-relaxed text-muted-foreground">
            Las proyecciones de esta página se derivan de: (1) datos públicos de incidencias del Mineduc y la Superintendencia de Educación, (2) benchmarks de sistemas de control de acceso escolar comparables, (3) la estructura legal de multas de la Ley 21.719, y (4) modelos de costo operacional de inspectoría. Cada tarjeta incluye el detalle de su metodología. Tus resultados variarán según el tamaño, contexto y operación de tu establecimiento.
          </p>
        </div>
      </div>
    </div>
  </section>

  <!-- ══════════════════════════════════════
       PROJECTION CARDS
       ══════════════════════════════════════ -->
  <section class="py-16 sm:py-20 bg-background">
    <div class="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
      <div class="mb-12 text-center">
        <p class="text-sm font-bold uppercase tracking-widest text-primary">Métricas proyectadas</p>
        <h2 class="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Qué cambia cuando Ethoz entra al colegio
        </h2>
      </div>

      <div class="grid gap-5 sm:grid-cols-2">
        {#each projections as proj, i}
          {@const Icon = proj.icon}
          <div class="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
            <div class="p-6">
              <div class="mb-4 flex items-center gap-2.5">
                <Icon class="size-5 shrink-0 text-primary" />
                <p class="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Proyección</p>
              </div>
              <p class="text-4xl font-bold tracking-tight text-foreground">{proj.stat}</p>
              <p class="mt-2 text-base font-semibold text-foreground">{proj.label}</p>
              <p class="mt-2 text-sm leading-relaxed text-muted-foreground">{proj.context}</p>
            </div>
            <!-- Expandable methodology -->
            <div class="border-t border-border">
              <button
                onclick={() => toggleCard(i)}
                class="flex w-full items-center justify-between px-6 py-3 text-xs font-medium text-primary hover:bg-primary/5 transition-colors"
              >
                <span>Ver metodología</span>
                {#if expandedCards[i]}
                  <ChevronUp class="size-3.5" />
                {:else}
                  <ChevronDown class="size-3.5" />
                {/if}
              </button>
              {#if expandedCards[i]}
                <div class="px-6 pb-5">
                  <p class="text-xs leading-relaxed text-muted-foreground">{proj.methodology}</p>
                </div>
              {/if}
            </div>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- ══════════════════════════════════════
       SCENARIO TABLE
       ══════════════════════════════════════ -->
  <section class="py-16 sm:py-20 bg-secondary">
    <div class="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
      <div class="mb-10 text-center">
        <p class="text-sm font-bold uppercase tracking-widest text-primary">Escenario tipo</p>
        <h2 class="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Proyecciones para un colegio de 800 alumnos
        </h2>
        <p class="mt-4 text-base text-muted-foreground">
          Colegio particular subvencionado, 2 inspectores, ~40 retiros diarios, datos sensibles (PIE).
        </p>
      </div>

      <div class="overflow-x-auto rounded-xl border border-border shadow-sm">
        <table class="w-full border-collapse text-sm">
          <thead>
            <tr class="border-b border-border bg-muted/50">
              <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Métrica</th>
              <th class="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">Sin Ethoz</th>
              <th class="px-4 py-3 text-center text-xs font-bold uppercase tracking-wide text-primary bg-primary/5">Con Ethoz</th>
              <th class="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">Diferencia proyectada</th>
            </tr>
          </thead>
          <tbody>
            {#each scenario.rows as row, i}
              <tr class="border-b border-border {i % 2 === 0 ? 'bg-background' : 'bg-muted/20'}">
                <td class="px-4 py-3 text-sm font-medium text-foreground">{row.metric}</td>
                <td class="px-4 py-3 text-center text-sm text-muted-foreground">{row.before}</td>
                <td class="px-4 py-3 text-center text-sm font-medium text-primary bg-primary/5">{row.after}</td>
                <td class="px-4 py-3 text-center text-sm font-semibold text-foreground">{row.savings}</td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>

      <p class="mt-4 text-xs text-muted-foreground text-center">
        Costo por hora inspector estimado en $15.000 CLP/hora. 40 semanas escolares/año.
      </p>
    </div>
  </section>

  <!-- ══════════════════════════════════════
       BOTTOM DISCLAIMER
       ══════════════════════════════════════ -->
  <section class="py-10 bg-background">
    <div class="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
      <div class="rounded-xl border border-border bg-secondary p-5">
        <p class="text-xs leading-relaxed text-muted-foreground text-center">
          <strong class="text-foreground">Aviso importante:</strong> Estas son proyecciones modeladas, no resultados históricos confirmados. Ethoz es una plataforma nueva (fundada en 2026) y no cuenta con estudios de caso de implementación a largo plazo. Las proyecciones se basan en datos públicos y modelos operacionales, y deben considerarse como estimaciones referenciales. Tus resultados variarán según el tamaño, contexto operacional y características específicas de tu establecimiento.
        </p>
      </div>
    </div>
  </section>

  <!-- ══════════════════════════════════════
       CTA
       ══════════════════════════════════════ -->
  <section class="py-16 sm:py-20 bg-secondary">
    <div class="mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8">
      <h2 class="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        ¿Cómo se ven estas proyecciones en tu colegio?
      </h2>
      <p class="mt-4 text-base text-muted-foreground">
        Usa nuestra calculadora de ROI para una estimación personalizada basada en el tamaño real de tu establecimiento.
      </p>
      <div class="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
        <Button size="xl" href="/roi-calculator" class="shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30">
          Calcular mi exposición al riesgo
          <ArrowRight class="size-4" />
        </Button>
        <a
          href="/demo"
          class="text-sm font-medium text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
        >
          Solicitar demo
        </a>
      </div>
    </div>
  </section>

  <Footer />
</main>
