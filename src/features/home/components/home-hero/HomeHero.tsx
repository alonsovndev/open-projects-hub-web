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
          <Button size="large" className={styles.heroSecondaryButton}>
            View Sample
          </Button>
        </div>
      </div>
      <div className={styles.heroImage}>
        <img
          src="/hero-workspace.jpg"
          alt="Modern workspace with monitor and desk setup"
          className={styles.heroImg}
        />
      </div>
    </section>
  );
};
