'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';

// Dynamic imports for better performance
const WormholeScene = dynamic(() => import('@/components/3d/WormholeScene'), {
    ssr: false,
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

/**
 * Wormhole Demo Page
 *
 * Interactive showcase of all wormhole features:
 * - Complete scene view
 * - Individual component testing
 * - Performance comparison
 * - Quality settings
 * - Shader visualization
 */
export default function WormholeDemo() {
    const [activeDemo, setActiveDemo] = useState<
        'complete' | 'wormhole' | 'particles' | 'lensing'
    >('complete');
    const [quality, setQuality] = useState<'low' | 'medium' | 'high'>('high');
    const [showHUD, setShowHUD] = useState(true);
    const [scrollProgress, setScrollProgress] = useState(0);

    const demos = [
        { id: 'complete', name: 'Complete Scene', icon: '🌌' },
        { id: 'wormhole', name: 'Wormhole Only', icon: '⚫' },
        { id: 'particles', name: 'Particles Only', icon: '✨' },
        { id: 'lensing', name: 'Gravitational Lensing', icon: '🔬' },
    ];

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Header */}
            <motion.header
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-purple-900/30"
            >
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-[#D4AF37] bg-clip-text text-transparent">
                            WebGL Wormhole Demo
                        </h1>

                        <div className="flex items-center gap-4">
                            {/* Quality Selector */}
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-400">Quality:</span>
                                <select
                                    value={quality}
                                    onChange={(e) =>
                                        setQuality(e.target.value as 'low' | 'medium' | 'high')
                                    }
                                    className="bg-purple-900/50 border border-purple-700 rounded px-3 py-1 text-sm"
                                >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                </select>
                            </div>

                            {/* HUD Toggle */}
                            <button
                                onClick={() => setShowHUD(!showHUD)}
                                className={`px-3 py-1 rounded text-sm transition-colors ${
                                    showHUD
                                        ? 'bg-purple-600 hover:bg-purple-700'
                                        : 'bg-gray-700 hover:bg-gray-600'
                                }`}
                            >
                                {showHUD ? 'Hide' : 'Show'} Stats
                            </button>
                        </div>
                    </div>
                </div>
            </motion.header>

            {/* Demo Selector */}
            <div className="fixed top-24 left-4 z-40 bg-black/80 backdrop-blur-md border border-purple-900/30 rounded-lg p-4">
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-3">Demos</p>
                <div className="space-y-2">
                    {demos.map((demo) => (
                        <button
                            key={demo.id}
                            onClick={() => setActiveDemo(demo.id as any)}
                            className={`w-full text-left px-4 py-3 rounded transition-all ${
                                activeDemo === demo.id
                                    ? 'bg-purple-600 text-white'
                                    : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                            }`}
                        >
                            <span className="mr-2">{demo.icon}</span>
                            {demo.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Controls Panel */}
            <div className="fixed top-24 right-4 z-40 bg-black/80 backdrop-blur-md border border-purple-900/30 rounded-lg p-4 w-64">
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-3">Controls</p>

                {/* Scroll Progress */}
                <div className="mb-4">
                    <label className="text-sm text-gray-300 mb-2 block">
                        Scroll Progress: {(scrollProgress * 100).toFixed(0)}%
                    </label>
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={scrollProgress}
                        onChange={(e) => setScrollProgress(parseFloat(e.target.value))}
                        className="w-full"
                    />
                </div>

                {/* Info */}
                <div className="text-xs text-gray-400 space-y-2 border-t border-purple-900/30 pt-4">
                    <p>🖱️ Right-click + drag to rotate</p>
                    <p>🔍 Scroll to zoom</p>
                    <p>⌨️ Adjust slider for scroll effects</p>
                </div>
            </div>

            {/* Main Canvas Area */}
            <div className="h-screen pt-20">
                {activeDemo === 'complete' && (
                    <WormholeScene
                        scrollProgress={scrollProgress}
                        performance={quality}
                        enableControls={true}
                        className="w-full h-full"
                    />
                )}

                {activeDemo === 'wormhole' && (
                    <Canvas
                        camera={{ position: [0, 0, 10], fov: 60 }}
                        gl={{ antialias: quality === 'high', alpha: true }}
                        dpr={quality === 'low' ? 1 : [1, 2]}
                    >
                        <ambientLight intensity={0.2} />
                        <pointLight position={[0, 0, 0]} intensity={2} color="#D4AF37" />
                        <Wormhole scrollProgress={scrollProgress} />
                        <OrbitControls />
                        {showHUD && <PerformanceHUD />}
                    </Canvas>
                )}

                {activeDemo === 'particles' && (
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
                )}

                {activeDemo === 'lensing' && (
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
                )}
            </div>

            {/* Feature Cards */}
            <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40">
                <div className="bg-black/80 backdrop-blur-md border border-purple-900/30 rounded-lg px-6 py-3">
                    <div className="flex items-center gap-6 text-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            <span className="text-gray-300">
                                {activeDemo === 'complete' ? '5000+' : '1000+'} Particles
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-purple-500 rounded-full" />
                            <span className="text-gray-300">GPU Accelerated</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-[#D4AF37] rounded-full" />
                            <span className="text-gray-300">Real-time Physics</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
