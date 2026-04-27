import type { FC } from "react";

import { ForgotPasswordForm } from "@/features/auth";

import styles from "./forgot-password.module.scss";

const ForgotPasswordPage: FC = () => {
  return (
    <div className={styles.forgotPasswordPage}>
      <ForgotPasswordForm />
    </div>
  );
};

export default ForgotPasswordPage;
