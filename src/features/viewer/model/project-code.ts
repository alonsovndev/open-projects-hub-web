export const projectCodePattern = /^PRJ-\d{6}$/i;

export const normalizeProjectCode = (projectCode: string) => {
  return projectCode
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9-]/g, "");
};

export const isValidProjectCode = (projectCode: string) => {
  return projectCodePattern.test(projectCode.trim());
};
