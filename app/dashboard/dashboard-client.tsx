"use client";

import { SbtcBalanceCard } from "@/components/ui/sbtc-balance-card";
import { SbtcRequestForm } from "@/components/ui/sbtc-request-form";

interface DashboardClientProps {
  user: {
    walletAddress: string;
  };
}

export default function DashboardClient({ user }: DashboardClientProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Wallet: <span className="font-mono">{user.walletAddress}</span>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SbtcBalanceCard />
          <SbtcRequestForm />
        </div>
      </div>
    </div>
  );
}
