"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Building2, Check, Loader2, ShieldCheck, User } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

type MerchantStatus = 'active' | 'pending' | 'inactive' | 'suspended' | 'rejected';

interface MerchantProfile {
  id: string;
  businessName: string;
  businessEmail: string;
  website?: string;
  status: MerchantStatus;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function MerchantProfilePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [merchant, setMerchant] = useState<MerchantProfile | null>(null);
  const [formData, setFormData] = useState({
    businessName: '',
    businessEmail: '',
    website: '',
  });

  // Fetch merchant profile
  useEffect(() => {
    const fetchMerchantProfile = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/user/merchant');
        
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            setMerchant(data.data);
            setFormData({
              businessName: data.data.businessName || '',
              businessEmail: data.data.businessEmail || '',
              website: data.data.website || '',
            });
          }
        } else {
          const error = await response.json().catch(() => ({}));
          throw new Error(error.message || 'Failed to fetch merchant profile');
        }
      } catch (error) {
        console.error('Error fetching merchant profile:', error);
        toast.error('Failed to load merchant profile', {
          description: error instanceof Error ? error.message : 'Please try again later.',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchMerchantProfile();
  }, []);

  const handleUpgrade = async () => {
    if (!formData.businessName || !formData.businessEmail) {
      toast.error('Validation Error', {
        description: 'Business name and email are required',
      });
      return;
    }

    try {
      setIsUpgrading(true);
      const response = await fetch('/api/user/merchant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Merchant application submitted', {
          description: 'Your merchant application has been submitted for review.',
        });
        setMerchant({
          ...formData,
          id: 'new',
          status: 'pending',
          isVerified: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      } else {
        throw new Error(data.message || 'Failed to submit application');
      }
    } catch (error) {
      console.error('Error upgrading to merchant:', error);
      toast.error('Failed to submit application', {
        description: error instanceof Error ? error.message : 'Please try again later.',
      });
    } finally {
      setIsUpgrading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const getStatusBadge = (status: MerchantStatus) => {
    const statusMap = {
      active: { label: 'Active', variant: 'success' as const },
      pending: { label: 'Pending Review', variant: 'warning' as const },
      inactive: { label: 'Inactive', variant: 'secondary' as const },
      suspended: { label: 'Suspended', variant: 'destructive' as const },
      rejected: { label: 'Rejected', variant: 'destructive' as const },
    };
    
    const statusInfo = statusMap[status] || { label: 'Unknown', variant: 'secondary' as const };
    return (
      <Badge variant={statusInfo.variant} className="capitalize">
        {statusInfo.label}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {merchant ? 'Merchant Profile' : 'Become a Merchant'}
          </h1>
          <p className="text-muted-foreground">
            {merchant 
              ? 'Manage your merchant account and settings'
              : 'Upgrade your account to start accepting payments as a merchant'}
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            <div className="flex items-center space-x-2">
              <Building2 className="h-6 w-6" />
              <span>Merchant Information</span>
              {merchant?.isVerified && (
                <Badge variant="outline" className="flex items-center">
                  <ShieldCheck className="h-3.5 w-3.5 mr-1 text-green-500" />
                  Verified
                </Badge>
              )}
            </div>
          </CardTitle>
          <CardDescription>
            {merchant 
              ? 'Your merchant account details and status.'
              : 'Fill in your business information to apply for a merchant account.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {merchant ? (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Status</Label>
                <div>{getStatusBadge(merchant.status)}</div>
              </div>
              <div className="space-y-2">
                <Label>Business Name</Label>
                <p className="text-sm">{merchant.businessName}</p>
              </div>
              <div className="space-y-2">
                <Label>Business Email</Label>
                <p className="text-sm">{merchant.businessEmail}</p>
              </div>
              {merchant.website && (
                <div className="space-y-2">
                  <Label>Website</Label>
                  <a 
                    href={merchant.website.startsWith('http') ? merchant.website : `https://${merchant.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline"
                  >
                    {merchant.website}
                  </a>
                </div>
              )}
              <div className="space-y-2">
                <Label>Member Since</Label>
                <p className="text-sm">
                  {new Date(merchant.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="businessName">Business Name *</Label>
                  <Input
                    id="businessName"
                    name="businessName"
                    placeholder="Your business name"
                    value={formData.businessName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="businessEmail">Business Email *</Label>
                  <Input
                    id="businessEmail"
                    name="businessEmail"
                    type="email"
                    placeholder="business@example.com"
                    value={formData.businessEmail}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website (Optional)</Label>
                  <Input
                    id="website"
                    name="website"
                    placeholder="https://example.com"
                    value={formData.website}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="rounded-lg border p-4 bg-muted/50">
                <h3 className="font-medium mb-2">Merchant Benefits</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Accept sBTC payments from customers</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Create custom payment links and invoices</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Access to merchant analytics and reporting</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Priority customer support</span>
                  </li>
                </ul>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch id="terms" required />
                <Label htmlFor="terms" className="text-sm">
                  I agree to the <a href="/terms" className="text-primary hover:underline">Terms of Service</a> and{' '}
                  <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>
                </Label>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-end">
          {merchant ? (
            <div className="flex space-x-4">
              {merchant.status === 'rejected' && (
                <Button 
                  variant="outline"
                  onClick={() => {
                    // Logic to reapply
                    setMerchant(null);
                  }}
                >
                  Reapply
                </Button>
              )}
              <Button disabled={isUpgrading}>
                {isUpgrading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </div>
          ) : (
            <Button 
              onClick={handleUpgrade}
              disabled={isUpgrading}
              className="w-full sm:w-auto"
            >
              {isUpgrading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <User className="mr-2 h-4 w-4" />
                  Upgrade to Merchant
                </>
              )}
            </Button>
          )}
        </CardFooter>
      </Card>

      {merchant?.status === 'active' && (
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Payment Settings</CardTitle>
              <CardDescription>Manage how you receive payments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Settlement Wallet</p>
                    <p className="text-sm text-muted-foreground">
                      {merchant.businessWallet || 'Not set'}
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Change
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Settlement Schedule</p>
                    <p className="text-sm text-muted-foreground">
                      Daily
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Change
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>API Access</CardTitle>
              <CardDescription>Integrate with our API</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">API Key</p>
                    <p className="text-sm text-muted-foreground">
                      {merchant.apiKey ? '••••••••••••••••' : 'Not generated'}
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    {merchant.apiKey ? 'Regenerate' : 'Generate'}
                  </Button>
                </div>
                <div className="rounded-md bg-muted p-4">
                  <h4 className="text-sm font-medium mb-2">Webhook URL</h4>
                  <div className="flex items-center space-x-2">
                    <Input 
                      value={merchant.webhookUrl || 'https://your-webhook-url.com/api/webhook'}
                      readOnly
                      className="font-mono text-xs"
                    />
                    <Button variant="outline" size="sm" className="shrink-0">
                      Copy
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
