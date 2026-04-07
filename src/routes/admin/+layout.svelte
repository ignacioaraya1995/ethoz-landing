<script lang="ts">
  import { adminStore } from '$lib/stores/admin.svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import { LogOut, User, Search, Users, FileText, Settings } from '@lucide/svelte';
  import { onMount } from 'svelte';

  let { children } = $props();

  const isLoginPage = $derived(page.url.pathname === '/admin');

  onMount(async () => {
    await adminStore.init();
  });

  async function handleLogout() {
    await adminStore.logout();
    goto('/admin');
  }
</script>

<svelte:head>
  <meta name="robots" content="noindex, nofollow" />
</svelte:head>

{#if adminStore.authenticated && !isLoginPage}
  <header class="fixed top-0 right-0 left-0 z-50 border-b border-border bg-background/80 backdrop-blur-lg">
    <div class="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
      <div class="flex items-center gap-3">
        <a href="/" class="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" class="size-6" aria-hidden="true">
            <rect x="2" y="7" width="18" height="22" rx="4.5" fill="none" stroke="currentColor" stroke-width="2.2" class="text-foreground"/>
            <rect x="12" y="3" width="18" height="22" rx="4.5" fill="none" stroke="currentColor" stroke-width="2.2" class="text-primary"/>
          </svg>
          <span class="text-lg font-bold tracking-tight"><span class="text-foreground">Etho</span><span class="text-primary">z</span></span>
        </a>
        <span class="rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">Admin</span>
      </div>
      <nav class="hidden items-center gap-1 sm:flex">
        <a
          href="/admin/prospecting"
          class="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors {page.url.pathname.startsWith('/admin/prospecting') ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'}"
        >
          <Search class="size-3.5" />
          Prospecting
        </a>
        <a
          href="/admin/leads"
          class="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors {page.url.pathname.startsWith('/admin/leads') ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'}"
        >
          <Users class="size-3.5" />
          Leads
        </a>
        <a
          href="/admin/content"
          class="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors {page.url.pathname.startsWith('/admin/content') ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'}"
        >
          <FileText class="size-3.5" />
          Content
        </a>
        <a
          href="/admin/settings"
          class="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors {page.url.pathname.startsWith('/admin/settings') ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'}"
        >
          <Settings class="size-3.5" />
          Settings
        </a>
      </nav>
      <div class="flex items-center gap-3">
        {#if adminStore.user?.email}
          <span class="hidden items-center gap-1.5 text-xs text-muted-foreground sm:flex">
            <User class="size-3.5" />
            {adminStore.user.email}
          </span>
        {/if}
        <button
          type="button"
          onclick={handleLogout}
          class="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
        >
          <LogOut class="size-3.5" />
          Salir
        </button>
      </div>
    </div>
  </header>
{/if}

{#if adminStore.authenticated || isLoginPage}
  {@render children()}
{:else}
  <div class="flex min-h-dvh items-center justify-center">
    <div class="size-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
  </div>
{/if}
