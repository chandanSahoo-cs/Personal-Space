import { NextResponse } from "next/server";

export function middleware(req: Request) {
  console.log("I'm middleware");

  console.log("url: ",req.url);
  const allowedOrigins = [
    "http://localhost:3000",
    "https://personal-space-iota.vercel.app",
  ];

  const origin = req.headers.get("origin");
  const auth = req.headers.get("authorization") || "";
  console.log("origin:", origin);
  console.log("auth:", auth);
  const isValidOrigin = allowedOrigins.includes(String(origin));
  const isValidAuth = auth === `Bearer ${process.env.AUTOMATE_SECRET}`;

  if ((isValidAuth && origin === null) || isValidOrigin) {
    return NextResponse.next();
  }

  return Response.json({ error: "No, not here" }, { status: 401 });
}

export const config = {
  matcher: ["/api/:path*"],
};
