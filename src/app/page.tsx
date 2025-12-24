'use client';

import { useState, useRef, useCallback, useEffect, useLayoutEffect, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { WebGLGuard } from '@/components/WebGLGuard';
import { UIOverlay } from '@/components/UIOverlay';
import { FullScreenLoader } from '@/components/Loader';
import { useScrollStory } from '@/components/ScrollStory';
import { SectionId } from '@/lib/sceneConfig';

// Dynamic import for Canvas to avoid SSR issues
const SceneCanvas = dynamic(
  () => import('@/components/SceneCanvas').then(mod => mod.SceneCanvas),
  {
    ssr: false,
    loading: () => <FullScreenLoader />
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
  const headerRef = useRef<HTMLDivElement>(null); // Ref for direct DOM manipulation
  const scrollStoryRef = useRef<ReturnType<typeof useScrollStory> | null>(null);

  const [currentSection, setCurrentSection] = useState<SectionId>('hero');
  const [exploreMode, setExploreMode] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
  const [hoveredHotspot, setHoveredHotspot] = useState<string | null>(null);

  const isMobile = useIsMobile();

  // Mobile Header Config
  const maxMobileHeight = 350;
  const minMobileHeight = 120;

  // Optimized Scroll Handler for Mobile Header Resize
  // Uses direct DOM manipulation to avoid React re-renders (smoothness fix)
  useEffect(() => {
    if (!isMobile || !headerRef.current) return;

    let ticking = false;

    const updateHeight = () => {
      if (!headerRef.current) return;
      const scrollY = window.scrollY;
      const newHeight = Math.max(minMobileHeight, maxMobileHeight - (scrollY * 0.8));
      headerRef.current.style.height = `${newHeight}px`;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateHeight);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    // Initial call to set correct height on load
    updateHeight();

    return () => window.removeEventListener('scroll', onScroll);
  }, [isMobile]);

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

          {/* ===== CANVAS CONTAINER (FIXED HEADER) ===== */}
          <div
            ref={headerRef} // Attached ref for logic
            className={`fixed left-0 right-0 pointer-events-auto transition-colors duration-300 ease-out
              ${isMobile ? 'top-0 z-50 bg-zinc-950 shadow-2xl shadow-black/50 overflow-hidden flex flex-col items-center pt-4' : 'inset-0 h-screen z-0'}
            `}
            style={isMobile ? { height: maxMobileHeight } : { height: '100vh' }}
          >
            {/* Mobile Badge - Inside Header to maintain "Badge -> Object" order */}
            {isMobile && (
              <span className="shrink-0 inline-block px-4 py-2 rounded-full bg-amber-500/10 text-amber-400 text-sm font-medium mb-2 border border-amber-500/20 animate-fade-in relative z-50">
                Master Craftsmanship
              </span>
            )}

            <div className={`relative w-full ${isMobile ? 'flex-1 min-h-0' : 'h-full'}`}>
              <Suspense fallback={<FullScreenLoader />}>
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
                />
              </Suspense>
            </div>

            {/* Mobile Gradient Fade at bottom */}
            {isMobile && (
              <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-zinc-950 to-transparent pointer-events-none" />
            )}
          </div>

          {/* ===== MOBILE SPACER ===== */}
          {/* Pushes content down so it starts below the large header initially */}
          {isMobile && <div style={{ height: maxMobileHeight }} />}

          {/* ===== SCROLLING CONTENT ===== */}
          <div className="relative z-10 md:z-10 w-full md:grid md:grid-cols-2">

            {/* Content Column (Left on Desktop, Full on Mobile) */}
            <div className="flex flex-col">

              {/* === HERO SECTION === */}
              <section id="hero" className="min-h-screen flex flex-col justify-start md:justify-center px-6 md:px-12 lg:px-16 pt-8 md:pt-0">

                {/* Badge (Desktop Only) */}
                <span className="hidden md:inline-block px-4 py-2 rounded-full bg-amber-500/10 text-amber-400 text-sm font-medium mb-4 border border-amber-500/20 animate-fade-in self-start relative">
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
