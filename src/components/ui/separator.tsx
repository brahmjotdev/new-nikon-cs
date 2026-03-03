// ==============================
// Imports
// ==============================

import * as React from "react";
import { cn } from "@/utils";
import { DivElementProps } from "@/types";
import { cva } from "class-variance-authority";

// ==============================
// Props
// ==============================

type SeparatorOrientations = "horizontal" | "vertical";

const separatorOrientations = cva("bg-border", {
  variants: {
    orientation: {
      horizontal: "w-full h-px my-2 mx-1",
      vertical: "w-px mx-2 my-1",
    },
  },
  defaultVariants: {
    orientation: "horizontal",
  },
});
interface SeparatorProps extends DivElementProps {
  orientation?: SeparatorOrientations;
}

// ==============================
// Component
// ==============================

const Separator = React.forwardRef<HTMLDivElement, SeparatorProps>(
  ({ orientation = "horizontal", className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="separator"
        data-orientation={orientation}
        className={cn(separatorOrientations({ orientation }), className)}
        {...props}
      >
        <span className="sr-only">{orientation} separator</span>
      </div>
    );
  },
);

// ==============================
// Exports
// ==============================

Separator.displayName = "Separator";

export { Separator };
export type { SeparatorProps };
