import { fetchAuthQuery, preloadAuthQuery } from "@/lib/auth-server";
import { api } from "../../../convex/_generated/api";
import { redirect } from "next/navigation";
import { PasswordExpiryBanner } from "@/components/blocks/auth/password-expiry-banner";

export async function AppGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  preloadAuthQuery(api.functions.auth.getCurrentUser);
  const user = await fetchAuthQuery(api.functions.auth.getCurrentUser);

  // If there is a logged-in user, enforce additional constraints.
  // We intentionally do NOT redirect when user is null here to avoid
  // middleware ↔ guard redirect loops; unauthenticated users are
  // already blocked by `src/proxy.ts`.
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
  }

  return (
    <>
      {user && <PasswordExpiryBanner user={user} />}
      <main className="flex min-h-screen flex-col">{children}</main>
    </>
  );
}
