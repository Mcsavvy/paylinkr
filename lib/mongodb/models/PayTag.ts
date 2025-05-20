import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPayTag extends Document {
  tagId: string;
  stxTxId?: string;
  creatorWalletAddress: string;
  recipientWalletAddress?: string;
  amount: number;
  description?: string;
  orderReference?: string;
  createdAt: Date;
  expiresAt: Date;
  status: 'pending' | 'paid' | 'expired' | 'canceled';
  paymentTxId?: string;
  paidAt?: Date;
  paidByWalletAddress?: string;
  callbackUrl?: string;
  merchantId?: mongoose.Types.ObjectId;
  type: 'p2p' | 'merchant';
}

const PayTagSchema: Schema<IPayTag> = new Schema<IPayTag>({
  tagId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  stxTxId: {
    type: String,
    sparse: true
  },
  creatorWalletAddress: {
    type: String,
    required: true,
    index: true
  },
  recipientWalletAddress: String,
  amount: {
    type: Number,
    required: true
  },
  description: String,
  orderReference: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    required: true,
    index: true
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'expired', 'canceled'],
    default: 'pending',
    index: true
  },
  paymentTxId: String,
  paidAt: Date,
  paidByWalletAddress: String,
  callbackUrl: String,
  merchantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    sparse: true
  },
  type: {
    type: String,
    enum: ['p2p', 'merchant'],
    default: 'p2p'
  }
});

// Add TTL index for automatic expiration cleanup
PayTagSchema.index({ expiresAt: 1 }, { 
  expireAfterSeconds: 0,
  partialFilterExpression: { status: 'pending' }
});

export const PayTag: Model<IPayTag> =
  mongoose.models.PayTag || mongoose.model<IPayTag>("PayTag", PayTagSchema);
