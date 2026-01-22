import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "success" | "outline";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        {
          "bg-accent-500 text-white": variant === "default",
          "bg-primary-200 text-primary-900": variant === "secondary",
          "bg-success-500 text-white": variant === "success",
          "border border-primary-300 text-primary-700": variant === "outline",
        },
        className
      )}
      {...props}
    />
  );
}

export { Badge };
