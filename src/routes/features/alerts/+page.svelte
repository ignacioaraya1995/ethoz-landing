<script lang="ts">
  import NavBar from '$lib/components/NavBar.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import { Button } from '$lib/components/ui/button';
  import { Badge } from '$lib/components/ui/badge';
  import { t } from '$lib/i18n/index.svelte';
  import { trackEvent } from '$lib/utils/analytics';
  import { ShieldAlert, ArrowRight, ArrowLeft, AlertTriangle, Bell, FileWarning, Clock, CheckCircle2, XCircle, Scale } from '@lucide/svelte';

  $effect(() => { trackEvent('feature_page_viewed', { feature: 'alerts' }); });
</script>

<svelte:head>
  <title>Ethoz — Sistema de Alertas Críticas</title>
  <meta name="description" content="Órdenes de alejamiento, suspensiones, riesgo familiar e ideación suicida: Ethoz centraliza todas las alertas críticas del colegio con seguimiento y trazabilidad completa." />
  <meta property="og:url" content="https://ethoz.cl/features/alerts" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="Ethoz — Sistema de Alertas Críticas" />
  <meta property="og:description" content="Gestiona alertas críticas con trazabilidad completa: órdenes judiciales, riesgo familiar, ideación suicida y más." />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Ethoz — Sistema de Alertas Críticas" />
  <meta name="twitter:description" content="Gestiona alertas críticas con trazabilidad completa: órdenes judiciales, riesgo familiar, ideación suicida y más." />
  <link rel="canonical" href="https://ethoz.cl/features/alerts" />
  {@html `<script type="application/ld+json">${JSON.stringify({"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Inicio","item":"https://ethoz.cl/"},{"@type":"ListItem","position":2,"name":"Productos","item":"https://ethoz.cl/productos"},{"@type":"ListItem","position":3,"name":"Sistema de Alertas Críticas"}]})}</script>`}
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
            <ShieldAlert class="size-6 shrink-0 text-destructive" />
            <h1 class="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Alertas Críticas Centralizadas
            </h1>
          </div>
          <p class="mt-4 text-lg leading-relaxed text-muted-foreground">
            Órdenes de alejamiento, restricciones de retiro, riesgo familiar e ideación suicida: toda la información sensible en un solo sistema con acceso controlado por rol y trazabilidad total.
          </p>
          <div class="mt-6 flex flex-wrap gap-2">
            <span class="inline-flex items-center gap-1.5 rounded-full bg-destructive/10 px-3 py-1 text-xs font-medium text-destructive">Ley Aula Segura</span>
            <span class="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">Ley 21.719</span>
            <span class="inline-flex items-center gap-1.5 rounded-full bg-warning/15 px-3 py-1 text-xs font-medium text-warning-foreground">Protocolos MINEDUC</span>
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

        <!-- Mockup: Alert detail card -->
        <div class="w-full rounded-xl border border-border bg-card shadow-2xl">
          <div class="flex items-center gap-2 border-b border-border px-4 py-2.5">
            <div class="size-2.5 rounded-full bg-destructive/60"></div>
            <div class="size-2.5 rounded-full bg-warning/60"></div>
            <div class="size-2.5 rounded-full bg-success/60"></div>
            <span class="ml-2 text-[11px] font-medium text-muted-foreground">Ethoz — Alertas Críticas</span>
          </div>
          <div class="p-4 sm:p-5 space-y-3">
            <!-- Critical alert -->
            <div class="rounded-lg border border-destructive/30 bg-destructive/5 p-3">
              <div class="flex items-center justify-between gap-2">
                <div class="flex items-center gap-2">
                  <Scale class="size-3.5 shrink-0 text-destructive" />
                  <span class="text-[11px] font-bold uppercase tracking-wide text-destructive">Orden de Alejamiento</span>
                </div>
                <span class="rounded-full bg-destructive/15 px-2 py-0.5 text-[9px] font-semibold text-destructive">CRÍTICA</span>
              </div>
              <p class="mt-1.5 text-[11px] font-semibold text-foreground">Padre biológico — Juan Carlos Rojas Pino</p>
              <p class="text-[10px] text-muted-foreground">RUT 10.234.567-8 · Alumna: Valentina Rojas Sepúlveda (7°B)</p>
              <div class="mt-2 grid grid-cols-2 gap-1.5 text-[9px] text-muted-foreground">
                <span><span class="font-medium text-foreground">Tribunal:</span> 3er Juzg. Familia Santiago</span>
                <span><span class="font-medium text-foreground">RIT:</span> C-4821-2025</span>
                <span><span class="font-medium text-foreground">Vigencia:</span> hasta 15 ago 2026</span>
                <span><span class="font-medium text-foreground">Registró:</span> Directora López</span>
              </div>
            </div>
            <!-- Warning alert -->
            <div class="rounded-lg border border-warning/30 bg-warning/5 p-3">
              <div class="flex items-center justify-between gap-2">
                <div class="flex items-center gap-2">
                  <AlertTriangle class="size-3.5 shrink-0 text-warning-foreground" />
                  <span class="text-[11px] font-bold uppercase tracking-wide text-warning-foreground">Riesgo Familiar</span>
                </div>
                <span class="rounded-full bg-warning/20 px-2 py-0.5 text-[9px] font-semibold text-warning-foreground">ALTA</span>
              </div>
              <p class="mt-1.5 text-[11px] font-semibold text-foreground">Matías González Herrera — 8°A</p>
              <p class="text-[10px] text-muted-foreground">Derivado a OPD Ñuñoa · Orientadora Sra. Ramos</p>
            </div>
            <!-- Info alert -->
            <div class="rounded-lg border border-border bg-muted/30 p-3">
              <div class="flex items-center justify-between gap-2">
                <div class="flex items-center gap-2">
                  <Bell class="size-3.5 shrink-0 text-muted-foreground" />
                  <span class="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">Suspensión</span>
                </div>
                <span class="rounded-full bg-muted px-2 py-0.5 text-[9px] font-semibold text-muted-foreground">MEDIA</span>
              </div>
              <p class="mt-1.5 text-[11px] font-semibold text-foreground">Tomás Valdés Muñoz — 6°B · 3 días</p>
              <p class="text-[10px] text-muted-foreground">Vence: 10 abr 2026 · Inspector J. Contreras</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Alert types section -->
  <section class="py-16 sm:py-20">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-2xl text-center">
        <h2 class="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Todos los tipos de alerta en un solo lugar</h2>
        <p class="mt-3 text-base text-muted-foreground">Cada alerta tiene su propio flujo de revisión, nivel de visibilidad y protocolo de actuación.</p>
      </div>
      <div class="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

        <div class="rounded-xl border border-destructive/20 bg-card p-5 shadow-sm">
          <div class="flex items-center gap-2.5">
            <Scale class="size-5 shrink-0 text-destructive" />
            <h3 class="text-sm font-semibold text-foreground">Orden de alejamiento</h3>
          </div>
          <p class="mt-2 text-xs leading-relaxed text-muted-foreground">Integra resoluciones del Juzgado de Familia (RIT, tribunal, vigencia). Bloqueo automático en portería al escanear RUT del progenitor restringido.</p>
          <div class="mt-3 flex items-center gap-1.5">
            <span class="size-1.5 rounded-full bg-destructive"></span>
            <span class="text-[10px] text-muted-foreground">Visibilidad: Directora + Inspectoría + Portería</span>
          </div>
        </div>

        <div class="rounded-xl border border-destructive/20 bg-card p-5 shadow-sm">
          <div class="flex items-center gap-2.5">
            <FileWarning class="size-5 shrink-0 text-destructive" />
            <h3 class="text-sm font-semibold text-foreground">Ideación suicida</h3>
          </div>
          <p class="mt-2 text-xs leading-relaxed text-muted-foreground">Protocolo MINEDUC obligatorio. Registro confidencial con seguimiento por Orientación. Notificación inmediata a dupla psicosocial y apoderado.</p>
          <div class="mt-3 flex items-center gap-1.5">
            <span class="size-1.5 rounded-full bg-destructive"></span>
            <span class="text-[10px] text-muted-foreground">Visibilidad: Directora + Orientación (restringida)</span>
          </div>
        </div>

        <div class="rounded-xl border border-warning/20 bg-card p-5 shadow-sm">
          <div class="flex items-center gap-2.5">
            <AlertTriangle class="size-5 shrink-0 text-warning-foreground" />
            <h3 class="text-sm font-semibold text-foreground">Riesgo familiar</h3>
          </div>
          <p class="mt-2 text-xs leading-relaxed text-muted-foreground">Vincula con derivaciones a OPD, CESFAM o red de protección. Seguimiento de casos activos con hitos y responsables asignados.</p>
          <div class="mt-3 flex items-center gap-1.5">
            <span class="size-1.5 rounded-full bg-warning"></span>
            <span class="text-[10px] text-muted-foreground">Visibilidad: Directora + Orientación</span>
          </div>
        </div>

        <div class="rounded-xl border border-warning/20 bg-card p-5 shadow-sm">
          <div class="flex items-center gap-2.5">
            <Clock class="size-5 shrink-0 text-warning-foreground" />
            <h3 class="text-sm font-semibold text-foreground">Suspensión</h3>
          </div>
          <p class="mt-2 text-xs leading-relaxed text-muted-foreground">Registro automático de inicio, duración y vencimiento. Aviso al apoderado con comprobante digital conforme a Ley Aula Segura.</p>
          <div class="mt-3 flex items-center gap-1.5">
            <span class="size-1.5 rounded-full bg-warning"></span>
            <span class="text-[10px] text-muted-foreground">Visibilidad: Directora + Inspectoría</span>
          </div>
        </div>

        <div class="rounded-xl border border-border bg-card p-5 shadow-sm">
          <div class="flex items-center gap-2.5">
            <XCircle class="size-5 shrink-0 text-muted-foreground" />
            <h3 class="text-sm font-semibold text-foreground">Restricción de retiro</h3>
          </div>
          <p class="mt-2 text-xs leading-relaxed text-muted-foreground">Personas específicas marcadas como no autorizadas para retirar al alumno. Se activa en el flujo de verificación de portería en tiempo real.</p>
          <div class="mt-3 flex items-center gap-1.5">
            <span class="size-1.5 rounded-full bg-muted-foreground"></span>
            <span class="text-[10px] text-muted-foreground">Visibilidad: Portería + Directora</span>
          </div>
        </div>

        <div class="rounded-xl border border-border bg-card p-5 shadow-sm">
          <div class="flex items-center gap-2.5">
            <CheckCircle2 class="size-5 shrink-0 text-primary" />
            <h3 class="text-sm font-semibold text-foreground">Alertas personalizadas</h3>
          </div>
          <p class="mt-2 text-xs leading-relaxed text-muted-foreground">Crea tipos de alerta propios según los protocolos internos del colegio. Campos configurables, flujos de aprobación y niveles de acceso.</p>
          <div class="mt-3 flex items-center gap-1.5">
            <span class="size-1.5 rounded-full bg-primary"></span>
            <span class="text-[10px] text-muted-foreground">Visibilidad: Configurable por establecimiento</span>
          </div>
        </div>

      </div>
    </div>
  </section>

  <!-- Timeline mockup section -->
  <section class="bg-secondary py-16 sm:py-20">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div>
          <h2 class="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Trazabilidad completa de cada alerta</h2>
          <p class="mt-4 text-base leading-relaxed text-muted-foreground">
            Cada alerta registra quién la creó, quién la revisó, qué acción se tomó y cuándo venció. Ante una fiscalización del MINEDUC o un caso judicial, tienes evidencia digital completa.
          </p>
          <ul class="mt-6 space-y-3">
            <li class="flex items-start gap-2.5">
              <span class="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary"></span>
              <span class="text-sm text-muted-foreground">Auditoría de accesos: quién vio qué y cuándo</span>
            </li>
            <li class="flex items-start gap-2.5">
              <span class="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary"></span>
              <span class="text-sm text-muted-foreground">Exportación de historial para peritajes o inspecciones</span>
            </li>
            <li class="flex items-start gap-2.5">
              <span class="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary"></span>
              <span class="text-sm text-muted-foreground">Vencimientos automáticos con aviso previo de 7 días</span>
            </li>
            <li class="flex items-start gap-2.5">
              <span class="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary"></span>
              <span class="text-sm text-muted-foreground">Integración con ficha del alumno y módulo de retiros</span>
            </li>
          </ul>
        </div>
        <!-- Timeline mockup -->
        <div class="rounded-xl border border-border bg-card shadow-xl">
          <div class="flex items-center gap-2 border-b border-border px-4 py-2.5">
            <div class="size-2.5 rounded-full bg-destructive/60"></div>
            <div class="size-2.5 rounded-full bg-warning/60"></div>
            <div class="size-2.5 rounded-full bg-success/60"></div>
            <span class="ml-2 text-[11px] font-medium text-muted-foreground">Ethoz — Historial de Alerta #1042</span>
          </div>
          <div class="p-4 sm:p-5">
            <p class="mb-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Orden de alejamiento — Valentina Rojas</p>
            <div class="relative space-y-3 pl-4 before:absolute before:left-1.5 before:top-1 before:h-full before:w-px before:bg-border">
              <div class="flex items-start gap-3">
                <span class="absolute left-0.5 mt-1 size-2 rounded-full bg-destructive ring-2 ring-background"></span>
                <div class="ml-1">
                  <p class="text-[11px] font-semibold text-foreground">Alerta creada</p>
                  <p class="text-[10px] text-muted-foreground">Directora M. López · 3 mar 2026, 09:14</p>
                  <p class="text-[10px] text-muted-foreground">RIT C-4821-2025 adjuntado</p>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <span class="absolute left-0.5 mt-1 size-2 rounded-full bg-warning ring-2 ring-background"></span>
                <div class="ml-1">
                  <p class="text-[11px] font-semibold text-foreground">Revisada por Inspectoría</p>
                  <p class="text-[10px] text-muted-foreground">Inspector J. Muñoz · 3 mar 2026, 10:30</p>
                  <p class="text-[10px] text-muted-foreground">Portería notificada</p>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <span class="absolute left-0.5 mt-1 size-2 rounded-full bg-destructive ring-2 ring-background"></span>
                <div class="ml-1">
                  <p class="text-[11px] font-semibold text-foreground">Intento de retiro bloqueado</p>
                  <p class="text-[10px] text-muted-foreground">Portería Central · 12 mar 2026, 14:47</p>
                  <p class="text-[10px] text-muted-foreground">Juan Rojas (RUT 10.234.567-8) — DENEGADO</p>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <span class="absolute left-0.5 mt-1 size-2 rounded-full bg-muted-foreground ring-2 ring-background"></span>
                <div class="ml-1">
                  <p class="text-[11px] font-semibold text-foreground">Vence en 130 días</p>
                  <p class="text-[10px] text-muted-foreground">Aviso automático programado para 8 ago 2026</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Por qué importa -->
  <section class="py-16 sm:py-20">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-2xl text-center">
        <h2 class="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Por qué esto importa ahora</h2>
        <p class="mt-3 text-base text-muted-foreground">Las consecuencias de una alerta no gestionada van desde sanciones económicas hasta responsabilidad penal del director.</p>
      </div>
      <div class="mt-10 grid gap-4 sm:grid-cols-3">
        <div class="rounded-xl border border-border bg-card p-6 text-center shadow-sm">
          <p class="text-3xl font-bold text-destructive">20.000</p>
          <p class="mt-1 text-sm font-semibold text-foreground">UTM de multa máxima</p>
          <p class="mt-2 text-xs text-muted-foreground">Ley 21.719 — infracciones graves al tratamiento de datos sensibles de menores</p>
        </div>
        <div class="rounded-xl border border-border bg-card p-6 text-center shadow-sm">
          <p class="text-3xl font-bold text-primary">12.038</p>
          <p class="mt-1 text-sm font-semibold text-foreground">colegios en Chile</p>
          <p class="mt-2 text-xs text-muted-foreground">Solo el 4% cuenta con sistemas digitales de gestión de alertas críticas según datos MINEDUC 2025</p>
        </div>
        <div class="rounded-xl border border-border bg-card p-6 text-center shadow-sm">
          <p class="text-3xl font-bold text-warning-foreground">dic 2026</p>
          <p class="mt-1 text-sm font-semibold text-foreground">plazo Ley 21.719</p>
          <p class="mt-2 text-xs text-muted-foreground">A partir de esa fecha, la ANIC puede iniciar procedimientos sancionatorios contra establecimientos sin protocolos digitales</p>
        </div>
      </div>
    </div>
  </section>

  <!-- CTA -->
  <section class="bg-secondary py-16 sm:py-20">
    <div class="mx-auto max-w-2xl px-4 text-center sm:px-6">
      <h2 class="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">¿Tu colegio tiene alertas críticas sin sistema?</h2>
      <p class="mt-4 text-base leading-relaxed text-muted-foreground">
        Agenda una demo y te mostramos cómo centralizar todas las alertas de tu establecimiento en menos de una semana.
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
