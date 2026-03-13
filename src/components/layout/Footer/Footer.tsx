import type { FC } from "react";

import styles from "./Footer.module.scss";

export const Footer: FC = () => {
  return (
    <footer className={styles.footer}>
      <span className={styles.footerLink}>Privacy Policy</span>
      <span className={styles.footerDot}>•</span>
      <span className={styles.footerLink}>Terms of Service</span>
      <span className={styles.footerDot}>•</span>
      <span className={styles.footerLink}>Contact Us</span>
    </footer>
  );
};
