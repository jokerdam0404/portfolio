'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, useAnimationControls } from 'framer-motion';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { TIMING, EASING } from '@/lib/kinetic-constants';

interface GlitchTextProps {
  /** The text to display */
  text: string;
  /** HTML element to render as */
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'span' | 'p' | 'div';
  /** Additional CSS classes */
  className?: string;
  /** Trigger glitch on hover */
  glitchOnHover?: boolean;
  /** Continuous glitch animation */
  continuous?: boolean;
  /** Interval for continuous glitch (ms) */
  glitchInterval?: number;
  /** Duration of each glitch (ms) */
  glitchDuration?: number;
  /** Intensity of glitch effect (0-1) */
  intensity?: number;
  /** Primary glitch color */
  primaryColor?: string;
  /** Secondary glitch color (RGB shift) */
  secondaryColor?: string;
}

/**
 * GlitchText - Cyberpunk-inspired glitch effect for text.
 *
 * Creates a layered glitch effect with color shifting and displacement,
 * perfect for space/tech themes. Supports hover and continuous modes.
 */
export function GlitchText({
  text,
  as: Component = 'span',
  className = '',
  glitchOnHover = true,
  continuous = false,
  glitchInterval = 3000,
  glitchDuration = 300,
  intensity = 0.5,
  primaryColor = 'rgba(77, 166, 255, 0.8)',
  secondaryColor = 'rgba(255, 77, 166, 0.8)',
}: GlitchTextProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [isGlitching, setIsGlitching] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout>(undefined);
  const controls = useAnimationControls();

  // Continuous glitch effect
  useEffect(() => {
    if (!continuous || prefersReducedMotion) return;

    const triggerGlitch = () => {
      setIsGlitching(true);
      setTimeout(() => setIsGlitching(false), glitchDuration);
    };

    // Initial glitch
    const initialDelay = setTimeout(triggerGlitch, 1000);

    // Recurring glitch
    intervalRef.current = setInterval(triggerGlitch, glitchInterval);

    return () => {
      clearTimeout(initialDelay);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [continuous, glitchInterval, glitchDuration, prefersReducedMotion]);

  // Hover glitch trigger
  const handleHoverStart = () => {
    if (!glitchOnHover || prefersReducedMotion) return;
    setIsGlitching(true);
  };

  const handleHoverEnd = () => {
    if (!glitchOnHover || prefersReducedMotion) return;
    setTimeout(() => setIsGlitching(false), glitchDuration);
  };

  // Render static for reduced motion
  if (prefersReducedMotion) {
    return <Component className={className}>{text}</Component>;
  }

  const offset = 2 * intensity;

  return (
    <motion.span
      className={`relative inline-block ${className}`}
      onHoverStart={handleHoverStart}
      onHoverEnd={handleHoverEnd}
      style={{ cursor: glitchOnHover ? 'pointer' : 'default' }}
    >
      {/* Screen reader text */}
      <span className="sr-only">{text}</span>

      {/* Base text layer */}
      <span
        aria-hidden="true"
        className="relative z-10"
        style={{
          display: 'inline-block',
        }}
      >
        {text}
      </span>

      {/* Glitch layers */}
      {isGlitching && (
        <>
          {/* Left color shift layer */}
          <motion.span
            className="absolute inset-0 z-0"
            aria-hidden="true"
            style={{
              color: primaryColor,
              clipPath: 'inset(0 0 50% 0)',
            }}
            initial={{ x: 0, opacity: 0 }}
            animate={{
              x: [-offset, offset, -offset / 2, offset / 2, 0],
              opacity: [0, 0.8, 0.6, 0.8, 0],
            }}
            transition={{
              duration: glitchDuration / 1000,
              ease: 'easeInOut',
            }}
          >
            {text}
          </motion.span>

          {/* Right color shift layer */}
          <motion.span
            className="absolute inset-0 z-0"
            aria-hidden="true"
            style={{
              color: secondaryColor,
              clipPath: 'inset(50% 0 0 0)',
            }}
            initial={{ x: 0, opacity: 0 }}
            animate={{
              x: [offset, -offset, offset / 2, -offset / 2, 0],
              opacity: [0, 0.8, 0.6, 0.8, 0],
            }}
            transition={{
              duration: glitchDuration / 1000,
              ease: 'easeInOut',
            }}
          >
            {text}
          </motion.span>

          {/* Scanline effect */}
          <motion.span
            className="absolute inset-0 z-20 pointer-events-none overflow-hidden"
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.1, 0.05, 0.1, 0] }}
            transition={{ duration: glitchDuration / 1000 }}
            style={{
              background: `repeating-linear-gradient(
                0deg,
                transparent,
                transparent 2px,
                rgba(0, 0, 0, 0.1) 2px,
                rgba(0, 0, 0, 0.1) 4px
              )`,
            }}
          />
        </>
      )}
    </motion.span>
  );
}

/**
 * DataCorruptText - Text that appears to be corrupting/glitching randomly.
 */
interface DataCorruptTextProps {
  text: string;
  className?: string;
  corruptChance?: number;
  refreshInterval?: number;
}

export function DataCorruptText({
  text,
  className = '',
  corruptChance = 0.1,
  refreshInterval = 100,
}: DataCorruptTextProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [displayText, setDisplayText] = useState(text);
  const [isHovered, setIsHovered] = useState(false);

  const glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`0123456789';

  useEffect(() => {
    if (!isHovered || prefersReducedMotion) {
      setDisplayText(text);
      return;
    }

    const interval = setInterval(() => {
      const newText = text
        .split('')
        .map((char) => {
          if (char === ' ') return char;
          if (Math.random() < corruptChance) {
            return glitchChars[Math.floor(Math.random() * glitchChars.length)];
          }
          return char;
        })
        .join('');
      setDisplayText(newText);
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [isHovered, text, corruptChance, refreshInterval, prefersReducedMotion]);

  if (prefersReducedMotion) {
    return <span className={className}>{text}</span>;
  }

  return (
    <motion.span
      className={`inline-block font-mono ${className}`}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      style={{ cursor: 'pointer' }}
    >
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">{displayText}</span>
    </motion.span>
  );
}

export default GlitchText;
