import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";

import BacklogPage from "@/features/backlog/pages/backlog";
import { renderWithProviders } from "@/test/utils/render-with-providers";
import type { AdminSession, UserRole } from "@/features/auth/types";
import type { Story } from "@/features/backlog/types";

const story: Story = {
  id: "story-1",
  title: "Markdown export",
  description: "As an Admin, I want to export the backlog.",
  status: "backlog",
  priority: "high",
  storyPoints: 3,
  acceptanceCriteria: ["Export includes approved stories only"],
  projectId: "project-1",
  createdAt: "2026-01-01",
  updatedAt: "2026-02-01",
};

const backlog = {
  filteredStories: [story],
  filters: {},
  activeFilterCount: 0,
  isLoading: false,
  error: null,
  isLoadingProjects: false,
  isExporting: false,
  canExport: true,
  projectOptions: [],
  handleDeleteStory: vi.fn(),
  handleSearchChange: vi.fn(),
  handleProjectFilter: vi.fn(),
  handlePriorityFilter: vi.fn(),
  handleClearFilters: vi.fn(),
  handleExportMarkdown: vi.fn(),
};

vi.mock("@/features/backlog/hooks/use-backlog", () => ({
  useBacklog: () => backlog,
}));

const sessionWithRole = (role: UserRole): AdminSession => ({
  token: "test-token",
  email: "person@test.com",
  displayName: "Test Person",
  role,
  loggedInAt: new Date().toISOString(),
});

const renderPage = (role: UserRole) =>
  renderWithProviders(<BacklogPage />, {
    preloadedState: { auth: { session: sessionWithRole(role), isBootstrapping: false } },
  });

describe("Backlog role rendering", () => {
  it("gives an admin export and delete", () => {
    renderPage("admin");

    expect(screen.getByRole("button", { name: /export markdown/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /delete markdown export/i })).toBeInTheDocument();
  });

  it("removes export and delete for a viewer", () => {
    renderPage("viewer");

    expect(screen.queryByRole("button", { name: /export markdown/i })).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /delete markdown export/i })
    ).not.toBeInTheDocument();
  });

  it("still shows the stories themselves to a viewer", () => {
    renderPage("viewer");

    expect(screen.getByText("Markdown export")).toBeInTheDocument();
    expect(screen.getByText("Export includes approved stories only")).toBeInTheDocument();
  });
});

describe("Backlog export scoping", () => {
  it("disables export until a project is selected", () => {
    backlog.canExport = false;
    renderPage("admin");
    backlog.canExport = true;

    expect(screen.getByRole("button", { name: /export markdown/i })).toBeDisabled();
  });

  it("enables export once the filter bar names a project", () => {
    renderPage("admin");

    expect(screen.getByRole("button", { name: /export markdown/i })).toBeEnabled();
  });

  it("keeps export hidden from a viewer even when a project is selected", () => {
    renderPage("viewer");

    expect(screen.queryByRole("button", { name: /export markdown/i })).not.toBeInTheDocument();
  });
});
