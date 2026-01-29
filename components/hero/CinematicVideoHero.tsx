"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePrefersReducedMotion, useIsMobile } from "@/hooks/usePrefersReducedMotion";
import HeroOverlay from "./HeroOverlay";

/**
 * CinematicVideoHero - A performant, photoreal cinematic hero using scroll-scrubbed videos
 *
 * Replaces WebGL 3D with high-quality video clips for:
 * - Scene A: Person walking up stairs (ascent/ambition)
 * - Scene B: Black hole warp (transition/transformation)
 * - Scene C: Trading floor (arrival/success)
 *
 * Performance features:
 * - Hardware-accelerated video decoding (MP4 H.264)
 * - RAF-based scroll handling (no React state updates per frame)
 * - CSS transforms only (no layout thrashing)
 * - Lazy loading with poster images
 * - Reduced motion support with static fallback
 */

interface CinematicVideoHeroProps {
  onSkipIntro?: () => void;
}

// Scene configuration - Space to Wall Street Journey
// Three-act narrative: Ascent → Transformation → Arrival
const SCENES = [
  { id: "ascent", label: "Origins", video: "/cinematic/journey/encoded/ascent-stairs-1080p.mp4", poster: "/cinematic/journey/posters/ascent-poster.jpg" },
  { id: "wormhole", label: "Transformation", video: "/cinematic/journey/encoded/wormhole-transit.mp4", poster: "/cinematic/journey/posters/wormhole-poster.jpg" },
  { id: "wallstreet", label: "Arrival", video: "/cinematic/journey/encoded/wall-street-arrival.mp4", poster: "/cinematic/journey/posters/wallstreet-poster.jpg" },
] as const;

// Total scroll height as multiplier of viewport height
const SCROLL_HEIGHT_VH = 300;

