import type { FC } from "react";

import {
  CheckOutlined,
  CheckCircleFilled,
  FileTextOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";

import styles from "./requirement-transformation.module.scss";

const acceptanceCriteria = [
  "The project access code opens approved stories.",
  "Drafts remain private to the project team.",
  "Client can comment on specific items.",
  "Progress is visible in a read-only dashboard.",
];

export const RequirementTransformation: FC = () => (
  <figure
    id="product-example"
    tabIndex={-1}
    aria-labelledby="product-example-caption"
    className={styles.productExample}
  >
    <div className={styles.panels}>
      <div className={styles.notesPanel}>
        <h2 className={styles.panelHeading}>
          <FileTextOutlined aria-hidden="true" /> Raw Notes
        </h2>
        <div className={styles.notesEditor}>
          <div className={styles.notesContent}>
            <p>We need a way for clients to see the project progress...</p>
            <p>Maybe a dashboard?</p>
            <p>Users should be able to comment on specific items.</p>
            <p>Keep drafts private until we approve them.</p>
            <p>Also export to markdown would be great!</p>
          </div>
          <div className={styles.notesFooter}>
            <span>Unstructured input</span>
            <span>5 lines</span>
          </div>
        </div>
      </div>
      <svg
        className={styles.transformationArrow}
        viewBox="0 0 100 50"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M5 43C25 4 65 3 90 24M77 24L91 25L88 11"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <div className={styles.storyPanel}>
        <div className={styles.storyHeader}>
          <h2 className={styles.panelHeading}>
            <span className={styles.storyIcon}>
              <FileTextOutlined aria-hidden="true" />
            </span>
            Refined Story
          </h2>
          <span className={styles.approved}>
            <CheckCircleFilled aria-hidden="true" /> Approved
          </span>
        </div>
        <h3 className={styles.storyTitle}>Review project requirements</h3>
        <p className={styles.storyDescription}>
          As a client, I want to review approved requirements so I can follow the project scope.
        </p>
        <div className={styles.criteria}>
          <h4>Acceptance criteria</h4>
          <ul>
            {acceptanceCriteria.map((criterion) => (
              <li key={criterion}>
                <CheckOutlined className={styles.checkIcon} aria-hidden="true" />
                <span>{criterion}</span>
              </li>
            ))}
          </ul>
        </div>
        <p className={styles.storyFooter}>
          <SafetyCertificateOutlined aria-hidden="true" /> Notes → Refine → Approve → Share
        </p>
      </div>
    </div>
    <figcaption id="product-example-caption" className={styles.exampleCaption}>
      Product example — sample content
    </figcaption>
  </figure>
);
