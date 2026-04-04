<script lang="ts">
  import '../app.css';
  import { env } from '$env/dynamic/public';
  let { children } = $props();
  const feedbackEnabled = env.PUBLIC_FEEDBACK_MODE === 'true';
</script>

<div class="min-h-screen bg-background text-foreground antialiased">
  {@render children()}
  {#if feedbackEnabled}
    {#await import('$lib/components/FeedbackOverlay.svelte') then { default: FeedbackOverlay }}
      <FeedbackOverlay />
    {/await}
  {/if}
</div>
