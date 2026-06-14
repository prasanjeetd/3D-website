'use client';

import { useState, useRef, useCallback, useEffect, useLayoutEffect } from 'react';
import dynamic from 'next/dynamic';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { WebGLGuard } from '@/components/WebGLGuard';
import { UIOverlay } from '@/components/UIOverlay';
import { FullScreenLoader } from '@/components/Loader';
import { useScrollStory } from '@/components/ScrollStory';
import { SectionId } from '@/lib/sceneConfig';

// Dynamic import for Canvas to avoid SSR issues.
// No `loading` here — a single page-level FullScreenLoader (driven by `sceneReady`)
// covers BOTH the JS chunk load AND the model/shader load, so there's one continuous
// loader and no blank gap before the cleaver appears.
const SceneCanvas = dynamic(
  () => import('@/components/SceneCanvas').then(mod => mod.SceneCanvas),
  {
    ssr: false,
    loading: () => null
  }
);

// Hook to detect mobile
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  return isMobile;
}

export default function Home() {
  const containerRef = useRef<HTMLElement>(null);
  const scrollStoryRef = useRef<ReturnType<typeof useScrollStory> | null>(null);

  const [currentSection, setCurrentSection] = useState<SectionId>('hero');
  const [exploreMode, setExploreMode] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
  const [hoveredHotspot, setHoveredHotspot] = useState<string | null>(null);
  const [sceneReady, setSceneReady] = useState(false);

  const isMobile = useIsMobile();

  const handleSectionChange = useCallback((section: SectionId) => {
    setCurrentSection(section);
  }, []);

  const handleExploreToggle = useCallback(() => {
    setExploreMode(prev => !prev);
  }, []);

  const handleHotspotHover = useCallback((id: string | null) => {
    setHoveredHotspot(id);
  }, []);

  const handleHotspotClick = useCallback((id: string) => {
    setActiveHotspot(id);
    setIsFocused(true);
    scrollStoryRef.current?.focusOnHotspot();
  }, []);

  const handleExitFocus = useCallback(() => {
    setIsFocused(false);
    setActiveHotspot(null);
    scrollStoryRef.current?.exitFocus();
  }, []);

  return (
    <ErrorBoundary>
      <WebGLGuard>
        {/* One continuous loader: stays until the cleaver has actually painted on screen
            (sceneReady fires from inside the Canvas after the model + shaders are ready).
            Covers chunk load AND asset load → no double loader, no blank gap. */}
        {!sceneReady && <FullScreenLoader />}
        <main ref={containerRef} className="relative bg-zinc-950 min-h-screen">
          {/* UI Overlay - always on top */}
          <UIOverlay
            currentSection={currentSection}
            exploreMode={exploreMode}
            onExploreToggle={handleExploreToggle}
            isFocused={isFocused}
            onExitFocus={handleExitFocus}
            hoveredHotspot={hoveredHotspot}
          />

          {/* ===== CANVAS (fixed background) =====
              Mobile: occupies the TOP ~55vh so the cleaver sits up top; the hero text below
              has matching top padding → no overlap on the first screen. On scroll the content
              slides up over this fixed canvas (z-10 over z-0) and overlaps the rotating cleaver.
              Desktop: full-screen background behind the left content column.
              pointer-events only in explore mode so normal touch-scroll passes through. */}
          <div
            className={`fixed left-0 right-0 z-0 ${exploreMode ? 'pointer-events-auto' : 'pointer-events-none'} ${isMobile ? 'top-0' : 'inset-0 h-screen'}`}
            style={isMobile ? { height: '55vh' } : { height: '100vh' }}
          >
            <SceneCanvas
              exploreMode={exploreMode}
              onHotspotHover={handleHotspotHover}
              onHotspotClick={handleHotspotClick}
              onSectionChange={handleSectionChange}
              activeHotspot={activeHotspot}
              isFocused={isFocused}
              containerRef={containerRef as React.RefObject<HTMLElement>}
              scrollStoryRef={scrollStoryRef}
              isMobile={isMobile}
              onReady={() => setSceneReady(true)}
            />
          </div>

          {/* ===== SCROLLING CONTENT ===== */}
          <div className="relative z-10 md:z-10 w-full md:grid md:grid-cols-2">

            {/* Content Column (Left on Desktop, Full on Mobile) */}
            <div className="flex flex-col">

              {/* === HERO SECTION ===
                  Mobile: pt-[55vh] pushes the text below the fixed 55vh cleaver canvas →
                  no overlap on first screen. Desktop: vertically centered as before. */}
              <section id="hero" className="min-h-screen flex flex-col justify-start md:justify-center px-6 md:px-12 lg:px-16 pt-[55vh] md:pt-0">

                {/* Badge */}
                <span className="inline-block px-4 py-2 rounded-full bg-amber-500/10 text-amber-400 text-sm font-medium mb-4 border border-amber-500/20 animate-fade-in self-start relative">
                  Master Craftsmanship
                </span>

                {/* Hero Content */}
                <div className="max-w-xl">
                  <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-[0.9] tracking-tight">
                    <span className="block">PRECISION</span>
                    <span className="block gradient-text">CRAFTED</span>
                  </h1>
                  <p className="text-base md:text-lg text-zinc-400 mb-8 max-w-lg leading-relaxed">
                    The ultimate professional cleaver, forged from premium carbon steel
                    with an ergonomic hardwood handle for unmatched control.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <a
                      href="#features"
                      className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold rounded-xl hover:from-amber-400 hover:to-orange-500 transition-all duration-300 text-center shadow-lg shadow-amber-500/20"
                    >
                      Explore Features
                    </a>
                    <a
                      href="#cta"
                      className="px-8 py-4 border border-zinc-600 text-white font-semibold rounded-xl hover:bg-zinc-800/50 transition-all duration-300 text-center backdrop-blur-sm"
                    >
                      Get Yours
                    </a>
                  </div>
                </div>
              </section>

              {/* === FEATURES SECTION === */}
              <section id="features" className="min-h-screen flex items-center px-6 md:px-12 lg:px-16 py-20 bg-zinc-900/30">
                <div className="max-w-xl">
                  <span className="inline-block px-3 py-1 rounded-full bg-zinc-800/80 text-zinc-400 text-xs font-medium mb-4 border border-zinc-700/50">
                    FEATURES
                  </span>
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-10 leading-tight">
                    Exceptional <span className="gradient-text">Features</span>
                  </h2>

                  <div className="space-y-6">
                    {[
                      {
                        icon: '⚔️',
                        title: 'Razor Sharp Edge',
                        desc: 'Hand-sharpened blade with precision 15° cutting angle for effortless slicing and dicing.',
                      },
                      {
                        icon: '⚖️',
                        title: 'Perfect Balance',
                        desc: 'Expertly weighted for optimal control, reducing fatigue during extended prep sessions.',
                      },
                      {
                        icon: '🛡️',
                        title: 'Built to Last',
                        desc: 'High-carbon steel construction with brass rivets ensures generations of reliable use.',
                      },
                    ].map((feature, i) => (
                      <div
                        key={i}
                        className="group p-6 rounded-2xl bg-zinc-800/40 backdrop-blur-md border border-zinc-700/40 hover:bg-zinc-800/60 hover:border-amber-500/30 transition-all duration-300"
                      >
                        <div className="flex items-start gap-4">
                          <div className="text-3xl">{feature.icon}</div>
                          <div>
                            <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-amber-400 transition-colors">
                              {feature.title}
                            </h3>
                            <p className="text-zinc-400 text-sm leading-relaxed">
                              {feature.desc}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* === DETAILS SECTION === */}
              <section id="details" className="min-h-screen flex items-center px-6 md:px-12 lg:px-16 py-20">
                <div className="max-w-xl">
                  <span className="inline-block px-3 py-1 rounded-full bg-zinc-800/80 text-zinc-400 text-xs font-medium mb-4 border border-zinc-700/50">
                    SPECIFICATIONS
                  </span>
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-8 leading-tight">
                    Technical <span className="gradient-text">Details</span>
                  </h2>
                  <p className="text-zinc-400 mb-10 leading-relaxed">
                    Every aspect of our cleaver is meticulously crafted using traditional
                    techniques combined with modern precision engineering.
                  </p>

                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: 'Blade Material', value: 'High Carbon Steel' },
                      { label: 'Handle', value: 'Pakkawood' },
                      { label: 'Total Length', value: '12 inches' },
                      { label: 'Blade Length', value: '7 inches' },
                      { label: 'Weight', value: '1.2 lbs' },
                      { label: 'Edge Angle', value: '15° per side' },
                      { label: 'Hardness', value: '58-60 HRC' },
                      { label: 'Origin', value: 'Handcrafted' },
                    ].map((spec, i) => (
                      <div
                        key={i}
                        className="p-4 rounded-xl bg-zinc-800/40 backdrop-blur-md border border-zinc-700/40"
                      >
                        <p className="text-zinc-500 text-xs uppercase tracking-wider mb-1">
                          {spec.label}
                        </p>
                        <p className="text-white font-medium">
                          {spec.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* === CTA SECTION === */}
              <section id="cta" className="min-h-screen flex items-center justify-center px-6 py-20 bg-gradient-to-b from-zinc-900/50 to-zinc-950">
                <div className="max-w-2xl text-center">
                  <span className="inline-block px-4 py-2 rounded-full bg-amber-500/10 text-amber-400 text-sm font-medium mb-6 border border-amber-500/20">
                    Limited Edition
                  </span>
                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                    Ready to Elevate<br />
                    <span className="gradient-text">Your Kitchen?</span>
                  </h2>
                  <p className="text-lg md:text-xl text-zinc-400 mb-10 max-w-lg mx-auto">
                    Join thousands of professional chefs and home cooks who trust our craftsmanship.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                    <button className="px-10 py-5 bg-gradient-to-r from-amber-500 to-orange-600 text-white text-lg font-bold rounded-xl hover:from-amber-400 hover:to-orange-500 transition-all duration-300 shadow-2xl shadow-amber-500/30 hover:shadow-amber-500/50 hover:scale-105">
                      Order Now — $199
                    </button>
                  </div>

                  <div className="flex items-center justify-center gap-6 text-sm text-zinc-500 flex-wrap">
                    <span className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Free Shipping
                    </span>
                    <span className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Lifetime Warranty
                    </span>
                    <span className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      30-Day Returns
                    </span>
                  </div>
                </div>
              </section>
            </div>

            {/* Desktop Right Column Spacer (Empty) */}
            <div className="hidden md:block" />

          </div>
        </main>
      </WebGLGuard>
    </ErrorBoundary>
  );
}
