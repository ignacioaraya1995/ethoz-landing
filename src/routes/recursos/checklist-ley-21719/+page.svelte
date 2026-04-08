<script lang="ts">
  import NavBar from '$lib/components/NavBar.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import { Button } from '$lib/components/ui/button';
  import { Printer, ArrowLeft } from '@lucide/svelte';

  const sections = [
    {
      title: 'Gobernanza',
      color: 'blue',
      items: [
        {
          title: 'Encargado de Protección de Datos (DPO) designado',
          detail: 'Persona natural o jurídica responsable de velar por el cumplimiento de la ley dentro del establecimiento.',
          article: 'Art. 48 Ley 21.719'
        },
        {
          title: 'Inventario de datos personales actualizado',
          detail: 'Registro de todos los datos tratados, su base legal, finalidad y plazo de retención.',
          article: 'Art. 16 Ley 21.719'
        },
        {
          title: 'Política de privacidad publicada y accesible',
          detail: 'Disponible en el sitio web o en la recepción del establecimiento, redactada en lenguaje claro.',
          article: 'Art. 14 Ley 21.719'
        },
        {
          title: 'Plan de respuesta a brechas de seguridad aprobado',
          detail: 'Procedimiento documentado para detectar, evaluar y notificar incidentes en 72 horas.',
          article: 'Art. 30 Ley 21.719'
        }
      ]
    },
    {
      title: 'Consentimiento',
      color: 'green',
      items: [
        {
          title: 'Consentimiento explícito para datos sensibles',
          detail: 'Datos de salud, biométricos, religiosos o similares requieren consentimiento escrito específico.',
          article: 'Art. 16 Ley 21.719'
        },
        {
          title: 'Consentimiento de menores gestionado a través del apoderado',
          detail: 'Para alumnos menores de 14 años, el titular del consentimiento es el apoderado legal.',
          article: 'Art. 20 Ley 21.719'
        },
        {
          title: 'Mecanismo de renovación de consentimiento implementado',
          detail: 'Proceso definido para renovar consentimientos vencidos o cuando cambia la finalidad del tratamiento.',
          article: 'Art. 13 Ley 21.719'
        },
        {
          title: 'Mecanismo de retiro de consentimiento operativo',
          detail: 'Los titulares pueden retirar su consentimiento en cualquier momento, sin barreras ni penalizaciones.',
          article: 'Art. 13 Ley 21.719'
        },
        {
          title: 'Registros de consentimiento almacenados y auditables',
          detail: 'Se guarda evidencia de cuándo, cómo y para qué se otorgó cada consentimiento.',
          article: 'Art. 14 Ley 21.719'
        }
      ]
    },
    {
      title: 'Seguridad técnica',
      color: 'orange',
      items: [
        {
          title: 'Cifrado de datos en reposo implementado',
          detail: 'Bases de datos y archivos que contienen datos personales están cifrados en los servidores.',
          article: 'Art. 27 Ley 21.719'
        },
        {
          title: 'Cifrado en tránsito (HTTPS/TLS) activo',
          detail: 'Toda transmisión de datos personales se realiza mediante protocolos seguros (TLS 1.2 o superior).',
          article: 'Art. 27 Ley 21.719'
        },
        {
          title: 'Control de acceso por rol configurado',
          detail: 'Cada usuario solo accede a los datos necesarios para su función. Principio de mínimo privilegio.',
          article: 'Art. 27 Ley 21.719'
        },
        {
          title: 'Registros de auditoría (logs) habilitados',
          detail: 'Se registran accesos, modificaciones y eliminaciones de datos personales con marca de tiempo y usuario.',
          article: 'Art. 27 Ley 21.719'
        },
        {
          title: 'Procedimiento de respaldo y recuperación de datos',
          detail: 'Backups regulares, probados periódicamente, con tiempo de recuperación definido (RTO/RPO).',
          article: 'Art. 27 Ley 21.719'
        },
        {
          title: 'Sistema de detección de incidentes activo',
          detail: 'Alertas automáticas o revisión periódica que permita detectar accesos no autorizados o brechas.',
          article: 'Art. 30 Ley 21.719'
        }
      ]
    },
    {
      title: 'Derechos de los titulares',
      color: 'purple',
      items: [
        {
          title: 'Procedimiento de acceso a datos documentado (ARCO)',
          detail: 'Canal habilitado para que titulares soliciten copia de sus datos personales tratados.',
          article: 'Art. 35 Ley 21.719'
        },
        {
          title: 'Procedimiento de rectificación operativo',
          detail: 'Proceso para corregir datos inexactos o desactualizados a solicitud del titular.',
          article: 'Art. 36 Ley 21.719'
        },
        {
          title: 'Procedimiento de cancelación/supresión implementado',
          detail: 'Mecanismo para eliminar datos cuando ya no existe base legal para su tratamiento.',
          article: 'Art. 37 Ley 21.719'
        },
        {
          title: 'Procedimiento de portabilidad disponible',
          detail: 'Capacidad de entregar datos en formato estructurado, legible por máquina, a solicitud del titular.',
          article: 'Art. 38 Ley 21.719'
        },
        {
          title: 'Respuesta a solicitudes dentro del plazo legal',
          detail: 'Las solicitudes de derechos ARCO+P deben responderse dentro de los plazos establecidos por la ley (máx. 30 días hábiles).',
          article: 'Art. 40 Ley 21.719'
        }
      ]
    }
  ];

  const colorMap: Record<string, string> = {
    blue: 'bg-primary/10 text-primary',
    green: 'bg-success/10 text-success',
    orange: 'bg-warning/10 text-warning-foreground',
    purple: 'bg-primary/10 text-primary'
  };
