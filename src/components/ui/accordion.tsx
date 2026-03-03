// ==============================
// Imports
// ==============================

import * as React from "react";
import { cn } from "@/utils";

import { DivElementProps } from "@/types";
import { Button, ButtonProps } from "./button";

// ==============================
// Props
// ==============================

interface AccordionProps extends DivElementProps {}
interface AccordionItemProps extends DivElementProps {}
interface AccordionTriggerProps extends ButtonProps {}
interface AccordionContentProps extends DivElementProps {}

// ==============================
// Component
// ==============================

const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="accordion"
        className={cn("", className)}
        {...props}
      >
        {children}
      </div>
    );
  },
);

const AccordionItem = React.forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="accordion-item"
        className={cn("", className)}
        {...props}
      >
        {children}
      </div>
    );
  },
);

const AccordionTrigger = React.forwardRef<
  HTMLButtonElement,
  AccordionTriggerProps
>(({ className, children, ...props }, ref) => {
  return (
    <Button
      ref={ref}
      data-slot="accordion-trigger"
      className={cn("", className)}
      {...props}
    >
      {children}
    </Button>
  );
});

const AccordionContent = React.forwardRef<
  HTMLDivElement,
  AccordionContentProps
>(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-slot="accordion-content"
      className={cn("", className)}
      {...props}
    >
      {children}
    </div>
  );
});

// ==============================
// Exports
// ==============================

Accordion.displayName = "Accordion";
AccordionItem.displayName = "AccordionItem";
AccordionTrigger.displayName = "AccordionTrigger";
AccordionContent.displayName = "AccordionContent";

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
