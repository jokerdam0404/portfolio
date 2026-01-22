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
  /** Scroll progress (0-1) for parallax effect */
  scrollProgress?: number;
  /** Dark mode enabled */
  isDark?: boolean;
}

// Color palettes for light and dark modes
const COLORS = {
  light: {
    sphere: "#1E40AF",
    innerGlow: "#60A5FA",
    ring: "#3B82F6",
    keyLight: "#E0E7FF",
    fillLight: "#3B82F6",
    particleIntensity: { r: 0.4, g: 0.6, b: 1.0 },
  },
  dark: {
    sphere: "#3B82F6",
    innerGlow: "#93C5FD",
    ring: "#60A5FA",
    keyLight: "#BFDBFE",
    fillLight: "#60A5FA",
    particleIntensity: { r: 0.5, g: 0.7, b: 1.0 },
  },
};

/**
 * Orbiting particles around the central sphere.
 * Creates an "atom-like" orbital pattern with multiple rings.
 */
function OrbitingParticles({
  count = 60,
  animated = true,
  scale = 1,
  isDark = false,
}: {
  count: number;
  animated: boolean;
  scale: number;
  isDark?: boolean;
}) {
  const particlesRef = useRef<THREE.Points>(null);
  const palette = isDark ? COLORS.dark : COLORS.light;

  // Generate particle positions in orbital rings
  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(count * 3);
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

      // Blue-white color palette (adjusts for dark/light mode)
      const intensity = 0.7 + Math.random() * 0.3;
      col[i * 3] = palette.particleIntensity.r * intensity;
      col[i * 3 + 1] = palette.particleIntensity.g * intensity;
      col[i * 3 + 2] = palette.particleIntensity.b * intensity;
    }

    return { positions: pos, colors: col };
  }, [count, scale, palette]);

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
        opacity={isDark ? 0.9 : 0.8}
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
function GridRings({
  animated = true,
  scale = 1,
  isDark = false,
}: {
  animated: boolean;
  scale: number;
  isDark?: boolean;
}) {
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const palette = isDark ? COLORS.dark : COLORS.light;

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
        <meshBasicMaterial color={palette.ring} transparent opacity={isDark ? 0.3 : 0.2} />
      </mesh>
      <mesh ref={ring2Ref} position={[0, 0, 0]}>
        <torusGeometry args={[5 * scale, 0.01, 16, 64]} />
        <meshBasicMaterial color={palette.ring} transparent opacity={isDark ? 0.25 : 0.15} />
      </mesh>
    </>
  );
}

/**
 * Main 3D scene for the hero section.
 * Features a glassy distorted sphere with orbiting particles.
 * "Finance x Physics" aesthetic - clean, professional, subtle.
 *
 * Supports:
 * - Dark/light mode color switching
 * - Scroll-linked parallax (orb rises/sinks based on scroll)
 */
export default function HeroScene({
  speed = 1,
  particleCount = 60,
  orbSize = 2.5,
  animated = true,
  scale = 1,
  scrollProgress = 0,
  isDark = false,
}: HeroSceneProps) {
  const sphereRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const palette = isDark ? COLORS.dark : COLORS.light;

  // Animate sphere and apply scroll-linked parallax
  useFrame((state) => {
    if (!sphereRef.current || !animated) return;

    // Gentle rotation
    sphereRef.current.rotation.y = state.clock.elapsedTime * 0.2 * speed;
    sphereRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3 * speed) * 0.1;

    // Scroll-linked parallax: move the entire scene up as user scrolls down
    if (groupRef.current) {
      // Move orb up by 3 units as scroll progress goes from 0 to 1
      const targetY = scrollProgress * 3;
      // Also slightly scale down and increase opacity
      const targetScale = 1 - scrollProgress * 0.2;

      // Smooth interpolation
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, 0.1);
      groupRef.current.scale.setScalar(THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale, 0.1));
    }
  });

  return (
    <group ref={groupRef}>
      {/* Ambient lighting for soft shadows */}
      <ambientLight intensity={isDark ? 0.5 : 0.4} />

      {/* Key light - adjusts based on theme */}
      <directionalLight
        position={[10, 10, 5]}
        intensity={isDark ? 1.0 : 0.8}
        color={palette.keyLight}
      />

      {/* Fill light from opposite side */}
      <directionalLight
        position={[-10, -5, -5]}
        intensity={isDark ? 0.5 : 0.3}
        color={palette.fillLight}
      />

      {/* Central floating orb - glassy material */}
      <Float
        speed={animated ? 2 * speed : 0}
        rotationIntensity={animated ? 0.3 : 0}
        floatIntensity={animated ? 0.5 : 0}
      >
        <Sphere ref={sphereRef} args={[orbSize * scale, 64, 64]}>
          <MeshDistortMaterial
            color={palette.sphere}
            transparent
            opacity={isDark ? 0.7 : 0.6}
            roughness={0.1}
            metalness={0.8}
            distort={animated ? 0.3 : 0}
            speed={animated ? 2 * speed : 0}
          />
        </Sphere>

        {/* Inner glow sphere */}
        <Sphere args={[orbSize * scale * 0.8, 32, 32]}>
          <meshBasicMaterial
            color={palette.innerGlow}
            transparent
            opacity={isDark ? 0.2 : 0.15}
          />
        </Sphere>
      </Float>

      {/* Orbiting particles */}
      <OrbitingParticles
        count={particleCount}
        animated={animated}
        scale={scale}
        isDark={isDark}
      />

      {/* Subtle grid rings */}
      <GridRings animated={animated} scale={scale} isDark={isDark} />
    </group>
  );
}
