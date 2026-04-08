<script lang="ts">
  import { feedbackStore } from '$lib/stores/feedback.svelte';

  let description = $state('');
  let textareaEl = $state<HTMLTextAreaElement | null>(null);

  // Auto-focus textarea when modal opens
  $effect(() => {
    if (feedbackStore.modalOpen && textareaEl) {
      setTimeout(() => textareaEl?.focus(), 50);
    }
  });

  function handleSubmit() {
    if (!description.trim()) return;
    const target = feedbackStore.capturedTarget;
    if (!target) return;

    feedbackStore.addItem({
      type: 'suggestion',
      description: description.trim(),
      pageRoute: typeof window !== 'undefined' ? window.location.pathname : '/',
      elementType: target.elementType,
      elementLabel: target.elementLabel,
      sectionName: target.sectionName,
      selectorPath: target.selectorPath,
      visibleText: target.visibleText,
      viewport: {
        width: typeof window !== 'undefined' ? window.innerWidth : 0,
        height: typeof window !== 'undefined' ? window.innerHeight : 0
      }
    });

    description = '';
    feedbackStore.closeModal();
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') feedbackStore.closeModal();
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey) && description.trim()) {
      e.preventDefault();
      handleSubmit();
    }
  }

  function handleBackdropClick(e: MouseEvent) {
    if (e.target === e.currentTarget) feedbackStore.closeModal();
  }
</script>

<svelte:window onkeydown={handleKeydown} />

{#if feedbackStore.modalOpen}
  <div
    role="presentation"
    class="fixed inset-0 z-[110] flex items-end justify-center sm:items-center"
    onclick={handleBackdropClick}
  >
    <div class="relative w-full max-w-sm rounded-t-2xl border border-border bg-card p-5 shadow-2xl sm:mx-4 sm:rounded-2xl">
      <!-- Context pill -->
      {#if feedbackStore.capturedTarget}
        <div class="mb-3 truncate rounded-lg bg-muted px-3 py-1.5 text-xs text-muted-foreground">
          {feedbackStore.capturedTarget.sectionName ?? feedbackStore.capturedTarget.elementLabel}
        </div>
      {/if}

      <!-- Just the textarea -->
      <textarea
        bind:this={textareaEl}
        bind:value={description}
        rows="2"
        placeholder="¿Qué mejorarías?"
        class="w-full resize-none rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      ></textarea>

      <!-- Actions -->
      <div class="mt-3 flex items-center justify-between">
        <span class="text-[10px] text-muted-foreground">
          <kbd class="rounded bg-muted px-1 py-0.5 font-mono">⌘↵</kbd> para enviar
        </span>
        <button
          type="button"
          onclick={handleSubmit}
          disabled={!description.trim()}
          class="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50"
        >
          Guardar
        </button>
      </div>
    </div>
  </div>
{/if}
