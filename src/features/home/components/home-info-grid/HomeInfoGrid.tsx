import type { FC } from "react";

import { FolderOpenOutlined, UsergroupAddOutlined } from "@ant-design/icons";

import styles from "./home-info-grid.module.scss";

export const HomeInfoGrid: FC = () => {
  return (
    <section className={styles.infoGridSection}>
      <div className={styles.infoGridContainer}>
        <div className={styles.infoCard}>
          <div className={styles.infoIconWrapper}>
            <FolderOpenOutlined className={styles.infoIcon} />
          </div>
          <h3 className={styles.infoTitle}>PROJECT ARCHIVE</h3>
          <p className={styles.infoDescription}>
            Access your complete project history. Review past requirements, decisions, and outcomes
            to inform future work and maintain institutional knowledge.
          </p>
          <ul className={styles.infoList}>
            <li>Searchable project repository</li>
            <li>Version history tracking</li>
            <li>Exportable documentation</li>
          </ul>
        </div>

        <div className={styles.infoCard}>
          <div className={styles.infoIconWrapper}>
            <UsergroupAddOutlined className={styles.infoIcon} />
          </div>
          <h3 className={styles.infoTitle}>CLIENTS</h3>
          <p className={styles.infoDescription}>
            Manage client relationships and project portfolios. Track communication, preferences,
            and project outcomes to deliver consistently excellent results.
          </p>
          <ul className={styles.infoList}>
            <li>Client profile management</li>
            <li>Project history per client</li>
            <li>Communication logs</li>
          </ul>
        </div>
      </div>
    </section>
  );
};
