'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown, Calendar, Mail } from 'lucide-react';

// Lazy load the 3D scene for performance
const Scene = dynamic(() => import('@/components/3d/Scene'), {
    ssr: false,
    loading: () => (
        <div className="absolute inset-0 bg-gradient-to-br from-[#050505] via-[#0a0a0a] to-[#050505]" />
    ),
});

const HeroModel = dynamic(() => import('@/components/3d/HeroModel'), {
    ssr: false,
});

export default function Hero3D() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [scrollProgress, setScrollProgress] = useState(0);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start start', 'end start'],
    });

    const textY = useTransform(scrollYProgress, [0, 1], [0, 200]);
    const textOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
    const sceneOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.3]);

    useEffect(() => {
        const unsubscribe = scrollYProgress.on('change', (v) => {
            setScrollProgress(v);
        });
        return () => unsubscribe();
    }, [scrollYProgress]);

    return (
        <section
            ref={containerRef}
            id="hero"
            className="relative min-h-[200vh] bg-[#050505]"
        >
            {/* Fixed viewport container */}
            <div className="sticky top-0 h-screen overflow-hidden">
                {/* 3D Scene Background */}
                <motion.div
                    className="absolute inset-0 z-0"
                    style={{ opacity: sceneOpacity }}
                >
                    <Scene className="w-full h-full">
                        <HeroModel scrollProgress={scrollProgress} />
                    </Scene>
                </motion.div>

                {/* Gradient overlays for depth */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#050505]/90 via-transparent to-transparent z-10 pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent z-10 pointer-events-none" />

                {/* Content Layer */}
                <motion.div
                    className="relative z-20 h-full flex items-center"
                    style={{ y: textY, opacity: textOpacity }}
                >
                    <div className="w-full max-w-7xl mx-auto px-6 lg:px-12">
                        <div className="max-w-2xl">
                            {/* Eyebrow */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="flex items-center gap-3 mb-6"
                            >
                                <div className="w-12 h-px bg-[#D4AF37]" />
                                <span className="text-[#D4AF37] font-mono text-sm tracking-widest uppercase">
                                    Finance • Research • Strategy
                                </span>
                            </motion.div>

                            {/* Main Headline */}
                            <motion.h1
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.3 }}
                                className="text-5xl md:text-6xl lg:text-7xl font-display font-bold text-white leading-[1.1] mb-6"
                            >
                                Precision Capital.
                                <br />
                                <span className="text-[#D4AF37]">Measured Returns.</span>
                            </motion.h1>

                            {/* Subheadline */}
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.5 }}
                                className="text-lg md:text-xl text-white/70 leading-relaxed mb-8 max-w-lg"
                            >
                                Equity Analyst managing a <span className="text-white font-semibold">$5M fund</span> with a track record of identifying asymmetric opportunities through rigorous fundamental analysis.
                            </motion.p>

                            {/* Metrics Row */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.6 }}
                                className="flex gap-8 mb-10"
                            >
                                <div>
                                    <div className="text-3xl font-mono font-bold text-[#D4AF37]">$5M+</div>
                                    <div className="text-sm text-white/50 uppercase tracking-wide">AUM</div>
                                </div>
                                <div>
                                    <div className="text-3xl font-mono font-bold text-white">42%</div>
                                    <div className="text-sm text-white/50 uppercase tracking-wide">IRR</div>
                                </div>
                                <div>
                                    <div className="text-3xl font-mono font-bold text-white">15+</div>
                                    <div className="text-sm text-white/50 uppercase tracking-wide">Pitches</div>
                                </div>
                            </motion.div>

                            {/* CTAs */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.7 }}
                                className="flex flex-wrap gap-4"
                            >
                                <a
                                    href="#contact"
                                    className="group inline-flex items-center gap-2 px-6 py-3 bg-[#D4AF37] text-[#050505] font-semibold rounded-full transition-all hover:bg-[#E5C04B] hover:scale-105"
                                >
                                    <Calendar className="w-5 h-5" />
                                    Schedule a Call
                                </a>
                                <a
                                    href="mailto:achintya@example.com"
                                    className="group inline-flex items-center gap-2 px-6 py-3 border border-white/20 text-white font-semibold rounded-full transition-all hover:bg-white/10 hover:border-white/40"
                                >
                                    <Mail className="w-5 h-5" />
                                    Get in Touch
                                </a>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>

                {/* Scroll indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5 }}
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
                >
                    <motion.div
                        animate={{ y: [0, 10, 0] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="flex flex-col items-center gap-2 text-white/40"
                    >
                        <span className="text-xs uppercase tracking-widest">Scroll</span>
                        <ArrowDown className="w-4 h-4" />
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
