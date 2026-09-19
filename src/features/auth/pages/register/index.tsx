import type { FC } from "react";

import { RegisterForm } from "@/features/auth";
import { usePageTitle } from "@/shared/hooks/use-page-title";

import styles from "./register.module.scss";

const RegisterPage: FC = () => {
  usePageTitle("Register");

  return (
    <div className={styles.registerPage}>
      <RegisterForm />
    </div>
  );
};

export default RegisterPage;
