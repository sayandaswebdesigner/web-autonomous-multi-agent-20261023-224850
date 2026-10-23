import type { Metadata } from "next";
import "./globals.css";
import CommandPalette from "@/components/CommandPalette";

export const metadata: Metadata = {
  title: {
    default: "NEXUS | Production Platform",
    template: "%s | NEXUS Production Platform",
  },
  description: "High-performance production web application with autonomous deployment pipeline.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000")
  ),
  openGraph: {
    title: "NEXUS | Production Platform",
    description: "High-performance production web application with autonomous deployment pipeline.",
    siteName: "NEXUS Platform",
    images: [
      {
        url: "/api/og?title=NEXUS+Production+Platform&subtitle=High-performance+edge+architecture+and+analytics&tag=NEXUS",
        width: 1200,
        height: 630,
        alt: "NEXUS Production OpenGraph Card",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NEXUS | Production Platform",
    description: "High-performance production web application with autonomous deployment pipeline.",
    images: [
      "/api/og?title=NEXUS+Production+Platform&subtitle=High-performance+edge+architecture+and+analytics&tag=NEXUS",
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-neutral-950 text-neutral-100 antialiased selection:bg-emerald-500 selection:text-neutral-950 bg-ambient-radial">
        <CommandPalette />
        {children}
      </body>
    </html>
  );
}
