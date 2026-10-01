import { afterEach, describe, expect, it, vi } from "vitest";
import { act, renderHook, waitFor } from "@testing-library/react";
import { createElement } from "react";

import { refinementApi } from "@/features/refinement/api/refinement-api";
import { useRefinement } from "@/features/refinement/hooks/use-refinement";
import { aiProvidersApi } from "@/features/settings/api/ai-providers-api";
import { createTestStore, TestProviders } from "@/test/utils/render-with-providers";
import type { AdminSession } from "@/features/auth/types";
import type { RefinementProvider } from "@/shared/types/ai";

const session: AdminSession = {
  token: "test-token",
  email: "admin@test.com",
  displayName: "Admin",
  role: "admin",
  loggedInAt: "2026-09-30T00:00:00.000Z",
};

const notes = "Client wants login, project tracking, and export to markdown.";

const setup = (provider: RefinementProvider, status = 200, includeResponseProvider = true) => {
  let credits = 3;
  let creditRequests = 0;

  vi.stubGlobal(
    "fetch",
    vi.fn(async (input: Request) => {
      if (input.url.includes("/v1/users/me/credits")) {
        creditRequests += 1;
        return new Response(JSON.stringify({ credits, totalGranted: 5 }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }

      if (input.url.includes("/v1/refinement/generate-stories")) {
        credits = status === 402 ? 0 : provider === "platform" ? 2 : 3;
        return new Response(
          JSON.stringify(
            status === 402
              ? { detail: "No AI credits remaining." }
              : {
                  stories: [],
                  rawNotes: notes,
                  redactionCount: 0,
                  ...(includeResponseProvider && { provider }),
                  creditsRemaining: provider === "platform" ? credits : null,
                }
          ),
          { status, headers: { "Content-Type": "application/json" } }
        );
      }

      if (input.url.includes("/v1/users/me/api-keys")) {
        return new Response(JSON.stringify({ keys: [] }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }

      if (input.url.includes("/v1/projects")) {
        return new Response(JSON.stringify({ items: [], total: 0, page: 1, per_page: 100 }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }

      throw new Error(`Unexpected request: ${input.url}`);
    })
  );

  const store = createTestStore({ auth: { session, isBootstrapping: false } });
  const balance = store.dispatch(aiProvidersApi.endpoints.getCreditBalance.initiate());

  return {
    store,
    balance,
    creditRequests: () => creditRequests,
    cachedCredits: () =>
      aiProvidersApi.endpoints.getCreditBalance.select()(store.getState()).data?.credits,
  };
};

describe("refinement credit balance cache", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("updates the refinement balance after generation when the response omits provider", async () => {
    const scenario = setup("platform", 200, false);
    await scenario.balance;
    const { result } = renderHook(() => useRefinement(), {
      wrapper: ({ children }) => createElement(TestProviders, { store: scenario.store, children }),
    });
    await waitFor(() => expect(result.current.creditBalance?.credits).toBe(3));

    act(() => {
      result.current.handleProjectChange("project-1");
      result.current.handleNotesChange(notes);
    });
    await act(async () => {
      await result.current.handleGenerate();
    });

    await waitFor(() => expect(result.current.creditBalance?.credits).toBe(2));
    expect(scenario.creditRequests()).toBe(2);
    scenario.balance.unsubscribe();
  });

  it("refreshes the balance when the request omits the default platform provider", async () => {
    const scenario = setup("platform", 200, false);
    await scenario.balance;

    await scenario.store.dispatch(
      refinementApi.endpoints.generateStories.initiate({
        projectId: "project-1",
        rawNotes: notes,
      })
    );

    await waitFor(() => expect(scenario.cachedCredits()).toBe(2));
    expect(scenario.creditRequests()).toBe(2);
    scenario.balance.unsubscribe();
  });

  it("refreshes a stale balance when the platform rejects generation with 402", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const scenario = setup("platform", 402);
    await scenario.balance;

    await scenario.store.dispatch(
      refinementApi.endpoints.generateStories.initiate({
        projectId: "project-1",
        rawNotes: notes,
        provider: "platform",
      })
    );

    await waitFor(() => expect(scenario.cachedCredits()).toBe(0));
    expect(scenario.creditRequests()).toBe(2);
    scenario.balance.unsubscribe();
  });

  it("does not refetch credits when a user's API key generates stories", async () => {
    const scenario = setup("openai");
    await scenario.balance;

    await scenario.store.dispatch(
      refinementApi.endpoints.generateStories.initiate({
        projectId: "project-1",
        rawNotes: notes,
        provider: "openai",
      })
    );
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(scenario.cachedCredits()).toBe(3);
    expect(scenario.creditRequests()).toBe(1);
    scenario.balance.unsubscribe();
  });
});
