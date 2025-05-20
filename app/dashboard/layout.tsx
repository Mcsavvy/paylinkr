import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.walletAddress) {
    redirect("/auth/signin");
  }

  return <DashboardLayout>{children}</DashboardLayout>;
}
