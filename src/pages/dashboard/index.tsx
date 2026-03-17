import type { FC } from "react";

import { Footer } from "@/components/layout/footer";
import { AdminWelcome } from "@/features/admin-dashboard/components/admin-welcome";

import styles from "./dashboard.module.scss";

export const DashboardPage: FC = () => {
  return (
    <main className={styles.pageContainer}>
      <div className={styles.contentWrapper}>
        <AdminWelcome />
      </div>

      <Footer />
    </main>
  );
};
