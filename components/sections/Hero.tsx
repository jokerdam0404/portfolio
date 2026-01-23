"use client";

import dynamic from "next/dynamic";

/**
 * Lazy-load the cinematic video hero to reduce initial bundle size.
 * This component uses scroll-scrubbed videos for photoreal cinematics.
 */
const CinematicVideoHero = dynamic(
  () => import("@/components/hero/CinematicVideoHero"),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-primary-950 flex items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-2 border-accent-500/30 border-t-accent-500 animate-spin" />
        </div>
      </div>
    ),
  }
);

/**
 * Hero section wrapper for the cinematic video experience.
 *
 * Features:
 * - Scroll-driven video scrubbing through three scenes
 * - Stairs → Black hole → Trading floor narrative
 * - Skip intro button with keyboard support (ESC)
 * - Replay functionality
 * - Reduced motion support with static fallback
 * - Hardware-accelerated video playback
 */
export default function Hero() {
  const handleSkipIntro = () => {
    const aboutSection = document.getElementById("about");
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="hero" className="relative">
      <CinematicVideoHero onSkipIntro={handleSkipIntro} />
    </section>
  );
}
