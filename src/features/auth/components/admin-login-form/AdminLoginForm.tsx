import type { FC } from "react";

import { CheckCircleFilled, LockOutlined, MailOutlined } from "@ant-design/icons";
import { Alert, Button, Form, Input, Progress, Typography } from "antd";
import { Link } from "react-router-dom";

import { useAdminLoginForm } from "@/features/auth/hooks/use-admin-login-form";

import styles from "./admin-login-form.module.scss";

const { Text, Title } = Typography;

export const AdminLoginForm: FC = () => {
  const adminLoginForm = useAdminLoginForm();

  return (
    <section className={styles.loginPanel} aria-labelledby="admin-login-title">
      <div className={styles.card}>
        <Title level={2} id="admin-login-title" className={styles.title}>
          Admin Login
        </Title>

        <Form
          form={adminLoginForm.form}
          layout="vertical"
          className={styles.form}
          onFinish={adminLoginForm.handleSubmit}
          requiredMark={false}
        >
          <Form.Item name="email" rules={adminLoginForm.emailFieldRules}>
            <Input
              size="large"
              prefix={<MailOutlined className={styles.inputIcon} />}
              placeholder="Email Address"
              autoComplete="email"
            />
          </Form.Item>

          <Form.Item name="password" className={styles.passwordField} rules={adminLoginForm.passwordFieldRules}>
            <Input.Password
              size="large"
              prefix={<LockOutlined className={styles.inputIcon} />}
              placeholder="Password"
              autoComplete="current-password"
            />
          </Form.Item>

          <div className={styles.passwordMeta}>
            {adminLoginForm.hasPasswordInput ? (
              <>
                <Progress
                  percent={adminLoginForm.passwordStrength.percent}
                  showInfo={false}
                  strokeColor={
                    adminLoginForm.passwordStrength.tone === "strong"
                      ? "#2fa84f"
                      : adminLoginForm.passwordStrength.tone === "medium"
                        ? "#d39b20"
                        : "#ef4444"
                  }
                  trailColor="#e5e7eb"
                  size={[304, 6]}
                />

                <Text className={styles[adminLoginForm.passwordStrength.tone]}>{adminLoginForm.passwordStrength.label}</Text>

                <ul className={styles.passwordRules} aria-label="Password requirements">
                  {adminLoginForm.passwordRuleStatuses.map((rule) => (
                    <li key={rule.id} className={rule.isMet ? styles.passwordRuleMet : styles.passwordRulePending}>
                      <CheckCircleFilled className={styles.ruleIcon} />
                      <span>{rule.label}</span>
                    </li>
                  ))}
                </ul>
              </>
            ) : null}

            <Link to="/forgot-password" className={styles.forgotLink}>
              Forgot password?
            </Link>
          </div>

          {adminLoginForm.authError ? (
            <Alert className={styles.errorAlert} type="error" showIcon message={adminLoginForm.authError} />
          ) : null}

          <Button
            type="primary"
            htmlType="submit"
            size="large"
            block
            className={styles.submitButton}
            loading={adminLoginForm.isSubmitting}
            disabled={!adminLoginForm.isSubmitEnabled}
          >
            Sign In
          </Button>
        </Form>

        <div className={styles.cardFooter}>
          <Button type="link" className={styles.backButton} onClick={adminLoginForm.handleBack}>
            Back to role selection
          </Button>
        </div>
      </div>
    </section>
  );
};
