import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="en">
      <body className="bg-iron-50 text-iron-900 antialiased">{children}</body>
    </html>
  );
}
