"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import gsap from "gsap";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/**
 * Lazy-load the 3D canvas to avoid SSR issues and reduce initial bundle size.
 * The Canvas component uses browser-only APIs (WebGL, window).
 */
const HeroCanvas = dynamic(() => import("@/components/three/HeroCanvas"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-accent-900 to-primary-800" />
  ),
});

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const gradientRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    // Skip animations if user prefers reduced motion
    if (prefersReducedMotion) return;

    // GSAP gradient animation
    if (gradientRef.current) {
      gsap.to(gradientRef.current, {
        backgroundPosition: "100% 50%",
        duration: 15,
        ease: "none",
        repeat: -1,
        yoyo: true,
      });
    }

    // Mouse parallax effect
    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current) return;
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;

      const xPos = (clientX / innerWidth - 0.5) * 20;
      const yPos = (clientY / innerHeight - 0.5) * 20;

      gsap.to(heroRef.current.querySelector(".hero-content"), {
        x: xPos,
        y: yPos,
        duration: 0.5,
        ease: "power2.out",
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [prefersReducedMotion]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Animated Gradient Background */}
      <div
        ref={gradientRef}
        className="absolute inset-0 gradient-bg"
        style={{ backgroundSize: "200% 200%" }}
      />

      {/* 3D Canvas Background - sits behind content */}
      <HeroCanvas className="z-[1]" />

      {/* Overlay for text readability */}
      <div className="absolute inset-0 bg-black/30 z-[2]" />

      {/* Content */}
      <div className="hero-content relative z-10 max-w-5xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.8 }}
        >
          {/* Work Authorization Badge - prominent placement */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.5, delay: prefersReducedMotion ? 0 : 0.3 }}
            className="mb-6"
          >
            <Badge
              variant="outline"
              className="px-4 py-1.5 text-sm bg-white/10 backdrop-blur-sm text-white border-white/30 hover:bg-white/20 transition-colors"
            >
              <span className="mr-2">🇸🇬</span>
              H-1B1 eligible (Singapore citizen)
            </Badge>
          </motion.div>

          <h1 className="text-5xl sm:text-6xl md:text-8xl font-bold text-white mb-6 tracking-tight">
            Achintya Chaganti
          </h1>

          <div className="text-xl sm:text-2xl md:text-3xl text-white/90 mb-8 h-10 sm:h-12">
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
          </div>

          <p className="text-base sm:text-lg md:text-xl text-white/80 mb-12 max-w-2xl mx-auto leading-relaxed">
            Physics and Economics student passionate about equity research and financial modeling.
            Currently managing a $5M mid-cap fund and conducting advanced physics simulations.
            Seeking opportunities in finance and quantitative analysis.
          </p>

          <div className="flex gap-4 justify-center flex-wrap">
            <Button
              size="lg"
              onClick={() => scrollToSection("projects")}
              className="text-base sm:text-lg"
            >
              View My Work
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => scrollToSection("contact")}
              className="text-base sm:text-lg bg-white/10 backdrop-blur-sm text-white border-white/30 hover:bg-white/20"
            >
              Get In Touch
            </Button>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: prefersReducedMotion ? 0 : 1.5, duration: prefersReducedMotion ? 0 : 1 }}
        >
          <motion.div
            animate={prefersReducedMotion ? {} : { y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="flex flex-col items-center gap-2 text-white/60 cursor-pointer hover:text-white/80 transition-colors"
            onClick={() => scrollToSection("about")}
          >
            <span className="text-sm">Scroll Down</span>
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
