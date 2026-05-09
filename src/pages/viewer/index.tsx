import type { FC } from "react";

import { ClientViewerPortal } from "@/features/viewer/components/client-viewer-portal";

import styles from "./client-viewer.module.scss";

export const ClientViewer: FC = () => {
  return (
    <main className={styles.pageContainer}>
      <ClientViewerPortal />
    </main>
  );
};
export default ClientViewer;
