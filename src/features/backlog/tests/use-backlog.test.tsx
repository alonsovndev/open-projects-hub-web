import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { message } from "antd";

import { useBacklog } from "@/features/backlog/hooks/use-backlog";
import type { Story } from "@/features/backlog/types";

// Mock Ant Design message
vi.mock("antd", async () => {
  const actual = await vi.importActual("antd");
  return {
    ...actual,
    message: {
      success: vi.fn(),
      error: vi.fn(),
      warning: vi.fn(),
    },
  };
});

// Mock stories-api RTK Query hooks
const mockDeleteStoryFn = vi.fn();
const mockGetStoriesData = { data: { stories: [] as Story[] }, isLoading: false, error: undefined };

vi.mock("@/features/backlog/api/stories-api", () => ({
  useGetStoriesQuery: vi.fn(() => mockGetStoriesData),
  useDeleteStoryMutation: vi.fn(() => [mockDeleteStoryFn, { isLoading: false }]),
}));

// Mock projects-api RTK Query hook
const mockGetProjectsData = { data: { projects: [] }, isLoading: false };

vi.mock("@/features/projects/api/projects-api", () => ({
  useGetProjectsQuery: vi.fn(() => mockGetProjectsData),
}));

// Mock only the export endpoint, so useBacklogExport itself — the download and the
// success/warning/error messages — runs for real.
const mockExportFn = vi.fn();

vi.mock("@/features/backlog/api/backlog-api", () => ({
  useExportProjectBacklogMutation: vi.fn(() => [mockExportFn, { isLoading: false }]),
}));

const exportResult = (overrides: Record<string, unknown> = {}) => ({
  unwrap: () =>
    Promise.resolve({
      blob: new Blob(["# Backlog"], { type: "text/markdown" }),
      filename: "acme-portal-backlog-2026-09-20.md",
      storyCount: 3,
      warning: undefined,
      ...overrides,
    }),
});

const mockStories: Story[] = [
  {
    id: "story-1",
    title: "User Authentication",
    description: "Implement user login",
    acceptanceCriteria: ["Users can login", "Password validation"],
    status: "backlog",
    priority: "high",
    storyPoints: 8,
    assignee: "John Doe",
    projectId: "PROJ-2024",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "story-2",
    title: "User Profile",
    description: "Create user profile page",
    acceptanceCriteria: ["Display user info", "Edit profile"],
    status: "in-progress",
    priority: "medium",
    storyPoints: 5,
    assignee: "Jane Smith",
    projectId: "PROJ-2024",
    createdAt: "2024-01-02T00:00:00Z",
    updatedAt: "2024-01-02T00:00:00Z",
  },
  {
    id: "story-3",
    title: "Dashboard Widgets",
    description: "Add dashboard widgets",
    acceptanceCriteria: ["Widget API", "Drag and drop"],
    status: "done",
    priority: "low",
    storyPoints: 13,
    assignee: "Bob Wilson",
    projectId: "PROJ-2024",
    createdAt: "2024-01-03T00:00:00Z",
    updatedAt: "2024-01-03T00:00:00Z",
  },
  {
    id: "story-4",
    title: "Search Feature",
    description: "Add search functionality",
    acceptanceCriteria: ["Full text search", "Filter results"],
    status: "backlog",
    priority: "high",
    storyPoints: 8,
    assignee: "Alice Johnson",
    projectId: "PROJ-2024",
    createdAt: "2024-01-04T00:00:00Z",
    updatedAt: "2024-01-04T00:00:00Z",
  },
  {
    id: "story-5",
    title: "Notifications System",
    description: "Add push notifications",
    acceptanceCriteria: ["Push notifications", "Email notifications"],
    status: "backlog",
    priority: "medium",
    storyPoints: 5,
    projectId: "ADMIN-2024",
    createdAt: "2024-01-05T00:00:00Z",
    updatedAt: "2024-01-05T00:00:00Z",
  },
];

