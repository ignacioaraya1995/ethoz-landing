<script lang="ts">
  import { onMount } from 'svelte';
  import { feedbackStore } from '$lib/stores/feedback.svelte';
  import FeedbackModal from '$lib/components/FeedbackModal.svelte';
  import { MessageSquare, X, ExternalLink } from '@lucide/svelte';

  onMount(() => {
    feedbackStore.load();
    // Capture-phase click for Shift+Click interception
    window.addEventListener('click', handleShiftClick, true);
    return () => {
      window.removeEventListener('click', handleShiftClick, true);
    };
  });

  let panelOpen = $state(false);

  // ---- DOM walking heuristic -----------------------------------------------

  function getSelectorPath(el: Element): string {
    const parts: string[] = [];
    let current: Element | null = el;
    let depth = 0;
    while (current && current !== document.body && depth < 3) {
      const tag = current.tagName.toLowerCase();
      const id = current.id ? `#${current.id}` : '';
      const cls =
        current.className && typeof current.className === 'string'
          ? '.' + current.className.trim().split(/\s+/).slice(0, 2).join('.')
          : '';
      parts.unshift(`${tag}${id}${cls}`);
      current = current.parentElement;
      depth++;
    }
    return parts.join(' > ');
  }

  function getVisibleText(el: Element): string {
    const text = (el.textContent ?? '').replace(/\s+/g, ' ').trim();
    return text.slice(0, 150);
  }

  function getSectionName(el: Element): string | null {
    let current: Element | null = el;
    const parts: string[] = [];
    while (current && current !== document.body) {
      const label =
        current.getAttribute('data-section') ??
        current.getAttribute('aria-label') ??
        current.getAttribute('data-feedback-label');
      if (label) { parts.unshift(label); break; }

      const tag = current.tagName.toLowerCase();
      if (tag === 'section' || tag === 'article') {
        const heading = current.querySelector('h1,h2,h3,h4');
        if (heading) {
          parts.unshift((heading.textContent ?? '').trim().slice(0, 60));
          // Keep walking up for parent section context
        }
      }
      current = current.parentElement;
    }
    return parts.length > 0 ? parts.join(' → ') : null;
  }

  function getElementContext(el: Element): string {
    const rect = el.getBoundingClientRect();
    const position = rect.top < window.innerHeight / 3 ? 'top' : rect.top < window.innerHeight * 2/3 ? 'middle' : 'bottom';
    const cssClasses = (el.className && typeof el.className === 'string')
      ? el.className.split(/\s+/).filter(c => !c.startsWith('svelte-')).slice(0, 5).join(' ')
      : '';
    return `Position: ${position} of viewport | Classes: ${cssClasses}`;
  }

  function getMeaningfulTarget(rawEl: Element): {
    element: Element;
    elementType: string;
    elementLabel: string;
  } {
    let el: Element | null = rawEl;

    while (el && el !== document.body) {
      if (el.hasAttribute('data-feedback-label')) {
        return {
          element: el,
          elementType: el.tagName.toLowerCase(),
          elementLabel: el.getAttribute('data-feedback-label')!
        };
      }

      const tag = el.tagName.toLowerCase();

      if (tag === 'button' || tag === 'a') {
        return {
          element: el,
          elementType: tag,
          elementLabel: (el.textContent ?? '').trim().slice(0, 60) || tag
        };
      }

      if (
        el.classList.toString().includes('card') ||
        tag === 'article' ||
        (tag === 'div' && el.querySelector('h2,h3,h4'))
      ) {
        const heading = el.querySelector('h1,h2,h3,h4');
        return {
          element: el,
          elementType: 'card',
          elementLabel: heading
            ? (heading.textContent ?? '').trim().slice(0, 60)
            : 'Card'
        };
      }

      if (/^h[1-6]$/.test(tag)) {
        return {
          element: el,
          elementType: tag,
          elementLabel: (el.textContent ?? '').trim().slice(0, 60)
        };
      }

      el = el.parentElement;
    }

    return {
      element: rawEl,
      elementType: rawEl.tagName.toLowerCase(),
      elementLabel: (rawEl.textContent ?? '').trim().slice(0, 60) || rawEl.tagName.toLowerCase()
    };
  }

  // ---- Highlight -----------------------------------------------------------

  let highlightEl: Element | null = null;
  let highlightTimeout: ReturnType<typeof setTimeout> | null = null;

  function applyHighlight(el: Element) {
    if (highlightEl) {
      (highlightEl as HTMLElement).style.outline = '';
      (highlightEl as HTMLElement).style.outlineOffset = '';
      (highlightEl as HTMLElement).style.transition = '';
    }
    if (highlightTimeout) clearTimeout(highlightTimeout);

    (el as HTMLElement).style.outline = '2px solid var(--primary)';
    (el as HTMLElement).style.outlineOffset = '2px';
    (el as HTMLElement).style.transition = 'outline 0.3s ease';
    highlightEl = el;

    highlightTimeout = setTimeout(() => {
      (el as HTMLElement).style.outline = '2px solid transparent';
      setTimeout(() => {
        (el as HTMLElement).style.outline = '';
        (el as HTMLElement).style.outlineOffset = '';
        (el as HTMLElement).style.transition = '';
        highlightEl = null;
      }, 300);
    }, 1000);
  }

  // ---- Shift+Click handler -------------------------------------------------

  function handleShiftClick(e: MouseEvent) {
    if (!feedbackStore.active) return;
    if (!e.shiftKey) return;

    const target = e.target as Element;
    if (target.closest('[data-feedback-overlay]')) return;

    e.preventDefault();
    e.stopPropagation();

    const { element, elementType, elementLabel } = getMeaningfulTarget(target);
    const sectionName = getSectionName(element);
    const selectorPath = getSelectorPath(element);
    const visibleText = getVisibleText(element);

    applyHighlight(element);

    const extraContext = getElementContext(element);

    feedbackStore.captureTarget({
      elementType,
      elementLabel,
      sectionName,
      selectorPath,
      visibleText: `${visibleText}\n[${extraContext}]`
    });
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      if (feedbackStore.active) feedbackStore.toggleMode();
      if (panelOpen) panelOpen = false;
    }
  }

  // ---- Pending count badge -------------------------------------------------

  const pendingCount = $derived(
    feedbackStore.items.filter((i) => i.status === 'pending').length
  );
