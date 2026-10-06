/**
 * The project access code a client stakeholder types: `PRJ-` plus 8 characters.
 *
 * The API generates these from A-Z and 2-9 without I and O, so a code read aloud or off a
 * screenshot cannot be mistyped as a look-alike. This is not the freelancer-chosen project code.
 */
export const accessCodePattern = /^PRJ-[A-HJ-NP-Z2-9]{8}$/;

export const normalizeAccessCode = (accessCode: string) => accessCode.trim().toUpperCase();

export const isValidAccessCode = (accessCode: string) =>
  accessCodePattern.test(normalizeAccessCode(accessCode));
