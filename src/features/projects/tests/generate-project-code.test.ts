import { describe, it, expect } from "vitest";

import { generateProjectCode } from "@/features/projects/utils/generate-project-code";

describe("generateProjectCode", () => {
  it("uses initials for multi-word names", () => {
    expect(generateProjectCode("Open Projects Hub")).toBe("OPH");
  });

  it("uses the first letters of a single word", () => {
    expect(generateProjectCode("Website")).toBe("WEBS");
  });

  it("caps initials at six characters", () => {
    expect(generateProjectCode("one two three four five six seven eight")).toBe("OTTFFS");
  });

  it("strips accents and symbols", () => {
    expect(generateProjectCode("Café & Señor -- App")).toBe("CSA");
  });

  it("keeps digits", () => {
    expect(generateProjectCode("Phase 2")).toBe("P2");
  });

  it("returns an empty string when too short to be a valid code", () => {
    expect(generateProjectCode("")).toBe("");
    expect(generateProjectCode("  a ")).toBe("");
    expect(generateProjectCode("!!!")).toBe("");
  });
});
