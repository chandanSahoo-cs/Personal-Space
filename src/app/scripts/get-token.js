import fs from "fs";
import { google } from "googleapis";
import readline from "readline";

const SCOPES = ["https://www.googleapis.com/auth/drive.file"];
const CREDENTIALS = {
  client_id: process.env.GOOGLE_CLIENT_ID,
  client_secret: process.env.GOOGLE_CLIENT_SECRET,
  redirect_uri: ["http://localhost:3000"],
};

const oAuth2Client = new google.auth.OAuth2(
  CREDENTIALS.client_id,
  CREDENTIALS.client_secret,
  CREDENTIALS.redirect_uri
);

const authUrl = oAuth2Client.generateAuthUrl({
  access_type: "offline",
  response_type: "code",
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
  fs.writeFileSync("google-token.json", JSON.stringify(tokens, null, 2));
  console.log("Token saved to google-token.json");
});
