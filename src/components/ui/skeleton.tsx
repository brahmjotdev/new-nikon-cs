// ==============================
// Imports
// ==============================

import * as React from "react";
import { cn } from "@/utils";

import { DivElementProps } from "@/types";

// ==============================
// Props
// ==============================

interface SkeletonProps extends DivElementProps {}

// ==============================
// Component
// ==============================

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="skeleton"
        className={cn("animate-pulse rounded-md bg-muted/50", className)}
        {...props}
      >
        {children}
      </div>
    );
  },
);

// ==============================
// Exports
// ==============================

Skeleton.displayName = "Skeleton";

export { Skeleton };
export type { SkeletonProps };
