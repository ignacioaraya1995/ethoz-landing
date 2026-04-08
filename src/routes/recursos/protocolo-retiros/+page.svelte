<script lang="ts">
  import NavBar from '$lib/components/NavBar.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import { Button } from '$lib/components/ui/button';
  import { Printer, ArrowLeft } from '@lucide/svelte';
</script>

<svelte:head>
  <title>Protocolo de Retiros Seguros — Plantilla gratuita | Ethoz</title>
  <meta name="description" content="Plantilla de protocolo de retiros seguros para colegios chilenos. Procedimiento de 8 pasos, casos especiales y trazabilidad. Descarga gratis." />
  <meta property="og:url" content="https://ethoz.cl/recursos/protocolo-retiros" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="Protocolo de Retiros Seguros | Ethoz" />
  <meta property="og:description" content="Plantilla completa de protocolo de retiros seguros para establecimientos educacionales chilenos." />
  <link rel="canonical" href="https://ethoz.cl/recursos/protocolo-retiros" />
  {@html `<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "Protocolo de Retiros Seguros",
    "description": "Procedimiento completo para gestionar retiros de alumnos en establecimientos educacionales.",
    "url": "https://ethoz.cl/recursos/protocolo-retiros",
    "publisher": { "@type": "Organization", "name": "Ethoz", "url": "https://ethoz.cl" }
  })}</script>`}
</svelte:head>

<div class="print:hidden">
  <NavBar />
</div>

