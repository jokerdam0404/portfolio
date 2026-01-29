'use client';

import { Suspense, useState, useEffect, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, AdaptiveDpr, AdaptiveEvents, Stats } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import PhysicsWormhole, { PhysicsData } from './physics/PhysicsWormhole';
import PhysicsControls, { PhysicsHUD } from './physics/PhysicsControls';
import EquationDisplay, { EquationOverlay } from './physics/EquationDisplay';
import { WormholeParams, DEFAULT_WORMHOLE_PARAMS } from './physics/PhysicsEngine';
import CosmicParticles, { EnergyParticles, Starfield } from './CosmicParticles';
import Effects from './Effects';

interface PhysicsWormholeSceneProps {
    scrollProgress?: number;
    className?: string;
    enableControls?: boolean;
    showPhysicsPanel?: boolean;
    showEquations?: boolean;
    performance?: 'low' | 'medium' | 'high' | 'auto';
    initialParams?: Partial<WormholeParams>;
}

/**
 * Physics-Accurate Wormhole Scene
 *
 * A complete visualization scene integrating:
 * - Morris-Thorne wormhole geometry
 * - GPU-accelerated ray tracing through curved spacetime
 * - Real-time physics parameter controls
 * - Live equation display
 * - Educational overlays
 *
 * Based on Kip Thorne's work for the movie Interstellar and
 * the associated scientific papers (arXiv:1502.03809, arXiv:1502.03808).
 *
 * Features:
 * - Scientifically accurate gravitational lensing
 * - Einstein ring formation
 * - Gravitational redshift visualization
 * - Multiple image formation from light bending
 * - Interactive parameter adjustment
 * - Performance optimization with adaptive quality
 */
