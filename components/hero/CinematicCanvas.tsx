"use client";

import { Suspense, useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Float, MeshReflectorMaterial, Text, useTexture } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette, DepthOfField, Noise } from "@react-three/postprocessing";
import * as THREE from "three";

interface CinematicCanvasProps {
  scrollProgress: number;
  isMobile: boolean;
  introComplete: boolean;
}

/**
 * CinematicCanvas - The 3D canvas for the cinematic hero
 *
 * Contains three scenes that blend together:
 * - Stairs scene (0-0.33)
 * - Black hole transition (0.33-0.66)
 * - Trading floor (0.66-1.0)
 */
export default function CinematicCanvas({ scrollProgress, isMobile, introComplete }: CinematicCanvasProps) {
  // Mobile optimizations
  const dpr = isMobile ? 1 : Math.min(window.devicePixelRatio, 1.5);

  return (
    <div className="absolute inset-0">
      <Canvas
        dpr={dpr}
        camera={{ position: [0, 2, 10], fov: 50 }}
        gl={{
          antialias: !isMobile,
          alpha: true,
          powerPreference: "high-performance",
          stencil: false,
        }}
      >
        <Suspense fallback={null}>
          {/* Environment for realistic lighting */}
          <Environment preset="night" />

          {/* Main scene content */}
          <CinematicScene scrollProgress={scrollProgress} isMobile={isMobile} />

          {/* Postprocessing effects */}
          {!isMobile && (
            <EffectComposer multisampling={0}>
              <Bloom
                intensity={0.5}
                luminanceThreshold={0.6}
                luminanceSmoothing={0.9}
                mipmapBlur
              />
              <DepthOfField
                focusDistance={0}
                focalLength={0.02}
                bokehScale={3}
                height={480}
              />
              <Vignette eskil={false} offset={0.1} darkness={0.5} />
              <Noise opacity={0.015} />
            </EffectComposer>
          )}
        </Suspense>
      </Canvas>
    </div>
  );
}

/**
 * Main scene that interpolates between the three cinematic stages
 */
