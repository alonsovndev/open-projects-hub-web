import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Grid } from "antd";

import { AdminLayout } from "./AdminLayout";
import { renderWithProviders } from "@/test/utils/render-with-providers";
import type { AdminSession, UserRole } from "@/features/auth/types";
import { initializeTheme } from "@/app/theme/theme-provider";

vi.mock("@/features/auth/hooks/use-logout", () => ({
  useLogout: () => ({ logout: vi.fn() }),
}));

vi.mock("@/features/auth/components/session-expiry-warning", () => ({
  SessionExpiryWarning: () => null,
}));

const sessionWithRole = (role: UserRole): AdminSession => ({
  token: "test-token",
  email: "person@test.com",
  displayName: "Test Person",
  role,
  loggedInAt: new Date().toISOString(),
});

const renderMenu = (role: UserRole) =>
  renderWithProviders(
    <AdminLayout>
      <div>content</div>
    </AdminLayout>,
    { preloadedState: { auth: { session: sessionWithRole(role), isBootstrapping: false } } }
  );

describe("AdminLayout navigation", () => {
  beforeEach(() => {
    localStorage.removeItem("oph-theme");
    initializeTheme();
    vi.spyOn(Grid, "useBreakpoint").mockReturnValue({ lg: true });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it.each([true, false])("switches theme with desktop=%s", async (desktop) => {
    vi.mocked(Grid.useBreakpoint).mockReturnValue({ lg: desktop });
    renderMenu("admin");
    await userEvent.click(screen.getByRole("button", { name: "Switch to dark mode" }));
    expect(screen.getByRole("button", { name: "Switch to light mode" })).toBeInTheDocument();
    expect(document.documentElement.dataset.theme).toBe("dark");
  });

  it("shows every destination to an admin", () => {
    renderMenu("admin");

    expect(screen.getByRole("menuitem", { name: /clients/i })).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: /ai refinement/i })).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: /backlog/i })).toBeInTheDocument();
  });

  it("shows the editing destinations to a member", () => {
    renderMenu("member");

    expect(screen.getByRole("menuitem", { name: /clients/i })).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: /ai refinement/i })).toBeInTheDocument();
  });

  it("shows the workspace name under the user", () => {
    renderWithProviders(
      <AdminLayout>
        <div>content</div>
      </AdminLayout>,
      {
        preloadedState: {
          auth: {
            session: {
              ...sessionWithRole("admin"),
              workspace: { id: "ws-1", name: "Acme Studio" },
            },
            isBootstrapping: false,
          },
        },
      }
    );

    expect(screen.getByText("Acme Studio")).toBeInTheDocument();
  });

  it("treats an unrecognised role as read-only", () => {
    renderMenu("user" as UserRole);

    expect(screen.queryByRole("menuitem", { name: /clients/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("menuitem", { name: /ai refinement/i })).not.toBeInTheDocument();
  });

  it("opens mobile navigation and closes it after selecting a destination", async () => {
    vi.mocked(Grid.useBreakpoint).mockReturnValue({ lg: false });
    const user = userEvent.setup();
    renderMenu("admin");

    const trigger = screen.getByRole("button", { name: "Open navigation" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("menuitem", { name: /projects/i })).not.toBeInTheDocument();
    await user.click(trigger);

    const drawer = await screen.findByRole("dialog", { name: "Navigation" });
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    await user.click(within(drawer).getByRole("menuitem", { name: /projects/i }));
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(window.location.pathname).toBe("/projects");
  });

  it("preserves read-only permissions in the mobile drawer", async () => {
    vi.mocked(Grid.useBreakpoint).mockReturnValue({ lg: false });
    const user = userEvent.setup();
    renderMenu("user" as UserRole);

    await user.click(screen.getByRole("button", { name: "Open navigation" }));
    const drawer = await screen.findByRole("dialog", { name: "Navigation" });
    expect(within(drawer).queryByRole("menuitem", { name: /clients/i })).not.toBeInTheDocument();
    expect(
      within(drawer).queryByRole("menuitem", { name: /ai refinement/i })
    ).not.toBeInTheDocument();
    expect(within(drawer).getByRole("menuitem", { name: /backlog/i })).toBeInTheDocument();
  });
});
