<script lang="ts">
  import NavBar from '$lib/components/NavBar.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import { Button } from '$lib/components/ui/button';
  import { Badge } from '$lib/components/ui/badge';
  import { t } from '$lib/i18n/index.svelte';
  import { trackEvent } from '$lib/utils/analytics';
  import { Siren, ArrowRight, ArrowLeft, Flame, Activity, UserX, AlertTriangle, CheckCircle2, Bell, MapPin, Clock } from '@lucide/svelte';

  $effect(() => { trackEvent('feature_page_viewed', { feature: 'emergency' }); });
</script>

<svelte:head>
  <title>Ethoz — Protocolos de Emergencia Escolar</title>
  <meta name="description" content="Gestión digital de emergencias escolares: sismo, incendio, intruso y emergencia médica. Activación con un toque, conteo de alumnos y notificación a apoderados en tiempo real." />
  <meta property="og:url" content="https://ethoz.cl/features/emergency" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="Ethoz — Protocolos de Emergencia Escolar" />
  <meta property="og:description" content="Activa protocolos de emergencia con un toque. Conteo digital, evacuación guiada y notificación a apoderados." />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Ethoz — Protocolos de Emergencia Escolar" />
  <meta name="twitter:description" content="Activa protocolos de emergencia con un toque. Conteo digital, evacuación guiada y notificación a apoderados." />
  <link rel="canonical" href="https://ethoz.cl/features/emergency" />
  {@html `<script type="application/ld+json">${JSON.stringify({"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Inicio","item":"https://ethoz.cl/"},{"@type":"ListItem","position":2,"name":"Productos","item":"https://ethoz.cl/productos"},{"@type":"ListItem","position":3,"name":"Protocolos de Emergencia"}]})}</script>`}
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
            <Siren class="size-6 shrink-0 text-destructive" />
            <h1 class="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Protocolos de Emergencia Digital
            </h1>
          </div>
          <p class="mt-4 text-lg leading-relaxed text-muted-foreground">
            Cuando ocurre una emergencia, cada segundo cuenta. Ethoz digitaliza los protocolos ONEMI/SENAPRED: activa la alerta, guía la evacuación, hace el conteo digital y notifica a los apoderados — todo desde el celular del docente.
          </p>
          <div class="mt-6 flex flex-wrap gap-2">
            <span class="inline-flex items-center gap-1.5 rounded-full bg-destructive/10 px-3 py-1 text-xs font-medium text-destructive">Protocolos ONEMI</span>
            <span class="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">SENAPRED</span>
            <span class="inline-flex items-center gap-1.5 rounded-full bg-warning/15 px-3 py-1 text-xs font-medium text-warning-foreground">Plan de Seguridad Escolar</span>
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

        <!-- Emergency activation mockup -->
        <div class="w-full rounded-xl border border-border bg-card shadow-2xl">
          <div class="flex items-center gap-2 border-b border-border px-4 py-2.5">
            <div class="size-2.5 rounded-full bg-destructive/60"></div>
            <div class="size-2.5 rounded-full bg-warning/60"></div>
            <div class="size-2.5 rounded-full bg-success/60"></div>
            <span class="ml-2 text-[11px] font-medium text-muted-foreground">Ethoz — Emergencias · Colegio Alemán de Concepción</span>
          </div>
          <div class="p-4 sm:p-5">
            <!-- Active emergency banner -->
            <div class="rounded-lg border border-destructive/40 bg-destructive/10 p-3 mb-3">
              <div class="flex items-center gap-2">
                <span class="size-2 rounded-full bg-destructive animate-pulse"></span>
                <span class="text-[11px] font-bold uppercase tracking-wide text-destructive">Emergencia activa — Sismo</span>
                <span class="ml-auto text-[10px] text-muted-foreground">14:23:07</span>
              </div>
              <p class="mt-1 text-[10px] text-muted-foreground">Activado por: Directora C. Muñoz · Fase: Evacuación</p>
            </div>
            <!-- Phase flow -->
            <div class="flex items-center gap-1 mb-3">
              {#each ['Alerta', 'Evacuación', 'Punto Encuentro', 'Conteo', 'Finalizado'] as phase, i}
                <div class="flex items-center gap-1 flex-1">
                  <div class="flex-1 flex flex-col items-center gap-0.5">
                    <span class="size-4 rounded-full flex items-center justify-center text-[8px] font-bold
                      {i === 0 ? 'bg-success text-success-foreground' :
                       i === 1 ? 'bg-destructive text-destructive-foreground animate-pulse' :
                       'bg-muted text-muted-foreground'}">{i + 1}</span>
                    <span class="text-[7px] text-center text-muted-foreground leading-tight">{phase}</span>
                  </div>
                  {#if i < 4}
                    <div class="h-px flex-1 {i < 1 ? 'bg-success' : 'bg-muted'} mb-3"></div>
                  {/if}
                </div>
              {/each}
            </div>
            <!-- Rollcall progress -->
            <div>
              <p class="mb-1.5 text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">Conteo por curso</p>
              <div class="space-y-1.5">
                {#each [
                  { curso: '7°A', total: 32, present: 31, teacher: 'Prof. Soto' },
                  { curso: '7°B', total: 30, present: 30, teacher: 'Prof. García' },
                  { curso: '8°A', total: 28, present: 25, teacher: 'Prof. Martínez' },
                ] as row}
                  <div class="flex items-center gap-2 text-[10px]">
                    <span class="w-7 font-medium text-foreground">{row.curso}</span>
                    <div class="flex-1 rounded-full bg-muted h-1.5">
                      <div class="h-1.5 rounded-full {row.present === row.total ? 'bg-success' : 'bg-warning'}"
                        style="width: {Math.round(row.present/row.total*100)}%"></div>
                    </div>
                    <span class="{row.present === row.total ? 'text-success' : 'text-warning-foreground'} font-semibold">{row.present}/{row.total}</span>
                    <span class="text-muted-foreground">{row.teacher}</span>
                  </div>
                {/each}
              </div>
              <div class="mt-2 rounded-lg bg-warning/10 px-2 py-1.5 text-[10px] text-warning-foreground">
                8°A: 3 alumnos sin confirmar — notificación enviada a apoderados
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Protocol cards -->
  <section class="py-16 sm:py-20">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-2xl text-center">
        <h2 class="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Cuatro protocolos, un solo sistema</h2>
        <p class="mt-3 text-base text-muted-foreground">Adaptados a los planes de seguridad escolar vigentes en Chile.</p>
      </div>
      <div class="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

        <div class="rounded-xl border border-warning/30 bg-card p-5 shadow-sm">
          <div class="flex items-center gap-2.5">
            <AlertTriangle class="size-5 shrink-0 text-warning-foreground" />
            <h3 class="text-base font-semibold text-foreground">Sismo</h3>
          </div>
          <p class="mt-2 text-xs leading-relaxed text-muted-foreground">Protocolo SENAPRED activado en 1 toque. Guía paso a paso para Agacharse-Cubrirse-Sujetarse, luego evacuación por ruta configurada.</p>
          <ul class="mt-3 space-y-1">
            {#each ['Activación inmediata', 'Rutas de evacuación', 'Punto de encuentro', 'Conteo digital'] as f}
              <li class="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                <CheckCircle2 class="size-2.5 shrink-0 text-success" />
                {f}
              </li>
            {/each}
          </ul>
        </div>

        <div class="rounded-xl border border-destructive/20 bg-card p-5 shadow-sm">
          <div class="flex items-center gap-2.5">
            <Flame class="size-5 shrink-0 text-destructive" />
            <h3 class="text-base font-semibold text-foreground">Incendio</h3>
          </div>
          <p class="mt-2 text-xs leading-relaxed text-muted-foreground">Activa la alarma digital, muestra rutas de salida por sector del edificio y coordina el conteo en el punto de encuentro externo.</p>
          <ul class="mt-3 space-y-1">
            {#each ['Mapa de salidas por piso', 'Alarma digital', 'Coordinación Bomberos', 'Registro de tiempos'] as f}
              <li class="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                <CheckCircle2 class="size-2.5 shrink-0 text-success" />
                {f}
              </li>
            {/each}
          </ul>
        </div>

        <div class="rounded-xl border border-destructive/20 bg-card p-5 shadow-sm">
          <div class="flex items-center gap-2.5">
            <UserX class="size-5 shrink-0 text-destructive" />
            <h3 class="text-base font-semibold text-foreground">Intruso</h3>
          </div>
          <p class="mt-2 text-xs leading-relaxed text-muted-foreground">Bloqueo de puertas coordinado, modo silencioso para docentes y notificación directa a Carabineros con ubicación del establecimiento.</p>
          <ul class="mt-3 space-y-1">
            {#each ['Modo silencioso', 'Bloqueo de accesos', 'Alerta a Carabineros', 'Comunicación interna'] as f}
              <li class="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                <CheckCircle2 class="size-2.5 shrink-0 text-success" />
                {f}
              </li>
            {/each}
          </ul>
        </div>

        <div class="rounded-xl border border-primary/20 bg-card p-5 shadow-sm">
          <div class="flex items-center gap-2.5">
            <Activity class="size-5 shrink-0 text-primary" />
            <h3 class="text-base font-semibold text-foreground">Emergencia médica</h3>
          </div>
          <p class="mt-2 text-xs leading-relaxed text-muted-foreground">Accede a las alertas médicas del alumno afectado con un toque. Notificación inmediata a apoderado y SAMU con datos del establecimiento.</p>
          <ul class="mt-3 space-y-1">
            {#each ['Ficha médica del alumno', 'Alerta a apoderado', 'Llamada SAMU asistida', 'Registro del incidente'] as f}
              <li class="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                <CheckCircle2 class="size-2.5 shrink-0 text-success" />
                {f}
              </li>
            {/each}
          </ul>
        </div>

      </div>
    </div>
  </section>

  <!-- Guardian notification mockup -->
  <section class="bg-secondary py-16 sm:py-20">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div>
          <h2 class="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Los apoderados se enteran en segundos</h2>
          <p class="mt-4 text-base leading-relaxed text-muted-foreground">
            En el momento en que se activa una emergencia, todos los apoderados reciben una notificación push con el estado del establecimiento. Al completar el conteo, confirman que su hijo está a salvo.
          </p>
          <ul class="mt-6 space-y-3">
            <li class="flex items-start gap-2.5">
              <Bell class="size-4 shrink-0 text-primary mt-0.5" />
              <span class="text-sm text-muted-foreground">Notificación push inmediata al activar el protocolo</span>
            </li>
            <li class="flex items-start gap-2.5">
              <CheckCircle2 class="size-4 shrink-0 text-success mt-0.5" />
              <span class="text-sm text-muted-foreground">Confirmación de que el alumno está contado y a salvo</span>
            </li>
            <li class="flex items-start gap-2.5">
              <MapPin class="size-4 shrink-0 text-primary mt-0.5" />
              <span class="text-sm text-muted-foreground">Instrucciones sobre dónde retirar al alumno si es necesario</span>
            </li>
            <li class="flex items-start gap-2.5">
              <Clock class="size-4 shrink-0 text-primary mt-0.5" />
              <span class="text-sm text-muted-foreground">Actualizaciones cada 5 minutos hasta el cierre del protocolo</span>
            </li>
          </ul>
        </div>
        <!-- Notification mockup -->
        <div class="mx-auto max-w-xs w-full">
          <div class="rounded-2xl border border-border bg-card shadow-2xl overflow-hidden">
            <!-- Phone top bar -->
            <div class="bg-muted/50 px-4 py-2 flex items-center justify-between">
              <span class="text-[10px] font-medium text-muted-foreground">14:24</span>
              <span class="text-[10px] text-muted-foreground">Ethoz</span>
            </div>
            <!-- Notification cards -->
            <div class="p-3 space-y-2">
              <div class="rounded-xl bg-destructive/10 border border-destructive/20 p-3">
                <div class="flex items-center gap-2 mb-1">
                  <Siren class="size-3.5 shrink-0 text-destructive" />
                  <span class="text-[11px] font-bold text-destructive">Emergencia en el colegio</span>
                </div>
                <p class="text-[10px] text-foreground font-medium">Colegio Alemán de Concepción</p>
                <p class="text-[10px] text-muted-foreground">Protocolo de sismo activado. Su hijo está siendo contabilizado. Le avisaremos en cuanto confirmemos su estado.</p>
                <p class="text-[9px] text-muted-foreground mt-1">Hace 1 min</p>
              </div>
              <div class="rounded-xl bg-success/10 border border-success/20 p-3">
                <div class="flex items-center gap-2 mb-1">
                  <CheckCircle2 class="size-3.5 shrink-0 text-success" />
                  <span class="text-[11px] font-bold text-success">Valentina está a salvo</span>
                </div>
                <p class="text-[10px] text-muted-foreground">Su hija fue contabilizada en el punto de encuentro. El colegio está evaluando si retomar clases. No retire a su hijo aún.</p>
                <p class="text-[9px] text-muted-foreground mt-1">Hace 8 min</p>
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
      <div class="grid gap-4 sm:grid-cols-3">
        <div class="rounded-xl border border-border bg-card p-6 text-center shadow-sm">
          <p class="text-3xl font-bold text-destructive">9.4</p>
          <p class="mt-1 text-sm font-semibold text-foreground">magnitud máxima registrada en Chile</p>
          <p class="mt-2 text-xs text-muted-foreground">Chile es el país con mayor actividad sísmica del mundo. Los colegios deben tener protocolos digitales verificables.</p>
        </div>
        <div class="rounded-xl border border-border bg-card p-6 text-center shadow-sm">
          <p class="text-3xl font-bold text-primary">12.038</p>
          <p class="mt-1 text-sm font-semibold text-foreground">colegios en Chile</p>
          <p class="mt-2 text-xs text-muted-foreground">Menos del 8% cuenta con sistemas digitales para la gestión de emergencias escolares según datos MINEDUC 2025</p>
        </div>
        <div class="rounded-xl border border-border bg-card p-6 text-center shadow-sm">
          <p class="text-3xl font-bold text-warning-foreground">20.000</p>
          <p class="mt-1 text-sm font-semibold text-foreground">UTM de multa máxima</p>
          <p class="mt-2 text-xs text-muted-foreground">Por incumplimiento de protocolos de protección de datos de menores en situaciones de emergencia (Ley 21.719)</p>
        </div>
      </div>
    </div>
  </section>

  <!-- CTA -->
  <section class="bg-secondary py-16 sm:py-20">
    <div class="mx-auto max-w-2xl px-4 text-center sm:px-6">
      <h2 class="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">¿Tu colegio tiene un protocolo de emergencia digital?</h2>
      <p class="mt-4 text-base leading-relaxed text-muted-foreground">
        Agenda una demo y te mostramos cómo activar un simulacro digital con los datos reales de tu establecimiento.
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
