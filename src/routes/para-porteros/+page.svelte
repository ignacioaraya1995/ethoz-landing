<script lang="ts">
  import NavBar from '$lib/components/NavBar.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import { Button } from '$lib/components/ui/button';
  import {
    DoorOpen, ArrowRight, BadgeCheck, CheckCircle, XCircle,
    Ban, AlertTriangle, Eye, EyeOff, Wifi, WifiOff, Clock, UserCheck
  } from '@lucide/svelte';
  import { trackEvent } from '$lib/utils/analytics';

  $effect(() => { trackEvent('audience_page_viewed', { audience: 'porteros' }); });

  let retiroState = $state<'normal' | 'bloqueado'>('normal');
</script>

<svelte:head>
  <title>Ethoz para Porteros — La pantalla que reemplaza la planilla Excel en portería</title>
  <meta name="description" content="Verifica retiros en segundos. Foto del alumno, lista de autorizados, alertas activas. Sin llamadas, sin ambigüedad, sin papel." />
  <meta property="og:url" content="https://ethoz.cl/para-porteros" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="Ethoz para Porteros — Retiros seguros en segundos" />
  <meta property="og:description" content="Verifica retiros en segundos. Foto del alumno, lista de autorizados, alertas activas. Sin llamadas, sin ambigüedad, sin papel." />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Ethoz para Porteros — Retiros seguros en segundos" />
  <meta name="twitter:description" content="Verifica retiros en segundos. Foto del alumno, lista de autorizados, alertas activas. Sin llamadas, sin ambigüedad, sin papel." />
  <link rel="canonical" href="https://ethoz.cl/para-porteros" />
  {@html `<script type="application/ld+json">${JSON.stringify({"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Inicio","item":"https://ethoz.cl/"},{"@type":"ListItem","position":2,"name":"Para Porteros","item":"https://ethoz.cl/para-porteros"}]})}</script>`}
</svelte:head>

