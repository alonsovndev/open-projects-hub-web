import type { FC } from "react";

import { Button } from "antd";
import { useNavigate } from "react-router-dom";

import styles from "./home-cta-section.module.scss";

export const HomeCtaSection: FC = () => {
  const navigate = useNavigate();

  return (
    <section className={styles.ctaSection}>
      <div className={styles.ctaContainer}>
        <div className={styles.ctaContent}>
          <h2 className={styles.ctaTitle}>Build with Precision.</h2>
          <p className={styles.ctaDescription}>
            Turn ambiguous notes into actionable project plans. Starts here.
          </p>
          <div className={styles.ctaActions}>
            <Button
              type="primary"
              size="large"
              className={styles.ctaPrimaryButton}
              onClick={() => navigate("/register")}
            >
              Create Account
            </Button>
            <Button
              size="large"
              className={styles.ctaSecondaryButton}
              href="https://github.com/alonsovndev"
              target="_blank"
              rel="noopener noreferrer"
            >
              Contact
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
