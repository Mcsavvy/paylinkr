"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Loader2, Tag as TagIcon } from "lucide-react";
import Link from "next/link";
import { createTag } from "@/lib/api/tags";
import { toast } from "sonner";

export default function NewTagPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    recipientWalletAddress: '',
    orderReference: '',
    type: 'p2p' as const,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.amount || isNaN(Number(formData.amount)) || Number(formData.amount) <= 0) {
      toast.error('Invalid amount', {
        description: 'Please enter a valid amount greater than 0',
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      const response = await createTag({
        amount: Math.round(Number(formData.amount) * 100000000), // Convert to sats
        description: formData.description || undefined,
        recipientWalletAddress: formData.recipientWalletAddress || undefined,
        orderReference: formData.orderReference || undefined,
        type: formData.type,
      });

      if (response.success && response.data) {
        toast.success('Payment tag created successfully!');
        router.push('/dashboard/tags');
      } else {
        throw new Error(response.error?.message || 'Failed to create tag');
      }
    } catch (error) {
      console.error('Error creating tag:', error);
      toast.error('Failed to create tag', {
        description: error instanceof Error ? error.message : 'Please try again later.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };
  return (
    <div className="space-y-6">
      <div>
        <Button variant="ghost" asChild className="mb-4 -ml-2">
          <Link href="/dashboard/tags" className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Tags
          </Link>
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">Create New Payment Tag</h1>
        <p className="text-muted-foreground">
          Create a new payment request tag to receive sBTC payments
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
        <CardHeader>
          <CardTitle>Tag Details</CardTitle>
          <CardDescription>
            Enter the details for your new payment tag
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Tag Name</Label>
              <Input 
                id="description"
                name="description"
                placeholder="e.g., Monthly Subscription"
                value={formData.description}
                onChange={handleInputChange}
                disabled={isSubmitting}
              />
              <p className="text-sm text-muted-foreground">
                A descriptive name for this payment request (optional)
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (sBTC)</Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <span className="text-muted-foreground">sBTC</span>
                </div>
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  step="0.00000001"
                  min="0.00000001"
                  placeholder="0.00"
                  className="pl-16"
                  value={formData.amount}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="recipientWalletAddress">Recipient Wallet Address (Optional)</Label>
            <Input
              id="recipientWalletAddress"
              name="recipientWalletAddress"
              placeholder="Enter a specific wallet address to receive payments (leave blank to use your default)"
              value={formData.recipientWalletAddress}
              onChange={handleInputChange}
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="orderReference">Order/Reference ID (Optional)</Label>
            <Input
              id="orderReference"
              name="orderReference"
              placeholder="e.g., ORDER-123"
              value={formData.orderReference}
              onChange={handleInputChange}
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Tag Type</Label>
            <select
              id="type"
              name="type"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={formData.type}
              onChange={handleInputChange}
              disabled={isSubmitting}
            >
              <option value="p2p">Peer to Peer</option>
              <option value="merchant">Merchant</option>
            </select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-md bg-primary/10">
                <TagIcon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">Payment Link</p>
                <p className="text-sm text-muted-foreground">
                  Will be generated after creation
                </p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end space-x-4">
          <Button 
            type="button" 
            variant="outline" 
            asChild
            disabled={isSubmitting}
          >
            <Link href="/dashboard/tags">
              Cancel
            </Link>
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <TagIcon className="mr-2 h-4 w-4" />
                Create Payment Tag
              </>
            )}
          </Button>
        </CardFooter>
        </Card>
      </form>
    </div>
  );
}
