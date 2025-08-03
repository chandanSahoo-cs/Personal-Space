import qrcode from "qrcode";
import speakeasy from "speakeasy";

const secret = speakeasy.generateSecret({ name: process.env.TOTP_NAME });

console.log("Base32 Secret:", secret.base32);

qrcode.toString(secret.otpauth_url, { type: "terminal" }, (err, qr) => {
  console.log("Scan this QR with google authenticator :\n", qr);
});
