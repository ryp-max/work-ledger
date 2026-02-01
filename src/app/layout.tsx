import type { Metadata } from "next";
import "./globals.css";
import { CommandPalette } from "@/components/CommandPalette";

export const metadata: Metadata = {
  title: "Work Ledger",
  description: "A craftsman's journal with a wooden workbench aesthetic",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased overflow-hidden">
        {children}
        <CommandPalette />
      </body>
    </html>
  );
}
