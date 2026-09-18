import { describe, it, expect } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";

import { useProjectsOverview } from "@/features/projects/hooks/use-projects-overview";
import { TestProviders as wrapper } from "@/test/utils/render-with-providers";

// The initial project list comes from an RTK Query fetch (mocked via MSW),
// so every test must wait for it to resolve before asserting on `projects`.
async function renderOverviewHook() {
  const { result } = renderHook(() => useProjectsOverview(), { wrapper });
  await waitFor(() => expect(result.current.isLoading).toBe(false));
  return result;
}

describe("useProjectsOverview", () => {
  describe("initial state", () => {
    it("should load all projects initially", async () => {
      const result = await renderOverviewHook();

      expect(result.current.projects.length).toBeGreaterThan(0);
      expect(result.current.totalCount).toBe(result.current.projects.length);
    });

    it("should have default filters", async () => {
      const result = await renderOverviewHook();

      expect(result.current.filters.search).toBe("");
      expect(result.current.filters.status).toBe("all");
      expect(result.current.filters.priority).toBe("all");
    });

    it("should have default sort", async () => {
      const result = await renderOverviewHook();

      expect(result.current.sort.field).toBe("lastUpdated");
      expect(result.current.sort.order).toBe("desc");
    });

    it("should have default view", async () => {
      const result = await renderOverviewHook();

      expect(result.current.view).toBe("grid");
    });

    it("should have zero active filters initially", async () => {
      const result = await renderOverviewHook();

      expect(result.current.activeFilterCount).toBe(0);
    });
  });

  describe("search filtering", () => {
    it("should filter projects by name", async () => {
      const result = await renderOverviewHook();

      act(() => {
        result.current.handleSearchChange("clinic");
      });

      expect(result.current.projects.length).toBeGreaterThan(0);
      expect(result.current.projects.length).toBeLessThan(result.current.totalCount);
      expect(result.current.projects.every((p) => p.name.toLowerCase().includes("clinic"))).toBe(
        true
      );
    });

    it("should filter projects by code", async () => {
      const result = await renderOverviewHook();

      act(() => {
        result.current.handleSearchChange("PRJ-2024-001");
      });

      expect(result.current.projects.length).toBe(1);
      expect(result.current.projects[0].code).toBe("PRJ-2024-001");
    });

    it("should return empty array for no matches", async () => {
      const result = await renderOverviewHook();

      act(() => {
        result.current.handleSearchChange("nonexistent");
      });

      expect(result.current.projects.length).toBe(0);
    });

    it("should be case insensitive", async () => {
      const result = await renderOverviewHook();

      act(() => {
        result.current.handleSearchChange("CLINIC");
      });

      expect(result.current.projects.length).toBeGreaterThan(0);
    });
  });

  describe("status filtering", () => {
    it("should filter by active status", async () => {
      const result = await renderOverviewHook();

      act(() => {
        result.current.handleStatusFilter("active");
      });

      expect(result.current.projects.every((p) => p.status === "active")).toBe(true);
    });

    it("should filter by completed status", async () => {
      const result = await renderOverviewHook();

      act(() => {
        result.current.handleStatusFilter("completed");
      });

      expect(result.current.projects.every((p) => p.status === "completed")).toBe(true);
    });

    it("should show all when status is all", async () => {
      const result = await renderOverviewHook();

      act(() => {
        result.current.handleStatusFilter("active");
      });

      const filteredCount = result.current.projects.length;

      act(() => {
        result.current.handleStatusFilter("all");
      });

      expect(result.current.projects.length).toBeGreaterThan(filteredCount);
    });
  });

  describe("priority filtering", () => {
    it("should filter by high priority", async () => {
      const result = await renderOverviewHook();

      act(() => {
        result.current.handlePriorityFilter("high");
      });

      expect(result.current.projects.every((p) => p.priority === "high")).toBe(true);
    });

    it("should filter by medium priority", async () => {
      const result = await renderOverviewHook();

      act(() => {
        result.current.handlePriorityFilter("medium");
      });

      expect(result.current.projects.every((p) => p.priority === "medium")).toBe(true);
    });

    it("should filter by low priority", async () => {
      const result = await renderOverviewHook();

      act(() => {
        result.current.handlePriorityFilter("low");
      });

      expect(result.current.projects.every((p) => p.priority === "low")).toBe(true);
    });
  });

  describe("combined filtering", () => {
    it("should apply search and status filter together", async () => {
      const result = await renderOverviewHook();

      act(() => {
        result.current.handleSearchChange("e-commerce");
        result.current.handleStatusFilter("active");
      });

      expect(result.current.projects.length).toBeGreaterThan(0);
      expect(result.current.projects.every((p) => p.status === "active")).toBe(true);
    });

    it("should count active filters correctly", async () => {
      const result = await renderOverviewHook();

      act(() => {
        result.current.handleSearchChange("test");
      });
      expect(result.current.activeFilterCount).toBe(1);

      act(() => {
        result.current.handleStatusFilter("active");
      });
      expect(result.current.activeFilterCount).toBe(2);

      act(() => {
        result.current.handlePriorityFilter("high");
      });
      expect(result.current.activeFilterCount).toBe(3);
    });
  });

  describe("sorting", () => {
    it("should sort by name ascending", async () => {
      const result = await renderOverviewHook();

      act(() => {
        result.current.handleSortChange("name");
      });

      const names = result.current.projects.map((p) => p.name);
      const sortedNames = [...names].sort();
      expect(names).toEqual(sortedNames);
    });

    it("should toggle sort order", async () => {
      const result = await renderOverviewHook();

      act(() => {
        result.current.handleSortChange("name");
      });
      expect(result.current.sort.order).toBe("asc");

      act(() => {
        result.current.handleSortChange("name");
      });
      expect(result.current.sort.order).toBe("desc");
    });

    it("should sort by priority correctly", async () => {
      const result = await renderOverviewHook();

      act(() => {
        result.current.handleSortChange("priority");
      });

      const priorities = result.current.projects.map((p) => p.priority);
      const priorityOrder = { high: 0, medium: 1, low: 2 };

      for (let i = 1; i < priorities.length; i++) {
        expect(priorityOrder[priorities[i - 1]]).toBeLessThanOrEqual(priorityOrder[priorities[i]]);
      }
    });
  });

  describe("view toggle", () => {
    it("should switch to list view", async () => {
      const result = await renderOverviewHook();

      act(() => {
        result.current.handleViewChange("list");
      });

      expect(result.current.view).toBe("list");
    });

    it("should switch back to grid view", async () => {
      const result = await renderOverviewHook();

      act(() => {
        result.current.handleViewChange("list");
        result.current.handleViewChange("grid");
      });

      expect(result.current.view).toBe("grid");
    });
  });

  describe("clear filters", () => {
    it("should reset all filters", async () => {
      const result = await renderOverviewHook();

      act(() => {
        result.current.handleSearchChange("test");
        result.current.handleStatusFilter("active");
        result.current.handlePriorityFilter("high");
        result.current.handleClearFilters();
      });

      expect(result.current.filters.search).toBe("");
      expect(result.current.filters.status).toBe("all");
      expect(result.current.filters.priority).toBe("all");
      expect(result.current.activeFilterCount).toBe(0);
    });
  });
});
