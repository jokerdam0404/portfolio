'use client';

import { Suspense, lazy, useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

// Lazy load Spline for better performance
const Spline = lazy(() => import('@splinetool/react-spline'));

interface SplineViewerProps {
  scene: string;
  className?: string;
  fallback?: React.ReactNode;
  onLoad?: () => void;
  onError?: () => void;
  interactive?: boolean;
  showLoadingIndicator?: boolean;
  loadOnVisible?: boolean;
  visibilityThreshold?: number;
}

// Loading spinner component
function LoadingSpinner() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-transparent">
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-2 border-gold/20" />
        <div className="absolute inset-0 w-12 h-12 rounded-full border-2 border-transparent border-t-gold animate-spin" />
      </div>
    </div>
  );
}

// Check for reduced motion preference
function useReducedMotion(): boolean {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return reducedMotion;
}

export default function SplineViewer({
  scene,
  className = '',
  fallback,
  onLoad,
  onError,
  interactive = true,
  showLoadingIndicator = true,
  loadOnVisible = true,
  visibilityThreshold = 0.1,
}: SplineViewerProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [shouldRender, setShouldRender] = useState(!loadOnVisible);
  const reducedMotion = useReducedMotion();

  const { ref, inView } = useInView({
    threshold: visibilityThreshold,
    triggerOnce: true,
  });

  // Trigger loading when element comes into view
  useEffect(() => {
    if (loadOnVisible && inView && !shouldRender) {
      setShouldRender(true);
    }
  }, [inView, loadOnVisible, shouldRender]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  // If user prefers reduced motion, show static fallback
  if (reducedMotion) {
    return (
      <div ref={ref} className={`relative w-full h-full ${className}`}>
        {fallback || (
          <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent rounded-2xl" />
        )}
      </div>
    );
  }

  // Show error fallback
  if (hasError) {
    return (
      <div ref={ref} className={`relative w-full h-full ${className}`}>
        {fallback || (
          <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent rounded-2xl flex items-center justify-center">
            <span className="text-white/30 text-sm font-mono">3D unavailable</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div ref={ref} className={`relative w-full h-full ${className}`}>
      <AnimatePresence>
        {showLoadingIndicator && !isLoaded && shouldRender && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 z-10"
          >
            <LoadingSpinner />
          </motion.div>
        )}
      </AnimatePresence>

      {shouldRender && (
        <Suspense fallback={showLoadingIndicator ? <LoadingSpinner /> : null}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isLoaded ? 1 : 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="w-full h-full"
            style={{ pointerEvents: interactive ? 'auto' : 'none' }}
          >
            <Spline
              scene={scene}
              onLoad={handleLoad}
              onError={handleError}
            />
          </motion.div>
        </Suspense>
      )}
    </div>
  );
}
