import { PayTagTester } from "@/components/ui/pay-tag-tester";
import { PayTagCreator } from "@/components/ui/pay-tag-creator";

export default function PayTagsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">PayTags Management</h1>
          <p className="text-muted-foreground">
            Create and manage your sBTC payment requests
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PayTagCreator />
          <PayTagTester />
        </div>

        <div className="mt-8 p-4 bg-zinc-50 dark:bg-zinc-900 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">About PayTags</h2>
          <p className="mb-4">
            PayTags allow you to create payment requests using sBTC on the
            Stacks blockchain. You can:
          </p>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
            <li>Create payment requests with custom amounts and memos</li>
            <li>Share payment links with anyone to request sBTC</li>
            <li>Track payment status in real-time</li>
            <li>
              Automatically receive funds in your wallet when someone fulfills
              your request
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
