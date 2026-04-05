<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { t } from '$lib/i18n/index.svelte';
  import { Menu, X, ChevronDown, Users, Shield, MapPin, Search, ClipboardList, Eye } from '@lucide/svelte';
  import { env } from '$env/dynamic/public';
  import { slide } from 'svelte/transition';
  import { page } from '$app/state';

  let mobileOpen = $state(false);
  let productsOpen = $state(false);
  let productsTimeout: ReturnType<typeof setTimeout>;

  $effect(() => {
    if (typeof document !== 'undefined') {
      document.body.classList.toggle('overflow-hidden', mobileOpen);
    }
    return () => {
      if (typeof document !== 'undefined') {
        document.body.classList.remove('overflow-hidden');
      }
    };
  });

  const products = [
    { icon: Users, name: 'Perfil Integral del Alumno', href: '/features/student-profile', desc: 'Ficha 360° que persiste entre años' },
    { icon: MapPin, name: 'Retiros Escolares Seguros', href: '/features/safe-pickups', desc: 'Verificación digital en portería' },
    { icon: Shield, name: 'Permisos por Cargo', href: '/features/access-control', desc: 'Cada cargo ve solo lo que necesita' },
    { icon: Search, name: 'Búsqueda Inteligente', href: '/features/smart-search', desc: 'Cualquier alumno en segundos' },
    { icon: ClipboardList, name: 'Registro de Convivencia', href: '/features/privacy-compliance', desc: 'Seguimiento sin reinicio de marzo' },
    { icon: Eye, name: 'Integración Libro Digital', href: '/compliance', desc: 'Conecta con tu proveedor actual' },
  ];

  const navLinksBefore = [
    { key: 'nav.about' as const, href: '/about' },
  ];
  const navLinksAfter = [
    { key: 'nav.pricing' as const, href: '/get-started' },
    { key: 'nav.blog' as const, href: '/blog' },
    { key: 'nav.contact' as const, href: '/contact' },
  ];

  function isActive(href: string): boolean {
    const path = page.url.pathname;
    if (href === '/') return path === '/';
    return path.startsWith(href);
  }

  function isProductActive(): boolean {
    return page.url.pathname.startsWith('/features') || page.url.pathname === '/compliance' || page.url.pathname === '/productos';
  }

  function openProducts() {
    clearTimeout(productsTimeout);
    productsOpen = true;
  }

  function closeProducts() {
    productsTimeout = setTimeout(() => { productsOpen = false; }, 150);
  }
</script>

