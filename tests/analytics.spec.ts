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

test.describe('Analytics — hero CTA trackEvent calls', () => {
	test('Watch Video hero button fires hero_cta_clicked with cta:watch_video location:hero', async ({
		page
	}) => {
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
		// intercepts pointer events over the sticky CTA
		await page.evaluate(() => {
			localStorage.setItem('cookie-consent', 'accepted');
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

