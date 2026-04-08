<script lang="ts">
  import NavBar from '$lib/components/NavBar.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import { Button } from '$lib/components/ui/button';
  import {
    Compass, ArrowRight, BadgeCheck, AlertTriangle, Clock,
    CheckCircle, Users, Activity, BarChart3, MessageSquare,
    TrendingUp, ShieldCheck, FileText, Bell, CalendarDays
  } from '@lucide/svelte';
  import { trackEvent } from '$lib/utils/analytics';

  $effect(() => { trackEvent('audience_page_viewed', { audience: 'directores' }); });

  const convivenciaMeses = [
    { mes: 'Ago', valor: 4, curso: '' },
    { mes: 'Sep', valor: 7, curso: '' },
    { mes: 'Oct', valor: 12, curso: '', alerta: true },
    { mes: 'Nov', valor: 9, curso: '' },
    { mes: 'Dic', valor: 3, curso: '' },
    { mes: 'Mar', valor: 5, curso: '' },
    { mes: 'Abr', valor: 8, curso: '← hoy' },
  ];
  const maxVal = Math.max(...convivenciaMeses.map(m => m.valor));

  let activeObs = $state(false);
</script>

<svelte:head>
  <title>Ethoz para Directores — Gestión escolar sin planillas Excel</title>
  <meta name="description" content="Tu día de director, sin planillas Excel ni llamadas de pánico. Visibilidad en tiempo real, decisiones basadas en datos y respuesta a emergencias desde una sola pantalla." />
  <meta property="og:url" content="https://ethoz.cl/para-directores" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="Ethoz para Directores — Gestión escolar sin planillas Excel" />
  <meta property="og:description" content="Tu día de director, sin planillas Excel ni llamadas de pánico. Visibilidad en tiempo real, decisiones basadas en datos y respuesta a emergencias desde una sola pantalla." />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Ethoz para Directores — Gestión escolar sin planillas Excel" />
  <meta name="twitter:description" content="Tu día de director, sin planillas Excel ni llamadas de pánico. Visibilidad en tiempo real, decisiones basadas en datos y respuesta a emergencias desde una sola pantalla." />
  <link rel="canonical" href="https://ethoz.cl/para-directores" />
  {@html `<script type="application/ld+json">${JSON.stringify({"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Inicio","item":"https://ethoz.cl/"},{"@type":"ListItem","position":2,"name":"Para Directores","item":"https://ethoz.cl/para-directores"}]})}</script>`}
</svelte:head>

