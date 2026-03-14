import type { PasswordStrengthState } from "@/features/admin-auth/types";

import { passwordRules } from "./password-policy";

export const getPasswordStrength = (password: string): PasswordStrengthState => {
  const score = passwordRules.filter((rule) => rule.test(password)).length;

  if (score <= 1) {
    return {
      label: "Weak password",
      tone: "weak",
      percent: 33,
    };
  }

  if (score <= 3) {
    return {
      label: "Medium: add more variety for a stronger password",
      tone: "medium",
      percent: 66,
    };
  }

  return {
    label: "Strong password",
    tone: "strong",
    percent: 100,
  };
};
