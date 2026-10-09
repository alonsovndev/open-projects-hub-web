import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

import { aiProvidersApi } from "@/features/settings/api/ai-providers-api";
import { createTestStore } from "@/test/utils/render-with-providers";
import type { AdminSession } from "@/features/auth/types";

/**
 * Driven through a stubbed `fetch` rather than by mocking the api module, so the parts
 * that only exist between the response and the hook — `transformResponse` and base-api's
 * error normalization, which now has to carry `promptsKeyUpdate` through — are covered.
 */

const session: AdminSession = {
  token: "test-token",
  email: "admin@test.com",
  displayName: "Admin",
  role: "admin",
  loggedInAt: new Date().toISOString(),
};

const storeWithSession = () => createTestStore({ auth: { session, isBootstrapping: false } });

/** Typed so `mock.calls[0][0]` is a Request rather than `never`. */
const stubFetch = (respond: () => Promise<Response>) => {
  const fetchMock = vi.fn(respond) as unknown as ReturnType<typeof vi.fn> & {
    mock: { calls: [Request][] };
  };
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
};

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

describe("ai providers api", () => {
  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("unwraps the keys array from the response envelope", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        jsonResponse({
          keys: [
            {
              provider: "openai",
              maskedKey: "sk-proj***...1234",
              configuredAt: "2026-08-11T10:00:00.000Z",
              lastValidatedAt: null,
            },
          ],
        })
      )
    );

    const store = storeWithSession();
    const result = await store.dispatch(aiProvidersApi.endpoints.getApiKeys.initiate()).unwrap();

    expect(result).toHaveLength(1);
    expect(result[0].maskedKey).toBe("sk-proj***...1234");
  });

  it("reads the credit balance", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => jsonResponse({ credits: 3, totalGranted: 5 }))
    );

    const store = storeWithSession();
    const balance = await store
      .dispatch(aiProvidersApi.endpoints.getCreditBalance.initiate())
      .unwrap();

    expect(balance).toEqual({ credits: 3, totalGranted: 5 });
  });

  it("posts the provider and key when saving", async () => {
    const fetchMock = stubFetch(async () =>
      jsonResponse(
        {
          provider: "gemini",
          maskedKey: "AIzaSyD***...9876",
          configuredAt: "2026-09-20T12:00:00.000Z",
          lastValidatedAt: "2026-09-20T12:00:00.000Z",
        },
        201
      )
    );

    const store = storeWithSession();
    await store
      .dispatch(
        aiProvidersApi.endpoints.saveApiKey.initiate({
          provider: "gemini",
          apiKey: "AIzaSyD-abcdefghijklmnop9876",
        })
      )
      .unwrap();

    const [request] = fetchMock.mock.calls[0];
    expect(request.method).toBe("POST");
    expect(await request.clone().json()).toEqual({
      provider: "gemini",
      apiKey: "AIzaSyD-abcdefghijklmnop9876",
    });
  });

  it("targets the provider path when deleting", async () => {
    const fetchMock = stubFetch(async () => new Response(null, { status: 204 }));

    const store = storeWithSession();
    await store.dispatch(aiProvidersApi.endpoints.deleteApiKey.initiate("deepseek")).unwrap();

    const [request] = fetchMock.mock.calls[0];
    expect(request.url).toContain("/v1/users/me/api-keys/deepseek");
    expect(request.method).toBe("DELETE");
  });

  it("surfaces the quota warning from a validation", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => jsonResponse({ provider: "openai", valid: true, quotaWarning: true }))
    );

    const store = storeWithSession();
    const result = await store
      .dispatch(aiProvidersApi.endpoints.validateApiKey.initiate("openai"))
      .unwrap();

    expect(result.quotaWarning).toBe(true);
  });

  it("keeps promptsKeyUpdate on a rejected key so the caller can route to Settings", async () => {
    // base-api normalizes errors down to a message; FR-010-11 depends on this flag
    // surviving that, since it decides between the modal and a plain retry.
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        jsonResponse(
          {
            detail: "API key rejected by OpenAI. Check your key in Settings.",
            code: "API_KEY_INVALID",
            provider: "openai",
            reason: "auth_failed",
            promptsKeyUpdate: true,
          },
          422
        )
      )
    );

    const store = storeWithSession();
    const result = await store.dispatch(
      aiProvidersApi.endpoints.saveApiKey.initiate({ provider: "openai", apiKey: "sk-bad" })
    );

    expect("error" in result).toBe(true);
    const error = (result as { error: { status: number; data: Record<string, unknown> } }).error;
    expect(error.status).toBe(422);
    expect(error.data.promptsKeyUpdate).toBe(true);
    expect(error.data.message).toContain("Check your key in Settings");
  });

  it("does not lose the message for errors that carry no structured fields", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => jsonResponse({ detail: "Something broke" }, 500))
    );

    const store = storeWithSession();
    const result = await store.dispatch(
      aiProvidersApi.endpoints.getCreditBalance.initiate(undefined)
    );

    const error = (result as { error?: { data: { message: string } } }).error;
    expect(error?.data.message).toBe("Something broke");
  });
});
