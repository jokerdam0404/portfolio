'use client';

import React from 'react';
import { motion, Variants, useInView } from 'framer-motion';
import { useRef } from 'react';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { TIMING, EASING } from '@/lib/kinetic-constants';

type RevealDirection = 'up' | 'down' | 'left' | 'right' | 'scale' | 'rotate';

interface ScrollRevealTextProps {
  /** The content to reveal */
  children: React.ReactNode;
  /** Direction of reveal animation */
  direction?: RevealDirection;
  /** Delay before animation (seconds) */
  delay?: number;
  /** Duration of animation (seconds) */
  duration?: number;
  /** Distance to travel (pixels) */
  distance?: number;
  /** Rotation angle (for rotate direction) */
  rotateAngle?: number;
  /** Scale factor (for scale direction) */
  scaleFactor?: number;
  /** How much of element must be visible to trigger (0-1) */
  threshold?: number;
  /** Whether to only animate once */
  once?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Parallax speed multiplier (0 = no parallax) */
  parallaxSpeed?: number;
  /** Custom easing curve */
  easing?: readonly [number, number, number, number];
  /** Callback when reveal animation completes */
  onRevealComplete?: () => void;
}

/**
 * ScrollRevealText - Scroll-triggered text reveal animations.
 *
 * Uses Intersection Observer to trigger animations when elements enter viewport.
 * Supports multiple directions, parallax effects, and custom timing.
 */
export function ScrollRevealText({
  children,
  direction = 'up',
  delay = 0,
  duration = TIMING.slow,
  distance = 60,
  rotateAngle = 15,
  scaleFactor = 0.9,
  threshold = 0.1,
  once = true,
  className = '',
  parallaxSpeed = 0,
  easing = EASING.smooth,
  onRevealComplete,
}: ScrollRevealTextProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { amount: threshold, once });
  const prefersReducedMotion = usePrefersReducedMotion();

  // Generate variants based on direction
  const getVariants = (): Variants => {
    const baseTransition = {
      duration,
      ease: easing as [number, number, number, number],
      delay,
    };

    switch (direction) {
      case 'up':
        return {
          hidden: { y: distance, opacity: 0 },
          visible: {
            y: 0,
            opacity: 1,
            transition: baseTransition,
          },
        };

      case 'down':
        return {
          hidden: { y: -distance, opacity: 0 },
          visible: {
            y: 0,
            opacity: 1,
            transition: baseTransition,
          },
        };

      case 'left':
        return {
          hidden: { x: distance, opacity: 0 },
          visible: {
            x: 0,
            opacity: 1,
            transition: baseTransition,
          },
        };

      case 'right':
        return {
          hidden: { x: -distance, opacity: 0 },
          visible: {
            x: 0,
            opacity: 1,
            transition: baseTransition,
          },
        };

      case 'scale':
        return {
          hidden: { scale: scaleFactor, opacity: 0 },
          visible: {
            scale: 1,
            opacity: 1,
            transition: baseTransition,
          },
        };

      case 'rotate':
        return {
          hidden: {
            rotateX: rotateAngle,
            opacity: 0,
            transformPerspective: 1000,
          },
          visible: {
            rotateX: 0,
            opacity: 1,
            transition: baseTransition,
          },
        };

      default:
        return {
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: baseTransition },
        };
    }
  };

  // Handle reduced motion
  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  const variants = getVariants();

  return (
    <motion.div
      ref={ref}
      className={className}
      variants={variants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      style={{
        willChange: 'transform, opacity',
        transformStyle: direction === 'rotate' ? 'preserve-3d' : undefined,
      }}
      onAnimationComplete={() => {
        if (isInView) {
          onRevealComplete?.();
        }
      }}
    >
      {children}
    </motion.div>
  );
}

/**
 * ScrollRevealHeading - Specialized scroll reveal for section headings.
 *
 * Combines scroll reveal with staggered word animation.
 */
