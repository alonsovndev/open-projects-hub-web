import type { FC } from "react";

import { ResetPasswordForm } from "@/features/auth";

import styles from "./reset-password.module.scss";

const ResetPasswordPage: FC = () => {
  return (
    <div className={styles.resetPasswordPage}>
      <ResetPasswordForm />
    </div>
  );
};

export default ResetPasswordPage;
