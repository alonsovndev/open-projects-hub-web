import type { FC } from "react";

import { Button } from "antd";

import styles from "./home-hero.module.scss";

export const HomeHero: FC = () => {
  return (
    <section className={styles.heroSection}>
      <div className={styles.heroContent}>
        <h1 className={styles.heroTitle}>
          TURN AMBIGUITY
          <br />
          INTO <span className={styles.heroAccent}>ACTION.</span>
        </h1>
        <p className={styles.heroDescription}>
          Transform unclear requirements into actionable project plans. Our AI-powered platform
          helps freelancers and clients collaborate with precision.
        </p>
        <Button type="primary" size="large" className={styles.heroButton}>
          Get Started
        </Button>
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
