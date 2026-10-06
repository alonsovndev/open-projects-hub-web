import type { FC } from "react";

import {
  ArrowRightOutlined,
  FileTextOutlined,
  GithubOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";

import { RequirementTransformation } from "@/features/home/components/requirement-transformation/RequirementTransformation";

import styles from "./home-hero.module.scss";

export const HomeHero: FC = () => {
  const navigate = useNavigate();

  return (
    <section className={styles.heroSection} aria-labelledby="hero-title">
      <div className={styles.heroContainer}>
        <div className={styles.heroContent}>
          <h1 id="hero-title" className={styles.heroTitle}>
            <span>Turn raw</span> <span>requirements into</span>{" "}
            <span className={styles.heroAccent}>buildable projects.</span>
          </h1>
          <p className={styles.heroDescription}>
            Transform raw notes into structured project plans with AI-assisted refinement, approval
            workflows, and transparent client backlog visualization.
          </p>
          <div className={styles.heroActions}>
            <Button
              type="primary"
              size="large"
              className={styles.heroPrimaryButton}
              onClick={() => navigate("/role-selection")}
            >
              Start Project <ArrowRightOutlined aria-hidden="true" />
            </Button>
            <Button size="large" className={styles.heroSecondaryButton} href="#product-example">
              View Sample
            </Button>
          </div>
          <ul className={styles.heroMetadata} aria-label="Product highlights">
            <li>
              <GithubOutlined aria-hidden="true" /> Open source
            </li>
            <li>
              <FileTextOutlined aria-hidden="true" /> Markdown export
            </li>
            <li>
              <TeamOutlined aria-hidden="true" /> Built for freelancers
            </li>
          </ul>
        </div>
        <RequirementTransformation />
      </div>
    </section>
  );
};
