import type { FC } from "react";

import { ArrowLeftOutlined, NumberOutlined } from "@ant-design/icons";
import { Alert, Button, Form, Input } from "antd";
import { Link } from "react-router-dom";

import { useVerifyEmailForm } from "@/features/auth/hooks/use-verify-email-form";

import styles from "./verify-email-form.module.scss";

export const VerifyEmailForm: FC = () => {
  const verifyEmailForm = useVerifyEmailForm();

  return (
    <section className={styles.verifyEmailPanel} aria-labelledby="verify-email-title">
      <div className={styles.card}>
        <Link to="/login" className={styles.backLink}>
          <ArrowLeftOutlined /> Back to Sign In
        </Link>

        <h1 id="verify-email-title" className={styles.title}>
          Verify Your Email
        </h1>

        {verifyEmailForm.email ? (
          <p className={styles.description}>
            Enter the 6-character code sent to <strong>{verifyEmailForm.email}</strong>.
            {verifyEmailForm.codeExpiresAtLabel && (
              <> It expires at {verifyEmailForm.codeExpiresAtLabel}.</>
            )}
          </p>
        ) : (
          <Alert
            type="warning"
            showIcon
            className={styles.formItem}
            message="We don't know which email to verify"
            description={
              <>
                Please <Link to="/login">sign in</Link> with the account you registered, or{" "}
                <Link to="/register">create an account</Link>.
              </>
            }
          />
        )}

        <Form
          form={verifyEmailForm.form}
          layout="vertical"
          className={styles.form}
          onFinish={verifyEmailForm.handleSubmit}
          requiredMark={false}
        >
          <Form.Item
            label="Verification Code"
            name="code"
            className={styles.formItem}
            rules={verifyEmailForm.codeFieldRules}
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

          {verifyEmailForm.verifyError && (
            <Alert role="alert" type="error" showIcon message={verifyEmailForm.verifyError} />
          )}

          <Button
            type="primary"
            htmlType="submit"
            size="large"
            block
            className={styles.submitButton}
            loading={verifyEmailForm.isSubmitting}
            disabled={!verifyEmailForm.email}
          >
            Verify Email
          </Button>
        </Form>

        {verifyEmailForm.email && (
          <div className={styles.footer}>
            {verifyEmailForm.resendError && (
              <Alert
                role="alert"
                type="warning"
                showIcon
                className={styles.resendAlert}
                message={verifyEmailForm.resendError}
              />
            )}
            Didn't get a code?{" "}
            <Button
              type="link"
              className={styles.footerLink}
              onClick={verifyEmailForm.handleResendCode}
              loading={verifyEmailForm.isResending}
            >
              Resend code
            </Button>
            <p className={styles.hint}>You can request up to 3 new codes every 15 minutes.</p>
          </div>
        )}
      </div>
    </section>
  );
};
