import { test, expect } from '@playwright/test';
import { createClient } from '@supabase/supabase-js';

const url = process.env.SUPABASE_URL ?? process.env.PUBLIC_SUPABASE_URL ?? '';
const key = process.env.SUPABASE_ANON_KEY ?? process.env.PUBLIC_SUPABASE_ANON_KEY ?? '';

test.skip(!url || !key, 'Skipped: missing SUPABASE_URL / SUPABASE_ANON_KEY env vars');

// Defer client instantiation — createClient throws on empty url/key during module load,
// which breaks Playwright's test-collection pass even though test.skip excludes runtime.
const supabase = url && key ? createClient(url, key) : (null as unknown as ReturnType<typeof createClient>);

test.describe('DB Integration — lead persistence', () => {
	const testEmail = `e2e-test-${Date.now()}@ethoz-test.com`;
	const testName = 'E2E Test User';

	test.afterAll(async () => {
		await supabase.from('leads').delete().eq('contact_email', testEmail);
	});

	test('contact form submission writes lead to Supabase', async ({ page }) => {
		await page.goto('/contact');

		// Dismiss cookie consent banner if present
		const consentBtn = page.locator('button', { hasText: /Aceptar/ });
		if (await consentBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
			await consentBtn.click();
			await page.waitForTimeout(300);
		}

		// Fill in the contact form
		await page.fill('#contact-name', testName);
		await page.fill('#contact-email', testEmail);
		await page.fill('#contact-message', 'E2E integration test - please delete');

		// Submit the form
		await page.click('button[type="submit"]');

		// Wait for the success state to appear
		await page.waitForSelector('.text-success, [data-success], svg.text-success', { timeout: 10_000 });

		// Allow time for the async Supabase write to complete
		await page.waitForTimeout(2000);

		// Verify the lead was written to the DB
		const { data, error } = await supabase
			.from('leads')
			.select('*')
			.eq('contact_email', testEmail)
			.single();

		expect(error).toBeNull();
		expect(data).toBeTruthy();
		expect(data.contact_name).toBe(testName);
		expect(data.contact_email).toBe(testEmail);
		expect(data.contact_source).toBe('contact_page');
		expect(data.status).toBe('new');
	});
});
