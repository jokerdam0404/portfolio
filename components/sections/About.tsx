"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Headshot } from "@/components/ui/headshot";
import ScrollReveal from "@/components/animations/ScrollReveal";
import { fadeInUp, staggerContainer } from "@/lib/animations";

export default function About() {
  const interests = [
    "Equity Research",
    "Financial Modeling",
    "Valuation (DCF, LBO)",
    "Quantitative Finance",
    "Portfolio Management",
    "Data Analysis",
    "Computational Physics",
    "Investment Banking",
  ];

  return (
    <section id="about" className="relative py-24 bg-[#050505] overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
        <ScrollReveal>
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-px bg-gold" />
            <span className="text-gold font-mono text-sm tracking-widest uppercase">
              Identity
            </span>
            <div className="w-8 h-px bg-gold" />
          </div>
          <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-16 text-center">
            About Me
          </h2>
        </ScrollReveal>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Headshot with premium frame */}
          <ScrollReveal delay={0.2}>
            <div className="relative flex justify-center lg:justify-start">
              <div className="relative group">
                {/* Premium animated border */}
                <div className="absolute -inset-1 bg-gradient-to-r from-gold/50 via-gold/10 to-gold/50 rounded-2xl blur-sm group-hover:blur-md transition-all duration-500" />

                <div className="relative bg-[#0a0a0a] border border-white/10 rounded-2xl p-2 overflow-hidden shadow-2xl">
                  {/* Decorative corner */}
                  <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none">
                    <div className="absolute top-2 right-2 w-8 h-[1px] bg-gold/40" />
                    <div className="absolute top-2 right-2 w-[1px] h-8 bg-gold/40" />
                  </div>

                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.4 }}
                  >
                    <Headshot
                      alt="Achintya Chaganti"
                      size={400}
                      initials="AC"
                      className="rounded-xl grayscale hover:grayscale-0 transition-all duration-700"
                    />
                  </motion.div>
                </div>

                {/* Flying elements */}
                <motion.div
                  animate={{
                    y: [0, -15, 0],
                    rotate: [0, 5, 0],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute -bottom-6 -right-6 w-24 h-24 bg-gold/10 rounded-2xl backdrop-blur-3xl border border-white/10 -z-10"
                />
                <motion.div
                  animate={{
                    y: [0, 10, 0],
                    rotate: [0, -3, 0],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5,
                  }}
                  className="absolute -top-4 -left-4 w-16 h-16 bg-gold/5 rounded-xl backdrop-blur-3xl border border-white/5 -z-10"
                />
              </div>
            </div>
          </ScrollReveal>

          {/* Right: About Content */}
          <div className="space-y-8">
            <ScrollReveal delay={0.3}>
              <h3 className="text-2xl md:text-3xl font-display font-bold text-white mb-6">
                Physics & Economics Student <br />
                <span className="text-gold">Equity Analyst</span>
              </h3>
              <div className="space-y-6 text-lg text-white/70 leading-relaxed font-light">
                <p>
                  I&apos;m a dual-degree student at Northeastern University and Michigan State University,
                  combining rigorous training in <span className="text-white font-medium">Physics</span> with a deep passion for <span className="text-white font-medium">Finance and Economics</span>.
                  Currently, I co-manage a $5 million mid-cap fund as an Equity Analyst, where I develop
                  DCF models and perform comprehensive financial statement analysis.
                </p>
                <p>
                  My unique background bridges quantitative research and financial analysis. As an
                  undergraduate researcher at Aramaki Lab, I work with advanced simulation tools
                  (Geant4, ROOT, C++) for particle physics studies, developing the same analytical
                  rigor I apply to equity valuation and investment decisions.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.4}>
              <div className="pt-8 border-t border-white/10">
                <h4 className="text-sm font-mono text-gold uppercase tracking-[0.2em] mb-6">
                  Specialization
                </h4>
                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="flex flex-wrap gap-2"
                >
                  {interests.map((interest) => (
                    <motion.div key={interest} variants={fadeInUp}>
                      <div className="px-4 py-2 rounded-full border border-white/10 bg-white/[0.03] text-sm text-white/80 hover:border-gold/40 hover:bg-gold/5 transition-colors cursor-default">
                        {interest}
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>

  );
}
