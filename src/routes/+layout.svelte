<svelte:head>
  <meta property="og:site_name" content="Ethoz" />
  <meta property="og:locale" content="es_CL" />
  <meta name="application-name" content="Ethoz" />
</svelte:head>

<script lang="ts">
  import '../app.css';
  import { env } from '$env/dynamic/public';
  import { slide } from 'svelte/transition';
  import { checkInternalFlag, checkInternalIP, isInternal } from '$lib/utils/internal';
  import { identifyVisitor } from '$lib/utils/visitor';
  let { children } = $props();
  const feedbackEnabled = env.PUBLIC_FEEDBACK_MODE === 'true';
  const clarityId = env.PUBLIC_CLARITY_PROJECT_ID ?? '';

  let cookieConsent = $state<boolean | null>(null);

  // Load Clarity after cookie consent
  function loadClarity() {
    if (!clarityId || typeof window === 'undefined') return;
    if ((window as any).clarity) return;
    (function(c: any, l: any, a: string, r: string, i: string) {
      c[a] = c[a] || function(...args: any[]) { (c[a].q = c[a].q || []).push(args); };
      const t = l.createElement(r); t.async = 1; t.src = 'https://www.clarity.ms/tag/' + i;
      const y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
    })(window, document, 'clarity', 'script', clarityId);
  }

  $effect(() => {
    if (typeof window !== 'undefined') {
      checkInternalFlag(); // Check ?_internal=1 URL param
      checkInternalIP();  // Auto-detect internal IPs (once per session)
      const stored = localStorage.getItem('cookie-consent');
      cookieConsent = stored === null ? false : true;
      if (stored === 'accepted' && !isInternal()) loadClarity();
      // Identify visitor across GA4 + Clarity (after consent + Clarity load)
      if (stored === 'accepted' && !isInternal()) {
        setTimeout(() => identifyVisitor(), 1000);
      }
    }
  });

  function acceptCookies() {
    localStorage.setItem('cookie-consent', 'accepted');
    cookieConsent = true;
    loadClarity();
    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as any).gtag('consent', 'update', {
        analytics_storage: 'granted',
        ad_storage: 'granted',
      });
    }
  }
</script>

<div class="min-h-screen bg-background text-foreground antialiased">
  {@render children()}
  {#if feedbackEnabled}
    {#await import('$lib/components/FeedbackOverlay.svelte') then { default: FeedbackOverlay }}
      <FeedbackOverlay />
    {/await}
  {/if}

  {#if cookieConsent === false}
    <div
      transition:slide={{ duration: 300 }}
      class="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 backdrop-blur-md"
    >
      <div class="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <p class="text-xs text-muted-foreground">
          Usamos cookies para mejorar tu experiencia. Al continuar, aceptas nuestra
          <a href="/privacy" class="underline underline-offset-2 hover:text-foreground">política de privacidad</a>.
        </p>
        <button
          onclick={acceptCookies}
          class="shrink-0 rounded-md bg-primary px-4 py-1.5 text-xs font-medium text-white transition-all hover:bg-primary/90 active:scale-[0.98]"
        >
          Aceptar
        </button>
      </div>
    </div>
  {/if}
</div>
