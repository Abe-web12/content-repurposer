import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "@/styles/globals.css";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: {
    default: "RepurposeAI - Turn Any Content Into Social Media Gold",
    template: "%s | RepurposeAI",
  },
  description:
    "AI-powered content repurposing tool. Turn YouTube videos, blog posts, and podcasts into LinkedIn posts, Twitter threads, and carousels in seconds.",
  keywords: [
    "content repurposing",
    "AI content generator",
    "LinkedIn post generator",
    "Twitter thread generator",
    "content marketing",
    "social media automation",
    "repurpose content",
    "AI writing tool",
  ],
  authors: [{ name: "RepurposeAI" }],
  creator: "RepurposeAI",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_APP_URL,
    title: "RepurposeAI - Turn Any Content Into Social Media Gold",
    description:
      "AI-powered content repurposing. YouTube, blogs, podcasts → LinkedIn, Twitter, carousels in seconds.",
    siteName: "RepurposeAI",
  },
  twitter: {
    card: "summary_large_image",
    title: "RepurposeAI - Turn Any Content Into Social Media Gold",
    description:
      "AI-powered content repurposing. YouTube, blogs, podcasts → LinkedIn, Twitter, carousels in seconds.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#6366f1",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jakarta.variable}`} suppressHydrationWarning>
      <body className="min-h-screen font-sans">
        {children}
        <Toaster />
      </body>
    </html>
  );
}