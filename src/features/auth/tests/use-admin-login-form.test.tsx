import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";

import { useAdminLoginForm } from "@/features/auth/hooks/use-admin-login-form";
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

interface MaybeValidatorRule {
  required?: boolean;
  validator?: (rule: unknown, value: string) => Promise<void>;
}

/** Runs every `validator` rule in the list against `value`, collecting rejection messages. */
const runValidators = async (rules: MaybeValidatorRule[], value: string): Promise<string[]> => {
  const errors: string[] = [];

  for (const rule of rules) {
    if (!rule.validator) continue;
    try {
      await rule.validator({}, value);
    } catch (error) {
      errors.push((error as Error).message);
    }
  }

  return errors;
};

describe("useAdminLoginForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("does not hold an existing password to the new-password policy", async () => {
    // Sign-in must submit whatever the user actually has: an account created
    // before the current policy (no symbol, no uppercase) must still reach the
    // server, which is the only authority on whether the credential is valid.
    const { result } = renderHook(() => useAdminLoginForm(), { wrapper });

    const errors = await runValidators(result.current.passwordFieldRules, "legacypass1");

    expect(errors).toEqual([]);
  });

  it("still requires a password to be entered", () => {
    const { result } = renderHook(() => useAdminLoginForm(), { wrapper });

    expect(result.current.passwordFieldRules.some((rule) => rule.required)).toBe(true);
  });

  it("keeps submit disabled until an email and password are present", () => {
    const { result } = renderHook(() => useAdminLoginForm(), { wrapper });

    expect(result.current.isSubmitEnabled).toBe(false);
  });
});
