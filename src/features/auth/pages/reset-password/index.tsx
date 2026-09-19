import type { FC } from "react";

import { ResetPasswordForm } from "@/features/auth";
import { usePageTitle } from "@/shared/hooks/use-page-title";

import styles from "./reset-password.module.scss";

const ResetPasswordPage: FC = () => {
  usePageTitle("Reset Password");
  return (
    <div className={styles.resetPasswordPage}>
      <ResetPasswordForm />
    </div>
  );
};

export default ResetPasswordPage;
