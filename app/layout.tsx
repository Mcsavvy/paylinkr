import type { Metadata } from "next";
import "./globals.css";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Providers } from "@/components/providers";

export const metadata: Metadata = {
  title: "PayLinkr - sBTC Payment Requests",
  description: "Generate payment links and QR codes for sBTC payments",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`antialiased`}>
        <Providers>
          <div style={{ position: "fixed", top: 16, right: 16, zIndex: 50 }}>
            <ThemeToggle />
          </div>
          {children}
        </Providers>
      </body>
    </html>
  );
}
