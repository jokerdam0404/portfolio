"use client";

import { useRef, useState, ReactNode, useCallback } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  /** Maximum tilt angle in degrees (default: 10) */
  maxTilt?: number;
  /** Perspective value in pixels (default: 1000) */
  perspective?: number;
  /** Scale on hover (default: 1.02) */
  scale?: number;
  /** Transition speed in ms (default: 150) */
  speed?: number;
  /** Enable/disable glare effect (default: true) */
  glare?: boolean;
  /** Maximum glare opacity (default: 0.15) */
  glareOpacity?: number;
  /** Enable border gradient animation (default: false) */
  borderGradient?: boolean;
  /** Enable shadow depth effect (default: true) */
  shadowEffect?: boolean;
  /** Enable image zoom on hover */
  imageZoom?: boolean;
}

/**
 * TiltCard - A 3D perspective tilt effect on hover.
 * Creates a premium, modern interaction for cards.
 *
 * Features:
 * - Smooth 3D rotation following mouse position
 * - Optional glare/shine effect
 * - Animated border gradient
 * - Dynamic shadow depth
 * - Image zoom capability
 * - Respects prefers-reduced-motion
 * - Keyboard accessible (no tilt on focus, but still interactive)
 */
export function TiltCard({
  children,
  className = "",
  maxTilt = 10,
  perspective = 1000,
  scale = 1.02,
  speed = 150,
  glare = true,
  glareOpacity = 0.15,
  borderGradient = false,
  shadowEffect = true,
  imageZoom = false,
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  // Motion values for smooth animations - always call hooks unconditionally
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  // Spring configurations for smooth motion
  const springConfig = { stiffness: 150, damping: 20, mass: 0.5 };

  // Transform mouse position to rotation values
  const rotateXBase = useTransform(mouseY, [0, 1], [maxTilt, -maxTilt]);
  const rotateYBase = useTransform(mouseX, [0, 1], [-maxTilt, maxTilt]);
  const rotateX = useSpring(rotateXBase, springConfig);
  const rotateY = useSpring(rotateYBase, springConfig);

  // Glare position
  const glareXBase = useTransform(mouseX, [0, 1], [0, 100]);
  const glareYBase = useTransform(mouseY, [0, 1], [0, 100]);
  const glareX = useSpring(glareXBase, springConfig);
  const glareY = useSpring(glareYBase, springConfig);

  // Shadow depth based on tilt
  const shadowXBase = useTransform(mouseX, [0, 1], [10, -10]);
  const shadowYBase = useTransform(mouseY, [0, 1], [-10, 10]);
  const shadowX = useSpring(shadowXBase, springConfig);
  const shadowY = useSpring(shadowYBase, springConfig);

  // Border gradient angle
  const borderAngleBase = useTransform(mouseX, [0, 1], [0, 360]);
  const borderAngle = useSpring(borderAngleBase, springConfig);

  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (prefersReducedMotion || !cardRef.current) return;

      const rect = cardRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;

      mouseX.set(x);
      mouseY.set(y);
    },
    [prefersReducedMotion, mouseX, mouseY]
  );

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    // Reset to center
    mouseX.set(0.5);
    mouseY.set(0.5);
  }, [mouseX, mouseY]);

  // If reduced motion, return a simple hover effect
  if (prefersReducedMotion) {
    return (
      <motion.div
        className={className}
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={cardRef}
      className={`relative ${className}`}
      style={{
        perspective,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      data-cursor-expand
    >
      {/* Animated border gradient (optional) */}
      {borderGradient && (
        <motion.div
          className="absolute -inset-[1px] rounded-lg pointer-events-none overflow-hidden"
          style={{
            opacity: isHovered ? 1 : 0,
          }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="absolute inset-0"
            style={{
              background: `conic-gradient(from ${borderAngle.get()}deg at 50% 50%, rgba(212, 175, 55, 0.3), transparent 60%, rgba(212, 175, 55, 0.3))`,
            }}
          />
        </motion.div>
      )}

      {/* Main card with 3D transform */}
      <motion.div
        className="relative w-full h-full"
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        animate={{
          scale: isHovered ? scale : 1,
        }}
        transition={{
          scale: { duration: speed / 1000, ease: "easeOut" },
        }}
      >
        {/* Dynamic shadow effect */}
        {shadowEffect && (
          <motion.div
            className="absolute inset-0 rounded-lg pointer-events-none"
            style={{
              boxShadow: isHovered
                ? `${shadowX.get()}px ${shadowY.get()}px 30px rgba(0, 0, 0, 0.3), 0 10px 40px rgba(0, 0, 0, 0.2)`
                : "0 4px 12px rgba(0, 0, 0, 0.1)",
            }}
          />
        )}

        {/* Content wrapper with potential image zoom */}
        <div
          className={`relative w-full h-full ${imageZoom ? "overflow-hidden" : ""}`}
          style={{
            transform: "translateZ(0)",
          }}
        >
          {/* Image zoom effect container */}
          {imageZoom ? (
            <motion.div
              className="w-full h-full"
              animate={{
                scale: isHovered ? 1.05 : 1,
              }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              {children}
            </motion.div>
          ) : (
            children
          )}
        </div>

        {/* Glare overlay */}
        {glare && (
          <motion.div
            className="absolute inset-0 pointer-events-none rounded-lg overflow-hidden"
            style={{
              opacity: isHovered ? 1 : 0,
            }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <div
              className="absolute inset-0"
              style={{
                background: `radial-gradient(circle at ${glareX.get()}% ${glareY.get()}%, rgba(255, 255, 255, ${glareOpacity}) 0%, transparent 50%)`,
                mixBlendMode: "overlay",
              }}
            />
          </motion.div>
        )}

        {/* Highlight edge effect */}
        <motion.div
          className="absolute inset-0 rounded-lg pointer-events-none"
          style={{
            boxShadow: isHovered
              ? `inset ${(mouseX.get() - 0.5) * 10}px ${(mouseY.get() - 0.5) * 10}px 20px rgba(255, 255, 255, 0.03)`
              : "none",
          }}
        />
      </motion.div>

      {/* Floating reflection (bottom) */}
      <motion.div
        className="absolute -bottom-4 left-4 right-4 h-8 rounded-xl pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, rgba(212, 175, 55, 0.1), transparent)",
          filter: "blur(8px)",
          opacity: isHovered ? 0.5 : 0,
        }}
        animate={{ opacity: isHovered ? 0.5 : 0 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
}

/**
 * TiltCardContent - Wrapper for content that should appear elevated.
 * Use translateZ for 3D depth effect.
 */
export function TiltCardContent({
  children,
  className = "",
  depth = 20,
}: {
  children: ReactNode;
  className?: string;
  depth?: number;
}) {
  return (
    <div
      className={className}
      style={{
        transform: `translateZ(${depth}px)`,
        transformStyle: "preserve-3d",
      }}
    >
      {children}
    </div>
  );
}

export default TiltCard;
