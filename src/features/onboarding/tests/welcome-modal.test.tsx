import { describe, it, expect } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";

import { WelcomeModal } from "@/features/onboarding/components/welcome-modal";
import { OnboardingReset } from "@/features/onboarding/components/onboarding-reset";
import { server } from "@/mocks/server";
import { adminAuthConfig } from "@/resources/config/auth";
import { renderWithProviders } from "@/test/utils/render-with-providers";
import type { AdminSession, UserRole } from "@/features/auth/types";

const profileUrl = `${adminAuthConfig.apiBaseUrl}/v1/users/me/profile`;
const onboardingUrl = `${adminAuthConfig.apiBaseUrl}/v1/users/me/onboarding`;

const sessionWithRole = (role: UserRole): AdminSession => ({
  token: "test-token",
  email: "person@test.com",
  displayName: "Test Person",
  role,
  loggedInAt: new Date().toISOString(),
});

const renderAs = (role: UserRole, element = <WelcomeModal />) =>
  renderWithProviders(element, {
    preloadedState: { auth: { session: sessionWithRole(role), isBootstrapping: false } },
  });

// Serves a profile whose onboarding flag follows the PATCH calls, like the real API.
const serveProfile = (initiallyCompleted: boolean) => {
  let completed = initiallyCompleted;
  const patches: boolean[] = [];
  server.use(
    http.get(profileUrl, () =>
      HttpResponse.json({
        id: "user-1",
        email: "person@test.com",
        displayName: "Test Person",
        role: "admin",
        onboardingCompleted: completed,
      })
    ),
    http.patch(onboardingUrl, async ({ request }) => {
      const body = (await request.json()) as { completed: boolean };
      completed = body.completed;
      patches.push(body.completed);
      return HttpResponse.json({
        id: "user-1",
        email: "person@test.com",
        displayName: "Test Person",
        role: "admin",
        onboardingCompleted: completed,
      });
    })
  );
  return patches;
};

describe("WelcomeModal", { timeout: 20_000 }, () => {
  it("welcomes an admin who has not completed onboarding", async () => {
    serveProfile(false);
    renderAs("admin");

    expect(await screen.findByText("Welcome to Open Projects Hub")).toBeInTheDocument();
    expect(screen.getByText(/AI Refinement/)).toBeInTheDocument();
  });

  it("saves the dismissal and closes", async () => {
    const patches = serveProfile(false);
    const user = userEvent.setup();
    renderAs("admin");

    await user.click(await screen.findByRole("button", { name: "Got it" }));

    // A closed antd modal stays in the DOM, hidden, so assert on the accessible dialog.
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull(), { timeout: 5000 });
    expect(patches).toEqual([true]);
  });

  it("stays closed for an admin who already completed onboarding", async () => {
    serveProfile(true);
    renderAs("admin");

    await waitFor(() => expect(screen.queryByText("Welcome to Open Projects Hub")).toBeNull());
  });

  it("is not shown to members", async () => {
    serveProfile(false);
    renderAs("member");

    await waitFor(() => expect(screen.queryByText("Welcome to Open Projects Hub")).toBeNull());
  });
});

describe("OnboardingReset", { timeout: 20_000 }, () => {
  it("clears the completed flag so the welcome shows again", async () => {
    const patches = serveProfile(true);
    const user = userEvent.setup();
    renderAs(
      "admin",
      <>
        <WelcomeModal />
        <OnboardingReset />
      </>
    );

    await user.click(screen.getByRole("button", { name: "Reset onboarding" }));

    expect(await screen.findByText("Welcome to Open Projects Hub")).toBeInTheDocument();
    expect(patches).toEqual([false]);
  });
});
