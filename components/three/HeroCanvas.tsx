"use client";

import { Suspense, lazy, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useTheme } from 'next-themes';
import { usePrefersReducedMotion, useIsMobile } from '@/hooks/usePrefersReducedMotion';

/**
 * Lazy-loaded Canvas component from @react-three/fiber.
 * Using dynamic import with ssr: false to prevent server-side rendering issues.
 * Three.js requires browser APIs (WebGL, window) that aren't available during SSR.
 */
const Canvas = dynamic(
  () => import('@react-three/fiber').then((mod) => mod.Canvas),
  { ssr: false }
);

/**
 * Lazy-loaded 3D scene component.
 * This allows the main bundle to load without the heavy Three.js dependencies.
 */
const HeroScene = lazy(() => import('./HeroScene'));

/**
 * Lazy-loaded Stats component for FPS monitoring (dev mode only).
 */
const Stats = dynamic(
  () => import('@react-three/drei').then((mod) => mod.Stats),
  { ssr: false }
);

interface HeroCanvasProps {
  className?: string;
}

/**
 * Static fallback for reduced-motion users.
 * Displays a clean gradient with subtle visual interest.
 */
function StaticFallback({ isDark }: { isDark: boolean }) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Gradient orb effect - CSS only, no animation */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] md:w-[600px] md:h-[600px]"
        style={{
          background: isDark
            ? 'radial-gradient(circle, rgba(96, 165, 250, 0.4) 0%, rgba(59, 130, 246, 0.15) 50%, transparent 70%)'
            : 'radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, rgba(30, 64, 175, 0.1) 50%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />

      {/* Subtle ring decorations */}
      <div
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] md:w-[700px] md:h-[700px] rounded-full border ${
          isDark ? 'border-accent-400/30' : 'border-accent-500/20'
        }`}
      />
      <div
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] md:w-[850px] md:h-[850px] rounded-full border ${
          isDark ? 'border-accent-400/20' : 'border-accent-500/10'
        }`}
      />
    </div>
  );
}

/**
 * Loading state while 3D scene initializes.
 * Shows a subtle pulse animation to indicate loading.
 */
function LoadingState() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div
        className="w-32 h-32 rounded-full bg-accent-500/20 animate-pulse"
        style={{ filter: 'blur(20px)' }}
      />
    </div>
  );
}

/**
 * Custom hook to track scroll progress within the hero section.
 * Returns a value from 0 (top) to 1 (scrolled past hero).
 */
function useScrollProgress() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      // Calculate scroll progress based on viewport height
      const viewportHeight = window.innerHeight;
      const scrollY = window.scrollY;

      // Progress from 0 to 1 as user scrolls through first viewport
      const progress = Math.min(scrollY / viewportHeight, 1);
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return scrollProgress;
}

/**
 * HeroCanvas - The main 3D background component for the hero section.
 *
 * Features:
 * - Lazy-loaded Three.js bundle (no SSR)
 * - Respects prefers-reduced-motion
 * - Mobile optimizations (reduced particle count, lower DPR)
 * - Graceful loading and error states
 * - Dark mode support with adjusted colors
 * - Scroll-linked parallax effect
 * - FPS counter in development mode
 *
 * Tuning parameters (edit HeroScene.tsx):
 * - speed: Animation speed multiplier (default: 1)
 * - particleCount: Number of orbiting particles (default: 60, mobile: 30)
 * - orbSize: Central sphere size (default: 2.5)
 */
export default function HeroCanvas({ className = '' }: HeroCanvasProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const isMobile = useIsMobile();
  const { resolvedTheme } = useTheme();
  const scrollProgress = useScrollProgress();
  const [isClient, setIsClient] = useState(false);
  const [hasWebGL, setHasWebGL] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Ensure we're on the client before rendering 3D content
  useEffect(() => {
    setIsClient(true);
    setMounted(true);

    // Check WebGL support
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      setHasWebGL(!!gl);
    } catch {
      setHasWebGL(false);
    }
  }, []);

  const isDark = mounted ? resolvedTheme === 'dark' : false;

  // Don't render anything during SSR
  if (!isClient) {
    return <div className={`absolute inset-0 ${className}`} />;
  }

  // Show static fallback for:
  // - Users who prefer reduced motion
  // - Devices without WebGL support
  if (prefersReducedMotion || !hasWebGL) {
    return (
      <div className={`absolute inset-0 ${className}`}>
        <StaticFallback isDark={isDark} />
      </div>
    );
  }

  // Mobile optimizations:
  // - Lower device pixel ratio (1 vs 2) for better performance
  // - Fewer particles (30 vs 60)
  // - Smaller scale (0.7 vs 1)
  const mobileConfig = {
    dpr: 1,
    particleCount: 30,
    scale: 0.7,
  };

  const desktopConfig = {
    dpr: Math.min(window.devicePixelRatio, 2),
    particleCount: 60,
    scale: 1,
  };

  const config = isMobile ? mobileConfig : desktopConfig;

  // Show FPS counter only in development
  const showStats = process.env.NODE_ENV === 'development';

  return (
    <div className={`absolute inset-0 ${className}`}>
      <Suspense fallback={<LoadingState />}>
        <Canvas
          dpr={config.dpr}
          camera={{ position: [0, 0, 10], fov: 45 }}
          style={{ pointerEvents: 'none' }}
          gl={{
            antialias: !isMobile, // Disable antialiasing on mobile for performance
            alpha: true,
            powerPreference: 'high-performance',
          }}
        >
          {/* FPS counter in dev mode */}
          {showStats && <Stats className="!absolute !left-auto !right-0 !top-16" />}

          <HeroScene
            speed={1}
            particleCount={config.particleCount}
            orbSize={2.5}
            animated={true}
            scale={config.scale}
            scrollProgress={scrollProgress}
            isDark={isDark}
          />
        </Canvas>
      </Suspense>
    </div>
  );
}
