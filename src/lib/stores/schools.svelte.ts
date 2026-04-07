/**
 * School Search Store for "Agendar Demo" form.
 *
 * Lazy-loads /data/schools.json (12,038 Chilean schools) and provides
 * reactive search, region/commune filtering, and school selection
 * using Svelte 5 runes.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface SchoolRaw {
	r: number;
	n: string;
	rg: number;
	c: string;
	s: string;
	m: number;
	d: number;
	lt: number;
	lg: number;
}

interface SchoolData {
	meta: { totalSchools: number; totalRegions: number; totalCommunes: number };
	depTypes: Record<string, string>;
	regions: Array<{ code: number; name: string }>;
	communes: Array<{ region: number; name: string }>;
	schools: SchoolRaw[];
}

export interface School {
	rbd: number;
	name: string;
	nameNorm: string;
	regionCode: number;
	commune: string;
	sostenedor: string;
	enrollment: number;
	depType: number;
	lat: number;
	lng: number;
}

export interface Region {
	code: number;
	name: string;
}

import { normalize } from '$lib/utils/text';
import { log } from '$lib/utils/logger';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const MAX_RESULTS = 50;

/**
 * Map a compact JSON school record to the public School shape.
 */
function mapSchool(raw: SchoolRaw): School {
	return {
		rbd: raw.r,
		name: raw.n,
		nameNorm: normalize(raw.n),
		regionCode: raw.rg,
		commune: raw.c,
		sostenedor: raw.s,
		enrollment: raw.m,
		depType: raw.d,
		lat: raw.lt,
		lng: raw.lg
	};
}

// ---------------------------------------------------------------------------
// Store factory
// ---------------------------------------------------------------------------

function createSchoolStore() {
	// ---- raw data (not exposed) ------------------------------------------
	let allSchools: School[] = [];
	let schoolsByRbd = new Map<number, School>();
	let communesByRegion = new Map<number, string[]>();

	// ---- reactive state --------------------------------------------------
	let loaded = $state(false);
	let loading = $state(false);
	let loadError = $state<string | null>(null);
	let regions = $state<Region[]>([]);

	let selectedRegion = $state<number | null>(null);
	let selectedCommune = $state<string | null>(null);
	let searchQuery = $state('');
	let selectedSchool = $state<School | null>(null);

	// ---- derived ---------------------------------------------------------

	const filteredCommunes = $derived.by(() => {
		if (selectedRegion === null) return [];
		return communesByRegion.get(selectedRegion) ?? [];
	});

	const filteredSchools = $derived.by(() => {
		let pool = allSchools;

		// Region filter
		if (selectedRegion !== null) {
			pool = pool.filter((s) => s.regionCode === selectedRegion);
		}

		// Commune filter
		if (selectedCommune !== null) {
			pool = pool.filter((s) => s.commune === selectedCommune);
		}

		// Search query filter (requires at least 2 characters)
		const query = searchQuery.trim();
		if (query.length < 2) {
			// No search text — return by enrollment desc, capped
			return pool
				.slice()
				.sort((a, b) => b.enrollment - a.enrollment)
				.slice(0, MAX_RESULTS);
		}

		const normalizedQuery = normalize(query);

		// Score each school: exact-start match gets priority, then enrollment
		const scored: Array<{ school: School; exactStart: boolean }> = [];

		for (const school of pool) {
			if (school.nameNorm.includes(normalizedQuery)) {
				scored.push({
					school,
					exactStart: school.nameNorm.startsWith(normalizedQuery)
				});
			}
		}

		scored.sort((a, b) => {
			// Exact-start matches first
			if (a.exactStart !== b.exactStart) return a.exactStart ? -1 : 1;
			// Then by enrollment descending
			return b.school.enrollment - a.school.enrollment;
		});

		return scored.slice(0, MAX_RESULTS).map((s) => s.school);
	});

	// ---- actions ---------------------------------------------------------

	async function load(): Promise<void> {
		if (loaded || loading) return;

		loading = true;

		try {
			const response = await fetch('/data/schools.json');

			if (!response.ok) {
				throw new Error(`Failed to load schools data: ${response.status} ${response.statusText}`);
			}

			const data: SchoolData = await response.json();

			regions = data.regions.map((r) => ({ code: r.code, name: r.name }));
			allSchools = data.schools.map(mapSchool);

			// Build lookup maps for O(1) access
			schoolsByRbd = new Map(allSchools.map((s) => [s.rbd, s]));

			// Pre-compute communes per region
			const communeMap = new Map<number, Set<string>>();
			for (const s of allSchools) {
				if (!communeMap.has(s.regionCode)) communeMap.set(s.regionCode, new Set());
				communeMap.get(s.regionCode)!.add(s.commune);
			}
			communesByRegion = new Map(
				Array.from(communeMap.entries()).map(([code, set]) => [
					code,
					Array.from(set).sort((a, b) => a.localeCompare(b, 'es'))
				])
			);

			loaded = true;
		} catch (error) {
			log.error('[schoolStore] Error loading schools data:', error);
			loadError = 'No pudimos cargar los colegios. Verifica tu conexión.';
		} finally {
			loading = false;
		}
	}

	function setRegion(code: number | null): void {
		selectedRegion = code;
		selectedCommune = null;
		searchQuery = '';
		selectedSchool = null;
	}

	function setCommune(name: string | null): void {
		selectedCommune = name;
		searchQuery = '';
		selectedSchool = null;
	}

	function setSearch(query: string): void {
		searchQuery = query;
		selectedSchool = null;
	}

	function selectSchool(rbd: number): void {
		selectedSchool = schoolsByRbd.get(rbd) ?? null;
	}

	function clearSelection(): void {
		selectedSchool = null;
	}

	function reset(): void {
		selectedRegion = null;
		selectedCommune = null;
		searchQuery = '';
		selectedSchool = null;
	}

	// ---- public API ------------------------------------------------------

	return {
		get loaded() {
			return loaded;
		},
		get loading() {
			return loading;
		},
		get loadError() {
			return loadError;
		},
		get regions() {
			return regions;
		},

		get selectedRegion() {
			return selectedRegion;
		},
		get selectedCommune() {
			return selectedCommune;
		},
		get searchQuery() {
			return searchQuery;
		},

		get filteredCommunes() {
			return filteredCommunes;
		},
		get filteredSchools() {
			return filteredSchools;
		},
		get selectedSchool() {
			return selectedSchool;
		},

		load,
		setRegion,
		setCommune,
		setSearch,
		selectSchool,
		clearSelection,
		reset
	};
}

// ---------------------------------------------------------------------------
// Singleton export
// ---------------------------------------------------------------------------

export const schoolStore = createSchoolStore();
