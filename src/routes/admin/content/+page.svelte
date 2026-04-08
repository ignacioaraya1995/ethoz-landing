<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import { adminStore } from '$lib/stores/admin.svelte';
  import { supabase } from '$lib/supabase';
  import { env } from '$env/dynamic/public';
  import { onMount } from 'svelte';
  import { toast } from 'svelte-sonner';
  import * as Sheet from '$lib/components/ui/sheet';
  import * as Dialog from '$lib/components/ui/dialog';
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
  import * as Select from '$lib/components/ui/select';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import { Badge } from '$lib/components/ui/badge';
  import { Button } from '$lib/components/ui/button';
  import { Skeleton } from '$lib/components/ui/skeleton';
  import {
    Search,
    RefreshCw,
    Loader2,
    Plus,
    X,
    ChevronDown,
    ChevronRight,
    Trash2,
    Save,
    FileText,
    Calendar,
    Hash,
    Send,
    Link,
    Image,
    MoreHorizontal,
  } from '@lucide/svelte';

  const SUPABASE_URL = env.PUBLIC_SUPABASE_URL ?? '';

  // ── Types ──
  type Platform = 'linkedin' | 'facebook' | 'instagram' | 'youtube' | 'blog' | 'email' | 'whatsapp';
  type PostStatus = 'draft' | 'review' | 'approved' | 'scheduled' | 'published' | 'archived';

  interface ContentPost {
    id: string;
    title: string;
    body: string;
    platform: Platform;
    status: PostStatus;
    scheduled_at?: string | null;
    published_at?: string | null;
    published_url?: string | null;
    image_url?: string | null;
    hashtags?: string[] | null;
    created_by?: string | null;
    created_at: string;
    updated_at?: string | null;
  }

  // ── Auth guard ──
  $effect(() => {
    if (!adminStore.authenticated) goto('/admin');
  });

  // ── State ──
  let posts = $state<ContentPost[]>([]);
  let loading = $state(true);
  let refreshing = $state(false);
  let expandedId = $state<string | null>(null);
  let savingId = $state<string | null>(null);
  let deletingId = $state<string | null>(null);
  let search = $state('');
  let platformFilter = $state<Platform | ''>('');
  let statusFilter = $state<PostStatus | ''>('');

  // ── Sheet state (create + edit) ──
  let sheetOpen = $state(false);
  let sheetMode = $state<'create' | 'edit'>('create');
  let sheetPost = $state<Partial<ContentPost>>({});
  let sheetHashtagInput = $state('');
  let sheetSaving = $state(false);

  // ── Delete dialog ──
  let deleteDialogOpen = $state(false);
  let deleteTargetId = $state<string | null>(null);

  // ── Social publishing ──
  type SocialPlatform = 'linkedin' | 'facebook' | 'instagram' | 'youtube';
  const SOCIAL_PLATFORMS: SocialPlatform[] = ['linkedin', 'facebook', 'instagram', 'youtube'];
  let connectedPlatforms = $state<Set<SocialPlatform>>(new Set());
  let loadingConnections = $state(false);
  let publishingId = $state<string | null>(null);
  let publishError = $state<Record<string, string>>({});

  // ── Helpers ──
  function cleanBody(text: string): string {
    return text
      .replace(/\*\*(.+?)\*\*/g, '$1')
      .replace(/\*(.+?)\*/g, '$1')
      .replace(/^#{1,3}\s+/gm, '')
      .replace(/`(.+?)`/g, '$1')
      .replace(/\[(.+?)\]\(.+?\)/g, '$1')
      .trim();
  }

  function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString('es-CL', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  // ── Load data ──
  async function loadPosts() {
    if (!supabase) return;
    refreshing = true;
    const { data, error } = await supabase
      .from('content_posts')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      toast.error('Error al cargar publicaciones', { description: error.message });
    } else if (data) {
      posts = (data as any[]).map((p) => ({
        ...p,
        hashtags: Array.isArray(p.hashtags)
          ? p.hashtags
          : typeof p.hashtags === 'string' && p.hashtags.trim()
            ? p.hashtags.split(/[,\s#]+/).filter(Boolean)
            : [],
      })) as ContentPost[];
    }
    loading = false;
    refreshing = false;
  }

  async function loadConnectedPlatforms() {
    if (!supabase) return;
    loadingConnections = true;
    const { data, error } = await supabase.from('social_tokens').select('platform');
    if (!error && data) {
      connectedPlatforms = new Set(
        (data as { platform: string }[])
          .map((r) => r.platform)
          .filter((p): p is SocialPlatform => SOCIAL_PLATFORMS.includes(p as SocialPlatform))
      );
    }
    loadingConnections = false;
  }

  onMount(async () => {
    await adminStore.init();
    if (!adminStore.authenticated) { goto('/admin'); return; }
    await Promise.all([loadPosts(), loadConnectedPlatforms()]);

    const connected = page.url.searchParams.get('connected');
    if (connected) {
      toast.success(`${SOCIAL_PLATFORM_LABELS[connected as SocialPlatform] ?? connected} conectado exitosamente`);
      const url = new URL(window.location.href);
      url.searchParams.delete('connected');
      window.history.replaceState({}, '', url.toString());
    }
  });

  // ── Derived ──
  const filtered = $derived.by(() => {
    let list = posts;
    if (platformFilter) list = list.filter((p) => p.platform === platformFilter);
    if (statusFilter) list = list.filter((p) => p.status === statusFilter);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((p) => p.title.toLowerCase().includes(q) || p.body.toLowerCase().includes(q));
    }
    return list;
  });

  const stats = $derived({
    total: posts.length,
    drafts: posts.filter((p) => p.status === 'draft').length,
    approved: posts.filter((p) => p.status === 'approved').length,
    published: posts.filter((p) => p.status === 'published').length,
  });

  // ── Config ──
  const PLATFORM_LABELS: Record<Platform, string> = {
    linkedin: 'LinkedIn', facebook: 'Facebook', instagram: 'Instagram',
    youtube: 'YouTube', blog: 'Blog', email: 'Email', whatsapp: 'WhatsApp',
  };
  const PLATFORM_CLASSES: Record<Platform, string> = {
    linkedin: 'bg-primary/10 text-primary', facebook: 'bg-primary/15 text-primary',
    instagram: 'bg-accent/20 text-accent-foreground', youtube: 'bg-destructive/10 text-destructive',
    blog: 'bg-warning/10 text-warning-foreground', email: 'bg-muted text-muted-foreground',
    whatsapp: 'bg-success/10 text-success',
  };
  const ALL_PLATFORMS: Platform[] = ['linkedin', 'facebook', 'instagram', 'youtube', 'blog', 'email', 'whatsapp'];

  const STATUS_LABELS: Record<PostStatus, string> = {
    draft: 'Borrador', review: 'En revisión', approved: 'Aprobado',
    scheduled: 'Programado', published: 'Publicado', archived: 'Archivado',
  };
  const STATUS_CLASSES: Record<PostStatus, string> = {
    draft: 'bg-muted text-muted-foreground', review: 'bg-warning/10 text-warning-foreground',
    approved: 'bg-primary/10 text-primary', scheduled: 'bg-primary/10 text-primary',
    published: 'bg-success/10 text-success', archived: 'bg-muted text-muted-foreground',
  };
  const ALL_STATUSES: PostStatus[] = ['draft', 'review', 'approved', 'scheduled', 'published', 'archived'];

  const STATUS_NEXT: Partial<Record<PostStatus, PostStatus>> = {
    draft: 'review', review: 'approved', approved: 'published',
  };
  const STATUS_NEXT_LABEL: Partial<Record<PostStatus, string>> = {
    draft: 'Enviar a revisión', review: 'Aprobar', approved: 'Publicar',
  };

  const SOCIAL_PLATFORM_LABELS: Record<SocialPlatform, string> = {
    linkedin: 'LinkedIn', facebook: 'Facebook', instagram: 'Instagram', youtube: 'YouTube',
  };
  const SOCIAL_PLATFORM_BG: Record<SocialPlatform, string> = {
    linkedin: 'bg-primary hover:bg-primary/90', facebook: 'bg-primary/80 hover:bg-primary/70',
    instagram: 'bg-accent hover:bg-accent/90', youtube: 'bg-destructive hover:bg-destructive/90',
  };
  const SOCIAL_AUTH_URLS: Record<SocialPlatform, string> = {
    linkedin: `${SUPABASE_URL}/functions/v1/social-auth-linkedin`,
    facebook: `${SUPABASE_URL}/functions/v1/social-auth-meta`,
    instagram: `${SUPABASE_URL}/functions/v1/social-auth-meta`,
    youtube: `${SUPABASE_URL}/functions/v1/social-auth-google`,
  };

  // ── Sheet helpers ──
  function openCreate() {
    sheetMode = 'create';
    sheetPost = { title: '', body: '', platform: 'linkedin', status: 'draft', hashtags: [] };
    sheetHashtagInput = '';
    sheetOpen = true;
  }

  function openEdit(post: ContentPost) {
    sheetMode = 'edit';
    sheetPost = { ...post, hashtags: post.hashtags ? [...post.hashtags] : [] };
    sheetHashtagInput = '';
    sheetOpen = true;
  }

  function addSheetHashtag() {
    const raw = sheetHashtagInput.trim().replace(/^#/, '');
    if (!raw) return;
    const tags = sheetPost.hashtags ?? [];
    if (!tags.includes(raw)) sheetPost = { ...sheetPost, hashtags: [...tags, raw] };
    sheetHashtagInput = '';
  }

  function removeSheetHashtag(tag: string) {
    sheetPost = { ...sheetPost, hashtags: (sheetPost.hashtags ?? []).filter((t) => t !== tag) };
  }

  async function saveSheet() {
    if (!supabase || !sheetPost.title?.trim() || !sheetPost.body?.trim()) return;
    sheetSaving = true;

    if (sheetMode === 'create') {
      const payload = {
        title: sheetPost.title!.trim(),
        body: sheetPost.body!.trim(),
        platform: sheetPost.platform ?? 'linkedin',
        status: 'draft' as PostStatus,
        hashtags: sheetPost.hashtags ?? [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      const { data, error } = await supabase.from('content_posts').insert([payload]).select().single();
      if (error) {
        toast.error('Error al crear publicación', { description: error.message });
      } else if (data) {
        posts = [data as ContentPost, ...posts];
        sheetOpen = false;
        toast.success('Publicación creada');
      }
    } else {
      const id = sheetPost.id!;
      const { error } = await supabase
        .from('content_posts')
        .update({
          title: sheetPost.title, body: sheetPost.body,
          platform: sheetPost.platform, status: sheetPost.status,
          hashtags: sheetPost.hashtags, updated_at: new Date().toISOString(),
        })
        .eq('id', id);
      if (error) {
        toast.error('Error al guardar', { description: error.message });
      } else {
        posts = posts.map((p) => p.id === id ? { ...p, ...sheetPost, updated_at: new Date().toISOString() } as ContentPost : p);
        sheetOpen = false;
        toast.success('Publicación guardada');
      }
    }
    sheetSaving = false;
  }

  // ── Delete ──
  function confirmDelete(id: string) {
    deleteTargetId = id;
    deleteDialogOpen = true;
  }

  async function deletePost() {
    if (!supabase || !deleteTargetId) return;
    deletingId = deleteTargetId;
    const { error } = await supabase.from('content_posts').delete().eq('id', deleteTargetId);
    if (error) {
      toast.error('Error al eliminar', { description: error.message });
    } else {
      posts = posts.filter((p) => p.id !== deleteTargetId);
      if (expandedId === deleteTargetId) expandedId = null;
      toast.success('Publicación eliminada');
    }
    deletingId = null;
    deleteTargetId = null;
    deleteDialogOpen = false;
  }

  // ── Status advance ──
  async function advanceStatus(post: ContentPost) {
    const next = STATUS_NEXT[post.status];
    if (!supabase || !next) return;
    savingId = post.id;
    const { error } = await supabase
      .from('content_posts')
      .update({ status: next, updated_at: new Date().toISOString() })
      .eq('id', post.id);
    if (error) {
      toast.error('Error al actualizar estado', { description: error.message });
    } else {
      posts = posts.map((p) => p.id === post.id ? { ...p, status: next, updated_at: new Date().toISOString() } : p);
    }
    savingId = null;
  }

  // ── Publish ──
  async function publishPost(post: ContentPost) {
    if (!supabase) return;
    if (post.platform === 'instagram' && !post.image_url) {
      toast.error('Instagram requiere una imagen. Genera una imagen primero.');
      return;
    }
    publishingId = post.id;
    publishError = { ...publishError, [post.id]: '' };

    const { data: sessionData } = await supabase.auth.getSession();
    const access_token = sessionData.session?.access_token;
    if (!access_token) {
      toast.error('No hay sesión activa.');
      publishingId = null;
      return;
    }

    try {
      const res = await fetch(`${SUPABASE_URL}/functions/v1/social-publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${access_token}` },
        body: JSON.stringify({ post_id: post.id, platform: post.platform }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error ?? `Error ${res.status}`);
      }
      const result = await res.json();
      posts = posts.map((p) =>
        p.id === post.id
          ? { ...p, status: 'published' as PostStatus, published_url: result.url ?? p.published_url, published_at: new Date().toISOString() }
          : p
      );
      toast.success(`Publicado en ${PLATFORM_LABELS[post.platform as Platform]} exitosamente`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error desconocido';
      publishError = { ...publishError, [post.id]: msg };
      toast.error('Error al publicar', { description: msg });
    }
    publishingId = null;
  }

  function generateImage(_post: ContentPost) {
    toast.error('Generación de imágenes próximamente');
  }
</script>

<svelte:head>
  <title>Content — Ethoz Admin</title>
  <meta name="robots" content="noindex, nofollow" />
</svelte:head>

{#if !adminStore.authenticated}
  <!-- Auth guard redirect -->
{:else}
  <main class="min-h-dvh bg-secondary pt-14">
    <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

      <!-- Header -->
      <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 class="text-2xl font-bold tracking-tight text-foreground">Content</h1>
          <p class="mt-0.5 text-sm text-muted-foreground">
            {filtered.length.toLocaleString()} de {posts.length.toLocaleString()} publicaciones
          </p>
        </div>
        <div class="flex items-center gap-2">
          <Button variant="outline" onclick={loadPosts} disabled={refreshing}>
            <RefreshCw class="size-4 {refreshing ? 'animate-spin' : ''}" />
            Actualizar
          </Button>
          <Button onclick={openCreate}>
            <Plus class="size-4" />
            Nueva publicación
          </Button>
        </div>
      </div>

      <!-- Stats row -->
      <div class="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div class="rounded-xl border border-border bg-background p-4">
          <p class="text-xs font-medium text-muted-foreground">Total</p>
          <p class="mt-1 text-2xl font-bold tabular-nums text-foreground">{stats.total}</p>
        </div>
        <div class="rounded-xl border border-border bg-background p-4">
          <p class="text-xs font-medium text-muted-foreground">Borradores</p>
          <p class="mt-1 text-2xl font-bold tabular-nums text-foreground">{stats.drafts}</p>
        </div>
        <div class="rounded-xl border border-border bg-background p-4">
          <p class="text-xs font-medium text-muted-foreground">Aprobados</p>
          <p class="mt-1 text-2xl font-bold tabular-nums text-primary">{stats.approved}</p>
        </div>
        <div class="rounded-xl border border-border bg-background p-4">
          <p class="text-xs font-medium text-muted-foreground">Publicados</p>
          <p class="mt-1 text-2xl font-bold tabular-nums text-success">{stats.published}</p>
        </div>
      </div>

      <!-- Connected Accounts bar -->
      <div class="mb-6 rounded-xl border border-border bg-background p-4">
        <div class="mb-3 flex items-center gap-2">
          <Link class="size-4 text-muted-foreground" />
          <p class="text-xs font-semibold text-foreground">Cuentas conectadas</p>
          {#if loadingConnections}
            <Loader2 class="size-3.5 animate-spin text-muted-foreground" />
          {/if}
        </div>
        <div class="flex flex-wrap gap-3">
          {#each SOCIAL_PLATFORMS as platform}
            {@const isConnected = connectedPlatforms.has(platform)}
            <div class="flex items-center gap-2 rounded-lg border border-border px-3 py-2">
              <span class="size-2 rounded-full {isConnected ? 'bg-success' : 'bg-muted-foreground/30'}"></span>
              <span class="text-xs font-medium {isConnected ? 'text-foreground' : 'text-muted-foreground'}">
                {SOCIAL_PLATFORM_LABELS[platform]}
              </span>
              {#if !isConnected}
                <a
                  href={SOCIAL_AUTH_URLS[platform]}
                  class="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-foreground transition-colors hover:bg-muted/70"
                >
                  <Link class="size-3" />
                  Conectar
                </a>
              {/if}
            </div>
          {/each}
        </div>
      </div>

      <!-- Filter bar -->
      <div class="mb-4 rounded-xl border border-border bg-background p-4">
        <div class="flex flex-wrap items-end gap-3">
          <div class="min-w-[200px] flex-1">
            <Label for="search" class="mb-1.5 block text-[11px]">Buscar</Label>
            <div class="relative">
              <Search class="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="search"
                type="text"
                bind:value={search}
                placeholder="Buscar por título o contenido..."
                class="pl-9"
              />
            </div>
          </div>
          <div class="min-w-[160px]">
            <Label for="platform-filter" class="mb-1.5 block text-[11px]">Plataforma</Label>
            <Select.Root type="single" bind:value={platformFilter as any}>
              <Select.Trigger id="platform-filter" class="w-full">
                {platformFilter ? PLATFORM_LABELS[platformFilter as Platform] : 'Todas'}
              </Select.Trigger>
              <Select.Content>
                <Select.Item value="">Todas</Select.Item>
                {#each ALL_PLATFORMS as p}
                  <Select.Item value={p}>{PLATFORM_LABELS[p]}</Select.Item>
                {/each}
              </Select.Content>
            </Select.Root>
          </div>
          <div class="min-w-[160px]">
            <Label for="status-filter" class="mb-1.5 block text-[11px]">Estado</Label>
            <Select.Root type="single" bind:value={statusFilter as any}>
              <Select.Trigger id="status-filter" class="w-full">
                {statusFilter ? STATUS_LABELS[statusFilter as PostStatus] : 'Todos'}
              </Select.Trigger>
              <Select.Content>
                <Select.Item value="">Todos</Select.Item>
                {#each ALL_STATUSES as s}
                  <Select.Item value={s}>{STATUS_LABELS[s]}</Select.Item>
                {/each}
              </Select.Content>
            </Select.Root>
          </div>
        </div>
      </div>

      <!-- Post list -->
      <div class="space-y-3">
        {#if loading}
          {#each Array(4) as _}
            <div class="rounded-xl border border-border bg-background p-5">
              <div class="flex items-start gap-3">
                <Skeleton class="mt-1 size-4 shrink-0" />
                <div class="flex-1 space-y-2">
                  <div class="flex gap-2">
                    <Skeleton class="h-5 w-20 rounded-full" />
                    <Skeleton class="h-5 w-20 rounded-full" />
                  </div>
                  <Skeleton class="h-4 w-2/3" />
                  <Skeleton class="h-3 w-full" />
                </div>
              </div>
            </div>
          {/each}
        {:else if filtered.length === 0}
          <div class="rounded-xl border border-border bg-background px-4 py-12 text-center">
            <FileText class="mx-auto mb-2 size-8 text-muted-foreground/40" />
            <p class="text-sm font-medium text-foreground">Sin publicaciones</p>
            <p class="mt-1 text-xs text-muted-foreground">Crea una nueva publicación o ajusta los filtros</p>
          </div>
        {:else}
          {#each filtered as post (post.id)}
            <div class="overflow-hidden rounded-xl border border-border bg-background transition-shadow hover:shadow-sm">
              <!-- Card header -->
              <div class="flex items-start gap-3 px-5 py-4">
                <button
                  type="button"
                  class="mt-0.5 shrink-0 text-muted-foreground"
                  onclick={() => { expandedId = expandedId === post.id ? null : post.id; }}
                  aria-label="Expandir"
                >
                  {#if expandedId === post.id}
                    <ChevronDown class="size-4" />
                  {:else}
                    <ChevronRight class="size-4" />
                  {/if}
                </button>

                <button
                  type="button"
                  class="min-w-0 flex-1 text-left"
                  onclick={() => { expandedId = expandedId === post.id ? null : post.id; }}
                >
                  <div class="flex flex-wrap items-center gap-2 mb-1">
                    <span class="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold {PLATFORM_CLASSES[post.platform]}">
                      {PLATFORM_LABELS[post.platform]}
                    </span>
                    <span class="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold {STATUS_CLASSES[post.status]}">
                      {STATUS_LABELS[post.status]}
                    </span>
                  </div>
                  <p class="text-sm font-semibold text-foreground truncate">{post.title}</p>
                  <p class="mt-0.5 text-xs text-muted-foreground line-clamp-2">
                    {cleanBody(post.body).slice(0, 150)}{post.body.length > 150 ? '…' : ''}
                  </p>
                  <div class="mt-2 flex flex-wrap items-center gap-3">
                    {#if post.hashtags && post.hashtags.length > 0}
                      <span class="flex items-center gap-1 text-[11px] text-muted-foreground">
                        <Hash class="size-3" />
                        {post.hashtags.slice(0, 3).map((t) => `#${t}`).join(' ')}
                        {#if post.hashtags.length > 3}<span>+{post.hashtags.length - 3}</span>{/if}
                      </span>
                    {/if}
                    <span class="flex items-center gap-1 text-[11px] text-muted-foreground">
                      <Calendar class="size-3" />
                      {formatDate(post.created_at)}
                    </span>
                  </div>
                </button>

                <!-- Actions dropdown -->
                <DropdownMenu.Root>
                  <DropdownMenu.Trigger>
                    <Button variant="ghost" size="icon" class="size-8 shrink-0">
                      <MoreHorizontal class="size-4" />
                    </Button>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Content align="end">
                    <DropdownMenu.Item onclick={() => openEdit(post)}>Editar</DropdownMenu.Item>
                    {#if STATUS_NEXT[post.status]}
                      <DropdownMenu.Item
                        disabled={savingId === post.id}
                        onclick={() => advanceStatus(post)}
                      >
                        {STATUS_NEXT_LABEL[post.status]}
                      </DropdownMenu.Item>
                    {/if}
                    {#if post.status === 'approved' && SOCIAL_PLATFORMS.includes(post.platform as SocialPlatform)}
                      <DropdownMenu.Item
                        disabled={publishingId === post.id}
                        onclick={() => publishPost(post)}
                      >
                        <Send class="size-3.5" />
                        Publicar en {SOCIAL_PLATFORM_LABELS[post.platform as SocialPlatform]}
                      </DropdownMenu.Item>
                    {/if}
                    <DropdownMenu.Separator />
                    <DropdownMenu.Item
                      class="text-destructive focus:text-destructive"
                      onclick={() => confirmDelete(post.id)}
                    >
                      <Trash2 class="size-3.5" />
                      Eliminar
                    </DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu.Root>
              </div>

              <!-- Expanded section (read-only view) -->
              {#if expandedId === post.id}
                <div class="border-t border-border bg-muted/20 px-5 py-4 space-y-4">
                  <div>
                    <p class="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Contenido completo</p>
                    <p class="whitespace-pre-wrap text-sm text-foreground">{cleanBody(post.body)}</p>
                  </div>

                  {#if post.hashtags && post.hashtags.length > 0}
                    <div>
                      <p class="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Hashtags</p>
                      <div class="flex flex-wrap gap-1.5">
                        {#each post.hashtags as tag}
                          <Badge variant="secondary">#{tag}</Badge>
                        {/each}
                      </div>
                    </div>
                  {/if}

                  <div>
                    <p class="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Imagen</p>
                    {#if post.image_url}
                      <img src={post.image_url} alt="" class="h-24 w-auto rounded-lg border border-border object-cover" />
                    {:else}
                      <div class="flex items-center gap-2">
                        <span class="text-xs text-muted-foreground">Sin imagen</span>
                        <Button variant="outline" size="sm" onclick={() => generateImage(post)}>
                          <Image class="size-3.5" />
                          Generar imagen
                        </Button>
                      </div>
                    {/if}
                  </div>

                  {#if post.published_url}
                    <div>
                      <p class="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">URL publicada</p>
                      <a href={post.published_url} target="_blank" rel="noopener noreferrer" class="text-sm text-primary hover:underline break-all">
                        {post.published_url}
                      </a>
                    </div>
                  {/if}

                  {#if publishError[post.id]}
                    <p class="text-xs text-destructive">{publishError[post.id]}</p>
                  {/if}
                </div>
              {/if}
            </div>
          {/each}
        {/if}
      </div>
    </div>
  </main>

  <!-- Create / Edit Sheet -->
  <Sheet.Root bind:open={sheetOpen}>
    <Sheet.Content class="w-full sm:max-w-lg overflow-y-auto">
      <Sheet.Header>
        <Sheet.Title>{sheetMode === 'create' ? 'Nueva publicación' : 'Editar publicación'}</Sheet.Title>
        <Sheet.Description>
          {sheetMode === 'create' ? 'Completa los campos para crear una publicación.' : 'Modifica los campos y guarda los cambios.'}
        </Sheet.Description>
      </Sheet.Header>

      <div class="mt-6 space-y-4 px-6 pb-6">
        <div>
          <Label for="sheet-title" class="mb-1.5 block text-xs">Título</Label>
          <Input id="sheet-title" bind:value={sheetPost.title} placeholder="Título de la publicación" />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <Label for="sheet-platform" class="mb-1.5 block text-xs">Plataforma</Label>
            <Select.Root type="single" bind:value={sheetPost.platform as any}>
              <Select.Trigger id="sheet-platform" class="w-full">
                {sheetPost.platform ? PLATFORM_LABELS[sheetPost.platform as Platform] : 'Seleccionar'}
              </Select.Trigger>
              <Select.Content>
                {#each ALL_PLATFORMS as p}
                  <Select.Item value={p}>{PLATFORM_LABELS[p]}</Select.Item>
                {/each}
              </Select.Content>
            </Select.Root>
          </div>
          {#if sheetMode === 'edit'}
            <div>
              <Label for="sheet-status" class="mb-1.5 block text-xs">Estado</Label>
              <Select.Root type="single" bind:value={sheetPost.status as any}>
                <Select.Trigger id="sheet-status" class="w-full">
                  {sheetPost.status ? STATUS_LABELS[sheetPost.status as PostStatus] : 'Seleccionar'}
                </Select.Trigger>
                <Select.Content>
                  {#each ALL_STATUSES as s}
                    <Select.Item value={s}>{STATUS_LABELS[s]}</Select.Item>
                  {/each}
                </Select.Content>
              </Select.Root>
            </div>
          {/if}
        </div>

        <div>
          <Label for="sheet-body" class="mb-1.5 block text-xs">Contenido</Label>
          <textarea
            id="sheet-body"
            bind:value={sheetPost.body}
            placeholder="Escribe el contenido de la publicación..."
            rows={8}
            class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
          ></textarea>
        </div>

        <div>
          <Label class="mb-1.5 block text-xs">Hashtags</Label>
          <div class="flex flex-wrap gap-1.5 mb-2">
            {#each sheetPost.hashtags ?? [] as tag}
              <span class="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-0.5 text-xs text-foreground">
                #{tag}
                <button type="button" onclick={() => removeSheetHashtag(tag)} class="text-muted-foreground hover:text-foreground" aria-label="Quitar hashtag">
                  <X class="size-3" />
                </button>
              </span>
            {/each}
          </div>
          <div class="flex gap-2">
            <Input
              bind:value={sheetHashtagInput}
              placeholder="#hashtag"
              onkeydown={(e: KeyboardEvent) => { if (e.key === 'Enter') { e.preventDefault(); addSheetHashtag(); } }}
            />
            <Button variant="outline" onclick={addSheetHashtag}>Agregar</Button>
          </div>
        </div>

        <div class="flex justify-end gap-2 border-t border-border pt-4">
          <Button variant="outline" onclick={() => { sheetOpen = false; }}>Cancelar</Button>
          <Button
            onclick={saveSheet}
            disabled={sheetSaving || !sheetPost.title?.trim() || !sheetPost.body?.trim()}
          >
            {#if sheetSaving}
              <Loader2 class="size-4 animate-spin" />
              {sheetMode === 'create' ? 'Creando...' : 'Guardando...'}
            {:else}
              <Save class="size-4" />
              {sheetMode === 'create' ? 'Crear publicación' : 'Guardar'}
            {/if}
          </Button>
        </div>
      </div>
    </Sheet.Content>
  </Sheet.Root>

  <!-- Delete confirmation dialog -->
  <Dialog.Root bind:open={deleteDialogOpen}>
    <Dialog.Content>
      <Dialog.Header>
        <Dialog.Title>Eliminar publicación</Dialog.Title>
        <Dialog.Description>Esta acción no se puede deshacer. ¿Confirmas que deseas eliminar esta publicación?</Dialog.Description>
      </Dialog.Header>
      <Dialog.Footer>
        <Button variant="outline" onclick={() => { deleteDialogOpen = false; deleteTargetId = null; }}>Cancelar</Button>
        <Button variant="destructive" onclick={deletePost} disabled={!!deletingId}>
          {#if deletingId}
            <Loader2 class="size-4 animate-spin" />
            Eliminando...
          {:else}
            <Trash2 class="size-4" />
            Sí, eliminar
          {/if}
        </Button>
      </Dialog.Footer>
    </Dialog.Content>
  </Dialog.Root>
{/if}
