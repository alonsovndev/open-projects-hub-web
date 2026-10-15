import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";

import { AI_PROVIDERS, AI_PROVIDER_LABELS } from "@/shared/types/ai";
import type { AiProvider } from "@/shared/types/ai";

export const ERROR_MESSAGES = {
  unexpected: "We couldn't complete your request. Please try again.",
  connection: "We couldn't connect. Please try again.",
  timeout: "This is taking longer than expected. Please try again.",
  unavailable: "The service is temporarily unavailable. Please try again later.",
  permission: "You don't have permission to do this.",
  session: "Please sign in again to continue.",
  rateLimit: "Too many attempts. Please wait and try again.",
  validation: "Check the information you entered and try again.",
  credentials: "The email or password is incorrect. Please try again.",
  emailVerification: "Please verify your email before signing in.",
  emailRegistered: "An account already exists with this email. Sign in or reset your password.",
  verificationCode: "This verification code is invalid or has expired. Request a new code.",
  resetCode: "This reset code is invalid or has expired. Request a new code.",
  codeLockout: "Too many attempts. Please request a new code.",
  resendLimit: "Too many code requests. Please try again in 15 minutes.",
  passwordRequired: "Choose a password to finish setting up your account.",
  passwordCommon: "Choose a less common password.",
  passwordLength: "Use a password with at least 8 characters.",
  passwordLetter: "Include at least one letter in your password.",
  passwordDigit: "Include at least one number in your password.",
  currentPassword: "Your current password is incorrect. Please try again.",
  duplicateProject: "A project with this code already exists. Choose a different code.",
  projectLimit:
    "You have reached the maximum of 3 active projects. Archive a project before creating a new one.",
  clientHasProjects: "Archive or reassign this client's active projects before deleting them.",
  duplicateMember: "A user with this email already exists. Use a different email address.",
  adminProtected: "The workspace Admin cannot be deleted or made inactive.",
  workspaceEmpty: "Enter a workspace name.",
  workspaceLength: "The workspace name must be 100 characters or fewer.",
  workspaceName: "Use a workspace name between 1 and 100 characters.",
  keyInvalid: "Your AI provider rejected the API key. Update it in Settings and try again.",
  keyFormat: "This API key has an invalid format. Check it in Settings and try again.",
  keyCheck: "We couldn't validate this API key. Please try again.",
  providerConnection: "We couldn't reach your AI provider. Try again or choose another provider.",
  providerRateLimit:
    "Your AI provider's request limit was reached. Wait and try again, or choose another provider.",
  quota: "Your AI provider's quota is exhausted. Check your plan or choose another provider.",
  credits: "No AI credits remaining. Add your own API key in Settings to continue.",
  refinementTimeout: "The AI provider took too long to respond. Your notes were kept. Try again.",
  refinementProvider: "We couldn't generate stories right now. Your notes were kept. Try again.",
  refinementResponse: "We couldn't use the generated response. Your notes were kept. Try again.",
} as const;

const approvedMessages = new Set<string>(Object.values(ERROR_MESSAGES));

export const isApprovedErrorMessage = (message: unknown): message is string =>
  typeof message === "string" && approvedMessages.has(message);

export const errorBody = (value: unknown): Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};

const refinementMessages = {
  timeout: ERROR_MESSAGES.refinementTimeout,
  provider_error: ERROR_MESSAGES.refinementProvider,
  invalid_response: ERROR_MESSAGES.refinementResponse,
} as const;

const providerMessages = {
  invalid_format: ERROR_MESSAGES.keyFormat,
  auth_failed: ERROR_MESSAGES.keyInvalid,
  quota_exhausted: ERROR_MESSAGES.quota,
  rate_limited: ERROR_MESSAGES.providerRateLimit,
  network: ERROR_MESSAGES.providerConnection,
} as const;

const passwordMessages = {
  "Password is too common": ERROR_MESSAGES.passwordCommon,
  "Password must be at least 8 characters long": ERROR_MESSAGES.passwordLength,
  "Password must contain at least one letter": ERROR_MESSAGES.passwordLetter,
  "Password must contain at least one digit": ERROR_MESSAGES.passwordDigit,
} as const;

