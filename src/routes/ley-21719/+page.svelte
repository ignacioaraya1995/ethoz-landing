<script lang="ts">
  import NavBar from '$lib/components/NavBar.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import { Button } from '$lib/components/ui/button';
  import { Badge } from '$lib/components/ui/badge';
  import { trackEvent } from '$lib/utils/analytics';
  import {
    ShieldCheck,
    AlertTriangle,
    CheckCircle,
    ArrowRight,
    Scale,
    Lock,
    Database,
    FileText,
    Clock,
    Users,
    Eye,
    Pencil,
    Trash2,
    Ban,
    Package,
  } from '@lucide/svelte';

  $effect(() => {
    trackEvent('seo_page_viewed', { slug: 'ley-21719' });
  });

  const checklist = [
    'Designar un Delegado de Protección de Datos (DPO)',
    'Elaborar inventario de datos personales tratados',
    'Revisar y actualizar formularios de consentimiento',
    'Implementar consentimiento parental para datos de menores',
    'Establecer procedimiento para solicitudes ARCO+P',
    'Definir plazos de respuesta (30 días hábiles)',
    'Crear protocolo de notificación de brechas (72 horas)',
    'Realizar Evaluación de Impacto en Protección de Datos (DPIA)',
    'Revisar contratos con proveedores (encargados de tratamiento)',
    'Implementar cifrado at-rest y en tránsito',
    'Configurar controles de acceso por rol (principio de mínimo privilegio)',
    'Activar audit log para acciones sobre datos sensibles',
    'Capacitar a docentes y administrativos en protección de datos',
    'Publicar política de privacidad actualizada en sitio web',
    'Revisar cumplimiento de sistemas legados (ERP, plataformas externas)',
  ];

  const sanctions = [
    {
      level: 'Leve',
      examples: 'Incumplimiento de formalidades, falta de registro',
      fine: 'hasta 100 UTM',
      approx: '≈ $6,7M CLP',
      color: 'border-warning/20/40 bg-warning/10',
      badge: 'bg-warning/10 text-warning-foreground',
    },
    {
      level: 'Grave',
      examples: 'Tratamiento sin base de legitimación, incumplimiento de derechos ARCO+P',
      fine: 'hasta 1.000 UTM',
      approx: '≈ $67M CLP',
      color: 'border-warning/40 bg-warning/10',
      badge: 'bg-warning/10 text-warning-foreground',
    },
    {
      level: 'Gravísima',
      examples: 'Datos sensibles sin consentimiento, transferencia internacional ilícita, reincidencia',
      fine: 'hasta 10.000 UTM o 4% facturación anual',
      approx: '≈ $670M–$1.340M CLP',
      color: 'border-destructive/20/40 bg-destructive/10',
      badge: 'bg-destructive/10 text-destructive',
    },
  ];

  const rights = [
    {
      letter: 'A',
      name: 'Acceso',
      icon: Eye,
      desc: 'El titular puede solicitar qué datos suyos trata el colegio, con qué finalidad y a quién se han comunicado.',
    },
    {
      letter: 'R',
      name: 'Rectificación',
      icon: Pencil,
      desc: 'El titular puede exigir corrección de datos inexactos o incompletos.',
    },
    {
      letter: 'C',
      name: 'Cancelación',
      icon: Trash2,
      desc: 'El titular puede solicitar la supresión de sus datos cuando ya no sean necesarios para la finalidad para la que fueron recogidos.',
    },
    {
      letter: 'O',
      name: 'Oposición',
      icon: Ban,
      desc: 'El titular puede oponerse al tratamiento de sus datos cuando exista causa legítima, en particular para marketing o perfilamiento.',
    },
    {
      letter: '+P',
      name: 'Portabilidad',
      icon: Package,
      desc: 'El titular puede recibir sus datos en formato estructurado, de uso común y lectura mecánica, y transferirlos a otro responsable.',
    },
  ];

  const timeline = [
    { date: '13 dic 2024', event: 'Promulgación de la Ley 21.719', highlight: false },
    { date: 'Dic 2025', event: 'Período de adecuación para responsables de tratamiento', highlight: false },
    { date: 'Jun 2026', event: 'Plazo recomendado para completar adecuaciones internas', highlight: true },
    { date: 'Dic 2026', event: 'Vigencia plena — enforcement completo por el Consejo para la Transparencia', highlight: true },
  ];
