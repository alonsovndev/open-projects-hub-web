import { describe, it, expect, vi, beforeEach } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { http, HttpResponse } from "msw";

import { useVerifyEmailForm } from "@/features/auth/hooks/use-verify-email-form";
import type { AuthLocationState } from "@/features/auth/types";
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
const mockSetSearchParams = vi.fn();
let mockSearch = "";
let mockLocationState: AuthLocationState | null = null;
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useSearchParams: () => [new URLSearchParams(mockSearch), mockSetSearchParams],
    useLocation: () => ({ ...actual.useLocation(), state: mockLocationState }),
  };
});

const verifyUrl = `${adminAuthConfig.apiBaseUrl}${adminAuthConfig.verifyEmailEndpoint}`;
const resendUrl = `${adminAuthConfig.apiBaseUrl}${adminAuthConfig.resendVerificationEndpoint}`;

describe("useVerifyEmailForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSearch = "";
    mockLocationState = {
      email: "new.user@example.com",
      codeExpiresAt: "2026-09-28T20:35:00.000Z",
    };
  });

  it("reads the email and code expiry handed over by registration", () => {
    const { result } = renderHook(() => useVerifyEmailForm(), { wrapper });

    expect(result.current.email).toBe("new.user@example.com");
    expect(result.current.codeExpiresAtLabel).not.toBe("");
  });

  it("sends a verified user to sign in with a success message", async () => {
    const { result } = renderHook(() => useVerifyEmailForm(), { wrapper });

    await act(async () => {
      await result.current.handleSubmit({ code: "ABC234" });
    });

    expect(mockNavigate).toHaveBeenCalledWith("/login", {
      state: { message: "Email verified. Please sign in." },
    });
  });

  it("shows a wrong or expired code inline and stays on the page", async () => {
    const { result } = renderHook(() => useVerifyEmailForm(), { wrapper });

    await act(async () => {
      await result.current.handleSubmit({ code: "ZZZ999" });
    });

    expect(mockNavigate).not.toHaveBeenCalled();
    expect(result.current.verifyError).toBe(
      "This verification code is invalid or has expired. Request a new code."
    );
  });

  it("shows the lockout message after too many wrong attempts", async () => {
    server.use(
      http.post(verifyUrl, () =>
        HttpResponse.json(
          { detail: "Too many attempts. Please request a new code." },
          { status: 429 }
        )
      )
    );
    const { result } = renderHook(() => useVerifyEmailForm(), { wrapper });

    await act(async () => {
      await result.current.handleSubmit({ code: "ABC234" });
    });

    expect(result.current.verifyError).toBe("Too many attempts. Please request a new code.");
  });

  it("prompts an invited member to choose a password when the link has no setup flag", async () => {
    mockSearch = "email=mate%40example.com&code=ABC234";
    mockLocationState = null;
    let sentBody: unknown;
    server.use(
      http.post(verifyUrl, async ({ request }) => {
        sentBody = await request.json();
        return HttpResponse.json(
          { detail: "Choose a password to finish setting up your account." },
          { status: 400 }
        );
      })
    );
    const { result } = renderHook(() => useVerifyEmailForm(), { wrapper });
    expect(result.current.isInvite).toBe(false);

    await act(async () => {
      await result.current.handleSubmit({ code: "ABC234" });
    });
    expect(result.current.isInvite).toBe(true);
    expect(result.current.verifyError).toBe("Choose a password to finish setting up your account.");
    expect(mockNavigate).not.toHaveBeenCalled();

    server.use(
      http.post(verifyUrl, async ({ request }) => {
        sentBody = await request.json();
        return HttpResponse.json({ verified: true });
      })
    );
    await act(async () => {
      await result.current.handleSubmit({ code: "ABC234", password: "MyOwn#Pass1" });
    });
    expect(sentBody).toEqual({
      email: "mate@example.com",
      code: "ABC234",
      password: "MyOwn#Pass1",
    });
    expect(mockNavigate).toHaveBeenCalledWith("/login", {
      state: { message: "Email verified and password set. Please sign in." },
    });
  });

  it("moves the expiry forward after a resend", async () => {
    const { result } = renderHook(() => useVerifyEmailForm(), { wrapper });
    const originalLabel = result.current.codeExpiresAtLabel;

    await act(async () => {
      await result.current.handleResendCode();
    });

    expect(result.current.resendError).toBe("");
    expect(result.current.codeExpiresAtLabel).not.toBe(originalLabel);
  });

  it("explains the resend limit when it is reached", async () => {
    server.use(
      http.post(resendUrl, () =>
        HttpResponse.json(
          { detail: "Too many code requests. Please try again in 15 minutes." },
          { status: 429 }
        )
      )
    );
    const { result } = renderHook(() => useVerifyEmailForm(), { wrapper });

    await act(async () => {
      await result.current.handleResendCode();
    });

    expect(result.current.resendError).toBe(
      "Too many code requests. Please try again in 15 minutes."
    );
  });

  it("has no email to verify when opened directly", () => {
    mockLocationState = null;
    const { result } = renderHook(() => useVerifyEmailForm(), { wrapper });

    expect(result.current.email).toBe("");
  });

  describe("opened from the emailed link", () => {
    beforeEach(() => {
      mockLocationState = null;
      mockSearch = "email=mate%40example.com&code=ABC234";
    });

    it("takes the email and code from the link and removes the code from the address", () => {
      const { result } = renderHook(() => useVerifyEmailForm(), { wrapper });

      expect(result.current.email).toBe("mate@example.com");
      expect(result.current.initialCode).toBe("ABC234");
      expect(result.current.isInvite).toBe(false);
      const remaining = mockSetSearchParams.mock.calls[0][0] as URLSearchParams;
      expect(remaining.has("code")).toBe(false);
      expect(remaining.get("email")).toBe("mate@example.com");
    });

    it("sends the password chosen by an invited member", async () => {
      mockSearch += "&setPassword=1";
      let sentBody: unknown;
      server.use(
        http.post(verifyUrl, async ({ request }) => {
          sentBody = await request.json();
          return HttpResponse.json({ verified: true });
        })
      );
      const { result } = renderHook(() => useVerifyEmailForm(), { wrapper });

      await act(async () => {
        await result.current.handleSubmit({ code: "ABC234", password: "MyOwn#Pass1" });
      });

      expect(result.current.isInvite).toBe(true);
      expect(sentBody).toEqual({
        email: "mate@example.com",
        code: "ABC234",
        password: "MyOwn#Pass1",
      });
      expect(mockNavigate).toHaveBeenCalledWith("/login", {
        state: { message: "Email verified and password set. Please sign in." },
      });
    });

    it("does not send a password for a self-registered account", async () => {
      let sentBody: unknown;
      server.use(
        http.post(verifyUrl, async ({ request }) => {
          sentBody = await request.json();
          return HttpResponse.json({ verified: true });
        })
      );
      const { result } = renderHook(() => useVerifyEmailForm(), { wrapper });

      await act(async () => {
        await result.current.handleSubmit({ code: "ABC234", password: "ignored" });
      });

      expect(sentBody).toEqual({ email: "mate@example.com", code: "ABC234" });
    });
  });
});
