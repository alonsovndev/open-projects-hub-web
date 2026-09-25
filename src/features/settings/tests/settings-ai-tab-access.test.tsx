import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen } from "@testing-library/react";

import SettingsPage from "@/features/settings/pages/settings";
import { renderWithProviders } from "@/test/utils/render-with-providers";
import type { AdminSession, UserRole } from "@/features/auth/types";

/**
 * Credits and provider keys are admin-only on the server (`require_admin`), so showing a
 * Viewer the tab would only produce 403s. This pins the client gate to that contract.
 */

const sessionFor = (role: UserRole): AdminSession => ({
  token: "test-token",
  email: `${role}@test.com`,
  displayName: role,
  role,
  loggedInAt: new Date().toISOString(),
});

vi.mock("@/features/settings/hooks/use-settings", () => ({
  useSettings: () => ({
    profile: { id: "u1", email: "admin@test.com", displayName: "Admin", role: "admin" },
    loading: false,
    error: null,
    saving: false,
    handleUpdateProfile: vi.fn(),
    handleChangePassword: vi.fn(),
  }),
}));

const renderAs = (role: UserRole) =>
  renderWithProviders(<SettingsPage />, {
    preloadedState: { auth: { session: sessionFor(role), isBootstrapping: false } },
  });

describe("Settings AI Providers tab access", () => {
  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  it("shows the tab to an admin", async () => {
    renderAs("admin");

    expect(await screen.findByText("AI Providers")).toBeInTheDocument();
  });

  it("hides the tab from a viewer", async () => {
    renderAs("viewer");

    expect(await screen.findByText("Profile")).toBeInTheDocument();
    expect(screen.queryByText("AI Providers")).not.toBeInTheDocument();
  });

  it("still shows a viewer their own profile and security tabs", async () => {
    renderAs("viewer");

    expect(await screen.findByText("Profile")).toBeInTheDocument();
    expect(screen.getByText("Security")).toBeInTheDocument();
  });
});
