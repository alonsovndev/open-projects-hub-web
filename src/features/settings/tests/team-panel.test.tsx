import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { TeamPanel } from "@/features/settings/components/team-panel";
import { resetTeamFixtures } from "@/mocks/handlers/team";
import { renderWithProviders } from "@/test/utils/render-with-providers";
import type { AdminSession } from "@/features/auth/types";

const session: AdminSession = {
  token: "test-token",
  email: "admin@test.com",
  displayName: "Admin User",
  role: "admin",
  loggedInAt: new Date().toISOString(),
};

const renderPanel = () =>
  renderWithProviders(<TeamPanel />, {
    preloadedState: { auth: { session, isBootstrapping: false } },
  });

const fillForm = async (user: ReturnType<typeof userEvent.setup>, email: string) => {
  await user.type(screen.getByLabelText("Full name"), "Alex Doe");
  await user.type(screen.getByLabelText("Email"), email);
  await user.type(screen.getByLabelText("Temporary password"), "TempPass123");
  await user.click(screen.getByRole("button", { name: "Add to workspace" }));
};

// Form-filling interactions (4 typed fields + a submit round-trip) run close to the
// default 5s budget under full-suite contention, matching the precedent in
// projects-role-rendering.test.tsx.
describe("TeamPanel", { timeout: 20_000 }, () => {
  beforeEach(() => {
    resetTeamFixtures();
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  it("lists the people in the workspace", async () => {
    renderPanel();

    expect(await screen.findByText("admin@test.com")).toBeInTheDocument();
  });

  it("offers only the member and viewer roles", async () => {
    const user = userEvent.setup();
    renderPanel();

    await user.click(screen.getByLabelText("Role"));

    const listbox = await screen.findByRole("listbox");
    // An Admin cannot be added: the API refuses it until roles can be changed.
    expect(within(listbox).getAllByRole("option").map((option) => option.textContent)).toEqual([
      "member",
      "viewer",
    ]);
  });

  it("adds a member and shows them in the list", async () => {
    const user = userEvent.setup();
    renderPanel();
    await screen.findByText("admin@test.com");

    await fillForm(user, "alex@example.com");

    expect(await screen.findByText("alex@example.com")).toBeInTheDocument();
    expect(screen.getByLabelText("Full name")).toHaveValue("");
  });

  it("keeps the form filled when the email is already taken", async () => {
    const user = userEvent.setup();
    renderPanel();
    await screen.findByText("admin@test.com");

    await fillForm(user, "admin@test.com");

    expect(await screen.findByText(/already exists/i)).toBeInTheDocument();
    expect(screen.getByLabelText("Full name")).toHaveValue("Alex Doe");
  });
});
