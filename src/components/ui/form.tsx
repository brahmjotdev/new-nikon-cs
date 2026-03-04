// ==============================
// Imports
// ==============================

"use client";

import * as React from "react";
import { Controller, Control, FieldPath, FieldValues } from "react-hook-form";
import { cn } from "@/utils";

import { DivElementProps, FormElementProps } from "@/types";
import { Alert, AlertProps } from "./alert";
import { Button, ButtonProps } from "./button";
import { Label, LabelProps } from "./label";
import { TextInput } from "./inputs/text";
import { EmailInput } from "./inputs/email";
import { PasswordInput } from "./inputs/password";

import { Checkbox, CheckboxProps } from "./inputs/checkbox";

// ==============================
// Props
// ==============================

interface FormProps extends FormElementProps {}
interface FormGroupProps extends DivElementProps {}
interface FormLabelProps extends LabelProps {}
interface FormSubmitProps extends ButtonProps {}
interface FormResetProps extends ButtonProps {}
interface FormErrorProps extends AlertProps {}

type FormWithErrors = {
  formState: { errors: Record<string, { message?: string } | undefined> };
};

type FormWithAlert = FormWithErrors & {
  setError: (name: "root", opts: { message: string }) => void;
};

function getFormErrorMessage(error: unknown, fallback: string): string {
  if (typeof error === "string") return error;
  if (error instanceof Error) return error.message;
  const msg = (error as { message?: string })?.message;
  return typeof msg === "string" ? msg : fallback;
}

function getAllFormErrors(form: FormWithErrors): string[] {
  const { errors } = form.formState;
  const messages: string[] = [];
  if (!errors || typeof errors !== "object") return messages;
  const root = errors.root as { message?: string } | undefined;
  if (root?.message) messages.push(root.message);
  for (const key of Object.keys(errors)) {
    if (key === "root") continue;
    const entry = errors[key];
    const msg =
      entry &&
      typeof entry === "object" &&
      "message" in entry &&
      typeof (entry as { message?: unknown }).message === "string"
        ? (entry as { message: string }).message
        : undefined;
    if (msg) messages.push(msg);
  }
  return messages;
}

/**
 * Subscribe to form errors for form-level display.
 * Call this in the same component that owns the form so it re-renders when validation fails.
 * - errorMessages: all errors (use with <FormError message={errorMessages} /> to show all at once)
 */
function useFormError(form: FormWithErrors): {
  errorMessages: string[];
} {
  form.formState.errors;
  const errorMessages = getAllFormErrors(form);
  return {
    errorMessages,
  };
}

/**
 * Form-level alert: same as useFormError plus a helper to set the root error from an unknown (e.g. API or catch).
 * Use with <FormError message={errorMessages} /> and setFormAlert(error, fallback) in submit/catch.
 */
function useFormAlert(form: FormWithAlert): {
  errorMessages: string[];
  setFormAlert: (error: unknown, fallback: string) => void;
} {
  const { errorMessages } = useFormError(form);
  const setFormAlert = React.useCallback(
    (error: unknown, fallback: string) => {
      form.setError("root", { message: getFormErrorMessage(error, fallback) });
    },
    [form],
  );
  return { errorMessages, setFormAlert };
}

type FormFieldBase<TFieldValues extends FieldValues> = {
  name: FieldPath<TFieldValues>;
  id?: string;
} & (
  | { form: { control: Control<TFieldValues> }; control?: never }
  | { control: Control<TFieldValues>; form?: never }
);

type FormFieldPropsUnion<TFieldValues extends FieldValues> =
  | (FormFieldBase<TFieldValues> & {
      type: "text";
    } & Omit<React.ComponentProps<typeof TextInput>, "name" | "form">)
  | (FormFieldBase<TFieldValues> & {
      type: "email";
    } & Omit<React.ComponentProps<typeof EmailInput>, "name" | "form">)
  | (FormFieldBase<TFieldValues> & {
      type: "password";
    } & Omit<React.ComponentProps<typeof PasswordInput>, "name" | "form">)
  | (FormFieldBase<TFieldValues> & {
      type: "checkbox";
    } & Omit<React.ComponentProps<typeof Checkbox>, "name" | "form">);

