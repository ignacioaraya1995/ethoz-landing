<script lang="ts">
  import NavBar from '$lib/components/NavBar.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import { Button } from '$lib/components/ui/button';
  import { t } from '$lib/i18n/index.svelte';
  import { Users, Shield, MapPin, Search, ClipboardList, Eye, ArrowRight, ShieldAlert, BarChart3, Siren, CalendarCheck } from '@lucide/svelte';
  import { trackEvent } from '$lib/utils/analytics';

  $effect(() => { trackEvent('products_page_viewed'); });

  const products = [
    {
      icon: Users,
      name: 'Perfil Integral del Alumno',
      desc: 'Ficha 360° con historial académico, conductual, de asistencia y alertas médicas. Persiste entre años escolares — elimina el reinicio de marzo.',
      href: '/features/student-profile',
      color: 'bg-primary/10 text-primary',
      highlights: ['Apoderado, RUT, contacto de emergencia', 'Observaciones por nivel de confidencialidad', 'Historial longitudinal año a año', 'Alertas médicas de sí/no (sin diagnósticos)'],
    },
    {
      icon: MapPin,
      name: 'Retiros Escolares Seguros',
      desc: 'Verificación digital de personas autorizadas en portería. Bloqueo inmediato ante restricciones judiciales.',
      href: '/features/safe-pickups',
      color: 'bg-destructive/10 text-destructive',
      highlights: ['Verificación instantánea de identidad', 'Bloqueo automático por orden de alejamiento', 'Registro completo de cada retiro', 'Notificaciones por rol'],
    },
    {
      icon: Shield,
      name: 'Permisos por Cargo',
      desc: 'Cada funcionario ve solo la información que necesita para su función. El portero ve foto y alertas; el director ve indicadores.',
      href: '/features/access-control',
      color: 'bg-warning/15 text-warning-foreground',
      highlights: ['5 roles predefinidos + personalización', 'Pantalla simplificada para portería', 'Filtrado automático por confidencialidad', 'Aislamiento de datos entre sedes'],
    },
    {
      icon: Search,
      name: 'Búsqueda Inteligente',
      desc: 'Encuentra a cualquier alumno en menos de un segundo, aunque escribas mal su nombre. Panel de gestión con alertas visuales.',
      href: '/features/smart-search',
      color: 'bg-primary/10 text-primary',
      highlights: ['Tolerante a errores tipográficos', 'Resultados con indicadores de alerta', 'Filtros por curso, sección y estado', 'Panel de gestión diaria'],
    },
    {
      icon: ClipboardList,
      name: 'Registro de Convivencia',
      desc: 'Seguimiento centralizado de incidentes, intervenciones y protocolos. Historial continuo sin pérdida anual.',
      href: '/features/privacy-compliance',
      color: 'bg-success/10 text-success',
      highlights: ['Registro por alumno, curso y tipo', 'Protocolos diferenciados por severidad', 'Base para Ley Aula Segura', 'Detección de patrones emergentes'],
    },
    {
      icon: Eye,
      name: 'Integración Libro Digital',
      desc: 'Conecta con tu proveedor de libro de clases actual (Napsis, Syscol, SchoolTrack). Si no tienes uno, incluimos un módulo básico conforme a Circular N°30.',
      href: '/compliance',
      color: 'bg-primary/10 text-primary',
      highlights: ['Conforme a Circular N°30', 'Verificación de identidad digital', 'Registro de auditoría completo', 'Integración con Ley 21.719'],
    },
    {
      icon: ShieldAlert,
      name: 'Alertas Críticas',
      desc: 'Órdenes de alejamiento, ideación suicida, riesgo familiar y suspensiones: todas las alertas críticas en un solo sistema con acceso controlado y trazabilidad total.',
      href: '/features/alerts',
      color: 'bg-destructive/10 text-destructive',
      highlights: ['Órdenes judiciales con RIT y tribunal', 'Bloqueo automático en portería', 'Protocolo MINEDUC ideación suicida', 'Auditoría de accesos por rol'],
    },
    {
      icon: BarChart3,
      name: 'Analytics y KPIs',
      desc: 'Dashboard para directivos y sostenedores: indicadores de convivencia, alertas, asistencia y cumplimiento normativo en tiempo real.',
      href: '/features/analytics',
      color: 'bg-primary/10 text-primary',
      highlights: ['KPIs de convivencia y alertas', 'Gráficos por mes y categoría', 'Top alumnos con más observaciones', 'Multi-sede para sostenedores'],
    },
    {
      icon: Siren,
      name: 'Protocolos de Emergencia',
      desc: 'Sismo, incendio, intruso y emergencia médica: activa el protocolo SENAPRED con un toque, guía la evacuación y notifica a los apoderados en segundos.',
      href: '/features/emergency',
      color: 'bg-destructive/10 text-destructive',
      highlights: ['Activación en 1 toque', 'Conteo digital por curso', 'Notificación push a apoderados', 'Registro para Superintendencia'],
    },
    {
      icon: CalendarCheck,
      name: 'Control de Asistencia',
      desc: 'Libro digital conforme a Circular N°30. Registra presencia, atrasos y justificaciones con firma electrónica y alertas automáticas de inasistencia reiterada.',
      href: '/features/attendance',
      color: 'bg-success/10 text-success',
      highlights: ['Circular N°30 MINEDUC', 'Alerta al superar 15% de inasistencias', 'Justificación digital con adjuntos', 'Reportes para subvención'],
    },
  ];
