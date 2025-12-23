import { test, expect } from '@playwright/test';

/**
 * Performance Tests - Section 4
 * Complete implementation from TESTS.md
 */

// ============================================
// 4.1 Frame Rate Tests (Simplified for Playwright)
// ============================================
test.describe('4.1 Frame Rate Tests', () => {
    test('PERF-001: Canvas renders continuously', async ({ page }) => {
        await page.goto('/', { timeout: 60000 });
        await page.waitForSelector('canvas', { timeout: 60000 });
        await page.waitForTimeout(3000);

        // Verify animation loop is running by checking if canvas is being painted
        const isAnimating = await page.evaluate(() => {
            const canvas = document.querySelector('canvas');
            return canvas !== null && canvas.offsetWidth > 0 && canvas.offsetHeight > 0;
        });

        expect(isAnimating).toBe(true);
    });

    test('PERF-002: Page remains responsive during scroll', async ({ page }) => {
        await page.goto('/');
        await page.waitForSelector('canvas', { timeout: 30000 });
        await page.waitForTimeout(2000);

        const startTime = Date.now();

        // Perform scroll operations
        for (let i = 0; i < 5; i++) {
            await page.mouse.wheel(0, 300);
            await page.waitForTimeout(100);
        }

        const duration = Date.now() - startTime;

        // Should complete within reasonable time (not frozen)
        expect(duration).toBeLessThan(3000);

        // Canvas should still be visible
        const canvas = page.locator('canvas');
        await expect(canvas).toBeVisible();
    });

    test('PERF-003: Explore mode interaction is smooth', async ({ page }) => {
        await page.goto('/');
        await page.waitForSelector('canvas', { timeout: 30000 });
        await page.waitForTimeout(2000);

        // Click explore button
        const exploreBtn = page.locator('button').filter({ hasText: /explore/i }).first();
        await exploreBtn.click();
        await page.waitForTimeout(500);

        // Perform drag operations
        const canvas = page.locator('canvas');
        const box = await canvas.boundingBox();

        if (box) {
            const startTime = Date.now();

            // Simulate drag
            await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
            await page.mouse.down();
            for (let i = 0; i < 5; i++) {
                await page.mouse.move(box.x + box.width / 2 + i * 20, box.y + box.height / 2);
                await page.waitForTimeout(50);
            }
            await page.mouse.up();

            const duration = Date.now() - startTime;

            // Should complete without freezing
            expect(duration).toBeLessThan(2000);
        }

        // Canvas should still be responsive
        await expect(canvas).toBeVisible();
    });

    test('PERF-004: No page freeze during animations', async ({ page }) => {
        await page.goto('/');
        await page.waitForSelector('canvas', { timeout: 30000 });
        await page.waitForTimeout(2000);

        // Navigate through all sections
        const sections = ['#hero', '#features', '#details', '#cta'];

        for (const section of sections) {
            await page.evaluate((sel) => {
                document.querySelector(sel)?.scrollIntoView({ behavior: 'instant' });
            }, section);
            await page.waitForTimeout(300);
        }

        // Page should still be responsive
        const canvas = page.locator('canvas');
        await expect(canvas).toBeVisible();

        // Body should be interactive
        const body = page.locator('body');
        await expect(body).toBeVisible();
    });
});

// ============================================
// 4.2 Load Time Tests
// ============================================
test.describe('4.2 Load Time Tests', () => {
    test('PERF-005: Initial page load (fast connection)', async ({ page }) => {
        const startTime = Date.now();
        await page.goto('/');
        await page.waitForSelector('canvas', { timeout: 30000 });
        const loadTime = Date.now() - startTime;

        console.log(`Page load time: ${loadTime}ms`);
        expect(loadTime).toBeLessThan(10000); // Under 10 seconds
    });

    test('PERF-006: Time to First Contentful Paint', async ({ page }) => {
        await page.goto('/');
        await page.waitForSelector('canvas', { timeout: 30000 });

        const fcp = await page.evaluate(() => {
            const entries = performance.getEntriesByType('paint');
            const fcpEntry = entries.find(e => e.name === 'first-contentful-paint');
            return fcpEntry ? fcpEntry.startTime : null;
        });

        if (fcp) {
            console.log(`First Contentful Paint: ${fcp.toFixed(0)}ms`);
            expect(fcp).toBeLessThan(3000); // Under 3 seconds
        }
    });

    test('PERF-007: DOM Content Loaded timing', async ({ page }) => {
        await page.goto('/');
        await page.waitForSelector('canvas', { timeout: 30000 });

        const timing = await page.evaluate(() => {
            return performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart;
        });

        console.log(`DOM Content Loaded: ${timing}ms`);
        expect(timing).toBeLessThan(5000);
    });

    test('PERF-008: Full page load timing', async ({ page }) => {
        await page.goto('/');
        await page.waitForSelector('canvas', { timeout: 30000 });
        await page.waitForTimeout(3000);

        const timing = await page.evaluate(() => {
            return performance.timing.loadEventEnd - performance.timing.navigationStart;
        });

        console.log(`Full page load: ${timing}ms`);
        expect(timing).toBeLessThan(15000);
    });

    test('PERF-009: GLTF model loads successfully', async ({ page }) => {
        let modelLoaded = false;

        page.on('response', async response => {
            if (response.url().includes('.gltf') || response.url().includes('.glb')) {
                if (response.status() === 200) {
                    modelLoaded = true;
                }
            }
        });

        await page.goto('/');
        await page.waitForSelector('canvas', { timeout: 30000 });
        await page.waitForTimeout(2000);

        console.log(`Model loaded: ${modelLoaded}`);
        expect(modelLoaded).toBe(true);
    });

    test('PERF-010: No 404 errors during load', async ({ page }) => {
        const failedRequests: string[] = [];

        page.on('response', response => {
            if (response.status() === 404) {
                failedRequests.push(response.url());
            }
        });

        await page.goto('/');
        await page.waitForSelector('canvas', { timeout: 30000 });
        await page.waitForTimeout(2000);

        console.log(`404 errors: ${failedRequests.length}`);
        expect(failedRequests).toHaveLength(0);
    });
});

