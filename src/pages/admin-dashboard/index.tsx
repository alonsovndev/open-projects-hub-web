import type { FC } from "react";
import { Navigate } from "react-router-dom";

import { useAppSelector } from "@/app/store/hooks";
import { Footer } from "@/components/layout/footer";
import { AdminLoginForm } from "@/features/admin-auth/components/admin-login-form";

import styles from "./admin-dashboard.module.scss";

export const AdminDashboard: FC = () => {
  const adminSession = useAppSelector((state) => state.adminAuth.session);

  if (adminSession) {
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
