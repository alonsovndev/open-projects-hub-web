import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { screen } from "@testing-library/react";

import ProjectsOverview from "@/features/projects/pages/projects";
import { renderWithProviders } from "@/test/utils/render-with-providers";
import type { AdminSession, UserRole } from "@/features/auth/types";
import type { ProjectSummary } from "@/shared/types/domain";

const project: ProjectSummary = {
  id: "project-1",
  code: "HUB",
  accessCode: "PRJ-DEMX23A1",
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

const overview: Record<string, unknown> = {
  projects: [project],
  filters: {},
  sort: { field: "name", order: "asc" },
  view: "table",
  currentPage: 1,
  pageSize: 10,
  totalCount: 1,
  filteredCount: 1,
  activeFilterCount: 0,
  activeCount: 1,
  canCreate: true,
  isUpdating: false,
  editModalOpen: false,
  editingProject: null,
  handleSearchChange: vi.fn(),
  handleStatusFilter: vi.fn(),
  handlePriorityFilter: vi.fn(),
  handleClientFilter: vi.fn(),
  handleDateRangeChange: vi.fn(),
  handleSortChange: vi.fn(),
  handleViewChange: vi.fn(),
  handleClearFilters: vi.fn(),
  handlePageChange: vi.fn(),
  handleViewProject: vi.fn(),
  handleEditProject: vi.fn(),
  handleUpdateProject: vi.fn(),
  handleCancelEdit: vi.fn(),
  handleCreateProject: vi.fn(),
  handleDeleteProject: vi.fn(),
  handleArchiveProject: vi.fn(),
  handleReactivateProject: vi.fn(),
};

vi.mock("@/features/projects/hooks/use-projects-overview", () => ({
  useProjectsOverview: () => overview,
}));

const sessionWithRole = (role: UserRole): AdminSession => ({
  token: "test-token",
  email: "person@test.com",
  displayName: "Test Person",
  role,
  loggedInAt: new Date().toISOString(),
});

const renderPage = (role: UserRole) =>
  renderWithProviders(<ProjectsOverview />, {
    preloadedState: { auth: { session: sessionWithRole(role), isBootstrapping: false } },
  });

// First render mounts the real ProjectsOverview page (AntD Table plus filter bar),
// which can exceed the 5s default under full-suite parallel load.
describe("Projects overview role rendering", { timeout: 20_000 }, () => {
  it("gives an admin the create and row-management controls", () => {
    renderPage("admin");

    expect(screen.getByRole("button", { name: /create new project/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /edit open projects hub/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /archive open projects hub/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /delete open projects hub/i })).toBeInTheDocument();
  });

  describe("archived project", () => {
    beforeEach(() => {
      overview.projects = [{ ...project, status: "archived" }];
    });

    afterEach(() => {
      overview.projects = [project];
      overview.view = "table";
    });

    it.each(["table", "grid"])("offers reactivate instead of archive to an admin in %s view", (view) => {
      overview.view = view;
      renderPage("admin");

      expect(screen.getByRole("button", { name: /reactivate open projects hub/i })).toBeInTheDocument();
      expect(
        screen.queryByRole("button", { name: /archive open projects hub/i })
      ).not.toBeInTheDocument();
    });

  });

  describe("grid view", () => {
    // The same page renders ProjectList instead of ProjectsTable in grid view, so the
    // gating has to hold there too.
    beforeEach(() => {
      overview.view = "grid";
    });

    afterEach(() => {
      overview.view = "table";
    });

    it("gives an admin the row-management controls", () => {
      renderPage("admin");

      expect(screen.getByRole("button", { name: /edit/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /archive open projects hub/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /delete open projects hub/i })).toBeInTheDocument();
    });

  });
});
