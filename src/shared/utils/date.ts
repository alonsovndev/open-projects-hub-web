/**
 * Date formatting utilities
 * Centralized date formatting to ensure consistency across the app
 */

/**
 * Format a date string to human-readable format
 * @param dateString - ISO date string or any valid date string
 * @returns Formatted date string (e.g., "Jan 15, 2024")
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Format a date string to short format (no year if current year)
 * @param dateString - ISO date string or any valid date string
 * @returns Formatted date string (e.g., "Jan 15" or "Jan 15, 2023")
 */
export function formatDateShort(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const isCurrentYear = date.getFullYear() === now.getFullYear();

  if (isCurrentYear) {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  }

  return formatDate(dateString);
}

/**
 * Format a date string to relative time (e.g., "2 hours ago", "yesterday")
 * @param dateString - ISO date string or any valid date string
 * @returns Relative time string
 */
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInSeconds = Math.floor(diffInMs / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInSeconds < 60) {
    return "just now";
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes === 1 ? "" : "s"} ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours === 1 ? "" : "s"} ago`;
  } else if (diffInDays === 1) {
    return "yesterday";
  } else if (diffInDays < 7) {
    return `${diffInDays} days ago`;
  } else {
    return formatDate(dateString);
  }
}
