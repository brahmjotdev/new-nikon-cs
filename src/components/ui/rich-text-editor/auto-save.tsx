// ==============================
// Imports
// ==============================

import * as React from "react";
import { cn } from "@/utils";

import { DivElementProps } from "@/types";
import { cva } from "class-variance-authority";

// ==============================
// Props
// ==============================

export type Status = "idle" | "loading" | "saving" | "saved" | "error";

const statusVariants = cva("text-sm font-medium", {
  variants: {
    status: {
      idle: "text-muted-foreground",
      loading: "text-muted-foreground",
      saving: "text-muted-foreground",
      saved: "text-muted-foreground",
      error: "text-danger",
    },
  },
});

const statusLabels: Record<Status, string> = {
  idle: "Idle",
  loading: "Loading...",
  saving: "Saving...",
  saved: "Saved",
  error: "Error",
};

interface AutoSaveProps extends DivElementProps {
  status: Status;
}

// ==============================
// Hook
// ==============================

export interface UseAutoSaveOptions<T> {
  /** Called when content should be saved (after debounce). Must return a Promise. */
  save: (content: T) => Promise<void>;
  /** Debounce delay in ms before calling save. Default 300. */
  debounceMs?: number;
  /** Ms to show "saved" before switching back to "idle". Default 2000. */
  savedResetMs?: number;
}

function useAutoSave<T>(options: UseAutoSaveOptions<T>) {
  const { save, debounceMs = 300, savedResetMs = 2000 } = options;
  const [status, setStatus] = React.useState<Status>("idle");
  const savedTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const debounceRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    return () => {
      if (savedTimeoutRef.current) clearTimeout(savedTimeoutRef.current);
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const scheduleSave = React.useCallback(
    (content: T) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        debounceRef.current = null;
        setStatus("saving");
        save(content)
          .then(() => {
            setStatus("saved");
            if (savedTimeoutRef.current) clearTimeout(savedTimeoutRef.current);
            savedTimeoutRef.current = setTimeout(() => {
              setStatus("idle");
              savedTimeoutRef.current = null;
            }, savedResetMs);
          })
          .catch(() => {
            setStatus("error");
          });
      }, debounceMs);
    },
    [save, debounceMs, savedResetMs],
  );

  return { status, setStatus, scheduleSave };
}

export { useAutoSave };

// ==============================
// Component
// ==============================

const AutoSave = React.forwardRef<HTMLDivElement, AutoSaveProps>(
  ({ status, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="auto-save"
        className={cn(statusVariants({ status }), className)}
        {...props}
      >
        {statusLabels[status]}
      </div>
    );
  },
);

// ==============================
// Exports
// ==============================

AutoSave.displayName = "AutoSave";

export { AutoSave };
export type { AutoSaveProps };
