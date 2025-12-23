import { test, expect } from '@playwright/test';

test.describe('Responsive Design Tests', () => {
    test('RES-001: Desktop layout (1920x1080)', async ({ browser }) => {
        const context = await browser.newContext({
            viewport: { width: 1920, height: 1080 }
        });
        const page = await context.newPage();

        await page.goto('/');
        await page.waitForSelector('canvas', { timeout: 30000 });
        await page.waitForTimeout(3000);

        // Canvas should be visible
        const canvas = page.locator('canvas');
        await expect(canvas).toBeVisible();

        // Page should have content
        const body = page.locator('body');
        await expect(body).toBeVisible();

        await context.close();
    });

    test('RES-002: Laptop layout (1280x720)', async ({ browser }) => {
        const context = await browser.newContext({
            viewport: { width: 1280, height: 720 }
        });
        const page = await context.newPage();

        await page.goto('/');
        await page.waitForSelector('canvas', { timeout: 30000 });
        await page.waitForTimeout(3000);

        const canvas = page.locator('canvas');
        await expect(canvas).toBeVisible();

        await context.close();
    });

    test('RES-003: Tablet portrait (768x1024)', async ({ browser }) => {
        const context = await browser.newContext({
            viewport: { width: 768, height: 1024 }
        });
        const page = await context.newPage();

        await page.goto('/');
        await page.waitForSelector('canvas', { timeout: 30000 });
        await page.waitForTimeout(3000);

        const canvas = page.locator('canvas');
        await expect(canvas).toBeVisible();

        await context.close();
    });

    test('RES-004: Mobile portrait (375x667)', async ({ browser }) => {
        const context = await browser.newContext({
            viewport: { width: 375, height: 667 },
            isMobile: true,
        });
        const page = await context.newPage();

        await page.goto('/', { timeout: 60000 });
        await page.waitForSelector('canvas', { timeout: 60000 });
        await page.waitForTimeout(4000);

        const canvas = page.locator('canvas');
        await expect(canvas).toBeVisible({ timeout: 10000 });

        await context.close();
    });

    test('RES-005: Canvas renders after viewport resize', async ({ page }) => {
        await page.setViewportSize({ width: 1920, height: 1080 });
        await page.goto('/');
        await page.waitForSelector('canvas', { timeout: 30000 });
        await page.waitForTimeout(2000);

        // Resize viewport
        await page.setViewportSize({ width: 1280, height: 720 });
        await page.waitForTimeout(1000);

        // Canvas should still be visible
        const canvas = page.locator('canvas');
        await expect(canvas).toBeVisible();

        const box = await canvas.boundingBox();
        expect(box).not.toBeNull();
        expect(box!.width).toBeGreaterThan(0);
    });

    test('RES-006: Content is visible on mobile', async ({ browser }) => {
        const context = await browser.newContext({
            viewport: { width: 375, height: 667 },
            isMobile: true,
        });
        const page = await context.newPage();

        await page.goto('/');
        await page.waitForSelector('canvas', { timeout: 30000 });
        await page.waitForTimeout(3000);

        // Check canvas is visible on mobile
        const canvas = page.locator('canvas');
        await expect(canvas).toBeVisible();

        // Check that sections exist
        const heroSection = page.locator('#hero');
        await expect(heroSection).toBeAttached();

        await context.close();
    });

    test('RES-007: Explore button visible on mobile', async ({ browser }) => {
        const context = await browser.newContext({
            viewport: { width: 375, height: 667 },
            isMobile: true,
        });
        const page = await context.newPage();

        await page.goto('/');
        await page.waitForSelector('canvas', { timeout: 30000 });
        await page.waitForTimeout(3000);

        // Check explore button is visible
        const exploreBtn = page.locator('button').filter({ hasText: /explore/i }).first();
        await expect(exploreBtn).toBeVisible();

        await context.close();
    });
});
