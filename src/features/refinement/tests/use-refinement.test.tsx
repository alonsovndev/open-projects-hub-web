import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { message } from "antd";

import { useRefinement } from "@/features/refinement/hooks/use-refinement";
import { pendingStoriesStorage } from "@/features/refinement/model/pending-stories-storage";
import type { RefinedStory } from "@/features/refinement/types";

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

let mockUserEmail: string | null = "admin@test.com";

vi.mock("@/features/auth/hooks/use-auth", () => ({
  useAuth: () => ({ user: mockUserEmail ? { email: mockUserEmail } : null }),
}));

const mockGenerateStories = vi.fn();
const mockApproveStory = vi.fn();
const mockApproveStoriesBulk = vi.fn();

vi.mock("@/features/refinement/api/refinement-api", () => ({
  useGenerateStoriesMutation: vi.fn(() => [mockGenerateStories, { isLoading: false }]),
  useApproveStoryMutation: vi.fn(() => [mockApproveStory, { isLoading: false }]),
  useApproveStoriesBulkMutation: vi.fn(() => [mockApproveStoriesBulk, { isLoading: false }]),
}));

// Mocked like the other RTK Query hooks: these tests render the hook without a Provider,
// so a real query would have no store to subscribe to. Credits and keys are set to the
// common case (credits available, no user key), which is the state the generation tests
// below assume.
const mockCreditBalance = vi.fn(() => ({ data: { credits: 3, totalGranted: 5 } }));
const mockApiKeys = vi.fn(() => ({ data: [] }));

vi.mock("@/features/settings/api/ai-providers-api", () => ({
  useGetCreditBalanceQuery: () => mockCreditBalance(),
  useGetApiKeysQuery: () => mockApiKeys(),
}));

vi.mock("@/features/projects/api/projects-api", () => ({
  useGetProjectsQuery: vi.fn(() => ({
    data: {
      projects: [{ id: "project-1", name: "Hub", code: "HUB", clientName: "Acme" }],
    },
    isLoading: false,
  })),
}));

const draft: RefinedStory = {
  title: "Markdown export",
  description: "As an Admin, I want to export the backlog so that I can share scope.",
  acceptanceCriteria: ["Export includes approved stories only"],
};

