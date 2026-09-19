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
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export type UserRole = "admin" | "user" | "viewer";

export interface AdminSession {
  token: string;
  refreshToken?: string;
  email: string;
  displayName: string;
  loggedInAt: string;
  role: UserRole;
}

export interface AdminAuthResponse {
  session: AdminSession;
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
