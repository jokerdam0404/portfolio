import { Variants, Transition } from 'framer-motion';

/**
 * Kinetic Typography Animation Constants
 *
 * A centralized configuration for all text animation parameters.
 * Edit these values to adjust animation behavior globally.
 */

// =============================================================================
// TIMING CONSTANTS
// =============================================================================

export const TIMING = {
  /** Fast micro-interactions */
  fast: 0.15,
  /** Standard animations */
  normal: 0.3,
  /** Deliberate, noticeable animations */
  slow: 0.6,
  /** Hero-level entrance animations */
  heroEntrance: 1.0,
  /** Stagger delay between letters */
  letterStagger: 0.03,
  /** Stagger delay between words */
  wordStagger: 0.08,
  /** Stagger delay between lines */
  lineStagger: 0.12,
} as const;

// =============================================================================
// EASING CURVES
// =============================================================================

export const EASING = {
  /** Smooth ease-out for entrances */
  smooth: [0.43, 0.13, 0.23, 0.96] as const,
  /** Snappy for quick interactions */
  snappy: [0.87, 0, 0.13, 1] as const,
  /** Slight bounce at the end */
  bounce: [0.68, -0.55, 0.265, 1.55] as const,
  /** Elegant deceleration */
  elegant: [0.33, 1, 0.68, 1] as const,
  /** Expo-style dramatic ease */
  expo: [0.19, 1, 0.22, 1] as const,
  /** Natural spring-like motion */
  spring: [0.175, 0.885, 0.32, 1.275] as const,
} as const;

// =============================================================================
// SPRING CONFIGURATIONS
// =============================================================================

export const SPRING = {
  /** Gentle spring for subtle movements */
  gentle: { type: 'spring', stiffness: 100, damping: 15, mass: 1 } as const,
  /** Standard spring for most animations */
  normal: { type: 'spring', stiffness: 200, damping: 20, mass: 1 } as const,
  /** Bouncy spring for playful effects */
  bouncy: { type: 'spring', stiffness: 400, damping: 10, mass: 1 } as const,
  /** Stiff spring for snappy responses */
  stiff: { type: 'spring', stiffness: 500, damping: 30, mass: 0.5 } as const,
} as const;

// =============================================================================
// TEXT ANIMATION VARIANTS
// =============================================================================

/** Letter-by-letter reveal from bottom */
export const letterRevealUp: Variants = {
  hidden: {
    y: '100%',
    opacity: 0,
  },
  visible: (i: number) => ({
    y: 0,
    opacity: 1,
    transition: {
      duration: TIMING.normal,
      ease: EASING.smooth,
      delay: i * TIMING.letterStagger,
    },
  }),
};

/** Letter-by-letter reveal with scale */
export const letterRevealScale: Variants = {
  hidden: {
    scale: 0,
    opacity: 0,
  },
  visible: (i: number) => ({
    scale: 1,
    opacity: 1,
    transition: {
      duration: TIMING.normal,
      ease: EASING.bounce,
      delay: i * TIMING.letterStagger,
    },
  }),
};

/** Word-by-word slide from left */
export const wordSlideLeft: Variants = {
  hidden: {
    x: -40,
    opacity: 0,
  },
  visible: (i: number) => ({
    x: 0,
    opacity: 1,
    transition: {
      duration: TIMING.slow,
      ease: EASING.smooth,
      delay: i * TIMING.wordStagger,
    },
  }),
};

/** Word-by-word slide from right */
export const wordSlideRight: Variants = {
  hidden: {
    x: 40,
    opacity: 0,
  },
  visible: (i: number) => ({
    x: 0,
    opacity: 1,
    transition: {
      duration: TIMING.slow,
      ease: EASING.smooth,
      delay: i * TIMING.wordStagger,
    },
  }),
};

