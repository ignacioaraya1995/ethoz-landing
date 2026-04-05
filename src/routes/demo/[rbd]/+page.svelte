<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import { browser } from '$app/environment';
  import NavBar from '$lib/components/NavBar.svelte';
  import { Button } from '$lib/components/ui/button';
  import { Badge } from '$lib/components/ui/badge';
  import { t } from '$lib/i18n/index.svelte';
  import { schoolStore } from '$lib/stores/schools.svelte';
  import { trackEvent } from '$lib/utils/analytics';
  import { saveLead } from '$lib/supabase';
  import { executeRecaptcha, getRecaptchaScriptUrl } from '$lib/utils/recaptcha';
  import {
    Building,
    MapPin,
    ChevronRight,
    Loader2,
    GraduationCap,
    ChevronDown,
    Users
  } from '@lucide/svelte';

  // ── Route param ──
  const rbd = $derived(Number(page.params.rbd));

  // ── Form state ──
  const STORAGE_KEY = 'ethoz-demo-form';
  let contactName = $state('');
  let contactRole = $state('');
  let contactEmail = $state('');
  let contactPhone = $state('');
  let contactSource = $state('');
  let submitting = $state(false);
  let formRestored = $state(false);

  let mapContainer = $state<HTMLDivElement | null>(null);
  let mapInstance: any = null;

  // ── Load school by RBD ──
  $effect(() => {
    schoolStore.load();
  });

  $effect(() => {
    if (schoolStore.loaded && rbd) {
      schoolStore.selectSchool(rbd);
      if (!schoolStore.selectedSchool) {
        goto('/demo', { replaceState: true });
      }
    }
  });

  // ── Restore form from sessionStorage ──
  $effect(() => {
    if (!browser || formRestored) return;
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        contactName = data.name ?? '';
        contactRole = data.role ?? '';
        contactEmail = data.email ?? '';
        contactPhone = data.phone ?? '';
        contactSource = data.source ?? '';
      } catch {}
    }
    formRestored = true;
  });

  // ── Auto-save form to sessionStorage ──
  $effect(() => {
    if (!formRestored || !browser) return;
    const data = {
      name: contactName,
      role: contactRole,
      email: contactEmail,
      phone: contactPhone,
      source: contactSource
    };
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  });

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

  // ── Map ──
  $effect(() => {
    const school = schoolStore.selectedSchool;
    if (school && mapContainer && !mapInstance) {
      if (school.lat === 0 && school.lng === 0) return;
      import('leaflet').then((L) => {
        mapInstance = L.map(mapContainer!, {
          attributionControl: false,
          zoomControl: false,
          dragging: false,
          touchZoom: false,
          scrollWheelZoom: false,
          doubleClickZoom: false,
          boxZoom: false,
          keyboard: false,
        }).setView([school.lat, school.lng], 15);
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

  // ── Submit ──
  async function handleSubmit(e: Event) {
    e.preventDefault();
    submitting = true;

    try {
      await executeRecaptcha('submit_demo');
      const school = schoolStore.selectedSchool;

      saveLead({
        school_name: school?.name ?? '',
        school_rbd: school?.rbd,
        school_commune: school?.commune ?? '',
        contact_name: contactName,
        contact_role: contactRole,
        contact_email: contactEmail,
        contact_phone: contactPhone || undefined,
        contact_source: contactSource || undefined,
        status: 'new',
      });

      trackEvent('demo_form_submitted', { school: school?.name ?? '', email: contactEmail });

      // Clear saved form
      if (browser) sessionStorage.removeItem(STORAGE_KEY);

      // Redirect to scheduling page
      const params = new URLSearchParams();
      if (school) {
        params.set('school', school.name);
        params.set('commune', school.commune);
        const region = schoolStore.regions.find(r => r.code === school.regionCode);
        if (region) params.set('region', region.name);
      }
      params.set('name', contactName);
      params.set('email', contactEmail);

      goto(`/schedule?${params.toString()}`);
    } finally {
      submitting = false;
    }
  }
</script>

<svelte:head>
  <title>Ethoz — {t('nav.cta')}</title>
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <meta property="og:url" content="https://ethoz.cl/demo" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="Demo — Ethoz" />
  <meta property="og:description" content="Solicita una demo personalizada de Ethoz para tu colegio." />
  <link rel="canonical" href="https://ethoz.cl/demo" />
</svelte:head>

<main class="flex min-h-dvh flex-col bg-secondary pt-16">
  <NavBar />

  <!-- Step indicator -->
  <div class="border-b border-border bg-background py-4">
    <div class="mx-auto flex max-w-lg items-center justify-center gap-3 px-4">
      {#each [{ label: 'Busca tu colegio', n: 1 }, { label: 'Completa tus datos', n: 2 }, { label: 'Agenda tu demo', n: 3 }] as s}
        <div class="flex items-center gap-2">
          <div class="flex size-7 items-center justify-center rounded-full text-xs font-bold {2 >= s.n ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}">
            {s.n}
          </div>
          <span class="hidden text-xs font-medium sm:block {2 >= s.n ? 'text-foreground' : 'text-muted-foreground'}">{s.label}</span>
        </div>
        {#if s.n < 3}
          <div class="h-px w-8 {2 > s.n ? 'bg-primary' : 'bg-border'}"></div>
        {/if}
      {/each}
    </div>
  </div>

  <!-- Content -->
  <div class="mx-auto flex-1 max-w-5xl px-4 py-12 sm:py-16">
    {#if schoolStore.loading || !schoolStore.selectedSchool}
      <div class="flex flex-col items-center gap-3 py-16">
        <Loader2 class="size-8 animate-spin text-primary" />
        <p class="text-sm text-muted-foreground">{t('demo.search.loading')}</p>
      </div>
    {:else}
      {@const school = schoolStore.selectedSchool}
      <div class="space-y-8">
        <div class="text-center">
          <h1 class="text-2xl font-bold tracking-tight text-foreground">
            {t('demo.step2.title')}
          </h1>
          <a href="/demo" class="mt-2 inline-flex items-center gap-1 text-sm text-primary transition-colors hover:text-primary/70">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            {t('demo.step2.change')}
          </a>
        </div>

        <div class="grid gap-8 lg:grid-cols-2">
          <!-- Left: school info + map -->
          <div class="space-y-6">
            <!-- Selected school card -->
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

            </div>

            <!-- Map — desktop only -->
            {#if school.lat !== 0}
              <div
                bind:this={mapContainer}
                class="hidden h-64 w-full overflow-hidden rounded-xl border border-border lg:block"
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
                  autocomplete="tel"
                  class="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div class="space-y-1.5">
                <label for="contact-source" class="block text-sm font-medium text-foreground">
                  {t('demo.form.source')}
                </label>
                <div class="relative">
                  <select
                    id="contact-source"
                    bind:value={contactSource}
                    class="w-full cursor-pointer appearance-none rounded-lg border border-border bg-background py-3 pl-4 pr-10 text-sm text-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="">{t('demo.form.source.placeholder')}</option>
                    <option value="google">{t('demo.form.source.google')}</option>
                    <option value="referido">{t('demo.form.source.referral')}</option>
                    <option value="redes-sociales">{t('demo.form.source.social')}</option>
                    <option value="evento">{t('demo.form.source.event')}</option>
                    <option value="mineduc">{t('demo.form.source.mineduc')}</option>
                    <option value="otro">{t('demo.form.source.other')}</option>
                  </select>
                  <ChevronDown class="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                </div>
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

  <footer class="border-t border-border bg-background py-4 text-center text-[11px] text-muted-foreground">
    &copy; {new Date().getFullYear()} Ethoz
  </footer>
</main>
