import { useMemo } from "react";

import { getErrorMessage } from "@/shared/types/api";
import { Form, message } from "antd";
import { useNavigate } from "react-router-dom";

import type { AdminRegisterValues, AuthLocationState } from "@/features/auth/types";
import { useRegisterMutation } from "@/features/auth/api/admin-auth-api";
import {
  getPasswordRuleStatuses,
  validatePasswordRequirements,
} from "@/features/auth/model/password-policy";
import { getPasswordStrength } from "@/features/auth/model/password-strength";

export const useRegisterForm = () => {
  const [form] = Form.useForm<AdminRegisterValues>();
  const navigate = useNavigate();
  const [register, { isLoading }] = useRegisterMutation();

  const passwordValue = Form.useWatch("password", form) ?? "";

  const passwordRuleStatuses = useMemo(() => {
    return getPasswordRuleStatuses(passwordValue);
  }, [passwordValue]);

  const passwordStrength = useMemo(() => {
    return getPasswordStrength(passwordValue);
  }, [passwordValue]);

  const hasPasswordInput = passwordValue.length > 0;

  const isPasswordValid = useMemo(() => {
    return validatePasswordRequirements(passwordValue);
  }, [passwordValue]);

  const handleSubmit = async (values: AdminRegisterValues) => {
    try {
      const result = await register(values).unwrap();
      message.success("Account created. Check your email for a verification code.");
      const state: AuthLocationState = { email: values.email, codeExpiresAt: result.codeExpiresAt };
      navigate("/verify-email", { state });
    } catch (error) {
      message.error(getErrorMessage(error, "We couldn't create your account. Please try again."));
    }
  };

  const fullNameFieldRules = [
    { required: true, message: "Please enter your full name." },
    { min: 2, message: "Name must be at least 2 characters." },
  ];

  const workspaceNameFieldRules = [{ max: 100, message: "Use 100 characters or fewer." }];

  const emailFieldRules = [
    { required: true, message: "Please enter your work email address." },
    { type: "email" as const, message: "Please enter a valid email address." },
  ];

  const passwordFieldRules = [
    { required: true, message: "Please enter a password." },
    {
      validator: async (_: unknown, value: string | undefined) => {
        if (!value || validatePasswordRequirements(value)) return;
        throw new Error("Password must meet all listed requirements.");
      },
    },
  ];

  const confirmPasswordFieldRules = [
    { required: true, message: "Please confirm your password." },
    {
      validator: async (_: unknown, value: string | undefined) => {
        const password = form.getFieldValue("password");
        if (!value || value === password) return;
        throw new Error("Passwords do not match.");
      },
    },
  ];

  const termsFieldRules = [
    {
      validator: async (_: unknown, value: boolean | undefined) => {
        if (value === true) return;
        throw new Error("You must agree to the terms and conditions.");
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
    fullNameFieldRules,
    workspaceNameFieldRules,
    emailFieldRules,
    passwordFieldRules,
    confirmPasswordFieldRules,
    termsFieldRules,
    handleSubmit,
  };
};
