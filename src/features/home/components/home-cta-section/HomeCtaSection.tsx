import type { FC } from "react";

import { ArrowRightOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";

import styles from "./home-cta-section.module.scss";

export const HomeCtaSection: FC = () => {
  const navigate = useNavigate();

  return (
    <section className={styles.ctaSection} aria-labelledby="cta-title">
      <svg className={styles.ctaPattern} viewBox="0 0 600 120" fill="none" aria-hidden="true">
        {Array.from({ length: 8 }, (_, lineIndex) => (
          <path
            key={lineIndex}
            d={
              "M0 " +
              (100 + lineIndex * 5) +
              " C100 110 150 15 245 " +
              (45 + lineIndex * 5) +
              " S340 100 405 " +
              (40 + lineIndex * 5) +
              " S510 20 600 " +
              (70 + lineIndex * 5)
            }
          />
        ))}
      </svg>
      <div className={styles.ctaContainer}>
        <div className={styles.ctaContent}>
          <h2 id="cta-title" className={styles.ctaTitle}>
            Build with precision.
          </h2>
          <p className={styles.ctaDescription}>Plan a project or review shared requirements.</p>
        </div>
        <div className={styles.ctaActions}>
          <Button
            type="primary"
            size="large"
            className={styles.ctaPrimaryButton}
            onClick={() => navigate("/role-selection")}
          >
            Get Started <ArrowRightOutlined aria-hidden="true" />
          </Button>
          <Button
            size="large"
            className={styles.ctaSecondaryButton}
            onClick={() => navigate("/viewer")}
          >
            Enter Access Code
          </Button>
        </div>
      </div>
    </section>
  );
};
