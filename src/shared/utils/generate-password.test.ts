import { describe, it, expect } from "vitest";

import { generateTemporaryPassword } from "@/shared/utils/generate-password";

describe("generateTemporaryPassword", () => {
  it("returns a 12 character password by default", () => {
    expect(generateTemporaryPassword()).toHaveLength(12);
  });

  it("always contains a letter and a digit", () => {
    for (let attempt = 0; attempt < 200; attempt += 1) {
      const password = generateTemporaryPassword(8);
      expect(password).toMatch(/[A-Za-z]/);
      expect(password).toMatch(/\d/);
    }
  });

  it("avoids look-alike characters", () => {
    for (let attempt = 0; attempt < 200; attempt += 1) {
      expect(generateTemporaryPassword()).not.toMatch(/[01OlI]/);
    }
  });

  it("generates different values", () => {
    expect(generateTemporaryPassword()).not.toBe(generateTemporaryPassword());
  });
});
