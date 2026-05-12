import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import { message } from "antd";

import { useRefinementWorkspace } from "@/features/refinement/hooks/use-refinement-workspace";
import * as refinementApi from "@/features/refinement/api/refinement-api";
import type { StoryDraft, AISuggestion } from "@/features/refinement/types";

// Mock Ant Design message
vi.mock("antd", async () => {
  const actual = await vi.importActual("antd");
  return {
    ...actual,
    message: {
      success: vi.fn(),
      error: vi.fn(),
      warning: vi.fn(),
      info: vi.fn(),
    },
  };
});

// Mock API functions
vi.mock("@/features/refinement/api/refinement-api", () => ({
  refineStory: vi.fn(),
  saveStoryDraft: vi.fn(),
  getMockAISuggestions: vi.fn(),
  getMockStoryDrafts: vi.fn(),
}));

const mockSuggestions: AISuggestion[] = [
  {
    id: "suggestion-1",
    type: "title",
    content: "Improved User Authentication Feature",
    reasoning: "More descriptive title",
    confidence: 0.95,
  },
  {
    id: "suggestion-2",
    type: "description",
    content: "As a user, I want to authenticate securely so that I can access my account.",
    reasoning: "Follows user story format",
    confidence: 0.9,
  },
  {
    id: "suggestion-3",
    type: "criteria",
    content: "User can login\nUser can logout\nSession expires after 30 minutes",
    reasoning: "Clear acceptance criteria",
    confidence: 0.85,
  },
];

