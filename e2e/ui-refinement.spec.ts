import { test, expect } from "@playwright/test";
import type { Page } from "@playwright/test";

const widths = [375, 430, 768, 1280, 1440];
const project = {
  id: "11111111-1111-1111-1111-111111111111",
  name: "City Clinic Portal",
  code: "PRJ-2024-010",
  accessCode: "PRJ-DEMX23CD",
  description: "Patient portal for the clinic",
  createdBy: "admin",
  clientId: "client-1",
  clientName: "Metro Health",
  status: "active",
  priority: "high",
  phase: "discovery",
  startDate: "2026-01-01",
  endDate: "2026-06-01",
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-02-01T00:00:00.000Z",
  storiesCount: 1,
  completedStories: 0,
};
const story = {
  id: "story-1",
  title: "Appointment scheduling",
  description: "As a patient, I want to book an appointment online.",
  acceptanceCriteria: ["A patient can pick a doctor and an available time slot."],
  projectId: project.id,
  createdBy: "admin",
  assignedTo: null,
  status: "todo",
  priority: "high",
  points: 5,
  createdAt: project.createdAt,
  updatedAt: project.updatedAt,
};

const expectNoPageOverflow = async (page: Page) => {
  await expect
    .poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth))
    .toBe(true);
};

const signIn = async (page: Page) => {
  await page.goto("/login");
  await page.getByLabel("Email", { exact: true }).fill("admin@example.com");
  await page.getByLabel("Password", { exact: true }).fill("Sample123!");
  await page.getByRole("button", { name: "Sign In", exact: true }).click();
  await expect(page.getByRole("heading", { name: /welcome back/i })).toBeVisible();
};

const navigateTo = async (page: Page, destination: string) => {
  const trigger = page.getByRole("button", { name: "Open navigation" });
  if (await trigger.isVisible()) {
    await trigger.click();
  }
  await page.getByRole("menuitem", { name: destination, exact: true }).click();
  await expect(page.getByRole("dialog", { name: "Navigation" })).not.toBeVisible();
};

test.beforeEach(async ({ page }) => {
  await page.route("**/*", async (route) => {
    const url = new URL(route.request().url());
    if (!url.pathname.startsWith("/v1/")) {
      if (["localhost", "127.0.0.1"].includes(url.hostname)) {
        await route.continue();
      } else {
        await route.abort();
      }
      return;
    }

    const responses: Record<string, unknown> = {
      "/v1/auth/login": {
        token: "sample-access-token",
        email: "admin@example.com",
        displayName: "Alex",
        role: "admin",
        user: { workspace: { id: "workspace-1", name: "Clinic Studio" } },
      },
      "/v1/dashboard/stats": {
        totalProjects: 1,
        activeProjects: 1,
        totalStories: 1,
        assignedStories: 0,
        completedStories: 0,
      },
      "/v1/projects": { items: [project], total: 1, page: 1, per_page: 10 },
      [`/v1/projects/${project.id}`]: project,
      "/v1/clients": {
        items: [{ id: "client-1", name: "Metro Health", email: "client@example.com" }],
        total: 1,
        page: 1,
        per_page: 10,
      },
      "/v1/stories": { items: [story], total: 1, page: 1, per_page: 10 },
      [`/v1/projects/${project.id}/backlog`]: { items: [story], total: 1 },
      "/v1/users/me/credits": { credits: 10, totalGranted: 10 },
      "/v1/users/me/api-keys": { keys: [] },
      [`/v1/viewer/${project.accessCode}`]: {
        projectName: project.name,
        phase: project.phase,
        total: 1,
        stories: [story],
      },
      "/v1/viewer/PRJ-EMPTY": {
        projectName: "Empty project",
        phase: project.phase,
        total: 0,
        stories: [],
      },
      "/v1/users/me/profile": {
        id: "admin",
        email: "admin@example.com",
        displayName: "Alex",
        role: "admin",
      },
      "/v1/users": [
        {
          id: "member-1",
          email: "member@example.com",
          displayName: "Team Member",
          role: "member",
          isActive: true,
        },
      ],
      "/v1/refinement/generate-stories": {
        stories: [story],
        rawNotes: "Clients need to review approved requirements and keep draft stories private.",
        redactionCount: 0,
        provider: "platform",
        creditsRemaining: 9,
      },
    };
    const response = responses[url.pathname];
    await route.fulfill({
      status: response === undefined ? 404 : 200,
      contentType: "application/json",
      headers: { "access-control-allow-origin": "*" },
      body: JSON.stringify(response ?? { detail: "No fixture for this endpoint" }),
    });
  });
});

