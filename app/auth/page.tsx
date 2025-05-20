"use client";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { WalletConnectButton } from "@/components/WalletConnectButton";
import { useWalletConnection } from "@/hooks/useWalletConnection";
import { useSession } from "next-auth/react";

export default function AuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";
  const { isConnected } = useWalletConnection();
  const { status } = useSession();

  useEffect(() => {
    if (isConnected && status === "authenticated") {
      router.replace(redirect);
    }
  }, [isConnected, status, redirect, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground">
      {status === "loading" ? (
        <div className="mb-6 animate-spin rounded-full border-4 border-primary border-t-transparent w-12 h-12" />
      ) : (
        <>
          <h1 className="text-2xl font-bold mb-2">Authenticate to continue</h1>
          <p className="mb-6 text-muted-foreground">
            Connect your wallet to access this page.
          </p>
          <WalletConnectButton />
        </>
      )}
    </div>
  );
}
