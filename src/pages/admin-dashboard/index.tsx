import type { FC } from "react";
import { Navigate } from "react-router-dom";

import { Footer } from "@/components/layout/footer";
import { AdminLoginForm } from "@/features/admin-auth/components/admin-login-form";
import { useAdminSession } from "@/features/admin-auth/hooks/use-admin-session";

import styles from "./admin-dashboard.module.scss";

export const AdminDashboard: FC = () => {
  const adminSession = useAdminSession();

  if (adminSession.isAuthenticated) {
    return <Navigate to="/admin/welcome" replace />;
  }

  return (
    <main className={styles.pageContainer}>
      <div className={styles.contentWrapper}>
        <AdminLoginForm />
      </div>

      <Footer />
    </main>
  );
};
