<script lang="ts">
  import NavBar from '$lib/components/NavBar.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import { Button } from '$lib/components/ui/button';
  import { Printer, ArrowLeft } from '@lucide/svelte';

  const roles = [
    {
      role: 'Director(a)',
      description: 'Acceso completo al sistema excepto datos médicos sensibles clasificados como confidenciales por el orientador.',
      perms: {
        'Datos identificación': true,
        'Datos apoderados': true,
        'Notas y asistencia': true,
        'Obs. convivencia': true,
        'Obs. pedagógicas': true,
        'Obs. emocionales': false,
        'Datos médicos sens.': false,
        'Alertas judiciales': true,
        'Registros de retiro': true,
        'Logs de auditoría': true,
      },
      recommendations: 'Debe tener acceso de emergencia a todos los datos vía autenticación de doble factor. Los datos médicos sensibles requieren solicitud formal al orientador.'
    },
    {
      role: 'Inspector General',
      description: 'Gestiona convivencia escolar, asistencia, retiros y observaciones. No accede a datos académicos detallados ni médicos.',
      perms: {
        'Datos identificación': true,
        'Datos apoderados': true,
        'Notas y asistencia': true,
        'Obs. convivencia': true,
        'Obs. pedagógicas': false,
        'Obs. emocionales': false,
        'Datos médicos sens.': false,
        'Alertas judiciales': true,
        'Registros de retiro': true,
        'Logs de auditoría': false,
      },
      recommendations: 'Rol crítico para el protocolo de retiros. Debe tener acceso móvil con autenticación para validar retiros en terreno.'
    },
    {
      role: 'UTP',
      description: 'Accede a datos académicos, pedagógicos y de rendimiento. No accede a datos de convivencia ni médicos.',
      perms: {
        'Datos identificación': true,
        'Datos apoderados': false,
        'Notas y asistencia': true,
        'Obs. convivencia': false,
        'Obs. pedagógicas': true,
        'Obs. emocionales': false,
        'Datos médicos sens.': false,
        'Alertas judiciales': false,
        'Registros de retiro': false,
        'Logs de auditoría': false,
      },
      recommendations: 'Solo accede a datos de su área. Las observaciones pedagógicas deben ser visibles para todos los docentes del alumno.'
    },
    {
      role: 'Orientador(a)',
      description: 'Accede a observaciones emocionales y alertas de riesgo. Custodia datos sensibles de salud mental y situación familiar.',
      perms: {
        'Datos identificación': true,
        'Datos apoderados': true,
        'Notas y asistencia': true,
        'Obs. convivencia': true,
        'Obs. pedagógicas': true,
        'Obs. emocionales': true,
        'Datos médicos sens.': true,
        'Alertas judiciales': true,
        'Registros de retiro': false,
        'Logs de auditoría': false,
      },
      recommendations: 'Las observaciones emocionales son confidenciales. Solo el director puede solicitar acceso de emergencia. Requiere consentimiento explícito del apoderado para datos sensibles de salud mental.'
    },
    {
      role: 'Docente',
      description: 'Accede solo a los alumnos de sus cursos asignados. Puede registrar observaciones pedagógicas y asistencia.',
      perms: {
        'Datos identificación': true,
        'Datos apoderados': false,
        'Notas y asistencia': true,
        'Obs. convivencia': false,
        'Obs. pedagógicas': true,
        'Obs. emocionales': false,
        'Datos médicos sens.': false,
        'Alertas judiciales': false,
        'Registros de retiro': false,
        'Logs de auditoría': false,
      },
      recommendations: 'El acceso está segmentado por curso. Un docente no puede ver datos de alumnos de cursos que no le corresponden. Principio de mínimo privilegio.'
    },
    {
      role: 'Portero / Guardia',
      description: 'Acceso mínimo: búsqueda rápida por nombre/RUT, verificación de apoderados autorizados, alertas críticas de seguridad.',
      perms: {
        'Datos identificación': true,
        'Datos apoderados': true,
        'Notas y asistencia': false,
        'Obs. convivencia': false,
        'Obs. pedagógicas': false,
        'Obs. emocionales': false,
        'Datos médicos sens.': false,
        'Alertas judiciales': true,
        'Registros de retiro': true,
        'Logs de auditoría': false,
      },
      recommendations: 'Rol crítico para seguridad física. Solo ve alertas activas (ej: "persona no autorizada para retirar") sin acceder al detalle. Interfaz simplificada, preferentemente en dispositivo fijo.'
    },
    {
      role: 'Auxiliar',
      description: 'Acceso de lectura muy limitado. Solo puede ver el nombre y foto de alumnos para reconocimiento básico.',
      perms: {
        'Datos identificación': true,
        'Datos apoderados': false,
        'Notas y asistencia': false,
        'Obs. convivencia': false,
        'Obs. pedagógicas': false,
        'Obs. emocionales': false,
        'Datos médicos sens.': false,
        'Alertas judiciales': false,
        'Registros de retiro': false,
        'Logs de auditoría': false,
      },
      recommendations: 'Acceso de solo lectura para reconocimiento básico. No puede realizar acciones sobre datos. Ideal para un módulo visual simplificado.'
    }
  ];

  const permKeys = Object.keys(roles[0].perms);
