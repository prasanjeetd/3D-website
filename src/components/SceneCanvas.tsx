'use client';

import { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
    PerspectiveCamera,
    Environment,
    ContactShadows,
    OrbitControls,
} from '@react-three/drei';
import * as THREE from 'three';
import studioHdri from '@pmndrs/assets/hdri/studio.exr';
import { ProductModel, ProductModelRef } from './ProductModel';
import { useScrollAnimation, useTurntableIdle } from './ScrollStory';
import { CAMERA_CONFIG, SECTIONS, SectionId } from '@/lib/sceneConfig';

// Hook to detect mobile viewport
function useIsMobile() {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    return isMobile;
}

// Fires onReady once it mounts — and it only mounts after the Suspense around the
// model + environment resolves. We wait two animation frames so the first frame has
// actually painted (shaders compiled, textures uploaded) before hiding the loader.
function SceneReady({ onReady }: { onReady?: () => void }) {
    useEffect(() => {
        let raf2 = 0;
        const raf1 = requestAnimationFrame(() => {
            raf2 = requestAnimationFrame(() => onReady?.());
        });
        return () => {
            cancelAnimationFrame(raf1);
            cancelAnimationFrame(raf2);
        };
    }, [onReady]);
    return null;
}

interface SceneProps {
    exploreMode: boolean;
    onHotspotHover: (id: string | null) => void;
    onHotspotClick: (id: string) => void;
    onSectionChange: (section: SectionId) => void;
    activeHotspot: string | null;
    isFocused: boolean;
    isMobile: boolean;
    onReady?: () => void;
}

function Scene({
    exploreMode,
    onHotspotHover,
    onHotspotClick,
    onSectionChange,
    activeHotspot,
    isFocused,
    isMobile,
    onReady,
}: SceneProps) {
    const modelRef = useRef<ProductModelRef>(null);
    const modelGroupRef = useRef<THREE.Group | null>(null);

    // Update modelGroupRef when model loads
    useEffect(() => {
        const checkModel = setInterval(() => {
            if (modelRef.current?.group) {
                modelGroupRef.current = modelRef.current.group;
                clearInterval(checkModel);
            }
        }, 100);
        return () => clearInterval(checkModel);
    }, []);

    // Use the scroll animation hook (disabled in explore mode)
    useScrollAnimation({
        modelRef: modelGroupRef,
        onSectionChange,
        enabled: !exploreMode, // Disable when in explore mode
        isMobile,
    });

    // Turntable idle animation - DISABLED to prevent flickering
    // useTurntableIdle(modelGroupRef, !exploreMode && !isFocused, isFocused);

    // Mobile camera: desktop-like side angle but closer + tighter FOV, so the cleaver
    // shows its broad side profile and fills the top area (bigger).
    const cameraPosition: THREE.Vector3Tuple = isMobile
        ? [0.7, 0.25, 0.95]
        : CAMERA_CONFIG.initialPosition;

    const cameraFov = isMobile ? 42 : CAMERA_CONFIG.fov;

    return (
        <>
            <PerspectiveCamera
                makeDefault
                fov={cameraFov}
                near={CAMERA_CONFIG.near}
                far={CAMERA_CONFIG.far}
                position={cameraPosition}
            />

            {/* Lighting */}
            <ambientLight intensity={0.5} />
            <directionalLight
                position={[3, 3, 3]}
                intensity={2}
                castShadow
                shadow-mapSize={[1024, 1024]}
            />
            <directionalLight position={[-2, 2, -2]} intensity={0.8} />

            {/* Environment + Model share ONE Suspense boundary inside the Canvas.
                Environment (HDRI) suspends while loading; keeping it here means it always
                has its own boundary and never needs a page-level Suspense.
                HDRI is bundled locally (was preset="studio" → remote CDN → crashed on fetch fail). */}
            <Suspense fallback={null}>
                <Environment files={studioHdri} background={false} />
                <ProductModel
                    ref={modelRef}
                    activeHotspot={activeHotspot}
                    onHotspotHover={onHotspotHover}
                    onHotspotClick={onHotspotClick}
                    showHotspots={false}
                />
                <SceneReady onReady={onReady} />
            </Suspense>

            {/* Contact shadows */}
            <ContactShadows
                position={[0, -0.12, 0]}
                opacity={0.6}
                scale={1}
                blur={2}
                far={0.5}
                color="#000000"
            />

            {/* Orbit controls (only when explore mode) */}
            {exploreMode && (
                <OrbitControls
                    enablePan={false}
                    enableZoom={true}
                    minDistance={0.3}
                    maxDistance={3}
                    enableDamping
                    dampingFactor={0.05}
                    minPolarAngle={0}
                    maxPolarAngle={Math.PI}
                    minAzimuthAngle={-Infinity}
                    maxAzimuthAngle={Infinity}
                />
            )}
        </>
    );
}

interface SceneCanvasProps {
    exploreMode: boolean;
    onHotspotHover: (id: string | null) => void;
    onHotspotClick: (id: string) => void;
    onSectionChange: (section: SectionId) => void;
    activeHotspot: string | null;
    isFocused: boolean;
    containerRef?: React.RefObject<HTMLElement>;
    scrollStoryRef?: React.MutableRefObject<unknown>;
    isMobile?: boolean;
    onReady?: () => void;
}

export function SceneCanvas({
    exploreMode,
    onHotspotHover,
    onHotspotClick,
    onSectionChange,
    activeHotspot,
    isFocused,
    isMobile = false,
    onReady,
}: SceneCanvasProps) {
    // const isMobile = useIsMobile(); // Use prop from parent for consistency

    return (
        <div className="absolute inset-0 w-full h-full">
            <Canvas
                gl={{
                    antialias: true,
                    alpha: true,
                    powerPreference: 'high-performance',
                }}
                dpr={[1, 2]}
                shadows
                style={{ width: '100%', height: '100%' }}
            >
                <color attach="background" args={['#0a0a0a']} />
                <fog attach="fog" args={['#0a0a0a', 2, 5]} />
                <Scene
                    exploreMode={exploreMode}
                    onHotspotHover={onHotspotHover}
                    onHotspotClick={onHotspotClick}
                    onSectionChange={onSectionChange}
                    activeHotspot={activeHotspot}
                    isFocused={isFocused}
                    isMobile={isMobile}
                    onReady={onReady}
                />
            </Canvas>
        </div>
    );
}

