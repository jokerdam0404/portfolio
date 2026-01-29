'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { TIMING, EASING } from '@/lib/kinetic-constants';

interface TypewriterTextProps {
  /** Text to type out */
  text: string;
  /** Delay before typing starts (ms) */
  delay?: number;
  /** Speed of typing (ms per character) */
  speed?: number;
  /** Show blinking cursor */
  cursor?: boolean;
  /** Cursor character */
  cursorChar?: string;
  /** Additional CSS classes */
  className?: string;
  /** HTML element to render as */
  as?: keyof React.JSX.IntrinsicElements;
  /** Callback when typing completes */
  onComplete?: () => void;
  /** Loop the animation */
  loop?: boolean;
  /** Pause before looping (ms) */
  loopPause?: number;
  /** Delete animation before loop */
  deleteBeforeLoop?: boolean;
}

/**
 * TypewriterText - Classic typewriter effect with cursor.
 *
 * Types out text character by character with optional cursor and looping.
 */
export function TypewriterText({
  text,
  delay = 0,
  speed = 50,
  cursor = true,
  cursorChar = '|',
  className = '',
  as: Component = 'span',
  onComplete,
  loop = false,
  loopPause = 2000,
  deleteBeforeLoop = true,
}: TypewriterTextProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(true);
  const timeoutRef = useRef<NodeJS.Timeout>(undefined);

  // Cursor blink effect
  useEffect(() => {
    if (!cursor) return;

    const interval = setInterval(() => {
      setCursorVisible((v) => !v);
    }, 530);

    return () => clearInterval(interval);
  }, [cursor]);

  // Typing effect
  useEffect(() => {
    if (prefersReducedMotion) {
      setDisplayedText(text);
      onComplete?.();
      return;
    }

    // Initial delay
    const startTimeout = setTimeout(() => {
      setIsTyping(true);
    }, delay);

    return () => clearTimeout(startTimeout);
  }, [delay, prefersReducedMotion, text, onComplete]);

  useEffect(() => {
    if (!isTyping || prefersReducedMotion) return;

    if (!isDeleting && displayedText.length < text.length) {
      // Typing forward
      timeoutRef.current = setTimeout(() => {
        setDisplayedText(text.slice(0, displayedText.length + 1));
      }, speed);
    } else if (!isDeleting && displayedText.length === text.length) {
      // Finished typing
      onComplete?.();

      if (loop) {
        // Wait then start deleting or restart
        timeoutRef.current = setTimeout(() => {
          if (deleteBeforeLoop) {
            setIsDeleting(true);
          } else {
            setDisplayedText('');
          }
        }, loopPause);
      }
    } else if (isDeleting && displayedText.length > 0) {
      // Deleting
      timeoutRef.current = setTimeout(() => {
        setDisplayedText(displayedText.slice(0, -1));
      }, speed / 2);
    } else if (isDeleting && displayedText.length === 0) {
      // Finished deleting, restart
      setIsDeleting(false);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [
    isTyping,
    isDeleting,
    displayedText,
    text,
    speed,
    loop,
    loopPause,
    deleteBeforeLoop,
    onComplete,
    prefersReducedMotion,
  ]);

  // Render static for reduced motion
  if (prefersReducedMotion) {
    return <span className={className}>{text}</span>;
  }

  return (
    <motion.span
      className={`inline-block ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: TIMING.normal }}
    >
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {displayedText}
        {cursor && (
          <motion.span
            className="inline-block ml-0.5"
            animate={{ opacity: cursorVisible ? 1 : 0 }}
            transition={{ duration: 0.1 }}
          >
            {cursorChar}
          </motion.span>
        )}
      </span>
    </motion.span>
  );
}

/**
 * RotatingTypewriter - Typewriter that cycles through multiple strings.
 */
interface RotatingTypewriterProps {
  /** Array of strings to cycle through */
  strings: string[];
  /** Prefix text (static) */
  prefix?: string;
  /** Delay before first string */
  delay?: number;
  /** Typing speed (ms per character) */
  speed?: number;
  /** Pause between strings (ms) */
  pauseBetween?: number;
  /** Additional CSS classes */
  className?: string;
  /** Class for prefix */
  prefixClassName?: string;
}

export function RotatingTypewriter({
  strings,
  prefix = '',
  delay = 0,
  speed = 50,
  pauseBetween = 2000,
  className = '',
  prefixClassName = '',
}: RotatingTypewriterProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  // Start after delay
  useEffect(() => {
    const timer = setTimeout(() => setHasStarted(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  // Typing/deleting effect
  useEffect(() => {
    if (!hasStarted || prefersReducedMotion) return;

    const currentString = strings[currentIndex];

    let timeout: NodeJS.Timeout;

    if (!isDeleting && displayedText.length < currentString.length) {
      // Typing
      timeout = setTimeout(() => {
        setDisplayedText(currentString.slice(0, displayedText.length + 1));
      }, speed);
    } else if (!isDeleting && displayedText.length === currentString.length) {
      // Pause then delete
      timeout = setTimeout(() => {
        setIsDeleting(true);
      }, pauseBetween);
    } else if (isDeleting && displayedText.length > 0) {
      // Deleting
      timeout = setTimeout(() => {
        setDisplayedText(displayedText.slice(0, -1));
      }, speed / 2);
    } else if (isDeleting && displayedText.length === 0) {
      // Move to next string
      setIsDeleting(false);
      setCurrentIndex((prev) => (prev + 1) % strings.length);
    }

    return () => clearTimeout(timeout);
  }, [hasStarted, displayedText, isDeleting, currentIndex, strings, speed, pauseBetween, prefersReducedMotion]);

  if (prefersReducedMotion) {
    return (
      <span className={className}>
        {prefix && <span className={prefixClassName}>{prefix}</span>}
        {strings[0]}
      </span>
    );
  }

  return (
    <span className={className}>
      {prefix && <span className={prefixClassName}>{prefix}</span>}
      <span className="sr-only">{strings.join(', ')}</span>
      <span aria-hidden="true">
        {displayedText}
        <motion.span
          className="inline-block ml-0.5"
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 1.06, repeat: Infinity }}
        >
          |
        </motion.span>
      </span>
    </span>
  );
}

export default TypewriterText;