export default function PhysicsWormholeScene({
    scrollProgress = 0,
    className = '',
    enableControls = true,
    showPhysicsPanel = true,
    showEquations = true,
    performance = 'auto',
    initialParams
}: PhysicsWormholeSceneProps) {
    // Wormhole physics parameters
    const [params, setParams] = useState<WormholeParams>({
        ...DEFAULT_WORMHOLE_PARAMS,
        ...initialParams
    });

    // Physics data from simulation
    const [physicsData, setPhysicsData] = useState<PhysicsData | null>(null);

    // UI state
    const [qualityLevel, setQualityLevel] = useState<'low' | 'medium' | 'high'>('high');
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
    const [showStats, setShowStats] = useState(false);
    const [isPanelVisible, setIsPanelVisible] = useState(showPhysicsPanel);
    const [isEquationsVisible, setIsEquationsVisible] = useState(showEquations);

    // Check for reduced motion preference
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        setPrefersReducedMotion(mediaQuery.matches);

        const handleChange = (e: MediaQueryListEvent) => {
            setPrefersReducedMotion(e.matches);
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    // Auto-detect device capability
    useEffect(() => {
        if (performance !== 'auto') {
            setQualityLevel(performance);
            return;
        }

        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            navigator.userAgent
        );

        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');

        if (!gl) {
            setQualityLevel('low');
            return;
        }

        if (isMobile) {
            setQualityLevel('medium');
        } else {
            const debugInfo = (gl as WebGLRenderingContext).getExtension('WEBGL_debug_renderer_info');
            if (debugInfo) {
                const renderer = (gl as WebGLRenderingContext).getParameter(
                    debugInfo.UNMASKED_RENDERER_WEBGL
                );
                const isHighEnd = /NVIDIA|RTX|GTX|Radeon RX/i.test(renderer as string);
                setQualityLevel(isHighEnd ? 'high' : 'medium');
            } else {
                setQualityLevel('medium');
            }
        }
    }, [performance]);

    // Quality-based settings
    const qualitySettings = {
        low: {
            particleCount: 500,
            energyParticles: 100,
            stars: 300,
            maxRaySteps: 100,
            showEffects: false,
            showEmbedding: false,
            showAccretionDisk: false
        },
        medium: {
            particleCount: 2000,
            energyParticles: 300,
            stars: 600,
            maxRaySteps: 150,
            showEffects: false,
            showEmbedding: true,
            showAccretionDisk: true
        },
        high: {
            particleCount: 4000,
            energyParticles: 600,
            stars: 1200,
            maxRaySteps: 200,
            showEffects: true,
            showEmbedding: true,
            showAccretionDisk: true
        }
    };

    const settings = qualitySettings[qualityLevel];

    // Handle physics data updates
    const handlePhysicsUpdate = useCallback((data: PhysicsData) => {
        setPhysicsData(data);
    }, []);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'p' || e.key === 'P') {
                setIsPanelVisible(prev => !prev);
            }
            if (e.key === 'e' || e.key === 'E') {
                setIsEquationsVisible(prev => !prev);
            }
            if (e.key === 's' || e.key === 'S') {
                setShowStats(prev => !prev);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Reduced motion fallback
    if (prefersReducedMotion) {
        return (
            <div className={`w-full h-full bg-gradient-to-b from-blue-950 to-black ${className}`}>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                        <div className="w-64 h-64 rounded-full bg-gradient-radial from-blue-500/20 to-transparent blur-3xl mx-auto" />
                        <p className="text-blue-300 mt-4 font-mono text-sm">
                            Morris-Thorne Wormhole Visualization
                        </p>
                        <p className="text-gray-500 text-xs mt-2">
                            Animation disabled (prefers-reduced-motion)
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`w-full h-full relative ${className}`}>
            {/* Three.js Canvas */}
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
                style={{ background: 'linear-gradient(to bottom, #000510, #000000)' }}
            >
                <Suspense fallback={null}>
                    {/* Camera */}
                    <PerspectiveCamera
                        makeDefault
                        position={[0, 2, 10 - scrollProgress * 5]}
                        fov={60}
                    />

                    {/* Lighting */}
                    <ambientLight intensity={0.2} />
                    <pointLight position={[0, 0, 0]} intensity={2.0} color="#4488ff" />
                    <pointLight position={[10, 10, 10]} intensity={0.5} color="#0066cc" />

                    {/* Physics-Based Wormhole */}
                    <PhysicsWormhole
                        params={params}
                        scrollProgress={scrollProgress}
                        showEmbedding={settings.showEmbedding}
                        showAccretionDisk={settings.showAccretionDisk}
                        onPhysicsUpdate={handlePhysicsUpdate}
                    />

                    {/* Particle Systems */}
                    {qualityLevel !== 'low' && (
                        <>
                            <CosmicParticles
                                count={settings.particleCount}
                                scrollProgress={scrollProgress}
                            />
                            <EnergyParticles count={settings.energyParticles} />
                        </>
                    )}

                    {/* Background Starfield */}
                    <Starfield count={settings.stars} />

                    {/* Post-processing Effects */}
                    {settings.showEffects && <Effects />}

                    {/* Performance Optimization */}
                    <AdaptiveDpr pixelated />
                    <AdaptiveEvents />

                    {/* Orbit Controls */}
                    {enableControls && (
                        <OrbitControls
                            enableZoom={true}
                            enablePan={true}
                            enableRotate={true}
                            maxDistance={30}
                            minDistance={3}
                            autoRotate={!enableControls}
                            autoRotateSpeed={0.5}
                        />
                    )}

                    {/* Performance Stats (dev mode) */}
                    {showStats && <Stats />}
                </Suspense>
            </Canvas>

            {/* Physics Controls Panel */}
            <AnimatePresence>
                {isPanelVisible && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="absolute top-4 right-4 w-80 max-h-[calc(100vh-2rem)] overflow-y-auto"
                    >
                        <PhysicsControls
                            params={params}
                            onParamsChange={setParams}
                            showAdvanced={qualityLevel === 'high'}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Equations Display */}
            <AnimatePresence>
                {isEquationsVisible && (
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="absolute top-4 left-4 w-96 max-h-[calc(100vh-2rem)] overflow-y-auto"
                    >
                        <EquationDisplay
                            params={params}
                            physicsData={physicsData || undefined}
                            mode="detailed"
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Physics HUD (compact) */}
            {physicsData && !isPanelVisible && (
                <div className="absolute bottom-4 right-4">
                    <PhysicsHUD params={params} />
                </div>
            )}

            {/* Equation Overlay (minimal) */}
            {!isEquationsVisible && (
                <EquationOverlay params={params} />
            )}

            {/* Quality Indicator */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-4">
                <div className="px-3 py-1 bg-black/50 text-white text-xs rounded backdrop-blur-sm font-mono">
                    {qualityLevel.toUpperCase()} | {physicsData?.rayCount || 0} rays | {physicsData?.frameTime?.toFixed(1) || '0.0'}ms
                </div>
            </div>

            {/* Keyboard Shortcuts Help */}
            <div className="absolute bottom-4 left-4 text-xs text-gray-500 font-mono space-y-1">
                <div>[P] Toggle physics panel</div>
                <div>[E] Toggle equations</div>
                <div>[S] Toggle stats</div>
            </div>

            {/* Scientific Attribution */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-gray-600 font-mono text-center">
                <div>Morris-Thorne Wormhole | Based on arXiv:1502.03809</div>
                <div className="text-gray-700">Kip Thorne et al. (2015)</div>
            </div>
        </div>
    );
}

/**
 * Lightweight version for hero sections
 */
export function PhysicsWormholeHero({
    scrollProgress = 0,
    className = ''
}: {
    scrollProgress?: number;
    className?: string;
}) {
    return (
        <PhysicsWormholeScene
            scrollProgress={scrollProgress}
            className={className}
            enableControls={false}
            showPhysicsPanel={false}
            showEquations={false}
            performance="auto"
        />
    );
}
