<script lang="ts">
  import NavBar from '$lib/components/NavBar.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import { Badge } from '$lib/components/ui/badge';
  import { Button } from '$lib/components/ui/button';
  import { trackEvent } from '$lib/utils/analytics';
  import { BookOpen, ArrowRight } from '@lucide/svelte';

  $effect(() => {
    trackEvent('seo_page_viewed', { slug: 'glosario' });
  });

  interface Term {
    term: string;
    def: string;
    link?: string;
    tag?: string;
  }

  const glossary: Record<string, Term[]> = {
    A: [
      { term: 'ARCO+P', def: 'Conjunto de derechos que la Ley 21.719 garantiza a los titulares de datos: Acceso, Rectificación, Cancelación, Oposición y Portabilidad. Los colegios deben responder solicitudes en 30 días hábiles.', link: '/ley-21719#derechos-arco', tag: 'Ley 21.719' },
      { term: 'Apoderado', def: 'Persona mayor de edad designada como responsable legal de un estudiante ante el establecimiento. En términos de protección de datos, ejerce los derechos ARCO+P en nombre de los menores a su cargo.', tag: 'Educación' },
      { term: 'Audit log', def: 'Registro cronológico e inmutable de acciones realizadas sobre datos o sistemas. Cada entrada incluye: quién realizó la acción, qué acción fue, sobre qué dato y cuándo. Exigido por la Circular N°30.', link: '/seguridad-datos', tag: 'Seguridad' },
    ],
    B: [
      { term: 'Bitácora', def: 'Registro sistemático de eventos o actividades en un contexto escolar. En el contexto de la Circular N°30, la bitácora digital de accesos y modificaciones al libro de clases debe ser inmutable y trazable.', tag: 'Educación' },
      { term: 'Brecha de seguridad', def: 'Incidente de seguridad que provoca el acceso, modificación, pérdida o destrucción no autorizada de datos personales. La Ley 21.719 exige notificarla a la autoridad en un máximo de 72 horas.', link: '/seguridad-datos', tag: 'Ley 21.719' },
    ],
    C: [
      { term: 'Circular N°30', def: 'Normativa de la Superintendencia de Educación que regula el libro de clases digital en Chile. Exige trazabilidad, integridad de datos, verificación de identidad (Clave Única) y disponibilidad para fiscalización.', link: '/circular-30', tag: 'Normativa' },
      { term: 'Consentimiento informado', def: 'Base de legitimación para el tratamiento de datos personales. Debe ser libre, específico, informado y verificable. Para datos de menores de 14 años, lo otorgan los padres o tutores legales.', link: '/ley-21719', tag: 'Ley 21.719' },
      { term: 'Confidencialidad', def: 'Principio de la Ley 21.719 que obliga a quienes acceden a datos personales a mantenerlos en reserva, incluso después de terminar su relación con el establecimiento.', tag: 'Ley 21.719' },
      { term: 'Convivencia escolar', def: 'Marco normativo y práctico que regula las relaciones entre los miembros de la comunidad escolar. Los registros del libro de convivencia son datos personales protegidos por la Ley 21.719.', tag: 'Educación' },
      { term: 'Cifrado at-rest', def: 'Técnica de seguridad que protege datos almacenados (en bases de datos, discos) mediante algoritmos de cifrado. Garantiza que un acceso físico no autorizado al servidor no exponga datos legibles.', link: '/seguridad-datos', tag: 'Seguridad' },
    ],
    D: [
      { term: 'Datos sensibles', def: 'Categoría especial de datos personales que incluye información sobre origen étnico, salud, vida sexual, datos biométricos, opiniones políticas, creencias religiosas y datos de menores. Requieren consentimiento explícito.', link: '/ley-21719', tag: 'Ley 21.719' },
      { term: 'Directiva escolar', def: 'Equipo directivo de un establecimiento educacional: director, subdirector, inspector general y UTP. En protección de datos, son los responsables de implementar las políticas de tratamiento.', tag: 'Educación' },
      { term: 'DPO (Delegado de Protección de Datos)', def: 'Cargo obligatorio para responsables de tratamiento de datos a gran escala o datos sensibles. Actúa como punto de contacto entre el establecimiento, los titulares y la autoridad de control.', link: '/ley-21719#obligaciones', tag: 'Ley 21.719' },
      { term: 'DPIA (Evaluación de Impacto)', def: 'Evaluación de Impacto en Protección de Datos. Proceso obligatorio antes de implementar sistemas que traten datos personales a gran escala o datos sensibles. Identifica y mitiga riesgos de privacidad.', tag: 'Ley 21.719' },
    ],
    I: [
      { term: 'Inventario de datos', def: 'Registro interno que documenta qué datos personales trata el colegio, con qué finalidad, quién los accede, cuánto tiempo se conservan y con qué medidas de seguridad. Obligatorio bajo la Ley 21.719.', link: '/ley-21719#obligaciones', tag: 'Ley 21.719' },
    ],
    L: [
      { term: 'Ley 21.663 (Ciberseguridad)', def: 'Ley Marco de Ciberseguridad de Chile, promulgada en 2024. Aplica a operadores de servicios esenciales e infraestructura crítica. Establece obligaciones de reporte de incidentes y gestión de vulnerabilidades.', tag: 'Normativa' },
      { term: 'Ley 21.719 (Protección de Datos)', def: 'Nueva ley de protección de datos personales de Chile, promulgada el 13 de diciembre de 2024. Reemplaza la Ley 19.628. Plena vigencia en diciembre de 2026. Multas hasta 20.000 UTM o 4% de la facturación.', link: '/ley-21719', tag: 'Normativa' },
      { term: 'Ley Aula Segura', def: 'Ley 21.128 que refuerza las herramientas disciplinarias de los establecimientos escolares, incluyendo la suspensión y expulsión de alumnos. Los registros asociados a su aplicación son datos personales sensibles.', tag: 'Normativa' },
      { term: 'Libro de clases digital', def: 'Sistema digital que reemplaza el libro de clases en papel. Para cumplir la Circular N°30, debe garantizar integridad, trazabilidad, autenticación robusta y disponibilidad para la Superintendencia.', link: '/circular-30', tag: 'Normativa' },
    ],
    O: [
      { term: 'Observaciones por categoría', def: 'Clasificación de anotaciones en el libro de clases por tipo: conducta, académico, asistencia, convivencia. Cada categoría puede tener distintos niveles de acceso según el rol del usuario.', tag: 'Educación' },
      { term: 'Orden de alejamiento', def: 'Medida judicial que prohíbe a una persona acercarse a otra. En el contexto escolar, el colegio debe registrar y actuar conforme a órdenes de alejamiento en el sistema de control de acceso y retiros.', tag: 'Seguridad' },
    ],
    P: [
      { term: 'Portería', def: 'Punto de control de acceso físico del establecimiento. En Ethoz, la portería es un módulo con verificación de identidad, control de retiros y alertas en tiempo real para el personal autorizado.', tag: 'Seguridad' },
      { term: 'Privacidad por diseño', def: 'Principio que exige incorporar la protección de datos desde el diseño de sistemas y procesos, no como añadido posterior. Es una obligación implícita de la Ley 21.719 y un estándar de buenas prácticas internacionales.', link: '/seguridad-datos', tag: 'Ley 21.719' },
      { term: 'Protocolo de retiro', def: 'Procedimiento documentado que establece cómo se autoriza, verifica y registra el retiro de un estudiante del establecimiento. Debe incluir verificación de identidad del adulto y registro del responsable que autorizó.', tag: 'Seguridad' },
    ],
    R: [
      { term: 'RBD (Rol Base de Datos)', def: 'Identificador único asignado por el Ministerio de Educación a cada establecimiento educacional en Chile. Número de referencia estándar en todos los sistemas del sector educacional.', tag: 'Educación' },
      { term: 'Retiro escolar', def: 'Proceso de salida de un estudiante del establecimiento durante la jornada escolar. Requiere autorización del apoderado y verificación de identidad del adulto que retira. Ethoz digitaliza y audita este proceso.', tag: 'Seguridad' },
      { term: 'RLS (Row-Level Security)', def: 'Mecanismo de seguridad en bases de datos que filtra los datos que cada usuario puede ver a nivel de fila, según su rol. Implementado en Ethoz vía Supabase para garantizar que cada actor acceda solo a lo que le corresponde.', link: '/seguridad-datos', tag: 'Seguridad' },
    ],
    S: [
      { term: 'Seudonimización', def: 'Técnica de protección de datos que reemplaza identificadores directos (nombre, RUT) por seudónimos, reduciendo el riesgo de re-identificación. Los datos seudonimizados siguen siendo datos personales bajo la Ley 21.719.', tag: 'Ley 21.719' },
      { term: 'Sostenedor', def: 'Persona jurídica responsable de la administración de uno o más establecimientos educacionales. Puede ser un municipio, corporación, fundación o empresa. Es el responsable principal del tratamiento de datos bajo la Ley 21.719.', tag: 'Educación' },
    ],
    T: [
      { term: 'Tutor legal', def: 'Persona designada legalmente como responsable de un menor cuando los padres no están disponibles o han sido privados de la tuición. Ejerce los derechos ARCO+P en nombre del menor.', tag: 'Educación' },
    ],
    U: [
      { term: 'UTP (Unidad Técnico-Pedagógica)', def: 'Unidad responsable de la gestión curricular y pedagógica del establecimiento. Accede a datos académicos del libro de clases; bajo la Circular N°30 y la Ley 21.719, su acceso debe estar controlado y auditado.', tag: 'Educación' },
    ],
    V: [
      { term: 'Verificación de identidad', def: 'Proceso de confirmar que una persona es quien dice ser. En el contexto de la Circular N°30, el estándar de referencia es la Clave Única del Estado. En portería, puede incluir validación de RUT, huella dactilar o reconocimiento facial.', link: '/circular-30', tag: 'Seguridad' },
    ],
  };

  const allLetters = Object.keys(glossary).sort();

  const tagColors: Record<string, string> = {
    'Ley 21.719': 'bg-blue-100 text-blue-800',
    'Normativa': 'bg-purple-100 text-purple-800',
    'Seguridad': 'bg-green-100 text-green-800',
    'Educación': 'bg-yellow-100 text-yellow-800',
  };
