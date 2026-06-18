// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Steel-Tech / StructuPath
import { describe, it, expect } from "vitest";
import { parseSseChunk, readChatStream } from "@/lib/chat/stream";

function streamFrom(chunks: string[]): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();
  return new ReadableStream({
    start(controller) {
      for (const chunk of chunks) controller.enqueue(encoder.encode(chunk));
      controller.close();
    },
  });
}

describe("parseSseChunk", () => {
  it("emits text from data frames", () => {
    const texts: string[] = [];
    parseSseChunk(
      'data: {"text":"Hello"}\n\ndata: {"text":" world"}\n',
      (t) => texts.push(t),
    );
    expect(texts).toEqual(["Hello", " world"]);
  });

  it("ignores [DONE] and non-data lines", () => {
    const texts: string[] = [];
    parseSseChunk("event: ping\ndata: [DONE]\n: a comment\n", (t) =>
      texts.push(t),
    );
    expect(texts).toEqual([]);
  });

  it("skips malformed JSON frames but keeps valid ones", () => {
    const texts: string[] = [];
    parseSseChunk('data: {not json}\ndata: {"text":"ok"}\n', (t) =>
      texts.push(t),
    );
    expect(texts).toEqual(["ok"]);
  });

  it("ignores frames without a string text field", () => {
    const texts: string[] = [];
    parseSseChunk('data: {"error":"boom"}\ndata: {"text":42}\n', (t) =>
      texts.push(t),
    );
    expect(texts).toEqual([]);
  });
});

describe("readChatStream", () => {
  it("assembles the full message and reports cumulative progress", async () => {
    const progress: string[] = [];
    const full = await readChatStream(
      streamFrom([
        'data: {"text":"Hel"}\n\n',
        'data: {"text":"lo"}\n\n',
        "data: [DONE]\n\n",
      ]),
      (p) => progress.push(p),
    );
    expect(full).toBe("Hello");
    expect(progress).toEqual(["Hel", "Hello"]);
  });

  it("reassembles a frame split mid-line across chunk boundaries", async () => {
    const progress: string[] = [];
    const full = await readChatStream(
      streamFrom([
        'data: {"text":"Hel', // partial line — no newline yet
        'lo"}\n\n',
        "data: [DONE]\n\n",
      ]),
      (p) => progress.push(p),
    );
    expect(full).toBe("Hello");
    expect(progress).toEqual(["Hello"]);
  });

  it("handles multiple frames delivered in a single chunk", async () => {
    const progress: string[] = [];
    const full = await readChatStream(
      streamFrom(['data: {"text":"a"}\n\ndata: {"text":"b"}\n\n']),
      (p) => progress.push(p),
    );
    expect(full).toBe("ab");
    expect(progress).toEqual(["a", "ab"]);
  });

  it("flushes a final frame that arrives without a trailing newline", async () => {
    const full = await readChatStream(
      streamFrom(['data: {"text":"end"}']),
      () => {},
    );
    expect(full).toBe("end");
  });

  it("returns an empty string when the stream carries no text frames", async () => {
    const full = await readChatStream(streamFrom(["data: [DONE]\n\n"]), () => {});
    expect(full).toBe("");
  });
});
