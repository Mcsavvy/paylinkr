import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Copy, Plus, Search, Tag as TagIcon, Trash2 } from "lucide-react";
import Link from "next/link";

export default function TagsPage() {
  // Mock data - replace with real data from your API
  const tags = [
    {
      id: '1',
      name: 'Monthly Subscription',
      amount: '0.05 sBTC',
      url: 'https://paylinkr.xyz/pay/abc123',
      createdAt: '2025-05-15',
      payments: 12,
      status: 'active' as const,
    },
    {
      id: '2',
      name: 'Web Hosting',
      amount: '0.1 sBTC',
      url: 'https://paylinkr.xyz/pay/def456',
      createdAt: '2025-05-10',
      payments: 5,
      status: 'active' as const,
    },
    {
      id: '3',
      name: 'Consulting',
      amount: '0.25 sBTC',
      url: 'https://paylinkr.xyz/pay/ghi789',
      createdAt: '2025-04-28',
      payments: 2,
      status: 'inactive' as const,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Payment Tags</h1>
          <p className="text-muted-foreground">
            Create and manage your payment request tags
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/tags/new">
            <Plus className="mr-2 h-4 w-4" />
            New Tag
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
            <div>
              <CardTitle>Your Payment Tags</CardTitle>
              <CardDescription>
                Tags help you organize and track different payment requests
              </CardDescription>
            </div>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search tags..."
                className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Payments</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tags.map((tag) => (
                <TableRow key={tag.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center space-x-2">
                      <TagIcon className="h-4 w-4 text-muted-foreground" />
                      <span>{tag.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{tag.amount}</TableCell>
                  <TableCell>
                    {new Date(tag.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{tag.payments}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      tag.status === 'active' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                    }`}>
                      {tag.status.charAt(0).toUpperCase() + tag.status.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" size="sm" className="h-8">
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="h-8">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex flex-col items-start space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <div className="text-sm text-muted-foreground">
            Showing <strong>1-{tags.length}</strong> of <strong>{tags.length}</strong> tags
          </div>
          <div className="space-x-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm" disabled>
              Next
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
