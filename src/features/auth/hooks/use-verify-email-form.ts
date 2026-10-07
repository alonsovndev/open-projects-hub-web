import { useEffect, useState } from "react";

import { Form, message } from "antd";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

import type { AuthLocationState, VerifyEmailValues } from "@/features/auth/types";
import {
  useResendVerificationMutation,
  useVerifyEmailMutation,
} from "@/features/auth/api/admin-auth-api";
import { validatePasswordRequirements } from "@/features/auth/model/password-policy";

// Mirror the API's verification code TTLs: the resend response is deliberately generic
// (it never confirms an account exists), so the new expiry is derived here.
const CODE_TTL_MINUTES = 5;
const INVITE_CODE_TTL_MINUTES = 24 * 60;

const formatExpiryTime = (isoTimestamp: string, includeDate: boolean) =>
  new Date(isoTimestamp).toLocaleString(
    [],
    includeDate
      ? { dateStyle: "short", timeStyle: "short" }
      : { hour: "2-digit", minute: "2-digit" }
  );

type VerifyEmailFormValues = Pick<VerifyEmailValues, "code" | "password"> & {
  confirmPassword?: string;
};

type ApiErrorShape = { data?: { message?: string } } | undefined;

export const useVerifyEmailForm = () => {
  const [form] = Form.useForm<VerifyEmailFormValues>();
  const navigate = useNavigate();
  const location = useLocation();
  const [verifyEmail, { isLoading }] = useVerifyEmailMutation();
  const [resendVerification, { isLoading: isResending }] = useResendVerificationMutation();

  const [searchParams, setSearchParams] = useSearchParams();

  // Carried from registration, or from a sign-in refused for an unverified email; or, when
  // the person opened the emailed link, from its query string.
  const locationState = location.state as AuthLocationState | null;
  const email = searchParams.get("email") ?? locationState?.email ?? "";
  // Members added by an Admin choose their own password here.
  const [passwordRequired, setPasswordRequired] = useState(false);
  const isInvite = searchParams.get("setPassword") === "1" || passwordRequired;
  const [initialCode] = useState(() => searchParams.get("code") ?? "");

  // Keep the code out of the address bar, history and any later Referer header.
  useEffect(() => {
    if (!searchParams.has("code")) return;
    const remaining = new URLSearchParams(searchParams);
    remaining.delete("code");
    setSearchParams(remaining, { replace: true });
  }, [searchParams, setSearchParams]);

  const [codeExpiresAt, setCodeExpiresAt] = useState(locationState?.codeExpiresAt ?? "");
  const [verifyError, setVerifyError] = useState("");
  const [resendError, setResendError] = useState("");

  const handleSubmit = async ({ code, password }: VerifyEmailFormValues) => {
    setVerifyError("");
    try {
      await verifyEmail({
        email,
        code: code.trim(),
        password: isInvite ? password : undefined,
      }).unwrap();
      const state: AuthLocationState = {
        message: isInvite
          ? "Email verified and password set. Please sign in."
          : "Email verified. Please sign in.",
      };
      navigate("/login", { state });
    } catch (error) {
      const message = (error as ApiErrorShape)?.data?.message;
      // An invited account reached this page without the link's setPassword flag.
      if (message?.startsWith("Choose a password")) setPasswordRequired(true);
      setVerifyError(message ?? "Unable to verify your email. Please try again.");
    }
  };

  const handleResendCode = async () => {
    if (!email) return;
    setResendError("");
    try {
      await resendVerification({ email }).unwrap();
      setVerifyError("");
      const ttlMinutes = isInvite ? INVITE_CODE_TTL_MINUTES : CODE_TTL_MINUTES;
      setCodeExpiresAt(new Date(Date.now() + ttlMinutes * 60_000).toISOString());
      form.setFieldValue("code", "");
      message.success("A new code has been sent to your email.");
    } catch (error) {
      setResendError(
        (error as ApiErrorShape)?.data?.message ?? "Unable to resend the code right now."
      );
    }
  };

  const codeFieldRules = [
    { required: true, message: "Please enter the 6-character code from your email." },
    { len: 6, message: "The code must be 6 characters." },
  ];

  const passwordFieldRules = [
    { required: true, message: "Please choose a password." },
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
        if (!value || value === form.getFieldValue("password")) return;
        throw new Error("Passwords do not match.");
      },
    },
  ];

  return {
    form,
    email,
    isInvite,
    initialCode,
    codeExpiresAtLabel: codeExpiresAt ? formatExpiryTime(codeExpiresAt, isInvite) : "",
    passwordFieldRules,
    confirmPasswordFieldRules,
    verifyError,
    resendError,
    isSubmitting: isLoading,
    isResending,
    codeFieldRules,
    handleSubmit,
    handleResendCode,
  };
};
