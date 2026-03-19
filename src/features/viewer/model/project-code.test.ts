import { describe, it, expect } from "vitest";
import { normalizeProjectCode, isValidProjectCode, projectCodePattern } from "./project-code";

describe("projectCodePattern", () => {
  it("should match valid project code format", () => {
    expect(projectCodePattern.test("PRJ-123456")).toBe(true);
  });

  it("should be case-insensitive", () => {
    expect(projectCodePattern.test("prj-123456")).toBe(true);
    expect(projectCodePattern.test("PrJ-123456")).toBe(true);
  });

  it("should reject invalid formats", () => {
    expect(projectCodePattern.test("ABC-123456")).toBe(false);
    expect(projectCodePattern.test("PRJ-12345")).toBe(false);
    expect(projectCodePattern.test("PRJ123456")).toBe(false);
  });
});

describe("normalizeProjectCode", () => {
  it("should trim whitespace", () => {
    expect(normalizeProjectCode("  PRJ-123456  ")).toBe("PRJ-123456");
  });

  it("should convert to uppercase", () => {
    expect(normalizeProjectCode("prj-123456")).toBe("PRJ-123456");
  });

  it("should handle mixed case", () => {
    expect(normalizeProjectCode("PrJ-123456")).toBe("PRJ-123456");
  });

  it("should preserve valid format", () => {
    expect(normalizeProjectCode("PRJ-123456")).toBe("PRJ-123456");
  });

  it("should handle whitespace and case together", () => {
    expect(normalizeProjectCode("  prj-123456  ")).toBe("PRJ-123456");
  });

  it("should remove special characters throughout the string", () => {
    expect(normalizeProjectCode("PRJ-123@456")).toBe("PRJ-123456");
    expect(normalizeProjectCode("PRJ-123$456")).toBe("PRJ-123456");
    expect(normalizeProjectCode("PRJ@123-456")).toBe("PRJ123-456");
  });

  it("should remove invalid characters at the end", () => {
    expect(normalizeProjectCode("PRJ-123456!!!")).toBe("PRJ-123456");
    expect(normalizeProjectCode("PRJ-123456@@@")).toBe("PRJ-123456");
  });
});

describe("isValidProjectCode", () => {
  it("should accept valid format PRJ-XXXXXX", () => {
    expect(isValidProjectCode("PRJ-123456")).toBe(true);
    expect(isValidProjectCode("PRJ-000000")).toBe(true);
    expect(isValidProjectCode("PRJ-999999")).toBe(true);
  });

  it("should accept lowercase valid format", () => {
    expect(isValidProjectCode("prj-123456")).toBe(true);
  });

  it("should accept mixed case", () => {
    expect(isValidProjectCode("PrJ-123456")).toBe(true);
  });

  it("should reject wrong prefix", () => {
    expect(isValidProjectCode("ABC-123456")).toBe(false);
    expect(isValidProjectCode("PROJECT-123456")).toBe(false);
  });

  it("should reject wrong number length", () => {
    expect(isValidProjectCode("PRJ-12345")).toBe(false); // 5 digits
    expect(isValidProjectCode("PRJ-1234567")).toBe(false); // 7 digits
    expect(isValidProjectCode("PRJ-123")).toBe(false); // 3 digits
  });

  it("should reject missing dash", () => {
    expect(isValidProjectCode("PRJ123456")).toBe(false);
  });

  it("should reject empty string", () => {
    expect(isValidProjectCode("")).toBe(false);
  });

  it("should handle whitespace before validation", () => {
    expect(isValidProjectCode("  PRJ-123456  ")).toBe(true);
  });

  it("should reject codes with special characters", () => {
    expect(isValidProjectCode("PRJ-12345$")).toBe(false);
    expect(isValidProjectCode("PRJ-12345@")).toBe(false);
  });

  it("should reject codes with letters in number part", () => {
    expect(isValidProjectCode("PRJ-12345A")).toBe(false);
    expect(isValidProjectCode("PRJ-ABC123")).toBe(false);
  });
});
