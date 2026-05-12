import type { FC } from "react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input, Button, message } from "antd";

import { AppHeader } from "@/shared/components/layout/app-header";
import { usePageTitle } from "@/shared/hooks/use-page-title";

import styles from "./project-entry.module.scss";

export const ProjectEntry: FC = () => {
  usePageTitle("Project Entry");
  const navigate = useNavigate();
  const [projectId, setProjectId] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!projectId.trim()) {
      message.error("Please enter a project ID");
      return;
    }

    setLoading(true);

    // TODO: Validate project ID with backend
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      message.success("Project ID validated successfully");
      // Navigate to viewer with project ID
      navigate(`/viewer/${projectId}`);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <div className={styles.pageContainer}>
      <AppHeader />
      <main className={styles.mainContent}>
        <section className={styles.entrySection}>
          <div className={styles.entryContent}>
            <div className={styles.iconWrapper}>
              <svg
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9 11L12 14L22 4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M21 12V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <h1 className={styles.title}>Enter Project ID</h1>
            <p className={styles.description}>
              Please enter the project ID provided to you to access the project details
            </p>

            <div className={styles.formWrapper}>
              <Input
                size="large"
                placeholder="e.g., PRJ-2024-XXXX"
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                onKeyPress={handleKeyPress}
                className={styles.input}
              />
              <Button
                type="primary"
                size="large"
                loading={loading}
                onClick={handleSubmit}
                className={styles.submitButton}
              >
                Access Project
              </Button>
            </div>

            <div className={styles.helpText}>
              <p>Don't have a project ID?</p>
              <button className={styles.backLink} onClick={() => navigate("/role-selection")}>
                Go back to role selection
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};
export default ProjectEntry;