for (const width of widths) {
  test(`public pages remain usable at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const path of [
      "/",
      "/role-selection",
      "/login",
      "/register",
      "/forgot-password",
      "/reset-password",
      "/verify-email",
      "/viewer",
      `/viewer/${project.accessCode}`,
      "/viewer/PRJ-EMPTY",
      "/viewer/PRJ-MISSING",
      "/privacy",
      "/terms",
    ]) {
      await page.goto(path);
      await expect(page.locator("h1, h2").first()).toBeVisible();
      await expect(page.locator("footer")).toHaveCount(1);
      await expect(page.getByRole("main")).toHaveCount(1);
      await expectNoPageOverflow(page);
      if (path === "/" || path === "/login" || path === `/viewer/${project.accessCode}`) {
        const screenshotName = path === "/" ? "home" : path === "/login" ? "login" : "viewer";
        await page.screenshot({
          path: test.info().outputPath(`${screenshotName}.png`),
          fullPage: true,
        });
      }
    }
  });

  test(`workspace navigation and content fit at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await signIn(page);
    await expectNoPageOverflow(page);
    for (const destination of ["Projects", "Clients", "Backlog", "AI Refinement", "Settings"]) {
      await navigateTo(page, destination);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      await expectNoPageOverflow(page);
      if (destination === "Projects") {
        await page.getByRole("button", { name: /List$/ }).click();
        await expect(
          page.getByRole("table").getByText(project.name, { exact: true })
        ).toBeVisible();
        await expectNoPageOverflow(page);
        await page.screenshot({
          path: test.info().outputPath("projects-table.png"),
          fullPage: true,
        });
      }
    }
    await page.getByRole("tab", { name: /\bTeam$/ }).click();
    await expect(page.getByRole("cell", { name: "Team Member", exact: true })).toBeVisible();
    await expectNoPageOverflow(page);
  });
}

test("mobile landing keeps the brand and links to the product example", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 900 });
  await page.goto("/");
  await expect(
    page.locator("header").getByRole("link", { name: /open projects hub/i })
  ).toBeVisible();
  const menu = page.getByRole("button", { name: "Toggle menu" });
  await menu.click();
  await expect(menu).toHaveAttribute("aria-expanded", "true");
  await expect(
    page.getByRole("link", { name: "Documentation", exact: true }).first()
  ).toBeVisible();
  await menu.click();
  await page.getByRole("link", { name: "View Sample" }).click();
  await expect(page).toHaveURL(/#product-example$/);
  await expect(page.locator("#product-example")).toBeFocused();
  await expect(page.getByText("Product example — sample content")).toBeVisible();
  const createAccount = page.getByRole("button", { name: "Create Account", exact: true });
  await expect(createAccount).toHaveCSS("background-color", "rgb(255, 255, 255)");
  await expect(createAccount).toHaveCSS("color", "rgb(7, 91, 199)");
  await createAccount.hover();
  await expect(createAccount).toHaveCSS("background-color", "rgb(248, 250, 252)");
  await expect(createAccount).toHaveCSS("color", "rgb(6, 74, 158)");
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: test.info().outputPath("home-mobile.png"), fullPage: true });
});

test("mobile drawer returns keyboard focus and switches to desktop navigation", async ({
  page,
}) => {
  await page.setViewportSize({ width: 430, height: 900 });
  await signIn(page);
  const trigger = page.getByRole("button", { name: "Open navigation" });
  await trigger.click();
  await expect(page.getByRole("dialog", { name: "Navigation" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog", { name: "Navigation" })).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await page.setViewportSize({ width: 1023, height: 900 });
  await expect(trigger).toBeVisible();
  await page.setViewportSize({ width: 1024, height: 900 });
  await expect(trigger).not.toBeVisible();
  await expect(page.getByRole("button", { name: "Collapse navigation" })).toBeVisible();
  await page.getByRole("button", { name: "Collapse navigation" }).click();
  await expect(page.getByRole("button", { name: "Expand navigation" })).toBeVisible();
  await expectNoPageOverflow(page);
});

test.describe("Touch interaction", () => {
  test.use({ hasTouch: true });

  test("generated drafts keep all actions available on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 900 });
    await signIn(page);
    await navigateTo(page, "AI Refinement");
    const projectSelector = page.getByRole("combobox", { name: "Project", exact: true });
    await projectSelector.click();
    await projectSelector.press("ArrowDown");
    await projectSelector.press("Enter");
    await page
      .getByLabel("Discovery notes")
      .fill("Clients need to review approved requirements and keep draft stories private.");
    await page.getByRole("button", { name: "Generate Stories" }).click();
    await expect(page.getByText(story.title, { exact: true })).toBeVisible();
    for (const action of ["Approve", "Edit", "Discard"]) {
      const control = page.getByRole("button", { name: new RegExp(`\\b${action}$`) });
      await expect(control).toBeVisible();
      const bounds = await control.boundingBox();
      expect(bounds?.height).toBeGreaterThanOrEqual(44);
      expect(bounds?.width).toBeGreaterThanOrEqual(44);
    }
    await expectNoPageOverflow(page);
  });
});

test("reduced motion preserves keyboard access to the sample", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const sampleLink = page.getByRole("link", { name: "View Sample" });
  await sampleLink.focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("#product-example")).toBeFocused();
  const accountButton = page.getByRole("button", { name: "Create Account", exact: true });
  const transitionDurations = await accountButton.evaluate((button) =>
    getComputedStyle(button)
      .transitionDuration.split(",")
      .map((duration) => Number.parseFloat(duration))
  );
  expect(transitionDurations).toEqual([0.00001]);
});
