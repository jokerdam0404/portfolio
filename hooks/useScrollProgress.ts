'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

interface ScrollProgress {
  /** Progress through the entire document (0-1) */
  documentProgress: number;
  /** Current scroll Y position in pixels */
  scrollY: number;
  /** Scroll direction: 1 = down, -1 = up, 0 = none */
  direction: number;
  /** Scroll velocity in pixels per frame */
  velocity: number;
}

interface UseScrollProgressOptions {
  /** Throttle updates (ms) */
  throttleMs?: number;
  /** Enable velocity tracking */
  trackVelocity?: boolean;
}

/**
 * Hook to track overall scroll progress through the document.
 * Provides document progress, position, direction, and velocity.
 */
export function useScrollProgress(options: UseScrollProgressOptions = {}): ScrollProgress {
  const { throttleMs = 0, trackVelocity = false } = options;

  const [progress, setProgress] = useState<ScrollProgress>({
    documentProgress: 0,
    scrollY: 0,
    direction: 0,
    velocity: 0,
  });

  const lastScrollRef = useRef(0);
  const lastTimeRef = useRef(0);
  const lastUpdateRef = useRef(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleScroll = () => {
      const now = Date.now();

      if (throttleMs > 0 && now - lastUpdateRef.current < throttleMs) {
        return;
      }
      lastUpdateRef.current = now;

      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const documentProgress = docHeight > 0 ? Math.min(scrollY / docHeight, 1) : 0;

      const direction = scrollY > lastScrollRef.current ? 1 : scrollY < lastScrollRef.current ? -1 : 0;

      let velocity = 0;
      if (trackVelocity) {
        const timeDelta = now - lastTimeRef.current;
        if (timeDelta > 0) {
          velocity = (scrollY - lastScrollRef.current) / timeDelta * 16; // Normalize to ~60fps
        }
        lastTimeRef.current = now;
      }

      lastScrollRef.current = scrollY;

      setProgress({
        documentProgress,
        scrollY,
        direction,
        velocity,
      });
    };

    // Initial calculation
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [throttleMs, trackVelocity]);

  return progress;
}

interface ElementScrollProgress {
  /** Progress through the element viewport (0-1) */
  progress: number;
  /** Is element currently visible */
  isVisible: boolean;
  /** Element's position relative to viewport center (-1 to 1) */
  viewportPosition: number;
}

/**
 * Hook to track scroll progress relative to a specific element.
 * Progress goes from 0 (element entering viewport) to 1 (element leaving).
 */
export function useElementScrollProgress<T extends HTMLElement>(): {
  ref: React.RefObject<T | null>;
  progress: ElementScrollProgress;
} {
  const ref = useRef<T>(null);
  const [progress, setProgress] = useState<ElementScrollProgress>({
    progress: 0,
    isVisible: false,
    viewportPosition: 0,
  });

  const calculateProgress = useCallback(() => {
    const element = ref.current;
    if (!element) return;

    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // Element is visible when any part is in viewport
    const isVisible = rect.bottom > 0 && rect.top < windowHeight;

    // Progress: 0 when element top enters bottom of viewport
    // 1 when element bottom leaves top of viewport
    const totalDistance = windowHeight + rect.height;
    const currentPosition = windowHeight - rect.top;
    const scrollProgress = Math.max(0, Math.min(1, currentPosition / totalDistance));

    // Viewport position: -1 (above center) to 1 (below center)
    const elementCenter = rect.top + rect.height / 2;
    const viewportCenter = windowHeight / 2;
    const viewportPosition = (elementCenter - viewportCenter) / viewportCenter;

    setProgress({
      progress: scrollProgress,
      isVisible,
      viewportPosition: Math.max(-1, Math.min(1, viewportPosition)),
    });
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    calculateProgress();

    window.addEventListener('scroll', calculateProgress, { passive: true });
    window.addEventListener('resize', calculateProgress, { passive: true });

    return () => {
      window.removeEventListener('scroll', calculateProgress);
      window.removeEventListener('resize', calculateProgress);
    };
  }, [calculateProgress]);

  return { ref, progress };
}
