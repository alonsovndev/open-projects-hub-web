import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { message } from "antd";

import { useRefinement } from "@/features/refinement/hooks/use-refinement";
import type { GeneratedStory } from "@/features/refinement/types";

vi.mock("antd", async () => {
  const actual = await vi.importActual("antd");
  return {
    ...actual,
    message: {
      success: vi.fn(),
      error: vi.fn(),
      warning: vi.fn(),
    },
  };
});

const mockGenerateStories = vi.fn();
const mockApproveDraft = vi.fn();
const mockApproveDraftsBulk = vi.fn();
const mockUpdateDraft = vi.fn();
const mockDeleteDraft = vi.fn();

vi.mock("@/features/refinement/api/refinement-api", () => ({
  useGenerateStoriesMutation: vi.fn(() => [mockGenerateStories, { isLoading: false }]),
  useApproveDraftMutation: vi.fn(() => [mockApproveDraft, { isLoading: false }]),
  useApproveDraftsBulkMutation: vi.fn(() => [mockApproveDraftsBulk, { isLoading: false }]),
  useUpdateDraftMutation: vi.fn(() => [mockUpdateDraft, { isLoading: false }]),
  useDeleteDraftMutation: vi.fn(() => [mockDeleteDraft, { isLoading: false }]),
}));

vi.mock("@/features/projects/api/projects-api", () => ({
  useGetProjectsQuery: vi.fn(() => ({
    data: {
      projects: [{ id: "project-1", name: "Hub", code: "HUB", clientName: "Acme" }],
    },
    isLoading: false,
  })),
}));

const draft: GeneratedStory = {
  id: "draft-1",
  title: "Markdown export",
  description: "As an Admin, I want to export the backlog so that I can share scope.",
  acceptanceCriteria: ["Export includes approved stories only"],
};

const RAW_NOTES = "Client wants login, project tracking, and export to markdown.";

const unwrapped = <T,>(value: T) => ({ unwrap: () => Promise.resolve(value) });
const rejected = (error: unknown) => ({ unwrap: () => Promise.reject(error) });

/** Select a project and generate, which is the precondition for every draft action. */
const generate = async (result: { current: ReturnType<typeof useRefinement> }) => {
  act(() => {
    result.current.handleProjectChange("project-1");
    result.current.handleNotesChange(RAW_NOTES);
  });

  await act(async () => {
    await result.current.handleGenerate();
  });
};

