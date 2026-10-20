import { beforeEach, describe, expect, it, vi } from "vitest";
import * as Sentry from "@sentry/react";

import { invalidSessionResponseMessage, reportApiError } from "./report-api-error";

vi.mock("@sentry/react", () => ({ captureMessage: vi.fn() }));

describe("reportApiError", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("reports server errors with the endpoint template and status only", () => {
    reportApiError(
      { status: 503, data: { detail: "<SENSITIVE_TEST_MARKER>" } },
      "/v1/projects/4f9c2b1a-0d3e-4c5b-8a7f-1e2d3c4b5a69/stories/42?email=user@example.com"
    );

    expect(Sentry.captureMessage).toHaveBeenCalledWith("API request failed", {
      level: "error",
      tags: { endpoint: "/v1/projects/:id/stories/:id", status: "503" },
      fingerprint: ["api-request-failed", "/v1/projects/:id/stories/:id", "503"],
    });
  });

  it.each([
    { status: "FETCH_ERROR" as const, error: "TypeError: Failed to fetch" },
    { status: "PARSING_ERROR" as const, originalStatus: 200, data: "<html>", error: "bad json" },
    { status: "CUSTOM_ERROR" as const, error: invalidSessionResponseMessage },
  ])("reports $status", (error) => {
    reportApiError(error, "/v1/projects");

    expect(Sentry.captureMessage).toHaveBeenCalledTimes(1);
  });

  it.each([
    { status: 401, data: {} },
    { status: 403, data: {} },
    { status: 404, data: {} },
    { status: 422, data: {} },
    { status: "FETCH_ERROR" as const, error: "AbortError: signal is aborted without reason" },
    { status: "CUSTOM_ERROR" as const, error: "Your session changed. Please try again." },
  ])("ignores expected failure $status", (error) => {
    reportApiError(error, "/v1/projects");

    expect(Sentry.captureMessage).not.toHaveBeenCalled();
  });
});
