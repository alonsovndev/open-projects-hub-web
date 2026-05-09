import type { FC, ReactNode } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button, Typography } from "antd";
import { MenuOutlined, CloseOutlined, GithubOutlined, FileTextOutlined } from "@ant-design/icons";

import styles from "./app-header.module.scss";

interface AppHeaderProps {
  children?: ReactNode;
  actions?: ReactNode;
  identity?: ReactNode;
  variant?: "default" | "landing";
}

const { Text } = Typography;

export const AppHeader: FC<AppHeaderProps> = ({
  children,
  actions,
  identity,
  variant = "default",
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Landing variant with navigation
  if (variant === "landing") {
    return (
      <>
        <header className={`${styles.header} ${styles.headerLanding}`}>
          <div className={styles.landingContainer}>
            {/* Left: Brand + Links */}
            <div className={styles.leftSection}>
              <Link to="/" className={styles.brandSection}>
                <img src="/logo.svg" alt="Open Freelancer Hub" className={styles.brandLogo} />
                <Text className={styles.brandName}>Open Freelancer Hub</Text>
              </Link>

              <nav className={styles.navLinks}>
                <a
                  href="https://github.com/NaranjoSolutions/open-projects-hub-docs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.navLink}
                >
                  <FileTextOutlined className={styles.navIcon} />
                  Docs
                </a>
                <a
                  href="https://github.com/NaranjoSolutions/open-projects-hub-web"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.navLink}
                >
                  <GithubOutlined className={styles.navIcon} />
                  GitHub
                </a>
              </nav>
            </div>

            {/* Right: Actions */}
            <div className={styles.landingActions}>
              <Button type="text" size="large" href="/login" className={styles.signInButton}>
                Log In
              </Button>
              <Button
                type="primary"
                size="large"
                href="/role-selection"
                className={styles.ctaButton}
              >
                Get Started
              </Button>
            </div>

            {/* Mobile Toggle */}
            <button
              className={styles.mobileToggle}
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <CloseOutlined /> : <MenuOutlined />}
            </button>
          </div>
        </header>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className={styles.mobileMenu}>
            <nav className={styles.mobileNavLinks}>
              <a
                href="https://github.com/NaranjoSolutions/open-projects-hub-docs"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.mobileNavLink}
                onClick={toggleMobileMenu}
              >
                <FileTextOutlined className={styles.navIcon} />
                Docs
              </a>
              <a
                href="https://github.com/NaranjoSolutions/open-projects-hub-web"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.mobileNavLink}
                onClick={toggleMobileMenu}
              >
                <GithubOutlined className={styles.navIcon} />
                GitHub
              </a>
            </nav>
            <div className={styles.mobileActions}>
              <Button
                type="text"
                size="large"
                href="/login"
                block
                className={styles.mobileSignInButton}
              >
                Log In
              </Button>
              <Button
                type="primary"
                size="large"
                href="/role-selection"
                block
                className={styles.mobileCtaButton}
              >
                Get Started
              </Button>
            </div>
          </div>
        )}
      </>
    );
  }

  // Default variant (existing behavior)
  return (
    <header className={styles.header}>
      <Link to="/" className={styles.brandSection}>
        <img src="/logo.svg" alt="Open Freelancer Project Hub logo" className={styles.brandLogo} />

        <Text className={styles.brandName}>Open Freelancer Project Hub</Text>

        {children}
      </Link>

      {actions || identity ? (
        <div className={styles.actions}>
          {identity}
          {actions}
        </div>
      ) : null}
    </header>
  );
};