export const getRefinementErrorMessage = (error: unknown): string | null => {
  const failure = errorBody(error);
  const body = errorBody(failure.data);
  return failure.status === 502 &&
    typeof body.failureClass === "string" &&
    Object.prototype.hasOwnProperty.call(refinementMessages, body.failureClass)
    ? refinementMessages[body.failureClass as keyof typeof refinementMessages]
    : null;
};

/** Only fixed app text and validated control fields may cross the API error boundary. */
export function normalizeApiError(
  error: FetchBaseQueryError,
  requestPath: string
): FetchBaseQueryError {
  const body = errorBody(error.data);
  const detail = typeof body.detail === "string" ? body.detail : body.message;
  const text = typeof detail === "string" ? detail : "";
  const path = requestPath.split("?")[0];
  const status = error.status;
  let message: string = ERROR_MESSAGES.unexpected;
  const structured: Record<string, unknown> = {};

  if (status === "FETCH_ERROR") message = ERROR_MESSAGES.connection;
  else if (status === "TIMEOUT_ERROR") message = ERROR_MESSAGES.timeout;
  else if (typeof status === "number") {
    if (status >= 500) message = ERROR_MESSAGES.unavailable;
    else if (status === 401) message = ERROR_MESSAGES.session;
    else if (status === 403) message = ERROR_MESSAGES.permission;
    else if (status === 429) message = ERROR_MESSAGES.rateLimit;
    else if (status === 422) message = ERROR_MESSAGES.validation;

    if (path === "/v1/auth/login") {
      if (status === 401) message = ERROR_MESSAGES.credentials;
      if (status === 403 && body.code === "EMAIL_NOT_VERIFIED") {
        message = ERROR_MESSAGES.emailVerification;
        structured.code = "EMAIL_NOT_VERIFIED";
      }
    }
    if (path === "/v1/auth/register" && status === 409) message = ERROR_MESSAGES.emailRegistered;
    if (path === "/v1/auth/verify-email") {
      if (
        (status === 400 || status === 404) &&
        /^Invalid or expired verification code\.?$/i.test(text)
      )
        message = ERROR_MESSAGES.verificationCode;
      if (
        (status === 400 || status === 422) &&
        text === "Choose a password to finish setting up your account."
      ) {
        message = ERROR_MESSAGES.passwordRequired;
        structured.code = "PASSWORD_REQUIRED";
      }
    }
    if (
      /^\/v1\/auth\/(verify-email|reset-password)$/.test(path) &&
      status === 429 &&
      text === "Too many attempts. Please request a new code."
    )
      message = ERROR_MESSAGES.codeLockout;
    if (
      path === "/v1/auth/reset-password" &&
      (status === 400 || status === 404) &&
      /^Invalid or expired reset code\.?$/i.test(text)
    )
      message = ERROR_MESSAGES.resetCode;
    if (
      /^\/v1\/auth\/(resend-verification|resend-reset-code|forgot-password)$/.test(path) &&
      status === 429 &&
      text === "Too many code requests. Please try again in 15 minutes."
    )
      message = ERROR_MESSAGES.resendLimit;
    if (
      path === "/v1/auth/resend-reset-code" &&
      status === 429 &&
      text === "Too many reset code requests. Please try again later."
    )
      message = ERROR_MESSAGES.rateLimit;
    if (
      (/^\/v1\/auth\/(register|reset-password|verify-email)$/.test(path) ||
        path === "/v1/users/me/password") &&
      (status === 400 || status === 422) &&
      Object.prototype.hasOwnProperty.call(passwordMessages, text.replace(/\.$/, ""))
    )
      message = passwordMessages[text.replace(/\.$/, "") as keyof typeof passwordMessages];
    if (
      path === "/v1/users/me/password" &&
      status === 400 &&
      /^(?:Current password is incorrect|Incorrect current password)\.?$/i.test(text)
    )
      message = ERROR_MESSAGES.currentPassword;

    if (
      path === "/v1/projects" &&
      status === 409 &&
      /^A project with code '[^'\r\n]+' already exists\.?$/.test(text)
    ) {
      message = ERROR_MESSAGES.duplicateProject;
      structured.code = "PROJECT_CODE_EXISTS";
    } else if (
      /^\/v1\/projects(?:\/[^/]+\/reactivate)?$/.test(path) &&
      (status === 409 || status === 422) &&
      /^(?:Maximum of 3 active projects reached|Active project limit reached \(3\)\. Archive a project before (?:creating a new one|creating or reactivating)\.|You have reached the maximum of 3 active projects\. Archive a project before creating a new one\.)$/.test(
        text
      )
    ) {
      message = ERROR_MESSAGES.projectLimit;
      structured.code = "ACTIVE_PROJECT_LIMIT";
    }
    if (
      /^\/v1\/clients\/[^/]+$/.test(path) &&
      status === 409 &&
      (text === "Cannot delete client with active projects. Archive or reassign projects first." ||
        /^Client [^\r\n]+ has active projects and cannot be deleted$/.test(text))
    )
      message = ERROR_MESSAGES.clientHasProjects;
    if (
      path === "/v1/users" &&
      status === 409 &&
      /^User with email [^\r\n]+ already exists$/.test(text)
    )
      message = ERROR_MESSAGES.duplicateMember;
    if (
      /^\/v1\/users\/[^/]+(?:\/status)?$/.test(path) &&
      (status === 400 || status === 403) &&
      /^The workspace Admin cannot be (?:deleted|deactivated)$/.test(text)
    )
      message = ERROR_MESSAGES.adminProtected;
    if (path === "/v1/workspaces/me" && status === 422) {
      if (text === "Workspace name cannot be empty") message = ERROR_MESSAGES.workspaceEmpty;
      if (text === "Workspace name must be at most 100 characters")
        message = ERROR_MESSAGES.workspaceLength;
      if (
        text ===
        "Validation failed for field 'body -> name': Value error, Workspace name must be 1-100 characters"
      )
        message = ERROR_MESSAGES.workspaceName;
    }

    const providerRequest =
      /^\/v1\/users\/me\/api-keys(?:\/[^/]+(?:\/validate)?)?$/.test(path) ||
      path === "/v1/refinement/generate-stories";
    if (providerRequest && status === 422 && body.code === "API_KEY_INVALID") {
      structured.code = "API_KEY_INVALID";
      const provider = AI_PROVIDERS.includes(body.provider as AiProvider)
        ? (body.provider as AiProvider)
        : null;
      if (provider) structured.provider = provider;
      const reason =
        typeof body.reason === "string" &&
        Object.prototype.hasOwnProperty.call(providerMessages, body.reason)
          ? (body.reason as keyof typeof providerMessages)
          : null;
      if (reason) structured.reason = reason;
      if (typeof body.promptsKeyUpdate === "boolean")
        structured.promptsKeyUpdate = body.promptsKeyUpdate;
      const quotaExhausted =
        provider &&
        (text === `Your ${AI_PROVIDER_LABELS[provider]} quota is exhausted.` ||
          text ===
            `Your ${AI_PROVIDER_LABELS[provider]} quota is exhausted. Upgrade your plan or switch providers.`);
      message = reason
        ? providerMessages[reason]
        : quotaExhausted
          ? ERROR_MESSAGES.quota
          : body.promptsKeyUpdate === true
            ? ERROR_MESSAGES.keyInvalid
            : ERROR_MESSAGES.keyCheck;
    }
    if (path === "/v1/refinement/generate-stories") {
      if (status === 402) message = ERROR_MESSAGES.credits;
      const refinementMessage = getRefinementErrorMessage(error);
      if (refinementMessage) {
        message = refinementMessage;
        structured.failureClass = body.failureClass;
      }
    }
  }

  const data = { message, ...structured };
  if (typeof status === "number") return { status, data };
  if (status === "PARSING_ERROR")
    return { status, originalStatus: error.originalStatus, data: message, error: message };
  if (status === "CUSTOM_ERROR") return { status, data, error: message };
  return { status, error: message };
}
