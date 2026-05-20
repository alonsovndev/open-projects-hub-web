import { http, HttpResponse } from "msw";
import { adminAuthConfig } from "@/resources/config/auth";

const mockUsers = [
  {
    email: "admin@test.com",
    password: "Admin123!",
    displayName: "Admin User",
    role: "admin" as const,
  },
  {
    email: "user@test.com",
    password: "User123!",
    displayName: "Regular User",
    role: "user" as const,
  },
];

export const authHandlers = [
  // Login
  http.post(
    `${adminAuthConfig.apiBaseUrl}${adminAuthConfig.loginEndpoint}`,
    async ({ request }) => {
      const body = (await request.json()) as { email: string; password: string };
      const user = mockUsers.find((u) => u.email === body.email && u.password === body.password);

      if (!user) {
        return HttpResponse.json({ message: "Invalid email or password" }, { status: 401 });
      }

      return HttpResponse.json({
        token: `mock-token-${Date.now()}`,
        accessToken: `mock-access-token-${Date.now()}`,
        refreshToken: `mock-refresh-token-${Date.now()}`,
        email: user.email,
        displayName: user.displayName,
        role: user.role,
        loggedInAt: new Date().toISOString(),
        user: {
          email: user.email,
          displayName: user.displayName,
          name: user.displayName,
          role: user.role,
        },
      });
    }
  ),

  // Register - now returns session like the real backend
  http.post(
    `${adminAuthConfig.apiBaseUrl}${adminAuthConfig.registerEndpoint}`,
    async ({ request }) => {
      const body = (await request.json()) as {
        email: string;
        displayName: string;
        password: string;
      };

      const exists = mockUsers.some((u) => u.email === body.email);
      if (exists) {
        return HttpResponse.json({ message: "Email already registered" }, { status: 409 });
      }

      // Backend returns session on successful registration (auto-login)
      return HttpResponse.json(
        {
          token: `mock-token-${Date.now()}`,
          accessToken: `mock-access-token-${Date.now()}`,
          refreshToken: `mock-refresh-token-${Date.now()}`,
          email: body.email,
          displayName: body.displayName,
          role: "viewer",
          loggedInAt: new Date().toISOString(),
          user: {
            email: body.email,
            displayName: body.displayName,
            name: body.displayName,
            role: "viewer",
          },
        },
        { status: 201 }
      );
    }
  ),

  // Refresh token
  http.post(`${adminAuthConfig.apiBaseUrl}${adminAuthConfig.refreshEndpoint}`, async () => {
    return HttpResponse.json({
      accessToken: `mock-access-token-${Date.now()}`,
      refreshToken: `mock-refresh-token-${Date.now()}`,
    });
  }),

  // Forgot password
  http.post(`${adminAuthConfig.apiBaseUrl}${adminAuthConfig.forgotPasswordEndpoint}`, async () => {
    return HttpResponse.json({ message: "Password reset link sent" });
  }),

  // Reset password
  http.post(`${adminAuthConfig.apiBaseUrl}${adminAuthConfig.resetPasswordEndpoint}`, async () => {
    return HttpResponse.json({ message: "Password updated successfully" });
  }),
];
