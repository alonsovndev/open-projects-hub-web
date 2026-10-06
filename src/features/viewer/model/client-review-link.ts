/** The link a freelancer shares with their client: the Client Review page for one access code. */
export const buildClientReviewUrl = (accessCode: string) =>
  `${window.location.origin}/viewer/${encodeURIComponent(accessCode)}`;
