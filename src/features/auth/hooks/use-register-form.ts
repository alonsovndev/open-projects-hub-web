import { useMemo, useState } from "react";

import { Form, message } from "antd";
import { useNavigate } from "react-router-dom";

import type { AdminRegisterValues } from "@/features/auth/types";
import {
  getPasswordRuleStatuses,
  isValidEmail,
  validatePasswordRequirements,
} from "@/features/auth/model/password-policy";
import { getPasswordStrength } from "@/features/auth/model/password-strength";

export const useRegisterForm = () => {
  const [form] = Form.useForm<AdminRegisterValues>();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fullNameValue = Form.useWatch("fullName", form) ?? "";
  const emailValue = Form.useWatch("email", form) ?? "";
  const passwordValue = Form.useWatch("password", form) ?? "";
  const confirmPasswordValue = Form.useWatch("confirmPassword", form) ?? "";

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

  const doPasswordsMatch =
    passwordValue === confirmPasswordValue && confirmPasswordValue.length > 0;

  const handleSubmit = async (values: AdminRegisterValues) => {
    setIsSubmitting(true);

    try {
      // TODO: Implement actual registration API call
      console.log("Register values:", values);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      message.success("Account created successfully! Please sign in.");
      navigate("/login");
    } catch (error) {
      message.error("Unable to create account. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const fullNameFieldRules = [
    {
      required: true,
      message: "Please enter your full name.",
    },
    {
      min: 2,
      message: "Name must be at least 2 characters.",
    },
  ];

  const emailFieldRules = [
    {
      required: true,
      message: "Please enter your work email address.",
    },
    {
      type: "email" as const,
      message: "Please enter a valid email address.",
    },
  ];

  const passwordFieldRules = [
    {
      required: true,
      message: "Please enter a password.",
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
      message: "Please confirm your password.",
    },
    {
      validator: async (_: unknown, value: string | undefined) => {
        const confirmPassword = value ?? "";

        if (!confirmPassword) {
          return;
        }

        if (confirmPassword === passwordValue) {
          return;
        }

        throw new Error("Passwords do not match.");
      },
    },
  ];

  const termsFieldRules = [
    {
      validator: async (_: unknown, value: boolean | undefined) => {
        if (value === true) {
          return;
        }

        throw new Error("You must agree to the terms and conditions.");
      },
    },
  ];

  return {
    form,
    isSubmitting,
    passwordRuleStatuses,
    passwordStrength,
    hasPasswordInput,
    isEmailValid,
    isPasswordValid,
    doPasswordsMatch,
    fullNameFieldRules,
    emailFieldRules,
    passwordFieldRules,
    confirmPasswordFieldRules,
    termsFieldRules,
    handleSubmit,
  };
};
