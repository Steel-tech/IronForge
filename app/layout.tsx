import type { Metadata } from "next";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "IronForge - Start Your Ironwork Contracting Business",
  description:
    "AI-powered wizard to help ironworkers start their contracting business in Washington or Oregon. Covers licensing, bonding, insurance, and certifications.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body className="bg-iron-50 text-iron-900 antialiased">{children}</body>
    </html>
  );
}
