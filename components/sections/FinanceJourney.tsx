"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ScrollReveal from "@/components/animations/ScrollReveal";
import { journeyData, JourneyMilestone } from "@/lib/data/journey";
import { formatDate } from "@/lib/utils";

const categoryColors = {
  Course: "bg-accent-500",
  Certification: "bg-success-500",
  Book: "bg-primary-600",
  Project: "bg-accent-600",
  Learning: "bg-primary-500",
  Role: "bg-success-600",
};

function TimelineCard({ milestone, index }: { milestone: JourneyMilestone; index: number }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <ScrollReveal delay={index * 0.08}>
      <motion.div
        className="relative"
        initial={{ opacity: 0, x: index % 2 === 0 ? -60 : 60 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{
          duration: 0.6,
          delay: index * 0.1,
          ease: [0.43, 0.13, 0.23, 0.96]
        }}
      >
        <div className={`flex items-center gap-4 ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}>
          {/* Timeline Dot */}
          <div className="hidden md:flex flex-col items-center flex-shrink-0">
            <div className={`w-4 h-4 rounded-full ${categoryColors[milestone.category]} ring-4 ring-white`} />
          </div>

          {/* Card */}
          <motion.div
            whileHover={{ scale: 1.02, y: -4 }}
            transition={{ duration: 0.3, ease: [0.43, 0.13, 0.23, 0.96] }}
            className="flex-1"
          >
            <Card
              className="cursor-pointer hover:shadow-2xl transition-all duration-500 border-white/5 hover:border-gold/20 bg-white/[0.02] hover:bg-white/[0.04]"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={categoryColors[milestone.category]}>
                        {milestone.category}
                      </Badge>
                      <span className="text-sm text-primary-500">
                        {formatDate(milestone.date)}
                      </span>
                    </div>
                    <CardTitle className="text-xl">{milestone.title}</CardTitle>
                  </div>
                  <motion.svg
                    className="w-6 h-6 text-primary-400 flex-shrink-0"
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </motion.svg>
                </div>
                <CardDescription>{milestone.description}</CardDescription>
              </CardHeader>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-primary-900 mb-2">
                            Skills Learned
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {milestone.skills.map((skill) => (
                              <Badge key={skill} variant="secondary">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {milestone.resources && milestone.resources.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-primary-900 mb-2">
                              Resources Used
                            </h4>
                            <ul className="list-disc list-inside text-sm text-primary-600 space-y-1">
                              {milestone.resources.map((resource) => (
                                <li key={resource}>{resource}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </ScrollReveal>
  );
}

export default function FinanceJourney() {
  return (
    <section id="journey" className="relative py-24 bg-[#0a0a0a]">
      {/* Subtle top divider gradient */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-12">
        <ScrollReveal>
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-px bg-gold" />
            <span className="text-gold font-mono text-sm tracking-widest uppercase">
              Evolution
            </span>
            <div className="w-8 h-px bg-gold" />
          </div>
          <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-16 text-center">
            My Finance Journey
          </h2>
        </ScrollReveal>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline Line */}
          <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-px bg-white/5" />

          {/* Timeline Items */}
          <div className="space-y-12">
            {journeyData.map((milestone, index) => (
              <TimelineCard
                key={milestone.id}
                milestone={milestone}
                index={index}
              />
            ))}
          </div>
        </div>
      </div>
    </section>

  );
}
