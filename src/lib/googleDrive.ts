import { google } from "googleapis";

const { client_id, client_secret } = {
  client_id: process.env.GOOGLE_CLIENT_ID!,
  client_secret: process.env.GOOGLE_CLIENT_SECRET!,
};
const token = {
  access_token: process.env.GOOGLE_ACCESS_TOKEN,
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
  scope: process.env.GOOGLE_SCOPE,
  token_type: process.env.GOOGLE_TOKEN_TYPE,
  expiry_date: parseInt(process.env.GOOGLE_TOKEN_EXPIRY || "0"),
};

const oAuth2 = new google.auth.OAuth2(client_id, client_secret);
oAuth2.setCredentials(token);

export const drive = google.drive({ version: "v3", auth: oAuth2 });

export async function getDrivePreviewUrl(
  fileId: string
): Promise<string | null> {
  try {
    const res = await drive.files.get({
      fileId,
      fields: "id, name, mimeType, webViewLink, webContentLink",
    });

    return res.data.webViewLink ?? null;
  } catch (error) {
    console.error("Failed to fetch preview URL:", error);
    return null;
  }
}
