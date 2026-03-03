// ==============================
// Imports
// ==============================

import * as React from "react";
import { cn } from "@/utils";

import { InputElementProps } from "@/types";

// ==============================
// Props
// ==============================

interface NumberInputProps extends InputElementProps {}

// ==============================
// Component
// ==============================

const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
  ({ name, id, placeholder, className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        data-slot="number-input"
        type="number"
        name={name}
        id={id}
        placeholder={placeholder}
        suppressHydrationWarning
        className={cn(
          "w-full bg-input border flex text-sm items-center rounded-md px-3 py-1.5 h-9",
          className,
        )}
        {...props}
      />
    );
  },
);

// ==============================
// Exports
// ==============================

NumberInput.displayName = "NumberInput";

export { NumberInput };
