import { http, HttpResponse } from "msw";

import { adminAuthConfig } from "@/resources/config/auth";

const base = adminAuthConfig.apiBaseUrl;

// Defaults to a returning user so screens that mount the welcome do not open it unasked;
// tests that exercise onboarding override the profile handler.
const profile = {
  id: "user-1",
  email: "admin@test.com",
  displayName: "Admin User",
  role: "admin",
  isActive: true,
  onboardingCompleted: true,
};

export const userHandlers = [
  http.get(`${base}/v1/users/me/profile`, () => HttpResponse.json(profile)),
  http.patch(`${base}/v1/users/me/onboarding`, async ({ request }) => {
    const { completed } = (await request.json()) as { completed: boolean };
    return HttpResponse.json({ ...profile, onboardingCompleted: completed });
  }),
];
