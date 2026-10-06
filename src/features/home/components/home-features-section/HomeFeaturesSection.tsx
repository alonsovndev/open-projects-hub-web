import type { FC } from "react";

import {
  ArrowRightOutlined,
  FileTextOutlined,
  ThunderboltOutlined,
  ExportOutlined,
} from "@ant-design/icons";

import styles from "./home-features-section.module.scss";

const features = [
  {
    id: "capture",
    title: "Capture Raw Ideas",
    description:
      "Input unstructured notes, emails, and conversations to begin structuring your project.",
    icon: FileTextOutlined,
  },
  {
    id: "refine",
    title: "AI-Powered Story Refinement",
    description:
      "Leverage AI to refine raw ideas into structured stories, identify ambiguities, and create actionable plans.",
    icon: ThunderboltOutlined,
  },
  {
    id: "export",
    title: "Visualize & Export Plan",
    description:
      "Visualize client backlogs, maintain editorial control, and export structured artifacts to Markdown.",
    icon: ExportOutlined,
  },
];

export const HomeFeaturesSection: FC = () => (
  <section className={styles.featuresSection} id="features" aria-labelledby="features-title">
    <div className={styles.featuresContainer}>
      <div className={styles.featuresHeader}>
        <h2 id="features-title" className={styles.featuresTitle}>
          From idea to impact.
        </h2>
        <p className={styles.featuresSubtitle}>
          A seamless flow from unstructured thoughts to professional project plans.
        </p>
        <a className={styles.workflowLink} href="#workflow">
          Learn more about the workflow <ArrowRightOutlined aria-hidden="true" />
        </a>
      </div>
      <div className={styles.featuresGrid}>
        {features.map((feature) => (
          <article key={feature.id} className={styles.featurePanel} data-visual={feature.id}>
            <span className={styles.featureIcon}>
              <feature.icon aria-hidden="true" />
            </span>
            <h3 className={styles.featureTitle}>{feature.title}</h3>
            <p className={styles.featureDescription}>{feature.description}</p>
            <div className={styles.productMiniature} aria-hidden="true">
              <div className={styles.miniatureToolbar}>
                <span />
                <span />
              </div>
              <div className={styles.miniatureRows}>
                <span />
                <span />
                <span />
                <span />
                <span />
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  </section>
);
