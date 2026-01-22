"use client";

import { useRef, useState, ReactNode, CSSProperties } from "react";
import { motion } from "framer-motion";
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
}

/**
 * TiltCard - A 3D perspective tilt effect on hover.
 * Creates a premium, modern interaction for cards.
 *
 * Features:
 * - Smooth 3D rotation following mouse position
 * - Optional glare/shine effect
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
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  const [tiltStyle, setTiltStyle] = useState<CSSProperties>({
    transform: "perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)",
  });

  const [glareStyle, setGlareStyle] = useState<CSSProperties>({
    background: "transparent",
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion || !cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();

    // Calculate mouse position relative to card center (0 to 1, centered at 0.5)
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    // Convert to rotation angles (-maxTilt to +maxTilt)
    const rotateY = (x - 0.5) * maxTilt * 2;
    const rotateX = (0.5 - y) * maxTilt * 2;

    setTiltStyle({
      transform: `perspective(${perspective}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`,
      transition: `transform ${speed}ms ease-out`,
    });

    // Update glare position
    if (glare) {
      const glareX = x * 100;
      const glareY = y * 100;
      setGlareStyle({
        background: `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,${glareOpacity}) 0%, transparent 60%)`,
      });
    }
  };

  const handleMouseLeave = () => {
    setTiltStyle({
      transform: `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale(1)`,
      transition: `transform ${speed * 2}ms ease-out`,
    });

    if (glare) {
      setGlareStyle({
        background: "transparent",
        transition: `background ${speed * 2}ms ease-out`,
      });
    }
  };

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
    <div
      ref={cardRef}
      className={`relative ${className}`}
      style={{
        ...tiltStyle,
        transformStyle: "preserve-3d",
        willChange: "transform",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}

      {/* Glare overlay */}
      {glare && (
        <div
          className="absolute inset-0 pointer-events-none rounded-lg"
          style={{
            ...glareStyle,
            mixBlendMode: "overlay",
          }}
        />
      )}
    </div>
  );
}

export default TiltCard;
