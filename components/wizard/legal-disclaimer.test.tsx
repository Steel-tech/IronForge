// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Steel-Tech / StructuPath
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { LegalDisclaimer } from "@/components/wizard/legal-disclaimer";

describe("LegalDisclaimer", () => {
  it("always shows the not-legal-advice notice", () => {
    render(<LegalDisclaimer stateCode="WA" />);
    expect(screen.getByRole("note")).toHaveTextContent(/not legal advice/i);
  });

  it("shows the last-verified date for a verified state", () => {
    render(<LegalDisclaimer stateCode="WA" />);
    expect(screen.getByRole("note")).toHaveTextContent(/last verified/i);
  });

  it("flags a machine-generated state as not independently verified", () => {
    render(<LegalDisclaimer stateCode="AL" />);
    const note = screen.getByRole("note");
    expect(note).toHaveTextContent(/not independently verified/i);
    expect(note).not.toHaveTextContent(/last verified/i);
  });

  it("renders a generic notice when no state is known", () => {
    render(<LegalDisclaimer stateCode={null} />);
    expect(screen.getByRole("note")).toHaveTextContent(/not legal advice/i);
  });
});
