import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ReduxProvider } from "@/store/provider";
import MainShell from "@/components/MainShell";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "WATCHMIRROR - Stream Without Limits",
    template: "%s | WATCHMIRROR",
  },
  description:
    "Watch premium movies and web series online in HD. Stream without limits on WATCHMIRROR - your ultimate OTT streaming platform.",
  metadataBase: new URL(process.env.SITE_URL || "https://watchmirror.vercel.app"),
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
  },
  openGraph: {
    siteName: "WATCHMIRROR",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    site: "WATCHMIRROR",
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <meta name="theme-color" content="#050608" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="min-h-screen bg-[#050608] text-[#F9FAFB] antialiased font-sans">
        <ReduxProvider>
          <MainShell>{children}</MainShell>
        </ReduxProvider>
      </body>
    </html>
  );
}
