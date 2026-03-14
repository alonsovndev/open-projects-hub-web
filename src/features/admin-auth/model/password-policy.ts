import type { PasswordRule, PasswordRuleStatus } from "@/features/admin-auth/types";

export const passwordRules: PasswordRule[] = [
  {
    id: "length",
    label: "At least 8 characters",
    test: (password) => password.length >= 8,
  },
  {
    id: "case",
    label: "Uppercase and lowercase letters",
    test: (password) => /[A-Z]/.test(password) && /[a-z]/.test(password),
  },
  {
    id: "number",
    label: "At least 1 number",
    test: (password) => /\d/.test(password),
  },
  {
    id: "symbol",
    label: "At least 1 symbol",
    test: (password) => /[^A-Za-z0-9]/.test(password),
  },
];

export const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const getPasswordRuleStatuses = (password: string): PasswordRuleStatus[] => {
  return passwordRules.map((rule) => ({
    ...rule,
    isMet: rule.test(password),
  }));
};

export const isValidEmail = (email: string) => {
  return emailPattern.test(email.trim());
};

export const validatePasswordRequirements = (password: string) => {
  return passwordRules.every((rule) => rule.test(password));
};