<main class="flex min-h-dvh flex-col bg-background">
  <NavBar />

  <!-- Hero -->
  <section class="bg-secondary pt-28 pb-16 sm:pt-32 sm:pb-20">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
        <div class="lg:pt-6">
          <div class="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
            <DoorOpen class="size-3.5 text-primary" />
            Para porteros y asistentes de retiro
          </div>
          <div class="flex items-start gap-3">
            <DoorOpen class="mt-1 size-7 shrink-0 text-primary" />
            <h1 class="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              La pantalla que reemplaza la planilla Excel en portería
            </h1>
          </div>
          <p class="mt-4 text-lg leading-relaxed text-muted-foreground">
            Verde: puede retirar. Rojo: no puede retirar. Sin llamadas a inspectoría, sin buscar en carpetas, sin márgenes de error. La respuesta está en la pantalla en menos de 3 segundos.
          </p>
          <ul class="mt-6 space-y-3">
            <li class="flex items-start gap-2.5 text-sm text-muted-foreground">
              <BadgeCheck class="mt-0.5 size-4 shrink-0 text-primary" />
              Foto del alumno + lista de apoderados autorizados — sin ambigüedad
            </li>
            <li class="flex items-start gap-2.5 text-sm text-muted-foreground">
              <BadgeCheck class="mt-0.5 size-4 shrink-0 text-primary" />
              Bloqueos judiciales visibles automáticamente — sin que nadie tenga que avisar
            </li>
            <li class="flex items-start gap-2.5 text-sm text-muted-foreground">
              <BadgeCheck class="mt-0.5 size-4 shrink-0 text-primary" />
              Registro automático de cada retiro — el portero no escribe nada a mano
            </li>
          </ul>
          <div class="mt-6 flex items-center gap-3">
            <button
              onclick={() => retiroState = 'normal'}
              class="text-xs font-medium px-3 py-1.5 rounded-full border transition-colors {retiroState === 'normal' ? 'bg-success text-white border-success' : 'border-border text-muted-foreground hover:text-foreground'}"
            >
              Retiro autorizado
            </button>
            <button
              onclick={() => retiroState = 'bloqueado'}
              class="text-xs font-medium px-3 py-1.5 rounded-full border transition-colors {retiroState === 'bloqueado' ? 'bg-destructive text-destructive-foreground border-destructive' : 'border-border text-muted-foreground hover:text-foreground'}"
            >
              Retiro bloqueado
            </button>
          </div>
          <div class="mt-8">
            <Button size="lg" href="/demo">
              Solicita una demo para tu portería <ArrowRight class="size-4" />
            </Button>
          </div>
        </div>

        <!-- Portería screen mockup -->
        <div class="w-full rounded-xl border border-border bg-card shadow-2xl">
          <div class="flex items-center gap-2 border-b border-border px-4 py-2.5">
            <div class="size-2.5 rounded-full bg-destructive/60"></div>
            <div class="size-2.5 rounded-full bg-warning/60"></div>
            <div class="size-2.5 rounded-full bg-success/60"></div>
            <span class="ml-2 text-[11px] font-medium text-muted-foreground">Ethoz — Portería Principal · 14:31</span>
          </div>
          <div class="p-4">
            <!-- Search bar -->
            <div class="mb-3 flex items-center gap-2 rounded-lg border border-primary/40 bg-primary/5 px-3 py-2.5">
              <svg class="size-4 shrink-0 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              <p class="text-[11px] font-medium text-foreground">Matías Soto Vega — 3° Básico A</p>
            </div>

            {#if retiroState === 'normal'}
              <!-- Authorized state -->
              <div class="flex items-center gap-3 rounded-lg bg-success/10 border border-success/30 px-3 py-2.5 mb-4">
                <CheckCircle class="size-5 shrink-0 text-success" />
                <div>
                  <p class="text-sm font-bold text-success">PUEDE RETIRAR</p>
                  <p class="text-[9px] text-muted-foreground">Persona autorizada · Confirmar y registrar retiro</p>
                </div>
              </div>
              <!-- Student card -->
              <div class="flex gap-3 mb-4">
                <div class="size-16 rounded-xl bg-primary/10 flex items-center justify-center text-2xl font-extrabold text-primary shrink-0">M</div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-bold text-foreground">Matías Soto Vega</p>
                  <p class="text-[11px] text-muted-foreground">3° Básico A · RUT 25.678.901-2</p>
                  <p class="text-[10px] text-muted-foreground mt-0.5">Sin alertas activas</p>
                </div>
              </div>
              <!-- Authorized guardians -->
              <p class="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Apoderados autorizados</p>
              <div class="space-y-2">
                {#each [
                  { nombre: 'Carmen Vega Rojas', rel: 'Madre', foto: 'C', ok: true },
                  { nombre: 'Pedro Soto Núñez', rel: 'Padre', foto: 'P', ok: true },
                  { nombre: 'Rosa Rojas Mora', rel: 'Abuela materna', foto: 'R', ok: true },
                ] as g}
                  <div class="flex items-center gap-2 rounded-lg bg-success/5 border border-success/15 px-3 py-2 cursor-pointer hover:bg-success/10 transition-colors">
                    <div class="size-7 rounded-full bg-success/20 flex items-center justify-center text-[10px] font-bold text-success shrink-0">{g.foto}</div>
                    <div class="flex-1 min-w-0">
                      <p class="text-[11px] font-semibold text-foreground">{g.nombre}</p>
                      <p class="text-[9px] text-muted-foreground">{g.rel}</p>
                    </div>
                    <CheckCircle class="size-4 shrink-0 text-success" />
                  </div>
                {/each}
              </div>
            {:else}
              <!-- Blocked state -->
              <div class="flex items-center gap-3 rounded-lg bg-destructive/10 border border-destructive/30 px-3 py-2.5 mb-4">
                <XCircle class="size-5 shrink-0 text-destructive" />
                <div>
                  <p class="text-sm font-bold text-destructive">NO ENTREGAR — LLAMAR A INSPECTOR</p>
                  <p class="text-[9px] text-muted-foreground">Inspector Herrera · Ext. 201 · Sala inspectoría</p>
                </div>
              </div>
              <!-- Student card -->
              <div class="flex gap-3 mb-4">
                <div class="size-16 rounded-xl bg-primary/10 flex items-center justify-center text-2xl font-extrabold text-primary shrink-0">M</div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-bold text-foreground">Matías Soto Vega</p>
                  <p class="text-[11px] text-muted-foreground">3° Básico A · RUT 25.678.901-2</p>
                </div>
              </div>
              <!-- Judicial block -->
              <div class="rounded-lg border border-destructive/30 bg-destructive/5 p-3 mb-3">
                <div class="flex items-center gap-2 mb-1.5">
                  <Ban class="size-4 shrink-0 text-destructive" />
                  <p class="text-[11px] font-bold text-destructive">RESTRICCIÓN JUDICIAL VIGENTE</p>
                </div>
                <div class="space-y-1">
                  <div class="flex gap-2 text-[10px]">
                    <span class="text-muted-foreground w-16 shrink-0">Persona:</span>
                    <span class="font-semibold text-foreground">Jorge Soto Muñoz (padre biológico)</span>
                  </div>
                  <div class="flex gap-2 text-[10px]">
                    <span class="text-muted-foreground w-16 shrink-0">RIT:</span>
                    <span class="font-semibold text-foreground">C-4821-2025 · Juzgado de Familia Stgo Norte</span>
                  </div>
                  <div class="flex gap-2 text-[10px]">
                    <span class="text-muted-foreground w-16 shrink-0">Vigente:</span>
                    <span class="font-semibold text-foreground">Desde 22 enero 2026 · Sin fecha de término</span>
                  </div>
                </div>
              </div>
              <p class="text-[9px] text-muted-foreground text-center">No tomes decisiones solo. El inspector tiene el protocolo completo.</p>
            {/if}
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- El retiro de las 14:30 — escenario real -->
  <section class="py-16 sm:py-20">
    <div class="mx-auto max-w-4xl px-4 sm:px-6">
      <div class="flex items-center gap-3 mb-2">
        <Clock class="size-5 shrink-0 text-primary" />
        <h2 class="text-xl font-bold tracking-tight text-foreground sm:text-2xl">El retiro de las 14:30 — así funciona</h2>
      </div>
      <p class="mb-10 text-sm leading-relaxed text-muted-foreground max-w-2xl">
        Son las 14:28. La tía Carmen llega a buscar a Matías de 3° básico. Tiene 40 apoderados esperando. Esto es lo que pasa en los próximos 15 segundos.
      </p>
      <div class="grid gap-6 sm:grid-cols-3">
        {#each [
          {
            num: '1',
            titulo: 'El portero busca al alumno',
            desc: 'Escribe "Matías" o "Soto" en el buscador. Aparece la foto de Matías, su curso y sus apoderados autorizados. Sin carpetas, sin llamadas.',
            tiempo: '3 seg'
          },
          {
            num: '2',
            titulo: 'Identifica a la tía Carmen',
            desc: 'Aparece "Rosa Rojas Mora — abuela materna" con foto. La tía Carmen dice que ella es la abuela. El portero confirma con la foto. Verde.',
            tiempo: '8 seg'
          },
          {
            num: '3',
            titulo: 'Confirma el retiro',
            desc: 'Un toque en "Confirmar retiro". El registro queda guardado automáticamente con hora, portería y usuario. El apoderado recibe notificación en su móvil.',
            tiempo: '4 seg'
          },
        ] as step}
          <div class="rounded-xl border border-border bg-card p-5 shadow-sm">
            <div class="mb-3 flex items-center gap-3">
              <span class="flex size-7 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">{step.num}</span>
              <p class="text-sm font-semibold text-foreground">{step.titulo}</p>
            </div>
            <p class="text-xs leading-relaxed text-muted-foreground mb-3">{step.desc}</p>
            <div class="flex items-center gap-1.5">
              <Clock class="size-3.5 text-muted-foreground" />
              <p class="text-[10px] font-semibold text-muted-foreground">{step.tiempo}</p>
            </div>
          </div>
        {/each}
      </div>
      <p class="mt-6 text-center text-sm font-semibold text-foreground">Total: menos de 15 segundos. Sin llamadas. Sin papel. Con registro.</p>
    </div>
  </section>

  <!-- Solo lo que el portero necesita -->
  <section class="bg-secondary py-16 sm:py-20">
    <div class="mx-auto max-w-4xl px-4 sm:px-6">
      <div class="grid gap-10 lg:grid-cols-2 items-start">
        <div>
          <div class="flex items-center gap-3 mb-2">
            <Eye class="size-5 shrink-0 text-primary" />
            <h2 class="text-xl font-bold tracking-tight text-foreground sm:text-2xl">Solo lo que el portero necesita</h2>
          </div>
          <p class="mt-3 text-sm leading-relaxed text-muted-foreground">
            La privacidad es parte del diseño. El portero no necesita saber el diagnóstico médico de un alumno para decidir si puede retirarle. Ethoz le muestra exactamente lo que necesita — y nada más.
          </p>
          <p class="mt-3 text-sm leading-relaxed text-muted-foreground">
            Esto además protege al portero ante la Ley 21.719: si no tiene acceso a datos sensibles, no puede incurrir en una infracción de datos que recaiga sobre él.
          </p>
        </div>
        <!-- Visibility comparison -->
        <div class="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
          <div class="grid grid-cols-2 divide-x divide-border">
            <div class="p-4">
              <div class="flex items-center gap-2 mb-3">
                <Eye class="size-4 text-success" />
                <p class="text-[11px] font-bold text-success">El portero SÍ ve</p>
              </div>
              <div class="space-y-2">
                {#each [
                  'Foto y nombre del alumno',
                  'Curso y RBD',
                  'Apoderados autorizados con foto',
                  'Estado: puede / no puede retirar',
                  'Alertas de retiro activas',
                  'Restricciones judiciales',
                ] as item}
                  <div class="flex items-start gap-2">
                    <CheckCircle class="mt-0.5 size-3.5 shrink-0 text-success" />
                    <p class="text-[10px] text-foreground">{item}</p>
                  </div>
                {/each}
              </div>
            </div>
            <div class="p-4">
              <div class="flex items-center gap-2 mb-3">
                <EyeOff class="size-4 text-muted-foreground" />
                <p class="text-[11px] font-bold text-muted-foreground">El portero NO ve</p>
              </div>
              <div class="space-y-2">
                {#each [
                  'Diagnósticos médicos',
                  'Historial psicológico',
                  'Observaciones de convivencia',
                  'Calificaciones académicas',
                  'Datos de separación familiar',
                  'Información PIE / NEE',
                ] as item}
                  <div class="flex items-start gap-2">
                    <XCircle class="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
                    <p class="text-[10px] text-muted-foreground">{item}</p>
                  </div>
                {/each}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Entrenamiento + offline -->
  <section class="py-16 sm:py-20">
    <div class="mx-auto max-w-4xl px-4 sm:px-6">
      <div class="grid gap-6 sm:grid-cols-2">
        <div class="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div class="flex items-center gap-2.5 mb-3">
            <UserCheck class="size-5 shrink-0 text-primary" />
            <h3 class="text-base font-semibold text-foreground">Entrenamiento en 15 minutos</h3>
          </div>
          <p class="text-sm leading-relaxed text-muted-foreground mb-4">
            La interfaz tiene exactamente 3 acciones posibles: buscar, confirmar y reportar. No hay menús complejos. Un portero nuevo puede operar el sistema solo tras 15 minutos de introducción.
          </p>
          <div class="space-y-2">
            {#each [
              { paso: '1', texto: 'Buscar alumno por nombre o RUT' },
              { paso: '2', texto: 'Identificar al apoderado — ver foto y estado' },
              { paso: '3', texto: 'Confirmar retiro o llamar a inspector' },
            ] as p}
              <div class="flex items-center gap-3">
                <span class="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">{p.paso}</span>
                <p class="text-xs text-muted-foreground">{p.texto}</p>
              </div>
            {/each}
          </div>
        </div>

        <div class="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div class="flex items-center gap-2.5 mb-3">
            <WifiOff class="size-5 shrink-0 text-warning-foreground" />
            <h3 class="text-base font-semibold text-foreground">Si falla la luz o el internet</h3>
          </div>
          <p class="text-sm leading-relaxed text-muted-foreground mb-4">
            Ethoz tiene modo offline. Los datos del día se sincronizan al recuperar conexión. Además, el establecimiento puede imprimir el listado de autorizados por curso como respaldo físico.
          </p>
          <div class="space-y-2">
            {#each [
              { icon: Wifi, texto: 'Modo online — verificación en tiempo real', activo: true },
              { icon: WifiOff, texto: 'Modo offline — datos sincronizados del día anterior', activo: false },
              { icon: AlertTriangle, texto: 'Protocolo papel — listado imprimible disponible', activo: false },
            ] as modo}
              <div class="flex items-center gap-3 rounded-lg {modo.activo ? 'bg-success/5 border border-success/20' : 'bg-background border border-border'} px-3 py-2">
                <modo.icon class="size-3.5 shrink-0 {modo.activo ? 'text-success' : 'text-muted-foreground'}" />
                <p class="text-[10px] {modo.activo ? 'text-foreground font-medium' : 'text-muted-foreground'}">{modo.texto}</p>
              </div>
            {/each}
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
          <p class="text-4xl font-extrabold tracking-tight text-foreground">&lt;3s</p>
          <p class="mt-1 text-sm text-muted-foreground">tiempo promedio de verificación de retiro</p>
        </div>
        <div>
          <p class="text-4xl font-extrabold tracking-tight text-foreground">0</p>
          <p class="mt-1 text-sm text-muted-foreground">llamadas a inspectoría por retiro en colegios con Ethoz</p>
        </div>
        <div>
          <p class="text-4xl font-extrabold tracking-tight text-foreground">15 min</p>
          <p class="mt-1 text-sm text-muted-foreground">para que un portero nuevo opere el sistema solo</p>
        </div>
      </div>
    </div>
  </section>

  <!-- CTA -->
  <section class="py-16 sm:py-20">
    <div class="mx-auto max-w-2xl px-4 text-center sm:px-6">
      <h2 class="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">¿Tu portería necesita esto?</h2>
      <p class="mt-4 text-base leading-relaxed text-muted-foreground">
        Agenda una demo de 20 minutos y muéstrale la pantalla a tu equipo de portería. La decisión la toman ellos.
      </p>
      <div class="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Button size="lg" href="/demo">
          Solicita una demo para tu portería <ArrowRight class="size-4" />
        </Button>
        <Button size="lg" variant="outline" href="/#features">
          Ver todas las funciones
        </Button>
      </div>
    </div>
  </section>

  <Footer />
</main>
