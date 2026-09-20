export interface AdminLoginValues {
  email: string;
  password: string;
  remember?: boolean;
}

export interface AdminRegisterValues {
  fullName: string;
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

export type UserRole = "admin" | "user" | "viewer";

export interface AdminSession {
  token: string;
  refreshToken?: string;
  /** ISO timestamp when the current refresh session lapses (server-computed; see FR-007-06). */
  sessionExpiresAt?: string;
  email: string;
  displayName: string;
  loggedInAt: string;
  role: UserRole;
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
