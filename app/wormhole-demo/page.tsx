'use client';

import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';

// Dynamic imports for better performance
const WormholeScene = dynamic(() => import('@/components/3d/WormholeScene'), {
    ssr: false,
});

const PhysicsWormholeScene = dynamic(() => import('@/components/3d/PhysicsWormholeScene'), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full bg-gradient-to-b from-blue-950 to-black flex items-center justify-center">
            <div className="text-center">
                <div className="w-16 h-16 rounded-full border-2 border-blue-500/30 border-t-blue-500 animate-spin mx-auto" />
                <p className="text-blue-400 mt-4 font-mono text-sm">Loading Physics Engine...</p>
                <p className="text-gray-500 text-xs mt-1">Initializing Morris-Thorne metric</p>
            </div>
        </div>
    ),
});

const Wormhole = dynamic(() => import('@/components/3d/Wormhole'), {
    ssr: false,
});

const CosmicParticles = dynamic(
    () => import('@/components/3d/CosmicParticles'),
    { ssr: false }
);

const GravitationalLensing = dynamic(
    () => import('@/components/3d/GravitationalLensing'),
    { ssr: false }
);

import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { PerformanceHUD } from '@/components/3d/PerformanceMonitor';

type DemoType = 'physics' | 'complete' | 'wormhole' | 'particles' | 'lensing';

/**
 * Wormhole Demo Page
 *
 * Interactive showcase of wormhole visualizations:
 * - Physics-accurate simulation (Morris-Thorne metric)
 * - Original artistic visualization
 * - Component testing
 * - Performance comparison
 *
 * The physics simulation is based on:
 * - Morris & Thorne (1988) - Traversable wormhole metric
 * - James et al. (2015) - Interstellar visualization methodology
 */
