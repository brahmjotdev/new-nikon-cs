import * as React from "react";
import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

type EmailBaseProps = {
  title: string;
  preview?: string;
  children: React.ReactNode;
};

export const EmailBase = ({ title, preview, children }: EmailBaseProps) => {
  return (
    <Html>
      <Head />
      {preview ? <Preview>{preview}</Preview> : null}
      <Body
        style={{
          backgroundColor: "#f4f4f5",
          margin: 0,
          padding: "24px 0",
          fontFamily:
            '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif',
        }}
      >
        <Container
          style={{
            backgroundColor: "#ffffff",
            borderRadius: 8,
            padding: 24,
            margin: "0 auto",
            maxWidth: 480,
            boxShadow:
              "0 10px 15px -3px rgba(15,23,42,0.1), 0 4px 6px -4px rgba(15,23,42,0.1)",
          }}
        >
          <Section style={{ marginBottom: 16 }}>
            <Text
              style={{
                fontSize: 20,
                fontWeight: 600,
                margin: 0,
                color: "#020617",
              }}
            >
              {title}
            </Text>
          </Section>
          <Section>{children}</Section>
          <Section style={{ marginTop: 24 }}>
            <Text
              style={{
                fontSize: 12,
                color: "#9ca3af",
                margin: 0,
              }}
            >
              This email was sent by Nikon Customer Service.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

