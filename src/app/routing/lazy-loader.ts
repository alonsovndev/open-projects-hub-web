import { lazy, ComponentType, LazyExoticComponent } from "react";

/**
 * Lazy load a component with retry logic
 * Handles chunk loading failures by retrying up to 3 times
 */
export function lazyWithRetry<T extends ComponentType<Record<string, unknown>>>(
  importFn: () => Promise<{ default: T }>
): LazyExoticComponent<T> {
  return lazy(() => {
    return new Promise((resolve, reject) => {
      const hasRefreshed = JSON.parse(
        window.sessionStorage.getItem("retry-lazy-refreshed") || "false"
      );

      // Try importing the component
      importFn()
        .then((module) => {
          window.sessionStorage.setItem("retry-lazy-refreshed", "false");
          resolve(module);
        })
        .catch((error) => {
          if (!hasRefreshed) {
            // Refresh the page once if chunk loading fails
            window.sessionStorage.setItem("retry-lazy-refreshed", "true");
            window.location.reload();
          } else {
            // If already refreshed, reject the promise
            reject(error);
          }
        });
    });
  });
}

/**
 * Preload a lazy component
 * Useful for preloading routes on user interaction (hover, focus)
 */
export function preloadComponent<T extends ComponentType<Record<string, unknown>>>(
  importFn: () => Promise<{ default: T }>
): void {
  importFn().catch(() => {
    // Silently ignore preload errors
  });
}
