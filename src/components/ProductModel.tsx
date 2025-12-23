'use client';

import { useRef, useState, useCallback, forwardRef, useImperativeHandle } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { HOTSPOTS, MODEL_CONFIG, HotspotConfig } from '@/lib/sceneConfig';
import { Html } from '@react-three/drei';

interface HotspotProps {
    config: HotspotConfig;
    isActive: boolean;
    onHover: (id: string | null) => void;
    onClick: (id: string) => void;
}

function Hotspot({ config, isActive, onHover, onClick }: HotspotProps) {
    const [hovered, setHovered] = useState(false);
    const ringRef = useRef<THREE.Mesh>(null);
    const dotRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (ringRef.current) {
            // Subtle pulsing animation
            const scale = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.15;
            ringRef.current.scale.setScalar(hovered || isActive ? 1.5 : scale);

            // Rotate the ring slowly
            ringRef.current.rotation.z += 0.01;
        }
        if (dotRef.current) {
            dotRef.current.scale.setScalar(hovered || isActive ? 1.2 : 1);
        }
    });

    const handlePointerEnter = useCallback(() => {
        setHovered(true);
        onHover(config.id);
        document.body.style.cursor = 'pointer';
    }, [config.id, onHover]);

    const handlePointerLeave = useCallback(() => {
        setHovered(false);
        onHover(null);
        document.body.style.cursor = 'auto';
    }, [onHover]);

    const handleClick = useCallback(() => {
        onClick(config.id);
    }, [config.id, onClick]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick(config.id);
        }
    }, [config.id, onClick]);

    return (
        <group position={config.position}>
            {/* Subtle dot indicator - much smaller */}
            <mesh
                ref={dotRef}
                onPointerEnter={handlePointerEnter}
                onPointerLeave={handlePointerLeave}
                onClick={handleClick}
            >
                <circleGeometry args={[0.003, 16]} />
                <meshBasicMaterial
                    color={hovered || isActive ? '#fbbf24' : '#ffffff'}
                    transparent
                    opacity={hovered || isActive ? 1 : 0.7}
                    side={THREE.DoubleSide}
                />
            </mesh>

            {/* Subtle ring around the dot */}
            <mesh ref={ringRef} rotation={[0, 0, 0]}>
                <ringGeometry args={[0.005, 0.007, 32]} />
                <meshBasicMaterial
                    color={hovered || isActive ? '#fbbf24' : '#ffffff'}
                    transparent
                    opacity={hovered || isActive ? 0.9 : 0.4}
                    side={THREE.DoubleSide}
                />
            </mesh>

            {/* Outer glow ring - only visible on hover */}
            {(hovered || isActive) && (
                <mesh>
                    <ringGeometry args={[0.008, 0.012, 32]} />
                    <meshBasicMaterial
                        color="#fbbf24"
                        transparent
                        opacity={0.3}
                        side={THREE.DoubleSide}
                    />
                </mesh>
            )}

            {/* Tooltip */}
            {hovered && (
                <Html
                    position={[0, 0.03, 0]}
                    center
                    style={{ pointerEvents: 'none' }}
                >
                    <div
                        className="px-3 py-2 bg-zinc-900/90 backdrop-blur-md rounded-lg border border-amber-500/20 shadow-lg min-w-[180px] max-w-[240px]"
                        role="tooltip"
                        aria-label={config.label}
                        tabIndex={0}
                        onKeyDown={handleKeyDown}
                    >
                        <h4 className="text-amber-400 font-medium text-xs mb-1">
                            {config.label}
                        </h4>
                        <p className="text-zinc-400 text-[10px] leading-relaxed">
                            {config.description}
                        </p>
                    </div>
                </Html>
            )}
        </group>
    );
}

export interface ProductModelRef {
    group: THREE.Group | null;
}

interface ProductModelProps {
    activeHotspot: string | null;
    onHotspotHover: (id: string | null) => void;
    onHotspotClick: (id: string) => void;
    showHotspots?: boolean;
}

export const ProductModel = forwardRef<ProductModelRef, ProductModelProps>(
    function ProductModel({ activeHotspot, onHotspotHover, onHotspotClick, showHotspots = true }, ref) {
        const groupRef = useRef<THREE.Group>(null);
        const { scene } = useGLTF(MODEL_CONFIG.path);

        useImperativeHandle(ref, () => ({
            get group() {
                return groupRef.current;
            },
        }));

        return (
            <group
                ref={groupRef}
                scale={MODEL_CONFIG.scale}
                position={MODEL_CONFIG.position}
                dispose={null}
            >
                <primitive object={scene} />

                {/* Hotspots - only show if enabled */}
                {showHotspots && HOTSPOTS.map((hotspot) => (
                    <Hotspot
                        key={hotspot.id}
                        config={hotspot}
                        isActive={activeHotspot === hotspot.id}
                        onHover={onHotspotHover}
                        onClick={onHotspotClick}
                    />
                ))}
            </group>
        );
    }
);

// Preload the model
useGLTF.preload(MODEL_CONFIG.path);