/** Fade up with rotation */
export const fadeUpRotate: Variants = {
  hidden: {
    y: 30,
    opacity: 0,
    rotateX: -15,
  },
  visible: {
    y: 0,
    opacity: 1,
    rotateX: 0,
    transition: {
      duration: TIMING.slow,
      ease: EASING.elegant,
    },
  },
};

/** Glitch effect for cyberpunk/space themes */
export const glitchVariants: Variants = {
  initial: {
    x: 0,
    opacity: 1,
  },
  glitch: {
    x: [0, -3, 3, -2, 2, 0],
    opacity: [1, 0.8, 1, 0.9, 1],
    filter: [
      'hue-rotate(0deg)',
      'hue-rotate(90deg)',
      'hue-rotate(-90deg)',
      'hue-rotate(45deg)',
      'hue-rotate(0deg)',
    ],
    transition: {
      duration: 0.3,
      ease: 'easeInOut',
    },
  },
};

/** Breathing/pulsing effect */
export const breathingVariants: Variants = {
  initial: {
    scale: 1,
    opacity: 1,
  },
  breathing: {
    scale: [1, 1.02, 1],
    opacity: [1, 0.95, 1],
    transition: {
      duration: 3,
      ease: 'easeInOut',
      repeat: Infinity,
      repeatType: 'loop',
    },
  },
};

// =============================================================================
// SCROLL-TRIGGERED VARIANTS
// =============================================================================

export const scrollRevealUp: Variants = {
  hidden: {
    y: 60,
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: TIMING.slow,
      ease: EASING.smooth,
    },
  },
};

export const scrollRevealScale: Variants = {
  hidden: {
    scale: 0.9,
    opacity: 0,
  },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: TIMING.slow,
      ease: EASING.smooth,
    },
  },
};

export const scrollRevealRotate: Variants = {
  hidden: {
    rotateY: -15,
    opacity: 0,
    transformPerspective: 1000,
  },
  visible: {
    rotateY: 0,
    opacity: 1,
    transition: {
      duration: TIMING.slow,
      ease: EASING.elegant,
    },
  },
};

// =============================================================================
// CONTAINER VARIANTS FOR STAGGERED CHILDREN
// =============================================================================

export const staggerContainerLetters: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: TIMING.letterStagger,
      delayChildren: 0.1,
    },
  },
};

export const staggerContainerWords: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: TIMING.wordStagger,
      delayChildren: 0.15,
    },
  },
};

export const staggerContainerLines: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: TIMING.lineStagger,
      delayChildren: 0.2,
    },
  },
};

// =============================================================================
// HOVER EFFECTS
// =============================================================================

export const hoverLift = {
  rest: { y: 0, scale: 1 },
  hover: {
    y: -4,
    scale: 1.02,
    transition: {
      duration: TIMING.fast,
      ease: EASING.smooth,
    },
  },
};

export const hoverGlow = {
  rest: {
    textShadow: '0 0 0px rgba(77, 166, 255, 0)',
  },
  hover: {
    textShadow: '0 0 20px rgba(77, 166, 255, 0.5)',
    transition: {
      duration: TIMING.normal,
      ease: 'easeOut',
    },
  },
};

export const hoverMagnetic = {
  rest: { x: 0, y: 0 },
  hover: {
    transition: {
      duration: TIMING.fast,
      ease: EASING.snappy,
    },
  },
};

// =============================================================================
// PERFORMANCE UTILITIES
// =============================================================================

/** Default transition for GPU-accelerated properties */
export const gpuTransition: Transition = {
  type: 'tween',
  duration: TIMING.normal,
  ease: EASING.smooth,
};

/** Properties that are GPU-accelerated and performant */
export const GPU_ACCELERATED_PROPS = ['transform', 'opacity', 'filter'] as const;

/** Will-change hint for performance */
export const WILL_CHANGE_TRANSFORM = { willChange: 'transform' } as const;
export const WILL_CHANGE_OPACITY = { willChange: 'opacity' } as const;