function CinematicScene({ scrollProgress, isMobile }: { scrollProgress: number; isMobile: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const { camera } = useThree();

  // Determine which scene we're in (with smooth transitions)
  const scene1Weight = Math.max(0, 1 - scrollProgress * 3);
  const scene2Weight = scrollProgress > 0.2 && scrollProgress < 0.8
    ? Math.sin((scrollProgress - 0.2) * Math.PI / 0.6)
    : 0;
  const scene3Weight = Math.max(0, (scrollProgress - 0.6) * 2.5);

  // Animate camera based on scroll
  useFrame((state) => {
    const time = state.clock.elapsedTime;

    // Camera positions for each scene
    // Scene 1: Behind and above, looking down stairs
    // Scene 2: Accelerating forward through tunnel
    // Scene 3: Settled on trading floor

    const pos1 = new THREE.Vector3(0, 3, 12);
    const pos2 = new THREE.Vector3(0, 0, 5 - scrollProgress * 15);
    const pos3 = new THREE.Vector3(0, 2, 8);

    // Interpolate camera position
    const targetPos = new THREE.Vector3()
      .addScaledVector(pos1, scene1Weight)
      .addScaledVector(pos2, scene2Weight)
      .addScaledVector(pos3, scene3Weight);

    // Add subtle camera shake/drift
    const drift = 0.1;
    targetPos.x += Math.sin(time * 0.3) * drift;
    targetPos.y += Math.cos(time * 0.2) * drift * 0.5;

    // Smooth camera movement
    camera.position.lerp(targetPos, 0.05);

    // Look at target
    const lookAt1 = new THREE.Vector3(0, 0, 0);
    const lookAt2 = new THREE.Vector3(0, 0, -20);
    const lookAt3 = new THREE.Vector3(0, 1, 0);

    const targetLookAt = new THREE.Vector3()
      .addScaledVector(lookAt1, scene1Weight)
      .addScaledVector(lookAt2, scene2Weight)
      .addScaledVector(lookAt3, scene3Weight);

    camera.lookAt(targetLookAt);

    // FOV changes for dramatic effect
    const baseFov = 50;
    const tunnelFov = 75; // Wider during black hole
    const targetFov = THREE.MathUtils.lerp(
      THREE.MathUtils.lerp(baseFov, tunnelFov, scene2Weight),
      baseFov,
      scene3Weight
    );
    (camera as THREE.PerspectiveCamera).fov = THREE.MathUtils.lerp(
      (camera as THREE.PerspectiveCamera).fov,
      targetFov,
      0.05
    );
    (camera as THREE.PerspectiveCamera).updateProjectionMatrix();
  });

  return (
    <group ref={groupRef}>
      {/* Ambient and directional lighting */}
      <ambientLight intensity={0.3} />
      <directionalLight position={[10, 10, 5]} intensity={0.8} color="#E0E7FF" castShadow />
      <directionalLight position={[-5, 5, -5]} intensity={0.3} color="#60A5FA" />

      {/* Scene 1: Stairs */}
      <group visible={scene1Weight > 0.01}>
        <StairsScene weight={scene1Weight} isMobile={isMobile} scrollProgress={scrollProgress} />
      </group>

      {/* Scene 2: Black Hole Tunnel */}
      <group visible={scene2Weight > 0.01}>
        <BlackHoleScene weight={scene2Weight} scrollProgress={scrollProgress} isMobile={isMobile} />
      </group>

      {/* Scene 3: Trading Floor */}
      <group visible={scene3Weight > 0.01}>
        <TradingFloorScene weight={scene3Weight} scrollProgress={scrollProgress} isMobile={isMobile} />
      </group>
    </group>
  );
}

/**
 * Scene 1: Stairs with walking figure silhouette
 */
function StairsScene({ weight, isMobile, scrollProgress }: { weight: number; isMobile: boolean; scrollProgress: number }) {
  const stairsRef = useRef<THREE.Group>(null);
  const figureRef = useRef<THREE.Group>(null);

  // Generate stairs geometry
  const stairs = useMemo(() => {
    const steps = [];
    const stepCount = isMobile ? 10 : 15;
    for (let i = 0; i < stepCount; i++) {
      steps.push({
        position: [0, i * 0.3, -i * 0.5] as [number, number, number],
        index: i,
      });
    }
    return steps;
  }, [isMobile]);

  // Animate figure walking
  useFrame((state) => {
    if (!figureRef.current) return;
    const time = state.clock.elapsedTime;

    // Walking motion - figure bobs up and down and moves up the stairs
    const walkCycle = time * 2;
    const bobAmount = Math.sin(walkCycle * Math.PI) * 0.05;
    const swayAmount = Math.sin(walkCycle * Math.PI * 0.5) * 0.02;

    // Progress up stairs based on scroll
    const stairProgress = scrollProgress * 8;
    figureRef.current.position.set(
      swayAmount,
      1.2 + stairProgress * 0.3 + bobAmount,
      -stairProgress * 0.5
    );
  });

  return (
    <group ref={stairsRef} position={[0, -3, 0]} rotation={[0.1, 0, 0]}>
      {/* Stairs */}
      {stairs.map((step, i) => (
        <mesh key={i} position={step.position} castShadow receiveShadow>
          <boxGeometry args={[4, 0.3, 0.5]} />
          <meshStandardMaterial
            color="#1E293B"
            metalness={0.3}
            roughness={0.7}
            opacity={weight}
            transparent
          />
        </mesh>
      ))}

      {/* Side rails */}
      <mesh position={[-2.2, 2.5, -3.5]} rotation={[-0.55, 0, 0]}>
        <boxGeometry args={[0.08, 6, 0.08]} />
        <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[2.2, 2.5, -3.5]} rotation={[-0.55, 0, 0]}>
        <boxGeometry args={[0.08, 6, 0.08]} />
        <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Walking figure silhouette */}
      <group ref={figureRef} position={[0, 1.2, 0]}>
        <WalkingFigure weight={weight} />
      </group>

      {/* Ambient particles */}
      <StairsParticles count={isMobile ? 30 : 60} weight={weight} />

      {/* Floor/ground */}
      <mesh position={[0, -0.15, 2]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 10]} />
        <MeshReflectorMaterial
          blur={[300, 100]}
          resolution={isMobile ? 512 : 1024}
          mixBlur={1}
          mixStrength={40}
          roughness={0.8}
          depthScale={1.2}
          color="#0F172A"
          metalness={0.4}
          mirror={0.5}
        />
      </mesh>
    </group>
  );
}

