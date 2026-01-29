"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TiltCard, TiltCardContent } from "@/components/ui/tilt-card";
import ScrollReveal from "@/components/animations/ScrollReveal";
import { AnimatedSectionHeader, ScrollRevealText } from "@/components/typography";
import { projects, Project } from "@/lib/data/projects";
import { staggerContainer, fadeInUp } from "@/lib/animations";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { EASING, TIMING } from "@/lib/kinetic-constants";

const categories = ["All", "Financial Modeling", "Equity Research", "Data Analysis", "Computational Physics", "Cloud Computing"];

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const [showDetails, setShowDetails] = useState(false);
  const [isImageHovered, setIsImageHovered] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  const getCategoryIcon = useCallback((category: string) => {
    switch (category) {
      case "Financial Modeling":
        return "FIN";
      case "Data Analysis":
        return "DATA";
      case "Computational Physics":
        return "PHY";
      case "Equity Research":
        return "EQR";
      case "Cloud Computing":
        return "CLD";
      default:
        return "PRJ";
    }
  }, []);

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
          borderGradient={true}
          shadowEffect={true}
        >
          <Card className="h-full flex flex-col hover:shadow-xl transition-shadow cursor-pointer overflow-hidden group bg-[#0a0a0a] border-white/10">
            {/* Image Placeholder with zoom effect */}
            <div
              className="h-48 bg-gradient-to-br from-gold/20 to-[#0a0a0a] relative overflow-hidden"
              onMouseEnter={() => setIsImageHovered(true)}
              onMouseLeave={() => setIsImageHovered(false)}
            >
              {/* Animated background pattern */}
              <motion.div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: `radial-gradient(circle at 20% 50%, rgba(212, 175, 55, 0.3) 0%, transparent 50%),
                                    radial-gradient(circle at 80% 50%, rgba(212, 175, 55, 0.2) 0%, transparent 50%)`,
                }}
                animate={{
                  scale: isImageHovered ? 1.2 : 1,
                }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />

              {/* Dark overlay that lightens on hover */}
              <motion.div
                className="absolute inset-0 bg-black/40"
                animate={{
                  opacity: isImageHovered ? 0.2 : 0.4,
                }}
                transition={{ duration: 0.3 }}
              />

              {/* Category icon with animation */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.span
                  className="text-white text-4xl font-bold font-display opacity-50 group-hover:opacity-80 transition-opacity"
                  animate={{
                    scale: isImageHovered ? 1.2 : 1,
                    rotate: isImageHovered ? 10 : 0,
                  }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  {getCategoryIcon(project.category)}
                </motion.span>
              </div>

              {/* Featured badge */}
              {project.featured && (
                <motion.div
                  className="absolute top-4 right-4"
                  initial={{ opacity: 0, scale: 0.8, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Badge className="bg-gold text-[#050505] border-0 shadow-[0_0_10px_rgba(212,175,55,0.3)]">
                    Featured
                  </Badge>
                </motion.div>
              )}

              {/* Reveal overlay on hover */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent"
                initial={{ opacity: 0 }}
                animate={{ opacity: isImageHovered ? 1 : 0 }}
                transition={{ duration: 0.3 }}
              />

              {/* Quick action buttons on hover */}
              <motion.div
                className="absolute bottom-4 left-4 right-4 flex gap-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: isImageHovered ? 1 : 0,
                  y: isImageHovered ? 0 : 20,
                }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <button
                  onClick={() => setShowDetails(true)}
                  className="flex-1 px-4 py-2 bg-gold text-[#050505] text-sm font-bold rounded-lg hover:bg-[#E5C04B] transition-colors"
                >
                  View Details
                </button>
              </motion.div>
            </div>

            <TiltCardContent depth={15}>
              <CardHeader className="flex-1">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <motion.div
                    whileHover={prefersReducedMotion ? undefined : { scale: 1.05 }}
                  >
                    <Badge variant="outline" className="text-gold border-gold/30 bg-gold/5">
                      {project.category}
                    </Badge>
                  </motion.div>
                </div>
                <CardTitle className="text-xl text-white group-hover:text-gold transition-colors duration-300">
                  {project.title}
                </CardTitle>
                <CardDescription className="text-white/60">{project.description}</CardDescription>
              </CardHeader>

              <CardContent>
                <div className="space-y-3">
                  <div>
                    <h4 className="text-xs font-mono font-semibold text-gold/60 uppercase tracking-widest mb-2">
                      Skills
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {project.skills.slice(0, 4).map((skill, i) => (
                        <motion.div
                          key={skill}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.05 }}
                          whileHover={prefersReducedMotion ? undefined : { scale: 1.05, y: -1 }}
                        >
                          <Badge
                            variant="secondary"
                            className="text-xs bg-white/5 text-white/70 border border-white/10 hover:border-gold/30 hover:text-gold transition-all"
                          >
                            {skill}
                          </Badge>
                        </motion.div>
                      ))}
                      {project.skills.length > 4 && (
                        <Badge variant="secondary" className="text-xs bg-white/5 text-white/50">
                          +{project.skills.length - 4}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-mono font-semibold text-gold/60 uppercase tracking-widest mb-2">
                      Tech Stack
                    </h4>
                    <p className="text-sm text-white/50">
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
                  <motion.a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50 hover:bg-white/10 h-9 w-9 text-white/60 hover:text-gold"
                    whileHover={prefersReducedMotion ? undefined : { scale: 1.1, rotate: 5 }}
                    whileTap={prefersReducedMotion ? undefined : { scale: 0.9 }}
                    data-magnetic
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                    </svg>
                  </motion.a>
                )}
              </CardFooter>
            </TiltCardContent>
          </Card>
        </TiltCard>
      </motion.div>

      {/* Details Modal with enhanced animations */}
      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowDetails(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="bg-[#0a0a0a] border border-white/10 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal header with gradient */}
              <div className="relative h-32 bg-gradient-to-br from-gold/20 to-transparent overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-6xl font-bold font-display text-white/10">
                    {getCategoryIcon(project.category)}
                  </span>
                </div>
                <motion.button
                  onClick={() => setShowDetails(false)}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/20 transition-colors"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <Badge variant="outline" className="text-gold border-gold/30 bg-gold/5 mb-3">
                    {project.category}
                  </Badge>
                  <h3 className="text-2xl font-bold font-display text-white">{project.title}</h3>
                </div>

                <p className="text-white/70 leading-relaxed">
                  {project.longDescription || project.description}
                </p>

                {project.outcomes && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <h4 className="font-mono text-xs text-gold uppercase tracking-widest mb-3">Key Outcomes</h4>
                    <ul className="space-y-2">
                      {project.outcomes.map((outcome, i) => (
                        <motion.li
                          key={i}
                          className="flex gap-3 text-white/60"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.15 + i * 0.05 }}
                        >
                          <motion.span
                            className="mt-2 w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2 + i * 0.05 }}
                          />
                          {outcome}
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                )}

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h4 className="font-mono text-xs text-gold uppercase tracking-widest mb-3">Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {project.skills.map((skill, i) => (
                      <motion.div
                        key={skill}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.25 + i * 0.03 }}
                        whileHover={{ scale: 1.05 }}
                      >
                        <Badge className="bg-white/5 text-white/70 border border-white/10">
                          {skill}
                        </Badge>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <h4 className="font-mono text-xs text-gold uppercase tracking-widest mb-3">Tech Stack</h4>
                  <div className="flex flex-wrap gap-2">
                    {project.techStack.map((tech, i) => (
                      <motion.div
                        key={tech}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.35 + i * 0.03 }}
                        whileHover={{ scale: 1.05 }}
                      >
                        <Badge className="bg-gold/10 text-gold border border-gold/20">
                          {tech}
                        </Badge>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {(project.github || project.link) && (
                  <motion.div
                    className="flex gap-3 pt-4 border-t border-white/10"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    {project.github && (
                      <Button
                        variant="gold"
                        className="flex-1"
                        leftIcon={
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                          </svg>
                        }
                        onClick={() => window.open(project.github, "_blank")}
                      >
                        View on GitHub
                      </Button>
                    )}
                    {project.link && (
                      <Button
                        variant="outline"
                        className="flex-1"
                        rightIcon={
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        }
                        onClick={() => window.open(project.link, "_blank")}
                      >
                        Live Demo
                      </Button>
                    )}
                  </motion.div>
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
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-gold/3 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
        {/* Animated Section Header */}
        <AnimatedSectionHeader
          label="Impact"
          title="Projects"
          animation="split"
          className="mb-16"
        />

        {/* Category Filter with enhanced interactions */}
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
                  hidden: { opacity: 0, y: 20, scale: 0.9 },
                  visible: { opacity: 1, y: 0, scale: 1 },
                }}
                onClick={() => setActiveCategory(category)}
                whileHover={prefersReducedMotion ? undefined : { scale: 1.05, y: -2 }}
                whileTap={prefersReducedMotion ? undefined : { scale: 0.95 }}
                className={`px-6 py-2 rounded-full font-mono text-[10px] tracking-[0.2em] uppercase transition-all duration-300 border relative overflow-hidden group ${
                  activeCategory === category
                    ? "bg-gold text-[#050505] border-gold shadow-[0_0_15px_rgba(212,175,55,0.2)]"
                    : "bg-white/[0.02] text-white/40 border-white/10 hover:border-white/30 hover:text-white"
                }`}
                data-magnetic
              >
                {/* Active indicator pulse */}
                {activeCategory === category && (
                  <motion.span
                    className="absolute inset-0 bg-gold/20 rounded-full"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.5, 0, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                )}
                <span className="relative z-10">{category}</span>
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
