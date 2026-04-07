<script lang="ts">
  import Footer from '$lib/components/Footer.svelte';
  import NavBar from '$lib/components/NavBar.svelte';
  import { Button } from '$lib/components/ui/button';
  import { t } from '$lib/i18n/index.svelte';
  import { Mail, CalendarDays, Loader2, Check } from '@lucide/svelte';
  import { CONTACT } from '$lib/config';
  import { saveLead } from '$lib/supabase';
  import { trackEvent } from '$lib/utils/analytics';

  // ── State ──
  let name = $state('');
  let email = $state('');
  let message = $state('');
  let submitting = $state(false);
  let submitted = $state(false);
  let errorMessage = $state('');

  // ── Handlers ──
  async function handleSubmit(e: Event) {
    e.preventDefault();
    submitting = true;
    errorMessage = '';

    // Save to Supabase as a lead
    const result = await saveLead({
      school_name: '',
      contact_name: name,
      contact_role: 'contact_form',
      contact_email: email,
      contact_source: 'contact_page',
      notes: message,
      status: 'new',
    });

    if (!result.ok) {
      console.error('[Contact] Lead save failed:', result.error);
      errorMessage = 'No pudimos enviar tu mensaje. Por favor intenta de nuevo.';
      submitting = false;
      return;
    }

    trackEvent('contact_form_submitted', { email });

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
  <meta name="description" content="Contacta al equipo de Ethoz. Escríbenos por WhatsApp, email o agenda una demo para tu colegio." />
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
    <div class="mb-10 grid gap-3 sm:grid-cols-3">
      <a
        href={CONTACT.whatsapp.link}
        target="_blank"
        rel="noopener noreferrer"
        class="group flex items-center gap-3 rounded-xl border border-border bg-background p-4 shadow-sm transition-all hover:border-primary/40 hover:shadow-md sm:flex-col sm:items-center sm:gap-2 sm:p-5 sm:text-center"
      >
        <div class="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#25D366]/10 transition-colors group-hover:bg-[#25D366]/20 sm:size-11">
          <svg viewBox="0 0 24 24" fill="currentColor" class="size-5 text-[#25D366]"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
        </div>
        <div>
          <p class="text-sm font-semibold text-foreground">{t('contact.whatsapp.label')}</p>
          <p class="text-xs text-muted-foreground">{CONTACT.whatsapp.display}</p>
        </div>
      </a>

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
          <p class="mt-2 rounded-lg bg-destructive/10 px-4 py-2.5 text-center text-sm text-destructive">{errorMessage}</p>
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
