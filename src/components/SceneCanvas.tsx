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

interface SceneProps {
    exploreMode: boolean;
    onHotspotHover: (id: string | null) => void;
    onHotspotClick: (id: string) => void;
    onSectionChange: (section: SectionId) => void;
    activeHotspot: string | null;
    isFocused: boolean;
}

function Scene({
    exploreMode,
    onHotspotHover,
    onHotspotClick,
    onSectionChange,
    activeHotspot,
    isFocused,
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
    });

    // Turntable idle animation - DISABLED to prevent flickering
    // useTurntableIdle(modelGroupRef, !exploreMode && !isFocused, isFocused);

    return (
        <>
            <PerspectiveCamera
                makeDefault
                fov={CAMERA_CONFIG.fov}
                near={CAMERA_CONFIG.near}
                far={CAMERA_CONFIG.far}
                position={CAMERA_CONFIG.initialPosition}
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
}

export function SceneCanvas({
    exploreMode,
    onHotspotHover,
    onHotspotClick,
    onSectionChange,
    activeHotspot,
    isFocused,
}: SceneCanvasProps) {
    return (
        <div className="fixed inset-0 z-0">
            <Canvas
                gl={{
                    antialias: true,
                    alpha: true,
                    powerPreference: 'high-performance',
                }}
                dpr={[1, 2]}
                shadows
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
                />
            </Canvas>
        </div>
    );
}
