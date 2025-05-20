"use client";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

export default function AuthErrorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const errorMessages: Record<string, string> = {
    Configuration: "There is a problem with the server configuration.",
    AccessDenied: "You do not have permission to sign in.",
    Verification: "The verification link was invalid or has expired.",
    CredentialsSignin: "Failed to verify wallet signature.",
    SessionRequired: "You must be signed in to access this page.",
    Default: "An unexpected error occurred.",
  };

  const errorMessage = error ? errorMessages[error] || errorMessages.Default : errorMessages.Default;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground">
      <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800">
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mb-6 text-red-500"
          >
            <AlertTriangle size={48} />
          </motion.div>
          <h1 className="text-3xl font-bold mb-2">Authentication Error</h1>
          <p className="text-muted-foreground mb-6">{errorMessage}</p>
        </div>

        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          className="w-full"
        >
          <Button
            onClick={() => router.push("/auth/signin")}
            className="w-full bg-primary text-white font-bold px-6 py-3 rounded-xl shadow-lg flex items-center justify-center gap-3"
            size="lg"
          >
            Try Again
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
