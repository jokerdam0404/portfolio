'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import dynamic from 'next/dynamic';

// Dynamic import to reduce initial bundle size
const PhysicsWormholeScene = dynamic(
    () => import('@/components/3d/PhysicsWormholeScene'),
    {
        ssr: false,
        loading: () => (
            <div className="w-full h-full bg-gradient-to-b from-blue-950 to-black">
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                        <div className="w-16 h-16 rounded-full border-2 border-blue-500/30 border-t-blue-500 animate-spin mx-auto" />
                        <p className="text-blue-400 mt-4 font-mono text-sm">Initializing Physics Engine...</p>
                        <p className="text-gray-500 text-xs mt-1">Loading Morris-Thorne metric calculations</p>
                    </div>
                </div>
            </div>
        ),
    }
);

/**
 * Physics-Accurate Wormhole Hero Section
 *
 * An immersive hero section featuring a scientifically accurate
 * wormhole visualization based on Kip Thorne's research.
 *
 * Features:
 * - Scroll-driven camera movement through wormhole
 * - Real general relativity calculations
 * - Gravitational lensing effects
 * - Einstein ring formation
 * - Educational physics overlays
 *
 * The physics implementation follows:
 * - Morris-Thorne traversable wormhole metric (1988)
 * - Interstellar visualization methodology (James et al., 2015)
 */
