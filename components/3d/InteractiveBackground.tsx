'use client';

import { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
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

// Interactive particle system that follows mouse
function InteractiveParticles({
  count = 100,
  mousePosition,
}: {
  count?: number;
  mousePosition: React.MutableRefObject<{ x: number; y: number }>;
}) {
  const points = useRef<THREE.Points>(null);
  const { viewport } = useThree();

  // Generate initial positions and velocities
  const [geometry, velocitiesRef] = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 5;

      vel[i * 3] = (Math.random() - 0.5) * 0.02;
      vel[i * 3 + 1] = (Math.random() - 0.5) * 0.02;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.01;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    return [geo, { current: vel }];
  }, [count]);

  useFrame((state) => {
    if (!points.current) return;

    const positionAttr = points.current.geometry.attributes.position;
    const positions = positionAttr.array as Float32Array;
    const mouse = mousePosition.current;

    for (let i = 0; i < count; i++) {
      const idx = i * 3;

      // Calculate distance from mouse
      const dx = mouse.x * viewport.width - positions[idx];
      const dy = mouse.y * viewport.height - positions[idx + 1];
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Repel particles from mouse
      if (dist < 2 && dist > 0.01) {
        const force = (2 - dist) / 2;
        velocitiesRef.current[idx] -= (dx / dist) * force * 0.02;
        velocitiesRef.current[idx + 1] -= (dy / dist) * force * 0.02;
      }

      // Apply velocity
      positions[idx] += velocitiesRef.current[idx];
      positions[idx + 1] += velocitiesRef.current[idx + 1];
      positions[idx + 2] += velocitiesRef.current[idx + 2];

      // Apply damping
      velocitiesRef.current[idx] *= 0.98;
      velocitiesRef.current[idx + 1] *= 0.98;
      velocitiesRef.current[idx + 2] *= 0.98;

      // Boundary wrapping
      const bounds = 5;
      if (positions[idx] > bounds) positions[idx] = -bounds;
      if (positions[idx] < -bounds) positions[idx] = bounds;
      if (positions[idx + 1] > bounds) positions[idx + 1] = -bounds;
      if (positions[idx + 1] < -bounds) positions[idx + 1] = bounds;
    }

    positionAttr.needsUpdate = true;

    // Subtle rotation
    points.current.rotation.z = state.clock.elapsedTime * 0.01;
  });

  return (
    <points ref={points} geometry={geometry}>
      <pointsMaterial
        size={0.05}
        color="#D4AF37"
        transparent
        opacity={0.4}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Grid lines in the background
function GridLines() {
  const ref = useRef<THREE.Group>(null);
  const { viewport } = useThree();

  const lines = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const positions: number[] = [];

    // Horizontal lines
    for (let i = -10; i <= 10; i++) {
      positions.push(-viewport.width * 2, i * 1.5, -5);
      positions.push(viewport.width * 2, i * 1.5, -5);
    }

    // Vertical lines
    for (let i = -20; i <= 20; i++) {
      positions.push(i * 1.5, -viewport.height * 2, -5);
      positions.push(i * 1.5, viewport.height * 2, -5);
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    return geometry;
  }, [viewport]);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.05) * 0.02;
      ref.current.rotation.y = Math.cos(state.clock.elapsedTime * 0.05) * 0.02;
    }
  });

  return (
    <group ref={ref}>
      <lineSegments geometry={lines}>
        <lineBasicMaterial color="#D4AF37" transparent opacity={0.05} />
      </lineSegments>
    </group>
  );
}

// Floating data visualization rings
function DataRings() {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (group.current) {
      group.current.rotation.z = state.clock.elapsedTime * 0.1;
      group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
    }
  });

  return (
    <group ref={group} position={[0, 0, -3]}>
      {[1, 1.5, 2, 2.5].map((radius, i) => (
        <mesh key={i} rotation={[Math.PI / 2 + i * 0.1, 0, 0]}>
          <torusGeometry args={[radius, 0.01, 8, 64]} />
          <meshBasicMaterial
            color="#D4AF37"
            transparent
            opacity={0.15 - i * 0.03}
          />
        </mesh>
      ))}
    </group>
  );
}

interface InteractiveBackgroundProps {
  className?: string;
  particleCount?: number;
  showGrid?: boolean;
  showRings?: boolean;
  intensity?: 'low' | 'medium' | 'high';
}

export default function InteractiveBackground({
  className = '',
  particleCount = 80,
  showGrid = true,
  showRings = true,
  intensity = 'medium',
}: InteractiveBackgroundProps) {
  const mousePosition = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  const { ref: viewRef, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false,
  });

  // Track mouse position
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        mousePosition.current = {
          x: ((e.clientX - rect.left) / rect.width) * 2 - 1,
          y: -((e.clientY - rect.top) / rect.height) * 2 + 1,
        };
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Adjust particle count based on intensity
  const adjustedParticleCount = {
    low: Math.floor(particleCount * 0.5),
    medium: particleCount,
    high: Math.floor(particleCount * 1.5),
  }[intensity];

  // If reduced motion is preferred, show a static gradient instead
  if (reducedMotion) {
    return (
      <div ref={viewRef} className={`w-full h-full ${className}`}>
        <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-gold/3" />
      </div>
    );
  }

  return (
    <div
      ref={(el) => {
        containerRef.current = el;
        if (typeof viewRef === 'function') {
          viewRef(el);
        }
      }}
      className={`w-full h-full ${className}`}
    >
      {inView && (
        <Canvas
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
          }}
          dpr={[1, 1.5]}
          camera={{ position: [0, 0, 5], fov: 60 }}
          style={{ background: 'transparent' }}
        >
          <ambientLight intensity={0.2} />

          {showGrid && <GridLines />}
          {showRings && <DataRings />}

          <InteractiveParticles
            count={adjustedParticleCount}
            mousePosition={mousePosition}
          />
        </Canvas>
      )}
    </div>
  );
}