</script>

<svelte:head>
  <title>Ley 21.719: Guía completa para colegios — qué es, multas y cómo cumplir | Ethoz</title>
  <meta name="description" content="Ley 21.719 colegios Chile: qué exige, multas hasta 20.000 UTM, derechos ARCO+P, plazos dic 2026. Guía práctica para sostenedores y directivos." />
  <meta property="og:title" content="Ley 21.719: Guía completa para colegios — Ethoz" />
  <meta property="og:description" content="Ley 21.719 colegios Chile: qué exige, multas hasta 20.000 UTM, derechos ARCO+P, plazos dic 2026. Guía práctica para sostenedores y directivos." />
  <meta property="og:type" content="article" />
  <meta property="og:url" content="https://ethoz.cl/ley-21719" />
  <meta property="og:image" content="https://ethoz.cl/images/og-ley-21719.webp" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Ley 21.719: Guía completa para colegios — Ethoz" />
  <meta name="twitter:description" content="Guía práctica Ley 21.719 para colegios chilenos. Multas, plazos, derechos ARCO+P y checklist de cumplimiento." />
  <link rel="canonical" href="https://ethoz.cl/ley-21719" />
  {@html `<script type="application/ld+json">${JSON.stringify([
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "Ley 21.719: Guía completa para colegios — qué es, multas y cómo cumplir",
      "description": "Ley 21.719 colegios Chile: qué exige, multas hasta 20.000 UTM, derechos ARCO+P, plazos dic 2026. Guía práctica para sostenedores y directivos.",
      "datePublished": "2026-04-07",
      "dateModified": "2026-04-07",
      "author": { "@type": "Organization", "name": "Ethoz" },
      "publisher": { "@type": "Organization", "name": "Ethoz", "logo": { "@type": "ImageObject", "url": "https://ethoz.cl/favicon.svg" }},
      "url": "https://ethoz.cl/ley-21719",
      "mainEntityOfPage": "https://ethoz.cl/ley-21719",
      "about": { "@type": "Thing", "name": "Ley 21.719 Protección de Datos Personales Chile" },
      "keywords": "ley 21719, proteccion datos personales chile, multa ley 21719, colegios ley datos, ARCO derechos datos chile"
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Inicio", "item": "https://ethoz.cl/" },
        { "@type": "ListItem", "position": 2, "name": "Ley 21.719", "item": "https://ethoz.cl/ley-21719" }
      ]
    }
  ])}</script>`}
</svelte:head>

