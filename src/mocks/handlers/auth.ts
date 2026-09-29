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

  // Register - the account must verify its email before it can sign in
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

      return HttpResponse.json(
        {
          email: `${body.email.slice(0, 2)}***@${body.email.split("@")[1]}`,
          verificationRequired: true,
          nextStep: "verify-email",
          codeExpiresAt: new Date(Date.now() + 5 * 60_000).toISOString(),
        },
        { status: 201 }
      );
    }
  ),

  // Verify email — mock code is fixed for local testing without real email delivery
  http.post(
    `${adminAuthConfig.apiBaseUrl}${adminAuthConfig.verifyEmailEndpoint}`,
    async ({ request }) => {
      const body = (await request.json()) as { email: string; code: string };

      if (body.code.toUpperCase() !== "ABC234") {
        return HttpResponse.json(
          { message: "Invalid or expired verification code" },
          { status: 400 }
        );
      }

      return HttpResponse.json({ verified: true });
    }
  ),

  // Resend verification — always the same generic response
  http.post(
    `${adminAuthConfig.apiBaseUrl}${adminAuthConfig.resendVerificationEndpoint}`,
    async () => {
      return HttpResponse.json({
        message: "If this email is awaiting verification, a new code has been sent.",
      });
    }
  ),

  // Refresh token
  http.post(`${adminAuthConfig.apiBaseUrl}${adminAuthConfig.refreshEndpoint}`, async () => {
    return HttpResponse.json({
      accessToken: `mock-access-token-${Date.now()}`,
      refreshToken: `mock-refresh-token-${Date.now()}`,
    });
  }),

  // Forgot password — always the same generic response (FR-009-01)
  http.post(`${adminAuthConfig.apiBaseUrl}${adminAuthConfig.forgotPasswordEndpoint}`, async () => {
    return HttpResponse.json({
      message: "If an account exists for this email, a reset code has been sent.",
    });
  }),

  // Resend reset code
  http.post(`${adminAuthConfig.apiBaseUrl}${adminAuthConfig.resendResetCodeEndpoint}`, async () => {
    return HttpResponse.json({
      message: "If an account exists for this email, a reset code has been sent.",
    });
  }),

  // Reset password — mock code is fixed for local testing without real email delivery
  http.post(
    `${adminAuthConfig.apiBaseUrl}${adminAuthConfig.resetPasswordEndpoint}`,
    async ({ request }) => {
      const body = (await request.json()) as { email: string; code: string; newPassword: string };

      if (body.code !== "ABC234") {
        return HttpResponse.json({ message: "Invalid or expired reset code" }, { status: 404 });
      }

      return HttpResponse.json({ message: "Password has been reset successfully." });
    }
  ),

  // Logout
  http.post(`${adminAuthConfig.apiBaseUrl}${adminAuthConfig.logoutEndpoint}`, async () => {
    return HttpResponse.json({ message: "Logged out successfully." });
  }),
];
