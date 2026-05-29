import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "FlowSphere AI",
  description: "Premium AI-inspired task management platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="font-sans">
      <body className="bg-background text-foreground antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
