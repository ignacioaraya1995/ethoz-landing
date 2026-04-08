<script lang="ts">
  import NavBar from '$lib/components/NavBar.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import { Button } from '$lib/components/ui/button';
  import { saveLead } from '$lib/supabase';
  import { executeRecaptcha, getRecaptchaScriptUrl } from '$lib/utils/recaptcha';
  import { trackEvent } from '$lib/utils/analytics';
  import { browser } from '$app/environment';
  import { Calendar, Clock, Users, BookOpen, Shield, CheckCircle, Play, Loader2 } from '@lucide/svelte';

  // ── State ──
  let name = $state('');
  let email = $state('');
  let school = $state('');
  let role = $state('');
  let submitting = $state(false);
  let submitted = $state(false);
  let errorMessage = $state('');

  const topics = [
    {
      month: 'Abril 2026',
      title: 'Introducción a la Ley 21.719: qué cambia para los colegios',
      description: 'Resumen ejecutivo de la ley, plazos clave, multas y primeros pasos para no entrar en pánico.',
      tag: 'Fundamentos'
    },
    {
      month: 'Mayo 2026',
      title: 'Cómo implementar el protocolo de retiros seguros',
      description: 'Paso a paso para digitalizar el control de retiros y reducir el riesgo operacional en la portería.',
      tag: 'Operaciones'
    },
    {
      month: 'Junio 2026',
      title: 'Gestión de consentimientos y derechos ARCO+P',
      description: 'Cómo obtener, registrar y gestionar consentimientos de apoderados conforme a la ley.',
      tag: 'Legal'
    },
    {
      month: 'Julio 2026',
      title: 'Roles, permisos y acceso mínimo: buenas prácticas para sistemas escolares',
      description: 'Cómo configurar los accesos en su ERP escolar para cumplir con el principio de mínimo privilegio.',
      tag: 'Tecnología'
    }
  ];

  const learnings = [
    'Qué exige exactamente la Ley 21.719 a los establecimientos educacionales',
    'Las multas reales que enfrentan los sostenedores que no cumplan antes de diciembre 2026',
    'Cómo priorizar los cambios sin necesidad de un equipo legal propio',
    'Herramientas y plantillas gratuitas para comenzar hoy',
    'Casos prácticos de colegios chilenos que ya están en proceso de cumplimiento',
    'Respuestas en vivo a las preguntas más frecuentes de directores y sostenedores'
  ];

  // ── Load reCAPTCHA ──
  $effect(() => {
    if (!browser) return;
    const src = getRecaptchaScriptUrl();
    if (!src || document.querySelector(`script[src="${src}"]`)) return;
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    document.head.appendChild(script);
  });

  // ── Submit ──
  async function handleSubmit(e: Event) {
    e.preventDefault();
    submitting = true;
    errorMessage = '';

    const recaptchaToken = await executeRecaptcha('webinar_register');

    const result = await saveLead({
      school_name: school,
      contact_name: name,
      contact_role: role,
      contact_email: email,
      contact_source: 'webinar_page',
      notes: `Registro webinar. Rol: ${role}`,
      status: 'new',
    }, recaptchaToken);

    if (!result.ok) {
      errorMessage = 'No pudimos registrar tu inscripción. Por favor intenta de nuevo.';
      submitting = false;
      return;
    }

    trackEvent('webinar_registered', { role, school });
    submitting = false;
    submitted = true;
    name = '';
    email = '';
    school = '';
    role = '';
  }
</script>

<svelte:head>
  <title>Webinar gratuito: Ley 21.719 explicada para colegios | Ethoz</title>
  <meta name="description" content="Webinar mensual gratuito sobre la Ley 21.719 para directores, inspectores y sostenedores de colegios chilenos. Inscríbete gratis." />
  <meta property="og:url" content="https://ethoz.cl/webinar" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="Webinar gratuito: Ley 21.719 para colegios | Ethoz" />
  <meta property="og:description" content="Webinar mensual gratuito para directores y sostenedores de colegios chilenos. Aprende a cumplir con la Ley 21.719 antes de diciembre 2026." />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Webinar gratuito Ley 21.719 | Ethoz" />
  <meta name="twitter:description" content="Webinar mensual para colegios chilenos sobre la Ley 21.719." />
  <link rel="canonical" href="https://ethoz.cl/webinar" />
  {@html `<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Event",
    "name": "Webinar mensual gratuito: Ley 21.719 explicada para colegios",
    "description": "Webinar mensual gratuito para directores, inspectores y sostenedores de colegios chilenos sobre la Ley 21.719 de Protección de Datos.",
    "url": "https://ethoz.cl/webinar",
    "organizer": { "@type": "Organization", "name": "Ethoz", "url": "https://ethoz.cl" },
    "eventAttendanceMode": "https://schema.org/OnlineEventAttendanceMode",
    "isAccessibleForFree": true
  })}</script>`}
