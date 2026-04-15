<script lang="ts">
  import NavBar from '$lib/components/NavBar.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import { Button } from '$lib/components/ui/button';
  import { Printer, ArrowLeft } from '@lucide/svelte';
</script>

<svelte:head>
  <title>Modelo de Aviso de Privacidad Escolar — Plantilla gratuita | Ethoz</title>
  <meta name="description" content="Plantilla de aviso de privacidad conforme al Art. 14 de la Ley 21.719 para establecimientos educacionales chilenos. Descarga gratis." />
  <meta property="og:url" content="https://ethoz.cl/resources/privacy-notice" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="Modelo de Aviso de Privacidad Escolar | Ethoz" />
  <meta property="og:description" content="Plantilla conforme a la Ley 21.719 para publicar el aviso de privacidad en tu colegio." />
  <link rel="canonical" href="https://ethoz.cl/resources/privacy-notice" />
  {@html `<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "LegalDocument",
    "name": "Modelo de Aviso de Privacidad Escolar",
    "description": "Plantilla de aviso de privacidad conforme al Art. 14 de la Ley 21.719.",
    "url": "https://ethoz.cl/resources/privacy-notice",
    "publisher": { "@type": "Organization", "name": "Ethoz", "url": "https://ethoz.cl" }
  })}</script>`}
</svelte:head>

<div class="print:hidden">
  <NavBar />
</div>

