// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Steel-Tech / StructuPath
import { describe, it, expect } from "vitest";
import {
  toProgressJson,
  toProgressCsv,
  type ProgressExport,
} from "@/lib/export/progress-export";

function sample(overrides: Partial<ProgressExport> = {}): ProgressExport {
  return {
    generatedAt: "2026-06-17T00:00:00.000Z",
    state: "TX",
    stateName: "Texas",
    businessName: "Lone Star Ironworks",
    overallPercent: 50,
    completedItems: 10,
    totalItems: 20,
    phasesComplete: 2,
    totalPhases: 7,
    startedAt: "2026-06-01T00:00:00.000Z",
    phases: [
      {
        id: "business-formation",
        title: "Business Formation",
        totalSteps: 4,
        visitedSteps: 4,
        totalItems: 8,
        completedItems: 8,
        minCost: 500,
        maxCost: 1200,
      },
      {
        id: "contractor-licensing",
        title: "Contractor Licensing",
        totalSteps: 3,
        visitedSteps: 1,
        totalItems: 12,
        completedItems: 2,
        minCost: 300,
        maxCost: 900,
      },
    ],
    ...overrides,
  };
}

describe("toProgressJson", () => {
  it("produces valid JSON carrying the user's progress", () => {
    const parsed = JSON.parse(toProgressJson(sample()));
    expect(parsed.state).toBe("TX");
    expect(parsed.overallPercent).toBe(50);
    expect(parsed.phases).toHaveLength(2);
    expect(parsed.phases[0].title).toBe("Business Formation");
  });

  it("is well-formed for empty progress", () => {
    const parsed = JSON.parse(
      toProgressJson(
        sample({
          completedItems: 0,
          totalItems: 0,
          overallPercent: 0,
          phasesComplete: 0,
          phases: [],
        }),
      ),
    );
    expect(parsed.phases).toEqual([]);
    expect(parsed.overallPercent).toBe(0);
  });
});

describe("toProgressCsv", () => {
  it("emits a header row plus one row per phase", () => {
    const lines = toProgressCsv(sample()).split("\n");
    expect(lines[0]).toBe(
      "Phase,Steps Visited,Total Steps,Items Completed,Total Items,Min Cost,Max Cost",
    );
    expect(lines).toHaveLength(3); // header + 2 phases
    expect(lines[1]).toContain("Business Formation");
  });

  it("escapes a phase title containing a comma", () => {
    const csv = toProgressCsv(
      sample({
        phases: [
          {
            id: "x",
            title: "Legal, Federal",
            totalSteps: 1,
            visitedSteps: 1,
            totalItems: 1,
            completedItems: 1,
            minCost: 0,
            maxCost: 0,
          },
        ],
      }),
    );
    expect(csv).toContain('"Legal, Federal"');
  });

  it("is well-formed (header only) for empty progress", () => {
    expect(toProgressCsv(sample({ phases: [] })).split("\n")).toHaveLength(1);
  });
});
