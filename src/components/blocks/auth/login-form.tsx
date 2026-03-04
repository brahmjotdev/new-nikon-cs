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
  useFormAlert,
} from "@/components/ui/form";
import { useForm } from "@/hooks/use-form";
import { useAuth } from "@/hooks/db/use-auth";
import Link from "next/link";

// ==============================
// Schema
// ==============================

const loginSchema = z.object({
  email: z.email("Enter a valid email address").trim().toLowerCase(),
  password: z.string().min(8, "Password must be at least 8 characters").trim().toLowerCase(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

// ==============================
// Component
// ==============================

const LoginFormBlock = () => {
  const form = useForm({
    schema: loginSchema,
    defaultValues: { email: "", password: "" },
  });
  const { errorMessages, setFormAlert } = useFormAlert(form);
  const { loginUser } = useAuth();
  const router = useRouter();

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const result = await loginUser({
        email: data.email,
        password: data.password,
        callbackURL: "/notes",
      });
      const { error } = (result ?? {}) as { error?: unknown };
      if (error) {
        setFormAlert(error, "Unable to sign in. Please check your credentials.");
        return;
      }
      router.push("/notes");
    } catch (error) {
      setFormAlert(error, "Something went wrong while signing in.");
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
