import React from "react";
import { HeroSection } from "../../features/home/components/HeroSection";
import { RoleSelection } from "../../features/home/components/RoleSelection";
import { Footer } from "../../shared/components/Footer";
import styles from "./Home.module.scss";

export const Home: React.FC = () => {
  return (
    <main className={styles.pageContainer}>
      <div className={styles.mainContent}>
        <HeroSection />
        <RoleSelection />
      </div>
      <Footer />
    </main>
  );
};
