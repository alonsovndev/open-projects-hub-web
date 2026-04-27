import { useNavigate } from "react-router-dom";

/**
 * Hook for home page navigation actions
 * Provides navigation handlers for CTAs and feature interactions
 */
export const useHomeNavigation = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    // Navigate to login/registration page
    navigate("/login");
  };

  const handleStartProject = () => {
    // Navigate to dashboard or project creation
    navigate("/dashboard");
  };

  const handleLearnMore = () => {
    // Scroll to features section or navigate to about page
    const featuresSection = document.querySelector('[data-section="features"]');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return {
    handleGetStarted,
    handleStartProject,
    handleLearnMore,
  };
};
