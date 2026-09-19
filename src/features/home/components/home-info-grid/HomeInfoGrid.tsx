import type { FC } from "react";

import {
  BulbOutlined,
  EyeOutlined,
  RobotOutlined,
  FileTextOutlined,
  CodeOutlined,
} from "@ant-design/icons";

import styles from "./home-info-grid.module.scss";

const freelancerFeatures = [
  {
    id: "raw-ideas-to-structures",
    icon: <BulbOutlined />,
    title: "Raw Ideas to Structured Plans",
    description: "Transform unstructured notes into detailed stories and plans.",
  },
  {
    id: "ai-powered-refinement",
    icon: <RobotOutlined />,
    title: "AI-Powered Refinement",
    description: "AI-assisted mapping for complex requirements and ambiguity identification.",
  },
  {
    id: "export-to-markdown",
    icon: <FileTextOutlined />,
    title: "Export to Markdown",
    description:
      "Seamlessly export all structured artifacts to Markdown for easy sharing and integration.",
  },
];

const clientFeatures = [
  {
    id: "clients-backlog-visualization",
    icon: <EyeOutlined />,
    title: "Client Backlog Visualization",
    description: "Read-only, transparent view of the project backlog and structured roadmaps.",
  },
  {
    id: "open-source-friendly",
    icon: <CodeOutlined />,
    title: "Open Source & Developer Friendly",
    description: "Integrate with developer workflows and leverage open-source standards.",
  },
];

export const HomeInfoGrid: FC = () => {
  return (
    <section className={styles.gridSection}>
      <div className={styles.gridContainer}>
        <div className={styles.gridColumn}>
          <h3 className={styles.columnTitle}>Freelancers</h3>
          <div className={styles.featureList}>
            {freelancerFeatures.map((feature) => (
              <div key={feature.id} className={styles.featureCard}>
                <div className={styles.featureIcon}>{feature.icon}</div>
                <div className={styles.featureContent}>
                  <h4 className={styles.featureTitle}>{feature.title}</h4>
                  <p className={styles.featureDescription}>{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.gridColumn}>
          <h3 className={styles.columnTitle}>Clients</h3>
          <div className={styles.featureList}>
            {clientFeatures.map((feature) => (
              <div key={feature.id} className={styles.featureCard}>
                <div className={styles.featureIcon}>{feature.icon}</div>
                <div className={styles.featureContent}>
                  <h4 className={styles.featureTitle}>{feature.title}</h4>
                  <p className={styles.featureDescription}>{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