describe("useRefinementWorkspace", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Initial State", () => {
    it("should initialize with default story draft", () => {
      const { result } = renderHook(() => useRefinementWorkspace());

      expect(result.current.story).toMatchObject({
        title: "",
        description: "",
        acceptanceCriteria: [""],
        status: "draft",
      });
      expect(result.current.story.id).toMatch(/^story-\d+$/);
      expect(result.current.suggestions).toEqual([]);
      expect(result.current.refining).toBe(false);
      expect(result.current.saving).toBe(false);
    });

    it("should generate unique story IDs", () => {
      const { result: result1 } = renderHook(() => useRefinementWorkspace());
      const { result: result2 } = renderHook(() => useRefinementWorkspace());

      expect(result1.current.story.id).not.toBe(result2.current.story.id);
    });
  });

  describe("handleStoryChange", () => {
    it("should update story when handleStoryChange is called", () => {
      const { result } = renderHook(() => useRefinementWorkspace());

      const updatedStory: StoryDraft = {
        ...result.current.story,
        title: "New Title",
        description: "New Description",
      };

      act(() => {
        result.current.handleStoryChange(updatedStory);
      });

      expect(result.current.story.title).toBe("New Title");
      expect(result.current.story.description).toBe("New Description");
    });

    it("should update acceptance criteria", () => {
      const { result } = renderHook(() => useRefinementWorkspace());

      const updatedStory: StoryDraft = {
        ...result.current.story,
        acceptanceCriteria: ["Criteria 1", "Criteria 2", "Criteria 3"],
      };

      act(() => {
        result.current.handleStoryChange(updatedStory);
      });

      expect(result.current.story.acceptanceCriteria).toHaveLength(3);
      expect(result.current.story.acceptanceCriteria).toContain("Criteria 1");
    });
  });

  describe("handleRefine", () => {
    it("should show warning when story has no title and description", async () => {
      const { result } = renderHook(() => useRefinementWorkspace());

      await act(async () => {
        await result.current.handleRefine();
      });

      expect(message.warning).toHaveBeenCalledWith(
        "Please add a title or description before refining"
      );
      expect(refinementApi.refineStory).not.toHaveBeenCalled();
    });

    it("should call refineStory API when story has title", async () => {
      vi.mocked(refinementApi.refineStory).mockResolvedValue(mockSuggestions);

      const { result } = renderHook(() => useRefinementWorkspace());

      // Set story title first
      act(() => {
        result.current.handleStoryChange({
          ...result.current.story,
          title: "Test Story",
        });
      });

      await act(async () => {
        await result.current.handleRefine();
      });

      expect(refinementApi.refineStory).toHaveBeenCalledWith(
        result.current.story.id,
        "Test Story "
      );
    });

    it("should update suggestions and status after successful refinement", async () => {
      vi.mocked(refinementApi.refineStory).mockResolvedValue(mockSuggestions);

      const { result } = renderHook(() => useRefinementWorkspace());

      act(() => {
        result.current.handleStoryChange({
          ...result.current.story,
          title: "Test Story",
          description: "Test Description",
        });
      });

      await act(async () => {
        await result.current.handleRefine();
      });

      await waitFor(() => {
        expect(result.current.suggestions).toEqual(mockSuggestions);
        expect(result.current.story.status).toBe("refining");
        expect(message.success).toHaveBeenCalledWith("AI suggestions generated successfully!");
      });
    });

    it("should set refining state during API call", async () => {
      vi.mocked(refinementApi.refineStory).mockImplementation(
        () =>
          new Promise((resolve) => {
            setTimeout(() => resolve(mockSuggestions), 100);
          })
      );

      const { result } = renderHook(() => useRefinementWorkspace());

      act(() => {
        result.current.handleStoryChange({
          ...result.current.story,
          title: "Test Story",
        });
      });

      act(() => {
        result.current.handleRefine();
      });

      // Should be refining immediately
      expect(result.current.refining).toBe(true);

      await waitFor(() => {
        expect(result.current.refining).toBe(false);
      });
    });

    it("should handle API errors gracefully", async () => {
      const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
      vi.mocked(refinementApi.refineStory).mockRejectedValue(new Error("API Error"));

      const { result } = renderHook(() => useRefinementWorkspace());

      act(() => {
        result.current.handleStoryChange({
          ...result.current.story,
          title: "Test Story",
        });
      });

      await act(async () => {
        await result.current.handleRefine();
      });

      await waitFor(() => {
        expect(message.error).toHaveBeenCalledWith(
          "Failed to generate suggestions. Please try again."
        );
        expect(result.current.refining).toBe(false);
      });

      consoleErrorSpy.mockRestore();
    });
  });

  describe("handleApplySuggestion", () => {
    it("should apply title suggestion", () => {
      const { result } = renderHook(() => useRefinementWorkspace());

      const titleSuggestion: AISuggestion = {
        id: "sug-1",
        type: "title",
        content: "New Improved Title",
        confidence: 0.9,
      };

      act(() => {
        result.current.handleApplySuggestion(titleSuggestion);
      });

      expect(result.current.story.title).toBe("New Improved Title");
      expect(result.current.story.status).toBe("refined");
      expect(message.success).toHaveBeenCalledWith("Suggestion applied successfully!");
    });

    it("should apply description suggestion", () => {
      const { result } = renderHook(() => useRefinementWorkspace());

      const descriptionSuggestion: AISuggestion = {
        id: "sug-2",
        type: "description",
        content: "As a user, I want to...",
        confidence: 0.85,
      };

      act(() => {
        result.current.handleApplySuggestion(descriptionSuggestion);
      });

      expect(result.current.story.description).toBe("As a user, I want to...");
      expect(result.current.story.status).toBe("refined");
    });

    it("should apply criteria suggestion and split by newline", () => {
      const { result } = renderHook(() => useRefinementWorkspace());

      const criteriaSuggestion: AISuggestion = {
        id: "sug-3",
        type: "criteria",
        content: "Criteria 1\nCriteria 2\nCriteria 3",
        confidence: 0.88,
      };

      act(() => {
        result.current.handleApplySuggestion(criteriaSuggestion);
      });

      expect(result.current.story.acceptanceCriteria).toEqual([
        "Criteria 1",
        "Criteria 2",
        "Criteria 3",
      ]);
      expect(result.current.story.status).toBe("refined");
    });

    it("should filter out empty criteria lines", () => {
      const { result } = renderHook(() => useRefinementWorkspace());

      const criteriaSuggestion: AISuggestion = {
        id: "sug-4",
        type: "criteria",
        content: "Criteria 1\n\n\nCriteria 2\n  \nCriteria 3",
        confidence: 0.88,
      };

      act(() => {
        result.current.handleApplySuggestion(criteriaSuggestion);
      });

      expect(result.current.story.acceptanceCriteria).toEqual([
        "Criteria 1",
        "Criteria 2",
        "Criteria 3",
      ]);
    });

    it("should show info message for complete story suggestion", () => {
      const { result } = renderHook(() => useRefinementWorkspace());

      const completeSuggestion: AISuggestion = {
        id: "sug-5",
        type: "complete",
        content: "Complete story...",
        confidence: 0.92,
      };

      act(() => {
        result.current.handleApplySuggestion(completeSuggestion);
      });

      expect(message.info).toHaveBeenCalledWith(
        "Complete story suggestion - manual review recommended"
      );
    });
  });

  describe("handleSave", () => {
    it("should call saveStoryDraft API", async () => {
      const savedStory: StoryDraft = {
        id: "story-saved",
        title: "Saved Title",
        description: "Saved Description",
        acceptanceCriteria: ["Criteria 1"],
        status: "draft",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      vi.mocked(refinementApi.saveStoryDraft).mockResolvedValue(savedStory);

      const { result } = renderHook(() => useRefinementWorkspace());

      await act(async () => {
        await result.current.handleSave();
      });

      expect(refinementApi.saveStoryDraft).toHaveBeenCalled();
      expect(message.success).toHaveBeenCalledWith("Story saved successfully!");
    });

    it("should update story with saved data", async () => {
      const savedStory: StoryDraft = {
        id: "story-saved",
        title: "Saved Title",
        description: "Saved Description",
        acceptanceCriteria: ["Criteria 1"],
        status: "draft",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      vi.mocked(refinementApi.saveStoryDraft).mockResolvedValue(savedStory);

      const { result } = renderHook(() => useRefinementWorkspace());

      await act(async () => {
        await result.current.handleSave();
      });

      await waitFor(() => {
        expect(result.current.story.id).toBe("story-saved");
        expect(result.current.story.title).toBe("Saved Title");
      });
    });

    it("should set saving state during API call", async () => {
      vi.mocked(refinementApi.saveStoryDraft).mockImplementation(
        () =>
          new Promise((resolve) => {
            setTimeout(() => resolve({} as StoryDraft), 100);
          })
      );

      const { result } = renderHook(() => useRefinementWorkspace());

      act(() => {
        result.current.handleSave();
      });

      expect(result.current.saving).toBe(true);

      await waitFor(() => {
        expect(result.current.saving).toBe(false);
      });
    });

    it("should handle save errors gracefully", async () => {
      const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
      vi.mocked(refinementApi.saveStoryDraft).mockRejectedValue(new Error("Save failed"));

      const { result } = renderHook(() => useRefinementWorkspace());

      await act(async () => {
        await result.current.handleSave();
      });

      await waitFor(() => {
        expect(message.error).toHaveBeenCalledWith("Failed to save story. Please try again.");
        expect(result.current.saving).toBe(false);
      });

      consoleErrorSpy.mockRestore();
    });
  });
});
