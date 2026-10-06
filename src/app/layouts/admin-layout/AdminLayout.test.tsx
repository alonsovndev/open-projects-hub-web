import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";

import { AdminLayout } from "./AdminLayout";
import { renderWithProviders } from "@/test/utils/render-with-providers";
import type { AdminSession, UserRole } from "@/features/auth/types";

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
            session: { ...sessionWithRole("admin"), workspace: { id: "ws-1", name: "Acme Studio" } },
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
});
