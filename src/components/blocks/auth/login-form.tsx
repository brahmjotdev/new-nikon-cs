// ==============================
// Imports
// ==============================

"use client";

import { z } from "zod";
import { useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardBody,
  CardFooter,
} from "@/components/ui/card";
import {
  Form,
  FormGroup,
  FormLabel,
  FormField,
  FormSubmit,
  FormError,
  useFormError,
} from "@/components/ui/form";
import { useForm } from "@/hooks/use-form";
import { useAuth } from "@/hooks/db/use-auth";
import Link from "next/link";

// ==============================
// Schema
// ==============================

const loginSchema = z.object({
  email: z.email("Enter a valid email address").trim().toLowerCase(),
  password: z.string().min(8, "Password is required").trim().toLowerCase(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

// ==============================
// Component
// ==============================

const LoginFormBlock = () => {
  const form = useForm({
    schema: loginSchema,
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const { errorMessages } = useFormError(form);
  const router = useRouter();
  const { loginUser } = useAuth();

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const result = await loginUser({
        email: data.email,
        password: data.password,
        callbackURL: "/products",
      });

      const { error } = (result ?? {}) as { error?: unknown };
      if (error) {
        const message =
          typeof error === "string"
            ? error
            : ((error as { message?: string }).message ??
              "Unable to sign in. Please check your credentials.");
        form.setError("root", { message });
        return;
      }

      router.push("/products");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Something went wrong while signing in.";
      form.setError("root", { message });
    }
  };

  return (
    <Card className="max-w-sm">
      <CardHeader>
        <CardTitle>Welcome back</CardTitle>
        <CardDescription>
          Please enter your email and password to access your account.
        </CardDescription>
      </CardHeader>
      <CardBody>
        <Form id="login-form" noValidate onSubmit={form.handleSubmit(onSubmit)}>
          <FormError message={errorMessages} />
          <FormGroup>
            <FormLabel htmlFor="email">Email</FormLabel>
            <FormField
              type="email"
              form={form}
              name="email"
              id="email"
              placeholder="john.doe@example.com"
            />
          </FormGroup>
          <FormGroup>
            <div className="flex items-center justify-between">
              <FormLabel htmlFor="password">Password</FormLabel>
              <Link
                href="/forgot-password"
                className="hover:underline text-sm text-foreground"
              >
                Forgot password?
              </Link>
            </div>
            <FormField
              type="password"
              form={form}
              name="password"
              id="password"
            />
          </FormGroup>
          <FormSubmit
            variant="primary"
            type="submit"
            loading={form.formState.isSubmitting}
            loadingText="Signing in..."
          >
            Sign in
          </FormSubmit>
        </Form>
      </CardBody>
      <CardFooter>
        <p className="text-sm text-muted-foreground text-center">
          Don't have an account?
          <Link href="/register" className="underline text-foreground">
            Register
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};

export { LoginFormBlock };
