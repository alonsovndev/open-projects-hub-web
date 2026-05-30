import type { FC, ReactNode } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "antd";
import { MenuOutlined, CloseOutlined, FileTextOutlined } from "@ant-design/icons";

import { useActiveTheme } from "@/app/hooks/use-active-theme";
import { ThemeToggle } from "@/shared/components/theme-toggle";
import styles from "./app-header.module.scss";

interface AppHeaderProps {
  children?: ReactNode;
  actions?: ReactNode;
  identity?: ReactNode;
  variant?: "default" | "landing";
}

export const AppHeader: FC<AppHeaderProps> = ({
  children,
  actions,
  identity,
  variant = "default",
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme: activeTheme } = useActiveTheme();
  const logoSrc = activeTheme === "dark" ? "/logo-dark.svg" : "/logo.svg";

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
                <img src={logoSrc} alt="Open Freelancer Hub" className={styles.brandLogo} />
              </Link>

              <nav className={styles.navLinks}>
                <a
                  href="https://github.com/alonsovndev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.navLink}
                >
                  Code
                </a>
                <a
                  href="https://github.com/NaranjoSolutions/open-projects-hub-docs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.navLink}
                >
                  <FileTextOutlined className={styles.navIcon} />
                  Documentation
                </a>
              </nav>
            </div>

            {/* Right: Actions */}
            <div className={styles.landingActions}>
              <ThemeToggle />
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
                href="https://github.com/alonsovndev"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.mobileNavLink}
                onClick={toggleMobileMenu}
              >
                Code
              </a>
              <a
                href="https://github.com/NaranjoSolutions/open-projects-hub-docs"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.mobileNavLink}
                onClick={toggleMobileMenu}
              >
                <FileTextOutlined className={styles.navIcon} />
                Documentation
              </a>
            </nav>
            <div className={styles.mobileActions}>
              <ThemeToggle />
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
        <img src={logoSrc} alt="Open Freelancer Project Hub logo" className={styles.brandLogo} />

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
