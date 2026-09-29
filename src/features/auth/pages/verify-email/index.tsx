import type { FC } from "react";

import { VerifyEmailForm } from "@/features/auth";
import { usePageTitle } from "@/shared/hooks/use-page-title";

import styles from "./verify-email.module.scss";

const VerifyEmailPage: FC = () => {
  usePageTitle("Verify Email");
  return (
    <div className={styles.verifyEmailPage}>
      <VerifyEmailForm />
    </div>
  );
};

export default VerifyEmailPage;
