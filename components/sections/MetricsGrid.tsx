'use client';

import { useRef, useEffect, useState, lazy, Suspense } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';
import { TrendingUp, BarChart3, Target, Briefcase } from 'lucide-react';

// Lazy load 3D component for performance
const FloatingGeometry = lazy(() => import('@/components/3d/FloatingGeometry'));

function AnimatedCounter({ value, duration = 2 }: { value: string; duration?: number }) {
    const [count, setCount] = useState(0);
    const controls = useAnimation();
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, margin: "-100px" });

    useEffect(() => {
        if (inView) {
            // Extract numeric part for animation
            const numericValue = value.match(/[\d.]+/)?.[0];
            if (numericValue) {
                const target = parseFloat(numericValue);
                const increment = target / (duration * 60); // 60fps
                let current = 0;

                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        setCount(target);
                        clearInterval(timer);
                    } else {
                        setCount(current);
                    }
                }, 1000 / 60);

                return () => clearInterval(timer);
            }
        }
    }, [inView, value, duration]);

    const displayValue = value.replace(/[\d.]+/, count.toFixed(value.includes('.') ? 1 : 0));

    return (
        <div ref={ref} className="text-4xl font-mono font-bold text-white mb-1">
            {displayValue}
        </div>
    );
}

const metrics = [
    {
        icon: Briefcase,
        value: '$5M+',
        label: 'Assets Under Management',
        description: 'Managing student-run investment fund',
    },
    {
        icon: TrendingUp,
        value: '42%',
        label: 'Portfolio IRR',
        description: 'Outperforming benchmark by 15%',
    },
    {
        icon: BarChart3,
        value: '15+',
        label: 'Investment Pitches',
        description: 'Comprehensive equity research',
    },
    {
        icon: Target,
        value: '8',
        label: 'Active Positions',
        description: 'Concentrated conviction portfolio',
    },
];

// 3D scene configuration for metrics section
const metrics3DConfig = {
    showOctahedron: true,
    showTorus: true,
    showIcosahedron: false,
    showWireframeCube: true,
    showParticles: true,
    particleCount: 20,
    positions: {
        octahedron: [-4, 2, -2] as [number, number, number],
        torus: [4, -1.5, -1] as [number, number, number],
        wireframeCube: [3, 2, -3] as [number, number, number],
    },
    scales: {
        octahedron: 0.4,
        torus: 0.35,
        wireframeCube: 0.6,
    },
    speed: 0.7,
};

export default function MetricsGrid() {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });

    return (
        <section className="relative py-24 bg-[#0a0a0a] overflow-hidden">
            {/* 3D Floating Geometry Background */}
            <div className="absolute inset-0 pointer-events-none opacity-60">
                <Suspense fallback={null}>
                    <FloatingGeometry config={metrics3DConfig} />
                </Suspense>
            </div>

            {/* Subtle gradient accent */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-transparent to-[#050505] pointer-events-none" />

            <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="w-8 h-px bg-[#D4AF37]" />
                        <span className="text-[#D4AF37] font-mono text-sm tracking-widest uppercase">
                            Track Record
                        </span>
                        <div className="w-8 h-px bg-[#D4AF37]" />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-display font-bold text-white">
                        Performance Metrics
                    </h2>
                </motion.div>

                {/* Metrics Grid */}
                <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {metrics.map((metric, index) => {
                        const Icon = metric.icon;
                        return (
                            <motion.div
                                key={metric.label}
                                initial={{ opacity: 0, y: 40, scale: 0.9 }}
                                animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                                transition={{
                                    duration: 0.6,
                                    delay: index * 0.15,
                                    ease: [0.43, 0.13, 0.23, 0.96]
                                }}
                                whileHover={{ y: -8, scale: 1.02 }}
                                className="group relative p-6 bg-white/[0.02] border border-white/[0.05] rounded-2xl backdrop-blur-sm transition-all hover:bg-white/[0.04] hover:border-[#D4AF37]/30 shadow-xl hover:shadow-2xl"
                            >
                                {/* Glow effect on hover */}
                                <div className="absolute inset-0 rounded-2xl bg-[#D4AF37]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />

                                {/* Shine effect */}
                                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                <div className="relative z-10">
                                    {/* Icon */}
                                    <motion.div
                                        className="w-12 h-12 flex items-center justify-center rounded-xl bg-[#D4AF37]/10 text-[#D4AF37] mb-4"
                                        whileHover={{ scale: 1.15, rotate: 5 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <Icon className="w-6 h-6" />
                                    </motion.div>

                                    {/* Value with counter animation */}
                                    <AnimatedCounter value={metric.value} />

                                    {/* Label */}
                                    <div className="text-sm font-semibold text-white/80 mb-2">
                                        {metric.label}
                                    </div>

                                    {/* Description */}
                                    <div className="text-xs text-white/50">
                                        {metric.description}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
