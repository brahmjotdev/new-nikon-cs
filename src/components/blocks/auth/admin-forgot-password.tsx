"use client";

import { z } from "zod";

import {
  Form,
  FormError,
  FormField,
  FormGroup,
  FormLabel,
  FormSubmit,
  useFormError,
} from "@/components/ui/form";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "@/hooks/use-form";
import { useAuth } from "@/hooks/db/use-auth";

const adminForgotPasswordSchema = z.object({
  email: z.email("Enter a valid email address").trim().toLowerCase(),
});

type AdminForgotPasswordValues = z.infer<typeof adminForgotPasswordSchema>;

export const ForgotPasswordAdminBlock = () => {
  const form = useForm({
    schema: adminForgotPasswordSchema,
    defaultValues: {
      email: "",
    },
  });
  const { errorMessages } = useFormError(form);
  const { requestPasswordReset } = useAuth();

  const onSubmit = async (data: AdminForgotPasswordValues) => {
    try {
      const result = await requestPasswordReset({
        email: data.email,
      });

      const { error } = (result ?? {}) as { error?: unknown };
      if (error) {
        const message =
          typeof error === "string"
            ? error
            : ((error as { message?: string }).message ??
              "Unable to request password reset.");
        form.setError("root", { message });
        return;
      }

      form.setError("root", {
        message:
          "If an admin account exists for this email, a reset link has been sent.",
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Something went wrong while requesting a reset.";
      form.setError("root", { message });
    }
  };

  return (
    <Card className="max-w-sm">
      <CardHeader>
        <CardTitle>Admin password reset</CardTitle>
      </CardHeader>
      <CardBody>
        <Form
          id="admin-forgot-password-form"
          noValidate
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormError message={errorMessages} />
          <FormGroup>
            <FormLabel htmlFor="email">Admin email</FormLabel>
            <FormField
              type="email"
              form={form}
              name="email"
              id="email"
              placeholder="admin@example.com"
            />
          </FormGroup>
          <FormSubmit
            variant="primary"
            type="submit"
            loading={form.formState.isSubmitting}
            loadingText="Requesting reset..."
          >
            Send reset link
          </FormSubmit>
        </Form>
      </CardBody>
    </Card>
  );
};
