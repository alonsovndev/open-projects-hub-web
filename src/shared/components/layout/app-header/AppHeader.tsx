import type { FC, ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "antd";
import { MenuOutlined, CloseOutlined, ArrowRightOutlined } from "@ant-design/icons";

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
  const mobileToggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!mobileMenuOpen) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileMenuOpen(false);
        mobileToggleRef.current?.focus();
      }
    };
    const desktopQuery = window.matchMedia("(min-width: 900px)");
    const closeOnDesktop = () => {
      if (desktopQuery.matches) setMobileMenuOpen(false);
    };

    document.addEventListener("keydown", closeOnEscape);
    desktopQuery.addEventListener("change", closeOnDesktop);
    closeOnDesktop();
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      desktopQuery.removeEventListener("change", closeOnDesktop);
    };
  }, [mobileMenuOpen]);

  if (variant === "landing") {
    return (
      <header className={styles.headerLanding}>
        <div className={styles.landingContainer}>
          <div className={styles.leftSection}>
            <Link to="/" className={styles.brandSection}>
              <img src="/favicon.svg" alt="" className={styles.brandLogo} width="38" height="38" />
              <span className={styles.brandName}>Open Projects Hub</span>
            </Link>
            <nav className={styles.navLinks} aria-label="Main navigation">
              <a href="#features" className={styles.navLink}>
                Product
              </a>
              <a
                href="https://github.com/NaranjoSolutions/open-projects-hub-docs"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.navLink}
              >
                Docs
              </a>
              <a
                href="https://github.com/alonsovndev"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.navLink}
              >
                GitHub
              </a>
            </nav>
          </div>
          <div className={styles.landingActions}>
            <Button type="text" href="/login" className={styles.signInButton}>
              Log In
            </Button>
            <Button type="primary" href="/role-selection" className={styles.ctaButton}>
              Get Started <ArrowRightOutlined aria-hidden="true" />
            </Button>
          </div>
          <button
            ref={mobileToggleRef}
            type="button"
            className={styles.mobileToggle}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
            aria-controls="landing-mobile-menu"
          >
            {mobileMenuOpen ? (
              <CloseOutlined aria-hidden="true" />
            ) : (
              <MenuOutlined aria-hidden="true" />
            )}
          </button>
        </div>
        {mobileMenuOpen && (
          <div id="landing-mobile-menu" className={styles.mobileMenu}>
            <nav className={styles.mobileNavLinks} aria-label="Mobile navigation">
              <a
                href="#features"
                className={styles.mobileNavLink}
                onClick={() => setMobileMenuOpen(false)}
              >
                Product
              </a>
              <a
                href="https://github.com/NaranjoSolutions/open-projects-hub-docs"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.mobileNavLink}
                onClick={() => setMobileMenuOpen(false)}
              >
                Documentation
              </a>
              <a
                href="https://github.com/alonsovndev"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.mobileNavLink}
                onClick={() => setMobileMenuOpen(false)}
              >
                GitHub
              </a>
            </nav>
            <div className={styles.mobileActions}>
              <Button type="text" href="/login" block className={styles.mobileSignInButton}>
                Log In
              </Button>
              <Button
                type="primary"
                href="/role-selection"
                block
                className={styles.mobileCtaButton}
              >
                Get Started <ArrowRightOutlined aria-hidden="true" />
              </Button>
            </div>
          </div>
        )}
      </header>
    );
  }

  return (
    <header className={styles.header}>
      <Link to="/" className={styles.brandSection}>
        <img src="/favicon.svg" alt="Open Projects Hub logo" className={styles.brandLogo} />
        <span className={styles.brandName}>Open Projects Hub</span>
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
