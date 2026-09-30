const MAX_INITIALS = 6;
const SINGLE_WORD_LENGTH = 4;
const MIN_CODE_LENGTH = 2;

export const generateProjectCode = (projectName: string): string => {
  const words = projectName
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toUpperCase()
    .split(/[^A-Z0-9]+/)
    .filter(Boolean);

  const code =
    words.length > 1
      ? words
          .map((word) => word[0])
          .join("")
          .slice(0, MAX_INITIALS)
      : (words[0] ?? "").slice(0, SINGLE_WORD_LENGTH);

  return code.length >= MIN_CODE_LENGTH ? code : "";
};
