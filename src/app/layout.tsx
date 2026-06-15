import type { Metadata } from "next";

import { Header } from "@/components/layout/Header";
import { Toaster } from "@/components/ui/sonner";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Drive Trip Logger",
    template: "%s | Drive Trip Logger",
  },
  description:
    "Log drives, remember meaningful routes, and keep every journey organized.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Header />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
