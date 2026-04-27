import { useMemo, useState } from "react";

import { Form, message } from "antd";
import { useNavigate } from "react-router-dom";

import type { ResetPasswordValues } from "@/features/auth/types";
import {
  getPasswordRuleStatuses,
  validatePasswordRequirements,
} from "@/features/auth/model/password-policy";
import { getPasswordStrength } from "@/features/auth/model/password-strength";

export const useResetPasswordForm = () => {
  const [form] = Form.useForm<ResetPasswordValues>();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const newPasswordValue = Form.useWatch("newPassword", form) ?? "";
  const confirmPasswordValue = Form.useWatch("confirmPassword", form) ?? "";

  const passwordRuleStatuses = useMemo(() => {
    return getPasswordRuleStatuses(newPasswordValue);
  }, [newPasswordValue]);

  const passwordStrength = useMemo(() => {
    return getPasswordStrength(newPasswordValue);
  }, [newPasswordValue]);

  const hasPasswordInput = newPasswordValue.length > 0;

  const isPasswordValid = useMemo(() => {
    return validatePasswordRequirements(newPasswordValue);
  }, [newPasswordValue]);

  const doPasswordsMatch =
    newPasswordValue === confirmPasswordValue && confirmPasswordValue.length > 0;

  const handleSubmit = async (values: ResetPasswordValues) => {
    setIsSubmitting(true);

    try {
      // TODO: Implement actual reset password API call
      console.log("Reset password values:", values);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      message.success("Password updated successfully! Please sign in.");
      navigate("/login");
    } catch (error) {
      message.error("Unable to update password. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentPasswordFieldRules = [
    {
      required: true,
      message: "Please enter your current password.",
    },
  ];

  const newPasswordFieldRules = [
    {
      required: true,
      message: "Please enter a new password.",
    },
    {
      validator: async (_: unknown, value: string | undefined) => {
        const password = value ?? "";

        if (!password) {
          return;
        }

        if (validatePasswordRequirements(password)) {
          return;
        }

        throw new Error("Password must meet all listed requirements.");
      },
    },
  ];

  const confirmPasswordFieldRules = [
    {
      required: true,
      message: "Please confirm your new password.",
    },
    {
      validator: async (_: unknown, value: string | undefined) => {
        const confirmPassword = value ?? "";

        if (!confirmPassword) {
          return;
        }

        if (confirmPassword === newPasswordValue) {
          return;
        }

        throw new Error("Passwords do not match.");
      },
    },
  ];

  return {
    form,
    isSubmitting,
    passwordRuleStatuses,
    passwordStrength,
    hasPasswordInput,
    isPasswordValid,
    doPasswordsMatch,
    currentPasswordFieldRules,
    newPasswordFieldRules,
    confirmPasswordFieldRules,
    handleSubmit,
  };
};