/**
 * Stylized walking figure (silhouette)
 */
function WalkingFigure({ weight }: { weight: number }) {
  const figureRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!figureRef.current) return;
    const time = state.clock.elapsedTime;

    // Animate limbs for walking motion
    const walkPhase = time * 3;
    figureRef.current.children.forEach((child, i) => {
      if (i === 1 || i === 2) { // Arms
        (child as THREE.Mesh).rotation.x = Math.sin(walkPhase + i * Math.PI) * 0.4;
      }
      if (i === 3 || i === 4) { // Legs
        (child as THREE.Mesh).rotation.x = Math.sin(walkPhase + i * Math.PI) * 0.5;
      }
    });
  });

  return (
    <group ref={figureRef} scale={0.8}>
      {/* Head */}
      <mesh position={[0, 0.9, 0]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color="#1E40AF" metalness={0.5} roughness={0.3} opacity={weight} transparent />
      </mesh>

      {/* Torso */}
      <mesh position={[0, 0.5, 0]}>
        <capsuleGeometry args={[0.12, 0.4, 8, 16]} />
        <meshStandardMaterial color="#1E40AF" metalness={0.5} roughness={0.3} opacity={weight} transparent />
      </mesh>

      {/* Left Arm */}
      <mesh position={[-0.2, 0.55, 0]} rotation={[0, 0, 0.2]}>
        <capsuleGeometry args={[0.04, 0.35, 4, 8]} />
        <meshStandardMaterial color="#1E40AF" metalness={0.5} roughness={0.3} opacity={weight} transparent />
      </mesh>

      {/* Right Arm */}
      <mesh position={[0.2, 0.55, 0]} rotation={[0, 0, -0.2]}>
        <capsuleGeometry args={[0.04, 0.35, 4, 8]} />
        <meshStandardMaterial color="#1E40AF" metalness={0.5} roughness={0.3} opacity={weight} transparent />
      </mesh>

      {/* Left Leg */}
      <mesh position={[-0.08, 0.05, 0]}>
        <capsuleGeometry args={[0.05, 0.4, 4, 8]} />
        <meshStandardMaterial color="#1E40AF" metalness={0.5} roughness={0.3} opacity={weight} transparent />
      </mesh>

      {/* Right Leg */}
      <mesh position={[0.08, 0.05, 0]}>
        <capsuleGeometry args={[0.05, 0.4, 4, 8]} />
        <meshStandardMaterial color="#1E40AF" metalness={0.5} roughness={0.3} opacity={weight} transparent />
      </mesh>
    </group>
  );
}

/**
 * Ambient particles for stairs scene
 */