describe("useRefinement", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGenerateStories.mockReturnValue(
      unwrapped({ stories: [draft], rawNotes: RAW_NOTES, redactionCount: 0 })
    );
    mockApproveDraft.mockReturnValue(unwrapped({ id: draft.id, title: draft.title }));
    mockDeleteDraft.mockReturnValue(unwrapped(undefined));
    mockUpdateDraft.mockReturnValue(unwrapped({ id: draft.id }));
  });

  describe("generation", () => {
    it("shows generated drafts on success", async () => {
      const { result } = renderHook(() => useRefinement());

      await generate(result);

      expect(result.current.generatedStories).toEqual([draft]);
      expect(result.current.generationError).toBeNull();
    });

    it("blocks notes shorter than the minimum without calling the API", async () => {
      const { result } = renderHook(() => useRefinement());

      act(() => {
        result.current.handleProjectChange("project-1");
        result.current.handleNotesChange("too short");
      });

      await act(async () => {
        await result.current.handleGenerate();
      });

      expect(mockGenerateStories).not.toHaveBeenCalled();
      expect(message.error).toHaveBeenCalled();
    });

    it("blocks notes longer than the 5000-character cap without calling the API", async () => {
      const { result } = renderHook(() => useRefinement());

      act(() => {
        result.current.handleProjectChange("project-1");
        result.current.handleNotesChange("a".repeat(5001));
      });

      await act(async () => {
        await result.current.handleGenerate();
      });

      expect(mockGenerateStories).not.toHaveBeenCalled();
      expect(message.error).toHaveBeenCalled();
    });

    it("restores the preserved notes and surfaces the error when the provider fails", async () => {
      mockGenerateStories.mockReturnValueOnce(
        rejected({
          status: 502,
          data: {
            detail: "The AI provider took too long to respond.",
            failureClass: "timeout",
            provider: "gemini",
            rawNotes: RAW_NOTES,
          },
        })
      );

      const { result } = renderHook(() => useRefinement());

      await generate(result);

      expect(result.current.rawNotes).toBe(RAW_NOTES);
      expect(result.current.generationError).toContain("took too long");
      expect(result.current.generatedStories).toEqual([]);
    });

    it("resubmits the preserved notes on retry", async () => {
      mockGenerateStories.mockReturnValueOnce(
        rejected({
          status: 502,
          data: {
            detail: "The AI provider took too long to respond.",
            failureClass: "timeout",
            provider: "gemini",
            rawNotes: RAW_NOTES,
          },
        })
      );

      const { result } = renderHook(() => useRefinement());

      await generate(result);
      await act(async () => {
        await result.current.handleRetryGeneration();
      });

      expect(mockGenerateStories).toHaveBeenLastCalledWith({
        projectId: "project-1",
        rawNotes: RAW_NOTES,
      });
      await waitFor(() => expect(result.current.generationError).toBeNull());
      expect(result.current.generatedStories).toEqual([draft]);
    });

    it("ignores an error body that is not the documented 502 failure", async () => {
      // A 500 carrying a rawNotes-shaped body must not drive the retry path.
      mockGenerateStories.mockReturnValueOnce(
        rejected({
          status: 500,
          data: {
            detail: "boom",
            failureClass: "timeout",
            provider: "gemini",
            rawNotes: "attacker supplied",
          },
        })
      );

      const { result } = renderHook(() => useRefinement());

      await generate(result);

      expect(result.current.rawNotes).toBe(RAW_NOTES);
      expect(result.current.generationError).toContain("Your notes were kept");
    });

    it("clears a stale failure as soon as the notes change", async () => {
      mockGenerateStories.mockReturnValueOnce(
        rejected({
          status: 502,
          data: {
            detail: "The AI provider took too long to respond.",
            failureClass: "timeout",
            provider: "gemini",
            rawNotes: RAW_NOTES,
          },
        })
      );

      const { result } = renderHook(() => useRefinement());
      await generate(result);
      expect(result.current.generationError).not.toBeNull();

      act(() => {
        result.current.handleNotesChange("Completely different discovery notes for the team.");
      });

      expect(result.current.generationError).toBeNull();
    });

    it("reports how many payloads were stripped from the notes", async () => {
      mockGenerateStories.mockReturnValueOnce(
        unwrapped({ stories: [draft], rawNotes: RAW_NOTES, redactionCount: 2 })
      );

      const { result } = renderHook(() => useRefinement());
      await generate(result);

      expect(result.current.redactionCount).toBe(2);
    });
  });

  describe("approval gate", () => {
    it("does not approve until the confirmation is accepted", async () => {
      const { result } = renderHook(() => useRefinement());
      await generate(result);

      act(() => {
        result.current.handleRequestApproval(draft.id);
      });

      expect(result.current.pendingApproval).toEqual(draft);
      expect(mockApproveDraft).not.toHaveBeenCalled();
    });

    it("approves and removes the draft once confirmed", async () => {
      const { result } = renderHook(() => useRefinement());
      await generate(result);

      act(() => {
        result.current.handleRequestApproval(draft.id);
      });
      await act(async () => {
        await result.current.handleConfirmApproval();
      });

      expect(mockApproveDraft).toHaveBeenCalledWith(draft.id);
      expect(result.current.generatedStories).toEqual([]);
      expect(result.current.pendingApproval).toBeNull();
    });

    it("keeps the dialog open and marks the draft in flight while approving", async () => {
      let settle: (value: { id: string; title: string }) => void = () => {};
      mockApproveDraft.mockReturnValueOnce({
        unwrap: () =>
          new Promise<{ id: string; title: string }>((resolve) => {
            settle = resolve;
          }),
      });

      const { result } = renderHook(() => useRefinement());
      await generate(result);

      act(() => {
        result.current.handleRequestApproval(draft.id);
      });

      let confirmed: Promise<void> = Promise.resolve();
      act(() => {
        confirmed = result.current.handleConfirmApproval();
      });

      // Mid-flight the dialog is still up and the draft is flagged, which is what the
      // list uses to disable Edit, Discard, and Approve All.
      expect(result.current.approvingIds).toEqual([draft.id]);
      expect(result.current.pendingApproval).toEqual(draft);

      await act(async () => {
        settle({ id: draft.id, title: draft.title });
        await confirmed;
      });

      expect(result.current.approvingIds).toEqual([]);
      expect(result.current.pendingApproval).toBeNull();
    });

    it("leaves the draft in place when the confirmation is cancelled", async () => {
      const { result } = renderHook(() => useRefinement());
      await generate(result);

      act(() => {
        result.current.handleRequestApproval(draft.id);
      });
      act(() => {
        result.current.handleCancelApproval();
      });

      expect(mockApproveDraft).not.toHaveBeenCalled();
      expect(result.current.generatedStories).toEqual([draft]);
      expect(result.current.pendingApproval).toBeNull();
    });
  });

  describe("discarding a draft", () => {
    it("deletes the draft server-side before dropping it from the list", async () => {
      const { result } = renderHook(() => useRefinement());
      await generate(result);

      await act(async () => {
        await result.current.handleDelete(draft.id);
      });

      expect(mockDeleteDraft).toHaveBeenCalledWith(draft.id);
      expect(result.current.generatedStories).toEqual([]);
    });

    it("keeps the draft listed when the delete fails", async () => {
      mockDeleteDraft.mockReturnValueOnce(rejected({ status: 500 }));

      const { result } = renderHook(() => useRefinement());
      await generate(result);

      await act(async () => {
        await result.current.handleDelete(draft.id);
      });

      expect(result.current.generatedStories).toEqual([draft]);
      expect(message.error).toHaveBeenCalled();
    });
  });
});
