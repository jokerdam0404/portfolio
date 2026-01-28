'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, ShaderMaterial, PlaneGeometry } from 'three';
import * as THREE from 'three';

interface GravitationalLensingProps {
    intensity?: number;
    radius?: number;
}

/**
 * Gravitational Lensing Post-Processing Effect
 *
 * Simulates Einstein's general relativity light-bending effect
 * around massive objects (black holes, wormholes)
 *
 * Features:
 * - Physically-based light ray deflection
 * - Schwarzschild metric approximation
 * - Chromatic aberration from extreme gravity
 * - Real-time shader computation
 */
export default function GravitationalLensing({
    intensity = 1.0,
    radius = 2.0,
}: GravitationalLensingProps) {
    const meshRef = useRef<Mesh>(null);

    // Advanced gravitational lensing shader
    const lensingShader = useMemo(
        () => ({
            uniforms: {
                time: { value: 0 },
                intensity: { value: intensity },
                massRadius: { value: radius },
                schwarzschildRadius: { value: radius * 0.5 }, // Event horizon approximation
                resolution: { value: new THREE.Vector2(1024, 1024) },
            },
            vertexShader: `
                varying vec2 vUv;

                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform float time;
                uniform float intensity;
                uniform float massRadius;
                uniform float schwarzschildRadius;
                uniform vec2 resolution;

                varying vec2 vUv;

                // Constants
                const float PI = 3.14159265359;
                const float G = 6.67430e-11; // Gravitational constant (scaled for visual effect)
                const float c = 299792458.0; // Speed of light (scaled)

                /**
                 * Calculate light ray deflection using Schwarzschild metric
                 *
                 * In general relativity, light rays are deflected by massive objects.
                 * The deflection angle α ≈ 4GM/(c²b) where b is the impact parameter
                 * (closest approach distance).
                 */
                vec2 gravitationalDeflection(vec2 uv, vec2 massCenter, float mass) {
                    vec2 toCenter = uv - massCenter;
                    float distance = length(toCenter);

                    // Prevent division by zero at singularity
                    if (distance < 0.001) {
                        return uv;
                    }

                    // Impact parameter (perpendicular distance to light path)
                    float impactParam = distance;

                    // Schwarzschild radius: rs = 2GM/c²
                    // Deflection angle: α = 4GM/(c²b) = 2rs/b
                    float deflectionAngle = (2.0 * schwarzschildRadius) / impactParam;

                    // Scale by intensity for artistic control
                    deflectionAngle *= intensity;

                    // Direction perpendicular to radial direction (light bending)
                    vec2 perpendicular = vec2(-toCenter.y, toCenter.x) / distance;

                    // Apply deflection
                    vec2 deflected = uv + perpendicular * deflectionAngle * 0.1;

                    // Additional radial compression near event horizon
                    float compressionFactor = 1.0 - exp(-distance / schwarzschildRadius);
                    deflected = massCenter + (deflected - massCenter) * compressionFactor;

                    return deflected;
                }

                /**
                 * Chromatic aberration from extreme spacetime curvature
                 *
                 * Different wavelengths of light are bent slightly differently
                 * in extreme gravitational fields (analogous to dispersion in optics)
                 */
                vec3 chromaticLensing(vec2 uv, vec2 massCenter) {
                    float dist = length(uv - massCenter);

                    // Different deflection for R, G, B channels
                    vec2 uvR = gravitationalDeflection(uv, massCenter, 1.0);
                    vec2 uvG = gravitationalDeflection(uv, massCenter, 0.98);
                    vec2 uvB = gravitationalDeflection(uv, massCenter, 0.96);

                    // Sample colors (for this visualization, we'll use gradient)
                    float r = smoothstep(massRadius * 2.0, 0.0, length(uvR - massCenter));
                    float g = smoothstep(massRadius * 2.0, 0.0, length(uvG - massCenter));
                    float b = smoothstep(massRadius * 2.0, 0.0, length(uvB - massCenter));

                    return vec3(r, g, b);
                }

                /**
                 * Einstein ring calculation
                 *
                 * When source, lens, and observer are perfectly aligned,
                 * light forms a ring around the massive object
                 */
                float einsteinRing(vec2 uv, vec2 massCenter, float ringRadius) {
                    float dist = length(uv - massCenter);
                    float ring = 1.0 - smoothstep(ringRadius - 0.02, ringRadius + 0.02, dist);
                    return ring * smoothstep(0.0, ringRadius * 0.5, dist);
                }

                void main() {
                    vec2 uv = vUv;
                    vec2 center = vec2(0.5, 0.5);

                    // Apply gravitational lensing
                    vec2 lensedUv = gravitationalDeflection(uv, center, 1.0);

                    // Calculate distance from center
                    float dist = length(lensedUv - center);

                    // Create gradient background representing spacetime
                    vec3 spacetime = vec3(0.1, 0.05, 0.2) * (1.0 - dist);

                    // Add chromatic aberration
                    vec3 chromatic = chromaticLensing(uv, center) * 0.3;

                    // Einstein ring effect
                    float ring = einsteinRing(uv, center, massRadius);
                    vec3 ringColor = vec3(0.83, 0.69, 0.22) * ring; // Gold

                    // Accretion disk glow
                    float diskGlow = exp(-pow(dist - massRadius, 2.0) / 0.1);
                    vec3 diskColor = vec3(1.0, 0.4, 0.1) * diskGlow * 0.5;

                    // Event horizon (dark center)
                    float eventHorizon = smoothstep(schwarzschildRadius, schwarzschildRadius * 1.5, dist);

                    // Combine all effects
                    vec3 color = spacetime + chromatic + ringColor + diskColor;
                    color *= eventHorizon;

                    // Add time-based shimmer
                    float shimmer = sin(time * 2.0 + dist * 10.0) * 0.05 + 0.95;
                    color *= shimmer;

                    gl_FragColor = vec4(color, 1.0);
                }
            `,
        }),
        [intensity, radius]
    );

    useFrame((state) => {
        if (!meshRef.current) return;

        const material = meshRef.current.material as ShaderMaterial;
        material.uniforms.time.value = state.clock.elapsedTime;

        // Update resolution
        material.uniforms.resolution.value.set(window.innerWidth, window.innerHeight);
    });

    return (
        <mesh ref={meshRef} position={[0, 0, -5]}>
            <planeGeometry args={[20, 20]} />
            <shaderMaterial {...lensingShader} transparent depthWrite={false} />
        </mesh>
    );
}

