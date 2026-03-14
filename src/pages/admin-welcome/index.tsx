import type { FC } from "react";
import { Navigate } from "react-router-dom";

import { useAppSelector } from "@/app/store/hooks";
import { Footer } from "@/components/layout/footer";
import { AdminWelcome } from "@/features/admin-dashboard/components/admin-welcome";

import styles from "./admin-welcome.module.scss";

export const AdminWelcomePage: FC = () => {
  const adminSession = useAppSelector((state) => state.adminAuth.session);

  if (!adminSession) {
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