// ==============================
// Components
// ==============================

const Form = React.forwardRef<HTMLFormElement, FormProps>(
  ({ action = "", method = "POST", className, children, ...props }, ref) => {
    return (
      <form
        ref={ref}
        action={action}
        method={method}
        data-slot="form"
        suppressHydrationWarning
        className={cn("flex flex-col gap-4", className)}
        {...props}
      >
        {children}
      </form>
    );
  },
);

const FormGroup = React.forwardRef<HTMLDivElement, FormGroupProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="form-group"
        className={cn("flex flex-col gap-2", className)}
        {...props}
      >
        {children}
      </div>
    );
  },
);

const FormLabel = React.forwardRef<HTMLLabelElement, FormLabelProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <Label
        ref={ref}
        data-slot="form-label"
        className={cn("", className)}
        {...props}
      >
        {children}
      </Label>
    );
  },
);

const FormSubmit = React.forwardRef<HTMLButtonElement, FormSubmitProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        type="submit"
        suppressHydrationWarning
        className={cn("mt-2", className)}
        {...props}
      >
        {children}
      </Button>
    );
  },
);

const FormReset = React.forwardRef<HTMLButtonElement, FormResetProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        type="reset"
        suppressHydrationWarning
        className={cn("mt-2", className)}
        {...props}
      >
        {children}
      </Button>
    );
  },
);

const FormError = React.forwardRef<HTMLDivElement, FormErrorProps>(
  ({ className, children, message: messageProp, ...props }, ref) => {
    const message = Array.isArray(messageProp)
      ? messageProp
      : messageProp != null && messageProp !== ""
        ? [messageProp]
        : undefined;
    if (!message?.length) return null;
    return (
      <Alert
        ref={ref}
        data-slot="form-error"
        className={cn("", className)}
        message={message}
        {...props}
      >
        {children}
      </Alert>
    );
  },
);

// ==============================
// FormField (Controller + type-driven input)
// ==============================

function FormField<TFieldValues extends FieldValues>(
  props: FormFieldPropsUnion<TFieldValues>,
) {
  const control =
    "control" in props && props.control != null
      ? props.control
      : props.form.control;
  const { name, id: idProp, type, ...rest } = props;
  const fieldId = idProp ?? String(name);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <>
          {type === "text" && (
            <TextInput
              id={fieldId}
              {...field}
              {...(rest as Omit<
                React.ComponentProps<typeof TextInput>,
                "name" | "form"
              >)}
            />
          )}
          {type === "email" && (
            <EmailInput
              id={fieldId}
              {...field}
              {...(rest as Omit<
                React.ComponentProps<typeof EmailInput>,
                "name" | "form"
              >)}
            />
          )}
          {type === "password" && (
            <PasswordInput
              id={fieldId}
              {...field}
              {...(rest as Omit<
                React.ComponentProps<typeof PasswordInput>,
                "name" | "form"
              >)}
            />
          )}
          {type === "checkbox" && (
            <Checkbox
              id={fieldId}
              {...field}
              {...(rest as Omit<
                React.ComponentProps<typeof Checkbox>,
                "name" | "form"
              >)}
            />
          )}
        </>
      )}
    />
  );
}

// ==============================
// Exports
// ==============================

Form.displayName = "Form";
FormGroup.displayName = "FormGroup";
FormLabel.displayName = "FormLabel";
FormField.displayName = "FormField";
FormSubmit.displayName = "FormSubmit";
FormReset.displayName = "FormReset";
FormError.displayName = "FormError";

export {
  Form,
  FormGroup,
  FormLabel,
  FormField,
  FormSubmit,
  FormReset,
  FormError,
  useFormError,
  useFormAlert,
};
