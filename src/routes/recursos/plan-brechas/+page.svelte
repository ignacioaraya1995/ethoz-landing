<script lang="ts">
  import NavBar from '$lib/components/NavBar.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import { Button } from '$lib/components/ui/button';
  import { Printer, ArrowLeft } from '@lucide/svelte';
</script>

<svelte:head>
  <title>Plan de Respuesta a Brechas de Datos — Plantilla gratuita | Ethoz</title>
  <meta name="description" content="Plantilla de plan de respuesta a brechas de datos personales para colegios chilenos. Notificación en 72 horas según Art. 30 Ley 21.719. Descarga gratis." />
  <meta property="og:url" content="https://ethoz.cl/recursos/plan-brechas" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="Plan de Respuesta a Brechas de Datos | Ethoz" />
  <meta property="og:description" content="Plantilla completa para gestionar brechas de datos en colegios chilenos conforme a la Ley 21.719." />
  <link rel="canonical" href="https://ethoz.cl/recursos/plan-brechas" />
  {@html `<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "Plan de Respuesta a Brechas de Datos",
    "description": "Plantilla para gestionar brechas de datos personales en colegios chilenos conforme al Art. 30 de la Ley 21.719.",
    "url": "https://ethoz.cl/recursos/plan-brechas",
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
    <div class="mb-10 border-b border-border pb-8">
      <div class="flex items-center gap-3 mb-3 print:hidden">
        <span class="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">Incidentes</span>
        <span class="text-xs text-muted-foreground">Art. 30 Ley 21.719 · 72 horas para notificar</span>
      </div>
      <h1 class="text-3xl font-bold tracking-tight text-foreground mb-3">Plan de Respuesta a Brechas de Datos</h1>
      <p class="text-muted-foreground">Plantilla para gestionar incidentes de seguridad que involucren datos personales. La Ley 21.719 exige notificación a la autoridad competente dentro de <strong>72 horas</strong> desde que se detecta la brecha.</p>
      <p class="mt-3 text-xs text-muted-foreground">Elaborado por Ethoz · ethoz.cl · Complete los campos [en corchetes] con datos de su establecimiento</p>
    </div>

    <div class="space-y-10 text-sm leading-relaxed">

      <!-- 1. Equipo de respuesta -->
      <section>
        <h2 class="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
          <span class="flex size-6 items-center justify-center rounded-full bg-foreground text-background text-xs font-bold">1</span>
          Equipo de Respuesta a Incidentes
        </h2>
        <div class="overflow-x-auto rounded-xl border border-border">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-border bg-muted/50">
                <th class="px-4 py-2.5 text-left font-medium text-foreground">Rol</th>
                <th class="px-4 py-2.5 text-left font-medium text-foreground">Nombre</th>
                <th class="px-4 py-2.5 text-left font-medium text-foreground">Teléfono</th>
                <th class="px-4 py-2.5 text-left font-medium text-foreground">Correo</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-border text-muted-foreground">
              <tr><td class="px-4 py-2.5 font-medium text-foreground">Responsable principal (DPO)</td><td class="px-4 py-2.5">[Nombre]</td><td class="px-4 py-2.5">[Teléfono]</td><td class="px-4 py-2.5">[Email]</td></tr>
              <tr><td class="px-4 py-2.5 font-medium text-foreground">Director(a)</td><td class="px-4 py-2.5">[Nombre]</td><td class="px-4 py-2.5">[Teléfono]</td><td class="px-4 py-2.5">[Email]</td></tr>
              <tr><td class="px-4 py-2.5 font-medium text-foreground">Encargado TI / Proveedor</td><td class="px-4 py-2.5">[Nombre]</td><td class="px-4 py-2.5">[Teléfono]</td><td class="px-4 py-2.5">[Email]</td></tr>
              <tr><td class="px-4 py-2.5 font-medium text-foreground">Asesor legal</td><td class="px-4 py-2.5">[Nombre / Firma]</td><td class="px-4 py-2.5">[Teléfono]</td><td class="px-4 py-2.5">[Email]</td></tr>
              <tr><td class="px-4 py-2.5 font-medium text-foreground">Comunicaciones</td><td class="px-4 py-2.5">[Nombre]</td><td class="px-4 py-2.5">[Teléfono]</td><td class="px-4 py-2.5">[Email]</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- 2. Clasificación -->
      <section>
        <h2 class="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
          <span class="flex size-6 items-center justify-center rounded-full bg-foreground text-background text-xs font-bold">2</span>
          Clasificación de Brechas
        </h2>
        <div class="space-y-3">
          <div class="rounded-lg border border-success/20 bg-success/10   p-4">
            <div class="flex items-center gap-2 mb-2">
              <span class="rounded-full bg-success px-2.5 py-0.5 text-[11px] font-bold text-white">LEVE</span>
              <span class="text-xs text-muted-foreground">Notificación interna. Sin obligación de notificar a autoridad si no hay riesgo significativo.</span>
            </div>
            <p class="text-sm text-muted-foreground">Acceso no autorizado a datos básicos de identificación por un tiempo muy limitado, sin evidencia de exfiltración. Ej: un funcionario accede por error a datos de otro curso. Contención posible en horas.</p>
          </div>
          <div class="rounded-lg border border-warning/20 bg-warning/10 p-4">
            <div class="flex items-center gap-2 mb-2">
              <span class="rounded-full bg-warning px-2.5 py-0.5 text-[11px] font-bold text-white">GRAVE</span>
              <span class="text-xs text-muted-foreground">Notificación a autoridad en 72 horas. Posible comunicación a afectados.</span>
            </div>
            <p class="text-sm text-muted-foreground">Acceso no autorizado a datos académicos o de contacto de un grupo de alumnos o apoderados. Posible exfiltración de datos. Ej: ataque de phishing que compromete credenciales de un docente. Riesgo de discriminación o fraude.</p>
          </div>
          <div class="rounded-lg border border-destructive/20 bg-destructive/10   p-4">
            <div class="flex items-center gap-2 mb-2">
              <span class="rounded-full bg-destructive px-2.5 py-0.5 text-[11px] font-bold text-white">GRAVÍSIMA</span>
              <span class="text-xs text-muted-foreground">Notificación urgente en 72 horas. Comunicación inmediata a afectados y medios si es masiva.</span>
            </div>
            <p class="text-sm text-muted-foreground">Exposición masiva de datos sensibles (médicos, judiciales, emocionales) o datos de menores. Ransomware con cifrado de todos los datos. Publicación pública de datos personales. Riesgo de daño físico o psicológico a alumnos.</p>
          </div>
        </div>
      </section>

      <!-- 3. Procedimiento 72 horas -->
      <section>
        <h2 class="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
          <span class="flex size-6 items-center justify-center rounded-full bg-foreground text-background text-xs font-bold">3</span>
          Procedimiento de Notificación en 72 Horas (Art. 30 Ley 21.719)
        </h2>
        <div class="space-y-3">
          {#each [
            { time: 'Hora 0', title: 'Detección y alerta interna', detail: 'El incidente es detectado por el sistema, un funcionario o un tercero. Se activa inmediatamente el equipo de respuesta. Se documenta la hora exacta de detección. CRÍTICO: El plazo de 72 horas comienza desde este momento.' },
            { time: 'H+2', title: 'Evaluación inicial', detail: 'El DPO y el encargado TI evalúan el alcance preliminar: qué datos están comprometidos, cuántos titulares afectados, si la brecha está activa o contenida. Se clasifica el nivel de gravedad.' },
            { time: 'H+4', title: 'Contención', detail: 'Se toman medidas para detener la brecha: desconexión de sistemas afectados, revocación de credenciales comprometidas, bloqueo de accesos. Se preservan evidencias forenses (no eliminar logs).' },
            { time: 'H+12', title: 'Evaluación de impacto', detail: 'Análisis detallado: categorías de datos afectados, número de titulares, probabilidad y gravedad del daño. Determina si es obligatorio notificar a la autoridad y a los afectados.' },
            { time: 'H+24', title: 'Notificación al Director y Sostenedor', detail: 'Informe ejecutivo al director y sostenedor con resumen del incidente, medidas tomadas y plan de acción. Si hay menores involucrados, se evalúa notificación a SENAME o tribunales.' },
            { time: 'H+48', title: 'Preparación de notificación a autoridad', detail: 'Se redacta el reporte oficial usando la plantilla de la sección 7. Se incluye: descripción de la brecha, datos afectados, medidas de contención, riesgos identificados, medidas correctivas.' },
            { time: 'H+72', title: 'Notificación a la Agencia de Protección de Datos', detail: 'Envío del reporte oficial a la autoridad competente dentro del plazo legal. Si la Agencia aún no está operativa, se documenta el intento y se notifica en cuanto sea posible. Se guarda acuse de recibo.' },
          ] as step}
            <div class="flex gap-4 rounded-lg border border-border bg-card p-4">
              <div class="shrink-0 w-12 text-right">
                <span class="text-xs font-mono font-bold text-primary">{step.time}</span>
              </div>
              <div class="flex-1">
                <p class="font-medium text-foreground mb-1">{step.title}</p>
                <p class="text-sm text-muted-foreground">{step.detail}</p>
              </div>
            </div>
          {/each}
        </div>
      </section>

      <!-- 4. Evaluación de impacto -->
      <section>
        <h2 class="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
          <span class="flex size-6 items-center justify-center rounded-full bg-foreground text-background text-xs font-bold">4</span>
          Evaluación de Impacto
        </h2>
        <p class="text-muted-foreground mb-3">Para determinar la gravedad de la brecha, evalúe los siguientes factores:</p>
        <div class="overflow-x-auto rounded-xl border border-border">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-border bg-muted/50">
                <th class="px-4 py-2.5 text-left font-medium">Factor</th>
                <th class="px-4 py-2.5 text-left font-medium">Bajo (1)</th>
                <th class="px-4 py-2.5 text-left font-medium">Medio (2)</th>
                <th class="px-4 py-2.5 text-left font-medium">Alto (3)</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-border text-muted-foreground text-xs">
              <tr><td class="px-4 py-2.5 font-medium text-foreground">Tipo de datos</td><td class="px-4 py-2.5">Datos básicos de identificación</td><td class="px-4 py-2.5">Datos académicos, contacto</td><td class="px-4 py-2.5">Datos sensibles, médicos, menores</td></tr>
              <tr><td class="px-4 py-2.5 font-medium text-foreground">Número de afectados</td><td class="px-4 py-2.5">Menos de 10 personas</td><td class="px-4 py-2.5">Entre 10 y 100 personas</td><td class="px-4 py-2.5">Más de 100 personas</td></tr>
              <tr><td class="px-4 py-2.5 font-medium text-foreground">Daño potencial</td><td class="px-4 py-2.5">Molestia menor, sin consecuencias</td><td class="px-4 py-2.5">Discriminación, impacto reputacional</td><td class="px-4 py-2.5">Daño físico, psicológico o económico grave</td></tr>
              <tr><td class="px-4 py-2.5 font-medium text-foreground">Reversibilidad</td><td class="px-4 py-2.5">Totalmente reversible</td><td class="px-4 py-2.5">Parcialmente reversible</td><td class="px-4 py-2.5">Irreversible (datos ya publicados)</td></tr>
            </tbody>
          </table>
        </div>
        <p class="mt-2 text-xs text-muted-foreground">Puntaje total 4-6: Leve · 7-9: Grave · 10-12: Gravísima</p>
      </section>

      <!-- 5. Comunicación a afectados -->
      <section>
        <h2 class="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
          <span class="flex size-6 items-center justify-center rounded-full bg-foreground text-background text-xs font-bold">5</span>
          Comunicación a los Afectados
        </h2>
        <p class="text-muted-foreground mb-3">Cuando la brecha represente un alto riesgo para los derechos de los titulares, se les comunicará sin dilación indebida. La comunicación debe incluir:</p>
        <ul class="list-disc pl-6 space-y-1.5 text-muted-foreground">
          <li>Descripción clara de la naturaleza de la brecha (qué ocurrió, cuándo).</li>
          <li>Datos personales afectados (sin entrar en detalles que puedan agravar el riesgo).</li>
          <li>Medidas adoptadas para contener el incidente.</li>
          <li>Recomendaciones para que los afectados protejan sus datos (cambio de contraseñas, alertas de fraude).</li>
          <li>Datos de contacto del DPO para consultas.</li>
          <li>Vías de reclamación disponibles.</li>
        </ul>
      </section>

      <!-- 6. Documentación -->
      <section>
        <h2 class="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
          <span class="flex size-6 items-center justify-center rounded-full bg-foreground text-background text-xs font-bold">6</span>
          Documentación y Lecciones Aprendidas
        </h2>
        <p class="text-muted-foreground mb-3">Todo incidente debe quedar documentado en el registro de brechas del establecimiento, independientemente de su gravedad:</p>
        <div class="rounded-lg border border-border bg-card p-4 space-y-1.5 text-xs text-muted-foreground">
          <p><strong class="text-foreground">Fecha y hora de detección:</strong> ___________________________</p>
          <p><strong class="text-foreground">Fecha y hora de contención:</strong> ___________________________</p>
          <p><strong class="text-foreground">Causa raíz identificada:</strong> ___________________________</p>
          <p><strong class="text-foreground">Sistemas/personas afectadas:</strong> ___________________________</p>
          <p><strong class="text-foreground">Medidas correctivas implementadas:</strong> ___________________________</p>
          <p><strong class="text-foreground">Medidas preventivas para evitar recurrencia:</strong> ___________________________</p>
          <p><strong class="text-foreground">¿Se notificó a la autoridad? Fecha:</strong> ___________________________</p>
          <p><strong class="text-foreground">¿Se notificó a los afectados? Fecha:</strong> ___________________________</p>
          <p><strong class="text-foreground">Responsable del cierre del incidente:</strong> ___________________________</p>
        </div>
      </section>

      <!-- 7. Plantilla de reporte -->
      <section>
        <h2 class="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
          <span class="flex size-6 items-center justify-center rounded-full bg-foreground text-background text-xs font-bold">7</span>
          Plantilla de Reporte a la Autoridad
        </h2>
        <div class="rounded-xl border-2 border-dashed border-border bg-muted/20 p-6 space-y-4 text-sm text-muted-foreground">
          <p class="font-semibold text-foreground text-center">NOTIFICACIÓN DE BRECHA DE SEGURIDAD<br/>Conforme Art. 30, Ley 21.719</p>
          <div class="space-y-2">
            <p><strong class="text-foreground">1. Identificación del responsable:</strong><br/>[Nombre del establecimiento], RUT [___], DPO: [Nombre], Email: [___], Tel: [___]</p>
            <p><strong class="text-foreground">2. Fecha y hora de detección de la brecha:</strong><br/>[DD/MM/AAAA] a las [HH:MM]</p>
            <p><strong class="text-foreground">3. Descripción de la brecha:</strong><br/>[Descripción objetiva: qué ocurrió, cómo se detectó, sistemas involucrados]</p>
            <p><strong class="text-foreground">4. Categorías de datos personales afectados:</strong><br/>[Ej: datos de identificación de alumnos, datos académicos, datos de salud]</p>
            <p><strong class="text-foreground">5. Número aproximado de titulares afectados:</strong><br/>[Número estimado o exacto]</p>
            <p><strong class="text-foreground">6. Consecuencias probables de la brecha:</strong><br/>[Riesgos identificados para los titulares: discriminación, fraude, daño físico, etc.]</p>
            <p><strong class="text-foreground">7. Medidas adoptadas para hacer frente a la brecha:</strong><br/>[Medidas de contención, corrección y prevención implementadas]</p>
            <p><strong class="text-foreground">8. ¿Se ha comunicado a los titulares afectados?</strong><br/>☐ Sí, con fecha: [___] &nbsp;&nbsp; ☐ No (justificación: [___])</p>
            <p><strong class="text-foreground">9. Firma y fecha:</strong><br/>___________________________</p>
          </div>
        </div>
      </section>

    </div>

    <div class="print:hidden mt-10 text-center">
      <p class="text-sm text-muted-foreground mb-4">Ethoz detecta y gestiona brechas automáticamente, con alertas en tiempo real.</p>
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