</svelte:head>

<main class="flex min-h-dvh flex-col bg-background">
  <NavBar />

  <!-- Hero -->
  <section class="mx-auto max-w-7xl px-4 pt-28 pb-16 sm:pt-36 sm:pb-20">
    <div class="grid gap-12 lg:grid-cols-2 lg:items-start">

      <!-- Left: content -->
      <div>
        <div class="inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-4 py-1.5 text-xs font-medium text-muted-foreground mb-6">
          <Calendar class="size-3.5" />
          Webinar mensual · Gratuito · Online
        </div>
        <h1 class="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl mb-5">
          Ley 21.719 explicada para colegios
        </h1>
        <p class="text-lg text-muted-foreground mb-6 leading-relaxed">
          Cada mes, el equipo de Ethoz conduce una sesión en vivo para directores, inspectores y sostenedores. Sin tecnicismos, con ejemplos reales de establecimientos chilenos.
        </p>

        <!-- Next date -->
        <div class="flex items-center gap-3 rounded-xl border border-border bg-card p-4 mb-6">
          <div class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <Calendar class="size-5 text-primary" />
          </div>
          <div>
            <p class="text-xs text-muted-foreground">Próximo webinar</p>
            <p class="font-semibold text-foreground">Por confirmar — inscríbete para recibir la fecha</p>
          </div>
        </div>

        <div class="flex items-center gap-4 text-sm text-muted-foreground">
          <span class="flex items-center gap-1.5"><Clock class="size-4" /> 60 minutos + preguntas</span>
          <span class="flex items-center gap-1.5"><Users class="size-4" /> Cupos limitados</span>
        </div>

        <!-- What you'll learn -->
        <div class="mt-8">
          <h2 class="font-semibold text-foreground mb-4 flex items-center gap-2">
            <BookOpen class="size-4 text-primary" />
            Lo que aprenderás
          </h2>
          <ul class="space-y-2.5">
            {#each learnings as item}
              <li class="flex items-start gap-2.5 text-sm text-muted-foreground">
                <CheckCircle class="size-4 text-success shrink-0 mt-0.5" />
                {item}
              </li>
            {/each}
          </ul>
        </div>

        <!-- Speaker -->
        <div class="mt-8 flex items-center gap-4 rounded-xl border border-border bg-card p-4">
          <div class="flex size-12 shrink-0 items-center justify-center rounded-full bg-muted text-lg font-bold text-muted-foreground">E</div>
          <div>
            <p class="font-medium text-foreground">Equipo Ethoz</p>
            <p class="text-xs text-muted-foreground">Especialistas en protección de datos y seguridad escolar. Trabajamos con sostenedores y establecimientos de todo Chile.</p>
          </div>
        </div>
      </div>

      <!-- Right: registration form -->
      <div id="form" class="lg:sticky lg:top-24">
        <div class="rounded-2xl border border-border bg-card p-8 shadow-sm">
          {#if submitted}
            <div class="text-center py-6">
              <div class="flex justify-center mb-4">
                <CheckCircle class="size-12 text-success" />
              </div>
              <h3 class="text-xl font-semibold text-foreground mb-2">¡Inscripción confirmada!</h3>
              <p class="text-muted-foreground text-sm">
                Te enviaremos el enlace y recordatorio al correo registrado en cuanto confirmemos la fecha del próximo webinar.
              </p>
              <Button href="/recursos" variant="outline" class="mt-6">Ver recursos gratuitos</Button>
            </div>
          {:else}
            <h2 class="text-xl font-semibold text-foreground mb-1">Inscríbete gratis</h2>
            <p class="text-sm text-muted-foreground mb-6">Recibirás el enlace y recordatorio por correo.</p>

            <form onsubmit={handleSubmit} class="space-y-4">
              <div>
                <label for="webinar-name" class="block text-xs font-medium text-foreground mb-1.5">Nombre completo <span class="text-destructive">*</span></label>
                <input
                  id="webinar-name"
                  type="text"
                  bind:value={name}
                  required
                  placeholder="Ej: María González"
                  class="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                />
              </div>

              <div>
                <label for="webinar-email" class="block text-xs font-medium text-foreground mb-1.5">Correo electrónico <span class="text-destructive">*</span></label>
                <input
                  id="webinar-email"
                  type="email"
                  bind:value={email}
                  required
                  placeholder="tu@colegio.cl"
                  class="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                />
              </div>

              <div>
                <label for="webinar-school" class="block text-xs font-medium text-foreground mb-1.5">Nombre del colegio o red</label>
                <input
                  id="webinar-school"
                  type="text"
                  bind:value={school}
                  placeholder="Ej: Colegio San Ignacio"
                  class="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                />
              </div>

              <div>
                <label for="webinar-role" class="block text-xs font-medium text-foreground mb-1.5">Tu rol en el establecimiento</label>
                <select
                  id="webinar-role"
                  bind:value={role}
                  class="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                >
                  <option value="">Selecciona tu rol</option>
                  <option value="director">Director(a)</option>
                  <option value="inspector">Inspector(a) General</option>
                  <option value="utp">UTP</option>
                  <option value="sostenedor">Sostenedor / Administrador</option>
                  <option value="asesor">Asesor / Consultor</option>
                  <option value="otro">Otro</option>
                </select>
              </div>

              {#if errorMessage}
                <p class="text-sm text-destructive">{errorMessage}</p>
              {/if}

              <Button type="submit" size="lg" class="w-full gap-2" disabled={submitting}>
                {#if submitting}
                  <Loader2 class="size-4 animate-spin" />
                  Inscribiendo...
                {:else}
                  Inscribirme al webinar gratuito
                {/if}
              </Button>

              <p class="text-[11px] text-muted-foreground text-center">Sin spam. Puedes darte de baja en cualquier momento.</p>
            </form>
          {/if}
        </div>
      </div>
    </div>
  </section>

  <!-- Topics -->
  <section class="border-t border-border bg-muted/20">
    <div class="mx-auto max-w-7xl px-4 py-16 sm:py-20">
      <div class="mb-10 text-center">
        <h2 class="text-2xl font-bold tracking-tight text-foreground mb-3">Calendario de temas 2026</h2>
        <p class="text-muted-foreground">Cada mes abordamos un aspecto distinto de la Ley 21.719 con casos prácticos.</p>
      </div>
      <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {#each topics as topic, i}
          <div class="rounded-xl border border-border bg-card p-5">
            <div class="flex items-center gap-2 mb-3">
              <span class="flex size-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">{i + 1}</span>
              <span class="text-xs text-muted-foreground">{topic.month}</span>
            </div>
            <span class="mb-2 inline-block rounded-full bg-secondary px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">{topic.tag}</span>
            <h3 class="font-semibold text-foreground text-sm mb-2 leading-snug">{topic.title}</h3>
            <p class="text-xs text-muted-foreground leading-relaxed">{topic.description}</p>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- Previous webinars placeholder -->
  <section class="mx-auto max-w-7xl px-4 py-16 sm:py-20 text-center">
    <div class="rounded-2xl border border-dashed border-border bg-muted/10 p-12">
      <Play class="size-10 text-muted-foreground mx-auto mb-4" />
      <h2 class="text-xl font-semibold text-foreground mb-2">Grabaciones anteriores</h2>
      <p class="text-muted-foreground mb-6 max-w-md mx-auto text-sm">Estamos preparando la biblioteca de grabaciones. Las sesiones grabadas estarán disponibles próximamente para todos los inscritos.</p>
      <Button href="/webinar#form" variant="outline" size="lg">Inscríbete para acceso anticipado</Button>
    </div>
  </section>

  <!-- Bottom CTA -->
  <section class="border-t border-border bg-muted/20">
    <div class="mx-auto max-w-4xl px-4 py-12 text-center">
      <h2 class="text-xl font-semibold text-foreground mb-2">¿Prefieres una demo personalizada?</h2>
      <p class="text-muted-foreground mb-6 text-sm">Agenda una llamada de 30 minutos con el equipo de Ethoz para revisar el estado de tu establecimiento.</p>
      <Button href="/demo" size="lg">Solicitar demo gratuita</Button>
    </div>
  </section>

  <Footer />
</main>
