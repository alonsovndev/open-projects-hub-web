const SIGNED_OUT = "open-projects-hub.signed-out";

/** Persist intent, never credentials: a failed cookie revocation must not resume on reload. */
export const markSignedOut = (): void => {
  try {
    localStorage.setItem(SIGNED_OUT, "true");
  } catch {
    /* Storage may be disabled. */
  }
};
export const clearSignOutIntent = (): void => {
  try {
    localStorage.removeItem(SIGNED_OUT);
  } catch {
    /* Storage may be disabled. */
  }
};
export const markSignInPending = (): void => {
  try {
    localStorage.setItem(SIGNED_OUT, "signing-in");
  } catch {
    /* Storage may be disabled. */
  }
};
export const hasSignOutIntent = (): boolean => {
  try {
    return localStorage.getItem(SIGNED_OUT) !== null;
  } catch {
    return true;
  }
};
export const hasPendingRevocation = (): boolean => {
  try {
    return localStorage.getItem(SIGNED_OUT) === "true";
  } catch {
    return false;
  }
};
