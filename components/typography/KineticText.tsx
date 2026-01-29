'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, useAnimationControls, Variants } from 'framer-motion';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { useElementMousePosition } from '@/hooks/useMousePosition';
import {
  TIMING,
  EASING,
  glitchVariants,
  breathingVariants,
  letterRevealUp,
  staggerContainerLetters,
} from '@/lib/kinetic-constants';

interface KineticTextProps {
  /** The text to display */
  text: string;
  /** HTML tag for the text element */
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';
  /** Additional CSS classes */
  className?: string;
  /** Enable letter-by-letter reveal animation */
  letterReveal?: boolean;
  /** Delay before animation starts */
  delay?: number;
  /** Enable glitch effect on hover */
  glitchOnHover?: boolean;
  /** Enable subtle breathing animation */
  breathingEffect?: boolean;
  /** Enable mouse-following parallax on letters */
  mouseFollowIntensity?: number;
  /** Custom gradient for text */
  gradient?: string;
  /** Stagger delay between letters */
  letterStagger?: number;
  /** Callback when animation completes */
  onAnimationComplete?: () => void;
}

/**
 * KineticText - Advanced text component with multiple animation capabilities.
 *
 * Features:
 * - Letter-by-letter reveal animations
 * - Glitch effects on hover (space theme)
 * - Breathing/pulsing animations
 * - Mouse-following parallax for individual letters
 * - Gradient text support
 */
export function KineticText({
  text,
  as: Component = 'span',
  className = '',
  letterReveal = true,
  delay = 0,
  glitchOnHover = false,
  breathingEffect = false,
  mouseFollowIntensity = 0,
  gradient,
  letterStagger = TIMING.letterStagger,
  onAnimationComplete,
}: KineticTextProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const { ref: containerRef, position: mousePos } = useElementMousePosition<HTMLSpanElement>();
  const controls = useAnimationControls();
  const [isHovered, setIsHovered] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

  const letters = text.split('');

  // Handle reduced motion preference
  const shouldAnimate = !prefersReducedMotion;

  // Letter reveal animation
  useEffect(() => {
    if (shouldAnimate && letterReveal && !hasAnimated) {
      const timer = setTimeout(() => {
        controls.start('visible').then(() => {
          setHasAnimated(true);
          onAnimationComplete?.();
        });
      }, delay * 1000);

      return () => clearTimeout(timer);
    }
  }, [controls, delay, hasAnimated, letterReveal, onAnimationComplete, shouldAnimate]);

  // Custom variants with configurable stagger
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: letterStagger,
        delayChildren: 0.05,
      },
    },
  };

  const letterVariants: Variants = {
    hidden: {
      y: '100%',
      opacity: 0,
      rotateX: -90,
    },
    visible: {
      y: 0,
      opacity: 1,
      rotateX: 0,
      transition: {
        duration: TIMING.normal,
        ease: EASING.smooth,
      },
    },
  };

  // Calculate mouse-following offset for each letter
  const getLetterOffset = (index: number) => {
    if (!mouseFollowIntensity || !mousePos.isInside) return { x: 0, y: 0 };

    const progress = index / letters.length;
    const wave = Math.sin(progress * Math.PI);

    return {
      x: mousePos.x * mouseFollowIntensity * wave * 10,
      y: mousePos.y * mouseFollowIntensity * wave * 5,
    };
  };

  // Glitch animation trigger
  const handleHoverStart = () => {
    setIsHovered(true);
    if (glitchOnHover && shouldAnimate) {
      controls.start('glitch');
    }
  };

  const handleHoverEnd = () => {
    setIsHovered(false);
    if (glitchOnHover && shouldAnimate) {
      controls.start('initial');
    }
  };

  // Gradient style
  const gradientStyle = gradient
    ? {
        backgroundImage: gradient,
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        color: 'transparent',
      }
    : {};

  if (!shouldAnimate) {
    // Render static text for reduced motion preference
    return (
      <Component className={className} style={gradientStyle}>
        {text}
      </Component>
    );
  }

  return (
    <>
      {/* Screen reader text */}
      <span className="sr-only">{text}</span>

      {/* Animated visual text */}
      <motion.span
        ref={containerRef}
        className={`inline-flex overflow-hidden ${className}`}
        style={{ ...gradientStyle, perspective: '1000px' }}
        variants={containerVariants}
        initial="hidden"
        animate={controls}
        onHoverStart={handleHoverStart}
        onHoverEnd={handleHoverEnd}
        aria-hidden="true"
      >
        {letters.map((letter, index) => {
          const offset = getLetterOffset(index);
          const isSpace = letter === ' ';

          return (
            <motion.span
              key={`${letter}-${index}`}
              className="inline-block origin-bottom"
              style={{
                willChange: 'transform, opacity',
                transformStyle: 'preserve-3d',
              }}
              variants={letterReveal ? letterVariants : undefined}
              animate={
                breathingEffect && hasAnimated
                  ? {
                      scale: [1, 1.02, 1],
                      opacity: [1, 0.95, 1],
                      transition: {
                        duration: 3 + (index % 3) * 0.5,
                        ease: 'easeInOut',
                        repeat: Infinity,
                        delay: index * 0.1,
                      },
                    }
                  : mouseFollowIntensity && hasAnimated
                  ? {
                      x: offset.x,
                      y: offset.y,
                      transition: { type: 'spring', stiffness: 150, damping: 15 },
                    }
                  : undefined
              }
            >
              {isSpace ? '\u00A0' : letter}
            </motion.span>
          );
        })}
      </motion.span>
    </>
  );
}

export default KineticText;
