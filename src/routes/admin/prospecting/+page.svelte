<script lang="ts">
  import { goto } from '$app/navigation';
  import { adminStore } from '$lib/stores/admin.svelte';
  import { supabase } from '$lib/supabase';
  import {
    buildSostenedores,
    exportCSV,
    downloadCSV,
    DEP_LABELS,
    REGION_NAMES,
    type Sostenedor,
  } from '$lib/utils/prospecting';
  import { onMount } from 'svelte';
  import { toast } from 'svelte-sonner';
  import * as Tabs from '$lib/components/ui/tabs';
  import * as Table from '$lib/components/ui/table';
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
  import * as Sheet from '$lib/components/ui/sheet';
  import * as Select from '$lib/components/ui/select';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import { Badge } from '$lib/components/ui/badge';
  import { Button } from '$lib/components/ui/button';
  import { Skeleton } from '$lib/components/ui/skeleton';
  import {
    Search,
    Download,
    Building,
    Users,
    Trophy,
    TrendingUp,
    ChevronDown,
    ChevronRight,
    MapPin,
    GraduationCap,
    Filter,
    Upload,
    BarChart2,
    MessageSquare,
    CheckCircle,
    Edit,
    X,
    Plus,
    MoreHorizontal,
  } from '@lucide/svelte';

  // ── Auth guard ──
  $effect(() => {
    if (!adminStore.authenticated) goto('/admin');
  });

  // ── Tab state ──
  let activeTab = $state<'scoring' | 'tracker'>('scoring');

  // ══════════════════════════════════════════
  // SCORING TAB
  // ══════════════════════════════════════════

  let allSostenedores = $state<Sostenedor[]>([]);
  let loadingScoring = $state(true);

  $effect(() => {
    fetch('/data/schools.json')
      .then((r) => r.json())
      .then((data) => {
        allSostenedores = buildSostenedores(data.schools);
        loadingScoring = false;
      });
  });

  let search = $state('');
  let tierFilter = $state('0');
  let depFilter = $state('0');
  let regionFilter = $state('0');
  let minSchools = $state('1');
  let sortBy = $state<'score' | 'enrollment' | 'schools' | 'name'>('score');
  let sortDir = $state<'asc' | 'desc'>('desc');
  let expandedRow = $state<string | null>(null);

  // Detail sheet for scoring tab
  let detailSost = $state<Sostenedor | null>(null);
  let detailSheetOpen = $state(false);

  const filtered = $derived.by(() => {
    let list = allSostenedores;

    const tf = Number(tierFilter);
    const df = Number(depFilter);
    const rf = Number(regionFilter);
    const ms = Number(minSchools);

    if (tf) list = list.filter((s) => s.tier === tf);
    if (df) list = list.filter((s) => s.depTypes.includes(df));
    if (rf) list = list.filter((s) => s.regions.includes(rf));
    if (ms > 1) list = list.filter((s) => s.schoolCount >= ms);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((s) => s.name.toLowerCase().includes(q));
    }

    const dir = sortDir === 'desc' ? -1 : 1;
    list = [...list].sort((a, b) => {
      switch (sortBy) {
        case 'score': return (a.score - b.score) * dir;
        case 'enrollment': return (a.totalEnrollment - b.totalEnrollment) * dir;
        case 'schools': return (a.schoolCount - b.schoolCount) * dir;
        case 'name': return a.name.localeCompare(b.name) * dir;
        default: return 0;
      }
    });

    return list;
  });

  const stats = $derived({
    total: allSostenedores.length,
    multiSchool: allSostenedores.filter((s) => s.schoolCount >= 2).length,
    tier1: allSostenedores.filter((s) => s.tier === 1).length,
    tier2: allSostenedores.filter((s) => s.tier === 2).length,
    tier3: allSostenedores.filter((s) => s.tier === 3).length,
    totalSchools: allSostenedores.reduce((sum, s) => sum + s.schoolCount, 0),
    totalStudents: allSostenedores.reduce((sum, s) => sum + s.totalEnrollment, 0),
  });

  function toggleSort(col: typeof sortBy) {
    if (sortBy === col) {
      sortDir = sortDir === 'desc' ? 'asc' : 'desc';
    } else {
      sortBy = col;
      sortDir = 'desc';
    }
  }

  function handleExport() {
    const csv = exportCSV(filtered);
    const date = new Date().toISOString().slice(0, 10);
    downloadCSV(csv, `ethoz-prospecting-${date}.csv`);
  }

  function openSostDetail(sost: Sostenedor) {
    detailSost = sost;
    detailSheetOpen = true;
  }

  function tierColor(tier: 1 | 2 | 3): string {
    switch (tier) {
      case 1: return 'bg-primary/10 text-primary';
      case 2: return 'bg-yellow-100 text-yellow-800';
      case 3: return 'bg-muted text-muted-foreground';
    }
  }

  function tierBadgeVariant(tier: 1 | 2 | 3): 'default' | 'secondary' | 'outline' {
    switch (tier) {
      case 1: return 'default';
      case 2: return 'secondary';
      case 3: return 'outline';
    }
  }

  function resetFilters() {
    search = '';
    tierFilter = '0';
    depFilter = '0';
    regionFilter = '0';
    minSchools = '1';
  }

  // ══════════════════════════════════════════
  // TRACKER TAB
  // ══════════════════════════════════════════

  interface Prospect {
    id: string;
    sostenedor_name: string;
    tier: 1 | 2 | 3;
    score: number;
    school_count: number;
    total_enrollment: number;
    dep_types?: number[];
    regions?: number[];
    communes?: string[];
    status: ProspectStatus;
    channel?: string;
    contact_name?: string;
    contact_email?: string;
    contact_phone?: string;
    contact_role?: string;
    linkedin_url?: string;
    website?: string;
    notes?: string;
    next_step?: string;
    next_step_date?: string;
    assigned_to?: string;
    created_at: string;
    updated_at?: string;
  }

  type ProspectStatus =
    | 'new'
    | 'contacted'
    | 'responded'
    | 'demo_scheduled'
    | 'demo_done'
    | 'negotiating'
    | 'won'
    | 'lost'
    | 'paused';

  const PROSPECT_STATUS_LABELS: Record<ProspectStatus, string> = {
    new: 'Nuevo',
    contacted: 'Contactado',
    responded: 'Respondió',
    demo_scheduled: 'Demo agendada',
    demo_done: 'Demo hecha',
    negotiating: 'Negociando',
    won: 'Ganado',
    lost: 'Perdido',
    paused: 'Pausado',
  };

  const PROSPECT_STATUS_VARIANTS: Record<ProspectStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    new: 'default',
    contacted: 'secondary',
    responded: 'secondary',
    demo_scheduled: 'default',
    demo_done: 'secondary',
    negotiating: 'default',
    won: 'default',
    lost: 'outline',
    paused: 'outline',
  };

  const ALL_PROSPECT_STATUSES: ProspectStatus[] = [
    'new', 'contacted', 'responded', 'demo_scheduled', 'demo_done',
    'negotiating', 'won', 'lost', 'paused',
  ];

  const CHANNELS = ['Email', 'LinkedIn', 'WhatsApp', 'Llamada', 'Referido', 'Otro'];

  let prospects = $state<Prospect[]>([]);
  let loadingTracker = $state(false);
  let importing = $state(false);

  let trackerSearch = $state('');
  let trackerStatusFilter = $state('');
  let trackerTierFilter = $state('0');
  let trackerChannelFilter = $state('');

  let editingId = $state<string | null>(null);
  let editDraft = $state<Partial<Prospect>>({});
  let savingEdit = $state(false);

  let noteProspectId = $state<string | null>(null);
  let noteText = $state('');
  let savingNote = $state(false);

  let updatingStatusId = $state<string | null>(null);

  const trackerFiltered = $derived.by(() => {
    let list = prospects;
    if (trackerStatusFilter) list = list.filter((p) => p.status === trackerStatusFilter);
    const ttf = Number(trackerTierFilter);
    if (ttf) list = list.filter((p) => p.tier === ttf);
    if (trackerChannelFilter) list = list.filter((p) => p.channel === trackerChannelFilter);
    if (trackerSearch.trim()) {
      const q = trackerSearch.trim().toLowerCase();
      list = list.filter((p) => p.sostenedor_name.toLowerCase().includes(q));
    }
    return list;
  });

  async function loadProspects() {
    if (!supabase) return;
    loadingTracker = true;
    const { data, error } = await supabase
      .from('prospects')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      toast.error('Error al cargar prospects', { description: error.message });
    } else if (data) {
      prospects = data as Prospect[];
    }
    loadingTracker = false;
  }

  onMount(async () => {
    await adminStore.init();
    if (!adminStore.authenticated) {
      goto('/admin');
      return;
    }
  });

  $effect(() => {
    if (activeTab === 'tracker' && prospects.length === 0 && !loadingTracker) {
      loadProspects();
    }
  });

  async function importTier1() {
    if (!supabase || importing) return;
    const tier1 = allSostenedores.filter((s) => s.tier === 1);
    if (!tier1.length) return;

    importing = true;

    const { data: existing } = await supabase
      .from('prospects')
      .select('sostenedor_name');
    const existingNames = new Set((existing ?? []).map((p: { sostenedor_name: string }) => p.sostenedor_name));

    const toInsert = tier1
      .filter((s) => !existingNames.has(s.name))
      .map((s) => ({
        sostenedor_name: s.name,
        tier: s.tier,
        score: s.score,
        school_count: s.schoolCount,
        total_enrollment: s.totalEnrollment,
        dep_types: s.depTypes,
        regions: s.regions,
        communes: s.communes,
        status: 'new' as ProspectStatus,
        created_at: new Date().toISOString(),
      }));

    if (toInsert.length > 0) {
      const { error } = await supabase.from('prospects').insert(toInsert);
      if (error) {
        toast.error('Error al importar', { description: error.message });
      } else {
        await loadProspects();
        toast.success(`${toInsert.length} prospects importados`);
      }
    } else {
      toast.success('Todos los Tier 1 ya están en el tracker');
    }

    importing = false;
  }

  async function changeProspectStatus(prospect: Prospect, newStatus: ProspectStatus) {
    if (!supabase || prospect.status === newStatus) return;
    updatingStatusId = prospect.id;

    const oldStatus = prospect.status;
    const { error } = await supabase
      .from('prospects')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', prospect.id);

    if (error) {
      toast.error('Error al actualizar estado', { description: error.message });
    } else {
      prospects = prospects.map((p) => p.id === prospect.id ? { ...p, status: newStatus } : p);
      toast.success('Estado actualizado', {
        description: `${prospect.sostenedor_name} → ${PROSPECT_STATUS_LABELS[newStatus]}`,
      });
      await supabase.from('prospect_activities').insert({
        prospect_id: prospect.id,
        type: 'status_change',
        description: `Estado: ${PROSPECT_STATUS_LABELS[oldStatus]} → ${PROSPECT_STATUS_LABELS[newStatus]}`,
        old_status: oldStatus,
        new_status: newStatus,
        created_by: adminStore.user?.email,
        created_at: new Date().toISOString(),
      });
    }
    updatingStatusId = null;
  }

  function startEdit(prospect: Prospect) {
    editingId = prospect.id;
    editDraft = {
      contact_name: prospect.contact_name,
      contact_email: prospect.contact_email,
      contact_phone: prospect.contact_phone,
      contact_role: prospect.contact_role,
      channel: prospect.channel,
      notes: prospect.notes,
      next_step: prospect.next_step,
      next_step_date: prospect.next_step_date,
      linkedin_url: prospect.linkedin_url,
      website: prospect.website,
    };
  }

  function cancelEdit() {
    editingId = null;
    editDraft = {};
  }

  async function saveEdit(prospect: Prospect) {
    if (!supabase) return;
    savingEdit = true;
    const { error } = await supabase
      .from('prospects')
      .update({ ...editDraft, updated_at: new Date().toISOString() })
      .eq('id', prospect.id);
    if (error) {
      toast.error('Error al guardar', { description: error.message });
    } else {
      prospects = prospects.map((p) => p.id === prospect.id ? { ...p, ...editDraft } : p);
      editingId = null;
      editDraft = {};
      toast.success('Prospect actualizado');
    }
    savingEdit = false;
  }

  async function addNote(prospect: Prospect) {
    if (!supabase || !noteText.trim()) return;
    savingNote = true;
    const { error } = await supabase.from('prospect_activities').insert({
      prospect_id: prospect.id,
      type: 'note',
      description: noteText.trim(),
      created_by: adminStore.user?.email,
      created_at: new Date().toISOString(),
    });
    if (error) {
      toast.error('Error al guardar nota', { description: error.message });
    } else {
      noteProspectId = null;
      noteText = '';
      toast.success('Nota guardada');
    }
    savingNote = false;
  }

  function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString('es-CL', { day: '2-digit', month: 'short', year: 'numeric' });
  }
