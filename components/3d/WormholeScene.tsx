'use client';

import { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, AdaptiveDpr, AdaptiveEvents } from '@react-three/drei';
import Wormhole from './Wormhole';
import CosmicParticles, { EnergyParticles, Starfield } from './CosmicParticles';
import Effects from './Effects';

interface WormholeSceneProps {
    scrollProgress?: number;
    className?: string;
    enableControls?: boolean;
    performance?: 'low' | 'medium' | 'high' | 'auto';
}

/**
 * Optimized Wormhole Scene with LOD and Performance Controls
 *
 * Features:
 * - Adaptive quality based on device capability
 * - LOD (Level of Detail) system for particles
 * - Performance monitoring and automatic adjustment
 * - Mobile-optimized with reduced particle counts
 * - Respects prefers-reduced-motion
 */
export default function WormholeScene({
    scrollProgress = 0,
    className = '',
    enableControls = false,
    performance = 'auto',
}: WormholeSceneProps) {
    const [qualityLevel, setQualityLevel] = useState<'low' | 'medium' | 'high'>('high');
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

    useEffect(() => {
        // Check for reduced motion preference
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        setPrefersReducedMotion(mediaQuery.matches);

        const handleChange = (e: MediaQueryListEvent) => {
            setPrefersReducedMotion(e.matches);
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    useEffect(() => {
        if (performance !== 'auto') {
            setQualityLevel(performance);
            return;
        }

        // Auto-detect device capability
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            navigator.userAgent
        );

        // Check for GPU tier (basic heuristic)
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

        if (!gl) {
            setQualityLevel('low');
            return;
        }

        if (isMobile) {
            setQualityLevel('medium');
        } else {
            // Desktop - check for discrete GPU
            const debugInfo = (gl as WebGLRenderingContext).getExtension('WEBGL_debug_renderer_info');
            if (debugInfo) {
                const renderer = (gl as WebGLRenderingContext).getParameter(
                    debugInfo.UNMASKED_RENDERER_WEBGL
                );
                const isIntegrated = /Intel|Apple|AMD/.test(renderer as string);
                setQualityLevel(isIntegrated ? 'medium' : 'high');
            } else {
                setQualityLevel('high');
            }
        }
    }, [performance]);

    // Quality-based particle counts - Optimized for high performance
    const particleCounts = {
        low: { cosmic: 800, energy: 150, stars: 400 },
        medium: { cosmic: 2500, energy: 400, stars: 800 },
        high: { cosmic: 4000, energy: 800, stars: 1500 },
    };

    const counts = particleCounts[qualityLevel];

    // Reduced motion fallback - static scene
    if (prefersReducedMotion) {
        return (
            <div className={`w-full h-full bg-gradient-to-b from-blue-950 to-black ${className}`}>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-64 h-64 rounded-full bg-gradient-radial from-blue-500/20 to-transparent blur-3xl" />
                </div>
            </div>
        );
    }

    return (
        <div className={`w-full h-full ${className}`}>
            <Canvas
                gl={{
                    antialias: qualityLevel === 'high',
                    alpha: true,
                    powerPreference: 'high-performance',
                    stencil: false,
                    depth: true,
                }}
                dpr={qualityLevel === 'low' ? 1 : [1, 2]}
                performance={{ min: 0.5 }}
                style={{ background: 'transparent' }}
            >
                <Suspense fallback={null}>
                    {/* Camera */}
                    <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={60} />

                    {/* Lighting - Deep blue theme */}
                    <ambientLight intensity={0.3} />
                    <pointLight position={[0, 0, 0]} intensity={2.5} color="#4da6ff" />
                    <pointLight position={[10, 10, 10]} intensity={0.6} color="#0080ff" />

                    {/* Main Wormhole */}
                    <Wormhole scrollProgress={scrollProgress} intensity={1.0} />

                    {/* Particle Systems */}
                    {qualityLevel !== 'low' && (
                        <>
                            <CosmicParticles count={counts.cosmic} scrollProgress={scrollProgress} />
                            <EnergyParticles count={counts.energy} />
                        </>
                    )}

                    {/* Background Starfield */}
                    <Starfield count={counts.stars} />

                    {/* Post-processing Effects */}
                    {qualityLevel === 'high' && <Effects />}

                    {/* Adaptive Performance */}
                    <AdaptiveDpr pixelated />
                    <AdaptiveEvents />

                    {/* Optional Debug Controls */}
                    {enableControls && (
                        <OrbitControls
                            enableZoom={true}
                            enablePan={true}
                            enableRotate={true}
                            maxDistance={30}
                            minDistance={5}
                        />
                    )}
                </Suspense>
            </Canvas>

            {/* Quality Indicator (dev mode) */}
            {process.env.NODE_ENV === 'development' && (
                <div className="absolute top-4 right-4 px-3 py-1 bg-black/50 text-white text-xs rounded backdrop-blur-sm">
                    Quality: {qualityLevel.toUpperCase()}
                </div>
            )}
        </div>
    );
}
