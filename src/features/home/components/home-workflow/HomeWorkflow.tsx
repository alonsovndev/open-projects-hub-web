import type { FC } from "react";

import {
  ArrowRightOutlined,
  CheckCircleOutlined,
  FileTextOutlined,
  ThunderboltOutlined,
  UploadOutlined,
} from "@ant-design/icons";

import styles from "./home-workflow.module.scss";

const steps = [
  {
    title: "Capture",
    description: "Input raw notes, emails, and conversations.",
    icon: FileTextOutlined,
  },
  {
    title: "Refine",
    description: "Use AI to structure, clarify, and turn ideas into stories.",
    icon: ThunderboltOutlined,
  },
  {
    title: "Approve",
    description: "Review and finalize with your client.",
    icon: CheckCircleOutlined,
  },
  {
    title: "Share",
    description: "Visualize backlogs and export to Markdown.",
    icon: UploadOutlined,
  },
];

export const HomeWorkflow: FC = () => (
  <section id="workflow" className={styles.workflowSection} aria-label="Project workflow">
    <ol className={styles.workflowList}>
      {steps.map((step, stepIndex) => (
        <li key={step.title} className={styles.workflowStep}>
          <span className={styles.stepIcon}>
            <step.icon aria-hidden="true" />
          </span>
          <div className={styles.stepContent}>
            <span className={styles.stepNumber}>{String(stepIndex + 1).padStart(2, "0")}</span>
            <h2>{step.title}</h2>
            <p>{step.description}</p>
          </div>
          {stepIndex < steps.length - 1 && (
            <ArrowRightOutlined className={styles.stepArrow} aria-hidden="true" />
          )}
        </li>
      ))}
    </ol>
  </section>
);
