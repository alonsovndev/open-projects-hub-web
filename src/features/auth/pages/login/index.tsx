import type { FC } from "react";

import { Footer } from "@/shared/components/layout/footer";
import { AdminLoginForm } from "@/features/auth/components/admin-login-form";
import { usePageTitle } from "@/shared/hooks/use-page-title";

import styles from "./login.module.scss";

export const LoginPage: FC = () => {
  usePageTitle("Login");

  return (
    <main className={styles.pageContainer}>
      <div className={styles.contentWrapper}>
        <AdminLoginForm />
      </div>

      <Footer />
    </main>
  );
};
export default LoginPage;
