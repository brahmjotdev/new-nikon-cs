// ==============================
// Imports
// ==============================

import * as React from "react";
import { cn } from "@/utils";
import { cva } from "class-variance-authority";

import { SVGElementProps } from "@/types";
import { IconLoader2 } from "@tabler/icons-react";

// ==============================
// Variants
// ==============================

const loaderVariants = cva("animate-spin", {
  variants: {
    size: {
      sm: "size-4",
      md: "size-5",
      lg: "size-6",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

// ==============================
// Props
// ==============================

type LoaderSizes = "sm" | "md" | "lg";

interface LoaderProps extends SVGElementProps {
  size?: LoaderSizes;
}

const Loader = React.forwardRef<SVGSVGElement, LoaderProps>(
  ({ size = "md", className, ...props }, ref) => {
    return (
      <IconLoader2
        ref={ref}
        data-slot="loader"
        data-size={size}
        className={cn(loaderVariants({ size }), className)}
        {...props}
      />
    );
  },
);

// ==============================
// Exports
// ==============================

Loader.displayName = "Loader";

export { Loader };
export type { LoaderProps };
