/**
 * Feedback Store — localStorage-backed feedback items for dev mode.
 * Uses Svelte 5 runes. Only active when PUBLIC_FEEDBACK_MODE is set.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface FeedbackItem {
	id: string;
	type: 'bug' | 'suggestion' | 'question';
	description: string;
	status: 'pending' | 'in-progress' | 'done' | 'dismissed';
	// Context
	pageRoute: string;
	elementType: string;
	elementLabel: string;
	sectionName: string | null;
	selectorPath: string;
	visibleText: string;
	viewport: { width: number; height: number };
	// Timestamps
	createdAt: string;
}

// ---------------------------------------------------------------------------
// Store factory
// ---------------------------------------------------------------------------

function createFeedbackStore() {
	let items = $state<FeedbackItem[]>([]);
	let feedbackModeActive = $state(false);
	let capturedTarget = $state<{
		elementType: string;
		elementLabel: string;
		sectionName: string | null;
		selectorPath: string;
		visibleText: string;
	} | null>(null);
	let modalOpen = $state(false);

	// ---- persistence --------------------------------------------------------

	function load() {
		if (typeof window === 'undefined') return;
		const stored = localStorage.getItem('ethoz-feedback');
		if (stored) {
			try {
				items = JSON.parse(stored);
			} catch {
				items = [];
			}
		}
	}

	function save() {
		if (typeof window === 'undefined') return;
		localStorage.setItem('ethoz-feedback', JSON.stringify(items));
	}

	// ---- actions ------------------------------------------------------------

	function addItem(item: Omit<FeedbackItem, 'id' | 'status' | 'createdAt'>) {
		items = [
			...items,
			{
				...item,
				id: crypto.randomUUID(),
				status: 'pending',
				createdAt: new Date().toISOString()
			}
		];
		save();
	}

	function updateStatus(id: string, status: FeedbackItem['status']) {
		items = items.map((i) => (i.id === id ? { ...i, status } : i));
		save();
	}

	function removeItem(id: string) {
		items = items.filter((i) => i.id !== id);
		save();
	}

	function clearAll() {
		items = [];
		save();
	}

	function exportJSON(): string {
		return JSON.stringify(items, null, 2);
	}

	function toggleMode() {
		feedbackModeActive = !feedbackModeActive;
	}

	function captureTarget(ctx: typeof capturedTarget) {
		capturedTarget = ctx;
		modalOpen = true;
	}

	function closeModal() {
		modalOpen = false;
		capturedTarget = null;
	}

	// ---- public API ---------------------------------------------------------

	return {
		get items() {
			return items;
		},
		get active() {
			return feedbackModeActive;
		},
		get capturedTarget() {
			return capturedTarget;
		},
		get modalOpen() {
			return modalOpen;
		},
		load,
		addItem,
		updateStatus,
		removeItem,
		clearAll,
		exportJSON,
		toggleMode,
		captureTarget,
		closeModal
	};
}

// ---------------------------------------------------------------------------
// Singleton export
// ---------------------------------------------------------------------------

export const feedbackStore = createFeedbackStore();