export default function PhysicsWormholeHero() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start start', 'end start'],
    });

    const [isMounted, setIsMounted] = useState(false);
    const [scrollValue, setScrollValue] = useState(0);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Update scroll value for physics simulation
    useEffect(() => {
        const unsubscribe = scrollYProgress.on('change', (v) => {
            setScrollValue(v);
        });
        return () => unsubscribe();
    }, [scrollYProgress]);

    // Transform scroll progress for smooth animations
    const textOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [1, 1, 0, 0]);
    const textY = useTransform(scrollYProgress, [0, 1], [0, -100]);
    const textScale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.2, 1.5]);

    const scene2Opacity = useTransform(scrollYProgress, [0.3, 0.5, 0.8, 1], [0, 1, 1, 0]);
    const scene3Opacity = useTransform(scrollYProgress, [0.7, 0.85, 1], [0, 1, 1]);

    // Physics info that appears during scroll
    const physicsInfoOpacity = useTransform(scrollYProgress, [0.2, 0.3, 0.5, 0.6], [0, 1, 1, 0]);

    return (
        <div ref={containerRef} className="relative h-[400vh] bg-black">
            {/* Sticky Viewport */}
            <div className="sticky top-0 h-screen w-full overflow-hidden">
                {/* 3D Physics Wormhole Background */}
                <div className="absolute inset-0">
                    {isMounted && (
                        <PhysicsWormholeScene
                            scrollProgress={scrollValue}
                            enableControls={false}
                            showPhysicsPanel={false}
                            showEquations={false}
                            performance="auto"
                            className="w-full h-full"
                        />
                    )}
                </div>

                {/* Gradient Overlays for Better Text Contrast */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none" />

                {/* Scene 1: Introduction */}
                <motion.div
                    style={{ opacity: textOpacity, y: textY, scale: textScale }}
                    className="absolute inset-0 flex flex-col items-center justify-center text-center px-4"
                >
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                        className="mb-4"
                    >
                        <span className="text-xs font-mono text-blue-400/60 tracking-[0.3em] uppercase">
                            General Relativity Visualization
                        </span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 1 }}
                        className="text-6xl md:text-8xl lg:text-9xl font-bold mb-6 tracking-tight"
                    >
                        <span className="bg-gradient-to-r from-white via-blue-200 to-white bg-clip-text text-transparent">
                            Beyond The
                        </span>
                    </motion.h1>
                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8, duration: 1 }}
                        className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight"
                    >
                        <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
                            Event Horizon
                        </span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.2, duration: 1 }}
                        className="mt-8 text-xl md:text-2xl text-blue-200/80 max-w-2xl"
                    >
                        Where finance meets the infinite possibilities of data science
                    </motion.p>

                    {/* Physics Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.5, duration: 0.8 }}
                        className="mt-8 px-4 py-2 bg-blue-900/30 border border-blue-500/30 rounded-full"
                    >
                        <span className="text-xs font-mono text-blue-300">
                            Morris-Thorne Metric | Geodesic Ray Tracing | Einstein Field Equations
                        </span>
                    </motion.div>
                </motion.div>

                {/* Physics Info Overlay (appears during scroll) */}
                <motion.div
                    style={{ opacity: physicsInfoOpacity }}
                    className="absolute top-20 left-8 max-w-sm"
                >
                    <div className="bg-black/60 backdrop-blur-sm rounded-lg p-4 border border-blue-500/20">
                        <h4 className="text-blue-400 font-mono text-sm mb-2">PHYSICS ENGINE</h4>
                        <div className="space-y-2 text-xs font-mono text-gray-300">
                            <div className="flex justify-between">
                                <span>Metric:</span>
                                <span className="text-green-300">Morris-Thorne</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Integration:</span>
                                <span className="text-green-300">RK4 Adaptive</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Lensing:</span>
                                <span className="text-green-300">Geodesic</span>
                            </div>
                        </div>
                        <div className="mt-3 pt-3 border-t border-gray-700">
                            <p className="text-xs text-gray-400">
                                Based on Kip Thorne&apos;s Interstellar research
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Scene 2: Journey Through */}
                <motion.div
                    style={{ opacity: scene2Opacity }}
                    className="absolute inset-0 flex flex-col items-center justify-center text-center px-4"
                >
                    <h3 className="text-7xl md:text-9xl font-bold mb-4 tracking-tight">
                        <span className="bg-gradient-to-r from-cyan-400 via-white to-cyan-400 bg-clip-text text-transparent">
                            Traversing Spacetime
                        </span>
                    </h3>
                    <p className="text-4xl md:text-6xl font-light text-white/90">
                        Through the Throat
                    </p>

                    {/* Equation Display */}
                    <motion.div
                        className="mt-8 p-4 bg-black/40 backdrop-blur-sm rounded-lg border border-cyan-500/20"
                    >
                        <p className="font-mono text-sm text-green-300">
                            ds<sup>2</sup> = -c<sup>2</sup>dt<sup>2</sup> + dl<sup>2</sup> + r(l)<sup>2</sup>(d&#952;<sup>2</sup> + sin<sup>2</sup>&#952; d&#966;<sup>2</sup>)
                        </p>
                        <p className="text-xs text-gray-400 mt-2">Morris-Thorne Wormhole Metric</p>
                    </motion.div>
                </motion.div>

                {/* Scene 3: Emergence */}
                <motion.div
                    style={{ opacity: scene3Opacity }}
                    className="absolute inset-0 flex flex-col items-center justify-center text-center px-4"
                >
                    <h3 className="text-7xl md:text-9xl font-bold mb-4 tracking-tight">
                        <span className="bg-gradient-to-r from-white via-blue-300 to-white bg-clip-text text-transparent">
                            Precision Capital
                        </span>
                    </h3>
                    <p className="text-4xl md:text-6xl font-light text-white/90">
                        Measured Returns
                    </p>

                    {/* Final Physics Badge */}
                    <motion.div className="mt-8 grid grid-cols-3 gap-4 max-w-2xl">
                        <div className="p-3 bg-black/40 rounded-lg border border-blue-500/20 text-center">
                            <div className="text-2xl font-bold text-blue-400">10<sup>38</sup></div>
                            <div className="text-xs text-gray-400 font-mono">Geodesics/sec</div>
                        </div>
                        <div className="p-3 bg-black/40 rounded-lg border border-blue-500/20 text-center">
                            <div className="text-2xl font-bold text-cyan-400">60</div>
                            <div className="text-xs text-gray-400 font-mono">FPS Target</div>
                        </div>
                        <div className="p-3 bg-black/40 rounded-lg border border-blue-500/20 text-center">
                            <div className="text-2xl font-bold text-green-400">RK4</div>
                            <div className="text-xs text-gray-400 font-mono">Integration</div>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Scroll Indicator */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 2, duration: 0.5 }}
                    style={{ opacity: useTransform(scrollYProgress, [0, 0.1], [1, 0]) }}
                    className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20"
                >
                    <motion.div className="flex flex-col items-center gap-2">
                        <motion.span
                            className="text-sm text-blue-300/60 uppercase tracking-widest font-mono"
                            animate={{ opacity: [0.6, 1, 0.6] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            Scroll to traverse the wormhole
                        </motion.span>
                        <motion.div
                            animate={{ y: [0, 12, 0] }}
                            transition={{
                                duration: 1.8,
                                repeat: Infinity,
                                ease: 'easeInOut',
                            }}
                            className="w-6 h-10 border-2 border-blue-400/40 rounded-full flex items-start justify-center p-2 relative overflow-hidden"
                        >
                            <motion.div
                                animate={{ y: [0, 16, 16] }}
                                transition={{
                                    duration: 1.8,
                                    repeat: Infinity,
                                    ease: 'easeInOut',
                                }}
                                className="w-1 h-2 bg-blue-400 rounded-full"
                            />
                        </motion.div>
                    </motion.div>
                </motion.div>

                {/* Scientific Attribution */}
                <div className="absolute bottom-4 right-4 text-right">
                    <p className="text-xs font-mono text-gray-600">
                        Physics: Morris-Thorne (1988)
                    </p>
                    <p className="text-xs font-mono text-gray-700">
                        Visualization: James et al. (2015)
                    </p>
                </div>

                {/* Vignette Effect */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-black/50" />
                </div>
            </div>
        </div>
    );
}
