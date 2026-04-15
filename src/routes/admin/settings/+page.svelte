<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import { adminStore } from '$lib/stores/admin.svelte';
  import { supabase } from '$lib/supabase';
  import { env } from '$env/dynamic/public';
  import { onMount } from 'svelte';
  import { toast } from 'svelte-sonner';
  import { formatDate, capitalize } from '$lib/utils/format';
  import { Button } from '$lib/components/ui/button';
  import { Badge } from '$lib/components/ui/badge';
  import { Skeleton } from '$lib/components/ui/skeleton';
  import * as Dialog from '$lib/components/ui/dialog';
  import * as Tooltip from '$lib/components/ui/tooltip';
  import {
    Loader2,
    RefreshCw,
    ExternalLink,
    Trash2,
    BarChart3,
    Key,
    Share2,
  } from '@lucide/svelte';

  const SUPABASE_URL = env.PUBLIC_SUPABASE_URL ?? '';

  // ── Types ──
  type SocialPlatform = 'linkedin' | 'facebook' | 'instagram' | 'youtube';

  interface SocialToken {
    platform: SocialPlatform;
    access_token: string;
    refresh_token?: string | null;
    token_expiry?: string | null;
    page_token?: string | null;
    page_id?: string | null;
    ig_account_id?: string | null;
    org_id?: string | null;
    channel_id?: string | null;
    metadata?: Record<string, unknown> | null;
    created_at: string;
    updated_at?: string | null;
  }

  type PostStatus = 'draft' | 'approved' | 'published';

  interface ContentStats {
    draft: number;
    approved: number;
    published: number;
  }

  // ── Auth guard ──
  $effect(() => {
    if (!adminStore.authenticated) goto('/admin');
  });

  // ── State ──
  let loading = $state(true);
  let tokens = $state<Record<SocialPlatform, SocialToken | null>>({
    linkedin: null,
    facebook: null,
    instagram: null,
    youtube: null,
  });
  let disconnecting = $state<SocialPlatform | null>(null);
  let contentStats = $state<ContentStats>({ draft: 0, approved: 0, published: 0 });
  let confirmDisconnect = $state<SocialPlatform | null>(null);

  // ── Platform config ──
  const PLATFORMS: { id: SocialPlatform; name: string; color: string; profileUrl: string; svg: string }[] = [
    {
      id: 'linkedin',
      name: 'LinkedIn',
      color: 'var(--brand-linkedin)',
      profileUrl: 'https://www.linkedin.com/company/ethozcl/',
      svg: `<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="size-5"><title>LinkedIn</title><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>`,
    },
    {
      id: 'facebook',
      name: 'Facebook',
      color: 'var(--brand-facebook)',
      profileUrl: 'https://web.facebook.com/profile.php?id=1083964671464526',
      svg: `<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="size-5"><title>Facebook</title><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>`,
    },
    {
      id: 'instagram',
      name: 'Instagram',
      color: 'var(--brand-instagram)',
      profileUrl: 'https://www.instagram.com/ethoz.cl/',
      svg: `<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="size-5"><title>Instagram</title><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>`,
    },
    {
      id: 'youtube',
      name: 'YouTube',
      color: 'var(--brand-youtube)',
      profileUrl: 'https://www.youtube.com/channel/UCYeWEdqonYWKvja78_HM2TA',
      svg: `<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="size-5"><title>YouTube</title><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>`,
    },
  ];

  // ── Load data ──
  async function loadData() {
    if (!supabase) return;

    const [tokensResult, statsResult] = await Promise.all([
      supabase.from('social_tokens').select('*'),
      supabase.from('content_posts').select('status'),
    ]);

    if (tokensResult.data) {
      const updated: Record<SocialPlatform, SocialToken | null> = {
        linkedin: null,
        facebook: null,
        instagram: null,
        youtube: null,
      };
      for (const t of tokensResult.data as SocialToken[]) {
        if (t.platform in updated) {
          updated[t.platform] = t;
        }
      }
      tokens = updated;
    }

    if (statsResult.data) {
      const stats: ContentStats = { draft: 0, approved: 0, published: 0 };
      for (const row of statsResult.data as { status: string }[]) {
        if (row.status === 'draft') stats.draft++;
        else if (row.status === 'approved') stats.approved++;
        else if (row.status === 'published') stats.published++;
      }
      contentStats = stats;
    }

    loading = false;
  }

  onMount(async () => {
    await adminStore.init();
    if (!adminStore.authenticated) {
      goto('/admin');
      return;
    }

    // Check for OAuth callback success
    const connected = page.url.searchParams.get('connected');
    if (connected) {
      toast.success(`${capitalize(connected)} conectado correctamente`);
    }

    await loadData();
  });

  // ── Disconnect ──
  async function disconnect(platform: SocialPlatform) {
    if (!supabase || disconnecting) return;
    disconnecting = platform;
    confirmDisconnect = null;

    const { error } = await supabase
      .from('social_tokens')
      .delete()
      .eq('platform', platform);

    if (error) {
      toast.error('Error al desconectar', { description: error.message });
    } else {
      tokens = { ...tokens, [platform]: null };
      toast.success(`${capitalize(platform)} desconectado`);
    }
    disconnecting = null;
  }

  // ── Helpers ──
  function isTokenExpired(token: SocialToken | undefined): boolean {
    if (!token) return false;
    // If there's a refresh_token, the token is auto-refreshed — never "expired" from user perspective
    if (token.refresh_token) return false;
    if (!token.token_expiry) return false;
    return new Date(token.token_expiry) < new Date();
  }

  function getDisplayName(token: SocialToken): string {
    const meta = token.metadata as Record<string, unknown> | null;
    if (meta?.page_name) return String(meta.page_name);
    if (meta?.org_name) return String(meta.org_name);
    if (meta?.name) return String(meta.name);
    if (token.page_id) return `Page ${token.page_id}`;
    if (token.org_id) return `Org ${token.org_id}`;
    return '';
  }

  const STAT_LABELS: Record<PostStatus, string> = {
    draft: 'Borrador',
    approved: 'Aprobado',
    published: 'Publicado',
  };

  const STAT_CLASSES: Record<PostStatus, string> = {
    draft: 'bg-muted text-muted-foreground',
    approved: 'bg-primary/10 text-primary',
    published: 'bg-success/10 text-success',
  };

  const supabaseConfigured = !!SUPABASE_URL;
