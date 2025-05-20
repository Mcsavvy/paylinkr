import { useCallback, useState } from "react";
import { useWalletConnection } from "./useWalletConnection";
import {
  fetchSbtcBalance,
  fetchSignersInfo,
  fetchBtcFeeRate,
} from "@/lib/stacks/sbtc";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export function useSbtc() {
  const { address, isConnected } = useWalletConnection();
  const [loading, setLoading] = useState(false);

  // Fetch sBTC balance for the connected wallet
  const balanceQuery = useQuery({
    queryKey: ["sbtcBalance", address],
    queryFn: async () => {
      if (!address || !isConnected) return "0";
      try {
        return await fetchSbtcBalance(address);
      } catch (error) {
        console.error("Error fetching sBTC balance:", error);
        return "0";
      }
    },
    enabled: !!address && isConnected,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Prepare data for deposit
  const prepareDepositInfo = useCallback(async () => {
    setLoading(true);
    try {
      if (!isConnected || !address) {
        throw new Error("Wallet not connected");
      }

      const signersInfo = await fetchSignersInfo();
      const feeRate = await fetchBtcFeeRate("medium");

      setLoading(false);
      return {
        depositAddress: signersInfo.address,
        signerPublicKey: signersInfo.publicKey,
        feeRate,
        userStxAddress: address,
      };
    } catch (error: any) {
      setLoading(false);
      toast.error(error.message || "Failed to prepare deposit info");
      return null;
    }
  }, [isConnected, address]);

  return {
    // Queries
    balance: balanceQuery.data || "0",
    isBalanceLoading: balanceQuery.isLoading,
    refetchBalance: balanceQuery.refetch,

    // Actions
    prepareDepositInfo,
    isLoading: loading || balanceQuery.isLoading,
  };
}
