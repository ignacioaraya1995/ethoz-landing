<script lang="ts">
  import NavBar from '$lib/components/NavBar.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import { Button } from '$lib/components/ui/button';
  import {
    Building2, ArrowRight, ShieldAlert, BarChart3, BadgeCheck,
    AlertTriangle, FileSearch, TrendingDown, Scale, CheckCircle,
    Users, DollarSign, Activity, ClipboardCheck
  } from '@lucide/svelte';
  import { trackEvent } from '$lib/utils/analytics';

  $effect(() => { trackEvent('audience_page_viewed', { audience: 'sostenedores' }); });

  const colegios = [
    { nombre: 'Colegio San Patricio', rbd: '9234', alumnos: 842, alertas: 2, incidentes: 3, cumplimiento: 94 },
    { nombre: 'Liceo Santa María', rbd: '11045', alumnos: 1204, alertas: 0, incidentes: 1, cumplimiento: 98 },
    { nombre: 'Escuela La Esperanza', rbd: '7821', alumnos: 468, alertas: 5, incidentes: 7, cumplimiento: 71 },
    { nombre: 'Colegio Los Andes', rbd: '14302', alumnos: 931, alertas: 1, incidentes: 2, cumplimiento: 96 },
    { nombre: 'Instituto Bicentenario', rbd: '8890', alumnos: 1573, alertas: 3, incidentes: 4, cumplimiento: 88 },
  ];

  const auditLog = [
    { hora: '09:14', colegio: 'Esc. La Esperanza', accion: 'Retiro bloqueado — orden judicial', usuario: 'Portero Soto', nivel: 'critical' },
    { hora: '08:52', colegio: 'Col. San Patricio', accion: 'Incidente convivencia cerrado', usuario: 'Inspect. Herrera', nivel: 'info' },
    { hora: '08:31', colegio: 'Lic. Santa María', accion: 'Protocolo PIE activado — 3° Medio A', usuario: 'Dir. Ramírez', nivel: 'info' },
    { hora: '07:58', colegio: 'Inst. Bicentenario', accion: 'Alerta médica: crisis epiléptica', usuario: 'Sistem. automático', nivel: 'warning' },
    { hora: '07:44', colegio: 'Col. Los Andes', accion: 'Datos exportados para Superintendencia', usuario: 'Dir. Fuentes', nivel: 'info' },
  ];
</script>

<svelte:head>
  <title>Ethoz para Sostenedores — Gestión multi-colegio y cumplimiento Ley 21.719</title>
  <meta name="description" content="Gestiona la protección de todos tus establecimientos desde un solo panel. Cumplimiento Ley 21.719, visibilidad multi-sede y auditoría centralizada." />
  <meta property="og:url" content="https://ethoz.cl/para-sostenedores" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="Ethoz para Sostenedores — Gestión multi-colegio" />
  <meta property="og:description" content="Gestiona la protección de todos tus establecimientos desde un solo panel. Cumplimiento Ley 21.719, visibilidad multi-sede y auditoría centralizada." />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Ethoz para Sostenedores — Gestión multi-colegio" />
  <meta name="twitter:description" content="Gestiona la protección de todos tus establecimientos desde un solo panel. Cumplimiento Ley 21.719, visibilidad multi-sede y auditoría centralizada." />
  <link rel="canonical" href="https://ethoz.cl/para-sostenedores" />
  {@html `<script type="application/ld+json">${JSON.stringify({"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Inicio","item":"https://ethoz.cl/"},{"@type":"ListItem","position":2,"name":"Para Sostenedores","item":"https://ethoz.cl/para-sostenedores"}]})}</script>`}
</svelte:head>

