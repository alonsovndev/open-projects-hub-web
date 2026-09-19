import { describe, it, expect } from "vitest";

import { findProjectRequirements } from "@/features/viewer/api/find-project-requirements";

describe("findProjectRequirements", () => {
  it("should return null for empty project code", () => {
    const result = findProjectRequirements("");
    expect(result).toBeNull();
  });

  it("should return null for whitespace-only project code", () => {
    const result = findProjectRequirements("   ");
    expect(result).toBeNull();
  });

  it("should return project data for valid project code", () => {
    const result = findProjectRequirements("PRJ-2024-TEST");

    expect(result).not.toBeNull();
    expect(result?.code).toBe("PRJ-2024-TEST");
    expect(result?.projectTitle).toBe("Clinic Management System");
    expect(result?.stories).toHaveLength(3);
  });

  it("should return project with correct story structure", () => {
    const result = findProjectRequirements("TEST-123");

    expect(result).not.toBeNull();
    expect(result?.stories[0]).toHaveProperty("id");
    expect(result?.stories[0]).toHaveProperty("title");
    expect(result?.stories[0]).toHaveProperty("userStory");
    expect(result?.stories[0]).toHaveProperty("status");
    expect(result?.stories[0]).toHaveProperty("acceptanceCriteria");
  });

  it("should return project with user story fields", () => {
    const result = findProjectRequirements("ANY-ID");

    expect(result).not.toBeNull();
    const userStory = result?.stories[0].userStory;
    expect(userStory).toHaveProperty("userRole");
    expect(userStory).toHaveProperty("goal");
    expect(userStory).toHaveProperty("benefit");
  });

  it("should return project with acceptance criteria", () => {
    const result = findProjectRequirements("DEMO-001");

    expect(result).not.toBeNull();
    const criteria = result?.stories[0].acceptanceCriteria;
    expect(criteria).toBeDefined();
    expect(criteria!.length).toBeGreaterThan(0);
    expect(criteria![0]).toHaveProperty("given");
    expect(criteria![0]).toHaveProperty("when");
    expect(criteria![0]).toHaveProperty("then");
  });
});
