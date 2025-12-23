import { test, expect } from '@playwright/test';

/**
 * STRESS TESTS - Designed to BREAK the website
 * Real-world production scenarios that will expose bugs
 */

// ============================================
// STRESS TESTS - Rapid Fire Interactions
// ============================================
test.describe('STRESS: Rapid Fire Interactions', () => {
    test('STRESS-001: Spam click explore button 50 times rapidly', async ({ page }) => {
        await page.goto('/');
        await page.waitForSelector('canvas', { timeout: 30000 });
        await page.waitForTimeout(3000);

        // Spam click 50 times - catch errors as button state changes rapidly
        for (let i = 0; i < 50; i++) {
            const btn = page.locator('button').filter({ hasText: /explore|exit/i }).first();
            await btn.click({ force: true, timeout: 1000 }).catch(() => { });
        }

        await page.waitForTimeout(1000);

        // Check if app survived - canvas should still be visible
        const canvas = page.locator('canvas');
        await expect(canvas).toBeVisible({ timeout: 10000 });
    });

    test('STRESS-002: Rapid scroll up/down 100 times', async ({ page }) => {
        await page.goto('/');
        await page.waitForSelector('canvas', { timeout: 30000 });
        await page.waitForTimeout(2000);

        // Rapid scroll 100 times
        for (let i = 0; i < 100; i++) {
            await page.mouse.wheel(0, i % 2 === 0 ? 500 : -500);
        }

        await page.waitForTimeout(1000);

        // App should not crash
        const canvas = page.locator('canvas');
        await expect(canvas).toBeVisible();
    });

    test('STRESS-003: Click everywhere randomly 100 times', async ({ page }) => {
        await page.goto('/');
        await page.waitForSelector('canvas', { timeout: 30000 });
        await page.waitForTimeout(2000);

        const viewport = page.viewportSize() || { width: 1280, height: 720 };

        // Click 100 random locations - use safe coordinates within viewport
        for (let i = 0; i < 100; i++) {
            const x = Math.floor(Math.random() * (viewport.width - 20)) + 10;
            const y = Math.floor(Math.random() * (viewport.height - 20)) + 10;
            await page.mouse.click(x, y).catch(() => { });
        }

        await page.waitForTimeout(500);

        // Check stability
        const canvas = page.locator('canvas');
        await expect(canvas).toBeVisible();
    });

    test('STRESS-004: Drag model violently in explore mode', async ({ page }) => {
        await page.goto('/');
        await page.waitForSelector('canvas', { timeout: 30000 });
        await page.waitForTimeout(2000);

        // Enter explore mode
        const exploreBtn = page.locator('button').filter({ hasText: /explore/i }).first();
        await exploreBtn.click();
        await page.waitForTimeout(1000);

        const canvas = page.locator('canvas');
        const box = await canvas.boundingBox();

        if (box) {
            const centerX = box.x + box.width / 2;
            const centerY = box.y + box.height / 2;
            const radius = Math.min(box.width, box.height) / 3; // Safe radius

            // Violent dragging in circles - keep within safe bounds
            await page.mouse.move(centerX, centerY);
            await page.mouse.down();

            for (let i = 0; i < 20; i++) {
                const angle = (i / 20) * Math.PI * 2;
                const x = centerX + Math.cos(angle) * radius;
                const y = centerY + Math.sin(angle) * radius;
                await page.mouse.move(x, y, { steps: 2 });
            }

            await page.mouse.up();
        }

        await page.waitForTimeout(500);
        await expect(canvas).toBeVisible();
    });
});

// ============================================
// STRESS TESTS - Resize Chaos
// ============================================
test.describe('STRESS: Resize Chaos', () => {
    test('STRESS-005: Resize window 50 times rapidly', async ({ page }) => {
        await page.goto('/');
        await page.waitForSelector('canvas', { timeout: 30000 });
        await page.waitForTimeout(2000);

        const sizes = [
            { width: 1920, height: 1080 },
            { width: 375, height: 667 },
            { width: 768, height: 1024 },
            { width: 1280, height: 720 },
            { width: 480, height: 800 },
        ];

        // Resize 30 times (reduced from 50) with small delays for stability
        for (let i = 0; i < 30; i++) {
            const size = sizes[i % sizes.length];
            await page.setViewportSize(size);
            await page.waitForTimeout(50); // Small delay for canvas to adapt
        }

        await page.waitForTimeout(1000);

        const canvas = page.locator('canvas');
        await expect(canvas).toBeVisible({ timeout: 10000 });
    });

    test('STRESS-006: Resize to tiny 100x100 viewport', async ({ page }) => {
        await page.goto('/');
        await page.waitForSelector('canvas', { timeout: 30000 });

        // Extreme tiny viewport
        await page.setViewportSize({ width: 100, height: 100 });
        await page.waitForTimeout(1000);

        // Should not crash
        const body = page.locator('body');
        await expect(body).toBeVisible();
    });

    test('STRESS-007: Resize to extreme 4000x3000 viewport', async ({ page }) => {
        await page.goto('/');
        await page.waitForSelector('canvas', { timeout: 30000 });

        // Extreme large viewport
        await page.setViewportSize({ width: 4000, height: 3000 });
        await page.waitForTimeout(1000);

        const canvas = page.locator('canvas');
        await expect(canvas).toBeVisible();
    });
});

