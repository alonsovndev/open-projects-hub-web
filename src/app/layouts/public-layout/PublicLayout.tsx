import type { FC, ReactNode } from "react";

import { Footer } from "@/shared/components/layout/footer";

import styles from "./public-layout.module.scss";

interface PublicLayoutProps {
  children: ReactNode;
  variant?: "default" | "landing";
}

export const PublicLayout: FC<PublicLayoutProps> = ({ children, variant = "default" }) => {
  return (
    <div className={`${styles.container} ${variant === "landing" ? styles.landing : ""}`}>
      <main className={styles.main}>{children}</main>
      <Footer variant={variant} />
    </div>
  );
};
