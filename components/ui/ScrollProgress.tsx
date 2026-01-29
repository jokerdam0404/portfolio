"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

interface ScrollProgressProps {
  /** Position of the progress bar */
  position?: "top" | "bottom";
  /** Height of the progress bar in pixels */
  height?: number;
  /** Color of the progress bar (Tailwind class or hex) */
  color?: string;
  /** Show percentage indicator */
  showPercentage?: boolean;
  /** Custom z-index */
  zIndex?: number;
}

/**
 * ScrollProgress - A global scroll progress indicator.
 *
 * Features:
 * - Smooth spring-based animation
 * - Optional percentage display
 * - Gradient glow effect
 * - Respects prefers-reduced-motion
 */
export default function ScrollProgress({
  position = "top",
  height = 3,
  color = "#D4AF37",
  showPercentage = false,
  zIndex = 9990,
}: ScrollProgressProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [mounted, setMounted] = useState(false);
  const { scrollYProgress } = useScroll();

  // Spring animation for smooth progress
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Transform for percentage display
  const percentage = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const percentageOpacity = useTransform(scrollYProgress, [0, 0.05], [0.5, 1]);
  const [percentageValue, setPercentageValue] = useState(0);

  useEffect(() => {
    setMounted(true);

    if (showPercentage) {
      const unsubscribe = percentage.on("change", (v) => {
        setPercentageValue(Math.round(v));
      });
      return () => unsubscribe();
    }
  }, [percentage, showPercentage]);

  if (!mounted) return null;

  const positionClasses = position === "top" ? "top-0" : "bottom-0";

  return (
    <>
      {/* Progress bar container */}
      <div
        className={`fixed left-0 right-0 ${positionClasses} pointer-events-none`}
        style={{ zIndex, height }}
      >
        {/* Background track */}
        <div className="absolute inset-0 bg-white/5" />

        {/* Progress bar */}
        <motion.div
          className="absolute inset-y-0 left-0 origin-left"
          style={{
            scaleX: prefersReducedMotion ? scrollYProgress : scaleX,
            backgroundColor: color,
          }}
        >
          {/* Glow effect */}
          <div
            className="absolute inset-0 blur-sm"
            style={{ backgroundColor: color, opacity: 0.5 }}
          />

          {/* Leading edge highlight */}
          <motion.div
            className="absolute right-0 top-0 bottom-0 w-12"
            style={{
              background: `linear-gradient(90deg, transparent, ${color})`,
            }}
            animate={{
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>
      </div>

      {/* Percentage indicator */}
      {showPercentage && (
        <motion.div
          className={`fixed right-4 ${position === "top" ? "top-6" : "bottom-6"} pointer-events-none`}
          style={{ zIndex, opacity: percentageOpacity }}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-sm border border-white/10">
            <span className="text-xs font-mono text-gold">
              {percentageValue}%
            </span>
          </div>
        </motion.div>
      )}
    </>
  );
}
