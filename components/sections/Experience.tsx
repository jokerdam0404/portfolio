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
    <section id="experience" className="py-20 px-6 bg-primary-50">
      <div className="max-w-5xl mx-auto">
        <ScrollReveal>
          <h2 className="text-4xl md:text-5xl font-bold text-primary-900 mb-4 text-center">
            Experience
          </h2>
          <div className="w-20 h-1 bg-accent-500 mx-auto mb-6" />
          <p className="text-center text-primary-600 mb-16 max-w-2xl mx-auto">
            Professional experience in investment banking, equity research, and
            financial analysis.
          </p>
        </ScrollReveal>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-8"
        >
          {experiences.map((exp, index) => (
            <ScrollReveal key={exp.id} delay={index * 0.1}>
              <motion.div
                variants={fadeInUp}
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div className="flex-1">
                        <CardTitle className="text-2xl mb-2">{exp.role}</CardTitle>
                        <CardDescription className="text-base">
                          <span className="font-semibold text-primary-700">
                            {exp.company}
                          </span>
                          {" • "}
                          {exp.location}
                        </CardDescription>
                      </div>
                      <div className="text-right">
                        <Badge variant={exp.current ? "success" : "secondary"}>
                          {exp.current ? "Current" : `${formatDate(exp.startDate)} - ${formatDate(exp.endDate)}`}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <p className="text-primary-700">{exp.description}</p>

                    <div>
                      <h4 className="font-semibold text-primary-900 mb-3">
                        Key Achievements
                      </h4>
                      <ul className="space-y-2">
                        {exp.achievements.map((achievement, i) => (
                          <li
                            key={i}
                            className="flex gap-3 text-primary-600"
                          >
                            <svg
                              className="w-5 h-5 text-accent-500 flex-shrink-0 mt-0.5"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <span>{achievement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-primary-900 mb-2">
                        Skills Applied
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {exp.skills.map((skill) => (
                          <Badge key={skill} variant="outline">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </ScrollReveal>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
