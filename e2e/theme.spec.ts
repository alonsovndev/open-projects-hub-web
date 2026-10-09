import { test, expect } from "@playwright/test";
import type { Page } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.route("**/*", async (route) => {
    const url = new URL(route.request().url());
    if (url.pathname.startsWith("/v1/")) {
      const responses: Record<string, unknown> = {
        "/v1/auth/login": {
          token: "sample-access-token",
          email: "admin@example.com",
          displayName: "Alex",
          role: "admin",
        },
        "/v1/dashboard/stats": {
          totalProjects: 0,
          activeProjects: 0,
          totalStories: 0,
          assignedStories: 0,
          completedStories: 0,
        },
        "/v1/projects": { items: [], total: 0, page: 1, per_page: 10 },
        "/v1/users/me/credits": { credits: 10, totalGranted: 10 },
        "/v1/clients": {
          items: [{ id: "client-1", name: "Metro Health", email: "client@example.com" }],
          total: 1,
          page: 1,
          per_page: 10,
        },
        "/v1/viewer/PRJ-DEMX23CD": {
          projectName: "Metro Portal",
          phase: "discovery",
          total: 0,
          stories: [],
        },
      };
      await route.fulfill({
        status: responses[url.pathname] === undefined ? 404 : 200,
        contentType: "application/json",
        headers: { "access-control-allow-origin": "*" },
        body: JSON.stringify(responses[url.pathname] ?? { detail: "No fixture" }),
      });
    } else if (["localhost", "127.0.0.1"].includes(url.hostname)) {
      await route.continue();
    } else {
      await route.abort();
    }
  });
});

const expectTheme = async (page: Page, mode: "light" | "dark") => {
  await expect(page.locator("html")).toHaveAttribute("data-theme", mode);
  await expect(page.locator("html")).toHaveCSS("color-scheme", mode);
};

const expectHeaderToggle = async (page: Page, mode: "light" | "dark") => {
  const toggle = page.locator("header").getByRole("button", {
    name: mode === "light" ? "Switch to dark mode" : "Switch to light mode",
  });
  await expect(toggle).toBeVisible();
  const bounds = await toggle.boundingBox();
  const header = await page.locator("header").boundingBox();
  if (!bounds || !header) throw new Error("Header and theme toggle must have visible bounds");
  expect(bounds.width).toBeGreaterThanOrEqual(44);
  expect(bounds.height).toBeGreaterThanOrEqual(44);
  expect(header.x + header.width - bounds.x - bounds.width).toBeLessThanOrEqual(32);
  await expect
    .poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth))
    .toBe(true);
  return toggle;
};

for (const mode of ["light", "dark"] as const) {
  for (const width of [320, 375, 1280]) {
    test(`follows device ${mode} and fits at ${width}px`, async ({ page }) => {
      await page.emulateMedia({ colorScheme: mode });
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/");
      await expectTheme(page, mode);
      await expectHeaderToggle(page, mode);
      expect(await page.evaluate(() => localStorage.getItem("oph-theme"))).toBeNull();
      const opposite = mode === "light" ? "dark" : "light";
      await page.emulateMedia({ colorScheme: opposite });
      await expectTheme(page, opposite);
      await expectHeaderToggle(page, opposite);
    });
  }
}

test("keyboard toggle persists through reload and navigation", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/");
  const toggle = await expectHeaderToggle(page, "light");
  await toggle.focus();
  await page.keyboard.press("Enter");
  await expectTheme(page, "dark");
  await expect(page.getByRole("button", { name: "Switch to light mode" })).toBeFocused();
  expect(await page.evaluate(() => localStorage.getItem("oph-theme"))).toBe("dark");
  await page.emulateMedia({ colorScheme: "dark" });
  await page.emulateMedia({ colorScheme: "light" });
  await expectTheme(page, "dark");
  await page.reload();
  await expectTheme(page, "dark");
  await expectHeaderToggle(page, "dark");
  await page.goto("/role-selection");
  await expectHeaderToggle(page, "dark");
  await page.goto("/login");
  await expectTheme(page, "dark");
  await expect(page.locator("body")).toHaveCSS("background-color", "rgb(20, 20, 20)");
});

