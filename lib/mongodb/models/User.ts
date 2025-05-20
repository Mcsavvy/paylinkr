import mongoose, { Schema, Document, Model } from "mongoose";

export interface IApiKey extends Document {
  _id: mongoose.Types.ObjectId;
  key: string;
  secret: string;
  name?: string;
  createdAt: Date;
  lastUsed?: Date;
}

export interface IWebhook extends Document {
  _id: mongoose.Types.ObjectId;
  id: string;
  url: string;
  events: string[];
  createdAt: Date;
  lastTriggered?: Date;
}

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  walletAddress: string;
  publicKey: string;
  email?: string;
  accountType: 'personal' | 'merchant';
  createdAt: Date;
  lastLogin?: Date;
  profile?: {
    username?: string;
    avatarUrl?: string;
    notificationPreferences?: {
      paymentReceived: boolean;
      paymentExpired: boolean;
      emailNotifications: boolean;
    };
  };
  merchant?: {
    businessName?: string;
    apiKeys?: IApiKey[];
    webhooks?: IWebhook[];
  };
}

const ApiKeySchema = new Schema<IApiKey>({
  key: {
    type: String,
    required: true
  },
  secret: {
    type: String,
    required: true
  },
  name: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastUsed: Date
});

const WebhookSchema = new Schema<IWebhook>({
  id: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  events: {
    type: [String],
    default: ['payment.completed']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastTriggered: Date
});

const UserSchema = new Schema<IUser>({
  walletAddress: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  publicKey: {
    type: String,
    required: true
  },
  email: String,
  accountType: {
    type: String,
    enum: ['personal', 'merchant'],
    default: 'personal'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: Date,
  profile: {
    username: String,
    avatarUrl: String,
    notificationPreferences: {
      paymentReceived: {
        type: Boolean,
        default: true
      },
      paymentExpired: {
        type: Boolean,
        default: true
      },
      emailNotifications: {
        type: Boolean,
        default: false
      }
    }
  },
  merchant: {
    businessName: String,
    apiKeys: [ApiKeySchema],
    webhooks: [WebhookSchema]
  }
});

export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
