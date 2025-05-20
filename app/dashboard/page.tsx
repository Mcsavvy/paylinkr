"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "changeme";

async function getUserFromJWT() {
  const cookieStore = await cookies();
  const token = cookieStore.get("paylinkr_jwt")?.value;
  if (!token) return null;
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { walletAddress: string };
    return payload;
  } catch {
    return null;
  }
}

export default async function DashboardPage() {
  const user = await getUserFromJWT();
  if (!user) {
    redirect(`/auth?redirect=/dashboard`);
  }
  // Optionally fetch more user info from /api/user/profile
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <p className="mb-2">Welcome, {user.walletAddress}</p>
      <p className="text-muted-foreground">
        This is your authenticated dashboard.
      </p>
    </div>
  );
}
