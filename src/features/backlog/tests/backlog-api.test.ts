import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

import { backlogApi } from "@/features/backlog/api/backlog-api";
import { createTestStore } from "@/test/utils/render-with-providers";
import type { AdminSession } from "@/features/auth/types";

/**
 * These drive the real endpoints through a stubbed `fetch`, rather than mocking the api
 * module. Everything between the HTTP response and the hook's return value —
 * `responseHandler`, `transformResponse`, header parsing, and base-api's error
 * normalization — is only exercised this way; tests that mock the module leave all of it
 * uncovered.
 */

const session: AdminSession = {
  token: "test-token",
  email: "admin@test.com",
  displayName: "Admin",
  role: "admin",
  loggedInAt: new Date().toISOString(),
};

const storeWithSession = () => createTestStore({ auth: { session, isBootstrapping: false } });

const exportResponse = (body: string, headers: Record<string, string>, status = 200) =>
  new Response(body, {
    status,
    headers: { "Content-Type": "text/markdown; charset=utf-8", ...headers },
  });

describe("exportProjectBacklog", () => {
  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("takes the filename and count from the response headers", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        exportResponse("# Acme Portal — Requirements Backlog\n", {
          "Content-Disposition": 'attachment; filename="acme-portal-backlog-2026-09-20.md"',
          "X-Export-Story-Count": "12",
        })
      )
    );

    const store = storeWithSession();
    const result = await store
      .dispatch(backlogApi.endpoints.exportProjectBacklog.initiate({ projectId: "project-1" }))
      .unwrap();

    expect(result.filename).toBe("acme-portal-backlog-2026-09-20.md");
    expect(result.storyCount).toBe(12);
    expect(result.warning).toBeUndefined();
    expect(await result.blob.text()).toContain("Requirements Backlog");

    vi.unstubAllGlobals();
  });

  it("carries the empty-scope warning header through", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        exportResponse("# Empty\n", {
          "Content-Disposition": 'attachment; filename="empty-backlog.md"',
          "X-Export-Story-Count": "0",
          "X-Export-Warning": "<SENSITIVE_EXPORT_WARNING>",
        })
      )
    );

    const store = storeWithSession();
    const result = await store
      .dispatch(backlogApi.endpoints.exportProjectBacklog.initiate({ projectId: "project-1" }))
      .unwrap();

    expect(result.storyCount).toBe(0);
    expect(result.warning).toBe("No approved stories match this scope.");

    vi.unstubAllGlobals();
  });

  it("reports an absent count as unknown rather than zero", async () => {
    // CORS strips unexposed headers, and reading a missing count as 0 would warn
    // "no approved stories" over a full export.
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        exportResponse("# Acme\n", {
          "Content-Disposition": 'attachment; filename="acme-backlog.md"',
        })
      )
    );

    const store = storeWithSession();
    const result = await store
      .dispatch(backlogApi.endpoints.exportProjectBacklog.initiate({ projectId: "project-1" }))
      .unwrap();

    expect(result.storyCount).toBeUndefined();

    vi.unstubAllGlobals();
  });

  it("surfaces the server's message when the export is refused", async () => {
    // The 403 body is JSON. If responseHandler read it as a blob, base-api's normalizer
    // would find no `detail` and fall back to its generic message.
    vi.stubGlobal(
      "fetch",
      vi.fn(
        async () =>
          new Response(JSON.stringify({ detail: "Insufficient permissions" }), {
            status: 403,
            headers: { "Content-Type": "application/json" },
          })
      )
    );

    const store = storeWithSession();
    const result = await store.dispatch(
      backlogApi.endpoints.exportProjectBacklog.initiate({ projectId: "project-1" })
    );

    expect("error" in result).toBe(true);
    const error = (result as { error: { status: number; data: { message: string } } }).error;
    expect(error.status).toBe(403);
    expect(error.data.message).toBe("You don't have permission to do this.");

    vi.unstubAllGlobals();
  });

  it("falls back to a default filename when the header is stripped", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => exportResponse("# Acme\n", {}))
    );

    const store = storeWithSession();
    const result = await store
      .dispatch(backlogApi.endpoints.exportProjectBacklog.initiate({ projectId: "project-1" }))
      .unwrap();

    expect(result.filename).toBe("backlog.md");

    vi.unstubAllGlobals();
  });
});

describe("getProjectBacklog", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("maps the paginated response onto UI stories", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(
        async () =>
          new Response(
            JSON.stringify({
              total: 1,
              page: 1,
              per_page: 50,
              items: [
                {
                  id: "story-1",
                  title: "Markdown export",
                  description: "As an Admin...",
                  acceptanceCriteria: ["Export includes approved stories only"],
                  status: "blocked",
                  priority: "high",
                  points: 3,
                  createdAt: "2026-01-01",
                  updatedAt: "2026-02-01",
                },
              ],
            }),
            { status: 200, headers: { "Content-Type": "application/json" } }
          )
      )
    );

    const store = storeWithSession();
    const result = await store
      .dispatch(backlogApi.endpoints.getProjectBacklog.initiate({ projectId: "project-1" }))
      .unwrap();

    expect(result.total).toBe(1);
    expect(result.stories[0].acceptanceCriteria).toEqual(["Export includes approved stories only"]);
    // `blocked` must not collapse into `backlog` — that misreports blocked work.
    expect(result.stories[0].status).toBe("review");
    expect(result.stories[0].projectId).toBe("project-1");
  });
});
