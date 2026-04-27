import type { FC } from "react";

import { Button } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";

import styles from "./home-cta-section.module.scss";

export const HomeCtaSection: FC = () => {
  return (
    <section className={styles.ctaSection}>
      <div className={styles.ctaContainer}>
        <div className={styles.ctaContent}>
          <h2 className={styles.ctaTitle}>BUILD WITH PRECISION.</h2>
          <p className={styles.ctaDescription}>
            Stop wasting time on unclear requirements. Start every project with confidence, clarity,
            and a solid foundation that sets you up for success.
          </p>
          <div className={styles.ctaActions}>
            <Button type="primary" size="large" className={styles.ctaPrimaryButton}>
              Start Your First Project
            </Button>
            <Button size="large" className={styles.ctaSecondaryButton}>
              Learn More <ArrowRightOutlined />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
