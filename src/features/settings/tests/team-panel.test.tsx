import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor, within } from "@testing-library/react";
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
  await user.click(screen.getByRole("button", { name: "Add to workspace" }));
};

// Form-filling interactions (typed fields + a submit round-trip) run close to the
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

  it("shows the Admin's role as a fixed tag", async () => {
    renderPanel();
    await screen.findByText("admin@test.com");

    expect(screen.getByText("admin")).toBeInTheDocument();
    expect(screen.queryByLabelText("Role for Admin User")).not.toBeInTheDocument();
  });

  it("lets the Admin change a member's role", async () => {
    const user = userEvent.setup();
    renderPanel();
    await screen.findByText("sam@test.com");

    await user.click(screen.getByLabelText("Role for Sam Member"));
    await user.click(await screen.findByTitle("viewer"));

    expect(await screen.findByText(/Role updated/)).toBeInTheDocument();
    const row = screen.getByText("sam@test.com").closest("tr") as HTMLElement;
    await waitFor(() => expect(within(row).getByTitle("viewer")).toBeInTheDocument());
  });

  it("does not offer to delete the Admin", async () => {
    renderPanel();
    await screen.findByText("admin@test.com");

    expect(screen.queryByLabelText("Delete Admin User")).not.toBeInTheDocument();
  });

  it("deletes a member after confirming it is permanent", async () => {
    const user = userEvent.setup();
    renderPanel();
    await screen.findByText("sam@test.com");

    await user.click(screen.getByLabelText("Delete Sam Member"));
    expect(await screen.findByText(/This can't be undone/)).toBeInTheDocument();
    await user.click(await screen.findByRole("button", { name: "Delete" }));

    await waitFor(() => expect(screen.queryByText("sam@test.com")).not.toBeInTheDocument());
  });

  it("switches a member inactive and back on", async () => {
    const user = userEvent.setup();
    renderPanel();
    await screen.findByText("sam@test.com");
    const statusSwitch = screen.getByRole("switch", { name: "Active: Sam Member" });
    expect(statusSwitch).toBeChecked();

    await user.click(statusSwitch);
    await waitFor(() => expect(statusSwitch).not.toBeChecked());

    await user.click(statusSwitch);
    await waitFor(() => expect(statusSwitch).toBeChecked());
  });

  it("gives the Admin no status switch", async () => {
    renderPanel();
    await screen.findByText("admin@test.com");

    expect(screen.queryByRole("switch", { name: "Active: Admin User" })).not.toBeInTheDocument();
  });
});
