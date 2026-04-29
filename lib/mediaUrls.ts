const DRIVE_FILE_PATH_REGEX = /drive\.google\.com\/file\/d\/([^/]+)/i;
const DRIVE_QUERY_ID_REGEX = /[?&]id=([^&]+)/i;
const GOOGLE_CONTENT_ID_REGEX = /googleusercontent\.com\/d\/([^=/?]+)/i;

export function extractDriveFileId(value?: string | null) {
  if (!value) return "";

  const trimmed = value.trim();
  const filePathMatch = trimmed.match(DRIVE_FILE_PATH_REGEX);
  if (filePathMatch?.[1]) return filePathMatch[1];

  const queryIdMatch = trimmed.match(DRIVE_QUERY_ID_REGEX);
  if (queryIdMatch?.[1]) return queryIdMatch[1];

  const googleContentMatch = trimmed.match(GOOGLE_CONTENT_ID_REGEX);
  if (googleContentMatch?.[1]) return googleContentMatch[1];

  return "";
}

export function driveThumbnailUrl(fileId?: string | null) {
  return fileId ? `/api/media/file/${fileId}` : "";
}

export function normalizeImageUrl(url?: string | null, driveFileId?: string | null) {
  const fileId = driveFileId || extractDriveFileId(url);
  if (fileId) return driveThumbnailUrl(fileId);
  return url || "";
}
