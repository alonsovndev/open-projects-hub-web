import { describe, it, expect, vi, afterEach } from "vitest";

import { storiesApi } from "@/features/backlog/api/stories-api";
import { createTestStore } from "@/test/utils/render-with-providers";
import type { AdminSession } from "@/features/auth/types";

const session: AdminSession = {
  token: "test-token",
  email: "admin@test.com",
  displayName: "Admin",
  role: "admin",
  loggedInAt: new Date().toISOString(),
};

describe("getStories", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("asks for the API's maximum page size, since the list is filtered client-side", async () => {
    const fetchMock = vi.fn(
      async (_input: Request) =>
        new Response(JSON.stringify({ items: [], total: 0, page: 1, per_page: 100 }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        })
    );
    vi.stubGlobal("fetch", fetchMock);
    const store = createTestStore({ auth: { session, isBootstrapping: false } });

    await store.dispatch(storiesApi.endpoints.getStories.initiate({})).unwrap();

    const request = fetchMock.mock.calls[0][0] as Request;
    expect(new URL(request.url).searchParams.get("limit")).toBe("100");
  });
});
