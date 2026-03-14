import { useMemo } from "react";

import { Form, message } from "antd";
import { useNavigate } from "react-router-dom";

import {
  getPasswordRuleStatuses,
  isValidEmail,
  validatePasswordRequirements,
} from "@/features/admin-auth/model/password-policy";
import { getPasswordStrength } from "@/features/admin-auth/model/password-strength";
import type { AdminLoginValues } from "@/features/admin-auth/types";

export const useAdminLoginForm = () => {
  const [form] = Form.useForm<AdminLoginValues>();
  const navigate = useNavigate();
  const emailValue = Form.useWatch("email", form) ?? "";
  const passwordValue = Form.useWatch("password", form) ?? "";

  const passwordRuleStatuses = useMemo(() => {
    return getPasswordRuleStatuses(passwordValue);
  }, [passwordValue]);

  const passwordStrength = useMemo(() => {
    return getPasswordStrength(passwordValue);
  }, [passwordValue]);

  const hasPasswordInput = passwordValue.length > 0;

  const isEmailValid = useMemo(() => {
    return isValidEmail(emailValue);
  }, [emailValue]);

  const isPasswordValid = useMemo(() => {
    return validatePasswordRequirements(passwordValue);
  }, [passwordValue]);

  const isSubmitEnabled = isEmailValid && isPasswordValid;

  const handleSubmit = async () => {
    await message.success("Demo login submitted. Admin authentication is not connected yet.");
  };

  const handleBack = () => {
    navigate("/");
  };

  const emailFieldRules = [
    {
      required: true,
      message: "Please enter your email address.",
    },
    {
      type: "email" as const,
      message: "Please enter a valid email address.",
    },
  ];

  const passwordFieldRules = [
    {
      required: true,
      message: "Please enter your password.",
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

  return {
    form,
    passwordRuleStatuses,
    passwordStrength,
    hasPasswordInput,
    isSubmitEnabled,
    emailFieldRules,
    passwordFieldRules,
    handleSubmit,
    handleBack,
  };
};
