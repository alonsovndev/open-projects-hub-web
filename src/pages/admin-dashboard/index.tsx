import type { FC } from "react";

import { Footer } from "@/components/layout/footer";
import { AdminLoginForm } from "@/features/admin-auth/components/admin-login-form";

import styles from "./admin-dashboard.module.scss";

export const AdminDashboard: FC = () => {
  return (
    <main className={styles.pageContainer}>
      <div className={styles.contentWrapper}>
        <AdminLoginForm />
      </div>

      <Footer />
    </main>
  );
};
