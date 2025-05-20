"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useWalletConnection } from "@/hooks/useWalletConnection";
import { usePayTags } from "@/hooks/usePayTags";
import { toast } from "sonner";

const payTagFormSchema = z.object({
  amount: z.string().min(1, "Amount is required"),
  memo: z.string().optional(),
  expiresIn: z.string().default("4320"), // Default to 30 days (4320 blocks)
});

type PayTagFormValues = z.infer<typeof payTagFormSchema>;

export function PayTagCreator() {
  const { address, isConnected } = useWalletConnection();
  const { createPayTag, isLoading } = usePayTags();
  const [created, setCreated] = useState(false);
  const [payTagId, setPayTagId] = useState<string | null>(null);

  const form = useForm<PayTagFormValues>({
    resolver: zodResolver(payTagFormSchema),
    defaultValues: {
      amount: "",
      memo: "",
      expiresIn: "4320",
    },
  });

  const onSubmit = async (data: PayTagFormValues) => {
    if (!isConnected || !address) {
      toast.error("Please connect your wallet first");
      return;
    }

    try {
      // Convert string values to BigInt for contract interaction
      const params = {
        amount: BigInt(Math.floor(parseFloat(data.amount) * 1000000)), // Convert to microSTX
        expiresIn: BigInt(data.expiresIn),
        memo: data.memo || undefined,
      };

      // Call the contract through our hook
      const txId = await createPayTag(params);

      // In a real implementation, we would watch for the transaction to be confirmed
      // For now, let's simulate completion
      setPayTagId(txId);
      setCreated(true);
    } catch (error: any) {
      toast.error(error.message || "Failed to create PayTag");
    }
  };

  const resetForm = () => {
    form.reset();
    setCreated(false);
    setPayTagId(null);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Create a PayTag</CardTitle>
        <CardDescription>Request sBTC payment with a PayTag</CardDescription>
      </CardHeader>
      <CardContent>
        {!created ? (
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (sBTC)</Label>
              <Input
                id="amount"
                type="number"
                step="0.000001"
                min="0.000001"
                placeholder="0.001"
                {...form.register("amount")}
              />
              {form.formState.errors.amount && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.amount.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="memo">Memo (optional)</Label>
              <Input
                id="memo"
                placeholder="Payment for coffee"
                {...form.register("memo")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="expiresIn">Expires in</Label>
              <select
                id="expiresIn"
                className="w-full rounded-md border border-zinc-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 dark:border-zinc-800 dark:bg-zinc-950"
                {...form.register("expiresIn")}
              >
                <option value="144">1 day (~144 blocks)</option>
                <option value="1008">1 week (~1008 blocks)</option>
                <option value="4320">30 days (~4320 blocks)</option>
              </select>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-500 text-white"
              disabled={!isConnected || isLoading}
            >
              {isLoading ? "Creating..." : "Create PayTag"}
            </Button>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
              <h3 className="font-medium text-green-800 dark:text-green-300 mb-2">
                PayTag Created Successfully!
              </h3>
              <p className="text-sm text-green-700 dark:text-green-400">
                Your payment request has been created and is now available for
                payment.
              </p>
            </div>

            <div className="space-y-2">
              <Label>Transaction ID:</Label>
              <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded overflow-auto text-xs font-mono">
                <code className="break-all">{payTagId}</code>
              </div>
            </div>

            <Button onClick={resetForm} className="w-full" variant="outline">
              Create Another PayTag
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