interface ScrollRevealHeadingProps {
  /** The heading text */
  text: string;
  /** Heading level */
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  /** Additional CSS classes */
  className?: string;
  /** Delay before animation */
  delay?: number;
  /** Whether to split into words */
  splitWords?: boolean;
  /** Stagger delay between words */
  wordStagger?: number;
}

export function ScrollRevealHeading({
  text,
  as: Component = 'h2',
  className = '',
  delay = 0,
  splitWords = true,
  wordStagger = TIMING.wordStagger,
}: ScrollRevealHeadingProps) {
  const ref = useRef<HTMLHeadingElement>(null);
  const isInView = useInView(ref, { amount: 0.3, once: true });
  const prefersReducedMotion = usePrefersReducedMotion();

  if (prefersReducedMotion) {
    return <Component className={className}>{text}</Component>;
  }

  if (!splitWords) {
    return (
      <ScrollRevealText className={className} delay={delay} direction="up">
        <Component>{text}</Component>
      </ScrollRevealText>
    );
  }

  const words = text.split(' ');

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: wordStagger,
        delayChildren: delay,
      },
    },
  };

  const wordVariants: Variants = {
    hidden: {
      y: 40,
      opacity: 0,
      rotateX: -45,
    },
    visible: {
      y: 0,
      opacity: 1,
      rotateX: 0,
      transition: {
        duration: TIMING.slow,
        ease: EASING.smooth,
      },
    },
  };

  // Render the appropriate heading element
  const renderHeading = () => {
    const content = (
      <>
        <span className="sr-only">{text}</span>
        <span aria-hidden="true" className="inline-flex flex-wrap">
          {words.map((word, index) => (
            <motion.span
              key={`${word}-${index}`}
              className="inline-block mr-[0.25em] origin-bottom"
              style={{ willChange: 'transform, opacity' }}
              variants={wordVariants}
            >
              {word}
            </motion.span>
          ))}
        </span>
      </>
    );

    switch (Component) {
      case 'h1':
        return (
          <motion.h1
            ref={ref as React.RefObject<HTMLHeadingElement>}
            className={`${className} overflow-hidden`}
            style={{ perspective: '1000px' }}
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
          >
            {content}
          </motion.h1>
        );
      case 'h2':
        return (
          <motion.h2
            ref={ref as React.RefObject<HTMLHeadingElement>}
            className={`${className} overflow-hidden`}
            style={{ perspective: '1000px' }}
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
          >
            {content}
          </motion.h2>
        );
      case 'h3':
        return (
          <motion.h3
            ref={ref as React.RefObject<HTMLHeadingElement>}
            className={`${className} overflow-hidden`}
            style={{ perspective: '1000px' }}
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
          >
            {content}
          </motion.h3>
        );
      case 'h4':
        return (
          <motion.h4
            ref={ref as React.RefObject<HTMLHeadingElement>}
            className={`${className} overflow-hidden`}
            style={{ perspective: '1000px' }}
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
          >
            {content}
          </motion.h4>
        );
      case 'h5':
        return (
          <motion.h5
            ref={ref as React.RefObject<HTMLHeadingElement>}
            className={`${className} overflow-hidden`}
            style={{ perspective: '1000px' }}
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
          >
            {content}
          </motion.h5>
        );
      case 'h6':
        return (
          <motion.h6
            ref={ref as React.RefObject<HTMLHeadingElement>}
            className={`${className} overflow-hidden`}
            style={{ perspective: '1000px' }}
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
          >
            {content}
          </motion.h6>
        );
      default:
        return (
          <motion.h2
            ref={ref as React.RefObject<HTMLHeadingElement>}
            className={`${className} overflow-hidden`}
            style={{ perspective: '1000px' }}
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
          >
            {content}
          </motion.h2>
        );
    }
  };

  return renderHeading();
}

export default ScrollRevealText;
