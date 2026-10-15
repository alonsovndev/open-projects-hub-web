import type { FC } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Result } from "antd";

import { usePageTitle } from "@/shared/hooks/use-page-title";

import styles from "./not-found.module.scss";

export const NotFoundPage: FC = () => {
  usePageTitle("Page Not Found");
  const navigate = useNavigate();

  return (
    <div className={styles.pageContainer}>
      <div className={styles.contentWrapper}>
        <Result
          status="404"
          title="404"
          subTitle="Sorry, the page you are looking for does not exist."
          extra={
            <Button type="primary" onClick={() => navigate("/")}>
              Go Home
            </Button>
          }
        />
      </div>
    </div>
  );
};
export default NotFoundPage;
