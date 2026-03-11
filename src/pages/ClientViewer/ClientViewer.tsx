import { FC } from "react";
import { ProjectCodeSearch } from "../../features/clientViewer/components/ProjectCodeSearch";
import { Footer } from "../../shared/components/Footer";
import styles from "./ClientViewer.module.scss";

export const ClientViewer: FC = () => {
  return (
    <main className={styles.pageContainer}>
      <div className={styles.mainContent}>
        <ProjectCodeSearch />
      </div>
      <Footer />
    </main>
  );
};
