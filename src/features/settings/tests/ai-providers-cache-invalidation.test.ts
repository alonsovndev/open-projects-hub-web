import { describe, it, expect, vi, afterEach } from "vitest";

import { aiProvidersApi } from "@/features/settings/api/ai-providers-api";
import { createTestStore } from "@/test/utils/render-with-providers";
import type { AdminSession } from "@/features/auth/types";

/**
 * The credit balance and the key list are cached reads that key mutations change.
 *
 * Saving or deleting a key alters which providers the refinement selector may offer and
 * whether the zero-credit prompt should still show — so a balance that does not refetch
 * would leave a user staring at an "add a key" prompt after they just added one.
 */

const session: AdminSession = {
  token: "test-token",
  email: "admin@test.com",
  displayName: "Admin",
  role: "admin",
  loggedInAt: new Date().toISOString(),
};

const stubFetch = () => {
  const calls: string[] = [];
  vi.stubGlobal(
    "fetch",
    vi.fn(async (input: unknown) => {
      const url = typeof input === "string" ? input : String((input as { url?: string }).url);
      calls.push(url);
      const body = url.includes("/credits")
        ? { credits: 3, totalGranted: 5 }
        : url.includes("/api-keys")
          ? { keys: [] }
          : {};
      return new Response(JSON.stringify(body), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    })
  );
  return calls;
};

const countRequests = (calls: string[], fragment: string) =>
  calls.filter((url) => url.includes(fragment)).length;

const loadBothThen = async (mutation: unknown) => {
  const calls = stubFetch();
  const store = createTestStore({ auth: { session, isBootstrapping: false } });

  const credits = store.dispatch(aiProvidersApi.endpoints.getCreditBalance.initiate());
  const keys = store.dispatch(aiProvidersApi.endpoints.getApiKeys.initiate());
  await Promise.all([credits, keys]);

  const creditsBefore = countRequests(calls, "/credits");
  const keysBefore = countRequests(calls, "/api-keys");

  await store.dispatch(mutation as never);
  await new Promise((resolve) => setTimeout(resolve, 0));

  const result = {
    creditsRefetched: countRequests(calls, "/credits") > creditsBefore,
    keysRefetched: countRequests(calls, "/api-keys") > keysBefore,
  };

  credits.unsubscribe();
  keys.unsubscribe();
  return result;
};

describe("ai provider cache invalidation", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("refetches the balance and the key list after a key is saved", async () => {
    const { creditsRefetched, keysRefetched } = await loadBothThen(
      aiProvidersApi.endpoints.saveApiKey.initiate({
        provider: "openai",
        apiKey: "sk-proj-abcdefghijklmnop1234",
      })
    );

    expect(keysRefetched).toBe(true);
    expect(creditsRefetched).toBe(true);
  });

  it("refetches the balance and the key list after a key is deleted", async () => {
    const { creditsRefetched, keysRefetched } = await loadBothThen(
      aiProvidersApi.endpoints.deleteApiKey.initiate("openai")
    );

    expect(keysRefetched).toBe(true);
    expect(creditsRefetched).toBe(true);
  });

  it("refetches only the key list after a validation", async () => {
    // Validating refreshes lastValidatedAt but spends no platform credit, so refetching
    // the balance would be a wasted request.
    const { creditsRefetched, keysRefetched } = await loadBothThen(
      aiProvidersApi.endpoints.validateApiKey.initiate("openai")
    );

    expect(keysRefetched).toBe(true);
    expect(creditsRefetched).toBe(false);
  });
});
