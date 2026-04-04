<script lang="ts">
  import Footer from '$lib/components/Footer.svelte';
  import NavBar from '$lib/components/NavBar.svelte';
  import { Button } from '$lib/components/ui/button';
  import { t } from '$lib/i18n/index.svelte';
  import { MessageCircle, Mail, CalendarDays, Loader2 } from '@lucide/svelte';
  import { executeRecaptcha } from '$lib/utils/recaptcha';
  import { PUBLIC_RECAPTCHA_SITE_KEY } from '$env/static/public';

  // ── State ──
  let name = $state('');
  let email = $state('');
  let message = $state('');
  let submitting = $state(false);

  // ── Handlers ──
  async function handleSubmit(e: Event) {
    e.preventDefault();
    submitting = true;

    await executeRecaptcha('submit_contact');

    if (import.meta.env.DEV) {
      console.log('[Contact] Form submitted:', { name, email, message });
    }

    setTimeout(() => {
      submitting = false;
      name = '';
      email = '';
      message = '';
    }, 600);
  }
</script>

<svelte:head>
  <title>{t('contact.meta.title')}</title>
  <script src="https://www.google.com/recaptcha/api.js?render={PUBLIC_RECAPTCHA_SITE_KEY}" async defer></script>
  <meta property="og:url" content="https://ethoz.cl/contact" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="Contacto — Ethoz" />
  <meta property="og:description" content="Contáctanos para saber más sobre Ethoz, la plataforma de seguridad escolar para Chile." />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Contacto — Ethoz" />
  <meta name="twitter:description" content="Contáctanos para saber más sobre Ethoz, la plataforma de seguridad escolar para Chile." />
  <link rel="canonical" href="https://ethoz.cl/contact" />
</svelte:head>

<main class="flex min-h-dvh flex-col bg-secondary pt-16">
  <NavBar />

  <!-- Content -->
  <div class="mx-auto w-full max-w-2xl px-4 py-12 sm:py-16">

    <!-- Heading -->
    <div class="mb-10 text-center">
      <h1 class="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        {t('contact.heading')}
      </h1>
      <p class="mt-3 text-base text-muted-foreground">
        {t('contact.subheading')}
      </p>
    </div>

    <!-- Contact methods grid -->
    <div class="mb-10 grid gap-4 sm:grid-cols-3">
      <!-- WhatsApp -->
      <a
        href="https://wa.me/56912345678"
        target="_blank"
        rel="noopener noreferrer"
        class="group flex flex-col items-center gap-3 rounded-xl border border-border bg-background p-6 text-center shadow-sm transition-all hover:border-primary/40 hover:shadow-md"
      >
        <div class="flex size-12 items-center justify-center rounded-full bg-primary/10 transition-colors group-hover:bg-primary/20">
          <MessageCircle class="size-6 text-primary" />
        </div>
        <div>
          <p class="text-sm font-semibold text-foreground">{t('contact.whatsapp.label')}</p>
          <p class="mt-0.5 text-xs text-muted-foreground">+56 9 1234 5678</p>
          <p class="mt-1 text-xs text-primary">{t('contact.whatsapp.desc')}</p>
        </div>
      </a>

      <!-- Email -->
      <a
        href="mailto:contacto@ethoz.cl"
        class="group flex flex-col items-center gap-3 rounded-xl border border-border bg-background p-6 text-center shadow-sm transition-all hover:border-primary/40 hover:shadow-md"
      >
        <div class="flex size-12 items-center justify-center rounded-full bg-primary/10 transition-colors group-hover:bg-primary/20">
          <Mail class="size-6 text-primary" />
        </div>
        <div>
          <p class="text-sm font-semibold text-foreground">{t('contact.email.label')}</p>
          <p class="mt-0.5 text-xs text-muted-foreground">contacto@ethoz.cl</p>
          <p class="mt-1 text-xs text-primary">{t('contact.email.desc')}</p>
        </div>
      </a>

      <!-- Demo -->
      <a
        href="/demo"
        class="group flex flex-col items-center gap-3 rounded-xl border border-border bg-background p-6 text-center shadow-sm transition-all hover:border-primary/40 hover:shadow-md"
      >
        <div class="flex size-12 items-center justify-center rounded-full bg-primary/10 transition-colors group-hover:bg-primary/20">
          <CalendarDays class="size-6 text-primary" />
        </div>
        <div>
          <p class="text-sm font-semibold text-foreground">{t('contact.demo.label')}</p>
          <p class="mt-0.5 text-xs text-muted-foreground">ethoz.cl/demo</p>
          <p class="mt-1 text-xs text-primary">{t('contact.demo.desc')}</p>
        </div>
      </a>
    </div>

    <!-- Contact form -->
    <div class="rounded-xl border border-border bg-background p-6 shadow-sm sm:p-8">
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
            class="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
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
            class="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
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
            class="w-full resize-none rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
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

        <p class="text-center text-[10px] text-muted-foreground">
          {t('contact.recaptcha')}
        </p>
      </form>
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