<nav class="fixed top-0 right-0 left-0 z-50 border-b border-border bg-background/80 backdrop-blur-lg shadow-sm">
  <div class="relative mx-auto grid h-16 max-w-7xl grid-cols-[1fr_auto_1fr] items-center px-4 sm:px-6 lg:px-8">
    <div class="flex items-center">
      <a href="/" class="flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" class="size-7" aria-hidden="true">
          <rect x="2" y="7" width="18" height="22" rx="4.5" fill="none" stroke="currentColor" stroke-width="2.2" class="text-foreground"/>
          <rect x="12" y="3" width="18" height="22" rx="4.5" fill="none" stroke="currentColor" stroke-width="2.2" class="text-primary"/>
        </svg>
        <span class="text-xl font-extrabold tracking-tight"><span class="text-foreground">Etho</span><span class="text-primary">z</span></span>
      </a>
    </div>

    <!-- Desktop nav -->
    <div class="hidden items-center gap-0.5 md:flex">
      <!-- Links before dropdown (¿Qué es?) -->
      {#each navLinksBefore as link}
        <a
          href={link.href}
          class="rounded-lg px-3 py-2 text-sm font-medium transition-colors
            {isActive(link.href)
              ? 'text-primary bg-primary/5'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'}"
        >
          {t(link.key)}
        </a>
      {/each}

      <!-- Productos dropdown -->
      <div
        class="relative"
        onmouseenter={openProducts}
        onmouseleave={closeProducts}
      >
        <button
          type="button"
          class="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors
            {isProductActive()
              ? 'text-primary bg-primary/5'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'}"
          onclick={() => (productsOpen = !productsOpen)}
        >
          {t('nav.features')}
          <ChevronDown class="size-3.5 transition-transform {productsOpen ? 'rotate-180' : ''}" />
        </button>

        {#if productsOpen}
          <div
            class="absolute left-1/2 top-full mt-2 w-[420px] -translate-x-1/2 rounded-xl border border-border bg-background p-3 shadow-lg"
            onmouseenter={openProducts}
            onmouseleave={closeProducts}
          >
            <div class="grid grid-cols-2 gap-1">
              {#each products as product}
                {@const Icon = product.icon}
                <a
                  href={product.href}
                  class="flex items-start gap-2.5 rounded-lg px-3 py-2.5 transition-colors hover:bg-muted/50"
                  onclick={() => (productsOpen = false)}
                >
                  <Icon class="mt-0.5 size-4 shrink-0 text-primary" />
                  <div>
                    <p class="text-xs font-semibold text-foreground">{product.name}</p>
                    <p class="text-[11px] text-muted-foreground">{product.desc}</p>
                  </div>
                </a>
              {/each}
            </div>
            <a
              href="/productos"
              class="mt-2 block border-t border-border pt-2 text-center text-[11px] font-medium text-primary transition-colors hover:text-primary/80"
              onclick={() => (productsOpen = false)}
            >
              Ver todos los productos →
            </a>
          </div>
        {/if}
      </div>

      <!-- Links after dropdown -->
      {#each navLinksAfter as link}
        <a
          href={link.href}
          class="rounded-lg px-3 py-2 text-sm font-medium transition-colors
            {isActive(link.href)
              ? 'text-primary bg-primary/5'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'}"
        >
          {t(link.key)}
        </a>
      {/each}
    </div>
    <div class="md:hidden"></div>

    <!-- Actions -->
    <div class="flex items-center justify-end gap-2">
      <a
        href={env.PUBLIC_APP_URL ?? 'http://localhost:5174/'}
        class="hidden rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-muted/50 md:inline-flex"
      >
        {t('nav.login')}
      </a>
      <Button size="sm" href="/demo" class="hidden md:inline-flex">
        {t('nav.cta')}
      </Button>

      <button
        type="button"
        class="inline-flex items-center justify-center rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground md:hidden"
        onclick={() => (mobileOpen = !mobileOpen)}
        aria-label="Toggle menu"
        aria-expanded={mobileOpen}
      >
        {#if mobileOpen}
          <X class="size-5" />
        {:else}
          <Menu class="size-5" />
        {/if}
      </button>
    </div>
  </div>

  <!-- Mobile menu -->
  {#if mobileOpen}
    <div transition:slide={{ duration: 200 }} class="border-t border-border bg-background px-4 pb-5 pt-3 md:hidden">
      <div class="flex flex-col gap-0.5">
        <!-- ¿Qué es? -->
        {#each navLinksBefore as link}
          <a
            href={link.href}
            class="rounded-lg px-3 py-2.5 text-sm font-medium transition-colors
              {isActive(link.href)
                ? 'text-primary bg-primary/5'
                : 'text-foreground hover:bg-muted/50'}"
            onclick={() => (mobileOpen = false)}
          >
            {t(link.key)}
          </a>
        {/each}

        <!-- Productos -->
        <p class="px-3 pt-3 pb-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{t('nav.features')}</p>
        {#each products as product}
          {@const Icon = product.icon}
          <a
            href={product.href}
            class="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors
              {isActive(product.href)
                ? 'text-primary bg-primary/5'
                : 'text-foreground hover:bg-muted/50'}"
            onclick={() => (mobileOpen = false)}
          >
            <Icon class="size-4 shrink-0 text-primary" />
            {product.name}
          </a>
        {/each}

        <div class="my-2 border-t border-border"></div>

        <!-- ¿Cómo contratar?, Blog, Contacto -->
        {#each navLinksAfter as link}
          <a
            href={link.href}
            class="rounded-lg px-3 py-2.5 text-sm font-medium transition-colors
              {isActive(link.href)
                ? 'text-primary bg-primary/5'
                : 'text-foreground hover:bg-muted/50'}"
            onclick={() => (mobileOpen = false)}
          >
            {t(link.key)}
          </a>
        {/each}
      </div>
      <div class="mt-4 flex flex-col gap-3 border-t border-border pt-4">
        <a
          href={env.PUBLIC_APP_URL ?? 'http://localhost:5174/'}
          class="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted/50"
          onclick={() => (mobileOpen = false)}
        >
          {t('nav.login')}
        </a>
        <Button size="default" href="/demo" class="w-full justify-center" onclick={() => (mobileOpen = false)}>
          {t('nav.cta')}
        </Button>
      </div>
    </div>
  {/if}
</nav>
