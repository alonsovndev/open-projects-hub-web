import { useMemo } from "react";

import { Form, message } from "antd";
import { useLocation, useNavigate } from "react-router-dom";

import type { AuthLocationState, ResetPasswordValues } from "@/features/auth/types";
import {
  useResendResetCodeMutation,
  useResetPasswordMutation,
} from "@/features/auth/api/admin-auth-api";
import {
  getPasswordRuleStatuses,
  validatePasswordRequirements,
} from "@/features/auth/model/password-policy";
import { getPasswordStrength } from "@/features/auth/model/password-strength";

export const useResetPasswordForm = () => {
  const [form] = Form.useForm<ResetPasswordValues>();
  const navigate = useNavigate();
  const location = useLocation();
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const [resendResetCode, { isLoading: isResending }] = useResendResetCodeMutation();

  // Carried from the Forgot Password step (same-session flow: the user reads
  // the code from their inbox and types it back into the app they still have open).
  const email = (location.state as AuthLocationState | null)?.email ?? "";

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
      await resetPassword({ ...values, email }).unwrap();
      message.success("Password reset successfully! Please sign in.");
      navigate("/login");
    } catch (error) {
      const err = error as { data?: { message?: string } };
      message.error(err?.data?.message ?? "Unable to reset password. Please try again.");
    }
  };

  const handleResendCode = async () => {
    if (!email) return;
    try {
      await resendResetCode({ email }).unwrap();
      message.success("A new code has been sent to your email.");
    } catch (error) {
      const err = error as { data?: { message?: string } };
      message.error(err?.data?.message ?? "Unable to resend the code right now.");
    }
  };

  const codeFieldRules = [
    { required: true, message: "Please enter the 6-digit code from your email." },
    { len: 6, message: "The code must be 6 characters." },
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
    email,
    isSubmitting: isLoading,
    isResending,
    passwordRuleStatuses,
    passwordStrength,
    hasPasswordInput,
    isPasswordValid,
    codeFieldRules,
    newPasswordFieldRules,
    confirmPasswordFieldRules,
    handleSubmit,
    handleResendCode,
  };
};
