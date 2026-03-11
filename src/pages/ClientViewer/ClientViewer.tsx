import { FC } from "react";
import { ClientViewerPortal } from "../../features/clientViewer/components/ClientViewerPortal";
import styles from "./ClientViewer.module.scss";

export const ClientViewer: FC = () => {
  return (
    <main className={styles.pageContainer}>
      <ClientViewerPortal />
    </main>
  );
};
