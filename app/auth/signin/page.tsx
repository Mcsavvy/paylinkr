"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { showConnect, UserSession, AppConfig } from "@stacks/connect";
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { request } from '@stacks/connect';

const appDetails = {
  name: "Paylinkr",
  icon:
    typeof window !== "undefined"
      ? window.location.origin + "/logo.png"
      : "/logo.png",
};

const appConfig = new AppConfig(["store_write", "publish_data"]);
const userSession = new UserSession({ appConfig });

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const error = searchParams.get("error");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (error) {
      toast.error(
        error === "CredentialsSignin"
          ? "Failed to verify wallet signature"
          : `Authentication error: ${error}`
      );
    }
  }, [error]);

  const handleConnect = async () => {
    setLoading(true);
    
    showConnect({
      appDetails,
      userSession,
      onFinish: async () => {
        try {
          if (userSession.isUserSignedIn()) {
            const userData = userSession.loadUserData();
            const walletAddress =
              userData.profile.stxAddress?.mainnet ||
              userData.profile.stxAddress?.testnet ||
              null;
              
            if (!walletAddress) {
              throw new Error("No wallet address found");
            }
            
            // Generate a simple message for signing
            const nonce = Math.random().toString(36).substring(2, 15);
            const timestamp = Date.now();
            const message = `Sign this message to authenticate with Paylinkr at ${window.location.hostname} (${nonce}) at ${new Date(timestamp).toISOString()}`;
            
            console.log('Message to sign:', message);
            console.log('Nonce:', nonce);
            console.log('Timestamp:', timestamp);
            
            try {
              // Request signature from the user
              const { signature, publicKey } = await request('stx_signMessage', {
                message,
              });
              
              if (!signature || !publicKey) {
                throw new Error("Failed to get signature or public key");
              }
              
              console.log('Received signature:', signature);
              console.log('Public key:', publicKey);
              
              // Verify the signature format
              if (typeof signature !== 'string' || signature.length < 10) {
                throw new Error('Invalid signature format received');
              }
              
                if (typeof publicKey !== 'string' || publicKey.length < 10) {
                throw new Error('Invalid public key format received');
              }
              
              // Sign in with NextAuth
              const result = await signIn("stacks-wallet", {
                walletAddress,
                publicKey,
                signedMessage: signature,
                message,
                redirect: false,
              });
              
              if (result?.error) {
                // Redirect to error page with the error message
                router.push(`/auth/error?error=${encodeURIComponent(result.error)}`);
                return;
              }
              
              // Redirect on success
              router.push(callbackUrl);
            } catch (error: any) {
              console.error('Error during authentication:', error);
              toast.error(error.message || 'Authentication failed');
              setLoading(false);
            }
          }
        } catch (error: any) {
          toast.error(error.message || "Failed to authenticate");
          setLoading(false);
        }
      },
      onCancel: () => {
        setLoading(false);
      },
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground">
      <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Sign In</h1>
          <p className="text-muted-foreground mb-6">
            Connect your Stacks wallet to continue
          </p>
        </div>

        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{
            scale: 1.04,
            boxShadow: "0 4px 32px 0 rgba(255, 186, 73, 0.15)",
          }}
          whileTap={{ scale: 0.97 }}
          className="w-full"
        >
          <Button
            onClick={handleConnect}
            disabled={loading}
            className="w-full group bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-500 text-white font-bold px-6 py-3 rounded-xl shadow-lg flex items-center justify-center gap-3 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-yellow-400"
            size="lg"
          >
            <Wallet className="w-6 h-6" />
            <AnimatePresence mode="wait">
              <motion.span
                key="connect"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
              >
                {loading ? "Connecting..." : "Connect Wallet"}
              </motion.span>
            </AnimatePresence>
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
