// ==============================
// Imports
// ==============================

"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useForm as useReactHookForm,
  UseFormProps as UseReactHookFormProps,
  UseFormReturn,
} from "react-hook-form";

// ==============================
// Types
// ==============================

type FieldValues = Record<string, unknown>;

type UseFormParams<T extends z.ZodType<FieldValues>> = Omit<
  UseReactHookFormProps<z.infer<T>>,
  "resolver"
> & {
  schema: T;
};

// ==============================
// Hook
// ==============================

function useForm<T extends z.ZodType<FieldValues>>({
  schema,
  ...props
}: UseFormParams<T>): UseFormReturn<z.infer<T>> {
  const formProps = {
    ...props,
    resolver: zodResolver(schema as Parameters<typeof zodResolver>[0]),
  } as unknown as UseReactHookFormProps<z.infer<T>>;
  const result = useReactHookForm<z.infer<T>>(formProps);
  return result as UseFormReturn<z.infer<T>>;
}

// ==============================
// Exports
// ==============================

export { useForm };
export type { UseFormParams, UseFormReturn };
