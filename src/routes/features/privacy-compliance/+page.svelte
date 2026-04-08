<script lang="ts">
  import NavBar from '$lib/components/NavBar.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import { t } from '$lib/i18n/index.svelte';
  import { Button } from '$lib/components/ui/button';
  import {
    Shield, ArrowRight, ArrowLeft, Building2, KeyRound, Users,
    BadgeCheck, CheckCircle, AlertTriangle, Clock, FileText, Lock,
    Eye, Download, Trash2, RefreshCw
  } from '@lucide/svelte';
  import { trackEvent } from '$lib/utils/analytics';

  $effect(() => { trackEvent('feature_page_viewed', { feature: 'privacy-compliance' }); });

  const auditLog = [
    { user: 'Prof. González', action: 'Accedió a perfil de Valentina Rojas', time: 'hace 12 min', icon: Eye, color: 'text-muted-foreground' },
    { user: 'Inspector Muñoz', action: 'Registró retiro de Valentina Rojas', time: 'hace 1h', icon: CheckCircle, color: 'text-success' },
    { user: 'Orient. Lagos', action: 'Creó observación privada — Matías González', time: 'hace 3h', icon: FileText, color: 'text-primary' },
    { user: 'Directora Herrera', action: 'Exportó informe semestral', time: 'hace 5h', icon: Download, color: 'text-primary' },
    { user: 'Sistema', action: 'Backup cifrado completado', time: 'hace 6h', icon: Lock, color: 'text-success' },
  ];

  const dataInventory = [
    { category: 'Datos de identificación', items: 'Nombre, RUT, fecha de nacimiento', law: 'Art. 4', sensitivity: 'Básico' },
    { category: 'Datos de contacto familiar', items: 'Teléfonos, domicilio, correo apoderado', law: 'Art. 4', sensitivity: 'Básico' },
    { category: 'Datos médicos y de salud', items: 'Alergias, tratamientos, diagnósticos PIE', law: 'Art. 16', sensitivity: 'Sensible' },
    { category: 'Datos judiciales y cautelares', items: 'Órdenes de alejamiento, restricciones', law: 'Art. 16', sensitivity: 'Sensible' },
    { category: 'Registros de asistencia', items: 'Atrasos, inasistencias, justificaciones', law: 'Art. 4', sensitivity: 'Básico' },
    { category: 'Observaciones de convivencia', items: 'Incidentes, mediaciones, entrevistas', law: 'Art. 16', sensitivity: 'Confidencial' },
  ];
</script>

