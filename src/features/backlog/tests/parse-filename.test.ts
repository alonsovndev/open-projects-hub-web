import { describe, it, expect } from "vitest";

import { parseFilename } from "@/features/backlog/api/backlog-api";

describe("parseFilename", () => {
  it("should read a quoted filename from the header", () => {
    const header = 'attachment; filename="acme-portal-backlog-2026-09-20.md"';

    expect(parseFilename(header)).toBe("acme-portal-backlog-2026-09-20.md");
  });

  it("should read an unquoted filename", () => {
    expect(parseFilename("attachment; filename=backlog.md")).toBe("backlog.md");
  });

  it("should fall back when the header is absent", () => {
    // CORS hides Content-Disposition unless the server exposes it, so an absent header is
    // a real case rather than a defensive branch.
    expect(parseFilename(null)).toBe("backlog.md");
    expect(parseFilename(undefined)).toBe("backlog.md");
  });

  it("should fall back when the header names no file", () => {
    expect(parseFilename("attachment")).toBe("backlog.md");
  });
});