export default function WormholeDemo() {
    const [activeDemo, setActiveDemo] = useState<DemoType>('physics');
    const [quality, setQuality] = useState<'low' | 'medium' | 'high'>('high');
    const [showHUD, setShowHUD] = useState(true);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [showInfo, setShowInfo] = useState(true);

    const demos = [
        {
            id: 'physics' as DemoType,
            name: 'Physics Simulation',
            icon: 'E',
            description: 'Scientifically accurate Morris-Thorne wormhole with real GR calculations',
            badge: 'NEW'
        },
        {
            id: 'complete' as DemoType,
            name: 'Artistic Scene',
            icon: 'A',
            description: 'Original artistic visualization with particles and effects'
        },
        {
            id: 'wormhole' as DemoType,
            name: 'Wormhole Only',
            icon: 'W',
            description: 'Isolated wormhole component'
        },
        {
            id: 'particles' as DemoType,
            name: 'Particles Only',
            icon: 'P',
            description: 'Cosmic particle system'
        },
        {
            id: 'lensing' as DemoType,
            name: 'Gravitational Lensing',
            icon: 'L',
            description: 'Schwarzschild lensing effect'
        },
    ];

    const getActiveDemo = () => demos.find(d => d.id === activeDemo);

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Header */}
            <motion.header
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-blue-900/30"
            >
                <div className="container mx-auto px-4 py-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                                Wormhole Visualization Lab
                            </h1>
                            {activeDemo === 'physics' && (
                                <span className="px-2 py-0.5 text-xs font-mono bg-blue-600/30 border border-blue-500/30 rounded text-blue-300">
                                    General Relativity
                                </span>
                            )}
                        </div>

                        <div className="flex items-center gap-4">
                            {/* Quality Selector */}
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-400 font-mono">Quality:</span>
                                <select
                                    value={quality}
                                    onChange={(e) => setQuality(e.target.value as 'low' | 'medium' | 'high')}
                                    className="bg-blue-900/50 border border-blue-700 rounded px-3 py-1 text-sm font-mono"
                                >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                </select>
                            </div>

                            {/* HUD Toggle */}
                            <button
                                onClick={() => setShowHUD(!showHUD)}
                                className={`px-3 py-1 rounded text-sm font-mono transition-colors ${
                                    showHUD
                                        ? 'bg-blue-600 hover:bg-blue-700'
                                        : 'bg-gray-700 hover:bg-gray-600'
                                }`}
                            >
                                {showHUD ? 'Hide' : 'Show'} Stats
                            </button>

                            {/* Info Toggle */}
                            <button
                                onClick={() => setShowInfo(!showInfo)}
                                className={`px-3 py-1 rounded text-sm font-mono transition-colors ${
                                    showInfo
                                        ? 'bg-cyan-600 hover:bg-cyan-700'
                                        : 'bg-gray-700 hover:bg-gray-600'
                                }`}
                            >
                                {showInfo ? 'Hide' : 'Show'} Info
                            </button>
                        </div>
                    </div>
                </div>
            </motion.header>

            {/* Demo Selector */}
            <div className="fixed top-20 left-4 z-40 bg-black/80 backdrop-blur-md border border-blue-900/30 rounded-lg p-4 w-64">
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-3 font-mono">Visualizations</p>
                <div className="space-y-2">
                    {demos.map((demo) => (
                        <button
                            key={demo.id}
                            onClick={() => setActiveDemo(demo.id)}
                            className={`w-full text-left px-3 py-2 rounded transition-all group ${
                                activeDemo === demo.id
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                            }`}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className={`w-6 h-6 flex items-center justify-center rounded text-xs font-mono ${
                                        activeDemo === demo.id ? 'bg-white/20' : 'bg-blue-900/50'
                                    }`}>
                                        {demo.icon}
                                    </span>
                                    <span className="text-sm">{demo.name}</span>
                                </div>
                                {demo.badge && (
                                    <span className="px-1.5 py-0.5 text-[10px] font-mono bg-green-500/30 text-green-300 rounded">
                                        {demo.badge}
                                    </span>
                                )}
                            </div>
                            {activeDemo === demo.id && (
                                <p className="text-xs text-blue-200/70 mt-1 pl-8">
                                    {demo.description}
                                </p>
                            )}
                        </button>
                    ))}
                </div>

                {/* Physics References (only for physics demo) */}
                {activeDemo === 'physics' && (
                    <div className="mt-4 pt-4 border-t border-gray-700">
                        <p className="text-xs text-gray-500 font-mono mb-2">REFERENCES</p>
                        <div className="text-[10px] text-gray-400 space-y-1 font-mono">
                            <p>Morris & Thorne (1988)</p>
                            <p>James et al. arXiv:1502.03809</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Controls Panel (for non-physics demos) */}
            {activeDemo !== 'physics' && (
                <div className="fixed top-20 right-4 z-40 bg-black/80 backdrop-blur-md border border-blue-900/30 rounded-lg p-4 w-64">
                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-3 font-mono">Controls</p>

                    {/* Scroll Progress */}
                    <div className="mb-4">
                        <label className="text-sm text-gray-300 mb-2 block font-mono">
                            Scroll Progress: {(scrollProgress * 100).toFixed(0)}%
                        </label>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={scrollProgress}
                            onChange={(e) => setScrollProgress(parseFloat(e.target.value))}
                            className="w-full h-2 bg-blue-900/50 rounded-lg appearance-none cursor-pointer"
                        />
                    </div>

                    {/* Info */}
                    <div className="text-xs text-gray-400 space-y-2 border-t border-blue-900/30 pt-4 font-mono">
                        <p>Mouse drag to rotate</p>
                        <p>Scroll to zoom</p>
                        <p>Slider for scroll effects</p>
                    </div>
                </div>
            )}

            {/* Main Canvas Area */}
            <div className="h-screen pt-16">
                <AnimatePresence mode="wait">
                    {activeDemo === 'physics' && (
                        <motion.div
                            key="physics"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="w-full h-full"
                        >
                            <PhysicsWormholeScene
                                scrollProgress={scrollProgress}
                                performance={quality}
                                enableControls={true}
                                showPhysicsPanel={true}
                                showEquations={showInfo}
                                className="w-full h-full"
                            />
                        </motion.div>
                    )}

                    {activeDemo === 'complete' && (
                        <motion.div
                            key="complete"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="w-full h-full"
                        >
                            <WormholeScene
                                scrollProgress={scrollProgress}
                                performance={quality}
                                enableControls={true}
                                className="w-full h-full"
                            />
                        </motion.div>
                    )}

                    {activeDemo === 'wormhole' && (
                        <motion.div
                            key="wormhole"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="w-full h-full"
                        >
                            <Canvas
                                camera={{ position: [0, 0, 10], fov: 60 }}
                                gl={{ antialias: quality === 'high', alpha: true }}
                                dpr={quality === 'low' ? 1 : [1, 2]}
                            >
                                <ambientLight intensity={0.2} />
                                <pointLight position={[0, 0, 0]} intensity={2} color="#4488ff" />
                                <Wormhole scrollProgress={scrollProgress} />
                                <OrbitControls />
                                {showHUD && <PerformanceHUD />}
                            </Canvas>
                        </motion.div>
                    )}

                    {activeDemo === 'particles' && (
                        <motion.div
                            key="particles"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="w-full h-full"
                        >
                            <Canvas
                                camera={{ position: [0, 0, 15], fov: 60 }}
                                gl={{ antialias: quality === 'high', alpha: true }}
                                dpr={quality === 'low' ? 1 : [1, 2]}
                            >
                                <ambientLight intensity={0.1} />
                                <pointLight position={[0, 0, 0]} intensity={1} />
                                <CosmicParticles
                                    count={quality === 'low' ? 1000 : quality === 'medium' ? 3000 : 5000}
                                    scrollProgress={scrollProgress}
                                />
                                <OrbitControls />
                                {showHUD && <PerformanceHUD />}
                            </Canvas>
                        </motion.div>
                    )}

                    {activeDemo === 'lensing' && (
                        <motion.div
                            key="lensing"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="w-full h-full"
                        >
                            <Canvas
                                camera={{ position: [0, 0, 5], fov: 60 }}
                                gl={{ antialias: quality === 'high', alpha: true }}
                                dpr={quality === 'low' ? 1 : [1, 2]}
                            >
                                <ambientLight intensity={0.3} />
                                <GravitationalLensing intensity={1.0} radius={2.0} />
                                <OrbitControls />
                                {showHUD && <PerformanceHUD />}
                            </Canvas>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Info Footer */}
            <AnimatePresence>
                {showInfo && (
                    <motion.div
                        initial={{ y: 100 }}
                        animate={{ y: 0 }}
                        exit={{ y: 100 }}
                        className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40"
                    >
                        <div className="bg-black/80 backdrop-blur-md border border-blue-900/30 rounded-lg px-6 py-3">
                            <div className="flex items-center gap-6 text-sm font-mono">
                                {activeDemo === 'physics' ? (
                                    <>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                            <span className="text-gray-300">RK4 Integration</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-blue-500 rounded-full" />
                                            <span className="text-gray-300">Morris-Thorne Metric</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-cyan-500 rounded-full" />
                                            <span className="text-gray-300">Geodesic Ray Tracing</span>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                            <span className="text-gray-300">
                                                {activeDemo === 'complete' ? '5000+' : '1000+'} Particles
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-blue-500 rounded-full" />
                                            <span className="text-gray-300">GPU Accelerated</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-cyan-500 rounded-full" />
                                            <span className="text-gray-300">Real-time Physics</span>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Keyboard Shortcuts */}
            <div className="fixed bottom-4 left-4 text-[10px] text-gray-600 font-mono space-y-0.5">
                <div>Press [P] to toggle physics panel</div>
                <div>Press [E] to toggle equations</div>
                <div>Press [S] to toggle stats</div>
            </div>
        </div>
    );
}
