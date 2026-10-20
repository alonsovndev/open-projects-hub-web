import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import * as Sentry from "@sentry/react";

import { ErrorBoundary } from "./ErrorBoundary";

vi.mock("@sentry/react", () => ({ captureException: vi.fn() }));

const Boom = () => {
  throw new Error("render failure");
};

describe("ErrorBoundary", () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("reports render errors to Sentry with the component stack and shows the fallback", () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);

    render(
      <ErrorBoundary>
        <Boom />
      </ErrorBoundary>
    );

    expect(screen.getByText("We couldn't display this page")).toBeInTheDocument();
    expect(Sentry.captureException).toHaveBeenCalledWith(
      expect.objectContaining({ message: "render failure" }),
      { contexts: { react: { componentStack: expect.any(String) } } }
    );
  });
});
