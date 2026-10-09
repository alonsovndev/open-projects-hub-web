import { useMemo } from "react";

import { getErrorMessage } from "@/shared/types/api";
import { Form, message } from "antd";
import { useNavigate, useLocation } from "react-router-dom";

import { useAppDispatch } from "@/app/store/hooks";
import { useLoginMutation } from "@/features/auth/api/admin-auth-api";
import { setAdminSession } from "@/features/auth/state/admin-auth-slice";
import { isValidEmail } from "@/features/auth/model/password-policy";
import type { AdminLoginValues, AuthLocationState } from "@/features/auth/types";

type LoginErrorShape = { data?: { message?: string; code?: string } } | undefined;

const EMAIL_NOT_VERIFIED = "EMAIL_NOT_VERIFIED";

export const useAdminLoginForm = () => {
  const [form] = Form.useForm<AdminLoginValues>();

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();

  const [login, { isLoading, error }] = useLoginMutation();
  const emailValue = Form.useWatch("email", form) ?? "";
  const passwordValue = Form.useWatch("password", form) ?? "";

  const isEmailValid = useMemo(() => {
    return isValidEmail(emailValue);
  }, [emailValue]);

  const isSubmitEnabled = isEmailValid && passwordValue.length > 0 && !isLoading;

  const authError = useMemo(() => {
    return error ? getErrorMessage(error, "We couldn't sign you in. Please try again.") : "";
  }, [error]);

  // The API only reports this after the password matched, so offering the
  // verification step here reveals nothing to someone guessing at emails.
  const needsEmailVerification = (error as LoginErrorShape)?.data?.code === EMAIL_NOT_VERIFIED;
  const verifyEmailState: AuthLocationState = { email: emailValue };

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
      const nextError = error as LoginErrorShape;
      if (nextError?.data?.code === EMAIL_NOT_VERIFIED) return;

      message.error(getErrorMessage(error, "We couldn't sign you in. Please try again."));
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

  // Deliberately no password-policy validation here. Sign-in must submit
  // whatever the user actually has — an account created before the current
  // policy would otherwise be locked out client-side, with the server never
  // seeing the attempt. It also keeps the policy off a public login screen.
  const passwordFieldRules = [
    {
      required: true,
      message: "Please enter your password.",
    },
  ];

  return {
    form,
    authError,
    needsEmailVerification,
    verifyEmailState,
    sessionMessage,
    isSubmitting: isLoading,
    isSubmitEnabled,
    emailFieldRules,
    passwordFieldRules,
    handleSubmit,
    handleBack,
  };
};
