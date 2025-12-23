'use client';

import { useCallback, useEffect } from 'react';
import { SECTION_IDS, HOTSPOTS, SectionId } from '@/lib/sceneConfig';

interface UIOverlayProps {
    currentSection: SectionId;
    exploreMode: boolean;
    onExploreToggle: () => void;
    isFocused: boolean;
    onExitFocus: () => void;
    hoveredHotspot: string | null;
}

export function UIOverlay({
    currentSection,
    exploreMode,
    onExploreToggle,
    isFocused,
    onExitFocus,
    hoveredHotspot,
}: UIOverlayProps) {
    // Handle ESC key to exit focus
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isFocused) {
                onExitFocus();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isFocused, onExitFocus]);

    const scrollToSection = useCallback((sectionId: SectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    }, []);

    return (
        <>
            {/* Top Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                            </svg>
                        </div>
                        <span className="text-white font-bold text-lg tracking-tight hidden sm:block">
                            CLEAVER<span className="text-amber-400">PRO</span>
                        </span>
                    </div>

                    {/* Section Indicators (Scrollspy) */}
                    <div className="hidden md:flex items-center gap-1 bg-zinc-800/50 backdrop-blur-md rounded-full p-1 border border-zinc-700/50">
                        {SECTION_IDS.map((id) => (
                            <button
                                key={id}
                                onClick={() => scrollToSection(id)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${currentSection === id
                                        ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white'
                                        : 'text-zinc-400 hover:text-white'
                                    }`}
                                aria-label={`Navigate to ${id} section`}
                                aria-current={currentSection === id ? 'true' : undefined}
                            >
                                {id.charAt(0).toUpperCase() + id.slice(1)}
                            </button>
                        ))}
                    </div>

                    {/* Controls */}
                    <div className="flex items-center gap-3">
                        {/* Explore Mode Toggle */}
                        <button
                            onClick={onExploreToggle}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 border ${exploreMode
                                    ? 'bg-amber-500 text-white border-amber-400'
                                    : 'bg-zinc-800/50 text-zinc-300 border-zinc-700/50 hover:bg-zinc-700/50'
                                } backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-zinc-900`}
                            aria-label={exploreMode ? 'Exit explore mode' : 'Enter explore mode'}
                            aria-pressed={exploreMode}
                        >
                            <span className="flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <span className="hidden sm:inline">
                                    {exploreMode ? 'Exit Explore' : 'Explore'}
                                </span>
                            </span>
                        </button>
                    </div>
                </div>
            </nav>

            {/* Back Button (when focused on hotspot) */}
            {isFocused && (
                <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-fade-in">
                    <button
                        onClick={onExitFocus}
                        className="px-6 py-3 bg-zinc-800/80 backdrop-blur-md text-white font-medium rounded-full border border-zinc-700/50 hover:bg-zinc-700/80 transition-all duration-300 flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        aria-label="Go back to scroll view"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Press ESC or click to go back
                    </button>
                </div>
            )}

            {/* Hotspot info tooltip (for accessibility) */}
            {hoveredHotspot && (
                <div className="sr-only" role="status" aria-live="polite">
                    {HOTSPOTS.find(h => h.id === hoveredHotspot)?.description}
                </div>
            )}

            {/* Mobile Section Indicator */}
            <div className="fixed bottom-8 right-8 z-50 md:hidden">
                <div className="flex flex-col gap-2">
                    {SECTION_IDS.map((id) => (
                        <button
                            key={id}
                            onClick={() => scrollToSection(id)}
                            className={`w-3 h-3 rounded-full transition-all duration-300 ${currentSection === id
                                    ? 'bg-amber-500 scale-125'
                                    : 'bg-zinc-600 hover:bg-zinc-500'
                                }`}
                            aria-label={`Navigate to ${id} section`}
                        />
                    ))}
                </div>
            </div>

            {/* Scroll indicator (hero section only) */}
            {currentSection === 'hero' && !isFocused && (
                <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 animate-bounce hidden md:block">
                    <div className="flex flex-col items-center gap-2 text-zinc-500">
                        <span className="text-xs uppercase tracking-widest">Scroll to explore</span>
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                    </div>
                </div>
            )}
        </>
    );
}
