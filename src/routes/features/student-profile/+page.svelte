<script lang="ts">
  import NavBar from '$lib/components/NavBar.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import { t } from '$lib/i18n/index.svelte';
  import { Button } from '$lib/components/ui/button';
  import {
    ClipboardList, ArrowRight, ArrowLeft, History, Lock, BadgeCheck,
    Eye, UserCheck, AlertTriangle, CalendarDays, HeartPulse, MessageSquare,
    GraduationCap, ChevronRight, FileText, Clock
  } from '@lucide/svelte';
  import { trackEvent } from '$lib/utils/analytics';

  $effect(() => { trackEvent('feature_page_viewed', { feature: 'student-profile' }); });

  let activeTab = $state<'historial' | 'retiros' | 'convivencia' | 'medico'>('historial');
</script>

<svelte:head>
  <title>Ethoz — {t('features.record.title')}</title>
  <meta name="description" content="Un perfil longitudinal que sigue al alumno año a año, con acceso estrictamente controlado por rol." />
  <meta property="og:url" content="https://ethoz.cl/features/student-profile" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="Ethoz — Ficha Integral 360° del Alumno" />
  <meta property="og:description" content="Un perfil longitudinal que sigue al alumno año a año, con acceso estrictamente controlado por rol." />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Ethoz — Ficha Integral 360° del Alumno" />
  <meta name="twitter:description" content="Un perfil longitudinal que sigue al alumno año a año, con acceso estrictamente controlado por rol." />
  <link rel="canonical" href="https://ethoz.cl/features/student-profile" />
  {@html `<script type="application/ld+json">${JSON.stringify({"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Inicio","item":"https://ethoz.cl/"},{"@type":"ListItem","position":2,"name":"Productos","item":"https://ethoz.cl/productos"},{"@type":"ListItem","position":3,"name":"Perfil Integral del Alumno"}]})}</script>`}
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
        <div class="lg:pt-6">
          <div class="flex items-center gap-3">
            <ClipboardList class="size-6 shrink-0 text-primary" />
            <h1 class="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {t('features.record.title')}
            </h1>
          </div>
          <p class="mt-4 text-lg leading-relaxed text-muted-foreground">
            {t('features.record.desc')}
          </p>
          <ul class="mt-6 space-y-3">
            <li class="flex items-start gap-2.5 text-sm text-muted-foreground">
              <BadgeCheck class="mt-0.5 size-4 shrink-0 text-primary" />
              Historial continuo desde Pre-kinder hasta 4° Medio, sin pérdida de datos al cambiar de año
            </li>
            <li class="flex items-start gap-2.5 text-sm text-muted-foreground">
              <BadgeCheck class="mt-0.5 size-4 shrink-0 text-primary" />
              Niveles de confidencialidad por campo — datos médicos invisibles para el portero
            </li>
            <li class="flex items-start gap-2.5 text-sm text-muted-foreground">
              <BadgeCheck class="mt-0.5 size-4 shrink-0 text-primary" />
              Cada acceso queda registrado con usuario, hora y campo consultado
            </li>
          </ul>
        </div>

        <!-- Interactive mockup: Ficha 360° -->
        <div class="w-full rounded-xl border border-border bg-card shadow-2xl">
          <div class="flex items-center gap-2 border-b border-border px-4 py-2.5">
            <div class="size-2.5 rounded-full bg-destructive/60"></div>
            <div class="size-2.5 rounded-full bg-warning/60"></div>
            <div class="size-2.5 rounded-full bg-success/60"></div>
            <span class="ml-2 text-[11px] font-medium text-muted-foreground">Ethoz — Ficha del Alumno</span>
          </div>
          <div class="p-4 sm:p-5">
            <!-- Student header -->
            <div class="flex gap-4">
              <div class="flex flex-col items-center gap-2">
                <img src="/images/students/girl-12.webp" alt="Perfil de alumna en Ethoz" class="size-14 rounded-full object-cover ring-2 ring-primary/20" />
                <span class="inline-flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-medium text-success">Sin alertas</span>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-semibold text-foreground">Valentina Rojas Sepúlveda</p>
                <p class="text-[11px] text-muted-foreground">7° Básico B · RUT 23.456.789-0</p>
                <p class="text-[10px] text-muted-foreground mt-0.5">Colegio San Patricio · Ñuñoa · RBD 9234</p>
                <div class="mt-2 grid grid-cols-2 gap-x-4 gap-y-1">
                  <p class="text-[10px] text-muted-foreground"><span class="font-medium text-foreground">Apoderada:</span> María Sepúlveda</p>
                  <p class="text-[10px] text-muted-foreground"><span class="font-medium text-foreground">Fono:</span> +56 9 8765 4321</p>
                  <p class="text-[10px] text-muted-foreground"><span class="font-medium text-foreground">Ingreso:</span> Marzo 2022</p>
                  <p class="text-[10px] text-muted-foreground"><span class="font-medium text-foreground">PIE:</span> No aplica</p>
                </div>
              </div>
            </div>

            <!-- Tabs (static display, active state driven by JS) -->
            <div class="mt-3 flex gap-0.5 border-b border-border overflow-x-auto">
              {#each [
                { key: 'historial', label: 'Historial' },
                { key: 'retiros', label: 'Retiros' },
                { key: 'convivencia', label: 'Convivencia' },
                { key: 'medico', label: 'Médico' }
              ] as tab}
                <button
                  onclick={() => activeTab = tab.key as typeof activeTab}
                  class="shrink-0 px-2.5 py-1.5 text-[10px] font-medium transition-colors {activeTab === tab.key ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground hover:text-foreground'}"
                >
                  {tab.label}
                </button>
              {/each}
            </div>

            <!-- Tab content -->
            {#if activeTab === 'historial'}
              <div class="mt-2.5 space-y-2">
                <div class="flex items-start gap-2">
                  <div class="mt-0.5 size-4 shrink-0 rounded-full bg-primary/10 flex items-center justify-center">
                    <Eye class="size-2 text-primary" />
                  </div>
                  <div>
                    <p class="text-[10px] font-medium text-foreground">Observación académica positiva — Matemáticas</p>
                    <p class="text-[9px] text-muted-foreground">Prof. González · hace 2 días</p>
                  </div>
                </div>
                <div class="flex items-start gap-2">
                  <div class="mt-0.5 size-4 shrink-0 rounded-full bg-success/10 flex items-center justify-center">
                    <UserCheck class="size-2 text-success" />
                  </div>
                  <div>
                    <p class="text-[10px] font-medium text-foreground">Retiro autorizado — María Sepúlveda (madre)</p>
                    <p class="text-[9px] text-muted-foreground">Portería Central · 15:30 ayer</p>
                  </div>
                </div>
                <div class="flex items-start gap-2">
                  <div class="mt-0.5 size-4 shrink-0 rounded-full bg-warning/10 flex items-center justify-center">
                    <AlertTriangle class="size-2 text-warning-foreground" />
                  </div>
                  <div>
                    <p class="text-[10px] font-medium text-foreground">Atraso registrado (08:15)</p>
                    <p class="text-[9px] text-muted-foreground">Inspector Muñoz · hace 3 días</p>
                  </div>
                </div>
                <div class="flex items-start gap-2">
                  <div class="mt-0.5 size-4 shrink-0 rounded-full bg-primary/10 flex items-center justify-center">
                    <GraduationCap class="size-2 text-primary" />
                  </div>
                  <div>
                    <p class="text-[10px] font-medium text-foreground">Promedio general 6.2 — 1er semestre</p>
                    <p class="text-[9px] text-muted-foreground">UTP Ramírez · hace 1 semana</p>
                  </div>
                </div>
              </div>
            {:else if activeTab === 'retiros'}
              <div class="mt-2.5 space-y-1.5">
                <div class="flex items-center gap-2 rounded-lg bg-success/5 px-2 py-1.5">
                  <UserCheck class="size-3 shrink-0 text-success" />
                  <div class="flex-1 min-w-0">
                    <p class="text-[10px] font-medium text-foreground">María Sepúlveda — madre</p>
                    <p class="text-[9px] text-muted-foreground">Hoy 14:32 · Portería norte</p>
                  </div>
                  <span class="text-[8px] font-semibold text-success">OK</span>
                </div>
                <div class="flex items-center gap-2 rounded-lg px-2 py-1.5">
                  <UserCheck class="size-3 shrink-0 text-success" />
                  <div class="flex-1 min-w-0">
                    <p class="text-[10px] font-medium text-foreground">María Sepúlveda — madre</p>
                    <p class="text-[9px] text-muted-foreground">Ayer 15:30 · Portería norte</p>
                  </div>
                  <span class="text-[8px] font-semibold text-success">OK</span>
                </div>
                <div class="flex items-center gap-2 rounded-lg bg-destructive/5 px-2 py-1.5">
                  <AlertTriangle class="size-3 shrink-0 text-destructive" />
                  <div class="flex-1 min-w-0">
                    <p class="text-[10px] font-medium text-foreground">Juan Rojas — padre</p>
                    <p class="text-[9px] text-muted-foreground">12 mar · Portería principal</p>
                  </div>
                  <span class="text-[8px] font-semibold text-destructive">BLOQ</span>
                </div>
              </div>
            {:else if activeTab === 'convivencia'}
              <div class="mt-2.5 space-y-2">
                <div class="flex items-start gap-2">
                  <div class="mt-0.5 size-4 shrink-0 rounded-full bg-warning/10 flex items-center justify-center">
                    <MessageSquare class="size-2 text-warning-foreground" />
                  </div>
                  <div>
                    <p class="text-[10px] font-medium text-foreground">Mediación entre pares — resuelta</p>
                    <p class="text-[9px] text-muted-foreground">Orient. Lagos · 18 mar 2026 · Confidencial</p>
                  </div>
                </div>
                <div class="flex items-start gap-2">
                  <div class="mt-0.5 size-4 shrink-0 rounded-full bg-primary/10 flex items-center justify-center">
                    <FileText class="size-2 text-primary" />
                  </div>
                  <div>
                    <p class="text-[10px] font-medium text-foreground">Entrevista apoderado — protocolo PIE</p>
                    <p class="text-[9px] text-muted-foreground">Orient. Lagos · 2 mar 2026</p>
                  </div>
                </div>
              </div>
            {:else if activeTab === 'medico'}
              <div class="mt-2.5 space-y-2">
                <div class="flex items-center gap-2 rounded-lg bg-warning/5 border border-warning/20 px-2 py-1.5">
                  <Lock class="size-3 shrink-0 text-warning-foreground" />
                  <p class="text-[10px] text-warning-foreground font-medium">Solo visible para Director y Orientador</p>
                </div>
                <div class="flex items-start gap-2">
                  <div class="mt-0.5 size-4 shrink-0 rounded-full bg-primary/10 flex items-center justify-center">
                    <HeartPulse class="size-2 text-primary" />
                  </div>
                  <div>
                    <p class="text-[10px] font-medium text-foreground">Alergia a penicilina — registrada</p>
                    <p class="text-[9px] text-muted-foreground">Apoderada Sepúlveda · Inicio año 2026</p>
                  </div>
                </div>
                <div class="flex items-start gap-2">
                  <div class="mt-0.5 size-4 shrink-0 rounded-full bg-primary/10 flex items-center justify-center">
                    <HeartPulse class="size-2 text-primary" />
                  </div>
                  <div>
                    <p class="text-[10px] font-medium text-foreground">Sin tratamientos activos</p>
                    <p class="text-[9px] text-muted-foreground">Actualizado marzo 2026</p>
                  </div>
                </div>
              </div>
            {/if}
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Timeline section -->
  <section class="py-16 sm:py-20">
    <div class="mx-auto max-w-4xl px-4 sm:px-6">
      <h2 class="mb-2 text-xl font-bold tracking-tight text-foreground sm:text-2xl">Historial longitudinal año a año</h2>
      <p class="mb-10 text-sm leading-relaxed text-muted-foreground max-w-2xl">
        El expediente de Valentina viaja con ella al cambiar de curso. Nada se pierde, nada se duplica.
      </p>

      <!-- Timeline -->
      <div class="relative pl-6 border-l border-border space-y-8">
        {#each [
          { year: '2026', grade: '7° Básico B', obs: 4, retiros: 12, color: 'bg-primary' },
          { year: '2025', grade: '6° Básico A', obs: 7, retiros: 28, color: 'bg-primary/70' },
          { year: '2024', grade: '5° Básico A', obs: 3, retiros: 31, color: 'bg-primary/50' },
          { year: '2023', grade: '4° Básico B', obs: 5, retiros: 26, color: 'bg-primary/30' },
        ] as item}
          <div class="relative">
            <div class="absolute -left-[25px] top-1 size-3 rounded-full {item.color} border-2 border-background"></div>
            <div class="rounded-xl border border-border bg-card p-4 shadow-sm">
              <div class="flex items-center justify-between gap-4 flex-wrap">
                <div class="flex items-center gap-2.5">
                  <CalendarDays class="size-4 shrink-0 text-primary" />
                  <div>
                    <p class="text-sm font-semibold text-foreground">{item.year} — {item.grade}</p>
                    <p class="text-[11px] text-muted-foreground">Colegio San Patricio · Ñuñoa</p>
                  </div>
                </div>
                <div class="flex items-center gap-4">
                  <div class="text-center">
                    <p class="text-sm font-bold text-foreground">{item.obs}</p>
                    <p class="text-[9px] uppercase tracking-wider text-muted-foreground">Observaciones</p>
                  </div>
                  <div class="text-center">
                    <p class="text-sm font-bold text-foreground">{item.retiros}</p>
                    <p class="text-[9px] uppercase tracking-wider text-muted-foreground">Retiros</p>
                  </div>
                  <ChevronRight class="size-4 text-muted-foreground" />
                </div>
              </div>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- Detail cards -->
  <section class="bg-secondary py-16 sm:py-20">
    <div class="mx-auto max-w-4xl px-4 sm:px-6">
      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

        <div class="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div class="flex items-center gap-2.5">
            <History class="size-5 shrink-0 text-primary" />
            <h2 class="text-base font-semibold text-foreground">Historial longitudinal</h2>
          </div>
          <p class="mt-3 text-sm leading-relaxed text-muted-foreground">
            {t('features.record.bullet1')}
          </p>
        </div>

        <div class="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div class="flex items-center gap-2.5">
            <Lock class="size-5 shrink-0 text-primary" />
            <h2 class="text-base font-semibold text-foreground">Niveles de confidencialidad</h2>
          </div>
          <p class="mt-3 text-sm leading-relaxed text-muted-foreground">
            {t('features.record.bullet2')}
          </p>
        </div>

        <div class="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div class="flex items-center gap-2.5">
            <BadgeCheck class="size-5 shrink-0 text-primary" />
            <h2 class="text-base font-semibold text-foreground">Cumplimiento normativo</h2>
          </div>
          <p class="mt-3 text-sm leading-relaxed text-muted-foreground">
            {t('features.record.bullet3')}
          </p>
        </div>

      </div>
    </div>
  </section>

  <!-- Alert mini list section -->
  <section class="py-16 sm:py-20">
    <div class="mx-auto max-w-4xl px-4 sm:px-6">
      <div class="grid gap-10 lg:grid-cols-2 items-start">
        <div>
          <h2 class="text-xl font-bold tracking-tight text-foreground sm:text-2xl">Alertas priorizadas en la ficha</h2>
          <p class="mt-3 text-sm leading-relaxed text-muted-foreground">
            Las alertas críticas —orden judicial, información médica urgente, restricción de retiro— aparecen de forma prominente al abrir la ficha, sin necesidad de navegar pestañas.
          </p>
          <p class="mt-3 text-sm leading-relaxed text-muted-foreground">
            El docente ve lo mismo que el portero en términos de alertas activas, pero con diferente profundidad de detalle según su rol.
          </p>
        </div>

        <!-- Alert mockup -->
        <div class="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
          <div class="border-b border-border px-4 py-3 flex items-center gap-2">
            <AlertTriangle class="size-4 text-destructive" />
            <span class="text-sm font-semibold text-foreground">Alertas activas — Matías González Pérez</span>
          </div>
          <div class="divide-y divide-border">
            <div class="flex items-start gap-3 px-4 py-3">
              <span class="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-destructive/10">
                <AlertTriangle class="size-3 text-destructive" />
              </span>
              <div class="flex-1">
                <p class="text-sm font-semibold text-destructive">Restricción de retiro — orden judicial</p>
                <p class="mt-0.5 text-xs text-muted-foreground">Padre (Ricardo González) no puede retirar. Vigente desde 14 ene 2026. Ingresada por Inspector Herrera.</p>
              </div>
            </div>
            <div class="flex items-start gap-3 px-4 py-3">
              <span class="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-warning/10">
                <HeartPulse class="size-3 text-warning-foreground" />
              </span>
              <div class="flex-1">
                <p class="text-sm font-semibold text-warning-foreground">Alerta médica — epilepsia controlada</p>
                <p class="mt-0.5 text-xs text-muted-foreground">Medicamento en enfermería. Visible solo para Director y Orientador.</p>
              </div>
            </div>
            <div class="flex items-start gap-3 px-4 py-3">
              <span class="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <Clock class="size-3 text-primary" />
              </span>
              <div class="flex-1">
                <p class="text-sm font-medium text-foreground">3 atrasos este mes</p>
                <p class="mt-0.5 text-xs text-muted-foreground">Umbral del protocolo: 5 atrasos. Inspector notificado automáticamente.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- CTA -->
  <section class="bg-secondary py-16 sm:py-20">
    <div class="mx-auto max-w-2xl px-4 text-center sm:px-6">
      <h2 class="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">¿Listo para empezar?</h2>
      <p class="mt-4 text-base leading-relaxed text-muted-foreground">
        Agenda una demo y ve cómo la Ficha 360° funciona con los datos reales de tu colegio.
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
