import type { FC } from "react";

import { AppHeader } from "@/shared/components/layout/app-header";
import { HomeHero } from "@/features/home/components/home-hero";
import { HomeFeaturesSection } from "@/features/home/components/home-features-section";
import { HomeInfoGrid } from "@/features/home/components/home-info-grid";
import { HomeCtaSection } from "@/features/home/components/home-cta-section";

import styles from "./home.module.scss";

export const Home: FC = () => {
  return (
    <div className={styles.pageContainer}>
      <AppHeader variant="landing" />
      <main className={styles.mainContent}>
        <HomeHero />
        <HomeFeaturesSection />
        <HomeInfoGrid />
        <HomeCtaSection />
      </main>
    </div>
  );
};
export default Home;
