import { useEffect } from "react";

/**
 * Hook to dynamically set the page title
 * @param title - The page-specific title (will be prefixed with app name)
 */
export const usePageTitle = (title: string): void => {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = `${title} | Open Projects Hub`;

    return () => {
      document.title = prevTitle;
    };
  }, [title]);
};
