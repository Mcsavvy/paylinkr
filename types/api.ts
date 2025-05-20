import { z } from 'zod';

export const createPayTagSchema = z.object({
  amount: z.number().positive({ message: "Amount must be positive" }),
  description: z.string().optional(),
  recipientWalletAddress: z.string().optional(),
  orderReference: z.string().optional(),
  expiresIn: z.number().int().positive().default(60 * 60 * 24 * 30), // 30 days in seconds
  callbackUrl: z.string().url().optional(),
  type: z.enum(["p2p", "merchant"]).default("p2p"),
});

export type CreatePayTagRequest = z.infer<typeof createPayTagSchema>;

export interface PayTag {
  _id: string;
  tagId: string;
  amount: number;
  description?: string;
  creatorWalletAddress: string;
  recipientWalletAddress?: string;
  orderReference?: string;
  status: 'pending' | 'paid' | 'expired' | 'cancelled';
  type: 'p2p' | 'merchant';
  callbackUrl?: string;
  expiresAt: string;
  paymentUrl: string;
  qrCodeUrl: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    details?: any;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    limit: number;
    skip: number;
  };
}
