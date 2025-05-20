"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { usePayTags } from "@/hooks/usePayTags";
import { PayTag } from "@/lib/stacks/contracts";

// Create context type
interface PayTagContextType {
  createdTags: (PayTag | null)[];
  receivedTags: (PayTag | null)[];
  isCreatedTagsLoading: boolean;
  isReceivedTagsLoading: boolean;
  createPayTag: any;
  fulfillPayTag: any;
  cancelPayTag: any;
  getPayTagById: (id: number) => Promise<PayTag | null>;
  isLoading: boolean;
  refreshCreatedTags: () => void;
  refreshReceivedTags: () => void;
}

// Create context with default values
const PayTagContext = createContext<PayTagContextType>({
  createdTags: [],
  receivedTags: [],
  isCreatedTagsLoading: false,
  isReceivedTagsLoading: false,
  createPayTag: async () => {},
  fulfillPayTag: async () => {},
  cancelPayTag: async () => {},
  getPayTagById: async () => null,
  isLoading: false,
  refreshCreatedTags: () => {},
  refreshReceivedTags: () => {},
});

// Custom hook to use the context
export const usePayTagContext = () => useContext(PayTagContext);

// Provider component
export function PayTagProvider({ children }: { children: ReactNode }) {
  const payTagsData = usePayTags();

  return (
    <PayTagContext.Provider value={payTagsData}>
      {children}
    </PayTagContext.Provider>
  );
}
