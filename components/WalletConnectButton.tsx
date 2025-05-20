"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useWalletConnection } from "@/hooks/useWalletConnection";
import { motion } from "framer-motion";
import { Wallet, User, Copy, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function WalletConnectButton() {
  const { isConnected, address, loading } = useWalletConnection();
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleSignOut = async () => {
    try {
      await signOut({ redirect: false });
      window.location.href = '/'; // Redirect to home after sign out
      toast.success("Successfully signed out");
    } catch (error: any) {
      toast.error(error.message || "Failed to sign out");
    }
  };

  const copyToClipboard = () => {
    if (!address) return;
    navigator.clipboard.writeText(address);
    toast.success("Address copied to clipboard!");
    setOpen(false);
  };

  if (loading) {
    return (
      <Button variant="outline" disabled>
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <span className="ml-2">Loading...</span>
      </Button>
    );
  }

  if (isConnected && address) {
    return (
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            ref={buttonRef}
            variant="outline"
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium"
          >
            <div className="h-2 w-2 rounded-full bg-green-500" />
            <span className="truncate max-w-[120px] font-mono">
              {`${address.slice(0, 6)}...${address.slice(-4)}`}
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-56 rounded-lg bg-background p-2 shadow-lg"
          sideOffset={8}
        >
          <DropdownMenuItem
            className="flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
            onClick={copyToClipboard}
          >
            <Copy className="h-4 w-4" />
            <span>Copy Address</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-destructive hover:bg-accent"
            onClick={handleSignOut}
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // If not connected, show connect button that links to auth page
  return (
    <Link href="/auth/signin" passHref>
      <Button
        variant="outline"
        className="flex items-center gap-2"
      >
        <Wallet className="h-4 w-4" />
        <span>Connect Wallet</span>
      </Button>
    </Link>
  );
}
