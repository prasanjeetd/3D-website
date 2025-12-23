import * as THREE from 'three';

export interface SectionConfig {
  cameraPosition: THREE.Vector3Tuple;
  cameraTarget: THREE.Vector3Tuple;
  modelRotation: THREE.Vector3Tuple;
  lightIntensity: number;
  lightPosition: THREE.Vector3Tuple;
}

export interface HotspotConfig {
  id: string;
  position: THREE.Vector3Tuple;
  label: string;
  description: string;
  cameraPosition: THREE.Vector3Tuple;
  cameraTarget: THREE.Vector3Tuple;
}

export const SECTION_IDS = ['hero', 'features', 'details', 'cta'] as const;
export type SectionId = typeof SECTION_IDS[number];

export const SECTIONS: Record<SectionId, SectionConfig> = {
  hero: {
    cameraPosition: [0.8, 0.4, 1],
    cameraTarget: [0, 0, 0],
    modelRotation: [0, -0.5, 0],
    lightIntensity: 2,
    lightPosition: [3, 3, 3],
  },
  features: {
    cameraPosition: [0.6, 0.1, 0.8],
    cameraTarget: [0, 0.05, 0],
    modelRotation: [0, Math.PI * 0.3, 0],
    lightIntensity: 2.5,
    lightPosition: [2, 3, 2],
  },
  details: {
    cameraPosition: [0.5, 0.2, 0.7],
    cameraTarget: [0, 0, 0],
    modelRotation: [0, Math.PI * 0.6, 0],
    lightIntensity: 2.2,
    lightPosition: [2, 2, 3],
  },
  cta: {
    cameraPosition: [1, 0.3, 0.9],
    cameraTarget: [0, 0, 0],
    modelRotation: [0, Math.PI * 0.9, 0],
    lightIntensity: 2.8,
    lightPosition: [3, 3, 2],
  },
};

export const HOTSPOTS: HotspotConfig[] = [
  {
    id: 'blade',
    position: [0.02, 0.12, 0],
    label: 'Razor Edge',
    description: 'Hand-sharpened carbon steel blade with 15° cutting angle for precision cuts',
    cameraPosition: [0.4, 0.15, 0.5],
    cameraTarget: [0.02, 0.12, 0],
  },
  {
    id: 'handle',
    position: [0, -0.05, 0],
    label: 'Ergonomic Grip',
    description: 'Pakkawood handle contoured for comfort during extended use',
    cameraPosition: [0.35, 0, 0.4],
    cameraTarget: [0, -0.05, 0],
  },
  {
    id: 'rivets',
    position: [0.01, -0.02, 0.01],
    label: 'Triple Rivets',
    description: 'Brass rivets ensure lifetime handle-to-blade bond',
    cameraPosition: [0.4, 0.05, 0.35],
    cameraTarget: [0.01, -0.02, 0.01],
  },
];

export const ANIMATION_CONFIG = {
  scrollScrub: 1.5, // Smoother scrubbing
  focusTransitionDuration: 0.8,
  turntableSpeed: 0.3,
  turntableDelay: 3000, // ms before idle rotation starts
  showHotspots: false, // Disable hotspots by default for cleaner look
};

export const CAMERA_CONFIG = {
  fov: 45,
  near: 0.01,
  far: 50,
  initialPosition: [0.8, 0.4, 1] as THREE.Vector3Tuple,
};

export const MODEL_CONFIG = {
  path: '/models/cleaver/scene.gltf',
  scale: 3,
  position: [0, 0, 0] as THREE.Vector3Tuple,
};
