// ==============================
// Imports
// ==============================

import * as React from "react";
import { cn } from "@/utils";

import { InputElementProps } from "@/types";

// ==============================
// Variants
// ==============================

interface TextInputProps extends InputElementProps {}

const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  ({ name, id, placeholder, className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        data-slot="text-input"
        type="text"
        name={name}
        id={id}
        placeholder={placeholder}
        suppressHydrationWarning
        className={cn(
          "w-full bg-input border rounded-md px-3 py-1.5 h-9 text-sm",
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

TextInput.displayName = "TextInput";

export { TextInput };
export type { TextInputProps };