</script>

<svelte:head>
  <title>Guía de Roles y Permisos para Colegios — Descarga gratuita | Ethoz</title>
  <meta name="description" content="Matriz de permisos recomendada para establecimientos educacionales chilenos. Director, Inspector, UTP, Orientador, Docente, Portero. Descarga gratis." />
  <meta property="og:url" content="https://ethoz.cl/recursos/guia-roles-permisos" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="Guía de Roles y Permisos para Colegios | Ethoz" />
  <meta property="og:description" content="Matriz de acceso a datos por rol para colegios chilenos conforme a la Ley 21.719." />
  <link rel="canonical" href="https://ethoz.cl/recursos/guia-roles-permisos" />
  {@html `<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "Guía de Roles y Permisos para Colegios",
    "description": "Matriz de permisos recomendada para establecimientos educacionales chilenos conforme a la Ley 21.719.",
    "url": "https://ethoz.cl/recursos/guia-roles-permisos",
    "publisher": { "@type": "Organization", "name": "Ethoz", "url": "https://ethoz.cl" }
  })}</script>`}
</svelte:head>

<div class="print:hidden">
  <NavBar />
</div>

<main class="min-h-dvh bg-background">
  <div class="print:hidden sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur-sm">
    <div class="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
      <Button href="/recursos" variant="ghost" size="sm" class="gap-2 text-muted-foreground">
        <ArrowLeft class="size-4" />
        Volver a recursos
      </Button>
      <Button onclick={() => window.print()} class="gap-2">
        <Printer class="size-4" />
        Descargar como PDF
      </Button>
    </div>
  </div>

  <div class="mx-auto max-w-5xl px-4 py-10 sm:py-14">
    <div class="mb-10 border-b border-border pb-8">
      <div class="flex items-center gap-3 mb-3 print:hidden">
        <span class="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">Gobernanza</span>
        <span class="text-xs text-muted-foreground">7 roles · Matriz de permisos · Ley 21.719</span>
      </div>
      <h1 class="text-3xl font-bold tracking-tight text-foreground mb-3">Guía de Roles y Permisos para Colegios</h1>
      <p class="text-muted-foreground">Matriz de acceso a datos personales recomendada para establecimientos educacionales chilenos. Basada en el principio de mínimo privilegio exigido por la Ley 21.719.</p>
      <p class="mt-3 text-xs text-muted-foreground">Elaborado por Ethoz · ethoz.cl · Adaptable según el sistema de gestión escolar utilizado</p>
    </div>

    <!-- Principles -->
    <div class="mb-8 rounded-lg border border-border bg-muted/30 p-5">
      <h2 class="font-semibold text-foreground mb-3 text-sm">Principios base (Ley 21.719)</h2>
      <div class="grid gap-2 sm:grid-cols-3 text-xs text-muted-foreground">
        <div><strong class="text-foreground">Mínimo privilegio:</strong> cada usuario accede solo a los datos necesarios para su función.</div>
        <div><strong class="text-foreground">Proporcionalidad:</strong> el nivel de acceso es proporcional a la responsabilidad del cargo.</div>
        <div><strong class="text-foreground">Trazabilidad:</strong> todo acceso a datos sensibles debe quedar registrado en logs de auditoría.</div>
      </div>
    </div>

    <!-- Matrix table -->
    <div class="mb-10">
      <h2 class="font-semibold text-foreground mb-4">Matriz de Permisos</h2>
      <div class="overflow-x-auto rounded-xl border border-border">
        <table class="w-full text-xs">
          <thead>
            <tr class="border-b border-border bg-muted/50">
              <th class="px-3 py-3 text-left font-semibold text-foreground min-w-[120px]">Rol</th>
              {#each permKeys as key}
                <th class="px-2 py-3 text-center font-medium text-muted-foreground whitespace-nowrap">{key}</th>
              {/each}
            </tr>
          </thead>
          <tbody class="divide-y divide-border">
            {#each roles as r}
              <tr class="hover:bg-muted/20 transition-colors">
                <td class="px-3 py-3 font-medium text-foreground">{r.role}</td>
                {#each permKeys as key}
                  <td class="px-2 py-3 text-center">
                    {#if r.perms[key as keyof typeof r.perms]}
                      <span class="inline-flex size-5 items-center justify-center rounded-full bg-green-500/15 text-green-600 dark:text-green-400 font-bold text-[11px]">✓</span>
                    {:else}
                      <span class="inline-flex size-5 items-center justify-center rounded-full bg-muted text-muted-foreground text-[11px]">—</span>
                    {/if}
                  </td>
                {/each}
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
      <p class="mt-2 text-xs text-muted-foreground">✓ = acceso habilitado &nbsp;·&nbsp; — = sin acceso</p>
    </div>

    <!-- Role detail cards -->
    <div class="space-y-6">
      <h2 class="font-semibold text-foreground">Detalle por Rol y Recomendaciones</h2>
      {#each roles as r}
        <div class="rounded-xl border border-border bg-card p-5">
          <div class="flex items-start justify-between gap-4 mb-2">
            <h3 class="font-semibold text-foreground">{r.role}</h3>
            <span class="shrink-0 text-xs text-muted-foreground">{Object.values(r.perms).filter(Boolean).length}/{permKeys.length} permisos</span>
          </div>
          <p class="text-sm text-muted-foreground mb-3">{r.description}</p>
          <div class="rounded-lg bg-muted/30 px-4 py-3 text-xs text-muted-foreground">
            <span class="font-medium text-foreground">Recomendación: </span>{r.recommendations}
          </div>
        </div>
      {/each}
    </div>

    <!-- Implementation note -->
    <div class="mt-10 rounded-lg border border-border bg-muted/30 p-5 text-sm text-muted-foreground">
      <p class="font-medium text-foreground mb-1">Nota de implementación</p>
      <p>Esta matriz es una recomendación basada en las mejores prácticas para colegios chilenos. Cada establecimiento debe adaptar los permisos según su estructura organizacional, sistema de gestión escolar utilizado y evaluación de riesgos específica. La configuración final debe ser aprobada por el Director y el DPO del establecimiento.</p>
    </div>

    <div class="print:hidden mt-8 text-center">
      <p class="text-sm text-muted-foreground mb-4">Ethoz implementa esta matriz de permisos automáticamente en su plataforma.</p>
      <Button href="/demo">Solicitar demo gratuita</Button>
    </div>
  </div>
</main>

<div class="print:hidden">
  <Footer />
</div>

<style>
  @media print {
    :global(body) { font-size: 10px; color: #000; background: #fff; }
    main { padding: 0; }
  }
</style>
