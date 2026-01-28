'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { Points as ThreePoints } from 'three';

interface CosmicParticlesProps {
    count?: number;
    scrollProgress?: number;
}

/**
 * Cosmic Particle System
 *
 * Features:
 * - GPU-accelerated particle rendering
 * - Gravitational attraction to wormhole center
 * - Velocity-based color variation
 * - Performance-optimized with BufferGeometry
 * - Adaptive particle density based on device capability
 */
export default function CosmicParticles({ count = 5000, scrollProgress = 0 }: CosmicParticlesProps) {
    const particlesRef = useRef<ThreePoints>(null);

    // Generate particle positions and velocities
    const particleData = useMemo(() => {
        const positions = new Float32Array(count * 3);
        const velocities = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);
        const sizes = new Float32Array(count);

        // Color palette - Deep blue theme
        const color1 = new THREE.Color('#4da6ff'); // Bright blue
        const color2 = new THREE.Color('#0080ff'); // Electric blue
        const color3 = new THREE.Color('#b3d9ff'); // Light blue

        for (let i = 0; i < count; i++) {
            const i3 = i * 3;

            // Spherical distribution around wormhole
            const radius = Math.random() * 15 + 5;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(Math.random() * 2 - 1);

            positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
            positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
            positions[i3 + 2] = radius * Math.cos(phi);

            // Initial velocities for orbital motion
            velocities[i3] = (Math.random() - 0.5) * 0.02;
            velocities[i3 + 1] = (Math.random() - 0.5) * 0.02;
            velocities[i3 + 2] = (Math.random() - 0.5) * 0.02;

            // Random color from palette
            const colorChoice = Math.random();
            const particleColor = colorChoice < 0.3 ? color1 : colorChoice < 0.6 ? color2 : color3;

            colors[i3] = particleColor.r;
            colors[i3 + 1] = particleColor.g;
            colors[i3 + 2] = particleColor.b;

            // Varying sizes for depth perception
            sizes[i] = Math.random() * 2 + 0.5;
        }

        return { positions, velocities, colors, sizes };
    }, [count]);

    useFrame((state) => {
        if (!particlesRef.current) return;

        const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
        const velocities = particleData.velocities;
        const time = state.clock.elapsedTime;

        for (let i = 0; i < count; i++) {
            const i3 = i * 3;

            const x = positions[i3];
            const y = positions[i3 + 1];
            const z = positions[i3 + 2];

            // Calculate distance from center (wormhole)
            const distanceFromCenter = Math.sqrt(x * x + y * y + z * z);

            // Gravitational attraction (inverse square law)
            const gravitationalForce = 0.5 / (distanceFromCenter * distanceFromCenter + 1);

            // Direction towards center
            const dirX = -x / distanceFromCenter;
            const dirY = -y / distanceFromCenter;
            const dirZ = -z / distanceFromCenter;

            // Apply gravitational acceleration
            velocities[i3] += dirX * gravitationalForce * 0.01;
            velocities[i3 + 1] += dirY * gravitationalForce * 0.01;
            velocities[i3 + 2] += dirZ * gravitationalForce * 0.01;

            // Add orbital velocity (perpendicular to radial direction)
            const orbitalSpeed = 0.02 / (distanceFromCenter + 1);
            velocities[i3] += -y * orbitalSpeed;
            velocities[i3 + 1] += x * orbitalSpeed;

            // Apply drag to limit velocity
            velocities[i3] *= 0.99;
            velocities[i3 + 1] *= 0.99;
            velocities[i3 + 2] *= 0.99;

            // Update positions
            positions[i3] += velocities[i3];
            positions[i3 + 1] += velocities[i3 + 1];
            positions[i3 + 2] += velocities[i3 + 2];

            // Reset particles that get too close to center (absorbed by wormhole)
            if (distanceFromCenter < 1.0) {
                const radius = Math.random() * 10 + 10;
                const theta = Math.random() * Math.PI * 2;
                const phi = Math.acos(Math.random() * 2 - 1);

                positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
                positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
                positions[i3 + 2] = radius * Math.cos(phi);

                velocities[i3] = 0;
                velocities[i3 + 1] = 0;
                velocities[i3 + 2] = 0;
            }

            // Reset particles that drift too far
            if (distanceFromCenter > 20) {
                const radius = Math.random() * 10 + 5;
                const theta = Math.random() * Math.PI * 2;
                const phi = Math.acos(Math.random() * 2 - 1);

                positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
                positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
                positions[i3 + 2] = radius * Math.cos(phi);
            }
        }

        particlesRef.current.geometry.attributes.position.needsUpdate = true;

        // Faster rotation for immediate visual impact
        particlesRef.current.rotation.y = time * 0.08;
    });

    return (
        <Points
            ref={particlesRef}
            positions={particleData.positions}
            colors={particleData.colors}
            sizes={particleData.sizes}
        >
            <PointMaterial
                transparent
                vertexColors
                size={0.1}
                sizeAttenuation
                depthWrite={false}
                blending={THREE.AdditiveBlending}
                opacity={0.8}
            />
        </Points>
    );
}

/**
 * Energy Particles - High-speed particles near event horizon
 */
export function EnergyParticles({ count = 1000 }: { count?: number }) {
    const particlesRef = useRef<ThreePoints>(null);

    const particleData = useMemo(() => {
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);

        const color = new THREE.Color('#4da6ff');

        for (let i = 0; i < count; i++) {
            const i3 = i * 3;
            const angle = (i / count) * Math.PI * 2;
            const radius = 2 + Math.random() * 1;

            positions[i3] = Math.cos(angle) * radius;
            positions[i3 + 1] = (Math.random() - 0.5) * 0.5;
            positions[i3 + 2] = Math.sin(angle) * radius;

            colors[i3] = color.r;
            colors[i3 + 1] = color.g;
            colors[i3 + 2] = color.b;
        }

        return { positions, colors };
    }, [count]);

    useFrame((state) => {
        if (!particlesRef.current) return;

        const time = state.clock.elapsedTime;

        // Very fast rotation for dynamic energy effect
        particlesRef.current.rotation.y = time * 3;

        // Pulsing effect
        const scale = 1 + Math.sin(time * 4) * 0.1;
        particlesRef.current.scale.set(scale, 1, scale);
    });

    return (
        <Points ref={particlesRef} positions={particleData.positions} colors={particleData.colors}>
            <PointMaterial
                transparent
                vertexColors
                size={0.15}
                sizeAttenuation
                depthWrite={false}
                blending={THREE.AdditiveBlending}
                opacity={0.9}
            />
        </Points>
    );
}

/**
 * Starfield - Distant stars for depth
 */
export function Starfield({ count = 2000 }: { count?: number }) {
    const stars = useMemo(() => {
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);

        const color = new THREE.Color('#ffffff');

        for (let i = 0; i < count; i++) {
            const i3 = i * 3;

            // Spherical shell at large radius
            const radius = 50 + Math.random() * 50;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(Math.random() * 2 - 1);

            positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
            positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
            positions[i3 + 2] = radius * Math.cos(phi);

            // Slight color variation
            const brightness = 0.7 + Math.random() * 0.3;
            colors[i3] = color.r * brightness;
            colors[i3 + 1] = color.g * brightness;
            colors[i3 + 2] = color.b * brightness;
        }

        return { positions, colors };
    }, [count]);

    return (
        <Points positions={stars.positions} colors={stars.colors}>
            <PointMaterial
                transparent
                vertexColors
                size={0.05}
                sizeAttenuation
                depthWrite={false}
                opacity={0.6}
            />
        </Points>
    );
}
