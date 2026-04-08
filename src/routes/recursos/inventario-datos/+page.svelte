<script lang="ts">
  import NavBar from '$lib/components/NavBar.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import { Button } from '$lib/components/ui/button';
  import { Printer, ArrowLeft } from '@lucide/svelte';

  const inventory = [
    {
      category: 'Identificación del alumno',
      sensitivity: 'Básico',
      sensitivityColor: 'green',
      fields: [
        { field: 'Nombre completo', baseLegal: 'Art. 13 b) — Contrato matrícula', finalidad: 'Gestión educativa, comunicaciones', retention: '5 años post egreso' },
        { field: 'RUT', baseLegal: 'Art. 13 b) — Contrato matrícula', finalidad: 'Identificación única, reportes MINEDUC', retention: '5 años post egreso' },
        { field: 'Fecha de nacimiento', baseLegal: 'Art. 13 b) — Contrato matrícula', finalidad: 'Matrícula SAE, estadísticas educativas', retention: '5 años post egreso' },
        { field: 'Fotografía', baseLegal: 'Art. 13 a) — Consentimiento', finalidad: 'Identificación visual, carnet escolar', retention: 'Vigencia matrícula' },
        { field: 'Dirección domicilio', baseLegal: 'Art. 13 b) — Contrato matrícula', finalidad: 'Contacto, verificación zona escolar', retention: '2 años post egreso' },
      ]
    },
    {
      category: 'Datos de apoderados',
      sensitivity: 'Básico',
      sensitivityColor: 'green',
      fields: [
        { field: 'Nombre completo apoderado titular', baseLegal: 'Art. 13 b) — Contrato matrícula', finalidad: 'Contacto principal, autorizaciones', retention: '5 años post egreso' },
        { field: 'RUT apoderado', baseLegal: 'Art. 13 b) — Contrato matrícula', finalidad: 'Identificación, verificación retiros', retention: '5 años post egreso' },
        { field: 'Teléfono de contacto', baseLegal: 'Art. 13 b) — Contrato matrícula', finalidad: 'Comunicaciones urgentes, emergencias', retention: 'Vigencia matrícula' },
        { field: 'Correo electrónico', baseLegal: 'Art. 13 b) — Contrato matrícula', finalidad: 'Comunicaciones académicas, circulares', retention: 'Vigencia matrícula' },
        { field: 'Parentesco con el alumno', baseLegal: 'Art. 13 b) — Contrato matrícula', finalidad: 'Determinar titularidad del consentimiento', retention: '5 años post egreso' },
        { field: 'Personas autorizadas para retiro', baseLegal: 'Art. 13 a) — Consentimiento', finalidad: 'Control de retiros y seguridad', retention: 'Hasta revocación' },
      ]
    },
    {
      category: 'Datos académicos',
      sensitivity: 'Básico',
      sensitivityColor: 'green',
      fields: [
        { field: 'Notas y calificaciones', baseLegal: 'Art. 13 b) / Art. 13 c) — Ley General de Educación', finalidad: 'Evaluación aprendizaje, informes MINEDUC', retention: '5 años post egreso' },
        { field: 'Registro de asistencia', baseLegal: 'Art. 13 c) — Decreto 67 MINEDUC', finalidad: 'Control obligatorio, subvención estatal', retention: '5 años post egreso' },
        { field: 'Observaciones pedagógicas', baseLegal: 'Art. 13 b) / Art. 13 e) — Interés legítimo', finalidad: 'Seguimiento aprendizaje, apoyo docente', retention: '5 años post egreso' },
        { field: 'Informes de evaluación diferenciada (PIE)', baseLegal: 'Art. 13 a) — Consentimiento + Art. 13 c) — DL 170', finalidad: 'Adecuaciones curriculares, apoyos SEP', retention: '10 años post egreso' },
        { field: 'Registro de convivencia escolar', baseLegal: 'Art. 13 c) — Ley 20.536', finalidad: 'Gestión de convivencia, protocolos', retention: '5 años post egreso' },
      ]
    },
    {
      category: 'Datos sensibles (salud, médicos, familiares)',
      sensitivity: 'Sensible',
      sensitivityColor: 'red',
      fields: [
        { field: 'Diagnósticos médicos y condiciones de salud', baseLegal: 'Art. 13 a) — Consentimiento explícito', finalidad: 'Atención primaria, primeros auxilios', retention: '10 años post egreso' },
        { field: 'Alergias y medicamentos', baseLegal: 'Art. 13 a) — Consentimiento explícito', finalidad: 'Prevención riesgos de salud en establecimiento', retention: 'Vigencia matrícula + 5 años' },
        { field: 'Ficha de salud mental (orientación)', baseLegal: 'Art. 13 a) — Consentimiento explícito', finalidad: 'Apoyo psicosocial, alertas de riesgo', retention: '5 años post egreso' },
        { field: 'Situación familiar (vulnerabilidad, SENAME)', baseLegal: 'Art. 13 a) — Consentimiento / Art. 13 c) — Ley 21.430', finalidad: 'Protección de la infancia, redes de apoyo', retention: '5 años post egreso' },
        { field: 'Alertas judiciales y órdenes de alejamiento', baseLegal: 'Art. 13 c) — Orden judicial', finalidad: 'Protección física del alumno, seguridad', retention: 'Mientras esté vigente la orden' },
      ]
    },
    {
      category: 'Datos de navegación y auditoría',
      sensitivity: 'Técnico',
      sensitivityColor: 'blue',
      fields: [
        { field: 'Logs de acceso al sistema', baseLegal: 'Art. 27 — Seguridad técnica', finalidad: 'Trazabilidad, detección de incidentes', retention: '2 años' },
        { field: 'Registros de retiro de alumnos', baseLegal: 'Art. 13 e) — Interés legítimo / Seguridad', finalidad: 'Trazabilidad, verificación en auditorías', retention: '5 años' },
        { field: 'Logs de modificaciones de datos', baseLegal: 'Art. 27 — Seguridad técnica', finalidad: 'Auditoría de cumplimiento, ARCO', retention: '3 años' },
        { field: 'Registros de consentimiento', baseLegal: 'Art. 14 — Documentación', finalidad: 'Prueba del consentimiento otorgado', retention: '5 años post expiración' },
      ]
    }
  ];

  const sensitivityStyle: Record<string, string> = {
    green: 'bg-success/10 text-success',
    red: 'bg-destructive/10 text-destructive',
    blue: 'bg-primary/10 text-primary',
  };
