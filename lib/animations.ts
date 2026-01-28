import { Variants } from "framer-motion";

// Premium Easing Functions
export const premiumEasing = {
  smooth: [0.43, 0.13, 0.23, 0.96],
  snappy: [0.87, 0, 0.13, 1],
  bounce: [0.68, -0.55, 0.265, 1.55],
  elegant: [0.33, 1, 0.68, 1],
};

// Framer Motion Variants

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: premiumEasing.smooth },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: premiumEasing.smooth },
  },
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: premiumEasing.smooth },
  },
};

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: premiumEasing.smooth },
  },
};

export const slideInDown: Variants = {
  hidden: { opacity: 0, y: -30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: premiumEasing.elegant },
  },
};

export const scaleRotateIn: Variants = {
  hidden: { opacity: 0, scale: 0.8, rotate: -5 },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: { duration: 0.5, ease: premiumEasing.bounce },
  },
};

// Card hover effect
export const cardHover = {
  rest: { scale: 1, y: 0 },
  hover: {
    scale: 1.01,
    y: -4,
    transition: {
      duration: 0.3,
      ease: premiumEasing.smooth,
    },
  },
};

// Button hover effect
export const buttonHover = {
  rest: { scale: 1 },
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.2,
      ease: premiumEasing.snappy,
    },
  },
  tap: {
    scale: 0.95,
  },
};

// Magnetic button effect
export const magneticHover = {
  rest: { x: 0, y: 0 },
  hover: {
    transition: {
      duration: 0.3,
      ease: premiumEasing.smooth,
    },
  },
};

// Float animation
export const floatAnimation: Variants = {
  initial: { y: 0 },
  animate: {
    y: [-10, 10, -10],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

// Pulse glow animation
export const pulseGlow: Variants = {
  initial: { opacity: 0.5 },
  animate: {
    opacity: [0.5, 1, 0.5],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

// Stagger with custom delays
export const staggerFast: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0,
    },
  },
};

export const staggerSlow: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

// Text reveal animation
export const textReveal: Variants = {
  hidden: { opacity: 0, y: 20, rotateX: -90 },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: {
      duration: 0.5,
      ease: premiumEasing.elegant,
    },
  },
};

// GSAP Animation Configs
export const gsapConfig = {
  duration: 1,
  ease: "power3.out",
  scrollTrigger: {
    start: "top 80%",
    end: "bottom 20%",
    toggleActions: "play none none reverse",
  },
};

// 3D Animation Variants
// These variants are optimized for use with Three.js/Spline elements

// 3D float with depth
export const float3D: Variants = {
  initial: { y: 0, z: 0 },
  animate: {
    y: [-15, 15, -15],
    z: [-5, 5, -5],
    transition: {
      duration: 8,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

// 3D rotation with subtle movement
export const rotate3D: Variants = {
  initial: { rotateX: 0, rotateY: 0, rotateZ: 0 },
  animate: {
    rotateX: [0, 5, 0],
    rotateY: [0, 10, 0],
    rotateZ: [0, 2, 0],
    transition: {
      duration: 10,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

// Scale with depth entrance
export const scaleIn3D: Variants = {
  hidden: { opacity: 0, scale: 0.8, z: -100 },
  visible: {
    opacity: 1,
    scale: 1,
    z: 0,
    transition: {
      duration: 0.8,
      ease: premiumEasing.smooth,
    },
  },
};

// Parallax scroll effect for 3D elements
export const parallax3D: Variants = {
  hidden: { y: 50, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: premiumEasing.elegant,
    },
  },
};

// Hover effect for 3D interactive elements
export const hover3D = {
  rest: {
    scale: 1,
    rotateX: 0,
    rotateY: 0,
    transition: {
      duration: 0.4,
      ease: premiumEasing.smooth,
    },
  },
  hover: {
    scale: 1.05,
    rotateX: -5,
    rotateY: 5,
    transition: {
      duration: 0.4,
      ease: premiumEasing.smooth,
    },
  },
};

// Stagger for 3D element groups
export const stagger3D: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.2,
    },
  },
};

// Individual 3D stagger child
export const stagger3DChild: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: premiumEasing.smooth,
    },
  },
};

// Ambient float for background 3D elements
export const ambientFloat: Variants = {
  initial: {
    y: 0,
    x: 0,
    rotate: 0,
  },
  animate: {
    y: [-8, 8, -8],
    x: [-3, 3, -3],
    rotate: [-2, 2, -2],
    transition: {
      duration: 12,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

// Glow pulse for 3D accents
export const glowPulse3D: Variants = {
  initial: {
    opacity: 0.4,
    filter: "blur(0px)",
  },
  animate: {
    opacity: [0.4, 0.8, 0.4],
    filter: ["blur(0px)", "blur(2px)", "blur(0px)"],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

// Scroll-linked transform config
export const scrollTransform3DConfig = {
  start: "top bottom",
  end: "bottom top",
  scrub: 1.5,
};

// Premium 3D easing functions
export const easing3D = {
  smooth: [0.43, 0.13, 0.23, 0.96],
  bounce: [0.68, -0.55, 0.265, 1.55],
  elastic: [0.175, 0.885, 0.32, 1.275],
  expo: [0.19, 1, 0.22, 1],
};
