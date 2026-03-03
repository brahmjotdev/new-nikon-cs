// ==============================
// Imports
// ==============================

import * as React from "react";
import { cn } from "@/utils";

import { InputElementProps } from "@/types";

// ==============================
// Props
// ==============================

interface EmailInputProps extends InputElementProps {}

// ==============================
// Component
// ==============================

const EmailInput = React.forwardRef<HTMLInputElement, EmailInputProps>(
  ({ name, id, placeholder, className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        data-slot="email-input"
        type="email"
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

EmailInput.displayName = "EmailInput";

export { EmailInput };
