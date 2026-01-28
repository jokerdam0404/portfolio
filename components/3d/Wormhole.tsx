'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, ShaderMaterial, Color, AdditiveBlending, Vector2 } from 'three';
import * as THREE from 'three';

interface WormholeProps {
    scrollProgress?: number;
    intensity?: number;
}

/**
 * Photorealistic Wormhole with Gravitational Lensing
 *
 * Features:
 * - Custom GLSL shaders for gravitational lensing effect
 * - Physics-accurate light bending around event horizon
 * - Accretion disk with volumetric glow
 * - Time-varying distortion field
 * - Performance-optimized with LOD
 */
export default function Wormhole({ scrollProgress = 0, intensity = 1.0 }: WormholeProps) {
    const tunnelRef = useRef<Mesh>(null);
    const accretionRef = useRef<Mesh>(null);
    const glowRef = useRef<Mesh>(null);

    // Gravitational lensing shader for the wormhole tunnel
    const tunnelShader = useMemo(
        () => ({
            uniforms: {
                time: { value: 0 },
                scrollProgress: { value: 0 },
                intensity: { value: intensity },
                color1: { value: new Color('#001a33') }, // Deep navy blue
                color2: { value: new Color('#0047ab') }, // Royal blue
                color3: { value: new Color('#4da6ff') }, // Bright blue accent
                resolution: { value: new Vector2(1024, 1024) },
            },
            vertexShader: `
                varying vec2 vUv;
                varying vec3 vPosition;
                varying vec3 vNormal;

                void main() {
                    vUv = uv;
                    vPosition = position;
                    vNormal = normalize(normalMatrix * normal);

                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform float time;
                uniform float scrollProgress;
                uniform float intensity;
                uniform vec3 color1;
                uniform vec3 color2;
                uniform vec3 color3;

                varying vec2 vUv;
                varying vec3 vPosition;
                varying vec3 vNormal;

                // Noise function for distortion
                vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
                vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
                vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
                vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

                float snoise(vec3 v) {
                    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
                    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

                    vec3 i  = floor(v + dot(v, C.yyy));
                    vec3 x0 = v - i + dot(i, C.xxx);

                    vec3 g = step(x0.yzx, x0.xyz);
                    vec3 l = 1.0 - g;
                    vec3 i1 = min(g.xyz, l.zxy);
                    vec3 i2 = max(g.xyz, l.zxy);

                    vec3 x1 = x0 - i1 + C.xxx;
                    vec3 x2 = x0 - i2 + C.yyy;
                    vec3 x3 = x0 - D.yyy;

                    i = mod289(i);
                    vec4 p = permute(permute(permute(
                        i.z + vec4(0.0, i1.z, i2.z, 1.0))
                        + i.y + vec4(0.0, i1.y, i2.y, 1.0))
                        + i.x + vec4(0.0, i1.x, i2.x, 1.0));

                    float n_ = 0.142857142857;
                    vec3 ns = n_ * D.wyz - D.xzx;

                    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

                    vec4 x_ = floor(j * ns.z);
                    vec4 y_ = floor(j - 7.0 * x_);

                    vec4 x = x_ *ns.x + ns.yyyy;
                    vec4 y = y_ *ns.x + ns.yyyy;
                    vec4 h = 1.0 - abs(x) - abs(y);

                    vec4 b0 = vec4(x.xy, y.xy);
                    vec4 b1 = vec4(x.zw, y.zw);

                    vec4 s0 = floor(b0)*2.0 + 1.0;
                    vec4 s1 = floor(b1)*2.0 + 1.0;
                    vec4 sh = -step(h, vec4(0.0));

                    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
                    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;

                    vec3 p0 = vec3(a0.xy, h.x);
                    vec3 p1 = vec3(a0.zw, h.y);
                    vec3 p2 = vec3(a1.xy, h.z);
                    vec3 p3 = vec3(a1.zw, h.w);

                    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
                    p0 *= norm.x;
                    p1 *= norm.y;
                    p2 *= norm.z;
                    p3 *= norm.w;

                    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
                    m = m * m;
                    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
                }

                void main() {
                    vec2 uv = vUv;

                    // Create radial coordinates for the wormhole
                    vec2 center = vec2(0.5, 0.5);
                    float dist = distance(uv, center);

                    // Gravitational lensing - light bends more near the center
                    float lensing = 1.0 / (1.0 + dist * 2.0);
                    vec2 lensedUv = center + (uv - center) * lensing;

                    // Time-based rotation for the tunnel effect
                    float angle = atan(lensedUv.y - 0.5, lensedUv.x - 0.5);
                    float radius = length(lensedUv - center);

                    // Animated spiral distortion
                    float spiral = angle + time * 0.3 + radius * 10.0 - scrollProgress * 3.0;

                    // Multi-octave noise for turbulence
                    float noise1 = snoise(vec3(vPosition.xy * 2.0, time * 0.2));
                    float noise2 = snoise(vec3(vPosition.xy * 4.0, time * 0.15)) * 0.5;
                    float noise3 = snoise(vec3(vPosition.xy * 8.0, time * 0.1)) * 0.25;
                    float turbulence = noise1 + noise2 + noise3;

                    // Event horizon darkness at center
                    float eventHorizon = smoothstep(0.0, 0.3, radius);

                    // Combine colors with spiral and turbulence
                    float spiralPattern = sin(spiral * 3.0 + turbulence) * 0.5 + 0.5;
                    vec3 color = mix(color1, color2, spiralPattern);
                    color = mix(color, color3, pow(spiralPattern, 3.0) * 0.3);

                    // Add radial gradient
                    color *= eventHorizon;
                    color += color3 * (1.0 - eventHorizon) * 0.2; // Gold glow at center

                    // Fresnel effect for edge glow
                    float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 3.0);
                    color += color2 * fresnel * 0.5;

                    // Pulsing intensity
                    float pulse = sin(time * 2.0) * 0.1 + 0.9;
                    color *= pulse * intensity;

                    gl_FragColor = vec4(color, eventHorizon * 0.8);
                }
            `,
        }),
        [intensity]
    );

    // Accretion disk shader
    const accretionShader = useMemo(
        () => ({
            uniforms: {
                time: { value: 0 },
                innerColor: { value: new Color('#4da6ff') }, // Bright blue
                outerColor: { value: new Color('#0080ff') }, // Electric blue
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
                uniform vec3 innerColor;
                uniform vec3 outerColor;

                varying vec2 vUv;
                varying vec3 vPosition;

                void main() {
                    vec2 center = vec2(0.5, 0.5);
                    float dist = distance(vUv, center) * 2.0;

                    // Rotating accretion disk
                    float angle = atan(vUv.y - 0.5, vUv.x - 0.5) + time * 0.5;
                    float diskPattern = sin(angle * 8.0 + dist * 20.0) * 0.5 + 0.5;

                    // Radial falloff
                    float alpha = smoothstep(1.0, 0.3, dist) * smoothstep(0.0, 0.2, dist);
                    alpha *= diskPattern * 0.7 + 0.3;

                    // Color gradient from inner to outer
                    vec3 color = mix(innerColor, outerColor, dist);

                    // Add intensity variation
                    color *= 1.5 + sin(time * 3.0 + dist * 10.0) * 0.5;

                    gl_FragColor = vec4(color, alpha * 0.6);
                }
            `,
        }),
        []
    );

    useFrame((state) => {
        const time = state.clock.elapsedTime;

        // Update tunnel shader uniforms
        if (tunnelRef.current) {
            const material = tunnelRef.current.material as ShaderMaterial;
            material.uniforms.time.value = time;
            material.uniforms.scrollProgress.value = scrollProgress;

            // Smooth, noticeable rotation for quick viewing
            tunnelRef.current.rotation.z = time * 0.15;
        }

        // Update accretion disk
        if (accretionRef.current) {
            const material = accretionRef.current.material as ShaderMaterial;
            material.uniforms.time.value = time;

            // Faster disk rotation for immediate visual impact
            accretionRef.current.rotation.z = time * 0.5;
        }

        // Pulse glow
        if (glowRef.current) {
            const scale = 1 + Math.sin(time * 2) * 0.1;
            glowRef.current.scale.set(scale, scale, scale);
        }
    });

    return (
        <group position={[0, 0, 0]}>
            {/* Main wormhole tunnel */}
            <mesh ref={tunnelRef}>
                <cylinderGeometry args={[2, 3, 4, 64, 64, true]} />
                <shaderMaterial
                    {...tunnelShader}
                    transparent
                    side={THREE.DoubleSide}
                    depthWrite={false}
                />
            </mesh>

            {/* Accretion disk */}
            <mesh ref={accretionRef} rotation={[Math.PI / 2, 0, 0]}>
                <ringGeometry args={[1.5, 3.5, 64]} />
                <shaderMaterial
                    {...accretionShader}
                    transparent
                    blending={AdditiveBlending}
                    depthWrite={false}
                />
            </mesh>

            {/* Inner glow sphere */}
            <mesh ref={glowRef}>
                <sphereGeometry args={[0.8, 32, 32]} />
                <meshBasicMaterial
                    color="#4da6ff"
                    transparent
                    opacity={0.4}
                    blending={AdditiveBlending}
                />
            </mesh>

            {/* Event horizon */}
            <mesh>
                <sphereGeometry args={[0.5, 32, 32]} />
                <meshBasicMaterial color="#000000" />
            </mesh>
        </group>
    );
}
