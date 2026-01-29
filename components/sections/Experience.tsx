"use client";

import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ScrollReveal from "@/components/animations/ScrollReveal";
import { AnimatedSectionHeader, ScrollRevealText } from "@/components/typography";
import { experiences } from "@/lib/data/experience";
import { formatDate } from "@/lib/utils";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { EASING, TIMING } from "@/lib/kinetic-constants";

export default function Experience() {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <section id="experience" className="relative py-24 bg-[#0a0a0a]">
      {/* Subtle top divider gradient */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-12">
        {/* Animated Section Header */}
        <AnimatedSectionHeader
          label="Trajectory"
          title="Experience"
          animation="split"
          className="mb-16"
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-12"
        >
          {experiences.map((exp, index) => (
            <ScrollRevealText key={exp.id} delay={index * 0.1} direction="up">
              <motion.div
                variants={fadeInUp}
                whileHover={prefersReducedMotion ? undefined : { y: -4 }}
                transition={{ duration: 0.3 }}
                className="group relative"
              >
                {/* Connector line for timeline feel */}
                {index !== experiences.length - 1 && (
                  <motion.div
                    className="absolute left-[2.25rem] top-16 bottom-[-3rem] w-px bg-white/5 hidden md:block"
                    initial={{ scaleY: 0 }}
                    whileInView={{ scaleY: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    style={{ transformOrigin: 'top' }}
                  />
                )}

                <div className="relative p-6 md:p-8 bg-white/[0.02] border border-white/[0.05] rounded-2xl backdrop-blur-sm transition-all group-hover:bg-white/[0.04] group-hover:border-gold/30 shadow-2xl">
                  {/* Subtle card glow */}
                  <div className="absolute inset-0 rounded-2xl bg-gold/5 opacity-0 group-hover:opacity-100 transition-opacity blur-xl" />

                  <div className="relative z-10">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
                      <div className="flex gap-6">
                        {/* Icon/Logo Placeholder */}
                        <motion.div
                          className="hidden md:flex w-12 h-12 flex-shrink-0 items-center justify-center rounded-xl bg-gold/10 text-gold border border-gold/20"
                          whileHover={prefersReducedMotion ? undefined : { scale: 1.1, rotate: 5 }}
                          transition={{ duration: 0.3 }}
                        >
                          <span className="text-lg font-bold font-display">
                            {exp.company.charAt(0)}
                          </span>
                        </motion.div>

                        <div>
                          <h3 className="text-2xl font-display font-bold text-white mb-1">
                            {exp.role}
                          </h3>
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-gold/80 font-medium">
                            <span className="text-lg">{exp.company}</span>
                            <span className="w-1 h-1 rounded-full bg-white/20 hidden md:block" />
                            <span className="text-white/40 text-sm italic font-light">{exp.location}</span>
                          </div>
                        </div>
                      </div>

                      <div className="md:text-right">
                        <motion.div
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider uppercase ${exp.current
                              ? "bg-gold/20 text-gold border border-gold/30"
                              : "bg-white/5 text-white/40 border border-white/10"
                            }`}
                          whileHover={prefersReducedMotion ? undefined : { scale: 1.05 }}
                        >
                          {exp.current ? "Present" : `${formatDate(exp.startDate)} - ${formatDate(exp.endDate)}`}
                        </motion.div>
                      </div>
                    </div>

                    <div className="space-y-8">
                      <p className="text-lg text-white/60 leading-relaxed font-light italic">
                        &quot;{exp.description}&quot;
                      </p>

                      <div className="grid lg:grid-cols-2 gap-8">
                        <div>
                          <h4 className="text-sm font-mono text-gold uppercase tracking-[0.2em] mb-4">
                            Core Focus
                          </h4>
                          <ul className="space-y-3">
                            {exp.achievements.map((achievement, i) => (
                              <motion.li
                                key={i}
                                className="flex gap-4 text-white/70 group/item"
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1, duration: 0.4 }}
                              >
                                <motion.div
                                  className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gold/40 group-hover/item:bg-gold transition-colors flex-shrink-0"
                                  whileHover={prefersReducedMotion ? undefined : { scale: 1.5 }}
                                />
                                <span className="text-sm leading-relaxed">{achievement}</span>
                              </motion.li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="text-sm font-mono text-gold uppercase tracking-[0.2em] mb-4">
                            Expertise Applied
                          </h4>
                          <motion.div
                            className="flex flex-wrap gap-2"
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
                            {exp.skills.map((skill) => (
                              <motion.span
                                key={skill}
                                variants={{
                                  hidden: { opacity: 0, scale: 0.8 },
                                  visible: { opacity: 1, scale: 1 },
                                }}
                                whileHover={prefersReducedMotion ? undefined : { scale: 1.05, y: -2 }}
                                className="px-3 py-1 rounded-lg border border-white/5 bg-white/[0.03] text-xs font-mono text-white/50 group-hover:border-gold/20 transition-colors cursor-default"
                              >
                                {skill}
                              </motion.span>
                            ))}
                          </motion.div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </ScrollRevealText>
          ))}
        </motion.div>
      </div>
    </section>

  );
}
