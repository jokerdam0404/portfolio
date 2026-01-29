'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight, TrendingUp, BarChart2 } from 'lucide-react';
import { AnimatedSectionHeader, ScrollRevealText } from '@/components/typography';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { EASING, TIMING } from '@/lib/kinetic-constants';

const caseStudies = [
    {
        id: 'nvidia-ai-thesis',
        title: 'NVIDIA: AI Infrastructure Play',
        category: 'Technology',
        outcome: '+127% Return',
        outcomeType: 'positive',
        summary: 'Identified NVIDIA as the dominant AI infrastructure provider before the generative AI breakout. Built a comprehensive DCF model factoring in data center GPU TAM expansion.',
        metrics: [
            { label: 'Entry Price', value: '$180' },
            { label: 'Target Price', value: '$450' },
            { label: 'Time Horizon', value: '18 months' },
        ],
    },
    {
        id: 'constellation-software',
        title: 'Constellation Software: Serial Acquirer',
        category: 'Software',
        outcome: '+45% Return',
        outcomeType: 'positive',
        summary: 'Deep-dive into CSU\'s capital allocation strategy and VMS acquisition playbook. Modeled IRR on acquired businesses to validate sustainable growth trajectory.',
        metrics: [
            { label: 'Entry Price', value: 'CAD $2,100' },
            { label: 'Target Price', value: 'CAD $3,200' },
            { label: 'Time Horizon', value: '24 months' },
        ],
    },
    {
        id: 'energy-short',
        title: 'Clean Energy Short: Valuation Reset',
        category: 'Energy',
        outcome: '+38% Return',
        outcomeType: 'positive',
        summary: 'Contrarian short thesis on overvalued clean energy SPACs. Built a comparative valuation framework exposing unsustainable multiples vs. traditional energy peers.',
        metrics: [
            { label: 'Thesis', value: 'Short' },
            { label: 'Catalyst', value: 'Rate hikes' },
            { label: 'Time Horizon', value: '6 months' },
        ],
    },
];

export default function CaseStudySection() {
    const prefersReducedMotion = usePrefersReducedMotion();

    return (
        <section id="work" className="relative py-24 bg-[#050505]">
            <div className="max-w-7xl mx-auto px-6 lg:px-12">
                {/* Animated Section Header */}
                <AnimatedSectionHeader
                    label="Case Studies"
                    title="Investment Thesis Archive"
                    description="Select examples of fundamental research and investment theses. Each case study demonstrates rigorous bottom-up analysis and conviction-driven position sizing."
                    animation="split"
                    centered={false}
                    className="mb-16"
                />

                {/* Case Study Cards */}
                <motion.div
                    className="grid grid-cols-1 lg:grid-cols-3 gap-6"
                    variants={{
                        hidden: { opacity: 0 },
                        visible: {
                            opacity: 1,
                            transition: { staggerChildren: 0.15 },
                        },
                    }}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    {caseStudies.map((study, index) => (
                        <motion.article
                            key={study.id}
                            variants={{
                                hidden: { opacity: 0, y: 40, scale: 0.95 },
                                visible: {
                                    opacity: 1,
                                    y: 0,
                                    scale: 1,
                                    transition: {
                                        duration: 0.6,
                                        ease: EASING.smooth,
                                    },
                                },
                            }}
                            whileHover={prefersReducedMotion ? undefined : { y: -8, scale: 1.01 }}
                            className="group relative flex flex-col p-6 bg-white/[0.02] border border-white/[0.05] rounded-2xl backdrop-blur-sm transition-all hover:bg-white/[0.04] hover:border-[#D4AF37]/30 cursor-pointer shadow-xl hover:shadow-2xl"
                        >
                            {/* Glow effect */}
                            <div className="absolute inset-0 rounded-2xl bg-[#D4AF37]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />

                            {/* Shine effect on hover */}
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            <div className="relative z-10 flex flex-col flex-1">
                                {/* Header */}
                                <div className="flex items-start justify-between mb-4">
                                    <motion.span
                                        className="px-3 py-1 text-xs font-mono bg-white/5 text-white/60 rounded-full"
                                        whileHover={prefersReducedMotion ? undefined : { scale: 1.05 }}
                                    >
                                        {study.category}
                                    </motion.span>
                                    <motion.div
                                        className="flex items-center gap-1 text-[#4ADE80] font-mono text-sm font-semibold"
                                        initial={{ opacity: 0, x: 20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.3 + index * 0.1 }}
                                    >
                                        <TrendingUp className="w-4 h-4" />
                                        {study.outcome}
                                    </motion.div>
                                </div>

                                {/* Title */}
                                <h3 className="text-xl font-display font-bold text-white mb-3 group-hover:text-[#D4AF37] transition-colors">
                                    {study.title}
                                </h3>

                                {/* Summary */}
                                <p className="text-sm text-white/60 leading-relaxed mb-6 flex-1">
                                    {study.summary}
                                </p>

                                {/* Metrics with staggered animation */}
                                <motion.div
                                    className="grid grid-cols-3 gap-3 pt-4 border-t border-white/[0.05]"
                                    variants={{
                                        hidden: { opacity: 0 },
                                        visible: {
                                            opacity: 1,
                                            transition: { staggerChildren: 0.1, delayChildren: 0.2 },
                                        },
                                    }}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true }}
                                >
                                    {study.metrics.map((metric) => (
                                        <motion.div
                                            key={metric.label}
                                            variants={{
                                                hidden: { opacity: 0, y: 10 },
                                                visible: { opacity: 1, y: 0 },
                                            }}
                                        >
                                            <div className="text-xs text-white/40 uppercase tracking-wide mb-1">
                                                {metric.label}
                                            </div>
                                            <div className="text-sm font-mono font-semibold text-white">
                                                {metric.value}
                                            </div>
                                        </motion.div>
                                    ))}
                                </motion.div>

                                {/* Read more */}
                                <motion.div
                                    className="flex items-center gap-2 mt-4 text-sm text-[#D4AF37] font-semibold opacity-0 group-hover:opacity-100 transition-opacity"
                                    whileHover={prefersReducedMotion ? undefined : { x: 5 }}
                                >
                                    Read Full Analysis
                                    <ArrowUpRight className="w-4 h-4" />
                                </motion.div>
                            </div>
                        </motion.article>
                    ))}
                </motion.div>

                {/* View All CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="flex justify-center mt-12"
                >
                    <motion.a
                        href="/work"
                        className="inline-flex items-center gap-2 px-6 py-3 border border-white/20 text-white font-semibold rounded-full transition-all hover:bg-white/10 hover:border-white/40"
                        whileHover={prefersReducedMotion ? undefined : { scale: 1.05 }}
                        whileTap={prefersReducedMotion ? undefined : { scale: 0.95 }}
                    >
                        <BarChart2 className="w-5 h-5" />
                        View All Case Studies
                    </motion.a>
                </motion.div>
            </div>
        </section>
    );
}
