// ==============================
// Imports
// ==============================

import * as React from "react";
import { cn } from "@/utils";
import { LabelElementProps } from "@/types";

// ==============================
// Props
// ==============================

interface LabelProps extends LabelElementProps {}

// ==============================
// Component
// ==============================

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ htmlFor, className, children, ...props }, ref) => {
    return (
      <label
        ref={ref}
        htmlFor={htmlFor}
        data-slot="label"
        className={cn(
          "w-full cursor-pointer text-sm font-medium select-none",
          className,
        )}
        {...props}
      >
        {children}
      </label>
    );
  },
);

// ==============================
// Exports
// ==============================

Label.displayName = "Label";

export { Label };
export type { LabelProps };