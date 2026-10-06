import type { FC } from "react";

import {
  BulbOutlined,
  EyeOutlined,
  FileTextOutlined,
  CommentOutlined,
  SafetyCertificateOutlined,
  UserOutlined,
  TeamOutlined,
} from "@ant-design/icons";

import styles from "./home-info-grid.module.scss";

const audiences = [
  {
    id: "freelancers",
    title: "For Freelancers",
    description: "Turn ideas into clear plans and deliver with confidence.",
    icon: UserOutlined,
    features: [
      {
        title: "Raw Ideas to Structured Plans",
        description: "Transform unstructured notes into detailed stories and plans.",
        icon: BulbOutlined,
      },
      {
        title: "AI-Powered Refinement",
        description: "AI-assisted mapping for complex requirements and ambiguity identification.",
        icon: CommentOutlined,
      },
      {
        title: "Export to Markdown",
        description:
          "Seamlessly export structured artifacts to Markdown for sharing and integration.",
        icon: FileTextOutlined,
      },
    ],
  },
  {
    id: "clients",
    title: "For Clients",
    description: "Stay aligned with clear visibility and structured communication.",
    icon: TeamOutlined,
    features: [
      {
        title: "Client Backlog Visualization",
        description: "Read-only, transparent view of the project backlog.",
        icon: EyeOutlined,
      },
      {
        title: "Focused Feedback",
        description: "Comment on specific items and track progress with clarity.",
        icon: CommentOutlined,
      },
      {
        title: "Secure & Transparent",
        description: "Approved content is visible while drafts remain private.",
        icon: SafetyCertificateOutlined,
      },
    ],
  },
];

export const HomeInfoGrid: FC = () => (
  <section className={styles.gridSection} aria-label="Built for freelancers and clients">
    <div className={styles.gridContainer}>
      {audiences.map((audience) => (
        <article
          key={audience.id}
          className={styles.audiencePanel}
          data-audience={audience.id}
          aria-labelledby={audience.id + "-title"}
        >
          <div className={styles.audienceHeader}>
            <span className={styles.audienceIcon}>
              <audience.icon aria-hidden="true" />
            </span>
            <div>
              <h2 id={audience.id + "-title"} className={styles.columnTitle}>
                {audience.title}
              </h2>
              <p className={styles.audienceDescription}>{audience.description}</p>
            </div>
          </div>
          <ul className={styles.featureList}>
            {audience.features.map((feature) => (
              <li key={feature.title} className={styles.featureItem}>
                <feature.icon className={styles.featureIcon} aria-hidden="true" />
                <div>
                  <h3 className={styles.featureTitle}>{feature.title}</h3>
                  <p className={styles.featureDescription}>{feature.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </article>
      ))}
    </div>
  </section>
);
