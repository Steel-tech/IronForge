"use client";

// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Steel-Tech / StructuPath
import { useEffect, useState } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

/**
 * Returns whether the user has requested reduced motion via the OS / browser
 * `prefers-reduced-motion: reduce` setting, and keeps the value in sync if the
 * preference changes at runtime.
 *
 * SSR-safe: defaults to `false` on the server and during the first client
 * render (no `window` access during render), then corrects in an effect. This
 * keeps server and initial client markup identical and avoids hydration drift.
 *
 * Consumers should use this to skip or calm expensive animations:
 *   const reducedMotion = useReducedMotion();
 *   if (reducedMotion) return; // don't start the rAF loop
 */
export function useReducedMotion(): boolean {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;

    const mql = window.matchMedia(QUERY);
    setReducedMotion(mql.matches);

    const onChange = (event: MediaQueryListEvent) => {
      setReducedMotion(event.matches);
    };

    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return reducedMotion;
}
