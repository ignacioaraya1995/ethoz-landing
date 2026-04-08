<script lang="ts">
  import NavBar from '$lib/components/NavBar.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import { Button } from '$lib/components/ui/button';
  import {
    ClipboardCheck,
    UserCheck,
    ShieldAlert,
    Users,
    Database,
    FileWarning,
    Download
  } from '@lucide/svelte';

  const resources = [
    {
      icon: ClipboardCheck,
      title: 'Checklist de Cumplimiento Ley 21.719',
      description: '20 ítems en 4 secciones para verificar tu estado de cumplimiento: gobernanza, consentimiento, seguridad técnica y derechos de los titulares.',
      href: '/recursos/checklist-ley-21719',
      tag: 'Cumplimiento'
    },
    {
      icon: UserCheck,
      title: 'Protocolo de Retiros Seguros',
      description: 'Procedimiento completo de 8 pasos para gestionar retiros de alumnos, incluyendo casos especiales y trazabilidad.',
      href: '/recursos/protocolo-retiros',
      tag: 'Operaciones'
    },
    {
      icon: ShieldAlert,
      title: 'Modelo de Aviso de Privacidad Escolar',
      description: 'Plantilla conforme al Art. 14 de la Ley 21.719 lista para adaptar con los datos de tu establecimiento.',
      href: '/recursos/aviso-privacidad',
      tag: 'Legal'
    },
    {
      icon: Users,
      title: 'Guía de Roles y Permisos',
      description: 'Matriz de permisos recomendada para Director, Inspector, UTP, Orientador, Docente, Portero y Auxiliar.',
      href: '/recursos/guia-roles-permisos',
      tag: 'Gobernanza'
    },
    {
      icon: Database,
      title: 'Plantilla de Inventario de Datos Personales',
      description: 'Inventario estructurado de todas las categorías de datos tratados por el colegio, con base legal y plazos de retención.',
      href: '/recursos/inventario-datos',
      tag: 'Cumplimiento'
    },
    {
      icon: FileWarning,
      title: 'Plan de Respuesta a Brechas de Datos',
      description: 'Plantilla completa con equipo de respuesta, clasificación de brechas y procedimiento de notificación en 72 horas (Art. 30).',
      href: '/recursos/plan-brechas',
      tag: 'Incidentes'
    }
  ];
</script>

<svelte:head>
  <title>Recursos gratuitos — Ley 21.719 para colegios | Ethoz</title>
  <meta name="description" content="Descarga plantillas, checklists y guías gratuitas para cumplir con la Ley 21.719 de Protección de Datos Personales en tu colegio." />
  <meta property="og:url" content="https://ethoz.cl/recursos" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="Recursos gratuitos — Ley 21.719 para colegios | Ethoz" />
  <meta property="og:description" content="Descarga plantillas, checklists y guías gratuitas para cumplir con la Ley 21.719 de Protección de Datos Personales en tu colegio." />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Recursos gratuitos Ley 21.719 | Ethoz" />
  <meta name="twitter:description" content="Plantillas y checklists gratuitos para protección de datos en colegios chilenos." />
  <link rel="canonical" href="https://ethoz.cl/recursos" />
  {@html `<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Recursos gratuitos Ley 21.719",
    "description": "Plantillas, checklists y guías para cumplir con la Ley 21.719 en colegios chilenos.",
    "url": "https://ethoz.cl/recursos",
    "publisher": { "@type": "Organization", "name": "Ethoz", "url": "https://ethoz.cl" }
  })}</script>`}
</svelte:head>

<main class="flex min-h-dvh flex-col bg-background">
  <NavBar />

  <!-- Hero -->
  <section class="mx-auto max-w-7xl px-4 pt-28 pb-12 sm:pt-36 sm:pb-16 text-center">
    <div class="inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-4 py-1.5 text-xs font-medium text-muted-foreground mb-6">
      <Download class="size-3.5" />
      Descarga gratuita — sin registro
    </div>
    <h1 class="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
      Recursos gratuitos para cumplir<br class="hidden sm:block" /> con la Ley 21.719
    </h1>
    <p class="mt-5 max-w-2xl mx-auto text-lg text-muted-foreground">
      Plantillas, checklists y guías prácticas desarrolladas por el equipo de Ethoz para ayudar a los colegios chilenos a proteger los datos de sus estudiantes antes de diciembre de 2026.
    </p>
  </section>

  <!-- Resources grid -->
  <section class="mx-auto max-w-7xl px-4 pb-20 sm:pb-28">
    <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {#each resources as resource}
        <div class="flex flex-col rounded-xl border border-border bg-card p-6 transition-shadow hover:shadow-md">
          <div class="mb-4 flex items-center gap-3">
            <resource.icon class="size-5 text-primary shrink-0" />
            <span class="rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-medium text-primary">{resource.tag}</span>
          </div>
          <h2 class="text-base font-semibold text-foreground leading-snug mb-2">{resource.title}</h2>
          <p class="text-sm text-muted-foreground leading-relaxed flex-1 mb-5">{resource.description}</p>
          <Button href={resource.href} variant="outline" class="w-full gap-2">
            <Download class="size-4" />
            Descargar gratis
          </Button>
        </div>
      {/each}
    </div>

    <!-- CTA bottom -->
    <div class="mt-16 rounded-xl border border-border bg-muted/30 p-8 text-center">
      <h3 class="text-xl font-semibold text-foreground mb-2">¿Quieres que Ethoz gestione esto por ti?</h3>
      <p class="text-muted-foreground mb-6 max-w-lg mx-auto text-sm">
        Nuestra plataforma automatiza el cumplimiento, los retiros seguros y la gestión de accesos para toda tu red de colegios.
      </p>
      <div class="flex flex-col sm:flex-row gap-3 justify-center">
        <Button href="/demo" class="gap-2">Solicitar demo</Button>
        <Button href="/webinar" variant="outline" class="gap-2">Webinar gratuito</Button>
      </div>
    </div>
  </section>

  <Footer />
</main>
