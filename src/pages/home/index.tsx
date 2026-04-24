import type { FC } from "react";

import { Footer } from "@/shared/components/layout/footer";
import { HomeHero } from "@/features/home/components/home-hero";
import { RoleSelection } from "@/features/home/components/role-selection";

import styles from "./home.module.scss";

export const Home: FC = () => {
  return (
    <main className={styles.pageContainer}>
      <div className={styles.mainContent}>
        <HomeHero />
        <RoleSelection />
      </div>
      <Footer />
    </main>
  );
};
