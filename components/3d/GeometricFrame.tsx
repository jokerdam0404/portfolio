'use client';

import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
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

// Animated corner brackets
function CornerBracket({
  position,
  rotation,
  scale = 1,
}: {
  position: [number, number, number];
  rotation: [number, number, number];
  scale?: number;
}) {
  const ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.position.y += Math.sin(state.clock.elapsedTime * 0.5) * 0.001;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.3}>
      <group ref={ref} position={position} rotation={rotation} scale={scale}>
        {/* Horizontal line */}
        <mesh position={[0.3, 0, 0]}>
          <boxGeometry args={[0.6, 0.02, 0.02]} />
          <meshBasicMaterial color="#D4AF37" transparent opacity={0.6} />
        </mesh>
        {/* Vertical line */}
        <mesh position={[0, 0.3, 0]}>
          <boxGeometry args={[0.02, 0.6, 0.02]} />
          <meshBasicMaterial color="#D4AF37" transparent opacity={0.6} />
        </mesh>
      </group>
    </Float>
  );
}

// Orbiting small spheres
function OrbitingSpheres({ radius = 2.5, count = 4 }: { radius?: number; count?: number }) {
  const ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.z = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <group ref={ref}>
      {Array.from({ length: count }).map((_, i) => {
        const angle = (i / count) * Math.PI * 2;
        return (
          <mesh
            key={i}
            position={[Math.cos(angle) * radius, Math.sin(angle) * radius, 0]}
          >
            <sphereGeometry args={[0.05, 16, 16]} />
            <meshBasicMaterial color="#D4AF37" transparent opacity={0.4} />
          </mesh>
        );
      })}
    </group>
  );
}

// Decorative ring
function DecorativeRing({ scale = 1 }: { scale?: number }) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = Math.PI / 2 + Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
      ref.current.rotation.z = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <mesh ref={ref} scale={scale}>
      <torusGeometry args={[2.2, 0.008, 8, 64]} />
      <meshBasicMaterial color="#D4AF37" transparent opacity={0.3} />
    </mesh>
  );
}

// Floating accent dots
function AccentDots() {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (group.current) {
      group.current.rotation.z = state.clock.elapsedTime * 0.02;
    }
  });

  const dots = [
    { pos: [-2.5, 1.8, 0.5], size: 0.04 },
    { pos: [2.3, -1.5, 0.3], size: 0.03 },
    { pos: [-1.8, -2.2, 0.4], size: 0.035 },
    { pos: [2.6, 1.2, 0.2], size: 0.045 },
    { pos: [0.5, 2.5, 0.6], size: 0.03 },
    { pos: [-2.8, 0, 0.3], size: 0.04 },
  ];

  return (
    <group ref={group}>
      {dots.map((dot, i) => (
        <Float key={i} speed={2 + i * 0.3} floatIntensity={0.5}>
          <mesh position={dot.pos as [number, number, number]}>
            <sphereGeometry args={[dot.size, 12, 12]} />
            <meshBasicMaterial color="#D4AF37" transparent opacity={0.5} />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

interface GeometricFrameProps {
  className?: string;
  showCorners?: boolean;
  showRing?: boolean;
  showOrbitingSpheres?: boolean;
  showAccentDots?: boolean;
}

export default function GeometricFrame({
  className = '',
  showCorners = true,
  showRing = true,
  showOrbitingSpheres = true,
  showAccentDots = true,
}: GeometricFrameProps) {
  const reducedMotion = useReducedMotion();

  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false,
  });

  // If reduced motion is preferred, show a static decoration
  if (reducedMotion) {
    return (
      <div ref={ref} className={`w-full h-full ${className}`}>
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-12 h-12 border-l-2 border-t-2 border-gold/30 rounded-tl-lg" />
          <div className="absolute top-0 right-0 w-12 h-12 border-r-2 border-t-2 border-gold/30 rounded-tr-lg" />
          <div className="absolute bottom-0 left-0 w-12 h-12 border-l-2 border-b-2 border-gold/30 rounded-bl-lg" />
          <div className="absolute bottom-0 right-0 w-12 h-12 border-r-2 border-b-2 border-gold/30 rounded-br-lg" />
        </div>
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
          camera={{ position: [0, 0, 5], fov: 50 }}
          style={{ background: 'transparent' }}
        >
          <ambientLight intensity={0.5} />

          {showCorners && (
            <>
              <CornerBracket position={[-1.8, 1.8, 0]} rotation={[0, 0, 0]} />
              <CornerBracket position={[1.8, 1.8, 0]} rotation={[0, 0, -Math.PI / 2]} />
              <CornerBracket position={[1.8, -1.8, 0]} rotation={[0, 0, Math.PI]} />
              <CornerBracket position={[-1.8, -1.8, 0]} rotation={[0, 0, Math.PI / 2]} />
            </>
          )}

          {showRing && <DecorativeRing />}

          {showOrbitingSpheres && <OrbitingSpheres radius={2.3} count={6} />}

          {showAccentDots && <AccentDots />}
        </Canvas>
      )}
    </div>
  );
}
