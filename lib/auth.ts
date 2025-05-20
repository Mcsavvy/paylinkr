import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "changeme";

export function verifyJWT(req: NextRequest): { walletAddress: string } {
  const token = req.cookies.get("paylinkr_jwt")?.value;
  if (!token) throw new Error("No JWT provided");
  try {
    return jwt.verify(token, JWT_SECRET) as { walletAddress: string };
  } catch (err) {
    throw new Error("Invalid or expired JWT");
  }
}

export function redirectToAuth(req: NextRequest): NextResponse {
  const url = req.nextUrl.clone();
  url.pathname = "/auth";
  url.searchParams.set("redirect", req.nextUrl.pathname + req.nextUrl.search);
  return NextResponse.redirect(url);
}
