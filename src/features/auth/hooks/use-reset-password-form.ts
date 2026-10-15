import { useEffect, useMemo, useState } from "react";

import { getErrorMessage } from "@/shared/types/api";
import { Form, message } from "antd";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

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

  const [searchParams, setSearchParams] = useSearchParams();

  // Carried from the Forgot Password step (same-session flow) or, when the person opened
  // the emailed link, from its query string.
  const email =
    searchParams.get("email") ?? (location.state as AuthLocationState | null)?.email ?? "";
  const [initialCode] = useState(() => searchParams.get("code") ?? "");

  // Keep the code out of the address bar, history and any later Referer header.
  useEffect(() => {
    if (!searchParams.has("code")) return;
    const remaining = new URLSearchParams(searchParams);
    remaining.delete("code");
    setSearchParams(remaining, { replace: true });
  }, [searchParams, setSearchParams]);

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
      message.success("Password reset. Please sign in.");
      navigate("/login");
    } catch (error) {
      message.error(getErrorMessage(error, "We couldn't reset your password. Please try again."));
    }
  };

  const handleResendCode = async () => {
    if (!email) return;
    try {
      await resendResetCode({ email }).unwrap();
      message.success(
        "If an account exists for this email, a new reset code has been sent. Check your email."
      );
    } catch (error) {
      message.error(getErrorMessage(error, "We couldn't send a new code. Please try again."));
    }
  };

  const codeFieldRules = [
    { required: true, message: "Please enter the 6-character code from your email." },
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
    initialCode,
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
