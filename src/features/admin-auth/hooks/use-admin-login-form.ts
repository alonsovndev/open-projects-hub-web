import { useMemo, useState } from "react";

import { Form, message } from "antd";
import { useNavigate } from "react-router-dom";

import { authenticateAdmin } from "@/features/admin-auth/api/authenticate-admin";
import {
  getPasswordRuleStatuses,
  isValidEmail,
  validatePasswordRequirements,
} from "@/features/admin-auth/model/password-policy";
import { saveAdminSession } from "@/features/admin-auth/model/admin-session";
import { getPasswordStrength } from "@/features/admin-auth/model/password-strength";
import type { AdminLoginValues } from "@/features/admin-auth/types";

export const useAdminLoginForm = () => {
  const [form] = Form.useForm<AdminLoginValues>();
  const navigate = useNavigate();
  const [authError, setAuthError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const isSubmitEnabled = isEmailValid && isPasswordValid && !isSubmitting;

  const handleSubmit = async (values: AdminLoginValues) => {
    setAuthError("");
    setIsSubmitting(true);

    try {
      const response = await authenticateAdmin(values);

      saveAdminSession(response.session);
      message.success("Demo authentication succeeded. Redirecting to the admin dashboard.");
      navigate("/admin/welcome");
    } catch (error) {
      const nextError = error instanceof Error ? error.message : "Unable to sign in right now. Please try again.";

      setAuthError(nextError);
    } finally {
      setIsSubmitting(false);
    }
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
    authError,
    isSubmitting,
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
