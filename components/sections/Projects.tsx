"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TiltCard } from "@/components/ui/tilt-card";
import ScrollReveal from "@/components/animations/ScrollReveal";
import { AnimatedSectionHeader, ScrollRevealText } from "@/components/typography";
import { projects, Project } from "@/lib/data/projects";
import { staggerContainer, fadeInUp } from "@/lib/animations";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { EASING, TIMING } from "@/lib/kinetic-constants";

const categories = ["All", "Financial Modeling", "Equity Research", "Data Analysis", "Computational Physics", "Cloud Computing"];

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const [showDetails, setShowDetails] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <>
      <motion.div
        variants={fadeInUp}
        className="h-full"
        whileHover={prefersReducedMotion ? undefined : { y: -8 }}
        transition={{ duration: TIMING.normal, ease: EASING.smooth }}
      >
        {/* TiltCard wrapper for 3D hover effect */}
        <TiltCard
          className="h-full"
          maxTilt={8}
          scale={1.02}
          glare={true}
          glareOpacity={0.1}
        >
          <Card className="h-full flex flex-col hover:shadow-xl transition-shadow cursor-pointer overflow-hidden group">
            {/* Image Placeholder */}
            <div className="h-48 bg-gradient-to-br from-accent-500 to-primary-900 relative overflow-hidden">
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                <motion.span
                  className="text-white text-4xl font-bold opacity-50"
                  whileHover={prefersReducedMotion ? undefined : { scale: 1.2, rotate: 10 }}
                  transition={{ duration: 0.3 }}
                >
                  {project.category === "Financial Modeling" && "FIN"}
                  {project.category === "Data Analysis" && "DATA"}
                  {project.category === "Computational Physics" && "PHY"}
                  {project.category === "Equity Research" && "EQR"}
                  {project.category === "Cloud Computing" && "CLD"}
                </motion.span>
              </div>
              {project.featured && (
                <Badge className="absolute top-4 right-4 bg-success-500">
                  Featured
                </Badge>
              )}
            </div>

            <CardHeader className="flex-1">
              <div className="flex items-start justify-between gap-2 mb-2">
                <Badge variant="outline">{project.category}</Badge>
              </div>
              <CardTitle className="text-xl group-hover:text-accent-600 transition-colors">
                {project.title}
              </CardTitle>
              <CardDescription>{project.description}</CardDescription>
            </CardHeader>

            <CardContent>
              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-semibold text-primary-900 mb-2">
                    Skills
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {project.skills.slice(0, 4).map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {project.skills.length > 4 && (
                      <Badge variant="secondary" className="text-xs">
                        +{project.skills.length - 4}
                      </Badge>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-primary-900 mb-2">
                    Tech Stack
                  </h4>
                  <p className="text-sm text-primary-600">
                    {project.techStack.join(", ")}
                  </p>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                className="flex-1"
                onClick={() => setShowDetails(true)}
              >
                View Details
              </Button>
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 hover:bg-primary-100 h-9 px-3"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </a>
              )}
            </CardFooter>
          </Card>
        </TiltCard>
      </motion.div>

      {/* Details Modal */}
      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowDetails(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-primary-900">{project.title}</h3>
                    <Badge variant="outline" className="mt-2">{project.category}</Badge>
                  </div>
                  <button
                    onClick={() => setShowDetails(false)}
                    className="text-primary-400 hover:text-primary-900 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 rounded"
                    aria-label="Close modal"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <p className="text-primary-700">
                  {project.longDescription || project.description}
                </p>

                {project.outcomes && (
                  <div>
                    <h4 className="font-semibold text-primary-900 mb-2">Key Outcomes</h4>
                    <ul className="list-disc list-inside space-y-1 text-primary-600">
                      {project.outcomes.map((outcome, i) => (
                        <li key={i}>{outcome}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div>
                  <h4 className="font-semibold text-primary-900 mb-2">Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {project.skills.map((skill) => (
                      <Badge key={skill} variant="secondary">{skill}</Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-primary-900 mb-2">Tech Stack</h4>
                  <div className="flex flex-wrap gap-2">
                    {project.techStack.map((tech) => (
                      <Badge key={tech}>{tech}</Badge>
                    ))}
                  </div>
                </div>

                {(project.github || project.link) && (
                  <div className="flex gap-2 pt-4">
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 h-10 px-4 py-2 bg-accent-500 text-white hover:bg-accent-600"
                      >
                        View on GitHub
                      </a>
                    )}
                    {project.link && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 h-10 px-4 py-2 border border-primary-300 bg-transparent hover:bg-primary-100"
                      >
                        View Live Demo
                      </a>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default function Projects() {
  const [activeCategory, setActiveCategory] = useState("All");
  const prefersReducedMotion = usePrefersReducedMotion();

  const filteredProjects = activeCategory === "All"
    ? projects
    : projects.filter((p) => p.category === activeCategory);

  return (
    <section id="projects" className="relative py-24 bg-[#050505] overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
        {/* Animated Section Header */}
        <AnimatedSectionHeader
          label="Impact"
          title="Projects"
          animation="split"
          className="mb-16"
        />

        {/* Category Filter with staggered animations */}
        <ScrollReveal delay={0.2}>
          <motion.div
            className="flex flex-wrap gap-2 justify-center mb-16"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.05,
                },
              },
            }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {categories.map((category) => (
              <motion.button
                key={category}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
                onClick={() => setActiveCategory(category)}
                whileHover={prefersReducedMotion ? undefined : { scale: 1.05 }}
                whileTap={prefersReducedMotion ? undefined : { scale: 0.95 }}
                className={`px-6 py-2 rounded-full font-mono text-[10px] tracking-[0.2em] uppercase transition-all duration-300 border ${activeCategory === category
                    ? "bg-gold text-[#050505] border-gold shadow-[0_0_15px_rgba(212,175,55,0.2)]"
                    : "bg-white/[0.02] text-white/40 border-white/10 hover:border-white/30 hover:text-white"
                  }`}
              >
                {category}
              </motion.button>
            ))}
          </motion.div>
        </ScrollReveal>

        {/* Projects Grid */}
        <AnimatePresence mode="popLayout">
          <motion.div
            key={activeCategory}
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredProjects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </motion.div>
        </AnimatePresence>

        {filteredProjects.length === 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-white/30 py-24 font-light italic"
          >
            No projects found in this category.
          </motion.p>
        )}
      </div>
    </section>

  );
}
