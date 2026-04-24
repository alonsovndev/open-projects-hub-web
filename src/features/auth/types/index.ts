export interface AdminLoginValues {
  email: string;
  password: string;
}

export type UserRole = "admin" | "user" | "viewer";

export interface AdminSession {
  token: string;
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
