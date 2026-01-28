'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import dynamic from 'next/dynamic';

// Dynamic import to reduce initial bundle size
const WormholeScene = dynamic(() => import('@/components/3d/WormholeScene'), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full bg-gradient-to-b from-purple-950 to-black">
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full border-2 border-purple-500/30 border-t-purple-500 animate-spin" />
            </div>
        </div>
    ),
});

/**
 * Immersive 3D Wormhole Hero Section
 *
 * Features:
 * - Scroll-driven wormhole animation
 * - Photorealistic gravitational effects
 * - Parallax text overlay
 * - Smooth transitions between scenes
 * - Performance-optimized with lazy loading
 */
export default function WormholeHero() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start start', 'end start'],
    });

    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Transform scroll progress for smooth animations
    const textOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [1, 1, 0, 0]);
    const textY = useTransform(scrollYProgress, [0, 1], [0, -100]);
    const textScale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.2, 1.5]);

    const scene2Opacity = useTransform(scrollYProgress, [0.3, 0.5, 0.8, 1], [0, 1, 1, 0]);
    const scene3Opacity = useTransform(scrollYProgress, [0.7, 0.85, 1], [0, 1, 1]);

    return (
        <div ref={containerRef} className="relative h-[400vh] bg-black">
            {/* Sticky Viewport */}
            <div className="sticky top-0 h-screen w-full overflow-hidden">
                {/* 3D Wormhole Background */}
                <div className="absolute inset-0">
                    {isMounted && (
                        <WormholeScene
                            scrollProgress={scrollYProgress.get()}
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
                        <span className="bg-gradient-to-r from-blue-400 via-[#4da6ff] to-blue-400 bg-clip-text text-transparent">
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
                </motion.div>

                {/* Scene 2: Journey Through */}
                <motion.div
                    style={{ opacity: scene2Opacity }}
                    className="absolute inset-0 flex flex-col items-center justify-center text-center px-4"
                >
                    <h3 className="text-7xl md:text-9xl font-bold mb-4 tracking-tight">
                        <span className="bg-gradient-to-r from-[#4da6ff] via-white to-[#4da6ff] bg-clip-text text-transparent">
                            Diving Deeper
                        </span>
                    </h3>
                    <p className="text-4xl md:text-6xl font-light text-white/90">
                        Into Opportunity
                    </p>
                </motion.div>

                {/* Scene 3: Emergence */}
                <motion.div
                    style={{ opacity: scene3Opacity }}
                    className="absolute inset-0 flex flex-col items-center justify-center text-center px-4"
                >
                    <h3 className="text-7xl md:text-9xl font-bold mb-4 tracking-tight">
                        <span className="bg-gradient-to-r from-white via-[#4da6ff] to-white bg-clip-text text-transparent">
                            Precision Capital
                        </span>
                    </h3>
                    <p className="text-4xl md:text-6xl font-light text-white/90">
                        Measured Returns
                    </p>
                </motion.div>

                {/* Scroll Indicator */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.5, duration: 0.5 }}
                    style={{ opacity: useTransform(scrollYProgress, [0, 0.1], [1, 0]) }}
                    className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20"
                >
                    <motion.div className="flex flex-col items-center gap-2">
                        <motion.span
                            className="text-sm text-blue-300/60 uppercase tracking-widest font-mono"
                            animate={{ opacity: [0.6, 1, 0.6] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            Scroll to explore the wormhole
                        </motion.span>
                        <motion.div
                            animate={{ y: [0, 12, 0] }}
                            transition={{
                                duration: 1.8,
                                repeat: Infinity,
                                ease: 'easeInOut',
                            }}
                            className="w-6 h-10 border-2 border-[#4da6ff]/40 rounded-full flex items-start justify-center p-2 relative overflow-hidden"
                        >
                            <motion.div
                                animate={{ y: [0, 16, 16] }}
                                transition={{
                                    duration: 1.8,
                                    repeat: Infinity,
                                    ease: 'easeInOut',
                                }}
                                className="w-1 h-2 bg-[#4da6ff] rounded-full"
                            />
                        </motion.div>
                    </motion.div>
                </motion.div>

                {/* Vignette Effect */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-black/50" />
                </div>
            </div>
        </div>
    );
}
