// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Steel-Tech / StructuPath
import { describe, it, expect } from "vitest";
import {
  getPhaseContent,
  getStepByIds,
  getNextStep,
  getPrevStep,
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

describe("getPhaseContent — unavailable + static phases", () => {
  it("returns a valid merged phase carrying the unavailable step for an unknown code", () => {
    const phase = getPhaseContent("surety-bonding", "ZZ" as StateCode);
    assertValidPhase(phase);
    expect(phase.steps.some((s) => s.id === "data-unavailable")).toBe(true);
  });

  it("returns non-empty legal-federal content for any state", () => {
    assertValidPhase(getPhaseContent("legal-federal", "TX"));
  });

  it("returns a defined, empty-step phase for an unknown phase id (no throw)", () => {
    const phase = getPhaseContent("does-not-exist", "TX");
    expect(phase).toBeDefined();
    expect(phase.steps).toEqual([]);
  });
});

describe("wizard navigation (getNextStep / getPrevStep)", () => {
  const state: StateCode = "TX";

  it("advances to the next step within a phase", () => {
    const firstPhase = PHASE_DEFINITIONS[0].id;
    const steps = getPhaseContent(firstPhase, state).steps;
    expect(steps.length).toBeGreaterThanOrEqual(2);
    expect(getNextStep(firstPhase, steps[0].id, state)).toEqual({
      phaseId: firstPhase,
      stepId: steps[1].id,
    });
  });

  it("crosses to the next phase from the last step of a phase", () => {
    const firstPhase = PHASE_DEFINITIONS[0].id;
    const secondPhase = PHASE_DEFINITIONS[1].id;
    const steps = getPhaseContent(firstPhase, state).steps;
    const next = getNextStep(firstPhase, steps[steps.length - 1].id, state);
    expect(next?.phaseId).toBe(secondPhase);
    expect(next?.stepId).toBe(getPhaseContent(secondPhase, state).steps[0].id);
  });

  it("returns null past the last step of the last phase", () => {
    const lastPhase = PHASE_DEFINITIONS[PHASE_DEFINITIONS.length - 1].id;
    const steps = getPhaseContent(lastPhase, state).steps;
    expect(getNextStep(lastPhase, steps[steps.length - 1].id, state)).toBeNull();
  });

  it("returns null before the first step of the first phase", () => {
    const firstPhase = PHASE_DEFINITIONS[0].id;
    const firstId = getPhaseContent(firstPhase, state).steps[0].id;
    expect(getPrevStep(firstPhase, firstId, state)).toBeNull();
  });
});
