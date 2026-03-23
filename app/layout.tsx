import type { Metadata } from "next";
import "./globals.css";
import { JetBrains_Mono, Space_Grotesk } from "next/font/google";
import { cn } from "@/lib/utils";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "IronForge — Cyberpunk Contractor Launchpad",
  description:
    "AI-powered wizard to help ironworkers start their contracting business in all 50 states. Covers licensing, bonding, insurance, and certifications.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={cn(jetbrainsMono.variable, spaceGrotesk.variable)}
    >
      <body className="bg-cyber-black text-text-primary antialiased font-sans scanlines">
        {children}
      </body>
    </html>
  );
}