function StairsParticles({ count, weight }: { count: number; weight: number }) {
  const particlesRef = useRef<THREE.Points>(null);

  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 15;
      pos[i * 3 + 1] = Math.random() * 8;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 15;

      const intensity = 0.5 + Math.random() * 0.5;
      col[i * 3] = 0.4 * intensity;
      col[i * 3 + 1] = 0.6 * intensity;
      col[i * 3 + 2] = 1.0 * intensity;
    }

    return { positions: pos, colors: col };
  }, [count]);

  useFrame((state) => {
    if (!particlesRef.current) return;
    particlesRef.current.rotation.y = state.clock.elapsedTime * 0.02;
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        vertexColors
        transparent
        opacity={weight * 0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/**
 * Scene 2: Black Hole / Warp Tunnel
 */
function BlackHoleScene({ weight, scrollProgress, isMobile }: { weight: number; scrollProgress: number; isMobile: boolean }) {
  const tunnelRef = useRef<THREE.Group>(null);
  const particleCount = isMobile ? 200 : 500;

  // Tunnel particles
  const { positions, colors, velocities } = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const col = new Float32Array(particleCount * 3);
    const vel = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 2 + Math.random() * 6;
      const z = (Math.random() - 0.5) * 40;

      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = Math.sin(angle) * radius;
      pos[i * 3 + 2] = z;

      // Velocity towards center
      vel[i * 3] = -Math.cos(angle) * 0.01;
      vel[i * 3 + 1] = -Math.sin(angle) * 0.01;
      vel[i * 3 + 2] = -0.1 - Math.random() * 0.1;

      // Color gradient from blue to white
      const t = Math.random();
      col[i * 3] = 0.4 + t * 0.6;
      col[i * 3 + 1] = 0.6 + t * 0.4;
      col[i * 3 + 2] = 1.0;
    }

    return { positions: pos, colors: col, velocities: vel };
  }, [particleCount]);

  useFrame((state) => {
    if (!tunnelRef.current) return;
    tunnelRef.current.rotation.z = state.clock.elapsedTime * 0.5;
  });

  return (
    <group ref={tunnelRef}>
      {/* Vortex particles */}
      <VortexParticles positions={positions} colors={colors} weight={weight} />

      {/* Central black hole */}
      <mesh position={[0, 0, -15]}>
        <sphereGeometry args={[2, 32, 32]} />
        <meshBasicMaterial color="#000000" />
      </mesh>

      {/* Accretion disk */}
      <AccretionDisk weight={weight} />

      {/* Tunnel rings */}
      {!isMobile && Array.from({ length: 8 }).map((_, i) => (
        <TunnelRing key={i} index={i} weight={weight} scrollProgress={scrollProgress} />
      ))}

      {/* Light beams */}
      <LightBeams weight={weight} />
    </group>
  );
}

/**
 * Vortex particles for black hole scene
 */
function VortexParticles({ positions, colors, weight }: { positions: Float32Array; colors: Float32Array; weight: number }) {
  const pointsRef = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const time = state.clock.elapsedTime;
    const posArray = pointsRef.current.geometry.attributes.position.array as Float32Array;

    for (let i = 0; i < posArray.length / 3; i++) {
      // Spiral motion
      const x = posArray[i * 3];
      const y = posArray[i * 3 + 1];
      const angle = Math.atan2(y, x) + 0.02;
      const radius = Math.sqrt(x * x + y * y) * 0.995;

      posArray[i * 3] = Math.cos(angle) * radius;
      posArray[i * 3 + 1] = Math.sin(angle) * radius;
      posArray[i * 3 + 2] -= 0.15;

      // Reset particles that go past camera
      if (posArray[i * 3 + 2] < -20 || radius < 0.5) {
        const newAngle = Math.random() * Math.PI * 2;
        const newRadius = 2 + Math.random() * 6;
        posArray[i * 3] = Math.cos(newAngle) * newRadius;
        posArray[i * 3 + 1] = Math.sin(newAngle) * newRadius;
        posArray[i * 3 + 2] = 20;
      }
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        vertexColors
        transparent
        opacity={weight * 0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/**
 * Glowing accretion disk
 */
function AccretionDisk({ weight }: { weight: number }) {
  const diskRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!diskRef.current) return;
    diskRef.current.rotation.z = state.clock.elapsedTime * 0.3;
  });

  return (
    <mesh ref={diskRef} position={[0, 0, -14]} rotation={[Math.PI / 3, 0, 0]}>
      <torusGeometry args={[4, 1, 16, 64]} />
      <meshStandardMaterial
        color="#60A5FA"
        emissive="#3B82F6"
        emissiveIntensity={2}
        transparent
        opacity={weight * 0.7}
        metalness={0.8}
        roughness={0.2}
      />
    </mesh>
  );
}

