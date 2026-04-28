import type { FC } from "react";
import { useNavigate } from "react-router-dom";

import { AppHeader } from "@/shared/components/layout/app-header";

import styles from "./role-selection.module.scss";

export const RoleSelection: FC = () => {
  const navigate = useNavigate();

  const handleAdminClick = () => {
    navigate("/login");
  };

  const handleUserClick = () => {
    navigate("/project-entry");
  };

  return (
    <div className={styles.pageContainer}>
      <AppHeader />
      <main className={styles.mainContent}>
        <section className={styles.selectionSection}>
          <div className={styles.selectionContent}>
            <h1 className={styles.title}>Choose Your Role</h1>
            <p className={styles.description}>Select how you want to interact with the platform</p>

            <div className={styles.roleCards}>
              <button className={styles.roleCard} onClick={handleAdminClick}>
                <div className={styles.roleIcon}>
                  <svg
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 2L2 7L12 12L22 7L12 2Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M2 17L12 22L22 17"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M2 12L12 17L22 12"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h2 className={styles.roleTitle}>Admin</h2>
                <p className={styles.roleDescription}>
                  Manage projects, users, and platform settings
                </p>
              </button>

              <button className={styles.roleCard} onClick={handleUserClick}>
                <div className={styles.roleIcon}>
                  <svg
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h2 className={styles.roleTitle}>User</h2>
                <p className={styles.roleDescription}>
                  View and collaborate on projects with your team
                </p>
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};
