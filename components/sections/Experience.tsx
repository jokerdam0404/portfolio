"use client";

import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ScrollReveal from "@/components/animations/ScrollReveal";
import { experiences } from "@/lib/data/experience";
import { formatDate } from "@/lib/utils";
import { fadeInUp, staggerContainer } from "@/lib/animations";

export default function Experience() {
  return (
    <section id="experience" className="relative py-24 bg-[#0a0a0a]">
      {/* Subtle top divider gradient */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-12">
        <ScrollReveal>
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-px bg-gold" />
            <span className="text-gold font-mono text-sm tracking-widest uppercase">
              Trajectory
            </span>
            <div className="w-8 h-px bg-gold" />
          </div>
          <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-16 text-center">
            Experience
          </h2>
        </ScrollReveal>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-12"
        >
          {experiences.map((exp, index) => (
            <ScrollReveal key={exp.id} delay={index * 0.1}>
              <motion.div
                variants={fadeInUp}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3 }}
                className="group relative"
              >
                {/* Connector line for timeline feel */}
                {index !== experiences.length - 1 && (
                  <div className="absolute left-[2.25rem] top-16 bottom-[-3rem] w-px bg-white/5 hidden md:block" />
                )}

                <div className="relative p-6 md:p-8 bg-white/[0.02] border border-white/[0.05] rounded-2xl backdrop-blur-sm transition-all group-hover:bg-white/[0.04] group-hover:border-gold/30 shadow-2xl">
                  {/* Subtle card glow */}
                  <div className="absolute inset-0 rounded-2xl bg-gold/5 opacity-0 group-hover:opacity-100 transition-opacity blur-xl" />

                  <div className="relative z-10">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
                      <div className="flex gap-6">
                        {/* Icon/Logo Placeholder */}
                        <div className="hidden md:flex w-12 h-12 flex-shrink-0 items-center justify-center rounded-xl bg-gold/10 text-gold border border-gold/20">
                          <span className="text-lg font-bold font-display">
                            {exp.company.charAt(0)}
                          </span>
                        </div>

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
                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider uppercase ${exp.current
                            ? "bg-gold/20 text-gold border border-gold/30"
                            : "bg-white/5 text-white/40 border border-white/10"
                          }`}>
                          {exp.current ? "Present" : `${formatDate(exp.startDate)} — ${formatDate(exp.endDate)}`}
                        </div>
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
                              <li key={i} className="flex gap-4 text-white/70 group/item">
                                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gold/40 group-hover/item:bg-gold transition-colors flex-shrink-0" />
                                <span className="text-sm leading-relaxed">{achievement}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="text-sm font-mono text-gold uppercase tracking-[0.2em] mb-4">
                            Expertise Applied
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {exp.skills.map((skill) => (
                              <span
                                key={skill}
                                className="px-3 py-1 rounded-lg border border-white/5 bg-white/[0.03] text-xs font-mono text-white/50 group-hover:border-gold/20 transition-colors"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </ScrollReveal>
          ))}
        </motion.div>
      </div>
    </section>

  );
}
