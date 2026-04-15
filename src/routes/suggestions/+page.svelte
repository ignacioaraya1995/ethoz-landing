<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { env } from '$env/dynamic/public';
  import { feedbackStore, type FeedbackItem } from '$lib/stores/feedback.svelte';
  import NavBar from '$lib/components/NavBar.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import { Trash2, Download, RefreshCw, Copy, Check } from '@lucide/svelte';
  import { trackEvent } from '$lib/utils/analytics';

  $effect(() => { trackEvent('suggestions_viewed'); });

  // Redirect if feedback mode is not enabled
  onMount(() => {
    if (env.PUBLIC_FEEDBACK_MODE !== 'true') {
      goto('/');
      return;
    }
    feedbackStore.load();
  });

  // ---- Tabs ----------------------------------------------------------------
  type StatusTab = 'pending' | 'in-progress' | 'done' | 'dismissed';
  let activeTab = $state<StatusTab>('pending');

  const tabs: { key: StatusTab; label: string }[] = [
    { key: 'pending', label: 'Pendiente' },
    { key: 'in-progress', label: 'En progreso' },
    { key: 'done', label: 'Hecho' },
    { key: 'dismissed', label: 'Descartado' }
  ];

  const filteredItems = $derived(
    feedbackStore.items.filter((i) => i.status === activeTab)
  );

  // ---- Status options ------------------------------------------------------
  const statusOptions: { value: FeedbackItem['status']; label: string }[] = [
    { value: 'pending', label: 'Pendiente' },
    { value: 'in-progress', label: 'En progreso' },
    { value: 'done', label: 'Hecho' },
    { value: 'dismissed', label: 'Descartado' }
  ];

  // ---- Type display --------------------------------------------------------
  const typeMeta: Record<FeedbackItem['type'], { label: string; classes: string }> = {
    bug: { label: 'Bug', classes: 'bg-destructive/10 text-destructive' },
    suggestion: { label: 'Sugerencia', classes: 'bg-primary/10 text-primary' },
    question: { label: 'Pregunta', classes: 'bg-warning/20 text-warning-foreground' }
  };

  // ---- Export --------------------------------------------------------------
  function handleExport() {
    const json = feedbackStore.exportJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ethoz-feedback-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // ---- Clear all -----------------------------------------------------------
  let confirmClear = $state(false);

  function handleClearAll() {
    if (!confirmClear) {
      confirmClear = true;
      setTimeout(() => (confirmClear = false), 3000);
      return;
    }
    feedbackStore.clearAll();
    confirmClear = false;
  }

  // ---- Format date ---------------------------------------------------------
  function formatDate(iso: string): string {
    return new Intl.DateTimeFormat('es-CL', {
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(new Date(iso));
  }

  // ---- Count per tab -------------------------------------------------------
  function countByStatus(status: StatusTab): number {
    return feedbackStore.items.filter((i) => i.status === status).length;
  }

  // ---- Copiar como prompt --------------------------------------------------
  let copiedId = $state<string | null>(null);

  function buildPrompt(item: FeedbackItem): string {
    const typeLabel = typeMeta[item.type].label;
    const lines: string[] = [
      `Tengo un ${typeLabel.toLowerCase()} sobre la landing page de Ethoz.`,
      ``,
      `**Página:** ${item.pageRoute}`,
      item.sectionName ? `**Sección:** ${item.sectionName}` : '',
      `**Elemento:** ${item.elementLabel} (${item.elementType})`,
      item.visibleText ? `**Texto visible:** "${item.visibleText}"` : '',
      `**Selector:** ${item.selectorPath}`,
      `**Viewport:** ${item.viewport.width}×${item.viewport.height}`,
      ``,
      `**Descripción:**`,
      item.description,
      ``,
      `¿Puedes ayudarme a resolver esto?`
    ];
    return lines.filter((l) => l !== null && l !== undefined && (l.trim() !== '' || l === '')).join('\n').trim();
  }

  async function handleCopyPrompt(item: FeedbackItem) {
    const text = buildPrompt(item);
    await navigator.clipboard.writeText(text);
    copiedId = item.id;
    setTimeout(() => (copiedId = null), 2000);
  }

  // ---- Copy ALL as prompts ---------------------------------------------------
  let copiedAll = $state(false);

  async function handleCopyAll() {
    const all = feedbackStore.items
      .map((item, i) => `--- Feedback #${i + 1} ---\n${buildPrompt(item)}`)
      .join('\n\n');
    await navigator.clipboard.writeText(all);
    copiedAll = true;
    setTimeout(() => (copiedAll = false), 2000);
  }
</script>

<svelte:head>
  <title>Sugerencias — Ethoz</title>
  <meta name="description" content="Sugerencias para mejorar Ethoz. Comparte ideas con el equipo de producto." />
  <meta name="robots" content="noindex, nofollow" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="Sugerencias — Ethoz" />
  <meta property="og:description" content="Sugerencias para mejorar Ethoz. Comparte ideas con el equipo de producto." />
  <meta property="og:url" content="https://ethoz.cl/suggestions" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Sugerencias — Ethoz" />
  <meta name="twitter:description" content="Sugerencias para mejorar Ethoz. Comparte ideas con el equipo de producto." />
  <link rel="canonical" href="https://ethoz.cl/suggestions" />
</svelte:head>

<main class="flex min-h-dvh flex-col bg-background">
  <NavBar />

  <div class="mx-auto w-full max-w-5xl px-4 pt-28 pb-16 sm:px-6 lg:px-8">

    <!-- Header -->
    <div class="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p class="text-xs font-semibold uppercase tracking-widest text-primary">Dev only</p>
        <h1 class="mt-1 text-2xl font-bold tracking-tight text-foreground">Panel de sugerencias</h1>
        <p class="mt-1 text-sm text-muted-foreground">
          {feedbackStore.items.length} ítem{feedbackStore.items.length !== 1 ? 's' : ''} en total
        </p>
      </div>

      <div class="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onclick={() => feedbackStore.load()}
          class="flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          title="Recargar desde localStorage"
        >
          <RefreshCw class="size-3.5" />
          Recargar
        </button>

        <button
          type="button"
          onclick={handleCopyAll}
          disabled={feedbackStore.items.length === 0}
          class="flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-50"
        >
          {#if copiedAll}
            <Check class="size-3.5 text-success" />
            Copiado
          {:else}
            <Copy class="size-3.5" />
            Copiar todo
          {/if}
        </button>

        <button
          type="button"
          onclick={handleExport}
          disabled={feedbackStore.items.length === 0}
          class="flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-50"
        >
          <Download class="size-3.5" />
          Exportar JSON
        </button>

        <button
          type="button"
          onclick={handleClearAll}
          disabled={feedbackStore.items.length === 0}
          class="flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-colors disabled:pointer-events-none disabled:opacity-50
            {confirmClear
              ? 'border-destructive bg-destructive/10 text-destructive'
              : 'border-border bg-background text-muted-foreground hover:border-destructive/40 hover:text-destructive'}"
        >
          <Trash2 class="size-3.5" />
          {confirmClear ? 'Confirmar' : 'Limpiar todo'}
        </button>
      </div>
    </div>

    <!-- Tabs -->
    <div class="mb-6 flex gap-1 rounded-xl border border-border bg-muted/40 p-1">
      {#each tabs as tab}
        <button
          type="button"
          onclick={() => (activeTab = tab.key)}
          class="flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-colors
            {activeTab === tab.key
              ? 'bg-card text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'}"
        >
          {tab.label}
          {#if countByStatus(tab.key) > 0}
            <span class="flex size-4 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
              {countByStatus(tab.key)}
            </span>
          {/if}
        </button>
      {/each}
    </div>

    <!-- Item list -->
    {#if filteredItems.length === 0}
      <div class="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/20 py-16 text-center">
        <p class="text-sm font-medium text-muted-foreground">Sin ítems en esta categoría</p>
        <p class="mt-1 text-xs text-muted-foreground/60">Los ítems aparecerán aquí cuando uses Shift+Click en la página</p>
      </div>
    {:else}
      <div class="flex flex-col gap-4">
        {#each filteredItems as item (item.id)}
          <div class="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">

              <!-- Left: content -->
              <div class="flex-1 min-w-0">
                <div class="flex flex-wrap items-center gap-2">
                  <!-- Type badge -->
                  <span class="rounded-full px-2.5 py-0.5 text-xs font-semibold {typeMeta[item.type].classes}">
                    {typeMeta[item.type].label}
                  </span>
                  <!-- Route -->
                  <span class="rounded bg-muted px-2 py-0.5 font-mono text-xs text-muted-foreground">
                    {item.pageRoute}
                  </span>
                  <!-- Timestamp -->
                  <span class="text-xs text-muted-foreground/60">{formatDate(item.createdAt)}</span>
                </div>

                <!-- Description -->
                <p class="mt-2 text-sm text-foreground">{item.description}</p>

                <!-- Context -->
                <div class="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
                  {#if item.sectionName}
                    <span>Sección: <span class="text-foreground/80">{item.sectionName}</span></span>
                  {/if}
                  <span>Elemento: <span class="text-foreground/80">{item.elementLabel}</span></span>
                  {#if item.visibleText}
                    <span class="max-w-xs truncate">Texto: <span class="text-foreground/80">"{item.visibleText.slice(0, 80)}"</span></span>
                  {/if}
                  <span>Viewport: <span class="text-foreground/80">{item.viewport.width}×{item.viewport.height}</span></span>
                </div>
              </div>

              <!-- Right: actions -->
              <div class="flex shrink-0 flex-wrap items-center gap-2">
                <!-- Copiar como prompt -->
                <button
                  type="button"
                  onclick={() => handleCopyPrompt(item)}
                  class="flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors
                    {copiedId === item.id
                      ? 'border-success/40 bg-success/10 text-success'
                      : 'border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground'}"
                  title="Copiar como prompt para IA"
                >
                  {#if copiedId === item.id}
                    <Check class="size-3.5" />
                    Copiado
                  {:else}
                    <Copy class="size-3.5" />
                    Copiar prompt
                  {/if}
                </button>

                <select
                  value={item.status}
                  onchange={(e) => feedbackStore.updateStatus(item.id, (e.currentTarget as HTMLSelectElement).value as FeedbackItem['status'])}
                  class="rounded-lg border border-input bg-background px-2 py-1.5 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {#each statusOptions as opt}
                    <option value={opt.value}>{opt.label}</option>
                  {/each}
                </select>

                <button
                  type="button"
                  onclick={() => feedbackStore.removeItem(item.id)}
                  class="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                  title="Eliminar"
                >
                  <Trash2 class="size-4" />
                </button>
              </div>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </div>

  <Footer />
</main>
