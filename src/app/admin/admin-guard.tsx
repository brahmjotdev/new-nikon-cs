import { fetchAuthQuery, preloadAuthQuery } from "@/lib/auth-server";
import { api } from "../../../convex/_generated/api";
import { redirect } from "next/navigation";
import { PasswordExpiryBanner } from "@/components/blocks/auth/password-expiry-banner";

export async function AdminGuard({ children }: { children: React.ReactNode }) {
  preloadAuthQuery(api.functions.auth.getCurrentUser);
  const user = await fetchAuthQuery(api.functions.auth.getCurrentUser);

  // Only enforce additional rules when we have a logged-in user.
  // Unauthenticated users are already blocked by the middleware.
  if (user) {
    const expiresAt = user.passwordExpiresAt ?? null;
    if (typeof expiresAt === "number" && expiresAt <= Date.now()) {
      redirect("/update-password");
    }

    if (user.role !== "admin") {
      redirect("/forbidden");
    }
  }

  return (
    <div>
      {user && <PasswordExpiryBanner user={user} />}
      <main>{children}</main>
    </div>
  );
}
