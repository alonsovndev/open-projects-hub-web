import type { FC } from "react";

import { RegisterForm } from "@/features/auth";

import styles from "./register.module.scss";

const RegisterPage: FC = () => {
  return (
    <div className={styles.registerPage}>
      <RegisterForm />
    </div>
  );
};

export default RegisterPage;
