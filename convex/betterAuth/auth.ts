import { components } from "../_generated/api";
import type { DataModel } from "../_generated/dataModel";

import { createClient } from "@convex-dev/better-auth";
import { convex } from "@convex-dev/better-auth/plugins";
import {
  type GenericCtx,
  requireActionCtx,
} from "@convex-dev/better-auth/utils";

import { betterAuth, type BetterAuthOptions } from "better-auth";
import { admin, username } from "better-auth/plugins";

import schema from "./schema";
import authConfig from "../auth.config";
import { sendResetEmail } from "../../src/components/blocks/emails/send-reset-email";

//==============================
// Better Auth Component
//==============================

export const authComponent = createClient<DataModel, typeof schema>(
  components.betterAuth,
  {
    local: { schema },
    verbose: false,
  },
);

//==============================
// Better Auth Options for server
//==============================

export const createAuthOptions = (ctx: GenericCtx<DataModel>) => {
  return {
    appName: "Better Auth",
    baseURL: process.env.SITE_URL,
    secret: process.env.BETTER_AUTH_SECRET,
    database: authComponent.adapter(ctx),
    emailAndPassword: {
      enabled: true,
      sendResetPassword: async ({ user, url }) => {
        // Only send reset email to admin; agents must request reset via username and admin resets for them
        if ((user as { role?: string }).role !== "admin") {
          return;
        }
        await sendResetEmail(requireActionCtx(ctx), {
          to: user.email,
          url,
          name: user.name,
        });
      },
    },
    user: {
      additionalFields: {
        approved: {
          type: "boolean",
          required: true,
          defaultValue: false,
          input: false, // only backend/admin can set; not user-editable on signup
        },
      },
      deleteUser: {
        enabled: true,
      },
    },
    plugins: [
      admin({
        allowedRoles: ["admin", "agent"],
        defaultRole: "agent",
      }),
      username(),
      convex({ authConfig }),
    ],
  } satisfies BetterAuthOptions;
};

//==============================
// For `auth` CLI
//==============================

export const options = createAuthOptions({} as GenericCtx<DataModel>);

//==============================
// Better Auth Instance
//==============================

export const createAuth = (ctx: GenericCtx<DataModel>) => {
  return betterAuth(createAuthOptions(ctx));
};
