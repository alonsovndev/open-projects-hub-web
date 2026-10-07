import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { pendingStoriesStorage } from "@/features/refinement/model/pending-stories-storage";

const OWNER = "admin@test.com";
const KEY = `open-projects-hub.refinement-pending.${OWNER}`;

const story = {
  id: "story-1",
  title: "Markdown export",
  description: "As an Admin, I want to export so that I can share scope.",
  acceptanceCriteria: ["Export includes approved stories only"],
};

describe("pendingStoriesStorage", () => {
  beforeEach(() => {
    window.sessionStorage.clear();
  });

  afterEach(() => {
    window.sessionStorage.clear();
    vi.restoreAllMocks();
  });

  it("swallows storage errors instead of throwing", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("quota exceeded");
    });
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    vi.spyOn(Storage.prototype, "removeItem").mockImplementation(() => {
      throw new Error("blocked");
    });

    expect(() =>
      pendingStoriesStorage.save(OWNER, { projectId: "project-1", stories: [story] })
    ).not.toThrow();
    expect(pendingStoriesStorage.load(OWNER)).toBeNull();
    expect(() => pendingStoriesStorage.clear(OWNER)).not.toThrow();
  });

  it("round-trips stories", () => {
    pendingStoriesStorage.save(OWNER, { projectId: "project-1", stories: [story] });

    expect(pendingStoriesStorage.load(OWNER)).toEqual({
      projectId: "project-1",
      stories: [story],
    });
  });

  it("returns null when nothing is stored or after clear", () => {
    expect(pendingStoriesStorage.load(OWNER)).toBeNull();

    pendingStoriesStorage.save(OWNER, { projectId: "project-1", stories: [story] });
    pendingStoriesStorage.clear(OWNER);

    expect(pendingStoriesStorage.load(OWNER)).toBeNull();
  });

  it.each([
    ["corrupt JSON", "{not json"],
    ["a non-object", JSON.stringify("text")],
    ["a missing project", JSON.stringify({ stories: [story] })],
    ["a non-string project", JSON.stringify({ projectId: 7, stories: [story] })],
    ["an empty list", JSON.stringify({ projectId: "project-1", stories: [] })],
    [
      "a story with the wrong shape",
      JSON.stringify({ projectId: "project-1", stories: [{ ...story, acceptanceCriteria: [1] }] }),
    ],
  ])("ignores %s", (_label, raw) => {
    window.sessionStorage.setItem(KEY, raw);

    expect(pendingStoriesStorage.load(OWNER)).toBeNull();
  });

  it("keeps each account's stories separate", () => {
    pendingStoriesStorage.save(OWNER, { projectId: "project-1", stories: [story] });

    expect(pendingStoriesStorage.load("other@test.com")).toBeNull();
  });
});
