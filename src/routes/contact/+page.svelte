<script lang="ts">
  import Footer from '$lib/components/Footer.svelte';
  import NavBar from '$lib/components/NavBar.svelte';
  import { Button } from '$lib/components/ui/button';
  import { t } from '$lib/i18n/index.svelte';
  import { Mail, CalendarDays, Loader2, Check } from '@lucide/svelte';
  import { CONTACT } from '$lib/config';
  import { saveLead } from '$lib/supabase';
  import { trackEvent } from '$lib/utils/analytics';
  import { executeRecaptcha, getRecaptchaScriptUrl } from '$lib/utils/recaptcha';
  import { browser } from '$app/environment';

  // ── State ──
  let name = $state('');
  let email = $state('');
  let message = $state('');
  let submitting = $state(false);
  let submitted = $state(false);
  let errorMessage = $state('');
  let recaptchaFailed = $state(false);

  function captureError(err: unknown, context?: Record<string, unknown>) {
    if (!browser) return;
    import('@sentry/browser')
      .then((Sentry) => Sentry.captureException(err, { extra: context }))
      .catch(() => {});
  }

  const mailtoFallback = `mailto:${CONTACT.email.address}?subject=${encodeURIComponent('Contacto desde ethoz.cl')}`;

  // ── Load reCAPTCHA script ──
  $effect(() => {
    if (!browser) return;
    const src = getRecaptchaScriptUrl();
    if (!src || document.querySelector(`script[src="${src}"]`)) return;
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    document.head.appendChild(script);
  });

  // ── Handlers ──
  async function handleSubmit(e: Event) {
    e.preventDefault();
    if (submitting) return; // double-submit guard
    submitting = true;
    errorMessage = '';
    recaptchaFailed = false;

    let recaptchaToken: string | null = null;
    try {
      recaptchaToken = await executeRecaptcha('submit_contact');
    } catch (err) {
      captureError(err, { fn: 'contact.executeRecaptcha' });
      recaptchaFailed = true;
      errorMessage = 'No pudimos verificar que seas humano. Escríbenos directamente al correo indicado arriba.';
      submitting = false;
      return;
    }

    // Save to Supabase as a lead (with server-side reCAPTCHA verification)
    const result = await saveLead({
      school_name: '',
      contact_name: name,
      contact_role: 'contact_form',
      contact_email: email,
      contact_source: 'contact_page',
      notes: message,
      status: 'new',
    }, recaptchaToken);

    if (!result.ok) {
      console.error('[Contact] Lead save failed:', result.error);
      errorMessage = 'No pudimos enviar tu mensaje. Por favor intenta de nuevo.';
      submitting = false;
      return;
    }

    trackEvent('contact_form_submitted', { source: 'contact_page' });

    submitting = false;
    submitted = true;
    name = '';
    email = '';
    message = '';
  }
</script>

<svelte:head>
  <title>{t('contact.meta.title')}</title>
  <meta property="og:url" content="https://ethoz.cl/contact" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="Contacto — Ethoz" />
  <meta property="og:description" content="Contáctanos para saber más sobre Ethoz, la plataforma de seguridad escolar para Chile." />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Contacto — Ethoz" />
  <meta name="twitter:description" content="Contáctanos para saber más sobre Ethoz, la plataforma de seguridad escolar para Chile." />
  <meta name="description" content="Contacta al equipo de Ethoz. Escríbenos por email o agenda una demo para tu colegio." />
  <link rel="canonical" href="https://ethoz.cl/contact" />
  {@html `<script type="application/ld+json">${JSON.stringify({"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Inicio","item":"https://ethoz.cl/"},{"@type":"ListItem","position":2,"name":"Contacto"}]})}</script>`}
</svelte:head>

