import jwt from "jsonwebtoken";

const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_DRIVE_UPLOAD_URL = "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&supportsAllDrives=true";
const GOOGLE_DRIVE_PERMISSIONS_URL = "https://www.googleapis.com/drive/v3/files";
const GOOGLE_DRIVE_FILE_URL = "https://www.googleapis.com/drive/v3/files";

const clientEmail = process.env.GOOGLE_DRIVE_CLIENT_EMAIL;
const privateKey = process.env.GOOGLE_DRIVE_PRIVATE_KEY?.replace(/\\n/g, "\n");
const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;

function requireDriveConfig() {
  if (!clientEmail || !privateKey || !folderId) {
    throw new Error("Google Drive environment variables are not fully configured.");
  }

  return { clientEmail, privateKey, folderId };
}

async function getAccessToken() {
  const { clientEmail: email, privateKey: key } = requireDriveConfig();
  const now = Math.floor(Date.now() / 1000);
  const assertion = jwt.sign(
    {
      iss: email,
      scope: "https://www.googleapis.com/auth/drive",
      aud: GOOGLE_TOKEN_URL,
      exp: now + 3600,
      iat: now,
    },
    key,
    { algorithm: "RS256" }
  );

  const response = await fetch(GOOGLE_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Unable to authenticate with Google Drive. ${details}`);
  }

  const data = (await response.json()) as { access_token: string };
  return data.access_token;
}

export async function uploadFileToDrive(file: File, options?: { folderName?: string }) {
  const { folderId: rootFolderId } = requireDriveConfig();
  const accessToken = await getAccessToken();
  const bytes = Buffer.from(await file.arrayBuffer());
  const metadata = {
    name: file.name,
    parents: [rootFolderId],
    ...(options?.folderName ? { description: options.folderName } : {}),
  };

  const boundary = `aquatech-${crypto.randomUUID()}`;
  const metadataPart =
    `--${boundary}\r\n` +
    "Content-Type: application/json; charset=UTF-8\r\n\r\n" +
    `${JSON.stringify(metadata)}\r\n`;
  const fileHeader =
    `--${boundary}\r\n` +
    `Content-Type: ${file.type || "application/octet-stream"}\r\n\r\n`;
  const footer = `\r\n--${boundary}--`;

  const body = Buffer.concat([
    Buffer.from(metadataPart, "utf8"),
    Buffer.from(fileHeader, "utf8"),
    bytes,
    Buffer.from(footer, "utf8"),
  ]);

  const uploadResponse = await fetch(GOOGLE_DRIVE_UPLOAD_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": `multipart/related; boundary=${boundary}`,
    },
    body,
  });

  if (!uploadResponse.ok) {
    const details = await uploadResponse.text();
    throw new Error(`Unable to upload file to Google Drive. ${details}`);
  }

  const uploaded = (await uploadResponse.json()) as { id: string; name: string };

  const permissionResponse = await fetch(`${GOOGLE_DRIVE_PERMISSIONS_URL}/${uploaded.id}/permissions?supportsAllDrives=true`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      role: "reader",
      type: "anyone",
    }),
  });

  if (!permissionResponse.ok) {
    const details = await permissionResponse.text();
    throw new Error(`File uploaded but could not be shared publicly. ${details}`);
  }

  return {
    id: uploaded.id,
    url: `https://drive.google.com/thumbnail?id=${uploaded.id}&sz=w2000`,
    viewUrl: `https://drive.google.com/file/d/${uploaded.id}/view`,
  };
}

export async function fetchDriveFile(fileId: string) {
  const accessToken = await getAccessToken();
  const response = await fetch(`${GOOGLE_DRIVE_FILE_URL}/${fileId}?alt=media&supportsAllDrives=true`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Unable to fetch file from Google Drive. ${details}`);
  }

  return response;
}
