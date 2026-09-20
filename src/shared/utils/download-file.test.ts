import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

import { downloadBlob } from "@/shared/utils/download-file";

describe("downloadBlob", () => {
  beforeEach(() => {
    global.URL.createObjectURL = vi.fn(() => "blob:mock-url");
    global.URL.revokeObjectURL = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const stubAnchor = () => {
    const anchor = { href: "", download: "", click: vi.fn() } as unknown as HTMLAnchorElement;
    vi.spyOn(document, "createElement").mockReturnValue(anchor);
    vi.spyOn(document.body, "appendChild").mockImplementation(() => anchor);
    vi.spyOn(document.body, "removeChild").mockImplementation(() => anchor);
    return anchor;
  };

  it("should hand the blob to the browser under the given filename", () => {
    const anchor = stubAnchor();

    downloadBlob(new Blob(["# Backlog"], { type: "text/markdown" }), "backlog.md");

    expect(global.URL.createObjectURL).toHaveBeenCalled();
    expect(anchor.href).toBe("blob:mock-url");
    expect(anchor.download).toBe("backlog.md");
    expect(anchor.click).toHaveBeenCalled();
  });

  it("should revoke the object URL so the blob is not pinned in memory", () => {
    stubAnchor();

    downloadBlob(new Blob(["x"]), "backlog.md");

    expect(global.URL.revokeObjectURL).toHaveBeenCalledWith("blob:mock-url");
  });

  it("should remove the anchor it added to the document", () => {
    const anchor = stubAnchor();
    const removeChildSpy = vi.spyOn(document.body, "removeChild");

    downloadBlob(new Blob(["x"]), "backlog.md");

    expect(removeChildSpy).toHaveBeenCalledWith(anchor);
  });
});