<main class="flex min-h-dvh flex-col bg-background">
  <NavBar />

  <!-- Hero -->
  <section class="bg-secondary pt-28 pb-16 sm:pt-32 sm:pb-20">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
        <div class="lg:pt-6">
          <div class="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
            <Building2 class="size-3.5 text-primary" />
            Para operadores multi-colegio
          </div>
          <div class="flex items-start gap-3">
            <Building2 class="mt-1 size-7 shrink-0 text-primary" />
            <h1 class="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Gestiona la protección de 5 colegios desde un solo panel
            </h1>
          </div>
          <p class="mt-4 text-lg leading-relaxed text-muted-foreground">
            La Ley 21.719 entra en plena vigencia en diciembre de 2026. Las multas alcanzan hasta 20.000 UTM por establecimiento. Con múltiples sedes, tu exposición se multiplica — y también tu capacidad de control con Ethoz.
          </p>
          <ul class="mt-6 space-y-3">
            <li class="flex items-start gap-2.5 text-sm text-muted-foreground">
              <BadgeCheck class="mt-0.5 size-4 shrink-0 text-primary" />
              Visibilidad en tiempo real de todos tus establecimientos en una pantalla
            </li>
            <li class="flex items-start gap-2.5 text-sm text-muted-foreground">
              <BadgeCheck class="mt-0.5 size-4 shrink-0 text-primary" />
              Auditoría centralizada — quién hizo qué, en qué sede, a qué hora
            </li>
            <li class="flex items-start gap-2.5 text-sm text-muted-foreground">
              <BadgeCheck class="mt-0.5 size-4 shrink-0 text-primary" />
              Un contrato, una licencia consolidada — no N sistemas distintos
            </li>
          </ul>
          <div class="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button size="lg" href="/demo">
              Agenda una evaluación de tu portafolio <ArrowRight class="size-4" />
            </Button>
          </div>
        </div>

        <!-- Dashboard multi-colegio mockup -->
        <div class="w-full rounded-xl border border-border bg-card shadow-2xl">
          <div class="flex items-center gap-2 border-b border-border px-4 py-2.5">
            <div class="size-2.5 rounded-full bg-destructive/60"></div>
            <div class="size-2.5 rounded-full bg-warning/60"></div>
            <div class="size-2.5 rounded-full bg-success/60"></div>
            <span class="ml-2 text-[11px] font-medium text-muted-foreground">Ethoz — Panel Sostenedor · Red de 5 establecimientos</span>
          </div>
          <div class="p-4">
            <!-- Summary KPIs -->
            <div class="mb-3 grid grid-cols-4 gap-2">
              {#each [
                { label: 'Alumnos', value: '5.018', icon: Users },
                { label: 'Alertas', value: '11', icon: AlertTriangle, danger: true },
                { label: 'Incidentes', value: '17', icon: Activity },
                { label: 'Cumplim.', value: '89%', icon: CheckCircle },
              ] as kpi}
                <div class="rounded-lg border border-border bg-background px-2 py-2 text-center">
                  <kpi.icon class="mx-auto mb-1 size-3.5 {kpi.danger ? 'text-destructive' : 'text-primary'}" />
                  <p class="text-sm font-bold {kpi.danger ? 'text-destructive' : 'text-foreground'}">{kpi.value}</p>
                  <p class="text-[9px] text-muted-foreground">{kpi.label}</p>
                </div>
              {/each}
            </div>
            <!-- School cards grid -->
            <div class="space-y-1.5">
              {#each colegios as col}
                <div class="flex items-center gap-3 rounded-lg border border-border bg-background px-3 py-2">
                  <div class="flex-1 min-w-0">
                    <p class="text-[11px] font-semibold text-foreground truncate">{col.nombre}</p>
                    <p class="text-[9px] text-muted-foreground">RBD {col.rbd} · {col.alumnos.toLocaleString('es-CL')} alumnos</p>
                  </div>
                  <div class="flex items-center gap-3">
                    <div class="text-center">
                      <p class="text-[10px] font-bold {col.alertas > 3 ? 'text-destructive' : col.alertas > 0 ? 'text-warning-foreground' : 'text-success'}">{col.alertas}</p>
                      <p class="text-[8px] text-muted-foreground">alertas</p>
                    </div>
                    <div class="text-center">
                      <p class="text-[10px] font-bold text-foreground">{col.incidentes}</p>
                      <p class="text-[8px] text-muted-foreground">incid./mes</p>
                    </div>
                    <div class="flex items-center gap-1">
                      <div class="h-1.5 w-12 rounded-full bg-border overflow-hidden">
                        <div
                          class="h-full rounded-full {col.cumplimiento >= 90 ? 'bg-success' : col.cumplimiento >= 80 ? 'bg-warning' : 'bg-destructive'}"
                          style="width: {col.cumplimiento}%"
                        ></div>
                      </div>
                      <p class="text-[9px] font-semibold {col.cumplimiento >= 90 ? 'text-success' : col.cumplimiento >= 80 ? 'text-warning-foreground' : 'text-destructive'}">{col.cumplimiento}%</p>
                    </div>
                  </div>
                </div>
              {/each}
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- El problema del sostenedor en 2026 -->
  <section class="py-16 sm:py-20">
    <div class="mx-auto max-w-4xl px-4 sm:px-6">
      <div class="flex items-center gap-3 mb-2">
        <AlertTriangle class="size-5 shrink-0 text-destructive" />
        <h2 class="text-xl font-bold tracking-tight text-foreground sm:text-2xl">El problema del sostenedor en 2026</h2>
      </div>
      <p class="mb-10 text-sm leading-relaxed text-muted-foreground max-w-2xl">
        Operar múltiples establecimientos con sistemas distintos no es solo ineficiente — es un riesgo legal concreto con fecha de vencimiento.
      </p>
      <div class="grid gap-6 sm:grid-cols-2">
        <div class="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div class="flex items-center gap-2.5 mb-3">
            <Scale class="size-5 shrink-0 text-destructive" />
            <h3 class="text-base font-semibold text-foreground">Ley 21.719 — plazo real</h3>
          </div>
          <p class="text-sm leading-relaxed text-muted-foreground">
            La ley de protección de datos personales entra en plena vigencia en <strong class="text-foreground">diciembre de 2026</strong>. Las multas llegan a <strong class="text-foreground">20.000 UTM (~$1.300M CLP)</strong> o el 4% de la facturación anual — lo que sea mayor. Por establecimiento.
          </p>
        </div>
        <div class="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div class="flex items-center gap-2.5 mb-3">
            <TrendingDown class="size-5 shrink-0 text-warning-foreground" />
            <h3 class="text-base font-semibold text-foreground">Sistemas fragmentados por sede</h3>
          </div>
          <p class="text-sm leading-relaxed text-muted-foreground">
            Cada colegio lleva su propio Excel, su propio cuaderno de portería y sus propios protocolos. No hay estándar, no hay visibilidad cruzada y en una fiscalización, cada sede responde sola.
          </p>
        </div>
        <div class="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div class="flex items-center gap-2.5 mb-3">
            <BarChart3 class="size-5 shrink-0 text-primary" />
            <h3 class="text-base font-semibold text-foreground">Consolidación manual imposible</h3>
          </div>
          <p class="text-sm leading-relaxed text-muted-foreground">
            Pedir un reporte de incidentes a tus 5 directores tarda días. Para cuando llega la información, ya cambió. Las decisiones se toman con datos de la semana pasada, cuando los problemas ya escalaron.
          </p>
        </div>
        <div class="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div class="flex items-center gap-2.5 mb-3">
            <FileSearch class="size-5 shrink-0 text-primary" />
            <h3 class="text-base font-semibold text-foreground">Exposición en auditorías</h3>
          </div>
          <p class="text-sm leading-relaxed text-muted-foreground">
            Cuando la Superintendencia llega a un establecimiento, la pregunta no es si pasaron cosas. La pregunta es si puedes demostrar que tienes el control. Sin un sistema, la respuesta es no.
          </p>
        </div>
      </div>
    </div>
  </section>

  <!-- Exposición legal por N colegios -->
  <section class="bg-secondary py-16 sm:py-20">
    <div class="mx-auto max-w-4xl px-4 sm:px-6">
      <div class="grid gap-10 lg:grid-cols-2 items-center">
        <div>
          <div class="flex items-center gap-3 mb-2">
            <Scale class="size-5 shrink-0 text-destructive" />
            <h2 class="text-xl font-bold tracking-tight text-foreground sm:text-2xl">Tu exposición legal se multiplica</h2>
          </div>
          <p class="mt-3 text-sm leading-relaxed text-muted-foreground">
            Las multas de la Ley 21.719 aplican <strong class="text-foreground">por infracción, por establecimiento</strong>. Operar 5 sedes sin cumplimiento no es un riesgo de 20.000 UTM — es un riesgo de 100.000 UTM.
          </p>
          <p class="mt-3 text-sm leading-relaxed text-muted-foreground">
            El 70,8% de los requerimientos a la Superintendencia son de convivencia escolar. Tu red no es la excepción.
          </p>
          <div class="mt-6 rounded-xl border border-destructive/20 bg-destructive/5 p-4">
            <p class="text-xs font-semibold text-destructive mb-3">Simulación de exposición — red de 5 establecimientos</p>
            {#each [
              { sedes: 1, monto: '20.000 UTM' },
              { sedes: 3, monto: '60.000 UTM' },
              { sedes: 5, monto: '100.000 UTM' },
            ] as row}
              <div class="flex items-center justify-between py-1.5 border-b border-destructive/10 last:border-0">
                <p class="text-xs text-muted-foreground">{row.sedes} establecimiento{row.sedes > 1 ? 's' : ''} sin cumplimiento</p>
                <p class="text-xs font-bold text-destructive">hasta {row.monto}</p>
              </div>
            {/each}
            <p class="mt-2 text-[10px] text-muted-foreground">1 UTM = aprox. $65.000 CLP (abril 2026)</p>
          </div>
        </div>

        <!-- Consolidación financiera -->
        <div class="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
          <div class="border-b border-border px-4 py-3 flex items-center gap-2">
            <DollarSign class="size-4 text-primary" />
            <span class="text-sm font-semibold text-foreground">Consolidación financiera — Ethoz vs. soluciones separadas</span>
          </div>
          <div class="p-4 space-y-3">
            <div class="rounded-lg border border-destructive/20 bg-destructive/5 p-3">
              <p class="text-[10px] font-semibold text-destructive mb-2">Sin Ethoz — 5 sistemas distintos</p>
              <div class="space-y-1.5">
                {#each [
                  { item: 'Licencias individuales × 5', valor: '$4.500.000/año' },
                  { item: 'Consolidación manual (horas/mes)', valor: '$1.200.000/año' },
                  { item: 'Riesgo multa Ley 21.719', valor: 'hasta $6.500M' },
                ] as row}
                  <div class="flex justify-between text-[10px]">
                    <span class="text-muted-foreground">{row.item}</span>
                    <span class="font-semibold text-destructive">{row.valor}</span>
                  </div>
                {/each}
              </div>
            </div>
            <div class="rounded-lg border border-success/20 bg-success/5 p-3">
              <p class="text-[10px] font-semibold text-success mb-2">Con Ethoz — licencia red consolidada</p>
              <div class="space-y-1.5">
                {#each [
                  { item: 'Licencia red 5 sedes', valor: '$2.800.000/año' },
                  { item: 'Consolidación automática', valor: '$0' },
                  { item: 'Exposición Ley 21.719', valor: 'Cubierta' },
                ] as row}
                  <div class="flex justify-between text-[10px]">
                    <span class="text-muted-foreground">{row.item}</span>
                    <span class="font-semibold text-success">{row.valor}</span>
                  </div>
                {/each}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Auditoría centralizada -->
  <section class="py-16 sm:py-20">
    <div class="mx-auto max-w-4xl px-4 sm:px-6">
      <div class="grid gap-10 lg:grid-cols-2 items-start">
        <div>
          <div class="flex items-center gap-3 mb-2">
            <ClipboardCheck class="size-5 shrink-0 text-primary" />
            <h2 class="text-xl font-bold tracking-tight text-foreground sm:text-2xl">Auditoría centralizada — todas las sedes</h2>
          </div>
          <p class="mt-3 text-sm leading-relaxed text-muted-foreground">
            Cada acción en cualquier colegio de tu red queda registrada con sello de tiempo, usuario y sede. Cuando llega la Superintendencia, exportas el reporte en un clic — no llamas a 5 directores.
          </p>
          <p class="mt-4 text-sm leading-relaxed text-muted-foreground">
            El log de auditoría es inmutable. Ningún director puede editar un registro ya enviado. Esa garantía protege al sostenedor ante demandas y fiscalizaciones.
          </p>
          <div class="mt-6 space-y-3">
            {#each [
              { icon: CheckCircle, text: 'Exportación XLSX/PDF para la Superintendencia en un clic' },
              { icon: CheckCircle, text: 'Filtros por sede, rol, tipo de evento y rango de fechas' },
              { icon: CheckCircle, text: 'Alertas automáticas al sostenedor si una sede supera umbrales críticos' },
            ] as item}
              <div class="flex items-start gap-2.5 text-sm text-muted-foreground">
                <item.icon class="mt-0.5 size-4 shrink-0 text-primary" />
                {item.text}
              </div>
            {/each}
          </div>
        </div>

        <!-- Audit log mockup -->
        <div class="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
          <div class="border-b border-border px-4 py-3 flex items-center gap-2">
            <FileSearch class="size-4 text-primary" />
            <span class="text-sm font-semibold text-foreground">Log de auditoría — hoy — 5 establecimientos</span>
          </div>
          <div class="divide-y divide-border">
            {#each auditLog as entry}
              <div class="flex items-start gap-3 px-4 py-2.5">
                <span class="mt-0.5 shrink-0 text-[9px] font-mono text-muted-foreground w-8">{entry.hora}</span>
                <div class="flex-1 min-w-0">
                  <p class="text-[11px] font-medium {entry.nivel === 'critical' ? 'text-destructive' : entry.nivel === 'warning' ? 'text-warning-foreground' : 'text-foreground'} truncate">{entry.accion}</p>
                  <div class="flex items-center gap-2 mt-0.5">
                    <span class="inline-flex items-center rounded-full bg-primary/10 px-1.5 py-0.5 text-[9px] font-medium text-primary">{entry.colegio}</span>
                    <span class="text-[9px] text-muted-foreground">{entry.usuario}</span>
                  </div>
                </div>
                {#if entry.nivel === 'critical'}
                  <AlertTriangle class="mt-0.5 size-3.5 shrink-0 text-destructive" />
                {:else if entry.nivel === 'warning'}
                  <AlertTriangle class="mt-0.5 size-3.5 shrink-0 text-warning-foreground" />
                {:else}
                  <CheckCircle class="mt-0.5 size-3.5 shrink-0 text-success" />
                {/if}
              </div>
            {/each}
          </div>
          <div class="border-t border-border px-4 py-2 flex items-center justify-between">
            <p class="text-[9px] text-muted-foreground">Mostrando últimas 5 de 347 acciones hoy</p>
            <button class="text-[9px] font-medium text-primary hover:underline">Ver reporte completo</button>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- TAM callout + stats -->
  <section class="bg-secondary py-16 sm:py-20">
    <div class="mx-auto max-w-4xl px-4 sm:px-6">
      <div class="rounded-xl border border-border bg-card p-8 text-center shadow-sm">
        <p class="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">El mercado que protegemos</p>
        <div class="grid gap-8 sm:grid-cols-3">
          <div>
            <p class="text-4xl font-extrabold tracking-tight text-foreground">402</p>
            <p class="mt-1 text-sm text-muted-foreground">operadores multi-colegio en Chile (Tier 1)</p>
          </div>
          <div>
            <p class="text-4xl font-extrabold tracking-tight text-foreground">12.038</p>
            <p class="mt-1 text-sm text-muted-foreground">establecimientos educacionales en el país</p>
          </div>
          <div>
            <p class="text-4xl font-extrabold tracking-tight text-foreground">5.777</p>
            <p class="mt-1 text-sm text-muted-foreground">sostenedores que responden ante la ley</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- CTA -->
  <section class="py-16 sm:py-20">
    <div class="mx-auto max-w-2xl px-4 text-center sm:px-6">
      <h2 class="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Evalúa tu portafolio con nosotros</h2>
      <p class="mt-4 text-base leading-relaxed text-muted-foreground">
        Una sesión de 30 minutos para mapear tu exposición real ante la Ley 21.719 y ver cómo Ethoz consolida la protección de toda tu red.
      </p>
      <div class="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Button size="lg" href="/demo">
          Agenda una evaluación de tu portafolio <ArrowRight class="size-4" />
        </Button>
        <Button size="lg" variant="outline" href="/#features">
          Ver todas las funciones
        </Button>
      </div>
    </div>
  </section>

  <Footer />
</main>