export default function CinematicVideoHero({ onSkipIntro }: CinematicVideoHeroProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const isMobile = useIsMobile();

  const [isClient, setIsClient] = useState(false);
  const [showSkipButton, setShowSkipButton] = useState(true);
  const [introComplete, setIntroComplete] = useState(false);
  const [videosLoaded, setVideosLoaded] = useState(false);
  const [showReplay, setShowReplay] = useState(false);

  // Refs for DOM elements (avoid React state for scroll perf)
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollProgressRef = useRef(0);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const overlayRef = useRef<HTMLDivElement>(null);
  const rafIdRef = useRef<number | null>(null);

  // Store scroll progress for overlay (updated less frequently)
  const [displayProgress, setDisplayProgress] = useState(0);

  // Client-side initialization
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Preload videos
  useEffect(() => {
    if (!isClient || prefersReducedMotion) return;

    const loadPromises = videoRefs.current.map((video, i) => {
      if (!video) return Promise.resolve();
      return new Promise<void>((resolve) => {
        if (video.readyState >= 3) {
          resolve();
        } else {
          video.addEventListener("canplaythrough", () => resolve(), { once: true });
        }
      });
    });

    Promise.all(loadPromises).then(() => {
      setVideosLoaded(true);
    });
  }, [isClient, prefersReducedMotion]);

  // Scroll-driven video scrubbing with RAF
  useEffect(() => {
    if (!isClient || prefersReducedMotion) return;

    let lastProgress = -1;
    let lastDisplayUpdate = 0;

    const updateVideos = () => {
      const viewportHeight = window.innerHeight;
      const scrollY = window.scrollY;
      const heroHeight = viewportHeight * (SCROLL_HEIGHT_VH / 100);

      const progress = Math.min(Math.max(scrollY / heroHeight, 0), 1);
      scrollProgressRef.current = progress;

      // Update display progress at 30fps max for overlay
      const now = performance.now();
      if (now - lastDisplayUpdate > 33) {
        setDisplayProgress(progress);
        lastDisplayUpdate = now;
      }

      // Skip if progress hasn't changed meaningfully
      if (Math.abs(progress - lastProgress) < 0.001) {
        rafIdRef.current = requestAnimationFrame(updateVideos);
        return;
      }
      lastProgress = progress;

      // Determine which scene we're in (0, 1, or 2)
      const sceneIndex = Math.min(Math.floor(progress * 3), 2);
      const sceneProgress = (progress * 3) % 1;

      // Update video currentTime for active scene
      videoRefs.current.forEach((video, i) => {
        if (!video) return;

        const isActiveScene = i === sceneIndex;
        const isNextScene = i === sceneIndex + 1;
        const isPrevScene = i === sceneIndex - 1;

        // Opacity and visibility via CSS
        if (isActiveScene) {
          video.style.opacity = "1";
          video.style.zIndex = "2";

          // Scrub video based on scene progress
          if (video.duration && isFinite(video.duration)) {
            const targetTime = sceneProgress * video.duration;
            // Only update if difference is significant (avoid micro-updates)
            if (Math.abs(video.currentTime - targetTime) > 0.03) {
              video.currentTime = targetTime;
            }
          }
        } else if (isNextScene) {
          // Fade in next scene
          const fadeProgress = Math.max(0, sceneProgress - 0.7) / 0.3;
          video.style.opacity = String(fadeProgress * 0.5);
          video.style.zIndex = "1";
          video.currentTime = 0;
        } else if (isPrevScene) {
          // Fade out previous scene
          video.style.opacity = String(1 - sceneProgress);
          video.style.zIndex = "1";
        } else {
          video.style.opacity = "0";
          video.style.zIndex = "0";
        }
      });

      // UI updates
      if (progress > 0.1 && showSkipButton) {
        setShowSkipButton(false);
      }

      if (progress >= 0.95 && !introComplete) {
        setIntroComplete(true);
        setShowReplay(true);
      }

      rafIdRef.current = requestAnimationFrame(updateVideos);
    };

    rafIdRef.current = requestAnimationFrame(updateVideos);

    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [isClient, prefersReducedMotion, showSkipButton, introComplete]);

  // Skip intro handler
  const handleSkipIntro = useCallback(() => {
    setShowSkipButton(false);
    setIntroComplete(true);
    setShowReplay(true);

    const heroHeight = window.innerHeight * (SCROLL_HEIGHT_VH / 100);
    window.scrollTo({
      top: heroHeight,
      behavior: "smooth",
    });

    onSkipIntro?.();
  }, [onSkipIntro]);

  // Replay handler
  const handleReplay = useCallback(() => {
    setIntroComplete(false);
    setShowReplay(false);
    setShowSkipButton(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    // Reset videos
    videoRefs.current.forEach((video) => {
      if (video) video.currentTime = 0;
    });
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && showSkipButton) {
        handleSkipIntro();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showSkipButton, handleSkipIntro]);

  // SSR fallback
  if (!isClient) {
    return <div className="relative" style={{ height: `${SCROLL_HEIGHT_VH}vh` }} />;
  }

  // Reduced motion: show static hero
  if (prefersReducedMotion) {
    return (
      <div className="relative h-screen">
        <StaticHero />
        <HeroOverlay scrollProgress={1} introComplete={true} isStatic={true} />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative"
      style={{ height: `${SCROLL_HEIGHT_VH}vh` }}
    >
      {/* Sticky viewport container */}
      <div className="sticky top-0 h-screen overflow-hidden bg-black">

        {/* Video layers */}
        {SCENES.map((scene, i) => (
          <video
            key={scene.id}
            ref={(el) => { videoRefs.current[i] = el; }}
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
            style={{ opacity: i === 0 ? 1 : 0, zIndex: i === 0 ? 2 : 0 }}
            src={scene.video}
            poster={scene.poster}
            muted
            playsInline
            preload="auto"
            aria-hidden="true"
          />
        ))}

        {/* Cinematic overlays (CSS-only for perf) */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          {/* Film grain - subtle noise texture */}
          <div
            className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            }}
          />

          {/* Vignette */}
          <div
            className="absolute inset-0"
            style={{
              background: "radial-gradient(ellipse at center, transparent 0%, transparent 50%, rgba(0,0,0,0.4) 100%)",
            }}
          />

          {/* Top/bottom gradients for text readability */}
          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/40 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/60 to-transparent" />
        </div>

        {/* Loading indicator */}
        <AnimatePresence>
          {!videosLoaded && (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-30 bg-primary-950 flex items-center justify-center"
            >
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-2 border-accent-500/30 border-t-accent-500 animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-accent-500/20 animate-pulse" />
                </div>
              </div>
              <p className="absolute bottom-20 text-white/60 text-sm">Loading cinematic...</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content Overlay */}
        <div ref={overlayRef}>
          <HeroOverlay
            scrollProgress={displayProgress}
            introComplete={introComplete}
            isStatic={false}
          />
        </div>

        {/* Skip Intro Button */}
        <AnimatePresence>
          {showSkipButton && (
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

        {/* Replay Button */}
        <AnimatePresence>
          {showReplay && introComplete && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleReplay}
              className="absolute bottom-8 right-8 z-50 px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-medium hover:bg-white/20 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
            >
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Replay
              </span>
            </motion.button>
          )}
        </AnimatePresence>

        {/* Scroll Indicator */}
        <AnimatePresence>
          {!introComplete && displayProgress < 0.05 && (
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
                <svg className="w-6 h-6 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scene Progress Indicator */}
        <div className="absolute left-8 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col gap-3">
          {SCENES.map((scene, i) => {
            const sceneStart = i / 3;
            const sceneEnd = (i + 1) / 3;
            const isActive = displayProgress >= sceneStart && displayProgress < sceneEnd;
            const isComplete = displayProgress >= sceneEnd;

            return (
              <div key={scene.id} className="flex items-center gap-3 group">
                <div
                  className={`w-2 h-2 rounded-full transition-all duration-500 ${
                    isActive
                      ? "bg-accent-400 scale-125 shadow-[0_0_10px_rgba(96,165,250,0.5)]"
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
                  {scene.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/**
 * Static fallback for reduced motion users
 */
function StaticHero() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Use the trading floor poster as static background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/cinematic/trading-poster.jpg')" }}
      />

      {/* Fallback gradient if poster doesn't load */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary-950 via-primary-900 to-primary-800" />

      {/* Subtle overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at center, transparent 0%, transparent 50%, rgba(0,0,0,0.5) 100%)",
        }}
      />
    </div>
  );
}
