"use client";

import type { Doc } from "../../../../convex/betterAuth/_generated/dataModel";
import Link from "next/link";

const ONE_DAY_MS = 24 * 60 * 60 * 1000; // 1 day in milliseconds

export function PasswordExpiryBanner({ user }: { user: Doc<"user"> }) {
  const expiresAt = user.passwordExpiresAt ?? null;
  const now = Date.now();
  const showExpiryWarning =
    expiresAt !== null && expiresAt > now && expiresAt - now <= ONE_DAY_MS;

  if (!showExpiryWarning) return null;

  return (
    <div className="w-full bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2 text-sm flex items-center justify-center gap-2">
      <span>Your password will expire soon.</span>
      <Link href="/update-password" className="underline">
        Update it now
      </Link>
    </div>
  );
}
