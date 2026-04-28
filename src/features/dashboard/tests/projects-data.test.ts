import { describe, it, expect } from "vitest";

import {
  getProjects,
  getDashboardStats,
  getProjectById,
} from "@/features/dashboard/api/projects-data";

describe("Dashboard API", () => {
  describe("getProjects", () => {
    it("should return array of projects", () => {
      const projects = getProjects();

      expect(Array.isArray(projects)).toBe(true);
      expect(projects.length).toBeGreaterThan(0);
    });

    it("should return projects with correct structure", () => {
      const projects = getProjects();
      const project = projects[0];

      expect(project).toHaveProperty("id");
      expect(project).toHaveProperty("name");
      expect(project).toHaveProperty("code");
      expect(project).toHaveProperty("status");
      expect(project).toHaveProperty("priority");
      expect(project).toHaveProperty("client");
      expect(project).toHaveProperty("storiesCount");
      expect(project).toHaveProperty("completedStories");
      expect(project).toHaveProperty("teamMembers");
      expect(project).toHaveProperty("dueDate");
      expect(project).toHaveProperty("lastUpdated");
      expect(project).toHaveProperty("description");
    });

    it("should return projects with valid status values", () => {
      const projects = getProjects();
      const validStatuses = ["active", "completed", "on-hold", "planning"];

      projects.forEach((project) => {
        expect(validStatuses).toContain(project.status);
      });
    });

    it("should return projects with valid priority values", () => {
      const projects = getProjects();
      const validPriorities = ["high", "medium", "low"];

      projects.forEach((project) => {
        expect(validPriorities).toContain(project.priority);
      });
    });
  });

  describe("getDashboardStats", () => {
    it("should return stats object", () => {
      const stats = getDashboardStats();

      expect(stats).toBeDefined();
      expect(stats).toHaveProperty("totalProjects");
      expect(stats).toHaveProperty("activeProjects");
      expect(stats).toHaveProperty("completedProjects");
      expect(stats).toHaveProperty("totalStories");
      expect(stats).toHaveProperty("completedStories");
      expect(stats).toHaveProperty("teamMembers");
    });

    it("should calculate total projects correctly", () => {
      const stats = getDashboardStats();
      const projects = getProjects();

      expect(stats.totalProjects).toBe(projects.length);
    });

    it("should calculate active projects correctly", () => {
      const stats = getDashboardStats();
      const projects = getProjects();
      const activeCount = projects.filter((p) => p.status === "active").length;

      expect(stats.activeProjects).toBe(activeCount);
    });

    it("should calculate completed projects correctly", () => {
      const stats = getDashboardStats();
      const projects = getProjects();
      const completedCount = projects.filter((p) => p.status === "completed").length;

      expect(stats.completedProjects).toBe(completedCount);
    });

    it("should calculate total stories correctly", () => {
      const stats = getDashboardStats();
      const projects = getProjects();
      const totalStories = projects.reduce((sum, p) => sum + p.storiesCount, 0);

      expect(stats.totalStories).toBe(totalStories);
    });

    it("should calculate completed stories correctly", () => {
      const stats = getDashboardStats();
      const projects = getProjects();
      const completedStories = projects.reduce((sum, p) => sum + p.completedStories, 0);

      expect(stats.completedStories).toBe(completedStories);
    });
  });

  describe("getProjectById", () => {
    it("should return project when found", () => {
      const projects = getProjects();
      const firstProject = projects[0];
      const result = getProjectById(firstProject.id);

      expect(result).not.toBeNull();
      expect(result?.id).toBe(firstProject.id);
    });

    it("should return null when project not found", () => {
      const result = getProjectById("non-existent-id");

      expect(result).toBeNull();
    });

    it("should return correct project by id", () => {
      const projects = getProjects();
      const targetProject = projects[2];
      const result = getProjectById(targetProject.id);

      expect(result).toEqual(targetProject);
    });
  });
});
