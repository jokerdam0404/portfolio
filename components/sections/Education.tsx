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
    <section id="education" className="py-20 px-6 bg-primary-50">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <h2 className="text-4xl md:text-5xl font-bold text-primary-900 mb-4 text-center">
            Education & Certifications
          </h2>
          <div className="w-20 h-1 bg-accent-500 mx-auto mb-6" />
          <p className="text-center text-primary-600 mb-16 max-w-2xl mx-auto">
            Academic background and professional certifications in finance and
            quantitative analysis.
          </p>
        </ScrollReveal>

        {/* Education */}
        <div className="mb-16">
          <ScrollReveal delay={0.1}>
            <h3 className="text-2xl font-semibold text-primary-900 mb-6">
              Education
            </h3>
          </ScrollReveal>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-6"
          >
            {education.map((edu) => (
              <ScrollReveal key={edu.id}>
                <motion.div variants={fadeInUp}>
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div className="flex-1">
                          <CardTitle className="text-2xl mb-2">
                            {edu.degree} in {edu.field}
                          </CardTitle>
                          <CardDescription className="text-base">
                            <span className="font-semibold text-primary-700">
                              {edu.institution}
                            </span>
                            {" • "}
                            {edu.location}
                          </CardDescription>
                        </div>
                        <div className="text-right">
                          <Badge variant="secondary">
                            {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                          </Badge>
                          {edu.gpa && (
                            <p className="text-sm text-primary-600 mt-2">
                              GPA: {edu.gpa}
                            </p>
                          )}
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {edu.honors && edu.honors.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-primary-900 mb-2">
                            Honors & Awards
                          </h4>
                          <ul className="list-disc list-inside text-primary-600 space-y-1">
                            {edu.honors.map((honor, i) => (
                              <li key={i}>{honor}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {edu.coursework && edu.coursework.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-primary-900 mb-2">
                            Relevant Coursework
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {edu.coursework.map((course) => (
                              <Badge key={course} variant="outline">
                                {course}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {edu.activities && edu.activities.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-primary-900 mb-2">
                            Activities & Leadership
                          </h4>
                          <ul className="list-disc list-inside text-primary-600 space-y-1">
                            {edu.activities.map((activity, i) => (
                              <li key={i}>{activity}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              </ScrollReveal>
            ))}
          </motion.div>
        </div>

        {/* Certifications */}
        <div>
          <ScrollReveal delay={0.2}>
            <h3 className="text-2xl font-semibold text-primary-900 mb-6">
              Professional Certifications
            </h3>
          </ScrollReveal>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-6"
          >
            {certifications.map((cert, index) => (
              <ScrollReveal key={cert.id} delay={index * 0.1}>
                <motion.div variants={fadeInUp} whileHover={{ scale: 1.02 }}>
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <Badge className="bg-success-500">Certified</Badge>
                        <span className="text-sm text-primary-500">
                          {formatDate(cert.date)}
                        </span>
                      </div>
                      <CardTitle className="text-xl">{cert.name}</CardTitle>
                      <CardDescription>{cert.issuer}</CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-3">
                      {cert.description && (
                        <p className="text-sm text-primary-600">
                          {cert.description}
                        </p>
                      )}

                      {cert.skills && cert.skills.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold text-primary-900 mb-2">
                            Skills
                          </h4>
                          <div className="flex flex-wrap gap-1.5">
                            {cert.skills.map((skill) => (
                              <Badge key={skill} variant="secondary" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {cert.credentialId && (
                        <p className="text-xs text-primary-400">
                          Credential ID: {cert.credentialId}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              </ScrollReveal>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
