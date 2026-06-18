// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Steel-Tech / StructuPath

/**
 * Centralized Claude model IDs.
 *
 * Every model reference lives here so a model migration is a one-line change.
 * Model IDs are exact strings — never append date suffixes.
 *
 * Tiering:
 * - MENTOR   — wizard chat + onboarding extraction: fast, cheap, conversational.
 * - ANALYSIS — bid-review contract analysis: depth matters, low volume.
 *
 * Migrated 2026-06-17 off `claude-sonnet-4-20250514`, which retired 2026-06-15
 * and now returns 404 on every request.
 */
export const MODELS = {
  /** Wizard chat mentor and onboarding extraction. */
  MENTOR: "claude-sonnet-4-6",
  /** Bid-review contract analysis. */
  ANALYSIS: "claude-opus-4-8",
} as const;
