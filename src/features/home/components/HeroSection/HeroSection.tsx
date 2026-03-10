import React from "react";
import { Typography, Card, Button } from "antd";
import { ProjectOutlined, UsergroupAddOutlined, EyeOutlined } from "@ant-design/icons";
import styles from "./HeroSection.module.scss";

const { Title, Paragraph } = Typography;

export const HeroSection: React.FC = () => {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.mainContent}>
        {/* Header Section */}
        <div className={styles.topIconWrapper}>
          <ProjectOutlined />
        </div>
        <Title level={1} className={styles.title}>
          Open Freelancer Project Hub
        </Title>
        <Paragraph className={styles.subtitle}>
          Discover freelance projects and refine requirements with AI. Please select your role to access the platform.
        </Paragraph>

        {/* Role Selection Cards */}
        <div className={styles.cardContainer}>
          {/* Admin Card */}
          <Card bordered={true} className={styles.roleCard}>
            <div className={`${styles.cardIconWrapper} ${styles.adminIcon}`}>
              <UsergroupAddOutlined />
            </div>
            <Title level={4} className={styles.cardTitle}>
              Admin Access
            </Title>
            <Paragraph className={styles.cardDescription}>Manage projects and run AI refinement.</Paragraph>
            <Button type="primary" className={styles.cardButton}>
              Sign In as Admin
            </Button>
          </Card>

          {/* Viewer Card */}
          <Card bordered={true} className={styles.roleCard}>
            <div className={`${styles.cardIconWrapper} ${styles.viewerIcon}`}>
              <EyeOutlined />
            </div>
            <Title level={4} className={styles.cardTitle}>
              Client Viewer
            </Title>
            <Paragraph className={styles.cardDescription}>View approved requirements and project status.</Paragraph>
            <Button className={styles.cardButton}>Access as Viewer</Button>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <div className={styles.footer}>
        <span className={styles.footerLink}>Privacy Policy</span>
        <span className={styles.footerDot}>•</span>
        <span className={styles.footerLink}>Terms of Service</span>
        <span className={styles.footerDot}>•</span>
        <span className={styles.footerLink}>Contact Us</span>
      </div>
    </div>
  );
};
