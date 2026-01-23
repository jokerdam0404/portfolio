"use client";

import { motion, AnimatePresence } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import { Button } from "@/components/ui/button";

interface HeroOverlayProps {
  scrollProgress: number;
  introComplete: boolean;
  isStatic?: boolean;
}

/**
 * HeroOverlay - Text content overlay for the cinematic hero
 *
 * Displays different content based on scroll progress:
 * - Scene 1 (0-0.33): Name and H-1B1 badge
 * - Scene 2 (0.33-0.66): Transition text
 * - Scene 3 (0.66-1.0): CTAs and final state
 */
export default function HeroOverlay({ scrollProgress, introComplete, isStatic }: HeroOverlayProps) {
  // Determine current scene (1, 2, or 3)
  const currentScene = scrollProgress < 0.33 ? 1 : scrollProgress < 0.66 ? 2 : 3;

  // Calculate opacity for each scene
  const scene1Opacity = isStatic ? 1 : Math.max(0, 1 - scrollProgress * 4);
  const scene2Opacity = isStatic ? 0 : scrollProgress > 0.25 && scrollProgress < 0.75 ? Math.sin((scrollProgress - 0.25) * Math.PI * 2) : 0;
  const scene3Opacity = isStatic ? 1 : Math.max(0, (scrollProgress - 0.7) * 3.33);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="absolute inset-0 z-20 pointer-events-none">
      {/* Dark overlay for text readability */}
      <div
        className="absolute inset-0 transition-opacity duration-500"
        style={{
          background: `linear-gradient(to bottom,
            rgba(0,0,0,${0.2 + scrollProgress * 0.2}) 0%,
            rgba(0,0,0,${0.3 + scrollProgress * 0.1}) 50%,
            rgba(0,0,0,${0.4 + scrollProgress * 0.2}) 100%
          )`,
        }}
      />

      {/* Scene 1: Introduction */}
      <AnimatePresence>
        {(currentScene === 1 || isStatic) && scene1Opacity > 0.1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: scene1Opacity }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex flex-col items-center justify-center px-6 pointer-events-auto"
          >
            <div className="max-w-5xl mx-auto text-center">
              {/* H-1B1 Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mb-6"
              >
                <a
                  href="https://www.dol.gov/agencies/whd/immigration/h1b1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center rounded-full px-4 py-1.5 text-sm font-medium bg-white/10 backdrop-blur-sm text-white border border-white/30 hover:bg-white/20 hover:border-white/50 hover:shadow-glow transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent group"
                >
                  <span className="mr-2">🇸🇬</span>
                  <span className="relative">
                    H-1B1 eligible (Singapore citizen)
                    <span className="absolute bottom-0 left-0 w-full h-px bg-white/50 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                  </span>
                  <svg
                    className="ml-2 w-3.5 h-3.5 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </motion.div>

              {/* Name */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="text-5xl sm:text-6xl md:text-8xl font-display font-bold text-white mb-6 tracking-tight"
              >
                Achintya Chaganti
              </motion.h1>

              {/* Typing animation */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-xl sm:text-2xl md:text-3xl text-white/90 mb-8 h-10 sm:h-12 font-body"
              >
                <TypeAnimation
                  sequence={[
                    "Physics & Economics Student",
                    2000,
                    "Equity Analyst",
                    2000,
                    "Financial Modeling Specialist",
                    2000,
                    "Undergraduate Researcher",
                    2000,
                  ]}
                  wrapper="span"
                  speed={50}
                  repeat={Infinity}
                />
              </motion.div>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="text-base sm:text-lg md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed font-body"
              >
                Physics and Economics student passionate about equity research and financial modeling.
                Currently managing a $5M mid-cap fund.
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scene 2: Transition Text */}
      <AnimatePresence>
        {currentScene === 2 && scene2Opacity > 0.1 && !isStatic && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: scene2Opacity }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="text-center px-6">
              <motion.p
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-2xl sm:text-3xl md:text-4xl font-display font-medium text-white/90 max-w-2xl"
              >
                From physics simulations to market predictions
              </motion.p>
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.3 }}
                className="w-24 h-1 bg-gradient-to-r from-accent-400 to-accent-600 mx-auto mt-6 rounded-full"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scene 3: Final State with CTAs */}
      <AnimatePresence>
        {(currentScene === 3 || introComplete) && (scene3Opacity > 0.1 || isStatic) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isStatic ? 1 : scene3Opacity }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex flex-col items-center justify-center pointer-events-auto"
          >
            <div className="max-w-5xl mx-auto text-center px-6">
              {/* Mini badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-4"
              >
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-accent-500/20 text-accent-300 border border-accent-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-400 mr-2 animate-pulse" />
                  Ready to make an impact
                </span>
              </motion.div>

              {/* Headline */}
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-white mb-6"
              >
                Let&apos;s Build Something{" "}
                <span className="bg-gradient-to-r from-accent-400 to-accent-600 bg-clip-text text-transparent">
                  Extraordinary
                </span>
              </motion.h2>

              {/* Subtext */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-lg text-white/70 mb-10 max-w-xl mx-auto font-body"
              >
                Bridging quantitative analysis with strategic thinking to drive exceptional results.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <Button
                  size="lg"
                  onClick={() => scrollToSection("projects")}
                  className="text-base sm:text-lg font-medium px-8 py-6 bg-accent-500 hover:bg-accent-600 shadow-lg shadow-accent-500/25 hover:shadow-accent-500/40 transition-all duration-300"
                >
                  View My Work
                  <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => scrollToSection("contact")}
                  className="text-base sm:text-lg font-medium px-8 py-6 bg-white/10 backdrop-blur-sm text-white border-white/30 hover:bg-white/20 hover:border-white/50 transition-all duration-300"
                >
                  Get In Touch
                </Button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
