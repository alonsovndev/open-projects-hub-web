import type { FC } from "react";
import { Navigate } from "react-router-dom";

import { Footer } from "@/components/layout/footer";
import { useAdminSession } from "@/features/admin-auth/hooks/use-admin-session";
import { AdminWelcome } from "@/features/admin-dashboard/components/admin-welcome";

import styles from "./admin-welcome.module.scss";

export const AdminWelcomePage: FC = () => {
  const adminSession = useAdminSession();

  if (!adminSession.isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  return (
    <main className={styles.pageContainer}>
      <div className={styles.contentWrapper}>
        <AdminWelcome />
      </div>

      <Footer />
    </main>
  );
};