describe("useBacklog", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetStoriesData.data = { stories: mockStories };
    mockGetStoriesData.isLoading = false;
    mockGetStoriesData.error = undefined;

    // Mock URL.createObjectURL and revokeObjectURL for export tests
    global.URL.createObjectURL = vi.fn(() => "mock-url");
    global.URL.revokeObjectURL = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Initial State", () => {
    it("should initialize with stories from useGetStoriesQuery", () => {
      const { result } = renderHook(() => useBacklog());

      expect(result.current.filteredStories).toHaveLength(5);
    });

    it("should initialize with default filters", () => {
      const { result } = renderHook(() => useBacklog());

      expect(result.current.filters).toEqual({
        search: "",
        priority: "all",
        project: "all",
      });
      expect(result.current.activeFilterCount).toBe(0);
    });
  });

  describe("Search Filter", () => {
    it("should filter stories by title", () => {
      const { result } = renderHook(() => useBacklog());

      act(() => {
        result.current.handleSearchChange("Authentication");
      });

      expect(result.current.filteredStories).toHaveLength(1);
      expect(result.current.filteredStories[0].title).toBe("User Authentication");
      expect(result.current.activeFilterCount).toBe(1);
    });

    it("should filter stories by description", () => {
      const { result } = renderHook(() => useBacklog());

      act(() => {
        result.current.handleSearchChange("profile page");
      });

      expect(result.current.filteredStories).toHaveLength(1);
      expect(result.current.filteredStories[0].title).toBe("User Profile");
    });

    it("should be case-insensitive", () => {
      const { result } = renderHook(() => useBacklog());

      act(() => {
        result.current.handleSearchChange("DASHBOARD");
      });

      expect(result.current.filteredStories).toHaveLength(1);
      expect(result.current.filteredStories[0].title).toBe("Dashboard Widgets");
    });

    it("should return no results for non-matching search", () => {
      const { result } = renderHook(() => useBacklog());

      act(() => {
        result.current.handleSearchChange("NonExistentStory");
      });

      expect(result.current.filteredStories).toHaveLength(0);
    });
  });

  describe("Priority Filter", () => {
    it("should filter stories by priority", () => {
      const { result } = renderHook(() => useBacklog());

      act(() => {
        result.current.handlePriorityFilter("high");
      });

      expect(result.current.filteredStories).toHaveLength(2);
      expect(result.current.filteredStories.every((s) => s.priority === "high")).toBe(true);
      expect(result.current.activeFilterCount).toBe(1);
    });

    it("should filter medium priority stories", () => {
      const { result } = renderHook(() => useBacklog());

      act(() => {
        result.current.handlePriorityFilter("medium");
      });

      expect(result.current.filteredStories).toHaveLength(2);
      expect(result.current.filteredStories.every((s) => s.priority === "medium")).toBe(true);
    });

    it("should filter low priority stories", () => {
      const { result } = renderHook(() => useBacklog());

      act(() => {
        result.current.handlePriorityFilter("low");
      });

      expect(result.current.filteredStories).toHaveLength(1);
      expect(result.current.filteredStories[0].priority).toBe("low");
    });
  });

  describe("Combined Filters", () => {
    it("should apply multiple filters together", () => {
      const { result } = renderHook(() => useBacklog());

      act(() => {
        result.current.handlePriorityFilter("high");
        result.current.handleProjectFilter("PROJ-2024");
      });

      expect(result.current.filteredStories).toHaveLength(2);
      expect(result.current.activeFilterCount).toBe(2);
    });

    it("should return empty array when no stories match all filters", () => {
      const { result } = renderHook(() => useBacklog());

      act(() => {
        result.current.handleProjectFilter("NONEXISTENT");
        result.current.handlePriorityFilter("low");
      });

      expect(result.current.filteredStories).toHaveLength(0);
    });
  });

  describe("Clear Filters", () => {
    it("should reset all filters to defaults", () => {
      const { result } = renderHook(() => useBacklog());

      act(() => {
        result.current.handleSearchChange("test");
        result.current.handlePriorityFilter("high");
        result.current.handleProjectFilter("PROJ-2024");
      });

      expect(result.current.activeFilterCount).toBe(3);

      act(() => {
        result.current.handleClearFilters();
      });

      expect(result.current.filters).toEqual({
        search: "",
        priority: "all",
        project: "all",
      });
      expect(result.current.activeFilterCount).toBe(0);
      expect(result.current.filteredStories).toHaveLength(5);
    });
  });

  describe("Delete Story", () => {
    it("should call delete mutation and show success message", async () => {
      mockDeleteStoryFn.mockReturnValue({ unwrap: () => Promise.resolve(undefined) });

      const { result } = renderHook(() => useBacklog());

      await act(async () => {
        await result.current.handleDeleteStory("story-1");
      });

      await waitFor(() => {
        expect(mockDeleteStoryFn).toHaveBeenCalledWith("story-1");
        expect(message.success).toHaveBeenCalledWith("Story deleted.");
      });
    });

    it("should handle delete errors gracefully", async () => {
      const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
      mockDeleteStoryFn.mockReturnValue({
        unwrap: () => Promise.reject(new Error("Delete failed")),
      });

      const { result } = renderHook(() => useBacklog());

      await act(async () => {
        await result.current.handleDeleteStory("story-1");
      });

      await waitFor(() => {
        expect(message.error).toHaveBeenCalledWith(
          "We couldn't delete the story. Please try again."
        );
      });

      consoleErrorSpy.mockRestore();
    });
  });

  describe("Export Markdown", () => {
    const stubAnchor = () => {
      const anchor = { href: "", download: "", click: vi.fn() } as unknown as HTMLAnchorElement;
      vi.spyOn(document, "createElement").mockReturnValue(anchor);
      vi.spyOn(document.body, "appendChild").mockImplementation(() => anchor);
      vi.spyOn(document.body, "removeChild").mockImplementation(() => anchor);
      return anchor;
    };

    it("should refuse to export until a project is chosen", async () => {
      const { result } = renderHook(() => useBacklog());

      await act(async () => {
        await result.current.handleExportMarkdown();
      });

      expect(message.warning).toHaveBeenCalledWith("Select a project to export its backlog.");
      expect(mockExportFn).not.toHaveBeenCalled();
    });

    it("should hold the export while browser-only filters narrow the list", async () => {
      // The server cannot apply search or priority, so exporting under them would hand
      // back the whole project while the screen shows something smaller.
      mockExportFn.mockReturnValue(exportResult());
      const { result } = renderHook(() => useBacklog());

      act(() => {
        result.current.handleProjectFilter("PROJ-2024");
        result.current.handlePriorityFilter("high");
      });

      expect(result.current.canExport).toBe(false);
      expect(result.current.exportBlockedReason).toMatch(/clear the search and priority filters/i);

      await act(async () => {
        await result.current.handleExportMarkdown();
      });

      expect(mockExportFn).not.toHaveBeenCalled();
    });

    it("should hold the export while a search term narrows the list", async () => {
      mockExportFn.mockReturnValue(exportResult());
      const { result } = renderHook(() => useBacklog());

      act(() => {
        result.current.handleProjectFilter("PROJ-2024");
        result.current.handleSearchChange("Authentication");
      });

      expect(result.current.canExport).toBe(false);

      await act(async () => {
        await result.current.handleExportMarkdown();
      });

      expect(mockExportFn).not.toHaveBeenCalled();
    });

    it("should allow the export once the browser-only filters are cleared", async () => {
      mockExportFn.mockReturnValue(exportResult());
      const { result } = renderHook(() => useBacklog());

      act(() => {
        result.current.handleProjectFilter("PROJ-2024");
        result.current.handlePriorityFilter("high");
      });
      act(() => {
        result.current.handlePriorityFilter("all");
      });

      expect(result.current.canExport).toBe(true);
      expect(result.current.exportBlockedReason).toBeNull();
    });

    it("should export the project named by the filter bar", async () => {
      mockExportFn.mockReturnValue(exportResult());
      const { result } = renderHook(() => useBacklog());

      act(() => {
        result.current.handleProjectFilter("PROJ-2024");
      });

      const anchor = stubAnchor();

      await act(async () => {
        await result.current.handleExportMarkdown();
      });

      expect(mockExportFn).toHaveBeenCalledWith({ projectId: "PROJ-2024" });
      expect(global.URL.createObjectURL).toHaveBeenCalled();
      expect(anchor.click).toHaveBeenCalled();
      expect(anchor.download).toBe("acme-portal-backlog-2026-09-20.md");
      expect(global.URL.revokeObjectURL).toHaveBeenCalledWith("mock-url");
    });

    it("should name the downloaded file in the success message", async () => {
      mockExportFn.mockReturnValue(exportResult());
      const { result } = renderHook(() => useBacklog());

      act(() => {
        result.current.handleProjectFilter("PROJ-2024");
      });
      stubAnchor();

      await act(async () => {
        await result.current.handleExportMarkdown();
      });

      expect(message.success).toHaveBeenCalledWith("Exported acme-portal-backlog-2026-09-20.md");
    });

    it("should warn but still deliver the file when the scope is empty", async () => {
      mockExportFn.mockReturnValue(
        exportResult({ storyCount: 0, warning: "<SENSITIVE_EXPORT_WARNING>" })
      );
      const { result } = renderHook(() => useBacklog());

      act(() => {
        result.current.handleProjectFilter("PROJ-2024");
      });
      const anchor = stubAnchor();

      await act(async () => {
        await result.current.handleExportMarkdown();
      });

      expect(anchor.click).toHaveBeenCalled();
      expect(message.warning).toHaveBeenCalledWith(
        "No approved stories match this scope. An empty template was downloaded."
      );
      expect(message.success).not.toHaveBeenCalled();
      expect(JSON.stringify(vi.mocked(message.warning).mock.calls)).not.toContain(
        "<SENSITIVE_EXPORT_WARNING>"
      );
    });

    it("should show safe permission guidance when the export is refused", async () => {
      const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
      mockExportFn.mockReturnValue({
        unwrap: () =>
          Promise.reject({ status: 403, data: { message: "Insufficient permissions" } }),
      });
      const { result } = renderHook(() => useBacklog());

      act(() => {
        result.current.handleProjectFilter("PROJ-2024");
      });

      await act(async () => {
        await result.current.handleExportMarkdown();
      });

      expect(message.error).toHaveBeenCalledWith("You don't have permission to do this.");

      consoleErrorSpy.mockRestore();
    });

    it("should fall back to a generic message when the failure carries none", async () => {
      const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
      mockExportFn.mockReturnValue({ unwrap: () => Promise.reject(new Error("network down")) });
      const { result } = renderHook(() => useBacklog());

      act(() => {
        result.current.handleProjectFilter("PROJ-2024");
      });

      await act(async () => {
        await result.current.handleExportMarkdown();
      });

      expect(message.error).toHaveBeenCalledWith(
        "We couldn't export the backlog. Please try again."
      );

      consoleErrorSpy.mockRestore();
    });
  });

  describe("Active Filter Count", () => {
    it("should count active filters correctly", () => {
      const { result } = renderHook(() => useBacklog());

      expect(result.current.activeFilterCount).toBe(0);

      act(() => {
        result.current.handleSearchChange("test");
      });
      expect(result.current.activeFilterCount).toBe(1);

      act(() => {
        result.current.handlePriorityFilter("high");
      });
      expect(result.current.activeFilterCount).toBe(2);

      act(() => {
        result.current.handleProjectFilter("PROJ-2024");
      });
      expect(result.current.activeFilterCount).toBe(3);
    });
  });
});
