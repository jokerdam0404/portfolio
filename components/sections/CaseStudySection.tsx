'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight, TrendingUp, BarChart2 } from 'lucide-react';

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
    return (
        <section id="work" className="relative py-24 bg-[#050505]">
            <div className="max-w-7xl mx-auto px-6 lg:px-12">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="mb-16"
                >
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-px bg-[#D4AF37]" />
                        <span className="text-[#D4AF37] font-mono text-sm tracking-widest uppercase">
                            Case Studies
                        </span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
                        Investment Thesis Archive
                    </h2>
                    <p className="text-white/60 max-w-2xl">
                        Select examples of fundamental research and investment theses. Each case study
                        demonstrates rigorous bottom-up analysis and conviction-driven position sizing.
                    </p>
                </motion.div>

                {/* Case Study Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {caseStudies.map((study, index) => (
                        <motion.article
                            key={study.id}
                            initial={{ opacity: 0, y: 40, scale: 0.95 }}
                            whileInView={{ opacity: 1, y: 0, scale: 1 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{
                                duration: 0.6,
                                delay: index * 0.15,
                                ease: [0.43, 0.13, 0.23, 0.96]
                            }}
                            whileHover={{ y: -8, scale: 1.01 }}
                            className="group relative flex flex-col p-6 bg-white/[0.02] border border-white/[0.05] rounded-2xl backdrop-blur-sm transition-all hover:bg-white/[0.04] hover:border-[#D4AF37]/30 cursor-pointer shadow-xl hover:shadow-2xl"
                        >
                            {/* Glow effect */}
                            <div className="absolute inset-0 rounded-2xl bg-[#D4AF37]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />

                            {/* Shine effect on hover */}
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            <div className="relative z-10 flex flex-col flex-1">
                                {/* Header */}
                                <div className="flex items-start justify-between mb-4">
                                    <span className="px-3 py-1 text-xs font-mono bg-white/5 text-white/60 rounded-full">
                                        {study.category}
                                    </span>
                                    <div className="flex items-center gap-1 text-[#4ADE80] font-mono text-sm font-semibold">
                                        <TrendingUp className="w-4 h-4" />
                                        {study.outcome}
                                    </div>
                                </div>

                                {/* Title */}
                                <h3 className="text-xl font-display font-bold text-white mb-3 group-hover:text-[#D4AF37] transition-colors">
                                    {study.title}
                                </h3>

                                {/* Summary */}
                                <p className="text-sm text-white/60 leading-relaxed mb-6 flex-1">
                                    {study.summary}
                                </p>

                                {/* Metrics */}
                                <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/[0.05]">
                                    {study.metrics.map((metric) => (
                                        <div key={metric.label}>
                                            <div className="text-xs text-white/40 uppercase tracking-wide mb-1">
                                                {metric.label}
                                            </div>
                                            <div className="text-sm font-mono font-semibold text-white">
                                                {metric.value}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Read more */}
                                <div className="flex items-center gap-2 mt-4 text-sm text-[#D4AF37] font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                                    Read Full Analysis
                                    <ArrowUpRight className="w-4 h-4" />
                                </div>
                            </div>
                        </motion.article>
                    ))}
                </div>

                {/* View All CTA */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                    className="flex justify-center mt-12"
                >
                    <a
                        href="/work"
                        className="inline-flex items-center gap-2 px-6 py-3 border border-white/20 text-white font-semibold rounded-full transition-all hover:bg-white/10 hover:border-white/40"
                    >
                        <BarChart2 className="w-5 h-5" />
                        View All Case Studies
                    </a>
                </motion.div>
            </div>
        </section>
    );
}
