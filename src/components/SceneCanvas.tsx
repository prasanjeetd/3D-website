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
import { ProductModel, ProductModelRef } from './ProductModel';
import { Loader } from './Loader';
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

interface SceneProps {
    exploreMode: boolean;
    onHotspotHover: (id: string | null) => void;
    onHotspotClick: (id: string) => void;
    onSectionChange: (section: SectionId) => void;
    activeHotspot: string | null;
    isFocused: boolean;
    isMobile: boolean;
}

function Scene({
    exploreMode,
    onHotspotHover,
    onHotspotClick,
    onSectionChange,
    activeHotspot,
    isFocused,
    isMobile,
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

    // Mobile-specific camera adjustments: move model down and back
    const cameraPosition: THREE.Vector3Tuple = isMobile
        ? [0.5, -0.2, 1.5]  // Lower, further back on mobile
        : CAMERA_CONFIG.initialPosition;

    const cameraFov = isMobile ? 55 : CAMERA_CONFIG.fov; // Wider FOV on mobile

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

            {/* Environment */}
            <Environment preset="studio" background={false} />

            {/* Model */}
            <Suspense fallback={<Loader />}>
                <ProductModel
                    ref={modelRef}
                    activeHotspot={activeHotspot}
                    onHotspotHover={onHotspotHover}
                    onHotspotClick={onHotspotClick}
                    showHotspots={false}
                />
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
}

export function SceneCanvas({
    exploreMode,
    onHotspotHover,
    onHotspotClick,
    onSectionChange,
    activeHotspot,
    isFocused,
    isMobile = false,
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
                />
            </Canvas>
        </div>
    );
}

