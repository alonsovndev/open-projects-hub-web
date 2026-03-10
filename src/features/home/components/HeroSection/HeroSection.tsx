import React from "react";
import { Typography } from "antd";
import { ProjectOutlined } from "@ant-design/icons";
import styles from "./HeroSection.module.scss";

const { Title, Paragraph } = Typography;

export const HeroSection: React.FC = () => {
  return (
    <header className={styles.headerSection}>
      <div className={styles.topIconWrapper}>
        <ProjectOutlined />
      </div>
      <Title level={1} className={styles.title}>
        Open Freelancer Project Hub
      </Title>
      <Paragraph className={styles.subtitle}>
        Discover freelance projects and refine requirements with AI. Please select your role to access the platform.
      </Paragraph>
    </header>
  );
};
