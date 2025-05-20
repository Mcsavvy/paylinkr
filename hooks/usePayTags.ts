"use client";

import { useState, useCallback } from "react";
import { useWalletConnection } from "./useWalletConnection";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getCreatorPayTags,
  getRecipientPayTags,
  getMultiplePayTags,
  createPayTag as createPayTagTransaction,
  fulfillPayTag as fulfillPayTagTransaction,
  cancelPayTag as cancelPayTagTransaction,
  markPayTagExpired as markPayTagExpiredTransaction,
  getPayTag,
} from "@/lib/stacks/transactions";
import {
  PayTag,
  CreatePayTagParams,
  FulfillPayTagParams,
  CancelPayTagParams,
} from "@/lib/stacks/contracts";

export function usePayTags() {
  const { address, isConnected } = useWalletConnection();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);

  // Query for fetching PayTags created by the user
  const createdTagsQuery = useQuery({
    queryKey: ["createdPayTags", address],
    queryFn: async () => {
      if (!address || !isConnected) return [];
      try {
        const tagIds = await getCreatorPayTags(address);
        if (tagIds.length === 0) return [];
        return getMultiplePayTags(tagIds);
      } catch (error) {
        console.error("Error fetching created PayTags:", error);
        return [];
      }
    },
    enabled: !!address && isConnected,
  });

  // Query for fetching PayTags where the user is the recipient
  const receivedTagsQuery = useQuery({
    queryKey: ["receivedPayTags", address],
    queryFn: async () => {
      if (!address || !isConnected) return [];
      try {
        const tagIds = await getRecipientPayTags(address);
        if (tagIds.length === 0) return [];
        return getMultiplePayTags(tagIds);
      } catch (error) {
        console.error("Error fetching received PayTags:", error);
        return [];
      }
    },
    enabled: !!address && isConnected,
  });

  // Mutation for creating a new PayTag
  const createMutation = useMutation({
    mutationFn: async (params: CreatePayTagParams) => {
      if (!isConnected) {
        throw new Error("Wallet not connected");
      }
      setLoading(true);
      try {
        // Here you would get the private key from the wallet
        // For demonstration, we'll just show a toast since we can't access the private key directly
        toast.info(
          "Transaction would be sent here with real wallet integration"
        );

        // In a real implementation with wallet integration:
        // const txId = await createPayTagTransaction(params, privateKey);
        // return txId;

        // For now, let's return a mock txId
        return "mock-tx-id-" + Date.now();
      } catch (error: any) {
        console.error("Error creating PayTag:", error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    onSuccess: () => {
      toast.success("PayTag created successfully!");
      // Invalidate queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ["createdPayTags", address] });
    },
    onError: (error: any) => {
      toast.error(`Failed to create PayTag: ${error.message}`);
    },
  });

  // Mutation for fulfilling a PayTag
  const fulfillMutation = useMutation({
    mutationFn: async (params: FulfillPayTagParams) => {
      if (!isConnected) {
        throw new Error("Wallet not connected");
      }
      setLoading(true);
      try {
        // Here you would get the private key from the wallet
        toast.info(
          "Transaction would be sent here with real wallet integration"
        );

        // In a real implementation with wallet integration:
        // const txId = await fulfillPayTagTransaction(params, privateKey);
        // return txId;

        return "mock-tx-id-" + Date.now();
      } catch (error: any) {
        console.error("Error fulfilling PayTag:", error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    onSuccess: () => {
      toast.success("PayTag fulfilled successfully!");
      // Invalidate queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ["createdPayTags", address] });
      queryClient.invalidateQueries({ queryKey: ["receivedPayTags", address] });
    },
    onError: (error: any) => {
      toast.error(`Failed to fulfill PayTag: ${error.message}`);
    },
  });

  // Mutation for canceling a PayTag
  const cancelMutation = useMutation({
    mutationFn: async (params: CancelPayTagParams) => {
      if (!isConnected) {
        throw new Error("Wallet not connected");
      }
      setLoading(true);
      try {
        // Here you would get the private key from the wallet
        toast.info(
          "Transaction would be sent here with real wallet integration"
        );

        // In a real implementation with wallet integration:
        // const txId = await cancelPayTagTransaction(params, privateKey);
        // return txId;

        return "mock-tx-id-" + Date.now();
      } catch (error: any) {
        console.error("Error canceling PayTag:", error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    onSuccess: () => {
      toast.success("PayTag canceled successfully!");
      // Invalidate queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ["createdPayTags", address] });
    },
    onError: (error: any) => {
      toast.error(`Failed to cancel PayTag: ${error.message}`);
    },
  });

  // Function to get a single PayTag by ID
  const getPayTagById = useCallback(
    async (id: number): Promise<PayTag | null> => {
      try {
        return await getPayTag(id);
      } catch (error) {
        console.error("Error getting PayTag:", error);
        return null;
      }
    },
    []
  );

  return {
    // Queries
    createdTags: createdTagsQuery.data || [],
    receivedTags: receivedTagsQuery.data || [],
    isCreatedTagsLoading: createdTagsQuery.isLoading,
    isReceivedTagsLoading: receivedTagsQuery.isLoading,

    // Actions
    createPayTag: createMutation.mutate,
    fulfillPayTag: fulfillMutation.mutate,
    cancelPayTag: cancelMutation.mutate,
    getPayTagById,

    // Status
    isLoading:
      loading ||
      createdTagsQuery.isLoading ||
      receivedTagsQuery.isLoading ||
      createMutation.isPending ||
      fulfillMutation.isPending ||
      cancelMutation.isPending,

    // Refresh functions
    refreshCreatedTags: () =>
      queryClient.invalidateQueries({ queryKey: ["createdPayTags", address] }),
    refreshReceivedTags: () =>
      queryClient.invalidateQueries({ queryKey: ["receivedPayTags", address] }),
  };
}
