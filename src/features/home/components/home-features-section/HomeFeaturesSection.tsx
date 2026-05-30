import type { FC } from "react";

import { FileTextOutlined, RobotOutlined, BarChartOutlined } from "@ant-design/icons";

import styles from "./home-features-section.module.scss";

const steps = [
  {
    id: "capture-raw-ideas",
    number: "01",
    icon: <FileTextOutlined />,
    title: "Capture Raw Ideas",
    description:
      "Input unstructured notes, emails, and conversations to begin structuring your project.",
  },
  {
    id: "ai-refine-stories",
    number: "02",
    icon: <RobotOutlined />,
    title: "AI-Powered Story Refinement",
    description:
      "Leverage AI to refine raw ideas into structured stories, identify ambiguities, and create actionable plans.",
  },
  {
    id: "visualize-export-plan",
    number: "03",
    icon: <BarChartOutlined />,
    title: "Visualize & Export Plan",
    description:
      "Visualize client backlogs, maintain editorial control, and export structured artifacts to Markdown.",
  },
];

export const HomeFeaturesSection: FC = () => {
  return (
    <section className={styles.featuresSection} id="features">
      <div className={styles.featuresContainer}>
        <div className={styles.featuresHeader}>
          <h2 className={styles.featuresTitle}>From Idea to Impact.</h2>
          <p className={styles.featuresSubtitle}>
            A seamless three-step cycle to bring professional clarity to every project.
          </p>
        </div>

        <div className={styles.featuresGrid}>
          {steps.map((step) => (
            <div key={step.id} className={styles.featureCard}>
              <div className={styles.featureNumber} aria-hidden="true">
                {step.number}
              </div>
              <div className={styles.featureIcon}>{step.icon}</div>
              <h3 className={styles.featureTitle}>{step.title}</h3>
              <p className={styles.featureDescription}>{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
