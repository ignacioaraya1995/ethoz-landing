import { test, expect } from '@playwright/test';

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

async function getMetaContent(page: any, selector: string): Promise<string> {
	return page.evaluate((sel: string) => {
		const el = document.querySelector(sel);
		return el ? (el.getAttribute('content') ?? '') : '';
	}, selector);
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. Core SEO meta on key pages
// ─────────────────────────────────────────────────────────────────────────────

const SEO_PAGES = [
	'/',
	'/pitch',
	'/suggestions',
	'/contact',
	'/compliance',
	'/productos',
	'/get-started',
	'/blog'
] as const;

test.describe('SEO — meta tags on key pages', () => {
	for (const route of SEO_PAGES) {
		test(`${route} has title, description ≥50 chars, canonical, og:title, og:url, twitter:card`, async ({
			page
		}) => {
			await page.goto(route);

			// <title> must be non-empty
			const title = await page.title();
			expect(title.trim().length, `<title> must not be empty on ${route}`).toBeGreaterThan(0);

			// <meta name="description"> must be present and ≥50 chars
			const description = await getMetaContent(page, 'meta[name="description"]');
			expect(
				description.length,
				`description on ${route} must be ≥50 chars (got ${description.length})`
			).toBeGreaterThanOrEqual(50);

			// <link rel="canonical"> must be absolute https://ethoz.cl/...
			const canonical = await page.evaluate(() => {
				const el = document.querySelector('link[rel="canonical"]');
				return el ? el.getAttribute('href') ?? '' : '';
			});
			expect(
				canonical,
				`canonical on ${route} must start with https://ethoz.cl/`
			).toMatch(/^https:\/\/ethoz\.cl\//);

			// <meta property="og:title"> must be present
			const ogTitle = await getMetaContent(page, 'meta[property="og:title"]');
			expect(
				ogTitle.trim().length,
				`og:title must not be empty on ${route}`
			).toBeGreaterThan(0);

			// <meta property="og:url"> must be present
			const ogUrl = await getMetaContent(page, 'meta[property="og:url"]');
			expect(
				ogUrl.trim().length,
				`og:url must not be empty on ${route}`
			).toBeGreaterThan(0);

			// <meta name="twitter:card"> must be present
			const twitterCard = await getMetaContent(page, 'meta[name="twitter:card"]');
			expect(
				twitterCard.trim().length,
				`twitter:card must not be empty on ${route}`
			).toBeGreaterThan(0);
		});
	}

	// ── Homepage-specific structured data ──

	test('homepage has Organization ld+json with @type:Organization', async ({ page }) => {
		await page.goto('/');

		const hasOrg = await page.evaluate(() => {
			const scripts = Array.from(
				document.querySelectorAll('script[type="application/ld+json"]')
			);
			return scripts.some((s) => {
				try {
					const data = JSON.parse(s.textContent ?? '');
					const items = Array.isArray(data) ? data : [data];
					return items.some((item: any) => item['@type'] === 'Organization');
				} catch {
					return false;
				}
			});
		});
		expect(hasOrg, 'homepage must have a ld+json block containing @type:Organization').toBe(
			true
		);
	});

	test('homepage Organization sameAs has exactly 5 social URLs', async ({ page }) => {
		await page.goto('/');

		const sameAsCount = await page.evaluate(() => {
			const scripts = Array.from(
				document.querySelectorAll('script[type="application/ld+json"]')
			);
			for (const s of scripts) {
				try {
					const data = JSON.parse(s.textContent ?? '');
					const items = Array.isArray(data) ? data : [data];
					const org = items.find((item: any) => item['@type'] === 'Organization');
					if (org && Array.isArray(org.sameAs)) return org.sameAs.length;
				} catch {
					// continue
				}
			}
			return 0;
		});
		expect(sameAsCount, 'Organization sameAs must have 5 social URLs').toBe(5);
	});
});

// ─────────────────────────────────────────────────────────────────────────────
// 2. /admin pages are noindex
// ─────────────────────────────────────────────────────────────────────────────

test.describe('SEO — /admin pages are noindex', () => {
	// NOTE: The meta-tag-based check is intentionally NOT asserted here.
	// adapter-static serves 200.html for /admin before hydration, which only contains the root
	// layout's default `index, follow` robots meta. admin/+layout.svelte's noindex tag only
	// injects post-hydration — crawlers may have already indexed by then.
	// Real enforcement is via firebase.json X-Robots-Tag header (see tests below).

	test('/admin noindex via firebase headers (only runs on prod/preview)', async ({ request }) => {
		test.skip(
			!process.env.TEST_PROD_HEADERS,
			'Requires TEST_PROD_HEADERS=1 and firebase emulator/live host'
		);

		const res = await request.get('http://localhost:4173/admin');
		const robots = res.headers()['x-robots-tag'] || '';
		expect(
			robots.toLowerCase(),
			'X-Robots-Tag header must contain "noindex" on /admin'
		).toContain('noindex');
		expect(
			robots.toLowerCase(),
			'X-Robots-Tag header must contain "nofollow" on /admin'
		).toContain('nofollow');
	});

	test('/admin/** noindex via firebase headers (only runs on prod/preview)', async ({ request }) => {
		test.skip(
			!process.env.TEST_PROD_HEADERS,
			'Requires TEST_PROD_HEADERS=1 and firebase emulator/live host'
		);

		const res = await request.get('http://localhost:4173/admin/leads');
		const robots = res.headers()['x-robots-tag'] || '';
		expect(
			robots.toLowerCase(),
			'X-Robots-Tag header must contain "noindex" on /admin/**'
		).toContain('noindex');
		expect(
			robots.toLowerCase(),
			'X-Robots-Tag header must contain "nofollow" on /admin/**'
		).toContain('nofollow');
	});
});

// ─────────────────────────────────────────────────────────────────────────────
// 3. robots.txt
// ─────────────────────────────────────────────────────────────────────────────

test.describe('SEO — robots.txt', () => {
	test('robots.txt disallows /admin and references sitemap', async ({ page }) => {
		const response = await page.goto('/robots.txt');
		expect(response?.status(), 'robots.txt must return 200').toBe(200);

		const body = await response!.text();
		expect(body, 'robots.txt must contain Disallow: /admin').toContain('Disallow: /admin');
		expect(body, 'robots.txt must reference sitemap.xml').toContain(
			'Sitemap: https://ethoz.cl/sitemap.xml'
		);
	});
});

// ─────────────────────────────────────────────────────────────────────────────
// 4. sitemap.xml
// ─────────────────────────────────────────────────────────────────────────────

test.describe('SEO — sitemap.xml', () => {
	test('sitemap.xml returns 200 with urlset element', async ({ page }) => {
		const response = await page.goto('/sitemap.xml');
		expect(response?.status(), 'sitemap.xml must return 200').toBe(200);

		const body = await response!.text();
		expect(body, 'sitemap.xml must contain <urlset').toContain('<urlset');
	});

	test('sitemap.xml contains /pitch', async ({ page }) => {
		const response = await page.goto('/sitemap.xml');
		const body = await response!.text();
		expect(body, 'sitemap.xml must contain /pitch URL').toContain(
			'https://ethoz.cl/pitch'
		);
	});

	test('sitemap.xml does not contain /suggestions (noindex internal tool)', async ({ page }) => {
		const response = await page.goto('/sitemap.xml');
		const body = await response!.text();
		expect(body, 'sitemap.xml must not expose /suggestions URL (flipped to noindex)').not.toContain(
			'https://ethoz.cl/suggestions'
		);
	});

	test('sitemap.xml does not contain /admin URLs', async ({ page }) => {
		const response = await page.goto('/sitemap.xml');
		const body = await response!.text();
		expect(body, 'sitemap.xml must not expose /admin URLs').not.toContain(
			'ethoz.cl/admin'
		);
	});
});
