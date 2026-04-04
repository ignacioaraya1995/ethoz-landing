<script lang="ts">
  import Footer from '$lib/components/Footer.svelte';
  import NavBar from '$lib/components/NavBar.svelte';
  import { t } from '$lib/i18n/index.svelte';
  import { Check, Building, MapPin, Loader2 } from '@lucide/svelte';
  import { page } from '$app/stores';
  import { browser } from '$app/environment';
  import { trackEvent } from '$lib/utils/analytics';

  // Read pre-filled data from URL params (client-side only — url.search not available during SSR prerender)
  const params = $derived(browser ? new URLSearchParams($page.url.search) : new URLSearchParams());
  const schoolName = $derived(params.get('school') ?? '');
  const contactName = $derived(params.get('name') ?? '');
  const contactEmail = $derived(params.get('email') ?? '');
  const commune = $derived(params.get('commune') ?? '');
  const region = $derived(params.get('region') ?? '');

  // Build calendar URL with pre-filled guest email
  const baseCalendarUrl = 'https://calendar.google.com/calendar/appointments/schedules/AcZssZ3AWVV5Nbr09v_eFMsBEptzINDk90MRU34coEH33h8siGSeeAGoNboVLfNCxRAStSCmi7Ee4p3u';
  const calendarUrl = $derived.by(() => {
    const url = new URL(baseCalendarUrl);
    url.searchParams.set('gv', 'true');
    if (contactEmail) url.searchParams.set('email', contactEmail);
    if (contactName) url.searchParams.set('name', contactName);
    return url.toString();
  });

  let iframeLoaded = $state(false);

  $effect(() => {
    trackEvent('agendar_page_viewed', { school: schoolName });
  });
</script>

<svelte:head>
  <title>Agendar Demo — Ethoz</title>
  <meta name="description" content="Agenda una demostración personalizada de Ethoz para tu colegio." />
  <meta property="og:url" content="https://ethoz.cl/schedule" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="Agendar Demo — Ethoz" />
  <meta property="og:description" content="Agenda una demostración personalizada de Ethoz para tu colegio." />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Agendar Demo — Ethoz" />
  <meta name="twitter:description" content="Agenda una demostración personalizada de Ethoz para tu colegio." />
  <link rel="canonical" href="https://ethoz.cl/schedule" />
</svelte:head>

<main class="flex min-h-dvh flex-col bg-secondary">
  <NavBar />

  <!-- Content -->
  <div class="mx-auto w-full max-w-5xl flex-1 px-4 py-12 pt-24 sm:py-16 sm:pt-24">
    <!-- Success banner -->
    {#if schoolName || contactName || contactEmail}
      <div class="mb-8 flex items-start gap-4 rounded-xl border border-success/20 bg-success/5 p-5">
        <div class="flex size-10 shrink-0 items-center justify-center rounded-full bg-success/10">
          <Check class="size-5 text-success" />
        </div>
        <div>
          <h2 class="text-base font-semibold text-foreground">{t('agendar.received')}</h2>
          <div class="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <span class="flex items-center gap-1.5">
              <Building class="size-3.5" />
              {schoolName}
            </span>
            {#if commune}
              <span class="flex items-center gap-1.5">
                <MapPin class="size-3.5" />
                {commune}{region ? `, ${region}` : ''}
              </span>
            {/if}
            {#if contactName}
              <span>{contactName}</span>
            {/if}
            {#if contactEmail}
              <span class="text-primary">{contactEmail}</span>
            {/if}
          </div>
        </div>
      </div>
    {/if}

    <!-- Heading -->
    <div class="mb-8 text-center">
      <h1 class="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
        {t('agendar.title')}
      </h1>
      <p class="mt-2 text-sm text-muted-foreground">
        {t('agendar.subtitle')}
      </p>
    </div>

    <!-- Google Calendar embed -->
    <div class="relative overflow-hidden rounded-xl border border-border bg-background shadow-sm">
      {#if !iframeLoaded}
        <div class="absolute inset-0 flex items-center justify-center bg-background">
          <div class="flex flex-col items-center gap-3">
            <Loader2 class="size-8 animate-spin text-primary" />
            <p class="text-sm text-muted-foreground">Cargando calendario...</p>
          </div>
        </div>
      {/if}
      <iframe
        src={calendarUrl}
        class="h-[650px] w-full border-0"
        title="Agendar demo de Ethoz"
        loading="lazy"
        onload={() => { iframeLoaded = true; }}
      ></iframe>
    </div>
  </div>

  <Footer />
</main>