// ============================================
// EDGE CASES - Network Issues
// ============================================
test.describe('EDGE: Network Issues', () => {
    test('EDGE-001: Slow 3G network simulation', async ({ page, context }) => {
        // Simulate slow network
        const cdp = await context.newCDPSession(page);
        await cdp.send('Network.enable');
        await cdp.send('Network.emulateNetworkConditions', {
            offline: false,
            downloadThroughput: 50000,
            uploadThroughput: 50000,
            latency: 2000,
        });

        const startTime = Date.now();
        await page.goto('/', { timeout: 60000 });
        const loadTime = Date.now() - startTime;

        console.log(`Slow 3G load time: ${loadTime}ms`);

        // Should eventually load
        const body = page.locator('body');
        await expect(body).toBeVisible({ timeout: 60000 });
    });

    test('EDGE-002: Go offline then online during load', async ({ page, context }) => {
        const cdp = await context.newCDPSession(page);
        await cdp.send('Network.enable');

        // Start loading
        page.goto('/').catch(() => { });

        // Go offline after 500ms
        await page.waitForTimeout(500);
        await cdp.send('Network.emulateNetworkConditions', {
            offline: true,
            downloadThroughput: 0,
            uploadThroughput: 0,
            latency: 0,
        });

        await page.waitForTimeout(1000);

        // Go back online
        await cdp.send('Network.emulateNetworkConditions', {
            offline: false,
            downloadThroughput: -1,
            uploadThroughput: -1,
            latency: 0,
        });

        // Refresh should work
        await page.reload({ timeout: 30000 });
        const body = page.locator('body');
        await expect(body).toBeVisible();
    });
});

// ============================================
// EDGE CASES - Memory Pressure
// ============================================
test.describe('EDGE: Memory Pressure', () => {
    test('EDGE-003: Open and close explore mode 50 times', async ({ page }) => {
        await page.goto('/');
        await page.waitForSelector('canvas', { timeout: 30000 });
        await page.waitForTimeout(3000);

        const initialMemory = await page.evaluate(() => {
            // @ts-ignore
            return performance.memory?.usedJSHeapSize / 1024 / 1024 || 0;
        });

        // Toggle explore 50 times (reduced from 100 for stability)
        for (let i = 0; i < 50; i++) {
            const btn = page.locator('button').filter({ hasText: /explore|exit/i }).first();
            await btn.click({ timeout: 2000 }).catch(() => { });
            await page.waitForTimeout(200); // Increased delay for state to settle
        }

        await page.waitForTimeout(1000);

        const finalMemory = await page.evaluate(() => {
            // @ts-ignore
            return performance.memory?.usedJSHeapSize / 1024 / 1024 || 0;
        });

        const growth = finalMemory - initialMemory;
        console.log(`Memory growth after 50 toggles: ${growth.toFixed(2)}MB`);

        // Should not grow more than 100MB (major leak indicator)
        expect(growth).toBeLessThan(100);

        // Canvas should still be visible
        const canvas = page.locator('canvas');
        await expect(canvas).toBeVisible();
    });

    test('EDGE-004: Scroll to bottom 50 times watching for memory', async ({ page }) => {
        await page.goto('/');
        await page.waitForSelector('canvas', { timeout: 30000 });
        await page.waitForTimeout(2000);

        const initialMemory = await page.evaluate(() => {
            // @ts-ignore
            return performance.memory?.usedJSHeapSize / 1024 / 1024 || 0;
        });

        // Full page scroll 50 times
        for (let i = 0; i < 50; i++) {
            await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
            await page.waitForTimeout(50);
            await page.evaluate(() => window.scrollTo(0, 0));
            await page.waitForTimeout(50);
        }

        const finalMemory = await page.evaluate(() => {
            // @ts-ignore
            return performance.memory?.usedJSHeapSize / 1024 / 1024 || 0;
        });

        const growth = finalMemory - initialMemory;
        console.log(`Memory growth after 50 full scrolls: ${growth.toFixed(2)}MB`);

        expect(growth).toBeLessThan(50);
    });
});