<main class="min-h-dvh bg-background">
  <div class="print:hidden sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur-sm">
    <div class="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
      <Button href="/resources" variant="ghost" size="sm" class="gap-2 text-muted-foreground">
        <ArrowLeft class="size-4" />
        Volver a recursos
      </Button>
      <Button href="/downloads/aviso-privacidad-escolar.pdf" download size="lg" class="gap-2 shadow-lg shadow-primary/25">
        <Printer class="size-4" />
        Descargar PDF
      </Button>
    </div>
  </div>

  <div class="mx-auto max-w-4xl px-4 py-10 sm:py-14">
    <div class="mb-10 border-b border-border pb-8">
      <div class="flex items-center gap-3 mb-3 print:hidden">
        <span class="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">Legal</span>
        <span class="text-xs text-muted-foreground">Basado en Art. 14 Ley 21.719 · Plantilla editable</span>
      </div>
      <h1 class="text-3xl font-bold tracking-tight text-foreground mb-3">Modelo de Aviso de Privacidad Escolar</h1>
      <p class="text-muted-foreground">Complete los campos marcados con <span class="font-medium text-primary">[corchetes]</span> con la información de su establecimiento. Este aviso debe publicarse en el sitio web institucional y estar disponible físicamente en la recepción.</p>
      <p class="mt-3 text-xs text-muted-foreground">Elaborado por Ethoz · ethoz.cl · Basado en Ley 21.719 promulgada el 13 de diciembre de 2024</p>
    </div>

    <!-- Document -->
    <div class="space-y-8 text-sm leading-relaxed">

      <!-- Header of document -->
      <div class="rounded-lg border-2 border-border bg-muted/20 p-6 text-center">
        <p class="text-xs uppercase tracking-widest text-muted-foreground mb-2">Aviso de Privacidad</p>
        <h2 class="text-xl font-bold text-foreground">[NOMBRE DEL ESTABLECIMIENTO EDUCACIONAL]</h2>
        <p class="text-muted-foreground text-xs mt-1">RBD: [___________] · RUT: [___________]</p>
        <p class="text-muted-foreground text-xs">Dirección: [___________], [Comuna], [Región], Chile</p>
        <p class="text-xs text-muted-foreground mt-3">Vigente desde: [DD/MM/AAAA] · Versión [1.0]</p>
      </div>

      <section>
        <h3 class="font-semibold text-foreground mb-2">1. Identidad y datos del Responsable del Tratamiento</h3>
        <p class="text-muted-foreground">El responsable del tratamiento de sus datos personales es <strong>[NOMBRE DEL ESTABLECIMIENTO]</strong>, RUT <strong>[__________]</strong>, con domicilio en <strong>[dirección completa]</strong>, comuna de <strong>[comuna]</strong>, región de <strong>[región]</strong>. Correo electrónico de contacto: <strong>[email institucional]</strong>. Teléfono: <strong>[teléfono]</strong>.</p>
      </section>

      <section>
        <h3 class="font-semibold text-foreground mb-2">2. Finalidades del Tratamiento</h3>
        <p class="text-muted-foreground mb-3">Sus datos personales son tratados para las siguientes finalidades:</p>
        <ul class="space-y-2 text-muted-foreground">
          <li class="flex items-start gap-2"><span class="text-primary mt-0.5 shrink-0">a)</span> <span><strong>Gestión educativa:</strong> matrícula, registros académicos, notas, asistencia, observaciones de convivencia escolar.</span></li>
          <li class="flex items-start gap-2"><span class="text-primary mt-0.5 shrink-0">b)</span> <span><strong>Comunicación con apoderados:</strong> notificaciones sobre rendimiento, asistencia, eventos institucionales y situaciones de emergencia.</span></li>
          <li class="flex items-start gap-2"><span class="text-primary mt-0.5 shrink-0">c)</span> <span><strong>Seguridad del establecimiento:</strong> control de accesos, registro de retiros de alumnos, verificación de identidad en ingreso.</span></li>
          <li class="flex items-start gap-2"><span class="text-primary mt-0.5 shrink-0">d)</span> <span><strong>Cumplimiento legal:</strong> reporte de datos al Ministerio de Educación (MINEDUC), JUNAEB, organismos supervisores y otras obligaciones legales.</span></li>
          <li class="flex items-start gap-2"><span class="text-primary mt-0.5 shrink-0">e)</span> <span><strong>Salud y bienestar del alumno:</strong> gestión de ficha médica, alergias, condiciones especiales y coordinación con centros de salud cuando corresponda.</span></li>
          <li class="flex items-start gap-2"><span class="text-primary mt-0.5 shrink-0">f)</span> <span><strong>Proceso de admisión:</strong> evaluación y asignación de vacantes conforme al Sistema de Admisión Escolar (SAE).</span></li>
        </ul>
      </section>

      <section>
        <h3 class="font-semibold text-foreground mb-2">3. Base Legal del Tratamiento</h3>
        <p class="text-muted-foreground">El tratamiento de sus datos personales se basa en las siguientes fuentes de legitimidad conforme a la Ley 21.719:</p>
        <ul class="mt-2 space-y-1.5 text-muted-foreground list-disc pl-6">
          <li><strong>Consentimiento del titular o apoderado</strong> (Art. 13): para datos sensibles, comunicaciones opcionales y finalidades adicionales.</li>
          <li><strong>Ejecución de relación contractual</strong> (Art. 13 b): derivado del contrato de matrícula suscrito anualmente.</li>
          <li><strong>Cumplimiento de obligaciones legales</strong> (Art. 13 c): reportes a MINEDUC, JUNAEB, Registro Civil, organismos judiciales y de salud.</li>
          <li><strong>Interés legítimo</strong> (Art. 13 e): seguridad del establecimiento, comunicaciones institucionales y mejora del servicio educativo.</li>
        </ul>
      </section>

      <section>
        <h3 class="font-semibold text-foreground mb-2">4. Categorías de Datos Tratados</h3>
        <div class="overflow-x-auto rounded-lg border border-border">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-border bg-muted/50">
                <th class="px-4 py-2.5 text-left font-medium">Categoría</th>
                <th class="px-4 py-2.5 text-left font-medium">Ejemplos</th>
                <th class="px-4 py-2.5 text-left font-medium">¿Sensibles?</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-border text-muted-foreground">
              <tr><td class="px-4 py-2.5">Identificación del alumno</td><td class="px-4 py-2.5">Nombre, RUT, fecha de nacimiento, fotografía</td><td class="px-4 py-2.5">No</td></tr>
              <tr><td class="px-4 py-2.5">Identificación del apoderado</td><td class="px-4 py-2.5">Nombre, RUT, correo, teléfono, parentesco</td><td class="px-4 py-2.5">No</td></tr>
              <tr><td class="px-4 py-2.5">Datos académicos</td><td class="px-4 py-2.5">Notas, asistencia, observaciones pedagógicas</td><td class="px-4 py-2.5">No</td></tr>
              <tr><td class="px-4 py-2.5">Datos de salud</td><td class="px-4 py-2.5">Alergias, diagnósticos, medicamentos, PIE</td><td class="px-4 py-2.5"><span class="text-warning-foreground font-medium">Sí</span></td></tr>
              <tr><td class="px-4 py-2.5">Datos socioeconómicos</td><td class="px-4 py-2.5">Situación JUNAEB, beneficios, becas</td><td class="px-4 py-2.5">Parcial</td></tr>
              <tr><td class="px-4 py-2.5">Datos de seguridad</td><td class="px-4 py-2.5">Registros de acceso, retiros, alertas</td><td class="px-4 py-2.5">No</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h3 class="font-semibold text-foreground mb-2">5. Destinatarios de los Datos</h3>
        <p class="text-muted-foreground mb-2">Sus datos pueden ser comunicados a los siguientes destinatarios, siempre en el marco de las finalidades declaradas:</p>
        <ul class="list-disc pl-6 space-y-1 text-muted-foreground">
          <li>Ministerio de Educación (MINEDUC) y organismos dependientes (JUNAEB, JUNJI, CPEIP).</li>
          <li>Proveedores tecnológicos del establecimiento que actúan como encargados del tratamiento, bajo contrato de confidencialidad.</li>
          <li>Servicios de salud, cuando la situación del alumno lo requiera.</li>
          <li>Organismos judiciales o Carabineros de Chile, ante requerimiento legal.</li>
          <li><strong>[Nombre del sostenedor o red de colegios, si aplica]</strong>, en su calidad de sostenedor.</li>
        </ul>
      </section>

      <section>
        <h3 class="font-semibold text-foreground mb-2">6. Transferencias Internacionales</h3>
        <p class="text-muted-foreground">
          [Opción A — sin transferencias:] El establecimiento no realiza transferencias internacionales de datos personales.<br/>
          [Opción B — con transferencias:] Algunos de nuestros proveedores tecnológicos procesan datos en servidores ubicados fuera de Chile (principalmente en Estados Unidos y/o Europa). Dichas transferencias se realizan bajo las garantías exigidas por la Ley 21.719 y los contratos suscritos incluyen cláusulas de protección equivalentes.
        </p>
      </section>

      <section>
        <h3 class="font-semibold text-foreground mb-2">7. Plazo de Conservación</h3>
        <p class="text-muted-foreground">Los datos serán conservados durante el tiempo necesario para cumplir con las finalidades declaradas y las obligaciones legales aplicables:</p>
        <ul class="mt-2 list-disc pl-6 space-y-1 text-muted-foreground">
          <li>Datos de matrícula y académicos: durante la vigencia de la relación educativa y <strong>5 años adicionales</strong> tras el egreso.</li>
          <li>Datos de salud sensibles: durante la vigencia de la relación y <strong>10 años</strong> tras el egreso (conforme normativa sanitaria).</li>
          <li>Registros de seguridad y acceso: <strong>2 años</strong> desde la fecha de registro.</li>
          <li>Datos de procesos judiciales o disciplinarios: mientras exista obligación legal de conservarlos.</li>
        </ul>
      </section>

      <section>
        <h3 class="font-semibold text-foreground mb-2">8. Derechos del Titular (ARCO+P)</h3>
        <p class="text-muted-foreground mb-3">Conforme a la Ley 21.719, usted tiene los siguientes derechos respecto de sus datos personales:</p>
        <div class="grid gap-3 sm:grid-cols-2">
          {#each [
            { right: 'Acceso (A)', desc: 'Solicitar información sobre qué datos suyos tratamos, para qué finalidad y por cuánto tiempo.' },
            { right: 'Rectificación (R)', desc: 'Solicitar la corrección de datos inexactos, incompletos o desactualizados.' },
            { right: 'Cancelación / Supresión (C)', desc: 'Solicitar la eliminación de sus datos cuando ya no exista base legal para su tratamiento.' },
            { right: 'Oposición (O)', desc: 'Oponerse al tratamiento de sus datos para finalidades específicas, en particular para marketing o comunicaciones.' },
            { right: 'Portabilidad (P)', desc: 'Solicitar una copia de sus datos en formato estructurado, legible por máquina.' },
            { right: 'Revocación del consentimiento', desc: 'Retirar en cualquier momento el consentimiento otorgado, sin que ello afecte el tratamiento previo a la revocación.' }
          ] as r}
            <div class="rounded-lg border border-border bg-card p-3">
              <p class="font-medium text-foreground text-xs mb-1">{r.right}</p>
              <p class="text-xs text-muted-foreground">{r.desc}</p>
            </div>
          {/each}
        </div>
      </section>

      <section>
        <h3 class="font-semibold text-foreground mb-2">9. Cómo Ejercer sus Derechos</h3>
        <p class="text-muted-foreground">Para ejercer cualquiera de los derechos anteriores, el titular o su representante legal puede:</p>
        <ul class="mt-2 list-disc pl-6 space-y-1 text-muted-foreground">
          <li>Enviar un correo a: <strong>[email del DPO o secretaría]</strong> con el asunto "Ejercicio de Derechos ARCO+P".</li>
          <li>Presentar una solicitud escrita en la secretaría del establecimiento, adjuntando copia de cédula de identidad.</li>
          <li>Utilizar el formulario disponible en: <strong>[URL del formulario, si existe]</strong></li>
        </ul>
        <p class="mt-3 text-muted-foreground">El establecimiento responderá en un plazo máximo de <strong>30 días hábiles</strong> desde la recepción de la solicitud (Art. 40, Ley 21.719). En caso de rechazo, se informarán los motivos y las vías de reclamación disponibles.</p>
      </section>

      <section>
        <h3 class="font-semibold text-foreground mb-2">10. Encargado de Protección de Datos (DPO)</h3>
        <div class="rounded-lg border border-border bg-card p-4 text-muted-foreground">
          <p><strong class="text-foreground">Nombre:</strong> [Nombre del DPO designado]</p>
          <p><strong class="text-foreground">Correo:</strong> [dpo@establecimiento.cl]</p>
          <p><strong class="text-foreground">Teléfono:</strong> [+56 X XXXX XXXX]</p>
          <p class="mt-2 text-xs">Si considera que sus derechos han sido vulnerados, puede presentar un reclamo ante la <strong>Agencia de Protección de Datos Personales</strong> de Chile una vez que esta entre en funciones.</p>
        </div>
      </section>

    </div>

    <div class="print:hidden mt-10 text-center">
      <p class="text-sm text-muted-foreground mb-4">Ethoz genera y gestiona este aviso automáticamente para su establecimiento.</p>
      <Button href="/demo">Solicitar demo gratuita</Button>
    </div>
  </div>
</main>

<div class="print:hidden">
  <Footer />
</div>

<style>
  @media print {
    /* Print: force high-contrast B&W regardless of theme */
    :global(body) { font-size: 11px; color: black; background: white; }
    main { padding: 0; }
  }
</style>
