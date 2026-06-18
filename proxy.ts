// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Steel-Tech / StructuPath
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Edge middleware (Next.js 16 `proxy` convention).
 *
 * Responsibility: CSRF defense — verify the Origin header on every
 * state-changing API request so a cross-site page can't drive our endpoints.
 *
 * Not here:
 *  - Security headers (CSP/HSTS/etc.) are set centrally in next.config.ts so
 *    they also cover static assets, which this matcher excludes.
 *  - Rate limiting lives in each API route handler. Those limiters are
 *    in-memory and therefore per-instance on serverless — not a true global
 *    limit. A durable limiter (e.g. Upstash) replaces them in the Growth
 *    phase (plan U10).
 */

function isSameOrigin(req: NextRequest): boolean {
  const origin = req.headers.get("origin");
  const host = req.headers.get("host");
  if (!origin || !host) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Verify same-origin on all state-changing API requests (POST/PUT/PATCH/DELETE).
  if (pathname.startsWith("/api/") && req.method !== "GET" && req.method !== "HEAD") {
    if (!isSameOrigin(req)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  return NextResponse.next();
}

export const config = {
  // Only API routes need the CSRF gate; security headers are handled in
  // next.config.ts for every response (including static assets).
  matcher: ["/api/:path*"],
};
