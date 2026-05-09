import type { FC } from "react";
import { Spin } from "antd";
import styles from "./route-loading.module.scss";

interface RouteLoadingProps {
  message?: string;
}

export const RouteLoading: FC<RouteLoadingProps> = ({ message = "Loading..." }) => {
  return (
    <div className={styles.container}>
      <Spin size="large" tip={message} />
    </div>
  );
};
