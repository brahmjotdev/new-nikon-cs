"use client";

import { z } from "zod";

import {
  Form,
  FormError,
  FormField,
  FormGroup,
  FormLabel,
  FormSubmit,
  useFormAlert,
} from "@/components/ui/form";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "@/hooks/use-form";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";

const forgotPasswordSchema = z.object({
  username: z
    .string()
    .min(5, "Enter your username")
    .max(7, "Username must be 7 characters only")
    .trim()
    .toLowerCase(),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export const ForgotPasswordAgentBlock = () => {
  const form = useForm({
    schema: forgotPasswordSchema,
    defaultValues: { username: "" },
  });
  const { errorMessages, setFormAlert } = useFormAlert(form);
  const requestAgentPasswordReset = useMutation(
    api.functions.auth.requestAgentPasswordReset,
  );

  const onSubmit = async (data: ForgotPasswordValues) => {
    try {
      await requestAgentPasswordReset({ username: data.username.trim() });
      form.setError("root", {
        message:
          "If an account exists for this username, your admin has been notified. They will reset your password and contact you.",
      });
    } catch (error) {
      setFormAlert(error, "Something went wrong. Please try again.");
    }
  };

  return (
    <Card className="max-w-sm">
      <CardHeader>
        <CardTitle>Forgot password</CardTitle>
      </CardHeader>
      <CardBody>
        <Form
          id="forgot-password-form"
          noValidate
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormError message={errorMessages} />
          <FormGroup>
            <FormLabel htmlFor="username">Username</FormLabel>
            <FormField
              type="text"
              form={form}
              name="username"
              id="username"
              placeholder="Your username"
              autoComplete="username"
            />
          </FormGroup>
          <FormSubmit
            variant="primary"
            type="submit"
            loading={form.formState.isSubmitting}
            loadingText="Requesting reset..."
          >
            Request password reset
          </FormSubmit>
        </Form>
      </CardBody>
    </Card>
  );
};
