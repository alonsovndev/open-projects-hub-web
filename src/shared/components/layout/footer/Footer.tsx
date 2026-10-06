import type { FC } from "react";

import { GithubOutlined } from "@ant-design/icons";
import { Typography } from "antd";
import { Link } from "react-router-dom";

import styles from "./footer.module.scss";

const { Text } = Typography;

interface FooterProps {
  variant?: "default" | "landing";
}

export const Footer: FC<FooterProps> = ({ variant = "default" }) => {
  const currentYear = new Date().getFullYear();

  if (variant === "landing") {
    return (
      <footer className={styles.landingFooter}>
        <div className={styles.landingContainer}>
          <Link to="/" className={styles.landingBrand}>
            <img src="/favicon.svg" alt="" width="22" height="22" />
            Open Projects Hub
          </Link>
          <nav className={styles.landingNav} aria-label="Footer navigation">
            <a href="#features">Product</a>
            <a
              href="https://github.com/NaranjoSolutions/open-projects-hub-docs"
              target="_blank"
              rel="noopener noreferrer"
            >
              Documentation
            </a>
            <a
              href="https://github.com/NaranjoSolutions/open-projects-hub-web"
              target="_blank"
              rel="noopener noreferrer"
            >
              Code (GitHub)
            </a>
            <Link to="/privacy">Privacy</Link>
            <Link to="/terms">Terms</Link>
          </nav>
          <a
            href="https://github.com/NaranjoSolutions/open-projects-hub-web"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.landingGithub}
            aria-label="GitHub repository"
          >
            <GithubOutlined aria-hidden="true" />
          </a>
          <span className={styles.landingCopyright}>
            &copy; {currentYear} Open Projects Hub. All rights reserved.
          </span>
        </div>
      </footer>
    );
  }

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        <div className={styles.footerBrand}>
          <Text className={styles.brandName}>Open Projects Hub.</Text>
          <p className={styles.brandTagline}>
            Empowering freelancers through structural clarity and architectural design systems.
          </p>
        </div>

        <div className={styles.footerColumns}>
          <div className={styles.footerColumn}>
            <h2 className={styles.columnTitle}>Directories</h2>
            <a
              href="https://github.com/NaranjoSolutions/open-projects-hub-docs"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.footerLink}
            >
              Documentation
            </a>
            <a
              href="https://github.com/alonsovndev"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.footerLink}
            >
              Code
            </a>
          </div>

          <div className={styles.footerColumn}>
            <h2 className={styles.columnTitle}>Legal &amp; Policy</h2>
            <Link to="/privacy" className={styles.footerLink}>
              Privacy
            </Link>
            <Link to="/terms" className={styles.footerLink}>
              Terms
            </Link>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <span className={styles.copyright}>&copy; {currentYear} Open Projects Hub</span>
          <a
            href="https://github.com/NaranjoSolutions/open-projects-hub-web"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.githubLink}
            aria-label="GitHub repository"
          >
            <GithubOutlined />
          </a>
        </div>
      </div>
    </footer>
  );
};
