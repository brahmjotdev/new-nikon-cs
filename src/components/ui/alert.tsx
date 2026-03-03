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

const alertVariants = cva(
  "border rounded-md px-4 py-2 flex flex-col gap-0.5 text-sm",
  {
    variants: {
      variant: {
        danger: "border-danger text-danger bg-danger/5",
        warning: "border-warning text-warning bg-warning/5",
        success: "border-success text-success bg-success/5",
        info: "border-info text-info bg-info/5",
      },
    },
  },
);
// Props
// ==============================

type AlertVariants = "danger" | "warning" | "success" | "info";

interface AlertProps extends DivElementProps {
  variant?: AlertVariants;
  message?: string | string[];
}

// ==============================
// Component
// ==============================

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  (
    { variant = "danger", message = [], className, children, ...props },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        data-slot="alert"
        data-variant={variant}
        className={cn(alertVariants({ variant }), className)}
        {...props}
      >
        {Array.isArray(message) ? (
          message.map((msg, index) => <p key={index}>{msg}</p>)
        ) : (
          <p>{message}</p>
        )}
        {children}
      </div>
    );
  },
);

// ==============================
// Exports
// ==============================

Alert.displayName = "Alert";

export { Alert };
export type { AlertProps };