<main class="min-h-dvh bg-background">
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
        <span class="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">Operaciones</span>
        <span class="text-xs text-muted-foreground">Plantilla editable</span>
      </div>
      <h1 class="text-3xl font-bold tracking-tight text-foreground mb-3">Protocolo de Retiros Seguros</h1>
      <p class="text-muted-foreground">Procedimiento oficial para la gestión segura y trazable del retiro de alumnos durante la jornada escolar.</p>
      <p class="mt-3 text-xs text-muted-foreground">Versión 1.0 · Elaborado por Ethoz · ethoz.cl · Adapte con los datos de su establecimiento</p>
    </div>

    <div class="space-y-10 text-sm leading-relaxed text-foreground">

      <!-- 1. Objetivo -->
      <section>
        <h2 class="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
          <span class="flex size-6 items-center justify-center rounded-full bg-foreground text-background text-xs font-bold">1</span>
          Objetivo
        </h2>
        <p class="text-muted-foreground">
          Establecer un procedimiento claro, seguro y trazable para el retiro de alumnos del establecimiento durante la jornada escolar, garantizando la integridad física del estudiante y el cumplimiento de los deberes legales del establecimiento conforme a la normativa vigente, incluyendo la Ley 21.719 y la normativa MINEDUC.
        </p>
      </section>

      <!-- 2. Alcance -->
      <section>
        <h2 class="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
          <span class="flex size-6 items-center justify-center rounded-full bg-foreground text-background text-xs font-bold">2</span>
          Alcance
        </h2>
        <p class="text-muted-foreground mb-2">Este protocolo aplica a:</p>
        <ul class="list-disc pl-6 space-y-1 text-muted-foreground">
          <li>Todos los alumnos matriculados en el establecimiento, desde Pre-Kínder hasta 4° Medio.</li>
          <li>Todo el personal que participa en el proceso: portero, inspector, administrativo.</li>
          <li>Apoderados titulares, apoderados suplentes y terceras personas autorizadas.</li>
          <li>Situaciones de retiro anticipado, retiro por emergencia o retiro por orden judicial.</li>
        </ul>
      </section>

      <!-- 3. Responsables -->
      <section>
        <h2 class="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
          <span class="flex size-6 items-center justify-center rounded-full bg-foreground text-background text-xs font-bold">3</span>
          Responsables
        </h2>
        <div class="overflow-x-auto rounded-lg border border-border">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-border bg-muted/50">
                <th class="px-4 py-3 text-left font-medium text-foreground">Rol</th>
                <th class="px-4 py-3 text-left font-medium text-foreground">Responsabilidad</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-border">
              <tr>
                <td class="px-4 py-3 font-medium">Portero / Guardia</td>
                <td class="px-4 py-3 text-muted-foreground">Primera línea: recibe la solicitud, verifica identidad, registra el retiro.</td>
              </tr>
              <tr>
                <td class="px-4 py-3 font-medium">Inspector General</td>
                <td class="px-4 py-3 text-muted-foreground">Autoriza retiros de alumnos menores. Resuelve casos especiales y conflictos.</td>
              </tr>
              <tr>
                <td class="px-4 py-3 font-medium">Administrativo / Secretaría</td>
                <td class="px-4 py-3 text-muted-foreground">Mantiene actualizado el registro de apoderados y personas autorizadas en el sistema.</td>
              </tr>
              <tr>
                <td class="px-4 py-3 font-medium">Docente de aula</td>
                <td class="px-4 py-3 text-muted-foreground">Libera al alumno una vez confirmada la autorización del inspector.</td>
              </tr>
              <tr>
                <td class="px-4 py-3 font-medium">Director(a)</td>
                <td class="px-4 py-3 text-muted-foreground">Resuelve situaciones de orden judicial o emergencias médicas graves.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- 4. Procedimiento -->
      <section>
        <h2 class="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
          <span class="flex size-6 items-center justify-center rounded-full bg-foreground text-background text-xs font-bold">4</span>
          Procedimiento Estándar (8 pasos)
        </h2>
        <div class="space-y-4">
          {#each [
            { n: 1, title: 'Recepción de la solicitud', detail: 'El apoderado o persona autorizada se presenta en la recepción/portería e indica el nombre del alumno que desea retirar. El portero solicita la cédula de identidad o documento equivalente.' },
            { n: 2, title: 'Identificación de la persona', detail: 'El portero verifica la identidad comparando el documento presentado con la foto y RUT registrado en el sistema. Si la persona no está registrada, se niega el retiro y se notifica al inspector.' },
            { n: 3, title: 'Verificación en el sistema', detail: 'Se consulta el registro del alumno para confirmar que la persona está autorizada. Se verifica la existencia de alertas judiciales, restricciones de visita u otras anotaciones críticas.' },
            { n: 4, title: 'Contacto de emergencia (si aplica)', detail: 'Si se trata de una persona no habitual o si hay alguna inconsistencia, el portero llama al apoderado titular para confirmar autorización antes de proceder.' },
            { n: 5, title: 'Notificación al curso', detail: 'El portero o inspector contacta al docente a cargo del alumno para notificar el retiro inminente. El docente confirma la asistencia del alumno en ese momento.' },
            { n: 6, title: 'Retiro del alumno del aula', detail: 'El inspector o un funcionario autorizado acompaña al alumno desde el aula hasta la recepción. No se permite que el alumno se traslade solo al área de retiro.' },
            { n: 7, title: 'Entrega y firma', detail: 'El alumno es entregado a la persona autorizada. Esta firma el libro de retiros o el sistema electrónico, indicando hora, nombre y RUT. Se toma foto del documento si el sistema lo permite.' },
            { n: 8, title: 'Registro final', detail: 'Se registra el retiro en el sistema de gestión escolar con: nombre del alumno, hora de retiro, nombre y RUT de quien retira, motivo declarado y nombre del funcionario que autorizó.' }
          ] as step}
            <div class="flex gap-4 rounded-lg border border-border bg-card p-4">
              <div class="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold mt-0.5">{step.n}</div>
              <div>
                <p class="font-medium text-foreground mb-1">{step.title}</p>
                <p class="text-muted-foreground text-sm">{step.detail}</p>
              </div>
            </div>
          {/each}
        </div>
      </section>

      <!-- 5. Casos especiales -->
      <section>
        <h2 class="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
          <span class="flex size-6 items-center justify-center rounded-full bg-foreground text-background text-xs font-bold">5</span>
          Casos Especiales
        </h2>
        <div class="space-y-4">
          <div class="rounded-lg border border-orange-200 bg-orange-50 dark:border-orange-900/40 dark:bg-orange-950/20 p-4">
            <p class="font-medium text-orange-800 dark:text-orange-300 mb-1">Orden judicial de restricción de visitas</p>
            <p class="text-sm text-orange-700 dark:text-orange-400">El sistema debe tener alerta activa. El portero no entrega al alumno bajo ninguna circunstancia. Contacta inmediatamente al director y, si hay presión o amenaza, llama a Carabineros (133).</p>
          </div>
          <div class="rounded-lg border border-red-200 bg-red-50 dark:border-red-900/40 dark:bg-red-950/20 p-4">
            <p class="font-medium text-red-800 dark:text-red-300 mb-1">Menor intenta salir sin autorización</p>
            <p class="text-sm text-red-700 dark:text-red-400">El portero retiene al alumno con respeto y notifica al inspector. Se contacta al apoderado titular. Se deja registro del incidente. No se usa fuerza física.</p>
          </div>
          <div class="rounded-lg border border-blue-200 bg-blue-50 dark:border-blue-900/40 dark:bg-blue-950/20 p-4">
            <p class="font-medium text-blue-800 dark:text-blue-300 mb-1">Emergencia médica</p>
            <p class="text-sm text-blue-700 dark:text-blue-400">Si el alumno requiere atención médica urgente, el director o inspector autoriza la salida con SAMU o ambulancia. Se notifica inmediatamente al apoderado titular y se deja registro completo del traslado.</p>
          </div>
          <div class="rounded-lg border border-muted bg-muted/30 p-4">
            <p class="font-medium text-foreground mb-1">Persona no reconocida que afirma ser familiar</p>
            <p class="text-sm text-muted-foreground">No se entrega al alumno. Se solicita documento de identidad, se llama al apoderado titular para verificar, y se espera confirmación antes de cualquier acción. Si no hay respuesta, el alumno permanece en el establecimiento.</p>
          </div>
        </div>
      </section>

      <!-- 6. Registro y trazabilidad -->
      <section>
        <h2 class="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
          <span class="flex size-6 items-center justify-center rounded-full bg-foreground text-background text-xs font-bold">6</span>
          Registro y Trazabilidad
        </h2>
        <p class="text-muted-foreground mb-3">Todo retiro debe quedar registrado con los siguientes campos mínimos:</p>
        <div class="rounded-lg border border-border bg-muted/30 p-4">
          <ul class="space-y-1.5 text-muted-foreground">
            <li class="flex items-start gap-2"><span class="text-primary mt-0.5">→</span> Fecha y hora exacta del retiro</li>
            <li class="flex items-start gap-2"><span class="text-primary mt-0.5">→</span> Nombre completo y RUT del alumno</li>
            <li class="flex items-start gap-2"><span class="text-primary mt-0.5">→</span> Nombre completo y RUT de quien retira</li>
            <li class="flex items-start gap-2"><span class="text-primary mt-0.5">→</span> Relación con el alumno (apoderado titular, suplente, autorizado)</li>
            <li class="flex items-start gap-2"><span class="text-primary mt-0.5">→</span> Motivo declarado del retiro</li>
            <li class="flex items-start gap-2"><span class="text-primary mt-0.5">→</span> Funcionario que autorizó y ejecutó el retiro</li>
            <li class="flex items-start gap-2"><span class="text-primary mt-0.5">→</span> Observaciones relevantes (si aplica)</li>
          </ul>
        </div>
        <p class="mt-3 text-xs text-muted-foreground">Los registros deben conservarse por al menos 5 años conforme a las obligaciones de trazabilidad de la Ley 21.719.</p>
      </section>

      <!-- 7. Revisión anual -->
      <section>
        <h2 class="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
          <span class="flex size-6 items-center justify-center rounded-full bg-foreground text-background text-xs font-bold">7</span>
          Revisión Anual del Protocolo
        </h2>
        <p class="text-muted-foreground mb-3">Este protocolo debe ser revisado anualmente por el Inspector General y el Director, idealmente en enero de cada año escolar. En la revisión se debe verificar:</p>
        <ul class="list-disc pl-6 space-y-1 text-muted-foreground">
          <li>Actualización del registro de apoderados y personas autorizadas.</li>
          <li>Incorporación de cambios legales o normativos relevantes.</li>
          <li>Evaluación de incidentes ocurridos durante el año anterior.</li>
          <li>Capacitación del personal nuevo en el procedimiento.</li>
          <li>Verificación de que el sistema de registro funcione correctamente.</li>
        </ul>
        <div class="mt-4 rounded-lg border border-border bg-card p-4 text-xs text-muted-foreground">
          <p><strong class="text-foreground">Fecha de aprobación:</strong> ___________________________</p>
          <p class="mt-1"><strong class="text-foreground">Firma Director(a):</strong> ___________________________</p>
          <p class="mt-1"><strong class="text-foreground">Firma Inspector(a) General:</strong> ___________________________</p>
          <p class="mt-1"><strong class="text-foreground">Próxima revisión:</strong> ___________________________</p>
        </div>
      </section>
    </div>

    <div class="print:hidden mt-10 text-center">
      <p class="text-sm text-muted-foreground mb-4">Ethoz digitaliza y automatiza este protocolo en tiempo real.</p>
      <Button href="/demo">Solicitar demo gratuita</Button>
    </div>
  </div>
</main>

<div class="print:hidden">
  <Footer />
</div>

<style>
  @media print {
    :global(body) { font-size: 11px; color: #000; background: #fff; }
    main { padding: 0; }
  }
</style>
