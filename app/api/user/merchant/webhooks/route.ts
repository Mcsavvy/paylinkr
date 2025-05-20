import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/mongodb";
import { User } from "@/lib/mongodb/models/User";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

// Valid webhook event types
const VALID_WEBHOOK_EVENTS = [
  "payment.completed",
  "payment.failed",
  "payment.expired",
  "payment.created",
  "paytag.created",
] as const;

// Schema for creating a new webhook
const webhookCreationSchema = z.object({
  url: z.string().url({ message: "Valid webhook URL is required" }),
  events: z
    .array(z.enum(VALID_WEBHOOK_EVENTS))
    .min(1, { message: "At least one event is required" }),
});

// Schema for updating a webhook
const webhookUpdateSchema = z.object({
  id: z.string({ required_error: "Webhook ID is required" }),
  url: z.string().url({ message: "Valid webhook URL is required" }).optional(),
  events: z
    .array(z.enum(VALID_WEBHOOK_EVENTS))
    .min(1, { message: "At least one event is required" })
    .optional(),
});

export type WebhookCreationRequest = z.infer<typeof webhookCreationSchema>;
export type WebhookUpdateRequest = z.infer<typeof webhookUpdateSchema>;

// GET handler to retrieve webhooks
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.walletAddress) {
      return NextResponse.json(
        { success: false, error: { message: "Unauthorized" } },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const user = await User.findOne({
      walletAddress: session.user.walletAddress,
      accountType: "merchant",
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: { message: "Merchant account not found" } },
        { status: 404 }
      );
    }

    const webhooks = user.merchant?.webhooks || [];

    return NextResponse.json({
      success: true,
      data: {
        webhooks,
      },
    });
  } catch (error: any) {
    console.error("Error fetching webhooks:", error);

    return NextResponse.json(
      {
        success: false,
        error: { message: "Failed to fetch webhooks", details: error.message },
      },
      { status: 500 }
    );
  }
}

// POST handler to create a new webhook
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
    const validationResult = webhookCreationSchema.safeParse(body);

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

    // Find the user
    const user = await User.findOne({
      walletAddress: session.user.walletAddress,
      accountType: "merchant",
    });

    if (!user || !user.merchant) {
      return NextResponse.json(
        { success: false, error: { message: "Merchant account not found" } },
        { status: 404 }
      );
    }

    // Create new webhook
    const newWebhook = {
      id: uuidv4(),
      url: data.url,
      events: data.events,
      createdAt: new Date(),
    };

    // Add webhook to user
    if (!user.merchant.webhooks) {
      // @ts-expect-error ...
      user.merchant.webhooks = [newWebhook];
    } else {
      // @ts-expect-error ...
      user.merchant.webhooks.push(newWebhook);
    }

    await user.save();

    return NextResponse.json({
      success: true,
      data: {
        webhook: newWebhook,
        message: "Webhook created successfully",
      },
    });
  } catch (error: any) {
    console.error("Error creating webhook:", error);

    return NextResponse.json(
      {
        success: false,
        error: { message: "Failed to create webhook", details: error.message },
      },
      { status: 500 }
    );
  }
}

// PATCH handler to update a webhook
export async function PATCH(req: NextRequest) {
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
    const validationResult = webhookUpdateSchema.safeParse(body);

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

    // Find the user
    const user = await User.findOne({
      walletAddress: session.user.walletAddress,
      accountType: "merchant",
    });

    if (!user || !user.merchant || !user.merchant.webhooks) {
      return NextResponse.json(
        { success: false, error: { message: "Merchant account not found" } },
        { status: 404 }
      );
    }

    // Find the webhook by ID
    const webhookIndex = user.merchant.webhooks.findIndex(
      (webhook) => webhook.id === data.id
    );

    if (webhookIndex === -1) {
      return NextResponse.json(
        { success: false, error: { message: "Webhook not found" } },
        { status: 404 }
      );
    }

    // Update webhook
    if (data.url) {
      user.merchant.webhooks[webhookIndex].url = data.url;
    }

    if (data.events) {
      user.merchant.webhooks[webhookIndex].events = data.events;
    }

    await user.save();

    return NextResponse.json({
      success: true,
      data: {
        webhook: user.merchant.webhooks[webhookIndex],
        message: "Webhook updated successfully",
      },
    });
  } catch (error: any) {
    console.error("Error updating webhook:", error);

    return NextResponse.json(
      {
        success: false,
        error: { message: "Failed to update webhook", details: error.message },
      },
      { status: 500 }
    );
  }
}

// DELETE handler to remove a webhook
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.walletAddress) {
      return NextResponse.json(
        { success: false, error: { message: "Unauthorized" } },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const webhookId = searchParams.get("id");

    if (!webhookId) {
      return NextResponse.json(
        { success: false, error: { message: "Webhook ID is required" } },
        { status: 400 }
      );
    }

    // Connect to the database
    await connectToDatabase();

    // Find the user
    const user = await User.findOne({
      walletAddress: session.user.walletAddress,
      accountType: "merchant",
    });

    if (!user || !user.merchant || !user.merchant.webhooks) {
      return NextResponse.json(
        { success: false, error: { message: "Merchant account not found" } },
        { status: 404 }
      );
    }

    // Find the webhook by ID
    const webhookIndex = user.merchant.webhooks.findIndex(
      (webhook) => webhook.id === webhookId
    );

    if (webhookIndex === -1) {
      return NextResponse.json(
        { success: false, error: { message: "Webhook not found" } },
        { status: 404 }
      );
    }

    // Remove the webhook
    user.merchant.webhooks.splice(webhookIndex, 1);
    await user.save();

    return NextResponse.json({
      success: true,
      data: {
        message: "Webhook removed successfully",
      },
    });
  } catch (error: any) {
    console.error("Error removing webhook:", error);

    return NextResponse.json(
      {
        success: false,
        error: { message: "Failed to remove webhook", details: error.message },
      },
      { status: 500 }
    );
  }
}
