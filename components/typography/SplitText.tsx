'use client';

import React, { useMemo } from 'react';
import { motion, Variants } from 'framer-motion';

export type SplitMode = 'characters' | 'words' | 'lines';

interface SplitTextProps {
  /** The text to split and animate */
  text: string;
  /** How to split the text */
  mode?: SplitMode;
  /** Animation variants for each split element */
  variants?: Variants;
  /** Container variants for staggering */
  containerVariants?: Variants;
  /** Additional class for container */
  className?: string;
  /** Additional class for each element */
  elementClassName?: string;
  /** HTML tag for container */
  as?: keyof React.JSX.IntrinsicElements;
  /** HTML tag for each element */
  elementAs?: keyof React.JSX.IntrinsicElements;
  /** Whether animation is triggered */
  animate?: boolean;
  /** Custom delay for each element (receives index) */
  customDelay?: (index: number) => number;
  /** Accessibility: provide screen reader text */
  ariaLabel?: string;
}

/**
 * SplitText - Utility component for splitting text into animatable units.
 *
 * Splits text into characters, words, or lines, wrapping each in a motion element
 * for individual animation control. Handles accessibility with sr-only text.
 */
export function SplitText({
  text,
  mode = 'characters',
  variants,
  containerVariants,
  className = '',
  elementClassName = '',
  as: Container = 'span',
  elementAs: Element = 'span',
  animate = true,
  customDelay,
  ariaLabel,
}: SplitTextProps) {
  const MotionContainer = motion.create(Container);
  const MotionElement = motion.create(Element);

  const elements = useMemo(() => {
    switch (mode) {
      case 'characters':
        // Split into individual characters, preserving spaces
        return text.split('').map((char, index) => ({
          content: char === ' ' ? '\u00A0' : char, // Non-breaking space for visibility
          key: `char-${index}-${char}`,
          index,
        }));

      case 'words':
        // Split into words
        return text.split(/\s+/).map((word, index) => ({
          content: word,
          key: `word-${index}-${word}`,
          index,
        }));

      case 'lines':
        // Split by newlines (for pre-formatted text)
        return text.split('\n').map((line, index) => ({
          content: line,
          key: `line-${index}`,
          index,
        }));

      default:
        return [{ content: text, key: 'full-text', index: 0 }];
    }
  }, [text, mode]);

  const defaultContainerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: mode === 'characters' ? 0.03 : mode === 'words' ? 0.08 : 0.12,
        delayChildren: 0.1,
      },
    },
  };

  const defaultElementVariants: Variants = {
    hidden: {
      opacity: 0,
      y: mode === 'characters' ? 10 : 20,
    },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: mode === 'characters' ? 0.3 : 0.5,
        ease: [0.43, 0.13, 0.23, 0.96],
        delay: customDelay ? customDelay(i) : 0,
      },
    }),
  };

  return (
    <>
      {/* Screen reader accessible text */}
      <span className="sr-only">{ariaLabel || text}</span>

      {/* Visual animated text */}
      <MotionContainer
        className={`inline-flex flex-wrap ${className}`}
        variants={containerVariants || defaultContainerVariants}
        initial="hidden"
        animate={animate ? 'visible' : 'hidden'}
        aria-hidden="true"
      >
        {elements.map(({ content, key, index }) => (
          <MotionElement
            key={key}
            className={`inline-block ${elementClassName}`}
            variants={variants || defaultElementVariants}
            custom={index}
            style={{ willChange: 'transform, opacity' }}
          >
            {content}
            {mode === 'words' && index < elements.length - 1 && (
              <span className="inline-block">&nbsp;</span>
            )}
          </MotionElement>
        ))}
      </MotionContainer>
    </>
  );
}

/**
 * Hook to split text for custom animation implementations
 */
export function useSplitText(text: string, mode: SplitMode = 'characters') {
  return useMemo(() => {
    switch (mode) {
      case 'characters':
        return text.split('');
      case 'words':
        return text.split(/\s+/);
      case 'lines':
        return text.split('\n');
      default:
        return [text];
    }
  }, [text, mode]);
}

export default SplitText;
