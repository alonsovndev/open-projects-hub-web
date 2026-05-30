import type { FC } from "react";

import { BulbOutlined, EditOutlined, EyeOutlined, LineChartOutlined } from "@ant-design/icons";

import styles from "./home-info-grid.module.scss";

const freelancerFeatures = [
  {
    id: "direct-discovery",
    icon: <BulbOutlined />,
    title: "Direct Discovery",
    description: "AI-assisted mapping for complex requirements.",
  },
  {
    id: "story-structuring",
    icon: <EditOutlined />,
    title: "Story Structuring",
    description: "Full editorial control over project components.",
  },
];

const clientFeatures = [
  {
    id: "secure-review",
    icon: <EyeOutlined />,
    title: "Secure Review",
    description: "Read-only access to structured roadmaps.",
  },
  {
    id: "visual-clarity",
    icon: <LineChartOutlined />,
    title: "Visual Clarity",
    description: "Real-time momentum tracking and alignment.",
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
