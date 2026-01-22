"use client";

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sphere } from '@react-three/drei';
import * as THREE from 'three';

interface HeroSceneProps {
  /** Animation speed multiplier (default: 1) */
  speed?: number;
  /** Number of orbiting particles (default: 60) */
  particleCount?: number;
  /** Size of the central orb (default: 2.5) */
  orbSize?: number;
  /** Whether to enable animations (disabled for reduced-motion) */
  animated?: boolean;
  /** Scale factor for mobile devices */
  scale?: number;
}

/**
 * Orbiting particles around the central sphere.
 * Creates an "atom-like" orbital pattern with multiple rings.
 */
function OrbitingParticles({
  count = 60,
  animated = true,
  scale = 1
}: {
  count: number;
  animated: boolean;
  scale: number;
}) {
  const particlesRef = useRef<THREE.Points>(null);

  // Generate particle positions in orbital rings
  const { positions, sizes, colors } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const siz = new Float32Array(count);
    const col = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      // Create 3 orbital rings at different tilts
      const ring = i % 3;
      const angle = (i / count) * Math.PI * 2 * 3;
      const radius = 3.5 + Math.random() * 1.5;

      // Different orbital plane tilts
      const tiltX = ring === 0 ? 0 : ring === 1 ? Math.PI / 4 : -Math.PI / 3;
      const tiltZ = ring === 0 ? Math.PI / 6 : ring === 1 ? -Math.PI / 4 : Math.PI / 5;

      // Calculate position on tilted ring
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius * Math.cos(tiltX);
      const z = Math.sin(angle) * radius * Math.sin(tiltX) + Math.cos(angle) * radius * Math.sin(tiltZ) * 0.3;

      pos[i * 3] = x * scale;
      pos[i * 3 + 1] = y * scale;
      pos[i * 3 + 2] = z * scale;

      // Varying particle sizes
      siz[i] = (0.03 + Math.random() * 0.05) * scale;

      // Blue-white color palette (finance professional aesthetic)
      const intensity = 0.7 + Math.random() * 0.3;
      col[i * 3] = 0.4 * intensity;     // R
      col[i * 3 + 1] = 0.6 * intensity; // G
      col[i * 3 + 2] = 1.0 * intensity; // B
    }

    return { positions: pos, sizes: siz, colors: col };
  }, [count, scale]);

  // Animate orbital rotation
  useFrame((state) => {
    if (!particlesRef.current || !animated) return;

    // Slow rotation around different axes for organic feel
    particlesRef.current.rotation.y = state.clock.elapsedTime * 0.15;
    particlesRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.08 * scale}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/**
 * Floating grid rings for depth perception.
 * Adds subtle "financial chart" aesthetic.
 */
function GridRings({ animated = true, scale = 1 }: { animated: boolean; scale: number }) {
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!animated) return;

    if (ring1Ref.current) {
      ring1Ref.current.rotation.x = Math.PI / 2;
      ring1Ref.current.rotation.z = state.clock.elapsedTime * 0.1;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.x = Math.PI / 2 + Math.PI / 6;
      ring2Ref.current.rotation.z = -state.clock.elapsedTime * 0.08;
    }
  });

  return (
    <>
      <mesh ref={ring1Ref} position={[0, 0, 0]}>
        <torusGeometry args={[4 * scale, 0.01, 16, 64]} />
        <meshBasicMaterial color="#3B82F6" transparent opacity={0.2} />
      </mesh>
      <mesh ref={ring2Ref} position={[0, 0, 0]}>
        <torusGeometry args={[5 * scale, 0.01, 16, 64]} />
        <meshBasicMaterial color="#3B82F6" transparent opacity={0.15} />
      </mesh>
    </>
  );
}

/**
 * Main 3D scene for the hero section.
 * Features a glassy distorted sphere with orbiting particles.
 * "Finance x Physics" aesthetic - clean, professional, subtle.
 */
export default function HeroScene({
  speed = 1,
  particleCount = 60,
  orbSize = 2.5,
  animated = true,
  scale = 1,
}: HeroSceneProps) {
  const sphereRef = useRef<THREE.Mesh>(null);

  // Subtle sphere animation
  useFrame((state) => {
    if (!sphereRef.current || !animated) return;

    // Gentle rotation
    sphereRef.current.rotation.y = state.clock.elapsedTime * 0.2 * speed;
    sphereRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3 * speed) * 0.1;
  });

  return (
    <>
      {/* Ambient lighting for soft shadows */}
      <ambientLight intensity={0.4} />

      {/* Key light - subtle blue tint */}
      <directionalLight
        position={[10, 10, 5]}
        intensity={0.8}
        color="#E0E7FF"
      />

      {/* Fill light from opposite side */}
      <directionalLight
        position={[-10, -5, -5]}
        intensity={0.3}
        color="#3B82F6"
      />

      {/* Central floating orb - glassy material */}
      <Float
        speed={animated ? 2 * speed : 0}
        rotationIntensity={animated ? 0.3 : 0}
        floatIntensity={animated ? 0.5 : 0}
      >
        <Sphere ref={sphereRef} args={[orbSize * scale, 64, 64]}>
          <MeshDistortMaterial
            color="#1E40AF"
            transparent
            opacity={0.6}
            roughness={0.1}
            metalness={0.8}
            distort={animated ? 0.3 : 0}
            speed={animated ? 2 * speed : 0}
          />
        </Sphere>

        {/* Inner glow sphere */}
        <Sphere args={[orbSize * scale * 0.8, 32, 32]}>
          <meshBasicMaterial
            color="#60A5FA"
            transparent
            opacity={0.15}
          />
        </Sphere>
      </Float>

      {/* Orbiting particles */}
      <OrbitingParticles
        count={particleCount}
        animated={animated}
        scale={scale}
      />

      {/* Subtle grid rings */}
      <GridRings animated={animated} scale={scale} />
    </>
  );
}
