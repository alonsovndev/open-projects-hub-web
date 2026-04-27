import type { FC } from "react";

import {
  ArrowRightOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  LockOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { Button, Form, Input } from "antd";
import { Link } from "react-router-dom";

import { useResetPasswordForm } from "@/features/auth/hooks/use-reset-password-form";

import styles from "./reset-password-form.module.scss";

export const ResetPasswordForm: FC = () => {
  const resetPasswordForm = useResetPasswordForm();

  return (
    <section className={styles.resetPasswordPanel} aria-labelledby="reset-password-title">
      <div className={styles.card}>
        <div className={styles.iconWrapper}>
          <ReloadOutlined className={styles.icon} />
        </div>

        <h1 id="reset-password-title" className={styles.title}>
          Reset Password
        </h1>

        <p className={styles.description}>
          Please enter your current password and choose a new one.
        </p>

        <Form
          form={resetPasswordForm.form}
          layout="vertical"
          className={styles.form}
          onFinish={resetPasswordForm.handleSubmit}
          requiredMark={false}
        >
          <Form.Item
            label="CURRENT PASSWORD"
            name="currentPassword"
            className={styles.formItem}
            rules={resetPasswordForm.currentPasswordFieldRules}
          >
            <Input.Password
              size="large"
              prefix={<LockOutlined className={styles.inputIcon} />}
              placeholder="••••••••"
              autoComplete="current-password"
              className={styles.input}
            />
          </Form.Item>

          <div className={styles.passwordSection}>
            <Form.Item
              label="NEW PASSWORD"
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

            {resetPasswordForm.hasPasswordInput && (
              <ul className={styles.passwordRules} aria-label="Password requirements">
                {resetPasswordForm.passwordRuleStatuses.map((rule) => (
                  <li
                    key={rule.id}
                    className={rule.isMet ? styles.passwordRuleMet : styles.passwordRulePending}
                  >
                    {rule.isMet ? (
                      <CheckCircleOutlined className={styles.ruleIcon} />
                    ) : (
                      <CloseCircleOutlined className={styles.ruleIcon} />
                    )}
                    <span>{rule.label}</span>
                  </li>
                ))}
              </ul>
            )}

            <Form.Item
              label="CONFIRM NEW PASSWORD"
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
          </div>

          <Button
            type="primary"
            htmlType="submit"
            size="large"
            block
            className={styles.submitButton}
            loading={resetPasswordForm.isSubmitting}
            icon={<ArrowRightOutlined />}
            iconPosition="end"
          >
            Update Password
          </Button>
        </Form>

        <Link to="/login" className={styles.backLink}>
          Back to Sign In
        </Link>
      </div>
    </section>
  );
};
