import type { FC } from "react";

import { HomeHero } from "@/features/home/components/HomeHero";
import { RoleSelection } from "@/features/home/components/RoleSelection";
import { Footer } from "@/components/layout/Footer";

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
