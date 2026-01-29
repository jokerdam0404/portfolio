'use client';

import React, { useRef } from 'react';
import { motion, useInView, Variants } from 'framer-motion';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { TIMING, EASING } from '@/lib/kinetic-constants';

type AnimationType = 'split' | 'fade' | 'slide' | 'scale' | 'reveal';

interface AnimatedSectionHeaderProps {
  /** Section label (e.g., "Identity", "Projects") */
  label?: string;
  /** Main heading text */
  title: string;
  /** Optional description text */
  description?: string;
  /** Animation style for the title */
  animation?: AnimationType;
  /** Center align content */
  centered?: boolean;
  /** Additional container classes */
  className?: string;
  /** Label color class */
  labelClassName?: string;
  /** Title classes */
  titleClassName?: string;
  /** Description classes */
  descriptionClassName?: string;
  /** Delay before animation starts */
  delay?: number;
  /** Show decorative lines around label */
  showDecorators?: boolean;
  /** Gold accent color (for finance theme) */
  accentColor?: string;
}

/**
 * AnimatedSectionHeader - Consistent animated section headers.
 *
 * Provides a unified component for section headers with various
 * animation styles, maintaining the portfolio's visual language.
 */
export function AnimatedSectionHeader({
  label,
  title,
  description,
  animation = 'split',
  centered = true,
  className = '',
  labelClassName = '',
  titleClassName = '',
  descriptionClassName = '',
  delay = 0,
  showDecorators = true,
  accentColor = '#D4AF37',
}: AnimatedSectionHeaderProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { amount: 0.3, once: true });
  const prefersReducedMotion = usePrefersReducedMotion();

  // Container variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: delay,
      },
    },
  };

  // Label animation
  const labelVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: TIMING.normal,
        ease: EASING.smooth,
      },
    },
  };

  // Decorator line animation
  const lineVariants: Variants = {
    hidden: { scaleX: 0, opacity: 0 },
    visible: {
      scaleX: 1,
      opacity: 1,
      transition: {
        duration: TIMING.slow,
        ease: EASING.smooth,
      },
    },
  };

  // Title animation based on type
  const getTitleVariants = (): Variants => {
    switch (animation) {
      case 'split':
        // Words split and come together
        return {
          hidden: {},
          visible: {},
        };

      case 'fade':
        return {
          hidden: { opacity: 0, y: 30 },
          visible: {
            opacity: 1,
            y: 0,
            transition: {
              duration: TIMING.slow,
              ease: EASING.smooth,
            },
          },
        };

      case 'slide':
        return {
          hidden: { x: -60, opacity: 0 },
          visible: {
            x: 0,
            opacity: 1,
            transition: {
              duration: TIMING.slow,
              ease: EASING.smooth,
            },
          },
        };

      case 'scale':
        return {
          hidden: { scale: 0.8, opacity: 0 },
          visible: {
            scale: 1,
            opacity: 1,
            transition: {
              duration: TIMING.slow,
              ease: EASING.bounce,
            },
          },
        };

      case 'reveal':
        return {
          hidden: { y: '100%' },
          visible: {
            y: 0,
            transition: {
              duration: TIMING.slow,
              ease: EASING.elegant,
            },
          },
        };

      default:
        return {
          hidden: { opacity: 0 },
          visible: { opacity: 1 },
        };
    }
  };

  // Word variants for split animation
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

  // Description animation
  const descriptionVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: TIMING.normal,
        ease: EASING.smooth,
      },
    },
  };

  // Render static for reduced motion
  if (prefersReducedMotion) {
    return (
      <div
        className={`${centered ? 'text-center' : ''} ${className}`}
        ref={ref}
      >
        {label && (
          <div className={`flex items-center ${centered ? 'justify-center' : ''} gap-3 mb-4`}>
            {showDecorators && <div className="w-8 h-px" style={{ backgroundColor: accentColor }} />}
            <span
              className={`font-mono text-sm tracking-widest uppercase ${labelClassName}`}
              style={{ color: accentColor }}
            >
              {label}
            </span>
            {showDecorators && <div className="w-8 h-px" style={{ backgroundColor: accentColor }} />}
          </div>
        )}
        <h2 className={`text-3xl md:text-5xl font-display font-bold text-white mb-6 ${titleClassName}`}>
          {title}
        </h2>
        {description && (
          <p className={`text-white/50 max-w-2xl ${centered ? 'mx-auto' : ''} ${descriptionClassName}`}>
            {description}
          </p>
        )}
      </div>
    );
  }

  const words = title.split(' ');

  return (
    <motion.div
      ref={ref}
      className={`${centered ? 'text-center' : ''} ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
    >
      {/* Label with decorators */}
      {label && (
        <motion.div
          className={`flex items-center ${centered ? 'justify-center' : ''} gap-3 mb-4`}
          variants={labelVariants}
        >
          {showDecorators && (
            <motion.div
              className="w-8 h-px origin-right"
              style={{ backgroundColor: accentColor }}
              variants={lineVariants}
            />
          )}
          <span
            className={`font-mono text-sm tracking-widest uppercase ${labelClassName}`}
            style={{ color: accentColor }}
          >
            {label}
          </span>
          {showDecorators && (
            <motion.div
              className="w-8 h-px origin-left"
              style={{ backgroundColor: accentColor }}
              variants={lineVariants}
            />
          )}
        </motion.div>
      )}

      {/* Title with animation */}
      {animation === 'split' ? (
        <motion.h2
          className={`text-3xl md:text-5xl font-display font-bold text-white mb-6 overflow-hidden ${titleClassName}`}
          style={{ perspective: '1000px' }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: TIMING.wordStagger,
              },
            },
          }}
        >
          <span className="sr-only">{title}</span>
          <span aria-hidden="true" className="inline-flex flex-wrap justify-center">
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
        </motion.h2>
      ) : animation === 'reveal' ? (
        <div className="overflow-hidden mb-6">
          <motion.h2
            className={`text-3xl md:text-5xl font-display font-bold text-white ${titleClassName}`}
            variants={getTitleVariants()}
          >
            {title}
          </motion.h2>
        </div>
      ) : (
        <motion.h2
          className={`text-3xl md:text-5xl font-display font-bold text-white mb-6 ${titleClassName}`}
          variants={getTitleVariants()}
        >
          {title}
        </motion.h2>
      )}

      {/* Description */}
      {description && (
        <motion.p
          className={`text-white/50 max-w-2xl text-lg font-light ${centered ? 'mx-auto' : ''} ${descriptionClassName}`}
          variants={descriptionVariants}
        >
          {description}
        </motion.p>
      )}
    </motion.div>
  );
}

export default AnimatedSectionHeader;
