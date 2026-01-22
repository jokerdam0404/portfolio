"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ScrollReveal from "@/components/animations/ScrollReveal";
import { skills, skillCategories, Skill } from "@/lib/data/skills";
import { fadeInUp, staggerContainer } from "@/lib/animations";

function SkillBar({ skill }: { skill: Skill }) {
  return (
    <motion.div variants={fadeInUp} className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="font-medium text-primary-900">{skill.name}</span>
        <span className="text-sm text-primary-500">{skill.proficiency}%</span>
      </div>
      <div className="h-2 bg-primary-200 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-accent-500 rounded-full"
          initial={{ width: 0 }}
          whileInView={{ width: `${skill.proficiency}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
        />
      </div>
      {skill.description && (
        <p className="text-sm text-primary-600">{skill.description}</p>
      )}
    </motion.div>
  );
}

export default function Skills() {
  const [activeCategory, setActiveCategory] = useState<string>("Finance");

  const filteredSkills = skills.filter(
    (skill) => skill.category === activeCategory
  );

  return (
    <section id="skills" className="py-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <h2 className="text-4xl md:text-5xl font-bold text-primary-900 mb-4 text-center">
            Skills & Competencies
          </h2>
          <div className="w-20 h-1 bg-accent-500 mx-auto mb-6" />
          <p className="text-center text-primary-600 mb-12 max-w-2xl mx-auto">
            A comprehensive overview of my finance, technical, and professional
            skills developed through coursework, projects, and work experience.
          </p>
        </ScrollReveal>

        {/* Category Tabs */}
        <ScrollReveal delay={0.2}>
          <div className="flex flex-wrap gap-3 justify-center mb-12">
            {skillCategories.map((category) => (
              <Button
                key={category.name}
                variant={activeCategory === category.name ? "default" : "outline"}
                onClick={() => setActiveCategory(category.name)}
                size="lg"
                className="min-w-[140px]"
              >
                {category.name}
              </Button>
            ))}
          </div>
        </ScrollReveal>

        {/* Skills Grid */}
        <div className="grid md:grid-cols-2 gap-x-12 gap-y-8">
          <motion.div
            key={activeCategory}
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="md:col-span-2 grid md:grid-cols-2 gap-x-12 gap-y-8"
          >
            {filteredSkills.map((skill) => (
              <SkillBar key={skill.name} skill={skill} />
            ))}
          </motion.div>
        </div>

        {/* Additional Skills Cloud */}
        <ScrollReveal delay={0.4}>
          <div className="mt-16 pt-12 border-t border-primary-200">
            <h3 className="text-2xl font-semibold text-primary-900 mb-6 text-center">
              All Skills Overview
            </h3>
            <div className="flex flex-wrap gap-2 justify-center max-w-4xl mx-auto">
              {skills.map((skill) => (
                <Badge
                  key={skill.name}
                  variant="outline"
                  className="text-sm py-1.5 px-3 hover:bg-primary-100 transition-colors cursor-default"
                >
                  {skill.name}
                </Badge>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
