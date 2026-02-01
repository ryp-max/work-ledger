import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Work Ledger",
  description: "A personal work journal on a craftsman's workbench",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
