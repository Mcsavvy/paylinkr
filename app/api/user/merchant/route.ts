 import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import { User } from '@/models';

type MerchantStatus = 'active' | 'pending' | 'inactive' | 'suspended' | 'rejected';

interface MerchantData {
  businessName: string;
  businessEmail: string;
  website?: string;
  status?: MerchantStatus;
  isVerified?: boolean;
}

// GET /api/user/merchant - Get merchant profile
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectToDatabase();
    
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // If user is not a merchant, return empty data
    if (!user.merchant) {
      return NextResponse.json({
        success: true,
        data: null,
      });
    }

    return NextResponse.json({
      success: true,
      data: user.merchant,
    });
  } catch (error) {
    console.error('Error fetching merchant profile:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/user/merchant - Create or update merchant profile
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const data: MerchantData = await request.json();
    const { businessName, businessEmail, website } = data;

    // Basic validation
    if (!businessName || !businessEmail) {
      return NextResponse.json(
        { success: false, message: 'Business name and email are required' },
        { status: 400 }
      );
    }

    await connectToDatabase();
    
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Prepare merchant data
    const merchantData: MerchantData = {
      businessName,
      businessEmail,
      website,
      status: 'pending', // Default status for new applications
      isVerified: false,
    };

    // Update or create merchant profile
    const updatedUser = await User.findOneAndUpdate(
      { email: session.user.email },
      { 
        $set: { 
          merchant: merchantData,
          updatedAt: new Date(),
        },
        $setOnInsert: { createdAt: new Date() },
      },
      { new: true, upsert: true, runValidators: true }
    );

    return NextResponse.json({
      success: true,
      data: updatedUser.merchant,
      message: user.merchant ? 'Merchant profile updated' : 'Merchant application submitted',
    });
  } catch (error) {
    console.error('Error updating merchant profile:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update merchant profile' },
      { status: 500 }
    );
  }
}