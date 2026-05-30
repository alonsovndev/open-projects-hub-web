import type { FC } from "react";

import { FileTextOutlined, QuestionCircleOutlined, CheckCircleOutlined } from "@ant-design/icons";

import styles from "./home-features-section.module.scss";

const steps = [
  {
    id: "paste-notes",
    number: "01",
    icon: <FileTextOutlined />,
    title: "Paste Raw Notes",
    description:
      "Input chaotic client emails, meeting transcripts, or voice notes. We take the mess so you don't have to.",
  },
  {
    id: "identify-ambiguity",
    number: "02",
    icon: <QuestionCircleOutlined />,
    title: "Identify Ambiguity",
    description:
      "Our AI highlights missing details, conflicting requirements, and hidden risks in real-time.",
  },
  {
    id: "admin-approval",
    number: "03",
    icon: <CheckCircleOutlined />,
    title: "Admin Approval",
    description:
      "Structure these insights into stories. Admins approve the final plan to lock in a professional roadmap.",
  },
];

export const HomeFeaturesSection: FC = () => {
  return (
    <section className={styles.featuresSection} id="features">
      <div className={styles.featuresContainer}>
        <div className={styles.featuresHeader}>
          <h2 className={styles.featuresTitle}>Refine to Approve.</h2>
          <p className={styles.featuresSubtitle}>
            A seamless three-step cycle to bring professional clarity to every freelance engagement.
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
