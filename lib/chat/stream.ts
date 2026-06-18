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
  let buffer = "";

  const handleDelta = (delta: string) => {
    full += delta;
    onProgress(full);
  };

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    // SSE frames are not guaranteed to be chunk-aligned: a single `data:` line
    // can be split across reads. Buffer until a newline, parse only complete
    // lines, and carry the trailing partial line into the next read.
    buffer += decoder.decode(value, { stream: true });
    const lastNewline = buffer.lastIndexOf("\n");
    if (lastNewline === -1) continue;
    parseSseChunk(buffer.slice(0, lastNewline + 1), handleDelta);
    buffer = buffer.slice(lastNewline + 1);
  }

  // Flush the decoder's remainder plus any trailing frame that arrived without
  // a final newline.
  buffer += decoder.decode();
  if (buffer) parseSseChunk(buffer, handleDelta);

  return full;
}
