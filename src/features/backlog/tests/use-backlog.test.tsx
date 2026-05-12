import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { message } from "antd";

import { useBacklog } from "@/features/backlog/hooks/use-backlog";
import * as backlogApi from "@/features/backlog/api/backlog-api";
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

// Mock backlog API
vi.mock("@/features/backlog/api/backlog-api", () => ({
  getStories: vi.fn(),
  getStoryById: vi.fn(),
  updateStoryStatus: vi.fn(),
  updateStory: vi.fn(),
  deleteStory: vi.fn(),
}));

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
    projectId: "PROJ-001",
    projectName: "Project Alpha",
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
    projectId: "PROJ-001",
    projectName: "Project Alpha",
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
    projectId: "PROJ-002",
    projectName: "Project Beta",
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
    projectId: "PROJ-001",
    projectName: "Project Alpha",
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
    projectId: "PROJ-001",
    projectName: "Project Alpha",
    createdAt: "2024-01-05T00:00:00Z",
    updatedAt: "2024-01-05T00:00:00Z",
  },
];

describe("useBacklog", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(backlogApi.getStories).mockReturnValue(mockStories);

    // Mock URL.createObjectURL and revokeObjectURL for export tests
    global.URL.createObjectURL = vi.fn(() => "mock-url");
    global.URL.revokeObjectURL = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Initial State", () => {
    it("should initialize with stories from getStories", () => {
      const { result } = renderHook(() => useBacklog());

      expect(result.current.filteredStories).toHaveLength(5);
      expect(backlogApi.getStories).toHaveBeenCalledOnce();
    });

    it("should initialize with default filters", () => {
      const { result } = renderHook(() => useBacklog());

      expect(result.current.filters).toEqual({
        search: "",
        project: "all",
        priority: "all",
        assignee: "all",
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

  describe("Project Filter", () => {
    it("should filter stories by project", () => {
      const { result } = renderHook(() => useBacklog());

      act(() => {
        result.current.handleProjectFilter("PROJ-001");
      });

      expect(result.current.filteredStories).toHaveLength(4);
      expect(result.current.filteredStories.every((s) => s.projectId === "PROJ-001")).toBe(true);
      expect(result.current.activeFilterCount).toBe(1);
    });

    it("should show all stories when project is 'all'", () => {
      const { result } = renderHook(() => useBacklog());

      act(() => {
        result.current.handleProjectFilter("PROJ-001");
      });

      expect(result.current.filteredStories).toHaveLength(4);

      act(() => {
        result.current.handleProjectFilter("all");
      });

      expect(result.current.filteredStories).toHaveLength(5);
      expect(result.current.activeFilterCount).toBe(0);
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

  describe("Assignee Filter", () => {
    it("should filter stories by assignee", () => {
      const { result } = renderHook(() => useBacklog());

      act(() => {
        result.current.handleAssigneeFilter("John Doe");
      });

      expect(result.current.filteredStories).toHaveLength(1);
      expect(result.current.filteredStories[0].assignee).toBe("John Doe");
      expect(result.current.activeFilterCount).toBe(1);
    });

    it("should filter unassigned stories", () => {
      const { result } = renderHook(() => useBacklog());

      act(() => {
        result.current.handleAssigneeFilter("unassigned");
      });

      expect(result.current.filteredStories).toHaveLength(1);
      expect(result.current.filteredStories[0].assignee).toBeUndefined();
    });

    it("should not show assigned stories when filtering unassigned", () => {
      const { result } = renderHook(() => useBacklog());

      act(() => {
        result.current.handleAssigneeFilter("unassigned");
      });

      const hasAssignedStories = result.current.filteredStories.some((s) => s.assignee);
      expect(hasAssignedStories).toBe(false);
    });
  });

  describe("Combined Filters", () => {
    it("should apply multiple filters together", () => {
      const { result } = renderHook(() => useBacklog());

      act(() => {
        result.current.handleProjectFilter("PROJ-001");
        result.current.handlePriorityFilter("high");
      });

      expect(result.current.filteredStories).toHaveLength(2);
      expect(result.current.activeFilterCount).toBe(2);
      expect(
        result.current.filteredStories.every(
          (s) => s.projectId === "PROJ-001" && s.priority === "high"
        )
      ).toBe(true);
    });

    it("should apply search with other filters", () => {
      const { result } = renderHook(() => useBacklog());

      act(() => {
        result.current.handleProjectFilter("PROJ-001");
        result.current.handleSearchChange("User");
      });

      expect(result.current.filteredStories).toHaveLength(2);
      expect(result.current.activeFilterCount).toBe(2);
    });

    it("should return empty array when no stories match all filters", () => {
      const { result } = renderHook(() => useBacklog());

      act(() => {
        result.current.handleProjectFilter("PROJ-002");
        result.current.handlePriorityFilter("high");
      });

      expect(result.current.filteredStories).toHaveLength(0);
    });
  });

  describe("Clear Filters", () => {
    it("should reset all filters to defaults", () => {
      const { result } = renderHook(() => useBacklog());

      act(() => {
        result.current.handleSearchChange("test");
        result.current.handleProjectFilter("PROJ-001");
        result.current.handlePriorityFilter("high");
        result.current.handleAssigneeFilter("John Doe");
      });

      expect(result.current.activeFilterCount).toBe(4);

      act(() => {
        result.current.handleClearFilters();
      });

      expect(result.current.filters).toEqual({
        search: "",
        project: "all",
        priority: "all",
        assignee: "all",
      });
      expect(result.current.activeFilterCount).toBe(0);
      expect(result.current.filteredStories).toHaveLength(5);
    });
  });

  describe("Delete Story", () => {
    it("should delete story and update state", async () => {
      vi.mocked(backlogApi.deleteStory).mockResolvedValue(undefined);

      const { result } = renderHook(() => useBacklog());

      const initialCount = result.current.filteredStories.length;

      await act(async () => {
        await result.current.handleDeleteStory("story-1");
      });

      await waitFor(() => {
        expect(backlogApi.deleteStory).toHaveBeenCalledWith("story-1");
        expect(result.current.filteredStories).toHaveLength(initialCount - 1);
        expect(result.current.filteredStories.find((s) => s.id === "story-1")).toBeUndefined();
        expect(message.success).toHaveBeenCalledWith("Story deleted successfully");
      });
    });

    it("should handle delete errors gracefully", async () => {
      const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
      vi.mocked(backlogApi.deleteStory).mockRejectedValue(new Error("Delete failed"));

      const { result } = renderHook(() => useBacklog());

      await act(async () => {
        await result.current.handleDeleteStory("story-1");
      });

      await waitFor(() => {
        expect(message.error).toHaveBeenCalledWith("Failed to delete story. Please try again.");
      });

      consoleErrorSpy.mockRestore();
    });
  });

  describe("Export Markdown", () => {
    it("should show warning when no stories to export", () => {
      const { result } = renderHook(() => useBacklog());

      act(() => {
        result.current.handleSearchChange("NonExistentStory");
      });

      act(() => {
        result.current.handleExportMarkdown();
      });

      expect(message.warning).toHaveBeenCalledWith("No stories to export");
    });

    it("should create markdown file with filtered stories", () => {
      const { result } = renderHook(() => useBacklog());

      // Mock DOM methods after renderHook
      const createElementSpy = vi.spyOn(document, "createElement");
      const appendChildSpy = vi.spyOn(document.body, "appendChild");
      const removeChildSpy = vi.spyOn(document.body, "removeChild");

      const mockAnchor = {
        href: "",
        download: "",
        click: vi.fn(),
      } as unknown as HTMLAnchorElement;

      createElementSpy.mockReturnValue(mockAnchor);
      appendChildSpy.mockImplementation(() => mockAnchor);
      removeChildSpy.mockImplementation(() => mockAnchor);

      act(() => {
        result.current.handleExportMarkdown();
      });

      expect(global.URL.createObjectURL).toHaveBeenCalled();
      expect(mockAnchor.click).toHaveBeenCalled();
      expect(global.URL.revokeObjectURL).toHaveBeenCalledWith("mock-url");
      expect(message.success).toHaveBeenCalledWith("Backlog exported successfully!");

      createElementSpy.mockRestore();
      appendChildSpy.mockRestore();
      removeChildSpy.mockRestore();
    });

    it("should include story details in markdown export", () => {
      const { result } = renderHook(() => useBacklog());

      // Mock DOM methods after renderHook
      const createElementSpy = vi.spyOn(document, "createElement");
      const appendChildSpy = vi.spyOn(document.body, "appendChild");
      const removeChildSpy = vi.spyOn(document.body, "removeChild");

      // Override the global mock for this specific test to verify content
      const originalCreateObjectURL = global.URL.createObjectURL;
      global.URL.createObjectURL = vi.fn((blob) => {
        // Read blob content to verify markdown structure
        const reader = new FileReader();
        reader.onload = () => {
          const content = reader.result as string;
          expect(content).toContain("# User Stories Backlog");
          expect(content).toContain("User Authentication");
          expect(content).toContain("**Project:**");
          expect(content).toContain("**Status:**");
          expect(content).toContain("**Priority:**");
        };
        reader.readAsText(blob as Blob);
        return "mock-url";
      });

      const mockAnchor = {
        href: "",
        download: "",
        click: vi.fn(),
      } as unknown as HTMLAnchorElement;

      createElementSpy.mockReturnValue(mockAnchor);
      appendChildSpy.mockImplementation(() => mockAnchor);
      removeChildSpy.mockImplementation(() => mockAnchor);

      act(() => {
        result.current.handleExportMarkdown();
      });

      expect(mockAnchor.click).toHaveBeenCalled();
      expect(message.success).toHaveBeenCalledWith("Backlog exported successfully!");

      createElementSpy.mockRestore();
      appendChildSpy.mockRestore();
      removeChildSpy.mockRestore();
      global.URL.createObjectURL = originalCreateObjectURL;
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
        result.current.handleProjectFilter("PROJ-001");
      });
      expect(result.current.activeFilterCount).toBe(2);

      act(() => {
        result.current.handlePriorityFilter("high");
      });
      expect(result.current.activeFilterCount).toBe(3);

      act(() => {
        result.current.handleAssigneeFilter("John Doe");
      });
      expect(result.current.activeFilterCount).toBe(4);
    });

    it("should not count 'all' as active filter", () => {
      const { result } = renderHook(() => useBacklog());

      act(() => {
        result.current.handleProjectFilter("PROJ-001");
        result.current.handlePriorityFilter("high");
      });

      expect(result.current.activeFilterCount).toBe(2);

      act(() => {
        result.current.handleProjectFilter("all");
      });

      expect(result.current.activeFilterCount).toBe(1);
    });
  });
});