<svelte:head>
  <title>Ethoz — {t('features.privacy.title')}</title>
  <meta name="description" content="Construida para la Ley 21.719 desde el primer día — no como un parche posterior." />
  <meta property="og:url" content="https://ethoz.cl/features/privacy-compliance" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="Ethoz — Arquitectura de Privacidad y Cumplimiento" />
  <meta property="og:description" content="Construida para la Ley 21.719 desde el primer día — no como un parche posterior." />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Ethoz — Arquitectura de Privacidad y Cumplimiento" />
  <meta name="twitter:description" content="Construida para la Ley 21.719 desde el primer día — no como un parche posterior." />
  <link rel="canonical" href="https://ethoz.cl/features/privacy-compliance" />
  {@html `<script type="application/ld+json">${JSON.stringify({"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Inicio","item":"https://ethoz.cl/"},{"@type":"ListItem","position":2,"name":"Productos","item":"https://ethoz.cl/productos"},{"@type":"ListItem","position":3,"name":"Privacidad y Cumplimiento"}]})}</script>`}
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
        <div class="lg:pt-4">
          <div class="flex items-center gap-3">
            <Shield class="size-6 shrink-0 text-primary" />
            <h1 class="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {t('features.privacy.title')}
            </h1>
          </div>
          <p class="mt-4 text-lg leading-relaxed text-muted-foreground">
            {t('features.privacy.desc')}
          </p>
          <!-- Urgency callout -->
          <div class="mt-5 rounded-xl border border-warning/30 bg-warning/5 p-4">
            <div class="flex items-start gap-2.5">
              <AlertTriangle class="mt-0.5 size-4 shrink-0 text-warning-foreground" />
              <div>
                <p class="text-sm font-semibold text-foreground">Ley 21.719 — vigencia plena en diciembre 2026</p>
                <p class="mt-1 text-xs leading-relaxed text-muted-foreground">Las multas alcanzan hasta 20.000 UTM (~$1.300M CLP) o el 4% de los ingresos anuales. Los establecimientos que aún gestionan datos en papel o Excel no cumplen.</p>
              </div>
            </div>
          </div>
          <ul class="mt-5 space-y-3">
            <li class="flex items-start gap-2.5 text-sm text-muted-foreground">
              <BadgeCheck class="mt-0.5 size-4 shrink-0 text-primary" />
              Consentimientos parentales digitales con registro inmutable por cada titular
            </li>
            <li class="flex items-start gap-2.5 text-sm text-muted-foreground">
              <BadgeCheck class="mt-0.5 size-4 shrink-0 text-primary" />
              Derechos ARCO+P (Acceso, Rectificación, Cancelación, Oposición, Portabilidad) integrados al flujo
            </li>
            <li class="flex items-start gap-2.5 text-sm text-muted-foreground">
              <BadgeCheck class="mt-0.5 size-4 shrink-0 text-primary" />
              Inventario de datos categorizados por sensibilidad con base legal explícita
            </li>
          </ul>
        </div>

        <!-- Compliance dashboard mockup -->
        <div class="w-full rounded-xl border border-border bg-card shadow-2xl">
          <div class="flex items-center gap-2 border-b border-border px-4 py-2.5">
            <div class="size-2.5 rounded-full bg-destructive/60"></div>
            <div class="size-2.5 rounded-full bg-warning/60"></div>
            <div class="size-2.5 rounded-full bg-success/60"></div>
            <span class="ml-2 text-[11px] font-medium text-muted-foreground">Ethoz — Panel de Cumplimiento Ley 21.719</span>
          </div>
          <div class="p-4 sm:p-5">
            <!-- KPI row -->
            <div class="grid grid-cols-3 gap-2 mb-4">
              <div class="rounded-lg bg-success/5 border border-success/20 px-2.5 py-2.5 text-center">
                <p class="text-xl font-bold text-success">98%</p>
                <p class="text-[9px] text-muted-foreground leading-tight mt-0.5">Consentimientos firmados</p>
              </div>
              <div class="rounded-lg bg-success/5 border border-success/20 px-2.5 py-2.5 text-center">
                <p class="text-xl font-bold text-success">0</p>
                <p class="text-[9px] text-muted-foreground leading-tight mt-0.5">Accesos irregulares</p>
              </div>
              <div class="rounded-lg bg-warning/5 border border-warning/20 px-2.5 py-2.5 text-center">
                <p class="text-xl font-bold text-warning-foreground">1</p>
                <p class="text-[9px] text-muted-foreground leading-tight mt-0.5">ARCO+P pendiente</p>
              </div>
            </div>

            <!-- Consent pending -->
            <div class="rounded-lg border border-warning/20 bg-warning/5 px-3 py-2 mb-3 flex items-center gap-2">
              <AlertTriangle class="size-3.5 shrink-0 text-warning-foreground" />
              <div class="flex-1 min-w-0">
                <p class="text-[10px] font-semibold text-warning-foreground">3 apoderados sin consentimiento firmado</p>
                <p class="text-[9px] text-muted-foreground">Recordatorio automático enviado. Plazo: 7 días.</p>
              </div>
            </div>

            <!-- Audit log -->
            <p class="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Registro de auditoría reciente</p>
            <div class="space-y-1.5">
              {#each auditLog.slice(0, 3) as entry}
                <div class="flex items-center gap-2 text-[10px]">
                  <div class="size-5 rounded-full bg-muted flex items-center justify-center shrink-0">
                    <entry.icon class="size-2.5 {entry.color}" />
                  </div>
                  <span class="flex-1 text-muted-foreground truncate">{entry.user} — {entry.action}</span>
                  <span class="text-[9px] text-muted-foreground shrink-0">{entry.time}</span>
                </div>
              {/each}
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Data inventory section -->
  <section class="py-16 sm:py-20">
    <div class="mx-auto max-w-4xl px-4 sm:px-6">
      <h2 class="mb-2 text-xl font-bold tracking-tight text-foreground sm:text-2xl">Inventario de datos categorizados</h2>
      <p class="mb-8 text-sm leading-relaxed text-muted-foreground max-w-2xl">
        Ethoz genera automáticamente el inventario de datos personales que la Ley 21.719 exige documentar. Cada categoría tiene su base legal y nivel de sensibilidad asignado.
      </p>
      <div class="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-border bg-muted/30">
                <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Categoría</th>
                <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden sm:table-cell">Datos incluidos</th>
                <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Base legal</th>
                <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Nivel</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-border">
              {#each dataInventory as row}
                <tr class="hover:bg-muted/20 transition-colors">
                  <td class="px-4 py-3 text-sm font-medium text-foreground whitespace-nowrap">{row.category}</td>
                  <td class="px-4 py-3 text-xs text-muted-foreground hidden sm:table-cell">{row.items}</td>
                  <td class="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">{row.law}</td>
                  <td class="px-4 py-3">
                    <span class="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold {
                      row.sensitivity === 'Sensible' ? 'bg-destructive/10 text-destructive' :
                      row.sensitivity === 'Confidencial' ? 'bg-warning/10 text-warning-foreground' :
                      'bg-muted text-muted-foreground'
                    }">
                      {row.sensitivity}
                    </span>
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
        <div class="border-t border-border px-4 py-2.5 bg-muted/20">
          <p class="text-[10px] text-muted-foreground">Inventario generado automáticamente · Colegio San Patricio · RBD 9234 · Actualizado 7 abr 2026</p>
        </div>
      </div>
    </div>
  </section>

  <!-- ARCO+P rights section -->
  <section class="bg-secondary py-16 sm:py-20">
    <div class="mx-auto max-w-4xl px-4 sm:px-6">
      <h2 class="mb-2 text-xl font-bold tracking-tight text-foreground sm:text-2xl">Derechos ARCO+P integrados</h2>
      <p class="mb-8 text-sm leading-relaxed text-muted-foreground max-w-2xl">
        Cuando un apoderado solicita ejercer sus derechos, Ethoz genera el flujo de atención, registra cada paso y asegura que la respuesta se entregue dentro del plazo legal de 15 días hábiles.
      </p>
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {#each [
          { letter: 'A', right: 'Acceso', desc: 'El apoderado solicita ver todos los datos almacenados de su hijo.' },
          { letter: 'R', right: 'Rectificación', desc: 'Corrección de datos inexactos o desactualizados.' },
          { letter: 'C', right: 'Cancelación', desc: 'Eliminación de datos cuando cesa la finalidad educativa.' },
          { letter: 'O', right: 'Oposición', desc: 'Rechazo al tratamiento de datos en casos específicos.' },
          { letter: 'P', right: 'Portabilidad', desc: 'Entrega de datos en formato estructurado para cambio de colegio.' },
        ] as item}
          <div class="rounded-xl border border-border bg-card p-4 shadow-sm text-center">
            <span class="inline-flex size-9 items-center justify-center rounded-full bg-primary/10 text-base font-bold text-primary mb-2">{item.letter}</span>
            <p class="text-sm font-semibold text-foreground mb-1">{item.right}</p>
            <p class="text-[11px] leading-relaxed text-muted-foreground">{item.desc}</p>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- Detail cards -->
  <section class="py-16 sm:py-20">
    <div class="mx-auto max-w-4xl px-4 sm:px-6">
      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

        <div class="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div class="flex items-center gap-2.5">
            <Building2 class="size-5 shrink-0 text-success" />
            <h2 class="text-base font-semibold text-foreground">Aislamiento total entre instituciones</h2>
          </div>
          <p class="mt-3 text-sm leading-relaxed text-muted-foreground">
            {t('features.privacy.bullet1')}
          </p>
        </div>

        <div class="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div class="flex items-center gap-2.5">
            <KeyRound class="size-5 shrink-0 text-success" />
            <h2 class="text-base font-semibold text-foreground">Cifrado y trazabilidad de accesos</h2>
          </div>
          <p class="mt-3 text-sm leading-relaxed text-muted-foreground">
            {t('features.privacy.bullet2')}
          </p>
        </div>

        <div class="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div class="flex items-center gap-2.5">
            <Users class="size-5 shrink-0 text-success" />
            <h2 class="text-base font-semibold text-foreground">Gestión de consentimientos parentales</h2>
          </div>
          <p class="mt-3 text-sm leading-relaxed text-muted-foreground">
            {t('features.privacy.bullet3')}
          </p>
        </div>

      </div>
    </div>
  </section>

  <!-- CTA -->
  <section class="bg-secondary py-16 sm:py-20">
    <div class="mx-auto max-w-2xl px-4 text-center sm:px-6">
      <h2 class="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">¿Listo para empezar?</h2>
      <p class="mt-4 text-base leading-relaxed text-muted-foreground">
        Agenda una demo y ve cómo Ethoz te pone en cumplimiento con la Ley 21.719 desde el día uno.
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
