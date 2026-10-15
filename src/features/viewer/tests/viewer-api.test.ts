import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

import { viewerApi } from "@/features/viewer/api/viewer-api";
import { createTestStore } from "@/test/utils/render-with-providers";
import type { AdminSession } from "@/features/auth/types";

/**
 * These drive the real endpoint through a stubbed `fetch`, so the request headers, the
 * response mapping and base-api's handling of a public route are all exercised together.
 */

const session: AdminSession = {
  token: "freelancer-token",
  email: "admin@test.com",
  displayName: "Admin",
  role: "admin",
  loggedInAt: new Date().toISOString(),
};

const reviewResponse = {
  projectName: "Acme Portal",
  phase: "discovery",
  total: 2,
  stories: [
    {
      id: "s1",
      title: "Log in",
      description: "As a client I want to log in",
      acceptanceCriteria: ["Valid credentials open the dashboard"],
      status: "in_progress",
      priority: "high",
    },
    {
      id: "s2",
      title: "Reset password",
      description: null,
      acceptanceCriteria: [],
      status: "todo",
      priority: "low",
    },
  ],
};

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

const requestOf = (fetchMock: ReturnType<typeof vi.fn>): Request =>
  fetchMock.mock.calls[0][0] as Request;

describe("getClientReview", () => {
  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("maps the API response to the review the page renders", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => jsonResponse(reviewResponse))
    );

    const review = await createTestStore()
      .dispatch(viewerApi.endpoints.getClientReview.initiate("PRJ-7K3M9XQ2"))
      .unwrap();

    expect(review.projectName).toBe("Acme Portal");
    expect(review.total).toBe(2);
    expect(review.stories[0]).toMatchObject({ status: "in-progress", priority: "high" });
    expect(review.stories[1].description).toBe("");
  });

  it("asks for the code's own path and the largest page", async () => {
    const fetchMock = vi.fn(async () => jsonResponse(reviewResponse));
    vi.stubGlobal("fetch", fetchMock);

    await createTestStore().dispatch(viewerApi.endpoints.getClientReview.initiate("PRJ-7K3M9XQ2"));

    const url = new URL(requestOf(fetchMock).url);
    expect(url.pathname).toBe("/v1/viewer/PRJ-7K3M9XQ2");
    expect(url.searchParams.get("limit")).toBe("100");
  });

  it("reads every page when the project has more stories than one page holds", async () => {
    const storyNumbered = (number: number) => ({
      ...reviewResponse.stories[0],
      id: `s${number}`,
      title: `Story ${number}`,
    });
    const fetchMock = vi.fn(async (request: Request) => {
      const offset = Number(new URL(request.url).searchParams.get("offset"));
      const count = offset === 0 ? 100 : 20;
      return jsonResponse({
        ...reviewResponse,
        total: 120,
        stories: Array.from({ length: count }, (_, index) => storyNumbered(offset + index + 1)),
      });
    });
    vi.stubGlobal("fetch", fetchMock);

    const review = await createTestStore()
      .dispatch(viewerApi.endpoints.getClientReview.initiate("PRJ-7K3M9XQ2"))
      .unwrap();

    expect(review.stories).toHaveLength(120);
    expect(review.stories[119].title).toBe("Story 120");
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("sends no credentials even when a freelancer is signed in", async () => {
    const fetchMock = vi.fn(async () => jsonResponse(reviewResponse));
    vi.stubGlobal("fetch", fetchMock);
    const store = createTestStore({ auth: { session, isBootstrapping: false } });

    await store.dispatch(viewerApi.endpoints.getClientReview.initiate("PRJ-7K3M9XQ2"));

    expect(requestOf(fetchMock).headers.get("Authorization")).toBeNull();
  });

  it("reports an unknown code as a 404 without touching the signed-in session", async () => {
    const fetchMock = vi.fn(async () => jsonResponse({ detail: "Project not found" }, 404));
    vi.stubGlobal("fetch", fetchMock);
    const store = createTestStore({ auth: { session, isBootstrapping: false } });

    const result = await store.dispatch(
      viewerApi.endpoints.getClientReview.initiate("PRJ-AAAAAAAA")
    );

    expect(result.error).toMatchObject({ status: 404 });
    expect(store.getState().auth.session).not.toBeNull();
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