</script>

<svelte:head>
  <title>Checklist Cumplimiento Ley 21.719 — Descarga gratuita | Ethoz</title>
  <meta name="description" content="20 ítems de verificación para saber si tu colegio cumple con la Ley 21.719 de Protección de Datos. Descarga e imprime gratis." />
  <meta property="og:url" content="https://ethoz.cl/recursos/checklist-ley-21719" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="Checklist Cumplimiento Ley 21.719 | Ethoz" />
  <meta property="og:description" content="20 ítems de verificación para cumplir con la Ley 21.719 en colegios chilenos." />
  <link rel="canonical" href="https://ethoz.cl/recursos/checklist-ley-21719" />
  {@html `<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "Checklist de Cumplimiento Ley 21.719",
    "description": "20 ítems para verificar el cumplimiento de la Ley 21.719 en establecimientos educacionales chilenos.",
    "url": "https://ethoz.cl/recursos/checklist-ley-21719",
    "publisher": { "@type": "Organization", "name": "Ethoz", "url": "https://ethoz.cl" }
  })}</script>`}
</svelte:head>

<div class="print:hidden">
  <NavBar />
</div>

<main class="min-h-dvh bg-background">
  <!-- Actions bar (hidden on print) -->
  <div class="print:hidden sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur-sm">
    <div class="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
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

  <div class="mx-auto max-w-4xl px-4 py-10 sm:py-14">
    <!-- Header -->
    <div class="mb-10 border-b border-border pb-8">
      <div class="flex items-center gap-3 mb-3 print:hidden">
        <span class="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">Cumplimiento</span>
        <span class="text-xs text-muted-foreground">Ley 21.719 · 20 ítems · 4 secciones</span>
      </div>
      <h1 class="text-3xl font-bold tracking-tight text-foreground mb-3">Checklist de Cumplimiento Ley 21.719</h1>
      <p class="text-muted-foreground">
        Verifique el estado de cumplimiento de su establecimiento con la Ley de Protección de Datos Personales. Marque cada ítem completado. La ley entra en plena vigencia en <strong>diciembre de 2026</strong>. Las multas llegan hasta las 20.000 UTM.
      </p>
      <p class="mt-3 text-xs text-muted-foreground">Elaborado por el equipo de Ethoz · ethoz.cl · Uso libre para establecimientos educacionales</p>
    </div>

    <!-- Sections -->
    <div class="space-y-10">
      {#each sections as section, si}
        <div>
          <div class="mb-4 flex items-center gap-3">
            <span class="flex size-7 items-center justify-center rounded-full bg-foreground text-background text-xs font-bold">{si + 1}</span>
            <h2 class="text-lg font-semibold text-foreground">{section.title}</h2>
            <span class="ml-auto text-xs text-muted-foreground">{section.items.length} ítems</span>
          </div>

          <div class="space-y-3">
            {#each section.items as item, ii}
              <div class="flex gap-4 rounded-lg border border-border bg-card p-4">
                <!-- Checkbox -->
                <div class="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded border-2 border-border print:border-foreground/40">
                  <span class="hidden print:block text-xs">☐</span>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex flex-wrap items-start gap-2 mb-1">
                    <p class="font-medium text-foreground text-sm leading-snug">{item.title}</p>
                    <span class="shrink-0 rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground font-mono">{item.article}</span>
                  </div>
                  <p class="text-xs text-muted-foreground leading-relaxed">{item.detail}</p>
                </div>
              </div>
            {/each}
          </div>
        </div>
      {/each}
    </div>

    <!-- Footer note -->
    <div class="mt-12 rounded-lg border border-border bg-muted/30 p-5 text-sm text-muted-foreground">
      <p class="font-medium text-foreground mb-1">Nota legal</p>
      <p>Este checklist es una herramienta orientativa elaborada por Ethoz. No constituye asesoría jurídica. Para una evaluación de cumplimiento oficial, consulte a un abogado especializado en protección de datos. Referencias basadas en la Ley 21.719 promulgada el 13 de diciembre de 2024.</p>
    </div>

    <div class="print:hidden mt-6 text-center">
      <p class="text-sm text-muted-foreground mb-4">¿Quieres que Ethoz automatice este cumplimiento?</p>
      <Button href="/demo">Solicitar demo gratuita</Button>
    </div>
  </div>
</main>

<div class="print:hidden">
  <Footer />
</div>

<style>
  @media print {
    :global(body) {
      font-size: 11px;
      color: #000;
      background: #fff;
    }

    main {
      padding: 0;
    }
  }
</style>
