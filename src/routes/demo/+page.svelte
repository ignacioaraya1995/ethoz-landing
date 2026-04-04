<script lang="ts">
  import { goto } from '$app/navigation';
  import Footer from '$lib/components/Footer.svelte';
  import { Button } from '$lib/components/ui/button';
  import { Badge } from '$lib/components/ui/badge';
  import { t, toggleLocale, getLocale } from '$lib/i18n/index.svelte';
  import { schoolStore, type School } from '$lib/stores/schools.svelte';
  import { trackEvent } from '$lib/utils/analytics';
  import { executeRecaptcha } from '$lib/utils/recaptcha';
  import { normalize } from '$lib/utils/text';
  import { PUBLIC_RECAPTCHA_SITE_KEY } from '$env/static/public';
  import {
    Search,
    Building,
    MapPin,
    ChevronRight,
    Loader2,
    GraduationCap,
    Globe,
    ArrowLeft,
    ChevronDown,
    Users
  } from '@lucide/svelte';

  // ── State ──
  let step = $state<1 | 2>(1);
  let searchInput = $state('');
  let highlightIndex = $state(-1);
  let debounceTimer: ReturnType<typeof setTimeout> | null = null;

  let contactName = $state('');
  let contactRole = $state('');
  let contactEmail = $state('');
  let contactPhone = $state('');
  let submitting = $state(false);

  let searchInputEl = $state<HTMLInputElement | null>(null);
  let resultsListEl = $state<HTMLUListElement | null>(null);
  let mapContainer = $state<HTMLDivElement | null>(null);
  let mapInstance: any = null;

  // ── Derived ──
  const schools = $derived(schoolStore.filteredSchools);
  const hasResults = $derived(schools.length > 0);
  const showNoResults = $derived(
    !schoolStore.loading && searchInput.trim().length >= 2 && !hasResults
  );

  // ── Effects ──
  $effect(() => {
    schoolStore.load();
  });

  $effect(() => {
    if (schoolStore.loaded && searchInputEl && step === 1) {
      setTimeout(() => searchInputEl?.focus(), 100);
    }
  });

  $effect(() => {
    if (step === 2 && schoolStore.selectedSchool && mapContainer && !mapInstance) {
      const school = schoolStore.selectedSchool;
      if (school.lat === 0 && school.lng === 0) return;

      import('leaflet').then((L) => {
        mapInstance = L.map(mapContainer!, { attributionControl: false }).setView([school.lat, school.lng], 15);
        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png').addTo(mapInstance);
        L.marker([school.lat, school.lng]).addTo(mapInstance);
        setTimeout(() => mapInstance?.invalidateSize(), 100);
      });
    }

    return () => {
      if (mapInstance) {
        mapInstance.remove();
        mapInstance = null;
      }
    };
  });

  // ── Helpers ──
  function regionName(code: number): string {
    return schoolStore.regions.find((r) => r.code === code)?.name ?? '';
  }

  function depTypeLabel(depType: number): string {
    const labels: Record<number, string> = {
      1: 'Municipal',
      2: 'Part. Subvencionado',
      3: 'Part. Pagado',
      4: 'Corp. Adm. Delegada'
    };
    return labels[depType] ?? '';
  }

  function highlightMatch(text: string, query: string) {
    if (query.length < 2) return null;
    const nt = normalize(text);
    const nq = normalize(query);
    const idx = nt.indexOf(nq);
    if (idx === -1) return null;
    return {
      before: text.slice(0, idx),
      match: text.slice(idx, idx + query.length),
      after: text.slice(idx + query.length)
    };
  }

  // ── Handlers ──
  function handleSearch(e: Event) {
    const value = (e.target as HTMLInputElement).value;
    searchInput = value;
    highlightIndex = -1;
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => schoolStore.setSearch(value), 150);
  }

  function selectSchool(school: School) {
    schoolStore.selectSchool(school.rbd);
    step = 2;
    trackEvent('school_selected', { rbd: school.rbd.toString(), name: school.name });
  }

  function goBack() {
    step = 1;
    schoolStore.clearSelection();
    searchInput = '';
    schoolStore.setSearch('');
    setTimeout(() => searchInputEl?.focus(), 100);
  }

  function handleKeydown(e: KeyboardEvent) {
    if (step !== 1 || !hasResults) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      highlightIndex = Math.min(highlightIndex + 1, schools.length - 1);
      scrollHighlighted();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      highlightIndex = Math.max(highlightIndex - 1, -1);
      scrollHighlighted();
    } else if (e.key === 'Enter' && highlightIndex >= 0) {
      e.preventDefault();
      selectSchool(schools[highlightIndex]);
    }
  }

  function scrollHighlighted() {
    requestAnimationFrame(() => {
      resultsListEl
        ?.querySelector('[data-highlighted="true"]')
        ?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    });
  }

  async function handleSubmit(e: Event) {
    e.preventDefault();
    submitting = true;

    await executeRecaptcha('submit_demo');

    const school = schoolStore.selectedSchool;
    if (import.meta.env.DEV) {
      console.log('[Demo] Submitted:', {
        school,
        contact: { name: contactName, role: contactRole, email: contactEmail, phone: contactPhone }
      });
    }

    setTimeout(() => {
      submitting = false;
      // Redirect to scheduling page with pre-filled data
      const params = new URLSearchParams();
      if (school) {
        params.set('school', school.name);
        params.set('commune', school.commune);
        // Look up region name
        const region = schoolStore.regions.find(r => r.code === school.regionCode);
        if (region) params.set('region', region.name);
      }
      params.set('name', contactName);
      params.set('email', contactEmail);
      trackEvent('demo_form_submitted', { school: school?.name ?? '', email: contactEmail });
      goto(`/schedule?${params.toString()}`);
    }, 600);
  }