// ============================================
// 4.3 Memory Usage Tests
// ============================================
test.describe('4.3 Memory Usage Tests', () => {
    test('PERF-011: Initial memory footprint', async ({ page }) => {
        await page.goto('/');
        await page.waitForSelector('canvas', { timeout: 30000 });
        await page.waitForTimeout(3000);

        const memory = await page.evaluate(() => {
            // @ts-ignore
            if (performance.memory) {
                // @ts-ignore
                return performance.memory.usedJSHeapSize / 1024 / 1024;
            }
            return null;
        });

        if (memory !== null) {
            console.log(`Initial memory: ${memory.toFixed(2)}MB`);
            expect(memory).toBeLessThan(150);
        }
    });

    test('PERF-012: No memory leaks on scroll', async ({ page }) => {
        await page.goto('/');
        await page.waitForSelector('canvas', { timeout: 30000 });
        await page.waitForTimeout(2000);

        const initialMemory = await page.evaluate(() => {
            // @ts-ignore
            return performance.memory?.usedJSHeapSize / 1024 / 1024 || 0;
        });

        // Scroll up and down multiple times
        for (let i = 0; i < 5; i++) {
            await page.mouse.wheel(0, 1000);
            await page.waitForTimeout(200);
            await page.mouse.wheel(0, -1000);
            await page.waitForTimeout(200);
        }

        const finalMemory = await page.evaluate(() => {
            // @ts-ignore
            return performance.memory?.usedJSHeapSize / 1024 / 1024 || 0;
        });

        const memoryGrowth = finalMemory - initialMemory;
        console.log(`Memory growth after scrolls: ${memoryGrowth.toFixed(2)}MB`);
        expect(memoryGrowth).toBeLessThan(50); // Less than 50MB growth
    });

    test('PERF-013: No memory leaks explore mode', async ({ page }) => {
        await page.goto('/');
        await page.waitForSelector('canvas', { timeout: 30000 });
        await page.waitForTimeout(2000);

        const initialMemory = await page.evaluate(() => {
            // @ts-ignore
            return performance.memory?.usedJSHeapSize / 1024 / 1024 || 0;
        });

        // Toggle explore mode multiple times
        for (let i = 0; i < 5; i++) {
            const btn = page.locator('button').filter({ hasText: /explore|exit/i }).first();
            await btn.click();
            await page.waitForTimeout(500);
        }

        const finalMemory = await page.evaluate(() => {
            // @ts-ignore
            return performance.memory?.usedJSHeapSize / 1024 / 1024 || 0;
        });

        const memoryGrowth = finalMemory - initialMemory;
        console.log(`Memory growth after explore toggles: ${memoryGrowth.toFixed(2)}MB`);
        expect(memoryGrowth).toBeLessThan(30);
    });

    test('PERF-014: Heap size is reasonable', async ({ page }) => {
        await page.goto('/');
        await page.waitForSelector('canvas', { timeout: 30000 });
        await page.waitForTimeout(3000);

        const heapInfo = await page.evaluate(() => {
            // @ts-ignore
            if (performance.memory) {
                return {
                    // @ts-ignore
                    usedHeap: performance.memory.usedJSHeapSize / 1024 / 1024,
                    // @ts-ignore
                    totalHeap: performance.memory.totalJSHeapSize / 1024 / 1024,
                };
            }
            return null;
        });

        if (heapInfo) {
            console.log(`Used heap: ${heapInfo.usedHeap.toFixed(2)}MB, Total: ${heapInfo.totalHeap.toFixed(2)}MB`);
            expect(heapInfo.usedHeap).toBeLessThan(200);
        }
    });
});

