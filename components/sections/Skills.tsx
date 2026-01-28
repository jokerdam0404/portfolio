"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ScrollReveal from "@/components/animations/ScrollReveal";
import { skills, skillCategories, Skill } from "@/lib/data/skills";
import { fadeInUp, staggerContainer } from "@/lib/animations";

function SkillBar({ skill }: { skill: Skill }) {
  return (
    <motion.div variants={fadeInUp} className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="font-medium text-primary-900">{skill.name}</span>
        <span className="text-sm text-primary-500">{skill.proficiency}%</span>
      </div>
      <div className="h-2 bg-primary-200 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-accent-500 rounded-full"
          initial={{ width: 0 }}
          whileInView={{ width: `${skill.proficiency}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
        />
      </div>
      {skill.description && (
        <p className="text-sm text-primary-600">{skill.description}</p>
      )}
    </motion.div>
  );
}

export default function Skills() {
  const [activeCategory, setActiveCategory] = useState<string>("Finance");

  const filteredSkills = skills.filter(
    (skill) => skill.category === activeCategory
  );

  return (
    <section id="skills" className="relative py-24 bg-[#050505]">
      {/* Background decoration */}
      <div className="absolute top-1/2 right-0 w-72 h-72 bg-gold/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
        <ScrollReveal>
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-px bg-gold" />
            <span className="text-gold font-mono text-sm tracking-widest uppercase">
              Capabilities
            </span>
            <div className="w-8 h-px bg-gold" />
          </div>
          <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-16 text-center">
            Skills & Competencies
          </h2>
        </ScrollReveal>

        {/* Category Tabs */}
        <ScrollReveal delay={0.2}>
          <div className="flex flex-wrap gap-2 justify-center mb-16">
            {skillCategories.map((category) => (
              <button
                key={category.name}
                onClick={() => setActiveCategory(category.name)}
                className={`px-8 py-3 rounded-full font-mono text-sm tracking-widest uppercase transition-all duration-300 border ${activeCategory === category.name
                  ? "bg-gold text-[#050505] border-gold shadow-[0_0_20px_rgba(212,175,55,0.3)]"
                  : "bg-white/[0.02] text-white/40 border-white/10 hover:border-white/30 hover:text-white"
                  }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </ScrollReveal>

        {/* Skills Grid */}
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
              {filteredSkills.map((skill) => (
                <div key={skill.name} className="space-y-4 group">
                  <div className="flex items-end justify-between">
                    <div className="space-y-1">
                      <span className="text-xl font-display font-bold text-white group-hover:text-gold transition-colors">
                        {skill.name}
                      </span>
                      {skill.description && (
                        <p className="text-xs text-white/40 font-light tracking-wide uppercase">
                          {skill.description}
                        </p>
                      )}
                    </div>
                    <span className="text-sm font-mono text-gold/60">{skill.proficiency}%</span>
                  </div>

                  <div className="relative h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-gold/40 to-gold rounded-full"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.proficiency}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.5, ease: [0.33, 1, 0.68, 1] }}
                    >
                      {/* Interactive glow head */}
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full blur-md opacity-0 group-hover:opacity-40 transition-opacity" />
                    </motion.div>
                  </div>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* All Skills Cloud */}
        <ScrollReveal delay={0.4}>
          <div className="mt-24 pt-16 border-t border-white/5">
            <h3 className="text-sm font-mono text-white/20 uppercase tracking-[0.3em] mb-10 text-center">
              Comprehensive Stack Overview
            </h3>
            <div className="flex flex-wrap gap-3 justify-center max-w-4xl mx-auto">
              {skills.map((skill) => (
                <div
                  key={skill.name}
                  className="px-4 py-2 border border-white/5 bg-white/[0.02] text-xs font-mono text-white/40 rounded-lg hover:border-gold/20 hover:text-white/80 transition-all cursor-default"
                >
                  {skill.name}
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>

  );
}
