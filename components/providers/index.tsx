"use client";

import { ReactNode } from "react";
import { AuthProvider } from "./AuthProvider";
import { SbtcProvider } from "./SbtcProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";

// Create a client
const queryClient = new QueryClient();

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SbtcProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {children}
          </ThemeProvider>
        </SbtcProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export * from "./AuthProvider";
export * from "./SbtcProvider";
