import Anthropic from "@anthropic-ai/sdk";
import { buildOnboardingPrompt } from "@/lib/ai/onboarding-prompt";

// ── API key (read at module load, checked per-request) ──────
const apiKey = process.env.ANTHROPIC_API_KEY;

const client = new Anthropic({ timeout: 30_000 });

// ── Constants ────────────────────────────────────────────────
const MAX_MESSAGES = 40;
const MAX_MESSAGE_LENGTH = 4_000;
const VALID_ROLES = new Set(["user", "assistant"]);

// ── Rate limiting (in-memory, per-IP) ───────────────────────
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 30;
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

  if (rateLimitStore.size > 1000) {
    for (const [key, ts] of rateLimitStore.entries()) {
      const stillRecent = ts.filter((t) => t > windowStart);
      if (stillRecent.length === 0) rateLimitStore.delete(key);
      else rateLimitStore.set(key, stillRecent);
    }
  }

  return { allowed: true, retryAfter: 0 };
}

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

function sanitizeString(s: string, maxLen: number): string {
  return s.slice(0, maxLen).replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, "");
}

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);
    const { allowed, retryAfter } = checkRateLimit(ip);
    if (!allowed) {
      return Response.json(
        {
          error: `Too many requests. Please wait ${retryAfter}s before trying again.`,
        },
        {
          status: 429,
          headers: { "Retry-After": String(retryAfter) },
        }
      );
    }

    const bodyText = await req.text();
    if (bodyText.length > 128_000) {
      return Response.json(
        { error: "Request too large" },
        { status: 413 }
      );
    }

    const body = JSON.parse(bodyText);
    const { messages } = body as { messages: unknown };

    if (!validateMessages(messages)) {
      return Response.json(
        {
          error:
            "Invalid messages. Must be an array of 1-40 messages with role (user/assistant) and content (string, max 4K chars).",
        },
        { status: 400 }
      );
    }

    if (!apiKey || apiKey === "your-anthropic-api-key-here") {
      return Response.json(
        { error: "AI service is not configured." },
        { status: 503 }
      );
    }

    const systemPrompt = buildOnboardingPrompt();

    const stream = await client.messages.stream({
      model: "claude-sonnet-4-20250514",
      max_tokens: 512,
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
    const message =
      error instanceof Error ? error.message : "Unknown error";
    console.error("[IronForge /api/onboarding]", message);
    return Response.json(
      { error: "Failed to process onboarding request" },
      { status: 500 }
    );
  }
}
