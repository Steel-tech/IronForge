"use client";

// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Steel-Tech / StructuPath
import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void): () => void {
  if (typeof window === "undefined" || !window.matchMedia) return () => {};
  const mql = window.matchMedia(QUERY);
  mql.addEventListener("change", onChange);
  return () => mql.removeEventListener("change", onChange);
}

function getSnapshot(): boolean {
  return window.matchMedia(QUERY).matches;
}

// Server (and first client paint before hydration): motion allowed. Keeps SSR
// and initial client markup identical, then useSyncExternalStore reconciles.
function getServerSnapshot(): boolean {
  return false;
}

/**
 * Returns whether the user has requested reduced motion via the OS / browser
 * `prefers-reduced-motion: reduce` setting, staying in sync if the preference
 * changes at runtime.
 *
 * Uses `useSyncExternalStore` — the React-recommended way to subscribe to an
 * external store like `matchMedia`. SSR-safe and free of the setState-in-effect
 * cascade that a useEffect+useState version triggers.
 *
 * Consumers use this to skip or calm expensive animations:
 *   const reducedMotion = useReducedMotion();
 *   if (reducedMotion) return; // don't start the rAF loop
 */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
