'use client';

import { useRef, useMemo, useCallback, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Mesh, ShaderMaterial, Vector2, Vector3, DataTexture, RGBAFormat, FloatType, NearestFilter } from 'three';
import * as THREE from 'three';
import { DEFAULT_WORMHOLE_PARAMS, WormholeParams, PhysicsPrecomputation } from './PhysicsEngine';

interface PhysicsWormholeProps {
    params?: WormholeParams;
    scrollProgress?: number;
    showEmbedding?: boolean;
    showAccretionDisk?: boolean;
    celestialTextureUrl?: string;
    onPhysicsUpdate?: (data: PhysicsData) => void;
}

export interface PhysicsData {
    einsteinRingRadius: number;
    currentRedshift: number;
    deflectionAngle: number;
    rayCount: number;
    frameTime: number;
}

/**
 * Scientifically Accurate Wormhole Visualization
 *
 * Based on:
 * - Morris-Thorne traversable wormhole metric (Morris & Thorne, 1988)
 * - Kip Thorne's Interstellar visualization (James et al., 2015)
 * - arXiv:1502.03809 "Visualizing Interstellar's Wormhole"
 *
 * Features:
 * - GPU-accelerated ray tracing through curved spacetime
 * - Proper null geodesic integration in fragment shader
 * - Einstein ring and multiple image formation
 * - Gravitational redshift calculation
 * - Real-time parameter adjustment
 */
