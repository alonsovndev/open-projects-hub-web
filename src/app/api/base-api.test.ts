import { afterEach, describe, expect, it, vi } from "vitest";
import { http, HttpResponse } from "msw";

import { projectsApi } from "@/features/projects/api/projects-api";
import { refinementApi } from "@/features/refinement/api/refinement-api";
import { server } from "@/mocks/server";
import { adminAuthConfig } from "@/resources/config/auth";
import { createTestStore } from "@/test/utils/render-with-providers";

const sensitiveMarker = "<SENSITIVE_TEST_MARKER>";
const projectsUrl = `${adminAuthConfig.apiBaseUrl}/v1/projects`;

describe("API error privacy", () => {
  afterEach(() => vi.restoreAllMocks());

  it("removes server details from query errors and application logs", async () => {
    const logError = vi.spyOn(console, "error").mockImplementation(() => {});
    const logWarning = vi.spyOn(console, "warn").mockImplementation(() => {});
    server.use(
      http.get(projectsUrl, () =>
        HttpResponse.json(
          {
            detail: sensitiveMarker,
            message: sensitiveMarker,
            credentials: sensitiveMarker,
          },
          { status: 500 }
        )
      )
    );

    const store = createTestStore();
    const query = store.dispatch(projectsApi.endpoints.getProjects.initiate({}));
    const result = await query;
    expect(result.error).toEqual({
      status: 500,
      data: {
        message: "The service is temporarily unavailable. Please try again later.",
      },
    });
    expect(JSON.stringify(store.getState().baseApi.queries)).not.toContain(sensitiveMarker);
    expect(JSON.stringify(logError.mock.calls)).not.toContain(sensitiveMarker);
    expect(JSON.stringify(logWarning.mock.calls)).not.toContain(sensitiveMarker);
    query.unsubscribe();
  });

  it("reports a connection failure without JavaScript exception details", async () => {
    server.use(http.get(projectsUrl, () => HttpResponse.error()));
    const query = createTestStore().dispatch(projectsApi.endpoints.getProjects.initiate({}));
    expect((await query).error).toEqual({
      status: "FETCH_ERROR",
      error: "We couldn't connect. Please try again.",
    });
    query.unsubscribe();
  });

  it("removes an HTML error page while retaining its parsing classification", async () => {
    server.use(http.get(projectsUrl, () => HttpResponse.html(`<html>${sensitiveMarker}</html>`)));
    const query = createTestStore().dispatch(projectsApi.endpoints.getProjects.initiate({}));
    const error = (await query).error;
    expect(error).toEqual({
      status: "PARSING_ERROR",
      originalStatus: 200,
      data: "We couldn't complete your request. Please try again.",
      error: "We couldn't complete your request. Please try again.",
    });
    expect(JSON.stringify(error)).not.toContain(sensitiveMarker);
    query.unsubscribe();
  });

  it("preserves refinement retry guidance without storing echoed notes in errors", async () => {
    server.use(
      http.post(`${adminAuthConfig.apiBaseUrl}/v1/refinement/generate-stories`, () =>
        HttpResponse.json(
          { detail: sensitiveMarker, rawNotes: sensitiveMarker, failureClass: "timeout" },
          { status: 502 }
        )
      )
    );
    const store = createTestStore();
    const request = store.dispatch(
      refinementApi.endpoints.generateStories.initiate({
        projectId: "project-1",
        rawNotes: "The client wants to export their project backlog.",
      })
    );
    expect((await request).error).toEqual({
      status: 502,
      data: {
        failureClass: "timeout",
        message: "The AI provider took too long to respond. Your notes were kept. Try again.",
      },
    });
    expect(JSON.stringify(store.getState().baseApi.mutations)).not.toContain(sensitiveMarker);
    request.reset();
  });
});
