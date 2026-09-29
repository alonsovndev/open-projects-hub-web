import { useState } from "react";

import { Form, message } from "antd";
import { useLocation, useNavigate } from "react-router-dom";

import type { AuthLocationState, VerifyEmailValues } from "@/features/auth/types";
import {
  useResendVerificationMutation,
  useVerifyEmailMutation,
} from "@/features/auth/api/admin-auth-api";

// Mirrors the API's VERIFICATION_CODE_TTL_MINUTES: the resend response is deliberately
// generic (it never confirms an account exists), so the new expiry is derived here.
const CODE_TTL_MINUTES = 5;

const formatExpiryTime = (isoTimestamp: string) =>
  new Date(isoTimestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

type ApiErrorShape = { data?: { message?: string } } | undefined;

export const useVerifyEmailForm = () => {
  const [form] = Form.useForm<Pick<VerifyEmailValues, "code">>();
  const navigate = useNavigate();
  const location = useLocation();
  const [verifyEmail, { isLoading }] = useVerifyEmailMutation();
  const [resendVerification, { isLoading: isResending }] = useResendVerificationMutation();

  // Carried from registration, or from a sign-in refused for an unverified email.
  const locationState = location.state as AuthLocationState | null;
  const email = locationState?.email ?? "";

  const [codeExpiresAt, setCodeExpiresAt] = useState(locationState?.codeExpiresAt ?? "");
  const [verifyError, setVerifyError] = useState("");
  const [resendError, setResendError] = useState("");

  const handleSubmit = async ({ code }: Pick<VerifyEmailValues, "code">) => {
    setVerifyError("");
    try {
      await verifyEmail({ email, code: code.trim() }).unwrap();
      const state: AuthLocationState = { message: "Email verified. Please sign in." };
      navigate("/login", { state });
    } catch (error) {
      setVerifyError(
        (error as ApiErrorShape)?.data?.message ?? "Unable to verify your email. Please try again."
      );
    }
  };

  const handleResendCode = async () => {
    if (!email) return;
    setResendError("");
    try {
      await resendVerification({ email }).unwrap();
      setVerifyError("");
      setCodeExpiresAt(new Date(Date.now() + CODE_TTL_MINUTES * 60_000).toISOString());
      form.resetFields();
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

  return {
    form,
    email,
    codeExpiresAtLabel: codeExpiresAt ? formatExpiryTime(codeExpiresAt) : "",
    verifyError,
    resendError,
    isSubmitting: isLoading,
    isResending,
    codeFieldRules,
    handleSubmit,
    handleResendCode,
  };
};
