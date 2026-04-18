// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Steel-Tech / StructuPath
import Anthropic from "@anthropic-ai/sdk";
import { buildSystemPrompt } from "@/lib/ai/system-prompts";
import { getPhaseContent } from "@/content/phases";
import type { StateCode } from "@/content/phases";
import type { UserProfile } from "@/lib/types/wizard";
import { STATE_REGISTRY } from "@/content/state-registry";

// ── API key (read at module load, checked per-request) ──────
const apiKey = process.env.ANTHROPIC_API_KEY;

const client = new Anthropic({ timeout: 30_000 });

// ── Constants ────────────────────────────────────────────────
const MAX_MESSAGES = 50;
const MAX_MESSAGE_LENGTH = 10_000;
const VALID_ROLES = new Set(["user", "assistant"]);
const VALID_STATES = new Set(Object.keys(STATE_REGISTRY));

// ── Rate limiting (in-memory, per-IP) ───────────────────────
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT_MAX = 20; // 20 requests / minute / IP
const rateLimitStore = new Map<string, number[]>();

function getClientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  const cfIp = req.headers.get("cf-connecting-ip");
  if (cfIp) return cfIp.trim();
  return "unknown";
}

function checkRateLimit(ip: string): {
  allowed: boolean;
  retryAfter: number;
} {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW_MS;
  const timestamps = rateLimitStore.get(ip) ?? [];
  // Prune old entries
  const recent = timestamps.filter((t) => t > windowStart);

  if (recent.length >= RATE_LIMIT_MAX) {
    const oldest = recent[0];
    const retryAfter = Math.max(
      1,
      Math.ceil((oldest + RATE_LIMIT_WINDOW_MS - now) / 1000)
    );
    rateLimitStore.set(ip, recent);
    return { allowed: false, retryAfter };
  }

  recent.push(now);
  rateLimitStore.set(ip, recent);

  // Opportunistic cleanup: drop stale IPs if store grows
  if (rateLimitStore.size > 1000) {
    for (const [key, ts] of rateLimitStore.entries()) {
      const stillRecent = ts.filter((t) => t > windowStart);
      if (stillRecent.length === 0) rateLimitStore.delete(key);
      else rateLimitStore.set(key, stillRecent);
    }
  }

  return { allowed: true, retryAfter: 0 };
}

// ── Validation helpers ───────────────────────────────────────

function validateMessages(
  messages: unknown
): messages is Array<{ role: "user" | "assistant"; content: string }> {
  if (!Array.isArray(messages)) return false;
  if (messages.length === 0 || messages.length > MAX_MESSAGES) return false;

  for (const m of messages) {
    if (typeof m !== "object" || m === null) return false;
    if (!VALID_ROLES.has(m.role)) return false;
    if (typeof m.content !== "string") return false;
    if (m.content.length === 0 || m.content.length > MAX_MESSAGE_LENGTH)
      return false;
  }
  return true;
}

function validateProfile(profile: unknown): profile is UserProfile {
  if (typeof profile !== "object" || profile === null) return false;
  const p = profile as Record<string, unknown>;
  if (typeof p.state !== "string" || !VALID_STATES.has(p.state)) return false;
  if (typeof p.isVeteran !== "boolean") return false;
  if (typeof p.isDisabledVeteran !== "boolean") return false;
  if (typeof p.isMinority !== "boolean") return false;
  if (typeof p.isWomanOwned !== "boolean") return false;
  if (typeof p.businessName !== "string" || p.businessName.length > 200)
    return false;
  if (typeof p.tradeExperience !== "string" || p.tradeExperience.length > 20)
    return false;
  return true;
}

function sanitizeString(s: string, maxLen: number): string {
  return s.slice(0, maxLen).replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, "");
}

// ── Route handler ────────────────────────────────────────────

export async function POST(req: Request) {
  try {
    // ── Rate limit by IP ──
    const ip = getClientIp(req);
    const { allowed, retryAfter } = checkRateLimit(ip);
    if (!allowed) {
      return Response.json(
        {
          error: `Too many requests. Please wait ${retryAfter}s before trying again.`,
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(retryAfter),
          },
        }
      );
    }

    // Reject oversized payloads (256 KB hard limit on body)
    const bodyText = await req.text();
    if (bodyText.length > 256_000) {
      return Response.json(
        { error: "Request too large" },
        { status: 413 }
      );
    }

    const body = JSON.parse(bodyText);
    const { messages, phaseId, stepId, profile } = body as {
      messages: unknown;
      phaseId: unknown;
      stepId: unknown;
      profile: unknown;
    };

    // ── Validate messages ──
    if (!validateMessages(messages)) {
      return Response.json(
        {
          error:
            "Invalid messages. Must be an array of 1-50 messages with role (user/assistant) and content (string, max 10K chars).",
        },
        { status: 400 }
      );
    }

    // ── Validate profile ──
    if (!validateProfile(profile)) {
      return Response.json(
        { error: "Invalid profile." },
        { status: 400 }
      );
    }

    // ── Validate phaseId and stepId ──
    if (typeof phaseId !== "string" || typeof stepId !== "string") {
      return Response.json(
        { error: "Invalid phaseId or stepId." },
        { status: 400 }
      );
    }

    // ── Server-side step lookup (never trust client-provided step) ──
    const stateCode = profile.state as StateCode;
    const phaseContent = getPhaseContent(
      sanitizeString(phaseId, 50),
      stateCode
    );
    const step = phaseContent.steps.find(
      (s) => s.id === sanitizeString(stepId, 50)
    );

    if (!step) {
      return Response.json(
        { error: "Step not found for the given phase and state." },
        { status: 404 }
      );
    }

    // ── Check API key at request time ──
    if (!apiKey || apiKey === "your-anthropic-api-key-here") {
      return Response.json(
        { error: "AI service is not configured." },
        { status: 503 }
      );
    }

    // ── Build prompt from server-verified data ──
    const systemPrompt = buildSystemPrompt(step, profile, phaseContent.title);

    const stream = await client.messages.stream({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      system: systemPrompt,
      messages: messages.map((m) => ({
        role: m.role,
        content: sanitizeString(m.content, MAX_MESSAGE_LENGTH),
      })),
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (
              event.type === "content_block_delta" &&
              event.delta.type === "text_delta"
            ) {
              controller.enqueue(
                encoder.encode(
                  `data: ${JSON.stringify({ text: event.delta.text })}\n\n`
                )
              );
            }
          }
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch {
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ error: "Stream error" })}\n\n`
            )
          );
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-store",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    // Structured error logging — no raw error objects
    const message =
      error instanceof Error ? error.message : "Unknown error";
    console.error("[IronForge /api/chat]", message);
    return Response.json(
      { error: "Failed to process chat request" },
      { status: 500 }
    );
  }
}
