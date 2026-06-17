// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Steel-Tech / StructuPath
import { describe, it, expect } from "vitest";
import {
  getPhaseContent,
  getStepByIds,
  PHASE_DEFINITIONS,
  type StateCode,
} from "@/content/phases";
import { STATE_REGISTRY } from "@/content/state-registry";
import type { Phase, Step } from "@/lib/types/content";

const PHASE_IDS = PHASE_DEFINITIONS.map((p) => p.id);
const STATE_CODES = Object.keys(STATE_REGISTRY) as StateCode[];

function assertValidStep(step: Step) {
  expect(typeof step.id).toBe("string");
  expect(step.id.length).toBeGreaterThan(0);
  expect(typeof step.title).toBe("string");
  expect(step.title.length).toBeGreaterThan(0);
  expect(Array.isArray(step.checklist)).toBe(true);
  expect(Array.isArray(step.resources)).toBe(true);
  expect(Array.isArray(step.tips)).toBe(true);
  expect(Array.isArray(step.warnings)).toBe(true);
  expect(step.estimatedCost).toBeTypeOf("object");
  expect(step.estimatedCost.min).toBeTypeOf("number");
  expect(step.estimatedCost.max).toBeTypeOf("number");
  expect(step.aiContext).toBeTypeOf("string");
}

function assertValidPhase(phase: Phase) {
  expect(phase.id).toBeTypeOf("string");
  expect(phase.title.length).toBeGreaterThan(0);
  expect(Array.isArray(phase.steps)).toBe(true);
  expect(phase.steps.length).toBeGreaterThan(0);
  for (const step of phase.steps) assertValidStep(step);
}

describe("getPhaseContent — content contract", () => {
  it("covers exactly the 50 states", () => {
    expect(STATE_CODES.length).toBe(50);
  });

  it("resolves valid, non-empty content for every state × phase", () => {
    for (const state of STATE_CODES) {
      for (const phaseId of PHASE_IDS) {
        assertValidPhase(getPhaseContent(phaseId, state));
      }
    }
  });

  it("serves generated (not Washington) content for a non-WA state", () => {
    const wa = getPhaseContent("business-formation", "WA");
    const tx = getPhaseContent("business-formation", "TX");
    expect(JSON.stringify(tx)).not.toBe(JSON.stringify(wa));
  });

  it("returns a labeled 'unavailable' phase — never Washington's — for an unknown code", () => {
    const unknown = getPhaseContent("business-formation", "ZZ" as StateCode);
    const wa = getPhaseContent("business-formation", "WA");
    expect(unknown.steps[0].id).toBe("data-unavailable");
    expect(unknown.steps[0].title).toContain("ZZ");
    expect(JSON.stringify(unknown)).not.toBe(JSON.stringify(wa));
  });

  it("returns a well-formed (non-empty, valid) phase even for an unknown code", () => {
    assertValidPhase(getPhaseContent("contractor-licensing", "ZZ" as StateCode));
  });

  it("lets the chat-route step lookup find a phase's first step (parity)", () => {
    const state: StateCode = "CO";
    const phase = getPhaseContent("contractor-licensing", state);
    const firstId = phase.steps[0].id;
    const found = getStepByIds("contractor-licensing", firstId, state);
    expect(found).not.toBeNull();
    expect(found?.id).toBe(firstId);
  });
});
