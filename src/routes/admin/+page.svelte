<script lang="ts">
  import { goto } from '$app/navigation';
  import { adminStore } from '$lib/stores/admin.svelte';
  import { Lock, Mail } from '@lucide/svelte';
  import { onMount } from 'svelte';

  let email = $state('');
  let password = $state('');
  let errorMsg = $state('');
  let loading = $state(false);

  onMount(async () => {
    await adminStore.init();
    if (adminStore.authenticated) {
      goto('/admin/prospecting');
    }
  });

  $effect(() => {
    if (adminStore.authenticated) {
      goto('/admin/prospecting');
    }
  });

  async function handleSubmit(e: Event) {
    e.preventDefault();
    loading = true;
    errorMsg = '';

    const result = await adminStore.login(email, password);
    if (result.ok) {
      goto('/admin/prospecting');
    } else {
      errorMsg = result.error === 'Invalid login credentials'
        ? 'Contraseña incorrecta'
        : (result.error ?? 'Error al iniciar sesión');
      password = '';
    }
    loading = false;
  }
</script>

<svelte:head>
  <title>Admin — Ethoz</title>
</svelte:head>

<main class="flex min-h-dvh items-center justify-center bg-secondary px-4">
  <div class="w-full max-w-sm">
    <div class="rounded-xl border border-border bg-background p-8 shadow-sm">
      <div class="mb-6 text-center">
        <div class="mx-auto mb-3 flex items-center justify-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" class="size-7" aria-hidden="true">
            <rect x="2" y="7" width="18" height="22" rx="4.5" fill="none" stroke="currentColor" stroke-width="2.2" class="text-foreground"/>
            <rect x="12" y="3" width="18" height="22" rx="4.5" fill="none" stroke="currentColor" stroke-width="2.2" class="text-primary"/>
          </svg>
          <span class="text-xl font-bold tracking-tight"><span class="text-foreground">Etho</span><span class="text-primary">z</span></span>
        </div>
        <p class="text-sm text-muted-foreground">Panel de administración</p>
      </div>

      <form onsubmit={handleSubmit} class="space-y-4">
        <div>
          <label for="admin-email" class="mb-1.5 block text-xs font-medium text-foreground">Email</label>
          <div class="relative">
            <Mail class="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              id="admin-email"
              type="email"
              bind:value={email}
              placeholder="correo@ejemplo.com"
              autocomplete="email"
              class="w-full rounded-lg border border-border bg-background py-2.5 pl-10 pr-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        <div>
          <label for="admin-password" class="mb-1.5 block text-xs font-medium text-foreground">Contraseña</label>
          <div class="relative">
            <Lock class="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              id="admin-password"
              type="password"
              bind:value={password}
              placeholder="Ingresa la contraseña"
              autocomplete="current-password"
              class="w-full rounded-lg border border-border bg-background py-2.5 pl-10 pr-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20
                {errorMsg ? 'border-destructive focus:border-destructive focus:ring-destructive/20' : ''}"
            />
          </div>
          {#if errorMsg}
            <p class="mt-1.5 text-xs text-destructive">{errorMsg}</p>
          {/if}
        </div>

        <button
          type="submit"
          disabled={loading || !password || !email}
          class="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
        >
          {loading ? 'Verificando...' : 'Entrar'}
        </button>
      </form>
    </div>

    <p class="mt-4 text-center text-[11px] text-muted-foreground">
      <a href="/" class="transition-colors hover:text-foreground">Volver al sitio</a>
    </p>
  </div>
</main>
