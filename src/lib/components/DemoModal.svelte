<!--
  DemoModal.svelte — "Agendar Demo" multi-step modal
  Steps: 1) Find school  2) Confirm & contact  3) Success
-->
<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import { t } from '$lib/i18n/index.svelte';
	import { schoolStore, type School } from '$lib/stores/schools.svelte';
	import {
		X,
		Search,
		Building,
		MapPin,
		Users,
		ChevronDown,
		ChevronRight,
		Check,
		Loader2,
		GraduationCap
	} from '@lucide/svelte';

	// ---------------------------------------------------------------------------
	// Props
	// ---------------------------------------------------------------------------

	let { open = $bindable(false) }: { open: boolean } = $props();

	// ---------------------------------------------------------------------------
	// State
	// ---------------------------------------------------------------------------

	let step = $state<1 | 2 | 3>(1);
	let searchInput = $state('');
	let highlightIndex = $state(-1);
	let debounceTimer = $state<ReturnType<typeof setTimeout> | null>(null);

	// Contact form fields
	let contactName = $state('');
	let contactRole = $state('');
	let contactEmail = $state('');
	let contactPhone = $state('');
	let submitting = $state(false);

	// Transition state
	let visible = $state(false);
	let panelReady = $state(false);

	// Refs
	let searchInputEl = $state<HTMLInputElement | null>(null);
	let resultsListEl = $state<HTMLUListElement | null>(null);
	let modalPanelEl = $state<HTMLDivElement | null>(null);
	let overlayEl = $state<HTMLDivElement | null>(null);

	// ---------------------------------------------------------------------------
	// Derived
	// ---------------------------------------------------------------------------

	const schools = $derived(schoolStore.filteredSchools);
	const hasResults = $derived(schools.length > 0);
	const showNoResults = $derived(
		!schoolStore.loading && searchInput.trim().length >= 2 && !hasResults
	);
	const regionName = $derived(
		schoolStore.regions.find((r) => r.code === schoolStore.selectedRegion)?.name ?? ''
	);

	// ---------------------------------------------------------------------------
	// Effects
	// ---------------------------------------------------------------------------

	// Load data when modal opens
	$effect(() => {
		if (open) {
			schoolStore.load();
			// Trigger entrance animation
			requestAnimationFrame(() => {
				visible = true;
				requestAnimationFrame(() => {
					panelReady = true;
				});
			});
		}
	});

	// Reset state when modal closes
	$effect(() => {
		if (!open) {
			visible = false;
			panelReady = false;
			// Delay reset so exit animation can play
			setTimeout(() => {
				step = 1;
				searchInput = '';
				highlightIndex = -1;
				contactName = '';
				contactRole = '';
				contactEmail = '';
				contactPhone = '';
				submitting = false;
				schoolStore.reset();
			}, 200);
		}
	});

	// Focus search input when step 1 is active and data is loaded
	$effect(() => {
		if (open && step === 1 && schoolStore.loaded && searchInputEl) {
			// Small delay for transition
			setTimeout(() => searchInputEl?.focus(), 100);
		}
	});

	// ---------------------------------------------------------------------------
	// Handlers
	// ---------------------------------------------------------------------------

	function close() {
		panelReady = false;
		visible = false;
		setTimeout(() => {
			open = false;
		}, 200);
	}

	function handleOverlayClick(e: MouseEvent) {
		if (e.target === overlayEl) {
			close();
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (!open) return;

		if (e.key === 'Escape') {
			e.preventDefault();
			close();
			return;
		}

		// Keyboard navigation for search results (step 1 only)
		if (step === 1 && hasResults) {
			if (e.key === 'ArrowDown') {
				e.preventDefault();
				highlightIndex = Math.min(highlightIndex + 1, schools.length - 1);
				scrollHighlightedIntoView();
			} else if (e.key === 'ArrowUp') {
				e.preventDefault();
				highlightIndex = Math.max(highlightIndex - 1, -1);
				scrollHighlightedIntoView();
			} else if (e.key === 'Enter' && highlightIndex >= 0) {
				e.preventDefault();
				handleSelectSchool(schools[highlightIndex]);
			}
		}
	}

	function scrollHighlightedIntoView() {
		requestAnimationFrame(() => {
			const el = resultsListEl?.querySelector('[data-highlighted="true"]');
			el?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
		});
	}

	function handleSearchInput(e: Event) {
		const value = (e.target as HTMLInputElement).value;
		searchInput = value;
		highlightIndex = -1;

		if (debounceTimer) clearTimeout(debounceTimer);
		debounceTimer = setTimeout(() => {
			schoolStore.setSearch(value);
		}, 300);
	}

	function handleRegionChange(e: Event) {
		const value = (e.target as HTMLSelectElement).value;
		schoolStore.setRegion(value ? Number(value) : null);
		searchInput = '';
		highlightIndex = -1;
	}

	function handleCommuneChange(e: Event) {
		const value = (e.target as HTMLSelectElement).value;
		schoolStore.setCommune(value || null);
		searchInput = '';
		highlightIndex = -1;
	}

	function handleSelectSchool(school: School) {
		schoolStore.selectSchool(school.rbd);
		step = 2;
	}

	function goBackToStep1() {
		step = 1;
		schoolStore.clearSelection();
		setTimeout(() => searchInputEl?.focus(), 100);
	}

	function handleSubmit(e: Event) {
		e.preventDefault();
		submitting = true;

		const formData = {
			school: schoolStore.selectedSchool,
			contact: {
				name: contactName,
				role: contactRole,
				email: contactEmail,
				phone: contactPhone
			}
		};

		// Simulate brief processing, then show success
		setTimeout(() => {
			submitting = false;
			step = 3;
		}, 600);
	}

	// ---------------------------------------------------------------------------
	// Highlight matching text helper
	// ---------------------------------------------------------------------------

	function highlightMatch(text: string, query: string): { before: string; match: string; after: string } | null {
		if (query.length < 2) return null;

		const normalizedText = text
			.normalize('NFD')
			.replace(/[\u0300-\u036f]/g, '')
			.toLowerCase();
		const normalizedQuery = query
			.normalize('NFD')
			.replace(/[\u0300-\u036f]/g, '')
			.toLowerCase();

		const index = normalizedText.indexOf(normalizedQuery);
		if (index === -1) return null;

		return {
			before: text.slice(0, index),
			match: text.slice(index, index + query.length),
			after: text.slice(index + query.length)
		};
	}

	// Role options for the contact form select
	const roleOptions = [
		{ value: 'director', label: 'Director/a' },
		{ value: 'subdirector', label: 'Subdirector/a' },
		{ value: 'inspector', label: 'Inspector/a' },
		{ value: 'utp', label: 'Jefe/a UTP' },
		{ value: 'sostenedor', label: 'Sostenedor/a' },
		{ value: 'otro', label: 'Otro' }
	];
</script>

<!-- Escape key listener -->
<svelte:window onkeydown={handleKeydown} />

{#if open}
	<!-- Overlay -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		bind:this={overlayEl}
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 transition-opacity duration-200"
		class:opacity-0={!visible}
		class:opacity-100={visible}
		class:backdrop-blur-sm={visible}
		onclick={handleOverlayClick}
		onkeydown={handleKeydown}
		role="dialog"
		aria-modal="true"
		aria-label={t('nav.cta')}
		tabindex="-1"
	>
		<!-- Panel -->
		<div
			bind:this={modalPanelEl}
			class="relative mx-4 flex max-h-[90dvh] w-full max-w-lg flex-col overflow-hidden rounded-xl bg-background shadow-2xl transition-all duration-200"
			class:scale-95={!panelReady}
			class:scale-100={panelReady}
			class:opacity-0={!panelReady}
			class:opacity-100={panelReady}
		>
			<!-- Close button -->
			<button
				onclick={close}
				class="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
				aria-label="Close"
			>
				<X class="h-4 w-4" />
			</button>

			<!-- Scrollable content -->
			<div class="overflow-y-auto overscroll-contain p-6 sm:p-8">
				<!-- Step indicator -->
				<div class="mb-6 flex items-center justify-center gap-2">
					{#each [1, 2, 3] as s}
						<div
							class="flex h-2 w-2 items-center justify-center rounded-full transition-all duration-300"
							class:bg-primary={step >= s}
							class:w-8={step === s}
							class:bg-muted={step < s}
						></div>
					{/each}
				</div>

				<!-- ============================================================= -->
				<!-- STEP 1: Find your school                                      -->
				<!-- ============================================================= -->
				{#if step === 1}
					<div class="space-y-5">
						<!-- Header -->
						<div class="text-center">
							<div class="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
								<GraduationCap class="h-6 w-6 text-primary" />
							</div>
							<h2 class="text-xl font-semibold tracking-tight text-foreground">
								Encuentra tu colegio <!-- TODO: i18n -->
							</h2>
							<p class="mt-1 text-sm text-muted-foreground">
								Busca entre más de 12.000 establecimientos <!-- TODO: i18n -->
							</p>
						</div>

						<!-- Loading state -->
						{#if schoolStore.loading}
							<div class="flex flex-col items-center justify-center gap-3 py-12">
								<Loader2 class="h-8 w-8 animate-spin text-primary" />
								<p class="text-sm text-muted-foreground">Cargando establecimientos...</p> <!-- TODO: i18n -->
							</div>
						{:else}
							<!-- Region dropdown -->
							<div class="space-y-1.5">
								<label for="demo-region" class="block text-sm font-medium text-foreground">
									Región <!-- TODO: i18n -->
								</label>
								<div class="relative">
									<select
										id="demo-region"
										value={schoolStore.selectedRegion ?? ''}
										onchange={handleRegionChange}
										class="w-full cursor-pointer appearance-none rounded-lg border border-border bg-background py-3 pl-4 pr-10 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
									>
										<option value="">Selecciona una región</option> <!-- TODO: i18n -->
										{#each schoolStore.regions as region}
											<option value={region.code}>{region.name}</option>
										{/each}
									</select>
									<ChevronDown class="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
								</div>
							</div>

							<!-- Commune dropdown -->
							{#if schoolStore.selectedRegion !== null}
								<div class="space-y-1.5">
									<label for="demo-commune" class="block text-sm font-medium text-foreground">
										Comuna <!-- TODO: i18n -->
									</label>
									<div class="relative">
										<select
											id="demo-commune"
											value={schoolStore.selectedCommune ?? ''}
											onchange={handleCommuneChange}
											class="w-full cursor-pointer appearance-none rounded-lg border border-border bg-background py-3 pl-4 pr-10 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
										>
											<option value="">Todas las comunas</option> <!-- TODO: i18n -->
											{#each schoolStore.filteredCommunes as commune}
												<option value={commune}>{commune}</option>
											{/each}
										</select>
										<ChevronDown class="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
									</div>
								</div>
							{/if}

							<!-- Search input -->
							{#if schoolStore.selectedRegion !== null}
								<div class="space-y-1.5">
									<label for="demo-search" class="block text-sm font-medium text-foreground">
										Buscar colegio <!-- TODO: i18n -->
									</label>
									<div class="relative">
										<Search class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
										<input
											bind:this={searchInputEl}
											id="demo-search"
											type="text"
											value={searchInput}
											oninput={handleSearchInput}
											placeholder="Escribe el nombre del colegio..."
											autocomplete="off"
											class="w-full rounded-lg border border-border bg-background py-3 pl-10 pr-4 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
										/>
									</div>
								</div>

								<!-- Results list -->
								{#if hasResults}
									<ul
										bind:this={resultsListEl}
										class="max-h-64 space-y-1 overflow-y-auto rounded-xl border border-border bg-background p-2"
										role="listbox"
										aria-label="School results"
									>
										{#each schools as school, i}
											{@const match = highlightMatch(school.name, searchInput.trim())}
											<li
												role="option"
												aria-selected={highlightIndex === i}
												data-highlighted={highlightIndex === i}
												tabindex={-1}
											>
												<button
													type="button"
													onclick={() => handleSelectSchool(school)}
													class="flex w-full items-start gap-3 rounded-lg px-4 py-3 text-left transition-colors hover:bg-muted"
													class:bg-muted={highlightIndex === i}
												>
													<Building class="mt-0.5 h-4 w-4 flex-shrink-0 text-muted-foreground" />
													<div class="min-w-0 flex-1">
														<div class="text-sm font-semibold text-foreground">
															{#if match}
																{match.before}<mark class="rounded-sm bg-primary/20 text-foreground">{match.match}</mark>{match.after}
															{:else}
																{school.name}
															{/if}
														</div>
														<div class="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
															<MapPin class="h-3 w-3 flex-shrink-0" />
															<span class="truncate">{school.commune}</span>
															<Badge variant="secondary" class="ml-auto h-4 text-[10px] font-medium">
																<Users class="h-2.5 w-2.5" />
																{school.enrollment.toLocaleString('es-CL')}
															</Badge>
														</div>
													</div>
													<ChevronRight class="mt-1 h-4 w-4 flex-shrink-0 text-muted-foreground" />
												</button>
											</li>
										{/each}
									</ul>
								{/if}

								<!-- No results -->
								{#if showNoResults}
									<div class="rounded-xl border border-dashed border-border bg-muted/30 px-4 py-8 text-center">
										<Search class="mx-auto mb-2 h-8 w-8 text-muted-foreground/50" />
										<p class="text-sm font-medium text-foreground">
											No encontramos tu colegio <!-- TODO: i18n -->
										</p>
										<p class="mt-1 text-xs text-muted-foreground">
											Puedes completar los datos manualmente. <!-- TODO: i18n -->
										</p>
									</div>
								{/if}
							{/if}
						{/if}
					</div>

				<!-- ============================================================= -->
				<!-- STEP 2: Confirm & contact info                                -->
				<!-- ============================================================= -->
				{:else if step === 2}
					<div class="space-y-6">
						<!-- Header -->
						<div class="text-center">
							<h2 class="text-xl font-semibold tracking-tight text-foreground">
								Confirma los datos de tu colegio <!-- TODO: i18n -->
							</h2>
							<p class="mt-1 text-sm text-muted-foreground">
								Verifica la información y completa tus datos de contacto <!-- TODO: i18n -->
							</p>
						</div>

						<!-- School confirmation card -->
						{#if schoolStore.selectedSchool}
							{@const school = schoolStore.selectedSchool}
							<div class="rounded-xl border border-primary/20 bg-primary/5 p-5">
								<div class="flex items-start justify-between gap-3">
									<div class="min-w-0 flex-1">
										<h3 class="text-base font-bold leading-tight text-foreground">
											{school.name}
										</h3>
										<div class="mt-2 flex flex-wrap items-center gap-2">
											<Badge variant="outline" class="font-mono text-xs">
												RBD {school.rbd}
											</Badge>
										</div>
										<div class="mt-3 space-y-1.5 text-sm text-muted-foreground">
											<div class="flex items-center gap-2">
												<MapPin class="h-3.5 w-3.5 flex-shrink-0" />
												<span>{school.commune}, {regionName}</span>
											</div>
											<div class="flex items-center gap-2">
												<Building class="h-3.5 w-3.5 flex-shrink-0" />
												<span class="truncate">{school.sostenedor}</span>
											</div>
											<div class="flex items-center gap-2">
												<Users class="h-3.5 w-3.5 flex-shrink-0" />
												<span>{school.enrollment.toLocaleString('es-CL')} estudiantes</span>
											</div>
										</div>
									</div>
								</div>
								<button
									type="button"
									onclick={goBackToStep1}
									class="mt-3 text-sm font-medium text-primary transition-colors hover:text-primary/80"
								>
									&larr; Cambiar colegio <!-- TODO: i18n -->
								</button>
							</div>
						{/if}

						<!-- Contact form -->
						<form onsubmit={handleSubmit} class="space-y-4">
							<!-- Nombre completo -->
							<div class="space-y-1.5">
								<label for="demo-name" class="block text-sm font-medium text-foreground">
									Nombre completo <span class="text-destructive">*</span> <!-- TODO: i18n -->
								</label>
								<input
									id="demo-name"
									type="text"
									required
									bind:value={contactName}
									placeholder="Ej: María González"
									autocomplete="name"
									class="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
								/>
							</div>

							<!-- Cargo / Rol -->
							<div class="space-y-1.5">
								<label for="demo-role" class="block text-sm font-medium text-foreground">
									Cargo / Rol <span class="text-destructive">*</span> <!-- TODO: i18n -->
								</label>
								<div class="relative">
									<select
										id="demo-role"
										required
										bind:value={contactRole}
										class="w-full cursor-pointer appearance-none rounded-lg border border-border bg-background py-3 pl-4 pr-10 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
									>
										<option value="" disabled>Selecciona tu cargo</option> <!-- TODO: i18n -->
										{#each roleOptions as option}
											<option value={option.value}>{option.label}</option>
										{/each}
									</select>
									<ChevronDown class="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
								</div>
							</div>

							<!-- Email institucional -->
							<div class="space-y-1.5">
								<label for="demo-email" class="block text-sm font-medium text-foreground">
									Email institucional <span class="text-destructive">*</span> <!-- TODO: i18n -->
								</label>
								<input
									id="demo-email"
									type="email"
									required
									bind:value={contactEmail}
									placeholder="nombre@colegio.cl"
									autocomplete="email"
									class="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
								/>
							</div>

							<!-- Teléfono -->
							<div class="space-y-1.5">
								<label for="demo-phone" class="block text-sm font-medium text-foreground">
									Teléfono <span class="text-xs text-muted-foreground">(opcional)</span> <!-- TODO: i18n -->
								</label>
								<input
									id="demo-phone"
									type="tel"
									bind:value={contactPhone}
									placeholder="+56 9 1234 5678"
									autocomplete="tel"
									class="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
								/>
							</div>

							<!-- Submit button -->
							<Button
								type="submit"
								size="xl"
								class="w-full"
								disabled={submitting || !contactName.trim() || !contactRole || !contactEmail.trim()}
							>
								{#if submitting}
									<Loader2 class="h-4 w-4 animate-spin" />
									Enviando... <!-- TODO: i18n -->
								{:else}
									Confirmar información <!-- TODO: i18n -->
									<ChevronRight class="h-4 w-4" />
								{/if}
							</Button>
						</form>
					</div>

				<!-- ============================================================= -->
				<!-- STEP 3: Success                                               -->
				<!-- ============================================================= -->
				{:else if step === 3}
					<div class="flex flex-col items-center py-4 text-center">
						<!-- Animated checkmark -->
						<div class="check-animation mb-6">
							<div class="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
								<div class="flex h-14 w-14 items-center justify-center rounded-full bg-green-500 shadow-lg shadow-green-500/25">
									<Check class="h-7 w-7 text-white" strokeWidth={3} />
								</div>
							</div>
						</div>

						<h2 class="text-xl font-semibold tracking-tight text-foreground">
							&iexcl;Listo! <!-- TODO: i18n -->
						</h2>
						<p class="mt-1 text-base text-muted-foreground">
							Nos pondremos en contacto contigo. <!-- TODO: i18n -->
						</p>

						{#if contactEmail}
							<p class="mt-4 rounded-lg bg-muted/50 px-4 py-3 text-sm text-muted-foreground">
								Te enviaremos un email a
								<span class="font-medium text-foreground">{contactEmail}</span>
								para coordinar la demo. <!-- TODO: i18n -->
							</p>
						{/if}

						<Button
							onclick={close}
							size="lg"
							variant="outline"
							class="mt-6"
						>
							Cerrar <!-- TODO: i18n -->
						</Button>
					</div>
				{/if}
			</div>
		</div>
	</div>
{/if}

<style>
	/* Entrance animation for the success checkmark */
	.check-animation {
		animation: checkPop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both;
	}

	@keyframes checkPop {
		0% {
			transform: scale(0);
			opacity: 0;
		}
		50% {
			transform: scale(1.1);
		}
		100% {
			transform: scale(1);
			opacity: 1;
		}
	}

	/* Smooth scrollbar for results list */
	ul[role="listbox"] {
		scrollbar-width: thin;
		scrollbar-color: oklch(var(--border)) transparent;
	}

	ul[role="listbox"]::-webkit-scrollbar {
		width: 6px;
	}

	ul[role="listbox"]::-webkit-scrollbar-track {
		background: transparent;
	}

	ul[role="listbox"]::-webkit-scrollbar-thumb {
		background-color: oklch(var(--border));
		border-radius: 3px;
	}

	/* Highlight mark styling override */
	mark {
		background-color: inherit;
		color: inherit;
	}
</style>
