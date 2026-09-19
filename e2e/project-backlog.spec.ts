import { test, expect } from "@playwright/test";
import { ProjectBacklogPage } from "./pages/ProjectBacklogPage";

test.describe("Project Backlog Flow (Unauthenticated)", () => {
  test("should redirect to login when accessing project backlog without auth", async ({ page }) => {
    await page.goto("/backlog/project/1");
    await expect(page).toHaveURL(/\/login/);
  });
});

// TODO: Add authenticated tests once auth setup is fixed
// These tests require:
// 1. MSW to be enabled in E2E environment OR
// 2. Proper auth setup with valid test credentials OR
// 3. Storage state mocking that works with the app's auth flow
//
// Test scenarios to implement:
// - Display page title and project selector
// - Load and display stories when a project is selected
// - Navigate to project backlog with URL parameter
// - Show loading state while fetching stories
// - Update URL when project is selected from dropdown
// - Export stories to markdown when export button is clicked
// - Display empty state when project has no stories
// - Handle API errors gracefully
// - Persist selected project across page refreshes
