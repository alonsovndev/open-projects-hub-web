export interface AdminLoginValues {
  email: string;
  password: string;
}

export interface AdminSession {
  token: string;
  email: string;
  displayName: string;
  loggedInAt: string;
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
