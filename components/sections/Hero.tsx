"use client";

import dynamic from "next/dynamic";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/**
 * Lazy-load the cinematic hero to reduce initial bundle size.
 * This component contains the full 3D experience with Three.js.
 */
const CinematicHero = dynamic(
  () => import("@/components/hero/CinematicHero"),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-gradient-to-b from-primary-950 via-primary-900 to-primary-950 flex items-center justify-center">
        <div className="relative">
          <div className="w-24 h-24 rounded-full border-2 border-accent-500/30 border-t-accent-500 animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-accent-500/20 animate-pulse" />
          </div>
        </div>
      </div>
    ),
  }
);

/**
 * Hero section wrapper that handles the cinematic 3D experience.
 *
 * Features:
 * - Scroll-driven cinematic journey through three scenes
 * - Stairs → Black hole → Trading floor narrative
 * - Skip intro button with keyboard support (ESC)
 * - Reduced motion fallback
 * - Mobile optimization
 */
export default function Hero() {
  const prefersReducedMotion = usePrefersReducedMotion();

  const handleSkipIntro = () => {
    // Scroll to the about section when intro is skipped
    const aboutSection = document.getElementById("about");
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="hero" className="relative">
      <CinematicHero onSkipIntro={handleSkipIntro} />
    </section>
  );
}
