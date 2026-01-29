'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import dynamic from 'next/dynamic';

// Dynamic import for wormhole scene
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
 * Space to Wall Street Hero
 *
 * An immersive journey narrative combining:
 * - 3D wormhole visualization
 * - Scroll-driven story progression
 * - Three acts: Space → Transition → Wall Street
 */
export default function SpaceToWallStreetHero() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start start', 'end start'],
    });

    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Scene transitions based on scroll
    const scene1Opacity = useTransform(scrollYProgress, [0, 0.25, 0.35], [1, 1, 0]);
    const scene2Opacity = useTransform(scrollYProgress, [0.3, 0.4, 0.6, 0.7], [0, 1, 1, 0]);
    const scene3Opacity = useTransform(scrollYProgress, [0.65, 0.75, 1], [0, 1, 1]);

    const textY = useTransform(scrollYProgress, [0, 1], [0, -200]);
    const wormholeProgress = scrollYProgress;

    return (
        <div ref={containerRef} className="relative h-[400vh] bg-black">
            {/* Sticky Viewport */}
            <div className="sticky top-0 h-screen w-full overflow-hidden">
                {/* 3D Wormhole Background */}
                <div className="absolute inset-0 z-0">
                    {isMounted && (
                        <WormholeScene
                            scrollProgress={scrollYProgress.get()}
                            performance="auto"
                            className="w-full h-full"
                        />
                    )}
                </div>

                {/* Gradient overlays for text contrast */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/60 pointer-events-none z-10" />

                {/* ACT 1: FROM THE COSMOS */}
                <motion.div
                    style={{ opacity: scene1Opacity, y: textY }}
                    className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4"
                >
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 1 }}
                        className="max-w-4xl"
                    >
                        <motion.p
                            className="text-sm md:text-base text-blue-300 mb-4 tracking-[0.3em] uppercase font-mono"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            ACT I: ORIGINS
                        </motion.p>

                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight">
                            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                                From Deep Space
                            </span>
                        </h1>

                        <p className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto">
                            Where <span className="text-blue-400 font-semibold">particle physics</span> meets
                            {' '}<span className="text-purple-400 font-semibold">economic theory</span>,
                            a journey begins through the fabric of spacetime itself.
                        </p>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.5 }}
                            className="mt-8 text-sm text-gray-500 font-mono"
                        >
                            Scroll to traverse the wormhole →
                        </motion.div>
                    </motion.div>
                </motion.div>

                {/* ACT 2: THROUGH THE WORMHOLE */}
                <motion.div
                    style={{ opacity: scene2Opacity }}
                    className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4"
                >
                    <motion.div className="max-w-4xl">
                        <p className="text-sm md:text-base text-cyan-300 mb-4 tracking-[0.3em] uppercase font-mono">
                            ACT II: TRANSFORMATION
                        </p>

                        <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight">
                            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                                The Singularity
                            </span>
                        </h2>

                        <p className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto">
                            Through gravitational lensing and curved spacetime,
                            theoretical knowledge transforms into
                            {' '}<span className="text-gold font-semibold">practical financial acumen</span>.
                        </p>

                        <div className="mt-8 flex items-center justify-center gap-4 text-sm font-mono">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse" />
                                <span className="text-gray-400">Geant4 simulations</span>
                            </div>
                            <div className="w-px h-4 bg-gray-700" />
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-gold rounded-full animate-pulse" />
                                <span className="text-gray-400">DCF valuation models</span>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>

                {/* ACT 3: TO WALL STREET */}
                <motion.div
                    style={{ opacity: scene3Opacity }}
                    className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4"
                >
                    <motion.div className="max-w-4xl">
                        <p className="text-sm md:text-base text-gold mb-4 tracking-[0.3em] uppercase font-mono">
                            ACT III: ARRIVAL
                        </p>

                        <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight">
                            <span className="bg-gradient-to-r from-gold via-yellow-400 to-gold bg-clip-text text-transparent">
                                To Wall Street
                            </span>
                        </h2>

                        <p className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto mb-8">
                            Managing a <span className="text-gold font-bold">$5M mid-cap fund</span> with
                            the precision of quantum mechanics and the vision of astrophysics.
                        </p>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
                            <div className="bg-black/40 backdrop-blur-sm border border-gold/20 rounded-lg p-4">
                                <div className="text-2xl md:text-3xl font-bold text-gold">$5M</div>
                                <div className="text-xs md:text-sm text-gray-400 mt-1">AUM Managed</div>
                            </div>
                            <div className="bg-black/40 backdrop-blur-sm border border-blue-500/20 rounded-lg p-4">
                                <div className="text-2xl md:text-3xl font-bold text-blue-400">+18%</div>
                                <div className="text-xs md:text-sm text-gray-400 mt-1">Portfolio IRR</div>
                            </div>
                            <div className="bg-black/40 backdrop-blur-sm border border-purple-500/20 rounded-lg p-4">
                                <div className="text-2xl md:text-3xl font-bold text-purple-400">DCF</div>
                                <div className="text-xs md:text-sm text-gray-400 mt-1">Valuation Expert</div>
                            </div>
                            <div className="bg-black/40 backdrop-blur-sm border border-cyan-500/20 rounded-lg p-4">
                                <div className="text-2xl md:text-3xl font-bold text-cyan-400">C++</div>
                                <div className="text-xs md:text-sm text-gray-400 mt-1">Physics Coder</div>
                            </div>
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="mt-12"
                        >
                            <p className="text-base md:text-lg text-gray-400 italic">
                                &ldquo;Where the event horizon meets market horizons&rdquo;
                            </p>
                        </motion.div>
                    </motion.div>
                </motion.div>

                {/* Scroll indicator at bottom */}
                <motion.div
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 2, duration: 1, repeat: Infinity, repeatType: "reverse" }}
                >
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-px h-12 bg-gradient-to-b from-transparent via-blue-500 to-transparent" />
                        <div className="w-6 h-10 border-2 border-blue-500/30 rounded-full flex items-start justify-center p-2">
                            <motion.div
                                className="w-1 h-2 bg-blue-500 rounded-full"
                                animate={{ y: [0, 12, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                            />
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
