import speakeasy from "speakeasy";

export async function POST(req: Request) {
  const body = await req.json();
  const token = body.token;

  if (typeof token !== "string") {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }

  const secret = process.env.TOTP_SECRET;

  if (!secret) {
    return Response.json({ error: "Server misconfiguration" }, { status: 500 });
  }

  const isValid = speakeasy.totp.verify({
    secret: process.env.TOTP_SECRET!,
    encoding: "base32",
    token,
    window: 1,
  });

  if (isValid) {
    return Response.json({ valid: true }, { status: 200 });
  } else {
    return Response.json({ valid: false }, { status: 401 });
  }
}
