import { handler } from "@/lib/auth-server";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const { GET, POST: basePOST } = handler;

export { GET };

const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 10; // 10 requests per minute

type Bucket = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, Bucket>();

function rateLimitKey(request: NextRequest): string | null {
  const url = new URL(request.url);
  const pathname = url.pathname;

  // Only rate limit login, register, and forgot-password style endpoints.
  const isLogin = pathname.startsWith("/api/auth/sign-in");
  const isRegister = pathname.startsWith("/api/auth/sign-up");
  const isForgotPassword = pathname.startsWith("/api/auth/password");

  if (!isLogin && !isRegister && !isForgotPassword) {
    return null;
  }

  const forwardedFor = request.headers.get("x-forwarded-for");
  const ip = forwardedFor?.split(",")[0].trim() ?? "unknown";

  return `${ip}:${pathname}`;
}

function checkAndUpdateRateLimit(request: NextRequest): boolean {
  const key = rateLimitKey(request);
  if (!key) return false;

  const now = Date.now();
  const existing = buckets.get(key);

  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  if (existing.count >= RATE_LIMIT_MAX_REQUESTS) {
    return true;
  }

  existing.count += 1;
  buckets.set(key, existing);
  return false;
}

export async function POST(request: NextRequest) {
  if (checkAndUpdateRateLimit(request)) {
    return new NextResponse("Too many requests. Please try again later.", {
      status: 429,
    });
  }
  return basePOST(request);
}
