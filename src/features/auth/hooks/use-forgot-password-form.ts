import { Form, message } from "antd";
import { useNavigate } from "react-router-dom";

import type { ForgotPasswordValues } from "@/features/auth/types";
import { useForgotPasswordMutation } from "@/features/auth/api/admin-auth-api";

export const useForgotPasswordForm = () => {
  const [form] = Form.useForm<ForgotPasswordValues>();
  const navigate = useNavigate();
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const handleSubmit = async (values: ForgotPasswordValues) => {
    try {
      await forgotPassword(values).unwrap();
      message.success("Password reset link sent! Please check your email.");
      navigate("/login");
    } catch (error) {
      const err = error as { data?: { message?: string } };
      message.error(err?.data?.message ?? "Unable to send reset link. Please try again.");
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
