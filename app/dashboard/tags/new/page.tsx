import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Tag as TagIcon } from "lucide-react";
import Link from "next/link";

export default function NewTagPage() {
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
              <Input id="name" placeholder="e.g., Monthly Subscription" />
              <p className="text-sm text-muted-foreground">
                A descriptive name for this payment request
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (sBTC)</Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <span className="text-muted-foreground">sats</span>
                </div>
                <Input
                  id="amount"
                  type="number"
                  step="0.00000001"
                  placeholder="0.00"
                  className="pl-16"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Add a description for this payment request..."
              rows={3}
            />
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
          <Button variant="outline" asChild>
            <Link href="/dashboard/tags">
              Cancel
            </Link>
          </Button>
          <Button>
            <TagIcon className="mr-2 h-4 w-4" />
            Create Payment Tag
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
