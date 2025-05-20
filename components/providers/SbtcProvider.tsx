"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { useSbtc } from "@/hooks/useSbtc";

// Create context type
interface SbtcContextType {
  balance: string;
  isBalanceLoading: boolean;
  refetchBalance: () => void;
  signersInfo: { publicKey: string; address: string } | undefined;
  isSignersLoading: boolean;
  feeRate: number | undefined;
  isFeeRateLoading: boolean;
  prepareDepositInfo: () => Promise<{
    depositAddress: string;
    signerPublicKey: string;
    feeRate: number;
    userStxAddress: string;
  } | null>;
  isLoading: boolean;
}

// Create context with default values
const SbtcContext = createContext<SbtcContextType>({
  balance: "0",
  isBalanceLoading: false,
  refetchBalance: () => {},
  signersInfo: undefined,
  isSignersLoading: false,
  feeRate: undefined,
  isFeeRateLoading: false,
  prepareDepositInfo: async () => null,
  isLoading: false,
});

// Custom hook to use the context
export const useSbtcContext = () => useContext(SbtcContext);

// Provider component
export function SbtcProvider({ children }: { children: ReactNode }) {
  const sbtcData = useSbtc();

  return (
    <SbtcContext.Provider value={sbtcData}>{children}</SbtcContext.Provider>
  );
}
