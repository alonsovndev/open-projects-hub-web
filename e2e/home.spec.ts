import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.route("**/*", async (route) => {
    const hostname = new URL(route.request().url()).hostname;
    if (["localhost", "127.0.0.1"].includes(hostname)) {
      await route.continue();
    } else {
      await route.abort();
    }
  });
});

test.describe("Home Page", () => {
  test("shows the requirements workflow and complete sample story", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Open Projects Hub/i);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Turn raw requirements into buildable projects."
    );
    const sample = page.getByRole("figure", { name: "Product example — sample content" });
    await expect(sample.getByRole("heading", { name: "Raw Notes", exact: true })).toBeVisible();
    await expect(sample.getByText("Maybe a dashboard?")).toBeVisible();
    await expect(sample.getByRole("heading", { name: "Refined Story", exact: true })).toBeVisible();
    await expect(sample.getByText("Approved", { exact: true })).toBeVisible();
    await expect(sample.getByRole("listitem")).toHaveText([
      "The project access code opens approved stories.",
      "Drafts remain private to the project team.",
      "Client can comment on specific items.",
      "Progress is visible in a read-only dashboard.",
    ]);
    const workflow = page.getByRole("region", { name: "Project workflow" });
    await expect(workflow.getByRole("heading")).toHaveText([
      "Capture",
      "Refine",
      "Approve",
      "Share",
    ]);
    await expect(
      page.getByRole("heading", { name: "From idea to impact.", exact: true })
    ).toBeVisible();
    await expect(page.getByRole("heading", { name: "For Freelancers", exact: true })).toBeVisible();
    await expect(page.getByRole("heading", { name: "For Clients", exact: true })).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Build with precision.", exact: true })
    ).toBeVisible();
    await expect(page.getByRole("main")).toHaveCount(1);
    await expect(page.locator("footer")).toHaveCount(1);
  });

  test("preserves CTA routes and external link destinations", async ({ page }) => {
    await page.goto("/");
    const header = page.locator("header");
    await expect(header.getByRole("link", { name: "Log In", exact: true })).toHaveAttribute(
      "href",
      "/login"
    );
    await expect(header.getByRole("link", { name: "Get Started", exact: true })).toHaveAttribute(
      "href",
      "/role-selection"
    );
    await expect(header.getByRole("link", { name: "GitHub", exact: true })).toHaveAttribute(
      "href",
      "https://github.com/alonsovndev"
    );
    await expect(header.getByRole("link", { name: "Docs", exact: true })).toHaveAttribute(
      "href",
      "https://github.com/NaranjoSolutions/open-projects-hub-docs"
    );
    await expect(page.getByRole("link", { name: "Contact", exact: true })).toHaveAttribute(
      "href",
      "https://github.com/alonsovndev"
    );
    const footer = page.locator("footer");
    await expect(footer.getByRole("link", { name: "Code (GitHub)", exact: true })).toHaveAttribute(
      "href",
      "https://github.com/alonsovndev"
    );
    await expect(
      footer.getByRole("link", { name: "GitHub repository", exact: true })
    ).toHaveAttribute("href", "https://github.com/NaranjoSolutions/open-projects-hub-web");
    await expect(footer.getByRole("link", { name: "Privacy", exact: true })).toHaveAttribute(
      "href",
      "/privacy"
    );
    await expect(footer.getByRole("link", { name: "Terms", exact: true })).toHaveAttribute(
      "href",
      "/terms"
    );

    await header.getByRole("link", { name: "Product", exact: true }).click();
    await expect(page).toHaveURL(/#features$/);
    await page.getByRole("link", { name: "Learn more about the workflow" }).click();
    await expect(page).toHaveURL(/#workflow$/);
    await page.getByRole("button", { name: "Start Project", exact: true }).click();
    await expect(page).toHaveURL(/\/role-selection$/);
    await expect(
      page.getByRole("heading", { name: "Welcome to Open Projects Hub", exact: true })
    ).toBeVisible();
    await page.goto("/");
    await page.getByRole("button", { name: "Create Account", exact: true }).click();
    await expect(page).toHaveURL(/\/register$/);
  });

  for (const width of [375, 430, 768, 900, 1024, 1280, 1440]) {
    test(`landing content fits at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/");
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      await expect(page.locator("#product-example")).toBeVisible();
      await expect
        .poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth))
        .toBe(true);
      await expect(page.getByRole("button", { name: "Toggle menu" })).toBeVisible({
        visible: width < 900,
      });
      const criteria = page.locator("#product-example").getByRole("listitem");
      await expect(criteria).toHaveCount(4);
      for (const criterion of await criteria.all()) {
        await expect(criterion).toBeVisible();
      }
      await page.screenshot({ path: test.info().outputPath(`home-${width}.png`), fullPage: true });
    });
  }

  test("mobile menu closes after selection, Escape, and switching to desktop", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 900 });
    await page.goto("/");
    const toggle = page.getByRole("button", { name: "Toggle menu" });
    await toggle.click();
    await page.keyboard.press("Escape");
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    await expect(toggle).toBeFocused();
    await toggle.click();
    await page
      .getByRole("navigation", { name: "Mobile navigation" })
      .getByRole("link", { name: "Product", exact: true })
      .click();
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    await expect(page).toHaveURL(/#features$/);
    await toggle.click();
    await page.setViewportSize({ width: 1440, height: 900 });
    await expect(toggle).not.toBeVisible();
    await expect(page.locator('button[aria-label="Toggle menu"]')).toHaveAttribute(
      "aria-expanded",
      "false"
    );
    await expect(page.getByRole("navigation", { name: "Mobile navigation" })).toHaveCount(0);
    await expect(page.getByRole("navigation", { name: "Main navigation" })).toBeVisible();
    await page.setViewportSize({ width: 375, height: 900 });
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
  });

  test("landing styling does not change the login footer or palette", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toHaveCSS("color", "rgb(15, 23, 42)");
    await page.locator("header").getByRole("link", { name: "Log In", exact: true }).click();
    await expect(page).toHaveURL(/\/login$/);
    await expect(page.locator("footer")).toHaveCount(1);
    await expect(page.locator("footer")).toHaveCSS("background-color", "rgb(26, 26, 26)");
    await expect(
      page.locator("footer").getByRole("heading", { name: "Directories" })
    ).toBeVisible();
  });
});