/**
 * Tunnel ring for depth perception
 */
function TunnelRing({ index, weight, scrollProgress }: { index: number; weight: number; scrollProgress: number }) {
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ringRef.current) return;
    ringRef.current.rotation.z = state.clock.elapsedTime * (0.1 + index * 0.05);
  });

  const z = -index * 3;

  return (
    <mesh ref={ringRef} position={[0, 0, z]}>
      <torusGeometry args={[4 + index * 0.5, 0.02, 8, 64]} />
      <meshBasicMaterial
        color="#60A5FA"
        transparent
        opacity={weight * (0.3 - index * 0.03)}
      />
    </mesh>
  );
}

/**
 * Light beams shooting through tunnel
 */
function LightBeams({ weight }: { weight: number }) {
  const beamCount = 6;

  return (
    <group>
      {Array.from({ length: beamCount }).map((_, i) => {
        const angle = (i / beamCount) * Math.PI * 2;
        const radius = 3;

        return (
          <mesh
            key={i}
            position={[Math.cos(angle) * radius, Math.sin(angle) * radius, 0]}
            rotation={[0, 0, angle]}
          >
            <boxGeometry args={[0.05, 40, 0.05]} />
            <meshBasicMaterial
              color="#93C5FD"
              transparent
              opacity={weight * 0.3}
            />
          </mesh>
        );
      })}
    </group>
  );
}

/**
 * Scene 3: Trading Floor
 */
function TradingFloorScene({ weight, scrollProgress, isMobile }: { weight: number; scrollProgress: number; isMobile: boolean }) {
  return (
    <group position={[0, 0, 0]}>
      {/* Floor */}
      <mesh position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[30, 30]} />
        <MeshReflectorMaterial
          blur={[400, 100]}
          resolution={isMobile ? 512 : 1024}
          mixBlur={1}
          mixStrength={15}
          roughness={0.7}
          depthScale={1}
          color="#0F172A"
          metalness={0.5}
          mirror={0.3}
        />
      </mesh>

      {/* Monitor walls */}
      <MonitorWall position={[-8, 2, -5]} rotation={[0, 0.3, 0]} weight={weight} />
      <MonitorWall position={[8, 2, -5]} rotation={[0, -0.3, 0]} weight={weight} />
      <MonitorWall position={[0, 2, -10]} rotation={[0, 0, 0]} weight={weight} scale={1.5} />

      {/* Trading desks */}
      {!isMobile && (
        <>
          <TradingDesk position={[-4, 0, 2]} rotation={[0, 0.2, 0]} weight={weight} />
          <TradingDesk position={[4, 0, 2]} rotation={[0, -0.2, 0]} weight={weight} />
          <TradingDesk position={[0, 0, 5]} rotation={[0, 0, 0]} weight={weight} />
        </>
      )}

      {/* Ticker tape */}
      <TickerTape position={[0, 4.5, -8]} weight={weight} />

      {/* Ambient lighting */}
      <pointLight position={[0, 5, 0]} intensity={50} color="#60A5FA" distance={15} />
      <pointLight position={[-5, 3, 5]} intensity={30} color="#3B82F6" distance={10} />
      <pointLight position={[5, 3, 5]} intensity={30} color="#3B82F6" distance={10} />

      {/* Volumetric fog effect particles */}
      <TradingFloorParticles count={isMobile ? 50 : 150} weight={weight} />
    </group>
  );
}

/**
 * Monitor wall with glowing screens
 */