</script>

<svelte:head>
  <title>Glosario Ethoz — términos clave para la protección escolar | Ethoz</title>
  <meta name="description" content="Glosario completo de términos de protección escolar y cumplimiento normativo en Chile: Ley 21.719, Circular N°30, ARCO+P, RLS, DPO, RBD, sostenedor y más." />
  <meta property="og:title" content="Glosario Ethoz — términos de protección escolar" />
  <meta property="og:description" content="Glosario completo de términos de protección escolar y cumplimiento normativo en Chile: Ley 21.719, Circular N°30, ARCO+P, RLS, DPO, RBD, sostenedor y más." />
  <meta property="og:type" content="article" />
  <meta property="og:url" content="https://ethoz.cl/glosario" />
  <meta name="twitter:card" content="summary_large_image" />
  <link rel="canonical" href="https://ethoz.cl/glosario" />
  {@html `<script type="application/ld+json">${JSON.stringify([
    {
      "@context": "https://schema.org",
      "@type": "DefinedTermSet",
      "name": "Glosario Ethoz — protección escolar y cumplimiento normativo",
      "description": "Glosario completo de términos de protección escolar y cumplimiento normativo en Chile.",
      "url": "https://ethoz.cl/glosario",
      "publisher": { "@type": "Organization", "name": "Ethoz", "logo": { "@type": "ImageObject", "url": "https://ethoz.cl/favicon.svg" }}
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Inicio", "item": "https://ethoz.cl/" },
        { "@type": "ListItem", "position": 2, "name": "Glosario", "item": "https://ethoz.cl/glosario" }
      ]
    }
  ])}</script>`}
