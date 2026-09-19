import { Form, message } from "antd";
import { useNavigate } from "react-router-dom";

import type { AuthLocationState, ForgotPasswordValues } from "@/features/auth/types";
import { useForgotPasswordMutation } from "@/features/auth/api/admin-auth-api";

export const useForgotPasswordForm = () => {
  const [form] = Form.useForm<ForgotPasswordValues>();
  const navigate = useNavigate();
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const handleSubmit = async (values: ForgotPasswordValues) => {
    try {
      await forgotPassword(values).unwrap();
      message.success("Reset code sent! Check your email for a 6-digit code.");
      const state: AuthLocationState = { email: values.email };
      navigate("/reset-password", { state });
    } catch (error) {
      const err = error as { data?: { message?: string } };
      message.error(err?.data?.message ?? "Unable to send the reset code. Please try again.");
    }
  };

  const emailFieldRules = [
    { required: true, message: "Please enter your email address." },
    { type: "email" as const, message: "Please enter a valid email address." },
  ];

  return {
    form,
    isSubmitting: isLoading,
    emailFieldRules,
    handleSubmit,
  };
};
