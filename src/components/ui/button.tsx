// ==============================
// Imports
// ==============================

import * as React from "react";
import { cn } from "@/utils";
import { cva } from "class-variance-authority";

import { ButtonElementProps } from "@/types";
import { Loader } from "./loader";

// ==============================
// Variants
// ==============================

const buttonVariants = cva(
  "inline-flex items-center select-none disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer justify-center font-medium shrink-0 [&_svg]:shrink-0 whitespace-nowrap",
  {
    variants: {
      variant: {
        default: "",
        primary:
          "bg-primary text-primary-foreground hover:bg-primary/80 focus:ring-offset-2",
        secondary: "bg-secondary text-secondary-foreground",
        outline: "border-border bg-background ",
        ghost: "text-muted-foreground hover:text-foreground hover:bg-secondary",
        danger: "bg-danger text-danger-foreground hover:bg-danger/80 focus:ring-offset-2",
      },
      size: {
        sm: "h-8 rounded-sm px-3 text-xs [&_svg]:size-4 gap-1.5",
        md: "h-9 rounded-md px-4 text-sm [&_svg]:size-5 gap-2",
        lg: "h-10 rounded-lg px-8 text-base [&_svg]:size-6 gap-2.5",
        "icon-sm": "size-8 rounded-sm [&_svg]:size-4",
        "icon-md": "size-9 rounded-md [&_svg]:size-5",
        "icon-lg": "size-10 rounded-lg [&_svg]:size-6",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);

// ==============================
// Props
// ==============================

type ButtonVariants =
  | "default"
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "danger";
type ButtonSizes = "sm" | "md" | "lg" | "icon-sm" | "icon-md" | "icon-lg";

interface ButtonProps extends ButtonElementProps {
  variant?: ButtonVariants;
  size?: ButtonSizes;
  loading?: boolean;
  loadingText?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "default",
      size = "md",
      loading = false,
      loadingText = "Loading...",
      disabled = false,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        data-slot="button"
        data-variant={variant}
        data-size={size}
        disabled={loading || disabled}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      >
        {loading ? (
          <>
            <Loader
              size={
                size === "icon-lg" ? "lg" : size === "icon-sm" ? "sm" : "md"
              }
            />
            {loadingText}
          </>
        ) : (
          children
        )}
      </button>
    );
  },
);

// ==============================
// Exports
// ==============================

Button.displayName = "Button";

export { Button };
export type { ButtonProps };
