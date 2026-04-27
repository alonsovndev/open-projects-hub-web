import { useMemo } from "react";

import { Form, message } from "antd";
import { useNavigate } from "react-router-dom";

import type { ResetPasswordValues } from "@/features/auth/types";
import { useResetPasswordMutation } from "@/features/auth/api/admin-auth-api";
import {
  getPasswordRuleStatuses,
  validatePasswordRequirements,
} from "@/features/auth/model/password-policy";
import { getPasswordStrength } from "@/features/auth/model/password-strength";

export const useResetPasswordForm = () => {
  const [form] = Form.useForm<ResetPasswordValues>();
  const navigate = useNavigate();
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const newPasswordValue = Form.useWatch("newPassword", form) ?? "";

  const passwordRuleStatuses = useMemo(
    () => getPasswordRuleStatuses(newPasswordValue),
    [newPasswordValue]
  );
  const passwordStrength = useMemo(() => getPasswordStrength(newPasswordValue), [newPasswordValue]);
  const hasPasswordInput = newPasswordValue.length > 0;
  const isPasswordValid = useMemo(
    () => validatePasswordRequirements(newPasswordValue),
    [newPasswordValue]
  );

  const handleSubmit = async (values: ResetPasswordValues) => {
    try {
      await resetPassword(values).unwrap();
      message.success("Password updated successfully! Please sign in.");
      navigate("/login");
    } catch (error) {
      const err = error as { data?: { message?: string } };
      message.error(err?.data?.message ?? "Unable to update password. Please try again.");
    }
  };

  const currentPasswordFieldRules = [
    { required: true, message: "Please enter your current password." },
  ];

  const newPasswordFieldRules = [
    { required: true, message: "Please enter a new password." },
    {
      validator: async (_: unknown, value: string | undefined) => {
        if (!value || validatePasswordRequirements(value)) return;
        throw new Error("Password must meet all listed requirements.");
      },
    },
  ];

  const confirmPasswordFieldRules = [
    { required: true, message: "Please confirm your new password." },
    {
      validator: async (_: unknown, value: string | undefined) => {
        const newPassword = form.getFieldValue("newPassword");
        if (!value || value === newPassword) return;
        throw new Error("Passwords do not match.");
      },
    },
  ];

  return {
    form,
    isSubmitting: isLoading,
    passwordRuleStatuses,
    passwordStrength,
    hasPasswordInput,
    isPasswordValid,
    currentPasswordFieldRules,
    newPasswordFieldRules,
    confirmPasswordFieldRules,
    handleSubmit,
  };
};
