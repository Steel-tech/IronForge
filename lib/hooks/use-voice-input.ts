"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Voice input hook — thin wrapper around the Web Speech API.
 *
 * Consumer pattern:
 *   const { isListening, transcript, startListening, stopListening,
 *           isSupported, error } = useVoiceInput();
 *
 * - `transcript` is the combined final + interim text for this session.
 * - `startListening()` resets transcript and begins continuous capture.
 * - `stopListening()` ends the session; the last transcript snapshot stays
 *   available so the UI can copy it into an input.
 * - `isSupported` is `false` on browsers without SpeechRecognition (Firefox,
 *   most mobile Safari < 14.5). In that case the button should hide.
 */

// ── Web Speech API type shims ────────────────────────────────
// The DOM lib types for SpeechRecognition are not universally present,
// so we declare the minimum surface we use.

interface SRAlternative {
  transcript: string;
  confidence: number;
}
interface SRResult {
  readonly length: number;
  readonly isFinal: boolean;
  [index: number]: SRAlternative;
  item(index: number): SRAlternative;
}
interface SRResultList {
  readonly length: number;
  [index: number]: SRResult;
  item(index: number): SRResult;
}
interface SREventLike extends Event {
  readonly resultIndex: number;
  readonly results: SRResultList;
}
interface SRErrorEventLike extends Event {
  readonly error: string;
  readonly message?: string;
}

interface SpeechRecognitionLike extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  onresult: ((event: SREventLike) => void) | null;
  onerror: ((event: SRErrorEventLike) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

interface SRConstructor {
  new (): SpeechRecognitionLike;
}

type WindowWithSR = Window & {
  SpeechRecognition?: SRConstructor;
  webkitSpeechRecognition?: SRConstructor;
};

export interface UseVoiceInputReturn {
  isListening: boolean;
  transcript: string;
  startListening: () => void;
  stopListening: () => void;
  isSupported: boolean;
  error: string | null;
}

export function useVoiceInput(): UseVoiceInputReturn {
  const [isSupported, setIsSupported] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  // Keeps the committed portion of the transcript separate from the
  // interim hypothesis so interim updates don't overwrite finals.
  const finalRef = useRef<string>("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const w = window as WindowWithSR;
    const SR = w.SpeechRecognition ?? w.webkitSpeechRecognition;
    setIsSupported(Boolean(SR));
  }, []);

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      try {
        recognitionRef.current?.abort();
      } catch {
        // ignore
      }
      recognitionRef.current = null;
    };
  }, []);

  const startListening = useCallback(() => {
    if (typeof window === "undefined") return;
    const w = window as WindowWithSR;
    const SR = w.SpeechRecognition ?? w.webkitSpeechRecognition;
    if (!SR) {
      setError("Speech recognition is not supported in this browser.");
      return;
    }

    // If we're already listening, do nothing — prevents double-starts
    // throwing InvalidStateError.
    if (recognitionRef.current && isListening) return;

    try {
      const recognition = new SR();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang =
        (typeof navigator !== "undefined" && navigator.language) ||
        "en-US";
      recognition.maxAlternatives = 1;

      finalRef.current = "";
      setTranscript("");
      setError(null);

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: SREventLike) => {
        let interim = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          const alternative = result[0];
          if (!alternative) continue;
          if (result.isFinal) {
            finalRef.current += alternative.transcript;
          } else {
            interim += alternative.transcript;
          }
        }
        setTranscript((finalRef.current + " " + interim).trim());
      };

      recognition.onerror = (event: SRErrorEventLike) => {
        // "aborted" and "no-speech" are common and not worth surfacing
        if (event.error === "aborted" || event.error === "no-speech") return;
        if (event.error === "not-allowed" || event.error === "service-not-allowed") {
          setError("Microphone access denied. Enable it in your browser settings.");
        } else {
          setError(`Voice input error: ${event.error}`);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        recognitionRef.current = null;
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      setError(`Could not start voice input: ${msg}`);
      setIsListening(false);
      recognitionRef.current = null;
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    const recognition = recognitionRef.current;
    if (!recognition) {
      setIsListening(false);
      return;
    }
    try {
      recognition.stop();
    } catch {
      try {
        recognition.abort();
      } catch {
        // ignore
      }
    }
  }, []);

  return {
    isListening,
    transcript,
    startListening,
    stopListening,
    isSupported,
    error,
  };
}
