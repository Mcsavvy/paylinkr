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
  CardFooter,
} from "@/components/ui/card";
import { useWalletConnection } from "@/hooks/useWalletConnection";
import { usePayTags } from "@/hooks/usePayTags";
import { toast } from "sonner";
import { PayTag, PAYTAG_STATE } from "@/lib/stacks/contracts";
import { RefreshCw, Check, X, Clock, ArrowRight } from "lucide-react";

const payTagLookupSchema = z.object({
  id: z.string().min(1, "PayTag ID is required"),
});

type PayTagLookupValues = z.infer<typeof payTagLookupSchema>;

export function PayTagTester() {
  const { address, isConnected } = useWalletConnection();
  const { getPayTagById, fulfillPayTag, cancelPayTag, isLoading } =
    usePayTags();
  const [payTag, setPayTag] = useState<PayTag | null>(null);
  const [lookupError, setLookupError] = useState<string | null>(null);
  const [action, setAction] = useState<"fulfill" | "cancel" | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [txId, setTxId] = useState<string | null>(null);

  const form = useForm<PayTagLookupValues>({
    resolver: zodResolver(payTagLookupSchema),
    defaultValues: {
      id: "",
    },
  });

  const onSubmit = async (data: PayTagLookupValues) => {
    setLookupError(null);
    setPayTag(null);
    setSuccess(false);
    setTxId(null);
    setAction(null);

    const id = parseInt(data.id, 10);
    if (isNaN(id)) {
      setLookupError("Invalid PayTag ID");
      return;
    }

    try {
      const payTagData = await getPayTagById(id);
      if (payTagData) {
        setPayTag(payTagData);
      } else {
        setLookupError("PayTag not found");
      }
    } catch (error: any) {
      setLookupError(error.message || "Failed to fetch PayTag");
    }
  };

  const handleFulfill = async () => {
    if (!payTag || !isConnected) return;

    setAction("fulfill");
    try {
      const txId = fulfillPayTag({ id: payTag.id });
      // @ts-expect-error ...
      setTxId(txId);
      setSuccess(true);
    } catch (error: any) {
      toast.error(error.message || "Failed to fulfill PayTag");
      setSuccess(false);
    }
  };

  const handleCancel = async () => {
    if (!payTag || !isConnected) return;

    setAction("cancel");
    try {
      const txId = cancelPayTag({ id: payTag.id });
      // @ts-expect-error ...
      setTxId(txId);
      setSuccess(true);
    } catch (error: any) {
      toast.error(error.message || "Failed to cancel PayTag");
      setSuccess(false);
    }
  };

  const reset = () => {
    form.reset();
    setPayTag(null);
    setLookupError(null);
    setAction(null);
    setSuccess(false);
    setTxId(null);
  };

  const getStateIcon = (state: string) => {
    switch (state) {
      case PAYTAG_STATE.PENDING:
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case PAYTAG_STATE.PAID:
        return <Check className="h-5 w-5 text-green-500" />;
      case PAYTAG_STATE.CANCELED:
        return <X className="h-5 w-5 text-red-500" />;
      case PAYTAG_STATE.EXPIRED:
        return <Clock className="h-5 w-5 text-gray-500" />;
      default:
        return null;
    }
  };

  const canFulfill =
    payTag && payTag.state === PAYTAG_STATE.PENDING && isConnected && !action;

  const canCancel =
    payTag &&
    payTag.state === PAYTAG_STATE.PENDING &&
    isConnected &&
    payTag.creator === address &&
    !action;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>PayTag Tester</CardTitle>
        <CardDescription>Look up and test PayTags</CardDescription>
      </CardHeader>
      <CardContent>
        {!payTag && !action ? (
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="id">PayTag ID</Label>
              <Input
                id="id"
                placeholder="Enter PayTag ID"
                {...form.register("id")}
              />
              {form.formState.errors.id && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.id.message}
                </p>
              )}
              {lookupError && (
                <p className="text-sm text-red-500">{lookupError}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <RefreshCw className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Look Up PayTag
            </Button>
          </form>
        ) : (
          <>
            {!action ? (
              <div className="space-y-4">
                {payTag && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">ID</p>
                        <p className="font-medium">{payTag.id}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Status</p>
                        <div className="flex items-center space-x-1">
                          {getStateIcon(payTag.state)}
                          <p className="font-medium capitalize">
                            {payTag.state}
                          </p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Amount</p>
                        <p className="font-medium">
                          {(Number(payTag.amount) / 1000000).toFixed(6)} sBTC
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Created At
                        </p>
                        <p className="font-medium">Block #{payTag.createdAt}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Creator</p>
                        <p className="font-mono text-xs truncate">
                          {payTag.creator}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Recipient
                        </p>
                        <p className="font-mono text-xs truncate">
                          {payTag.recipient}
                        </p>
                      </div>
                    </div>

                    {payTag.memo && (
                      <div>
                        <p className="text-sm text-muted-foreground">Memo</p>
                        <p className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded">
                          {payTag.memo}
                        </p>
                      </div>
                    )}

                    <div className="flex space-x-2 pt-4">
                      <Button
                        onClick={reset}
                        variant="outline"
                        className="flex-1"
                      >
                        Look Up Another
                      </Button>
                      {canCancel && (
                        <Button
                          onClick={handleCancel}
                          variant="outline"
                          className="flex-1 border-red-300 hover:bg-red-50 text-red-600"
                          disabled={isLoading}
                        >
                          Cancel PayTag
                        </Button>
                      )}
                      {canFulfill && (
                        <Button
                          onClick={handleFulfill}
                          className="flex-1 bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-500 text-white"
                          disabled={isLoading}
                        >
                          Pay {(Number(payTag.amount) / 1000000).toFixed(6)}{" "}
                          sBTC
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {success ? (
                  <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
                    <h3 className="font-medium text-green-800 dark:text-green-300 mb-2 flex items-center">
                      <Check className="h-5 w-5 mr-2" />
                      {action === "fulfill"
                        ? "Payment Successful!"
                        : "PayTag Canceled!"}
                    </h3>
                    <p className="text-sm text-green-700 dark:text-green-400">
                      {action === "fulfill"
                        ? "Your payment has been sent and the PayTag has been fulfilled."
                        : "The PayTag has been canceled and is no longer active."}
                    </p>
                  </div>
                ) : (
                  <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                    <h3 className="font-medium text-blue-800 dark:text-blue-300 mb-2 flex items-center">
                      <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                      {action === "fulfill"
                        ? "Processing Payment..."
                        : "Canceling PayTag..."}
                    </h3>
                    <p className="text-sm text-blue-700 dark:text-blue-400">
                      Please wait while we process your request.
                    </p>
                  </div>
                )}

                {txId && (
                  <div className="space-y-2">
                    <Label>Transaction ID:</Label>
                    <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded overflow-auto text-xs font-mono">
                      <code className="break-all">{txId}</code>
                    </div>
                  </div>
                )}

                <Button onClick={reset} className="w-full" variant="outline">
                  Start Over
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
