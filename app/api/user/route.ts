import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/lib/mongodb/models/User";
import jwt from "jsonwebtoken";

const userSchema = z.object({
  walletAddress: z.string().min(1),
  username: z.string().optional(),
  email: z.string().email().optional(),
  avatar: z.string().url().optional(),
  bio: z.string().optional(),
});

const JWT_SECRET = process.env.JWT_SECRET || "changeme";
const JWT_EXPIRES_IN = "7d";

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const parsed = userSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: { message: "Invalid input", code: "INVALID_INPUT" },
        },
        { status: 400 }
      );
    }
    const { walletAddress, ...profile } = parsed.data;
    const user = await User.findOneAndUpdate(
      { walletAddress },
      { $set: profile },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    // Issue JWT
    const token = jwt.sign({ walletAddress }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });
    const response = NextResponse.json({ success: true, data: user, token });
    response.cookies.set("paylinkr_jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
    return response;
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { message: error.message } },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const walletAddress = searchParams.get("walletAddress");
    if (!walletAddress) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: "walletAddress is required",
            code: "MISSING_WALLET_ADDRESS",
          },
        },
        { status: 400 }
      );
    }
    const user = await User.findOne({ walletAddress });
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: { message: "User not found", code: "USER_NOT_FOUND" },
        },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: user });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { message: error.message } },
      { status: 500 }
    );
  }
}
