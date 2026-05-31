import type { FC } from "react";

import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  LockOutlined,
  MailOutlined,
  SafetyOutlined,
  UserOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { Button, Checkbox, Form, Input } from "antd";
import { Link } from "react-router-dom";

import { useRegisterForm } from "@/features/auth/hooks/use-register-form";

import styles from "./register-form.module.scss";

export const RegisterForm: FC = () => {
  const registerForm = useRegisterForm();

  return (
    <section className={styles.registerPanel} aria-labelledby="admin-register-title">
      <div className={styles.card}>
        <Link to="/" className={styles.backLink}>
          <ArrowLeftOutlined /> Back to Home
        </Link>

        <div className={styles.iconWrapper}>
          <SafetyOutlined className={styles.icon} />
        </div>

        <h1 id="admin-register-title" className={styles.title}>
          Create Admin Account
        </h1>

        <p className={styles.description}>
          Only Admin users create and manage planning workspaces.
        </p>

        <Form
          form={registerForm.form}
          layout="vertical"
          className={styles.form}
          onFinish={registerForm.handleSubmit}
          requiredMark={false}
        >
          <Form.Item
            label="Full Name"
            name="fullName"
            rules={registerForm.fullNameFieldRules}
            className={styles.formItem}
          >
            <Input
              size="large"
              prefix={<UserOutlined className={styles.inputIcon} />}
              placeholder="User Name"
              autoComplete="name"
              className={styles.input}
            />
          </Form.Item>

          <Form.Item
            label="Work Email"
            name="email"
            rules={registerForm.emailFieldRules}
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

          <div className={styles.passwordSection}>
            <Form.Item
              label="Password"
              name="password"
              className={styles.formItem}
              rules={registerForm.passwordFieldRules}
            >
              <Input.Password
                size="large"
                prefix={<LockOutlined className={styles.inputIcon} />}
                placeholder="••••••••"
                autoComplete="new-password"
                className={styles.input}
              />
            </Form.Item>

            {registerForm.hasPasswordInput && (
              <ul className={styles.passwordRules} aria-label="Password requirements">
                {registerForm.passwordRuleStatuses.map((rule) => (
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
              label="Confirm Password"
              name="confirmPassword"
              className={styles.formItem}
              rules={registerForm.confirmPasswordFieldRules}
              dependencies={["password"]}
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

          <Form.Item
            name="agreeToTerms"
            valuePropName="checked"
            className={styles.checkboxItem}
            rules={registerForm.termsFieldRules}
          >
            <Checkbox className={styles.checkbox}>
              I agree to the{" "}
              <Link to="/terms" className={styles.termsLink}>
                Terms and Conditions
              </Link>
            </Checkbox>
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            size="large"
            block
            className={styles.submitButton}
            loading={registerForm.isSubmitting}
          >
            Create Account
          </Button>
        </Form>

        <div className={styles.cardFooter}>
          <span className={styles.footerText}>Already have an account? </span>
          <Link to="/login" className={styles.footerLink}>
            Sign In
          </Link>
        </div>
      </div>
    </section>
  );
};
