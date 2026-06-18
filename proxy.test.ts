// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Steel-Tech / StructuPath
import { describe, it, expect } from "vitest";
import { NextRequest } from "next/server";
import { proxy } from "@/proxy";

const HOST = "localhost:3000";

function request(
  path: string,
  method: string,
  headers: Record<string, string> = {},
): NextRequest {
  return new NextRequest(new URL(`http://${HOST}${path}`), { method, headers });
}

const API_POST_ROUTES = ["/api/chat", "/api/bid-review", "/api/onboarding"];

describe("proxy — CSRF/origin gate", () => {
  it("blocks cross-origin POSTs to every API route", () => {
    for (const path of API_POST_ROUTES) {
      const res = proxy(
        request(path, "POST", { origin: "https://evil.example", host: HOST }),
      );
      expect(res.status).toBe(403);
    }
  });

  it("blocks API POSTs with a missing Origin header", () => {
    for (const path of API_POST_ROUTES) {
      const res = proxy(request(path, "POST", { host: HOST }));
      expect(res.status).toBe(403);
    }
  });

  it("blocks API POSTs with a malformed Origin", () => {
    const res = proxy(
      request("/api/chat", "POST", { origin: "not-a-url", host: HOST }),
    );
    expect(res.status).toBe(403);
  });

  it("allows same-origin API POSTs through", () => {
    for (const path of API_POST_ROUTES) {
      const res = proxy(
        request(path, "POST", { origin: `http://${HOST}`, host: HOST }),
      );
      expect(res.status).not.toBe(403);
    }
  });

  it("does not gate safe GET requests", () => {
    const res = proxy(
      request("/api/chat", "GET", { origin: "https://evil.example", host: HOST }),
    );
    expect(res.status).not.toBe(403);
  });
});
