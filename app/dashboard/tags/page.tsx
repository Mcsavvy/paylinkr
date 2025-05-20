"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Copy, Plus, Search, Tag as TagIcon, Trash2, Loader2 } from "lucide-react";
import Link from "next/link";
import { getTags } from "@/lib/api/tags";
import { PayTag } from "@/types/api";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";

export default function TagsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [tags, setTags] = useState<PayTag[]>([]);
  const [pagination, setPagination] = useState({
    total: 0,
    limit: 10,
    skip: 0,
  });
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchTags();
  }, [pagination.skip, pagination.limit]);

  const fetchTags = async () => {
    try {
      setIsLoading(true);
      const response = await getTags({
        limit: pagination.limit,
        skip: pagination.skip,
      });

      if (response.success && response.data) {
        setTags(response.data.data || []);
        setPagination(prev => ({
          ...prev,
          total: response.data?.pagination.total || 0,
        }));
      } else {
        toast.error('Failed to load tags', {
          description: response.error?.message || 'Please try again later.',
        });
      }
    } catch (error) {
      console.error('Error fetching tags:', error);
      toast.error('Failed to load tags', {
        description: 'An unexpected error occurred.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (tagId: string) => {
    if (!confirm('Are you sure you want to delete this tag? This action cannot be undone.')) {
      return;
    }

    try {
      // Implement delete functionality if needed
      toast.error('Delete functionality not implemented yet');
      // await deleteTag(tagId);
      // toast.success('Tag deleted successfully');
      // fetchTags();
    } catch (error) {
      console.error('Error deleting tag:', error);
      toast.error('Failed to delete tag');
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const filteredTags = tags.filter(tag =>
    tag.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tag.tagId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(pagination.total / pagination.limit);
  const currentPage = Math.floor(pagination.skip / pagination.limit) + 1;

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
                placeholder="Search by description or ID..."
                className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
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
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    <div className="flex items-center justify-center">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading tags...
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredTags.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No tags found. Create your first payment tag to get started.
                  </TableCell>
                </TableRow>
              ) : (
                filteredTags.map((tag) => (
                  <TableRow key={tag._id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-2">
                        <TagIcon className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div>{tag.description || 'Untitled Tag'}</div>
                          <div className="text-xs text-muted-foreground font-mono">{tag.tagId}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{(tag.amount / 100000000).toFixed(8)} sBTC</TableCell>
                    <TableCell>
                      {formatDistanceToNow(new Date(tag.createdAt), { addSuffix: true })}
                    </TableCell>
                    <TableCell>0</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        tag.status === 'paid'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                        : tag.status === 'pending'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                        }`}>
                        {tag.status.charAt(0).toUpperCase() + tag.status.slice(1)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8"
                          onClick={() => handleCopy(tag.paymentUrl)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8"
                          onClick={() => handleDelete(tag._id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex flex-col items-start space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <div className="text-sm text-muted-foreground">
            Showing <strong>{pagination.skip + 1}-{Math.min(pagination.skip + pagination.limit, pagination.total)}</strong> of <strong>{pagination.total}</strong> tags
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPagination(prev => ({
                ...prev,
                skip: Math.max(0, prev.skip - prev.limit)
              }))}
              disabled={pagination.skip === 0 || isLoading}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPagination(prev => ({
                ...prev,
                skip: Math.min(prev.skip + prev.limit, pagination.total - 1)
              }))}
              disabled={pagination.skip + pagination.limit >= pagination.total || isLoading}
            >
              Next
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
