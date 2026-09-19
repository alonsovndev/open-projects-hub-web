import { Page, Locator } from "@playwright/test";

export class ProjectBacklogPage {
  readonly page: Page;
  readonly pageTitle: Locator;
  readonly projectSelect: Locator;
  readonly storyList: Locator;
  readonly loadingSpinner: Locator;
  readonly errorAlert: Locator;
  readonly exportButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.getByRole("heading", { name: /project backlog/i });
    this.projectSelect = page.getByRole("combobox", { name: /select project/i });
    this.storyList = page.locator('[data-testid="story-list"]');
    this.loadingSpinner = page.locator(".ant-spin");
    this.errorAlert = page.getByRole("alert");
    this.exportButton = page.getByRole("button", { name: /export/i });
  }

  async goto(projectId?: string) {
    if (projectId) {
      await this.page.goto(`/backlog/project/${projectId}`);
    } else {
      await this.page.goto("/backlog/project");
    }
  }

  async selectProject(projectName: string) {
    await this.projectSelect.click();
    await this.page.getByRole("option", { name: new RegExp(projectName, "i") }).click();
  }

  async waitForStoriesLoad() {
    await this.loadingSpinner.waitFor({ state: "hidden", timeout: 5000 });
  }

  async getStoryCount(): Promise<number> {
    const stories = this.page.locator('[data-testid="story-item"]');
    return stories.count();
  }

  async getStoryByTitle(title: string): Promise<Locator> {
    return this.page.getByRole("heading", { name: new RegExp(title, "i") });
  }

  async exportToMarkdown() {
    await this.exportButton.click();
  }
}
