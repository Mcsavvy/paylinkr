import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/mongodb";
import { PayTag } from "@/lib/mongodb/models/PayTag";
import { User } from "@/lib/mongodb/models/User";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

// Schema for creating a new pay tag
const createPayTagSchema = z.object({
  amount: z.number().positive({ message: "Amount must be positive" }),
  description: z.string().optional(),
  recipientWalletAddress: z.string().optional(),
  orderReference: z.string().optional(),
  expiresIn: z
    .number()
    .int()
    .positive()
    .default(60 * 60 * 24 * 30), // 30 days in seconds
  callbackUrl: z.string().url().optional(),
  type: z.enum(["p2p", "merchant"]).default("p2p"),
});

export type CreatePayTagRequest = z.infer<typeof createPayTagSchema>;

// GET handler to retrieve user's tags
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.walletAddress) {
      return NextResponse.json(
        { success: false, error: { message: "Unauthorized" } },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");
    const status = searchParams.get("status");
    const limit = parseInt(searchParams.get("limit") || "50");
    const skip = parseInt(searchParams.get("skip") || "0");

    await connectToDatabase();

    // Build query
    const query: Record<string, any> = {
      creatorWalletAddress: session.user.walletAddress,
    };

    if (type) {
      query.type = type;
    }

    if (status) {
      query.status = status;
    }

    const tags = await PayTag.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    const count = await PayTag.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: {
        tags,
        pagination: {
          total: count,
          limit,
          skip,
        },
      },
    });
  } catch (error: any) {
    console.error("Error fetching tags:", error);

    return NextResponse.json(
      {
        success: false,
        error: { message: "Failed to fetch tags", details: error.message },
      },
      { status: 500 }
    );
  }
}

// POST handler to create a new tag
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.walletAddress) {
      return NextResponse.json(
        { success: false, error: { message: "Unauthorized" } },
        { status: 401 }
      );
    }

    const body = await req.json();

    // Validate request body
    const validationResult = createPayTagSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: "Invalid request data",
            details: validationResult.error.format(),
          },
        },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    // Connect to the database
    await connectToDatabase();

    // If merchant type, verify user is a merchant
    if (data.type === "merchant") {
      const user = await User.findOne({
        walletAddress: session.user.walletAddress,
      });

      if (!user || user.accountType !== "merchant") {
        return NextResponse.json(
          {
            success: false,
            error: { message: "Merchant account required for merchant tags" },
          },
          { status: 403 }
        );
      }

      // Add merchantId to the tag
      // @ts-ignore
      data.merchant = user._id;
    }

    // Calculate expiration date
    const expiresAt = new Date();
    expiresAt.setSeconds(expiresAt.getSeconds() + data.expiresIn);

    // Create the new tag
    const newTag = new PayTag({
      tagId: uuidv4(),
      creatorWalletAddress: session.user.walletAddress,
      recipientWalletAddress: data.recipientWalletAddress,
      amount: data.amount,
      description: data.description,
      orderReference: data.orderReference,
      callbackUrl: data.callbackUrl,
      createdAt: new Date(),
      expiresAt,
      status: "pending",
      type: data.type,
    });

    await newTag.save();

    return NextResponse.json({
      success: true,
      data: {
        tag: newTag,
      },
    });
  } catch (error: any) {
    console.error("Error creating tag:", error);

    return NextResponse.json(
      {
        success: false,
        error: { message: "Failed to create tag", details: error.message },
      },
      { status: 500 }
    );
  }
}
