import type { FC } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Result } from "antd";

import { usePageTitle } from "@/shared/hooks/use-page-title";

import styles from "./unauthorized.module.scss";

export const UnauthorizedPage: FC = () => {
  usePageTitle("Unauthorized");
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.contentWrapper}>
        <Result
          status="403"
          title="403"
          subTitle="Sorry, you are not authorized to access this page."
          extra={
            <>
              <Button type="primary" onClick={handleGoHome}>
                Go Home
              </Button>
              <Button onClick={handleGoBack}>Go Back</Button>
            </>
          }
        />
      </div>
    </div>
  );
};
export default UnauthorizedPage;
