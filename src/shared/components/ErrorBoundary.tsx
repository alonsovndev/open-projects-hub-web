import { Component, ReactNode } from "react";
import { Button, Result } from "antd";

import { isDev } from "@/config/env";

import styles from "./ErrorBoundary.module.scss";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
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
    };
  }

  static getDerivedStateFromError(): Partial<State> {
    return { hasError: true };
  }

  componentDidCatch(): void {
    if (isDev) {
      console.error("An unexpected rendering error occurred.");
    }
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
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
        <div className={styles.container}>
          <Result
            status="error"
            title="We couldn't display this page"
            subTitle="Reload the page to try again, or return to the home page."
            extra={[
              <Button type="primary" key="home" onClick={this.handleReset}>
                Go to home
              </Button>,
              <Button key="reload" onClick={() => window.location.reload()}>
                Reload page
              </Button>,
            ]}
          />
        </div>
      );
    }

    return this.props.children;
  }
}
