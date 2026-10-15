import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";

import ProjectBacklogPage from "@/features/backlog/pages/project-backlog";
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
  acceptanceCriteria: ["Export includes approved stories only", "File is downloadable as .md"],
  projectId: "project-1",
  createdAt: "2026-01-01",
  updatedAt: "2026-02-01",
};

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return { ...actual, useParams: () => ({ projectId: "project-1" }) };
});

vi.mock("@/features/backlog/hooks/use-project-backlog", () => ({
  useProjectBacklog: () => ({
    stories: [story],
    totalStories: 1,
    isLoading: false,
    error: null,
  }),
}));

const mockExportBacklog = vi.fn();

vi.mock("@/features/backlog/hooks/use-backlog-export", () => ({
  useBacklogExport: () => ({ exportBacklog: mockExportBacklog, isExporting: false }),
}));

vi.mock("@/features/projects/api/projects-api", () => ({
  useGetProjectsQuery: () => ({
    data: { projects: [{ id: "project-1", name: "Acme Portal", code: "ACME" }] },
    isLoading: false,
  }),
}));

const sessionWithRole = (role: UserRole): AdminSession => ({
  token: "test-token",
  email: "person@test.com",
  displayName: "Test Person",
  role,
  loggedInAt: new Date().toISOString(),
});

const renderPage = (role: UserRole) =>
  renderWithProviders(<ProjectBacklogPage />, {
    preloadedState: { auth: { session: sessionWithRole(role), isBootstrapping: false } },
  });

describe("Project backlog page", () => {
  it("renders the acceptance criteria the backlog endpoint returns", () => {
    renderPage("admin");

    expect(screen.getByText("Markdown export")).toBeInTheDocument();
    expect(screen.getByText("Export includes approved stories only")).toBeInTheDocument();
    expect(screen.getByText("File is downloadable as .md")).toBeInTheDocument();
  });

  it("gives an admin the export button", () => {
    renderPage("admin");

    expect(screen.getByRole("button", { name: /^export backlog$/i })).toBeInTheDocument();
  });
});
