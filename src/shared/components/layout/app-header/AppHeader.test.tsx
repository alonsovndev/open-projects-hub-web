import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";

import { initializeTheme } from "@/app/theme/theme-provider";
import { renderWithProviders } from "@/test/utils/render-with-providers";
import { AppHeader } from "./AppHeader";

describe("AppHeader theme toggle", () => {
  beforeEach(() => {
    localStorage.removeItem("oph-theme");
    initializeTheme();
  });

  it.each(["default", "landing"] as const)("switches from the %s header", async (variant) => {
    renderWithProviders(<AppHeader variant={variant} />);
    await userEvent.click(screen.getByRole("button", { name: "Switch to dark mode" }));
    expect(screen.getByRole("button", { name: "Switch to light mode" })).toBeInTheDocument();
    expect(document.documentElement.dataset.theme).toBe("dark");
  });

  it("keeps the toggle outside the mobile menu", async () => {
    renderWithProviders(<AppHeader variant="landing" />);
    const toggle = screen.getByRole("button", { name: "Switch to dark mode" });
    await userEvent.click(screen.getByRole("button", { name: "Toggle menu" }));
    expect(document.getElementById("landing-mobile-menu")).not.toContainElement(toggle);
    await userEvent.click(toggle);
    expect(screen.getByRole("button", { name: "Switch to light mode" })).toBeInTheDocument();
  });
});