<main class="min-h-screen bg-background">
  <NavBar />

  <!-- ══════════════════════════════════════
       HERO
       ══════════════════════════════════════ -->
  <section class="pt-24 pb-16 sm:pt-32 sm:pb-20 bg-secondary">
    <div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
      <div class="flex items-center gap-2 mb-4">
        <Badge variant="secondary" class="text-xs font-semibold uppercase tracking-wide">Guía normativa</Badge>
        <Badge variant="outline" class="text-xs">Actualizado abril 2026</Badge>
      </div>
      <h1 class="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
        Ley 21.719: qué es, a quién afecta y cómo cumplir antes de diciembre 2026
      </h1>
      <p class="mt-6 text-xl text-muted-foreground leading-relaxed max-w-3xl">
        La nueva ley de protección de datos personales de Chile entra en vigor plena en diciembre de 2026. Para los colegios, las obligaciones son concretas: consentimiento, inventario de datos, DPO y capacidad de responder solicitudes ARCO+P. Las multas llegan hasta 20.000 UTM (~$1.340M CLP).
      </p>
      <div class="mt-8 flex flex-wrap gap-6 text-sm">
        <div class="flex items-center gap-2 text-muted-foreground">
          <Clock class="size-4 shrink-0 text-primary" />
          <span>12 min de lectura</span>
        </div>
        <div class="flex items-center gap-2 text-muted-foreground">
          <Scale class="size-4 shrink-0 text-primary" />
          <span>Promulgada 13 dic 2024</span>
        </div>
        <div class="flex items-center gap-2 text-muted-foreground">
          <AlertTriangle class="size-4 shrink-0 text-primary" />
          <span>Enforcement: dic 2026</span>
        </div>
      </div>
    </div>
  </section>

  <!-- ══════════════════════════════════════
       TABLE OF CONTENTS
       ══════════════════════════════════════ -->
  <section class="py-10 border-b border-border bg-background">
    <div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
      <p class="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">Contenido</p>
      <nav class="grid gap-2 sm:grid-cols-2">
        {#each [
          ['#que-es', '1. ¿Qué es la Ley 21.719?'],
          ['#a-quien-aplica', '2. ¿A quién aplica?'],
          ['#principios', '3. Principios clave'],
          ['#derechos-arco', '4. Derechos ARCO+P'],
          ['#obligaciones', '5. Obligaciones para colegios'],
          ['#multas', '6. Multas y sanciones'],
          ['#plazos', '7. Plazos críticos'],
          ['#checklist', '8. Checklist de cumplimiento'],
          ['#como-ayuda-ethoz', '9. ¿Cómo Ethoz ayuda?'],
        ] as [href, label]}
          <a
            {href}
            class="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
          >
            <ArrowRight class="size-3.5 shrink-0 text-primary" />
            {label}
          </a>
        {/each}
      </nav>
    </div>
  </section>

  <div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16 space-y-20">

    <!-- ══════════════════════════════════════
         SECCIÓN 1: QUÉ ES
         ══════════════════════════════════════ -->
    <section id="que-es">
      <div class="flex items-center gap-3 mb-6">
        <FileText class="size-6 shrink-0 text-primary" />
        <h2 class="text-2xl font-bold text-foreground">¿Qué es la Ley 21.719?</h2>
      </div>
      <div class="prose-like space-y-4 text-muted-foreground leading-relaxed">
        <p>
          La <strong class="text-foreground">Ley 21.719</strong>, publicada en el Diario Oficial el 13 de diciembre de 2024, es la nueva ley de protección de datos personales de Chile. Reemplaza y moderniza la Ley 19.628 de 1999, adaptando el marco legal chileno a estándares internacionales contemporáneos, en línea con el GDPR europeo.
        </p>
        <p>
          Su objetivo central es establecer las condiciones bajo las cuales organizaciones públicas y privadas pueden tratar datos personales: cuándo está permitido, qué derechos tienen los titulares, qué obligaciones tienen los responsables del tratamiento y qué consecuencias tiene el incumplimiento.
        </p>
        <p>
          Para los colegios chilenos —tanto los sostenedores como los establecimientos—, la ley es especialmente relevante porque procesan grandes volúmenes de datos personales de menores de edad, que son considerados <strong class="text-foreground">datos sensibles</strong> bajo la legislación chilena.
        </p>
        <div class="rounded-xl border border-primary/20 bg-primary/5 p-5">
          <p class="text-sm font-semibold text-foreground mb-2">Fecha clave</p>
          <p class="text-sm">
            La ley fue <strong>promulgada el 13 de diciembre de 2024</strong>. El período de adecuación vence en <strong>diciembre de 2026</strong>, fecha a partir de la cual el Consejo para la Transparencia tendrá plena facultad fiscalizadora y sancionatoria.
          </p>
        </div>
      </div>
    </section>

    <!-- ══════════════════════════════════════
         SECCIÓN 2: A QUIÉN APLICA
         ══════════════════════════════════════ -->
    <section id="a-quien-aplica">
      <div class="flex items-center gap-3 mb-6">
        <Users class="size-6 shrink-0 text-primary" />
        <h2 class="text-2xl font-bold text-foreground">¿A quién aplica?</h2>
      </div>
      <p class="text-muted-foreground leading-relaxed mb-6">
        La Ley 21.719 aplica a toda persona natural o jurídica que trate datos personales, sin importar si es pública o privada, ni el tamaño de la organización. En el contexto escolar chileno, esto abarca:
      </p>
      <div class="grid gap-4 sm:grid-cols-2">
        {#each [
          { title: 'Sostenedores', desc: 'Personas jurídicas (municipios, corporaciones, fundaciones, empresas) que administran uno o más establecimientos. Son los responsables principales del tratamiento.', icon: Database },
          { title: 'Establecimientos particulares pagados', desc: 'Operan de forma independiente. El director o gerencia general asume la responsabilidad del tratamiento de datos.', icon: ShieldCheck },
          { title: 'Colegios subvencionados', desc: 'Incluyendo particulares subvencionados y de administración delegada. La ley no hace distinción por tipo de financiamiento.', icon: Scale },
          { title: 'Establecimientos municipales', desc: 'Gestionados por municipios o corporaciones municipales. También están obligados, aunque aplican reglas adicionales del sector público.', icon: FileText },
        ] as item}
          <div class="rounded-xl border border-border bg-card p-5">
            <div class="flex items-center gap-2.5 mb-3">
              <item.icon class="size-5 shrink-0 text-primary" />
              <h3 class="font-semibold text-foreground">{item.title}</h3>
            </div>
            <p class="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
          </div>
        {/each}
      </div>
      <p class="mt-6 text-muted-foreground leading-relaxed">
        La ley también aplica a los <strong class="text-foreground">encargados del tratamiento</strong>: los proveedores tecnológicos (plataformas de gestión escolar, sistemas de comunicaciones, apps educativas) que procesan datos por cuenta del colegio. El sostenedor es responsable de que sus proveedores cumplan las mismas obligaciones mediante contratos de encargo de tratamiento.
      </p>
    </section>

    <!-- ══════════════════════════════════════
         SECCIÓN 3: PRINCIPIOS
         ══════════════════════════════════════ -->
    <section id="principios">
      <div class="flex items-center gap-3 mb-6">
        <Scale class="size-6 shrink-0 text-primary" />
        <h2 class="text-2xl font-bold text-foreground">Principios clave</h2>
      </div>
      <p class="text-muted-foreground leading-relaxed mb-6">
        La ley organiza el tratamiento de datos en torno a seis principios que deben guiar todas las decisiones del colegio sobre gestión de información personal:
      </p>
      <div class="space-y-3">
        {#each [
          { name: 'Licitud', desc: 'Todo tratamiento debe tener una base de legitimación: consentimiento del titular, obligación legal, interés vital, contrato, interés público o interés legítimo. Sin base, el tratamiento es ilícito.' },
          { name: 'Calidad', desc: 'Los datos deben ser exactos, completos y actualizados. El colegio no puede mantener registros desactualizados ni datos que excedan la finalidad original.' },
          { name: 'Proporcionalidad', desc: 'Solo se pueden recoger y tratar los datos estrictamente necesarios para la finalidad declarada. Recopilar más datos de los necesarios viola este principio.' },
          { name: 'Finalidad', desc: 'Los datos solo pueden usarse para la finalidad que justificó su recolección. Usar datos de matrícula para marketing sin consentimiento adicional es ilícito.' },
          { name: 'Seguridad', desc: 'El responsable debe implementar medidas técnicas y organizativas para proteger los datos contra acceso no autorizado, pérdida o destrucción.' },
          { name: 'Confidencialidad', desc: 'Las personas que tratan datos en el colegio tienen deber de confidencialidad, incluso después de terminada su relación laboral.' },
        ] as item}
          <div class="rounded-xl border border-border bg-card p-5">
            <div class="flex gap-3">
              <CheckCircle class="size-5 shrink-0 text-primary mt-0.5" />
              <div>
                <p class="font-semibold text-foreground mb-1">{item.name}</p>
                <p class="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            </div>
          </div>
        {/each}
      </div>
    </section>

    <!-- ══════════════════════════════════════
         SECCIÓN 4: DERECHOS ARCO+P
         ══════════════════════════════════════ -->
    <section id="derechos-arco">
      <div class="flex items-center gap-3 mb-6">
        <Eye class="size-6 shrink-0 text-primary" />
        <h2 class="text-2xl font-bold text-foreground">Derechos ARCO+P</h2>
      </div>
      <p class="text-muted-foreground leading-relaxed mb-6">
        Los titulares de datos —apoderados, estudiantes mayores de edad, docentes y administrativos— tienen derechos exigibles ante el colegio. Las solicitudes deben responderse dentro de <strong class="text-foreground">30 días hábiles</strong>. El incumplimiento es una infracción grave.
      </p>
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {#each rights as right}
          <div class="rounded-xl border border-border bg-card p-5">
            <div class="flex items-center gap-3 mb-3">
              <span class="flex size-9 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">{right.letter}</span>
              <div class="flex items-center gap-2">
                <right.icon class="size-4 shrink-0 text-primary" />
                <h3 class="font-semibold text-foreground">{right.name}</h3>
              </div>
            </div>
            <p class="text-sm text-muted-foreground leading-relaxed">{right.desc}</p>
          </div>
        {/each}
      </div>
      <div class="mt-6 rounded-xl border border-border bg-card p-5">
        <p class="text-sm font-semibold text-foreground mb-2">Consideración especial: menores de edad</p>
        <p class="text-sm text-muted-foreground leading-relaxed">
          Para datos de menores de 14 años, los derechos ARCO+P son ejercidos por los padres o tutores legales. Entre 14 y 18 años, el menor puede ejercerlos directamente en ciertos contextos. El colegio debe tener protocolos claros para cada escenario.
        </p>
      </div>
    </section>

    <!-- ══════════════════════════════════════
         SECCIÓN 5: OBLIGACIONES
         ══════════════════════════════════════ -->
    <section id="obligaciones">
      <div class="flex items-center gap-3 mb-6">
        <CheckCircle class="size-6 shrink-0 text-primary" />
        <h2 class="text-2xl font-bold text-foreground">Obligaciones concretas para colegios</h2>
      </div>
      <p class="text-muted-foreground leading-relaxed mb-6">
        Las obligaciones de la Ley 21.719 no son abstractas. Para un establecimiento educacional, se traducen en acciones específicas que deben estar implementadas antes de diciembre de 2026:
      </p>
      <div class="space-y-4">
        {#each [
          {
            title: 'Consentimiento informado',
            body: 'Cada tratamiento que no tenga otra base de legitimación requiere consentimiento explícito, libre, específico e informado. Los formularios de matrícula deben desglosar claramente para qué se usarán los datos del estudiante y su familia.',
          },
          {
            title: 'Inventario de datos',
            body: 'El colegio debe mantener un registro interno de todas las actividades de tratamiento: qué datos recoge, con qué finalidad, quién tiene acceso, por cuánto tiempo se conservan y con qué medidas de seguridad están protegidos.',
          },
          {
            title: 'Designación de DPO',
            body: 'Los responsables de tratamiento de gran volumen o datos sensibles deben designar un Delegado de Protección de Datos (DPO). Para la mayoría de los sostenedores con múltiples establecimientos, este cargo es obligatorio.',
          },
          {
            title: 'Notificación de brechas',
            body: 'Ante una brecha de seguridad (acceso no autorizado, pérdida de datos, filtración), el responsable debe notificar a la autoridad de control dentro de las 72 horas siguientes a tomar conocimiento de ella. Si la brecha afecta a titulares, también deben ser notificados.',
          },
          {
            title: 'Evaluación de Impacto (DPIA)',
            body: 'Cuando se implementen nuevos sistemas que traten datos personales a gran escala o datos sensibles —como una nueva plataforma de gestión escolar—, se debe realizar una Evaluación de Impacto en Protección de Datos antes de la implementación.',
          },
          {
            title: 'Contratos con encargados',
            body: 'Todo proveedor externo que trate datos por cuenta del colegio (empresa de software, plataforma educativa, proveedor de comunicaciones) debe firmar un contrato de encargo de tratamiento que garantice el cumplimiento de las obligaciones de la ley.',
          },
        ] as item}
          <div class="rounded-xl border border-border bg-card p-5">
            <div class="flex gap-3">
              <ArrowRight class="size-5 shrink-0 text-primary mt-0.5" />
              <div>
                <p class="font-semibold text-foreground mb-1">{item.title}</p>
                <p class="text-sm text-muted-foreground leading-relaxed">{item.body}</p>
              </div>
            </div>
          </div>
        {/each}
      </div>
    </section>

    <!-- ══════════════════════════════════════
         SECCIÓN 6: MULTAS
         ══════════════════════════════════════ -->
    <section id="multas">
      <div class="flex items-center gap-3 mb-6">
        <AlertTriangle class="size-6 shrink-0 text-primary" />
        <h2 class="text-2xl font-bold text-foreground">Multas y sanciones</h2>
      </div>
      <p class="text-muted-foreground leading-relaxed mb-6">
        El <strong class="text-foreground">Consejo para la Transparencia</strong> es el organismo fiscalizador. Las sanciones se clasifican en tres niveles según la gravedad de la infracción. Los montos se expresan en UTM (Unidad Tributaria Mensual), que se ajusta mensualmente.
      </p>
      <div class="space-y-4">
        {#each sanctions as s}
          <div class="rounded-xl border {s.color} p-5">
            <div class="flex items-start justify-between gap-4 mb-3">
              <div class="flex items-center gap-2.5">
                <h3 class="font-bold text-foreground text-lg">{s.level}</h3>
                <span class="rounded-full px-2.5 py-0.5 text-xs font-semibold {s.badge}">{s.fine}</span>
              </div>
              <p class="text-xs text-muted-foreground text-right">{s.approx}</p>
            </div>
            <p class="text-sm text-muted-foreground leading-relaxed"><strong class="text-foreground">Ejemplos:</strong> {s.examples}</p>
          </div>
        {/each}
      </div>
      <div class="mt-6 rounded-xl border border-border bg-card p-5">
        <p class="text-sm font-semibold text-foreground mb-2">Nota sobre la multa máxima</p>
        <p class="text-sm text-muted-foreground leading-relaxed">
          Para infracciones gravísimas, la multa puede ser el mayor entre 10.000 UTM y el 4% de la facturación anual del infractor. Para sostenedores de redes de colegios con facturación significativa, el 4% puede superar con creces el equivalente en UTM. La reincidencia puede duplicar las sanciones y alcanzar hasta <strong>20.000 UTM</strong>.
        </p>
      </div>
    </section>

    <!-- ══════════════════════════════════════
         SECCIÓN 7: PLAZOS
         ══════════════════════════════════════ -->
    <section id="plazos">
      <div class="flex items-center gap-3 mb-6">
        <Clock class="size-6 shrink-0 text-primary" />
        <h2 class="text-2xl font-bold text-foreground">Plazos críticos</h2>
      </div>
      <div class="space-y-3">
        {#each timeline as item}
          <div class="flex gap-4 rounded-xl border {item.highlight ? 'border-primary/30 bg-primary/5' : 'border-border bg-card'} p-4">
            <div class="shrink-0 w-28">
              <span class="text-sm font-bold {item.highlight ? 'text-primary' : 'text-muted-foreground'}">{item.date}</span>
            </div>
            <p class="text-sm {item.highlight ? 'text-foreground font-medium' : 'text-muted-foreground'}">{item.event}</p>
          </div>
        {/each}
      </div>
      <p class="mt-5 text-sm text-muted-foreground leading-relaxed">
        El plazo de adecuación de dos años desde la promulgación es razonable para organizaciones que parten desde cero. Sin embargo, un colegio que recién comience en junio de 2026 tiene seis meses para completar un proceso que incluye inventario de datos, revisión de contratos, capacitaciones y ajustes técnicos. Empezar antes no es prudencia burocrática: es gestión de riesgo.
      </p>
    </section>

    <!-- ══════════════════════════════════════
         SECCIÓN 8: CHECKLIST
         ══════════════════════════════════════ -->
    <section id="checklist">
      <div class="flex items-center gap-3 mb-6">
        <CheckCircle class="size-6 shrink-0 text-primary" />
        <h2 class="text-2xl font-bold text-foreground">Checklist de cumplimiento</h2>
      </div>
      <p class="text-muted-foreground leading-relaxed mb-6">
        15 acciones concretas que su establecimiento debe completar antes de diciembre de 2026. Este checklist no es exhaustivo, pero cubre los puntos que la autoridad fiscalizadora verificará primero.
      </p>
      <div class="rounded-xl border border-border bg-card overflow-hidden">
        {#each checklist as item, i}
          <div class="flex items-start gap-3 px-5 py-3.5 {i !== checklist.length - 1 ? 'border-b border-border' : ''}">
            <div class="mt-0.5 size-5 shrink-0 rounded border-2 border-muted-foreground/30"></div>
            <p class="text-sm text-foreground">{item}</p>
          </div>
        {/each}
      </div>
      <p class="mt-4 text-xs text-muted-foreground">
        ¿Quiere una evaluación personalizada de su nivel de cumplimiento actual? <a href="/demo" class="text-primary underline-offset-2 hover:underline">Solicite una revisión gratuita con un especialista Ethoz</a>.
      </p>
    </section>

    <!-- ══════════════════════════════════════
         SECCIÓN 9: CÓMO AYUDA ETHOZ
         ══════════════════════════════════════ -->
    <section id="como-ayuda-ethoz">
      <div class="flex items-center gap-3 mb-6">
        <ShieldCheck class="size-6 shrink-0 text-primary" />
        <h2 class="text-2xl font-bold text-foreground">¿Cómo Ethoz ayuda con la Ley 21.719?</h2>
      </div>
      <p class="text-muted-foreground leading-relaxed mb-6">
        Ethoz no reemplaza el sistema de gestión escolar que ya usa su colegio. Agrega la capa de seguridad, privacidad y compliance que esos sistemas no tienen por diseño.
      </p>
      <div class="grid gap-4 sm:grid-cols-2">
        {#each [
          { title: 'Cifrado y RLS por diseño', desc: 'Datos cifrados at-rest y en tránsito. Row-Level Security en cada consulta: cada actor del colegio accede solo a lo que le corresponde.', link: '/seguridad-datos' },
          { title: 'Audit log inmutable', desc: 'Cada acción sensible queda registrada con usuario, timestamp e IP. Trazabilidad exigida por Circular N°30 y necesaria ante brechas.', link: '/seguridad-datos' },
          { title: 'Gestión de derechos ARCO+P', desc: 'Panel para registrar y responder solicitudes de acceso, rectificación y supresión dentro de los plazos legales.', link: '/features/privacy-compliance' },
          { title: 'Integración con sistemas actuales', desc: 'Ethoz se conecta a Napsis, Syscol y Lirmi. No tiene que migrar ni reemplazar su ERP escolar.', link: '/integrations' },
        ] as item}
          <a href={item.link} class="rounded-xl border border-border bg-card p-5 hover:border-primary/40 hover:bg-secondary transition-colors block">
            <div class="flex items-center gap-2 mb-2">
              <CheckCircle class="size-4 shrink-0 text-primary" />
              <h3 class="font-semibold text-foreground">{item.title}</h3>
            </div>
            <p class="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
          </a>
        {/each}
      </div>
      <div class="mt-6 grid gap-3 sm:grid-cols-3 text-center">
        <div class="rounded-xl border border-border bg-card p-4">
          <p class="text-2xl font-bold text-foreground">20.000 UTM</p>
          <p class="mt-1 text-xs text-muted-foreground">Multa máxima Ley 21.719</p>
        </div>
        <div class="rounded-xl border border-border bg-card p-4">
          <p class="text-2xl font-bold text-foreground">Dic 2026</p>
          <p class="mt-1 text-xs text-muted-foreground">Enforcement completo</p>
        </div>
        <div class="rounded-xl border border-border bg-card p-4">
          <p class="text-2xl font-bold text-foreground">72 h</p>
          <p class="mt-1 text-xs text-muted-foreground">Para notificar brechas</p>
        </div>
      </div>
    </section>

  </div>

  <!-- ══════════════════════════════════════
       CTA
       ══════════════════════════════════════ -->
  <section class="py-16 sm:py-20 bg-secondary">
    <div class="mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8">
      <Lock class="mx-auto size-10 text-primary mb-4" />
      <h2 class="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        ¿Qué tan expuesto está su colegio?
      </h2>
      <p class="mt-4 text-base text-muted-foreground">
        Evalúe su nivel de cumplimiento con la Ley 21.719 en 20 minutos. Sin costo, sin compromiso.
      </p>
      <div class="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
        <Button size="xl" href="/demo" class="shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30">
          Solicitar evaluación gratuita
          <ArrowRight class="size-4" />
        </Button>
        <a
          href="/glosario"
          class="text-sm font-medium text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
        >
          Ver glosario normativo
        </a>
      </div>
    </div>
  </section>

  <!-- Related pages -->
  <section class="py-12 bg-background border-t border-border">
    <div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
      <p class="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-5">También puede interesarle</p>
      <div class="flex flex-wrap gap-3">
        {#each [
          { href: '/circular-30', label: 'Circular N°30 — libro de clases digital' },
          { href: '/seguridad-datos', label: 'Seguridad de datos en Ethoz' },
          { href: '/comparativa', label: 'Comparativa de plataformas' },
          { href: '/glosario', label: 'Glosario normativo' },
          { href: '/compliance', label: 'Cumplimiento normativo' },
        ] as item}
          <a href={item.href} class="rounded-full border border-border bg-card px-4 py-1.5 text-sm text-muted-foreground hover:border-primary/40 hover:text-foreground transition-colors">
            {item.label}
          </a>
        {/each}
      </div>
    </div>
  </section>

  <Footer />
</main>