/** What the hook holds for a story: the API content plus a client-side list key. */
const heldStory = (id: string) => ({ ...draft, id });

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
  afterEach(() => {
    vi.restoreAllMocks();
  });

  beforeEach(() => {
    vi.clearAllMocks();
    window.sessionStorage.clear();
    mockUserEmail = "admin@test.com";
    mockGenerateStories.mockReturnValue(
      unwrapped({ stories: [draft], rawNotes: RAW_NOTES, redactionCount: 0 })
    );
    mockApproveStory.mockReturnValue(unwrapped({ id: "story-1", title: draft.title }));
    mockApproveStoriesBulk.mockReturnValue(
      unwrapped({ approvedCount: 1, stories: [{ id: "story-1", title: draft.title }] })
    );
  });

  describe("generation", () => {
    it("shows generated drafts on success", async () => {
      const { result } = renderHook(() => useRefinement());

      await generate(result);

      expect(result.current.generatedStories).toEqual([{ ...draft, id: expect.any(String) }]);
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

    it("keeps local notes and shows safe guidance when the provider fails", async () => {
      mockGenerateStories.mockReturnValueOnce(
        rejected({
          status: 502,
          data: {
            detail: "<SENSITIVE_PROVIDER_DETAIL>",
            failureClass: "timeout",
            provider: "gemini",
            rawNotes: "<SENSITIVE_ECHOED_NOTES>",
          },
        })
      );

      const { result } = renderHook(() => useRefinement());

      await generate(result);

      expect(result.current.rawNotes).toBe(RAW_NOTES);
      expect(result.current.generationError).toBe(
        "The AI provider took too long to respond. Your notes were kept. Try again."
      );
      expect(result.current.rawNotes).not.toContain("<SENSITIVE_ECHOED_NOTES>");
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
        provider: "platform",
      });
      await waitFor(() => expect(result.current.generationError).toBeNull());
      expect(result.current.generatedStories).toEqual([{ ...draft, id: expect.any(String) }]);
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
    /** The list key the hook assigned to the single generated story. */
    const heldId = (result: { current: ReturnType<typeof useRefinement> }) =>
      result.current.generatedStories[0].id;

    it("does not approve until the confirmation is accepted", async () => {
      const { result } = renderHook(() => useRefinement());
      await generate(result);
      const storyId = heldId(result);

      act(() => {
        result.current.handleRequestApproval(storyId);
      });

      expect(result.current.pendingApproval).toEqual(heldStory(storyId));
      expect(mockApproveStory).not.toHaveBeenCalled();
    });

    it("sends the story content and project on approval, then removes it from the list", async () => {
      const { result } = renderHook(() => useRefinement());
      await generate(result);

      act(() => {
        result.current.handleRequestApproval(heldId(result));
      });
      await act(async () => {
        await result.current.handleConfirmApproval();
      });

      // Content, not an id: nothing exists server-side until this call.
      expect(mockApproveStory).toHaveBeenCalledWith({ projectId: "project-1", ...draft });
      expect(result.current.generatedStories).toEqual([]);
      expect(result.current.pendingApproval).toBeNull();
    });

    it("approves the edited content, not the generated original", async () => {
      const { result } = renderHook(() => useRefinement());
      await generate(result);
      const storyId = heldId(result);

      act(() => {
        result.current.handleSaveEdit({ ...heldStory(storyId), title: "Edited title" });
      });
      act(() => {
        result.current.handleRequestApproval(storyId);
      });
      await act(async () => {
        await result.current.handleConfirmApproval();
      });

      expect(mockApproveStory).toHaveBeenCalledWith({
        projectId: "project-1",
        ...draft,
        title: "Edited title",
      });
    });

    it("keeps the story and reports an error when approval fails", async () => {
      mockApproveStory.mockReturnValueOnce(rejected({ status: 500 }));

      const { result } = renderHook(() => useRefinement());
      await generate(result);

      act(() => {
        result.current.handleRequestApproval(heldId(result));
      });
      await act(async () => {
        await result.current.handleConfirmApproval();
      });

      expect(result.current.generatedStories).toHaveLength(1);
      expect(message.error).toHaveBeenCalled();
    });

    it("keeps the dialog open and marks the story in flight while approving", async () => {
      let settle: (value: { id: string; title: string }) => void = () => {};
      mockApproveStory.mockReturnValueOnce({
        unwrap: () =>
          new Promise<{ id: string; title: string }>((resolve) => {
            settle = resolve;
          }),
      });

      const { result } = renderHook(() => useRefinement());
      await generate(result);
      const storyId = heldId(result);

      act(() => {
        result.current.handleRequestApproval(storyId);
      });

      let confirmed: Promise<void> = Promise.resolve();
      act(() => {
        confirmed = result.current.handleConfirmApproval();
      });

      // Mid-flight the dialog is still up and the story is flagged, which is what the
      // list uses to disable Edit, Discard, and Approve All.
      expect(result.current.approvingIds).toEqual([storyId]);
      expect(result.current.pendingApproval).toEqual(heldStory(storyId));

      await act(async () => {
        settle({ id: "story-1", title: draft.title });
        await confirmed;
      });

      expect(result.current.approvingIds).toEqual([]);
      expect(result.current.pendingApproval).toBeNull();
    });

    it("leaves the story in place when the confirmation is cancelled", async () => {
      const { result } = renderHook(() => useRefinement());
      await generate(result);
      const storyId = heldId(result);

      act(() => {
        result.current.handleRequestApproval(storyId);
      });
      act(() => {
        result.current.handleCancelApproval();
      });

      expect(mockApproveStory).not.toHaveBeenCalled();
      expect(result.current.generatedStories).toEqual([heldStory(storyId)]);
      expect(result.current.pendingApproval).toBeNull();
    });

    it("approves into the project the stories were generated for, not the current selection", async () => {
      const { result } = renderHook(() => useRefinement());
      await generate(result);

      act(() => {
        result.current.handleProjectChange("project-2");
      });
      act(() => {
        result.current.handleRequestApproval(heldId(result));
      });
      await act(async () => {
        await result.current.handleConfirmApproval();
      });

      expect(mockApproveStory).toHaveBeenCalledWith({ projectId: "project-1", ...draft });
    });

    it("approves every story in one request and clears the list", async () => {
      const { result } = renderHook(() => useRefinement());
      await generate(result);

      await act(async () => {
        await result.current.handleApproveAll();
      });

      expect(mockApproveStoriesBulk).toHaveBeenCalledWith({
        stories: [{ projectId: "project-1", ...draft }],
      });
      expect(result.current.generatedStories).toEqual([]);
    });
  });

  describe("discarding a story", () => {
    it("drops it from the list without calling the API", async () => {
      const { result } = renderHook(() => useRefinement());
      await generate(result);

      act(() => {
        result.current.handleDelete(result.current.generatedStories[0].id);
      });

      expect(result.current.generatedStories).toEqual([]);
      expect(mockApproveStory).not.toHaveBeenCalled();
    });
  });

  describe("keeping unapproved stories across a reload", () => {
    const OWNER = "admin@test.com";

    it("persists generated stories with the project they were generated for", async () => {
      const { result } = renderHook(() => useRefinement());
      await generate(result);

      expect(pendingStoriesStorage.load(OWNER)).toEqual({
        projectId: "project-1",
        stories: result.current.generatedStories,
      });
    });

    it("restores stories and the project on mount", () => {
      const stories = [heldStory("kept-1")];
      pendingStoriesStorage.save(OWNER, { projectId: "project-1", stories });

      const { result } = renderHook(() => useRefinement());

      expect(result.current.generatedStories).toEqual(stories);
      expect(result.current.selectedProjectId).toBe("project-1");
    });

    it("approves a restored story into the project it was generated for", async () => {
      pendingStoriesStorage.save(OWNER, { projectId: "project-1", stories: [heldStory("kept-1")] });

      const { result } = renderHook(() => useRefinement());
      act(() => {
        result.current.handleProjectChange("project-2");
      });
      act(() => {
        result.current.handleRequestApproval("kept-1");
      });
      await act(async () => {
        await result.current.handleConfirmApproval();
      });

      expect(mockApproveStory).toHaveBeenCalledWith({ projectId: "project-1", ...draft });
    });

    it("persists edits", async () => {
      const { result } = renderHook(() => useRefinement());
      await generate(result);

      act(() => {
        result.current.handleSaveEdit({ ...result.current.generatedStories[0], title: "Edited" });
      });

      expect(pendingStoriesStorage.load(OWNER)?.stories[0].title).toBe("Edited");
    });

    it("clears storage once the last story is approved", async () => {
      const { result } = renderHook(() => useRefinement());
      await generate(result);

      act(() => {
        result.current.handleRequestApproval(result.current.generatedStories[0].id);
      });
      await act(async () => {
        await result.current.handleConfirmApproval();
      });

      expect(pendingStoriesStorage.load(OWNER)).toBeNull();
    });

    it("clears storage once the last story is discarded", async () => {
      const { result } = renderHook(() => useRefinement());
      await generate(result);

      act(() => {
        result.current.handleDelete(result.current.generatedStories[0].id);
      });

      expect(pendingStoriesStorage.load(OWNER)).toBeNull();
    });

    it("does not restore another account's stories", () => {
      pendingStoriesStorage.save("someone-else@test.com", {
        projectId: "project-1",
        stories: [heldStory("theirs")],
      });

      const { result } = renderHook(() => useRefinement());

      expect(result.current.generatedStories).toEqual([]);
    });

    it("warns before the page is left only while stories are unapproved", async () => {
      const { result } = renderHook(() => useRefinement());

      const idleEvent = new Event("beforeunload", { cancelable: true });
      window.dispatchEvent(idleEvent);
      expect(idleEvent.defaultPrevented).toBe(false);

      await generate(result);

      const pendingEvent = new Event("beforeunload", { cancelable: true });
      window.dispatchEvent(pendingEvent);
      expect(pendingEvent.defaultPrevented).toBe(true);

      act(() => {
        result.current.handleDelete(result.current.generatedStories[0].id);
      });

      const clearedEvent = new Event("beforeunload", { cancelable: true });
      window.dispatchEvent(clearedEvent);
      expect(clearedEvent.defaultPrevented).toBe(false);
    });

    it("still works when storage throws", async () => {
      const setItem = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
        throw new Error("quota exceeded");
      });

      const { result } = renderHook(() => useRefinement());
      await generate(result);

      expect(result.current.generatedStories).toHaveLength(1);
      expect(setItem).toHaveBeenCalled();
    });
  });
});
