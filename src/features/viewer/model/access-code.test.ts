import { describe, it, expect } from "vitest";

import { accessCodePattern, isValidAccessCode, normalizeAccessCode } from "./access-code";

describe("normalizeAccessCode", () => {
  it("trims whitespace and uppercases what a person typed", () => {
    expect(normalizeAccessCode("  prj-7k3m9xq2 ")).toBe("PRJ-7K3M9XQ2");
  });
});

describe("accessCodePattern", () => {
  it("matches the generated shape", () => {
    expect(accessCodePattern.test("PRJ-7K3M9XQ2")).toBe(true);
  });

  it.each([
    ["the old six-digit demo code", "PRJ-123456"],
    ["a freelancer-chosen project code", "WEB"],
    ["a code that is too short", "PRJ-7K3M9XQ"],
    ["a code that is too long", "PRJ-7K3M9XQ22"],
    ["a look-alike character the generator never uses", "PRJ-7K3M9XO2"],
    ["a missing prefix", "7K3M9XQ2"],
  ])("rejects %s", (_description, code) => {
    expect(accessCodePattern.test(code)).toBe(false);
  });
});

describe("isValidAccessCode", () => {
  it("accepts a valid code typed in lowercase with surrounding spaces", () => {
    expect(isValidAccessCode(" prj-7k3m9xq2 ")).toBe(true);
  });

  it("rejects an empty value", () => {
    expect(isValidAccessCode("")).toBe(false);
  });
});
