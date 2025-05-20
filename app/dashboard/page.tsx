"use server";
import DashboardClient from "./dashboard-client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.walletAddress) {
    return null; // or redirect to sign-in
  }

  return <DashboardClient user={{ walletAddress: session.user.walletAddress }} />;
}
