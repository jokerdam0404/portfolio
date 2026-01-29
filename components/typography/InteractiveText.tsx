'use client';

import React, { useRef, useState } from 'react';
import { motion, useSpring } from 'framer-motion';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { EASING, TIMING } from '@/lib/kinetic-constants';

type InteractiveVariant = 'magnetic' | 'proximity' | 'wave' | 'scatter' | 'glow';

interface InteractiveTextProps {
  /** The text content */
  children: React.ReactNode;
  /** Type of interactive effect */
  variant?: InteractiveVariant;
  /** Additional CSS classes */
  className?: string;
  /** Scale on hover (for magnetic/proximity) */
  hoverScale?: number;
  /** Proximity radius in pixels */
  proximityRadius?: number;
  /** Intensity of the effect (0-1) */
  intensity?: number;
  /** Whether the element is a link */
  href?: string;
  /** Click handler */
  onClick?: () => void;
}

/**
 * InteractiveText - Mouse-responsive text with various effects.
 *
 * Variants:
 * - magnetic: Text follows cursor with spring physics
 * - proximity: Text reacts when cursor is nearby
 * - wave: Characters wave as cursor passes
 * - scatter: Characters scatter on hover
 * - glow: Cursor position affects glow effect
 */
export function InteractiveText({
  children,
  variant = 'magnetic',
  className = '',
  hoverScale = 1.05,
  proximityRadius = 100,
  intensity = 0.5,
  href,
  onClick,
}: InteractiveTextProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [isHovered, setIsHovered] = useState(false);

  // Spring values for smooth animation
  const springConfig = { stiffness: 150, damping: 15 };
  const x = useSpring(0, springConfig);
  const y = useSpring(0, springConfig);

  // Handle mouse movement for magnetic effect
  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (prefersReducedMotion || variant !== 'magnetic') return;

    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = e.clientX - centerX;
    const deltaY = e.clientY - centerY;

    x.set(deltaX * intensity * 0.3);
    y.set(deltaY * intensity * 0.3);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  // Render static for reduced motion
  if (prefersReducedMotion) {
    if (href) {
      return (
        <a href={href} className={className} onClick={onClick}>
          {children}
        </a>
      );
    }
    return (
      <span className={className} onClick={onClick}>
        {children}
      </span>
    );
  }

  // Different variants
  const getVariantStyles = () => {
    switch (variant) {
      case 'magnetic':
        return {
          x,
          y,
          scale: isHovered ? hoverScale : 1,
        };

      case 'proximity':
        return {
          scale: isHovered ? hoverScale : 1,
        };

      case 'glow':
        return {
          scale: isHovered ? hoverScale : 1,
          filter: isHovered
            ? `drop-shadow(0 0 ${10 * intensity}px rgba(77, 166, 255, 0.5))`
            : 'drop-shadow(0 0 0px rgba(77, 166, 255, 0))',
        };

      default:
        return {
          scale: isHovered ? hoverScale : 1,
        };
    }
  };

  if (href) {
    return (
      <motion.a
        href={href}
        className={`inline-block cursor-pointer ${className}`}
        style={getVariantStyles()}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={onClick}
        whileHover={{ scale: hoverScale }}
        transition={{
          duration: TIMING.fast,
          ease: EASING.smooth,
        }}
      >
        {children}
      </motion.a>
    );
  }

  return (
    <motion.span
      className={`inline-block cursor-pointer ${className}`}
      style={getVariantStyles()}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      whileHover={{ scale: hoverScale }}
      transition={{
        duration: TIMING.fast,
        ease: EASING.smooth,
      }}
    >
      {children}
    </motion.span>
  );
}

/**
 * MagneticButton - Navigation item with magnetic hover effect.
 */
interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  href?: string;
  intensity?: number;
}

export function MagneticButton({
  children,
  className = '',
  onClick,
  href,
  intensity = 0.4,
}: MagneticButtonProps) {
  const prefersReducedMotion = usePrefersReducedMotion();

  const springConfig = { stiffness: 200, damping: 20 };
  const x = useSpring(0, springConfig);
  const y = useSpring(0, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (prefersReducedMotion) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    x.set((e.clientX - centerX) * intensity);
    y.set((e.clientY - centerY) * intensity);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  if (prefersReducedMotion) {
    if (href) {
      return (
        <a href={href} className={className} onClick={onClick}>
          {children}
        </a>
      );
    }
    return (
      <button className={className} onClick={onClick}>
        {children}
      </button>
    );
  }

  if (href) {
    return (
      <motion.a
        href={href}
        className={className}
        onClick={onClick}
        style={{ x, y }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{
          scale: { duration: TIMING.fast, ease: EASING.snappy },
        }}
      >
        {children}
      </motion.a>
    );
  }

  return (
    <motion.button
      className={className}
      onClick={onClick}
      style={{ x, y }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{
        scale: { duration: TIMING.fast, ease: EASING.snappy },
      }}
    >
      {children}
    </motion.button>
  );
}

/**
 * CharacterHover - Text with character-level hover effects.
 */
interface CharacterHoverProps {
  text: string;
  className?: string;
  hoverColor?: string;
  hoverScale?: number;
}

export function CharacterHover({
  text,
  className = '',
  hoverColor = '#4da6ff',
  hoverScale = 1.2,
}: CharacterHoverProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (prefersReducedMotion) {
    return <span className={className}>{text}</span>;
  }

  const characters = text.split('');

  return (
    <>
      <span className="sr-only">{text}</span>
      <span className={`inline-flex ${className}`} aria-hidden="true">
        {characters.map((char, index) => {
          const isSpace = char === ' ';
          const isHovered = hoveredIndex === index;
          const isNearby =
            hoveredIndex !== null && Math.abs(hoveredIndex - index) <= 2;

          return (
            <motion.span
              key={`${char}-${index}`}
              className="inline-block origin-bottom cursor-default"
              style={{
                willChange: 'transform, color',
              }}
              animate={{
                scale: isHovered ? hoverScale : isNearby ? 1 + (hoverScale - 1) * 0.3 : 1,
                y: isHovered ? -4 : 0,
                color: isHovered ? hoverColor : 'inherit',
              }}
              transition={{
                duration: TIMING.fast,
                ease: EASING.smooth,
              }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {isSpace ? '\u00A0' : char}
            </motion.span>
          );
        })}
      </span>
    </>
  );
}

export default InteractiveText;
