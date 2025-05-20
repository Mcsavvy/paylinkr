import 'next-auth';
import { IUser } from '@/lib/mongodb/models/User';

declare module 'next-auth' {
  /**
   * Extend the built-in session types
   */
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      walletAddress?: string;
      accountType?: string;
    };
  }

  /**
   * Extend the built-in user types
   */
  interface User extends IUser {
  }
}

declare module 'next-auth/jwt' {
  /** Extend the built-in JWT types */
  interface JWT {
    id: string;
    walletAddress?: string;
    accountType?: string;
    publicKey?: string;
  }
}
