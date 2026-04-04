<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { t, toggleLocale, getLocale } from '$lib/i18n/index.svelte';
  import { Globe } from '@lucide/svelte';
  import { env } from '$env/dynamic/public';
</script>

<nav class="fixed top-0 right-0 left-0 z-50 border-b border-border bg-background/80 backdrop-blur-lg shadow-sm">
  <div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
    <a href="/" class="text-xl font-bold tracking-tight text-foreground">Ethoz</a>
    <div class="flex items-center gap-3">
      <Button variant="ghost" size="sm" onclick={toggleLocale} class="gap-1.5 text-muted-foreground">
        <Globe class="size-4" />
        {getLocale() === 'es' ? 'EN' : 'ES'}
      </Button>
      <Button variant="ghost" size="sm" href={env.PUBLIC_APP_URL ?? 'http://localhost:5174/'} class="text-muted-foreground">
        {t('nav.login')}
      </Button>
      <Button size="sm" href="/demo">
        {t('nav.cta')}
      </Button>
    </div>
  </div>
</nav>
