import { Button, Link, Text } from "@react-email/components";

import { EmailBase } from "./email-base";

type ResetPasswordEmailProps = {
  resetUrl: string;
  userName?: string | null;
};

export const ResetPasswordEmail = ({
  resetUrl,
  userName,
}: ResetPasswordEmailProps) => {
  const safeName = userName && userName.trim().length > 0 ? userName : "there";

  return (
    <EmailBase
      title="Reset your password"
      preview="Use this link to reset your Nikon Customer Service password."
    >
      <Text
        style={{
          fontSize: 14,
          lineHeight: "1.5",
          color: "#111827",
        }}
      >
        Hi {safeName},
      </Text>
      <Text
        style={{
          fontSize: 14,
          lineHeight: "1.5",
          color: "#111827",
        }}
      >
        We received a request to reset the password for your Nikon Customer
        Service account. Click the button below to choose a new password.
      </Text>
      <Button
        href={resetUrl}
        style={{
          display: "inline-block",
          marginTop: 16,
          marginBottom: 16,
          padding: "10px 16px",
          borderRadius: 6,
          backgroundColor: "#0f172a",
          color: "#ffffff",
          fontSize: 14,
          fontWeight: 600,
          textDecoration: "none",
        }}
      >
        Reset password
      </Button>
      <Text
        style={{
          fontSize: 12,
          lineHeight: "1.5",
          color: "#4b5563",
        }}
      >
        If the button above does not work, copy and paste this link into your
        browser:
        <br />
        <Link href={resetUrl}>{resetUrl}</Link>
      </Text>
      <Text
        style={{
          fontSize: 12,
          lineHeight: "1.5",
          color: "#6b7280",
          marginTop: 16,
        }}
      >
        If you did not request a password reset, you can safely ignore this
        email.
      </Text>
    </EmailBase>
  );
};

