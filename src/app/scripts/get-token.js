import "dotenv/config";
import fs from "fs";
import { google } from "googleapis";
import readline from "readline";

const SCOPES = ["https://www.googleapis.com/auth/drive.file"];
const CREDENTIALS = {
  client_id: process.env.GOOGLE_CLIENT_ID,
  client_secret: process.env.GOOGLE_CLIENT_SECRET,
  redirect_uri: "http://localhost:3000",
};

const oAuth2Client = new google.auth.OAuth2(
  CREDENTIALS.client_id,
  CREDENTIALS.client_secret,
  CREDENTIALS.redirect_uri
);

const authUrl = oAuth2Client.generateAuthUrl({
  access_type: "offline",
  prompt: "consent", // ensures refresh_token is returned every time
  scope: SCOPES,
});
console.log("Authorize this app by visiting this URL:\n", authUrl);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
rl.question("\nEnter the code from that page here: ", async (code) => {
  rl.close();
  const { tokens } = await oAuth2Client.getToken(code);

  // Save only refresh_token for reuse
  if (tokens.refresh_token) {
    fs.writeFileSync(
      "google-token.json",
      JSON.stringify({ refresh_token: tokens.refresh_token }, null, 2)
    );
    console.log("Refresh token saved to google-token.json");
  } else {
    console.error(
      "No refresh_token received. Try adding `prompt=consent` in generateAuthUrl."
    );
  }
});
