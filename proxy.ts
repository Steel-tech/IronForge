import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Rate limiter — in-memory sliding window per IP.
 * Limits /api/chat to MAX_REQUESTS per WINDOW_MS.
 */
const WINDOW_MS = 60_000; // 1 minute
const MAX_REQUESTS = 20; // 20 requests per minute

const rateLimitMap = new Map<
  string,
  { timestamps: number[]; blocked: boolean }
>();

// Cleanup stale entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitMap) {
    entry.timestamps = entry.timestamps.filter((t) => now - t < WINDOW_MS);
    if (entry.timestamps.length === 0) {
      rateLimitMap.delete(key);
    }
  }
}, 300_000);

function getRateLimitKey(req: NextRequest): string {
  // Prefer platform-set headers over spoofable x-forwarded-for
  // Vercel/Cloudflare set x-real-ip from the actual client connection
  return req.headers.get("x-real-ip") || "unknown";
}

function isRateLimited(key: string): boolean {
  const now = Date.now();
  let entry = rateLimitMap.get(key);

  if (!entry) {
    entry = { timestamps: [], blocked: false };
    rateLimitMap.set(key, entry);
  }

  // Prune old timestamps
  entry.timestamps = entry.timestamps.filter((t) => now - t < WINDOW_MS);

  if (entry.timestamps.length >= MAX_REQUESTS) {
    entry.blocked = true;
    return true;
  }

  entry.timestamps.push(now);
  entry.blocked = false;
  return false;
}

/**
 * Security headers applied to all responses.
 */
function addSecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=63072000; includeSubDomains; preload"
  );
  response.headers.set(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      `script-src 'self' 'unsafe-inline'${process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : ""}`,
      "style-src 'self' 'unsafe-inline'", // Tailwind injects inline styles
      "img-src 'self' data: blob:",
      "font-src 'self' https://fonts.gstatic.com",
      "connect-src 'self' https://api.anthropic.com",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; ")
  );
  return response;
}

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // === Rate limit /api/chat (POST only) ===
  if (pathname === "/api/chat" && req.method === "POST") {
    // CSRF: require and verify Origin header
    const origin = req.headers.get("origin");
    const host = req.headers.get("host");
    if (!origin || !host) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }
    const originHost = new URL(origin).host;
    if (originHost !== host) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    // Rate limit
    const key = getRateLimitKey(req);
    if (isRateLimited(key)) {
      const response = NextResponse.json(
        { error: "Too many requests. Please wait before sending another message." },
        { status: 429 }
      );
      response.headers.set("Retry-After", "60");
      return addSecurityHeaders(response);
    }
  }

  // === Security headers on all responses ===
  const response = NextResponse.next();
  return addSecurityHeaders(response);
}

export const config = {
  matcher: [
    // Match all paths except static files and _next internals
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
