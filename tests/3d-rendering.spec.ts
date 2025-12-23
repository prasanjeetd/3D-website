import { test, expect } from '@playwright/test';

test.describe('3D Rendering Tests', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        // Wait for 3D canvas to be ready
        await page.waitForSelector('canvas', { timeout: 30000 });
        // Wait for loading to complete
        await page.waitForTimeout(3000);
    });

    test('3D-001: Canvas element renders', async ({ page }) => {
        const canvas = page.locator('canvas');
        await expect(canvas).toBeVisible();
    });

    test('3D-002: Canvas has correct dimensions', async ({ page }) => {
        const canvas = page.locator('canvas');
        const box = await canvas.boundingBox();
        expect(box).not.toBeNull();
        expect(box!.width).toBeGreaterThan(0);
        expect(box!.height).toBeGreaterThan(0);
    });

    test('3D-003: WebGL context is active', async ({ page }) => {
        const hasWebGL = await page.evaluate(() => {
            const canvas = document.querySelector('canvas');
            if (!canvas) return false;
            const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
            return gl !== null;
        });
        expect(hasWebGL).toBe(true);
    });

    test('3D-004: No WebGL errors in console', async ({ page }) => {
        const errors: string[] = [];
        page.on('console', msg => {
            if (msg.type() === 'error' && msg.text().includes('WebGL')) {
                errors.push(msg.text());
            }
        });

        await page.goto('/');
        await page.waitForTimeout(3000);

        expect(errors).toHaveLength(0);
    });

    test('3D-005: Model assets load without 404', async ({ page }) => {
        const failedRequests: string[] = [];

        page.on('response', response => {
            if (response.status() === 404 &&
                (response.url().includes('.gltf') ||
                    response.url().includes('.bin') ||
                    response.url().includes('textures'))) {
                failedRequests.push(response.url());
            }
        });

        await page.goto('/');
        await page.waitForTimeout(5000);

        expect(failedRequests).toHaveLength(0);
    });
});