</svelte:head>

<main class="min-h-screen bg-background">
  <NavBar />

  <!-- HERO -->
  <section class="pt-24 pb-16 sm:pt-32 sm:pb-20 bg-secondary">
    <div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
      <div class="flex items-center gap-2 mb-4">
        <Badge variant="secondary" class="text-xs font-semibold uppercase tracking-wide">Referencia</Badge>
      </div>
      <div class="flex items-center gap-3 mb-4">
        <BookOpen class="size-8 shrink-0 text-primary" />
        <h1 class="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Glosario Ethoz
        </h1>
      </div>
      <p class="text-xl text-muted-foreground leading-relaxed max-w-3xl">
        Términos clave para entender la protección escolar, el cumplimiento normativo y la seguridad de datos en establecimientos educacionales chilenos.
      </p>

      <!-- Alphabet nav -->
      <nav class="mt-8 flex flex-wrap gap-2" aria-label="Navegación alfabética">
        {#each allLetters as letter}
          <a
            href="#{letter}"
            class="flex size-9 items-center justify-center rounded-lg border border-border bg-card text-sm font-bold text-muted-foreground hover:border-primary/40 hover:text-primary transition-colors"
          >
            {letter}
          </a>
        {/each}
      </nav>
    </div>
  </section>

  <!-- GLOSSARY -->
  <div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16 space-y-16">
    {#each allLetters as letter}
      <section id={letter}>
        <h2 class="text-4xl font-bold text-primary mb-6 pb-3 border-b border-border">{letter}</h2>
        <div class="space-y-4">
          {#each glossary[letter] as item}
            <div class="rounded-xl border border-border bg-card p-5">
              <div class="flex items-start justify-between gap-3 mb-2">
                <div class="flex items-center gap-2 flex-wrap">
                  <h3 class="text-base font-bold text-foreground">{item.term}</h3>
                  {#if item.tag}
                    <span class="rounded-full px-2 py-0.5 text-xs font-medium {tagColors[item.tag] ?? 'bg-secondary text-muted-foreground'}">{item.tag}</span>
                  {/if}
                </div>
                {#if item.link}
                  <a href={item.link} class="shrink-0 flex items-center gap-1 text-xs text-primary hover:underline underline-offset-2">
                    Ver más <ArrowRight class="size-3" />
                  </a>
                {/if}
              </div>
              <p class="text-sm text-muted-foreground leading-relaxed">{item.def}</p>
            </div>
          {/each}
        </div>
      </section>
    {/each}
  </div>

  <!-- CTA -->
  <section class="py-16 sm:py-20 bg-secondary">
    <div class="mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8">
      <BookOpen class="mx-auto size-10 text-primary mb-4" />
      <h2 class="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        ¿Hay un término que no encontró?
      </h2>
      <p class="mt-4 text-base text-muted-foreground">
        Este glosario se actualiza continuamente. Si tiene dudas sobre normativa escolar o protección de datos, nuestro equipo puede ayudarle.
      </p>
      <div class="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
        <Button size="xl" href="/demo" class="shadow-lg shadow-primary/25">
          Hablar con un especialista
          <ArrowRight class="size-4" />
        </Button>
        <a href="/ley-21719" class="text-sm font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline transition-colors">
          Guía Ley 21.719
        </a>
      </div>
    </div>
  </section>

  <section class="py-12 bg-background border-t border-border">
    <div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
      <p class="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-5">También puede interesarle</p>
      <div class="flex flex-wrap gap-3">
        {#each [
          { href: '/ley-21719', label: 'Ley 21.719 — guía completa' },
          { href: '/circular-30', label: 'Circular N°30 — libro de clases digital' },
          { href: '/seguridad-datos', label: 'Seguridad de datos en Ethoz' },
          { href: '/comparativa', label: 'Comparativa de plataformas' },
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