</script>

<svelte:window onkeydown={handleKeydown} />

<!-- Feedback banner — BEFORE navbar, pushes everything down -->
{#if feedbackStore.active}
  <div data-feedback-overlay class="fixed top-0 left-0 right-0 z-[200] flex items-center justify-center bg-primary px-4 py-1.5 text-xs font-medium text-primary-foreground">
    Shift+Click en cualquier elemento
    <span class="mx-2">·</span>
    <kbd class="rounded bg-primary-foreground/20 px-1.5 py-0.5 text-[10px] font-mono">Esc</kbd>
  </div>
{/if}

<!-- Overlay wrapper -->
<div data-feedback-overlay class="pointer-events-none fixed inset-0 z-[100]">

  <!-- Chat widget — bottom right, aligned to max-w-7xl -->
  <div class="pointer-events-auto absolute bottom-6 right-0 left-0 mx-auto flex max-w-7xl flex-col items-end gap-3 px-4 sm:px-6 lg:px-8">

    <!-- Slide-up panel -->
    {#if panelOpen}
      <div
        class="mb-1 w-72 rounded-2xl border border-border bg-card shadow-2xl"
        style="animation: slideUp 0.2s cubic-bezier(0.4,0,0.2,1);"
      >
        <!-- Panel header -->
        <div class="flex items-center justify-between rounded-t-2xl border-b border-border bg-primary px-4 py-3">
          <div class="flex items-center gap-2">
            <MessageSquare class="size-4 text-primary-foreground" />
            <span class="text-sm font-semibold text-primary-foreground">Feedback</span>
          </div>
          <button
            type="button"
            onclick={() => (panelOpen = false)}
            class="rounded-lg p-1 text-primary-foreground/70 transition-colors hover:bg-primary-foreground/10 hover:text-primary-foreground"
            aria-label="Cerrar panel"
          >
            <X class="size-3.5" />
          </button>
        </div>

        <!-- Panel body -->
        <div class="px-4 py-4 space-y-4">
          <p class="text-sm leading-relaxed text-muted-foreground">
            Shift+Click en cualquier elemento para dejar feedback sobre esa sección.
          </p>

          <!-- Toggle feedback mode -->
          <button
            type="button"
            onclick={() => { feedbackStore.toggleMode(); }}
            class="w-full rounded-xl px-4 py-2.5 text-sm font-semibold transition-all
              {feedbackStore.active
                ? 'bg-primary/10 text-primary ring-1 ring-primary'
                : 'bg-primary text-primary-foreground hover:bg-primary/90'}"
          >
            {feedbackStore.active ? 'Modo activo — Esc para salir' : 'Activar modo feedback'}
          </button>

          <!-- Stats row -->
          {#if feedbackStore.items.length > 0}
            <div class="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
              <span>{feedbackStore.items.length} ítem{feedbackStore.items.length !== 1 ? 's' : ''} guardado{feedbackStore.items.length !== 1 ? 's' : ''}</span>
              <a
                href="/suggestions"
                class="flex items-center gap-1 font-medium text-primary hover:underline"
              >
                Ver todos <ExternalLink class="size-3" />
              </a>
            </div>
          {:else}
            <p class="text-center text-xs text-muted-foreground/60">Sin feedback aún</p>
          {/if}
        </div>
      </div>
    {/if}

    <!-- Floating circle button -->
    <button
      type="button"
      onclick={() => (panelOpen = !panelOpen)}
      class="relative flex size-14 items-center justify-center rounded-full shadow-2xl transition-all duration-200
        {feedbackStore.active
          ? 'bg-primary text-primary-foreground scale-105'
          : 'bg-card border border-border text-foreground hover:scale-105 hover:shadow-xl'}"
      aria-label="Feedback"
      title="Feedback"
    >
      <MessageSquare class="size-6" />

      <!-- Pending badge -->
      {#if pendingCount > 0}
        <span class="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground shadow">
          {pendingCount > 9 ? '9+' : pendingCount}
        </span>
      {/if}
    </button>
  </div>
</div>

<!-- Modal rendered at root level -->
<FeedbackModal />

<style>
  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(12px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>
