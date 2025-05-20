"use client";

import { useCallback, useState } from "react";
import { useSbtcContext } from "@/components/providers/SbtcProvider";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QRCodeSVG } from "qrcode.react";
import { Skeleton } from "@/components/ui/skeleton";
import { RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { formatCryptoAmount } from "@/lib/utils";

export function SbtcBalanceCard() {
  const { balance, isBalanceLoading, refetchBalance } = useSbtcContext();

  const copyToClipboard = useCallback((text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  }, []);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>sBTC Balance</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => refetchBalance()}
            disabled={isBalanceLoading}
            className="h-8 w-8"
          >
            <RefreshCw
              className={cn("h-4 w-4", isBalanceLoading && "animate-spin")}
            />
          </Button>
        </CardTitle>
        <CardDescription>Your testnet sBTC balance</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isBalanceLoading ? (
          <Skeleton className="h-12 w-1/2" />
        ) : (
          <div className="text-3xl font-bold">
            {formatCryptoAmount(balance, "sBTC")}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
