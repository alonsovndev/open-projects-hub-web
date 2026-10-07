import { describe, it, expect, vi, beforeEach } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { message } from "antd";

import { useRegisterForm } from "@/features/auth/hooks/use-register-form";
import { adminAuthConfig } from "@/resources/config/auth";
import { server } from "@/mocks/server";
import { TestProviders as wrapper } from "@/test/utils/render-with-providers";

vi.mock("antd", async () => {
  const actual = await vi.importActual("antd");
  return {
    ...actual,
    message: {
      success: vi.fn(),
      error: vi.fn(),
    },
  };
});

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const registerValues = {
  fullName: "New User",
  email: "new.user@example.com",
  password: "Secure123!",
  confirmPassword: "Secure123!",
  agreeToTerms: true,
};

describe("useRegisterForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("sends the new account to email verification with the code expiry", async () => {
    const { result } = renderHook(() => useRegisterForm(), { wrapper });

    await act(async () => {
      await result.current.handleSubmit(registerValues);
    });

    expect(mockNavigate).toHaveBeenCalledWith("/verify-email", {
      state: { email: "new.user@example.com", codeExpiresAt: expect.any(String) },
    });
    expect(message.success).toHaveBeenCalledWith(
      "Account created! Check your email for a verification code."
    );
  });

  it("stays on the form and shows the server's reason when registration is refused", async () => {
    server.use(
      http.post(`${adminAuthConfig.apiBaseUrl}${adminAuthConfig.registerEndpoint}`, () =>
        HttpResponse.json({ detail: "Password is too common" }, { status: 400 })
      )
    );
    const { result } = renderHook(() => useRegisterForm(), { wrapper });

    await act(async () => {
      await result.current.handleSubmit(registerValues);
    });

    expect(mockNavigate).not.toHaveBeenCalled();
    expect(message.error).toHaveBeenCalledWith("Password is too common");
  });
});
