import type { FC } from "react";

import { ClientViewerPortal } from "@/features/viewer/components/client-viewer-portal";
import { usePageTitle } from "@/shared/hooks/use-page-title";

import styles from "./client-viewer.module.scss";

export const ClientViewer: FC = () => {
  usePageTitle("Project Viewer");
  return (
    <main className={styles.pageContainer}>
      <ClientViewerPortal />
    </main>
  );
};
export default ClientViewer;
