import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { AiProvidersPanel } from "@/features/settings/components/ai-providers";
import { renderWithProviders } from "@/test/utils/render-with-providers";
import type { AdminSession } from "@/features/auth/types";

const session: AdminSession = {
  token: "test-token",
  email: "admin@test.com",
  displayName: "Admin",
  role: "admin",
  loggedInAt: new Date().toISOString(),
};

const renderPanel = () =>
  renderWithProviders(<AiProvidersPanel />, {
    preloadedState: { auth: { session, isBootstrapping: false } },
  });

describe("AiProvidersPanel", () => {
  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  it("shows the credit balance out of the granted total", async () => {
    renderPanel();

    expect(await screen.findByText("3 of 5 remaining")).toBeInTheDocument();
  });

  it("lists every supported provider", async () => {
    renderPanel();

    expect(await screen.findByText("Gemini")).toBeInTheDocument();
    expect(screen.getByText("OpenAI")).toBeInTheDocument();
    expect(screen.getByText("DeepSeek")).toBeInTheDocument();
  });

  it("marks a configured provider and shows only its mask", async () => {
    renderPanel();

    expect(await screen.findByText("Configured")).toBeInTheDocument();
    expect(screen.getByText("sk-proj***...1234")).toBeInTheDocument();
  });

  it("offers Replace and Delete for a configured provider, and Add for the rest", async () => {
    renderPanel();

    expect(await screen.findByLabelText("Replace the OpenAI API key")).toBeInTheDocument();
    expect(screen.getByLabelText("Delete the OpenAI API key")).toBeInTheDocument();
    expect(screen.getByLabelText("Add a Gemini API key")).toBeInTheDocument();
  });

  it("never renders a control that would reveal a stored key", async () => {
    // FR-010-07: no plaintext retrieval, and deliberately no Copy button.
    renderPanel();

    await screen.findByText("Configured");
    expect(screen.queryByRole("button", { name: /copy/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /reveal|show key/i })).not.toBeInTheDocument();
  });

  it("warns before replacing an existing key", async () => {
    const user = userEvent.setup();
    renderPanel();

    await user.click(await screen.findByLabelText("Replace the OpenAI API key"));

    await waitFor(() => {
      expect(screen.getByText("Your current key will stop working")).toBeInTheDocument();
    });
  });

  it("masks the key input so it is never on screen in plain text", async () => {
    const user = userEvent.setup();
    renderPanel();

    await user.click(await screen.findByLabelText("Add a Gemini API key"));

    const input = await screen.findByPlaceholderText("Paste your Gemini key");
    expect(input).toHaveAttribute("type", "password");
  });

  it("labels the key field for assistive technology", async () => {
    const user = userEvent.setup();
    renderPanel();

    await user.click(await screen.findByLabelText("Add a Gemini API key"));

    expect(await screen.findByLabelText("Gemini API key")).toBeInTheDocument();
  });
});
