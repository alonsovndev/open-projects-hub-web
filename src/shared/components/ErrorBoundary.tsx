import { Component, ReactNode, ErrorInfo } from "react";
import { Button, Result } from "antd";

import { isDev } from "@/config/env";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Error Boundary Component
 *
 * Catches JavaScript errors anywhere in the child component tree,
 * logs the errors, and displays a fallback UI.
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error to console in development
    if (isDev) {
      console.error("ErrorBoundary caught an error:", error);
      console.error("Error Info:", errorInfo);
    }

    // TODO: Send to error tracking service (e.g., Sentry)
    // logErrorToService(error, errorInfo);

    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });

    if (this.props.onReset) {
      this.props.onReset();
    } else {
      // Default: reload page
      window.location.href = "/";
    }
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div style={{ padding: "50px 24px", maxWidth: "600px", margin: "0 auto" }}>
          <Result
            status="error"
            title="Something went wrong"
            subTitle="We're sorry for the inconvenience. An unexpected error occurred."
            extra={[
              <Button type="primary" key="home" onClick={this.handleReset}>
                Go to Home
              </Button>,
              <Button key="reload" onClick={() => window.location.reload()}>
                Reload Page
              </Button>,
            ]}
          />

          {isDev && this.state.error && (
            <details style={{ marginTop: "24px", whiteSpace: "pre-wrap" }}>
              <summary style={{ cursor: "pointer", marginBottom: "12px" }}>
                <strong>Error Details (Development Only)</strong>
              </summary>
              <div
                style={{
                  background: "#f5f5f5",
                  padding: "12px",
                  borderRadius: "4px",
                  fontSize: "12px",
                  fontFamily: "monospace",
                }}
              >
                <p>
                  <strong>Error:</strong> {this.state.error.toString()}
                </p>
                {this.state.errorInfo && (
                  <p>
                    <strong>Component Stack:</strong>
                    {this.state.errorInfo.componentStack}
                  </p>
                )}
              </div>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
