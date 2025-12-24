'use client';

import { useRef, useEffect, useCallback, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';
import {
    SECTIONS,
    SECTION_IDS,
    HOTSPOTS,
    ANIMATION_CONFIG,
    SectionId
} from '@/lib/sceneConfig';

// Register GSAP plugins
if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

interface UseScrollAnimationOptions {
    modelRef: React.RefObject<THREE.Group | null>;
    onSectionChange?: (section: SectionId) => void;
    enabled?: boolean; // Allow disabling during explore mode
    isMobile?: boolean;
    mobileCameraPosition?: THREE.Vector3Tuple;
}

// Simple scroll-based animation using useFrame
export function useScrollAnimation({
    modelRef,
    onSectionChange,
    enabled = true,
    isMobile = false,
    mobileCameraPosition = [0.5, -0.2, 1.5], // Default mobile position
}: UseScrollAnimationOptions) {
    const { camera } = useThree();
    const currentSectionRef = useRef<SectionId>('hero');
    const targetRotationRef = useRef(SECTIONS.hero.modelRotation[1]);
    const targetCameraRef = useRef({
        x: SECTIONS.hero.cameraPosition[0],
        y: SECTIONS.hero.cameraPosition[1],
        z: SECTIONS.hero.cameraPosition[2],
    });

    // Track scroll progress
    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollProgress = Math.min(Math.max(scrollY / docHeight, 0), 1);

            // Determine current section (0-3 for 4 sections)
            const sectionIndex = Math.min(
                Math.floor(scrollProgress * SECTION_IDS.length),
                SECTION_IDS.length - 1
            );

            // Interpolate between sections for smooth transition
            const sectionProgress = (scrollProgress * SECTION_IDS.length) % 1;
            const currentSection = SECTION_IDS[sectionIndex];
            const nextSection = SECTION_IDS[Math.min(sectionIndex + 1, SECTION_IDS.length - 1)];

            const currentConfig = SECTIONS[currentSection];
            const nextConfig = SECTIONS[nextSection];

            // FIXED DISTANCE: Use spherical coordinates with constant radius
            // This ensures model size stays consistent while camera orbits
            const fixedDistance = 1.45; // Consistent distance from origin

            // Calculate target angle based on scroll (orbiting effect)
            // Start at ~60 degrees, end at ~45 degrees azimuth
            const startAngle = Math.PI / 3;  // 60 degrees
            const endAngle = Math.PI / 4;    // 45 degrees
            const azimuthAngle = THREE.MathUtils.lerp(startAngle, endAngle, scrollProgress);

            // Slight vertical angle variation (15-25 degrees elevation)
            const startElevation = 0.25;
            const endElevation = 0.15;
            const elevationAngle = THREE.MathUtils.lerp(startElevation, endElevation, scrollProgress);

            // Convert spherical to cartesian (fixed distance)
            targetCameraRef.current = {
                x: fixedDistance * Math.sin(azimuthAngle) * Math.cos(elevationAngle),
                y: fixedDistance * elevationAngle * 2, // Height (scaled for visible effect)
                z: fixedDistance * Math.cos(azimuthAngle) * Math.cos(elevationAngle),
            };

            // Lerp model rotation
            targetRotationRef.current = THREE.MathUtils.lerp(
                currentConfig.modelRotation[1],
                nextConfig.modelRotation[1],
                sectionProgress
            );

            // Update current section for UI
            if (currentSection !== currentSectionRef.current) {
                currentSectionRef.current = currentSection;
                onSectionChange?.(currentSection);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // Initial call

        return () => window.removeEventListener('scroll', handleScroll);
    }, [onSectionChange]);

    // Animate every frame (only when enabled)
    useFrame(() => {
        // Skip animation when disabled (explore mode)
        if (!enabled) return;

        // Smooth camera movement with fixed lerp factor for stability
        const lerpSpeed = 0.08;

        if (isMobile) {
            // FORCE mobile position to prevent drift/zoom
            camera.position.x = THREE.MathUtils.lerp(camera.position.x, mobileCameraPosition[0], lerpSpeed);
            camera.position.y = THREE.MathUtils.lerp(camera.position.y, mobileCameraPosition[1], lerpSpeed);
            camera.position.z = THREE.MathUtils.lerp(camera.position.z, mobileCameraPosition[2], lerpSpeed);
        } else {
            // Desktop: Follow scroll targets with FIXED distance
            camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetCameraRef.current.x, lerpSpeed);
            camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetCameraRef.current.y, lerpSpeed);
            camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetCameraRef.current.z, lerpSpeed);
        }

        // Always look at origin
        camera.lookAt(0, 0, 0);

        // Smooth model rotation with fixed lerp
        if (modelRef.current) {
            modelRef.current.rotation.y = THREE.MathUtils.lerp(
                modelRef.current.rotation.y,
                targetRotationRef.current,
                lerpSpeed
            );
        }
    });

    return {
        currentSection: currentSectionRef.current,
    };
}

// Turntable idle animation hook
export function useTurntableIdle(
    modelRef: React.RefObject<THREE.Group | null>,
    enabled: boolean,
    isFocused: boolean
) {
    const idleTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const idleAnimationRef = useRef<gsap.core.Tween | null>(null);
    const isIdlingRef = useRef(false);

    const startIdle = useCallback(() => {
        if (!modelRef.current || isFocused || !enabled) return;

        isIdlingRef.current = true;
        idleAnimationRef.current = gsap.to(modelRef.current.rotation, {
            y: '+=6.28',
            duration: 20,
            ease: 'none',
            repeat: -1,
        });
    }, [modelRef, isFocused, enabled]);

    const stopIdle = useCallback(() => {
        if (idleAnimationRef.current) {
            idleAnimationRef.current.kill();
            idleAnimationRef.current = null;
        }
        isIdlingRef.current = false;
    }, []);

    const resetIdleTimer = useCallback(() => {
        stopIdle();

        if (idleTimeoutRef.current) {
            clearTimeout(idleTimeoutRef.current);
        }

        if (enabled && !isFocused) {
            idleTimeoutRef.current = setTimeout(() => {
                startIdle();
            }, ANIMATION_CONFIG.turntableDelay);
        }
    }, [enabled, isFocused, startIdle, stopIdle]);

    useEffect(() => {
        if (!enabled) return;

        const handleScroll = () => resetIdleTimer();
        const handleMove = () => resetIdleTimer();

        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('mousemove', handleMove, { passive: true });
        window.addEventListener('touchstart', handleMove, { passive: true });

        resetIdleTimer();

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('mousemove', handleMove);
            window.removeEventListener('touchstart', handleMove);
            stopIdle();
            if (idleTimeoutRef.current) {
                clearTimeout(idleTimeoutRef.current);
            }
        };
    }, [enabled, resetIdleTimer, stopIdle]);

    return { isIdling: isIdlingRef.current, stopIdle, resetIdleTimer };
}

// Keep the old hook signature for compatibility but make it simpler
export function useScrollStory(options: {
    refs: {
        camera: THREE.PerspectiveCamera | null;
        cameraTarget: THREE.Vector3;
        model: THREE.Group | null;
        light: THREE.DirectionalLight | null;
    };
    container: HTMLElement | null;
    onSectionChange?: (section: SectionId) => void;
    reducedMotion?: boolean;
}) {
    return {
        focusOnHotspot: () => { },
        exitFocus: () => { },
        isFocused: false,
        currentSection: 'hero' as SectionId,
        refresh: () => { },
    };
}
