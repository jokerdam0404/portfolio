"use client";

import { Suspense, useState, useEffect, useCallback, useRef } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { usePrefersReducedMotion, useIsMobile } from "@/hooks/usePrefersReducedMotion";
import HeroOverlay from "./HeroOverlay";

/**
 * Lazy-load the 3D canvas to avoid SSR issues and reduce initial bundle size.
 */
const CinematicCanvas = dynamic(() => import("./CinematicCanvas"), {
  ssr: false,
  loading: () => <LoadingState />,
});

/**
 * Loading state while 3D scene initializes
 */
function LoadingState() {
  return (
    <div className="absolute inset-0 bg-gradient-to-b from-primary-950 via-primary-900 to-primary-950 flex items-center justify-center">
      <div className="relative">
        {/* Animated loading indicator */}
        <div className="w-24 h-24 rounded-full border-2 border-accent-500/30 border-t-accent-500 animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-accent-500/20 animate-pulse" />
        </div>
      </div>
      <p className="absolute bottom-32 text-white/60 text-sm font-body">Loading experience...</p>
    </div>
  );
}

/**
 * Static fallback for reduced motion or unsupported devices
 */
function StaticHero() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary-950 via-primary-900 to-primary-800" />

      {/* Abstract shapes for visual interest */}
      <div className="absolute inset-0">
        {/* Central glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />

        {/* Accent circles */}
        <div className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full border border-accent-500/20" />
        <div className="absolute bottom-1/4 left-1/4 w-48 h-48 rounded-full border border-accent-400/10" />

        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* Noise overlay */}
      <div className="absolute inset-0 noise-overlay" />
    </div>
  );
}

interface CinematicHeroProps {
  onSkipIntro?: () => void;
}

/**
 * CinematicHero - The main cinematic 3D hero component
 *
 * Features a scroll-driven journey through three scenes:
 * A) Stairs - Character walking up stairs
 * B) Black hole transition - Warp through a vortex
 * C) Trading floor - Emergence onto Wall Street
 *
 * Includes:
 * - Skip intro button
 * - Reduced motion support
 * - Mobile optimization
 * - Accessible overlay text
 */
export default function CinematicHero({ onSkipIntro }: CinematicHeroProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const isMobile = useIsMobile();
  const [isClient, setIsClient] = useState(false);
  const [hasWebGL, setHasWebGL] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showSkipButton, setShowSkipButton] = useState(true);
  const [introComplete, setIntroComplete] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Ensure we're on the client
  useEffect(() => {
    setIsClient(true);

    // Check WebGL support
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      setHasWebGL(!!gl);
    } catch {
      setHasWebGL(false);
    }
  }, []);

  // Handle scroll progress
  useEffect(() => {
    if (prefersReducedMotion || !hasWebGL) return;

    const handleScroll = () => {
      // Calculate scroll progress through the hero section (3x viewport height)
      const viewportHeight = window.innerHeight;
      const scrollY = window.scrollY;
      const heroHeight = viewportHeight * 3; // 3 scenes worth of scrolling

      const progress = Math.min(Math.max(scrollY / heroHeight, 0), 1);
      setScrollProgress(progress);

      // Hide skip button after significant scroll
      if (progress > 0.1) {
        setShowSkipButton(false);
      }

      // Mark intro as complete when reaching the end
      if (progress >= 0.95) {
        setIntroComplete(true);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial call

    return () => window.removeEventListener("scroll", handleScroll);
  }, [prefersReducedMotion, hasWebGL]);

  // Handle skip intro
  const handleSkipIntro = useCallback(() => {
    setShowSkipButton(false);
    setIntroComplete(true);

    // Scroll to main content
    const heroHeight = window.innerHeight * 3;
    window.scrollTo({
      top: heroHeight,
      behavior: "smooth",
    });

    onSkipIntro?.();
  }, [onSkipIntro]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && showSkipButton) {
        handleSkipIntro();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showSkipButton, handleSkipIntro]);

  // Don't render anything during SSR
  if (!isClient) {
    return <div className="relative h-[300vh]" />;
  }

  // Show static fallback for reduced motion or no WebGL
  const showStaticFallback = prefersReducedMotion || !hasWebGL;

  return (
    <div ref={containerRef} className="relative" style={{ height: showStaticFallback ? "100vh" : "300vh" }}>
      {/* Sticky container for the 3D scene */}
      <div className="sticky top-0 h-screen overflow-hidden">
        {showStaticFallback ? (
          <StaticHero />
        ) : (
          <Suspense fallback={<LoadingState />}>
            <CinematicCanvas
              scrollProgress={scrollProgress}
              isMobile={isMobile}
              introComplete={introComplete}
            />
          </Suspense>
        )}

        {/* Content Overlay */}
        <HeroOverlay
          scrollProgress={scrollProgress}
          introComplete={introComplete}
          isStatic={showStaticFallback}
        />

        {/* Skip Intro Button */}
        <AnimatePresence>
          {showSkipButton && !showStaticFallback && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ delay: 1, duration: 0.5 }}
              onClick={handleSkipIntro}
              className="absolute bottom-8 right-8 z-50 px-6 py-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-medium hover:bg-white/20 hover:border-white/30 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 group"
            >
              <span className="flex items-center gap-2">
                Skip Intro
                <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded bg-white/10 text-xs font-mono">
                  ESC
                </kbd>
              </span>
            </motion.button>
          )}
        </AnimatePresence>

        {/* Scroll Indicator */}
        <AnimatePresence>
          {!introComplete && scrollProgress < 0.05 && !showStaticFallback && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 2, duration: 1 }}
              className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2"
            >
              <span className="text-white/60 text-sm font-body">Scroll to explore</span>
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <svg
                  className="w-6 h-6 text-white/60"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scene Progress Indicator */}
        {!showStaticFallback && (
          <div className="absolute left-8 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col gap-3">
            {["Ascent", "Transit", "Arrival"].map((label, i) => {
              const sceneStart = i / 3;
              const sceneEnd = (i + 1) / 3;
              const isActive = scrollProgress >= sceneStart && scrollProgress < sceneEnd;
              const isComplete = scrollProgress >= sceneEnd;

              return (
                <div key={label} className="flex items-center gap-3 group">
                  <div
                    className={`w-2 h-2 rounded-full transition-all duration-500 ${
                      isActive
                        ? "bg-accent-400 scale-125 shadow-glow"
                        : isComplete
                          ? "bg-white/60"
                          : "bg-white/20"
                    }`}
                  />
                  <span
                    className={`text-xs font-medium transition-all duration-300 ${
                      isActive ? "text-white opacity-100" : "text-white/40 opacity-0 group-hover:opacity-100"
                    }`}
                  >
                    {label}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
