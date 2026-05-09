import type { FC } from "react";

import styles from "./footer.module.scss";

export const Footer: FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <span>© {currentYear} Open Projects Hub. All rights reserved.</span>
      <span className={styles.footerDot}>•</span>
      <span className={styles.footerLink}>Privacy Policy</span>
      <span className={styles.footerDot}>•</span>
      <span className={styles.footerLink}>Terms of Service</span>
      <span className={styles.footerDot}>•</span>
      <span className={styles.footerLink}>Contact Us</span>
    </footer>
  );
};
