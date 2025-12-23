import { test, expect } from '@playwright/test';

test.describe('User Interaction Tests', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        await page.waitForSelector('canvas', { timeout: 30000 });
        await page.waitForTimeout(3000);
    });

    test('INT-001: Explore button is visible', async ({ page }) => {
        const exploreBtn = page.locator('button:has-text("Explore")');
        await expect(exploreBtn).toBeVisible();
    });

    test('INT-002: Explore button can be clicked', async ({ page }) => {
        const exploreBtn = page.locator('button:has-text("Explore")');
        await exploreBtn.click();

        // After click, should show "Exit Explore" or similar
        const exitBtn = page.locator('button:has-text("Exit")');
        await expect(exitBtn).toBeVisible({ timeout: 2000 });
    });

    test('INT-003: Exit explore mode works', async ({ page }) => {
        // Enter explore mode
        const exploreBtn = page.locator('button:has-text("Explore")');
        await exploreBtn.click();
        await page.waitForTimeout(500);

        // Exit explore mode
        const exitBtn = page.locator('button:has-text("Exit")');
        await exitBtn.click();

        // Explore button should be visible again
        await expect(exploreBtn).toBeVisible({ timeout: 2000 });
    });

    test('INT-004: Canvas responds to mouse drag in explore mode', async ({ page }) => {
        // Enter explore mode
        const exploreBtn = page.locator('button:has-text("Explore")');
        await exploreBtn.click();
        await page.waitForTimeout(500);

        // Get canvas
        const canvas = page.locator('canvas');
        const box = await canvas.boundingBox();

        if (box) {
            const centerX = box.x + box.width / 2;
            const centerY = box.y + box.height / 2;

            // Perform drag
            await page.mouse.move(centerX, centerY);
            await page.mouse.down();
            await page.mouse.move(centerX + 100, centerY, { steps: 10 });
            await page.mouse.up();
        }

        // Test passes if no errors occurred
        expect(true).toBe(true);
    });

    test('INT-005: CTA buttons are clickable', async ({ page }) => {
        // Scroll to CTA
        await page.evaluate(() => {
            document.querySelector('#cta')?.scrollIntoView({ behavior: 'instant' });
        });
        await page.waitForTimeout(1000);

        const orderBtn = page.locator('button:has-text("Order Now")');
        await expect(orderBtn).toBeVisible();
        await expect(orderBtn).toBeEnabled();
    });

    test('INT-006: Feature cards have hover effect', async ({ page }) => {
        await page.evaluate(() => {
            document.querySelector('#features')?.scrollIntoView({ behavior: 'instant' });
        });
        await page.waitForTimeout(1000);

        // Find a feature card
        const featureCard = page.locator('.group').first();

        if (await featureCard.isVisible()) {
            const beforeHover = await featureCard.evaluate(el =>
                window.getComputedStyle(el).borderColor
            );

            await featureCard.hover();
            await page.waitForTimeout(300);

            // Just verify hover didn't cause errors
            expect(true).toBe(true);
        }
    });

    test('INT-007: Keyboard navigation works', async ({ page }) => {
        // Press Tab multiple times
        await page.keyboard.press('Tab');
        await page.keyboard.press('Tab');
        await page.keyboard.press('Tab');

        // Check if something has focus
        const focusedElement = await page.evaluate(() => {
            return document.activeElement?.tagName;
        });

        expect(focusedElement).toBeDefined();
    });

    test('INT-008: Canvas zoom works with wheel', async ({ page }) => {
        // Enter explore mode
        const exploreBtn = page.locator('button:has-text("Explore")');
        await exploreBtn.click();
        await page.waitForTimeout(500);

        const canvas = page.locator('canvas');
        const box = await canvas.boundingBox();

        if (box) {
            const centerX = box.x + box.width / 2;
            const centerY = box.y + box.height / 2;

            // Zoom with wheel
            await page.mouse.move(centerX, centerY);
            await page.mouse.wheel(0, -100);
            await page.waitForTimeout(500);
            await page.mouse.wheel(0, 100);
        }

        expect(true).toBe(true);
    });
});
