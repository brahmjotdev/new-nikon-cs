import { fetchAuthQuery, preloadAuthQuery } from "@/lib/auth-server";
import { api } from "../../convex/_generated/api";
import { redirect } from "next/navigation";

export async function PublicGuard({
  children,
  redirectAuthenticatedTo,
}: {
  children: React.ReactNode;
  redirectAuthenticatedTo?: string;
}) {
  preloadAuthQuery(api.functions.auth.getCurrentUser);
  const user = await fetchAuthQuery(api.functions.auth.getCurrentUser);

  // If there is a logged-in user, enforce additional constraints.
  if (user) {
    const expiresAt = user.passwordExpiresAt ?? null;
    if (typeof expiresAt === "number" && expiresAt <= Date.now()) {
      redirect("/update-password");
    }

    if (!user.approved) {
      redirect("/approval-pending");
    }

    if (user.role !== "agent") {
      redirect("/forbidden");
    }

    if (redirectAuthenticatedTo) {
      redirect(redirectAuthenticatedTo);
    }
  }

  return <>{children}</>;
}

