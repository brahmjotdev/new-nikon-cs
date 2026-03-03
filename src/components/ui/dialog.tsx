// ==============================
// Imports
// ==============================

"use client";

import * as React from "react";
import { cn, trapFocus, lockScroll, mergeRefs } from "@/utils";

import {
  DivElementProps,
  Heading4ElementProps,
  ParagraphElementProps,
} from "@/types";
import { Button, ButtonProps } from "./button";
import { CardProps } from "./card";

import { createPortal } from "react-dom";

import { IconX } from "@tabler/icons-react";

// ==============================
// Props
// ==============================

interface DialogProps extends DivElementProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}
interface DialogTriggerProps extends ButtonProps {}
interface DialogBackdropProps extends DivElementProps {}
interface DialogCardProps extends CardProps {}
interface DialogHeaderProps extends DivElementProps {}
interface DialogTitleProps extends Heading4ElementProps {}
interface DialogDescriptionProps extends ParagraphElementProps {}
interface DialogBodyProps extends DivElementProps {}
interface DialogFooterProps extends DivElementProps {}
interface DialogCloseProps extends ButtonProps {}

// ==============================
// Context
// ==============================

interface DialogContextProps {
  type?: "single" | "multiple";
  open?: boolean;
  defaultOpen?: boolean;
  isControlled?: boolean;
  onOpenChange?: (open: boolean) => void;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  openDialog: () => void;
  closeDialog: () => void;
  handleBackdropClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  triggerRef: React.RefObject<HTMLButtonElement | HTMLAnchorElement | null>;
  contentRef: React.RefObject<HTMLDivElement | null>;
}

interface DialogProviderProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
}

const DialogContext = React.createContext<DialogContextProps | null>(null);

// ==============================
// Hook
// ==============================

const useDialog = () => {
  const ctx = React.useContext(DialogContext);
  if (!ctx) {
    throw new Error("Dialog components must be used within DialogProvider");
  }
  return ctx;
};

// =========================
// Controlled Logic
// =========================

const useDialogState = (
  openProp?: boolean,
  defaultOpen?: boolean,
  onOpenChange?: (open: boolean) => void,
) => {
  const isControlled = openProp !== undefined;

  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(
    defaultOpen ?? false,
  );

  const open = isControlled ? openProp! : uncontrolledOpen;

  const setOpen = React.useCallback<
    React.Dispatch<React.SetStateAction<boolean>>
  >(
    (value) => {
      const next =
        typeof value === "function" ? value(uncontrolledOpen) : value;
      if (!isControlled) {
        setUncontrolledOpen(next);
      }
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange, uncontrolledOpen],
  );

  return { open, setOpen, isControlled };
};

// =========================
// Handlers
// =========================

const useDialogHandlers = (
  setOpen: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  const openDialog = React.useCallback(() => setOpen(true), [setOpen]);
  const closeDialog = React.useCallback(() => setOpen(false), [setOpen]);

  const handleBackdropClick = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) {
        closeDialog();
      }
    },
    [closeDialog],
  );

  return { openDialog, closeDialog, handleBackdropClick };
};

// =========================
// Refs
// =========================

const useDialogRefs = () => {
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);
  return { triggerRef, contentRef };
};

// =========================
// Traps (Focus + Scroll + ESC)
// =========================

const useDialogTraps = (
  open: boolean,
  contentRef: React.RefObject<HTMLDivElement | null>,
  triggerRef: React.RefObject<HTMLButtonElement | null>,
  closeDialog: () => void,
) => {
  React.useEffect(() => {
    if (!open) return;
    const content = contentRef.current;
    if (!content) return;

    trapFocus(content);
    lockScroll();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeDialog();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
      triggerRef.current?.focus();
    };
  }, [open, contentRef, triggerRef, closeDialog]);
};

// =========================
// Provider
// =========================

const DialogProvider = ({
  open: openProp,
  defaultOpen,
  onOpenChange,
  children,
}: DialogProviderProps) => {
  const state = useDialogState(openProp, defaultOpen, onOpenChange);
  const refs = useDialogRefs();
  const handlers = useDialogHandlers(state.setOpen);

  useDialogTraps(
    state.open,
    refs.contentRef,
    refs.triggerRef,
    handlers.closeDialog,
  );

  const value = React.useMemo(
    () => ({
      ...state,
      ...refs,
      ...handlers,
    }),
    [state, refs, handlers],
  );

  return (
    <DialogContext.Provider value={value}>{children}</DialogContext.Provider>
  );
};

// ==============================
// Components
// ==============================

