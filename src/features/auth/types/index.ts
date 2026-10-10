export interface AdminLoginValues {
  email: string;
  password: string;
  remember?: boolean;
}

export interface AdminRegisterValues {
  fullName: string;
  /** Optional; the API names the workspace after the display name when blank. */
  workspaceName?: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

export interface ForgotPasswordValues {
  email: string;
}

export interface ResetPasswordValues {
  email: string;
  code: string;
  newPassword: string;
  confirmPassword: string;
}

/** Registration succeeded; the account signs in only after its email is verified. */
export interface RegisterResult {
  codeExpiresAt: string;
}

export interface VerifyEmailValues {
  email: string;
  code: string;
  /** Set by invited members, who choose their own password while verifying. */
  password?: string;
}

export type UserRole = "admin" | "member";

export interface WorkspaceSummary {
  id: string;
  name: string;
}

export interface AdminSession {
  token: string;
  /** ISO timestamp when the current refresh session lapses (server-computed; see FR-007-06). */
  sessionExpiresAt?: string;
  email: string;
  displayName: string;
  loggedInAt: string;
  role: UserRole;
  workspace?: WorkspaceSummary;
}

export interface AdminAuthResponse {
  session: AdminSession;
}

/**
 * Shape of react-router `location.state` as passed between auth screens
 * (login <-> guarded routes <-> forgot/reset password). Centralized so the
 * handful of navigate()/location.state call sites can't drift on field names.
 */
export interface AuthLocationState {
  from?: { pathname: string };
  email?: string;
  message?: string;
  /** ISO timestamp the emailed verification code expires at (register -> verify-email). */
  codeExpiresAt?: string;
}

export interface PasswordStrengthState {
  label: string;
  tone: "weak" | "medium" | "strong";
  percent: number;
}

export interface PasswordRule {
  id: string;
  label: string;
  test: (password: string) => boolean;
}

export interface PasswordRuleStatus extends PasswordRule {
  isMet: boolean;
}
