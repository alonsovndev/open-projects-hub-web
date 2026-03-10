import React from "react";
import { Typography, Layout, Flex } from "antd";
import styles from "./HeroSection.module.scss";

const { Title, Paragraph } = Typography;
const { Content } = Layout;

export const HeroSection: React.FC = () => {
  return (
    <Layout className={styles.heroLayout}>
      <Content className={styles.heroContent}>
        <Flex vertical gap="large">
          <Title level={1} className={styles.title}>
            Open Project Hub
          </Title>
          <Title level={3} className={styles.subtitle}>
            Welcome to the Future of Freelance Project Management
          </Title>
          <Paragraph className={styles.description}>
            An open-source platform for freelancers to manage clients, structure requirements, and use AI to transform
            ambiguous ideas into clear technical specs.
          </Paragraph>
        </Flex>
      </Content>
    </Layout>
  );
};