const Dialog = React.forwardRef<HTMLDivElement, DialogProps>(
  (
    {
      open: openProp,
      defaultOpen,
      onOpenChange,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <DialogProvider
        open={openProp}
        defaultOpen={defaultOpen}
        onOpenChange={onOpenChange}
      >
        <div
          ref={ref}
          data-slot="dialog"
          className={cn("", className)}
          {...props}
        >
          {children}
        </div>
      </DialogProvider>
    );
  },
);

const DialogTrigger = React.forwardRef<HTMLButtonElement, DialogTriggerProps>(
  ({ className, children, ...props }, ref) => {
    const { openDialog, triggerRef } = useDialog();
    const mergedRef = mergeRefs(ref, triggerRef);
    return (
      <Button
        ref={mergedRef}
        data-slot="dialog-trigger"
        onClick={openDialog}
        className={cn("", className)}
        {...props}
      >
        {children}
        <span className="sr-only">Open dialog</span>
      </Button>
    );
  },
);

const DialogBackdrop = React.forwardRef<HTMLDivElement, DialogBackdropProps>(
  ({ className, children, ...props }, ref) => {
    const { open, handleBackdropClick } = useDialog();
    return (
      open &&
      createPortal(
        <div
          ref={ref}
          data-slot="dialog-backdrop"
          data-state={open ? "open" : "closed"}
          aria-hidden={!open}
          onClick={handleBackdropClick}
          className={cn(
            "z-dialog fixed inset-0 bg-black/50 backdrop-blur-sm",
            className,
          )}
          {...props}
        >
          {children}
        </div>,
        document.body,
      )
    );
  },
);

const DialogCard = React.forwardRef<HTMLDivElement, DialogCardProps>(
  ({ className, children, ...props }, ref) => {
    const { open, contentRef } = useDialog();
    const mergedRef = mergeRefs(ref, contentRef);
    return (
      <div
        ref={mergedRef}
        data-slot="dialog-card"
        data-state={open ? "open" : "closed"}
        role="dialog"
        aria-modal="true"
        className={cn("", open ? "scale-100" : "scale-0", className)}
        {...props}
      >
        <DialogClose variant="secondary" size="icon-md">
          <IconX className="size-4" />
          <span className="sr-only">Close dialog</span>
        </DialogClose>
        {children}
      </div>
    );
  },
);

const DialogHeader = React.forwardRef<HTMLDivElement, DialogHeaderProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="dialog-header"
        className={cn("", className)}
        {...props}
      >
        {children}
      </div>
    );
  },
);

const DialogTitle = React.forwardRef<HTMLHeadingElement, DialogTitleProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <h4
        ref={ref}
        data-slot="dialog-title"
        className={cn("text-lg font-semibold", className)}
        {...props}
      >
        {children}
      </h4>
    );
  },
);

const DialogDescription = React.forwardRef<
  HTMLParagraphElement,
  DialogDescriptionProps
>(({ className, children, ...props }, ref) => {
  return (
    <p
      ref={ref}
      data-slot="dialog-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    >
      {children}
    </p>
  );
});

const DialogBody = React.forwardRef<HTMLDivElement, DialogBodyProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="dialog-body"
        className={cn("", className)}
        {...props}
      >
        {children}
      </div>
    );
  },
);

const DialogFooter = React.forwardRef<HTMLDivElement, DialogFooterProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="dialog-footer"
        className={cn("", className)}
        {...props}
      >
        {children}
      </div>
    );
  },
);

const DialogClose = React.forwardRef<HTMLButtonElement, DialogCloseProps>(
  ({ className, children, ...props }, ref) => {
    const { closeDialog, triggerRef } = useDialog();
    const mergedRef = mergeRefs(ref, triggerRef);
    return (
      <Button
        ref={mergedRef}
        data-slot="dialog-close"
        onClick={closeDialog}
        className={cn("", className)}
        {...props}
      >
        {children}
      </Button>
    );
  },
);

// ==============================
// Exports
// ==============================

Dialog.displayName = "Dialog";
DialogTrigger.displayName = "DialogTrigger";
DialogBackdrop.displayName = "DialogBackdrop";
DialogCard.displayName = "DialogCard";
DialogHeader.displayName = "DialogHeader";
DialogTitle.displayName = "DialogTitle";
DialogDescription.displayName = "DialogDescription";
DialogBody.displayName = "DialogBody";
DialogFooter.displayName = "DialogFooter";
DialogClose.displayName = "DialogClose";

export {
  Dialog,
  DialogTrigger,
  DialogBackdrop,
  DialogCard,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogFooter,
  DialogClose,
};

export type {
  DialogProps,
  DialogTriggerProps,
  DialogBackdropProps,
  DialogCardProps,
  DialogHeaderProps,
  DialogTitleProps,
  DialogDescriptionProps,
  DialogBodyProps,
  DialogFooterProps,
  DialogCloseProps,
};
