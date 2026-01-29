"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  interactive?: boolean;
  glowOnHover?: boolean;
  borderGradient?: boolean;
}

/**
 * Card - An enhanced card component with optional interactive effects.
 *
 * Features:
 * - Hover lift effect
 * - Optional glow effect
 * - Border gradient animation
 * - Smooth transitions
 * - Respects prefers-reduced-motion
 */
const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, interactive = false, glowOnHover = false, borderGradient = false, children, ...props }, ref) => {
    const prefersReducedMotion = usePrefersReducedMotion();
    const [isHovered, setIsHovered] = React.useState(false);

    const baseClasses = cn(
      "rounded-lg border border-white/10 bg-[#0a0a0a] shadow-sm transition-all duration-300",
      interactive && "cursor-pointer",
      className
    );

    // Non-interactive version
    if (!interactive || prefersReducedMotion) {
      return (
        <div ref={ref} className={baseClasses} {...props}>
          {borderGradient && (
            <div className="absolute -inset-[1px] rounded-lg bg-gradient-to-r from-gold/20 via-transparent to-gold/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          )}
          {children}
        </div>
      );
    }

    return (
      <motion.div
        ref={ref}
        className={cn(baseClasses, "relative group")}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        whileHover={{ y: -4, scale: 1.01 }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 20,
        }}
        {...(props as React.ComponentProps<typeof motion.div>)}
      >
        {/* Animated border gradient */}
        {borderGradient && (
          <motion.div
            className="absolute -inset-[1px] rounded-lg pointer-events-none"
            style={{
              background: "conic-gradient(from 0deg at 50% 50%, rgba(212, 175, 55, 0.3), transparent 60%, rgba(212, 175, 55, 0.3))",
            }}
            animate={{
              rotate: isHovered ? 360 : 0,
              opacity: isHovered ? 1 : 0,
            }}
            transition={{
              rotate: { duration: 8, repeat: Infinity, ease: "linear" },
              opacity: { duration: 0.3 },
            }}
          />
        )}

        {/* Glow effect */}
        {glowOnHover && (
          <motion.div
            className="absolute -inset-2 rounded-xl bg-gold/10 blur-xl pointer-events-none"
            animate={{
              opacity: isHovered ? 1 : 0,
            }}
            transition={{ duration: 0.3 }}
          />
        )}

        {/* Content wrapper */}
        <div className="relative z-10 bg-[#0a0a0a] rounded-lg">
          {children}
        </div>

        {/* Hover shadow */}
        <motion.div
          className="absolute inset-0 rounded-lg pointer-events-none"
          animate={{
            boxShadow: isHovered
              ? "0 20px 40px rgba(0, 0, 0, 0.3), 0 8px 16px rgba(212, 175, 55, 0.05)"
              : "0 4px 12px rgba(0, 0, 0, 0.1)",
          }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>
    );
  }
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight text-white",
      className
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-white/60", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

/**
 * HoverCard - A card with reveal content on hover.
 */
interface HoverCardProps extends CardProps {
  revealContent?: React.ReactNode;
}

const HoverCard = React.forwardRef<HTMLDivElement, HoverCardProps>(
  ({ className, children, revealContent, ...props }, ref) => {
    const prefersReducedMotion = usePrefersReducedMotion();
    const [isHovered, setIsHovered] = React.useState(false);

    return (
      <motion.div
        ref={ref}
        className={cn(
          "rounded-lg border border-white/10 bg-[#0a0a0a] shadow-sm transition-all duration-300 cursor-pointer relative overflow-hidden group",
          className
        )}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        whileHover={prefersReducedMotion ? undefined : { y: -4, scale: 1.01 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        {...(props as React.ComponentProps<typeof motion.div>)}
      >
        {/* Main content */}
        <motion.div
          animate={{
            opacity: isHovered ? 0.3 : 1,
            scale: isHovered ? 0.95 : 1,
          }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>

        {/* Reveal content on hover */}
        {revealContent && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center p-6 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/95 to-transparent"
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: isHovered ? 1 : 0,
              y: isHovered ? 0 : 20,
            }}
            transition={{ duration: 0.3 }}
          >
            {revealContent}
          </motion.div>
        )}
      </motion.div>
    );
  }
);
HoverCard.displayName = "HoverCard";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent, HoverCard };
