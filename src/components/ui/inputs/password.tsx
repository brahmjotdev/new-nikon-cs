// ==============================
// Imports
// ==============================

import * as React from "react";
import { cn } from "@/utils";

import { InputElementProps } from "@/types";
import { IconEye, IconEyeClosed } from "@tabler/icons-react";
import { Button } from "../button";

// ==============================
// Props
// ==============================

interface PasswordInputProps extends InputElementProps {}

// ==============================
// Hook
// ==============================

const showPassword = () => {
  const [passwordVisible, setPasswordVisible] = React.useState(false);
  const passwordType = passwordVisible ? "text" : "password";
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };
  return {
    passwordType,
    passwordVisible,
    togglePasswordVisibility,
  };
};

// ==============================
// Component
// ==============================

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ name, id, placeholder, className, ...props }, ref) => {
    const { passwordType, togglePasswordVisibility, passwordVisible } =
      showPassword();
    return (
      <div className="relative">
        <input
          ref={ref}
          data-slot="password-input"
          type={passwordType}
          name={name}
          id={id}
          placeholder={placeholder}
          suppressHydrationWarning
          className={cn(
            "w-full bg-input border flex text-sm h-9 items-center rounded-md px-3 py-1.5 ",
            className,
          )}
          {...props}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon-md"
          onClick={togglePasswordVisibility}
          aria-label={passwordVisible ? "Hide password" : "Show password"}
          className="absolute right-0 top-0"
        >
          {passwordVisible ? <IconEye /> : <IconEyeClosed />}
        </Button>
      </div>
    );
  },
);

// ==============================
// Exports
// ==============================

PasswordInput.displayName = "PasswordInput";

export { PasswordInput };
export type { PasswordInputProps };