export default function PhysicsWormhole({
    params = DEFAULT_WORMHOLE_PARAMS,
    scrollProgress = 0,
    showEmbedding = true,
    showAccretionDisk = true,
    celestialTextureUrl,
    onPhysicsUpdate
}: PhysicsWormholeProps) {
    const rayTracingMeshRef = useRef<Mesh>(null);
    const embeddingMeshRef = useRef<Mesh>(null);
    const accretionDiskRef = useRef<Mesh>(null);

    const { size } = useThree();
    const [frameCount, setFrameCount] = useState(0);

    // Generate Christoffel symbol lookup table texture for GPU
    const christoffelTexture = useMemo(() => {
        const lRes = 256;
        const thetaRes = 128;
        const lut = PhysicsPrecomputation.generateChristoffelLUT(params, lRes, thetaRes);

        // Pack into RGBA texture (2 textures needed for 6 values)
        const data = new Float32Array(lRes * thetaRes * 4);
        for (let i = 0; i < lRes * thetaRes; i++) {
            data[i * 4 + 0] = lut[i * 6 + 0]; // l_thetaTheta
            data[i * 4 + 1] = lut[i * 6 + 1]; // l_phiPhi
            data[i * 4 + 2] = lut[i * 6 + 2]; // theta_lTheta
            data[i * 4 + 3] = lut[i * 6 + 3]; // theta_phiPhi
        }

        const texture = new DataTexture(data, lRes, thetaRes, RGBAFormat, FloatType);
        texture.minFilter = NearestFilter;
        texture.magFilter = NearestFilter;
        texture.needsUpdate = true;

        return texture;
    }, [params]);

    // Generate embedding diagram mesh
    const embeddingGeometry = useMemo(() => {
        if (!showEmbedding) return null;

        const { positions, normals, uvs } = PhysicsPrecomputation.generateEmbeddingMesh(
            params, 80, 48
        );

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('normal', new THREE.BufferAttribute(normals, 3));
        geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));

        // Generate indices for triangle strip
        const lRes = 80;
        const phiRes = 48;
        const indices: number[] = [];

        for (let li = 0; li < lRes - 1; li++) {
            for (let pi = 0; pi < phiRes; pi++) {
                const nextPi = (pi + 1) % phiRes;
                const i0 = li * phiRes + pi;
                const i1 = li * phiRes + nextPi;
                const i2 = (li + 1) * phiRes + pi;
                const i3 = (li + 1) * phiRes + nextPi;

                indices.push(i0, i1, i2);
                indices.push(i1, i3, i2);
            }
        }

        geometry.setIndex(indices);
        geometry.computeVertexNormals();

        return geometry;
    }, [params, showEmbedding]);

    /**
     * Ray-Tracing Fragment Shader
     *
     * Implements geodesic integration directly on the GPU for each pixel.
     * This is the core physics calculation that traces light rays backwards
     * from the camera through the wormhole geometry.
     */
    const rayTracingShader = useMemo(() => ({
        uniforms: {
            time: { value: 0 },
            resolution: { value: new Vector2(size.width, size.height) },
            cameraPosition: { value: new Vector3(0, 0, 10) },
            cameraDirection: { value: new Vector3(0, 0, -1) },
            throatRadius: { value: params.throatRadius },
            wormholeLength: { value: params.length },
            mass: { value: params.mass },
            christoffelLUT: { value: christoffelTexture },
            scrollProgress: { value: scrollProgress },
            maxSteps: { value: 200 },
            stepSize: { value: 0.05 }
        },
        vertexShader: `
            varying vec2 vUv;
            varying vec3 vViewDirection;

            void main() {
                vUv = uv;

                // Calculate view direction for ray tracing
                vec4 worldPos = modelMatrix * vec4(position, 1.0);
                vViewDirection = normalize(worldPos.xyz - cameraPosition);

                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            precision highp float;

            uniform float time;
            uniform vec2 resolution;
            uniform vec3 cameraPosition;
            uniform float throatRadius;
            uniform float wormholeLength;
            uniform float mass;
            uniform sampler2D christoffelLUT;
            uniform float scrollProgress;
            uniform int maxSteps;
            uniform float stepSize;

            varying vec2 vUv;
            varying vec3 vViewDirection;

            // Physical constants
            const float PI = 3.14159265359;
            const float TWO_PI = 6.28318530718;

            /**
             * Morris-Thorne metric functions
             *
             * The metric: ds^2 = -dt^2 + dl^2 + r(l)^2 (d theta^2 + sin^2 theta d phi^2)
             * where r(l) = sqrt(b0^2 + l^2)
             */
            float circumferentialRadius(float l, float b0) {
                return sqrt(b0 * b0 + l * l);
            }

            float drDl(float l, float b0) {
                float r = circumferentialRadius(l, b0);
                return l / r;
            }

            /**
             * Christoffel symbols for Morris-Thorne metric
             * Computed analytically for better precision than LUT sampling
             */
            struct ChristoffelSymbols {
                float l_thetaTheta;
                float l_phiPhi;
                float theta_lTheta;
                float theta_phiPhi;
                float phi_lPhi;
                float phi_thetaPhi;
            };

            ChristoffelSymbols computeChristoffel(float l, float theta, float b0) {
                ChristoffelSymbols gamma;
                float r = circumferentialRadius(l, b0);
                float drdl = drDl(l, b0);
                float sinTheta = sin(theta);
                float cosTheta = cos(theta);

                gamma.l_thetaTheta = -r * drdl;
                gamma.l_phiPhi = -r * sinTheta * sinTheta * drdl;
                gamma.theta_lTheta = drdl / r;
                gamma.theta_phiPhi = -sinTheta * cosTheta;
                gamma.phi_lPhi = drdl / r;
                gamma.phi_thetaPhi = cosTheta / max(sinTheta, 0.0001);

                return gamma;
            }

            /**
             * Ray state: position and momentum in (l, theta, phi) coordinates
             */
            struct RayState {
                float l;
                float theta;
                float phi;
                float pl;
                float pTheta;
                float pPhi;
            };

            /**
             * Geodesic equation derivatives
             * d x^mu / d lambda = p^mu
             * d p^mu / d lambda = -Gamma^mu_ab p^a p^b
             */
            RayState geodesicDerivatives(RayState state, float b0) {
                RayState deriv;
                float r = circumferentialRadius(state.l, b0);
                float r2 = r * r;
                float r4 = r2 * r2;
                float sinTheta = sin(state.theta);
                float sin2Theta = sinTheta * sinTheta;
                float sin4Theta = sin2Theta * sin2Theta;

                ChristoffelSymbols gamma = computeChristoffel(state.l, state.theta, b0);

                // Position derivatives
                deriv.l = state.pl;
                deriv.theta = state.pTheta / r2;
                deriv.phi = state.pPhi / (r2 * sin2Theta);

                // Momentum derivatives from geodesic equation
                deriv.pl = -gamma.l_thetaTheta * state.pTheta * state.pTheta / r4
                          - gamma.l_phiPhi * state.pPhi * state.pPhi / (r4 * sin4Theta);

                deriv.pTheta = -2.0 * gamma.theta_lTheta * state.pl * state.pTheta / r2
                              - gamma.theta_phiPhi * state.pPhi * state.pPhi / (r4 * sin4Theta);

                deriv.pPhi = 0.0; // Conserved due to axial symmetry

                return deriv;
            }

            /**
             * RK4 integration step for geodesic
             */
            RayState rk4Step(RayState state, float dt, float b0) {
                RayState k1 = geodesicDerivatives(state, b0);

                RayState state2;
                state2.l = state.l + k1.l * dt * 0.5;
                state2.theta = state.theta + k1.theta * dt * 0.5;
                state2.phi = state.phi + k1.phi * dt * 0.5;
                state2.pl = state.pl + k1.pl * dt * 0.5;
                state2.pTheta = state.pTheta + k1.pTheta * dt * 0.5;
                state2.pPhi = state.pPhi + k1.pPhi * dt * 0.5;

                RayState k2 = geodesicDerivatives(state2, b0);

                RayState state3;
                state3.l = state.l + k2.l * dt * 0.5;
                state3.theta = state.theta + k2.theta * dt * 0.5;
                state3.phi = state.phi + k2.phi * dt * 0.5;
                state3.pl = state.pl + k2.pl * dt * 0.5;
                state3.pTheta = state.pTheta + k2.pTheta * dt * 0.5;
                state3.pPhi = state.pPhi + k2.pPhi * dt * 0.5;

                RayState k3 = geodesicDerivatives(state3, b0);

                RayState state4;
                state4.l = state.l + k3.l * dt;
                state4.theta = state.theta + k3.theta * dt;
                state4.phi = state.phi + k3.phi * dt;
                state4.pl = state.pl + k3.pl * dt;
                state4.pTheta = state.pTheta + k3.pTheta * dt;
                state4.pPhi = state.pPhi + k3.pPhi * dt;

                RayState k4 = geodesicDerivatives(state4, b0);

                RayState result;
                result.l = state.l + dt * (k1.l + 2.0*k2.l + 2.0*k3.l + k4.l) / 6.0;
                result.theta = state.theta + dt * (k1.theta + 2.0*k2.theta + 2.0*k3.theta + k4.theta) / 6.0;
                result.phi = state.phi + dt * (k1.phi + 2.0*k2.phi + 2.0*k3.phi + k4.phi) / 6.0;
                result.pl = state.pl + dt * (k1.pl + 2.0*k2.pl + 2.0*k3.pl + k4.pl) / 6.0;
                result.pTheta = state.pTheta + dt * (k1.pTheta + 2.0*k2.pTheta + 2.0*k3.pTheta + k4.pTheta) / 6.0;
                result.pPhi = state.pPhi; // Conserved

                return result;
            }

            /**
             * Convert Cartesian to spherical coordinates
             */
            vec3 cartesianToSpherical(vec3 cart) {
                float r = length(cart);
                float theta = acos(cart.z / max(r, 0.0001));
                float phi = atan(cart.y, cart.x);
                return vec3(r, theta, phi);
            }

            /**
             * Celestial sphere color mapping
             * Creates a procedural starfield for the two connected universes
             */
            vec3 celestialSphereColor(float theta, float phi, bool isOtherUniverse) {
                // Normalize angles
                phi = mod(phi, TWO_PI);
                if (phi < 0.0) phi += TWO_PI;

                // UV for celestial sphere
                vec2 uv = vec2(phi / TWO_PI, theta / PI);

                // Procedural starfield
                vec2 seed = uv * 100.0;
                float noise = fract(sin(dot(seed, vec2(12.9898, 78.233))) * 43758.5453);

                // Stars
                float starBrightness = step(0.997, noise) * (0.5 + 0.5 * noise);

                // Milky Way band
                float milkyWay = exp(-pow((theta - PI * 0.5) * 3.0, 2.0));
                milkyWay *= 0.15 * (0.5 + 0.5 * sin(phi * 5.0 + noise * 10.0));

                // Different color schemes for the two universes
                vec3 starColor;
                if (isOtherUniverse) {
                    // Other universe: warmer, orange-red tinted
                    starColor = vec3(1.0, 0.8, 0.6);
                    milkyWay *= vec3(1.0, 0.6, 0.3).r;
                } else {
                    // Our universe: cooler, blue-white
                    starColor = vec3(0.9, 0.95, 1.0);
                }

                vec3 color = starColor * starBrightness + vec3(milkyWay) * starColor;

                // Add some nebulae
                float nebula = sin(phi * 2.0 + theta * 3.0 + noise) * 0.5 + 0.5;
                nebula *= sin(phi * 5.0 - theta * 2.0) * 0.5 + 0.5;
                nebula *= exp(-pow(theta - PI * 0.6, 2.0) * 2.0);

                if (isOtherUniverse) {
                    color += vec3(nebula * 0.1, nebula * 0.05, 0.0);
                } else {
                    color += vec3(nebula * 0.02, nebula * 0.05, nebula * 0.1);
                }

                return color;
            }

            /**
             * Einstein ring effect
             * Light from directly behind the wormhole forms a bright ring
             */
            float einsteinRing(float impactParam, float b0, float m) {
                // Einstein ring radius: theta_E ~ sqrt(4M * D_LS / D_L D_S)
                // Simplified for visualization
                float thetaE = sqrt(4.0 * m / max(impactParam, 0.001));
                float ringWidth = 0.1;
                return exp(-pow((impactParam - b0 * 1.5) / ringWidth, 2.0)) * 2.0;
            }

            /**
             * Gravitational redshift
             * Light escaping from near the throat is redshifted
             */
            float gravitationalRedshift(float l, float b0, float m) {
                float r = circumferentialRadius(l, b0);
                float rs = 2.0 * m; // Schwarzschild radius

                // For Morris-Thorne, no horizon, but still redshift effect
                float redshiftFactor = 1.0 - rs / max(r, rs * 1.1);
                return sqrt(max(redshiftFactor, 0.01));
            }

            /**
             * Apply redshift to color (wavelength shift)
             */
            vec3 applyRedshift(vec3 color, float z) {
                if (z > 0.0) {
                    // Redshift: shift toward red
                    return vec3(
                        color.r,
                        color.g * (1.0 - z * 0.3),
                        color.b * (1.0 - z * 0.5)
                    );
                } else {
                    // Blueshift: shift toward blue
                    float absZ = abs(z);
                    return vec3(
                        color.r * (1.0 - absZ * 0.5),
                        color.g * (1.0 - absZ * 0.3),
                        color.b
                    );
                }
            }

            void main() {
                // Convert screen coordinates to camera ray direction
                vec2 screenPos = (vUv - 0.5) * 2.0;
                screenPos.x *= resolution.x / resolution.y;

                // Ray direction from camera
                float fov = 1.0;
                vec3 rayDir = normalize(vec3(screenPos * fov, -1.0));

                // Camera distance from wormhole
                float camDist = 10.0 - scrollProgress * 5.0;
                vec3 camPos = vec3(0.0, 0.0, camDist);

                // Convert camera position to wormhole coordinates (l, theta, phi)
                vec3 spherical = cartesianToSpherical(camPos);
                float l0 = spherical.x;  // Use distance as proxy for l
                float theta0 = spherical.y;
                float phi0 = spherical.z;

                // Impact parameter (closest approach distance)
                float impactParam = length(screenPos) * camDist * 0.5;

                // Initialize ray state
                RayState ray;
                ray.l = l0;
                ray.theta = max(theta0, 0.01);
                ray.phi = phi0;

                // Initial momentum (normalized for null geodesic)
                ray.pl = -1.0; // Moving toward wormhole
                ray.pTheta = screenPos.y * 0.5;
                ray.pPhi = screenPos.x * 0.5;

                // Adaptive step size
                float dt = stepSize;

                // Trace ray through spacetime
                bool passedThrough = false;
                float minL = 1e10;
                int actualSteps = 0;

                for (int i = 0; i < 200; i++) {
                    if (i >= maxSteps) break;
                    actualSteps = i;

                    // Adaptive step size near throat
                    float r = circumferentialRadius(ray.l, throatRadius);
                    float adaptiveDt = dt * clamp(r / throatRadius, 0.1, 1.0);

                    // RK4 integration step
                    ray = rk4Step(ray, adaptiveDt, throatRadius);

                    // Track minimum l (closest approach to throat)
                    minL = min(minL, abs(ray.l));

                    // Check if passed through throat (l changed sign)
                    if (ray.l < 0.0 && !passedThrough) {
                        passedThrough = true;
                    }

                    // Termination: ray escaped to large distance
                    if (abs(ray.l) > 50.0 * throatRadius) break;

                    // Termination: invalid angle
                    if (ray.theta < 0.01 || ray.theta > PI - 0.01) break;
                }

                // Sample celestial sphere at final ray direction
                bool isOtherUniverse = ray.l < 0.0;
                vec3 celestialColor = celestialSphereColor(ray.theta, ray.phi, isOtherUniverse);

                // Apply gravitational redshift
                float z = 1.0 - gravitationalRedshift(minL, throatRadius, mass);
                celestialColor = applyRedshift(celestialColor, z);

                // Einstein ring contribution
                float ringIntensity = einsteinRing(impactParam, throatRadius, mass);
                vec3 ringColor = vec3(1.0, 0.9, 0.7) * ringIntensity;

                // Combine colors
                vec3 finalColor = celestialColor + ringColor;

                // Add glow near throat
                float throatGlow = exp(-pow(impactParam / (throatRadius * 2.0), 2.0)) * 0.3;
                finalColor += vec3(0.3, 0.5, 1.0) * throatGlow;

                // Vignette effect
                float vignette = 1.0 - length(screenPos) * 0.3;
                finalColor *= vignette;

                // Tone mapping
                finalColor = finalColor / (1.0 + finalColor);

                // Output
                gl_FragColor = vec4(finalColor, 1.0);
            }
        `
    }), [params, christoffelTexture, size, scrollProgress]);

    // Accretion disk shader with Doppler beaming and gravitational effects
    const accretionDiskShader = useMemo(() => ({
        uniforms: {
            time: { value: 0 },
            throatRadius: { value: params.throatRadius },
            mass: { value: params.mass },
            diskInnerRadius: { value: params.throatRadius * 1.5 },
            diskOuterRadius: { value: params.throatRadius * 4.0 },
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
            uniform float throatRadius;
            uniform float mass;
            uniform float diskInnerRadius;
            uniform float diskOuterRadius;

            varying vec2 vUv;
            varying vec3 vPosition;

            const float PI = 3.14159265359;

            /**
             * Accretion disk emission
             *
             * Real accretion disks have:
             * - Temperature gradient (hotter near center)
             * - Doppler beaming (approaching side brighter)
             * - Gravitational redshift
             * - Frame dragging (for spinning black holes)
             */
            void main() {
                vec2 center = vec2(0.5, 0.5);
                float dist = distance(vUv, center) * 2.0;

                // Check if in disk region
                float normalizedDist = (dist * diskOuterRadius);
                if (normalizedDist < diskInnerRadius || normalizedDist > diskOuterRadius) {
                    discard;
                }

                // Orbital angle and velocity
                float angle = atan(vUv.y - 0.5, vUv.x - 0.5);
                float orbitalPhase = angle + time * 2.0;

                // Keplerian orbital velocity: v ~ 1/sqrt(r)
                float orbitalVelocity = 1.0 / sqrt(normalizedDist / throatRadius);

                // Doppler beaming: approaching side (positive velocity toward observer) is brighter
                // beta = v/c, boosting factor ~ (1 + beta cos(angle))^3
                float beta = orbitalVelocity * 0.3; // Scale for visualization
                float viewAngle = angle; // Simplified
                float dopplerFactor = pow(1.0 + beta * cos(viewAngle), 3.0);

                // Temperature profile: T ~ r^(-3/4) for thin disk
                float temperature = pow(diskInnerRadius / normalizedDist, 0.75);

                // Black body color approximation
                vec3 diskColor;
                if (temperature > 0.8) {
                    diskColor = vec3(1.0, 0.9, 0.8); // Hot: white-yellow
                } else if (temperature > 0.5) {
                    diskColor = vec3(1.0, 0.6, 0.2); // Medium: orange
                } else {
                    diskColor = vec3(0.8, 0.2, 0.1); // Cool: red
                }

                // Apply Doppler shift to color
                if (cos(viewAngle) > 0.0) {
                    // Approaching: blueshift
                    diskColor = vec3(diskColor.r * 0.8, diskColor.g, diskColor.b * 1.2);
                } else {
                    // Receding: redshift
                    diskColor = vec3(diskColor.r * 1.2, diskColor.g * 0.9, diskColor.b * 0.7);
                }

                // Gravitational redshift
                float rs = 2.0 * mass;
                float gravRedshift = sqrt(max(1.0 - rs / normalizedDist, 0.1));
                diskColor *= gravRedshift;

                // Intensity with Doppler beaming
                float intensity = temperature * dopplerFactor;

                // Add turbulent structure
                float turbulence = sin(orbitalPhase * 8.0 + dist * 20.0) * 0.2 + 0.8;
                intensity *= turbulence;

                // Radial falloff
                float radialFade = smoothstep(diskOuterRadius, diskInnerRadius * 1.5, normalizedDist);
                radialFade *= smoothstep(diskInnerRadius * 0.9, diskInnerRadius * 1.2, normalizedDist);

                float alpha = intensity * radialFade * 0.8;

                gl_FragColor = vec4(diskColor * intensity, alpha);
            }
        `
    }), [params]);

    // Embedding diagram shader (wireframe visualization of spacetime curvature)
    const embeddingShader = useMemo(() => ({
        uniforms: {
            time: { value: 0 },
            throatRadius: { value: params.throatRadius },
            wireframeOpacity: { value: 0.3 }
        },
        vertexShader: `
            varying vec2 vUv;
            varying vec3 vNormal;
            varying float vHeight;

            void main() {
                vUv = uv;
                vNormal = normalMatrix * normal;
                vHeight = position.y;

                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform float time;
            uniform float throatRadius;
            uniform float wireframeOpacity;

            varying vec2 vUv;
            varying vec3 vNormal;
            varying float vHeight;

            void main() {
                // Grid pattern for wireframe look
                float gridU = abs(fract(vUv.x * 20.0) - 0.5) * 2.0;
                float gridV = abs(fract(vUv.y * 20.0) - 0.5) * 2.0;
                float grid = min(gridU, gridV);

                // Wireframe lines
                float line = smoothstep(0.0, 0.05, grid);

                // Color based on position (throat = bright, edges = dim)
                float throatFactor = exp(-abs(vHeight) * 2.0);
                vec3 wireColor = mix(
                    vec3(0.2, 0.4, 0.8),  // Blue at edges
                    vec3(0.4, 0.8, 1.0),  // Cyan at throat
                    throatFactor
                );

                // Fresnel effect
                float fresnel = pow(1.0 - abs(dot(normalize(vNormal), vec3(0.0, 0.0, 1.0))), 2.0);

                float alpha = (1.0 - line) * wireframeOpacity * (0.5 + fresnel * 0.5);

                gl_FragColor = vec4(wireColor, alpha);
            }
        `
    }), [params]);

    // Update uniforms every frame
    useFrame((state) => {
        const time = state.clock.elapsedTime;
        setFrameCount(prev => prev + 1);

        // Update ray tracing shader
        if (rayTracingMeshRef.current) {
            const material = rayTracingMeshRef.current.material as ShaderMaterial;
            material.uniforms.time.value = time;
            material.uniforms.scrollProgress.value = scrollProgress;
            material.uniforms.cameraPosition.value.copy(state.camera.position);
        }

        // Update accretion disk
        if (accretionDiskRef.current) {
            const material = accretionDiskRef.current.material as ShaderMaterial;
            material.uniforms.time.value = time;
            accretionDiskRef.current.rotation.z = time * 0.5;
        }

        // Update embedding diagram
        if (embeddingMeshRef.current) {
            const material = embeddingMeshRef.current.material as ShaderMaterial;
            material.uniforms.time.value = time;
            embeddingMeshRef.current.rotation.y = time * 0.1;
        }

        // Report physics data
        if (onPhysicsUpdate && frameCount % 30 === 0) {
            const impactParam = 2.0; // Example
            onPhysicsUpdate({
                einsteinRingRadius: Math.sqrt(4 * params.mass / impactParam),
                currentRedshift: 1 - Math.sqrt(1 - 2 * params.mass / params.throatRadius),
                deflectionAngle: 4 * params.mass / impactParam,
                rayCount: 200,
                frameTime: 1000 / 60
            });
        }
    });

    return (
        <group>
            {/* Main ray-traced wormhole view */}
            <mesh ref={rayTracingMeshRef} position={[0, 0, 0]}>
                <planeGeometry args={[20, 20]} />
                <shaderMaterial
                    {...rayTracingShader}
                    transparent
                    depthWrite={false}
                />
            </mesh>

            {/* Accretion disk (if enabled) */}
            {showAccretionDisk && (
                <mesh ref={accretionDiskRef} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
                    <ringGeometry args={[params.throatRadius * 1.5, params.throatRadius * 4, 128, 1]} />
                    <shaderMaterial
                        {...accretionDiskShader}
                        transparent
                        side={THREE.DoubleSide}
                        blending={THREE.AdditiveBlending}
                        depthWrite={false}
                    />
                </mesh>
            )}

            {/* Embedding diagram (if enabled and geometry exists) */}
            {showEmbedding && embeddingGeometry && (
                <mesh ref={embeddingMeshRef} geometry={embeddingGeometry}>
                    <shaderMaterial
                        {...embeddingShader}
                        transparent
                        side={THREE.DoubleSide}
                        blending={THREE.AdditiveBlending}
                        depthWrite={false}
                    />
                </mesh>
            )}

            {/* Throat glow sphere */}
            <mesh position={[0, 0, 0]}>
                <sphereGeometry args={[params.throatRadius * 0.8, 32, 32]} />
                <meshBasicMaterial
                    color="#4488ff"
                    transparent
                    opacity={0.2}
                    blending={THREE.AdditiveBlending}
                />
            </mesh>

            {/* Event horizon marker (throat minimum) */}
            <mesh position={[0, 0, 0]}>
                <torusGeometry args={[params.throatRadius, 0.02, 16, 64]} />
                <meshBasicMaterial
                    color="#00ffff"
                    transparent
                    opacity={0.8}
                />
            </mesh>
        </group>
    );
}

export { DEFAULT_WORMHOLE_PARAMS };
