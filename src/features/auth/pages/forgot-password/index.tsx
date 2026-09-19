import type { FC } from "react";

import { ForgotPasswordForm } from "@/features/auth";
import { usePageTitle } from "@/shared/hooks/use-page-title";

import styles from "./forgot-password.module.scss";

const ForgotPasswordPage: FC = () => {
  usePageTitle("Forgot Password");
  return (
    <div className={styles.forgotPasswordPage}>
      <ForgotPasswordForm />
    </div>
  );
};

export default ForgotPasswordPage;
