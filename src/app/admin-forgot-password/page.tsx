import { fetchAuthQuery, preloadAuthQuery } from "@/lib/auth-server";
import { api } from "../../../convex/_generated/api";
import { ForgotPasswordAdminBlock } from "@/components/blocks/auth/admin-forgot-password";

import { redirect } from "next/navigation";

export default async function AdminForgotPasswordPage() {
  preloadAuthQuery(api.functions.auth.getCurrentUser);
  const user = await fetchAuthQuery(api.functions.auth.getCurrentUser);

  if (user && user.role !== "admin") {
    redirect("/forgot-password");
  }

  return (
    <div>
      <ForgotPasswordAdminBlock />
    </div>
  );
}
