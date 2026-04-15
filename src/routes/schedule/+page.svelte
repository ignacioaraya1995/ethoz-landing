<script lang="ts">
  import Footer from '$lib/components/Footer.svelte';
  import NavBar from '$lib/components/NavBar.svelte';
  import { t } from '$lib/i18n/index.svelte';
  import { Check, Building, MapPin, Loader2 } from '@lucide/svelte';
  import { page } from '$app/state';
  import { browser } from '$app/environment';
  import { trackEvent } from '$lib/utils/analytics';
  import { updateLeadStatus } from '$lib/supabase';
  import { onMount } from 'svelte';

  // Read from sessionStorage (preferred) or fall back to URL params for backwards compat
  let scheduleData = $state<Record<string, string>>({});
  $effect(() => {
    if (!browser) return;
    const stored = sessionStorage.getItem('ethoz-schedule');
    if (stored) {
      try { scheduleData = JSON.parse(stored); } catch {}
      sessionStorage.removeItem('ethoz-schedule');
    } else {
      // Backwards compatibility: read from URL params
      const p = new URLSearchParams(page.url.search);
      scheduleData = {
        school: p.get('school') ?? '',
        name: p.get('name') ?? '',
        email: p.get('email') ?? '',
        commune: p.get('commune') ?? '',
        region: p.get('region') ?? '',
      };
      // Clean PII from URL without reload
      if (p.has('email') || p.has('name')) {
        window.history.replaceState({}, '', '/schedule');
      }
    }
  });
  const schoolName = $derived(scheduleData.school ?? '');
  const contactName = $derived(scheduleData.name ?? '');
  const contactEmail = $derived(scheduleData.email ?? '');
  const commune = $derived(scheduleData.commune ?? '');
  const region = $derived(scheduleData.region ?? '');

  let calContainer = $state<HTMLDivElement | null>(null);
  let calLoaded = $state(false);
  let calError = $state(false);

  // Load Cal.com embed script and render inline
  $effect(() => {
    if (!browser || !calContainer) return;

    // Cal.com embed loader (official snippet)
    const win = window as any;
    (function (C: any, A: string, L: string) {
      const p = function (a: any, ar: any) { a.q.push(ar); };
      const d = C.document;
      C.Cal = C.Cal || function () {
        const cal = C.Cal;
        const ar = arguments;
        if (!cal.loaded) {
          cal.ns = {};
          cal.q = cal.q || [];
          const s = d.createElement('script');
          s.src = A;
          s.onerror = () => { calLoaded = true; calError = true; };
          d.head.appendChild(s);
          cal.loaded = true;
        }
        if (ar[0] === L) {
          const api: any = function () { p(api, arguments); };
          const namespace = ar[1];
          api.q = api.q || [];
          if (typeof namespace === 'string') {
            cal.ns[namespace] = cal.ns[namespace] || api;
            p(cal.ns[namespace], ar);
            p(cal, ['initNamespace', namespace]);
          } else p(cal, ar);
          return;
        }
        p(cal, ar);
      };
    })(win, 'https://app.cal.com/embed/embed.js', 'init');

    const Cal = win.Cal;
    Cal('init', { origin: 'https://cal.com' });

    // Build config with pre-filled data
    const config: Record<string, string> = {
      theme: 'light',
      timeFormat: '24',   // Force 24h format (Chile standard)
    };
    if (contactName) config.name = contactName;
    if (contactEmail) config.email = contactEmail;

    Cal('inline', {
      elementOrSelector: calContainer,
      calLink: 'ethoz/demo',
      config
    });

    Cal('ui', {
      theme: 'light',
      styles: { branding: {
        // Cal.com API expects a hex literal; keep in sync with --primary (oklch(0.68 0.21 40))
        brandColor: '#E8702A'
      } },
      hideEventTypeDetails: false,
      hideBranding: true,
      layout: 'month_view'
    });

    // Listen for Cal.com events — client-side lead update (immediate)
    Cal('on', {
      action: 'bookingSuccessful',
      callback: () => {
        trackEvent('demo_booked', { school: schoolName });

        // Update lead status in Supabase (fire-and-forget, resilient)
        if (contactEmail) {
          updateLeadStatus(
            contactEmail,
            'demo_scheduled',
            `Booked via Cal.com | School: ${schoolName}`
          ).catch(() => {}); // Silent — webhook is the backup
        }
      }
    });

    calLoaded = true;

    // Timeout fallback if embed doesn't render
    setTimeout(() => {
      if (!calLoaded) { calLoaded = true; calError = true; }
    }, 10000);
  });

  onMount(() => {
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
  {@html `<script type="application/ld+json">${JSON.stringify({"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Inicio","item":"https://ethoz.cl/"},{"@type":"ListItem","position":2,"name":"Demo","item":"https://ethoz.cl/demo"},{"@type":"ListItem","position":3,"name":"Agendar Demo"}]})}</script>`}
</svelte:head>

<main class="flex min-h-dvh flex-col bg-background">
  <NavBar />

  <div class="mx-auto w-full max-w-5xl flex-1 px-4 py-12 pt-24 sm:py-16 sm:pt-28">
    <!-- Step indicator -->
    <div class="mb-8">
      <div class="mx-auto flex max-w-lg items-center justify-center gap-3">
        {#each [{ label: 'Busca tu colegio', n: 1 }, { label: 'Completa tus datos', n: 2 }, { label: 'Agenda tu demo', n: 3 }] as s}
          <div class="flex items-center gap-2">
            <div class="flex size-7 items-center justify-center rounded-full text-xs font-bold {3 >= s.n ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}">
              {s.n}
            </div>
            <span class="hidden text-xs font-medium sm:block {3 >= s.n ? 'text-foreground' : 'text-muted-foreground'}">{s.label}</span>
          </div>
          {#if s.n < 3}
            <div class="h-px w-8 {3 > s.n ? 'bg-primary' : 'bg-border'}"></div>
          {/if}
        {/each}
      </div>
    </div>

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

    <!-- Cal.com inline embed — auto-resizes, no double scroll -->
    <div class="overflow-hidden rounded-xl border border-border bg-background shadow-sm">
      {#if !calLoaded}
        <div class="flex items-center justify-center py-20">
          <div class="flex flex-col items-center gap-3">
            <Loader2 class="size-8 animate-spin text-primary" />
            <p class="text-sm text-muted-foreground">Cargando calendario...</p>
          </div>
        </div>
      {/if}
      {#if calError}
        <div class="flex flex-col items-center gap-3 py-12 text-center">
          <p class="text-sm text-muted-foreground">No pudimos cargar el calendario.</p>
          <a href="https://cal.com/ethoz/demo" target="_blank" rel="noopener noreferrer" class="text-sm font-medium text-primary underline-offset-4 hover:underline">
            Agendar directamente en Cal.com
          </a>
        </div>
      {/if}
      <div bind:this={calContainer} class="w-full"></div>
    </div>
  </div>

  <Footer />
</main>
