"use client"
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Wallet, LayoutDashboard, Tags, CreditCard, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  {
    name: "Overview",
    href: "/dashboard",
    icon: <LayoutDashboard className="mr-3 h-5 w-5" />,
  },
  {
    name: "Tags",
    href: "/dashboard/tags",
    icon: <Tags className="mr-3 h-5 w-5" />,
  },
  {
    name: "Payments",
    href: "/dashboard/payments",
    icon: <CreditCard className="mr-3 h-5 w-5" />,
  },
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: <Settings className="mr-3 h-5 w-5" />,
  },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <div className="hidden md:flex md:flex-col md:w-64 md:fixed md:inset-y-0">
      <div className="flex flex-col flex-grow border-r border-border bg-card overflow-y-auto">
        <div className="flex items-center h-16 flex-shrink-0 px-6">
          <Wallet className="h-8 w-8 text-primary" />
          <span className="ml-2 text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            PayLinkr
          </span>
        </div>
        <div className="mt-6 flex-1 flex flex-col">
          <nav className="flex-1 px-2 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  pathname === item.href
                    ? "bg-accent/10 text-foreground border-l-4 border-accent"
                    : "text-muted-foreground hover:bg-accent/5 hover:text-foreground",
                  "group flex items-center px-4 py-3 text-sm font-medium rounded-r-md transition-colors"
                )}
              >
                {item.icon}
                <span className="truncate">{item.name}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}
