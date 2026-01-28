"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
  disableAnimation?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", disableAnimation = false, ...props }, ref) => {
    const baseClasses = cn(
      "inline-flex items-center justify-center rounded-md font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden group",
      {
        "bg-accent-500 text-white hover:bg-accent-600 hover:shadow-lg": variant === "default",
        "border border-primary-300 bg-transparent hover:bg-primary-100 hover:border-primary-400":
          variant === "outline",
        "hover:bg-primary-100 hover:text-primary-900": variant === "ghost",
      },
      {
        "h-10 px-4 py-2": size === "default",
        "h-9 rounded-md px-3": size === "sm",
        "h-11 rounded-md px-8": size === "lg",
      },
      className
    );

    if (disableAnimation) {
      return (
        <button className={baseClasses} ref={ref} {...props} />
      );
    }

    return (
      <motion.button
        className={baseClasses}
        ref={ref}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 17,
        }}
        {...(props as any)}
      >
        {/* Shimmer effect on hover */}
        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
        {props.children}
      </motion.button>
    );
  }
);
Button.displayName = "Button";

export { Button };