test("saved light mode takes precedence over a dark device", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.addInitScript(() => localStorage.setItem("oph-theme", "light"));
  await page.goto("/");
  await expectTheme(page, "light");
  await expectHeaderToggle(page, "light");
});

test("dark landing cards and example dialog use readable surfaces", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/");
  await expect(page.locator("header")).toHaveCSS("background-color", "rgb(31, 31, 31)");
  await expect(page.locator("h1")).toHaveCSS("color", "rgb(240, 240, 240)");
  await expect(page.locator('[data-visual="capture"]')).toHaveCSS(
    "background-color",
    "rgb(25, 39, 55)"
  );
  await expect(page.locator('[data-audience="clients"]')).toHaveCSS(
    "background-color",
    "rgb(43, 38, 29)"
  );
  await page.getByRole("button", { name: "View Example" }).click();
  const dialog = page.getByRole("dialog", { name: "Example: from notes to story" });
  await expect(dialog).toBeVisible();
  await expect(page.locator(".ant-modal-container")).toHaveCSS(
    "background-color",
    "rgb(38, 38, 38)"
  );
  await expect(dialog.getByRole("heading", { name: "Raw Notes", exact: true })).toHaveCSS(
    "color",
    "rgb(240, 240, 240)"
  );
  await page.screenshot({ path: test.info().outputPath("dark-example.png"), fullPage: true });
});

test("dark theme tooltip retains readable text", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/");
  await page.getByRole("button", { name: "Switch to light mode" }).hover();
  const tooltip = page.getByRole("tooltip", { name: "Switch to light mode" });
  await expect(tooltip).toBeVisible();
  await expect(tooltip).toHaveCSS("color", "rgb(240, 240, 240)");
  await expect(tooltip).toHaveCSS("background-color", "rgb(66, 66, 66)");
});

test("client viewer inherits the preference and exposes the toggle", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.setViewportSize({ width: 375, height: 900 });
  await page.goto("/viewer/PRJ-DEMX23CD");
  await expect(page.getByRole("heading", { name: "Metro Portal" })).toBeVisible();
  await expectTheme(page, "dark");
  await (await expectHeaderToggle(page, "dark")).click();
  await expectTheme(page, "light");
  expect(await page.evaluate(() => localStorage.getItem("oph-theme"))).toBe("light");
});

for (const width of [320, 1280]) {
  test(`workspace toggle, tables, and static dialogs work at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto("/login");
    await page.getByLabel("Email", { exact: true }).fill("admin@example.com");
    await page.getByLabel("Password", { exact: true }).fill("Sample123!");
    await page.getByRole("button", { name: "Sign In", exact: true }).click();
    await expect(page.getByRole("heading", { name: /welcome back/i })).toBeVisible();
    await (await expectHeaderToggle(page, "light")).click();
    await expectTheme(page, "dark");
    await expectHeaderToggle(page, "dark");
    if (width < 1024) await page.getByRole("button", { name: "Open navigation" }).click();
    await page.getByRole("menuitem", { name: "Clients", exact: true }).click();
    await expect(page.getByRole("dialog", { name: "Navigation" })).not.toBeVisible();
    await expect(page.getByRole("cell", { name: "Metro Health", exact: true })).toBeVisible();
    await expect(page.locator(".ant-table-thead > tr > th").first()).toHaveCSS(
      "background-color",
      "rgb(38, 38, 38)"
    );
    await expectHeaderToggle(page, "dark");
    await page.getByRole("button", { name: "Delete Metro Health" }).click();
    const confirmation = page.getByRole("dialog", { name: "Delete Client" });
    await expect(confirmation).toBeVisible();
    await expect(page.locator(".ant-modal-container")).toHaveCSS(
      "background-color",
      "rgb(38, 38, 38)"
    );
    await confirmation.getByRole("button", { name: "Cancel" }).click();
    await page.screenshot({
      path: test.info().outputPath(`dark-workspace-${width}.png`),
      fullPage: true,
    });
  });
}
