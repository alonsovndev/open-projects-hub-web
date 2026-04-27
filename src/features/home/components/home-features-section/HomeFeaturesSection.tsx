import type { FC } from "react";

import { CheckCircleOutlined, FileTextOutlined, TeamOutlined } from "@ant-design/icons";

import styles from "./home-features-section.module.scss";

const features = [
  {
    id: "ai-analysis",
    icon: <FileTextOutlined />,
    title: "AI Analysis",
    description:
      "Upload your requirements and let AI identify gaps, ambiguities, and missing details.",
  },
  {
    id: "collaborative-refinement",
    icon: <TeamOutlined />,
    title: "Collaborative Refinement",
    description:
      "Work with stakeholders to clarify requirements through an intuitive conversation interface.",
  },
  {
    id: "approval-ready",
    icon: <CheckCircleOutlined />,
    title: "Approval Ready",
    description:
      "Generate polished, comprehensive documentation that's ready for client approval and execution.",
  },
];

export const HomeFeaturesSection: FC = () => {
  return (
    <section className={styles.featuresSection}>
      <div className={styles.featuresContainer}>
        <div className={styles.featuresHeader}>
          <h2 className={styles.featuresTitle}>REFINE TO APPROVE.</h2>
          <p className={styles.featuresSubtitle}>
            Transform rough ideas into crystal-clear project specifications
          </p>
        </div>

        <div className={styles.featuresGrid}>
          {features.map((feature) => (
            <div key={feature.id} className={styles.featureCard}>
              <div className={styles.featureIcon}>{feature.icon}</div>
              <h3 className={styles.featureTitle}>{feature.title}</h3>
              <p className={styles.featureDescription}>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
