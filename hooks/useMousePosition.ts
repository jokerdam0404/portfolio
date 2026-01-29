'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface MousePosition {
  x: number;
  y: number;
  normalizedX: number;
  normalizedY: number;
}

interface UseMousePositionOptions {
  /** Enable/disable tracking */
  enabled?: boolean;
  /** Smoothing factor (0-1, higher = more smoothing) */
  smoothing?: number;
  /** Throttle updates (ms) */
  throttleMs?: number;
}

/**
 * Hook to track mouse position with optional smoothing and throttling.
 * Returns both absolute and normalized (-1 to 1) coordinates.
 */
export function useMousePosition(options: UseMousePositionOptions = {}): MousePosition {
  const { enabled = true, smoothing = 0, throttleMs = 0 } = options;

  const [position, setPosition] = useState<MousePosition>({
    x: 0,
    y: 0,
    normalizedX: 0,
    normalizedY: 0,
  });

  const targetRef = useRef({ x: 0, y: 0 });
  const currentRef = useRef({ x: 0, y: 0 });
  const frameRef = useRef<number>(undefined);
  const lastUpdateRef = useRef(0);

  const updatePosition = useCallback(() => {
    if (smoothing > 0) {
      // Smooth interpolation
      currentRef.current.x += (targetRef.current.x - currentRef.current.x) * (1 - smoothing);
      currentRef.current.y += (targetRef.current.y - currentRef.current.y) * (1 - smoothing);
    } else {
      currentRef.current.x = targetRef.current.x;
      currentRef.current.y = targetRef.current.y;
    }

    const width = typeof window !== 'undefined' ? window.innerWidth : 1;
    const height = typeof window !== 'undefined' ? window.innerHeight : 1;

    setPosition({
      x: currentRef.current.x,
      y: currentRef.current.y,
      normalizedX: (currentRef.current.x / width) * 2 - 1,
      normalizedY: (currentRef.current.y / height) * 2 - 1,
    });

    if (smoothing > 0) {
      frameRef.current = requestAnimationFrame(updatePosition);
    }
  }, [smoothing]);

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    const handleMouseMove = (event: MouseEvent) => {
      const now = Date.now();

      if (throttleMs > 0 && now - lastUpdateRef.current < throttleMs) {
        return;
      }
      lastUpdateRef.current = now;

      targetRef.current.x = event.clientX;
      targetRef.current.y = event.clientY;

      if (smoothing === 0) {
        updatePosition();
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    if (smoothing > 0) {
      frameRef.current = requestAnimationFrame(updatePosition);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [enabled, smoothing, throttleMs, updatePosition]);

  return position;
}

/**
 * Hook to track mouse position relative to an element.
 * Returns position from -1 to 1 based on element bounds.
 */
export function useElementMousePosition<T extends HTMLElement>(): {
  ref: React.RefObject<T | null>;
  position: { x: number; y: number; isInside: boolean };
} {
  const ref = useRef<T>(null);
  const [position, setPosition] = useState({ x: 0, y: 0, isInside: false });

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleMouseMove = (event: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = ((event.clientY - rect.top) / rect.height) * 2 - 1;
      const isInside = x >= -1 && x <= 1 && y >= -1 && y <= 1;

      setPosition({ x, y, isInside });
    };

    const handleMouseLeave = () => {
      setPosition(prev => ({ ...prev, isInside: false }));
    };

    element.addEventListener('mousemove', handleMouseMove, { passive: true });
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return { ref, position };
}
