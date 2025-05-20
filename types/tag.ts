export interface Tag {
  _id: string;
  tagId: string;
  amount: number;
  description?: string;
  creatorWalletAddress: string;
  recipientWalletAddress?: string;
  orderReference?: string;
  status: 'active' | 'inactive' | 'paid' | 'expired';
  type: 'p2p' | 'merchant';
  callbackUrl?: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
  paymentUrl: string;
  qrCodeUrl: string;
}

export interface CreateTagData {
  amount: number;
  description?: string;
  recipientWalletAddress?: string;
  orderReference?: string;
  expiresIn?: number;
  callbackUrl?: string;
  type?: 'p2p' | 'merchant';
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
  };
}
