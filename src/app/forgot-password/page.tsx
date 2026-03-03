import { fetchAuthQuery, preloadAuthQuery } from "@/lib/auth-server";
import { api } from "../../../convex/_generated/api";
import { redirect } from "next/navigation";

import { ForgotPasswordAgentBlock } from "@/components/blocks/auth/agent-forgot-password";

export default async function ForgotPasswordPage() {
  preloadAuthQuery(api.functions.auth.getCurrentUser);
  const user = await fetchAuthQuery(api.functions.auth.getCurrentUser);

  if (user && user.role === "admin") {
    redirect("/admin-forgot-password");
  }

  return (
    <div>
      <ForgotPasswordAgentBlock />
    </div>
  );
}

