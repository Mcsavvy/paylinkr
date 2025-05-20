import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISession extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  walletAddress: string;
  sessionToken: string;
  createdAt: Date;
  expiresAt: Date;
  isValid: boolean;
}

const SessionSchema: Schema<ISession> = new Schema<ISession>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  walletAddress: {
    type: String,
    required: true
  },
  sessionToken: {
    type: String,
    unique: true,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  isValid: {
    type: Boolean,
    default: true
  }
});

// Add TTL index for automatic session cleanup
SessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const Session: Model<ISession> =
  mongoose.models.Session || mongoose.model<ISession>("Session", SessionSchema);
