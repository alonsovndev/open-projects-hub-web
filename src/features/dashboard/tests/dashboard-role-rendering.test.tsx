import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";

import DashboardPage from "@/features/dashboard/pages/dashboard";
import { renderWithProviders } from "@/test/utils/render-with-providers";
import type { AdminSession, UserRole } from "@/features/auth/types";
import type { ProjectSummary } from "@/features/dashboard/types";

const project: ProjectSummary = {
  id: "project-1",
  code: "HUB",
  name: "Open Projects Hub",
  description: "Planning workspace",
  status: "active",
  priority: "high",
  phase: "planning",
  clientId: "client-1",
  clientName: "Acme",
  client: "Acme",
  storiesCount: 4,
  completedStories: 1,
  startDate: "2026-01-01",
  endDate: "2026-06-01",
  createdAt: "2026-01-01",
  lastUpdated: "2026-02-01",
};

const dashboard = {
  user: { displayName: "Test Person" },
  projects: [project],
  stats: null,
  loading: false,
  handleViewProject: vi.fn(),
  handleCreateProject: vi.fn(),
  handleViewAllProjects: vi.fn(),
};

vi.mock("@/features/dashboard/hooks/use-dashboard", () => ({
  useDashboard: () => dashboard,
}));

const sessionWithRole = (role: UserRole): AdminSession => ({
  token: "test-token",
  email: "person@test.com",
  displayName: "Test Person",
  role,
  loggedInAt: new Date().toISOString(),
});

const renderPage = (role: UserRole) =>
  renderWithProviders(<DashboardPage />, {
    preloadedState: { auth: { session: sessionWithRole(role), isBootstrapping: false } },
  });

describe("Dashboard role rendering", () => {
  it("gives an admin the create control", () => {
    renderPage("admin");

    expect(screen.getByRole("button", { name: /new project/i })).toBeInTheDocument();
  });

  it("removes the create control for a viewer", () => {
    renderPage("viewer");

    expect(screen.queryByRole("button", { name: /new project/i })).not.toBeInTheDocument();
  });

  it("still shows the project overview to a viewer", () => {
    renderPage("viewer");

    expect(screen.getByText("Open Projects Hub")).toBeInTheDocument();
  });
});