function MonitorWall({ position, rotation, weight, scale = 1 }: { position: [number, number, number]; rotation: [number, number, number]; weight: number; scale?: number }) {
  const monitorsRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!monitorsRef.current) return;
    // Subtle screen flicker
    monitorsRef.current.children.forEach((child, i) => {
      const mesh = child as THREE.Mesh;
      const material = mesh.material as THREE.MeshStandardMaterial;
      if (material.emissiveIntensity !== undefined) {
        material.emissiveIntensity = 1 + Math.sin(state.clock.elapsedTime * 3 + i) * 0.2;
      }
    });
  });

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <group ref={monitorsRef}>
        {/* 3x3 grid of monitors */}
        {Array.from({ length: 9 }).map((_, i) => {
          const col = i % 3;
          const row = Math.floor(i / 3);
          const isGreen = Math.random() > 0.4;

          return (
            <mesh
              key={i}
              position={[(col - 1) * 1.8, (row - 1) * 1.2, 0]}
            >
              <boxGeometry args={[1.6, 1, 0.1]} />
              <meshStandardMaterial
                color="#0F172A"
                emissive={isGreen ? "#10B981" : "#EF4444"}
                emissiveIntensity={1}
                metalness={0.8}
                roughness={0.2}
                transparent
                opacity={weight}
              />
            </mesh>
          );
        })}
      </group>

      {/* Frame */}
      <mesh position={[0, 0, -0.1]}>
        <boxGeometry args={[6, 4, 0.1]} />
        <meshStandardMaterial color="#1E293B" metalness={0.6} roughness={0.4} transparent opacity={weight} />
      </mesh>
    </group>
  );
}

/**
 * Trading desk with monitors
 */
function TradingDesk({ position, rotation, weight }: { position: [number, number, number]; rotation: [number, number, number]; weight: number }) {
  return (
    <group position={position} rotation={rotation}>
      {/* Desk surface */}
      <mesh position={[0, 0.4, 0]}>
        <boxGeometry args={[2.5, 0.05, 1.2]} />
        <meshStandardMaterial color="#1E293B" metalness={0.5} roughness={0.5} transparent opacity={weight} />
      </mesh>

      {/* Desk legs */}
      {[[-1, 0], [1, 0]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.2, z * 0.4]}>
          <boxGeometry args={[0.05, 0.4, 0.05]} />
          <meshStandardMaterial color="#334155" metalness={0.7} roughness={0.3} transparent opacity={weight} />
        </mesh>
      ))}

      {/* Small monitors */}
      <mesh position={[0, 0.7, -0.3]}>
        <boxGeometry args={[1.2, 0.5, 0.05]} />
        <meshStandardMaterial
          color="#0F172A"
          emissive="#3B82F6"
          emissiveIntensity={0.8}
          transparent
          opacity={weight}
        />
      </mesh>
    </group>
  );
}

/**
 * Animated ticker tape
 */
function TickerTape({ position, weight }: { position: [number, number, number]; weight: number }) {
  const textRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!textRef.current) return;
    textRef.current.position.x = ((state.clock.elapsedTime * 2) % 30) - 15;
  });

  return (
    <group position={position}>
      {/* Background bar */}
      <mesh>
        <boxGeometry args={[25, 0.6, 0.1]} />
        <meshStandardMaterial color="#0F172A" transparent opacity={weight * 0.9} />
      </mesh>

      {/* Ticker symbols - using basic shapes instead of Text for performance */}
      <group ref={textRef}>
        {["▲ AAPL +2.4%", "▲ MSFT +1.8%", "▼ GOOGL -0.5%", "▲ AMZN +3.1%"].map((text, i) => (
          <mesh key={i} position={[i * 6 - 9, 0, 0.1]}>
            <boxGeometry args={[4, 0.4, 0.01]} />
            <meshBasicMaterial
              color={text.includes("▲") ? "#10B981" : "#EF4444"}
              transparent
              opacity={weight}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}

/**
 * Ambient particles for trading floor atmosphere
 */
function TradingFloorParticles({ count, weight }: { count: number; weight: number }) {
  const particlesRef = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = Math.random() * 6;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return pos;
  }, [count]);

  useFrame((state) => {
    if (!particlesRef.current) return;
    particlesRef.current.rotation.y = state.clock.elapsedTime * 0.02;
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#60A5FA"
        transparent
        opacity={weight * 0.4}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
