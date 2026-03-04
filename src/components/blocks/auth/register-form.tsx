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

const registerSchema = z.object({
  name: z.string().min(3, "Name is required"),
  email: z.email("Enter a valid email address").trim().toLowerCase(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .trim()
    .toLowerCase(),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

// ==============================
// Component
// ==============================

const RegisterFormBlock = () => {
  const form = useForm({
    schema: registerSchema,
    defaultValues: { name: "", email: "", password: "" },
  });
  const { errorMessages, setFormAlert } = useFormAlert(form);
  const { registerUser } = useAuth();
  const router = useRouter();

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      const result = await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
      });
      const { error } = (result ?? {}) as { error?: unknown };
      if (error) {
        setFormAlert(error, "Unable to register. Please try again.");
        return;
      }
      router.push("/approval-pending");
    } catch (error) {
      setFormAlert(error, "Something went wrong while registering.");
    }
  };

  return (
    <Card className="max-w-sm">
      <CardHeader>
        <CardTitle>Welcome to the app</CardTitle>
        <CardDescription>
          Please enter your name, username and password to create your account.
        </CardDescription>
      </CardHeader>
      <CardBody>
        <Form
          id="register-form"
          noValidate
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormError message={errorMessages} />
          <FormGroup>
            <FormLabel htmlFor="name">Name</FormLabel>
            <FormField
              type="text"
              form={form}
              name="name"
              id="name"
              placeholder="John Doe"
            />
          </FormGroup>
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
            <FormLabel htmlFor="password">Password</FormLabel>
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
            loadingText="Registering..."
          >
            Register
          </FormSubmit>
        </Form>
      </CardBody>
      <CardFooter>
        <p className="text-sm text-muted-foreground text-center">
          Already have an account?
          <Link href="/login" className="underline text-foreground">
            Login
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};

export { RegisterFormBlock };