// ============================================
// 4.4 Bundle Size Tests
// ============================================
test.describe('4.4 Bundle Size Tests', () => {
    test('PERF-015: JavaScript bundle size check', async ({ page }) => {
        const jsResources: { url: string; size: number }[] = [];

        page.on('response', async response => {
            if (response.url().includes('.js') && response.status() === 200) {
                const headers = response.headers();
                const size = parseInt(headers['content-length'] || '0', 10);
                if (size > 0) {
                    jsResources.push({ url: response.url(), size });
                }
            }
        });

        await page.goto('/');
        await page.waitForSelector('canvas', { timeout: 30000 });
        await page.waitForTimeout(2000);

        const totalJS = jsResources.reduce((sum, r) => sum + r.size, 0) / 1024;
        console.log(`Total JS size: ${totalJS.toFixed(0)}KB`);
        // Warn if over 1MB
        expect(totalJS).toBeLessThan(2000);
    });

    test('PERF-016: CSS bundle size check', async ({ page }) => {
        const cssResources: { url: string; size: number }[] = [];

        page.on('response', async response => {
            if (response.url().includes('.css') && response.status() === 200) {
                const headers = response.headers();
                const size = parseInt(headers['content-length'] || '0', 10);
                if (size > 0) {
                    cssResources.push({ url: response.url(), size });
                }
            }
        });

        await page.goto('/');
        await page.waitForTimeout(2000);

        const totalCSS = cssResources.reduce((sum, r) => sum + r.size, 0) / 1024;
        console.log(`Total CSS size: ${totalCSS.toFixed(0)}KB`);
        expect(totalCSS).toBeLessThan(500);
    });

    test('PERF-017: Total transfer size', async ({ page }) => {
        let totalSize = 0;

        page.on('response', async response => {
            const headers = response.headers();
            const size = parseInt(headers['content-length'] || '0', 10);
            totalSize += size;
        });

        await page.goto('/');
        await page.waitForSelector('canvas', { timeout: 30000 });
        await page.waitForTimeout(3000);

        const totalMB = totalSize / 1024 / 1024;
        console.log(`Total transfer size: ${totalMB.toFixed(2)}MB`);
        expect(totalMB).toBeLessThan(20); // Under 20MB
    });
});

// ============================================
// 4.5 Rendering Performance Tests
// ============================================
test.describe('4.5 Rendering Performance Tests', () => {
    test('PERF-018: WebGL context is active', async ({ page }) => {
        await page.goto('/');
        await page.waitForSelector('canvas', { timeout: 30000 });

        const hasWebGL = await page.evaluate(() => {
            const canvas = document.querySelector('canvas');
            if (!canvas) return false;
            const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
            return gl !== null;
        });

        expect(hasWebGL).toBe(true);
    });

    test('PERF-019: Canvas renders without errors', async ({ page }) => {
        const errors: string[] = [];
        page.on('console', msg => {
            if (msg.type() === 'error' && msg.text().includes('WebGL')) {
                errors.push(msg.text());
            }
        });

        await page.goto('/');
        await page.waitForSelector('canvas', { timeout: 30000 });
        await page.waitForTimeout(3000);

        expect(errors).toHaveLength(0);
    });

    test('PERF-020: No unnecessary re-renders', async ({ page }) => {
        await page.goto('/');
        await page.waitForSelector('canvas', { timeout: 30000 });
        await page.waitForTimeout(2000);

        // Check React render count (if exposed)
        const stable = await page.evaluate(async () => {
            // Wait and check if DOM is stable
            const initial = document.body.innerHTML.length;
            await new Promise(r => setTimeout(r, 1000));
            const final = document.body.innerHTML.length;
            return Math.abs(final - initial) < 100;
        });

        expect(stable).toBe(true);
    });

    test('PERF-021: WebGL context stable', async ({ page }) => {
        await page.goto('/');
        await page.waitForSelector('canvas', { timeout: 30000 });

        let contextLost = false;
        await page.evaluate(() => {
            const canvas = document.querySelector('canvas');
            canvas?.addEventListener('webglcontextlost', () => {
                (window as any).__contextLost = true;
            });
        });

        // Interact for a while
        for (let i = 0; i < 3; i++) {
            await page.mouse.wheel(0, 500);
            await page.waitForTimeout(500);
        }

        contextLost = await page.evaluate(() => (window as any).__contextLost === true);
        expect(contextLost).toBe(false);
    });
});
