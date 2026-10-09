import { useNavigate, useParams } from "react-router-dom";

import { useGetClientReviewQuery } from "@/features/viewer/api/viewer-api";
import { normalizeAccessCode } from "@/features/viewer/model/access-code";

const NOT_FOUND_STATUS = 404;
const RATE_LIMITED_STATUS = 429;

const errorMessageFor = (status: unknown): string => {
  if (status === NOT_FOUND_STATUS) return "We couldn't find a project with that access code.";
  if (status === RATE_LIMITED_STATUS) return "Too many attempts. Please wait and try again.";
  return "We couldn't load the project. Please try again.";
};

/** The URL is the state: `/viewer/:accessCode` is a shareable link to one project's review. */
export const useClientViewerPortal = () => {
  const { accessCode } = useParams<{ accessCode?: string }>();
  const navigate = useNavigate();

  // `currentData`, not `data`: `data` keeps the last project after the query is skipped,
  // which left the review on screen when the visitor chose "Use another code".
  const {
    currentData: review,
    isFetching,
    error,
  } = useGetClientReviewQuery(accessCode ?? "", { skip: !accessCode });

  const searchProject = (typedCode: string) => {
    navigate(`/viewer/${normalizeAccessCode(typedCode)}`);
  };

  return {
    accessCode,
    review,
    isLoading: isFetching,
    errorMessage: error ? errorMessageFor("status" in error ? error.status : undefined) : "",
    searchProject,
  };
};
