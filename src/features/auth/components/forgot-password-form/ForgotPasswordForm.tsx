import type { FC } from "react";

import { ArrowLeftOutlined, MailOutlined } from "@ant-design/icons";
import { Button, Form, Input } from "antd";
import { Link } from "react-router-dom";

import { useForgotPasswordForm } from "@/features/auth/hooks/use-forgot-password-form";

import styles from "./forgot-password-form.module.scss";

export const ForgotPasswordForm: FC = () => {
  const forgotPasswordForm = useForgotPasswordForm();

  return (
    <section className={styles.forgotPasswordPanel} aria-labelledby="forgot-password-title">
      <div className={styles.card}>
        <Link to="/" className={styles.backLink}>
          <ArrowLeftOutlined /> Back to Home
        </Link>

        <h1 id="forgot-password-title" className={styles.title}>
          Forgot Password
        </h1>

        <p className={styles.description}>
          Enter your email address and we'll send you a 6-digit code to reset your password.
        </p>

        <Form
          form={forgotPasswordForm.form}
          layout="vertical"
          className={styles.form}
          onFinish={forgotPasswordForm.handleSubmit}
          requiredMark={false}
        >
          <Form.Item
            label="Email Address"
            name="email"
            rules={forgotPasswordForm.emailFieldRules}
            className={styles.formItem}
          >
            <Input
              size="large"
              prefix={<MailOutlined className={styles.inputIcon} />}
              placeholder="admin@projecthub.com"
              autoComplete="email"
              className={styles.input}
            />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            size="large"
            block
            className={styles.submitButton}
            loading={forgotPasswordForm.isSubmitting}
          >
            Send Reset Code
          </Button>
        </Form>

        <div className={styles.footer}>
          Remember your password?{" "}
          <Link to="/login" className={styles.footerLink}>
            Sign In
          </Link>
        </div>
      </div>
    </section>
  );
};
