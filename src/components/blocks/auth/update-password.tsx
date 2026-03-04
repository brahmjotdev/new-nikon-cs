"use client";

import { z } from "zod";
import { useRouter } from "next/navigation";

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
import { useAuth } from "@/hooks/db/use-auth";

const updatePasswordSchema = z.object({
  currentPassword: z
    .string()
    .min(8, "Current password is required")
    .trim()
    .toLowerCase(),
  newPassword: z
    .string()
    .min(8, "New password must be at least 8 characters")
    .trim()
    .toLowerCase(),
});

type UpdatePasswordValues = z.infer<typeof updatePasswordSchema>;

export const UpdatePasswordBlock = () => {
  const form = useForm({
    schema: updatePasswordSchema,
    defaultValues: { currentPassword: "", newPassword: "" },
  });
  const { errorMessages, setFormAlert } = useFormAlert(form);
  const { changePassword, markPasswordUpdated } = useAuth();
  const router = useRouter();

  const onSubmit = async (data: UpdatePasswordValues) => {
    try {
      const result = await changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      const { error } = (result ?? {}) as { error?: unknown };
      if (error) {
        setFormAlert(error, "Unable to update password.");
        return;
      }
      await markPasswordUpdated({});
      router.push("/products");
    } catch (error) {
      setFormAlert(error, "Something went wrong while updating your password.");
    }
  };

  return (
    <Card className="max-w-sm">
      <CardHeader>
        <CardTitle>Update password</CardTitle>
      </CardHeader>
      <CardBody>
        <Form
          id="update-password-form"
          noValidate
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormError message={errorMessages} />
          <FormGroup>
            <FormLabel htmlFor="currentPassword">Current password</FormLabel>
            <FormField
              type="password"
              form={form}
              name="currentPassword"
              id="currentPassword"
            />
          </FormGroup>
          <FormGroup>
            <FormLabel htmlFor="newPassword">New password</FormLabel>
            <FormField
              type="password"
              form={form}
              name="newPassword"
              id="newPassword"
            />
          </FormGroup>
          <FormSubmit
            variant="primary"
            type="submit"
            loading={form.formState.isSubmitting}
            loadingText="Updating..."
          >
            Save new password
          </FormSubmit>
        </Form>
      </CardBody>
    </Card>
  );
};
