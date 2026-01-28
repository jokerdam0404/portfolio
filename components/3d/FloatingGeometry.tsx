'use client';

import { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshTransmissionMaterial, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { useInView } from 'react-intersection-observer';

// Check for reduced motion preference
function useReducedMotion(): boolean {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return reducedMotion;
}

// Gold material with subtle glass effect
function GoldGlassMaterial() {
  return (
    <MeshTransmissionMaterial
      backside
      samples={4}
      thickness={0.5}
      chromaticAberration={0.025}
      anisotropy={0.1}
      distortion={0.1}
      distortionScale={0.2}
      temporalDistortion={0.1}
      iridescence={1}
      iridescenceIOR={1}
      iridescenceThicknessRange={[0, 1400]}
      color="#D4AF37"
      transmission={0.95}
      roughness={0.1}
      metalness={0.1}
    />
  );
}

// Floating Octahedron
function FloatingOctahedron({ position, scale = 1, speed = 1 }: { position: [number, number, number]; scale?: number; speed?: number }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.3 * speed;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.2 * speed;
    }
  });

  return (
    <Float speed={2 * speed} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={meshRef} position={position} scale={scale}>
        <octahedronGeometry args={[1, 0]} />
        <GoldGlassMaterial />
      </mesh>
    </Float>
  );
}

// Floating Torus
function FloatingTorus({ position, scale = 1, speed = 1 }: { position: [number, number, number]; scale?: number; speed?: number }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2 * speed;
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.15 * speed;
    }
  });

  return (
    <Float speed={1.5 * speed} rotationIntensity={0.3} floatIntensity={0.8}>
      <mesh ref={meshRef} position={position} scale={scale}>
        <torusGeometry args={[1, 0.4, 16, 32]} />
        <GoldGlassMaterial />
      </mesh>
    </Float>
  );
}

// Floating Icosahedron
function FloatingIcosahedron({ position, scale = 1, speed = 1 }: { position: [number, number, number]; scale?: number; speed?: number }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.25 * speed;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.35 * speed;
    }
  });

  return (
    <Float speed={2.5 * speed} rotationIntensity={0.6} floatIntensity={1.2}>
      <mesh ref={meshRef} position={position} scale={scale}>
        <icosahedronGeometry args={[1, 0]} />
        <GoldGlassMaterial />
      </mesh>
    </Float>
  );
}

// Wireframe Cube
function WireframeCube({ position, scale = 1, speed = 1 }: { position: [number, number, number]; scale?: number; speed?: number }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.15 * speed;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.2 * speed;
    }
  });

  return (
    <Float speed={1.8 * speed} rotationIntensity={0.4} floatIntensity={0.6}>
      <mesh ref={meshRef} position={position} scale={scale}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color="#D4AF37" wireframe transparent opacity={0.4} />
      </mesh>
    </Float>
  );
}

// Small floating particles
function Particles({ count = 50 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [count]);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.02;
      ref.current.rotation.x = state.clock.elapsedTime * 0.01;
    }
  });

  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial
        size={0.02}
        color="#D4AF37"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

// Scene configuration types
interface SceneConfig {
  showOctahedron?: boolean;
  showTorus?: boolean;
  showIcosahedron?: boolean;
  showWireframeCube?: boolean;
  showParticles?: boolean;
  particleCount?: number;
  positions?: {
    octahedron?: [number, number, number];
    torus?: [number, number, number];
    icosahedron?: [number, number, number];
    wireframeCube?: [number, number, number];
  };
  scales?: {
    octahedron?: number;
    torus?: number;
    icosahedron?: number;
    wireframeCube?: number;
  };
  speed?: number;
}

interface FloatingGeometryProps {
  className?: string;
  config?: SceneConfig;
}

const defaultConfig: SceneConfig = {
  showOctahedron: true,
  showTorus: true,
  showIcosahedron: true,
  showWireframeCube: true,
  showParticles: true,
  particleCount: 30,
  positions: {
    octahedron: [-2, 1.5, -1],
    torus: [2.5, -1, 0],
    icosahedron: [0, 0, 1],
    wireframeCube: [-1.5, -1.5, -2],
  },
  scales: {
    octahedron: 0.5,
    torus: 0.4,
    icosahedron: 0.6,
    wireframeCube: 0.8,
  },
  speed: 1,
};

export default function FloatingGeometry({ className = '', config = {} }: FloatingGeometryProps) {
  const mergedConfig = { ...defaultConfig, ...config };
  const reducedMotion = useReducedMotion();

  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false,
  });

  // If reduced motion is preferred, show a static gradient instead
  if (reducedMotion) {
    return (
      <div ref={ref} className={`w-full h-full ${className}`}>
        <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-gold/3 rounded-2xl" />
      </div>
    );
  }

  return (
    <div ref={ref} className={`w-full h-full ${className}`}>
      {inView && (
        <Canvas
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
          }}
          dpr={[1, 1.5]}
          camera={{ position: [0, 0, 6], fov: 45 }}
          style={{ background: 'transparent' }}
        >
          <ambientLight intensity={0.3} />
          <directionalLight position={[5, 5, 5]} intensity={0.8} color="#ffffff" />
          <directionalLight position={[-5, -5, -5]} intensity={0.3} color="#D4AF37" />

          <Environment preset="night" />

          {mergedConfig.showOctahedron && (
            <FloatingOctahedron
              position={mergedConfig.positions?.octahedron || [-2, 1.5, -1]}
              scale={mergedConfig.scales?.octahedron || 0.5}
              speed={mergedConfig.speed}
            />
          )}

          {mergedConfig.showTorus && (
            <FloatingTorus
              position={mergedConfig.positions?.torus || [2.5, -1, 0]}
              scale={mergedConfig.scales?.torus || 0.4}
              speed={mergedConfig.speed}
            />
          )}

          {mergedConfig.showIcosahedron && (
            <FloatingIcosahedron
              position={mergedConfig.positions?.icosahedron || [0, 0, 1]}
              scale={mergedConfig.scales?.icosahedron || 0.6}
              speed={mergedConfig.speed}
            />
          )}

          {mergedConfig.showWireframeCube && (
            <WireframeCube
              position={mergedConfig.positions?.wireframeCube || [-1.5, -1.5, -2]}
              scale={mergedConfig.scales?.wireframeCube || 0.8}
              speed={mergedConfig.speed}
            />
          )}

          {mergedConfig.showParticles && (
            <Particles count={mergedConfig.particleCount} />
          )}
        </Canvas>
      )}
    </div>
  );
}

// Export individual geometries for custom compositions
export { FloatingOctahedron, FloatingTorus, FloatingIcosahedron, WireframeCube, Particles };
