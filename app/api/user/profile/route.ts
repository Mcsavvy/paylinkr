import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/lib/mongodb/models/User";
import { verifyJWT } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    let walletAddress: string;
    try {
      const payload = verifyJWT(req);
      walletAddress = payload.walletAddress;
    } catch (err) {
      return NextResponse.json(
        { success: false, error: { message: "Unauthorized" } },
        { status: 401 }
      );
    }
    const user = await User.findOne({ walletAddress });
    if (!user) {
      return NextResponse.json(
        { success: false, error: { message: "User not found" } },
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