</script>

<svelte:head>
  <title>Inventario de Datos Personales para Colegios — Plantilla gratuita | Ethoz</title>
  <meta name="description" content="Plantilla de inventario de datos personales para establecimientos educacionales chilenos. Bases legales, finalidades y plazos de retención. Descarga gratis." />
  <meta property="og:url" content="https://ethoz.cl/recursos/inventario-datos" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="Inventario de Datos Personales para Colegios | Ethoz" />
  <meta property="og:description" content="Plantilla completa de inventario de datos conforme a la Ley 21.719 para colegios chilenos." />
  <link rel="canonical" href="https://ethoz.cl/recursos/inventario-datos" />
  {@html `<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Dataset",
    "name": "Inventario de Datos Personales para Colegios",
    "description": "Plantilla de inventario de datos personales conforme a la Ley 21.719.",
    "url": "https://ethoz.cl/recursos/inventario-datos",
    "publisher": { "@type": "Organization", "name": "Ethoz", "url": "https://ethoz.cl" }
  })}</script>`}
</svelte:head>

<div class="print:hidden">
  <NavBar />
</div>

<main class="min-h-dvh bg-background">
  <div class="print:hidden sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur-sm">
    <div class="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
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

  <div class="mx-auto max-w-6xl px-4 py-10 sm:py-14">
    <div class="mb-10 border-b border-border pb-8">
      <div class="flex items-center gap-3 mb-3 print:hidden">
        <span class="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">Cumplimiento</span>
        <span class="text-xs text-muted-foreground">5 categorías · 24 campos · Art. 16 Ley 21.719</span>
      </div>
      <h1 class="text-3xl font-bold tracking-tight text-foreground mb-3">Inventario de Datos Personales</h1>
      <p class="text-muted-foreground">Registro estructurado de todas las categorías de datos personales tratados por establecimientos educacionales chilenos, con base legal, finalidad y plazos de retención conformes a la Ley 21.719.</p>
      <p class="mt-3 text-xs text-muted-foreground">Elaborado por Ethoz · ethoz.cl · Versión 1.0 · Complete con [Nombre del Establecimiento] y RBD</p>
    </div>

    <!-- Legend -->
    <div class="mb-8 flex flex-wrap gap-3 text-xs">
      <div class="flex items-center gap-1.5"><span class="inline-block size-3 rounded-sm bg-success/100/20"></span> Datos básicos</div>
      <div class="flex items-center gap-1.5"><span class="inline-block size-3 rounded-sm bg-destructive/100/20"></span> Datos sensibles (requieren consentimiento explícito)</div>
      <div class="flex items-center gap-1.5"><span class="inline-block size-3 rounded-sm bg-primary/100/20"></span> Datos técnicos / auditoría</div>
    </div>

    <!-- Inventory sections -->
    <div class="space-y-10">
      {#each inventory as section}
        <div>
          <div class="mb-3 flex items-center gap-3">
            <h2 class="text-base font-semibold text-foreground">{section.category}</h2>
            <span class="rounded-full px-2.5 py-0.5 text-[11px] font-medium {sensitivityStyle[section.sensitivityColor]}">{section.sensitivity}</span>
          </div>
          <div class="overflow-x-auto rounded-xl border border-border">
            <table class="w-full text-xs">
              <thead>
                <tr class="border-b border-border bg-muted/50">
                  <th class="px-4 py-2.5 text-left font-medium text-foreground min-w-[160px]">Campo</th>
                  <th class="px-4 py-2.5 text-left font-medium text-foreground min-w-[200px]">Base legal</th>
                  <th class="px-4 py-2.5 text-left font-medium text-foreground min-w-[200px]">Finalidad</th>
                  <th class="px-4 py-2.5 text-left font-medium text-foreground min-w-[140px]">Retención</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-border">
                {#each section.fields as row}
                  <tr class="hover:bg-muted/20 transition-colors">
                    <td class="px-4 py-2.5 font-medium text-foreground">{row.field}</td>
                    <td class="px-4 py-2.5 text-muted-foreground">{row.baseLegal}</td>
                    <td class="px-4 py-2.5 text-muted-foreground">{row.finalidad}</td>
                    <td class="px-4 py-2.5 text-muted-foreground">{row.retention}</td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        </div>
      {/each}
    </div>

    <!-- Notes -->
    <div class="mt-10 space-y-4">
      <div class="rounded-lg border border-warning/20 bg-warning/10 p-4 text-sm">
        <p class="font-medium text-warning-foreground mb-1">Datos sensibles — requisitos especiales</p>
        <p class="text-warning-foreground text-xs">Los datos médicos, de salud mental y situación familiar requieren consentimiento explícito, por escrito, con finalidad específica. No pueden usarse para finalidades distintas a las declaradas sin nuevo consentimiento. Deben tener controles de acceso reforzados y logs de auditoría.</p>
      </div>
      <div class="rounded-lg border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
        <p class="font-medium text-foreground mb-1">Nota legal</p>
        <p class="text-xs">Este inventario es una plantilla orientativa. Cada establecimiento debe completarlo con todos sus sistemas reales: ERP escolar (Napsis, Syscol, Lirmi, etc.), plataformas de comunicación, sistemas de CCTV y control de acceso. El inventario debe actualizarse cada vez que se incorpore un nuevo tratamiento de datos.</p>
      </div>
    </div>

    <div class="print:hidden mt-8 text-center">
      <p class="text-sm text-muted-foreground mb-4">Ethoz mantiene este inventario actualizado automáticamente para su establecimiento.</p>
      <Button href="/demo">Solicitar demo gratuita</Button>
    </div>
  </div>
</main>

<div class="print:hidden">
  <Footer />
</div>

<style>
  @media print {
    :global(body) { font-size: 9px; color: #000; background: #fff; }
    main { padding: 0; }
  }
</style>
