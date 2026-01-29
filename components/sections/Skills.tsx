"use client";

import { useState, lazy, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ScrollReveal from "@/components/animations/ScrollReveal";
import { AnimatedSectionHeader, ScrollRevealText, CharacterHover } from "@/components/typography";
import { skills, skillCategories, Skill } from "@/lib/data/skills";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { EASING, TIMING } from "@/lib/kinetic-constants";

// Lazy load 3D background for performance
const InteractiveBackground = lazy(() => import('@/components/3d/InteractiveBackground'));

export default function Skills() {
  const [activeCategory, setActiveCategory] = useState<string>("Finance");
  const prefersReducedMotion = usePrefersReducedMotion();

  const filteredSkills = skills.filter(
    (skill) => skill.category === activeCategory
  );

  return (
    <section id="skills" className="relative py-24 bg-[#050505] overflow-hidden">
      {/* Interactive 3D Background */}
      <div className="absolute inset-0 pointer-events-none">
        <Suspense fallback={null}>
          <InteractiveBackground
            particleCount={60}
            showGrid={true}
            showRings={true}
            intensity="low"
          />
        </Suspense>
      </div>

      {/* Background decoration */}
      <div className="absolute top-1/2 right-0 w-72 h-72 bg-gold/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
        {/* Animated Section Header */}
        <AnimatedSectionHeader
          label="Capabilities"
          title="Skills & Competencies"
          animation="split"
          className="mb-16"
        />

        {/* Category Tabs with enhanced hover effects */}
        <ScrollReveal delay={0.2}>
          <motion.div
            className="flex flex-wrap gap-2 justify-center mb-16"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.05 },
              },
            }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {skillCategories.map((category) => (
              <motion.button
                key={category.name}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
                onClick={() => setActiveCategory(category.name)}
                whileHover={prefersReducedMotion ? undefined : { scale: 1.05 }}
                whileTap={prefersReducedMotion ? undefined : { scale: 0.95 }}
                className={`px-8 py-3 rounded-full font-mono text-sm tracking-widest uppercase transition-all duration-300 border ${activeCategory === category.name
                  ? "bg-gold text-[#050505] border-gold shadow-[0_0_20px_rgba(212,175,55,0.3)]"
                  : "bg-white/[0.02] text-white/40 border-white/10 hover:border-white/30 hover:text-white"
                  }`}
              >
                {category.name}
              </motion.button>
            ))}
          </motion.div>
        </ScrollReveal>

        {/* Skills Grid with animated bars */}
        <div className="grid md:grid-cols-2 gap-x-16 gap-y-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="md:col-span-2 grid md:grid-cols-2 gap-x-16 gap-y-10"
            >
              {filteredSkills.map((skill, index) => (
                <motion.div
                  key={skill.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.4 }}
                  className="space-y-4 group"
                >
                  <div className="flex items-end justify-between">
                    <div className="space-y-1">
                      <span className="text-xl font-display font-bold text-white group-hover:text-gold transition-colors">
                        {prefersReducedMotion ? (
                          skill.name
                        ) : (
                          <CharacterHover
                            text={skill.name}
                            hoverColor="#D4AF37"
                            hoverScale={1.1}
                          />
                        )}
                      </span>
                      {skill.description && (
                        <p className="text-xs text-white/40 font-light tracking-wide uppercase">
                          {skill.description}
                        </p>
                      )}
                    </div>
                    <motion.span
                      className="text-sm font-mono text-gold/60"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 + index * 0.05 }}
                    >
                      {skill.proficiency}%
                    </motion.span>
                  </div>

                  <div className="relative h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-gold/40 to-gold rounded-full"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.proficiency}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.5, ease: [0.33, 1, 0.68, 1], delay: index * 0.05 }}
                    >
                      {/* Interactive glow head */}
                      <motion.div
                        className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full blur-md opacity-0 group-hover:opacity-40 transition-opacity"
                        layoutId={`glow-${skill.name}`}
                      />
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* All Skills Cloud with staggered reveal */}
        <ScrollReveal delay={0.4}>
          <div className="mt-24 pt-16 border-t border-white/5">
            <h3 className="text-sm font-mono text-white/20 uppercase tracking-[0.3em] mb-10 text-center">
              Comprehensive Stack Overview
            </h3>
            <motion.div
              className="flex flex-wrap gap-3 justify-center max-w-4xl mx-auto"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.02 },
                },
              }}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {skills.map((skill) => (
                <motion.div
                  key={skill.name}
                  variants={{
                    hidden: { opacity: 0, scale: 0.8 },
                    visible: { opacity: 1, scale: 1 },
                  }}
                  whileHover={prefersReducedMotion ? undefined : { scale: 1.1, y: -2 }}
                  className="px-4 py-2 border border-white/5 bg-white/[0.02] text-xs font-mono text-white/40 rounded-lg hover:border-gold/20 hover:text-white/80 hover:bg-gold/5 transition-all cursor-default"
                >
                  {skill.name}
                </motion.div>
              ))}
            </motion.div>
          </div>
        </ScrollReveal>
      </div>
    </section>

  );
}
