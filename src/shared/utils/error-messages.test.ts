import { describe, expect, it } from "vitest";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";

import { normalizeApiError } from "@/shared/utils/error-messages";
import { getErrorMessage, isApiError } from "@/shared/types/api";

const sensitiveMarker = "<SENSITIVE_TEST_MARKER>";

describe("safe error messages", () => {
  it.each([
    null,
    undefined,
    sensitiveMarker,
    [sensitiveMarker],
    { detail: [sensitiveMarker] },
    { detail: { password: sensitiveMarker } },
    { detail: sensitiveMarker, message: sensitiveMarker },
  ])("does not expose an unknown or malformed response: %j", (data) => {
    const error = normalizeApiError({ status: 500, data }, "/v1/projects");
    expect(error).toEqual({
      status: 500,
      data: {
        message: "The service is temporarily unavailable. Please try again later.",
      },
    });
    expect(JSON.stringify(error)).not.toContain(sensitiveMarker);
  });

  it.each([
    [
      "/v1/auth/login",
      401,
      { detail: sensitiveMarker },
      "The email or password is incorrect. Please try again.",
    ],
    [
      "/v1/auth/register",
      400,
      { detail: "Password is too common" },
      "Choose a less common password.",
    ],
    [
      "/v1/auth/verify-email",
      400,
      { message: "Invalid or expired verification code" },
      "This verification code is invalid or has expired. Request a new code.",
    ],
    [
      "/v1/auth/reset-password",
      404,
      { detail: "Invalid or expired reset code" },
      "This reset code is invalid or has expired. Request a new code.",
    ],
    [
      "/v1/clients/c1",
      409,
      { detail: "Cannot delete client with active projects. Archive or reassign projects first." },
      "Archive or reassign this client's active projects before deleting them.",
    ],
    [
      "/v1/users",
      409,
      { message: `User with email ${sensitiveMarker} already exists` },
      "A user with this email already exists. Use a different email address.",
    ],
    [
      "/v1/workspaces/me",
      422,
      { message: "Workspace name cannot be empty" },
      "Enter a workspace name.",
    ],
    [
      "/v1/users/me/password",
      400,
      { message: "Incorrect current password" },
      "Your current password is incorrect. Please try again.",
    ],
  ] as const)("translates known failures for %s", (path, status, data, message) => {
    expect(normalizeApiError({ status, data }, path)).toEqual({ status, data: { message } });
  });

  it("distinguishes duplicate project codes from the active-project limit", () => {
    expect(
      normalizeApiError(
        {
          status: 409,
          data: {
            detail: `A project with code '${sensitiveMarker}' already exists`,
          },
        },
        "/v1/projects"
      )
    ).toEqual({
      status: 409,
      data: {
        code: "PROJECT_CODE_EXISTS",
        message: "A project with this code already exists. Choose a different code.",
      },
    });
    expect(
      normalizeApiError(
        {
          status: 409,
          data: {
            detail:
              "Active project limit reached (3). Archive a project before creating or reactivating.",
          },
        },
        "/v1/projects"
      )
    ).toEqual({
      status: 409,
      data: {
        code: "ACTIVE_PROJECT_LIMIT",
        message:
          "You have reached the maximum of 3 active projects. Archive a project before creating a new one.",
      },
    });
    expect(
      normalizeApiError({ status: 422, data: { detail: sensitiveMarker } }, "/v1/projects")
    ).toEqual({
      status: 422,
      data: { message: "Check the information you entered and try again." },
    });
  });

  it("preserves only validated provider control fields", () => {
    const normalized = normalizeApiError(
      {
        status: 422,
        data: {
          detail: sensitiveMarker,
          code: "API_KEY_INVALID",
          provider: "openai",
          reason: "auth_failed",
          promptsKeyUpdate: true,
          apiKey: sensitiveMarker,
        },
      },
      "/v1/users/me/api-keys"
    );
    expect(normalized).toEqual({
      status: 422,
      data: {
        message: "Your AI provider rejected the API key. Update it in Settings and try again.",
        code: "API_KEY_INVALID",
        provider: "openai",
        reason: "auth_failed",
        promptsKeyUpdate: true,
      },
    });
    expect(JSON.stringify(normalized)).not.toContain(sensitiveMarker);

    const malformed = normalizeApiError(
      {
        status: 422,
        data: {
          detail: sensitiveMarker,
          code: "API_KEY_INVALID",
          provider: sensitiveMarker,
          reason: sensitiveMarker,
          promptsKeyUpdate: sensitiveMarker,
        },
      },
      "/v1/refinement/generate-stories"
    );
    expect(JSON.stringify(malformed)).not.toContain(sensitiveMarker);
    expect(malformed.data).not.toHaveProperty("provider");
    expect(malformed.data).not.toHaveProperty("reason");
    expect(malformed.data).not.toHaveProperty("promptsKeyUpdate");
  });

  it("keeps quota guidance distinct from replacing a key", () => {
    expect(
      normalizeApiError(
        {
          status: 422,
          data: {
            code: "API_KEY_INVALID",
            provider: "openai",
            reason: "quota_exhausted",
            promptsKeyUpdate: false,
          },
        },
        "/v1/refinement/generate-stories"
      )
    ).toMatchObject({
      data: {
        promptsKeyUpdate: false,
        message:
          "Your AI provider's quota is exhausted. Check your plan or choose another provider.",
      },
    });
  });

  it.each([
    [
      "invalid_format",
      true,
      "This API key has an invalid format. Check it in Settings and try again.",
    ],
    [
      "auth_failed",
      true,
      "Your AI provider rejected the API key. Update it in Settings and try again.",
    ],
    [
      "quota_exhausted",
      false,
      "Your AI provider's quota is exhausted. Check your plan or choose another provider.",
    ],
    [
      "rate_limited",
      false,
      "Your AI provider's request limit was reached. Wait and try again, or choose another provider.",
    ],
    ["network", false, "We couldn't reach your AI provider. Try again or choose another provider."],
  ] as const)(
    "preserves safe guidance for provider reason %s",
    (reason, promptsKeyUpdate, message) => {
      expect(
        normalizeApiError(
          {
            status: 422,
            data: {
              code: "API_KEY_INVALID",
              provider: "openai",
              reason,
              promptsKeyUpdate,
              detail: sensitiveMarker,
            },
          },
          "/v1/refinement/generate-stories"
        )
      ).toEqual({
        status: 422,
        data: {
          code: "API_KEY_INVALID",
          provider: "openai",
          reason,
          promptsKeyUpdate,
          message,
        },
      });
    }
  );

  it("keeps email verification and invite password prompts without echoing details", () => {
    expect(
      normalizeApiError(
        {
          status: 403,
          data: {
            detail: sensitiveMarker,
            code: "EMAIL_NOT_VERIFIED",
          },
        },
        "/v1/auth/login"
      )
    ).toEqual({
      status: 403,
      data: {
        code: "EMAIL_NOT_VERIFIED",
        message: "Please verify your email before signing in.",
      },
    });
    expect(
      normalizeApiError(
        {
          status: 400,
          data: {
            detail: "Choose a password to finish setting up your account.",
          },
        },
        "/v1/auth/verify-email"
      )
    ).toEqual({
      status: 400,
      data: {
        code: "PASSWORD_REQUIRED",
        message: "Choose a password to finish setting up your account.",
      },
    });
  });

  it("uses recognized codes only in their expected request context", () => {
    expect(
      normalizeApiError(
        {
          status: 403,
          data: {
            code: "EMAIL_NOT_VERIFIED",
            detail: sensitiveMarker,
          },
        },
        "/v1/projects"
      )
    ).toEqual({
      status: 403,
      data: {
        message: "You don't have permission to do this.",
      },
    });
  });

  it("asks for a new reset code after a lockout rather than retrying the locked code", () => {
    expect(
      normalizeApiError(
        {
          status: 429,
          data: {
            detail: "Too many attempts. Please request a new code.",
          },
        },
        "/v1/auth/reset-password"
      )
    ).toEqual({
      status: 429,
      data: {
        message: "Too many attempts. Please request a new code.",
      },
    });
  });

  it("explains client deletion conflicts without echoing the internal client identifier", () => {
    expect(
      normalizeApiError(
        {
          status: 409,
          data: {
            detail: `Client ${sensitiveMarker} has active projects and cannot be deleted`,
          },
        },
        "/v1/clients/c1"
      )
    ).toEqual({
      status: 409,
      data: {
        message: "Archive or reassign this client's active projects before deleting them.",
      },
    });
  });

  it.each([
    ["Password must be at least 8 characters long", "Use a password with at least 8 characters."],
    ["Password must contain at least one letter", "Include at least one letter in your password."],
    ["Password must contain at least one digit", "Include at least one number in your password."],
  ] as const)("explains the password requirement: %s", (detail, message) => {
    for (const path of [
      "/v1/auth/reset-password",
      "/v1/auth/verify-email",
      "/v1/users/me/password",
    ]) {
      expect(normalizeApiError({ status: 400, data: { detail } }, path)).toEqual({
        status: 400,
        data: { message },
      });
    }
  });

  it("translates the workspace validator's established response without displaying field paths", () => {
    expect(
      normalizeApiError(
        {
          status: 422,
          data: {
            detail:
              "Validation failed for field 'body -> name': Value error, Workspace name must be 1-100 characters",
          },
        },
        "/v1/workspaces/me"
      )
    ).toEqual({
      status: 422,
      data: {
        message: "Use a workspace name between 1 and 100 characters.",
      },
    });
  });

  it("preserves the refinement failure category without returned notes or details", () => {
    const error = normalizeApiError(
      {
        status: 502,
        data: {
          detail: sensitiveMarker,
          rawNotes: sensitiveMarker,
          failureClass: "timeout",
          provider: sensitiveMarker,
        },
      },
      "/v1/refinement/generate-stories"
    );
    expect(error).toEqual({
      status: 502,
      data: {
        failureClass: "timeout",
        message: "The AI provider took too long to respond. Your notes were kept. Try again.",
      },
    });
    expect(JSON.stringify(error)).not.toContain(sensitiveMarker);
  });

  it.each([
    [{ status: "FETCH_ERROR", error: sensitiveMarker }, "We couldn't connect. Please try again."],
    [
      { status: "TIMEOUT_ERROR", error: sensitiveMarker },
      "This is taking longer than expected. Please try again.",
    ],
    [
      {
        status: "PARSING_ERROR",
        originalStatus: 200,
        data: `<html>${sensitiveMarker}</html>`,
        error: sensitiveMarker,
      },
      "We couldn't complete your request. Please try again.",
    ],
    [
      { status: "CUSTOM_ERROR", data: { message: sensitiveMarker }, error: sensitiveMarker },
      "We couldn't complete your request. Please try again.",
    ],
  ] satisfies [FetchBaseQueryError, string][])(
    "preserves transport classification for %j",
    (error, message) => {
      const normalized = normalizeApiError(error, "/v1/projects");
      expect(normalized.status).toBe(error.status);
      expect("error" in normalized && normalized.error).toBe(message);
      expect(JSON.stringify(normalized)).not.toContain(sensitiveMarker);
    }
  );

  it.each([
    new Error(sensitiveMarker),
    { data: { message: sensitiveMarker } },
    null,
    sensitiveMarker,
  ])("uses the action fallback for untrusted errors: %j", (error) => {
    expect(getErrorMessage(error, "We couldn't save your changes. Please try again.")).toBe(
      "We couldn't save your changes. Please try again."
    );
  });

  it("accepts approved messages but still validates the API error shape", () => {
    const error = { status: 403, data: { message: "You don't have permission to do this." } };
    expect(isApiError(error)).toBe(true);
    expect(isApiError({ data: error.data })).toBe(false);
    expect(isApiError({ status: "OTHER", data: error.data })).toBe(false);
    expect(getErrorMessage(error)).toBe("You don't have permission to do this.");
    expect(getErrorMessage({ status: "FETCH_ERROR", error: sensitiveMarker })).toBe(
      "We couldn't connect. Please try again."
    );
  });
});
