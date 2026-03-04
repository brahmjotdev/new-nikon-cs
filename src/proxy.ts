import { NextRequest, NextResponse } from "next/server";

import { getToken } from "@/lib/auth-server";

// Authentication-only middleware:
// - Checks if a valid Better Auth token exists.
// - Never performs role or approval checks (handled by layouts + Convex backend).
const PublicRoutes = [
  "/login",
  "/register",
  "/approval-pending",
  "/admin-forgot-password",
  "/forgot-password",
  "/update-password",
  "/forbidden",
];

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Homepage → redirect to /notes
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/notes", request.url));
  }

  const isAuthenticated = await getToken();

  // ==============================
  // Public
  // ==============================

  const isPublicRoute = PublicRoutes.includes(pathname); // allow auth callbacks

  // If private AND not logged in → redirect // Basically blocks every protected page
  if (!isPublicRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  // If public AND logged in AND on login or register page → redirect away (don't show login/register again).
  // Do NOT redirect when on /approval-pending: new users must stay there until approved.
  if (
    isPublicRoute &&
    isAuthenticated &&
    (pathname === "/login" ||
      pathname === "/register" ||
      pathname === "/approval-pending")
  ) {
    return NextResponse.redirect(new URL("/notes", request.url));
  }

  return NextResponse.next();
}
export const config = {
  // Run middleware on all routes except static assets and api routes (include "/" for homepage redirect)
  matcher: ["/", "/((?!.*\\..*|_next|api/auth).+)", "/trpc(.*)"],
};
