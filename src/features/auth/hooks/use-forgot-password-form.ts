import { useState } from "react";

import { Form, message } from "antd";
import { useNavigate } from "react-router-dom";

import type { ForgotPasswordValues } from "@/features/auth/types";
import { isValidEmail } from "@/features/auth/model/password-policy";

export const useForgotPasswordForm = () => {
  const [form] = Form.useForm<ForgotPasswordValues>();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const emailValue = Form.useWatch("email", form) ?? "";

  const isEmailValid = isValidEmail(emailValue);

  const handleSubmit = async (values: ForgotPasswordValues) => {
    setIsSubmitting(true);

    try {
      // TODO: Implement actual forgot password API call
      console.log("Forgot password values:", values);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      message.success("Password reset link sent! Please check your email.");
      navigate("/login");
    } catch (error) {
      message.error("Unable to send reset link. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
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

  return {
    form,
    isSubmitting,
    isEmailValid,
    emailFieldRules,
    handleSubmit,
  };
};
