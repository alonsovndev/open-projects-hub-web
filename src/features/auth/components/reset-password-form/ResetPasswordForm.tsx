import type { FC } from "react";

import {
  ArrowLeftOutlined,
  CheckCircleOutlined,
  LockOutlined,
  MinusCircleOutlined,
  NumberOutlined,
} from "@ant-design/icons";
import { Alert, Button, Form, Input } from "antd";
import { Link } from "react-router-dom";

import { useResetPasswordForm } from "@/features/auth/hooks/use-reset-password-form";

import styles from "./reset-password-form.module.scss";

export const ResetPasswordForm: FC = () => {
  const resetPasswordForm = useResetPasswordForm();

  return (
    <section className={styles.resetPasswordPanel} aria-labelledby="reset-password-title">
      <div className={styles.card}>
        <Link to="/login" className={styles.backLink}>
          <ArrowLeftOutlined /> Back to Sign In
        </Link>

        <h1 id="reset-password-title" className={styles.title}>
          Reset Password
        </h1>

        {resetPasswordForm.email ? (
          <p className={styles.description}>
            Enter the 6-digit code sent to <strong>{resetPasswordForm.email}</strong> and choose a
            new password.
          </p>
        ) : (
          <Alert
            type="warning"
            showIcon
            className={styles.formItem}
            message="Start from Forgot Password"
            description={
              <>
                We couldn't find which account you're resetting. Please{" "}
                <Link to="/forgot-password">request a new code</Link> first.
              </>
            }
          />
        )}

        <Form
          form={resetPasswordForm.form}
          layout="vertical"
          className={styles.form}
          onFinish={resetPasswordForm.handleSubmit}
          requiredMark={false}
        >
          <Form.Item
            label="Reset Code"
            name="code"
            className={styles.formItem}
            rules={resetPasswordForm.codeFieldRules}
          >
            <Input
              size="large"
              prefix={<NumberOutlined className={styles.inputIcon} />}
              placeholder="ABC234"
              maxLength={6}
              autoComplete="one-time-code"
              className={styles.input}
            />
          </Form.Item>

          <Form.Item
            label="New Password"
            name="newPassword"
            className={styles.formItem}
            rules={resetPasswordForm.newPasswordFieldRules}
          >
            <Input.Password
              size="large"
              prefix={<LockOutlined className={styles.inputIcon} />}
              placeholder="••••••••"
              autoComplete="new-password"
              className={styles.input}
            />
          </Form.Item>

          <Form.Item
            label="Confirm New Password"
            name="confirmPassword"
            className={styles.formItem}
            rules={resetPasswordForm.confirmPasswordFieldRules}
            dependencies={["newPassword"]}
          >
            <Input.Password
              size="large"
              prefix={<LockOutlined className={styles.inputIcon} />}
              placeholder="••••••••"
              autoComplete="new-password"
              className={styles.input}
            />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            size="large"
            block
            className={styles.submitButton}
            loading={resetPasswordForm.isSubmitting}
            disabled={!resetPasswordForm.email}
          >
            Update Password
          </Button>
        </Form>

        {resetPasswordForm.hasPasswordInput && (
          <div className={styles.rulesSection}>
            <span className={styles.rulesTitle}>Requirement Checklist</span>
            <ul className={styles.passwordRules} aria-label="Password requirements">
              {resetPasswordForm.passwordRuleStatuses.map((rule) => (
                <li
                  key={rule.id}
                  className={rule.isMet ? styles.passwordRuleMet : styles.passwordRulePending}
                >
                  {rule.isMet ? (
                    <CheckCircleOutlined className={styles.ruleIconMet} />
                  ) : (
                    <MinusCircleOutlined className={styles.ruleIconPending} />
                  )}
                  <span>{rule.label}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {resetPasswordForm.email && (
          <div className={styles.footer}>
            Didn't get a code?{" "}
            <Button
              type="link"
              className={styles.footerLink}
              onClick={resetPasswordForm.handleResendCode}
              loading={resetPasswordForm.isResending}
            >
              Resend code
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};
