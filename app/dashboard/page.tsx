import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SbtcBalanceCard } from "@/components/ui/sbtc-balance-card";
import { SbtcRequestForm } from "@/components/ui/sbtc-request-form";
import { Activity, ArrowUpRight, Clock, Tag } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  // Mock data - replace with real data from your API
  const stats = [
    {
      title: "Total Received",
      value: "0.42 sBTC",
      change: "+12.5%",
      icon: <ArrowUpRight className="h-5 w-5 text-primary" />,
      trend: "up" as const,
    },
    {
      title: "Active Tags",
      value: "3",
      change: "+1 new",
      icon: <Tag className="h-5 w-5 text-green-500" />,
      trend: "up" as const,
    },
    {
      title: "Pending",
      value: "0.15 sBTC",
      change: "2 payments",
      icon: <Clock className="h-5 w-5 text-amber-500" />,
      trend: "neutral" as const,
    },
    {
      title: "Total Transactions",
      value: "24",
      change: "+4.3%",
      icon: <Activity className="h-5 w-5 text-blue-500" />,
      trend: "up" as const,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's what's happening with your account.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className="rounded-md p-2 bg-accent/10">{stat.icon}</div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {/* @ts-expect-error ... */}
                <span
                  className={
                    stat.trend === "up"
                      ? "text-green-500"
                      : stat.trend === "down"
                      ? "text-red-500"
                      : "text-amber-500"
                  }
                >
                  {stat.change}
                </span>{" "}
                {/* @ts-expect-error ... */}
                {stat.trend === "up"
                  ? "from last month"
                  : stat.trend === "down"
                  ? "from last month"
                  : "waiting"}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>sBTC Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <SbtcBalanceCard />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Create Payment Request</CardTitle>
          </CardHeader>
          <CardContent>
            <SbtcRequestForm />
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Activity</CardTitle>
            <Link
              href="/dashboard/payments"
              className="text-sm text-primary hover:underline"
            >
              View all
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
              >
                <div className="flex items-center space-x-4">
                  <div className="rounded-full bg-primary/10 p-2">
                    <ArrowUpRight className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Payment Received</p>
                    <p className="text-sm text-muted-foreground">
                      From 1ABC...xyz
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">+0.05 sBTC</p>
                  <p className="text-sm text-muted-foreground">2h ago</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
