import { useMemo } from "react";

import { Form, message } from "antd";
import { useNavigate } from "react-router-dom";

import { useAppDispatch } from "@/app/store/hooks";
import { useLoginMutation } from "@/features/admin-auth/api/admin-auth-api";
import { saveAdminSession } from "@/features/admin-auth/model/admin-session";
import { setAdminSession } from "@/features/admin-auth/state/admin-auth-slice";
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
  const dispatch = useAppDispatch();
  const [login, { isLoading, error }] = useLoginMutation();
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

  const isSubmitEnabled = isEmailValid && isPasswordValid && !isLoading;

  const authError = useMemo(() => {
    const errorData = error as { data?: { message?: string } } | undefined;

    return errorData?.data?.message ?? "";
  }, [error]);

  const handleSubmit = async (values: AdminLoginValues) => {
    try {
      const response = await login(values).unwrap();

      saveAdminSession(response.session);
      dispatch(setAdminSession(response.session));
      message.success("Demo authentication succeeded. Redirecting to the admin dashboard.");
      navigate("/admin/welcome");
    } catch (error) {
      const nextError = error as { data?: { message?: string } } | undefined;

      message.error(nextError?.data?.message ?? "Unable to sign in right now. Please try again.");
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
    isSubmitting: isLoading,
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
