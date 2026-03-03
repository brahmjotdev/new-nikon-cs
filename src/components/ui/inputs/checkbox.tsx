// ==============================
// Imports
// ==============================

import * as React from "react";
import { cn } from "@/utils";

import { InputElementProps } from "@/types";
import { Label } from "../label";
import { IconCheck } from "@tabler/icons-react";

// ==============================
// Props
// ==============================

interface CheckboxProps extends InputElementProps {
  label?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

// ==============================
// Component
// ==============================

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      checked,
      defaultChecked,
      onCheckedChange,
      name,
      id,
      label = "",
      className,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <Label htmlFor={id} className="flex items-center gap-2">
        <input
          ref={ref}
          data-slot="checkbox-input"
          type="checkbox"
          name={name}
          id={id}
          checked={checked ?? defaultChecked ?? false}
          className={cn("peer appearance-none sr-only", className)}
          {...props}
        />
        <div
          data-slot="checkbox-indicator"
          data-state={
            (checked ?? defaultChecked ?? false) ? "checked" : "unchecked"
          }
          role="checkbox"
          aria-checked={checked ?? defaultChecked ?? false}
          aria-hidden={!(checked ?? defaultChecked ?? false)}
          className="size-5 rounded-sm border flex items-center justify-center peer-checked:bg-primary peer-checked:border-primary [&_svg]:shrink-0 [&_svg]:size-4"
        >
          <IconCheck data-slot="checkbox-icon" />
        </div>
        {label || children}
      </Label>
    );
  },
);

// ==============================
// Exports
// ==============================

Checkbox.displayName = "Checkbox";

export { Checkbox };
export type { CheckboxProps };
