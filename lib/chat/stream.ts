// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Steel-Tech / StructuPath
/**
 * Client-side parsing of the chat SSE stream returned by /api/chat. The server
 * emits `data: {"text": "..."}` lines and a terminal `data: [DONE]`. Extracted
 * from the wizard page so the parsing is unit-testable in isolation.
 */

/** Parse one decoded SSE chunk, invoking onText for each text delta found. */
export function parseSseChunk(
  chunk: string,
  onText: (text: string) => void,
): void {
  for (const line of chunk.split("\n")) {
    if (!line.startsWith("data: ")) continue;
    const data = line.slice(6);
    if (data === "[DONE]") continue;
    try {
      const parsed = JSON.parse(data);
      if (typeof parsed.text === "string") onText(parsed.text);
    } catch {
      // Skip malformed JSON frames.
    }
  }
}

/**
 * Read a chat SSE response body to completion. Calls onProgress with the
 * accumulated text after each delta (for live streaming UI) and resolves with
 * the full assembled message.
 */
export async function readChatStream(
  body: ReadableStream<Uint8Array>,
  onProgress: (fullText: string) => void,
): Promise<string> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let full = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    parseSseChunk(decoder.decode(value, { stream: true }), (delta) => {
      full += delta;
      onProgress(full);
    });
  }

  return full;
}
