"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "success" | "outline" | "gold";
  interactive?: boolean;
  glowOnHover?: boolean;
}

/**
 * Badge - An enhanced badge component with optional hover effects.
 *
 * Features:
 * - Multiple variants
 * - Scale animation on hover
 * - Optional glow effect
 * - Smooth transitions
 * - Respects prefers-reduced-motion
 */
function Badge({
  className,
  variant = "default",
  interactive = true,
  glowOnHover = false,
  children,
  ...props
}: BadgeProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [isHovered, setIsHovered] = React.useState(false);

  const baseClasses = cn(
    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 relative overflow-hidden",
    {
      // Variants
      "bg-accent-500 text-white": variant === "default",
      "bg-white/5 text-white/70 border border-white/10": variant === "secondary",
      "bg-green-500/20 text-green-300 border border-green-500/30": variant === "success",
      "border border-white/20 text-white/80 bg-transparent": variant === "outline",
      "bg-gold/20 text-gold border border-gold/30": variant === "gold",
    },
    // Hover states
    interactive && {
      "hover:scale-105 cursor-default": true,
      "hover:bg-accent-600": variant === "default",
      "hover:bg-white/10 hover:border-white/20 hover:text-white": variant === "secondary",
      "hover:bg-green-500/30": variant === "success",
      "hover:border-gold/50 hover:text-gold": variant === "outline",
      "hover:bg-gold/30 hover:shadow-[0_0_10px_rgba(212,175,55,0.3)]": variant === "gold",
    },
    className
  );

  // Non-interactive or reduced motion version
  if (!interactive || prefersReducedMotion) {
    return (
      <div className={baseClasses} {...props}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      className={baseClasses}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: 1.05, y: -1 }}
      whileTap={{ scale: 0.98 }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 17,
      }}
      {...(props as React.ComponentProps<typeof motion.div>)}
    >
      {/* Shimmer effect on hover */}
      <motion.span
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        initial={{ x: "-100%", opacity: 0 }}
        animate={{
          x: isHovered ? "100%" : "-100%",
          opacity: isHovered ? 1 : 0,
        }}
        transition={{ duration: 0.5 }}
      />

      {/* Glow effect */}
      {glowOnHover && (
        <motion.span
          className="absolute inset-0 rounded-full"
          animate={{
            boxShadow: isHovered
              ? variant === "gold"
                ? "0 0 15px rgba(212, 175, 55, 0.4)"
                : variant === "success"
                ? "0 0 15px rgba(34, 197, 94, 0.4)"
                : "0 0 15px rgba(59, 130, 246, 0.4)"
              : "0 0 0px transparent",
          }}
          transition={{ duration: 0.2 }}
        />
      )}

      {/* Content */}
      <span className="relative z-10">{children}</span>
    </motion.div>
  );
}

/**
 * AnimatedBadgeGroup - Wrapper for staggered badge animations.
 */
function AnimatedBadgeGroup({
  children,
  className,
  staggerDelay = 0.05,
}: {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
}) {
  return (
    <motion.div
      className={cn("flex flex-wrap gap-2", className)}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
    >
      {React.Children.map(children, (child) => (
        <motion.div
          variants={{
            hidden: { opacity: 0, scale: 0.8, y: 10 },
            visible: { opacity: 1, scale: 1, y: 0 },
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 20,
          }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}

/**
 * PulseBadge - Badge with pulsing animation for emphasis.
 */
function PulseBadge({
  children,
  className,
  variant = "gold",
  ...props
}: BadgeProps) {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <div className="relative inline-flex">
      {/* Pulse rings */}
      {!prefersReducedMotion && (
        <>
          <motion.span
            className={cn(
              "absolute inset-0 rounded-full",
              variant === "gold" && "bg-gold/30",
              variant === "success" && "bg-green-500/30",
              variant === "default" && "bg-accent-500/30"
            )}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 0, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.span
            className={cn(
              "absolute inset-0 rounded-full",
              variant === "gold" && "bg-gold/20",
              variant === "success" && "bg-green-500/20",
              variant === "default" && "bg-accent-500/20"
            )}
            animate={{
              scale: [1, 2, 1],
              opacity: [0.3, 0, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            }}
          />
        </>
      )}

      <Badge variant={variant} className={cn("relative z-10", className)} {...props}>
        {children}
      </Badge>
    </div>
  );
}

export { Badge, AnimatedBadgeGroup, PulseBadge };