<main class="flex min-h-dvh flex-col bg-background">
  <NavBar />

  <!-- Hero -->
  <section class="bg-secondary pt-28 pb-16 sm:pt-32 sm:pb-20">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
        <div class="lg:pt-6">
          <div class="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
            <Compass class="size-3.5 text-primary" />
            Para directores de establecimiento
          </div>
          <div class="flex items-start gap-3">
            <Compass class="mt-1 size-7 shrink-0 text-primary" />
            <h1 class="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Tu día de director, sin planillas Excel ni llamadas de pánico
            </h1>
          </div>
          <p class="mt-4 text-lg leading-relaxed text-muted-foreground">
            Visibilidad en tiempo real de lo que pasa en tu establecimiento. Decisiones basadas en datos, no en intuición. Evidencia lista cuando llega la Superintendencia.
          </p>
          <ul class="mt-6 space-y-3">
            <li class="flex items-start gap-2.5 text-sm text-muted-foreground">
              <BadgeCheck class="mt-0.5 size-4 shrink-0 text-primary" />
              Panel de la mañana — asistencia, alertas y retiros pendientes al llegar
            </li>
            <li class="flex items-start gap-2.5 text-sm text-muted-foreground">
              <BadgeCheck class="mt-0.5 size-4 shrink-0 text-primary" />
              Historial longitudinal por alumno — sin reinicio de marzo
            </li>
            <li class="flex items-start gap-2.5 text-sm text-muted-foreground">
              <BadgeCheck class="mt-0.5 size-4 shrink-0 text-primary" />
              Protocolos de emergencia con trazabilidad completa
            </li>
          </ul>
          <div class="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button size="lg" href="/demo">
              Agenda demo personalizada <ArrowRight class="size-4" />
            </Button>
          </div>
        </div>

        <!-- Morning KPI panel mockup -->
        <div class="w-full rounded-xl border border-border bg-card shadow-2xl">
          <div class="flex items-center gap-2 border-b border-border px-4 py-2.5">
            <div class="size-2.5 rounded-full bg-destructive/60"></div>
            <div class="size-2.5 rounded-full bg-warning/60"></div>
            <div class="size-2.5 rounded-full bg-success/60"></div>
            <span class="ml-2 text-[11px] font-medium text-muted-foreground">Ethoz — Panel Director · Lunes 7 de abril, 07:03</span>
          </div>
          <div class="p-4">
            <p class="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">Buenos días, Dir. Fuentes. Esto te espera hoy:</p>
            <!-- KPI grid -->
            <div class="grid grid-cols-2 gap-2 mb-3">
              <div class="rounded-lg border border-border bg-background p-3">
                <div class="flex items-center gap-1.5 mb-1">
                  <Users class="size-3.5 text-primary" />
                  <p class="text-[10px] font-semibold text-foreground">Asistencia hoy</p>
                </div>
                <p class="text-xl font-extrabold text-foreground">94,2%</p>
                <p class="text-[9px] text-muted-foreground">827 / 878 alumnos · 3 inasistencias justificadas</p>
              </div>
              <div class="rounded-lg border border-destructive/30 bg-destructive/5 p-3">
                <div class="flex items-center gap-1.5 mb-1">
                  <AlertTriangle class="size-3.5 text-destructive" />
                  <p class="text-[10px] font-semibold text-destructive">Alertas activas</p>
                </div>
                <p class="text-xl font-extrabold text-destructive">3</p>
                <p class="text-[9px] text-muted-foreground">2 convivencia · 1 retiro con restricción</p>
              </div>
              <div class="rounded-lg border border-border bg-background p-3">
                <div class="flex items-center gap-1.5 mb-1">
                  <Clock class="size-3.5 text-warning-foreground" />
                  <p class="text-[10px] font-semibold text-foreground">Retiros pendientes</p>
                </div>
                <p class="text-xl font-extrabold text-foreground">2</p>
                <p class="text-[9px] text-muted-foreground">Requieren autorización antes de las 14:30</p>
              </div>
              <div class="rounded-lg border border-border bg-background p-3">
                <div class="flex items-center gap-1.5 mb-1">
                  <Activity class="size-3.5 text-primary" />
                  <p class="text-[10px] font-semibold text-foreground">Convivencia semana</p>
                </div>
                <p class="text-xl font-extrabold text-foreground">5</p>
                <p class="text-[9px] text-muted-foreground">casos abiertos · 2 resueltos ayer</p>
              </div>
            </div>
            <!-- Priority action -->
            <div class="rounded-lg border border-warning/30 bg-warning/5 px-3 py-2 flex items-start gap-2">
              <Bell class="mt-0.5 size-3.5 shrink-0 text-warning-foreground" />
              <div>
                <p class="text-[10px] font-semibold text-warning-foreground">Acción recomendada</p>
                <p class="text-[9px] text-muted-foreground">Curso 3° Básico B: 4 inasistencias sin justificar esta semana. Protocolo de contacto apoderado activable.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Observaciones con contexto -->
  <section class="py-16 sm:py-20">
    <div class="mx-auto max-w-4xl px-4 sm:px-6">
      <div class="grid gap-10 lg:grid-cols-2 items-start">
        <div>
          <div class="flex items-center gap-3 mb-2">
            <MessageSquare class="size-5 shrink-0 text-primary" />
            <h2 class="text-xl font-bold tracking-tight text-foreground sm:text-2xl">Observaciones con contexto</h2>
          </div>
          <p class="mt-3 text-sm leading-relaxed text-muted-foreground">
            Cada observación queda clasificada por categoría, nivel de confidencialidad y responsable. Los roles ven solo lo que deben ver. El director ve todo.
          </p>
          <p class="mt-3 text-sm leading-relaxed text-muted-foreground">
            La notificación automática al apoderado se activa según el tipo de observación — sin que el director tenga que hacer nada manualmente.
          </p>
          <div class="mt-6 space-y-3">
            {#each [
              { icon: CheckCircle, text: 'Categorías predefinidas: convivencia, académica, salud, retiro, PIE' },
              { icon: CheckCircle, text: 'Niveles: público, confidencial, restringido por rol' },
              { icon: CheckCircle, text: 'Notificación automática al apoderado si corresponde al protocolo' },
            ] as item}
              <div class="flex items-start gap-2.5 text-sm text-muted-foreground">
                <item.icon class="mt-0.5 size-4 shrink-0 text-primary" />
                {item.text}
              </div>
            {/each}
          </div>
          <button
            onclick={() => activeObs = !activeObs}
            class="mt-6 text-xs font-medium px-3 py-1.5 rounded-full border border-border text-muted-foreground hover:text-foreground transition-colors"
          >
            {activeObs ? 'Ver formulario vacío' : 'Ver formulario completado'}
          </button>
        </div>

        <!-- Observation form mockup -->
        <div class="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
          <div class="border-b border-border px-4 py-3 flex items-center gap-2">
            <FileText class="size-4 text-primary" />
            <span class="text-sm font-semibold text-foreground">Nueva observación</span>
          </div>
          <div class="p-4 space-y-3">
            <div>
              <p class="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">Alumno</p>
              <div class="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2">
                {#if activeObs}
                  <div class="size-6 rounded-full bg-primary/10 flex items-center justify-center text-[9px] font-bold text-primary">MS</div>
                  <div>
                    <p class="text-[11px] font-semibold text-foreground">Matías Soto Vega</p>
                    <p class="text-[9px] text-muted-foreground">5° Básico A · RUT 24.567.890-1</p>
                  </div>
                {:else}
                  <p class="text-[11px] text-muted-foreground">Buscar por nombre o RUT…</p>
                {/if}
              </div>
            </div>
            <div class="grid grid-cols-2 gap-2">
              <div>
                <p class="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">Categoría</p>
                <div class="rounded-lg border border-border bg-background px-3 py-2">
                  <p class="text-[11px] {activeObs ? 'text-foreground font-medium' : 'text-muted-foreground'}">
                    {activeObs ? 'Convivencia escolar' : 'Seleccionar…'}
                  </p>
                </div>
              </div>
              <div>
                <p class="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">Confidencialidad</p>
                <div class="rounded-lg border {activeObs ? 'border-warning/30 bg-warning/5' : 'border-border bg-background'} px-3 py-2">
                  <p class="text-[11px] {activeObs ? 'text-warning-foreground font-medium' : 'text-muted-foreground'}">
                    {activeObs ? 'Confidencial — Dir. + Orient.' : 'Seleccionar…'}
                  </p>
                </div>
              </div>
            </div>
            <div>
              <p class="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">Descripción</p>
              <div class="min-h-[60px] rounded-lg border border-border bg-background px-3 py-2">
                {#if activeObs}
                  <p class="text-[11px] text-foreground">Situación de agresión verbal entre Matías y compañero del curso. Mediación iniciada por Inspector Herrera. Apoderada notificada a las 10:15.</p>
                {:else}
                  <p class="text-[11px] text-muted-foreground">Describir la situación observada…</p>
                {/if}
              </div>
            </div>
            <div>
              <p class="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">Notificación automática</p>
              <div class="flex items-center gap-2 rounded-lg border {activeObs ? 'border-success/20 bg-success/5' : 'border-border bg-background'} px-3 py-2">
                {#if activeObs}
                  <CheckCircle class="size-3.5 shrink-0 text-success" />
                  <p class="text-[11px] text-success">Apoderado notificado según protocolo de convivencia</p>
                {:else}
                  <p class="text-[11px] text-muted-foreground">Se definirá según categoría seleccionada</p>
                {/if}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Datos y tendencias -->
  <section class="bg-secondary py-16 sm:py-20">
    <div class="mx-auto max-w-4xl px-4 sm:px-6">
      <div class="grid gap-10 lg:grid-cols-2 items-start">
        <!-- Trend chart mockup -->
        <div class="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
          <div class="border-b border-border px-4 py-3 flex items-center gap-2">
            <BarChart3 class="size-4 text-primary" />
            <span class="text-sm font-semibold text-foreground">Convivencia — incidentes por mes · Colegio completo</span>
          </div>
          <div class="p-4">
            <!-- Chart bars -->
            <div class="flex items-end gap-1.5 h-28 mb-2">
              {#each convivenciaMeses as mes}
                <div class="flex-1 flex flex-col items-center gap-1">
                  <p class="text-[8px] text-foreground font-semibold">{mes.valor}</p>
                  <div class="w-full rounded-t-sm {mes.alerta ? 'bg-destructive/60' : 'bg-primary/40'}" style="height: {(mes.valor / maxVal) * 80}px"></div>
                  <p class="text-[8px] text-muted-foreground">{mes.mes}</p>
                  {#if mes.curso}
                    <p class="text-[7px] text-muted-foreground">{mes.curso}</p>
                  {/if}
                </div>
              {/each}
            </div>
            <div class="flex items-center gap-3 mt-1">
              <div class="flex items-center gap-1.5">
                <div class="size-2 rounded-full bg-destructive/60"></div>
                <p class="text-[9px] text-muted-foreground">Pico detectado (oct)</p>
              </div>
              <div class="flex items-center gap-1.5">
                <div class="size-2 rounded-full bg-primary/40"></div>
                <p class="text-[9px] text-muted-foreground">Mes normal</p>
              </div>
            </div>
            <!-- Insight card -->
            <div class="mt-3 rounded-lg border border-warning/20 bg-warning/5 px-3 py-2">
              <div class="flex items-center gap-1.5 mb-1">
                <TrendingUp class="size-3 text-warning-foreground" />
                <p class="text-[9px] font-semibold text-warning-foreground">Tendencia detectada automáticamente</p>
              </div>
              <p class="text-[9px] text-muted-foreground">Los incidentes de convivencia aumentan 3 semanas antes de cada evaluación PSU/SIMCE. Ethoz lo identifica con 14 días de anticipación.</p>
            </div>
          </div>
        </div>

        <div>
          <div class="flex items-center gap-3 mb-2">
            <TrendingUp class="size-5 shrink-0 text-primary" />
            <h2 class="text-xl font-bold tracking-tight text-foreground sm:text-2xl">Decisiones basadas en datos</h2>
          </div>
          <p class="mt-3 text-sm leading-relaxed text-muted-foreground">
            Un director que identifica patrones puede actuar antes de que el problema escale. Ethoz detecta automáticamente las tendencias que en papel o Excel son invisibles.
          </p>
          <p class="mt-3 text-sm leading-relaxed text-muted-foreground">
            ¿Cuál es el curso con más conflictos este semestre? ¿Qué hora del día concentra los retiros anticipados? ¿Qué docente tiene más observaciones sin cerrar? En dos clics.
          </p>
          <div class="mt-6 space-y-3">
            {#each [
              { icon: BarChart3, text: 'Tendencias de convivencia por curso, mes y tipo de incidente' },
              { icon: CalendarDays, text: 'Patrones de asistencia que predicen riesgo de deserción' },
              { icon: ShieldCheck, text: 'Indicadores de cumplimiento para Superintendencia en tiempo real' },
            ] as item}
              <div class="flex items-start gap-2.5 text-sm text-muted-foreground">
                <item.icon class="mt-0.5 size-4 shrink-0 text-primary" />
                {item.text}
              </div>
            {/each}
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Sin reinicio de marzo -->
  <section class="py-16 sm:py-20">
    <div class="mx-auto max-w-4xl px-4 sm:px-6">
      <div class="grid gap-10 lg:grid-cols-2 items-center">
        <div>
          <div class="flex items-center gap-3 mb-2">
            <CalendarDays class="size-5 shrink-0 text-primary" />
            <h2 class="text-xl font-bold tracking-tight text-foreground sm:text-2xl">Sin reinicio de marzo</h2>
          </div>
          <p class="mt-3 text-sm leading-relaxed text-muted-foreground">
            En los sistemas tradicionales, cada año escolar empieza desde cero. El historial de Catalina — las medidas de apoyo, las situaciones de convivencia, las restricciones de retiro — desaparece el 1° de marzo.
          </p>
          <p class="mt-3 text-sm leading-relaxed text-muted-foreground">
            Con Ethoz, el expediente de cada alumno viaja con él de año en año. El nuevo profesor jefe ve el historial completo desde el primer día de clases.
          </p>
          <div class="mt-6 rounded-xl border border-border bg-card p-4 shadow-sm">
            <p class="text-xs font-semibold text-foreground mb-3">Comparativa: sistemas tradicionales vs. Ethoz</p>
            <div class="space-y-2">
              {#each [
                { aspecto: 'Historial por alumno', trad: 'Se borra en marzo', ethoz: 'Continuo, pre-kinder a 4° medio' },
                { aspecto: 'Restricciones de retiro', trad: 'Re-ingresar cada año', ethoz: 'Vigentes hasta revocación explícita' },
                { aspecto: 'Medidas de apoyo PIE', trad: 'Documento Word compartido', ethoz: 'En la ficha, visible por rol' },
                { aspecto: 'Alertas médicas', trad: 'Cuaderno de enfermería', ethoz: 'Ficha 360°, actualizable en tiempo real' },
              ] as row}
                <div class="grid grid-cols-3 gap-2 text-[10px]">
                  <p class="text-muted-foreground font-medium">{row.aspecto}</p>
                  <p class="text-destructive">{row.trad}</p>
                  <p class="text-success font-medium">{row.ethoz}</p>
                </div>
              {/each}
            </div>
          </div>
        </div>

        <!-- Emergency protocol mockup -->
        <div class="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
          <div class="border-b border-border px-4 py-3 flex items-center gap-2">
            <ShieldCheck class="size-4 text-destructive" />
            <span class="text-sm font-semibold text-foreground">Protocolo de emergencia activo</span>
            <span class="ml-auto inline-flex items-center rounded-full bg-destructive/10 px-2 py-0.5 text-[9px] font-semibold text-destructive">EN CURSO</span>
          </div>
          <div class="p-4 space-y-3">
            <div class="rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2">
              <p class="text-[10px] font-bold text-destructive">Evacuación de emergencia — Bloque 3</p>
              <p class="text-[9px] text-muted-foreground">Activado por Dir. Fuentes · 10:42 AM · Sala de profesores</p>
            </div>
            <div class="space-y-2">
              {#each [
                { sector: 'Patio principal', estado: 'Confirmado', alumnos: 234, responsable: 'Insp. Herrera', ok: true },
                { sector: 'Bloque B — pisos 1-2', estado: 'Confirmado', alumnos: 189, responsable: 'Prof. Morales', ok: true },
                { sector: 'Bloque C — piso 3', estado: 'En proceso', alumnos: 145, responsable: 'Prof. Lagos', ok: false },
                { sector: 'Laboratorio', estado: 'Pendiente', alumnos: 28, responsable: 'Prof. Díaz', ok: false },
              ] as sector}
                <div class="flex items-center gap-3 rounded-lg {sector.ok ? 'bg-success/5 border border-success/20' : 'bg-warning/5 border border-warning/20'} px-3 py-2">
                  <div class="flex-1 min-w-0">
                    <p class="text-[10px] font-semibold text-foreground">{sector.sector}</p>
                    <p class="text-[9px] text-muted-foreground">{sector.responsable} · {sector.alumnos} alumnos</p>
                  </div>
                  <span class="text-[9px] font-semibold {sector.ok ? 'text-success' : 'text-warning-foreground'}">{sector.estado}</span>
                </div>
              {/each}
            </div>
            <div class="flex items-center justify-between pt-1">
              <p class="text-[9px] text-muted-foreground">596 / 596 alumnos contabilizados</p>
              <div class="h-1.5 w-24 rounded-full bg-border overflow-hidden">
                <div class="h-full w-[75%] rounded-full bg-warning"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Stats -->
  <section class="bg-secondary py-16 sm:py-20">
    <div class="mx-auto max-w-4xl px-4 sm:px-6">
      <div class="grid gap-8 sm:grid-cols-3 text-center">
        <div>
          <p class="text-4xl font-extrabold tracking-tight text-foreground">70,8%</p>
          <p class="mt-1 text-sm text-muted-foreground">de los requerimientos a la Superintendencia son de convivencia escolar</p>
        </div>
        <div>
          <p class="text-4xl font-extrabold tracking-tight text-foreground">&lt;5 min</p>
          <p class="mt-1 text-sm text-muted-foreground">para generar un reporte de convivencia listo para la Superintendencia</p>
        </div>
        <div>
          <p class="text-4xl font-extrabold tracking-tight text-foreground">100%</p>
          <p class="mt-1 text-sm text-muted-foreground">de las acciones quedan auditadas — quién, cuándo, qué campo consultó</p>
        </div>
      </div>
    </div>
  </section>

  <!-- CTA -->
  <section class="py-16 sm:py-20">
    <div class="mx-auto max-w-2xl px-4 text-center sm:px-6">
      <h2 class="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">¿Así luce tu lunes con Ethoz?</h2>
      <p class="mt-4 text-base leading-relaxed text-muted-foreground">
        Agenda una demo personalizada. Mostramos el sistema con el contexto de tu establecimiento — no una demo genérica.
      </p>
      <div class="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Button size="lg" href="/demo">
          Agenda demo personalizada <ArrowRight class="size-4" />
        </Button>
        <Button size="lg" variant="outline" href="/#features">
          Ver todas las funciones
        </Button>
      </div>
    </div>
  </section>

  <Footer />
</main>
