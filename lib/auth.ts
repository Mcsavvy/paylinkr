import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { verifyMessageSignatureRsv } from "@stacks/encryption";
import connectToDatabase from "@/lib/mongodb";
import { User, IUser } from "@/lib/mongodb/models/User";
import { Session } from "@/lib/mongodb/models/Session";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "stacks-wallet",
      name: "Stacks Wallet",
      credentials: {
        walletAddress: { label: "Wallet Address", type: "text" },
        signedMessage: { label: "Signed Message", type: "text" },
        message: { label: "Message", type: "text" },
        publicKey: { label: "Public Key", type: "text" },
      },
      // @ts-expect-error ...
      async authorize(credentials) {
        if (!credentials) {
          console.error("No credentials provided");
          return null;
        }

        const { walletAddress, publicKey, signedMessage, message } =
          credentials;

        if (!walletAddress || !publicKey || !signedMessage || !message) {
          console.error("Missing required credentials:", {
            hasWalletAddress: !!walletAddress,
            hasPublicKey: !!publicKey,
            hasSignedMessage: !!signedMessage,
            hasMessage: !!message,
          });
          return null;
        }

        try {
          console.log("=== Starting Signature Verification ===");
          console.log("Raw message:", JSON.stringify(message));
          console.log("Signature length:", signedMessage?.length);
          console.log("Public Key length:", publicKey?.length);

          // Ensure the message is a string and clean it
          const messageString =
            typeof message === "string" ? message : JSON.stringify(message);

          // Verify the signature
          console.log("Verifying signature...");
          const isValid = verifyMessageSignatureRsv({
            message: messageString,
            signature: signedMessage,
            publicKey: publicKey,
          });

          console.log("Verification result:", isValid);

          if (!isValid) {
            const errorMessage =
              "Invalid message signature. The signature verification failed. Please try again.";
            console.error("❌", errorMessage);
            console.error("Verification failed. Possible reasons:");
            console.error("- The message was modified after signing");
            console.error("- The signature is malformed");
            console.error("- The public key does not match the signer");
            throw new Error(errorMessage);
          }

          // Additional logging and validation
          console.log("Message verification successful");
          console.log("Wallet address:", walletAddress);
          console.log("Public key:", publicKey);
          console.log("Signed message:", signedMessage);
          console.log("Message:", message);

          // Connect to the database
          await connectToDatabase();
          // Check if user exists or create a new one
          try {
            await connectToDatabase();

            let user = await User.findOne({ walletAddress });

            if (!user) {
              user = new User({
                walletAddress,
                publicKey,
                name: `User-${walletAddress.slice(0, 6)}`,
                role: "user",
                createdAt: new Date(),
                updatedAt: new Date(),
              });
              await user.save();
            } else if (user.publicKey !== publicKey) {
              // Update public key if it has changed
              user.publicKey = publicKey;
              await user.save();
            }

            // Update last login time
            user.lastLogin = new Date();
            await user.save();

            return user
              ? {
                  id: user._id.toString(),
                  walletAddress: user.walletAddress,
                  publicKey: user.publicKey,
                  accountType: user.accountType,
                  email: user.email,
                  profile: user.profile,
                  merchant: user.merchant,
                }
              : null;
          } catch (dbError) {
            console.error("❌ Database error:", dbError);
            throw new Error("Failed to process user data. Please try again.");
          }
        } catch (error) {
          console.error("Authentication error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    // @ts-expect-error ...
    async jwt({ token, user }: { token: any; user?: IUser }) {
      if (user) {
        token.walletAddress = user.walletAddress;
        token.accountType = user.accountType;
        token.publicKey = user.publicKey;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      session.user.id = token.sub;
      session.user.walletAddress = token.walletAddress;
      session.user.accountType = token.accountType;
      session.user.publicKey = token.publicKey;
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  secret: process.env.NEXTAUTH_SECRET,
  adapter: {
    // Custom adapter for MongoDB Session storage
    async createSession({
      sessionToken,
      userId,
      expires,
    }: {
      sessionToken: string;
      userId: string;
      expires: Date;
    }) {
      await connectToDatabase();

      const user = (await User.findById(userId)) as IUser | null;

      if (!user) {
        throw new Error("User not found");
      }

      const session = await Session.create({
        userId: userId.toString(),
        walletAddress: user.walletAddress as string,
        sessionToken,
        expiresAt: expires,
        isValid: true,
      });

      return {
        id: session._id.toString(),
        sessionToken: session.sessionToken,
        userId: session.userId.toString(),
        expires: session.expiresAt,
      };
    },
    // @ts-expect-error ...
    async getSessionAndUser(sessionToken: string) {
      await connectToDatabase();

      const session = await Session.findOne({
        sessionToken,
        isValid: true,
        expiresAt: { $gt: new Date() },
      });

      if (!session) return null;

      const user = await User.findById(session.userId);

      if (!user) return null;

      return {
        session: {
          id: session._id.toString(),
          sessionToken: session.sessionToken,
          userId: session.userId.toString(),
          expires: session.expiresAt,
        },
        user: {
          id: user._id.toString(),
          walletAddress: user.walletAddress,
          accountType: user.accountType,
        },
      };
    },
    // @ts-expect-error ...
    async updateSession({
      sessionToken,
      expires,
      userId,
    }: {
      sessionToken: string;
      expires: Date;
      userId: string;
    }) {
      await connectToDatabase();

      const updatedSession = await Session.findOneAndUpdate(
        { sessionToken },
        { expiresAt: expires, userId },
        { new: true }
      );

      if (!updatedSession) return null;

      return {
        id: updatedSession._id.toString(),
        sessionToken: updatedSession.sessionToken,
        userId: updatedSession.userId.toString(),
        expires: updatedSession.expiresAt,
      };
    },
    async deleteSession(sessionToken: string) {
      await connectToDatabase();
      await Session.findOneAndUpdate({ sessionToken }, { isValid: false });
      return;
    },
  },
};