</script>

<svelte:head>
  <title>Settings — Ethoz Admin</title>
  <meta name="robots" content="noindex, nofollow" />
</svelte:head>

{#if !adminStore.authenticated}
  <!-- Auth guard redirect -->
{:else}
  <main class="min-h-dvh bg-secondary pt-14">
    <div class="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 class="text-2xl font-bold tracking-tight text-foreground">Settings</h1>
          <p class="mt-0.5 text-sm text-muted-foreground">Manage integrations and account configuration</p>
        </div>
        <Button variant="outline" onclick={loadData} disabled={loading}>
          <RefreshCw class="size-4 {loading ? 'animate-spin' : ''}" />
          Refresh
        </Button>
      </div>

      <!-- ── Social Media Connections ── -->
      <section class="mb-8">
        <div class="mb-4 flex items-center gap-2">
          <Share2 class="size-4 text-muted-foreground" />
          <h2 class="text-base font-semibold text-foreground">Social Media Connections</h2>
        </div>

        {#if loading}
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {#each Array(4) as _}
              <div class="rounded-xl border border-border bg-background p-4 space-y-3">
                <div class="flex items-center justify-between">
                  <Skeleton class="h-5 w-24" />
                  <Skeleton class="h-5 w-20 rounded-full" />
                </div>
                <Skeleton class="h-3 w-32" />
                <Skeleton class="h-3 w-40" />
                <div class="flex gap-2 pt-1">
                  <Skeleton class="h-8 w-20" />
                  <Skeleton class="h-8 w-20" />
                </div>
              </div>
            {/each}
          </div>
        {:else}
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {#each PLATFORMS as platform}
              {@const token = tokens[platform.id]}
              {@const expired = isTokenExpired(token ?? undefined)}
              {@const displayName = token ? getDisplayName(token) : ''}

              <div class="rounded-xl border border-border bg-background p-4">
                <!-- Platform header -->
                <div class="mb-3 flex items-center justify-between">
                  <div class="flex items-center gap-2.5">
                    <span style="color: {platform.color}">{@html platform.svg}</span>
                    <span class="font-medium text-foreground">{platform.name}</span>
                  </div>
                  {#if token}
                    <Badge variant={expired ? 'secondary' : 'default'}>
                      {expired ? 'Token expired' : 'Connected'}
                    </Badge>
                  {:else}
                    <Badge variant="outline">Not connected</Badge>
                  {/if}
                </div>

                <!-- Connection details -->
                {#if token}
                  <div class="mb-3 space-y-1">
                    {#if displayName}
                      <p class="text-xs text-foreground">{displayName}</p>
                    {/if}
                    <p class="text-xs text-muted-foreground">
                      Connected {formatDate(token.created_at)}
                    </p>
                    {#if token.token_expiry}
                      <p class="text-xs {expired ? 'text-warning-foreground' : 'text-muted-foreground'}">
                        Expires {formatDate(token.token_expiry)}
                      </p>
                    {/if}
                  </div>
                {:else}
                  <p class="mb-3 text-xs text-muted-foreground">No account connected.</p>
                {/if}

                <!-- Actions -->
                <div class="flex flex-wrap items-center gap-2">
                  <Tooltip.Provider>
                    <Tooltip.Root>
                      <Tooltip.Trigger>
                        {#snippet child({ props })}
                          <Button
                            {...props}
                            href={platform.profileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            variant="outline"
                            size="sm"
                          >
                            <ExternalLink class="size-3.5" />
                            Ver perfil
                          </Button>
                        {/snippet}
                      </Tooltip.Trigger>
                      <Tooltip.Content>Abrir perfil público</Tooltip.Content>
                    </Tooltip.Root>
                  </Tooltip.Provider>

                  <Button
                    href="{SUPABASE_URL}/functions/v1/social-auth-{platform.id === 'facebook' || platform.id === 'instagram' ? 'meta' : platform.id === 'youtube' ? 'google' : platform.id}"
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="outline"
                    size="sm"
                  >
                    <ExternalLink class="size-3.5" />
                    {token ? 'Reconnect' : 'Connect'}
                  </Button>

                  {#if token}
                    <Button
                      variant="outline"
                      size="sm"
                      onclick={() => (confirmDisconnect = platform.id)}
                      disabled={disconnecting === platform.id}
                      class="border-destructive/20 text-destructive hover:bg-destructive/10 hover:text-destructive"
                    >
                      {#if disconnecting === platform.id}
                        <Loader2 class="size-3.5 animate-spin" />
                      {:else}
                        <Trash2 class="size-3.5" />
                      {/if}
                      Disconnect
                    </Button>
                  {/if}
                </div>
              </div>
            {/each}
          </div>
        {/if}
      </section>

      <!-- ── Content Stats ── -->
      <section class="mb-8">
        <div class="mb-4 flex items-center gap-2">
          <BarChart3 class="size-4 text-muted-foreground" />
          <h2 class="text-base font-semibold text-foreground">Content Stats</h2>
        </div>

        <div class="grid grid-cols-3 gap-4">
          {#each (['draft', 'approved', 'published'] as PostStatus[]) as status}
            <div class="rounded-xl border border-border bg-background p-4">
              <p class="text-xs font-medium text-muted-foreground">{STAT_LABELS[status]}</p>
              {#if loading}
                <Skeleton class="mt-1 h-9 w-12" />
              {:else}
                <p class="mt-1 text-3xl font-bold tabular-nums text-foreground">{contentStats[status]}</p>
              {/if}
              <Badge variant={status === 'published' ? 'default' : status === 'approved' ? 'secondary' : 'outline'} class="mt-2">
                {STAT_LABELS[status]}
              </Badge>
            </div>
          {/each}
        </div>
      </section>

      <!-- ── API Keys Status ── -->
      <section>
        <div class="mb-4 flex items-center gap-2">
          <Key class="size-4 text-muted-foreground" />
          <h2 class="text-base font-semibold text-foreground">API Keys Status</h2>
        </div>

        <div class="rounded-xl border border-border bg-background divide-y divide-border">
          <div class="flex items-center justify-between px-4 py-3">
            <span class="text-sm text-foreground">Supabase</span>
            <Badge variant={supabaseConfigured ? 'default' : 'destructive'}>
              {supabaseConfigured ? 'Configured' : 'Not configured'}
            </Badge>
          </div>
          <div class="flex items-center justify-between px-4 py-3">
            <span class="text-sm text-foreground">Admin Auth</span>
            <Badge variant="default">Active session</Badge>
          </div>
          <div class="px-4 py-3">
            <p class="text-xs text-muted-foreground">API keys are stored server-side and are not exposed to the client.</p>
          </div>
        </div>
      </section>

    </div>
  </main>

  <!-- Disconnect confirmation dialog -->
  <Dialog.Root open={confirmDisconnect !== null} onOpenChange={(open) => { if (!open) confirmDisconnect = null; }}>
    <Dialog.Content>
      <Dialog.Header>
        <Dialog.Title>Desconectar cuenta</Dialog.Title>
        <Dialog.Description>
          ¿Estás seguro de desconectar <strong>{confirmDisconnect}</strong>? Tendrás que volver a autorizar para publicar contenido.
        </Dialog.Description>
      </Dialog.Header>
      <Dialog.Footer>
        <Button variant="outline" onclick={() => (confirmDisconnect = null)}>Cancelar</Button>
        <Button
          variant="destructive"
          onclick={() => confirmDisconnect && disconnect(confirmDisconnect)}
        >
          Desconectar
        </Button>
      </Dialog.Footer>
    </Dialog.Content>
  </Dialog.Root>
{/if}
