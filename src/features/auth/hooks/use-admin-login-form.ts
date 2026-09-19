import { useMemo } from "react";

import { Form, message } from "antd";
import { useNavigate, useLocation } from "react-router-dom";

import { useAppDispatch } from "@/app/store/hooks";
import { useLoginMutation } from "@/features/auth/api/admin-auth-api";
import { setAdminSession } from "@/features/auth/state/admin-auth-slice";
import {
  getPasswordRuleStatuses,
  isValidEmail,
  validatePasswordRequirements,
} from "@/features/auth/model/password-policy";
import { getPasswordStrength } from "@/features/auth/model/password-strength";
import type { AdminLoginValues, AuthLocationState } from "@/features/auth/types";

export const useAdminLoginForm = () => {
  const [form] = Form.useForm<AdminLoginValues>();

  const navigate = useNavigate();
  const location = useLocation();
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

  // Set by useSessionExpiryWarning's redirect when an active session actually
  // lapses, so the reason for landing back on /login is explained. Note:
  // GuardResolver's plain "auth" redirect (no prior session) does not set this.
  const sessionMessage = (location.state as AuthLocationState | null)?.message ?? "";

  const handleSubmit = async (values: AdminLoginValues) => {
    try {
      const response = await login(values).unwrap();

      dispatch(
        setAdminSession({
          session: response.session,
          rememberMe: values.remember,
        })
      );

      // Redirect to the page they were trying to access, or dashboard
      const from = (location.state as AuthLocationState | null)?.from?.pathname || "/dashboard";
      navigate(from, { replace: true });
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
    sessionMessage,
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
