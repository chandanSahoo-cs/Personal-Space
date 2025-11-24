import { NextResponse } from "next/server";

export function middleware(req: Request) {
  const allowedOrigins = [
    "http://localhost:3000",
    "https://personal-space-iota.vercel.app",
  ];

  const origin = req.headers.get("origin");
  const auth = req.headers.get("authorization") || "";

  const isValidOrigin =
    allowedOrigins.includes(String(origin)) || origin === null;
  const isValidAuth = auth === `Bearer ${process.env.AUTOMATE_SECRET}`;

  if (isValidAuth || isValidOrigin) {
    return NextResponse.next();
  }

  return Response.json({ error: "No, not here" }, { status: 401 });
}

export const config = {
  matcher: ["/api/:path*"],
};