</script>

<svelte:head>
  <title>Productos — Ethoz</title>
  <meta name="description" content="Conoce los módulos de Ethoz: perfil integral, retiros seguros, permisos por cargo, búsqueda inteligente, convivencia y libro de clases digital." />
  <meta property="og:url" content="https://ethoz.cl/productos" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="Productos — Ethoz" />
  <meta property="og:description" content="Conoce todos los módulos de Ethoz: perfil integral, retiros seguros, permisos por cargo, y más." />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Productos — Ethoz" />
  <meta name="twitter:description" content="Conoce todos los módulos de Ethoz: perfil integral, retiros seguros, permisos por cargo, y más." />
  <link rel="canonical" href="https://ethoz.cl/productos" />
  {@html `<script type="application/ld+json">${JSON.stringify({"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Inicio","item":"https://ethoz.cl/"},{"@type":"ListItem","position":2,"name":"Productos"}]})}</script>`}
</svelte:head>

<main class="flex min-h-dvh flex-col bg-background">
  <NavBar />

  <!-- Hero -->
  <section class="pt-28 pb-12 sm:pt-32 sm:pb-16 bg-secondary">
    <div class="mx-auto max-w-3xl px-4 text-center sm:px-6">
      <h1 class="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
        Seis módulos, un solo objetivo
      </h1>
      <p class="mt-4 text-lg leading-relaxed text-muted-foreground">
        Cada módulo resuelve un problema concreto de tu colegio. Activa solo los que necesitas hoy.
      </p>
      <span class="mt-3 inline-flex items-center gap-2 rounded-full bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
        Cumplimiento Ley 21.719 — Plazo: diciembre 2026
      </span>
    </div>
  </section>

  <!-- Products -->
  <section class="py-16 sm:py-20">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="space-y-16 sm:space-y-20">
        {#each products as product, i}
          {@const Icon = product.icon}
          <div class="grid items-start gap-8 lg:grid-cols-[1fr_1.2fr] lg:gap-12 {i % 2 === 1 ? 'lg:[&>*:first-child]:order-2' : ''}">
            <!-- Info -->
            <div>
              <div class="flex items-center gap-2.5">
                <Icon class="size-5 shrink-0 {product.color.split(' ')[1]}" />
                <h2 class="text-xl font-bold tracking-tight text-foreground">{product.name}</h2>
              </div>
              <p class="mt-3 text-sm leading-relaxed text-muted-foreground">{product.desc}</p>
              <ul class="mt-4 space-y-2">
                {#each product.highlights as h}
                  <li class="flex items-start gap-2">
                    <span class="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary"></span>
                    <span class="text-xs text-muted-foreground">{h}</span>
                  </li>
                {/each}
              </ul>
              <Button variant="outline" size="sm" href={product.href} class="mt-5">
                Ver en detalle
                <ArrowRight class="size-3.5" />
              </Button>
            </div>

            <!-- Mockup preview -->
            <a href={product.href} class="group block rounded-xl border border-border bg-card shadow-lg transition-all hover:shadow-xl hover:-translate-y-0.5 min-h-[180px] sm:min-h-[200px]">
              <div class="flex items-center gap-2 border-b border-border px-4 py-2.5">
                <div class="size-2.5 rounded-full bg-destructive/60"></div>
                <div class="size-2.5 rounded-full bg-warning/60"></div>
                <div class="size-2.5 rounded-full bg-success/60"></div>
                <span class="ml-2 text-[11px] font-medium text-muted-foreground">Ethoz — {product.name}</span>
              </div>
              {#if product.name === 'Perfil Integral del Alumno'}
                <div class="p-5">
                  <div class="flex gap-3">
                    <img src="/images/students/girl-12.webp" alt="Perfil de alumna" class="size-12 rounded-full object-cover" />
                    <div>
                      <p class="text-sm font-semibold text-foreground">Valentina Rojas Sepúlveda</p>
                      <p class="text-xs text-muted-foreground">7° Básico B · Apoderado: María Sepúlveda</p>
                    </div>
                  </div>
                  <div class="mt-3 flex gap-1 border-t border-border pt-3">
                    <span class="border-b-2 border-primary px-2.5 py-1.5 text-[10px] font-semibold text-primary">Historial</span>
                    <span class="px-2.5 py-1.5 text-[10px] text-muted-foreground">Retiros</span>
                    <span class="px-2.5 py-1.5 text-[10px] text-muted-foreground">Convivencia</span>
                    <span class="px-2.5 py-1.5 text-[10px] text-muted-foreground">Alertas</span>
                  </div>
                  <div class="mt-3 space-y-1.5 text-[10px] text-muted-foreground">
                    <div class="flex items-center gap-2"><span class="size-1.5 rounded-full bg-primary"></span>Ficha actualizada — datos familiares</div>
                    <div class="flex items-center gap-2"><span class="size-1.5 rounded-full bg-success"></span>Retiro autorizado — Madre · 14:32</div>
                  </div>
                </div>
              {:else if product.name === 'Retiros Escolares Seguros'}
                <div class="p-5">
                  <div class="flex items-center gap-2 rounded-lg bg-success/5 px-3 py-2 mb-3">
                    <div class="size-2 rounded-full bg-success"></div>
                    <span class="text-xs font-semibold text-success">AUTORIZADO</span>
                  </div>
                  <div class="flex items-center gap-3">
                    <img src="/images/people/apoderado-madre.webp" alt="Apoderada" class="size-10 rounded-full object-cover" />
                    <div>
                      <p class="text-xs font-medium text-foreground">María Sepúlveda · Madre</p>
                      <p class="text-[10px] text-muted-foreground">Valentina Rojas · 7° Básico B · 14:32</p>
                    </div>
                  </div>
                  <div class="mt-3 rounded-lg border border-dashed border-destructive/30 bg-destructive/5 px-3 py-2">
                    <p class="text-[10px] font-medium text-destructive">Juan Rojas · Padre — BLOQUEADO</p>
                    <p class="text-[9px] text-muted-foreground">Orden de alejamiento vigente</p>
                  </div>
                </div>
              {:else if product.name === 'Permisos por Cargo'}
                <div class="p-5">
                  <p class="mb-2 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Matriz de acceso</p>
                  <div class="space-y-2">
                    {#each [{name:'Directora',img:'/images/people/director-mujer.webp',dots:[true,true,true,true]},{name:'Docente',img:'/images/people/docente-mujer.webp',dots:[true,false,true,false]},{name:'Portero',img:'/images/people/portero-hombre.webp',dots:[false,true,false,false]}] as role}
                      <div class="flex items-center gap-2">
                        <img src={role.img} alt={role.name} class="size-5 rounded-full object-cover" />
                        <span class="w-16 text-[10px] font-medium text-foreground">{role.name}</span>
                        {#each role.dots as d}
                          <span class="size-2.5 rounded-full {d ? 'bg-success' : 'bg-muted'} mx-auto"></span>
                        {/each}
                      </div>
                    {/each}
                  </div>
                </div>
              {:else if product.name === 'Búsqueda Inteligente'}
                <div class="p-5">
                  <div class="rounded-lg border border-border px-3 py-2 text-xs text-foreground mb-3">val<span class="animate-pulse text-primary">|</span></div>
                  <div class="space-y-1.5">
                    <div class="flex items-center gap-2.5 rounded-lg bg-primary/5 px-3 py-2">
                      <img src="/images/students/girl-12.webp" alt="Perfil de alumna" class="size-7 rounded-full object-cover" />
                      <div>
                        <span class="text-xs text-foreground"><mark class="bg-primary/20 font-semibold">Val</mark>entina Rojas</span>
                        <p class="text-[10px] text-muted-foreground">7° Básico B</p>
                      </div>
                    </div>
                    <div class="flex items-center gap-2.5 rounded-lg px-3 py-2 hover:bg-muted/50">
                      <img src="/images/students/kid-14.webp" alt="Perfil de alumno" class="size-7 rounded-full object-cover" />
                      <div>
                        <span class="text-xs text-foreground"><mark class="bg-primary/20 font-semibold">Val</mark>dés, Tomás</span>
                        <p class="text-[10px] text-muted-foreground">8° Básico A</p>
                      </div>
                    </div>
                  </div>
                </div>
              {:else if product.name === 'Registro de Convivencia'}
                <div class="p-5">
                  <p class="mb-2 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Últimas observaciones</p>
                  <div class="space-y-2.5">
                    <div class="flex items-start gap-2.5 text-xs">
                      <span class="mt-1 size-2 shrink-0 rounded-full bg-warning"></span>
                      <div>
                        <span class="font-medium text-foreground">Incidente leve — 8°A</span>
                        <p class="text-[10px] text-muted-foreground">Hace 2h · Prof. A. Martínez</p>
                      </div>
                    </div>
                    <div class="flex items-start gap-2.5 text-xs">
                      <span class="mt-1 size-2 shrink-0 rounded-full bg-destructive"></span>
                      <div>
                        <span class="font-medium text-foreground">Incidente grave — 7°B</span>
                        <p class="text-[10px] text-muted-foreground">Ayer · Inspector J. Muñoz</p>
                      </div>
                    </div>
                    <div class="flex items-start gap-2.5 text-xs">
                      <span class="mt-1 size-2 shrink-0 rounded-full bg-success"></span>
                      <div>
                        <span class="font-medium text-foreground">Intervención cerrada — 6°A</span>
                        <p class="text-[10px] text-muted-foreground">Hace 3 días · Orientadora</p>
                      </div>
                    </div>
                  </div>
                </div>
              {:else}
                <div class="p-5">
                  <div class="grid grid-cols-2 gap-3">
                    <div class="rounded-lg bg-success/5 px-3 py-3 text-center">
                      <p class="text-lg font-bold text-success">98%</p>
                      <p class="text-[10px] text-muted-foreground">Consentimientos</p>
                    </div>
                    <div class="rounded-lg bg-success/5 px-3 py-3 text-center">
                      <p class="text-lg font-bold text-success">0</p>
                      <p class="text-[10px] text-muted-foreground">Irregularidades</p>
                    </div>
                  </div>
                  <div class="mt-3 rounded-lg bg-primary/5 px-3 py-2 text-center">
                    <p class="text-xs font-medium text-primary">Ley 21.719 — En cumplimiento</p>
                  </div>
                </div>
              {/if}
            </a>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- CTA -->
  <section class="py-16 sm:py-20 bg-secondary">
    <div class="mx-auto max-w-2xl px-4 text-center sm:px-6">
      <h2 class="text-balance text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
        {t('pricing.cta.title')}
      </h2>
      <p class="mt-4 text-base text-muted-foreground">
        {t('pricing.cta.subtitle')}
      </p>
      <div class="mt-8">
        <Button size="xl" href="/demo" class="shadow-lg shadow-primary/25">
          {t('pricing.cta.primary')}
          <ArrowRight class="size-4" />
        </Button>
      </div>
    </div>
  </section>

  <Footer />
</main>
