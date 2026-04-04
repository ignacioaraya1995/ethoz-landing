<script lang="ts">
  import NavBar from '$lib/components/NavBar.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import { Button } from '$lib/components/ui/button';
  import { t } from '$lib/i18n/index.svelte';
  import { Users, Shield, MapPin, Search, ClipboardList, Eye, ArrowRight } from '@lucide/svelte';
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
      name: 'Libro de Clases Digital',
      desc: 'Conforme a Circular N°30: integridad de datos, trazabilidad y verificación. Registro de asistencia y calificaciones con auditoría completa.',
      href: '/compliance',
      color: 'bg-primary/10 text-primary',
      highlights: ['Conforme a Circular N°30', 'Verificación de identidad digital', 'Registro de auditoría completo', 'Integración con Ley 21.719'],
    },
  ];
</script>

<svelte:head>
  <title>Productos — Ethoz</title>
  <meta name="description" content="Conoce los módulos de Ethoz: perfil integral, retiros seguros, permisos por cargo, búsqueda inteligente, convivencia y libro de clases digital." />
  <link rel="canonical" href="https://ethoz.cl/productos" />
</svelte:head>

<main class="min-h-dvh bg-background">
  <NavBar />

  <!-- Hero -->
  <section class="pt-28 pb-12 sm:pt-32 sm:pb-16 bg-secondary">
    <div class="mx-auto max-w-3xl px-4 text-center sm:px-6">
      <h1 class="text-balance text-4xl font-extrabold tracking-tighter text-foreground sm:text-5xl">
        Seis módulos, un solo objetivo
      </h1>
      <p class="mt-4 text-lg leading-relaxed text-muted-foreground">
        Cada módulo resuelve un problema concreto de tu colegio. Activa solo los que necesitas hoy.
      </p>
    </div>
  </section>

  <!-- Products -->
  <section class="py-16 sm:py-20">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="space-y-12">
        {#each products as product, i}
          {@const Icon = product.icon}
          <div class="grid items-start gap-8 lg:grid-cols-[1fr_1.2fr] lg:gap-12 {i % 2 === 1 ? 'lg:[&>*:first-child]:order-2' : ''}">
            <!-- Info -->
            <div>
              <div class="flex items-center gap-3">
                <div class="flex size-10 shrink-0 items-center justify-center rounded-lg {product.color}">
                  <Icon class="size-5" />
                </div>
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
            <a href={product.href} class="group block rounded-xl border border-border bg-card shadow-lg transition-all hover:shadow-xl hover:-translate-y-0.5">
              <div class="flex items-center gap-2 border-b border-border px-4 py-2.5">
                <div class="size-2.5 rounded-full bg-destructive/60"></div>
                <div class="size-2.5 rounded-full bg-warning/60"></div>
                <div class="size-2.5 rounded-full bg-success/60"></div>
                <span class="ml-2 text-[11px] font-medium text-muted-foreground">Ethoz — {product.name}</span>
              </div>
              {#if product.name === 'Perfil Integral del Alumno'}
                <div class="p-4">
                  <div class="flex gap-3">
                    <img src="/images/students/girl-12.webp" alt="" class="size-10 rounded-full object-cover" />
                    <div>
                      <p class="text-xs font-semibold text-foreground">Valentina Rojas Sepúlveda</p>
                      <p class="text-[10px] text-muted-foreground">7° Básico B · Apoderado: María Sepúlveda</p>
                    </div>
                  </div>
                  <div class="mt-2 flex gap-1 border-t border-border pt-2">
                    <span class="border-b-2 border-primary px-2 py-1 text-[9px] font-semibold text-primary">Historial</span>
                    <span class="px-2 py-1 text-[9px] text-muted-foreground">Retiros</span>
                    <span class="px-2 py-1 text-[9px] text-muted-foreground">Convivencia</span>
                  </div>
                </div>
              {:else if product.name === 'Retiros Escolares Seguros'}
                <div class="p-4">
                  <div class="flex items-center gap-2 rounded bg-success/5 px-2 py-1.5 mb-2">
                    <div class="size-1.5 rounded-full bg-success"></div>
                    <span class="text-[10px] font-semibold text-success">AUTORIZADO</span>
                  </div>
                  <div class="flex items-center gap-2.5">
                    <img src="/images/people/apoderado-madre.webp" alt="" class="size-8 rounded-full object-cover" />
                    <div>
                      <p class="text-[11px] font-medium text-foreground">María Sepúlveda · Madre</p>
                      <p class="text-[9px] text-muted-foreground">Valentina Rojas · 7° Básico B · 14:32</p>
                    </div>
                  </div>
                </div>
              {:else if product.name === 'Permisos por Cargo'}
                <div class="p-4">
                  <div class="space-y-1.5">
                    {#each [{name:'Directora',img:'/images/people/director-mujer.webp',dots:[true,true,true,true]},{name:'Docente',img:'/images/people/docente-mujer.webp',dots:[true,false,true,false]},{name:'Portero',img:'/images/people/portero-hombre.webp',dots:[false,true,false,false]}] as role}
                      <div class="flex items-center gap-2">
                        <img src={role.img} alt="" class="size-5 rounded-full object-cover" />
                        <span class="w-16 text-[10px] font-medium text-foreground">{role.name}</span>
                        {#each role.dots as d}
                          <span class="size-2.5 rounded-full {d ? 'bg-success' : 'bg-muted'} mx-auto"></span>
                        {/each}
                      </div>
                    {/each}
                  </div>
                </div>
              {:else if product.name === 'Búsqueda Inteligente'}
                <div class="p-4">
                  <div class="rounded border border-border px-2.5 py-1.5 text-[10px] text-foreground mb-2">val<span class="animate-pulse text-primary">|</span></div>
                  <div class="flex items-center gap-2 rounded bg-primary/5 px-2 py-1.5">
                    <img src="/images/students/girl-12.webp" alt="" class="size-6 rounded-full object-cover" />
                    <span class="text-[10px] text-foreground"><mark class="bg-primary/20 font-semibold">Val</mark>entina Rojas · 7°B</span>
                  </div>
                </div>
              {:else if product.name === 'Registro de Convivencia'}
                <div class="p-4">
                  <div class="space-y-1.5">
                    <div class="flex items-center gap-2 text-[10px]">
                      <span class="size-1.5 rounded-full bg-warning"></span>
                      <span class="text-muted-foreground">Incidente leve — 8°A · hace 2h</span>
                    </div>
                    <div class="flex items-center gap-2 text-[10px]">
                      <span class="size-1.5 rounded-full bg-destructive"></span>
                      <span class="text-muted-foreground">Incidente grave — 7°B · ayer</span>
                    </div>
                    <div class="flex items-center gap-2 text-[10px]">
                      <span class="size-1.5 rounded-full bg-success"></span>
                      <span class="text-muted-foreground">Intervención cerrada — 6°A · hace 3 días</span>
                    </div>
                  </div>
                </div>
              {:else}
                <div class="p-4">
                  <div class="grid grid-cols-2 gap-2">
                    <div class="rounded bg-success/5 px-2 py-1.5 text-center">
                      <p class="text-sm font-bold text-success">98%</p>
                      <p class="text-[8px] text-muted-foreground">Consentimientos</p>
                    </div>
                    <div class="rounded bg-success/5 px-2 py-1.5 text-center">
                      <p class="text-sm font-bold text-success">0</p>
                      <p class="text-[8px] text-muted-foreground">Irregularidades</p>
                    </div>
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
