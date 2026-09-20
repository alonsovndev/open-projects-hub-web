import type { FC } from "react";

import { LockOutlined, MailOutlined, SafetyOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { Alert, Button, Checkbox, Form, Input } from "antd";
import { Link } from "react-router-dom";

import { useAdminLoginForm } from "@/features/auth/hooks/use-admin-login-form";

import styles from "./admin-login-form.module.scss";

export const AdminLoginForm: FC = () => {
  const adminLoginForm = useAdminLoginForm();

  return (
    <section className={styles.loginPanel} aria-labelledby="admin-login-title">
      <div className={styles.card}>
        <Link to="/" className={styles.backLink}>
          <ArrowLeftOutlined /> Back to Home
        </Link>

        <div className={styles.iconWrapper}>
          <SafetyOutlined className={styles.icon} />
        </div>

        <h1 id="admin-login-title" className={styles.title}>
          Admin Sign In
        </h1>

        <Form
          form={adminLoginForm.form}
          layout="vertical"
          className={styles.form}
          onFinish={adminLoginForm.handleSubmit}
          requiredMark={false}
        >
          <Form.Item
            label="Email"
            name="email"
            rules={adminLoginForm.emailFieldRules}
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

          <Form.Item
            label="Password"
            name="password"
            className={styles.formItem}
            rules={adminLoginForm.passwordFieldRules}
          >
            <Input.Password
              size="large"
              prefix={<LockOutlined className={styles.inputIcon} />}
              placeholder="••••••••"
              autoComplete="current-password"
              className={styles.input}
            />
          </Form.Item>

          <div className={styles.formOptions}>
            <Form.Item name="remember" valuePropName="checked" className={styles.checkboxItem}>
              <Checkbox className={styles.checkbox}>Remember me</Checkbox>
            </Form.Item>

            <Link to="/forgot-password" className={styles.forgotLink}>
              Forgot password?
            </Link>
          </div>

          {adminLoginForm.sessionMessage ? (
            <Alert
              className={styles.errorAlert}
              type="info"
              showIcon
              message={adminLoginForm.sessionMessage}
            />
          ) : null}

          {adminLoginForm.authError ? (
            <Alert
              className={styles.errorAlert}
              type="error"
              showIcon
              message={adminLoginForm.authError}
            />
          ) : null}

          <Button
            type="primary"
            htmlType="submit"
            size="large"
            block
            className={styles.submitButton}
            loading={adminLoginForm.isSubmitting}
          >
            Sign In
          </Button>
        </Form>

        <div className={styles.cardFooter}>
          <span className={styles.footerText}>New to the portal? </span>
          <Link to="/register" className={styles.footerLink}>
            Create account
          </Link>
        </div>
      </div>
    </section>
  );
};
