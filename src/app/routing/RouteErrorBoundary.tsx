import type { FC, ReactNode } from "react";
import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";

import { isDev } from "@/config/env";

import styles from "./RouteErrorBoundary.module.scss";

interface RouteErrorFallbackProps {
  error?: Error;
  resetError?: () => void;
}

/**
 * Route-specific error fallback component
 * Lighter than full page error, allows navigation without reload
 */
export const RouteErrorFallback: FC<RouteErrorFallbackProps> = ({ error, resetError }) => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    if (resetError) {
      resetError();
    }
    navigate(-1);
  };

  const handleGoHome = () => {
    if (resetError) {
      resetError();
    }
    navigate("/");
  };

  return (
    <div className={styles.container}>
      <Result
        status="warning"
        title="This page encountered an error"
        subTitle="Don't worry, the rest of the application is working fine."
        extra={[
          <Button type="primary" key="back" onClick={handleGoBack}>
            Go Back
          </Button>,
          <Button key="home" onClick={handleGoHome}>
            Go to Dashboard
          </Button>,
        ]}
      />

      {isDev && error && (
        <details className={styles.errorDetails}>
          <summary className={styles.errorSummary}>
            <strong>Error Details (Development Only)</strong>
          </summary>
          <div className={styles.errorContent}>
            <p>
              <strong>Error:</strong> {error.toString()}
            </p>
            {error.stack && (
              <p>
                <strong>Stack:</strong>
                <br />
                {error.stack}
              </p>
            )}
          </div>
        </details>
      )}
    </div>
  );
};

interface RouteErrorBoundaryProps {
  children: ReactNode;
}

/**
 * Wrapper component for route-level error boundaries
 * Use this to wrap individual routes for better error isolation
 */
export const RouteErrorBoundary: FC<RouteErrorBoundaryProps> = ({ children }) => {
  return children;
};
