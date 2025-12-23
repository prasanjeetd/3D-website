# 3D Cleaver Website - Comprehensive Test Suite

## Table of Contents
1. [3D Rendering Tests](#1-3d-rendering-tests)
2. [Scroll Animation Tests](#2-scroll-animation-tests)
3. [User Interaction Tests](#3-user-interaction-tests)
4. [Performance Tests](#4-performance-tests)
5. [Responsive/Mobile Tests](#5-responsivemobile-tests)
6. [Accessibility Tests](#6-accessibility-tests)
7. [Browser Compatibility Tests](#7-browser-compatibility-tests)
8. [Error Handling Tests](#8-error-handling-tests)
9. [Loading & Asset Tests](#9-loading--asset-tests)
10. [Visual Regression Tests](#10-visual-regression-tests)
11. [**Stress & Chaos Tests (Break The App!)**](#11-stress--chaos-tests-break-the-app)

---

## 1. 3D Rendering Tests

### 1.1 Model Loading
| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|-----------------|--------|
| 3D-001 | GLTF model loads successfully | 1. Open website 2. Wait for loading | 3D cleaver model visible on screen | ⬜ |
| 3D-002 | Model textures load correctly | 1. Open website 2. Inspect model | Base color, normal map, metallic textures visible | ⬜ |
| 3D-003 | Model scale is correct | 1. Open website | Model fills ~40% of viewport height | ⬜ |
| 3D-004 | Model position is centered | 1. Open website | Model appears center-right of viewport | ⬜ |
| 3D-005 | Model has no visual artifacts | 1. Rotate model 360° | No z-fighting, no texture seams, no missing faces | ⬜ |

### 1.2 Lighting
| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|-----------------|--------|
| 3D-006 | Ambient light illuminates model | 1. View model in hero section | Model visible with soft ambient lighting | ⬜ |
| 3D-007 | Directional light creates highlights | 1. View model | Metallic blade shows specular highlights | ⬜ |
| 3D-008 | Shadows render correctly | 1. View model | Contact shadows visible below model | ⬜ |
| 3D-009 | Environment map reflections | 1. Enable explore mode 2. Rotate model | Blade shows environment reflections | ⬜ |

### 1.3 Camera
| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|-----------------|--------|
| 3D-010 | Camera FOV is 45° | 1. Inspect with dev tools | PerspectiveCamera FOV = 45 | ⬜ |
| 3D-011 | Camera near plane prevents clipping | 1. Zoom in explore mode | No near-plane clipping at close range | ⬜ |
| 3D-012 | Camera far plane renders background | 1. Zoom out | Background/fog visible, no cutoff | ⬜ |
| 3D-013 | Camera always looks at model | 1. Scroll through sections | Camera target follows model center | ⬜ |

---

## 2. Scroll Animation Tests

### 2.1 Section Transitions
| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|-----------------|--------|
| SCR-001 | Hero to Features transition | 1. Scroll from hero to features | Camera moves right, model rotates ~54° | ⬜ |
| SCR-002 | Features to Details transition | 1. Continue scrolling | Camera moves closer, model rotates more | ⬜ |
| SCR-003 | Details to CTA transition | 1. Scroll to CTA | Camera pulls back, model rotates to final position | ⬜ |
| SCR-004 | Reverse scroll works | 1. Scroll back up | Animations reverse smoothly | ⬜ |

### 2.2 Animation Smoothness
| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|-----------------|--------|
| SCR-005 | No flickering during scroll | 1. Scroll slowly | Model rotation smooth, no jumping | ⬜ |
| SCR-006 | No stuttering at 60fps | 1. Scroll while monitoring FPS | Maintains 60fps, no frame drops | ⬜ |
| SCR-007 | Fast scroll handles gracefully | 1. Scroll very fast | Animations catch up smoothly | ⬜ |
| SCR-008 | Lerp interpolation is smooth | 1. Stop scrolling mid-section | Model eases to final position | ⬜ |

### 2.3 Navigation Sync
| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|-----------------|--------|
| SCR-009 | Nav highlights current section | 1. Scroll through sections | Nav pill moves to current section | ⬜ |
| SCR-010 | Clicking nav scrolls to section | 1. Click "Features" in nav | Page scrolls to Features section | ⬜ |
| SCR-011 | Section boundaries detected | 1. Scroll to exact section boundaries | Nav updates at correct points | ⬜ |

---

## 3. User Interaction Tests

### 3.1 Explore Mode
| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|-----------------|--------|
| INT-001 | Explore button activates mode | 1. Click "Explore" button | Button changes to "Exit Explore", OrbitControls enabled | ⬜ |
| INT-002 | Horizontal 360° rotation | 1. Drag left/right | Model rotates full 360° horizontally | ⬜ |
| INT-003 | Vertical 360° rotation | 1. Drag up/down | Model rotates full 360° vertically | ⬜ |
| INT-004 | Zoom in with scroll wheel | 1. Scroll up in explore mode | Camera zooms in | ⬜ |
| INT-005 | Zoom out with scroll wheel | 1. Scroll down in explore mode | Camera zooms out | ⬜ |
| INT-006 | Min zoom distance respected | 1. Zoom in maximum | Camera stops at minDistance (0.3) | ⬜ |
| INT-007 | Max zoom distance respected | 1. Zoom out maximum | Camera stops at maxDistance (3) | ⬜ |
| INT-008 | Exit explore returns to scroll | 1. Click "Exit Explore" | OrbitControls disabled, scroll animations resume | ⬜ |
| INT-009 | Damping feels natural | 1. Spin model and release | Model decelerates smoothly | ⬜ |

### 3.2 Button Interactions
| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|-----------------|--------|
| INT-010 | Explore button hover state | 1. Hover over Explore | Visual feedback (color change) | ⬜ |
| INT-011 | CTA button hover state | 1. Hover over "Order Now" | Button highlights/glows | ⬜ |
| INT-012 | Feature cards hover effect | 1. Hover over feature cards | Border/background change | ⬜ |
| INT-013 | Keyboard navigation works | 1. Tab through page | Focus visible on interactive elements | ⬜ |

### 3.3 Touch Interactions (Mobile)
| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|-----------------|--------|
| INT-014 | Touch scroll works | 1. Swipe up/down on mobile | Page scrolls, animations trigger | ⬜ |
| INT-015 | Pinch zoom in explore mode | 1. Pinch in explore mode | Model zooms in/out | ⬜ |
| INT-016 | Single finger rotate | 1. Drag in explore mode | Model rotates | ⬜ |
| INT-017 | Touch button activation | 1. Tap buttons | Buttons respond to touch | ⬜ |

---

## 4. Performance Tests

### 4.1 Frame Rate
| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|-----------------|--------|
| PERF-001 | Idle FPS | 1. Open website, don't interact 2. Check FPS | Maintains 60fps | ⬜ |
| PERF-002 | Scroll FPS | 1. Scroll continuously 2. Check FPS | Maintains 55-60fps | ⬜ |
| PERF-003 | Explore mode FPS | 1. Rotate model rapidly 2. Check FPS | Maintains 55-60fps | ⬜ |
| PERF-004 | Low-end device FPS | 1. Throttle CPU 4x 2. Test scrolling | Minimum 30fps | ⬜ |

### 4.2 Load Time
| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|-----------------|--------|
| PERF-005 | Initial page load (fast 3G) | 1. Throttle to fast 3G 2. Measure load | < 5 seconds to interactive | ⬜ |
| PERF-006 | Initial page load (4G) | 1. Throttle to 4G 2. Measure load | < 3 seconds to interactive | ⬜ |
| PERF-007 | GLTF model load time | 1. Monitor network | Model loads < 2 seconds on 4G | ⬜ |
| PERF-008 | Texture load time | 1. Monitor network | Textures load < 1 second on 4G | ⬜ |
| PERF-009 | Time to First Contentful Paint | 1. Run Lighthouse | FCP < 1.5 seconds | ⬜ |
| PERF-010 | Largest Contentful Paint | 1. Run Lighthouse | LCP < 2.5 seconds | ⬜ |

### 4.3 Memory Usage
| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|-----------------|--------|
| PERF-011 | Initial memory footprint | 1. Open site 2. Check JS Heap | < 100MB initial | ⬜ |
| PERF-012 | No memory leaks on scroll | 1. Scroll up/down 50 times 2. Check memory | Memory stable, no growth | ⬜ |
| PERF-013 | No memory leaks explore mode | 1. Enter/exit explore 10 times | Memory stable | ⬜ |
| PERF-014 | GPU memory usage | 1. Check GPU memory | < 200MB VRAM | ⬜ |

### 4.4 Bundle Size
| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|-----------------|--------|
| PERF-015 | JavaScript bundle size | 1. Run `npm run build` 2. Check output | JS < 500KB gzipped | ⬜ |
| PERF-016 | CSS bundle size | 1. Check CSS output | CSS < 50KB gzipped | ⬜ |
| PERF-017 | Total transfer size | 1. Check network total | < 15MB total (including 3D assets) | ⬜ |

### 4.5 Rendering Performance
| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|-----------------|--------|
| PERF-018 | Draw calls count | 1. Check renderer.info | < 50 draw calls | ⬜ |
| PERF-019 | Triangle count | 1. Check renderer.info | < 100k triangles | ⬜ |
| PERF-020 | No unnecessary re-renders | 1. Profile React | Components don't re-render on scroll | ⬜ |
| PERF-021 | WebGL context stable | 1. Use for 10 min | No context loss | ⬜ |

---

## 5. Responsive/Mobile Tests

### 5.1 Viewport Sizes
| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|-----------------|--------|
| RES-001 | Mobile portrait (375x667) | 1. Resize viewport | Layout adapts, model visible | ⬜ |
| RES-002 | Mobile landscape (667x375) | 1. Rotate device | Layout adapts | ⬜ |
| RES-003 | Tablet portrait (768x1024) | 1. Test iPad size | Layout adapts | ⬜ |
| RES-004 | Tablet landscape (1024x768) | 1. Test landscape | Layout adapts | ⬜ |
| RES-005 | Desktop small (1280x720) | 1. Test HD | Layout optimal | ⬜ |
| RES-006 | Desktop large (1920x1080) | 1. Test Full HD | Layout optimal | ⬜ |
| RES-007 | 4K display (3840x2160) | 1. Test 4K | Layout scales, text sharp | ⬜ |

### 5.2 Content Adaptation
| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|-----------------|--------|
| RES-008 | Hero text readable on mobile | 1. View on mobile | Text size appropriate | ⬜ |
| RES-009 | Buttons tappable size | 1. Check button sizes | Min 44x44px touch target | ⬜ |
| RES-010 | Feature cards stack on mobile | 1. View Features on mobile | Cards stack vertically | ⬜ |
| RES-011 | Spec grid adapts | 1. View Details on mobile | Grid becomes 1 or 2 columns | ⬜ |
| RES-012 | Nav adapts on mobile | 1. View nav on mobile | Shows current section pills | ⬜ |

### 5.3 Canvas Responsiveness
| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|-----------------|--------|
| RES-013 | Canvas fills viewport | 1. Resize window | Canvas 100% width/height | ⬜ |
| RES-014 | Camera aspect updates | 1. Resize window | No model distortion | ⬜ |
| RES-015 | DPR adapts | 1. Test on Retina | Sharp rendering (DPR 2) | ⬜ |
| RES-016 | Resize during scroll | 1. Resize while scrolling | No crashes, smooth adaptation | ⬜ |

---

## 6. Accessibility Tests

### 6.1 Screen Reader
| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|-----------------|--------|
| A11Y-001 | Page title announced | 1. Use screen reader | "Cleaver Pro | Master Craftsmanship" | ⬜ |
| A11Y-002 | Headings hierarchy | 1. Check heading levels | Proper h1 > h2 hierarchy | ⬜ |
| A11Y-003 | Button labels readable | 1. Focus buttons with SR | "Enter explore mode", "Order Now $199" | ⬜ |
| A11Y-004 | Skip to content available | 1. Tab from page load | Skip link available | ⬜ |

### 6.2 Keyboard Navigation
| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|-----------------|--------|
| A11Y-005 | Tab order logical | 1. Tab through page | Focus moves top to bottom | ⬜ |
| A11Y-006 | Focus visible | 1. Tab to buttons | Clear focus ring visible | ⬜ |
| A11Y-007 | Escape exits explore mode | 1. Press Escape in explore | Exits explore mode | ⬜ |
| A11Y-008 | Enter activates buttons | 1. Focus button, press Enter | Button action triggered | ⬜ |

### 6.3 Reduced Motion
| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|-----------------|--------|
| A11Y-009 | prefers-reduced-motion respected | 1. Enable reduced motion in OS 2. Reload | Animations disabled/reduced | ⬜ |
| A11Y-010 | Scroll still works | 1. With reduced motion on | Page scrolls, content visible | ⬜ |

### 6.4 Color Contrast
| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|-----------------|--------|
| A11Y-011 | Body text contrast | 1. Check zinc-100 on zinc-950 | Ratio > 4.5:1 (AA) | ⬜ |
| A11Y-012 | Heading contrast | 1. Check white on zinc-950 | Ratio > 4.5:1 | ⬜ |
| A11Y-013 | Button contrast | 1. Check amber button text | Ratio > 4.5:1 | ⬜ |
| A11Y-014 | Link visibility | 1. Check link colors | Distinguishable from text | ⬜ |

---

## 7. Browser Compatibility Tests

### 7.1 Desktop Browsers
| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|-----------------|--------|
| COMPAT-001 | Chrome (latest) | 1. Open in Chrome | Fully functional | ⬜ |
| COMPAT-002 | Firefox (latest) | 1. Open in Firefox | Fully functional | ⬜ |
| COMPAT-003 | Safari (latest) | 1. Open in Safari | Fully functional | ⬜ |
| COMPAT-004 | Edge (latest) | 1. Open in Edge | Fully functional | ⬜ |
| COMPAT-005 | Chrome (1 year old) | 1. Test older Chrome | Core features work | ⬜ |

### 7.2 Mobile Browsers
| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|-----------------|--------|
| COMPAT-006 | Safari iOS | 1. Open on iPhone | Fully functional | ⬜ |
| COMPAT-007 | Chrome Android | 1. Open on Android | Fully functional | ⬜ |
| COMPAT-008 | Samsung Internet | 1. Open on Samsung | Fully functional | ⬜ |
| COMPAT-009 | Firefox Mobile | 1. Open on mobile Firefox | Fully functional | ⬜ |

### 7.3 WebGL Support
| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|-----------------|--------|
| COMPAT-010 | WebGL 2 support | 1. Check WebGL version | Uses WebGL 2 | ⬜ |
| COMPAT-011 | WebGL 1 fallback | 1. Disable WebGL 2 | Works with WebGL 1 | ⬜ |
| COMPAT-012 | No WebGL fallback | 1. Disable all WebGL | Shows fallback UI | ⬜ |
| COMPAT-013 | Low GPU warning | 1. Test on integrated GPU | Graceful degradation | ⬜ |

---

## 8. Error Handling Tests

### 8.1 Asset Loading Errors
| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|-----------------|--------|
| ERR-001 | GLTF 404 error | 1. Rename model file 2. Reload | Error boundary shows retry UI | ⬜ |
| ERR-002 | Texture 404 error | 1. Remove texture file | Model loads with fallback material | ⬜ |
| ERR-003 | Network timeout | 1. Throttle to offline 2. Reload | Error message shown | ⬜ |
| ERR-004 | Corrupted GLTF | 1. Corrupt the GLTF file | Error boundary triggered | ⬜ |

### 8.2 Runtime Errors
| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|-----------------|--------|
| ERR-005 | WebGL context lost | 1. Simulate context loss | Graceful handling, attempt recovery | ⬜ |
| ERR-006 | JavaScript exception | 1. Inject error | Error boundary catches, UI recovers | ⬜ |
| ERR-007 | Memory exhaustion | 1. Consume browser memory | Graceful degradation | ⬜ |

### 8.3 Edge Cases
| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|-----------------|--------|
| ERR-008 | Rapid explore toggle | 1. Click explore 10 times fast | No crashes, stable state | ⬜ |
| ERR-009 | Scroll during load | 1. Scroll while model loads | No errors | ⬜ |
| ERR-010 | Resize during animation | 1. Resize rapidly | No crashes | ⬜ |

---

## 9. Loading & Asset Tests

### 9.1 Loading Screen
| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|-----------------|--------|
| LOAD-001 | Loading screen appears | 1. Hard reload | Loading screen visible | ⬜ |
| LOAD-002 | Progress percentage updates | 1. Watch loading | Percentage increases to 100% | ⬜ |
| LOAD-003 | Loading screen dismisses | 1. Wait for load | Screen fades out when ready | ⬜ |
| LOAD-004 | Loading animation smooth | 1. Observe loader | Animation runs at 60fps | ⬜ |

### 9.2 Asset Optimization
| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|-----------------|--------|
| LOAD-005 | GLTF is optimized | 1. Check file size | < 5MB | ⬜ |
| LOAD-006 | Textures compressed | 1. Check texture sizes | < 2MB each | ⬜ |
| LOAD-007 | DRACO compression | 1. Check network | Uses DRACO if available | ⬜ |
| LOAD-008 | Lazy loading works | 1. Check network waterfall | 3D assets load after HTML | ⬜ |

### 9.3 Caching
| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|-----------------|--------|
| LOAD-009 | Assets cached | 1. Reload page 2. Check network | Assets served from cache | ⬜ |
| LOAD-010 | Cache invalidation | 1. Change file 2. Reload | New file loaded | ⬜ |

---

## 10. Visual Regression Tests

### 10.1 Component Screenshots
| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|-----------------|--------|
| VIS-001 | Hero section snapshot | 1. Capture hero | Matches baseline | ⬜ |
| VIS-002 | Features section snapshot | 1. Capture features | Matches baseline | ⬜ |
| VIS-003 | Details section snapshot | 1. Capture details | Matches baseline | ⬜ |
| VIS-004 | CTA section snapshot | 1. Capture CTA | Matches baseline | ⬜ |
| VIS-005 | Nav bar snapshot | 1. Capture nav | Matches baseline | ⬜ |
| VIS-006 | Loading screen snapshot | 1. Capture loading | Matches baseline | ⬜ |

### 10.2 3D Model Snapshots
| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|-----------------|--------|
| VIS-007 | Model hero position | 1. Snapshot 3D in hero | Matches baseline | ⬜ |
| VIS-008 | Model explore view | 1. Snapshot in explore | Matches baseline | ⬜ |
| VIS-009 | Model with shadows | 1. Snapshot shadows | Matches baseline | ⬜ |

### 10.3 Dark Mode
| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|-----------------|--------|
| VIS-010 | Dark theme colors | 1. Verify background | zinc-950 (#09090b) | ⬜ |
| VIS-011 | Gradient text | 1. Verify gradient | amber-500 to orange-500 | ⬜ |
| VIS-012 | Glassmorphism effect | 1. Check feature cards | Blur + transparency visible | ⬜ |

---

## Test Execution Commands

### Using Cypress (recommended for E2E)
```bash
npm install -D cypress @testing-library/cypress
npx cypress open
```

### Using Playwright (alternative)
```bash
npm install -D @playwright/test
npx playwright test
```

### Performance Testing with Lighthouse
```bash
npm install -g lighthouse
lighthouse http://localhost:3000 --output html --output-path ./lighthouse-report.html
```

### Visual Regression with Percy
```bash
npm install -D @percy/cli @percy/cypress
percy exec -- cypress run
```

---

## Test Result Summary

| Category | Total | Passed | Failed | Skipped |
|----------|-------|--------|--------|---------|
| 3D Rendering | 13 | 0 | 0 | 13 |
| Scroll Animation | 11 | 0 | 0 | 11 |
| User Interaction | 17 | 0 | 0 | 17 |
| Performance | 21 | 0 | 0 | 21 |
| Responsive | 16 | 0 | 0 | 16 |
| Accessibility | 14 | 0 | 0 | 14 |
| Browser Compat | 13 | 0 | 0 | 13 |
| Error Handling | 10 | 0 | 0 | 10 |
| Loading | 10 | 0 | 0 | 10 |
| Visual Regression | 12 | 0 | 0 | 12 |
| **TOTAL** | **137** | **0** | **0** | **137** |

---

## Notes

- Mark tests with ✅ (passed), ❌ (failed), or ⬜ (not tested)
- Document any bugs found with screenshots
- Run full suite before each release
- Priority order: Performance > Scroll > User Interaction > Responsive > Others

---

## 11. Stress & Chaos Tests (Break The App!)

> ⚠️ **WARNING**: These tests are designed to BREAK things! They simulate real-world abuse patterns.

### 11.1 Rapid Fire Interactions
| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|-----------------|--------|
| STRESS-001 | Spam click explore button 50 times | 1. Click explore 50x rapidly | No crash, button still functional | ⬜ |
| STRESS-002 | Rapid scroll up/down 100 times | 1. Scroll 100x in 5 seconds | No freeze, animations stable | ⬜ |
| STRESS-003 | Random click 100 locations | 1. Click randomly across page | No JS errors, stable | ⬜ |
| STRESS-004 | Violent model drag in circles | 1. Explore mode 2. Drag violently | No crash, smooth recovery | ⬜ |

### 11.2 Resize Chaos
| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|-----------------|--------|
| STRESS-005 | Resize window 50 times rapidly | 1. Switch between 5 sizes 50x | Canvas adapts, no crash | ⬜ |
| STRESS-006 | Extreme tiny viewport 100x100 | 1. Resize to 100x100px | Should render, not crash | ⬜ |
| STRESS-007 | Extreme large viewport 4000x3000 | 1. Resize to 4000x3000 | Should scale, not freeze | ⬜ |

### 11.3 Network Chaos
| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|-----------------|--------|
| EDGE-001 | Slow 3G network (2s latency) | 1. Throttle to slow 3G 2. Load page | Eventually loads, no timeout | ⬜ |
| EDGE-002 | Go offline during load | 1. Start load 2. Go offline 3. Go online | Recovers on reload | ⬜ |

### 11.4 Memory Pressure
| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|-----------------|--------|
| EDGE-003 | Toggle explore mode 100 times | 1. Click explore/exit 100x | Memory < 100MB growth | ⬜ |
| EDGE-004 | Full scroll 50 times | 1. Scroll top/bottom 50x | Memory < 50MB growth | ⬜ |

### 11.5 Keyboard Chaos
| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|-----------------|--------|
| EDGE-005 | Mash 200 random keys | 1. Press 200 random keys | No crash, no unexpected behavior | ⬜ |
| EDGE-006 | Hold arrows + scroll simultaneously | 1. Hold arrow 2. Scroll wheel | No freeze or conflict | ⬜ |

### 11.6 Touch Chaos (Mobile)
| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|-----------------|--------|
| EDGE-007 | Rapid taps on canvas (20x) | 1. Mobile explore mode 2. Tap 20x rapidly | No crash, stable | ⬜ |

### 11.7 Error Monitoring Under Stress
| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|-----------------|--------|
| EDGE-008 | Check JS errors during stress | 1. Stress test 2. Monitor console | Zero JS errors | ⬜ |
| EDGE-009 | Check for promise rejections | 1. Aggressive interaction 2. Monitor | Zero unhandled rejections | ⬜ |

### 11.8 Endurance Tests
| Test ID | Test Case | Steps | Expected Result | Status |
|---------|-----------|-------|-----------------|--------|
| BREAK-001 | 30-second continuous interaction | 1. Interact for 30 seconds | Memory doesn't double | ⬜ |
| BREAK-002 | Reload page 20 times rapidly | 1. Refresh 20x in 10 seconds | Final load works | ⬜ |

---

## Test Result Summary

| Category | Total | Passed | Failed | Skipped |
|----------|-------|--------|--------|---------|
| 3D Rendering | 13 | 0 | 0 | 13 |
| Scroll Animation | 11 | 0 | 0 | 11 |
| User Interaction | 17 | 0 | 0 | 17 |
| Performance | 21 | 0 | 0 | 21 |
| Responsive | 16 | 0 | 0 | 16 |
| Accessibility | 14 | 0 | 0 | 14 |
| Browser Compat | 13 | 0 | 0 | 13 |
| Error Handling | 10 | 0 | 0 | 10 |
| Loading | 10 | 0 | 0 | 10 |
| Visual Regression | 12 | 0 | 0 | 12 |
| **Stress & Chaos** | **18** | **0** | **0** | **18** |
| **TOTAL** | **155** | **0** | **0** | **155** |

