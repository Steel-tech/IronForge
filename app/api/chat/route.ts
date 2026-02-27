import Anthropic from "@anthropic-ai/sdk";
import { buildSystemPrompt } from "@/lib/ai/system-prompts";
import type { Step } from "@/lib/types/content";
import type { UserProfile } from "@/lib/types/wizard";

const client = new Anthropic();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      messages,
      step,
      profile,
      phaseName,
    }: {
      messages: Array<{ role: "user" | "assistant"; content: string }>;
      step: Step;
      profile: UserProfile;
      phaseName: string;
    } = body;

    if (!messages || !step || !profile || !phaseName) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    const systemPrompt = buildSystemPrompt(step, profile, phaseName);

    const stream = await client.messages.stream({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      system: systemPrompt,
      messages: messages.map((m) => ({
        role: m.role,
        content: m.content,
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
                encoder.encode(`data: ${JSON.stringify({ text: event.delta.text })}\n\n`)
              );
            }
          }
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch (err) {
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
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return Response.json(
      { error: "Failed to process chat request" },
      { status: 500 }
    );
  }
}
