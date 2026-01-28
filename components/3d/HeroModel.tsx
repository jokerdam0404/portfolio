'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, Group } from 'three';
import { Float, MeshTransmissionMaterial } from '@react-three/drei';

interface HeroModelProps {
    scrollProgress?: number;
}

/**
 * Premium 3D Hero Model
 * A sophisticated geometric composition representing financial precision
 */
export default function HeroModel({ scrollProgress = 0 }: HeroModelProps) {
    const groupRef = useRef<Group>(null);

    const torusRef = useRef<Mesh>(null);
    const sphereRef = useRef<Mesh>(null);
    const cubeRef = useRef<Mesh>(null);

    useFrame((state) => {
        if (!groupRef.current) return;

        // Subtle floating animation
        groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;

        // Scroll-driven rotation
        groupRef.current.rotation.x = scrollProgress * Math.PI * 0.5;

        // Individual element animations
        if (torusRef.current) {
            torusRef.current.rotation.z = state.clock.elapsedTime * 0.3;
        }
        if (cubeRef.current) {
            cubeRef.current.rotation.x = state.clock.elapsedTime * 0.2;
            cubeRef.current.rotation.y = state.clock.elapsedTime * 0.15;
        }
    });

    return (
        <group ref={groupRef} position={[1.5, 0, 0]}>
            {/* Central glass sphere - represents clarity and precision */}
            <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                <mesh ref={sphereRef} position={[0, 0, 0]}>
                    <sphereGeometry args={[1, 64, 64]} />
                    <MeshTransmissionMaterial
                        backside
                        samples={16}
                        thickness={0.5}
                        chromaticAberration={0.05}
                        anisotropy={0.3}
                        distortion={0.1}
                        distortionScale={0.2}
                        temporalDistortion={0.1}
                        iridescence={1}
                        iridescenceIOR={1}
                        iridescenceThicknessRange={[0, 1400]}
                        color="#D4AF37"
                        transmission={0.95}
                        roughness={0.05}
                    />
                </mesh>
            </Float>

            {/* Orbiting torus - represents cycles and returns */}
            <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.3}>
                <mesh ref={torusRef} position={[0, 0, 0]}>
                    <torusGeometry args={[1.8, 0.05, 16, 100]} />
                    <meshStandardMaterial
                        color="#D4AF37"
                        metalness={1}
                        roughness={0.1}
                        emissive="#D4AF37"
                        emissiveIntensity={0.2}
                    />
                </mesh>
            </Float>

            {/* Floating cube - represents structured investments */}
            <Float speed={1} rotationIntensity={1} floatIntensity={0.8}>
                <mesh ref={cubeRef} position={[-2, 0.5, -1]}>
                    <boxGeometry args={[0.6, 0.6, 0.6]} />
                    <meshStandardMaterial
                        color="#1a1a1a"
                        metalness={0.9}
                        roughness={0.1}
                    />
                </mesh>
            </Float>

            {/* Small accent spheres - represent data points */}
            {[...Array(5)].map((_, i) => (
                <Float
                    key={i}
                    speed={2 + i * 0.5}
                    rotationIntensity={0}
                    floatIntensity={0.5}
                >
                    <mesh
                        position={[
                            Math.cos(i * Math.PI * 0.4) * 2.5,
                            Math.sin(i * Math.PI * 0.4) * 1.5,
                            Math.sin(i * Math.PI * 0.3) * 0.5,
                        ]}
                    >
                        <sphereGeometry args={[0.08, 16, 16]} />
                        <meshStandardMaterial
                            color="#D4AF37"
                            metalness={1}
                            roughness={0}
                            emissive="#D4AF37"
                            emissiveIntensity={0.5}
                        />
                    </mesh>
                </Float>
            ))}
        </group>
    );
}
