import type { FC } from "react";
import { CheckOutlined, EyeOutlined, SafetyOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { Link, useNavigate } from "react-router-dom";

import { AppHeader } from "@/shared/components/layout/app-header";
import { usePageTitle } from "@/shared/hooks/use-page-title";

import styles from "./role-selection.module.scss";

export const RoleSelection: FC = () => {
  usePageTitle("Choose Role");
  const navigate = useNavigate();

  return (
    <div className={styles.pageContainer}>
      <AppHeader />
      <div className={styles.mainContent}>
        <section className={styles.selectionSection}>
          <div className={styles.selectionContent}>
            <h1 className={styles.title}>Welcome to Open Projects Hub</h1>
            <p className={styles.subtitle}>Choose how you'd like to continue</p>

            <div className={styles.roleCards}>
              {/* Admin Card */}
              <div className={styles.roleCard}>
                <div className={styles.roleIconWrapper}>
                  <SafetyOutlined className={styles.roleIcon} />
                </div>
                <h2 className={styles.roleTitle}>I&apos;m an Admin</h2>
                <span className={styles.roleBadge}>Dashboard &amp; Project Management</span>

                <ul className={styles.featureList}>
                  <li className={styles.featureItem}>
                    <CheckOutlined className={styles.checkIcon} /> Manage projects
                  </li>
                  <li className={styles.featureItem}>
                    <CheckOutlined className={styles.checkIcon} /> Track backlog
                  </li>
                  <li className={styles.featureItem}>
                    <CheckOutlined className={styles.checkIcon} /> Refine stories
                  </li>
                  <li className={styles.featureItem}>
                    <CheckOutlined className={styles.checkIcon} /> Team settings
                  </li>
                </ul>

                <Button
                  type="primary"
                  size="large"
                  block
                  className={styles.primaryButton}
                  onClick={() => navigate("/login")}
                >
                  Continue as Admin
                </Button>
              </div>

              {/* Client Card */}
              <div className={styles.roleCard}>
                <div className={styles.roleIconWrapper}>
                  <EyeOutlined className={styles.roleIcon} />
                </div>
                <h2 className={styles.roleTitle}>I&apos;m a Client</h2>
                <span className={styles.roleBadge}>Requirements Review</span>

                <ul className={styles.featureList}>
                  <li className={styles.featureItem}>
                    <CheckOutlined className={styles.checkIcon} /> View approved stories
                  </li>
                  <li className={styles.featureItem}>
                    <CheckOutlined className={styles.checkIcon} /> Track progress
                  </li>
                </ul>

                <Button
                  type="default"
                  size="large"
                  block
                  className={styles.outlineButton}
                  onClick={() => navigate("/viewer")}
                >
                  Enter Access Code
                </Button>
              </div>
            </div>

            <div className={styles.footer}>
              <Link to="/viewer" className={styles.footerLink}>
                Have a project access code? Enter it here
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
export default RoleSelection;
