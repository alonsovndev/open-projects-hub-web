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
        email: user.email,
        displayName: user.displayName,
        role: user.role,
        loggedInAt: new Date().toISOString(),
      });
    }
  ),

  // Register
  http.post(
    `${adminAuthConfig.apiBaseUrl}${adminAuthConfig.registerEndpoint}`,
    async ({ request }) => {
      const body = (await request.json()) as { email: string; fullName: string };

      const exists = mockUsers.some((u) => u.email === body.email);
      if (exists) {
        return HttpResponse.json({ message: "Email already registered" }, { status: 409 });
      }

      return HttpResponse.json({ message: "Account created successfully" });
    }
  ),

  // Forgot password
  http.post(`${adminAuthConfig.apiBaseUrl}${adminAuthConfig.forgotPasswordEndpoint}`, async () => {
    return HttpResponse.json({ message: "Password reset link sent" });
  }),

  // Reset password
  http.post(`${adminAuthConfig.apiBaseUrl}${adminAuthConfig.resetPasswordEndpoint}`, async () => {
    return HttpResponse.json({ message: "Password updated successfully" });
  }),
];