<main class="flex min-h-dvh flex-col bg-background">
  <NavBar />

  <!-- Content -->
  <div class="mx-auto flex-1 w-full max-w-2xl px-4 pt-28 pb-16 sm:pt-32 sm:pb-20">

    <!-- Heading -->
    <div class="mb-10 text-center">
      <h1 class="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        {t('contact.heading')}
      </h1>
      <p class="mt-3 text-base text-muted-foreground">
        {t('contact.subheading')}
      </p>
    </div>

    <!-- Contact methods -->
    <div class="mb-10 grid gap-3 sm:grid-cols-2">
      <a
        href={CONTACT.email.link}
        class="group flex items-center gap-3 rounded-xl border border-border bg-background p-4 shadow-sm transition-all hover:border-primary/40 hover:shadow-md sm:flex-col sm:items-center sm:gap-2 sm:p-5 sm:text-center"
      >
        <div class="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 transition-colors group-hover:bg-primary/20 sm:size-11">
          <Mail class="size-5 text-primary" />
        </div>
        <div>
          <p class="text-sm font-semibold text-foreground">{t('contact.email.label')}</p>
          <p class="text-xs text-muted-foreground">{CONTACT.email.address}</p>
        </div>
      </a>

      <a
        href="/demo"
        class="group flex items-center gap-3 rounded-xl border border-border bg-background p-4 shadow-sm transition-all hover:border-primary/40 hover:shadow-md sm:flex-col sm:items-center sm:gap-2 sm:p-5 sm:text-center"
      >
        <div class="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 transition-colors group-hover:bg-primary/20 sm:size-11">
          <CalendarDays class="size-5 text-primary" />
        </div>
        <div>
          <p class="text-sm font-semibold text-foreground">{t('contact.demo.label')}</p>
          <p class="text-xs text-muted-foreground">ethoz.cl/demo</p>
        </div>
      </a>
    </div>

    <!-- Contact form -->
    <div class="rounded-xl border border-border bg-background p-6 shadow-sm">
      {#if submitted}
        <div class="flex flex-col items-center gap-3 py-8 text-center">
          <div class="flex size-12 items-center justify-center rounded-full bg-success/10">
            <Check class="size-6 text-success" />
          </div>
          <h2 class="text-lg font-semibold text-foreground">{t('contact.form.success.title')}</h2>
          <p class="text-sm text-muted-foreground">{t('contact.form.success.message')}</p>
        </div>
      {:else}
      <h2 class="mb-6 text-lg font-semibold text-foreground">
        {t('contact.form.title')}
      </h2>

      <form onsubmit={handleSubmit} class="space-y-4">
        <!-- Name -->
        <div class="space-y-1.5">
          <label for="contact-name" class="block text-sm font-medium text-foreground">
            {t('contact.form.name')} <span class="text-destructive">*</span>
          </label>
          <input
            id="contact-name"
            type="text"
            required
            bind:value={name}
            placeholder={t('contact.form.name.placeholder')}
            autocomplete="name"
            class="w-full rounded-lg border border-border bg-background px-4 py-3 text-base text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <!-- Email -->
        <div class="space-y-1.5">
          <label for="contact-email" class="block text-sm font-medium text-foreground">
            {t('contact.form.email')} <span class="text-destructive">*</span>
          </label>
          <input
            id="contact-email"
            type="email"
            required
            bind:value={email}
            placeholder={t('contact.form.email.placeholder')}
            autocomplete="email"
            class="w-full rounded-lg border border-border bg-background px-4 py-3 text-base text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <!-- Message -->
        <div class="space-y-1.5">
          <label for="contact-message" class="block text-sm font-medium text-foreground">
            {t('contact.form.message')} <span class="text-destructive">*</span>
          </label>
          <textarea
            id="contact-message"
            required
            bind:value={message}
            placeholder={t('contact.form.message.placeholder')}
            rows={4}
            class="w-full resize-none rounded-lg border border-border bg-background px-4 py-3 text-base text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
          ></textarea>
        </div>

        <Button
          type="submit"
          size="xl"
          class="w-full"
          disabled={submitting || !name.trim() || !email.trim() || !message.trim()}
        >
          {#if submitting}
            <Loader2 class="size-4 animate-spin" />
            {t('contact.form.submitting')}
          {:else}
            {t('contact.form.submit')}
          {/if}
        </Button>
        {#if errorMessage}
          <div class="mt-2 rounded-lg bg-destructive/10 px-4 py-2.5 text-center text-sm text-destructive">
            <p>{errorMessage}</p>
            {#if recaptchaFailed}
              <a
                href={mailtoFallback}
                class="mt-1 inline-block font-medium underline underline-offset-2 hover:text-destructive/80"
              >
                Escribir por correo →
              </a>
            {/if}
          </div>
        {/if}

      </form>
      {/if}
    </div>

    <!-- CTA -->
    <div class="mt-8 rounded-xl border border-dashed border-border bg-background/50 px-6 py-5 text-center">
      <p class="text-sm text-muted-foreground">{t('contact.cta.label')}</p>
      <a
        href="/demo"
        class="mt-2 inline-block text-sm font-medium text-primary transition-colors hover:text-primary/70"
      >
        {t('contact.cta.link')}
      </a>
    </div>
  </div>

  <Footer />
</main>