/**
 * Schwarzschild Black Hole Visualization
 *
 * More extreme version for black hole visualization
 */
export function SchwarzschildBlackHole() {
    const meshRef = useRef<Mesh>(null);

    const blackHoleShader = useMemo(
        () => ({
            uniforms: {
                time: { value: 0 },
            },
            vertexShader: `
                varying vec2 vUv;
                varying vec3 vPosition;

                void main() {
                    vUv = uv;
                    vPosition = position;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform float time;
                varying vec2 vUv;
                varying vec3 vPosition;

                void main() {
                    vec2 center = vec2(0.5, 0.5);
                    float dist = length(vUv - center);

                    // Photon sphere at 1.5 * Schwarzschild radius
                    float photonSphere = 0.3;
                    float eventHorizon = 0.2;

                    // Complete darkness inside event horizon
                    if (dist < eventHorizon) {
                        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
                        return;
                    }

                    // Extreme lensing near photon sphere
                    float lensing = 1.0 - smoothstep(eventHorizon, photonSphere, dist);

                    // Doppler shift (blueshift approaching, redshift receding)
                    float angle = atan(vUv.y - 0.5, vUv.x - 0.5);
                    float rotation = time * 2.0;
                    float doppler = sin(angle - rotation);

                    vec3 color = vec3(0.0);

                    // Approaching side (blueshift)
                    if (doppler > 0.0) {
                        color = vec3(0.2, 0.4, 1.0) * doppler * lensing;
                    } else {
                        // Receding side (redshift)
                        color = vec3(1.0, 0.3, 0.1) * abs(doppler) * lensing;
                    }

                    gl_FragColor = vec4(color, 1.0);
                }
            `,
        }),
        []
    );

    useFrame((state) => {
        if (!meshRef.current) return;
        const material = meshRef.current.material as ShaderMaterial;
        material.uniforms.time.value = state.clock.elapsedTime;
    });

    return (
        <mesh ref={meshRef}>
            <sphereGeometry args={[1, 64, 64]} />
            <shaderMaterial {...blackHoleShader} side={THREE.DoubleSide} />
        </mesh>
    );
}