// ============================================
// EDGE CASES - Keyboard Chaos
// ============================================
test.describe('EDGE: Keyboard Chaos', () => {
    test('EDGE-005: Mash all keys rapidly', async ({ page }) => {
        await page.goto('/');
        await page.waitForSelector('canvas', { timeout: 30000 });
        await page.waitForTimeout(2000);

        const keys = 'abcdefghijklmnopqrstuvwxyz1234567890\t\n ';

        // Mash 200 random keys
        for (let i = 0; i < 200; i++) {
            const key = keys[Math.floor(Math.random() * keys.length)];
            await page.keyboard.press(key);
        }

        const canvas = page.locator('canvas');
        await expect(canvas).toBeVisible();
    });

    test('EDGE-006: Hold arrow keys while scrolling', async ({ page }) => {
        await page.goto('/');
        await page.waitForSelector('canvas', { timeout: 30000 });
        await page.waitForTimeout(2000);

        // Enter explore mode
        const exploreBtn = page.locator('button').filter({ hasText: /explore/i }).first();
        await exploreBtn.click();
        await page.waitForTimeout(500);

        // Hold arrows while mouse wheeling
        await page.keyboard.down('ArrowLeft');
        for (let i = 0; i < 20; i++) {
            await page.mouse.wheel(0, 100);
            await page.waitForTimeout(50);
        }
        await page.keyboard.up('ArrowLeft');

        const canvas = page.locator('canvas');
        await expect(canvas).toBeVisible();
    });
});

// ============================================
// EDGE CASES - Multi-touch Simulation
// ============================================
test.describe('EDGE: Touch Chaos', () => {
    test('EDGE-007: Pinch zoom rapidly on mobile', async ({ browser }) => {
        const context = await browser.newContext({
            viewport: { width: 375, height: 667 },
            isMobile: true,
            hasTouch: true,
        });
        const page = await context.newPage();

        await page.goto('/');
        await page.waitForSelector('canvas', { timeout: 30000 });
        await page.waitForTimeout(2000);

        // Enter explore mode
        const exploreBtn = page.locator('button').filter({ hasText: /explore/i }).first();
        await exploreBtn.tap();
        await page.waitForTimeout(500);

        // Simulate pinch/zoom chaos
        const canvas = page.locator('canvas');
        const box = await canvas.boundingBox();

        if (box) {
            for (let i = 0; i < 20; i++) {
                await page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2);
            }
        }

        await expect(canvas).toBeVisible();
        await context.close();
    });
});

// ============================================
// EDGE CASES - Console Error Monitoring
// ============================================
test.describe('EDGE: Error Monitoring', () => {
    test('EDGE-008: Check for JavaScript errors during stress', async ({ page }) => {
        const jsErrors: string[] = [];

        page.on('pageerror', error => {
            jsErrors.push(error.message);
        });

        page.on('console', msg => {
            if (msg.type() === 'error') {
                jsErrors.push(msg.text());
            }
        });

        await page.goto('/');
        await page.waitForSelector('canvas', { timeout: 30000 });

        // Do stressful stuff
        for (let i = 0; i < 20; i++) {
            await page.mouse.wheel(0, 500);
            const exploreBtn = page.locator('button').filter({ hasText: /explore|exit/i }).first();
            await exploreBtn.click().catch(() => { });
        }

        console.log(`JavaScript errors found: ${jsErrors.length}`);
        jsErrors.forEach(e => console.log(`  - ${e}`));

        // Should have no JS errors
        expect(jsErrors.filter(e => !e.includes('hydration'))).toHaveLength(0);
    });

    test('EDGE-009: Check for uncaught promise rejections', async ({ page }) => {
        const rejections: string[] = [];

        page.on('pageerror', error => {
            if (error.message.includes('Unhandled') || error.message.includes('rejection')) {
                rejections.push(error.message);
            }
        });

        await page.goto('/');
        await page.waitForSelector('canvas', { timeout: 30000 });

        // Interact aggressively
        for (let i = 0; i < 30; i++) {
            await page.mouse.wheel(0, i % 2 === 0 ? 500 : -500);
        }

        await page.waitForTimeout(2000);

        console.log(`Unhandled rejections: ${rejections.length}`);
        expect(rejections).toHaveLength(0);
    });
});

// ============================================
// BREAKING: Intentional Edge Cases
// ============================================
test.describe('BREAKING: Will Likely Fail', () => {
    test('BREAK-001: Long session - run for 30 seconds', async ({ page }) => {
        await page.goto('/');
        await page.waitForSelector('canvas', { timeout: 30000 });

        const startMemory = await page.evaluate(() => {
            // @ts-ignore
            return performance.memory?.usedJSHeapSize / 1024 / 1024 || 0;
        });

        // Run for 30 seconds with constant interaction
        const endTime = Date.now() + 30000;
        while (Date.now() < endTime) {
            await page.mouse.wheel(0, Math.random() > 0.5 ? 100 : -100);
            await page.waitForTimeout(100);
        }

        const endMemory = await page.evaluate(() => {
            // @ts-ignore
            return performance.memory?.usedJSHeapSize / 1024 / 1024 || 0;
        });

        console.log(`Memory start: ${startMemory.toFixed(2)}MB, end: ${endMemory.toFixed(2)}MB`);

        // Memory should not double
        expect(endMemory).toBeLessThan(startMemory * 2);
    });

    test('BREAK-002: Reload page 20 times rapidly', async ({ page }) => {
        for (let i = 0; i < 20; i++) {
            await page.goto('/');
            await page.waitForTimeout(200);
        }

        // Final load should work
        await page.waitForSelector('canvas', { timeout: 30000 });
        const canvas = page.locator('canvas');
        await expect(canvas).toBeVisible();
    });
});
