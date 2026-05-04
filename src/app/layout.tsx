import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Smart Connect | Premium Gadget Marketplace",
  description: "A trust-based marketplace for premium gadgets and phone accessories.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-neutral-950 text-neutral-200">
          {children}
        </div>
      </body>
    </html>
  );
}
