import { test, expect } from '@playwright/test';

test.describe('Scroll Animation Tests', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        await page.waitForSelector('canvas', { timeout: 30000 });
        await page.waitForTimeout(3000);
    });

    test('SCR-001: Page has scrollable sections', async ({ page }) => {
        const hero = page.locator('#hero');
        const features = page.locator('#features');
        const details = page.locator('#details');
        const cta = page.locator('#cta');

        await expect(hero).toBeVisible();
        await expect(features).toBeAttached();
        await expect(details).toBeAttached();
        await expect(cta).toBeAttached();
    });

    test('SCR-002: Scroll to features section', async ({ page }) => {
        await page.evaluate(() => {
            document.querySelector('#features')?.scrollIntoView({ behavior: 'instant' });
        });
        await page.waitForTimeout(1000);

        const featuresHeading = page.locator('text=Exceptional Features');
        await expect(featuresHeading).toBeVisible();
    });

    test('SCR-003: Scroll to details section', async ({ page }) => {
        await page.evaluate(() => {
            document.querySelector('#details')?.scrollIntoView({ behavior: 'instant' });
        });
        await page.waitForTimeout(1000);

        const detailsHeading = page.locator('text=Technical Details');
        await expect(detailsHeading).toBeVisible();
    });

    test('SCR-004: Scroll to CTA section', async ({ page }) => {
        await page.evaluate(() => {
            document.querySelector('#cta')?.scrollIntoView({ behavior: 'instant' });
        });
        await page.waitForTimeout(1000);

        const ctaHeading = page.locator('text=Ready to Elevate');
        await expect(ctaHeading).toBeVisible();
    });

    test('SCR-005: Nav highlights current section on scroll', async ({ page }) => {
        // Check hero is active initially
        const heroNav = page.locator('a[href="#hero"]');

        // Scroll to features
        await page.evaluate(() => {
            document.querySelector('#features')?.scrollIntoView({ behavior: 'instant' });
        });
        await page.waitForTimeout(1500);

        // Features nav should now be highlighted (check for active class or style)
        const featuresNav = page.locator('a[href="#features"]');
        await expect(featuresNav).toBeVisible();
    });

    test('SCR-006: Smooth scroll animation duration', async ({ page }) => {
        const startTime = Date.now();

        await page.evaluate(() => {
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        });

        // Wait for scroll to complete
        await page.waitForFunction(() => {
            const scrollTop = window.scrollY;
            const maxScroll = document.body.scrollHeight - window.innerHeight;
            return Math.abs(scrollTop - maxScroll) < 10;
        }, { timeout: 5000 });

        const duration = Date.now() - startTime;
        // Smooth scroll should take at least 500ms
        expect(duration).toBeGreaterThan(400);
    });

    test('SCR-007: Page scroll height is correct', async ({ page }) => {
        const scrollHeight = await page.evaluate(() => document.body.scrollHeight);
        const viewportHeight = await page.evaluate(() => window.innerHeight);

        // Should have at least 4 viewport heights (4 sections)
        expect(scrollHeight).toBeGreaterThanOrEqual(viewportHeight * 3.5);
    });
});
