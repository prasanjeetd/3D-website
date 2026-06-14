# Cleaver-3D — Performance Optimization Plan

Optimizing this Next.js 16 + React Three Fiber product site for **low-bandwidth mobile**,
hosted on **Netlify**. The site is well-engineered already (scroll story, WebGL guard,
mobile camera, loading screen) but ships the **raw, uncompressed 3D model** — that single
issue is ~90% of the load problem.

---

## Audit — current state

**Stack:** Next.js 16 (app router, React Compiler), R3F 9, drei 10, GSAP, Lenis.
**Model:** `/public/models/cleaver/scene.gltf` (+ `.bin` + 3 PNG textures), loaded via
`useGLTF`, dynamically imported (`ssr: false`), wrapped in `<Suspense>` with a real
progress loader. Good structure.

**Asset weight (the problem):**

| File | Size |
|------|------|
| `M_Cleaver_normal.png` | 5.11 MB |
| `M_Cleaver_baseColor.png` | 3.32 MB |
| `M_Cleaver_metallicRoughness.png` | 2.84 MB |
| `scene.bin` (geometry) | 0.05 MB |
| **Total model payload** | **~11.3 MB** |

On a ~1 Mbps mobile link that's **~90 seconds** to first interactive 3D.

---

## Problems found (ranked by mobile / low-bandwidth impact)

| # | Problem | Current | Impact |
|---|---------|---------|--------|
| 1 | Raw PNG textures, uncompressed | 11.3 MB | 🔴🔴🔴 the killer |
| 2 | `Environment preset="studio"` fetches HDRI from a remote CDN | extra blocking round-trip | 🔴 |
| 3 | No DPR / quality tiering on mobile | `dpr={[1,2]}` fixed | 🔴 mobile GPU |
| 4 | Dynamic shadows + ContactShadows always on | 1024 shadow map every frame | 🟡 GPU/frame |
| 5 | `frameloop` always-on (default) | renders 60fps even idle | 🟡 battery/heat |
| 6 | No Netlify config for caching / headers | none | 🟡 free wins missed |
| 7 | No low-end GPU → poster fallback | only WebGL-absent fallback exists | 🟡 reliability |

---

## Phased plan (impact-per-effort order)

### ▶ Phase 1 — Asset compression (ACTIVE — the 90% win)
- Compress the model with `gltf-transform optimize`: **WebP** textures + **meshopt**
  geometry. **Visuals kept identical** — geometry decimation (`simplify`) is **disabled**,
  WebP at high quality.
- Output a single optimized `.glb`; point `MODEL_CONFIG.path` at it.
- **Expected: 11.3 MB → ~0.7 MB (~94% smaller). ~90s → ~10s on 1 Mbps.**
- Measure before/after, then decide on the rest.

### Phase 2 — Local HDRI (lossless)
- `npm i @pmndrs/assets`, bundle `studio.exr` locally, swap `Environment preset` → `files`.
- Removes a blocking CDN round-trip on every load. No visual change.

### Phase 3 — Mobile quality tiering (visual change only on low-end)
- `useDetectGPU` → tier-based DPR (`[1,1.5]` mobile vs `[1,2]` desktop).
- Disable dynamic shadows on mobile / low tier (keep ContactShadows).

### Phase 4 — Frameloop demand
- `frameloop="demand"` + `invalidate()` on scroll/animation ticks.
- Stops wasted frames while the user reads. Battery/heat win on mobile.

### Phase 5 — Netlify hosting config
- `netlify.toml` + `@netlify/plugin-nextjs`: immutable cache headers for `/models/*` and
  `/_next/static/*`; Brotli is automatic. Near-instant repeat visits.

### Phase 6 — Low-end poster fallback
- Extend `WebGLGuard` / add a `useDetectGPU` tier-0–1 check → serve a static hero poster
  instead of live 3D. A poster beats a crash on the weakest phones.

---

## Decisions locked in
- **Scope now:** Phase 1 only. Measure, then choose what's next.
- **Tradeoff:** keep visuals identical — only lossless / safe wins (compression, local
  HDRI, caching). No visible quality change on any device.
- **Texture format:** WebP, not KTX2. For a bandwidth-limited page WebP is a *smaller*
  download; KTX2 is larger on the wire (it only wins on VRAM, i.e. crash prevention).

---

## Measurement method
- Build: `npm run build`; inspect the model request size in DevTools → Network.
- Compare total transfer + time-to-interactive before/after, throttled to Slow 4G / 1 Mbps.
- Confirm the cleaver looks pixel-identical (WebP + no simplify = no visible change).

---

_Status: Phase 1 in progress. Working on branch off `master`._
