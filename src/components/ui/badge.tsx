// ==============================
// Imports
// ==============================

import * as React from "react";
import { cn } from "@/utils";
import { cva } from "class-variance-authority";

import { DivElementProps } from "@/types";

// ==============================
// Variants
// ==============================

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-sm px-2 py-1 text-xs",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground",
        secondary: "bg-secondary text-secondary-foreground",
        info: "bg-info text-info-foreground",
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  },
);

// ==============================
// Props
// ==============================

type BadgeVariants = "primary" | "secondary" | "info";

interface BadgeProps extends DivElementProps {
  variant?: BadgeVariants;
  label: string;
}

// ==============================
// Component
// ==============================

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ variant = "primary", label, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="badge"
        data-variant={variant}
        className={cn(badgeVariants({ variant }), className)}
        {...props}
      >
        {label}
      </div>
    );
  },
);

// ==============================
// Exports
// ==============================

Badge.displayName = "Badge";

export { Badge };
export type { BadgeProps };
