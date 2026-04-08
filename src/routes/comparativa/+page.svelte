<script lang="ts">
  import NavBar from '$lib/components/NavBar.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import { Button } from '$lib/components/ui/button';
  import { Badge } from '$lib/components/ui/badge';
  import { trackEvent } from '$lib/utils/analytics';
  import {
    ShieldCheck,
    CheckCircle,
    XCircle,
    MinusCircle,
    ArrowRight,
    Scale,
    Lock,
    Database,
    Link,
    AlertTriangle,
  } from '@lucide/svelte';

  $effect(() => {
    trackEvent('page_viewed', { page: 'comparativa' });
  });

  // ── Table data ──
  type CellValue = 'yes' | 'no' | 'varies' | 'unknown';

  interface Row {
    label: string;
    ethoz: CellValue;
    napsis: CellValue;
    syscol: CellValue;
    lirmi: CellValue;
    schooltrack: CellValue;
  }

  interface Category {
    label: string;
    rows: Row[];
  }

  const categories: Category[] = [
    {
      label: 'Seguridad y cumplimiento',
      rows: [
        { label: 'Cifrado at-rest de datos', ethoz: 'yes', napsis: 'no', syscol: 'unknown', lirmi: 'unknown', schooltrack: 'unknown' },
        { label: 'RLS por rol (Row-Level Security)', ethoz: 'yes', napsis: 'no', syscol: 'no', lirmi: 'no', schooltrack: 'unknown' },
        { label: 'Audit log nativo', ethoz: 'yes', napsis: 'no', syscol: 'no', lirmi: 'no', schooltrack: 'unknown' },
        { label: 'Cumple Ley 21.719 (datos)', ethoz: 'yes', napsis: 'no', syscol: 'unknown', lirmi: 'varies', schooltrack: 'unknown' },
        { label: 'Cumple Circular N°30 (libro digital)', ethoz: 'yes', napsis: 'varies', syscol: 'no', lirmi: 'yes', schooltrack: 'varies' },
      ],
    },
    {
      label: 'Protección escolar operacional',
      rows: [
        { label: 'Retiros verificados en portería', ethoz: 'yes', napsis: 'no', syscol: 'no', lirmi: 'no', schooltrack: 'varies' },
        { label: 'Bloqueo por orden judicial', ethoz: 'yes', napsis: 'no', syscol: 'no', lirmi: 'no', schooltrack: 'no' },
        { label: 'Alertas por rol en tiempo real', ethoz: 'yes', napsis: 'no', syscol: 'no', lirmi: 'no', schooltrack: 'varies' },
        { label: 'Protocolo de emergencia digital', ethoz: 'yes', napsis: 'no', syscol: 'no', lirmi: 'no', schooltrack: 'no' },
      ],
    },
    {
      label: 'Gestión de datos del estudiante',
      rows: [
        { label: 'Perfil longitudinal unificado', ethoz: 'yes', napsis: 'varies', syscol: 'no', lirmi: 'varies', schooltrack: 'varies' },
        { label: 'Observaciones por nivel de confidencialidad', ethoz: 'yes', napsis: 'no', syscol: 'no', lirmi: 'no', schooltrack: 'unknown' },
        { label: 'Historial de convivencia sin reset anual', ethoz: 'yes', napsis: 'no', syscol: 'no', lirmi: 'no', schooltrack: 'unknown' },
      ],
    },
    {
      label: 'Integraciones y apertura',
      rows: [
        { label: 'Conecta con libro de clases existente', ethoz: 'yes', napsis: 'varies', syscol: 'no', lirmi: 'no', schooltrack: 'varies' },
        { label: 'API abierta para integraciones', ethoz: 'yes', napsis: 'no', syscol: 'no', lirmi: 'no', schooltrack: 'unknown' },
        { label: 'Exportación conforme a normativa', ethoz: 'yes', napsis: 'varies', syscol: 'varies', lirmi: 'varies', schooltrack: 'unknown' },
      ],
    },
  ];

  const columns = ['Ethoz', 'Napsis', 'Syscol', 'Lirmi', 'SchoolTrack'];
</script>

