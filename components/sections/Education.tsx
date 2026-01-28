"use client";

import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ScrollReveal from "@/components/animations/ScrollReveal";
import { education, certifications } from "@/lib/data/education";
import { formatDate } from "@/lib/utils";
import { fadeInUp, staggerContainer } from "@/lib/animations";

export default function Education() {
  return (
    <section id="education" className="relative py-24 bg-[#0a0a0a]">
      {/* Subtle top divider gradient */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-12">
        <ScrollReveal>
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-px bg-gold" />
            <span className="text-gold font-mono text-sm tracking-widest uppercase">
              Foundation
            </span>
            <div className="w-8 h-px bg-gold" />
          </div>
          <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-16 text-center">
            Education & Certifications
          </h2>
        </ScrollReveal>

        {/* Education Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-24">
          {education.map((edu, index) => (
            <ScrollReveal key={edu.id} delay={index * 0.15}>
              <motion.div
                variants={fadeInUp}
                whileHover={{ y: -8, scale: 1.01 }}
                transition={{ duration: 0.3, ease: [0.43, 0.13, 0.23, 0.96] }}
                className="group relative h-full"
              >
                <div className="h-full relative p-6 md:p-8 bg-white/[0.02] border border-white/[0.05] rounded-2xl backdrop-blur-sm transition-all group-hover:bg-white/[0.04] group-hover:border-gold/30 shadow-2xl">
                  {/* Subtle card glow */}
                  <div className="absolute inset-0 rounded-2xl bg-gold/5 opacity-0 group-hover:opacity-100 transition-opacity blur-xl" />

                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-6">
                      <div className="w-12 h-12 flex-shrink-0 items-center justify-center rounded-xl bg-gold/10 text-gold border border-gold/20">
                        <span className="text-lg font-bold font-display">
                          {edu.institution.charAt(0)}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-mono text-gold/60 uppercase tracking-widest">
                          {formatDate(edu.startDate)} — {formatDate(edu.endDate)}
                        </span>
                        {edu.gpa && (
                          <div className="text-sm font-mono text-white/40 mt-1">
                            GPA: <span className="text-white/80">{edu.gpa}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <h3 className="text-2xl font-display font-bold text-white mb-2 group-hover:text-gold transition-colors">
                      {edu.degree}
                    </h3>
                    <p className="text-gold/80 font-medium mb-6">
                      {edu.field} • {edu.institution}
                    </p>

                    <div className="space-y-6">
                      {edu.honors && edu.honors.length > 0 && (
                        <div>
                          <h4 className="text-[10px] font-mono text-white/30 uppercase tracking-[0.2em] mb-3">
                            Distinctions
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {edu.honors.map((honor, i) => (
                              <span key={i} className="px-2 py-1 text-[11px] bg-white/5 border border-white/10 rounded-md text-white/60">
                                {honor}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {edu.coursework && edu.coursework.length > 0 && (
                        <div>
                          <h4 className="text-[10px] font-mono text-white/30 uppercase tracking-[0.2em] mb-3">
                            Key Focus
                          </h4>
                          <div className="flex flex-wrap gap-1.5">
                            {edu.coursework.map((course) => (
                              <span key={course} className="px-2 py-0.5 text-[10px] bg-gold/5 border border-gold/10 rounded text-gold/60">
                                {course}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>

        {/* Certifications Section */}
        <ScrollReveal delay={0.2}>
          <div className="max-w-4xl mx-auto">
            <h3 className="text-center text-sm font-mono text-white/20 uppercase tracking-[0.3em] mb-12">
              Professional Certifications
            </h3>

            <div className="grid md:grid-cols-2 gap-6">
              {certifications.map((cert, index) => (
                <motion.div
                  key={cert.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  whileHover={{ x: 8, scale: 1.02 }}
                  className="flex items-center gap-6 p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-gold/20 transition-all duration-300"
                >
                  <div className="w-10 h-10 flex-shrink-0 bg-gold/10 rounded-lg flex items-center justify-center text-gold">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs font-mono text-gold/40 mb-1">
                      {cert.issuer} • {formatDate(cert.date)}
                    </div>
                    <div className="text-white font-medium">{cert.name}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>

  );
}
