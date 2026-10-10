import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";

import { WorkspacePanel } from "@/features/settings/components/workspace-panel";
import { server } from "@/mocks/server";
import { adminAuthConfig } from "@/resources/config/auth";
import { renderWithProviders } from "@/test/utils/render-with-providers";
import type { AdminSession } from "@/features/auth/types";

const session: AdminSession = {
  token: "test-token",
  email: "admin@test.com",
  displayName: "Admin User",
  role: "admin",
  loggedInAt: new Date().toISOString(),
  workspace: { id: "ws-1", name: "Admin User's workspace" },
};

const renderPanel = () =>
  renderWithProviders(<WorkspacePanel />, {
    preloadedState: { auth: { session, isBootstrapping: false } },
  });

// Form interactions plus a mutation round-trip run close to the default 5s
// budget under full-suite contention — same precedent as team-panel.test.tsx.
describe("WorkspacePanel", { timeout: 20_000 }, () => {
  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  it("pre-fills the input with the current workspace name", () => {
    renderPanel();

    expect(screen.getByLabelText("Workspace Name")).toHaveValue("Admin User's workspace");
  });

  it("renames the workspace and syncs the session", async () => {
    const user = userEvent.setup();
    const { store } = renderPanel();

    const input = screen.getByLabelText("Workspace Name");
    await user.clear(input);
    await user.type(input, "Acme Studio");
    await user.click(screen.getByRole("button", { name: "Rename Workspace" }));

    expect(await screen.findByText("Workspace renamed.")).toBeInTheDocument();
    // The sider renders the name off the auth session — it must be patched in place.
    expect(store.getState().auth.session?.workspace?.name).toBe("Acme Studio");
  });

  it("keeps the form filled when the server rejects the rename", async () => {
    server.use(
      http.patch(`${adminAuthConfig.apiBaseUrl}/v1/workspaces/me`, () =>
        HttpResponse.json(
          { message: "Only the workspace Admin can rename the workspace" },
          { status: 403 }
        )
      )
    );
    const user = userEvent.setup();
    renderPanel();

    const input = screen.getByLabelText("Workspace Name");
    await user.clear(input);
    await user.type(input, "Acme Studio");
    await user.click(screen.getByRole("button", { name: "Rename Workspace" }));

    expect(await screen.findByText("You don't have permission to do this.")).toBeInTheDocument();
    // A failed rename must not wipe what the Admin typed.
    expect(screen.getByLabelText("Workspace Name")).toHaveValue("Acme Studio");
  });
});
