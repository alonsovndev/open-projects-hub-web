import type { FC } from "react";

import { AdminLoginForm } from "@/features/auth/components/admin-login-form";
import { usePageTitle } from "@/shared/hooks/use-page-title";

import styles from "./login.module.scss";

export const LoginPage: FC = () => {
  usePageTitle("Login");

  return (
    <div className={styles.pageContainer}>
      <div className={styles.contentWrapper}>
        <AdminLoginForm />
      </div>
    </div>
  );
};
export default LoginPage;