</script>

<svelte:head>
  <title>Prospecting — Ethoz Admin</title>
  <meta name="robots" content="noindex, nofollow" />
</svelte:head>

{#if !adminStore.authenticated}
  <!-- Auth guard redirect -->
{:else}
  <main class="min-h-dvh bg-secondary pt-14">
    <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

      <!-- Page header + tabs -->
      <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 class="text-2xl font-bold tracking-tight text-foreground">Prospecting</h1>
          <p class="mt-0.5 text-sm text-muted-foreground">Scoring de sostenedores y seguimiento de outreach</p>
        </div>
      </div>

      <Tabs.Root bind:value={activeTab}>
        <Tabs.List class="mb-6">
          <Tabs.Trigger value="scoring" class="flex items-center gap-1.5">
            <BarChart2 class="size-3.5" />
            Scoring
          </Tabs.Trigger>
          <Tabs.Trigger value="tracker" class="flex items-center gap-1.5">
            <TrendingUp class="size-3.5" />
            Outreach Tracker
          </Tabs.Trigger>
        </Tabs.List>

        <!-- ── SCORING TAB ── -->
        <Tabs.Content value="scoring">
          {#if loadingScoring}
            <div class="space-y-3 rounded-xl border border-border bg-background p-4">
              {#each Array(8) as _}
                <div class="flex items-center gap-3">
                  <Skeleton class="h-5 w-8 rounded-full" />
                  <Skeleton class="h-4 flex-1" />
                  <Skeleton class="h-4 w-12" />
                  <Skeleton class="h-4 w-16" />
                  <Skeleton class="h-4 w-10" />
                </div>
              {/each}
            </div>
          {:else}
            <!-- Header actions -->
            <div class="mb-6 flex items-center justify-end">
              <Button onclick={handleExport}>
                <Download class="size-4" />
                Exportar CSV ({filtered.length})
              </Button>
            </div>

            <!-- Stats -->
            <div class="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div class="rounded-xl border border-border bg-background p-4">
                <div class="flex items-center gap-2 text-muted-foreground">
                  <Building class="size-4" />
                  <span class="text-xs font-medium">Sostenedores</span>
                </div>
                <p class="mt-1 text-2xl font-bold tabular-nums text-foreground">{stats.total.toLocaleString()}</p>
              </div>
              <div class="rounded-xl border border-border bg-background p-4">
                <div class="flex items-center gap-2 text-muted-foreground">
                  <Users class="size-4" />
                  <span class="text-xs font-medium">Multi-colegio</span>
                </div>
                <p class="mt-1 text-2xl font-bold tabular-nums text-foreground">{stats.multiSchool.toLocaleString()}</p>
              </div>
              <div class="rounded-xl border border-border bg-background p-4">
                <div class="flex items-center gap-2 text-muted-foreground">
                  <Trophy class="size-4" />
                  <span class="text-xs font-medium">Tier 1</span>
                </div>
                <p class="mt-1 text-2xl font-bold tabular-nums text-primary">{stats.tier1.toLocaleString()}</p>
              </div>
              <div class="rounded-xl border border-border bg-background p-4">
                <div class="flex items-center gap-2 text-muted-foreground">
                  <TrendingUp class="size-4" />
                  <span class="text-xs font-medium">Alumnos total</span>
                </div>
                <p class="mt-1 text-2xl font-bold tabular-nums text-foreground">{(stats.totalStudents / 1000000).toFixed(1)}M</p>
              </div>
            </div>

            <!-- Filters -->
            <div class="mb-4 rounded-xl border border-border bg-background p-4">
              <div class="flex flex-wrap items-end gap-3">
                <div class="min-w-[200px] flex-1">
                  <Label for="search" class="mb-1.5 block text-xs">Buscar</Label>
                  <div class="relative">
                    <Search class="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                    <Input id="search" type="text" bind:value={search} placeholder="Nombre del sostenedor..." class="pl-9" />
                  </div>
                </div>
                <div>
                  <Label class="mb-1.5 block text-xs">Tier</Label>
                  <Select.Root type="single" bind:value={tierFilter}>
                    <Select.Trigger class="w-32">
                      {tierFilter === '0' ? 'Todos' : `Tier ${tierFilter}`}
                    </Select.Trigger>
                    <Select.Content>
                      <Select.Item value="0">Todos</Select.Item>
                      <Select.Item value="1">Tier 1</Select.Item>
                      <Select.Item value="2">Tier 2</Select.Item>
                      <Select.Item value="3">Tier 3</Select.Item>
                    </Select.Content>
                  </Select.Root>
                </div>
                <div>
                  <Label class="mb-1.5 block text-xs">Dependencia</Label>
                  <Select.Root type="single" bind:value={depFilter}>
                    <Select.Trigger class="w-40">
                      {depFilter === '0' ? 'Todas' : (DEP_LABELS[Number(depFilter)] ?? depFilter)}
                    </Select.Trigger>
                    <Select.Content>
                      <Select.Item value="0">Todas</Select.Item>
                      {#each Object.entries(DEP_LABELS) as [val, label]}
                        <Select.Item value={val}>{label}</Select.Item>
                      {/each}
                    </Select.Content>
                  </Select.Root>
                </div>
                <div>
                  <Label class="mb-1.5 block text-xs">Región</Label>
                  <Select.Root type="single" bind:value={regionFilter}>
                    <Select.Trigger class="w-40">
                      {regionFilter === '0' ? 'Todas' : (REGION_NAMES[Number(regionFilter)] ?? regionFilter)}
                    </Select.Trigger>
                    <Select.Content>
                      <Select.Item value="0">Todas</Select.Item>
                      {#each Object.entries(REGION_NAMES) as [val, label]}
                        <Select.Item value={val}>{label}</Select.Item>
                      {/each}
                    </Select.Content>
                  </Select.Root>
                </div>
                <div>
                  <Label class="mb-1.5 block text-xs">Min. colegios</Label>
                  <Select.Root type="single" bind:value={minSchools}>
                    <Select.Trigger class="w-24">
                      {minSchools}+
                    </Select.Trigger>
                    <Select.Content>
                      {#each ['1','2','3','5','10','20'] as v}
                        <Select.Item value={v}>{v}+</Select.Item>
                      {/each}
                    </Select.Content>
                  </Select.Root>
                </div>
                <Button variant="ghost" onclick={resetFilters} class="gap-1.5">
                  <Filter class="size-3.5" />
                  Limpiar
                </Button>
              </div>
            </div>

            <!-- Table -->
            <div class="overflow-hidden rounded-xl border border-border bg-background">
              <div class="overflow-x-auto">
                <Table.Root>
                  <Table.Header>
                    <Table.Row>
                      <Table.Head class="w-8"></Table.Head>
                      <Table.Head>
                        <button type="button" onclick={() => toggleSort('score')} class="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider hover:text-foreground">
                          Tier {#if sortBy === 'score'}<ChevronDown class="size-3 {sortDir === 'asc' ? 'rotate-180' : ''}" />{/if}
                        </button>
                      </Table.Head>
                      <Table.Head>
                        <button type="button" onclick={() => toggleSort('name')} class="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider hover:text-foreground">
                          Sostenedor {#if sortBy === 'name'}<ChevronDown class="size-3 {sortDir === 'asc' ? 'rotate-180' : ''}" />{/if}
                        </button>
                      </Table.Head>
                      <Table.Head class="text-right">
                        <button type="button" onclick={() => toggleSort('schools')} class="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider hover:text-foreground">
                          Colegios {#if sortBy === 'schools'}<ChevronDown class="size-3 {sortDir === 'asc' ? 'rotate-180' : ''}" />{/if}
                        </button>
                      </Table.Head>
                      <Table.Head class="text-right">
                        <button type="button" onclick={() => toggleSort('enrollment')} class="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider hover:text-foreground">
                          Alumnos {#if sortBy === 'enrollment'}<ChevronDown class="size-3 {sortDir === 'asc' ? 'rotate-180' : ''}" />{/if}
                        </button>
                      </Table.Head>
                      <Table.Head class="hidden md:table-cell">Dependencia</Table.Head>
                      <Table.Head class="hidden lg:table-cell">Región</Table.Head>
                      <Table.Head class="text-right">Score</Table.Head>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {#each filtered.slice(0, 100) as sost}
                      <Table.Row class="cursor-pointer" onclick={() => openSostDetail(sost)}>
                        <Table.Cell class="text-muted-foreground">
                          <ChevronRight class="size-3.5" />
                        </Table.Cell>
                        <Table.Cell>
                          <Badge variant={tierBadgeVariant(sost.tier)} class="text-[10px] font-bold">T{sost.tier}</Badge>
                        </Table.Cell>
                        <Table.Cell class="max-w-[300px] truncate font-medium">{sost.name}</Table.Cell>
                        <Table.Cell class="text-right tabular-nums">{sost.schoolCount}</Table.Cell>
                        <Table.Cell class="text-right tabular-nums">{sost.totalEnrollment.toLocaleString()}</Table.Cell>
                        <Table.Cell class="hidden md:table-cell text-xs text-muted-foreground">
                          {sost.depTypes.map((d) => DEP_LABELS[d] || d).join(', ')}
                        </Table.Cell>
                        <Table.Cell class="hidden lg:table-cell text-xs text-muted-foreground">
                          {sost.regions.map((r) => REGION_NAMES[r] || r).join(', ')}
                        </Table.Cell>
                        <Table.Cell class="text-right font-bold tabular-nums">{sost.score}</Table.Cell>
                      </Table.Row>
                    {/each}
                  </Table.Body>
                </Table.Root>
              </div>

              {#if filtered.length > 100}
                <div class="border-t border-border px-4 py-3 text-center text-xs text-muted-foreground">
                  Mostrando 100 de {filtered.length.toLocaleString()} — usa los filtros o exporta CSV para ver todos
                </div>
              {/if}

              {#if filtered.length === 0}
                <div class="px-4 py-12 text-center">
                  <Search class="mx-auto mb-2 size-8 text-muted-foreground/40" />
                  <p class="text-sm font-medium text-foreground">Sin resultados</p>
                  <p class="mt-1 text-xs text-muted-foreground">Ajusta los filtros para ver sostenedores</p>
                </div>
              {/if}
            </div>

            <div class="mt-4 flex flex-wrap items-center gap-4 text-[11px] text-muted-foreground">
              <span><span class="inline-block size-2 rounded-full bg-primary/60"></span> Tier 1 (score 60+): Whale accounts — multi-school, high enrollment, private</span>
              <span><span class="inline-block size-2 rounded-full bg-yellow-400/60"></span> Tier 2 (score 35-59): Mid-market — growth targets</span>
              <span><span class="inline-block size-2 rounded-full bg-muted-foreground/40"></span> Tier 3 (&lt;35): Long-tail — smaller/public</span>
            </div>
          {/if}
        </Tabs.Content>

        <!-- ── TRACKER TAB ── -->
        <Tabs.Content value="tracker">
          <!-- Toolbar -->
          <div class="mb-6 flex flex-wrap items-center gap-3">
            <Button variant="outline" onclick={importTier1} disabled={importing || loadingScoring}>
              <Upload class="size-4" />
              {importing ? 'Importando...' : 'Importar Tier 1 al Tracker'}
            </Button>
            <div class="ml-auto text-sm text-muted-foreground">
              {trackerFiltered.length} de {prospects.length} prospects
            </div>
          </div>

          <!-- Filters -->
          <div class="mb-4 rounded-xl border border-border bg-background p-4">
            <div class="flex flex-wrap items-end gap-3">
              <div class="min-w-[180px] flex-1">
                <Label for="tracker-search" class="mb-1.5 block text-xs">Buscar</Label>
                <div class="relative">
                  <Search class="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                  <Input id="tracker-search" type="text" bind:value={trackerSearch} placeholder="Sostenedor..." class="pl-9" />
                </div>
              </div>
              <div>
                <Label class="mb-1.5 block text-xs">Estado</Label>
                <Select.Root type="single" bind:value={trackerStatusFilter}>
                  <Select.Trigger class="w-40">
                    {trackerStatusFilter ? PROSPECT_STATUS_LABELS[trackerStatusFilter as ProspectStatus] : 'Todos'}
                  </Select.Trigger>
                  <Select.Content>
                    <Select.Item value="">Todos</Select.Item>
                    {#each ALL_PROSPECT_STATUSES as s}
                      <Select.Item value={s}>{PROSPECT_STATUS_LABELS[s]}</Select.Item>
                    {/each}
                  </Select.Content>
                </Select.Root>
              </div>
              <div>
                <Label class="mb-1.5 block text-xs">Tier</Label>
                <Select.Root type="single" bind:value={trackerTierFilter}>
                  <Select.Trigger class="w-28">
                    {trackerTierFilter === '0' ? 'Todos' : `Tier ${trackerTierFilter}`}
                  </Select.Trigger>
                  <Select.Content>
                    <Select.Item value="0">Todos</Select.Item>
                    <Select.Item value="1">Tier 1</Select.Item>
                    <Select.Item value="2">Tier 2</Select.Item>
                    <Select.Item value="3">Tier 3</Select.Item>
                  </Select.Content>
                </Select.Root>
              </div>
              <div>
                <Label class="mb-1.5 block text-xs">Canal</Label>
                <Select.Root type="single" bind:value={trackerChannelFilter}>
                  <Select.Trigger class="w-36">
                    {trackerChannelFilter || 'Todos'}
                  </Select.Trigger>
                  <Select.Content>
                    <Select.Item value="">Todos</Select.Item>
                    {#each CHANNELS as ch}
                      <Select.Item value={ch}>{ch}</Select.Item>
                    {/each}
                  </Select.Content>
                </Select.Root>
              </div>
            </div>
          </div>

          <!-- Prospect list -->
          {#if loadingTracker}
            <div class="space-y-2">
              {#each Array(5) as _}
                <div class="rounded-xl border border-border bg-background p-4">
                  <div class="flex items-center gap-3">
                    <Skeleton class="h-5 w-8 rounded-full" />
                    <Skeleton class="h-4 flex-1" />
                    <Skeleton class="h-6 w-24 rounded-full" />
                    <Skeleton class="h-8 w-20" />
                  </div>
                </div>
              {/each}
            </div>
          {:else if trackerFiltered.length === 0}
            <div class="rounded-xl border border-border bg-background px-4 py-12 text-center">
              <Building class="mx-auto mb-2 size-8 text-muted-foreground/40" />
              <p class="text-sm font-medium text-foreground">Sin prospects</p>
              <p class="mt-1 text-xs text-muted-foreground">Importa Tier 1 para empezar o ajusta los filtros</p>
            </div>
          {:else}
            <div class="space-y-2">
              {#each trackerFiltered as prospect}
                <div class="overflow-hidden rounded-xl border border-border bg-background">
                  <!-- Prospect header row -->
                  <div class="flex flex-wrap items-center gap-3 p-4">
                    <div class="flex min-w-0 flex-1 items-center gap-3">
                      <Badge variant={tierBadgeVariant(prospect.tier)} class="shrink-0 text-[10px] font-bold">T{prospect.tier}</Badge>
                      <span class="min-w-0 truncate font-medium text-foreground">{prospect.sostenedor_name}</span>
                      <span class="hidden shrink-0 text-xs text-muted-foreground sm:inline">{prospect.school_count} colegios · {prospect.total_enrollment.toLocaleString()} alumnos</span>
                    </div>

                    <!-- Status badge + dropdown -->
                    <DropdownMenu.Root>
                      <DropdownMenu.Trigger>
                        <Badge
                          variant={PROSPECT_STATUS_VARIANTS[prospect.status]}
                          class="cursor-pointer {updatingStatusId === prospect.id ? 'opacity-50' : ''}"
                        >
                          {PROSPECT_STATUS_LABELS[prospect.status]}
                        </Badge>
                      </DropdownMenu.Trigger>
                      <DropdownMenu.Content>
                        <DropdownMenu.Label>Cambiar estado</DropdownMenu.Label>
                        <DropdownMenu.Separator />
                        {#each ALL_PROSPECT_STATUSES as s}
                          <DropdownMenu.Item
                            disabled={updatingStatusId === prospect.id || s === prospect.status}
                            onclick={() => changeProspectStatus(prospect, s)}
                          >
                            {PROSPECT_STATUS_LABELS[s]}
                          </DropdownMenu.Item>
                        {/each}
                      </DropdownMenu.Content>
                    </DropdownMenu.Root>

                    <!-- Quick actions -->
                    <div class="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onclick={() => { noteProspectId = noteProspectId === prospect.id ? null : prospect.id; noteText = ''; }}
                        class="gap-1 text-xs"
                      >
                        <Plus class="size-3.5" />
                        Nota
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onclick={() => { if (editingId === prospect.id) { cancelEdit(); } else { startEdit(prospect); } }}
                        class="gap-1 text-xs"
                      >
                        <Edit class="size-3.5" />
                        Editar
                      </Button>
                    </div>
                  </div>

                  <!-- Contact + next step summary -->
                  {#if prospect.contact_name || prospect.next_step || prospect.channel}
                    <div class="flex flex-wrap gap-4 border-t border-border px-4 py-2.5 text-xs text-muted-foreground">
                      {#if prospect.contact_name}
                        <span class="flex items-center gap-1">
                          <Users class="size-3.5" />
                          {prospect.contact_name}
                          {#if prospect.contact_role} · {prospect.contact_role}{/if}
                        </span>
                      {/if}
                      {#if prospect.channel}
                        <span class="flex items-center gap-1">
                          <MessageSquare class="size-3.5" />
                          {prospect.channel}
                        </span>
                      {/if}
                      {#if prospect.next_step}
                        <span class="flex items-center gap-1 text-foreground">
                          <CheckCircle class="size-3.5 text-primary" />
                          {prospect.next_step}
                          {#if prospect.next_step_date}
                            <span class="text-muted-foreground">— {formatDate(prospect.next_step_date)}</span>
                          {/if}
                        </span>
                      {/if}
                      {#if prospect.notes}
                        <span class="flex items-center gap-1 italic">
                          <MessageSquare class="size-3.5" />
                          {prospect.notes.slice(0, 80)}{prospect.notes.length > 80 ? '...' : ''}
                        </span>
                      {/if}
                    </div>
                  {/if}

                  <!-- Note input -->
                  {#if noteProspectId === prospect.id}
                    <div class="border-t border-border px-4 py-3">
                      <div class="flex gap-2">
                        <Input
                          type="text"
                          bind:value={noteText}
                          placeholder="Escribe una nota..."
                          class="flex-1"
                        />
                        <Button
                          onclick={() => addNote(prospect)}
                          disabled={savingNote || !noteText.trim()}
                          class="gap-1.5"
                        >
                          <Plus class="size-3.5" />
                          Guardar
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onclick={() => { noteProspectId = null; noteText = ''; }}
                        >
                          <X class="size-3.5" />
                        </Button>
                      </div>
                    </div>
                  {/if}

                  <!-- Edit form -->
                  {#if editingId === prospect.id}
                    <div class="border-t border-border p-4">
                      <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        <div>
                          <Label for="edit-contact-name-{prospect.id}" class="mb-1 block text-[11px]">Contacto</Label>
                          <Input id="edit-contact-name-{prospect.id}" type="text" bind:value={editDraft.contact_name} placeholder="Nombre" />
                        </div>
                        <div>
                          <Label for="edit-contact-role-{prospect.id}" class="mb-1 block text-[11px]">Rol</Label>
                          <Input id="edit-contact-role-{prospect.id}" type="text" bind:value={editDraft.contact_role} placeholder="Director, Administrador..." />
                        </div>
                        <div>
                          <Label for="edit-contact-email-{prospect.id}" class="mb-1 block text-[11px]">Email</Label>
                          <Input id="edit-contact-email-{prospect.id}" type="email" bind:value={editDraft.contact_email} placeholder="correo@colegio.cl" />
                        </div>
                        <div>
                          <Label for="edit-contact-phone-{prospect.id}" class="mb-1 block text-[11px]">Teléfono</Label>
                          <Input id="edit-contact-phone-{prospect.id}" type="tel" bind:value={editDraft.contact_phone} placeholder="+56 9..." />
                        </div>
                        <div>
                          <Label class="mb-1 block text-[11px]">Canal</Label>
                          <Select.Root type="single" bind:value={editDraft.channel as string}>
                            <Select.Trigger class="w-full">
                              {editDraft.channel || 'Sin canal'}
                            </Select.Trigger>
                            <Select.Content>
                              <Select.Item value="">Sin canal</Select.Item>
                              {#each CHANNELS as ch}
                                <Select.Item value={ch}>{ch}</Select.Item>
                              {/each}
                            </Select.Content>
                          </Select.Root>
                        </div>
                        <div>
                          <Label for="edit-linkedin-{prospect.id}" class="mb-1 block text-[11px]">LinkedIn</Label>
                          <Input id="edit-linkedin-{prospect.id}" type="url" bind:value={editDraft.linkedin_url} placeholder="https://linkedin.com/..." />
                        </div>
                        <div class="sm:col-span-2">
                          <Label for="edit-next-step-{prospect.id}" class="mb-1 block text-[11px]">Próximo paso</Label>
                          <Input id="edit-next-step-{prospect.id}" type="text" bind:value={editDraft.next_step} placeholder="Enviar propuesta, llamar..." />
                        </div>
                        <div>
                          <Label for="edit-next-step-date-{prospect.id}" class="mb-1 block text-[11px]">Fecha próximo paso</Label>
                          <Input id="edit-next-step-date-{prospect.id}" type="date" bind:value={editDraft.next_step_date} />
                        </div>
                        <div class="sm:col-span-2 lg:col-span-3">
                          <Label for="edit-notes-{prospect.id}" class="mb-1 block text-[11px]">Notas</Label>
                          <textarea
                            id="edit-notes-{prospect.id}"
                            bind:value={editDraft.notes}
                            rows={2}
                            placeholder="Contexto, observaciones..."
                            class="w-full resize-none rounded-md border border-input bg-background px-3 py-1.5 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          ></textarea>
                        </div>
                      </div>
                      <div class="mt-3 flex items-center gap-2">
                        <Button onclick={() => saveEdit(prospect)} disabled={savingEdit}>
                          Guardar cambios
                        </Button>
                        <Button variant="outline" onclick={cancelEdit}>
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  {/if}

                </div>
              {/each}
            </div>
          {/if}
        </Tabs.Content>
      </Tabs.Root>

    </div>
  </main>

  <!-- Sostenedor detail sheet -->
  <Sheet.Root bind:open={detailSheetOpen}>
    <Sheet.Content class="w-full sm:max-w-md overflow-y-auto">
      {#if detailSost}
        <Sheet.Header>
          <Sheet.Title>{detailSost.name}</Sheet.Title>
          <Sheet.Description>
            {detailSost.schoolCount} colegios · {detailSost.totalEnrollment.toLocaleString()} alumnos · Score {detailSost.score}
          </Sheet.Description>
        </Sheet.Header>
        <div class="mt-6 space-y-4 px-6 pb-6">
          <div class="flex items-center gap-2">
            <Badge variant={tierBadgeVariant(detailSost.tier)}>Tier {detailSost.tier}</Badge>
            <span class="text-sm text-muted-foreground">Score {detailSost.score}</span>
          </div>
          <div>
            <p class="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{detailSost.schoolCount} colegios</p>
            <div class="space-y-1.5">
              {#each detailSost.schools.sort((a, b) => (b.m || 0) - (a.m || 0)) as school}
                <div class="flex items-center justify-between rounded-lg border border-border bg-muted/30 px-3 py-2 text-xs">
                  <div class="flex items-center gap-2">
                    <GraduationCap class="size-3.5 shrink-0 text-muted-foreground" />
                    <span class="font-medium text-foreground">{school.n}</span>
                  </div>
                  <div class="flex items-center gap-3 text-muted-foreground">
                    <span class="flex items-center gap-1"><MapPin class="size-3" />{school.c}</span>
                    <span class="tabular-nums">{(school.m || 0).toLocaleString()}</span>
                    <span class="rounded bg-muted px-1.5 py-0.5 text-[10px]">RBD {school.r}</span>
                  </div>
                </div>
              {/each}
            </div>
          </div>
        </div>
      {/if}
    </Sheet.Content>
  </Sheet.Root>
{/if}
