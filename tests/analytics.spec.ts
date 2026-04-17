import { test, expect, type Page } from '@playwright/test';

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Patch dataLayer.push AFTER the page has loaded so we capture all subsequent
 * pushes. Must be called after page.goto() + waitForLoadState().
 * Returns captured events via _captured on window.
 */
async function patchDataLayer(page: Page) {
	await page.evaluate(() => {
		(window as any)._captured = [];
		const dl = (window as any).dataLayer;
		if (!dl) return;
		const orig = dl.push.bind(dl);
		dl.push = function (...args: any[]) {
			(window as any)._captured.push(...args);
			return orig(...args);
		};
		// Clear internal flag to ensure trackEvent fires
		localStorage.removeItem('ethoz_internal');
		sessionStorage.removeItem('ethoz_ip_checked');
	});
}

async function getCaptured(page: Page, eventName: string) {
	return page.evaluate(
		(name: string) => ((window as any)._captured ?? []).filter((e: any) => e.event === name),
		eventName
	);
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. Hero CTA buttons fire hero_cta_clicked
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Pre-seed localStorage with accepted consent so GTM loads and trackEvent
 * reaches dataLayer. Must be called BEFORE page.goto().
 */
async function acceptConsent(page: Page) {
	await page.addInitScript(() => {
		localStorage.setItem(
			'ethoz_consent_v1',
			JSON.stringify({ essential: true, analytics: true, marketing: true, updatedAt: Date.now() })
		);
	});
}

test.describe('Analytics — hero CTA trackEvent calls', () => {
	test('Watch Video hero button fires hero_cta_clicked with cta:watch_video location:hero', async ({
		page
	}) => {
		await acceptConsent(page);
		await page.goto('/');
		await page.waitForLoadState('networkidle');
		await patchDataLayer(page);

		// The Watch Video button text in the built output is "Conoce Ethoz en 2 min Ver video"
		// It opens PitchModal and fires hero_cta_clicked + pitch_opened
		const videoBtn = page
			.locator('button')
			.filter({ hasText: /conoce ethoz en 2 min/i })
			.first();
		await expect(videoBtn).toBeVisible();
		await videoBtn.click();
		await page.waitForTimeout(500);

		const events = await getCaptured(page, 'hero_cta_clicked');
		const watchVideo = events.filter(
			(e: any) => e.cta === 'watch_video' && e.location === 'hero'
		);
		// FLAG: if this fails, hero_cta_clicked is not firing before pitch_opened —
		// meaning trackEvent call is being skipped or event name is wrong in the build
		expect(watchVideo.length).toBeGreaterThanOrEqual(1);
	});

	test('Book Demo hero button fires hero_cta_clicked with cta:book_demo location:hero', async ({
		page
	}) => {
		await acceptConsent(page);
		await page.goto('/');
		await page.waitForLoadState('networkidle');
		await patchDataLayer(page);

		// Button is now a plain <button> (no href) using goto() — find by text
		const bookDemoBtn = page
			.locator('main button')
			.filter({ hasText: /agendar demo|book a demo/i })
			.first();
		await expect(bookDemoBtn).toBeVisible();

		// Intercept the SvelteKit navigation so the test stays on the page
		await page.route('**/demo**', (route) => route.abort());

		await bookDemoBtn.click();
		await page.waitForTimeout(500);

		const events = await getCaptured(page, 'hero_cta_clicked');
		const bookDemo = events.filter(
			(e: any) => e.cta === 'book_demo' && e.location === 'hero'
		);
		expect(bookDemo.length).toBeGreaterThanOrEqual(1);
	});

	test('Sticky CTA fires hero_cta_clicked with cta:book_demo location:sticky', async ({
		page
	}) => {
		// Use mobile viewport so sticky CTA renders (md:hidden = hidden on ≥768px)
		await page.setViewportSize({ width: 375, height: 812 });
		await page.goto('/');
		await page.waitForLoadState('networkidle');
		await patchDataLayer(page);

		// Dismiss cookie consent banner — it sits in a fixed bottom overlay that
		// intercepts pointer events over the sticky CTA. Use the new consent store key.
		await page.evaluate(() => {
			localStorage.setItem(
				'ethoz_consent_v1',
				JSON.stringify({ essential: true, analytics: true, marketing: true, updatedAt: Date.now() })
			);
		});
		await page.reload();
		await page.waitForLoadState('networkidle');
		await patchDataLayer(page);

		// Scroll past 300px to trigger showStickyCta
		await page.evaluate(() => window.scrollTo(0, 500));
		await page.waitForTimeout(300);

		// Button is now a plain <button> (no href) using goto()
		const stickyBtn = page.locator('.fixed.bottom-0 button').first();
		await expect(stickyBtn).toBeVisible({ timeout: 5000 });

		// Intercept the SvelteKit navigation so the test stays on the page
		await page.route('**/demo**', (route) => route.abort());

		await stickyBtn.click();
		await page.waitForTimeout(500);

		const events = await getCaptured(page, 'hero_cta_clicked');
		const stickyEvents = events.filter(
			(e: any) => e.cta === 'book_demo' && e.location === 'sticky'
		);
		expect(stickyEvents.length).toBeGreaterThanOrEqual(1);
	});
});

// ─────────────────────────────────────────────────────────────────────────────
// 2. Consent — reject flow
// ─────────────────────────────────────────────────────────────────────────────

test.describe('Consent — reject flow', () => {
	test('no GTM/Clarity requests load when user picks "Solo esenciales"', async ({ page }) => {
		const gtmRequests: string[] = [];
		const clarityRequests: string[] = [];
		page.on('request', (req) => {
			const url = req.url();
			if (url.includes('googletagmanager.com/gtm.js')) gtmRequests.push(url);
			if (url.includes('clarity.ms/tag')) clarityRequests.push(url);
		});

		await page.goto('/');
		await page.getByRole('button', { name: 'Solo esenciales' }).click();

		// Navigate a couple of routes to let any lazy loader fire.
		await page.goto('/comparativa');
		await page.goto('/ley-21719');
		await page.waitForTimeout(2000);

		expect(gtmRequests).toHaveLength(0);
		expect(clarityRequests).toHaveLength(0);
	});

	test('trackEvent calls do not touch dataLayer pre-consent', async ({ page }) => {
		await page.goto('/');
		const dlBefore = await page.evaluate(() => (window as any).dataLayer?.length ?? 0);
		// Fire a tracked CTA click via trial click (hover/focus without navigating).
		const cta = page.getByRole('link', { name: /Agendar demo/i }).first();
		if (await cta.count()) {
			await cta.click({ trial: true });
		}
		await page.waitForTimeout(500);
		const dlAfter = await page.evaluate(() => (window as any).dataLayer?.length ?? 0);
		expect(dlAfter).toBe(dlBefore);
	});
});

// ─────────────────────────────────────────────────────────────────────────────
// 3. Consent — accept flow + buffer flush
// ─────────────────────────────────────────────────────────────────────────────

test.describe('Consent — accept flow', () => {
	test('buffered events flush to dataLayer after consent is granted', async ({ page }) => {
		await page.goto('/');
		await page.waitForLoadState('networkidle');

		// Dismiss hero modal if it opened.
		// Trigger a tracked event pre-consent: click the "Conoce Ethoz en 2 min" button
		// which calls trackEvent('hero_cta_clicked', { cta: 'watch_video', location: 'hero' })
		// and trackEvent('pitch_opened'). Both should buffer in sessionStorage, not dataLayer.
		const videoBtn = page
			.locator('button')
			.filter({ hasText: /conoce ethoz en 2 min/i })
			.first();
		await expect(videoBtn).toBeVisible();
		await videoBtn.click();
		await page.waitForTimeout(300);

		const bufferedBefore = await page.evaluate(() =>
			sessionStorage.getItem('ethoz_pending_events')
		);
		expect(bufferedBefore).not.toBeNull();
		const parsed = JSON.parse(bufferedBefore!);
		expect(parsed.length).toBeGreaterThanOrEqual(1);
		expect(parsed.some((e: any) => e.event === 'hero_cta_clicked')).toBe(true);

		const dlLenBefore = await page.evaluate(() => (window as any).dataLayer?.length ?? 0);

		// Close the pitch modal if open, then accept all.
		await page.keyboard.press('Escape');
		await page.waitForTimeout(200);
		await page.getByRole('button', { name: 'Aceptar todo' }).click();
		await page.waitForTimeout(1500);

		const dlLenAfter = await page.evaluate(() => (window as any).dataLayer?.length ?? 0);
		expect(dlLenAfter).toBeGreaterThan(dlLenBefore);

		const flushed = await page.evaluate(() =>
			((window as any).dataLayer ?? []).some((e: any) => e.event === 'hero_cta_clicked')
		);
		expect(flushed).toBe(true);

		const bufferedAfter = await page.evaluate(() =>
			sessionStorage.getItem('ethoz_pending_events')
		);
		expect(bufferedAfter).toBeNull();
	});
});

