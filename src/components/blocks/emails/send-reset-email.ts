"use node";

import { Resend } from "@convex-dev/resend";
import { render } from "@react-email/render";

import { components } from "../../../../convex/_generated/api";
import type { ActionCtx } from "../../../../convex/_generated/server";
import { ResetPasswordEmail } from "./reset-password";

const resend = new Resend((components as any).resend, {
  // Use Convex + Resend defaults; disable testMode in production via env if desired.
  testMode: process.env.NODE_ENV !== "production",
});

type SendResetEmailParams = {
  to: string;
  url: string;
  name?: string | null;
};

export async function sendResetEmail(
  ctx: ActionCtx,
  { to, url, name }: SendResetEmailParams,
) {
  const html = await render(
    ResetPasswordEmail({
      resetUrl: url,
      userName: name ?? undefined,
    }),
  );

  const fromEmail = process.env.RESEND_FROM_EMAIL;
  const from =
    fromEmail != null && fromEmail !== ""
      ? `Nikon Customer Service <${fromEmail}>`
      : "Nikon Customer Service <no-reply@example.com>";

  const toAddress =
    name && name.trim().length > 0 ? `${name} <${to}>` : to;

  await resend.sendEmail(
    ctx,
    from,
    toAddress,
    "Reset your Nikon Customer Service password",
    html,
  );
}

