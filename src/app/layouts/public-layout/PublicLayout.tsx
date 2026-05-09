import type { FC, ReactNode } from "react";

import { Footer } from "@/shared/components/layout/footer";

import styles from "./public-layout.module.scss";

interface PublicLayoutProps {
  children: ReactNode;
}

export const PublicLayout: FC<PublicLayoutProps> = ({ children }) => {
  return (
    <div className={styles.container}>
      <main className={styles.main}>{children}</main>
      <Footer />
    </div>
  );
};
