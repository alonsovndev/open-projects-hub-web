import type { FC } from "react";

import { Footer } from "@/shared/components/layout/footer";
import { AdminLoginForm } from "@/features/auth/components/admin-login-form";

import styles from "./login.module.scss";

export const LoginPage: FC = () => {
  return (
    <main className={styles.pageContainer}>
      <div className={styles.contentWrapper}>
        <AdminLoginForm />
      </div>

      <Footer />
    </main>
  );
};
