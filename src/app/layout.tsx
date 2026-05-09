import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "StackAudit | Optimize Your AI Tool Spend",
  description: "Find out if you're overpaying for Cursor, Copilot, Claude, and ChatGPT. Get a personalized audit and save thousands.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} antialiased min-h-screen flex flex-col`}>
        <TooltipProvider>
          {children}
          <Toaster theme="dark" position="top-center" />
        </TooltipProvider>
      </body>
    </html>
  );
}