</script>

<svelte:window onkeydown={handleKeydown} />

<svelte:head>
  <title>Ethoz — {t('nav.cta')}</title>
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <script src="https://www.google.com/recaptcha/api.js?render={PUBLIC_RECAPTCHA_SITE_KEY}" async defer></script>
  <meta property="og:url" content="https://ethoz.cl/demo" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="Demo — Ethoz" />
  <meta property="og:description" content="Solicita una demo personalizada de Ethoz para tu colegio." />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Demo — Ethoz" />
  <meta name="twitter:description" content="Solicita una demo personalizada de Ethoz para tu colegio." />
  <link rel="canonical" href="https://ethoz.cl/demo" />
</svelte:head>

<main class="flex min-h-dvh flex-col bg-secondary pt-16">
  <!-- Nav -->
  <nav class="fixed top-0 right-0 left-0 z-50 border-b border-border bg-background/80 backdrop-blur-lg shadow-sm">
    <div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
      <a href="/" class="text-xl font-bold tracking-tight text-foreground">Ethoz</a>

      <div class="flex items-center gap-3">
        <Button variant="ghost" size="sm" onclick={toggleLocale} class="gap-1.5 text-muted-foreground">
          <Globe class="size-4" />
          {getLocale() === 'es' ? 'EN' : 'ES'}
        </Button>
        <a
          href="/"
          class="flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft class="size-4" />
          {t('demo.back')}
        </a>
      </div>
    </div>
  </nav>

  <!-- Step indicator -->
  <div class="border-b border-border bg-background py-4">
    <div class="mx-auto flex max-w-lg items-center justify-center gap-3 px-4">
      {#each [{ label: 'Busca tu colegio', n: 1 }, { label: 'Completa tus datos', n: 2 }, { label: 'Agenda tu demo', n: 3 }] as s}
        <div class="flex items-center gap-2">
          <div class="flex size-7 items-center justify-center rounded-full text-xs font-bold {step >= s.n ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}">
            {s.n}
          </div>
          <span class="hidden text-xs font-medium sm:block {step >= s.n ? 'text-foreground' : 'text-muted-foreground'}">{s.label}</span>
        </div>
        {#if s.n < 3}
          <div class="h-px w-8 {step > s.n ? 'bg-primary' : 'bg-border'}"></div>
        {/if}
      {/each}
    </div>
  </div>

  <!-- Content -->
  <div class="mx-auto px-4 py-12 sm:py-16 {step === 2 ? 'max-w-5xl' : 'max-w-lg'}">
    <!-- ════════════════════════════════════════════
         STEP 1: Search your school
         ════════════════════════════════════════════ -->
    {#if step === 1}
      <div class="space-y-6">
        <div class="text-center">
          <div class="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-primary/10">
            <GraduationCap class="size-7 text-primary" />
          </div>
          <h1 class="text-2xl font-bold tracking-tight text-foreground">
            {t('demo.step1.title')}
          </h1>
          <p class="mt-2 text-sm text-muted-foreground">
            {t('demo.step1.subtitle')}
          </p>
        </div>

        {#if schoolStore.loading}
          <div class="flex flex-col items-center gap-3 py-16">
            <Loader2 class="size-8 animate-spin text-primary" />
            <p class="text-sm text-muted-foreground">{t('demo.search.loading')}</p>
          </div>
        {:else}
          <!-- Search input — direct, no region/commune required -->
          <div class="relative">
            <Search class="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              bind:this={searchInputEl}
              type="text"
              value={searchInput}
              oninput={handleSearch}
              placeholder={t('demo.search.placeholder')}
              autocomplete="off"
              class="w-full rounded-xl border border-border bg-background py-4 pl-11 pr-4 text-base text-foreground shadow-sm outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {#if searchInput.trim().length < 2 && !hasResults}
            <p class="text-center text-xs text-muted-foreground">{t('demo.search.hint')}</p>
          {/if}

          <!-- Results list -->
          {#if hasResults}
            <ul
              bind:this={resultsListEl}
              class="results-list max-h-80 space-y-1 overflow-y-auto rounded-xl border border-border bg-background p-2 shadow-sm"
              role="listbox"
              aria-label="School results"
            >
              {#each schools.slice(0, 30) as school, i}
                {@const match = highlightMatch(school.name, searchInput.trim())}
                <li
                  role="option"
                  aria-selected={highlightIndex === i}
                  data-highlighted={highlightIndex === i}
                >
                  <button
                    type="button"
                    onclick={() => selectSchool(school)}
                    class="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition-colors hover:bg-muted"
                    class:bg-muted={highlightIndex === i}
                  >
                    <Building class="size-4 shrink-0 text-muted-foreground" />
                    <div class="min-w-0 flex-1">
                      <div class="text-sm font-medium text-foreground">
                        {#if match}
                          {match.before}<mark class="bg-primary/20 font-semibold text-foreground">{match.match}</mark>{match.after}
                        {:else}
                          {school.name}
                        {/if}
                      </div>
                      <div class="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                        <MapPin class="size-3 shrink-0" />
                        <span>{school.commune}</span>
                      </div>
                    </div>
                    <ChevronRight class="size-4 shrink-0 text-muted-foreground" />
                  </button>
                </li>
              {/each}
            </ul>
          {/if}

          <!-- No results -->
          {#if showNoResults}
            <div class="rounded-xl border border-dashed border-border bg-background px-4 py-10 text-center">
              <Search class="mx-auto mb-2 size-8 text-muted-foreground/50" />
              <p class="text-sm font-medium text-foreground">{t('demo.search.noresults')}</p>
            </div>
          {/if}
        {/if}
      </div>

    <!-- ════════════════════════════════════════════
         STEP 2: Confirm school + Contact form
         ════════════════════════════════════════════ -->
    {:else if step === 2}
      <div class="space-y-8">
        <div class="text-center">
          <h1 class="text-2xl font-bold tracking-tight text-foreground">
            {t('demo.step2.title')}
          </h1>
        </div>

        <div class="grid gap-8 lg:grid-cols-2">
          <!-- Left: school info + map -->
          <div class="space-y-6">
            <!-- Selected school card -->
            {#if schoolStore.selectedSchool}
              {@const school = schoolStore.selectedSchool}
              <div class="rounded-xl border border-primary/20 bg-background shadow-sm">
                <!-- Card header -->
                <div class="border-b border-border px-5 py-4">
                  <div class="flex items-start gap-3">
                    <div class="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <GraduationCap class="size-5 text-primary" />
                    </div>
                    <div class="min-w-0 flex-1">
                      <h2 class="text-base font-semibold leading-snug text-foreground">{school.name}</h2>
                      <Badge variant="outline" class="mt-1 font-mono text-xs">
                        {t('demo.rbd')} {school.rbd}
                      </Badge>
                    </div>
                  </div>
                </div>

                <!-- Card body: detail grid -->
                <div class="grid grid-cols-2 gap-px bg-border">
                  <div class="flex items-start gap-2.5 bg-background px-4 py-3">
                    <MapPin class="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
                    <div class="min-w-0">
                      <p class="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">{t('demo.commune')}</p>
                      <p class="truncate text-sm text-foreground">{school.commune}</p>
                    </div>
                  </div>
                  <div class="flex items-start gap-2.5 bg-background px-4 py-3">
                    <MapPin class="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
                    <div class="min-w-0">
                      <p class="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">{t('demo.region')}</p>
                      <p class="truncate text-sm text-foreground">{regionName(school.regionCode)}</p>
                    </div>
                  </div>
                  <div class="flex items-start gap-2.5 bg-background px-4 py-3">
                    <Users class="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
                    <div class="min-w-0">
                      <p class="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">{t('demo.enrollment.label')}</p>
                      <p class="text-sm text-foreground">{school.enrollment.toLocaleString('es-CL')} {t('demo.enrollment')}</p>
                    </div>
                  </div>
                  <div class="flex items-start gap-2.5 bg-background px-4 py-3">
                    <Building class="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
                    <div class="min-w-0">
                      <p class="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">Dependencia</p>
                      <p class="text-sm text-foreground">{depTypeLabel(school.depType)}</p>
                    </div>
                  </div>
                  <div class="col-span-2 flex items-start gap-2.5 bg-background px-4 py-3">
                    <Building class="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
                    <div class="min-w-0">
                      <p class="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">{t('demo.sostenedor')}</p>
                      <p class="truncate text-sm text-foreground">{school.sostenedor}</p>
                    </div>
                  </div>
                </div>

                <!-- Card footer -->
                <div class="px-5 py-3">
                  <button
                    type="button"
                    onclick={goBack}
                    class="text-sm font-medium text-primary transition-colors hover:text-primary/70"
                  >
                    &larr; {t('demo.step2.change')}
                  </button>
                </div>
              </div>
            {/if}

            <!-- Map -->
            {#if schoolStore.selectedSchool && schoolStore.selectedSchool.lat !== 0}
              <div
                bind:this={mapContainer}
                class="h-64 w-full overflow-hidden rounded-xl border border-border"
              ></div>
            {/if}
          </div>

          <!-- Right: contact form -->
          <div>
            <form onsubmit={handleSubmit} class="space-y-4">
              <div class="space-y-1.5">
                <label for="contact-name" class="block text-sm font-medium text-foreground">
                  {t('demo.form.name')} <span class="text-destructive">*</span>
                </label>
                <input
                  id="contact-name"
                  type="text"
                  required
                  bind:value={contactName}
                  placeholder={t('demo.form.name.placeholder')}
                  autocomplete="name"
                  class="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div class="space-y-1.5">
                <label for="contact-role" class="block text-sm font-medium text-foreground">
                  {t('demo.form.role')} <span class="text-destructive">*</span>
                </label>
                <div class="relative">
                  <select
                    id="contact-role"
                    required
                    bind:value={contactRole}
                    class="w-full cursor-pointer appearance-none rounded-lg border border-border bg-background py-3 pl-4 pr-10 text-sm text-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="" disabled>{t('demo.form.role.placeholder')}</option>
                    <option value="director">{t('demo.form.role.director')}</option>
                    <option value="subdirector">{t('demo.form.role.subdirector')}</option>
                    <option value="inspector">{t('demo.form.role.inspector')}</option>
                    <option value="utp">{t('demo.form.role.utp')}</option>
                    <option value="sostenedor">{t('demo.form.role.sostenedor')}</option>
                    <option value="other">{t('demo.form.role.other')}</option>
                  </select>
                  <ChevronDown class="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                </div>
              </div>

              <div class="space-y-1.5">
                <label for="contact-email" class="block text-sm font-medium text-foreground">
                  {t('demo.form.email')} <span class="text-destructive">*</span>
                </label>
                <input
                  id="contact-email"
                  type="email"
                  required
                  bind:value={contactEmail}
                  placeholder={t('demo.form.email.placeholder')}
                  autocomplete="email"
                  class="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div class="space-y-1.5">
                <label for="contact-phone" class="block text-sm font-medium text-foreground">
                  WhatsApp
                </label>
                <input
                  id="contact-phone"
                  type="tel"
                  bind:value={contactPhone}
                  placeholder="+56 9 1234 5678"
                  autocomplete="off"
                  class="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <Button
                type="submit"
                size="xl"
                class="w-full"
                disabled={submitting || !contactName.trim() || !contactRole || !contactEmail.trim()}
              >
                {#if submitting}
                  <Loader2 class="size-4 animate-spin" />
                {:else}
                  {t('demo.form.submit')}
                  <ChevronRight class="size-4" />
                {/if}
              </Button>
              <p class="mt-2 text-center text-[10px] text-muted-foreground">
                Protegido por reCAPTCHA de Google.
              </p>
            </form>
          </div>
        </div>
      </div>

    {/if}
  </div>

  <Footer />
</main>

<style>
  .results-list {
    scrollbar-width: thin;
    scrollbar-color: oklch(var(--border)) transparent;
  }

  .results-list::-webkit-scrollbar { width: 6px; }
  .results-list::-webkit-scrollbar-track { background: transparent; }
  .results-list::-webkit-scrollbar-thumb {
    background-color: oklch(var(--border));
    border-radius: 3px;
  }

  mark { background-color: inherit; color: inherit; }
</style>
