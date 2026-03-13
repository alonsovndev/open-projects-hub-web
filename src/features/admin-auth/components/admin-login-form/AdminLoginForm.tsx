import { useMemo, type FC } from "react";

import { CheckCircleFilled, LockOutlined, MailOutlined } from "@ant-design/icons";
import { Button, Form, Input, message, Progress, Typography } from "antd";
import { Link, useNavigate } from "react-router-dom";

import type {
  AdminLoginValues,
  PasswordRule,
  PasswordRuleStatus,
  PasswordStrengthState,
} from "@/features/admin-auth/types";

import styles from "./admin-login-form.module.scss";

const { Text, Title } = Typography;

const passwordRules: PasswordRule[] = [
  {
    id: "length",
    label: "At least 8 characters",
    test: (password) => password.length >= 8,
  },
  {
    id: "case",
    label: "Uppercase and lowercase letters",
    test: (password) => /[A-Z]/.test(password) && /[a-z]/.test(password),
  },
  {
    id: "number",
    label: "At least 1 number",
    test: (password) => /\d/.test(password),
  },
  {
    id: "symbol",
    label: "At least 1 symbol",
    test: (password) => /[^A-Za-z0-9]/.test(password),
  },
];

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const getPasswordStrength = (password: string): PasswordStrengthState => {
  const score = passwordRules.filter((rule) => rule.test(password)).length;

  if (score <= 1) {
    return {
      label: "Weak password",
      tone: "weak",
      percent: 33,
    };
  }

  if (score <= 3) {
    return {
      label: "Medium: add more variety for a stronger password",
      tone: "medium",
      percent: 66,
    };
  }

  return {
    label: "Strong password",
    tone: "strong",
    percent: 100,
  };
};

export const AdminLoginForm: FC = () => {
  const [form] = Form.useForm<AdminLoginValues>();
  const navigate = useNavigate();
  const emailValue = Form.useWatch("email", form) ?? "";
  const passwordValue = Form.useWatch("password", form) ?? "";

  const passwordRuleStatuses = useMemo(() => {
    return passwordRules.map<PasswordRuleStatus>((rule) => ({
      ...rule,
      isMet: rule.test(passwordValue),
    }));
  }, [passwordValue]);

  const passwordStrength = useMemo(() => {
    return getPasswordStrength(passwordValue);
  }, [passwordValue]);

  const hasPasswordInput = passwordValue.length > 0;

  const isEmailValid = useMemo(() => {
    return emailPattern.test(emailValue.trim());
  }, [emailValue]);

  const isPasswordValid = useMemo(() => {
    return passwordRuleStatuses.every((rule) => rule.isMet);
  }, [passwordRuleStatuses]);

  const isSubmitEnabled = isEmailValid && isPasswordValid;

  const handleFinish = async () => {
    await message.success("Demo login submitted. Admin authentication is not connected yet.");
  };

  return (
    <section className={styles.loginPanel} aria-labelledby="admin-login-title">
      <div className={styles.card}>
        <Title level={2} id="admin-login-title" className={styles.title}>
          Admin Login
        </Title>

        <Form<AdminLoginValues>
          form={form}
          layout="vertical"
          className={styles.form}
          onFinish={handleFinish}
          requiredMark={false}
        >
          <Form.Item
            name="email"
            rules={[
              {
                required: true,
                message: "Please enter your email address.",
              },
              {
                type: "email",
                message: "Please enter a valid email address.",
              },
            ]}
          >
            <Input
              size="large"
              prefix={<MailOutlined className={styles.inputIcon} />}
              placeholder="Email Address"
              autoComplete="email"
            />
          </Form.Item>

          <Form.Item
            name="password"
            className={styles.passwordField}
            rules={[
              {
                required: true,
                message: "Please enter your password.",
              },
              {
                validator: async (_, value: string | undefined) => {
                  const password = value ?? "";

                  if (!password) {
                    return;
                  }

                  if (passwordRules.every((rule) => rule.test(password))) {
                    return;
                  }

                  throw new Error("Password must meet all listed requirements.");
                },
              },
            ]}
          >
            <Input.Password
              size="large"
              prefix={<LockOutlined className={styles.inputIcon} />}
              placeholder="Password"
              autoComplete="current-password"
            />
          </Form.Item>

          <div className={styles.passwordMeta}>
            {hasPasswordInput ? (
              <>
                <Progress
                  percent={passwordStrength.percent}
                  showInfo={false}
                  strokeColor={
                    passwordStrength.tone === "strong"
                      ? "#2fa84f"
                      : passwordStrength.tone === "medium"
                        ? "#d39b20"
                        : "#ef4444"
                  }
                  trailColor="#e5e7eb"
                  size={[304, 6]}
                />

                <Text className={styles[passwordStrength.tone]}>{passwordStrength.label}</Text>

                <ul className={styles.passwordRules} aria-label="Password requirements">
                  {passwordRuleStatuses.map((rule) => (
                    <li key={rule.id} className={rule.isMet ? styles.passwordRuleMet : styles.passwordRulePending}>
                      <CheckCircleFilled className={styles.ruleIcon} />
                      <span>{rule.label}</span>
                    </li>
                  ))}
                </ul>
              </>
            ) : null}

            <Link to="/admin/forgot-password" className={styles.forgotLink}>
              Forgot password?
            </Link>
          </div>

          <Button
            type="primary"
            htmlType="submit"
            size="large"
            block
            className={styles.submitButton}
            disabled={!isSubmitEnabled}
          >
            Sign In
          </Button>
        </Form>

        <div className={styles.cardFooter}>
          <Button type="link" className={styles.backButton} onClick={() => navigate("/")}>
            Back to role selection
          </Button>
        </div>
      </div>
    </section>
  );
};
