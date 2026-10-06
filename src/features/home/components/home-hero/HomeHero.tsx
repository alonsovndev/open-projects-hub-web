import type { FC } from "react";

import { ArrowRightOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";

import styles from "./home-hero.module.scss";

export const HomeHero: FC = () => {
  const navigate = useNavigate();

  return (
    <section className={styles.heroSection}>
      <div className={styles.heroContent}>
        <h1 className={styles.heroTitle}>
          Turn Ambiguity <span className={styles.heroAccent}>Into Action.</span>
        </h1>
        <p className={styles.heroDescription}>
          Transform raw ideas into structured project plans with AI-powered refinement, seamless
          Markdown exports, and transparent client backlog visualization.
        </p>
        <div className={styles.heroActions}>
          <Button
            type="primary"
            size="large"
            className={styles.heroPrimaryButton}
            onClick={() => navigate("/role-selection")}
          >
            Start Project
            <ArrowRightOutlined />
          </Button>
          <Button size="large" className={styles.heroSecondaryButton} href="#product-example">
            View Sample
          </Button>
        </div>
      </div>
      <figure
        id="product-example"
        tabIndex={-1}
        aria-labelledby="product-example-caption"
        className={styles.productExample}
      >
        <figcaption id="product-example-caption" className={styles.exampleCaption}>
          Product example — sample content
        </figcaption>
        <div className={styles.exampleNotes}>
          <h2 className={styles.exampleLabel}>Raw notes</h2>
          <p>
            Clients need to see what is ready. Share approved requirements and keep drafts private.
          </p>
        </div>
        <div className={styles.exampleStory}>
          <div className={styles.exampleStoryHeader}>
            <span className={styles.exampleLabel}>Refined story</span>
            <span className={styles.exampleStatus}>Approved</span>
          </div>
          <h2>Review project requirements</h2>
          <p>
            As a client, I want to review approved requirements so I can follow the project scope.
          </p>
          <h3 className={styles.exampleLabel}>Acceptance criteria</h3>
          <ul>
            <li>The project access code opens approved stories.</li>
            <li>Drafts remain private to the project team.</li>
          </ul>
        </div>
        <p className={styles.exampleFooter}>Notes → Refine → Approve → Share</p>
      </figure>
    </section>
  );
};
