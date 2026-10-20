import { beforeEach, describe, expect, it, vi } from "vitest";
import * as Sentry from "@sentry/react";

const envMock = vi.hoisted(() => ({ VITE_SENTRY_DSN: undefined as string | undefined }));

vi.mock("@sentry/react", () => ({
  init: vi.fn(),
  reactRouterBrowserTracingIntegration: vi.fn(() => ({ name: "tracing" })),
}));
vi.mock("@/config/env", () => ({ env: envMock, mode: "test" }));

import { initSentry } from "./sentry";

describe("initSentry", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("does nothing when no DSN is configured", () => {
    envMock.VITE_SENTRY_DSN = undefined;

    initSentry();

    expect(Sentry.init).not.toHaveBeenCalled();
  });

  it("initializes without PII collection or trace propagation when a DSN is configured", () => {
    envMock.VITE_SENTRY_DSN = "https://key@o1.ingest.us.sentry.io/2";

    initSentry();

    expect(Sentry.init).toHaveBeenCalledWith(
      expect.objectContaining({
        dsn: "https://key@o1.ingest.us.sentry.io/2",
        tracePropagationTargets: [],
        dataCollection: expect.objectContaining({ urlQueryParams: false, userInfo: false }),
      })
    );
  });
});
