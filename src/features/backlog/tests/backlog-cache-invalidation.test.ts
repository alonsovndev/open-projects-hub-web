import { describe, it, expect, vi, afterEach } from "vitest";

import { backlogApi } from "@/features/backlog/api/backlog-api";
import { storiesApi } from "@/features/backlog/api/stories-api";
import { refinementApi } from "@/features/refinement/api/refinement-api";
import { createTestStore } from "@/test/utils/render-with-providers";
import type { AdminSession } from "@/features/auth/types";

/**
 * The backlog is a cached read, and three mutations change what it should show: deleting a
 * story, approving a draft, and bulk-approving drafts. Approval in particular is the only
 * path that creates a story, so a backlog that does not refetch after it shows a
 * stakeholder a list missing the work that was just approved.
 */

const session: AdminSession = {
  token: "test-token",
  email: "admin@test.com",
  displayName: "Admin",
  role: "admin",
  loggedInAt: new Date().toISOString(),
};

const backlogBody = JSON.stringify({ total: 0, page: 1, per_page: 50, items: [] });

const stubFetch = () => {
  const calls: string[] = [];
  vi.stubGlobal(
    "fetch",
    vi.fn(async (input: unknown) => {
      const url = typeof input === "string" ? input : String((input as { url?: string }).url);
      calls.push(url);
      return new Response(backlogBody, {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    })
  );
  return calls;
};

const backlogRequests = (calls: string[]) => calls.filter((url) => url.includes("/backlog")).length;

const loadBacklogThen = async (mutation: unknown) => {
  const calls = stubFetch();
  const store = createTestStore({ auth: { session, isBootstrapping: false } });

  // Subscribe, so the entry stays cached and is eligible for refetch on invalidation.
  const backlog = store.dispatch(
    backlogApi.endpoints.getProjectBacklog.initiate({ projectId: "project-1" })
  );
  await backlog;
  const before = backlogRequests(calls);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await store.dispatch(mutation as any);
  await new Promise((resolve) => setTimeout(resolve, 50));

  const after = backlogRequests(calls);
  backlog.unsubscribe();
  return { before, after };
};

describe("backlog cache invalidation", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("refetches the backlog after a story is deleted", async () => {
    const { before, after } = await loadBacklogThen(
      storiesApi.endpoints.deleteStory.initiate("story-1")
    );

    expect(before).toBe(1);
    expect(after).toBeGreaterThan(before);
  });

  it("refetches the backlog after a draft is approved", async () => {
    const { before, after } = await loadBacklogThen(
      refinementApi.endpoints.approveDraft.initiate("draft-1")
    );

    expect(before).toBe(1);
    expect(after).toBeGreaterThan(before);
  });

  it("refetches the backlog after drafts are bulk-approved", async () => {
    const { before, after } = await loadBacklogThen(
      refinementApi.endpoints.approveDraftsBulk.initiate({ draftIds: ["draft-1", "draft-2"] })
    );

    expect(before).toBe(1);
    expect(after).toBeGreaterThan(before);
  });
});
