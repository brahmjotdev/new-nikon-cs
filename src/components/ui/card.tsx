// ==============================
// Imports
// ==============================

import * as React from "react";
import { cn } from "@/utils";

import {
  DivElementProps,
  Heading4ElementProps,
  ParagraphElementProps,
} from "@/types";

// ==============================
// Props
// ==============================

interface CardProps extends DivElementProps {}
interface CardHeaderProps extends DivElementProps {}
interface CardTitleProps extends Heading4ElementProps {}
interface CardDescriptionProps extends ParagraphElementProps {}
interface CardBodyProps extends DivElementProps {}
interface CardFooterProps extends DivElementProps {}

// ==============================
// Component
// ==============================

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="card"
        className={cn(
          "bg-card border min-w-xs p-8 rounded-xl shadow-xs overflow-hidden",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="card-header"
        className={cn("mb-4 flex flex-col gap-0.5", className)}
        {...props}
      >
        {children}
      </div>
    );
  },
);

const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <h4
        ref={ref}
        data-slot="card-title"
        className={cn("text-lg font-semibold", className)}
        {...props}
      >
        {children}
      </h4>
    );
  },
);

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  CardDescriptionProps
>(({ className, children, ...props }, ref) => {
  return (
    <p
      ref={ref}
      data-slot="card-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    >
      {children}
    </p>
  );
});

const CardBody = React.forwardRef<HTMLDivElement, CardBodyProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="card-body"
        className={cn("flex flex-col gap-4", className)}
        {...props}
      >
        {children}
      </div>
    );
  },
);

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="card-footer"
        className={cn("mt-4", className)}
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

Card.displayName = "Card";
CardHeader.displayName = "CardHeader";
CardTitle.displayName = "CardTitle";
CardDescription.displayName = "CardDescription";
CardBody.displayName = "CardBody";
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardTitle, CardDescription, CardBody, CardFooter };
export type { CardProps };
