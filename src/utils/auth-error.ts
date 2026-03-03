import { ConvexError } from "convex/values";

export function isAuthError(error: unknown) {
  // This broadly matches potentially auth related errors, can be rewritten to
  // work with your app's own error handling.
  const message =
    (error instanceof ConvexError && error.data) ||
    (error instanceof Error && error.message) ||
    "";
  // Loose match for auth related errors
  return /auth/i.test(message);
}
