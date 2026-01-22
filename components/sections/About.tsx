"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
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
    <section id="about" className="py-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <h2 className="text-4xl md:text-5xl font-bold text-primary-900 mb-4 text-center">
            About Me
          </h2>
          <div className="w-20 h-1 bg-accent-500 mx-auto mb-12" />
        </ScrollReveal>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left: Image/Avatar Placeholder */}
          <ScrollReveal delay={0.2}>
            <div className="relative">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-accent-500 to-primary-900 p-1">
                <div className="w-full h-full rounded-2xl bg-primary-50 flex items-center justify-center">
                  {/* Replace with actual image */}
                  <div className="text-center">
                    <div className="w-48 h-48 mx-auto mb-4 rounded-full bg-primary-200 flex items-center justify-center">
                      <span className="text-6xl font-bold text-primary-600">
                        AC
                      </span>
                    </div>
                    <p className="text-primary-500 text-sm">
                      Add your professional photo here
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Right: About Content */}
          <div>
            <ScrollReveal delay={0.3}>
              <h3 className="text-2xl font-semibold text-primary-900 mb-4">
                Physics & Economics Student | Equity Analyst
              </h3>
              <div className="space-y-4 text-primary-700 leading-relaxed">
                <p>
                  I'm a dual-degree student at Northeastern University and Michigan State University,
                  combining rigorous training in Physics with a deep passion for Finance and Economics.
                  Currently, I co-manage a $5 million mid-cap fund as an Equity Analyst, where I develop
                  DCF models and perform comprehensive financial statement analysis.
                </p>
                <p>
                  My unique background bridges quantitative research and financial analysis. As an
                  undergraduate researcher at Aramaki Lab, I work with advanced simulation tools
                  (Geant4, ROOT, C++) for particle physics studies, developing the same analytical
                  rigor I apply to equity valuation and investment decisions.
                </p>
                <p>
                  With experience in Python, C++, financial modeling, and a proven track record in
                  both research and finance, I'm seeking opportunities in equity research, quantitative
                  finance, and investment banking where I can leverage my analytical skills to drive
                  data-driven investment decisions.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.4}>
              <div className="mt-8">
                <h4 className="text-lg font-semibold text-primary-900 mb-4">
                  Areas of Interest
                </h4>
                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="flex flex-wrap gap-2"
                >
                  {interests.map((interest, index) => (
                    <motion.div key={interest} variants={fadeInUp}>
                      <Badge variant="outline" className="text-sm py-1.5 px-3">
                        {interest}
                      </Badge>
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