<svelte:head>
  <title>Comparativa: Ethoz vs sistemas actuales — Seguridad escolar y compliance Ley 21.719</title>
  <meta name="description" content="Compara Ethoz con Napsis, Syscol, Lirmi y SchoolTrack en seguridad, cumplimiento Ley 21.719, protección escolar e integraciones. Descubre qué cubre cada sistema." />
  <meta property="og:url" content="https://ethoz.cl/comparativa" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="Comparativa: Ethoz vs sistemas actuales" />
  <meta property="og:description" content="Compara Ethoz con Napsis, Syscol, Lirmi y SchoolTrack en seguridad, compliance Ley 21.719 y protección escolar." />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Comparativa: Ethoz vs sistemas actuales" />
  <meta name="twitter:description" content="Compara Ethoz con Napsis, Syscol, Lirmi y SchoolTrack en seguridad, compliance y protección escolar." />
  <link rel="canonical" href="https://ethoz.cl/comparativa" />
  {@html `<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Inicio", "item": "https://ethoz.cl/" },
      { "@type": "ListItem", "position": 2, "name": "Comparativa" }
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
        <Scale class="size-3.5" />
        Análisis comparativo
      </div>
      <h1 class="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
        ¿Por qué Ethoz y no tu sistema actual?
      </h1>
      <p class="mt-6 text-lg leading-relaxed text-muted-foreground sm:text-xl">
        Los sistemas de gestión escolar existentes nacieron para administrar. Ethoz nació para <strong class="text-foreground">proteger</strong>. No los reemplaza — los complementa con la capa de seguridad y compliance que nunca tuvieron.
      </p>
      <p class="mt-4 text-sm text-muted-foreground">
        La Ley 21.719 entra en plena vigencia en diciembre de 2026. Tu sistema actual probablemente no está preparado.
      </p>
    </div>
  </section>

  <!-- ══════════════════════════════════════
       DISCLAIMER
       ══════════════════════════════════════ -->
  <section class="py-6 bg-background">
    <div class="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
      <div class="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
        <AlertTriangle class="size-4 shrink-0 text-muted-foreground mt-0.5" />
        <p class="text-xs leading-relaxed text-muted-foreground">
          <strong class="text-foreground">Metodología:</strong> Esta comparativa se basa en documentación pública, revisiones de sitios web oficiales y reportes de usuarios a abril de 2026. Las celdas marcadas como "○ Varía" indican que el proveedor ofrece funcionalidad parcial o variable según plan. Las celdas "○ No público" indican que no hay documentación pública disponible. Si representas a alguno de estos proveedores y detectas inexactitudes, contáctanos.
        </p>
      </div>
    </div>
  </section>

  <!-- ══════════════════════════════════════
       COMPARISON TABLE
       ══════════════════════════════════════ -->
  <section class="py-12 sm:py-16 bg-background">
    <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">

      <!-- Legend -->
      <div class="mb-8 flex flex-wrap items-center gap-5">
        <div class="flex items-center gap-1.5 text-xs text-muted-foreground">
          <CheckCircle class="size-4 text-primary" />
          <span>Incluido</span>
        </div>
        <div class="flex items-center gap-1.5 text-xs text-muted-foreground">
          <MinusCircle class="size-4 text-muted-foreground" />
          <span>Varía / No público</span>
        </div>
        <div class="flex items-center gap-1.5 text-xs text-muted-foreground">
          <XCircle class="size-4 text-destructive" />
          <span>No incluido</span>
        </div>
      </div>

      <!-- Scrollable table wrapper -->
      <div class="overflow-x-auto rounded-xl border border-border shadow-sm">
        <table class="w-full border-collapse text-sm">
          <!-- Header -->
          <thead>
            <tr class="border-b border-border bg-muted/50">
              <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground w-56">
                Funcionalidad
              </th>
              {#each columns as col, i}
                <th class="px-4 py-3 text-center text-xs font-bold uppercase tracking-wide {i === 0 ? 'text-primary bg-primary/5 border-x border-primary/20' : 'text-muted-foreground'}">
                  {col}
                  {#if i === 0}
                    <span class="ml-1.5 inline-flex items-center rounded-full bg-primary px-1.5 py-0.5 text-[9px] font-bold text-primary-foreground">★</span>
                  {/if}
                </th>
              {/each}
            </tr>
          </thead>
          <tbody>
            {#each categories as cat, catIdx}
              <!-- Category header row -->
              <tr class="border-b border-border bg-secondary">
                <td colspan={columns.length + 1} class="px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  {cat.label}
                </td>
              </tr>
              <!-- Data rows -->
              {#each cat.rows as row, rowIdx}
                <tr class="border-b border-border {rowIdx % 2 === 0 ? 'bg-background' : 'bg-muted/20'} hover:bg-muted/30 transition-colors">
                  <td class="px-4 py-3 text-sm text-foreground font-medium">
                    {row.label}
                  </td>
                  <!-- Ethoz -->
                  <td class="px-4 py-3 text-center bg-primary/5 border-x border-primary/20">
                    {#if row.ethoz === 'yes'}
                      <CheckCircle class="mx-auto size-5 text-primary" />
                    {:else if row.ethoz === 'no'}
                      <XCircle class="mx-auto size-5 text-destructive" />
                    {:else}
                      <span class="text-xs text-muted-foreground">○ Varía</span>
                    {/if}
                  </td>
                  <!-- Napsis -->
                  <td class="px-4 py-3 text-center">
                    {#if row.napsis === 'yes'}
                      <CheckCircle class="mx-auto size-5 text-primary" />
                    {:else if row.napsis === 'no'}
                      <XCircle class="mx-auto size-5 text-destructive" />
                    {:else if row.napsis === 'varies'}
                      <span class="text-xs text-muted-foreground">○ Varía</span>
                    {:else}
                      <span class="text-xs text-muted-foreground">○ No público</span>
                    {/if}
                  </td>
                  <!-- Syscol -->
                  <td class="px-4 py-3 text-center">
                    {#if row.syscol === 'yes'}
                      <CheckCircle class="mx-auto size-5 text-primary" />
                    {:else if row.syscol === 'no'}
                      <XCircle class="mx-auto size-5 text-destructive" />
                    {:else if row.syscol === 'varies'}
                      <span class="text-xs text-muted-foreground">○ Varía</span>
                    {:else}
                      <span class="text-xs text-muted-foreground">○ No público</span>
                    {/if}
                  </td>
                  <!-- Lirmi -->
                  <td class="px-4 py-3 text-center">
                    {#if row.lirmi === 'yes'}
                      <CheckCircle class="mx-auto size-5 text-primary" />
                    {:else if row.lirmi === 'no'}
                      <XCircle class="mx-auto size-5 text-destructive" />
                    {:else if row.lirmi === 'varies'}
                      <span class="text-xs text-muted-foreground">○ Varía</span>
                    {:else}
                      <span class="text-xs text-muted-foreground">○ No público</span>
                    {/if}
                  </td>
                  <!-- SchoolTrack -->
                  <td class="px-4 py-3 text-center">
                    {#if row.schooltrack === 'yes'}
                      <CheckCircle class="mx-auto size-5 text-primary" />
                    {:else if row.schooltrack === 'no'}
                      <XCircle class="mx-auto size-5 text-destructive" />
                    {:else if row.schooltrack === 'varies'}
                      <span class="text-xs text-muted-foreground">○ Varía</span>
                    {:else}
                      <span class="text-xs text-muted-foreground">○ No público</span>
                    {/if}
                  </td>
                </tr>
              {/each}
            {/each}
          </tbody>
        </table>
      </div>
    </div>
  </section>

  <!-- ══════════════════════════════════════
       POSITIONING CARDS
       ══════════════════════════════════════ -->
  <section class="py-16 sm:py-20 bg-secondary">
    <div class="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
      <div class="mb-12 text-center">
        <p class="text-sm font-bold uppercase tracking-widest text-primary">La diferencia clave</p>
        <h2 class="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Ethoz no compite — complementa
        </h2>
        <p class="mt-4 max-w-2xl mx-auto text-base text-muted-foreground">
          Cada sistema tiene su rol. Ethoz agrega la capa que ninguno puede construir.
        </p>
      </div>

      <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div class="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div class="mb-3 flex items-center gap-2.5">
            <Database class="size-5 shrink-0 text-primary" />
            <h3 class="text-base font-bold text-foreground">Napsis / Syscol / Lirmi</h3>
          </div>
          <p class="text-sm text-muted-foreground leading-relaxed">
            Gestionan matrícula, notas, comunicaciones y finanzas. Son el núcleo administrativo que ya funciona en tu colegio.
          </p>
          <p class="mt-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Lo que no tienen</p>
          <p class="mt-1 text-sm text-muted-foreground">Seguridad operacional en tiempo real ni compliance Ley 21.719 por diseño.</p>
        </div>

        <div class="rounded-xl border border-primary/30 bg-primary/5 p-6 shadow-sm">
          <div class="mb-3 flex items-center gap-2.5">
            <ShieldCheck class="size-5 shrink-0 text-primary" />
            <h3 class="text-base font-bold text-foreground">Ethoz</h3>
          </div>
          <p class="text-sm text-muted-foreground leading-relaxed">
            Agrega la capa de seguridad, privacidad y compliance. Protege a los estudiantes, al personal y al sostenedor ante la Ley 21.719.
          </p>
          <p class="mt-3 text-xs font-semibold text-primary uppercase tracking-wide">Su rol único</p>
          <p class="mt-1 text-sm text-foreground font-medium">Retiros seguros, alertas en tiempo real, audit logs y cumplimiento normativo certificable.</p>
        </div>

        <div class="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div class="mb-3 flex items-center gap-2.5">
            <Link class="size-5 shrink-0 text-primary" />
            <h3 class="text-base font-bold text-foreground">Juntos</h3>
          </div>
          <p class="text-sm text-muted-foreground leading-relaxed">
            Tu sistema actual sigue haciendo lo que hace bien. Ethoz cubre lo que no puede: la seguridad y el cumplimiento de la nueva ley.
          </p>
          <p class="mt-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">API abierta</p>
          <p class="mt-1 text-sm text-muted-foreground">Ethoz se integra con los sistemas que ya tienes, sin reemplazarlos.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- ══════════════════════════════════════
       RISK CALLOUT
       ══════════════════════════════════════ -->
  <section class="py-16 sm:py-20 bg-background">
    <div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
      <div class="rounded-xl border border-border bg-card p-8 shadow-sm">
        <div class="grid gap-8 sm:grid-cols-3 text-center">
          <div>
            <p class="text-3xl font-bold text-foreground">20.000 UTM</p>
            <p class="mt-1 text-sm text-muted-foreground">Multa máxima Ley 21.719</p>
            <p class="mt-0.5 text-xs text-muted-foreground">≈ $1.340M CLP</p>
          </div>
          <div>
            <p class="text-3xl font-bold text-foreground">Dic 2026</p>
            <p class="mt-1 text-sm text-muted-foreground">Vigencia plena de la ley</p>
            <p class="mt-0.5 text-xs text-muted-foreground">Tiempo limitado para adecuarse</p>
          </div>
          <div>
            <p class="text-3xl font-bold text-foreground">12.038</p>
            <p class="mt-1 text-sm text-muted-foreground">Colegios en Chile</p>
            <p class="mt-0.5 text-xs text-muted-foreground">Todos expuestos al mismo riesgo</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- ══════════════════════════════════════
       CTA
       ══════════════════════════════════════ -->
  <section class="py-16 sm:py-20 bg-secondary">
    <div class="mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8">
      <Lock class="mx-auto size-10 text-primary mb-4" />
      <h2 class="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        ¿Tu sistema actual te protege?
      </h2>
      <p class="mt-4 text-base text-muted-foreground">
        Te ayudamos a evaluar tu exposición real ante la Ley 21.719 y las brechas de seguridad operacional de tu colegio — sin costo ni compromiso.
      </p>
      <div class="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
        <Button size="xl" href="/demo" class="shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30">
          Solicitar evaluación gratuita
          <ArrowRight class="size-4" />
        </Button>
        <a
          href="/compliance"
          class="text-sm font-medium text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
        >
          Ver cumplimiento normativo
        </a>
      </div>
    </div>
  </section>

  <Footer />
</main>
