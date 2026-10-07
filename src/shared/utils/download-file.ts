/**
 * Hands a Blob to the browser as a file download.
 *
 * The object URL is revoked immediately after the click: the browser has already taken
 * ownership of the download by then, and leaving it alive pins the blob in memory for the
 * lifetime of the page.
 */
export const downloadBlob = (blob: Blob, filename: string): void => {
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = objectUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(objectUrl);
};
