import type { FC } from "react";

import { ProjectOutlined } from "@ant-design/icons";
import { Typography } from "antd";

import styles from "./HomeHero.module.scss";

const { Paragraph, Title } = Typography;

export const HomeHero: FC = () => {
  return (
    <header className={styles.headerSection}>
      <div className={styles.topIconWrapper}>
        <ProjectOutlined />
      </div>
      <Title level={1} className={styles.title}>
        Open Freelancer Project Hub
      </Title>
      <Paragraph className={styles.subtitle}>
        Discover freelance projects and refine requirements with AI. Please
        select your role to access the platform.
      </Paragraph>
    </header>
  );
};
