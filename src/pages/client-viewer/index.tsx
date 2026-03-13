import type { FC } from "react";

import { ClientViewerPortal } from "@/features/client-viewer/components/ClientViewerPortal";

import styles from "./client-viewer.module.scss";

export const ClientViewer: FC = () => {
  return (
    <main className={styles.pageContainer}>
      <ClientViewerPortal />
    </main>
  );
};
