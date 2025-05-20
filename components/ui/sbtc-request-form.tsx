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
import { useSbtcContext } from "@/components/providers/SbtcProvider";
import { QRCodeSVG } from "qrcode.react";
import { toast } from "sonner";
import { Copy, ExternalLink } from "lucide-react";

const requestFormSchema = z.object({
  amount: z.string().min(1, "Amount is required"),
  memo: z.string().optional(),
  expiration: z.string().optional(),
});

type RequestFormValues = z.infer<typeof requestFormSchema>;

export function SbtcRequestForm() {
  const { address, isConnected } = useWalletConnection();
  const { balance } = useSbtcContext();
  const [showQR, setShowQR] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState("");

  const form = useForm<RequestFormValues>({
    resolver: zodResolver(requestFormSchema),
    defaultValues: {
      amount: "",
      memo: "",
      expiration: "604800",
    },
  });

  const onSubmit = async (data: RequestFormValues) => {
    if (!isConnected || !address) {
      toast.error("Please connect your wallet first");
      return;
    }

    try {
      // In a real application, this would call the contract to create a payment request
      // For now, we'll just create a payment URL format for demonstration

      // Convert to microsats (fake conversion for demo)
      const amountInMicroSats = parseFloat(data.amount) * 1000000;

      // Create payment URL for testnet
      const paymentUrl = `https://testnet.paylinkr.com/pay?recipient=${address}&amount=${amountInMicroSats}&memo=${encodeURIComponent(
        data.memo || ""
      )}`;

      setPaymentUrl(paymentUrl);
      setShowQR(true);
      toast.success("Payment request created!");
    } catch (error: any) {
      toast.error(error.message || "Failed to create payment request");
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Payment URL copied to clipboard");
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Request sBTC</CardTitle>
        <CardDescription>
          Create a payment request with your sBTC address
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!showQR ? (
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
                placeholder="Coffee payment"
                {...form.register("memo")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="expiration">Expires in</Label>
              <select
                id="expiration"
                className="w-full rounded-md border border-zinc-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 dark:border-zinc-800 dark:bg-zinc-950"
                {...form.register("expiration")}
              >
                <option value="3600">1 hour</option>
                <option value="86400">1 day</option>
                <option value="604800">1 week</option>
                <option value="2592000">30 days</option>
              </select>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-500 text-white"
              disabled={!isConnected}
            >
              Generate Payment Request
            </Button>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="p-4 bg-white rounded-lg">
                <QRCodeSVG value={paymentUrl} size={200} />
              </div>
            </div>

            <div className="pt-2 space-y-2">
              <div className="flex justify-between items-center">
                <Label>Payment URL:</Label>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(paymentUrl)}
                  className="h-8"
                >
                  <Copy className="h-3 w-3 mr-2" />
                  Copy
                </Button>
              </div>
              <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded overflow-auto text-xs font-mono">
                <code className="break-all">{paymentUrl}</code>
              </div>

              <p className="text-sm text-muted-foreground mt-4">
                Share this QR code or URL with the person who needs to send you
                sBTC.
              </p>

              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={() => setShowQR(false)}>
                  Create New Request
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
