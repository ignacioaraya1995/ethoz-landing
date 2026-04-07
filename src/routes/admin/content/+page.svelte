<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import { adminStore } from '$lib/stores/admin.svelte';
  import { supabase } from '$lib/supabase';
  import { env } from '$env/dynamic/public';
  import { onMount } from 'svelte';
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
    CheckCircle2,
    AlertCircle,
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
  let editingId = $state<string | null>(null);
  let savingId = $state<string | null>(null);
  let deletingId = $state<string | null>(null);
  let confirmDeleteId = $state<string | null>(null);
  // ── Helpers ──
  function cleanBody(text: string): string {
    return text
      .replace(/\*\*(.+?)\*\*/g, '$1')   // **bold** → bold
      .replace(/\*(.+?)\*/g, '$1')        // *italic* → italic
      .replace(/^#{1,3}\s+/gm, '')         // # headings
      .replace(/`(.+?)`/g, '$1')          // `code`
      .replace(/\[(.+?)\]\(.+?\)/g, '$1') // [text](url) → text
      .trim();
  }

  let search = $state('');
  let platformFilter = $state<Platform | ''>('');
  let statusFilter = $state<PostStatus | ''>('');
  let showCreateForm = $state(false);

  // ── Edit draft ──
  let editDraft = $state<Partial<ContentPost>>({});

  // ── New post form ──
  let newPost = $state<Partial<ContentPost>>({
    title: '',
    body: '',
    platform: 'linkedin',
    status: 'draft',
    hashtags: [],
  });
  let newHashtagInput = $state('');
  let creatingPost = $state(false);

  // ── Load data ──
  async function loadPosts() {
    if (!supabase) return;
    refreshing = true;

    const { data, error } = await supabase
      .from('content_posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
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

  onMount(async () => {
    await adminStore.init();
    if (!adminStore.authenticated) {
      goto('/admin');
      return;
    }
    await Promise.all([loadPosts(), loadConnectedPlatforms()]);

    // Check for OAuth callback success
    const connected = page.url.searchParams.get('connected');
    if (connected) {
      showToast(`${SOCIAL_PLATFORM_LABELS[connected as SocialPlatform] ?? connected} conectado exitosamente`);
      // Clean up URL param without navigation
      const url = new URL(window.location.href);
      url.searchParams.delete('connected');
      window.history.replaceState({}, '', url.toString());
    }
  });

  // ── Derived ──
  const filtered = $derived.by(() => {
    let list = posts;

    if (platformFilter) {
      list = list.filter((p) => p.platform === platformFilter);
    }
    if (statusFilter) {
      list = list.filter((p) => p.status === statusFilter);
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.body.toLowerCase().includes(q)
      );
    }

    return list;
  });

  const stats = $derived({
    total: posts.length,
    drafts: posts.filter((p) => p.status === 'draft').length,
    approved: posts.filter((p) => p.status === 'approved').length,
    published: posts.filter((p) => p.status === 'published').length,
  });

  // ── Platform config ──
  const PLATFORM_LABELS: Record<Platform, string> = {
    linkedin: 'LinkedIn',
    facebook: 'Facebook',
    instagram: 'Instagram',
    youtube: 'YouTube',
    blog: 'Blog',
    email: 'Email',
    whatsapp: 'WhatsApp',
  };

  const PLATFORM_CLASSES: Record<Platform, string> = {
    linkedin: 'bg-blue-100 text-blue-800',
    facebook: 'bg-indigo-100 text-indigo-800',
    instagram: 'bg-pink-100 text-pink-800',
    youtube: 'bg-red-100 text-red-800',
    blog: 'bg-orange-100 text-orange-800',
    email: 'bg-teal-100 text-teal-800',
    whatsapp: 'bg-green-100 text-green-800',
  };

  const ALL_PLATFORMS: Platform[] = ['linkedin', 'facebook', 'instagram', 'youtube', 'blog', 'email', 'whatsapp'];

  // ── Status config ──
  const STATUS_LABELS: Record<PostStatus, string> = {
    draft: 'Borrador',
    review: 'En revisión',
    approved: 'Aprobado',
    scheduled: 'Programado',
    published: 'Publicado',
    archived: 'Archivado',
  };

  const STATUS_CLASSES: Record<PostStatus, string> = {
    draft: 'bg-muted text-muted-foreground',
    review: 'bg-yellow-50 text-yellow-700',
    approved: 'bg-primary/10 text-primary',
    scheduled: 'bg-blue-50 text-blue-700',
    published: 'bg-green-50 text-green-700',
    archived: 'bg-muted text-muted-foreground',
  };

  const ALL_STATUSES: PostStatus[] = ['draft', 'review', 'approved', 'scheduled', 'published', 'archived'];

  // ── Workflow transitions ──
  const STATUS_NEXT: Partial<Record<PostStatus, PostStatus>> = {
    draft: 'review',
    review: 'approved',
    approved: 'published',
  };

  const STATUS_NEXT_LABEL: Partial<Record<PostStatus, string>> = {
    draft: 'Enviar a revisión',
    review: 'Aprobar',
    approved: 'Publicar',
  };

  // ── Handlers ──
  function toggleExpand(id: string) {
    if (expandedId === id) {
      expandedId = null;
      editingId = null;
      editDraft = {};
    } else {
      expandedId = id;
      editingId = null;
      editDraft = {};
    }
  }

  function startEdit(post: ContentPost) {
    editingId = post.id;
    editDraft = {
      title: post.title,
      body: post.body,
      platform: post.platform,
      status: post.status,
      hashtags: post.hashtags ? [...post.hashtags] : [],
    };
  }

  function cancelEdit() {
    editingId = null;
    editDraft = {};
  }

  async function savePost(post: ContentPost) {
    if (!supabase) return;
    savingId = post.id;

    const { error } = await supabase
      .from('content_posts')
      .update({
        title: editDraft.title,
        body: editDraft.body,
        platform: editDraft.platform,
        status: editDraft.status,
        hashtags: editDraft.hashtags,
        updated_at: new Date().toISOString(),
      })
      .eq('id', post.id);

    if (!error) {
      posts = posts.map((p) =>
        p.id === post.id ? { ...p, ...editDraft, updated_at: new Date().toISOString() } as ContentPost : p
      );
      editingId = null;
      editDraft = {};
    }
    savingId = null;
  }

  async function advanceStatus(post: ContentPost) {
    const next = STATUS_NEXT[post.status];
    if (!supabase || !next) return;
    savingId = post.id;

    const { error } = await supabase
      .from('content_posts')
      .update({ status: next, updated_at: new Date().toISOString() })
      .eq('id', post.id);

    if (!error) {
      posts = posts.map((p) =>
        p.id === post.id ? { ...p, status: next, updated_at: new Date().toISOString() } : p
      );
    }
    savingId = null;
  }

  async function deletePost(id: string) {
    if (!supabase) return;
    deletingId = id;

    const { error } = await supabase
      .from('content_posts')
      .delete()
      .eq('id', id);

    if (!error) {
      posts = posts.filter((p) => p.id !== id);
      if (expandedId === id) expandedId = null;
    }
    deletingId = null;
    confirmDeleteId = null;
  }

  async function createPost() {
    if (!supabase || !newPost.title?.trim() || !newPost.body?.trim()) return;
    creatingPost = true;

    const payload = {
      title: newPost.title!.trim(),
      body: newPost.body!.trim(),
      platform: newPost.platform ?? 'linkedin',
      status: 'draft' as PostStatus,
      hashtags: newPost.hashtags ?? [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('content_posts')
      .insert([payload])
      .select()
      .single();

    if (!error && data) {
      posts = [data as ContentPost, ...posts];
      showCreateForm = false;
      newPost = { title: '', body: '', platform: 'linkedin', status: 'draft', hashtags: [] };
      newHashtagInput = '';
    }
    creatingPost = false;
  }

  function addHashtag(tagInput: string, target: 'edit' | 'new') {
    const raw = tagInput.trim().replace(/^#/, '');
    if (!raw) return;

    if (target === 'edit') {
      const tags = editDraft.hashtags ?? [];
      if (!tags.includes(raw)) {
        editDraft = { ...editDraft, hashtags: [...tags, raw] };
      }
    } else {
      const tags = newPost.hashtags ?? [];
      if (!tags.includes(raw)) {
        newPost = { ...newPost, hashtags: [...tags, raw] };
      }
      newHashtagInput = '';
    }
  }

  function removeHashtag(tag: string, target: 'edit' | 'new') {
    if (target === 'edit') {
      editDraft = { ...editDraft, hashtags: (editDraft.hashtags ?? []).filter((t) => t !== tag) };
    } else {
      newPost = { ...newPost, hashtags: (newPost.hashtags ?? []).filter((t) => t !== tag) };
    }
  }

  function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString('es-CL', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }

  let editHashtagInput = $state('');

  // ── Social publishing state ──
  type SocialPlatform = 'linkedin' | 'facebook' | 'instagram' | 'youtube';
  const SOCIAL_PLATFORMS: SocialPlatform[] = ['linkedin', 'facebook', 'instagram', 'youtube'];

  const SOCIAL_PLATFORM_LABELS: Record<SocialPlatform, string> = {
    linkedin: 'LinkedIn',
    facebook: 'Facebook',
    instagram: 'Instagram',
    youtube: 'YouTube',
  };

  const SOCIAL_PLATFORM_COLORS: Record<SocialPlatform, string> = {
    linkedin: 'text-blue-600',
    facebook: 'text-indigo-600',
    instagram: 'text-pink-600',
    youtube: 'text-red-600',
  };

  const SOCIAL_PLATFORM_BG: Record<SocialPlatform, string> = {
    linkedin: 'bg-blue-600 hover:bg-blue-700',
    facebook: 'bg-indigo-600 hover:bg-indigo-700',
    instagram: 'bg-pink-600 hover:bg-pink-700',
    youtube: 'bg-red-600 hover:bg-red-700',
  };

  const SOCIAL_AUTH_URLS: Record<SocialPlatform, string> = {
    linkedin: `${SUPABASE_URL}/functions/v1/social-auth-linkedin`,
    facebook: `${SUPABASE_URL}/functions/v1/social-auth-meta`,
    instagram: `${SUPABASE_URL}/functions/v1/social-auth-meta`,
    youtube: `${SUPABASE_URL}/functions/v1/social-auth-google`,
  };

  let connectedPlatforms = $state<Set<SocialPlatform>>(new Set());
  let loadingConnections = $state(false);
  let publishingId = $state<string | null>(null);
  let publishError = $state<Record<string, string>>({});
  let toastMessage = $state<string | null>(null);
  let toastType = $state<'success' | 'error'>('success');

  function showToast(msg: string, type: 'success' | 'error' = 'success') {
    toastMessage = msg;
    toastType = type;
    setTimeout(() => { toastMessage = null; }, 4000);
  }

  async function loadConnectedPlatforms() {
    if (!supabase) return;
    loadingConnections = true;
    const { data, error } = await supabase
      .from('social_tokens')
      .select('platform');
    if (!error && data) {
      connectedPlatforms = new Set(
        (data as { platform: string }[])
          .map((r) => r.platform)
          .filter((p): p is SocialPlatform => SOCIAL_PLATFORMS.includes(p as SocialPlatform))
      );
    }
    loadingConnections = false;
  }

  async function publishPost(post: ContentPost) {
    if (!supabase) return;
    publishingId = post.id;
    publishError = { ...publishError, [post.id]: '' };

    if (post.platform === 'instagram' && !post.image_url) {
      publishError = { ...publishError, [post.id]: 'Instagram requiere una imagen. Genera una imagen primero.' };
      publishingId = null;
      return;
    }

    const { data: sessionData } = await supabase.auth.getSession();
    const access_token = sessionData.session?.access_token;

    if (!access_token) {
      publishError = { ...publishError, [post.id]: 'No hay sesión activa.' };
      publishingId = null;
      return;
    }

    try {
      const res = await fetch(`${SUPABASE_URL}/functions/v1/social-publish`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${access_token}`,
        },
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
      showToast(`Publicado en ${PLATFORM_LABELS[post.platform as Platform]} exitosamente`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error desconocido';
      publishError = { ...publishError, [post.id]: msg };
    }
    publishingId = null;
  }

  // image generation placeholder
  function generateImage(_post: ContentPost) {
    // TODO: Connect Gemini image generation
    showToast('Generación de imágenes próximamente', 'error');
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
    {#if loading}
      <div class="flex items-center justify-center py-32">
        <Loader2 class="size-8 animate-spin text-primary" />
      </div>
    {:else}
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
            <button
              type="button"
              onclick={loadPosts}
              disabled={refreshing}
              class="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted/50 disabled:opacity-50"
            >
              <RefreshCw class="size-4 {refreshing ? 'animate-spin' : ''}" />
              Actualizar
            </button>
            <button
              type="button"
              onclick={() => { showCreateForm = !showCreateForm; }}
              class="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <Plus class="size-4" />
              Nueva publicación
            </button>
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
            <p class="mt-1 text-2xl font-bold tabular-nums text-green-600">{stats.published}</p>
          </div>
        </div>

        <!-- Toast notification -->
        {#if toastMessage}
          <div class="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-3 shadow-lg text-sm font-medium {toastType === 'success' ? 'text-green-700' : 'text-destructive'}">
            {#if toastType === 'success'}
              <CheckCircle2 class="size-4 shrink-0" />
            {:else}
              <AlertCircle class="size-4 shrink-0" />
            {/if}
            {toastMessage}
          </div>
        {/if}

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
                <span class="size-2 rounded-full {isConnected ? 'bg-green-500' : 'bg-muted-foreground/30'}"></span>
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

        <!-- Create form -->
        {#if showCreateForm}
          <div class="mb-6 rounded-xl border border-border bg-background p-5">
            <div class="mb-4 flex items-center justify-between">
              <h2 class="text-sm font-semibold text-foreground">Nueva publicación</h2>
              <button
                type="button"
                onclick={() => { showCreateForm = false; }}
                class="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
                aria-label="Cerrar"
              >
                <X class="size-4" />
              </button>
            </div>

            <div class="space-y-4">
              <div>
                <label for="new-title" class="mb-1 block text-xs font-medium text-muted-foreground">Título</label>
                <input
                  id="new-title"
                  type="text"
                  bind:value={newPost.title}
                  placeholder="Título de la publicación"
                  class="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label for="new-platform" class="mb-1 block text-xs font-medium text-muted-foreground">Plataforma</label>
                  <select
                    id="new-platform"
                    bind:value={newPost.platform}
                    class="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-primary"
                  >
                    {#each ALL_PLATFORMS as p}
                      <option value={p}>{PLATFORM_LABELS[p]}</option>
                    {/each}
                  </select>
                </div>
              </div>

              <div>
                <label for="new-body" class="mb-1 block text-xs font-medium text-muted-foreground">Contenido</label>
                <textarea
                  id="new-body"
                  bind:value={newPost.body}
                  placeholder="Escribe el contenido de la publicación..."
                  rows={6}
                  class="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                ></textarea>
              </div>

              <div>
                <p class="mb-1 text-xs font-medium text-muted-foreground">Hashtags</p>
                <div class="flex flex-wrap gap-1.5 mb-2">
                  {#each newPost.hashtags ?? [] as tag}
                    <span class="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-0.5 text-xs text-foreground">
                      #{tag}
                      <button
                        type="button"
                        onclick={() => removeHashtag(tag, 'new')}
                        class="text-muted-foreground hover:text-foreground"
                        aria-label="Quitar hashtag"
                      >
                        <X class="size-3" />
                      </button>
                    </span>
                  {/each}
                </div>
                <div class="flex gap-2">
                  <input
                    type="text"
                    bind:value={newHashtagInput}
                    placeholder="#hashtag"
                    onkeydown={(e) => {
                      if (e.key === 'Enter') { e.preventDefault(); addHashtag(newHashtagInput, 'new'); }
                    }}
                    class="flex-1 rounded-lg border border-border bg-background px-3 py-1.5 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                  <button
                    type="button"
                    onclick={() => addHashtag(newHashtagInput, 'new')}
                    class="rounded-lg border border-border bg-background px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-muted/50"
                  >
                    Agregar
                  </button>
                </div>
              </div>

              <div class="flex justify-end gap-2 border-t border-border pt-4">
                <button
                  type="button"
                  onclick={() => { showCreateForm = false; }}
                  class="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted/50"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onclick={createPost}
                  disabled={creatingPost || !newPost.title?.trim() || !newPost.body?.trim()}
                  class="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
                >
                  {#if creatingPost}
                    <Loader2 class="size-4 animate-spin" />
                    Creando...
                  {:else}
                    <Plus class="size-4" />
                    Crear publicación
                  {/if}
                </button>
              </div>
            </div>
          </div>
        {/if}

        <!-- Filter bar -->
        <div class="mb-4 rounded-xl border border-border bg-background p-4">
          <div class="flex flex-wrap items-end gap-3">
            <div class="min-w-[200px] flex-1">
              <label for="search" class="mb-1 block text-[11px] font-medium text-muted-foreground">Buscar</label>
              <div class="relative">
                <Search class="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="search"
                  type="text"
                  bind:value={search}
                  placeholder="Buscar por título o contenido..."
                  class="w-full rounded-lg border border-border bg-background py-2 pl-9 pr-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
            <div>
              <label for="platform-filter" class="mb-1 block text-[11px] font-medium text-muted-foreground">Plataforma</label>
              <select
                id="platform-filter"
                bind:value={platformFilter}
                class="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-primary"
              >
                <option value="">Todas</option>
                {#each ALL_PLATFORMS as p}
                  <option value={p}>{PLATFORM_LABELS[p]}</option>
                {/each}
              </select>
            </div>
            <div>
              <label for="status-filter" class="mb-1 block text-[11px] font-medium text-muted-foreground">Estado</label>
              <select
                id="status-filter"
                bind:value={statusFilter}
                class="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-primary"
              >
                <option value="">Todos</option>
                {#each ALL_STATUSES as s}
                  <option value={s}>{STATUS_LABELS[s]}</option>
                {/each}
              </select>
            </div>
          </div>
        </div>

        <!-- Post list -->
        <div class="space-y-3">
          {#if filtered.length === 0}
            <div class="rounded-xl border border-border bg-background px-4 py-12 text-center">
              <FileText class="mx-auto mb-2 size-8 text-muted-foreground/40" />
              <p class="text-sm font-medium text-foreground">Sin publicaciones</p>
              <p class="mt-1 text-xs text-muted-foreground">Crea una nueva publicación o ajusta los filtros</p>
            </div>
          {:else}
            {#each filtered as post}
              <div class="overflow-hidden rounded-xl border border-border bg-background transition-shadow hover:shadow-sm">
                <!-- Card header (click to expand) -->
                <button
                  type="button"
                  class="w-full px-5 py-4 text-left"
                  onclick={() => toggleExpand(post.id)}
                >
                  <div class="flex items-start gap-3">
                    <span class="mt-0.5 shrink-0 text-muted-foreground">
                      {#if expandedId === post.id}
                        <ChevronDown class="size-4" />
                      {:else}
                        <ChevronRight class="size-4" />
                      {/if}
                    </span>

                    <div class="min-w-0 flex-1">
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
                            {#if post.hashtags.length > 3}
                              <span>+{post.hashtags.length - 3}</span>
                            {/if}
                          </span>
                        {/if}
                        <span class="flex items-center gap-1 text-[11px] text-muted-foreground">
                          <Calendar class="size-3" />
                          {formatDate(post.created_at)}
                        </span>
                      </div>
                    </div>
                  </div>
                </button>

                <!-- Expanded section -->
                {#if expandedId === post.id}
                  <div class="border-t border-border bg-muted/20 px-5 py-4">
                    {#if editingId === post.id}
                      <!-- Edit form -->
                      <div class="space-y-4">
                        <div>
                          <label for="edit-title-{post.id}" class="mb-1 block text-xs font-medium text-muted-foreground">Título</label>
                          <input
                            id="edit-title-{post.id}"
                            type="text"
                            bind:value={editDraft.title}
                            class="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                          />
                        </div>

                        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <div>
                            <label for="edit-platform-{post.id}" class="mb-1 block text-xs font-medium text-muted-foreground">Plataforma</label>
                            <select
                              id="edit-platform-{post.id}"
                              bind:value={editDraft.platform}
                              class="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-primary"
                            >
                              {#each ALL_PLATFORMS as p}
                                <option value={p}>{PLATFORM_LABELS[p]}</option>
                              {/each}
                            </select>
                          </div>
                          <div>
                            <label for="edit-status-{post.id}" class="mb-1 block text-xs font-medium text-muted-foreground">Estado</label>
                            <select
                              id="edit-status-{post.id}"
                              bind:value={editDraft.status}
                              class="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-primary"
                            >
                              {#each ALL_STATUSES as s}
                                <option value={s}>{STATUS_LABELS[s]}</option>
                              {/each}
                            </select>
                          </div>
                        </div>

                        <div>
                          <label for="edit-body-{post.id}" class="mb-1 block text-xs font-medium text-muted-foreground">Contenido</label>
                          <textarea
                            id="edit-body-{post.id}"
                            bind:value={editDraft.body}
                            rows={8}
                            class="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                          ></textarea>
                        </div>

                        <div>
                          <p class="mb-1 text-xs font-medium text-muted-foreground">Hashtags</p>
                          <div class="flex flex-wrap gap-1.5 mb-2">
                            {#each editDraft.hashtags ?? [] as tag}
                              <span class="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-0.5 text-xs text-foreground">
                                #{tag}
                                <button
                                  type="button"
                                  onclick={() => removeHashtag(tag, 'edit')}
                                  class="text-muted-foreground hover:text-foreground"
                                  aria-label="Quitar hashtag"
                                >
                                  <X class="size-3" />
                                </button>
                              </span>
                            {/each}
                          </div>
                          <div class="flex gap-2">
                            <input
                              type="text"
                              bind:value={editHashtagInput}
                              placeholder="#hashtag"
                              onkeydown={(e) => {
                                if (e.key === 'Enter') { e.preventDefault(); addHashtag(editHashtagInput, 'edit'); editHashtagInput = ''; }
                              }}
                              class="flex-1 rounded-lg border border-border bg-background px-3 py-1.5 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                            />
                            <button
                              type="button"
                              onclick={() => { addHashtag(editHashtagInput, 'edit'); editHashtagInput = ''; }}
                              class="rounded-lg border border-border bg-background px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-muted/50"
                            >
                              Agregar
                            </button>
                          </div>
                        </div>

                        <div class="flex justify-end gap-2 border-t border-border pt-4">
                          <button
                            type="button"
                            onclick={cancelEdit}
                            class="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted/50"
                          >
                            Cancelar
                          </button>
                          <button
                            type="button"
                            onclick={() => savePost(post)}
                            disabled={savingId === post.id}
                            class="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
                          >
                            {#if savingId === post.id}
                              <Loader2 class="size-4 animate-spin" />
                              Guardando...
                            {:else}
                              <Save class="size-4" />
                              Guardar
                            {/if}
                          </button>
                        </div>
                      </div>
                    {:else}
                      <!-- Read-only expanded view -->
                      <div class="space-y-4">
                        <div>
                          <p class="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Contenido completo</p>
                          <p class="whitespace-pre-wrap text-sm text-foreground">{cleanBody(post.body)}</p>
                        </div>

                        {#if post.hashtags && post.hashtags.length > 0}
                          <div>
                            <p class="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Hashtags</p>
                            <div class="flex flex-wrap gap-1.5">
                              {#each post.hashtags as tag}
                                <span class="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs text-foreground">#{tag}</span>
                              {/each}
                            </div>
                          </div>
                        {/if}

                        <!-- Image section -->
                        <div>
                          <p class="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Imagen</p>
                          {#if post.image_url}
                            <img
                              src={post.image_url}
                              alt=""
                              class="h-24 w-auto rounded-lg border border-border object-cover"
                            />
                          {:else}
                            <div class="flex items-center gap-2">
                              <span class="text-xs text-muted-foreground">Sin imagen</span>
                              <button
                                type="button"
                                onclick={() => generateImage(post)}
                                class="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted/50"
                              >
                                <Image class="size-3.5" />
                                Generar imagen
                              </button>
                            </div>
                          {/if}
                        </div>

                        {#if post.published_url}
                          <div>
                            <p class="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">URL publicada</p>
                            <a
                              href={post.published_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              class="text-sm text-primary hover:underline break-all"
                            >{post.published_url}</a>
                          </div>
                        {/if}

                        <!-- Publish error -->
                        {#if publishError[post.id]}
                          <div class="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs text-destructive">
                            <AlertCircle class="size-3.5 shrink-0" />
                            {publishError[post.id]}
                          </div>
                        {/if}

                        <div class="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
                          <!-- Workflow advance + publish buttons -->
                          <div class="flex flex-wrap items-center gap-2">
                            {#if STATUS_NEXT[post.status]}
                              <button
                                type="button"
                                onclick={() => advanceStatus(post)}
                                disabled={savingId === post.id}
                                class="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
                              >
                                {#if savingId === post.id}
                                  <Loader2 class="size-3.5 animate-spin" />
                                {/if}
                                {STATUS_NEXT_LABEL[post.status]}
                              </button>
                            {/if}

                            <!-- Publish button for approved posts on social platforms -->
                            {#if post.status === 'approved' && SOCIAL_PLATFORMS.includes(post.platform as SocialPlatform)}
                              <button
                                type="button"
                                onclick={() => publishPost(post)}
                                disabled={publishingId === post.id}
                                class="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-white transition-colors disabled:opacity-50 {SOCIAL_PLATFORM_BG[post.platform as SocialPlatform]}"
                              >
                                {#if publishingId === post.id}
                                  <Loader2 class="size-3.5 animate-spin" />
                                  Publicando...
                                {:else}
                                  <Send class="size-3.5" />
                                  Publicar en {SOCIAL_PLATFORM_LABELS[post.platform as SocialPlatform]}
                                {/if}
                              </button>
                            {/if}
                          </div>

                          <div class="flex items-center gap-2">
                            <button
                              type="button"
                              onclick={() => startEdit(post)}
                              class="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted/50"
                            >
                              Editar
                            </button>

                            <!-- Delete with confirmation -->
                            {#if confirmDeleteId === post.id}
                              <div class="flex items-center gap-2">
                                <span class="text-xs text-muted-foreground">¿Eliminar?</span>
                                <button
                                  type="button"
                                  onclick={() => deletePost(post.id)}
                                  disabled={deletingId === post.id}
                                  class="inline-flex items-center gap-1.5 rounded-lg bg-destructive px-3 py-1.5 text-xs font-medium text-destructive-foreground transition-colors hover:bg-destructive/90 disabled:opacity-50"
                                >
                                  {#if deletingId === post.id}
                                    <Loader2 class="size-3.5 animate-spin" />
                                  {:else}
                                    <Trash2 class="size-3.5" />
                                  {/if}
                                  Sí, eliminar
                                </button>
                                <button
                                  type="button"
                                  onclick={() => { confirmDeleteId = null; }}
                                  class="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted/50"
                                >
                                  Cancelar
                                </button>
                              </div>
                            {:else}
                              <button
                                type="button"
                                onclick={() => { confirmDeleteId = post.id; }}
                                class="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-destructive hover:text-destructive"
                              >
                                <Trash2 class="size-3.5" />
                                Eliminar
                              </button>
                            {/if}
                          </div>
                        </div>
                      </div>
                    {/if}
                  </div>
                {/if}
              </div>
            {/each}
          {/if}
        </div>

      </div>
    {/if}
  </main>
{/if}
