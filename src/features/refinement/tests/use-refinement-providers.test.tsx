import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";

import { useRefinement } from "@/features/refinement/hooks/use-refinement";
import type { AiProviderKey } from "@/shared/types/ai";

/**
 * Provider selection and the two blocking states (FR-010-03, FR-010-06, FR-010-11).
 *
 * Mirrors use-refinement.test.tsx's approach of mocking every RTK Query hook, so the hook
 * can be rendered without a Provider.
 */

vi.mock("antd", async () => {
  const actual = await vi.importActual("antd");
  return {
    ...actual,
    message: { success: vi.fn(), error: vi.fn(), warning: vi.fn() },
  };
});

const mockGenerateStories = vi.fn();

vi.mock("@/features/refinement/api/refinement-api", () => ({
  useGenerateStoriesMutation: () => [mockGenerateStories, { isLoading: false }],
  useApproveDraftMutation: () => [vi.fn(), { isLoading: false }],
  useApproveDraftsBulkMutation: () => [vi.fn(), { isLoading: false }],
  useUpdateDraftMutation: () => [vi.fn(), { isLoading: false }],
  useDeleteDraftMutation: () => [vi.fn(), { isLoading: false }],
}));

vi.mock("@/features/projects/api/projects-api", () => ({
  useGetProjectsQuery: () => ({
    data: { projects: [{ id: "project-1", name: "Hub", code: "HUB", clientName: "Acme" }] },
    isLoading: false,
  }),
}));

let credits = 3;
let keys: AiProviderKey[] = [];

vi.mock("@/features/settings/api/ai-providers-api", () => ({
  useGetCreditBalanceQuery: () => ({ data: { credits, totalGranted: 5 } }),
  useGetApiKeysQuery: () => ({ data: keys }),
}));

const keyFor = (provider: AiProviderKey["provider"]): AiProviderKey => ({
  provider,
  maskedKey: `${provider}***...1234`,
  configuredAt: "2026-08-11T10:00:00.000Z",
  lastValidatedAt: null,
});

const RAW_NOTES = "Client wants login, project tracking, and export to markdown.";

const rejected = (error: unknown) => ({ unwrap: () => Promise.reject(error) });

const generate = async (result: { current: ReturnType<typeof useRefinement> }) => {
  act(() => {
    result.current.handleProjectChange("project-1");
    result.current.handleNotesChange(RAW_NOTES);
  });
  await act(async () => {
    await result.current.handleGenerate();
  });
};

describe("useRefinement provider selection", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    credits = 3;
    keys = [];
    mockGenerateStories.mockReturnValue({
      unwrap: () =>
        Promise.resolve({
          stories: [],
          rawNotes: RAW_NOTES,
          redactionCount: 0,
          provider: "platform",
          creditsRemaining: 2,
        }),
    });
  });

  describe("options", () => {
    it("offers only Platform when credits remain and no key is configured", () => {
      const { result } = renderHook(() => useRefinement());

      expect(result.current.providerOptions).toEqual(["platform"]);
      expect(result.current.selectedProvider).toBe("platform");
    });

    it("offers Platform plus every configured provider", () => {
      keys = [keyFor("openai"), keyFor("gemini")];
      const { result } = renderHook(() => useRefinement());

      expect(result.current.providerOptions).toEqual(["platform", "gemini", "openai"]);
    });

    it("drops Platform once credits are gone", () => {
      credits = 0;
      keys = [keyFor("openai")];
      const { result } = renderHook(() => useRefinement());

      expect(result.current.providerOptions).toEqual(["openai"]);
    });

    it("defaults to the first configured provider alphabetically without credits", () => {
      credits = 0;
      keys = [keyFor("openai"), keyFor("deepseek")];
      const { result } = renderHook(() => useRefinement());

      expect(result.current.selectedProvider).toBe("deepseek");
    });

    it("honours an explicit selection", () => {
      keys = [keyFor("openai")];
      const { result } = renderHook(() => useRefinement());

      act(() => result.current.setSelectedProvider("openai"));

      expect(result.current.selectedProvider).toBe("openai");
    });

    it("sends the selected provider to the API", async () => {
      keys = [keyFor("openai")];
      const { result } = renderHook(() => useRefinement());

      act(() => result.current.setSelectedProvider("openai"));
      await generate(result);

      expect(mockGenerateStories).toHaveBeenLastCalledWith({
        projectId: "project-1",
        rawNotes: RAW_NOTES,
        provider: "openai",
      });
    });
  });

  describe("blocking", () => {
    it("blocks refinement with no credits and no key", () => {
      credits = 0;
      const { result } = renderHook(() => useRefinement());

      expect(result.current.isRefinementBlocked).toBe(true);
      expect(result.current.providerOptions).toEqual([]);
    });

    it("does not call the API when blocked, and prompts for a key instead", async () => {
      credits = 0;
      const { result } = renderHook(() => useRefinement());

      await generate(result);

      expect(mockGenerateStories).not.toHaveBeenCalled();
      expect(result.current.creditsExhausted).toBe(true);
    });

    it("is not blocked while a key exists even with no credits", () => {
      credits = 0;
      keys = [keyFor("gemini")];
      const { result } = renderHook(() => useRefinement());

      expect(result.current.isRefinementBlocked).toBe(false);
    });
  });

  describe("server-side failures", () => {
    it("raises the add-a-key prompt on a 402", async () => {
      mockGenerateStories.mockReturnValue(
        rejected({ status: 402, data: { message: "No AI credits remaining." } })
      );
      const { result } = renderHook(() => useRefinement());

      await generate(result);

      expect(result.current.creditsExhausted).toBe(true);
      expect(result.current.generationError).toBeNull();
    });

    it("raises the update-your-key modal on a rejected key", async () => {
      keys = [keyFor("openai")];
      mockGenerateStories.mockReturnValue(
        rejected({
          status: 422,
          data: {
            message: "API key rejected by OpenAI. Check your key in Settings.",
            code: "API_KEY_INVALID",
            provider: "openai",
            promptsKeyUpdate: true,
          },
        })
      );
      const { result } = renderHook(() => useRefinement());

      act(() => result.current.setSelectedProvider("openai"));
      await generate(result);

      expect(result.current.invalidKeyProvider).toBe("openai");
    });

    it("does not raise the key modal for a spent provider quota", async () => {
      // An exhausted quota is not a bad key, so replacing it would not help (FR-010-10).
      keys = [keyFor("openai")];
      mockGenerateStories.mockReturnValue(
        rejected({
          status: 422,
          data: {
            message: "Your OpenAI quota is exhausted.",
            code: "API_KEY_INVALID",
            provider: "openai",
            promptsKeyUpdate: false,
          },
        })
      );
      const { result } = renderHook(() => useRefinement());

      act(() => result.current.setSelectedProvider("openai"));
      await generate(result);

      expect(result.current.invalidKeyProvider).toBeNull();
      expect(result.current.generationError).not.toBeNull();
    });

    it("dismissing a prompt clears it", async () => {
      credits = 0;
      const { result } = renderHook(() => useRefinement());
      await generate(result);

      act(() => result.current.dismissCreditsExhausted());

      expect(result.current.creditsExhausted).toBe(false);
    });
  });
});
