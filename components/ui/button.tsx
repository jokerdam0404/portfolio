"use client";

import * as React from "react";
import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "gold";
  size?: "default" | "sm" | "lg";
  disableAnimation?: boolean;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

interface RippleEffect {
  id: number;
  x: number;
  y: number;
}

/**
 * Button - An enhanced button component with interactive effects.
 *
 * Features:
 * - Click ripple effect
 * - Magnetic hover (via data-magnetic attribute)
 * - Icon animations on hover
 * - Loading state with spinner
 * - Multiple variants
 * - Respects prefers-reduced-motion
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "default",
      size = "default",
      disableAnimation = false,
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      onClick,
      ...props
    },
    ref
  ) => {
    const prefersReducedMotion = usePrefersReducedMotion();
    const buttonRef = useRef<HTMLButtonElement>(null);
    const [ripples, setRipples] = useState<RippleEffect[]>([]);
    const rippleIdRef = useRef(0);

    // Handle ripple effect on click
    const handleClick = useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!prefersReducedMotion && !disableAnimation) {
          const button = buttonRef.current;
          if (button) {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const newRipple: RippleEffect = {
              id: rippleIdRef.current++,
              x,
              y,
            };

            setRipples((prev) => [...prev, newRipple]);

            // Remove ripple after animation
            setTimeout(() => {
              setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
            }, 600);
          }
        }

        onClick?.(e);
      },
      [onClick, prefersReducedMotion, disableAnimation]
    );

    const baseClasses = cn(
      "inline-flex items-center justify-center rounded-md font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505] disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden group",
      {
        // Variant styles
        "bg-accent-500 text-white hover:bg-accent-600 hover:shadow-lg shadow-accent-500/20":
          variant === "default",
        "border border-white/20 bg-transparent hover:bg-white/5 hover:border-white/40 text-white":
          variant === "outline",
        "hover:bg-white/10 text-white/80 hover:text-white": variant === "ghost",
        "bg-gold text-[#050505] hover:bg-[#E5C04B] shadow-[0_0_15px_rgba(212,175,55,0.2)] hover:shadow-[0_0_25px_rgba(212,175,55,0.4)]":
          variant === "gold",
      },
      {
        // Size styles
        "h-10 px-4 py-2": size === "default",
        "h-9 rounded-md px-3 text-sm": size === "sm",
        "h-12 rounded-lg px-8 text-base": size === "lg",
      },
      className
    );

    // Simple button for reduced motion or disabled animation
    if (disableAnimation || prefersReducedMotion) {
      return (
        <button
          className={baseClasses}
          ref={ref}
          onClick={onClick}
          disabled={isLoading || props.disabled}
          {...props}
        >
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <>
              {leftIcon && <span className="mr-2">{leftIcon}</span>}
              {children}
              {rightIcon && <span className="ml-2">{rightIcon}</span>}
            </>
          )}
        </button>
      );
    }

    return (
      <motion.button
        className={baseClasses}
        ref={(el) => {
          // Handle both refs
          (buttonRef as React.MutableRefObject<HTMLButtonElement | null>).current = el;
          if (typeof ref === "function") {
            ref(el);
          } else if (ref) {
            ref.current = el;
          }
        }}
        onClick={handleClick}
        disabled={isLoading || props.disabled}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 17,
        }}
        data-magnetic
        {...(props as React.ComponentProps<typeof motion.button>)}
      >
        {/* Shimmer effect on hover */}
        <motion.span
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
          initial={{ x: "-100%" }}
          whileHover={{ x: "100%" }}
          transition={{ duration: 0.6 }}
        />

        {/* Ripple effects */}
        <AnimatePresence>
          {ripples.map((ripple) => (
            <motion.span
              key={ripple.id}
              className="absolute rounded-full bg-white/30 pointer-events-none"
              style={{
                left: ripple.x,
                top: ripple.y,
              }}
              initial={{ width: 0, height: 0, x: 0, y: 0, opacity: 0.5 }}
              animate={{ width: 200, height: 200, x: -100, y: -100, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          ))}
        </AnimatePresence>

        {/* Button content */}
        <span className="relative z-10 flex items-center justify-center gap-2">
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <>
              {/* Left icon with hover animation */}
              {leftIcon && (
                <motion.span
                  className="flex items-center"
                  whileHover={{ x: -2 }}
                  transition={{ duration: 0.2 }}
                >
                  {leftIcon}
                </motion.span>
              )}

              {children}

              {/* Right icon with hover animation */}
              {rightIcon && (
                <motion.span
                  className="flex items-center"
                  initial={{ x: 0 }}
                  whileHover={{ x: 3 }}
                  transition={{ duration: 0.2 }}
                >
                  {rightIcon}
                </motion.span>
              )}
            </>
          )}
        </span>

        {/* Glow effect for gold variant */}
        {variant === "gold" && (
          <motion.span
            className="absolute inset-0 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              background:
                "radial-gradient(circle at center, rgba(212, 175, 55, 0.2) 0%, transparent 70%)",
            }}
          />
        )}
      </motion.button>
    );
  }
);

Button.displayName = "Button";

/**
 * LoadingSpinner - Animated loading indicator for buttons.
 */
function LoadingSpinner() {
  return (
    <motion.span
      className="flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.svg
        className="w-5 h-5"
        viewBox="0 0 24 24"
        fill="none"
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="3"
        />
        <motion.path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </motion.svg>
      <span className="ml-2">Loading...</span>
    </motion.span>
  );
}

/**
 * IconButton - A circular icon-only button with enhanced hover effects.
 */
export const IconButton = React.forwardRef<
  HTMLButtonElement,
  Omit<ButtonProps, "leftIcon" | "rightIcon"> & { icon: React.ReactNode }
>(({ className, icon, variant = "ghost", size = "default", ...props }, ref) => {
  const prefersReducedMotion = usePrefersReducedMotion();

  const sizeClasses = {
    default: "w-10 h-10",
    sm: "w-8 h-8",
    lg: "w-12 h-12",
  };

  if (prefersReducedMotion) {
    return (
      <button
        ref={ref}
        className={cn(
          "rounded-full flex items-center justify-center transition-colors",
          "hover:bg-white/10 text-white/80 hover:text-white",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50",
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {icon}
      </button>
    );
  }

  return (
    <motion.button
      ref={ref}
      className={cn(
        "rounded-full flex items-center justify-center transition-colors overflow-hidden",
        "hover:bg-white/10 text-white/80 hover:text-white",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50",
        sizeClasses[size],
        className
      )}
      whileHover={{ scale: 1.1, rotate: 5 }}
      whileTap={{ scale: 0.9 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      data-magnetic
      {...(props as React.ComponentProps<typeof motion.button>)}
    >
      <motion.span
        className="flex items-center justify-center"
        whileHover={{ rotate: -5 }}
        transition={{ duration: 0.2 }}
      >
        {icon}
      </motion.span>
    </motion.button>
  );
});

IconButton.displayName = "IconButton";

export { Button };
